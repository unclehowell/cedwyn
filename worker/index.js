import ASSETS from './assets.js';
// Spill webapp backend (webapp 44 of 59, https://bucklerfamily.estate/spill/ -> cedwyn.bucklerfamily.estate/spill/).
// Serverless: one Cloudflare Worker (cedwyn-spill) + its own SQLite database (SQLite-backed Durable Object "cedwyn-spill").
// The page, llms.txt and protocol.json are built from branch section/spill like every Cedwyn webapp; this Worker answers
// /spill/api/* (submission, status, stats, MCP, guest book) and serves the branch copy of the page while the site build has not
// published it. Outside agents cannot reach HubSpot, so each accepted submission is stored here; a mirror step on the editors'
// side turns new items into HubSpot tasks "[SPILL] <short title> -> <target webapp>", and the spill processor adds checked items
// to the target webapp's database and re-releases that webapp's branch. Free plan only. - Cedwyn editors

const VERSION = '1.1.0';
const SITE = 'https://cedwyn.bucklerfamily.estate';
const DAY_CAP = 150;            // new items stored per UTC day (keeps writes under ~200/day)
const HOUR_CAP_SENDER = 30;     // items per sender per hour (in-memory, no writes)
const MAX_BODY = 32768;         // bytes per request
const MAX_ITEMS = 25;           // items per request
const TARGETS = ['catalogue','chronology','familytree','nomenclature','research','missing-records','book-register','wiki','wayback','maps','tithe-h3','estate','mr-wolf','forensic','dartboard','patagonia','documentary','directory','ebooks-errata','unsure'];
const SCOPE = /(williams|t[yŷ]\s?-?mawr|tymawr|great\s+house|llandough|llandochau|landoche|cedwyn|cedfin|cydfin|red\s+fen|leckwith|cogan|dochdwy|llandough-juxta|penarth|glamorgan|bp\s+properties|buckler)/i;
const NOT_CHECKED_LINES = [/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/, /(\+44\s?|\b0)(\d[\s-]?){9,10}\b/, /\b[A-Z]{2}\d{6}[A-D]\b/, /\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/];
const SECRET = /(api[_-]?key|access[_-]?token|bearer\s+[a-z0-9]|password\s*[:=]|passwd|secret\s*[:=]|private[_-]?key|\bsk-[a-z0-9]{10,}|\bghp_[a-z0-9]{10,}|\bAKIA[A-Z0-9]{12,}|-----BEGIN)/i;
const LONGTOKEN = /\b(?=[A-Za-z0-9_]*\d)(?=[A-Za-z0-9_]*[A-Za-z])[A-Za-z0-9_]{36,}\b/;
const PRODUCER = /\bsi[oô]n\s+(ap\s+)?buckler\b|\bhywel\s*ap\s*buckler\b/i;
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET, POST, OPTIONS', 'access-control-allow-headers': 'content-type, mcp-session-id' };
const json = (o, s) => new Response(JSON.stringify(o, null, 1), { status: s || 200, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...CORS } });
const norm = s => String(s || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/https?:\/\/(www\.)?/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
async function sha(s) { const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join(''); }
const clip = (s, n) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim().slice(0, n);
const today = () => new Date().toISOString().slice(0, 10);

function check(it) {
  // returns {ok, item} or {ok:false, error}
  if (!it || typeof it !== 'object') return { ok: false, error: 'each item must be a JSON object' };
  const fact = clip(it.fact || it.statement || it.text, 1500), title = clip(it.title, 120) || clip(fact, 90);
  const date = clip(it.date, 40), source = clip(it.source || it.citation, 600), url = clip(it.source_url || it.url, 500);
  const conv_at = clip(it.conversation_at || it.said_at, 40);
  const agent = clip(it.agent, 60), target = clip(it.target || it.target_webapp, 40).toLowerCase(), page = clip(it.target_page || it.page, 200);
  let conf = String(it.confidence == null ? '' : it.confidence).toLowerCase().trim();
  if (/^0?\.\d+$|^1(\.0+)?$/.test(conf)) { const f = parseFloat(conf); conf = f >= 0.8 ? 'high' : f >= 0.5 ? 'medium' : 'low'; }
  const miss = [];
  if (fact.length < 20) miss.push('fact (one specific statement, 20-1500 characters)');
  if (!date) miss.push('date (YYYY, YYYY-MM or YYYY-MM-DD; "c. 1890" or "1890s" allowed; "undated" if none)');
  if (!source && !url) miss.push('source (a citation) and/or source_url');
  if (!agent) miss.push('agent (your name and model, e.g. "ChatGPT (GPT-5)")');
  if (!['high', 'medium', 'low'].includes(conf)) miss.push('confidence (high | medium | low)');
  if (!/^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/.test(conv_at)) miss.push('conversation_at (ISO timestamp of the message in your conversation with the owner where this came up, e.g. 2026-11-02T02:48:00Z)');
  if (miss.length) return { ok: false, error: 'missing or invalid: ' + miss.join('; ') };
  if (!/^(undated|(c\.?\s*)?\d{3,4}(s|-\d{2}(-\d{2})?)?(\s*(-|–|to)\s*\d{3,4})?)$/i.test(date)) return { ok: false, error: 'date: use YYYY, YYYY-MM, YYYY-MM-DD, "c. YYYY", "YYYYs", a range "YYYY-YYYY", or "undated"' };
  if (url && !/^https?:\/\/[^\s]+$/i.test(url)) return { ok: false, error: 'source_url must be one http(s) address' };
  if (target && !TARGETS.includes(target)) return { ok: false, error: 'target must be one of: ' + TARGETS.join(', ') };
  const all = [fact, title, source, url, page].join(' ');
  if (!SCOPE.test(all)) return { ok: false, error: 'out of scope: the item must concern the Williams family, Tŷ Mawr / Great House Farm, Llandough or the Cedwyn estate (or one of their names); see /spill/protocol.json scope' };
  if (it.living_private_person === true || it.about_living_private_person === true) return { ok: false, error: 'items about living private people are not taken' };
  if (SECRET.test(all) || LONGTOKEN.test(all.replace(/https?:\/\/\S+/g, ''))) return { ok: false, error: 'the item looks like it carries a key, token or password; never send secrets' };
  if (NOT_CHECKED_LINES.some(r => r.test(all.replace(/https?:\/\/\S+/g, '')))) return { ok: false, error: 'the item carries personal contact details (an email address, phone number, national insurance number or full postcode); remove them' };
  if (PRODUCER.test(all)) return { ok: false, error: 'do not name the project\'s producer; describe the record itself' };
  return { ok: true, item: { title, fact, date, source, url, agent, conf, target: target || 'catalogue', page, conv_at } };
}

export class SpillDB {
  constructor(state, env) {
    this.state = state; this.env = env; this.sql = state.storage.sql; this.rate = new Map();
    this.sql.exec(`CREATE TABLE IF NOT EXISTS items(id INTEGER PRIMARY KEY AUTOINCREMENT, h TEXT UNIQUE, hf TEXT, at TEXT, day TEXT, title TEXT, fact TEXT, date TEXT, source TEXT, url TEXT, agent TEXT, conf TEXT, target TEXT, page TEXT, status TEXT DEFAULT 'new', hubspot_id TEXT, note TEXT, release TEXT, updated TEXT)`);
    for (const c of ['session TEXT', 'conv_at TEXT']) { try { this.sql.exec('ALTER TABLE items ADD COLUMN ' + c); } catch (_) {} }
    this.sql.exec(`CREATE TABLE IF NOT EXISTS marks(agent TEXT, session TEXT, last_spill_at TEXT, last_window_to TEXT, batches INTEGER, PRIMARY KEY(agent, session))`);
    this.sql.exec(`CREATE TABLE IF NOT EXISTS guestbook(id INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT, version TEXT, who TEXT, change TEXT, kind TEXT)`);
    const n = this.sql.exec(`SELECT COUNT(*) AS n FROM guestbook`).one().n;
    if (!n) this.sql.exec(`INSERT INTO guestbook(at,version,who,change,kind) VALUES (?,?,?,?,?)`, '2026-11-02T03:30:00Z', '1.0.0', 'Tab agent',
      'First version: the spill protocol (llms.txt, protocol.json), submission endpoint with dedupe, its own SQLite database, MCP and WebMCP tools, graphs and this guest book.', 'release');
  }
  sid(id) { return 'SP-' + String(id).padStart(5, '0'); }
  async fetch(req) {
    const u = new URL(req.url), p = u.pathname;
    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
    if (p === '/submit') return json(await this.submit(body.items || [], body.sender || 'anon', body.batch || {}));
    if (p === '/last_spill') { const a = clip(u.searchParams.get('agent'), 60); if (!a) return json({ error: 'agent required (session optional)' }, 400); return json(this.lastSpill(a, clip(u.searchParams.get('session') || u.searchParams.get('session_id'), 120))); }
    if (p === '/status') {
      const m = /^SP-?(\d+)$/i.exec(u.searchParams.get('id') || ''); if (!m) return json({ error: 'id like SP-00012' }, 400);
      const r = this.sql.exec(`SELECT id,at,date,target,status,release,updated FROM items WHERE id = ?`, parseInt(m[1], 10)).toArray()[0];
      return r ? json({ id: this.sid(r.id), received: r.at, date: r.date, target: r.target, status: r.status, release: r.release || null, updated: r.updated || null }) : json({ error: 'not found' }, 404);
    }
    if (p === '/similar') {
      const q = norm(u.searchParams.get('q') || ''); const words = q.split(' ').filter(w => w.length > 3).slice(0, 6);
      if (!words.length) return json({ hits: [] });
      const rows = this.sql.exec(`SELECT id,hf,date,target,status FROM items ORDER BY id DESC LIMIT 2000`).toArray()
        .map(r => ({ r, s: words.filter(w => r.hf.includes(w)).length })).filter(x => x.s >= Math.min(3, words.length)).sort((a, b) => b.s - a.s).slice(0, 10);
      return json({ hits: rows.map(x => ({ id: this.sid(x.r.id), date: x.r.date, target: x.r.target, status: x.r.status, matched_words: x.s })) });
    }
    if (p === '/stats') {
      const by = (col) => Object.fromEntries(this.sql.exec(`SELECT ${col} AS k, COUNT(*) AS n FROM items GROUP BY ${col}`).toArray().map(r => [r.k, r.n]));
      const days = this.sql.exec(`SELECT day, COUNT(*) AS n FROM items WHERE day >= ? GROUP BY day ORDER BY day`, new Date(Date.now() - 29 * 864e5).toISOString().slice(0, 10)).toArray();
      const decades = this.sql.exec(`SELECT substr(replace(replace(lower(date),'c. ',''),'c.',''),1,3) AS d, COUNT(*) AS n FROM items WHERE date <> 'undated' GROUP BY d ORDER BY d`).toArray().map(r => ({ decade: r.d + '0s', n: r.n }));
      const total = this.sql.exec(`SELECT COUNT(*) AS n FROM items`).one().n;
      return json({ webapp: 'spill', version: VERSION, total, by_status: by('status'), by_target: by('target'), by_confidence: by('conf'), per_day_30: days, by_decade: decades, today_stored: this.todayCount(), day_cap: DAY_CAP });
    }
    if (p === '/guestbook' && req.method === 'GET') return json({ webapp: 'spill', rows: this.sql.exec(`SELECT at,version,who,change,kind FROM guestbook ORDER BY id DESC LIMIT 100`).toArray() });
    if (p === '/guestbook' && req.method === 'POST') {
      const who = clip(body.who, 60), change = clip(body.change, 280), version = clip(body.version, 20) || VERSION;
      if (!who || change.length < 8) return json({ error: 'send {"who","change","version"}: who you are, what you changed in this webapp' }, 400);
      if (/https?:|www\./i.test(change) || SECRET.test(change) || PRODUCER.test(change)) return json({ error: 'plain text only: no links, secrets or names of the producer' }, 400);
      const c = this.sql.exec(`SELECT COUNT(*) AS n FROM guestbook WHERE at >= ?`, today()).one().n; if (c >= 20) return json({ error: 'the guest book takes 20 entries a day' }, 429);
      this.sql.exec(`INSERT INTO guestbook(at,version,who,change,kind) VALUES (?,?,?,?,?)`, new Date().toISOString(), version, who, change, 'agent');
      return json({ ok: true });
    }
    if (p === '/dbinfo') {
      const t = this.sql.exec(`SELECT name FROM sqlite_master WHERE type='table'`).toArray().map(r => r.name);
      return json({ database: 'cedwyn-spill (SQLite, Durable Object storage)', tables: t, items: this.sql.exec(`SELECT COUNT(*) AS n FROM items`).one().n, size_bytes: this.state.storage.sql.databaseSize });
    }
    // editors' side (mirror + processor): key required
    if (p.startsWith('/admin/')) {
      if (!this.env.SPILL_ADMIN_KEY || req.headers.get('x-spill-key') !== this.env.SPILL_ADMIN_KEY) return json({ error: 'forbidden' }, 403);
      if (p === '/admin/list') {
        const st = u.searchParams.get('status') || 'new', lim = Math.min(200, parseInt(u.searchParams.get('limit') || '50', 10) || 50);
        const rows = this.sql.exec(`SELECT * FROM items WHERE status = ? ORDER BY id LIMIT ?`, st, lim).toArray().map(r => ({ ...r, sid: this.sid(r.id), h: undefined, hf: undefined }));
        return json({ status: st, items: rows });
      }
      if (p === '/admin/mark') {
        const m = /^SP-?(\d+)$/i.exec(body.id || ''); if (!m) return json({ error: 'id' }, 400);
        const ok = ['new', 'queued', 'accepted', 'declined', 'released', 'duplicate'];
        if (body.status && !ok.includes(body.status)) return json({ error: 'status one of ' + ok.join(',') }, 400);
        this.sql.exec(`UPDATE items SET status = COALESCE(?, status), hubspot_id = COALESCE(?, hubspot_id), note = COALESCE(?, note), release = COALESCE(?, release), updated = ? WHERE id = ?`,
          body.status || null, body.hubspot_id || null, body.note ? clip(body.note, 500) : null, body.release ? clip(body.release, 200) : null, new Date().toISOString(), parseInt(m[1], 10));
        return json({ ok: true });
      }
      if (p === '/admin/delete') {
        const m = /^SP-?(\d+)$/i.exec(body.id || ''); if (!m) return json({ error: 'id' }, 400);
        this.sql.exec(`DELETE FROM items WHERE id = ?`, parseInt(m[1], 10)); return json({ ok: true, deleted: this.sid(m[1]) });
      }
      if (p === '/admin/delete_mark') { this.sql.exec(`DELETE FROM marks WHERE agent = ? AND session = ?`, clip(body.agent, 60), clip(body.session_id, 120)); return json({ ok: true }); }
      if (p === '/admin/guestbook') {
        this.sql.exec(`INSERT INTO guestbook(at,version,who,change,kind) VALUES (?,?,?,?,?)`, new Date().toISOString(), clip(body.version, 20) || VERSION, clip(body.who, 60) || 'Tab agent', clip(body.change, 400), clip(body.kind, 20) || 'release');
        return json({ ok: true });
      }
    }
    return json({ error: 'not found' }, 404);
  }
  todayCount() { return this.sql.exec(`SELECT COUNT(*) AS n FROM items WHERE day = ?`, today()).one().n; }
  batchCheck(b) {
    const agent = clip(b.agent, 60), session = clip(b.session_id, 120), wf = clip(b.window_from, 40), wt = clip(b.window_to, 40);
    const ts = /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/;
    const miss = [];
    if (!agent) miss.push('agent (your name and model)');
    if (!session) miss.push('session_id (your conversation/session id with the owner, or a stable name for it)');
    if (!(wf === 'start' || ts.test(wf))) miss.push('window_from (ISO timestamp of your previous spill, from spill_get_last_spill, or "start" for a first spill)');
    if (!ts.test(wt)) miss.push('window_to (ISO timestamp of the latest message you went through)');
    if (b.catalogue_checked !== true) miss.push('catalogue_checked: true (you searched the published catalogue for every item and send only new ones)');
    return miss.length ? { ok: false, error: 'batch fields missing or invalid: ' + miss.join('; ') } : { ok: true, agent, session, wf, wt };
  }
  lastSpill(agent, session) {
    const rows = session ? this.sql.exec(`SELECT * FROM marks WHERE agent = ? AND session = ?`, agent, session).toArray()
                         : this.sql.exec(`SELECT * FROM marks WHERE agent = ? ORDER BY last_spill_at DESC LIMIT 20`, agent).toArray();
    const r = rows[0];
    return { agent, session_id: session || null, first_spill: !r, last_spill_at: r ? r.last_spill_at : null, last_window_to: r ? r.last_window_to : null, batches: r ? r.batches : 0,
      start_from: r ? r.last_window_to : 'start', sessions: session ? undefined : rows.map(x => ({ session_id: x.session, last_spill_at: x.last_spill_at, last_window_to: x.last_window_to, batches: x.batches })),
      note: r ? 'Go through your conversation with the owner from start_from up to now.' : 'First spill for this agent/session: go through your whole conversation history with the owner.' };
  }
  async submit(items, sender, b) {
    b = b || {};
    const bc = this.batchCheck(b);
    if (!bc.ok) return { stored: 0, results: [{ result: 'rejected', error: bc.error }], protocol: '/spill/protocol.json' };
    items = items.map(x => (x && typeof x === 'object' && !x.agent) ? { ...x, agent: bc.agent } : x);
    const now = Date.now(), hr = Math.floor(now / 36e5), key = sender + ':' + hr;
    if (this.rate.size > 5000) this.rate.clear();
    const out = []; let stored = 0;
    for (const raw of items.slice(0, MAX_ITEMS)) {
      const c = check(raw);
      if (!c.ok) { out.push({ result: 'rejected', error: c.error, title: clip(raw && raw.title, 80) }); continue; }
      const it = c.item, hf = norm(it.fact);
      const h = await sha(hf + '|' + norm(it.date) + '|' + norm(it.url || it.source));
      const dup = this.sql.exec(`SELECT id,status FROM items WHERE h = ? OR hf = ? LIMIT 1`, h, hf).toArray()[0];
      if (dup) { out.push({ result: 'duplicate', id: this.sid(dup.id), status: dup.status, title: it.title }); continue; }
      const used = this.rate.get(key) || 0;
      if (used >= HOUR_CAP_SENDER) { out.push({ result: 'rate_limited', error: 'max ' + HOUR_CAP_SENDER + ' items per hour per sender; try next hour', title: it.title }); continue; }
      if (this.todayCount() >= DAY_CAP) { out.push({ result: 'day_full', error: 'today\'s intake is full (' + DAY_CAP + ' items); submit tomorrow (UTC)', title: it.title }); continue; }
      this.sql.exec(`INSERT INTO items(h,hf,at,day,title,fact,date,source,url,agent,conf,target,page,status,session,conv_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?, 'new',?,?)`,
        h, hf, new Date(now).toISOString(), today(), it.title, it.fact, it.date, it.source, it.url, it.agent, it.conf, it.target, it.page, bc.session, it.conv_at);
      const id = this.sql.exec(`SELECT last_insert_rowid() AS id`).one().id;
      this.rate.set(key, used + 1); stored++;
      out.push({ result: 'stored', id: this.sid(id), title: it.title, target: it.target, next: 'stored; becomes the HubSpot task "[SPILL] ' + it.title.slice(0, 90) + ' -> ' + it.target + '"; status: /spill/api/status?id=' + this.sid(id) });
    }
    if (items.length > MAX_ITEMS) out.push({ result: 'rejected', error: 'only the first ' + MAX_ITEMS + ' items of a request are read; send the rest in another request' });
    let mark = null;
    if (out.some(o => o.result === 'stored' || o.result === 'duplicate')) {
      this.sql.exec(`INSERT INTO marks(agent,session,last_spill_at,last_window_to,batches) VALUES (?,?,?,?,1) ON CONFLICT(agent,session) DO UPDATE SET last_spill_at = excluded.last_spill_at, last_window_to = excluded.last_window_to, batches = batches + 1`,
        bc.agent, bc.session, new Date(now).toISOString(), bc.wt);
      mark = { agent: bc.agent, session_id: bc.session, last_spill_at: new Date(now).toISOString(), last_window_to: bc.wt };
    }
    return { stored, results: out, watermark: mark, protocol: '/spill/protocol.json' };
  }
}

const DB = env => env.SPILL.get(env.SPILL.idFromName('main'));
const doFetch = (env, path, init) => DB(env).fetch('https://spill.internal' + path, init);
async function senderOf(req, env) { return (await sha((req.headers.get('cf-connecting-ip') || 'x') + '|' + (env.SPILL_ADMIN_KEY || 'salt') + '|' + new Date().toISOString().slice(0, 10))).slice(0, 16); }

async function checkPublished(q) {
  q = clip(q, 120); if (!q) return { error: 'q required' };
  const out = { q, catalogue: [], chronology_url: SITE + '/wayback/chronology/chronology.json', search_pages: [SITE + '/docs/', SITE + '/sitemap.xml', SITE + '/llms.txt'] };
  try {
    const r = await fetch(SITE + '/api/catalogue?limit=10&q=' + encodeURIComponent(q), { cf: { cacheTtl: 300 } });
    const j = await r.json(); out.catalogue_total = j.total; out.catalogue = (j.items || []).slice(0, 10).map(x => ({ id: x.id, kind: x.kind, title: x.title, date: x.date_display, page: x.page }));
  } catch (e) { out.catalogue_error = 'catalogue search did not answer'; }
  return out;
}

const ITEM = { type: 'object', properties: { title: { type: 'string' }, fact: { type: 'string', description: 'one fact on the subject matter or the case, as said in your conversation with the owner or as the record shows; no opinion' }, date: { type: 'string', description: 'date of the record or event (YYYY, YYYY-MM, YYYY-MM-DD, c. YYYY, YYYYs, YYYY-YYYY, undated)' }, conversation_at: { type: 'string', description: 'ISO timestamp of the message in your conversation with the owner where this came up' }, source: { type: 'string', description: 'citation: holder, title, reference, page; or the owner\'s statement in your session' }, source_url: { type: 'string' }, confidence: { type: 'string', enum: ['high', 'medium', 'low'] }, target: { type: 'string', enum: TARGETS, description: 'default catalogue (the master artifact/evidence catalogue)' }, target_page: { type: 'string' } }, required: ['fact', 'date', 'conversation_at', 'confidence'] };
const TOOLS = [
  { name: 'spill_protocol', description: 'The spill protocol: source window (your own conversation with the owner since your last spill), scope, item format, rules.', inputSchema: { type: 'object', properties: {} } },
  { name: 'spill_get_last_spill', description: 'Where to start: your previous spill time and window end for this agent and session (first spill: go through all history). Call this first.', inputSchema: { type: 'object', properties: { agent: { type: 'string' }, session_id: { type: 'string' } }, required: ['agent'] } },
  { name: 'get_last_spill', description: 'Alias of spill_get_last_spill.', inputSchema: { type: 'object', properties: { agent: { type: 'string' }, session_id: { type: 'string' } }, required: ['agent'] } },
  { name: 'spill_check_published', description: 'Search the published evidence catalogue (and earlier spills) before you submit; send only original or novel facts.', inputSchema: { type: 'object', properties: { q: { type: 'string', description: 'a few words: names, place, year, record type' } }, required: ['q'] } },
  { name: 'spill_submit', description: 'Submit up to 25 original facts from your own conversation with the owner (window_from..window_to) that the evidence catalogue does not hold: Williams family, Tŷ Mawr / Great House Farm, the Cedwyn estate, BP Properties v Buckler. Facts only; each with a source or citation, its date and the conversation timestamp.', inputSchema: { type: 'object', properties: { agent: { type: 'string' }, session_id: { type: 'string' }, window_from: { type: 'string', description: 'ISO timestamp from spill_get_last_spill, or "start"' }, window_to: { type: 'string', description: 'ISO timestamp of the latest message you went through' }, catalogue_checked: { type: 'boolean', description: 'true: you searched the catalogue for every item' }, items: { type: 'array', maxItems: 25, items: ITEM } }, required: ['agent', 'session_id', 'window_from', 'window_to', 'catalogue_checked', 'items'] } },
  { name: 'spill_status', description: 'Status of a submitted item (new, queued, accepted, declined, released, duplicate).', inputSchema: { type: 'object', properties: { id: { type: 'string', description: 'SP-00012' } }, required: ['id'] } },
  { name: 'spill_stats', description: 'Counts of spilled items by status, target, confidence, day and decade.', inputSchema: { type: 'object', properties: {} } },
  { name: 'spill_guestbook_read', description: 'The agent guest book: changes made to this webapp.', inputSchema: { type: 'object', properties: {} } },
  { name: 'spill_guestbook_sign', description: 'Log a change you made to this webapp (not a submission).', inputSchema: { type: 'object', properties: { who: { type: 'string' }, change: { type: 'string' }, version: { type: 'string' } }, required: ['who', 'change'] } },
];
async function runTool(env, req, name, a) {
  a = a || {};
  if (name === 'spill_protocol') return JSON.parse(ASSETS['protocol.json'].body);
  if (name === 'spill_check_published') { const c = await checkPublished(a.q); c.spilled = (await (await doFetch(env, '/similar?q=' + encodeURIComponent(clip(a.q, 120)))).json()).hits; return c; }
  if (name === 'spill_get_last_spill' || name === 'get_last_spill') return await (await doFetch(env, '/last_spill?agent=' + encodeURIComponent(a.agent || '') + '&session=' + encodeURIComponent(a.session_id || ''))).json();
  if (name === 'spill_submit') return await (await doFetch(env, '/submit', { method: 'POST', body: JSON.stringify({ items: Array.isArray(a.items) ? a.items : [], batch: { agent: a.agent, session_id: a.session_id, window_from: a.window_from, window_to: a.window_to, catalogue_checked: a.catalogue_checked }, sender: await senderOf(req, env) }) })).json();
  if (name === 'spill_status') return await (await doFetch(env, '/status?id=' + encodeURIComponent(a.id || ''))).json();
  if (name === 'spill_stats') return await (await doFetch(env, '/stats')).json();
  if (name === 'spill_guestbook_read') return await (await doFetch(env, '/guestbook')).json();
  if (name === 'spill_guestbook_sign') return await (await doFetch(env, '/guestbook', { method: 'POST', body: JSON.stringify(a) })).json();
  throw new Error('unknown tool ' + name);
}
async function mcp(env, req) {
  let m; try { m = await req.json(); } catch (_) { return { jsonrpc: '2.0', id: null, error: { code: -32700, message: 'parse error' } }; }
  const one = async (x) => {
    const id = x.id === undefined ? null : x.id;
    if (x.method === 'initialize') return { jsonrpc: '2.0', id, result: { protocolVersion: '2025-03-26', serverInfo: { name: 'cedwyn-spill', version: VERSION }, capabilities: { tools: {} }, instructions: 'Spill: from your own conversation with the owner since your last spill (spill_get_last_spill), submit original facts on the Williams family, Tŷ Mawr / Great House Farm, the Cedwyn estate and BP Properties v Buckler that the evidence catalogue does not hold. Call spill_protocol, spill_get_last_spill, spill_check_published per item, then spill_submit.' } };
    if (x.method === 'notifications/initialized' || (x.method || '').startsWith('notifications/')) return null;
    if (x.method === 'ping') return { jsonrpc: '2.0', id, result: {} };
    if (x.method === 'tools/list') return { jsonrpc: '2.0', id, result: { tools: TOOLS } };
    if (x.method === 'tools/call') {
      try { const r = await runTool(env, req, x.params && x.params.name, x.params && x.params.arguments); return { jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(r) }], structuredContent: r, isError: !!(r && r.error) } }; }
      catch (e) { return { jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: String(e.message || e) }], isError: true } }; }
    }
    return { jsonrpc: '2.0', id, error: { code: -32601, message: 'method not found' } };
  };
  if (Array.isArray(m)) { const r = (await Promise.all(m.map(one))).filter(Boolean); return r.length ? r : null; }
  return one(m);
}

export default {
  async fetch(req, env, ctx) {
    const u = new URL(req.url), p = u.pathname;
    // the apex (bucklerfamily.estate/spill...) forwards to the webapp's home on cedwyn, like every app (incl. /spill/llms.txt)
    if (u.hostname !== 'cedwyn.bucklerfamily.estate') return Response.redirect(SITE + p + u.search, 301);
    if (p === '/spill') return Response.redirect('https://' + u.hostname + '/spill/' + u.search, 301);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    const asset = (name, type) => new Response(ASSETS[name].body, { headers: { 'content-type': type, 'cache-control': 'public, max-age=300', ...CORS } });
    if (p === '/spill/llms.txt' || p === '/spill/api/llms.txt') return asset('llms.txt', 'text/plain; charset=utf-8');
    if (p === '/spill/protocol.json' || p === '/spill/api/protocol') return asset('protocol.json', 'application/json; charset=utf-8');
    if (p === '/spill/.well-known/mcp.json') return json({ name: 'cedwyn-spill', endpoint: SITE + '/spill/api/mcp', transport: 'streamable-http (JSON-RPC 2.0 over POST)', tools: TOOLS.map(t => t.name) });
    if (p.startsWith('/spill/api')) {
      const sub = p.slice('/spill/api'.length).replace(/\/+$/, '') || '/';
      if (sub === '/') return json({ webapp: 'spill', slot: '44 of 59', version: VERSION, page: SITE + '/spill/', protocol: SITE + '/spill/protocol.json', llms: SITE + '/spill/llms.txt',
        endpoints: { submit: 'POST /spill/api/submit {"items":[...]}', last_spill: 'GET /spill/api/last_spill?agent=...&session=...', check_published: 'GET /spill/api/check?q=...', status: 'GET /spill/api/status?id=SP-00001', stats: 'GET /spill/api/stats', mcp: 'POST /spill/api/mcp (JSON-RPC 2.0)', guestbook: 'GET/POST /spill/api/guestbook', db: 'GET /spill/api/db' },
        mcp_tools: TOOLS.map(t => t.name), database: 'cedwyn-spill (SQLite, Durable Object storage)' });
      if (sub === '/submit') {
        if (req.method !== 'POST') return json({ error: 'POST JSON {"items":[...]} (see /spill/protocol.json)' }, 405);
        const t = await req.text(); if (t.length > MAX_BODY) return json({ error: 'request too large (32 KB max); send fewer items' }, 413);
        let b; try { b = JSON.parse(t); } catch (_) { return json({ error: 'send JSON' }, 400); }
        const items = Array.isArray(b) ? b : Array.isArray(b.items) ? b.items : [b];
        const batch = Array.isArray(b) ? {} : { agent: b.agent, session_id: b.session_id, window_from: b.window_from, window_to: b.window_to, catalogue_checked: b.catalogue_checked };
        const d = await doFetch(env, '/submit', { method: 'POST', body: JSON.stringify({ items, batch, sender: await senderOf(req, env) }) });
        return json(await d.json(), d.status);
      }
      if (sub === '/check') { const c = await checkPublished(u.searchParams.get('q')); c.spilled = (await (await doFetch(env, '/similar' + u.search)).json()).hits; return json(c); }
      if (sub === '/status' || sub === '/stats' || sub === '/similar' || sub === '/last_spill') { const d = await doFetch(env, sub + u.search); return json(await d.json(), d.status); }
      if (sub === '/db') { const d = await doFetch(env, '/dbinfo'); return json(await d.json(), d.status); }
      if (sub === '/guestbook') { const d = await doFetch(env, '/guestbook', req.method === 'POST' ? { method: 'POST', body: await req.text() } : undefined); return json(await d.json(), d.status); }
      if (sub.startsWith('/admin/')) { const d = await doFetch(env, sub + u.search, { method: req.method, headers: { 'x-spill-key': req.headers.get('x-spill-key') || '' }, body: req.method === 'POST' ? await req.text() : undefined }); return json(await d.json(), d.status); }
      if (sub === '/mcp') {
        if (req.method === 'GET') return json({ name: 'cedwyn-spill', transport: 'JSON-RPC 2.0 over HTTP POST', methods: ['initialize', 'tools/list', 'tools/call'], tools: TOOLS });
        const r = await mcp(env, req); return r ? json(r) : new Response(null, { status: 202, headers: CORS });
      }
      return json({ error: 'not found', see: '/spill/api/' }, 404);
    }
    // the page: the site build serves it; until the build has published it, serve the branch copy bundled here
    const o = await fetch(req);
    if (o.status !== 404 || !ASSETS) return o;
    const rel = p.replace(/^\/spill\/?/, '') || 'index.html';
    const a = ASSETS[rel];
    if (!a) return o;
    return new Response(a.body, { headers: { 'content-type': a.type, 'cache-control': 'no-store', 'x-cedwyn-fallback': 'worker' } });
  },
};

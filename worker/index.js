// cedwyn-cms Worker — route cedwyn.bucklerfamily.estate/admin* (its own compartment; the static site is untouched).
// Login is checked here against a salted PBKDF2 hash held as a secret; sessions are HMAC-signed cookies; drafts and the
// publish queue live in KV; commits go through engine.js (direct with a GitHub token secret when one is set, otherwise
// the cedwyn-cms relay workflow in the repo drains the queue with the repo's own Actions token). — Sion's Tab agent
import * as E from './engine.js';
import PAGE from './admin.txt';
const SITE = 'https://cedwyn.bucklerfamily.estate';
const NOINDEX = { 'x-robots-tag': 'noindex, nofollow, noarchive', 'cache-control': 'no-store', 'referrer-policy': 'no-referrer', 'x-frame-options': 'DENY', 'x-content-type-options': 'nosniff' };
const json = (o, s = 200, h = {}) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json; charset=utf-8', ...NOINDEX, ...h } });
const te = new TextEncoder();
const hex = b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
async function hmac(key, msg) { const k = await crypto.subtle.importKey('raw', te.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']); return hex(await crypto.subtle.sign('HMAC', k, te.encode(msg))); }
function eq(a, b) { if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }
export async function pbkdf2(pass, saltHex, iter) {
  const k = await crypto.subtle.importKey('raw', te.encode(pass), 'PBKDF2', false, ['deriveBits']);
  const salt = new Uint8Array(saltHex.match(/../g).map(h => parseInt(h, 16)));
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: iter }, k, 256));
}
async function checkPass(env, pass) {   // CMS_PASS_HASH = pbkdf2$<iter>$<salthex>$<hashhex>
  const [kind, iter, salt, want] = String(env.CMS_PASS_HASH || '').split('$');
  if (kind !== 'pbkdf2' || !want) return false;
  return eq(await pbkdf2(String(pass || ''), salt, +iter), want);
}
async function makeSession(env, who) { const p = btoa(JSON.stringify({ who, exp: Date.now() + 7 * 864e5 })); return p + '.' + await hmac(env.CMS_SESSION_KEY, p); }
async function readSession(env, req) {
  const auth = req.headers.get('authorization') || '';
  if (auth.startsWith('Bearer ') && env.CMS_AGENT_KEY && eq(auth.slice(7), env.CMS_AGENT_KEY)) {
    const a = (req.headers.get('x-cms-agent') || 'Tab').replace(/[^\w .'-]/g, '').slice(0, 40) || 'Tab'; return { who: a, agent: true };
  }
  const m = (req.headers.get('cookie') || '').match(/(?:^|;\s*)cms_s=([^;]+)/); if (!m) return null;
  const [p, sig] = m[1].split('.'); if (!p || !sig || !eq(sig, await hmac(env.CMS_SESSION_KEY, p))) return null;
  try { const o = JSON.parse(atob(p)); return o.exp > Date.now() ? o : null; } catch { return null; }
}
const ipOf = req => req.headers.get('cf-connecting-ip') || 'x';
async function limited(env, req) {   // 5 wrong passwords per address per 15 min, 30 per hour overall
  const ip = ipOf(req); const a = +(await env.CMS.get('rl:' + ip) || 0), g = +(await env.CMS.get('rl:all') || 0);
  return a >= 5 || g >= 30;
}
async function failed(env, req) {
  const ip = ipOf(req); const a = +(await env.CMS.get('rl:' + ip) || 0), g = +(await env.CMS.get('rl:all') || 0);
  await env.CMS.put('rl:' + ip, String(a + 1), { expirationTtl: 900 }); await env.CMS.put('rl:all', String(g + 1), { expirationTtl: 3600 });
}
let _themes = null, _themesAt = 0, _heads = null, _headsAt = 0;
async function comps() {
  if (!_themes || Date.now() - _themesAt > 300e3) {
    const h = await heads(); const b = await E.rawAt(h.main, 'themes.json'); _themes = E.compartments(JSON.parse(E.unutf8(b))); _themesAt = Date.now();
  }
  return _themes;
}
async function heads(fresh) { if (fresh || !_heads || Date.now() - _headsAt > 15e3) { _heads = await E.heads(); _headsAt = Date.now(); } return _heads; }
async function ghToken(env) {
  if (env.GH_TOKEN) return env.GH_TOKEN;
  const t = await env.CMS.get('set:ghtoken'); if (!t) return null;
  try { return await unseal(env, t); } catch { return null; }
}
async function aesKey(env) { const d = await crypto.subtle.digest('SHA-256', te.encode('cms-token:' + env.CMS_SESSION_KEY)); return crypto.subtle.importKey('raw', d, 'AES-GCM', false, ['encrypt', 'decrypt']); }
async function seal(env, s) { const iv = crypto.getRandomValues(new Uint8Array(12)); const c = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await aesKey(env), te.encode(s)); return E.b64(iv) + '.' + E.b64(new Uint8Array(c)); }
async function unseal(env, s) { const [i, c] = s.split('.'); return new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: E.unb64(i) }, await aesKey(env), E.unb64(c))); }
const dkey = (who, cid) => `d:${who.toLowerCase()}:${cid}`;
async function getDraft(env, who, cid) { return JSON.parse(await env.CMS.get(dkey(who, cid)) || '{"files":{}}'); }
async function putDraft(env, who, cid, d) { if (Object.keys(d.files).length) await env.CMS.put(dkey(who, cid), JSON.stringify(d)); else await env.CMS.delete(dkey(who, cid)); }
async function listJobs(env, prefix, n = 20) { const l = await env.CMS.list({ prefix, limit: n }); const out = []; for (const k of l.keys) { const v = await env.CMS.get(k.name); if (v) out.push(JSON.parse(v)); } return out; }
const inv = () => String(9e15 - Date.now()).padStart(16, '0');   // newest first in KV list order
async function tree(env, c) {
  const h = await heads(); const sha = h[c.branch]; const tok = await ghToken(env);
  const cache = caches.default; const ck = new Request(`${SITE}/admin/__tree/${sha}`);
  let r = await cache.match(ck);
  if (!r) {
    r = await fetch(`https://api.github.com/repos/${E.REPO}/git/trees/${sha}?recursive=1`, { headers: { 'user-agent': 'cedwyn-cms', accept: 'application/vnd.github+json', ...(tok ? { authorization: 'Bearer ' + tok } : {}) } });
    if (!r.ok) return { rate_limited: r.status === 403 || r.status === 429, status: r.status, head: sha };
    r = new Response(await r.text(), { headers: { 'content-type': 'application/json', 'cache-control': 'max-age=86400' } }); await cache.put(ck, r.clone());
  }
  const t = await r.json();
  return { head: sha, truncated: !!t.truncated, files: (t.tree || []).filter(x => x.type === 'blob' && E.inCompartment(c, x.path)).map(x => ({ path: x.path, sha: x.sha, size: x.size })) };
}
async function finishJob(env, job, res) {
  job.status = res.ok ? (res.nothing ? 'nothing' : 'done') : (res.stale ? 'stale' : res.guards ? 'guard' : 'failed');
  job.result = { commit: res.commit, parent: res.parent, error: res.error, stale: res.stale, guards: res.guards, outside: res.outside }; job.finished = new Date().toISOString();
  const big = job.files; job.files = Object.fromEntries(Object.entries(big).map(([p, f]) => [p, { op: f.op, base_sha: f.base_sha }]));
  await env.CMS.put('job:' + job.key, JSON.stringify(job), { expirationTtl: 90 * 864e5 }); await env.CMS.delete('q:' + job.key);
  if (res.ok && res.commit) {
    const entry = { commit: res.commit, parent: res.parent, branch: job.compartment.branch, cid: job.compartment.id, files: res.files, author: job.author, summary: job.summary, at: job.finished, revert_of: job.revert_of || null };
    const key = 'log:' + inv(); entry.key = key;
    await env.CMS.put(key, JSON.stringify(entry), { expirationTtl: 365 * 864e5 });
    if (job.revert_key) { const v = JSON.parse(await env.CMS.get(job.revert_key) || 'null'); if (v) { v.reverted_by = res.commit; await env.CMS.put(job.revert_key, JSON.stringify(v), { expirationTtl: 365 * 864e5 }); } }
    if (!job.revert_of) { const d = await getDraft(env, job.author, job.compartment.id); for (const p of Object.keys(big)) { const f = d.files[p]; if (f && f.updated <= job.created_ms) delete d.files[p]; } await putDraft(env, job.author, job.compartment.id, d); }
  }
  return job;
}
async function enqueue(env, job, ctx) {
  job.key = inv() + '-' + Math.random().toString(36).slice(2, 7); job.status = 'queued'; job.created = new Date().toISOString(); job.created_ms = Date.now();
  await env.CMS.put('q:' + job.key, JSON.stringify(job), { expirationTtl: 30 * 864e5 });
  const tok = await ghToken(env);
  if (tok) {   // direct path: commit now, then ask the site build to run (theme branches don't trigger it on their own)
    const res = await E.commit(E.tokenGh(tok), job); await finishJob(env, job, res);
    if (res.ok && res.commit && !job.compartment.nobuild) ctx.waitUntil(E.tokenGh(tok)('POST', `/repos/${E.REPO}/actions/workflows/build.yml/dispatches`, { ref: 'main' }));
    return job;
  }
  return job;   // relay path: the cedwyn-cms workflow (every 5 min, or run on demand) picks it up
}
async function api(req, env, ctx, path) {
  const url = new URL(req.url); const m = req.method;
  if (path === 'login' && m === 'POST') {
    if (await limited(env, req)) return json({ error: 'Too many tries. Wait 15 minutes.' }, 429);
    const b = await req.json().catch(() => ({}));
    if (!(await checkPass(env, b.password))) { await failed(env, req); return json({ error: 'Wrong password.' }, 401); }
    return json({ ok: true, who: 'sion' }, 200, { 'set-cookie': `cms_s=${await makeSession(env, 'sion')}; Path=/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=604800` });
  }
  if (path === 'logout') return json({ ok: true }, 200, { 'set-cookie': 'cms_s=; Path=/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=0' });
  if (path.startsWith('relay/')) {   // the repo's relay workflow (holds CMS_RELAY_KEY as an Actions secret)
    if (!env.CMS_RELAY_KEY || !eq(req.headers.get('x-relay-key') || '', env.CMS_RELAY_KEY)) return json({ error: 'no' }, 403);
    if (path === 'relay/jobs') return json({ jobs: (await listJobs(env, 'q:', 10)).reverse() });
    if (path === 'relay/result' && m === 'POST') { const b = await req.json(); const raw = await env.CMS.get('q:' + b.key); if (!raw) return json({ error: 'unknown job' }, 404); return json({ job: await finishJob(env, JSON.parse(raw), b.result) }); }
    return json({ error: 'not found' }, 404);
  }
  const s = await readSession(env, req); if (!s) return json({ error: 'login' }, 401);
  if (m !== 'GET' && !s.agent) { const o = req.headers.get('origin'); if (o && o !== url.origin) return json({ error: 'origin' }, 403); }
  const who = s.who;
  if (path === 'me') return json({ who, direct: !!(await ghToken(env)), guard: E.GUARD, confirm: E.CONFIRM_WORDS });
  const cs = await comps(); const byId = id => cs.find(c => c.id === id);
  if (path === 'compartments') return json({ compartments: cs });
  if (path === 'tree') { const c = byId(url.searchParams.get('c')); if (!c || c.readonly) return json({ error: 'no such editable compartment' }, 404); return json({ compartment: c, ...(await tree(env, c)) }); }
  if (path === 'file') {
    const c = byId(url.searchParams.get('c')); const p = url.searchParams.get('path') || '';
    if (!E.inCompartment(c, p)) return json({ error: 'outside compartment' }, 400);
    const h = await heads(true); const b = await E.rawAt(h[c.branch], p);
    if (!b) return json({ path: p, head: h[c.branch], sha: null, exists: false, text: '' });
    const sha = await E.blobSha(b);
    return json(E.isText(p) ? { path: p, head: h[c.branch], sha, exists: true, text: E.unutf8(b), size: b.length } : { path: p, head: h[c.branch], sha, exists: true, binary: true, size: b.length, url: `https://raw.githubusercontent.com/${E.REPO}/${h[c.branch]}/${p.split('/').map(encodeURIComponent).join('/')}` });
  }
  if (path === 'drafts' && m === 'GET') {
    const c = url.searchParams.get('c'); const p = url.searchParams.get('path');
    if (c && p) { const d = await getDraft(env, who, c); return json({ file: d.files[p] || null }); }
    const l = await env.CMS.list({ prefix: `d:${who.toLowerCase()}:` }); const out = {};
    for (const k of l.keys) { const d = JSON.parse(await env.CMS.get(k.name) || '{"files":{}}'); out[k.name.split(':').slice(2).join(':')] = Object.fromEntries(Object.entries(d.files).map(([pp, f]) => [pp, { op: f.op, base_sha: f.base_sha, binary: f.b64 != null, size: f.text != null ? f.text.length : Math.round((f.b64 || '').length * 0.75), updated: f.updated }])); }
    return json({ who, drafts: out });
  }
  if (path === 'drafts' && m === 'PUT') {
    const b = await req.json(); const c = byId(b.c);
    if (!E.inCompartment(c, b.path)) return json({ error: 'outside the ' + (c ? c.id : '?') + ' compartment' }, 400);
    if (b.b64 && b.b64.length * 0.75 > 20e6) return json({ error: 'file too big (20 MB max here)' }, 413);
    const d = await getDraft(env, who, c.id);
    d.files[b.path] = { op: b.op === 'delete' ? 'delete' : 'put', base_sha: b.base_sha || null, updated: Date.now(), ...(b.op === 'delete' ? {} : b.b64 != null ? { b64: b.b64 } : { text: String(b.text ?? '') }) };
    await putDraft(env, who, c.id, d); return json({ ok: true, files: Object.keys(d.files).length });
  }
  if (path === 'drafts' && m === 'DELETE') {
    const c = url.searchParams.get('c'); const p = url.searchParams.get('path'); const d = await getDraft(env, who, c);
    if (p) delete d.files[p]; else d.files = {}; await putDraft(env, who, c, d); return json({ ok: true });
  }
  if (path === 'check' || path === 'publish') {
    const b = await req.json().catch(() => ({})); const c = byId(b.c); if (!c || c.readonly) return json({ error: 'no such compartment' }, 404);
    const d = await getDraft(env, who, c.id); if (!Object.keys(d.files).length) return json({ error: 'no drafts in ' + c.id }, 400);
    const job = { author: who, compartment: c, files: d.files, summary: String(b.summary || '').slice(0, 120), confirm: b.confirm, message: E.message(s.agent ? who : 'sion', b.summary) };
    const h = await heads(true); const ck = await E.check(job, h[c.branch]);
    const hard = ck.guards.filter(g => g.hard);
    const verdict = { head: h[c.branch], stale: ck.stale, guards: ck.guards, outside: ck.outside, needs_confirm: ck.guards.length > 0 && b.confirm !== E.CONFIRM_WORDS, refused: hard.length > 0 };
    if (path === 'check') return json(verdict);
    if (ck.outside.length || ck.stale.length || hard.length) return json({ error: 'refused', ...verdict }, 409);
    if (verdict.needs_confirm) return json({ error: `Type "${E.CONFIRM_WORDS}" to publish this`, ...verdict }, 412);
    const j = await enqueue(env, job, ctx); return json({ job: { key: j.key, status: j.status, result: j.result } });
  }
  if (path === 'jobs') return json({ queued: await listJobs(env, 'q:', 20), jobs: await listJobs(env, 'job:', 15), log: await listJobs(env, 'log:', 15) });
  if (path === 'revert' && m === 'POST') {
    const log = await listJobs(env, 'log:', 30); const last = log.find(x => !x.reverted_by && !x.revert_of);
    if (!last) return json({ error: 'no CMS commit to undo' }, 404);
    const b = await req.json().catch(() => ({})); if (b.commit && b.commit !== last.commit) return json({ error: 'the last CMS commit is ' + last.commit.slice(0, 7) + ', not ' + b.commit }, 409);
    const c = byId(last.cid); last.revert_by = s.agent ? who : 'Sion';
    const job = await E.revertJob(last, c); if (s.agent) job.message += " — Sion's Tab agent";
    Object.assign(job, { author: who, summary: 'undo ' + last.commit.slice(0, 7), revert_key: last.key });
    const h = await heads(true); const ck = await E.check(job, h[c.branch]);
    if (ck.stale.length) return json({ error: 'Those files changed after that publish, so an automatic undo would overwrite newer work.', stale: ck.stale }, 409);
    const j = await enqueue(env, job, ctx); return json({ job: { key: j.key, status: j.status, result: j.result }, reverting: last.commit });
  }
  if (path === 'settings/token' && !s.agent) {   // optional: a fine-grained GitHub token for instant publishing (stored sealed in KV)
    if (m === 'DELETE') { await env.CMS.delete('set:ghtoken'); return json({ ok: true }); }
    if (m === 'PUT') { const b = await req.json(); const t = String(b.token || '').trim(); if (!/^(github_pat_|ghp_)[A-Za-z0-9_]{20,}$/.test(t)) return json({ error: 'that does not look like a GitHub token' }, 400);
      const r = await E.tokenGh(t)('GET', `/repos/${E.REPO}`); if (r.status !== 200 || !r.body?.permissions?.push) return json({ error: 'token cannot push to ' + E.REPO }, 400);
      await env.CMS.put('set:ghtoken', await seal(env, t)); return json({ ok: true }); }
  }
  return json({ error: 'not found' }, 404);
}
export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    if (!url.pathname.startsWith('/admin')) return fetch(req);   // never answer for the public site
    if (url.pathname === '/admin') return Response.redirect(url.origin + '/admin/', 301);
    if (url.pathname.startsWith('/admin/api/')) {
      try { return await api(req, env, ctx, url.pathname.slice(11)); } catch (e) { return json({ error: 'server: ' + String(e && e.message || e).slice(0, 200) }, 500); }
    }
    if (url.pathname === '/admin/robots.txt') return new Response('User-agent: *\nDisallow: /admin/\n', { headers: { 'content-type': 'text/plain', ...NOINDEX } });
    return new Response(PAGE, { headers: { 'content-type': 'text/html; charset=utf-8', ...NOINDEX, 'content-security-policy': "default-src 'self'; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://api.github.com; frame-src 'self'; frame-ancestors 'none'" } });
  }
};

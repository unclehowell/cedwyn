// cedwyn-api — first-party services for cedwyn.bucklerfamily.estate (Phase 1, 27 Oct 2026). Sion's Tab agent.
// Routes: /api/member/family (family code, POST) · /api/a (analytics beacon, POST) · /api/a/summary (private JSON, X-Key) · /api/v (page versions)
//         /api/catalogue[/<ID>] (core DB, read-only) · /api/member (member check) · /learn/ (academy) · /learn/grades/[N/] + /learn/api/* (grades)
// Storage: D1 binding DB (cedwyn-apps; tables an_*, core_*, learn_*, v_cache). No cookies are set by analytics; no IP is stored.
const MAP = {"themes": {"records": {"b": "ghf-primary-records", "d": ""}, "docs": {"b": "docs", "d": "public"}, "wayback": {"b": "wayback", "d": "wayback"}, "nomenclature": {"b": "nomenclature", "d": "public"}, "maps": {"b": "maps", "d": "public"}, "infographic": {"b": "infographic", "d": "public"}, "wiki": {"b": "wiki", "d": "site"}, "ebooks": {"b": "ebooks", "d": "public"}, "story": {"b": "bpvsbuckler", "d": "static/bpvsbuckler/dist"}, "fb": {"b": "fb", "d": "site"}, "chess": {"b": "chess", "d": "public"}, "csscpsg": {"b": "csscpsg", "d": "public"}, "courtdrills": {"b": "courtdrills", "d": "public"}, "oldbill": {"b": "oldbill", "d": "public"}, "accounts": {"b": "accounts", "d": "public"}, "authorities": {"b": "ghf-public-authorities", "d": ""}, "wdtk": {"b": "whatdotheyknow", "d": "public"}, "review": {"b": "ghf-independent-review", "d": ""}, "qa": {"b": "qa", "d": ""}, "meeting": {"b": "2026-10-22", "d": "static/2026-10-22"}, "projects": {"b": "projects", "d": "projects/public"}, "watchtower": {"b": "watchtower", "d": "public"}, "fb2": {"b": "fb", "d": "site2"}, "emails": {"b": "emails", "d": "public"}, "directory": {"b": "directory", "d": "public"}, "shop": {"b": "merch", "d": "public"}, "movie": {"b": "cedwyn-movie", "d": "public"}, "kissed-frogs": {"b": "kissed-frogs", "d": "public"}, "nft-art": {"b": "nft-art", "d": "public"}, "whattheydontsay": {"b": "whattheydontsay", "d": "public"}, "blog": {"b": "blog", "d": "public"}, "app": {"b": "section/app", "d": ""}, "chat": {"b": "section/chat", "d": ""}, "cyberspace": {"b": "section/cyberspace", "d": ""}, "estate": {"b": "section/estate", "d": ""}, "fcg": {"b": "section/fcg", "d": ""}, "patagonia": {"b": "section/patagonia", "d": ""}, "research": {"b": "section/research", "d": ""}}, "paths": {"/": "estate", "/cedwyn/": "estate", "/patagonia/": "patagonia", "/wales/": "wales", "/cyberspace/": "cyberspace"}, "web": ["catalogue", "dartboard", "ebooks", "email", "fb2", "functions", "graphql", "research", "thousand-cuts", "values", "wayback"]};
const REPO = "unclehowell/cedwyn";
const ACADEMY_LINK = "https://buy.stripe.com/14AfZi5BNbiv5ecbEP6Zy0J";
const DOC_PATH = "/movie/";
const FIX = /^\s*(?:[\w./-]+:\s*)?(?:fix|fixes|fixed|hotfix|typo|typos|repair|repairs|repaired|correct|corrects|corrected|restore|restores|restored)\b|\btypos?\b/i;
const SUFFIX = /\s+[\u2014\u2013-]+\s*(?:Sion['\u2019]s\s+)?([A-Za-z][\w.+-]*(?:\s+[A-Za-z][\w.+-]*){0,2}?)\s+agent\s*$/i;
const J = (o, s = 200, h = {}) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*", "cache-control": "no-store", ...h } });
const enc = new TextEncoder();
async function sha(s) { const b = await crypto.subtle.digest("SHA-256", enc.encode(s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join(""); }
function day(ts) { return new Date(ts).toISOString().slice(0, 10); }

// --- UA classes (work/bizdev/skills/bot-traffic-human-visitor-count-cloudflare-ga4.md) ---
function uaClass(ua) {
  ua = ua || "";
  if (!ua) return "suspect";
  if (/Sion's Tab agent|HeadlessChrome|Playwright|Puppeteer|python-requests|python-urllib|aiohttp|curl\/|wget|node-fetch|undici|axios|Go-http-client|okhttp|ghf-fw/i.test(ua)) return "own_or_tool";
  if (/bot|crawl|spider|slurp|externalagent|externalhit|preview|archive\.org|ia_archiver|facebookexternal|embedly|whatsapp|telegram|discord|slack|lighthouse|pagespeed|monitor|uptime|feed|validator|scrap/i.test(ua)) return "bot";
  if (/Nexus 5X Build\/MMB29P/.test(ua)) return "suspect";
  let m = ua.match(/(?:iPhone|CPU) OS (\d+)_/); if (m && +m[1] <= 16) return "suspect";
  m = ua.match(/Android (\d+)/); if (m && +m[1] <= 9) return "suspect";
  m = ua.match(/Chrome\/(\d+)\./); if (m && +m[1] < 136) return "suspect";   // stable Chrome is 156 in Oct 2026: >20 behind
  if (/^Mozilla\/5\.0$/.test(ua.trim())) return "own_or_tool";
  return "human";
}
function refHost(r, host) {
  if (!r) return "direct";
  try { const h = new URL(r).hostname; return h === host ? "internal" : h.replace(/^www\./, ""); } catch (e) { return "other"; }
}

async function beacon(req, env, url) {
  let b = {};
  try { const t = await req.text(); b = JSON.parse(t.slice(0, 4000)); } catch (e) { b = {}; }
  const ua = req.headers.get("user-agent") || "";
  const ts = Date.now(), d = day(ts);
  const ip = req.headers.get("cf-connecting-ip") || "";
  const salt = await sha((env.SALT_A || "cedwyn") + "|" + d);           // daily salt: yesterday's ids cannot be linked to today's
  const sid = (await sha(salt + "|" + ip + "|" + ua)).slice(0, 16);
  let p = String(b.p || "").slice(0, 300); try { p = new URL(p, url.origin).pathname; } catch (e) { p = "/"; }
  const ev = /^(pv|checkout|academy|cta|ebook|doc)$/.test(b.e) ? b.e : "pv";
  const cls = (+b.d === 1) ? "own_or_tool" : uaClass(ua);
  const tgt = b.t ? String(b.t).slice(0, 200) : null;
  const country = (req.cf && req.cf.country) || null;
  await env.DB.prepare("INSERT INTO an_hits(ts,day,ev,path,ref_host,country,ua_class,sid,target,lang,vw) VALUES (?,?,?,?,?,?,?,?,?,?,?)")
    .bind(ts, d, ev, p, refHost(b.r, url.hostname), country, cls, sid, tgt, String(b.l || "").slice(0, 5) || null, Math.min(+b.w || 0, 10000) || null).run();
  return new Response(null, { status: 204, headers: { "access-control-allow-origin": "*" } });
}

async function summary(req, env, url) {
  const key = req.headers.get("x-key") || url.searchParams.get("key");
  if (!env.SUMMARY_KEY || key !== env.SUMMARY_KEY) return J({ error: "forbidden" }, 403);
  const days = Math.min(+(url.searchParams.get("days") || 7), 90);
  const since = day(Date.now() - (days - 1) * 864e5);
  const q = (sql, ...a) => env.DB.prepare(sql).bind(...a).all().then(r => r.results);
  const [byday, top, refs, ctry, clicks, tot] = await Promise.all([
    q("SELECT day, ua_class, COUNT(*) hits, COUNT(DISTINCT sid) sessions FROM an_hits WHERE day>=? AND ev='pv' GROUP BY day, ua_class ORDER BY day", since),
    q("SELECT path, COUNT(*) views, COUNT(DISTINCT sid) sessions FROM an_hits WHERE day>=? AND ev='pv' AND ua_class='human' GROUP BY path ORDER BY views DESC LIMIT 40", since),
    q("SELECT ref_host, COUNT(*) views FROM an_hits WHERE day>=? AND ev='pv' AND ua_class='human' GROUP BY ref_host ORDER BY views DESC LIMIT 30", since),
    q("SELECT country, COUNT(*) views, COUNT(DISTINCT sid) sessions FROM an_hits WHERE day>=? AND ev='pv' AND ua_class='human' GROUP BY country ORDER BY views DESC LIMIT 30", since),
    q("SELECT ev, target, path, ua_class, COUNT(*) n FROM an_hits WHERE day>=? AND ev<>'pv' GROUP BY ev, target, path, ua_class ORDER BY n DESC LIMIT 50", since),
    q("SELECT ua_class, COUNT(*) hits, COUNT(DISTINCT sid||day) sessions FROM an_hits WHERE day>=? AND ev='pv' GROUP BY ua_class", since)]);
  return J({ site: url.hostname, since, days, note: "page views from the first-party beacon (runs only where the page's script ran); ua_class per the bot-traffic rules; sessions = hashed daily ids (no cookies, no IP stored)", totals: tot, by_day: byday, top_paths_human: top, referrers_human: refs, countries_human: ctry, events: clicks });
}

// --- page versions: the last changes to the file a page is built from, with a link to its full history on GitHub ---
// P-099 (30 Oct 2026): pages with no file of their own used to fall through to {b:"main", p:""}, so their "Page versions"
// table listed the newest commits to the WHOLE repo. That candidate is gone: each page resolves to its own source (theme file,
// web/ file, the data file or tool that builds it, or the branch that holds it), the halves copies (/wales/<x>/, /argentina/<x>/)
// resolve to the page they copy, and a page with no source answers its own journal line instead of the repo-wide list.
["disproven", "parcels", "privacy", "self-assessment"].forEach(w => { if (!MAP.web.includes(w)) MAP.web.push(w); });
if (!MAP.themes.documentary) MAP.themes.documentary = { b: "cedwyn-movie", d: "public" };
if (!MAP.themes.familytree) MAP.themes.familytree = { b: "familytree", d: "public" };
const PAGE_SRC = {
  "/glossary/": [{ b: "main", p: "data/glossary.json" }],
  "/title-chain/": [{ b: "main", p: "data/title-chain.json" }, { b: "main", p: "tools/title_chain.py" }],
  "/caso/": [{ b: "main", p: "data/family-case.json" }, { b: "main", p: "tools/family_case.py" }],
  "/explore/": [{ b: "main", p: "tools/halves.py" }],
  "/guestbook/": [{ b: "main", p: "tools/guestbook" }, { b: "main", p: "tools/guestbook.py" }]
};
const BRANCH_PAGES = [[/^\/library(\/|$)/, "library"], [/^\/academy(\/|$)/, "agents"], [/^\/hive(\/|$)/, "hive"]];
function candidates(path, inner) {
  const segs = path.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
  const file = (base, rest) => { let r = rest.join("/"); if (!r || path.endsWith("/")) r = (r ? r + "/" : "") + "index.html"; return (base ? base.replace(/\/+$/, "") + "/" : "") + r; };
  const out = [];
  if (PAGE_SRC[path]) out.push(...PAGE_SRC[path]);
  for (const [re, b] of BRANCH_PAGES) if (re.test(path)) out.push({ b, p: "" });
  if (/^\/terrain(\/|$)/.test(path)) out.push({ b: "main", p: "web/_cedwyn/ghf/sites/terrain.json" });   // a frozen copy: its crawl record
  if (!inner && (segs[0] === "wales" || segs[0] === "argentina") && segs.length > 1) {   // a halves copy of another page
    out.push(...candidates("/" + segs.slice(1).join("/") + (path.endsWith("/") ? "/" : ""), true));
    out.push({ b: "main", p: "tools/halves.py" });
    return out;
  }
  let id = MAP.paths[path] || segs[0], rest = MAP.paths[path] ? [] : segs.slice(1);
  if (!segs.length) { id = MAP.paths["/"]; rest = []; }
  const t = id && MAP.themes[id];
  if ((id === "wales" || id === "argentina") && !rest.length) out.push({ b: "main", p: "sections.json" });
  if (t) { out.push({ b: t.b, p: file(t.d, rest) }); if (t.d || rest.length) out.push({ b: t.b, p: t.d || "" }); }
  if (segs.length && MAP.web.includes(segs[0])) { out.push({ b: "main", p: file("web", segs) }); out.push({ b: "main", p: "web/" + segs[0] }); }
  if (t && t.d && t.b !== "main") out.push({ b: t.b, p: "" });   // a theme whose built folder is not committed (e.g. docs): its own branch
  return out;   // never {b:"main", p:""}: that is the whole repo, not this page
}
function histUrl(c) { return "https://github.com/" + REPO + "/commits/" + c.b.split("/").map(encodeURIComponent).join("/") + (c.p ? "/" + c.p.split("/").map(encodeURIComponent).join("/") : ""); }
function rowsFrom(commits) {
  const cs = commits.slice().reverse(); let v = [1, 0, 0]; const rows = [];
  cs.forEach((c, i) => {
    const subj = (c.commit.message || "").split("\n")[0].trim(); const bot = /\[bot\]$|^github-actions|^cedwyn-bot$/i.test((c.commit.author || {}).name || "");
    const kind = bot ? "build" : (FIX.test(subj) ? "fix" : "change");
    if (i) v = kind === "change" ? [v[0], v[1] + 1, 0] : [v[0], v[1], v[2] + 1];
    let who = null, note = subj; const m = subj.match(SUFFIX);
    if (m) { who = m[1].trim(); note = subj.slice(0, m.index).trim(); if (/^(tab|sion's tab)$/i.test(who)) who = "Tab"; }
    if (!who) { const a = ((c.commit.author || {}).name || "").trim(); who = a && !a.includes("@") ? a : "unknown"; }
    const iso = (c.commit.committer || c.commit.author || {}).date || "";
    rows.push({ v: v.join("."), sha: c.sha, iso: iso.slice(0, 16) + "Z", date: iso ? iso.slice(8, 10) + "/" + iso.slice(5, 7) + "/" + iso.slice(0, 4) + " " + iso.slice(11, 16) + " GMT" : "", note, who, kind });
  });
  return rows.reverse();
}
// The academy pages (/learn/, /learn/welcome/) are served by this Worker, not built from a repo file: their versions are
// this page's own journal (LEARN_JOURNAL), never the repo-wide commit list (which the main-branch fallback below would give).
const LEARN_JOURNAL = [{"v": "1.2.0", "date": "30/10/2026", "note": "Grades added: seven graded questionnaires at /learn/grades/ (Grade 1 free preview; 90% pass unlocks the next grade; answers revealed after answering, with catalogue sources).", "who": "Tab", "kind": "change"}, {"v": "1.1.1", "date": "30/10/2026", "note": "One page journal; unrelated site entries removed.", "who": "Tab", "kind": "change"}, {"v": "1.1.0", "date": "30/10/2026", "note": "Family code entry added to the join card (family join free; the paid membership is unchanged); page set to the dark theme.", "who": "Tab", "kind": "change"}, {"v": "1.0.0", "date": "27/10/2026", "note": "Academy page created: course outline, key information, the two required ticks and member sign-in by checkout.", "who": "Tab", "kind": "change"}];
async function versions(req, env, url, ctx) {
  let path = url.searchParams.get("p") || "/"; try { path = new URL(path, url.origin).pathname; } catch (e) { path = "/"; }
  path = path.replace(/index\.html?$/, "");
  if (/^\/learn(\/|$)/.test(path)) return J({ path, source: { b: "cedwyn-api", p: "learn" }, history_url: null, count: LEARN_JOURNAL.length, version: LEARN_JOURNAL[0].v, rows: LEARN_JOURNAL, via: "page-journal" }, 200, { "cache-control": "public, max-age=600" });
  const cached = await env.DB.prepare("SELECT json, at FROM v_cache WHERE path=?").bind(path).first();
  if (cached && Date.now() - cached.at < 12 * 3600e3) { const co = JSON.parse(cached.json); if (!(co.source && co.source.b === "main" && !co.source.p) && (co.rows || []).length) return J(co, 200, { "cache-control": "public, max-age=1800" }); }
  const cands = candidates(path);
  let out = null, failed = false;
  for (const c of cands.slice(0, 5)) {
    const api = "https://api.github.com/repos/" + REPO + "/commits?per_page=100&sha=" + encodeURIComponent(c.b) + (c.p ? "&path=" + encodeURIComponent(c.p) : "");
    let r; try { r = await fetch(api, { headers: { "user-agent": "cedwyn-api (Sion's Tab agent)", accept: "application/vnd.github+json" }, cf: { cacheTtl: 3600 } }); } catch (e) { failed = true; break; }
    if (r.status !== 200) { failed = true; break; }
    const cs = await r.json(); if (!Array.isArray(cs) || !cs.length) continue;
    const rows = rowsFrom(cs).filter(x => x.kind !== "build");
    if (!rows.length) continue;   // only build-bot commits touch this file: try the next, wider source of the same page
    out = { path, source: c, history_url: histUrl(c), count: rows.length + (cs.length === 100 ? "+" : ""), version: rows[0] ? rows[0].v : "", rows: rows.slice(0, 5), via: "github" };
    break;
  }
  if (!out) {   // no commit list for this page: its own journal lines (data/journal/pages.json), never the site-wide log
    const c = cands[0] || null;
    out = { path, source: c, history_url: c ? histUrl(c) : null, count: null, version: "", rows: [], via: failed ? "unavailable" : "no-page-file" };
    try {
      const pj = await (await fetch("https://raw.githubusercontent.com/" + REPO + "/main/data/journal/pages.json", { cf: { cacheTtl: 600 } })).json();
      const es = ((pj && pj.pages) || {})[path] || [];
      out.rows = es.slice(0, 5).map(e => ({ v: String(e.v || "\u2014"), sha: "", iso: "", date: String(e.date || ""), note: String(e.note || ""), who: "Tab", kind: "change" }));
      if (out.rows.length) { out.via = "page-journal"; out.version = out.rows[0].v; }
    } catch (e) {}
    if (!out.rows.length) out.rows = [{ v: "\u2014", sha: "", iso: "", date: "", who: "\u2014", kind: "change",
      note: failed ? "This page\u2019s change list could not be read just now; it shows again on the next visit." : "No change has been recorded for this page yet." }];
    return J(out, 200, { "cache-control": "public, max-age=600" });
  }
  ctx.waitUntil(env.DB.prepare("INSERT OR REPLACE INTO v_cache(path,json,at) VALUES (?,?,?)").bind(path, JSON.stringify(out), Date.now()).run());
  return J(out, 200, { "cache-control": "public, max-age=1800" });
}

// --- core DB (read-only, public rows only) ---
const PUB = "id,kind,alias,title,date_display,date_sort,status,holder,body,summary,page,data,updated,rev";
function row(r) { if (r && r.data) { try { r.data = JSON.parse(r.data); } catch (e) {} } return r; }
async function catalogue(req, env, url) {
  const m = url.pathname.match(/^\/api\/catalogue\/([A-Za-z0-9._-]+)\/?$/);
  if (m) {
    const id = m[1].toUpperCase().startsWith("GHF-") ? null : m[1];
    const r = id ? await env.DB.prepare("SELECT " + PUB + " FROM core_items WHERE id=? AND public=1").bind(id).first()
                 : await env.DB.prepare("SELECT " + PUB + " FROM core_items WHERE alias=? AND public=1").bind(m[1]).first();
    if (!r) return J({ error: "not found" }, 404);
    const links = (await env.DB.prepare("SELECT l.src, l.dst, l.rel FROM core_links l LEFT JOIN core_items a ON a.id=l.src LEFT JOIN core_items b ON b.id=l.dst WHERE (l.src=? OR l.dst=?) AND COALESCE(a.public,1)=1 AND COALESCE(b.public,1)=1").bind(r.id, r.id).all()).results;
    return J({ item: row(r), links }, 200, { "cache-control": "public, max-age=300" });
  }
  const kind = url.searchParams.get("kind"), qq = url.searchParams.get("q");
  const lim = Math.min(+(url.searchParams.get("limit") || 50), 500), off = Math.max(+(url.searchParams.get("offset") || 0), 0);
  let w = "public=1", a = [];
  if (kind) { w += " AND kind=?"; a.push(kind); }
  if (qq) { w += " AND (title LIKE ? OR id LIKE ? OR alias LIKE ?)"; a.push("%" + qq + "%", qq + "%", qq + "%"); }
  const [cnt, items, kinds] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) n FROM core_items WHERE " + w).bind(...a).first(),
    env.DB.prepare("SELECT " + PUB + " FROM core_items WHERE " + w + " ORDER BY kind, date_sort LIMIT ? OFFSET ?").bind(...a, lim, off).all(),
    env.DB.prepare("SELECT kind, COUNT(*) n FROM core_items WHERE public=1 GROUP BY kind").all()]);
  return J({ db: "cedwyn core catalogue (phase 1)", kinds: kinds.results, total: cnt.n, limit: lim, offset: off, items: items.results.map(row) }, 200, { "cache-control": "public, max-age=300" });
}

// --- membership: a £49.99/month subscription (Academy, or the Case Office plan) makes a browser a member ---
// Stripe -> /api/member/stripe (signed webhook) records the checkout session and the subscription's status.
// The checkout's success page /learn/welcome/?s=<session> sets a signed first-party cookie (no password, nothing else stored
// in the browser); /api/member answers {member:true} while that subscription is active. Sign-in on another device by email
// link is the next step (work/cedwyn-arch/CORE-DB.md, Academy).
const PLINKS = { "plink_1UV6PpJRNz20guqBItjOb6Ey": "academy-monthly", "plink_1USiRUJRNz20guqB7Wt9kQ4j": "case-office-monthly" };
const PRICES = { "price_1UV6PlJRNz20guqBGhffGNm8": "academy-monthly", "price_1USiRQJRNz20guqBdiwm08Um": "case-office-monthly" };
async function hmac(key, msg) { const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]); return [...new Uint8Array(await crypto.subtle.sign("HMAC", k, enc.encode(msg)))].map(x => x.toString(16).padStart(2, "0")).join(""); }
function eq(a, b) { if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }
async function stripeHook(req, env) {
  if (!env.STRIPE_WHSEC) return J({ error: "not configured" }, 503);
  const raw = await req.text(), sig = req.headers.get("stripe-signature") || "";
  const t = (sig.match(/t=(\d+)/) || [])[1], v1s = [...sig.matchAll(/v1=([0-9a-f]+)/g)].map(m => m[1]);
  if (!t || !v1s.length || Math.abs(Date.now() / 1000 - +t) > 600) return J({ error: "bad signature" }, 400);
  const want = await hmac(env.STRIPE_WHSEC, t + "." + raw);
  if (!v1s.some(v => eq(v, want))) return J({ error: "bad signature" }, 400);
  const ev = JSON.parse(raw), o = (ev.data || {}).object || {}, now = new Date().toISOString();
  if (ev.type === "checkout.session.completed" && (PLINKS[o.payment_link] || o.mode === "subscription")) {
    const plan = PLINKS[o.payment_link] || "subscription";
    const email = ((o.customer_details || {}).email || "").trim().toLowerCase();
    await env.DB.batch([
      env.DB.prepare("INSERT OR REPLACE INTO learn_sessions(cs,customer,plink,at) VALUES (?,?,?,?)").bind(o.id, o.customer || null, o.payment_link || null, now),
      env.DB.prepare("INSERT INTO learn_members(email_hash,stripe_customer,status,plan,source,updated,sub) VALUES (?,?,?,?,?,?,?) ON CONFLICT(stripe_customer) DO UPDATE SET status=excluded.status, plan=excluded.plan, updated=excluded.updated, sub=excluded.sub, email_hash=COALESCE(excluded.email_hash, learn_members.email_hash)")
        .bind(email ? await sha("cedwyn-member|" + email) : null, o.customer || o.id, "active", plan, "checkout:" + o.id, now, o.subscription || null)]);
  } else if (/^customer\.subscription\.(created|updated|deleted)$/.test(ev.type)) {
    const item = ((o.items || {}).data || [])[0] || {}, plan = PRICES[(item.price || {}).id];
    if (plan) {
      const end = o.current_period_end || item.current_period_end || null;
      const status = ev.type.endsWith("deleted") ? "canceled" : o.status;
      await env.DB.prepare("INSERT INTO learn_members(stripe_customer,status,plan,period_end,source,updated,sub) VALUES (?,?,?,?,?,?,?) ON CONFLICT(stripe_customer) DO UPDATE SET status=excluded.status, plan=excluded.plan, period_end=excluded.period_end, updated=excluded.updated, sub=excluded.sub")
        .bind(o.customer, status, plan, end, "subscription:" + o.id, now, o.id).run();
    }
  }
  return J({ received: true });
}

// With a restricted Stripe key saved as the Worker secret STRIPE_KEY (read: Checkout Sessions, Subscriptions), a checkout is
// confirmed at once; without it, work/cedwyn-arch/tools/member_sync.py (connected Stripe, run on a schedule) fills the same tables.
async function stripeGet(env, path) { const r = await fetch("https://api.stripe.com/v1/" + path, { headers: { authorization: "Bearer " + env.STRIPE_KEY } }); return r.ok ? r.json() : null; }
async function verifyCs(cs, env) {
  if (!env.STRIPE_KEY) return false;
  const s = await stripeGet(env, "checkout/sessions/" + encodeURIComponent(cs) + "?expand[]=subscription"); if (!s || s.status !== "complete") return false;
  const sub = s.subscription && typeof s.subscription === "object" ? s.subscription : null, item = sub && ((sub.items || {}).data || [])[0];
  const plan = PLINKS[s.payment_link] || (item && PRICES[(item.price || {}).id]); if (!plan || !sub) return false;
  const email = ((s.customer_details || {}).email || "").trim().toLowerCase(), now = new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare("INSERT OR REPLACE INTO learn_sessions(cs,customer,plink,at) VALUES (?,?,?,?)").bind(cs, s.customer, s.payment_link || null, now),
    env.DB.prepare("INSERT INTO learn_members(email_hash,stripe_customer,status,plan,period_end,source,updated,sub) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(stripe_customer) DO UPDATE SET status=excluded.status, plan=excluded.plan, period_end=excluded.period_end, updated=excluded.updated, sub=excluded.sub")
      .bind(email ? await sha("cedwyn-member|" + email) : null, s.customer, sub.status, plan, sub.current_period_end || (item || {}).current_period_end || null, "checkout:" + cs, now, sub.id)]);
  return true;
}
function cookie(req, name) { const m = (req.headers.get("cookie") || "").match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)")); return m ? decodeURIComponent(m[1]) : null; }
async function memberOf(req, env) {
  const c = cookie(req, "cedwyn_m"); if (!c || !env.MEMBER_KEY) return null;
  const [cs, exp, sig] = c.split("."); if (!cs || !exp || !sig || +exp < Date.now() / 1000) return null;
  if (!eq(sig, await hmac(env.MEMBER_KEY, cs + "." + exp))) return null;
  if (/^fam\d+$/.test(cs)) { const f = await env.DB.prepare("SELECT honour FROM learn_family_codes WHERE id = ?").bind(+cs.slice(3)).first(); return f && f.honour === 1 ? { member: true, plan: "family" } : { member: false, status: "revoked" }; }
  const Q = () => env.DB.prepare("SELECT m.status, m.plan, m.period_end, m.updated FROM learn_sessions s JOIN learn_members m ON m.stripe_customer = s.customer WHERE s.cs=?").bind(cs).first();
  let r = await Q();
  if ((!r || Date.now() - Date.parse(r.updated) > 864e5) && await verifyCs(cs, env)) r = await Q();
  if (!r) return { pending: true };
  const ok = /^(active|trialing|past_due)$/.test(r.status) && (!r.period_end || r.period_end > Date.now() / 1000 - 3 * 86400);
  return ok ? { member: true, plan: r.plan } : { member: false, status: r.status };
}
// --- family code (30 Oct 2026): a family member joins free with a family code instead of paying. Codes are stored only as
// SHA-256("cedwyn-family|" + code) in D1 learn_family_codes; redeem = 1 lets the code be used, honour = 1 keeps browsers that
// used it signed in. Each redemption is one row in learn_family_redemptions (time + code id, nothing personal), kept apart from
// learn_members so it is never counted as a sale. Tries are limited per visitor (salted hash of the address, never stored plain).
// Rotation and revocation: work/cedwyn-arch/FAMILY-CODE.md.
const FALPHA = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
function famNorm(c) { const s = String(c || "").toUpperCase().replace(/[^0-9A-Z]/g, "").replace(/^CEDWYNFAMILY/, ""); if (s.length !== 12 || [...s].some(ch => FALPHA.indexOf(ch) < 0)) return null; return "CEDWYN-FAMILY-" + s.slice(0, 4) + "-" + s.slice(4, 8) + "-" + s.slice(8); }
async function famLimited(env, req, max) {
  const ip = req.headers.get("cf-connecting-ip") || "0", win = Math.floor(Date.now() / 600000), k = (await sha("fam|" + (env.SALT_A || "") + "|" + win + "|" + ip)).slice(0, 32);
  const r = await env.DB.prepare("INSERT INTO learn_family_tries(k,n,t) VALUES(?,1,?) ON CONFLICT(k) DO UPDATE SET n=n+1 RETURNING n").bind(k, win).first();
  if (Math.random() < 0.05) await env.DB.prepare("DELETE FROM learn_family_tries WHERE t < ?").bind(win - 6).run();
  return r && r.n > max;
}
async function familyRedeem(req, env) {
  if (!env.MEMBER_KEY) return J({ ok: false, error: "unavailable" }, 503);
  let b = {}; try { b = JSON.parse((await req.text()).slice(0, 2000)); } catch (e) { b = {}; }
  if (await famLimited(env, req, 8)) return J({ ok: false, error: "slow_down" }, 429);
  const code = famNorm(b.code); if (!code) return J({ ok: false, error: "invalid" });
  const row = await env.DB.prepare("SELECT id FROM learn_family_codes WHERE code_hash = ? AND redeem = 1 AND honour = 1").bind(await sha("cedwyn-family|" + code)).first();
  if (!row) return J({ ok: false, error: "invalid" });
  const now = new Date().toISOString(), exp = Math.floor(Date.now() / 1000) + 400 * 86400, v = "fam" + row.id;
  await env.DB.batch([
    env.DB.prepare("INSERT INTO learn_family_redemptions(at, code_id) VALUES (?, ?)").bind(now, row.id),
    env.DB.prepare("UPDATE learn_family_codes SET uses = uses + 1, last_used = ? WHERE id = ?").bind(now, row.id)]);
  return J({ ok: true, member: true, plan: "family" }, 200, { "set-cookie": "cedwyn_m=" + v + "." + exp + "." + (await hmac(env.MEMBER_KEY, v + "." + exp)) + "; Path=/; Max-Age=" + 400 * 86400 + "; Secure; HttpOnly; SameSite=Lax" });
}
async function member(req, env) {
  const m = await memberOf(req, env);
  if (m && m.member) return J({ member: true, plan: m.plan });
  if (m && m.pending) return J({ member: false, pending: true, reason: "membership is being confirmed", join: "/learn/" });
  return J({ member: false, join: "/learn/" });
}
async function welcome(req, env, url) {
  const s = (url.searchParams.get("s") || "").slice(0, 200);
  const h = { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" };
  if (/^cs_(live|test)_[A-Za-z0-9]+$/.test(s) && env.MEMBER_KEY) {
    const exp = Math.floor(Date.now() / 1000) + 400 * 86400;
    h["set-cookie"] = "cedwyn_m=" + s + "." + exp + "." + (await hmac(env.MEMBER_KEY, s + "." + exp)) + "; Path=/; Max-Age=" + 400 * 86400 + "; Secure; HttpOnly; SameSite=Lax";
  }
  return new Response(SHELL.replace("__BODY__", WELCOME), { headers: h });
}
function page(body) { return new Response(SHELL.replace("__BODY__", body), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300" } }); }

function page2(body, title, canon) { return new Response(SHELL.replace("__BODY__", body).replace(/<title>[^<]*<\/title>/, "<title>" + title + "</title>").replace('href="https://cedwyn.bucklerfamily.estate/learn/"', 'href="https://cedwyn.bucklerfamily.estate' + canon + '"'), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300" } }); }

// --- Academy grades (30 Oct 2026, task 18baf467): a grade ladder of questionnaires. The question bank is the academy's own
// derived database, D1 learn_quiz (loaded from work/cedwyn-arch/academy/grades.json by tools/academy_load.py, which checks every
// cited catalogue ID against core_items / the evidence index). Progress per browser learner (signed cookie cedwyn_l) in
// learn_progress. Grade 1 is a free preview; grades 2+ need a membership (paid or family code) AND a pass of the grade below.
// A question's answer, explanation and source are sent only after that question has been answered (answers lock).
const PASS_PCT = 90;
let QZ = null, QZT = 0;
async function quiz(env) {
  if (QZ && Date.now() - QZT < 300000) return QZ;
  const r = await env.DB.prepare("SELECT grade, title, blurb, free, qs, version FROM learn_quiz ORDER BY grade").all();
  QZ = (r.results || []).map(g => ({ n: g.grade, title: g.title, blurb: g.blurb, free: g.free === 1, qs: JSON.parse(g.qs), version: g.version })); QZT = Date.now();
  return QZ;
}
const need = t => Math.ceil(t * PASS_PCT / 100);
async function learner(req, env) {
  const c = cookie(req, "cedwyn_l");
  if (c && env.MEMBER_KEY) { const [id, sig] = c.split("."); if (/^L[0-9a-f]{24}$/.test(id || "") && sig && eq(sig, await hmac(env.MEMBER_KEY, "learner|" + id))) return { id, set: null }; }
  const id = "L" + [...crypto.getRandomValues(new Uint8Array(12))].map(x => x.toString(16).padStart(2, "0")).join("");
  const v = id + "." + (await hmac(env.MEMBER_KEY || "cedwyn", "learner|" + id));
  return { id, set: "cedwyn_l=" + v + "; Path=/learn/; Max-Age=" + 400 * 86400 + "; Secure; HttpOnly; SameSite=Lax" };
}
async function gstate(req, env) {
  const [L, m, Z] = await Promise.all([learner(req, env), memberOf(req, env), quiz(env)]);
  const rows = (await env.DB.prepare("SELECT grade, attempt, answers, answered, correct, total, passed, best_pct FROM learn_progress WHERE learner = ?").bind(L.id).all()).results || [];
  const P = {}; rows.forEach(r => { P[r.grade] = r; });
  const mem = !!(m && m.member);
  let prevPassed = true;
  const grades = Z.map(g => {
    const p = P[g.n] || {}, total = g.qs.length;
    const unlocked = g.free || g.n === 1 ? true : (mem && prevPassed);
    const why = unlocked ? null : (!mem ? "join" : "prev");
    const o = { n: g.n, title: g.title, blurb: g.blurb, free: g.free, total, need: need(total), unlocked, why, answered: p.answered || 0, correct: p.correct || 0, passed: p.passed === 1, best_pct: p.best_pct || 0, attempt: p.attempt || 1 };
    prevPassed = o.passed; return o;
  });
  return { L, m, mem, Z, P, grades, plan: mem ? m.plan : null };
}
function reveal(q, choice) { return { choice, correct: choice === q.a, a: q.a, x: q.x, v: q.v, vr: q.vr, s: q.s, case: !!q.case, open: !!q.open }; }
function JC(o, s, L) { return J(o, s || 200, L && L.set ? { "set-cookie": L.set } : {}); }
async function learnApi(req, env, url) {
  const p = url.pathname.replace(/^\/learn\/api\//, "").replace(/\/$/, "");
  const S = await gstate(req, env);
  if (p === "state") return JC({ member: S.mem, plan: S.plan, pass_pct: PASS_PCT, grades: S.grades }, 200, S.L);
  let gm = p.match(/^grade\/(\d{1,2})$/);
  if (gm && req.method === "GET") {
    const n = +gm[1], g = S.Z.find(x => x.n === n), st = S.grades.find(x => x.n === n);
    if (!g) return JC({ error: "not found" }, 404, S.L);
    if (!st.unlocked) return JC({ locked: true, why: st.why, n, title: g.title, blurb: g.blurb, total: g.qs.length }, 200, S.L);
    const ans = JSON.parse((S.P[n] || {}).answers || "{}"), R = {};
    g.qs.forEach(q => { if (q.id in ans) R[q.id] = reveal(q, ans[q.id]); });
    const nx = S.grades.find(x => x.n === n + 1);
    return JC({ n, title: g.title, blurb: g.blurb, free: g.free, pass_pct: PASS_PCT, state: st, next: nx ? { n: nx.n, title: nx.title, needs_join: !S.mem } : null, qs: g.qs.map(q => ({ id: q.id, q: q.q, o: q.o, open: !!q.open })), answers: R }, 200, S.L);
  }
  if ((p === "answer" || p === "retake") && req.method === "POST") {
    let b = {}; try { b = JSON.parse((await req.text()).slice(0, 2000)); } catch (e) { b = {}; }
    const n = +b.grade, g = S.Z.find(x => x.n === n), st = S.grades.find(x => x.n === n);
    if (!g) return JC({ error: "not found" }, 404, S.L);
    if (!st.unlocked) return JC({ locked: true, why: st.why }, 403, S.L);
    const row = S.P[n] || null, ans = JSON.parse((row || {}).answers || "{}"), now = new Date().toISOString(), total = g.qs.length;
    const principal = S.m && S.m.member ? (S.m.plan === "family" ? "family" : "member") : "preview";
    if (p === "retake") {
      if (!row) return JC({ ok: true, state: st }, 200, S.L);
      await env.DB.prepare("UPDATE learn_progress SET attempt = attempt + 1, answers = '{}', answered = 0, correct = 0, updated = ? WHERE learner = ? AND grade = ?").bind(now, S.L.id, n).run();
      return JC({ ok: true }, 200, S.L);
    }
    const q = g.qs.find(x => x.id === String(b.id || "")), c = +b.choice;
    if (!q || !(c >= 0 && c < q.o.length)) return JC({ error: "bad request" }, 400, S.L);
    if (!(q.id in ans)) ans[q.id] = c;
    const answered = Object.keys(ans).filter(k => g.qs.some(x => x.id === k)).length;
    const correct = g.qs.filter(x => x.id in ans && ans[x.id] === x.a).length;
    const done = answered >= total, pct = Math.round(100 * correct / total), passNow = done && correct >= need(total);
    const passed = (row && row.passed === 1) || passNow ? 1 : 0, best = done ? Math.max(pct, (row && row.best_pct) || 0) : ((row && row.best_pct) || 0);
    await env.DB.prepare("INSERT INTO learn_progress(learner, grade, attempt, answers, answered, correct, total, passed, best_pct, passed_at, principal, updated) VALUES (?,?,?,?,?,?,?,?,?,?,?,?) " +
      "ON CONFLICT(learner, grade) DO UPDATE SET answers = excluded.answers, answered = excluded.answered, correct = excluded.correct, total = excluded.total, passed = MAX(learn_progress.passed, excluded.passed), best_pct = MAX(learn_progress.best_pct, excluded.best_pct), passed_at = COALESCE(learn_progress.passed_at, excluded.passed_at), principal = excluded.principal, updated = excluded.updated")
      .bind(S.L.id, n, (row && row.attempt) || 1, JSON.stringify(ans), answered, correct, total, passed, best, passNow ? now : null, principal, now).run();
    const nxt = S.grades.find(x => x.n === n + 1);
    return JC({ ok: true, r: reveal(q, ans[q.id]), progress: { answered, correct, total, need: need(total), done, pct, passed: passed === 1, pass_now: passNow, next: nxt ? { n: nxt.n, title: nxt.title, needs_join: !S.mem } : null } }, 200, S.L);
  }
  return JC({ error: "not found" }, 404, S.L);
}


// Bridge until the site build that carries gb.js v1.1.0 is live (27 Oct 2026): serve main's committed gb.js; once the
// Pages copy carries the per-page table ("/api/v?p="), pass the origin file straight through. Delete the route after.
async function gbBridge(req, ctx) {
  const o = await fetch(req); const t = await o.clone().text().catch(() => "");
  if (o.ok && t.indexOf("/api/v?p=") >= 0) return o;
  const cache = caches.default, key = new Request("https://cedwyn-api.internal/gbjs-main");
  let r = await cache.match(key);
  if (!r) {
    const g = await fetch("https://raw.githubusercontent.com/unclehowell/cedwyn/main/web/_cedwyn/guestbook/gb.js", { headers: { "user-agent": "cedwyn-api (Sion's Tab agent)" } });
    const s = g.ok ? await g.text() : "";
    if (s.indexOf("/api/v?p=") < 0) return o;
    r = new Response(s, { headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "public, max-age=300" } });
    ctx.waitUntil(cache.put(key, r.clone()));
  }
  return new Response(r.body, { headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "public, max-age=300", "x-cedwyn-bridge": "gb-main" } });
}

// P-101 (30 Oct 2026, problems flywheel 1338af2f): /_cedwyn/runtime.js prefixes every root-absolute fetch with the page's theme
// unless the first segment is a theme it knows; "arcade" is an area (areas.json), not a theme, so the parcel-story panel on
// /nft-art/, /terrain/ and /cyberspace/ (all aliases of the arcade area) asked for /<theme>/arcade/_db/config.json (404) and
// printed "could not read this page's child database". Serve those three prefixed paths from the real /arcade/_db/ files.
// Delete these routes once runtime.js leaves /<area>/_db/ paths alone (patch: work/bizdev/patches/P-101-runtime-area-db.md).
async function areaDbBridge(req, url, rest) {
  const o = await fetch(url.origin + "/" + rest + url.search, { method: req.method === "HEAD" ? "HEAD" : "GET", headers: req.headers });
  const h = new Headers(o.headers); h.set("x-cedwyn-bridge", "area-db");
  return new Response(req.method === "HEAD" ? null : o.body, { status: o.status, headers: h });
}

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url), p = url.pathname;
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,POST", "access-control-allow-headers": "content-type,x-key" } });
    try {
      { const ad = /^\/(?:nft-art|terrain|cyberspace)\/(arcade\/_db\/[^\/]+)$/.exec(p); if (ad) return await areaDbBridge(req, url, ad[1]); }
      if (p === "/_cedwyn/guestbook/gb.js") return await gbBridge(req, ctx);
      if (p === "/api/a" && req.method === "POST") return await beacon(req, env, url);
      if (p === "/api/a/summary") return await summary(req, env, url);
      if (p === "/api/v") return await versions(req, env, url, ctx);
      if (p === "/api/catalogue" || p.startsWith("/api/catalogue/")) return await catalogue(req, env, url);
      if (p === "/api/member/stripe" && req.method === "POST") return await stripeHook(req, env);
      if (p === "/api/member/family" && req.method === "POST") return await familyRedeem(req, env);
      if (p === "/api/member") return await member(req, env);
      if (p === "/learn") return Response.redirect(url.origin + "/learn/", 301);
      if (p === "/learn/") return page(LANDING);
      if (p === "/learn/welcome/" || p === "/learn/welcome") return await welcome(req, env, url);
      if (p.startsWith("/learn/api/")) return await learnApi(req, env, url);
      if (p === "/learn/grades") return Response.redirect(url.origin + "/learn/grades/", 301);
      if (p === "/learn/grades/") return page2(LADDER, "Grades · Cedwyn Academy", "/learn/grades/");
      { const gm = /^\/learn\/grades\/([1-9])\/?$/.exec(p); if (gm) return p.endsWith("/") ? page2(QUIZ.split("__G__").join(gm[1]), "Grade " + gm[1] + " · Cedwyn Academy", "/learn/grades/" + gm[1] + "/") : Response.redirect(url.origin + p + "/", 301); }
      if (p.startsWith("/learn/")) return Response.redirect(url.origin + "/learn/", 302);
      return J({ error: "not found" }, 404);
    } catch (e) { return J({ error: "server error" }, 500); }
  }
};

const SHELL = "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<title>Cedwyn Academy · learn the Great House Farm case</title><meta name=\"description\" content=\"A monthly membership course on the Great House Farm (Tŷ Mawr), Llandough case: the records, the timeline, the 1987 judgment and the disclosure requests. Members get the latest e-book and documentary versions included.\">\n<link rel=\"canonical\" href=\"https://cedwyn.bucklerfamily.estate/learn/\"><meta property=\"og:title\" content=\"Williams-Bucklers, Ty Mawr, Cedwyn – Academy\"><meta property=\"og:site_name\" content=\"Williams-Bucklers, Ty Mawr, Cedwyn\"><meta property=\"og:type\" content=\"website\"><meta property=\"og:description\" content=\"The records, the timeline, the 1987 judgment and the disclosure requests, module by module. £49.99 a month.\">\n<meta property=\"og:image\" content=\"https://cedwyn.bucklerfamily.estate/_cedwyn/og/share-academy.jpg\"><meta property=\"og:image:type\" content=\"image/jpeg\"><meta property=\"og:image:width\" content=\"1200\"><meta property=\"og:image:height\" content=\"630\"><meta property=\"og:image:alt\" content=\"Williams-Bucklers, Ty Mawr, Cedwyn – Academy\"><meta name=\"twitter:card\" content=\"summary_large_image\"><meta name=\"twitter:title\" content=\"Williams-Bucklers, Ty Mawr, Cedwyn – Academy\"><meta name=\"twitter:description\" content=\"The records, the timeline, the 1987 judgment and the disclosure requests, module by module. £49.99 a month.\"><meta name=\"twitter:image\" content=\"https://cedwyn.bucklerfamily.estate/_cedwyn/og/share-academy.jpg\"><style>:root{color-scheme:dark;--g:#00843D;--r:#C8102E}*{box-sizing:border-box}body{margin:0;font:17px/1.6 system-ui,-apple-system,\"Segoe UI\",Roboto,sans-serif;background:Canvas;color:CanvasText}\nheader.top{display:flex;gap:14px;align-items:center;flex-wrap:wrap;padding:12px 16px;border-bottom:1px solid color-mix(in srgb,CanvasText 15%,transparent);font-size:15px}header.top a{color:inherit;text-decoration:none}header.top b{margin-right:auto}\nmain{max-width:44rem;margin:0 auto;padding:18px 16px 40px}h1{font-size:1.75rem;line-height:1.25;margin:.4em 0 .3em}h2{font-size:1.2rem;margin:1.6em 0 .4em}\n.lead{font-size:1.08rem}.price{font-size:1.5rem;font-weight:700;margin:.2em 0}.btn{display:inline-block;background:var(--g);color:#fff!important;padding:13px 22px;border-radius:10px;text-decoration:none;font-weight:600;font-size:1.05rem}\n.muted{opacity:.75;font-size:.92rem}ol.mods{padding-left:1.3em}ol.mods li{margin:.5em 0}ol.mods b{display:block}ul.inc li{margin:.35em 0}.card{border:1px solid color-mix(in srgb,CanvasText 18%,transparent);border-radius:12px;padding:16px;margin:18px 0}\na{color:var(--g)}footer.ft{max-width:44rem;margin:0 auto;padding:0 16px 30px}.keyinfo ul{margin:.3em 0 .8em;padding-left:1.2em}.keyinfo li{margin:.2em 0}label.tick{display:flex;gap:10px;align-items:flex-start;margin:.7em 0;font-size:.98rem;cursor:pointer}label.tick input{width:22px;height:22px;flex:none;margin-top:2px}\n.btn[aria-disabled=true]{opacity:.45;cursor:not-allowed}.cancel{font-size:.92rem}\n.fam summary{cursor:pointer;font-weight:600}.fam label{display:block;margin:.6em 0 .3em;font-size:.95rem}.fam input{display:block;width:100%;max-width:26rem;padding:12px;font:inherit;font-size:1rem;letter-spacing:.04em;color:inherit;background:transparent;border:1px solid color-mix(in srgb,CanvasText 35%,transparent);border-radius:8px}.fam button.btn{border:0;cursor:pointer;margin-top:12px;font-family:inherit}.mnow{border-left:3px solid var(--g);padding:8px 12px;margin:14px 0;font-weight:600}</style></head><body>\n<header class=\"top\"><b><a href=\"/\">Cedwyn</a></b><a href=\"/research/\">Research</a><a href=\"/ebooks/\">E-books</a><a href=\"/movie/\">Documentary</a><a href=\"/learn/\">Academy</a></header>\n__BODY__\n<footer class=\"ft\"><p class=\"cancel\">Members: <a href=\"https://billing.stripe.com/p/login/4gMbJ25BN5YbeOM24f6Zy00\" rel=\"nofollow\">Cancel membership</a> or update your payment details on Stripe's billing page.</p><section id=\"cedwyn-guestbook\" class=\"ghf-ui\" data-no-translate translate=\"no\" aria-label=\"Agent guest book\"><style>#cedwyn-guestbook{display:block!important;clear:both;position:static;box-sizing:border-box;width:auto;max-width:760px;margin:12px auto 4px!important;padding:0 8px!important;text-align:left!important;font:400 12px/1.45 system-ui,-apple-system,\"Segoe UI\",Roboto,sans-serif!important;color:inherit;background:transparent;border:0}#cedwyn-guestbook *{box-sizing:border-box}#cedwyn-guestbook summary{cursor:pointer;padding:4px 0;font:inherit!important;color:inherit!important;text-align:left!important}#cedwyn-guestbook summary b{font-weight:700}#cedwyn-guestbook .gb-r{opacity:.7}#cedwyn-guestbook .gbw{overflow-x:auto;-webkit-overflow-scrolling:touch;max-width:100%;margin:4px 0}#cedwyn-guestbook table{border-collapse:collapse;width:100%;min-width:0;font:inherit!important;color:inherit!important;background:transparent!important}#cedwyn-guestbook th,#cedwyn-guestbook td{display:table-cell!important;text-align:left!important;vertical-align:top;padding:4px 6px!important;border:0!important;border-bottom:1px solid rgba(128,128,128,.32)!important;font:inherit!important;color:inherit!important;background:transparent!important}#cedwyn-guestbook th{font-weight:700!important;white-space:nowrap}#cedwyn-guestbook td:nth-child(1),#cedwyn-guestbook td:nth-child(4){white-space:nowrap}#cedwyn-guestbook td:nth-child(2){min-width:6.6em;width:6.6em}#cedwyn-guestbook td:nth-child(3){min-width:13em}@media(min-width:700px){#cedwyn-guestbook td:nth-child(2){white-space:nowrap;width:auto}}#cedwyn-guestbook a{color:inherit!important;text-decoration:underline!important;margin:0!important;padding:0!important;display:inline!important;font:inherit!important}#cedwyn-guestbook p{margin:4px 0!important;max-width:none!important;font:inherit!important;color:inherit!important;text-align:left!important}</style><details><summary><b data-gb-l=\"title\">Page versions</b> <span class=\"gb-v\">v1.1.1</span> <span class=\"gb-r\">· <span>versions 1.change.fix, this page’s own log</span></span></summary><div class=\"gbw\"><table><thead><tr><th data-gb-l=\"v\">Version</th><th data-gb-l=\"d\">Date</th><th data-gb-l=\"n\">Change</th><th data-gb-l=\"w\">Who</th></tr></thead><tbody class=\"gb-rows\" data-filled=\"1\"><tr><td>1.1.1</td><td>30/10/2026</td><td>One page journal; unrelated site entries removed.</td><td>Tab</td></tr><tr><td>1.1.0</td><td>30/10/2026</td><td>Family code entry added to the join card (family join free; the paid membership is unchanged); page set to the dark theme.</td><td>Tab</td></tr><tr><td>1.0.0</td><td>27/10/2026</td><td>Academy page created: course outline, key information, the two required ticks and member sign-in by checkout.</td><td>Tab</td></tr></tbody></table></div></details></section><script src=\"/_cedwyn/guestbook/gb.js?v=1.1.0\" defer></script></footer>\n<script>(function(){if(window.__cedwynA)return;window.__cedwynA=1;var O=location.origin+\"/api/a\";function s(e,t){try{var d=JSON.stringify({p:location.pathname,r:document.referrer,e:e,t:t||null,l:(document.documentElement.getAttribute(\"lang\")||\"\").slice(0,2),w:window.innerWidth,d:navigator.webdriver?1:0});if(navigator.sendBeacon&&navigator.sendBeacon(O,new Blob([d],{type:\"text/plain\"})))return;fetch(O,{method:\"POST\",body:d,keepalive:true}).catch(function(){});}catch(x){}}window.cedwynTrack=s;function pv(){s(\"pv\");}if(document.readyState===\"complete\")pv();else addEventListener(\"load\",pv);document.addEventListener(\"click\",function(ev){var a=ev.target&&ev.target.closest&&ev.target.closest(\"a[href]\");if(!a)return;var h=a.href,u=h,m=h.match(/[?&]u=([^&]+)/);if(m){try{u=decodeURIComponent(m[1]);}catch(x){}}if(/^https:\\/\\/(buy|checkout)\\.stripe\\.com\\/|gumroad\\.com\\//.test(u))s(\"checkout\",u.slice(0,200));else{try{var q=new URL(h,location.href);if(q.origin===location.origin&&/^\\/learn\\/?$/.test(q.pathname))s(\"academy\",location.pathname);}catch(x){}}},true);})();</script></body></html>";
const LANDING = "<main>\n<p class=\"muted\">Cedwyn Academy</p>\n<h1>Learn the Great House Farm case, record by record</h1>\n<p class=\"lead\">A course on Tŷ Mawr (Great House Farm), Llandough: what the records show, in what order, and where the gaps are. Every lesson points to the catalogued evidence, so you read the sources and build the picture yourself.</p>\n<h2>Included while you are a member</h2>\n<ul class=\"inc\"><li>Every module below, updated as new records arrive, and all seven grades.</li><li>The latest version of each Cedwyn e-book, free.</li><li>The latest documentary scenes, free.</li><li>New missing-record findings and institution replies, explained as they are catalogued.</li><li>Founding members help shape the course and join the first live sessions.</li></ul>\n<div class=\"card\" id=\"join\">\n<div class=\"keyinfo\" role=\"group\" aria-label=\"Key information\"><p class=\"price\">£49.99 a month</p>\n<ul><li>£49.99 is taken every month until you cancel.</li><li>The first payment is taken today. The least you will pay is £49.99.</li><li>No free trial and no annual plan.</li><li>Cancel online at any time from Stripe's billing page, linked at the bottom of every Academy page. Access runs to the end of the month you have paid for.</li></ul></div>\n<label class=\"tick\"><input type=\"checkbox\" id=\"t1\"> I'm starting a £49.99/month subscription, charged every month until I cancel.</label>\n<label class=\"tick\"><input type=\"checkbox\" id=\"t2\"> Give me access straight away. I understand I lose my 14-day right to cancel once I start using the course content.</label>\n<p><a class=\"btn\" id=\"joinbtn\" aria-disabled=\"true\" data-href=\"https://buy.stripe.com/14AfZi5BNbiv5ecbEP6Zy0J\" rel=\"nofollow\" role=\"link\">Join the Academy</a></p>\n<p class=\"muted\" id=\"joinhint\">Tick both boxes to continue to Stripe's secure checkout.</p>\n<noscript><p class=\"muted\">Joining needs JavaScript switched on in your browser.</p></noscript>\n</div>\n<p id=\"mnow\" class=\"mnow\" role=\"status\" hidden></p>\n<details class=\"card fam\" id=\"family\"><summary>Have a family code?</summary>\n<p class=\"muted\">Family of the Cedwyn estate join with the family code they were given, instead of paying. It opens the Academy in this browser the same way a membership does, and nothing is charged.</p>\n<form id=\"famf\" autocomplete=\"off\"><label for=\"famc\">Family code</label>\n<input id=\"famc\" name=\"code\" type=\"text\" inputmode=\"text\" autocapitalize=\"characters\" autocorrect=\"off\" spellcheck=\"false\" maxlength=\"48\" placeholder=\"CEDWYN-FAMILY-XXXX-XXXX-XXXX\">\n<button type=\"submit\" class=\"btn\">Use family code</button></form>\n<p id=\"famm\" class=\"muted\" role=\"status\" aria-live=\"polite\"></p>\n</details>\n<div class=\"card\" id=\"grades\"><h2 style=\"margin-top:0\">Grades: learn it step by step</h2>\n<p>The course runs as seven grades, from the farm and its names up to the open questions the research is working on now. Each grade is a questionnaire built from the evidence catalogue. Answer, reveal the answer to learn from it, and score 90% or more to move up.</p>\n<p><a class=\"btn\" href=\"/learn/grades/1/\">Try Grade 1 free</a></p><p class=\"muted\"><a href=\"/learn/grades/\">See all seven grades</a> · Grades 2 to 7 open with a membership.</p></div>\n<h2>The course</h2>\n<ol class=\"mods\">\n<li><b>The place and its names</b>Cedwyn, Cwm Cedwyn and Tŷ Mawr: the place-name record from 1392 onwards, and how the farm sits in Llandough parish.</li>\n<li><b>The family</b>The Williams and Buckler family across the generations, from the 1667 acquisition reported in the press to 1988.</li>\n<li><b>Reading the evidence catalogue</b>How each record is identified (EV and GHF-E numbers), graded and sourced, and how to tell a held document from one that is not yet found.</li>\n<li><b>The timeline</b>The 1877 agreement, the 1916 and 1939 tenancies, the 1955 and 1962 possession orders and the 1974 licence letters, in order.</li>\n<li><b>BP Properties Ltd v Buckler (1987)</b>The Court of Appeal judgment, the twelve-year rule and the questions the records raise about it.</li>\n<li><b>Missing records</b>The register of documents that should exist by statute, practice or cross-reference but are not held, and where each could be.</li>\n<li><b>Disclosure</b>Freedom of information and subject access requests: what was asked, who answered, who did not, and the deadlines.</li>\n<li><b>Recorded incidents</b>The incidents and deaths in the record, set out by date and source.</li>\n<li><b>Doing the research</b>How the editors and research agents work: the editing protocol, page versions and how a new record joins the catalogue.</li>\n</ol>\n<h2>Start smaller</h2>\n<p>Every e-book's first edition is free, and the next edition of each is £4.99. <a href=\"/ebooks/\">See the e-books</a>.</p>\n<p>Membership includes the latest version of every e-book, so members don't buy new editions separately. <a href=\"#join\">Join the Academy</a>.</p>\n<p class=\"muted\">Member sign-in uses the checkout you pay with, so there is no password.</p>\n</main>\n<script>(function(){var a=document.getElementById(\"joinbtn\"),t1=document.getElementById(\"t1\"),t2=document.getElementById(\"t2\"),h=document.getElementById(\"joinhint\");function u(){var ok=t1.checked&&t2.checked;if(ok){a.setAttribute(\"href\",a.getAttribute(\"data-href\"));a.removeAttribute(\"aria-disabled\");h.textContent=\"Continue to Stripe's secure checkout.\";}else{a.removeAttribute(\"href\");a.setAttribute(\"aria-disabled\",\"true\");h.textContent=\"Tick both boxes to continue to Stripe's secure checkout.\";}}t1.addEventListener(\"change\",u);t2.addEventListener(\"change\",u);u();a.addEventListener(\"click\",function(e){if(!(t1.checked&&t2.checked)){e.preventDefault();h.textContent=\"Please tick both boxes first.\";}else if(window.cedwynTrack){window.cedwynTrack(\"checkout\",a.getAttribute(\"data-href\"));}});})();</script><script>(function(){var f=document.getElementById(\"famf\"),c=document.getElementById(\"famc\"),m=document.getElementById(\"famm\"),d=document.getElementById(\"family\"),n=document.getElementById(\"mnow\");var h=(location.hash||\"\").match(/family=([A-Za-z0-9-]{8,60})/);if(h){c.value=h[1];d.open=true;try{history.replaceState(null,\"\",location.pathname+location.search);}catch(x){}}function on(p){n.hidden=false;n.textContent=p===\"family\"?\"Family access is active in this browser. Nothing to pay.\":\"Your membership is active in this browser.\";}fetch(\"/api/member\",{credentials:\"same-origin\",cache:\"no-store\"}).then(function(r){return r.json();}).then(function(x){if(x&&x.member)on(x.plan);}).catch(function(){});var busy=false;f.addEventListener(\"submit\",function(e){e.preventDefault();if(busy)return;var v=c.value.trim();if(!v){m.textContent=\"Type the family code first.\";return;}busy=true;m.textContent=\"Checking the code…\";fetch(\"/api/member/family\",{method:\"POST\",credentials:\"same-origin\",cache:\"no-store\",headers:{\"content-type\":\"application/json\"},body:JSON.stringify({code:v})}).then(function(r){return r.json();}).then(function(x){busy=false;if(x&&x.ok){c.value=\"\";m.textContent=\"Welcome to the Academy. Family access is now active in this browser, with nothing to pay.\";on(\"family\");}else if(x&&x.error===\"slow_down\"){m.textContent=\"Too many tries from here. Please wait ten minutes and try again.\";}else{m.textContent=\"That code was not recognised. Check it and try again.\";}}).catch(function(){busy=false;m.textContent=\"The code could not be checked just now. Please try again in a moment.\";});});})();</script>";
const WELCOME = "<main><p class=\"muted\">Cedwyn Academy</p><h1>Welcome to the Academy</h1>\n<p class=\"lead\">Thank you. Your membership has started and your receipt is on its way from Stripe by email.</p>\n<p id=\"mstate\" class=\"muted\">Checking your membership…</p>\n<p>This browser is now signed in as a member. The latest e-book and documentary versions open free here while your membership is active.</p>\n<p><a class=\"btn\" href=\"/learn/grades/\">Start the grades</a></p>\n<p>Start with the evidence: <a href=\"/research/timeline/\">the master timeline</a>, <a href=\"/research/missing-records/\">the missing records</a> and <a href=\"/catalogue/\">the catalogue</a>.</p>\n</main>\n<script>(function(){var n=0,el=document.getElementById(\"mstate\");function go(){fetch(\"/api/member\",{credentials:\"same-origin\",cache:\"no-store\"}).then(function(r){return r.json();}).then(function(d){if(d.member){el.textContent=\"Membership active.\";}else if(n++<8){el.textContent=\"Confirming your payment with Stripe…\";setTimeout(go,2500);}else{el.textContent=\"Your payment is still being confirmed. Reload this page in a minute.\";}}).catch(function(){});}go();})();</script>";
const LADDER = "<style>.ib{background:none;border:1px solid color-mix(in srgb,CanvasText 35%,transparent);color:inherit;border-radius:50%;width:30px;height:30px;font-size:1rem;line-height:1;cursor:pointer;vertical-align:middle;margin-left:6px;padding:0}\ndialog.im{background:Canvas;color:CanvasText;border:1px solid color-mix(in srgb,CanvasText 25%,transparent);border-radius:12px;max-width:min(36rem,92vw);padding:18px 18px 8px}dialog.im::backdrop{background:rgba(0,0,0,.65)}dialog.im h3{margin:.1em 0 .5em;font-size:1.1rem}dialog.im .x{float:right;background:none;border:0;color:inherit;font-size:1.3rem;cursor:pointer;padding:0 4px}\n.gc h2{margin:.1em 0 .3em;font-size:1.12rem;display:flex;align-items:center;gap:4px}.gst{font-weight:600;margin:.4em 0}.gst.ok{color:var(--g)}.btn.sec{background:transparent;border:1px solid var(--g);color:var(--g)!important}\n.qn{border:1px solid color-mix(in srgb,CanvasText 18%,transparent);border-radius:12px;padding:14px 14px 10px;margin:16px 0}.qn .qt{font-weight:600;margin:0 0 .5em}.qn label{display:flex;gap:10px;align-items:flex-start;padding:9px 10px;margin:6px 0;border:1px solid color-mix(in srgb,CanvasText 20%,transparent);border-radius:8px;cursor:pointer}.qn label input{width:20px;height:20px;flex:none;margin-top:3px}\n.qn label.pick{border-color:CanvasText}.qn label.right{border-color:var(--g);background:color-mix(in srgb,var(--g) 18%,transparent)}.qn label.wrong{border-color:var(--r);background:color-mix(in srgb,var(--r) 16%,transparent)}\n.qn button{font:inherit;border:0;cursor:pointer;margin:8px 8px 4px 0}.qn button.btn{padding:10px 18px;font-size:1rem}.qn button[disabled]{opacity:.45;cursor:not-allowed}.rv{border-left:3px solid var(--g);padding:6px 12px;margin:10px 0 4px}.rv.no{border-left-color:var(--r)}.rv blockquote{margin:.5em 0;padding:0 0 0 10px;border-left:2px solid color-mix(in srgb,CanvasText 30%,transparent);font-style:italic}.tag{display:inline-block;font-size:.8rem;border:1px solid currentColor;border-radius:20px;padding:1px 9px;margin:0 6px 4px 0;opacity:.85}\n.bar{height:8px;border-radius:6px;background:color-mix(in srgb,CanvasText 14%,transparent);overflow:hidden;margin:6px 0 2px}.bar i{display:block;height:100%;background:var(--g);width:0}.score{border:2px solid var(--g);border-radius:12px;padding:14px 16px;margin:20px 0}.score.no{border-color:var(--r)}\n#gsticky{position:sticky;top:0;background:Canvas;padding:8px 0 6px;z-index:2;border-bottom:1px solid color-mix(in srgb,CanvasText 12%,transparent)}</style><main><p class=\"muted\">Cedwyn Academy</p><h1>Grades <span id=\"howb\"></span></h1>\n<p class=\"lead\">Seven grades, from the farm and its names up to the open questions the research is working on now. Answer each questionnaire, reveal the answers to learn from them, and score 90% or more to move up a grade.</p>\n<p class=\"muted\" id=\"mline\">Grade 1 is a free preview. Grades 2 to 7 open with a membership.</p>\n<div id=\"ladder\"><p class=\"muted\">Loading the grades…</p></div>\n<noscript><p class=\"muted\">The grades need JavaScript switched on in your browser.</p></noscript>\n<p><a href=\"/learn/\">Back to the Academy</a></p></main>\n<script>(function(){function modal(t,html){var d=document.createElement(\"dialog\");d.className=\"im\";var x=document.createElement(\"button\");x.className=\"x\";x.setAttribute(\"aria-label\",\"Close\");x.textContent=\"✕\";x.onclick=function(){d.close();};var h=document.createElement(\"h3\");h.textContent=t;var b=document.createElement(\"div\");b.innerHTML=html;d.appendChild(x);d.appendChild(h);d.appendChild(b);d.addEventListener(\"click\",function(e){if(e.target===d)d.close();});d.addEventListener(\"close\",function(){d.remove();});document.body.appendChild(d);d.showModal();}\nfunction ib(label,t,html){var b=document.createElement(\"button\");b.type=\"button\";b.className=\"ib\";b.textContent=\"ⓘ\";b.setAttribute(\"aria-label\",label);b.onclick=function(){modal(t,html);};return b;}\nfunction E(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;}\nvar HOW=\"<p>Each grade is a questionnaire. Choose an answer and lock it in. Once a question is answered, <b>Reveal answer</b> shows the correct answer, a short explanation and the catalogue source.</p><p>Answers lock once given. Score <b>90% or more</b> to pass the grade and unlock the next one. You can retake a grade as often as you like; a pass stays passed.</p><p>Every question is built from the site's evidence catalogue and cites its IDs (EV, MR, PE). Quotes are verbatim. Points marked as our case are prospective, not findings of any court.</p><p>Grade 1 is a free preview. Grades 2 to 7 open with a membership or a family code. Progress is kept in this browser.</p>\";\ndocument.getElementById(\"howb\").appendChild(ib(\"How grading works\",\"How grading works\",HOW));\nvar L=document.getElementById(\"ladder\");\nfetch(\"/learn/api/state\",{credentials:\"same-origin\",cache:\"no-store\"}).then(function(r){return r.json();}).then(function(s){L.textContent=\"\";\nvar ml=document.getElementById(\"mline\");if(s.member)ml.textContent=s.plan===\"family\"?\"Family access is active in this browser. Every grade you have unlocked is open.\":\"Your membership is active in this browser. Pass each grade to open the next.\";\ns.grades.forEach(function(g){var c=E(\"div\",\"card gc\");var h=E(\"h2\");h.appendChild(document.createTextNode(g.title));h.appendChild(ib(\"About \"+g.title,g.title,\"<p>\"+g.blurb.replace(/</g,\"&lt;\")+\"</p><p>\"+g.total+\" questions. Pass mark: \"+g.need+\" of \"+g.total+\" (90%).\"+(g.free?\" Free preview.\":\"\")+\"</p>\"));c.appendChild(h);\nc.appendChild(E(\"p\",\"muted\",g.blurb+\" · \"+g.total+\" questions\"+(g.free?\" · free preview\":\"\")));\nvar st=E(\"p\",\"gst\"),a=E(\"a\",\"btn\");\nif(g.passed){st.className=\"gst ok\";st.textContent=\"Passed ✓ · best score \"+g.best_pct+\"%\";a.textContent=\"Review\";a.className=\"btn sec\";a.href=\"/learn/grades/\"+g.n+\"/\";}\nelse if(g.unlocked&&g.answered>=g.total){st.textContent=\"Not passed yet: \"+g.correct+\" of \"+g.total+\" (pass mark \"+g.need+\")\";a.textContent=\"Retake\";a.href=\"/learn/grades/\"+g.n+\"/\";}\nelse if(g.unlocked){st.textContent=g.answered?(\"In progress: \"+g.answered+\" of \"+g.total+\" answered\"):\"Open\";a.textContent=g.answered?\"Continue\":\"Start \"+(g.free&&!s.member?\"free\":\"Grade \"+g.n);a.href=\"/learn/grades/\"+g.n+\"/\";}\nelse if(g.why===\"join\"){st.textContent=\"Locked · opens with a membership\"+(g.n===2&&!s.grades[0].passed?\" and a pass of Grade 1\":\"\");a.textContent=\"Join to unlock\";a.className=\"btn sec\";a.href=\"/learn/#join\";}\nelse{st.textContent=\"Locked · pass Grade \"+(g.n-1)+\" first\";a=null;}\nc.appendChild(st);if(a){var p=E(\"p\");p.appendChild(a);c.appendChild(p);}L.appendChild(c);});\n}).catch(function(){L.textContent=\"The grades could not be loaded just now. Please reload in a moment.\";});\n})();</script>";
const QUIZ = "<style>.ib{background:none;border:1px solid color-mix(in srgb,CanvasText 35%,transparent);color:inherit;border-radius:50%;width:30px;height:30px;font-size:1rem;line-height:1;cursor:pointer;vertical-align:middle;margin-left:6px;padding:0}\ndialog.im{background:Canvas;color:CanvasText;border:1px solid color-mix(in srgb,CanvasText 25%,transparent);border-radius:12px;max-width:min(36rem,92vw);padding:18px 18px 8px}dialog.im::backdrop{background:rgba(0,0,0,.65)}dialog.im h3{margin:.1em 0 .5em;font-size:1.1rem}dialog.im .x{float:right;background:none;border:0;color:inherit;font-size:1.3rem;cursor:pointer;padding:0 4px}\n.gc h2{margin:.1em 0 .3em;font-size:1.12rem;display:flex;align-items:center;gap:4px}.gst{font-weight:600;margin:.4em 0}.gst.ok{color:var(--g)}.btn.sec{background:transparent;border:1px solid var(--g);color:var(--g)!important}\n.qn{border:1px solid color-mix(in srgb,CanvasText 18%,transparent);border-radius:12px;padding:14px 14px 10px;margin:16px 0}.qn .qt{font-weight:600;margin:0 0 .5em}.qn label{display:flex;gap:10px;align-items:flex-start;padding:9px 10px;margin:6px 0;border:1px solid color-mix(in srgb,CanvasText 20%,transparent);border-radius:8px;cursor:pointer}.qn label input{width:20px;height:20px;flex:none;margin-top:3px}\n.qn label.pick{border-color:CanvasText}.qn label.right{border-color:var(--g);background:color-mix(in srgb,var(--g) 18%,transparent)}.qn label.wrong{border-color:var(--r);background:color-mix(in srgb,var(--r) 16%,transparent)}\n.qn button{font:inherit;border:0;cursor:pointer;margin:8px 8px 4px 0}.qn button.btn{padding:10px 18px;font-size:1rem}.qn button[disabled]{opacity:.45;cursor:not-allowed}.rv{border-left:3px solid var(--g);padding:6px 12px;margin:10px 0 4px}.rv.no{border-left-color:var(--r)}.rv blockquote{margin:.5em 0;padding:0 0 0 10px;border-left:2px solid color-mix(in srgb,CanvasText 30%,transparent);font-style:italic}.tag{display:inline-block;font-size:.8rem;border:1px solid currentColor;border-radius:20px;padding:1px 9px;margin:0 6px 4px 0;opacity:.85}\n.bar{height:8px;border-radius:6px;background:color-mix(in srgb,CanvasText 14%,transparent);overflow:hidden;margin:6px 0 2px}.bar i{display:block;height:100%;background:var(--g);width:0}.score{border:2px solid var(--g);border-radius:12px;padding:14px 16px;margin:20px 0}.score.no{border-color:var(--r)}\n#gsticky{position:sticky;top:0;background:Canvas;padding:8px 0 6px;z-index:2;border-bottom:1px solid color-mix(in srgb,CanvasText 12%,transparent)}</style><main id=\"qz\" data-g=\"__G__\"><p class=\"muted\"><a href=\"/learn/grades/\">All grades</a></p><h1 id=\"gt\">Grade __G__</h1><p id=\"gb\" class=\"lead\"></p>\n<div id=\"gsticky\"><span id=\"gp\" class=\"muted\">Loading…</span><div class=\"bar\"><i id=\"gbar\"></i></div></div>\n<div id=\"qs\"></div><div id=\"res\"></div>\n<noscript><p class=\"muted\">The questionnaire needs JavaScript switched on in your browser.</p></noscript></main>\n<script>(function(){function modal(t,html){var d=document.createElement(\"dialog\");d.className=\"im\";var x=document.createElement(\"button\");x.className=\"x\";x.setAttribute(\"aria-label\",\"Close\");x.textContent=\"✕\";x.onclick=function(){d.close();};var h=document.createElement(\"h3\");h.textContent=t;var b=document.createElement(\"div\");b.innerHTML=html;d.appendChild(x);d.appendChild(h);d.appendChild(b);d.addEventListener(\"click\",function(e){if(e.target===d)d.close();});d.addEventListener(\"close\",function(){d.remove();});document.body.appendChild(d);d.showModal();}\nfunction ib(label,t,html){var b=document.createElement(\"button\");b.type=\"button\";b.className=\"ib\";b.textContent=\"ⓘ\";b.setAttribute(\"aria-label\",label);b.onclick=function(){modal(t,html);};return b;}\nfunction E(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;}\nvar HOW=\"<p>Each grade is a questionnaire. Choose an answer and lock it in. Once a question is answered, <b>Reveal answer</b> shows the correct answer, a short explanation and the catalogue source.</p><p>Answers lock once given. Score <b>90% or more</b> to pass the grade and unlock the next one. You can retake a grade as often as you like; a pass stays passed.</p><p>Every question is built from the site's evidence catalogue and cites its IDs (EV, MR, PE). Quotes are verbatim. Points marked as our case are prospective, not findings of any court.</p><p>Grade 1 is a free preview. Grades 2 to 7 open with a membership or a family code. Progress is kept in this browser.</p>\";\nvar N=+document.getElementById(\"qz\").getAttribute(\"data-g\"),Q=document.getElementById(\"qs\"),R=document.getElementById(\"res\"),GP=document.getElementById(\"gp\"),BAR=document.getElementById(\"gbar\"),D=null,busy=false;\nfunction api(path,body){return fetch(\"/learn/api/\"+path,{method:body?\"POST\":\"GET\",credentials:\"same-origin\",cache:\"no-store\",headers:body?{\"content-type\":\"application/json\"}:{},body:body?JSON.stringify(body):undefined}).then(function(r){return r.json();});}\nfunction prog(p){var t=D.qs.length,a=p?p.answered:Object.keys(D.answers).length;GP.textContent=\"Answered \"+a+\" of \"+t+\" · pass mark \"+Math.ceil(t*0.9)+\" of \"+t+\" (90%)\";BAR.style.width=(100*a/t)+\"%\";}\nfunction showRev(box,q,r){var old=box.querySelector(\".rv\");if(old)old.remove();var v=E(\"div\",\"rv\"+(r.correct?\"\":\" no\"));\nvar h=E(\"p\");var b=E(\"b\",null,r.correct?\"✓ Correct\":\"✗ Not this time\");h.appendChild(b);v.appendChild(h);\nif(r.open)v.appendChild(E(\"span\",\"tag\",\"Open question\"));if(r.case)v.appendChild(E(\"span\",\"tag\",\"Our case, prospective, not a finding\"));\nv.appendChild(E(\"p\",null,\"Answer: \"+q.o[r.a]));v.appendChild(E(\"p\",null,r.x));\nif(r.v){var bq=E(\"blockquote\",null,\"“\"+r.v+\"”\");v.appendChild(bq);if(r.vr)v.appendChild(E(\"p\",\"muted\",\"— \"+r.vr));}\nvar s=E(\"p\",\"muted\");s.appendChild(document.createTextNode(\"Source: \"));r.s.forEach(function(x,i){if(i)s.appendChild(document.createTextNode(\" · \"));var a=E(\"a\",null,x.id);a.href=x.u;s.appendChild(a);});v.appendChild(s);box.appendChild(v);\nbox.querySelectorAll(\"label\").forEach(function(l,i){l.classList.remove(\"pick\");if(i===r.a)l.classList.add(\"right\");else if(i===r.choice)l.classList.add(\"wrong\");});}\nfunction lockQ(box,q,r){box.querySelectorAll(\"input\").forEach(function(i,k){i.disabled=true;if(k===r.choice)i.checked=true;});box.querySelectorAll(\"label\").forEach(function(l,k){if(k===r.choice)l.classList.add(\"pick\");});var lk=box.querySelector(\".lk\");if(lk)lk.remove();\nif(!box.querySelector(\".rvb\")){var rb=E(\"button\",\"btn sec rvb\",\"Reveal answer\");rb.type=\"button\";rb.onclick=function(){showRev(box,q,r);rb.remove();};var ok=E(\"p\",\"muted\",\"Answer locked in.\");ok.className=\"muted lkd\";box.appendChild(ok);box.appendChild(rb);}}\nfunction score(p){R.textContent=\"\";if(!p||!p.done)return;var c=E(\"div\",\"score\"+(p.pass_now?\"\":\" no\"));c.setAttribute(\"role\",\"status\");\nc.appendChild(E(\"h2\",null,\"You scored \"+p.correct+\" of \"+p.total+\" (\"+p.pct+\"%)\"));\nif(p.pass_now){c.appendChild(E(\"p\",null,\"Passed. \"+(p.next?(p.next.needs_join?p.next.title+\" opens with a membership.\":p.next.title+\" is now unlocked.\"):\"That is the final grade. These questions stay open as the research goes on.\")));\n if(p.next){var a=E(\"a\",\"btn\",p.next.needs_join?\"Join to unlock \"+(\"Grade \"+p.next.n):\"Go to Grade \"+p.next.n);a.href=p.next.needs_join?\"/learn/#join\":\"/learn/grades/\"+p.next.n+\"/\";var pp=E(\"p\");pp.appendChild(a);c.appendChild(pp);}}\nelse{c.appendChild(E(\"p\",null,\"Not passed yet: the pass mark is \"+p.need+\" of \"+p.total+\" (90%).\"+(p.passed?\" You passed this grade before, so the next grade stays open.\":\" Read the revealed answers and try again.\")));}\nvar rt=E(\"button\",\"btn sec\",\"Retake this grade\");rt.type=\"button\";rt.onclick=function(){if(busy)return;busy=true;api(\"retake\",{grade:N}).then(function(){location.reload();});};var p2=E(\"p\");p2.appendChild(rt);c.appendChild(p2);R.appendChild(c);c.scrollIntoView({behavior:\"smooth\",block:\"center\"});}\napi(\"grade/\"+N).then(function(d){\nif(d.locked){document.getElementById(\"gt\").textContent=d.title||(\"Grade \"+N);document.getElementById(\"gb\").textContent=d.blurb||\"\";GP.textContent=\"Locked\";BAR.parentNode.style.display=\"none\";var c=E(\"div\",\"card\");\nc.appendChild(E(\"p\",null,d.why===\"join\"?\"This grade opens with a Cedwyn Academy membership (£49.99 a month) or a family code, after a pass of the grade below.\":\"Pass Grade \"+(N-1)+\" with 90% or more to open this grade.\"));var a=E(\"a\",\"btn\",d.why===\"join\"?\"Join the Academy\":\"Go to Grade \"+(N-1));a.href=d.why===\"join\"?\"/learn/#join\":\"/learn/grades/\"+(N-1)+\"/\";var pp=E(\"p\");pp.appendChild(a);c.appendChild(pp);Q.appendChild(c);return;}\nif(d.error){GP.textContent=\"This grade does not exist.\";return;}\nD=d;document.title=d.title+\" · Cedwyn Academy\";var gt=document.getElementById(\"gt\");gt.textContent=d.title;gt.appendChild(ib(\"How grading works\",\"How grading works\",HOW));document.getElementById(\"gb\").textContent=d.blurb;prog();\nd.qs.forEach(function(q,k){var box=E(\"div\",\"qn\");box.id=q.id;var t=E(\"p\",\"qt\",(k+1)+\". \"+q.q);box.appendChild(t);\nq.o.forEach(function(o,i){var l=E(\"label\");var inp=document.createElement(\"input\");inp.type=\"radio\";inp.name=q.id;inp.value=i;l.appendChild(inp);l.appendChild(document.createTextNode(o));inp.onchange=function(){box.querySelectorAll(\"label\").forEach(function(x){x.classList.remove(\"pick\");});l.classList.add(\"pick\");var b=box.querySelector(\".lk\");if(b)b.disabled=false;};box.appendChild(l);});\nvar r=d.answers[q.id];if(r){lockQ(box,q,r);}else{var lk=E(\"button\",\"btn lk\",\"Lock in answer\");lk.type=\"button\";lk.disabled=true;lk.onclick=function(){var c=box.querySelector(\"input:checked\");if(!c||busy)return;busy=true;lk.disabled=true;lk.textContent=\"Saving…\";\napi(\"answer\",{grade:N,id:q.id,choice:+c.value}).then(function(x){busy=false;if(!x.ok){lk.disabled=false;lk.textContent=\"Lock in answer\";return;}d.answers[q.id]=x.r;lockQ(box,q,x.r);prog(x.progress);if(x.progress.done)score(x.progress);}).catch(function(){busy=false;lk.disabled=false;lk.textContent=\"Try again\";});};box.appendChild(lk);}\nQ.appendChild(box);});\nvar st=d.state;if(st.answered>=st.total){score({done:true,correct:st.correct,total:st.total,need:st.need,pct:Math.round(100*st.correct/st.total),pass_now:st.correct>=st.need,passed:st.passed,next:d.next});}\n}).catch(function(){GP.textContent=\"The questionnaire could not be loaded just now. Please reload in a moment.\";});\n})();</script>";

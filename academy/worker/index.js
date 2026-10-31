// cedwyn-academy 2.0.0 — the Cedwyn Academy webapp at academy.bucklerfamily.estate (Tab agent; v1 30 Oct 2026 task c1fca92e,
// v2 standardisation 31 Oct 2026 task 320a574b). Source: repo unclehowell/cedwyn, branch `academy` (worker/).
// The Cedwyn webapp standard, as the other apps carry it:
//  * Header: the shared Cedwyn files (/_cedwyn/ghf/ghf-lang.js + ghf-boot.js -> basecamp.js, ghf-theme.css, fonts, cw-graph.js), served
//    same-origin by passing /_cedwyn/* through from cedwyn.bucklerfamily.estate — not copies. Menu button and webapp title on one row.
//  * Header graph: /_cedwyn/graph/*.json on this host answers with THIS app's own database only (each cited record by its date and grade).
//  * Front end: near-A2UI. Every page is an A2UI v0.9 surface (ui.js), rendered on the server from the academy's own data; the surface is
//    published at /_ui/<page>.a2ui.json and the catalog at /_ui/catalog.json. Footer: the shared page journal (#cedwyn-journal).
//  * Data: central master db = the evidence catalogue (core_items, D1 cedwyn-apps, /api/catalogue). The academy's own derived tables
//    (academy_*) hold versions, questions (citing catalogue IDs only), progress and access codes; citation titles, dates and links are read
//    from core_items at request time (academy_sources is the derived fallback, rebuilt by tools/build_db.py).
//  * Access: v0.0.1 free; v0.0.2 for members — the estate membership cookie (paid checkout or family code, checked through the service
//    binding to cedwyn-api) or an Academy access code ACD-XXXX-XXXX-XXXX (issued only for paid £49.99/month checkouts: by the box's
//    tools/acd_code_sync.py from Stripe now, and by the signed webhook POST /api/stripe/webhook once STRIPE_WHSEC is set). Locked content is
//    never sent to a browser.
import { render, surface, CATALOG } from "./ui.js";
import CSS from "./style.txt";
import CLIENT from "./client.txt";
const SITE = "https://cedwyn.bucklerfamily.estate";
const ORIGIN = "https://academy.bucklerfamily.estate";
const JOIN = "https://buy.stripe.com/14AfZi5BNbiv5ecbEP6Zy0J";
const BILLING = "https://billing.stripe.com/p/login/4gMbJ25BN5YbeOM24f6Zy00";
const PLINK = "plink_1UV6PpJRNz20guqBItjOb6Ey";   // the Academy's £49.99/month Payment Link (codes are issued for this link only)
const PASS_PCT = 90, APP_V = "2.0.0", GHF_V = "2.1.17";
const JOURNAL = [
  { v: "2.0.0", date: "2026-10-31", note: "The Academy now follows the shared Cedwyn webapp standard: the same header as the other apps (menu button and title on one row; the header graph plots only this app's own database), pages generated from data as A2UI surfaces, citation titles and links read from the central evidence catalogue, and an access code for members (ACD-…) that opens v0.0.2 in any browser." },
  { v: "1.0.0", date: "2026-10-30", note: "Cedwyn Academy opened as its own site at academy.bucklerfamily.estate, with its own database. Questionnaires now carry versions: v0.0.1 is the free set (Grade 1), v0.0.2 the full set of seven grades for members. Older /learn/ addresses forward here." }];
const BEACON = "(function(){if(window.__cedwynA)return;window.__cedwynA=1;var O=location.origin+\"/api/a\";function s(e,t){try{var d=JSON.stringify({p:location.pathname,r:document.referrer,e:e,t:t||null,l:(document.documentElement.getAttribute(\"lang\")||\"\").slice(0,2),w:window.innerWidth,d:navigator.webdriver?1:0});if(navigator.sendBeacon&&navigator.sendBeacon(O,new Blob([d],{type:\"text/plain\"})))return;fetch(O,{method:\"POST\",body:d,keepalive:true}).catch(function(){});}catch(x){}}window.cedwynTrack=s;function pv(){s(\"pv\");}if(document.readyState===\"complete\")pv();else addEventListener(\"load\",pv);document.addEventListener(\"click\",function(ev){var a=ev.target&&ev.target.closest&&ev.target.closest(\"a[href]\");if(!a)return;var h=a.href,u=h,m=h.match(/[?&]u=([^&]+)/);if(m){try{u=decodeURIComponent(m[1]);}catch(x){}}if(/^https:\\/\\/(buy|checkout)\\.stripe\\.com\\/|gumroad\\.com\\//.test(u))s(\"checkout\",u.slice(0,200));},true);})();";
const BANNED = /\b(says|claims|according to|hearsay|unverified|alleged|fraud|stolen)\b/i;
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const need = t => Math.ceil(t * PASS_PCT / 100);
function J(o, s, h) { return new Response(JSON.stringify(o), { status: s || 200, headers: Object.assign({ "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" }, h || {}) }); }
const enc = s => new TextEncoder().encode(s);
async function sha(s) { const d = await crypto.subtle.digest("SHA-256", enc(s)); return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, "0")).join(""); }
function cookieOf(req, name) { const m = (req.headers.get("cookie") || "").match(new RegExp("(?:^|;\\s*)" + name + "=([^;]*)")); return m ? decodeURIComponent(m[1]) : null; }

// ---------- the academy's own database (5-minute cache) ----------
let BZ = null, BZT = 0, SZ = null, SZT = 0;
async function bank(env) {
  if (BZ && Date.now() - BZT < 300000) return BZ;
  const [v, q] = await env.DB.batch([
    env.DB.prepare("SELECT v, sort, access, title, note, released FROM academy_versions ORDER BY sort DESC"),
    env.DB.prepare("SELECT v, grade, title, blurb, qs FROM academy_quiz ORDER BY v, grade")]);
  const V = (v.results || []).map(r => ({ v: r.v, access: r.access, title: r.title, note: r.note, released: r.released, grades: [] }));
  (q.results || []).forEach(r => { const x = V.find(y => y.v === r.v); if (x) x.grades.push({ n: r.grade, title: r.title, blurb: r.blurb, qs: JSON.parse(r.qs) }); });
  V.forEach(x => { x.questions = x.grades.reduce((a, g) => a + g.qs.length, 0); });
  BZ = V; BZT = Date.now(); return V;
}
// citations: the central catalogue (core_items) first, the derived academy_sources row only where the catalogue has no public row
const tidy = t => String(t || "").replace(/not yet held/gi, "not yet disclosed").replace(/family[- ]held/gi, "not yet disclosed");
async function sources(env) {
  if (SZ && Date.now() - SZT < 300000) return SZ;
  const r = await env.DB.prepare("SELECT s.id, s.title st, s.url su, c.title ct, c.page cp, c.date_sort ds, c.date_display dd, c.kind ck FROM academy_sources s LEFT JOIN core_items c ON c.id = s.id AND c.public = 1").all();
  const M = {};
  (r.results || []).forEach(x => {
    const ct = x.ct && !BANNED.test(x.ct) ? tidy(x.ct) : "";
    M[x.id] = { id: x.id, t: ct || tidy(x.st), u: x.cp ? SITE + x.cp : (x.su || SITE + "/api/catalogue/" + x.id), date: x.ds || "", dd: x.dd || "", from: ct ? "core_items" : "academy_sources" };
  });
  SZ = M; SZT = Date.now(); return M;
}
const cite = (SM, s) => (s || []).map(x => { const id = typeof x === "string" ? x : x.id; const m = SM[id]; return m ? { id, t: m.t, u: m.u } : { id, t: "", u: SITE + "/api/catalogue/" + id }; });

// ---------- access ----------
const ALPHA = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
function normCode(c) { let s = String(c || "").toUpperCase().replace(/[^0-9A-Z]/g, ""); if (s.length === 15 && s.startsWith("ACD")) s = s.slice(3); if (s.length !== 12 || [...s].some(ch => ALPHA.indexOf(ch) < 0)) return null; return "ACD-" + s.slice(0, 4) + "-" + s.slice(4, 8) + "-" + s.slice(8); }
function newCode() { const out = []; while (out.length < 12) { const b = crypto.getRandomValues(new Uint8Array(16)); for (const x of b) if (x < 248 && out.length < 12) out.push(ALPHA[x % 31]); } const s = out.join(""); return "ACD-" + s.slice(0, 4) + "-" + s.slice(4, 8) + "-" + s.slice(8); }
const codeLive = r => r && !r.revoked && (r.status === "active" || r.status === "trialing");
async function codeRow(env, code) { return code ? await env.DB.prepare("SELECT code, status, revoked, test FROM academy_codes WHERE code = ?").bind(code).first() : null; }
async function limited(env, req, max) {   // max tries per 10 minutes per visitor (salted hash of the address; the address itself is never stored)
  const ip = req.headers.get("cf-connecting-ip") || "0", win = Math.floor(Date.now() / 600000), k = (await sha("acd|" + win + "|" + ip)).slice(0, 32);
  const r = await env.DB.prepare("INSERT INTO academy_tries(k,n,t) VALUES(?,1,?) ON CONFLICT(k) DO UPDATE SET n=n+1 RETURNING n").bind(k, win).first();
  if (Math.random() < 0.02) await env.DB.prepare("DELETE FROM academy_tries WHERE t < ?").bind(win - 6).run();
  return r && r.n > max;
}
async function memberOf(req, env) {
  const code = normCode(cookieOf(req, "academy_c"));
  if (code) { const r = await codeRow(env, code); if (codeLive(r)) return { member: true, plan: "code", code }; }
  const ck = req.headers.get("cookie") || "";
  if (!/(?:^|;\s*)cedwyn_m=/.test(ck) || !env.API) return { member: false };
  try { const r = await env.API.fetch(new Request(SITE + "/api/member", { headers: { cookie: ck } })); return await r.json(); } catch (e) { return { member: false, error: true }; }
}
async function ownCode(req, env, m) {   // a paying member's own code: the checkout session in their signed cookie (already verified by cedwyn-api)
  if (!m || !m.member || m.plan !== "academy-monthly") return null;
  const cs = String(cookieOf(req, "cedwyn_m") || "").split(".")[0];
  if (!/^cs_(live|test)_[A-Za-z0-9]{10,200}$/.test(cs)) return null;
  const r = await env.DB.prepare("SELECT code, status, revoked FROM academy_codes WHERE cs_hash = ?").bind(await sha("cs|" + cs)).first();
  return codeLive(r) ? r.code : null;
}
async function issueCode(env, cs, sub, source, amount, currency) {
  const h = await sha("cs|" + cs);
  if (await env.DB.prepare("SELECT code FROM academy_codes WHERE cs_hash = ?").bind(h).first()) return null;
  for (let i = 0; i < 5; i++) {
    const code = newCode();
    try { await env.DB.prepare("INSERT INTO academy_codes(code, cs_hash, sub, status, amount, currency, created, source, test, revoked, uses) VALUES (?,?,?,?,?,?,?,?,0,0,0)").bind(code, h, sub || null, "active", amount || null, currency || null, new Date().toISOString(), source).run(); return code; }
    catch (e) { if (!/UNIQUE/.test(String(e)) || /cs_hash/.test(String(e))) throw e; }
  }
  return null;
}
function hex(buf) { return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join(""); }
async function stripeHook(req, env) {   // ready for the day the webhook secret exists: Stripe signs, we verify, then issue/refresh codes
  if (!env.STRIPE_WHSEC) return J({ error: "not configured" }, 503);
  const body = await req.text(), sig = req.headers.get("stripe-signature") || "";
  const t = (/(?:^|,)t=(\d+)/.exec(sig) || [])[1], v1 = [...sig.matchAll(/(?:^|,)v1=([0-9a-f]{64})/g)].map(m => m[1]);
  if (!t || !v1.length || Math.abs(Date.now() / 1000 - +t) > 300) return J({ error: "bad signature" }, 400);
  const key = await crypto.subtle.importKey("raw", enc(env.STRIPE_WHSEC), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = hex(await crypto.subtle.sign("HMAC", key, enc(t + "." + body)));
  if (!v1.includes(mac)) return J({ error: "bad signature" }, 400);
  let ev; try { ev = JSON.parse(body); } catch (e) { return J({ error: "bad body" }, 400); }
  const o = (ev.data || {}).object || {};
  if (ev.type === "checkout.session.completed" && o.payment_link === PLINK && o.mode === "subscription" && o.payment_status === "paid" && (o.amount_total || 0) > 0 && o.subscription)
    await issueCode(env, o.id, o.subscription, "webhook", o.amount_total, o.currency);
  if (/^customer\.subscription\.(updated|deleted)$/.test(ev.type || "") && o.id)
    await env.DB.prepare("UPDATE academy_codes SET status = ?, period_end = ? WHERE sub = ?").bind(ev.type.endsWith("deleted") ? "canceled" : String(o.status || "unknown"), o.current_period_end || null, o.id).run();
  return J({ received: true });
}
function learner(req) {
  const m = (req.headers.get("cookie") || "").match(/(?:^|;\s*)academy_l=(A[0-9a-f]{32})(?:;|$)/);
  if (m) return { id: m[1], set: null };
  const id = "A" + [...crypto.getRandomValues(new Uint8Array(16))].map(x => x.toString(16).padStart(2, "0")).join("");
  return { id, set: "academy_l=" + id + "; Path=/; Max-Age=" + 400 * 86400 + "; Secure; HttpOnly; SameSite=Lax" };
}
const sameQs = (a, b) => a.qs.map(q => q.id).join("|") === b.qs.map(q => q.id).join("|");
async function state(req, env, vn, pre) {
  const [V, m] = pre || await Promise.all([bank(env), memberOf(req, env)]);
  const L = learner(req), ver = V.find(x => x.v === vn) || null;
  if (!ver) return { L, m, V, ver };
  const rows = (await env.DB.prepare("SELECT v, grade, attempt, answers, answered, correct, total, passed, best_pct FROM academy_progress WHERE learner = ?").bind(L.id).all()).results || [];
  const P = {}; rows.forEach(r => { P[r.v + "|" + r.grade] = r; });
  const mem = !!(m && m.member), open = ver.access === "free" || mem;
  let prev = true;
  const grades = ver.grades.map(g => {
    const p = P[ver.v + "|" + g.n] || {}, total = g.qs.length;
    let passed = p.passed === 1, carried = false;
    if (!passed) for (const o of V) { if (o.v === ver.v) continue; const og = o.grades.find(x => x.n === g.n), op = P[o.v + "|" + g.n]; if (og && op && op.passed === 1 && sameQs(og, g)) { passed = true; carried = true; break; } }
    const unlocked = open && (g.n === ver.grades[0].n || prev);
    const o = { n: g.n, title: g.title, blurb: g.blurb, total, need: need(total), unlocked, why: unlocked ? null : (!open ? "join" : "prev"), answered: p.answered || 0, correct: p.correct || 0, passed, carried, best_pct: p.best_pct || 0, attempt: p.attempt || 1 };
    prev = passed; return o;
  });
  return { L, m, V, ver, P, mem, open, grades };
}
function reveal(q, choice, SM) { return { choice, correct: choice === q.a, a: q.a, x: q.x, v: q.v, vr: q.vr, s: cite(SM, q.s), case: !!q.case, open: !!q.open, from: "catalogue" }; }
function JC(o, s, L, extra) { return J(o, s || 200, Object.assign(L && L.set ? { "set-cookie": L.set } : {}, extra || {})); }
const pubVersions = V => V.map(x => ({ v: x.v, access: x.access, title: x.title, note: x.note, grades: x.grades.length, questions: x.questions }));

async function api(req, env, url) {
  const p = url.pathname.slice(5).replace(/\/$/, "");
  if (p === "versions") return J({ versions: pubVersions(await bank(env)) });
  if (p === "code" && req.method === "POST") {   // redeem an access code: it becomes this browser's key (HttpOnly cookie) while its membership is active
    let b = {}; try { b = JSON.parse((await req.text()).slice(0, 500)); } catch (e) {}
    if (await limited(env, req, 5)) return J({ ok: false, error: "slow_down" }, 429);   // 5 tries per 10 minutes per visitor; the 6th is refused
    const raw = String(b.code || "").toUpperCase().replace(/[^0-9A-Z]/g, "");
    if (/^CDW[0-9A-Z]{12}$/.test(raw)) return J({ ok: false, error: "wrong_product" });   // a documentary code typed here
    const code = normCode(b.code); if (!code) return J({ ok: false, error: "invalid" });
    const r = await codeRow(env, code); if (!r || r.revoked) return J({ ok: false, error: "invalid" });
    if (!codeLive(r)) return J({ ok: false, error: "inactive" });
    await env.DB.prepare("UPDATE academy_codes SET uses = uses + 1, last_used = ? WHERE code = ?").bind(new Date().toISOString(), code).run();
    return J({ ok: true, unlocks: "v0.0.2" }, 200, { "set-cookie": "academy_c=" + code + "; Path=/; Max-Age=" + 400 * 86400 + "; Secure; HttpOnly; SameSite=Lax" });
  }
  if (p === "code/forget" && req.method === "POST") return J({ ok: true }, 200, { "set-cookie": "academy_c=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Lax" });
  if (p === "code/claim" && req.method === "GET") {   // the buyer's own return: ?cs=<checkout session id>, like the documentary's /api/doc/claim
    const cs = url.searchParams.get("cs") || "";
    if (!/^cs_(live|test)_[A-Za-z0-9]{20,200}$/.test(cs)) return J({ status: "invalid" }, 400);
    if (await limited(env, req, 120)) return J({ status: "slow_down" }, 429);
    const r = await env.DB.prepare("SELECT code, status, revoked FROM academy_codes WHERE cs_hash = ?").bind(await sha("cs|" + cs)).first();
    return codeLive(r) ? J({ status: "ready", code: r.code }) : J({ status: "pending" }, 202);
  }
  if (p === "stripe/webhook" && req.method === "POST") return await stripeHook(req, env);
  if (p === "state" || p === "grade") {
    const S = await state(req, env, url.searchParams.get("v") || "");
    if (!S.ver) return JC({ error: "no such version", versions: pubVersions(S.V) }, 404, S.L);
    if (p === "state") return JC({ member: S.mem, plan: S.mem ? S.m.plan : null, version: S.ver.v, access: S.ver.access, open: S.open, pass_pct: PASS_PCT, versions: pubVersions(S.V), grades: S.grades }, 200, S.L);
    const n = +url.searchParams.get("n"), g = S.ver.grades.find(x => x.n === n), st = S.grades.find(x => x.n === n);
    if (!g) return JC({ error: "not found" }, 404, S.L);
    if (!st.unlocked) return JC({ locked: true, why: st.why, v: S.ver.v, n, title: g.title, blurb: g.blurb, total: g.qs.length }, 200, S.L);
    const SM = await sources(env), ans = JSON.parse((S.P[S.ver.v + "|" + n] || {}).answers || "{}"), R = {};
    g.qs.forEach(q => { if (q.id in ans) R[q.id] = reveal(q, ans[q.id], SM); });
    const nx = S.grades.find(x => x.n === n + 1);
    return JC({ v: S.ver.v, n, title: g.title, blurb: g.blurb, pass_pct: PASS_PCT, state: st, next: nx ? { n: nx.n, title: nx.title, needs_join: !S.open } : null, qs: g.qs.map(q => ({ id: q.id, q: q.q, o: q.o, open: !!q.open })), answers: R }, 200, S.L);
  }
  if ((p === "answer" || p === "retake") && req.method === "POST") {
    let b = {}; try { b = JSON.parse((await req.text()).slice(0, 2000)); } catch (e) { b = {}; }
    const S = await state(req, env, String(b.v || ""));
    if (!S.ver) return JC({ error: "no such version" }, 404, S.L);
    const n = +b.grade, g = S.ver.grades.find(x => x.n === n), st = S.grades.find(x => x.n === n);
    if (!g) return JC({ error: "not found" }, 404, S.L);
    if (!st.unlocked) return JC({ locked: true, why: st.why }, 403, S.L);
    const key = S.ver.v + "|" + n, row = S.P[key] || null, ans = JSON.parse((row || {}).answers || "{}"), now = new Date().toISOString(), total = g.qs.length;
    const principal = S.mem ? (S.m.plan === "family" ? "family" : S.m.plan === "code" ? "code" : "member") : "preview";
    if (p === "retake") {
      if (row) await env.DB.prepare("UPDATE academy_progress SET attempt = attempt + 1, answers = '{}', answered = 0, correct = 0, updated = ? WHERE learner = ? AND v = ? AND grade = ?").bind(now, S.L.id, S.ver.v, n).run();
      return JC({ ok: true }, 200, S.L);
    }
    const q = g.qs.find(x => x.id === String(b.id || "")), c = +b.choice;
    if (!q || !(c >= 0 && c < q.o.length)) return JC({ error: "bad request" }, 400, S.L);
    if (!(q.id in ans)) ans[q.id] = c;
    const answered = Object.keys(ans).filter(k => g.qs.some(x => x.id === k)).length;
    const correct = g.qs.filter(x => x.id in ans && ans[x.id] === x.a).length;
    const done = answered >= total, pct = Math.round(100 * correct / total), passNow = done && correct >= need(total);
    const passed = (row && row.passed === 1) || passNow ? 1 : 0, best = done ? Math.max(pct, (row && row.best_pct) || 0) : ((row && row.best_pct) || 0);
    await env.DB.prepare("INSERT INTO academy_progress(learner, v, grade, attempt, answers, answered, correct, total, passed, best_pct, passed_at, principal, updated) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?) " +
      "ON CONFLICT(learner, v, grade) DO UPDATE SET answers = excluded.answers, answered = excluded.answered, correct = excluded.correct, total = excluded.total, passed = MAX(academy_progress.passed, excluded.passed), best_pct = MAX(academy_progress.best_pct, excluded.best_pct), passed_at = COALESCE(academy_progress.passed_at, excluded.passed_at), principal = excluded.principal, updated = excluded.updated")
      .bind(S.L.id, S.ver.v, n, (row && row.attempt) || 1, JSON.stringify(ans), answered, correct, total, passed, best, passNow ? now : null, principal, now).run();
    const nx = S.grades.find(x => x.n === n + 1), SM = await sources(env);
    return JC({ ok: true, r: reveal(q, ans[q.id], SM), progress: { answered, correct, total, need: need(total), done, pct, passed: passed === 1 || st.passed, pass_now: passNow, next: nx ? { n: nx.n, title: nx.title, needs_join: !S.open } : null } }, 200, S.L);
  }
  return J({ error: "not found" }, 404);
}
async function viaApi(req, env, path, body) {
  const h = new Headers(); ["cookie", "content-type", "cf-connecting-ip", "user-agent"].forEach(k => { const v = req.headers.get(k); if (v) h.set(k, v); });
  const r = await env.API.fetch(new Request(SITE + path, { method: req.method, headers: h, body: body != null ? body : (req.method === "POST" ? await req.text() : undefined) }));
  const out = new Headers({ "content-type": r.headers.get("content-type") || "application/json", "cache-control": "no-store" });
  const sc = r.headers.get("set-cookie"); if (sc) out.set("set-cookie", sc);
  return new Response(r.body, { status: r.status, headers: out });
}
async function beacon(req, env) {
  let t = (await req.text()).slice(0, 4000);
  try { const o = JSON.parse(t); o.p = "/_academy" + String(o.p || "/").slice(0, 300); t = JSON.stringify(o); } catch (e) { return new Response(null, { status: 204 }); }
  try { await viaApi(req, env, "/api/a", t); } catch (e) {}
  return new Response(null, { status: 204 });
}

// ---------- the shared Cedwyn files, same-origin; the header graph from this app's own db ----------
async function shared(req, url, ctx) {
  const r = await fetch(SITE + url.pathname + url.search, { method: req.method === "HEAD" ? "HEAD" : "GET", cf: { cacheTtl: 3600, cacheEverything: true } });
  const h = new Headers(); ["content-type", "etag", "last-modified"].forEach(k => { const v = r.headers.get(k); if (v) h.set(k, v); });
  h.set("cache-control", "public, max-age=3600"); h.set("access-control-allow-origin", ORIGIN); h.set("x-cedwyn-shared", "cedwyn.bucklerfamily.estate");
  return new Response(r.body, { status: r.status, headers: h });
}
function xdate(s) { s = String(s || ""); if (!/^(1\d{3}|20\d\d)/.test(s)) return null; let m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(s); if (!m) return /^\d{4}/.test(s) ? s.slice(0, 4) : null; if (m[2] === "00") return m[1]; if (m[3] === "00") return m[1] + "-" + m[2]; return s; }
async function graph(env) {
  const [V, SM] = await Promise.all([bank(env), sources(env)]);
  const full = V.find(x => x.access !== "free") || V[0], free = new Set(); V.filter(x => x.access === "free").forEach(x => x.grades.forEach(g => free.add(g.n)));
  const cats = full.grades.map(g => /^Grade \d/.test(g.title) ? g.title : "Grade " + g.n + " · " + g.title), pts = [], seen = new Set();
  full.grades.forEach((g, gi) => g.qs.forEach(q => (q.s || []).forEach(x => { const id = typeof x === "string" ? x : x.id, s = SM[id], k = g.n + "|" + id; if (!s || seen.has(k)) return; const d = xdate(s.date); if (!d) return; seen.add(k);
    pts.push([d, gi, free.has(g.n) ? 0 : 1, "Grade " + g.n + " cites " + id + (s.t ? " · " + s.t.slice(0, 90) : ""), s.u]); })));
  pts.sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] - b[1]);
  return { v: 1, area: "academy", title: "Cedwyn Academy: records the questionnaires cite", source: "academy.bucklerfamily.estate own db (academy_quiz citations) with dates from the central catalogue (core_items)", x: { label: "Date of the record", type: "date" }, y: { label: "Grade", type: "cat", cats }, c: { label: "Version", cats: ["v0.0.1 free and v0.0.2", "v0.0.2 members"] }, p: pts };
}

// ---------- pages: A2UI surfaces ----------
const C = (id, component, props) => Object.assign({ id, component }, props || {});
const INFO_VERSIONS = ["The questionnaires carry version numbers, like the e-books. Each version is a fixed set of questions; the newest is at the top of the list.", "v0.0.2 is the full set: seven grades and 85 questions, from the farm and its names to the open questions. It comes with the membership (£49.99 a month), a member's access code or a family code.", "v0.0.1 is the free set: Grade 1, The farm and its names, 12 questions. No sign-in and nothing to pay.", "A pass of Grade 1 in either version counts in the other. Older versions, once there are any, are listed as -v0.0.2, -v0.0.3 and so on."];
const INFO_HOW = ["Each grade is a questionnaire. Choose an answer and lock it in. Once a question is answered, Reveal answer shows the correct answer, a short explanation and the catalogue source.", "Answers lock once given. Score 90% or more to pass the grade and unlock the next one. You can retake a grade as often as you like; a pass stays passed.", "Every question is built from the evidence catalogue and cites its IDs (EV, MR, PE); the titles and links come from the central catalogue. Quotes are verbatim. Points marked as our case are prospective, not findings of any court.", "Progress is kept in this browser."];
const INFO_CODE = ["Every paid Academy membership (£49.99 a month) comes with an access code, ACD- and twelve letters and numbers. It is shown on this page in the browser you paid with.", "Enter it in any other browser or device to open v0.0.2 there. It works while the membership is active and stops when it ends.", "Family codes (CEDWYN-FAMILY-…) go in the family code box instead."];
function verOpts(V) { return V.map(x => ({ v: x.v, label: x.v + " — " + (x.access === "free" ? "free" : "£49.99 a month (members)"), href: "/" + x.v + "/", start: "Start " + x.v + (x.access === "free" ? " · free" : "") })); }
function memberLine(m, own) {
  if (!m) return "";
  if (m.member) return m.plan === "family" ? "Family code active in this browser: every version is open." : m.plan === "code" ? "Access code active in this browser: every version is open." : "You are a member: every version is open." + (own ? "" : " Your access code appears here once your payment is confirmed.");
  if (m.pending) return "Your membership is being confirmed. Every version opens, and your access code appears here, as soon as the payment is confirmed.";
  return "";
}
function codeBox(id, own, after) { return C(id, "CodeBox", { own: own || null, heading: "Have an access code?", lead: "Members get an access code with their subscription. Enter it to open v0.0.2 in this browser.", placeholder: "ACD-XXXX-XXXX-XXXX", note: "Codes come only with a paid membership; nothing is charged here." }); }
function homeSurface(V, m, own) {
  const sel = (V[0] || {}).v || "", mem = !!(m && m.member);
  const comps = [
    C("root", "Page", { children: ["kick", "h1", "lead", "vcard", "mnow", "own", "inc", "join", "code", "fam", "course", "small"] }),
    C("kick", "Kicker", { text: "Cedwyn Academy" }),
    C("h1", "Heading", { level: 1, text: "Learn the Great House Farm case, record by record", className: "ghf-keep-case" }),
    C("lead", "Text", { className: "ac-lead", text: "A course on Tŷ Mawr (Great House Farm), Llandough: what the records show, in what order, and where the gaps are. It runs as graded questionnaires built from the evidence catalogue: answer, reveal the answer and its source, and score 90% to move up." }),
    C("vcard", "Card", { domId: "versions", children: ["vh", "vsel", "vnote"] }),
    C("vh", "Heading", { level: 2, text: "Questionnaires", children: ["vinfo"] }),
    C("vinfo", "InfoButton", { label: "About the versions", title: "Questionnaire versions", body: INFO_VERSIONS }),
    C("vsel", "VersionSelect", { options: { path: "/versions" }, selected: { path: "/selected" }, go: true }),
    C("vnote", "Text", { className: "ac-mut", text: "v0.0.1 (Grade 1) is free to play with no sign-in." }),
    C("mnow", "Notice", { text: { path: "/memberLine" } }),
    C("own", "CodeBox", { when: { path: "/own" }, own: { path: "/own" } }),
    C("inc", "Section", { heading: "Included while you are a member", children: ["incl"] }),
    C("incl", "TextList", { items: ["Questionnaires v0.0.2: all seven grades, 85 questions, and every newer version as it is released.", "An access code that opens the Academy on any of your devices.", "The latest version of each Cedwyn e-book, free.", "The latest documentary scenes, free.", "New missing-record findings and institution replies, explained as they are catalogued.", "Founding members help shape the course and join the first live sessions."] }),
    C("join", "JoinCard", { when: { path: "/notMember" }, price: "£49.99 a month", href: JOIN, carry: SITE + "/learn/carry?to=/v0.0.2/",
      points: ["£49.99 is taken every month until you cancel.", "The first payment is taken today. The least you will pay is £49.99.", "No free trial and no annual plan. The free questionnaire set (v0.0.1) is open to everyone.", "Cancel online at any time from Stripe's billing page, linked at the bottom of every Academy page. Access runs to the end of the month you have paid for."],
      ticks: ["I'm starting a £49.99/month subscription, charged every month until I cancel.", "Give me access straight away. I understand I lose my 14-day right to cancel once I start using the course content."] }),
    Object.assign(codeBox("code"), { when: { path: "/notMember" } }),
    C("fam", "FamilyCode", { when: { path: "/notMember" } }),
    C("course", "Section", { heading: "The course", children: ["mods"] }),
    C("mods", "TextList", { ordered: true, items: { path: "/course" } }),
    C("small", "RichText", { runs: [{ text: "Start smaller: every e-book's first edition is free, and the next edition of each is £4.99. " }, { text: "See the e-books", href: SITE + "/ebooks/" }, { text: "." }] })];
  const model = { versions: verOpts(V), selected: sel, memberLine: memberLine(m, own), own: own || null, notMember: !mem,
    course: [{ b: "The place and its names", text: "Cedwyn, Cwm Cedwyn and Tŷ Mawr: the place-name record from 1392 onwards, and how the farm sits in Llandough parish." }, { b: "The family", text: "The Williams and Buckler family across the generations, from the 1667 acquisition reported in the press to 1988." }, { b: "Reading the evidence catalogue", text: "How each record is identified (EV and GHF-E numbers), graded and sourced, and how to tell a disclosed record from one that has not yet been disclosed." }, { b: "The timeline", text: "The 1877 agreement, the 1916 and 1939 tenancies, the 1955 and 1962 possession orders and the 1974 licence letters, in order." }, { b: "BP Properties Ltd v Buckler (1987)", text: "The Court of Appeal judgment, the twelve-year rule and the questions the records raise about it." }, { b: "Missing records", text: "The register of documents that should exist by statute, practice or cross-reference but have not been disclosed, and which party should hold each." }, { b: "Disclosure", text: "Freedom of information and subject access requests: what was asked, who answered, who did not, and the deadlines." }, { b: "Recorded incidents", text: "The incidents and deaths in the record, set out by date and source." }, { b: "Doing the research", text: "How the editors and research agents work: the editing protocol, page versions and how a new record joins the catalogue." }] };
  return surface("academy-home", comps, model);
}
function gradeAction(S, g) {
  const v = S.ver.v;
  if (g.unlocked) return { text: g.passed ? "Open again" : g.answered ? "Carry on" : "Start Grade " + g.n, href: "/" + v + "/grade/" + g.n + "/", cls: g.passed ? "sec" : "" };
  if (g.why === "join") return { text: "Subscribe · £49.99 a month", href: "/#join", cls: "sec" };
  return null;
}
function gradeStatus(g) {
  if (g.passed) return [g.carried ? "Passed (in another version)" : "Passed · best " + g.best_pct + "%", "ok", "is-passed"];
  if (!g.unlocked) return [g.why === "join" ? "Opens with a membership, an access code or a family code" : "Opens when you pass Grade " + (g.n - 1) + " with 90% or more", "lock", "is-locked"];
  if (g.answered) return ["Answered " + g.answered + " of " + g.total + " · pass mark " + g.need + " of " + g.total, "", ""];
  return [g.total + " questions · pass mark " + g.need + " of " + g.total + " (90%)", "", ""];
}
function ladderSurface(S, own) {
  const v = S.ver.v;
  const comps = [
    C("root", "Page", { children: ["crumb", "h1", "vsel", "note", "mnow", "own", "lock", "list"] }),
    C("crumb", "Link", { href: "/", text: "‹ Cedwyn Academy", className: "ac-mut" }),
    C("h1", "Heading", { level: 1, text: "Questionnaires", className: "ghf-keep-case", children: ["vtag", "how", "vinfo"] }),
    C("vtag", "Badge", { text: v, className: S.ver.access === "free" ? "free" : "" }),
    C("how", "InfoButton", { label: "How grading works", title: "How grading works", body: INFO_HOW }),
    C("vinfo", "InfoButton", { label: "About the versions", title: "Questionnaire versions", body: INFO_VERSIONS }),
    C("vsel", "VersionSelect", { options: { path: "/versions" }, selected: { path: "/selected" }, go: false }),
    C("note", "Text", { className: "ac-lead", text: { path: "/note" } }),
    C("mnow", "Notice", { text: { path: "/memberLine" } }),
    C("own", "CodeBox", { when: { path: "/own" }, own: { path: "/own" } }),
    C("lock", "LockCard", { when: { path: "/locked" }, text: { fmt: "{v} comes with the Cedwyn Academy membership (£49.99 a month), a member's access code or a family code.", args: { v: { path: "/v" } } }, children: ["lockrow", "lockcode"] }),
    C("lockrow", "Row", { children: ["lockjoin", "lockfree"] }),
    C("lockjoin", "Link", { href: "/#join", text: "Subscribe · £49.99 a month", className: "ac-btn" }),
    C("lockfree", "Link", { href: "/v0.0.1/", text: "Try v0.0.1, the free set", className: "ac-btn sec" }),
    codeBox("lockcode"),
    C("list", "GradeList", { children: { path: "/grades", componentId: "grade" } }),
    C("grade", "GradeCard", { n: { path: "n" }, title: { path: "title" }, blurb: { path: "blurb" }, status: { path: "status" }, stClass: { path: "stClass" }, statusClass: { path: "cls" }, action: { path: "action" } })];
  const model = { v, note: S.ver.note, versions: verOpts(S.V), selected: v, memberLine: memberLine(S.m, own), own: own || null, locked: !S.open,
    grades: S.grades.map(g => { const [st, sc, cl] = gradeStatus(g); return { n: g.n, title: g.title, blurb: g.blurb, status: st, stClass: sc, cls: cl, action: gradeAction(S, g) }; }) };
  return surface("academy-ladder-" + v, comps, model);
}
function quizSurface(S, g, st) {
  const v = S.ver.v, locked = !st.unlocked;
  const comps = [
    C("root", "Page", { children: ["crumb", "h1", "blurb", "lock", "prev", "qz"] }),
    C("crumb", "Link", { href: "/" + v + "/", text: "‹ Questionnaires " + v, className: "ac-mut" }),
    C("h1", "Heading", { level: 1, text: { path: "/title" }, className: "ghf-keep-case", children: ["vtag", "how"] }),
    C("vtag", "Badge", { text: v, className: S.ver.access === "free" ? "free" : "" }),
    C("how", "InfoButton", { label: "How grading works", title: "How grading works", body: INFO_HOW }),
    C("blurb", "Text", { className: "ac-lead", text: { path: "/blurb" } }),
    C("lock", "LockCard", { when: { path: "/needJoin" }, text: { fmt: "This questionnaire is part of {v}, which comes with the Cedwyn Academy membership (£49.99 a month), a member's access code or a family code.", args: { v: { path: "/v" } } }, children: ["lockrow", "lockcode"] }),
    C("lockrow", "Row", { children: ["lockjoin", "lockfree"] }),
    C("lockjoin", "Link", { href: "/#join", text: "Subscribe · £49.99 a month", className: "ac-btn" }),
    C("lockfree", "Link", { href: "/v0.0.1/", text: "Try v0.0.1, the free set", className: "ac-btn sec" }),
    codeBox("lockcode"),
    C("prev", "LockCard", { domId: "prevlock", when: { path: "/needPrev" }, text: { fmt: "Pass Grade {p} with 90% or more to open this grade.", args: { p: { path: "/prevN" } } }, children: ["prevgo"] }),
    C("prevgo", "Link", { href: { path: "/prevHref" }, text: { fmt: "Go to Grade {p}", args: { p: { path: "/prevN" } } }, className: "ac-btn" }),
    C("qz", "Questionnaire", { when: { path: "/open" }, v, n: g.n })];
  const model = { v, n: g.n, title: g.title, blurb: g.blurb, total: g.qs.length, open: !locked, needJoin: locked && st.why === "join", needPrev: locked && st.why === "prev", prevN: g.n - 1, prevHref: "/" + v + "/grade/" + (g.n - 1) + "/" };
  return surface("academy-grade-" + v + "-" + g.n, comps, model);
}
function journalHtml() {
  return '<style id="cedwyn-journal-css">#cedwyn-journal{max-width:960px;margin:24px auto 8px;padding:0 16px;font:12px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;opacity:.72;color:inherit}#cedwyn-journal summary{cursor:pointer;letter-spacing:.06em;text-transform:uppercase;font-size:11px}#cedwyn-journal ol{margin:6px 0 0;padding-left:18px}#cedwyn-journal li{margin:2px 0}#cedwyn-journal b{font-weight:600}</style>' +
    '<details id="cedwyn-journal" class="cw-journal"><summary>Page journal</summary><ol>' + JOURNAL.map(r => "<li><b>" + esc(r.v) + "</b> · " + esc(r.date) + " — " + esc(r.note) + "</li>").join("") + "</ol></details>";
}
function page(msgs, o) {
  const sid = msgs[0].createSurface.surfaceId, body = render(msgs);
  const title = "Cedwyn Academy · " + o.title;   // the shared header shows the part before the first " · " as the webapp title
  const html = '<!doctype html><html lang="en" data-ghf-native="dark" data-ghf-theme-default="night" data-cw-nolevels><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(title) + '</title><meta name="description" content="' + esc(o.desc) + '"><link rel="canonical" href="' + ORIGIN + o.canon + '">' +
    (o.noindex ? '<meta name="robots" content="noindex">' : "") +
    '<meta name="generator" content="cedwyn-academy-a2ui/' + APP_V + ' (A2UI v0.9 surface ' + esc(sid) + ')"><link rel="alternate" type="application/json" href="' + esc(o.ui) + '" title="A2UI surface of this page">' +
    '<meta property="og:title" content="' + esc(title) + '"><meta property="og:site_name" content="Williams-Bucklers, Ty Mawr, Cedwyn"><meta property="og:type" content="website"><meta property="og:url" content="' + ORIGIN + o.canon + '"><meta property="og:description" content="' + esc(o.desc) + '"><meta property="og:image" content="' + SITE + '/_cedwyn/og/share-academy.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="' + SITE + '/_cedwyn/og/share-academy.jpg"><meta name="theme-color" content="#000000">' +
    '<style>' + CSS + '</style><script src="/_cedwyn/ghf/ghf-lang.js?v=2.1.6" data-dict="/_cedwyn/ghf/sites/estate.json" defer></script><script src="/_cedwyn/ghf/ghf-boot.js?v=' + GHF_V + '"></script></head><body>' +
    body + '<footer class="ac-ft"><p>Members: <a href="' + BILLING + '" rel="nofollow">cancel the membership</a> or update payment details on Stripe\'s billing page.</p></footer>' + journalHtml() +
    '<script src="/_ui/academy.js?v=' + APP_V + '" defer></script><script>' + BEACON + "</script></body></html>";
  const h = { "content-type": "text/html; charset=utf-8", "cache-control": "private, no-store", "x-robots-tag": o.noindex ? "noindex" : "all" };
  if (o.setCookie) h["set-cookie"] = o.setCookie;
  return new Response(html, { status: o.status || 200, headers: h });
}
function notFound(msg) {
  const msgs = surface("academy-404", [C("root", "Page", { children: ["h1", "go"] }), C("h1", "Heading", { level: 1, text: msg }), C("go", "Link", { href: "/", text: "Go to the Academy", className: "ac-btn" })], {});
  return page(msgs, { title: "Not found", desc: msg, canon: "/", ui: "/_ui/index.a2ui.json", status: 404, noindex: true });
}
// one function per page: returns [surface messages, page options]
async function route(req, env, path) {
  const [V, m] = await Promise.all([bank(env), memberOf(req, env)]);
  if (path === "/") { const own = await ownCode(req, env, m); return [homeSurface(V, m, own), { title: "learn the Great House Farm case", desc: "Graded questionnaires on the Great House Farm (Tŷ Mawr), Llandough case, built from the evidence catalogue. v0.0.1 is free; the full set comes with the £49.99 a month membership.", canon: "/", ui: "/_ui/index.a2ui.json" }]; }
  const mm = /^\/(v\d+\.\d+\.\d+)\/(?:grade\/([1-9])\/)?$/.exec(path); if (!mm) return null;
  const S = await state(req, env, mm[1], [V, m]); if (!S.ver) return null;
  if (!mm[2]) { const own = await ownCode(req, env, m); return [ladderSurface(S, own), { title: "Questionnaires " + S.ver.v, desc: S.ver.note, canon: path, ui: "/_ui" + path + "index.a2ui.json", setCookie: S.L.set }]; }
  const g = S.ver.grades.find(x => x.n === +mm[2]), st = g && S.grades.find(x => x.n === g.n); if (!g) return null;
  return [quizSurface(S, g, st), { title: g.title + " · " + S.ver.v, desc: g.blurb, canon: path, ui: "/_ui" + path.replace(/\/$/, "") + ".a2ui.json", noindex: S.ver.access !== "free", setCookie: S.L.set }];
}
export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url), p = url.pathname;
    try {
      if (url.hostname !== "academy.bucklerfamily.estate" && url.hostname.endsWith("bucklerfamily.estate")) return Response.redirect(ORIGIN + p + url.search, 301);
      if (p.startsWith("/_cedwyn/graph/") && p.endsWith(".json")) return J(await graph(env), 200, { "cache-control": "public, max-age=300", "x-robots-tag": "noindex" });
      if (p.startsWith("/_cedwyn/") && (req.method === "GET" || req.method === "HEAD")) return await shared(req, url, ctx);
      if (p === "/_ui/academy.js") return new Response(CLIENT, { headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "public, max-age=3600" } });
      if (p === "/_ui/catalog.json") return J(CATALOG, 200, { "cache-control": "public, max-age=3600" });
      if (p.startsWith("/_ui/") && p.endsWith(".a2ui.json")) {
        const path = p.slice(4).replace(/index\.a2ui\.json$/, "").replace(/\.a2ui\.json$/, "/");
        const r = await route(req, env, path); return r ? J(r[0], 200, r[1].setCookie ? { "set-cookie": r[1].setCookie } : {}) : J({ error: "not found" }, 404);
      }
      if (p.startsWith("/api/")) {
        if (p === "/api/member") return await viaApi(req, env, "/api/member");
        if (p === "/api/member/family" && req.method === "POST") return await viaApi(req, env, "/api/member/family");
        if (p === "/api/a" && req.method === "POST") return await beacon(req, env);
        return await api(req, env, url);
      }
      if (p === "/robots.txt") return new Response("User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: " + ORIGIN + "/sitemap.xml\n", { headers: { "content-type": "text/plain; charset=utf-8" } });
      if (p === "/sitemap.xml") { const V = await bank(env); const u = ["/"].concat(V.map(x => "/" + x.v + "/")); return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + u.map(x => "<url><loc>" + ORIGIN + x + "</loc></url>").join("") + "</urlset>", { headers: { "content-type": "application/xml; charset=utf-8" } }); }
      if (p === "/join" || p === "/join/" || p === "/subscribe" || p === "/subscribe/") return Response.redirect(ORIGIN + "/#join", 302);
      if (/^\/v\d+\.\d+\.\d+$/.test(p) || /^\/v\d+\.\d+\.\d+\/grade\/[1-9]$/.test(p)) return Response.redirect(ORIGIN + p + "/", 301);
      const r = await route(req, env, p);
      if (!r) return notFound("Page not found");
      return page(r[0], r[1]);
    } catch (e) { return J({ error: "server error", detail: String(e && e.message || e).slice(0, 200) }, 500); }
  }
};

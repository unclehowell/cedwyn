// cedwyn-calendar 0.0.1 — the Cedwyn Calendar webapp at calendar.bucklerfamily.estate (Tab agent, 31 Oct 2026, task 5ec27d7d).
// Source: repo unclehowell/cedwyn, branch `calendar` (worker/). Follows the Cedwyn webapp standard set by the Academy:
//  * Header: the shared Cedwyn files (/_cedwyn/ghf/ghf-lang.js + ghf-boot.js -> basecamp.js, ghf-theme.css, fonts, cw-graph.js), served
//    same-origin by passing /_cedwyn/* through from cedwyn.bucklerfamily.estate. Menu button and webapp title ("Cedwyn Calendar") on one row.
//  * Header graph: /_cedwyn/graph/*.json on this host answers with THIS app's own derived db only (each event by date, source and precision).
//  * Front end: near-A2UI. The page is an A2UI v0.9 surface (ui.js) rendered on the server; published at /_ui/index.a2ui.json, catalog at
//    /_ui/catalog.json. The Calendar component is a mount the browser script (client.txt) draws from /api/events. Footer: the page journal.
//  * Data: central master db = the evidence catalogue (core_items, D1 cedwyn-apps), read at request time with a 5-minute cache. The calendar's
//    own db is derived (derive.js): catalogue rows + the public evidence index + the Master Timeline + the missing-records register. The
//    build-time snapshot (snapshot.json, tools/build_snapshot.mjs) carries the index and timeline rows and is the fallback if D1 cannot answer.
//    No new D1 database (the account is at its limit); this app writes nothing.
import { render, surface, CATALOG } from "./ui.js";
import { build } from "./derive.js";
import SNAP_TEXT from "./snapshot.json";   // uploaded as a text module (the Workers upload API takes no JSON module type)
const SNAP = JSON.parse(SNAP_TEXT);
import CSS from "./style.txt";
import CLIENT from "./client.txt";
const SITE = "https://cedwyn.bucklerfamily.estate";
const ORIGIN = "https://calendar.bucklerfamily.estate";
const APP_V = "0.0.1", GHF_V = "2.1.17";
const JOURNAL = [
  { v: "0.0.1", date: "2026-10-31", note: "Cedwyn Calendar opened as its own webapp: every dated record of the Great House Farm chronology on a calendar, with Day, Week, Month, Year, Compare (years side by side) and Decades views. Shading shows how much of each period is dated in the record and how much is still blank; known gaps from the missing-records register are hatched. Records known only to the month or year sit in bands, never on an invented day." }];
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function J(o, s, h) { return new Response(JSON.stringify(o), { status: s || 200, headers: Object.assign({ "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "access-control-allow-origin": "*" }, h || {}) }); }

// ---------- the calendar's own derived db (5-minute cache) ----------
let EZ = null, EZT = 0;
async function events(env) {
  if (EZ && Date.now() - EZT < 300000) return EZ;
  let items = null, live = false, err = "";
  try {
    if (env.DB) { const r = await env.DB.prepare("SELECT id, kind, title, date_display, date_sort, holder, summary, page, public, data FROM core_items WHERE public = 1").all(); items = r.results || []; live = items.length > 0; }
  } catch (e) { err = String(e && e.message || e).slice(0, 120); }
  if (!live) items = SNAP.items;
  const res = build(items, null, null, { ix: SNAP.ix, tl: SNAP.tl });
  EZ = { v: APP_V, app: "cedwyn-calendar", generated: new Date().toISOString(), catalogue: live ? "live: core_items (D1 cedwyn-apps), cached up to 5 minutes" : "snapshot of " + SNAP.built + (err ? " (D1: " + err + ")" : ""),
    index_and_timeline: "snapshot of " + SNAP.built + " (" + SNAP.source + ")", counts: res.counts, events: res.events };
  EZT = Date.now(); return EZ;
}
function coverage(E) {
  const yrs = new Set(); E.forEach(e => { if (!e.g && e.p !== "span" && e.p !== "decade") yrs.add(+e.s.slice(0, 4)); });
  const n = (a, b) => { let k = 0; for (let y = a; y <= b; y++) if (yrs.has(y)) k++; return k; };
  return { y1900_1988: n(1900, 1988), y1667_2026: n(1667, 2026), y1824_1988: n(1824, 1988) };
}
// ---------- the shared Cedwyn files, same-origin; the header graph from this app's own db ----------
async function shared(req, url) {
  const r = await fetch(SITE + url.pathname + url.search, { method: req.method === "HEAD" ? "HEAD" : "GET", cf: { cacheTtl: 3600, cacheEverything: true } });
  const h = new Headers(); ["content-type", "etag", "last-modified"].forEach(k => { const v = r.headers.get(k); if (v) h.set(k, v); });
  h.set("cache-control", "public, max-age=3600"); h.set("access-control-allow-origin", ORIGIN); h.set("x-cedwyn-shared", "cedwyn.bucklerfamily.estate");
  return new Response(r.body, { status: r.status, headers: h });
}
async function graph(env) {
  const Z = await events(env), cats = ["Evidence catalogue", "Evidence index", "Master Timeline", "Known gap"], pc = ["exact day", "month only", "year only or approximate", "range or decade"];
  const pts = Z.events.map(e => {
    const yi = e.g ? 3 : e.src[0] === "catalogue" ? 0 : e.src[0] === "evidence index" ? 1 : 2;
    const ci = e.p === "day" ? 0 : e.p === "month" ? 1 : e.p === "span" || e.p === "decade" ? 3 : 2;
    return [e.s, yi, ci, (e.ids && e.ids.length ? e.ids[0] + " · " : "") + e.t.slice(0, 90), e.u];
  });
  return { v: 1, area: "calendar", title: "Cedwyn Calendar: every dated record, by date", source: "calendar.bucklerfamily.estate own derived db (/api/events): catalogue, evidence index, Master Timeline, missing-records register", x: { label: "Date", type: "date" }, y: { label: "Source", type: "cat", cats }, c: { label: "Date precision", cats: pc }, p: pts };
}
// ---------- page: one A2UI surface ----------
const C = (id, component, props) => Object.assign({ id, component }, props || {});
const INFO = ["Every dated record in the Great House Farm chronology: the evidence catalogue, the evidence index, the Master Timeline and the missing-records register on cedwyn.bucklerfamily.estate. Tap a record for its date, catalogue ID, any verbatim quote and its evidence page.",
  "Shading shows how much is dated to each day, month or year: dark is blank, brighter gold is more records. A blank cell is part of the chronology not yet reconstructed.",
  "Counting: a day counts when a record is dated to that exact day; a month when a record is dated to that month or to a day in it; a year when any record is dated within it (exact day, month, year only or approximate).",
  "Records known only to the month or the year appear as “Sometime in …” bands above the grid, never on an invented day. Ranges and decades are bands too and are not counted.",
  "Hatched red marks a known gap: a record that should exist for that date (by statute, practice or cross-reference) and has not yet been disclosed by the body that should hold it. Known gaps are not counted as reconstructed.",
  "Swipe left or right to move; pinch, the + and − buttons or the tabs zoom from a single day out to the decades. Tap the title to jump to a year. Compare puts 4 to 32 years side by side; beside each year, + counts records dated to the year only, ~ the ranges that include it, and ▨ its known gaps.",
  "Not shown: undated records, the Llandough Farm series (a different farm) and Bute-estate papers dated before 1824, whose application to Tŷ Mawr is under forensic examination."];
function homeSurface(Z) {
  const cv = coverage(Z.events), dec = {};
  Z.events.forEach(e => { if (e.g) return; const d = Math.floor(+e.s.slice(0, 4) / 10) * 10; if (d < 1660) return; (dec[d] = dec[d] || { n: 0, y: new Set() }).n++; if (e.p !== "span" && e.p !== "decade") dec[d].y.add(+e.s.slice(0, 4)); });
  const rows = Object.keys(dec).sort().map(d => ({ decade: d + "s", n: dec[d].n, years: dec[d].y.size }));
  return surface("calendar-home", [
    C("root", "Page", { children: ["h1", "cal", "fb"] }),
    C("h1", "Heading", { level: 1, className: "cal-h1", text: "Cedwyn Calendar: the Great House Farm chronology" }),
    C("cal", "Calendar", { api: "/api/events", view: "month", date: "1988-12", children: ["info"] }),
    C("info", "InfoButton", { label: "What the shading means", title: "Reading the calendar", body: INFO }),
    C("fb", "Fallback", { rows: { path: "/decades" } })
  ], { app: "cedwyn-calendar", version: APP_V, counts: Z.counts, coverage: cv, decades: rows });
}
function journalHtml() {
  return '<style id="cedwyn-journal-css">#cedwyn-journal{max-width:960px;margin:24px auto 8px;padding:0 16px;font:12px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;opacity:.72;color:inherit}#cedwyn-journal summary{cursor:pointer;letter-spacing:.06em;text-transform:uppercase;font-size:11px}#cedwyn-journal ol{margin:6px 0 0;padding-left:18px}#cedwyn-journal li{margin:2px 0}#cedwyn-journal b{font-weight:600}</style>' +
    '<details id="cedwyn-journal" class="cw-journal"><summary>Page journal</summary><ol>' + JOURNAL.map(r => "<li><b>v" + esc(r.v) + "</b> · " + esc(r.date) + " — " + esc(r.note) + "</li>").join("") + "</ol></details>";
}
function page(msgs, o) {
  const sid = msgs[0].createSurface.surfaceId, body = render(msgs);
  const title = "Cedwyn Calendar · " + o.title;   // the shared header shows the part before the first " · " as the webapp title
  const html = '<!doctype html><html lang="en" data-ghf-native="dark" data-ghf-theme-default="night" data-cw-nolevels><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>' + esc(title) + '</title><meta name="description" content="' + esc(o.desc) + '"><link rel="canonical" href="' + ORIGIN + o.canon + '">' +
    '<meta name="generator" content="cedwyn-calendar-a2ui/' + APP_V + ' (A2UI v0.9 surface ' + esc(sid) + ')"><link rel="alternate" type="application/json" href="' + esc(o.ui) + '" title="A2UI surface of this page">' +
    '<meta property="og:title" content="' + esc(title) + '"><meta property="og:site_name" content="Williams-Bucklers, Ty Mawr, Cedwyn"><meta property="og:type" content="website"><meta property="og:url" content="' + ORIGIN + o.canon + '"><meta property="og:description" content="' + esc(o.desc) + '"><meta name="theme-color" content="#000000">' +
    '<style>' + CSS + '</style><script src="/_cedwyn/ghf/ghf-lang.js?v=2.1.6" data-dict="/_cedwyn/ghf/sites/estate.json" defer></script><script src="/_cedwyn/ghf/ghf-boot.js?v=' + GHF_V + '"></script></head><body>' +
    body + journalHtml() + '<script src="/_ui/calendar.js?v=' + APP_V + '" defer></script></body></html>';
  return new Response(html, { status: o.status || 200, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=60", "x-robots-tag": "all" } });
}
async function route(env, path) {
  if (path !== "/") return null;
  const Z = await events(env);
  return [homeSurface(Z), { title: "the Great House Farm chronology", desc: "Every dated record of the Great House Farm (Tŷ Mawr), Llandough chronology on a calendar: day, week, month, year, years side by side and decades, shaded to show what is reconstructed and what is still blank.", canon: "/", ui: "/_ui/index.a2ui.json" }];
}
export default {
  async fetch(req, env) {
    const url = new URL(req.url); let p = url.pathname;
    try {
      if (url.hostname !== "calendar.bucklerfamily.estate" && url.hostname.endsWith("bucklerfamily.estate") && !p.startsWith("/calendar")) return Response.redirect(ORIGIN + p + url.search, 301);
      if (p.startsWith("/calendar/")) p = p.slice(9) || "/";   // fallback route cedwyn.bucklerfamily.estate/calendar/*
      if (p.startsWith("/_cedwyn/graph/") && p.endsWith(".json")) return J(await graph(env), 200, { "cache-control": "public, max-age=300" });
      if (p.startsWith("/_cedwyn/") && (req.method === "GET" || req.method === "HEAD")) return await shared(req, url);
      if (p === "/_ui/calendar.js") return new Response(CLIENT, { headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "public, max-age=3600" } });
      if (p === "/_ui/catalog.json") return J(CATALOG, 200, { "cache-control": "public, max-age=3600" });
      if (p === "/_ui/index.a2ui.json") { const r = await route(env, "/"); return J(r[0]); }
      if (p === "/api/events") return J(await events(env), 200, { "cache-control": "public, max-age=120" });
      if (p === "/api/health") { const Z = await events(env); return J({ ok: true, v: APP_V, catalogue: Z.catalogue, counts: Z.counts }); }
      if (p === "/robots.txt") return new Response("User-agent: *\nAllow: /\nSitemap: " + ORIGIN + "/sitemap.xml\n", { headers: { "content-type": "text/plain; charset=utf-8" } });
      if (p === "/sitemap.xml") return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>' + ORIGIN + "/</loc></url></urlset>", { headers: { "content-type": "application/xml; charset=utf-8" } });
      const r = await route(env, p);
      if (!r) return Response.redirect(ORIGIN + "/", 302);
      return page(r[0], r[1]);
    } catch (e) { return J({ error: "server error", detail: String(e && e.message || e).slice(0, 200) }, 500); }
  }
};

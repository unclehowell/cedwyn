// derive.js — Cedwyn Calendar's derived events db (Tab agent, 31 Oct 2026, task 5ec27d7d). One source of truth for the build
// (tools/build_snapshot.mjs, node) and the Worker (request time). Inputs are only cedwyn.bucklerfamily.estate's own public data:
// the master evidence catalogue (core_items / /api/catalogue), the public evidence index (/research/evidence/), the Master Timeline
// (/research/timeline/) and the missing-records register (missing_record rows of the catalogue).
export const SITE = "https://cedwyn.bucklerfamily.estate";
const MON = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12 };
const pad = n => String(n).padStart(2, "0");
const iso = (y, m, d) => String(y).padStart(4, "0") + (m ? "-" + pad(m) + (d ? "-" + pad(d) : "") : "");
export function decode(s) {
  return String(s == null ? "" : s).replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/&#8217;|&rsquo;/g, "’").replace(/&#8216;|&lsquo;/g, "‘")
    .replace(/&#8220;|&ldquo;/g, "“").replace(/&#8221;|&rdquo;/g, "”").replace(/&#8211;|&ndash;/g, "–").replace(/&#8212;|&mdash;/g, "—").replace(/&#8230;|&hellip;/g, "…")
    .replace(/&nbsp;|&#160;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#039;|&#39;/g, "'")
    .replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (m, n) => String.fromCodePoint(parseInt(n, 16))).replace(/\s+/g, " ").trim();
}
// ---- dates: precision-honest ----
// returns {s, p, e?} : s = start (YYYY, YYYY-MM or YYYY-MM-DD), p = day | month | year | circa | decade | span, e = end of a span
const TOK = /(?:(\d{1,2})(?:st|nd|rd|th)?\s+)?(?:(jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nov|dec)[a-z]*\.?,?\s+)?(\d{4}|\d{3}\?)(?![\d])/i;
function tok(str) {
  const m = TOK.exec(str); if (!m) return null;
  if (/\?$/.test(m[3])) return { y: +(m[3].slice(0, 3) + "0"), dec: true, idx: m.index, len: m[0].length };
  const y = +m[3], mo = m[2] ? MON[m[2].toLowerCase().slice(0, m[2].toLowerCase().startsWith("sep") ? 3 : 3)] : 0, d = m[1] && mo ? +m[1] : 0;
  return { y, m: mo, d, idx: m.index, len: m[0].length };
}
function isoDate(str) { const m = /^(\d{4})(?:-(\d\d))?(?:-(\d\d))?$/.exec(str.trim()); if (!m) return null; const y = +m[1], mo = +(m[2] || 0), d = +(m[3] || 0); if (!y) return null; return { y, m: mo, d }; }
const prec = t => t.dec ? "decade" : t.d ? "day" : t.m ? "month" : "year";
export function parseDate(raw) {
  let s = decode(raw); if (!s) return null;
  if (/^(undated|not stated|unknown|n\.?d\.?)\b/i.test(s)) return null;
  const circa = /^(c\.|c\s|ca\.|circa|about|around|on or about|approx)/i.test(s) || /^\w+ c\./i.test(s);
  let s0 = s.replace(/\(.*?\)/g, " ").replace(/\b(on or about|c\.|ca\.|circa|about|around|approx\.?|before|after|by|from|dated|reported|reports|hearing|judgment)\b/gi, " ").replace(/\s+/g, " ").trim();
  // ISO forms 1916-02, 1938-12-25, ranges 1982-11-30 to 1983-05, 1988-10 to 1988-11
  let mi = /^(\d{4}(?:-\d\d){0,2})(?:\s*(?:to|–|—)\s*(\d{4}(?:-\d\d){0,2}))?$/.exec(s0);
  if (mi) { const a = isoDate(mi[1]); if (!a) return null; const out = { s: iso(a.y, a.m, a.d), p: circa ? "circa" : prec(a) }; if (mi[2]) { const b = isoDate(mi[2]); if (b) { out.e = iso(b.y, b.m, b.d); out.p = "span"; } } return out; }
  // decade "1950s"
  let md = /^(\d{3}0)s\b/.exec(s0); if (md) return { s: md[1], p: "decade" };
  // spans: A – B (B may be partial: "84", "15 May 1897" after "6", "Aug 1894" after "Jul")
  const s1 = s0.split(/[;,]| and /)[0].trim().replace(/^(\d{1,2})\/(\d{1,2}\s)/, "$1–$2").split(/\s\/\s|\//)[0].trim();
  const sp = /^(.{1,24}?)\s*(?:–|—|-|\bto\b)\s*(.{2,24})$/.exec(s1);
  if (sp) {
    const B = tok(sp[2]);
    let A = tok(sp[1]);
    if (B && !A) {   // "6–15 May 1897", "Jul–Aug 1894", "29/30 Nov 1988"
      const a1 = sp[1].trim(), dm = /^(\d{1,2})$/.exec(a1), mm = /^(jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nov|dec)[a-z]*$/i.exec(a1), dmm = /^(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nov|dec)[a-z]*$/i.exec(a1);
      if (dm && B.d) A = { y: B.y, m: B.m, d: +dm[1] }; else if (mm && B.m) A = { y: B.y, m: MON[mm[1].toLowerCase().slice(0, 3)], d: 0 }; else if (dmm) A = { y: B.y, m: MON[dmm[2].toLowerCase().slice(0, 3)], d: +dmm[1] };
    }
    if (!B && A && /^\d{2}$/.test(sp[2].trim())) { const yy = Math.floor(A.y / 100) * 100 + +sp[2].trim(); if (yy > A.y) return { s: iso(A.y), p: "span", e: iso(yy) }; }
    if (A && B && !A.dec && !B.dec && (B.y > A.y || (B.y === A.y && (B.m > A.m || B.d > A.d)))) return { s: iso(A.y, A.m, A.d), p: "span", e: iso(B.y, B.m, B.d) };
  }
  const early = /^(?:c\.?|ca\.?|circa|AD)?\s*(\d{3})\b(?!\d)/i.exec(s);   // "c. 650": an early date, year-level at best
  if (early && !/\d{4}/.test(s0.slice(0, 8))) return { s: iso(+early[1]), p: circa || /^c/i.test(s) ? "circa" : "year" };
  const t = tok(s0) || tok(s); if (!t) return null;
  if (t.y < 1000 || t.y > 2100) return null;
  if (t.dec) return { s: iso(t.y), p: "decade" };
  return { s: iso(t.y, t.m, t.d), p: circa ? "circa" : prec(t) };
}
// catalogue rows carry date_sort (YYYY-MM-DD with 00 for unknown parts); the display text decides circa / span
export function catDate(ds, dd) {
  const fromText = parseDate(dd || "");
  const m = /^(\d{4})(?:-(\d\d))?(?:-(\d\d))?$/.exec(String(ds || ""));
  if (!m || m[1] === "0000") return fromText;
  const y = +m[1], mo = +(m[2] || 0), d = +(m[3] || 0), base = { s: iso(y, mo, d), p: prec({ y, m: mo, d }) };
  if (fromText && (fromText.p === "span" || fromText.p === "circa" || fromText.p === "decade") && fromText.s.slice(0, 4) === base.s.slice(0, 4)) return fromText;
  return base;
}
// ---- public text rules (editorial) ----
const BAN = /\b(says|said to|claims?|claimed|according to|hearsay|unverified|alleged(?:ly)?|fraud(?:ulent)?|stolen)\b/i;
const SWAP = [[/\bunverified\b/gi, "not checked"], [/\bUNVERIFIED\b/g, "NOT CHECKED"], [/\baccording to\b/gi, "in"], [/\bsays\b/gi, "states"], [/\bclaims\b/gi, "states"], [/\bclaimed\b/gi, "stated"], [/\bclaim\b/gi, "position"],
  [/\balleged(ly)?\b/gi, "stated"], [/\bhearsay\b/gi, "second-hand account"], [/\bfraudulent\b/gi, "irregular"], [/\bfraud\b/gi, "irregularity"], [/\bstolen\b/gi, "taken"], [/\btenant farmers?\b/gi, "farmers"]];
const HOLD = /family[- ]held|held by the family|in (?:the )?family'?s? possession|not (?:yet )?held|we hold|family (?:holds|keeps|has kept)|our (?:copy|copies)|copy held|archive photo held|document held|\bheld in the cedwyn|evidence repository|family (?:title )?papers/i;
const NAMES = [[/\bMary Buckler \(later Godfrey\)/g, "a family member"], [/\b(?:aunt )?Mary Godfrey\b/gi, "a family member"], [/\bGodfrey\b/g, "a family member"], [/\bBranwen(?: Buckler)?\b/g, "a family member"], [/\bSion(?: Buckler)?\b/g, "Mr S B"]];
export function clean(raw, opts) {
  let s = decode(raw); if (!s) return "";
  NAMES.forEach(([r, w]) => { s = s.replace(r, w); });
  // a verbatim quote that carries a banned word is withheld here (never altered); the evidence page has it
  s = s.replace(/“([^”]{0,800})”/g, (m, q) => BAN.test(q) || HOLD.test(q) ? "[quoted on the evidence page]" : m);
  // drop sentences that state what the family holds
  if (HOLD.test(s)) s = s.split(/(?<=[.;])\s+/).filter(x => !HOLD.test(x)).join(" ");
  SWAP.forEach(([r, w]) => { s = s.replace(r, w); });
  s = s.replace(/\(\s*\)/g, "").replace(/\s+([,.;)])/g, "$1").replace(/\s+/g, " ").trim();
  if (opts && opts.max && s.length > opts.max) s = s.slice(0, opts.max - 1).replace(/\s+\S*$/, "") + "…";
  return s;
}
export function quotes(raw) {
  const s = decode(raw), out = [];
  for (const m of s.matchAll(/“([^”]{6,600})”/g)) { const q = m[1].trim(); if (!BAN.test(q) && !HOLD.test(q) && !/\bSion\b|Godfrey|Branwen/.test(q)) out.push(q); }
  return out.slice(0, 4);
}
// ---- scope rules ----
const EXCLUDE_IDS = new Set(["EV-0002", "EV-0003", "EV-0017"]);   // 1547 lease and 1552 Bute range (not Tŷ Mawr dates); DSA/12/5400 is a different farm
const NOT_OURS = /Llandough (?:Home )?Farm\b(?! ?house)|Land ?Doc Home Farm|Ely Tidal Harbour|[Nn]ot our farm|[Dd]ifferent farm|\b1547\b|\b1552\b/;
export function excluded(id, text, year) {
  if (EXCLUDE_IDS.has(id)) return "rule";
  if (NOT_OURS.test(text || "")) return "Llandough Farm / pre-1824 Bute";
  if (year && year < 1824 && /\bBute\b/i.test(text || "")) return "pre-1824 Bute record";
  return "";
}
const OUTSIDE = "Outside record: how it applies to Tŷ Mawr is under forensic examination.";
// ---- 0.0.2: missing evidence (the missing-records register, /research/missing-records/, MR-####) ----
// Each register entry is a record that should exist and is not held. Its "date of the record" can name several dates ("1938; 1969; 1975",
// "1959 and 1965"); each becomes its own pink mark. Never counted as coverage. Links go to the entry's own page on cedwyn.
export function mrDates(dd, ds) {
  const s = decode(dd).replace(/\(.*?\)/g, " ").replace(/\s+/g, " ").trim();
  if (/;| and /.test(s)) { const L = s.split(/;| and /).map(x => parseDate(x.trim())).filter(Boolean); if (L.length) return L; }
  const one = parseDate(dd) || (ds ? catDate(ds, dd) : null); return one ? [one] : [];
}
export function mrEvents(m, ex, src) {
  const why = excluded(m.id, m.title + " " + (m.dd || ""), null); if (why) { ex.push({ id: m.id, why, t: decode(m.title).slice(0, 120) }); return []; }
  const L = mrDates(m.dd, m.ds); if (!L.length) { ex.push({ id: m.id, why: "undated (missing record: date of the record not stated)", t: decode(m.title).slice(0, 120) }); return []; }
  return L.map((d, i) => {
    const ev = { k: m.id + (i ? "#" + (i + 1) : ""), s: d.s, p: d.p, e: d.e, t: clean(m.title, { max: 160 }), q: [], ids: [m.id], src: src || ["missing-records register"], dd: clean(m.dd || ""),
      g: 1, mr: m.id, ty: "missing evidence (missing-records register)", u: SITE + "/research/missing-records/" + m.id.toLowerCase() + "/" };
    const x = clean(m.why || "", { max: 600 }); if (x) ev.x = x;
    const st = decode(m.st || ""); if (st && !BAN.test(st)) ev.st = st;   // the register's own status words (a controlled list), not run through the holdings filter
    const h = clean(m.holder || "", { max: 300 }); if (h) ev.h = h;
    if (L.length > 1) ev.n = (i + 1) + " of " + L.length + " dates";
    return ev;
  });
}
// register index page: <a href="./mr-0050/"><span class="id">MR-0050</span> <b>title</b></a><br><span class="st">status</span>
export function registerRows(html) {
  const out = {};
  for (const m of String(html || "").matchAll(/<a href="\.\/(mr-\d{4})\/"><span class="id">(MR-\d{4})<\/span>\s*<b>([\s\S]*?)<\/b><\/a>(?:<br>\s*<span class="st">([\s\S]*?)<\/span>)?/g))
    out[m[2]] = { id: m[2], t: decode(m[3]), st: decode(m[4] || "") };
  return out;
}
// an entry page: "Date of the record: 1975-05"
export function registerDate(html) { const m = /Date of the record:\s*(?:<\/[^>]+>\s*)*(?:<[^>]+>\s*)*([^<]+)/.exec(String(html || "")); return m ? decode(m[1]) : ""; }
// ---- sources -> events ----
// event: {k, s, p, e?, t, x?, q[], ids[], u, src[], ty, dd, g?}
//   k key, s/p/e date, t title, x longer text, q verbatim quotes, ids catalogue IDs, u evidence page, src sources, ty record type, dd date as written, g known gap
export function indexRows(html) {
  const M = {};
  const re = /<tr><td><a href="(\/research\/evidence\/[^"]+)">(EV-\d{4})<\/a><\/td><td>([\s\S]*?)<\/td><td>([\s\S]*?)<\/td><td>([\s\S]*?)<\/td><td>([\s\S]*?)<\/td><td>([\s\S]*?)<\/td>/g;
  for (const m of String(html || "").matchAll(re)) if (!M[m[2]]) M[m[2]] = { id: m[2], u: SITE + m[1], dd: decode(m[3]), desc: m[4], ty: decode(m[5]), st: decode(m[6]), so: decode(m[7]) };
  // the index's addenda lists: "<a>EV-0629</a> — title (date)" and "<a>MR-0214</a> — date · title"
  for (const m of String(html || "").matchAll(/<li><a href="(\/[^"]+)">((?:EV|MR)-\d{4})<\/a>\s*(?:—|&#8212;)\s*([\s\S]*?)<\/li>/g)) {
    if (M[m[2]]) continue;
    const t = decode(m[3]); let dd = "", desc = t;
    const dot = /^([^·]{3,40}?)\s·\s(.+)$/.exec(t);
    if (dot) { dd = dot[1]; desc = dot[2]; }
    else { const pz = /\(([^()]*\d{4}[^()]*)\)\s*$/.exec(t) || /,\s*([^,]*\b\d{4})\s*$/.exec(t); if (pz) dd = pz[1]; else { const f = /\b\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}/i.exec(t); dd = f ? f[0] : "undated"; } }
    M[m[2]] = { id: m[2], u: SITE + m[1], dd, desc, ty: m[2].startsWith("MR") ? "catalogue / press listing" : "record", st: "", so: "" };
  }
  return M;
}
function short(desc) { const d = clean(desc); const i = d.search(/[:;(]/); return clean(i > 25 && i < 150 ? d.slice(0, i) : d, { max: 150 }); }
export function fromCatalogue(items, IX, ex, REG) {
  REG = REG || {};
  const out = [];
  for (const r of items || []) {
    if (r.public === 0) continue;
    const data = typeof r.data === "string" ? (() => { try { return JSON.parse(r.data); } catch (e) { return {}; } })() : (r.data || {});
    const ix = r.kind === "missing_record" ? null : (IX[r.id] || null);   // 0.0.2: register MR-#### and evidence-index MR-#### (newspapers) are different series
    if (r.kind === "person") {
      if (data.living) continue;
      for (const [w, v] of [["born", data.born], ["died", data.died]]) {
        const d = v && parseDate(v); if (!d) continue;
        out.push({ k: r.id + ":" + w, s: d.s, p: d.p, e: d.e, t: clean(r.title) + (w === "born" ? " born" : " dies"), q: [], ids: [r.id], u: SITE + (r.page || "/api/catalogue/" + r.id), src: ["catalogue"], ty: "person (family tree)", dd: decode(v) });
      }
      continue;
    }
    if (r.kind === "missing_record") { const reg = REG[r.id] || {}; out.push(...mrEvents({ id: r.id, title: r.title, dd: r.date_display || reg.dd || "", ds: r.date_sort, st: reg.st || "", why: data.why || r.summary || "", holder: r.holder || "" }, ex, ["catalogue", "missing-records register"])); continue; }
    const d = catDate(r.date_sort, r.date_display);
    const why = excluded(r.id, r.title + " " + (r.date_display || ""), d && +d.s.slice(0, 4)); if (why) { ex.push({ id: r.id, why, t: decode(r.title).slice(0, 120) }); continue; }
    if (!d) { ex.push({ id: r.id, why: "undated", t: decode(r.title).slice(0, 120) }); continue; }
    const ev = { k: r.id, s: d.s, p: d.p, e: d.e, t: clean(r.title, { max: 160 }), q: ix ? quotes(ix.desc) : [], ids: [r.id], src: ["catalogue"], dd: clean(r.date_display || "") };
    {
      ev.ty = clean(data.type || (r.kind === "catalogue_candidate" ? "catalogue candidate" : "record"));
      ev.u = r.page ? SITE + r.page : ix ? ix.u : SITE + "/api/catalogue/" + r.id;
      if (ix) { ev.x = clean(ix.desc, { max: 600 }); if (ix.so) ev.so = clean(ix.so, { max: 160 }); }
      if (+d.s.slice(0, 4) < 1824) ev.x = (ev.x ? ev.x + " " : "") + OUTSIDE;
    }
    out.push(ev);
  }
  return out;
}
export function fromIndex(IX, have, ex) {
  const out = [];
  for (const id of Object.keys(IX)) {
    if (have.has(id)) continue;
    const r = IX[id], d = parseDate(r.dd), text = decode(r.desc) + " " + r.st;
    const why = excluded(id, text + " " + r.dd, d && +d.s.slice(0, 4)) || (/^EXCLUDED/i.test(r.st) ? "excluded on the index" : "");
    if (why) { ex.push({ id, why, t: decode(r.desc).slice(0, 120) }); continue; }
    if (!d) { ex.push({ id, why: "undated", t: decode(r.desc).slice(0, 120) }); continue; }
    const ev = { k: id, s: d.s, p: d.p, e: d.e, t: short(r.desc), x: clean(r.desc, { max: 600 }), q: quotes(r.desc), ids: [id], u: r.u, src: ["evidence index"], ty: clean(r.ty), dd: clean(r.dd) };
    if (r.so) ev.so = clean(r.so, { max: 160 });
    if (+d.s.slice(0, 4) < 1824) ev.x += " " + OUTSIDE;
    out.push(ev);
  }
  return out;
}
export function timelineLines(html) {
  html = String(html || ""); const h = html.indexOf("Events, in date order"); if (h < 0) return [];
  const body = html.slice(h), out = [];
  for (const m of body.matchAll(/<li>\s*<strong>([\s\S]*?)<\/strong>\s*(?:—|&#8212;|&mdash;)\s*([\s\S]*?)<\/li>/g)) {
    let date = decode(m[1]); if (date.length > 60) { const z = /([^.\n]{0,40})$/.exec(date); date = z ? z[1].trim() : date.slice(-30); }
    let rest = m[2], badge = "";
    const b = /<span[^>]*>([^<]{2,60})<\/span>\s*$/.exec(rest); if (b) { badge = decode(b[1]); rest = rest.slice(0, b.index); }
    const ids = [...new Set((decode(rest).match(/\b(?:EV|MR|PE)-\d{4}\b/g) || []))];
    out.push({ date, text: rest, badge, ids });
  }
  return out;
}
export function fromTimeline(lines, byId, ex) {
  const out = [];
  lines.forEach((L, i) => {
    const d = parseDate(L.date), plain = decode(L.text);
    const why = excluded("", plain + " " + L.date, d && +d.s.slice(0, 4)); if (why) { ex.push({ id: "TL-" + (i + 1), why, t: plain.slice(0, 120) }); return; }
    if (!d) { ex.push({ id: "TL-" + (i + 1), why: "undated", t: plain.slice(0, 120) }); return; }
    // merge into the catalogue/index event for the same record and date, if one exists
    for (const id of L.ids) { const e = byId[id]; if (e && e.s.slice(0, 7) === d.s.slice(0, 7)) { e.tl = clean(L.text, { max: 600 }); if (!e.src.includes("Master Timeline")) e.src.push("Master Timeline"); if (!e.q.length) e.q = quotes(L.text); return; } }
    const first = L.ids.map(id => byId[id]).find(Boolean);
    const badge = L.badge && !/held/i.test(L.badge) ? clean(L.badge) : "";
    out.push({ k: "TL-" + String(i + 1).padStart(3, "0"), s: d.s, p: d.p, e: d.e, t: clean(L.text, { max: 160 }), x: clean(L.text, { max: 700 }), q: quotes(L.text), ids: L.ids, u: first ? first.u : SITE + "/research/timeline/", src: ["Master Timeline"], ty: badge || "timeline event", dd: clean(L.date) });
  });
  return out;
}
export function build(items, indexHtml, timelineHtml, snap, reg) {
  const ex = [];
  const IX = indexHtml ? indexRows(indexHtml) : (snap && snap.ix) || {};
  const REG = reg || (snap && snap.reg) || {};
  const cat = fromCatalogue(items, IX, ex, REG);
  // 0.0.2: register entries not yet mirrored in the catalogue (e.g. MR-0050–0055), from the register pages
  const haveMR = new Set((items || []).filter(r => r.kind === "missing_record").map(r => r.id));
  const regOnly = [];
  for (const id of Object.keys(REG).sort()) { if (haveMR.has(id)) continue; const m = REG[id]; regOnly.push(...mrEvents({ id, title: m.t, dd: m.dd || "", st: m.st || "", why: m.why || "", holder: m.holder || "" }, ex, ["missing-records register"])); }
  // the evidence index's MR-#### rows (newspaper and online records) are a different series from the register's MR-####: only non-register catalogue ids hide an index row
  const have = new Set((items || []).filter(r => r.kind !== "missing_record").map(r => r.id));
  const idx = fromIndex(IX, have, ex);
  const events = cat.concat(regOnly, idx), byId = {};
  events.forEach(e => { if (!e.g) e.ids.forEach(id => { if (!byId[id]) byId[id] = e; }); });
  const lines = timelineHtml ? timelineLines(timelineHtml) : (snap && snap.tl) || [];
  const tle = fromTimeline(lines, byId, ex);
  const all = events.concat(tle).sort((a, b) => a.s < b.s ? -1 : a.s > b.s ? 1 : a.k < b.k ? -1 : 1);
  const by = { day: 0, month: 0, year: 0, circa: 0, decade: 0, span: 0 }; all.forEach(e => { by[e.p] = (by[e.p] || 0) + 1; });
  const counts = { catalogue_public: (items || []).filter(r => r.public !== 0).length, catalogue_events: cat.length, evidence_index_rows: Object.keys(IX).length, evidence_index_only_events: idx.length, timeline_lines: lines.length,
    timeline_merged: lines.length - tle.length - ex.filter(x => /^TL-/.test(x.id)).length, timeline_events: tle.length, known_gaps: all.filter(e => e.g).length, missing_evidence_marks: all.filter(e => e.g).length, missing_evidence_records: new Set(all.filter(e => e.g).map(e => e.mr)).size, register_entries: Object.keys(REG).length || haveMR.size, events: all.length, by_precision: by, excluded: ex.length };
  return { events: all, excluded: ex, counts };
}

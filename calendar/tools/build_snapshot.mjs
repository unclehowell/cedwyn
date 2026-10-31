// build_snapshot.mjs — the Cedwyn Calendar's build-time fallback snapshot (Tab agent, 31 Oct 2026, task 5ec27d7d; 0.0.2 adds the missing-records register).
// Fetches the site's own public data, derives the events with worker/derive.js (the same code the Worker runs) and writes
// worker/snapshot.json: the slim catalogue rows, the evidence-index rows and Master Timeline lines (as plain text), and the derived counts.
// Usage: timeout -k 5 120 node tools/build_snapshot.mjs [--print]
import { build, indexRows, timelineLines, decode, SITE, registerRows, registerDate } from "../worker/derive.js";
import fs from "fs";
const UA = { "user-agent": "Mozilla/5.0 Sion's Tab agent cedwyn-calendar build" };
const get = async u => { const r = await fetch(u + (u.includes("?") ? "&" : "?") + "cb=" + Date.now(), { headers: UA }); if (!r.ok) throw new Error(u + " " + r.status); return r; };
const items = []; let off = 0, total = 1;
while (off < total) { const j = await (await get(SITE + "/api/catalogue?limit=200&offset=" + off)).json(); total = j.total; items.push(...j.items); off += j.limit; if (!j.items.length) break; }
const indexHtml = await (await get(SITE + "/research/evidence/")).text();
const tlHtml = await (await get(SITE + "/research/timeline/")).text();
// 0.0.2: the missing-records register (index page + each entry's "Date of the record")
const REG = registerRows(await (await get(SITE + "/research/missing-records/")).text());
const ids = Object.keys(REG);
for (let i = 0; i < ids.length; i += 6) await Promise.all(ids.slice(i, i + 6).map(async id => { try { REG[id].dd = registerDate(await (await get(SITE + "/research/missing-records/" + id.toLowerCase() + "/")).text()); } catch (e) { REG[id].dd = ""; } }));
const IX = indexRows(indexHtml); for (const k in IX) IX[k].desc = decode(IX[k].desc);
const TL = timelineLines(tlHtml).map(l => ({ date: l.date, text: decode(l.text), badge: l.badge, ids: l.ids }));
const slim = items.map(r => ({ id: r.id, kind: r.kind, title: r.title, date_display: r.date_display, date_sort: r.date_sort, holder: r.holder, summary: r.summary, page: r.page,
  data: r.kind === "person" ? { born: r.data && r.data.born, died: r.data && r.data.died, living: r.data && r.data.living } : r.kind === "missing_record" ? { why: r.data && r.data.why } : { type: r.data && r.data.type } }));
const res = build(slim, null, null, { ix: IX, tl: TL, reg: REG });
const out = { built: new Date().toISOString(), source: "cedwyn.bucklerfamily.estate: /api/catalogue (" + items.length + " rows), /research/evidence/ (" + Object.keys(IX).length + " rows), /research/timeline/ (" + TL.length + " lines), /research/missing-records/ (" + ids.length + " entries)", items: slim, ix: IX, tl: TL, reg: REG, counts: res.counts };
fs.writeFileSync(new URL("../worker/snapshot.json", import.meta.url), JSON.stringify(out));
console.log(JSON.stringify(res.counts));
if (process.argv.includes("--print")) fs.writeFileSync("/tmp/cal_events.json", JSON.stringify(res, null, 1));

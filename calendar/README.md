# Cedwyn Calendar (v0.0.1)

The Great House Farm chronology on a calendar: https://calendar.bucklerfamily.estate/ (Cloudflare Worker `cedwyn-calendar`, branch `calendar`).

- **Views:** Day, Week, Month, Year, Compare (4–32 years side by side) and Decades (century tabs, 10×10 year grid). Swipe to move; pinch, +/− or the tabs to zoom; tap the title to jump to a year. The URL hash keeps the view (`#month/1988-12`, `#year/1988`, `#compare/1983-8`, `#decades/1900`).
- **Coverage:** a day counts when a record is dated to it; a month when a record is dated to it or a day in it; a year when any record is dated within it. Month-only and year-only records sit in "Sometime in …" bands, never on an invented day; ranges and decades are bands and never count. Known gaps (missing-records register) are hatched red and never count.
- **Data (architecture rule 30 Oct 2026):** central db = the evidence catalogue (`core_items`, D1 `cedwyn-apps`), read at request time with a 5-minute cache. The calendar's own db is derived in `worker/derive.js` from the catalogue, the public evidence index (`/research/evidence/`), the Master Timeline (`/research/timeline/`) and the missing-records register. `tools/build_snapshot.mjs` writes `worker/snapshot.json` (the index and timeline rows, and the catalogue as fallback); it is over 100 KB, so it ships with the Worker deploy and is not committed here. No new D1 database; the app writes nothing.
- **Front end:** near-A2UI. `worker/ui.js` renders one A2UI v0.9 surface on the server (`/_ui/index.a2ui.json`, catalog `/_ui/catalog.json`); the Calendar component is a mount drawn by `worker/client.txt` from `/api/events`. Shared Cedwyn header via `/_cedwyn/*` pass-through; the header graph (`/_cedwyn/graph/*.json`) plots only this app's own events. Dark only.
- **Scope rules:** undated records, the Llandough Farm series (a different farm) and Bute-estate papers dated before 1824 are left out; banned public words are swapped ("not checked"), and a verbatim quote carrying one is withheld with a pointer to its evidence page, never altered.
- **Deploy:** `node tools/build_snapshot.mjs && TAB_TASK_ID=<task> python3 deploy.py "<message>"`. Rollback: `python3 deploy.py "rollback" --promote <previous version id>` (ids in `state.json` history on the box).

Sion's Tab agent, 31 Oct 2026.

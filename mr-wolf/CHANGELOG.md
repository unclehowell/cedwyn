# Changelog — Mr Wolf (webapp 40 of 59)

## [2.0.1] - 2026-11-14
### Fixed
- Data files are read with literal fetch('leaderboard.json'), fetch('routes.json') and fetch('data/central.json') calls, so the estate build (dbserve FETCHLIT) keeps them as plain files. Root JSON files otherwise answer 404 live without the service worker.

## [2.0.0] - 2026-11-14
### Changed
- Rebuilt as a gauge dashboard (owner brief 14 Nov 2026, issue #7): threshold gauge (best lead vs 100), route gauges (Dishonesty, Concealment, Public bodies), limb gauges (best per Takhar limb, mark at 40 = counsel-ready), chips, then the leaderboard on the landing view.
- All longer text moved into modals (native dialog): each lead row, gauge, chip and the (i) rubric. No text removed.
- Record chips in lead modals show date and title from data/central.json.
### Added
- routes.json: route tags per lead (our classification); leaderboard.json is unchanged.
- mw.js builds every gauge, the table and the modals in the browser from leaderboard.json, routes.json and data/central.json; a score change needs only a JSON edit.

## [1.0.0] - 2026-11-01
### Added
- New webapp at /mr-wolf/ (branch section/mr-wolf): "Mr Wolf", subtitle "What's the time, Mr Wolf?".
- Leaderboard of 15 leads scored out of 200 on the four Takhar limbs (0–50 each); bar marked at the 100 threshold.
- Ten seeded leads merged with the twelve grounds already scored by our reopen research (no duplicates); three leads carry seed scores.
- Each row: rank, score, per-limb breakdown, what would raise it, status, and catalogue records (internal links).
- Published rubric and mapping (reopen research 0–5 per limb x10). Highest score at launch: 80. Nothing reaches 100.
- leaderboard.json for later score updates; "40 of 59" parcel link; en/cy/es interface strings.

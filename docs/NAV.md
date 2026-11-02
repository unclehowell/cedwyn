# Webapp navigation standard (nav 1.0.0, 2 Nov 2026)

Source: the owner's request of 2 Nov 2026, 04:13 GMT (navigation through the webapps kept getting stuck), and the 390 px crawl of the live site that morning (slots 40+ unreachable, chain re-filtered per half, no nav without JS).

Every Cedwyn webapp can be reached from every other one, in order, with nothing to get stuck on.

## One registry
- The ONE ordered list is `/areas.json` → `"nav"`, written by `tools/site.py` on every build.
- Slots 1–39 come from `data/site-areas.json` (owner file, `serendipity_slot`).
- Every later webapp declares its slot ONCE, on its own `themes.json` entry: `"slot": 45`, plus `"path"` if it is not `/<id>/` and `"served_by": "worker"` if a Worker serves it instead of the build. Take the next free slot: `python3 -c "import json;print(sorted(a['slot'] for a in json.load(open('dist/areas.json'))['nav']))"`.
- Nobody hand-types "NN of 59" anywhere. The header, the menu and the no-JS bar all read the slot from the registry. The build also corrects a stale `cw-parcel-link` number on a slot's landing page.
- `"href"` is the address a link opens with no redirect hop (`/online/<id>/` for `data/halves.json` `online_only` apps). `"src"` is the built folder.

## One chain for everyone
- ‹ › step through every built slot in slot order and wrap from the last to the first. The menu numbers are slot numbers.
- Inside /wales/ or /argentina/, a stop that half serves keeps the visitor in it. Every other stop (a stop the half does not serve, a webapp from slot 40 on, an /online/ app) opens at its own address. No stop is dropped.

## Server-rendered, refreshed at runtime
- `tools/nav.py dist` stamps a small bar into every slot page: ‹ title · NN of 59 › plus an "All webapps" list. It works with no JS.
- `basecamp.js` hides that bar once its own header is drawn (`html.ghf-v2-on`) and refreshes the list from `/areas.json` (session cache `cdw-nav-v2`, 2 minutes).
- Pages pinned to an old branch commit get the current bar at every build, because the stamp runs on the built output.

## Build check
`tools/nav.py dist --check` (step "Webapp nav" in build-cedwyn) fails the build when:
- a slot is claimed twice, or falls outside 1..59;
- a built slot has no page;
- a bar link leads nowhere;
- a slot page lacks the bar.

It warns, without failing, when a slot is registered but not built, or when a slot's address is a redirect source.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-11-02 | One slot registry (`/areas.json` "nav": site-areas.json + themes.json "slot"). One chain for every visitor, in slot order (no half filter, no list-position numbers). Server-rendered no-JS bar stamped at build. Build check. Slots 40, 42, 43 (and later webapps) join the nav. |

— Cedwyn editors

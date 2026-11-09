# Webapp navigation standard (nav 1.3.0, 7 Nov 2026)

Source: the owner's request of 2 Nov 2026, 04:13 GMT (navigation through the webapps kept getting stuck), and the 390 px crawl of the live site that morning (slots 40+ unreachable, chain re-filtered per half, no nav without JS).

Every Cedwyn webapp can be reached from every other one, in order, with nothing to get stuck on.

## One registry
- The ONE ordered list is `/areas.json` → `"nav"`, written by `tools/site.py` on every build.
- Slots 1–39 come from `data/site-areas.json` (owner file, `serendipity_slot`).
- Every later webapp declares its slot ONCE, on its own `themes.json` entry: `"slot": 45`, plus `"path"` if it is not `/<id>/` and `"served_by": "worker"` if a Worker serves it instead of the build. Take the next free slot: `python3 -c "import json;print(sorted(a['slot'] for a in json.load(open('dist/areas.json'))['nav']))"`.
- The label reads "NN of TT": NN is the webapp's place in the chain and TT is the number of webapps in the chain (nav 1.2.0), so ‹ always opens NN−1 and › NN+1, wrapping from TT to 1. Since nav 1.3.0 the chain always holds all 59 slots (see "Coming-soon slots"), so the label reads "NN of 59" and NN is the slot number.
- Nobody hand-types "NN of TT" anywhere. The header, the menu and the no-JS bar all read the slot from the registry. The build also corrects a stale `cw-parcel-link` number on a slot's landing page.
- `"href"` is the address a link opens with no redirect hop (`/online/<id>/` for `data/halves.json` `online_only` apps). `"src"` is the built folder.

## Coming-soon slots (nav 1.3.0)
Owner, 7 Nov 2026: "Keep as 59 and where there's no webapps yet just have blank 'coming soon' webapps as coming-soon-xx repos. xx being the webapp number. When we do the real webapps to replace them we'll do proper repos for the new webapp and purge the corresponding coming-soon-xx webapp".
- Every slot of the 59 with no real webapp is a blank "Coming soon" webapp in its own public repository `unclehowell/coming-soon-NN` (NN = the slot number). Slots 48–59 are placeholders today.
- `data/coming-soon.json` lists them. At build `tools/coming_soon.py` (called by `tools/site.py`) copies each repository's `index.html` to `/coming-soon-NN/` (if the repository cannot be read, the same blank page is written from its template), and `tools/site.py` lists it in `/areas.json` "nav" at slot NN. `tools/nav.py` stamps the bar into it like any other slot.
- A placeholder steps aside on its own when a real webapp takes its slot (`"slot": NN` on a themes.json entry, or `serendipity_slot` in data/site-areas.json).

### Rule: replacing slot NN with a real webapp
1. Build the real webapp in its own proper repository (the repo-split pattern, `unclehowell/cedwyn-<id>`), not in `coming-soon-NN`.
2. Register it: `"slot": NN` on its themes.json entry (plus its split-repos.json line).
3. In the same change, remove slot NN's line from `data/coming-soon.json`.
4. Once that build is live and `/<id>/` reads "NN of 59", purge (delete) the `unclehowell/coming-soon-NN` repository.

## The apex (nav 1.1.0)
- Every slot also carries `"apex"`, its flat address on the apex: `https://bucklerfamily.estate/<name>/` (the id, or a themes.json `"apex"` when the name differs). The apex router and the apex header read it from the same registry.
- On bucklerfamily.estate the header's ‹ ›, menu and jump list open each stop at its flat apex address; no half prefix, no /online/ prefix.
- The build check fails when a slot has no apex address or two slots claim the same one.

## One chain for everyone
- ‹ › step through every built slot in slot order and wrap from the last to the first. The menu numbers are slot numbers.
- Every stop opens at its own registry address (`href`), whichever half the visitor came from (nav 1.2.0). The remembered half no longer sends ‹ › to a /wales/ or /argentina/ copy. No stop is dropped.
- scope.js 1.2.0 draws no "This area is about …" card, no "see Wales / Argentina / Online" line and no hop to another scope's copy; a webapp that belongs to one scope is shown in that scope at whatever address it was opened.

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

It warns, without failing, when a slot is registered but not built, when a slot's address is a redirect source, or (1.3.0) when a slot of the 59 has neither a webapp nor a coming-soon placeholder.

## One webapp, one number (1.4.0)
A page with its own address that is a separate webapp never borrows another webapp's number. When a source theme merged into an area (site-areas.json "source_themes") is really its own webapp, give it a free slot with "slot": NN on its themes.json entry and remove slot NN from data/coming-soon.json; tools/site.py then lists it as its own nav entry and drops it from the area's aliases. The /wales/ and /argentina/ copies of one webapp share its number (same webapp, another language). Live check: work/nav-loop/check.py (cedwyn#497).

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.4.0 | 2026-11-07 | Owner (cedwyn#497): no two webapps may share a number. Merged source themes that are separate webapps with their own address got their own slots, taken from the coming-soon placeholders: /documentary/ 48 (was 7 with /story/), /nomenclature/ 49 and /records/ 50 (were 1 with /wiki/), /fb2/ 51 (was 9 with /fb/), /nft-art/ 52 and /cyberspace/ 53 (were 10 with /arcade/), /meeting/ 54 (was 17 with /authorities/), /emails/ 55 (was 26 with /email/). The area that held each one keeps its own address and number. Rule: a source theme that declares "slot" on its themes.json entry is its own nav entry and is no longer listed as the area's alias (tools/site.py). Coming-soon slots now 56–59. |
| 1.3.0 | 2026-11-07 | Owner: keep the total at 59. Every empty slot is a blank "Coming soon" webapp from its own repository unclehowell/coming-soon-NN (slots 48–59 today; data/coming-soon.json, tools/coming_soon.py), so the chain is 59 long and reads "NN of 59". Rule for replacing a placeholder with a real webapp. Check warns on a slot with neither. |
| 1.2.0 | 2026-11-07 | Owner: ‹ › beside "NN of 59" must open the next number down / up on every webapp, and the "This area is about …" headers must go. NN = place in the chain, TT = chain length (header, no-JS bar, menu numbers); every arrow opens the flat registry address; scope.js 1.2.0 drops the area card, the cross-scope lines and the hop. |
| 1.1.1 | 2026-11-02 | `apex` is the flat path (`/wiki/`), read against https://bucklerfamily.estate; the absolute form was rewritten by the self-contained pass and failed build 41402080152. |
| 1.1.0 | 2026-11-02 | Flat apex address per slot (`apex`), used by the header on bucklerfamily.estate; build check for it; session cache key cdw-nav-v3. |
| 1.0.0 | 2026-11-02 | One slot registry (`/areas.json` "nav": site-areas.json + themes.json "slot"). One chain for every visitor, in slot order (no half filter, no list-position numbers). Server-rendered no-JS bar stamped at build. Build check. Slots 40, 42, 43 (and later webapps) join the nav. |

— Cedwyn editors

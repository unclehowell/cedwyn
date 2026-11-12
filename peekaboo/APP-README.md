# Peekaboo — webapp 47 of 59

Records found despite their labels: records about Great House Farm / Tŷ Mawr, Llandough and its neighbours that turned up
where a catalogue, a label or a reply said they were not. Each entry gives what the label said, what was there, who found it
(us, or the holder on a fresh check) and when. Served at `/peekaboo/` (apex `bucklerfamily.estate/peekaboo/` through the
apex router; no route of its own).

## Scope
- **Peekaboo**: records that were already mislabelled, misdescribed, misplaced, or said not to be there, whoever found them.
- **That Old Chestnut** (`/that-old-chestnut/`, slot 38): the wording of replies from 2025 onwards, read line by line.
  Records that fit both appear in both and link to each other (TOC-F01, F02, F03, F05).

## Its own database
`data/peekaboo.json` holds only the fields this page shows. It is pulled from the central evidence catalogue
(`data/core/records/*.json` on `unclehowell/cedwyn` main) by `tools/peekaboo_sync.py`:
- every record whose `scope.tags` carries `peekaboo` is picked up automatically;
- records listed in `tools/picks.json` are added by hand, with the short "said / found / why" lines;
- missing or non-public records are left out and listed under `skipped`.
The sync also renders the entries and the notices into `index.html` (between the `PEEKABOO` markers), so the page reads with
no JavaScript and agents can read plain HTML. `data/notices.json` holds the correction notices (draft text only).

```
python3 tools/peekaboo_sync.py                                        # main only
python3 tools/peekaboo_sync.py --ref main --ref core/peekaboo-records # overlay an unmerged catalogue branch
python3 tools/peekaboo_sync.py --core <checkout>/data/core/records    # local checkout
```
First run: 3 Nov 2026, refs `main` + `core/peekaboo-records` (PR #141): 6 entries, 3 notices, nothing skipped.
After PR #141 is merged, run it against `main` alone and commit `data/peekaboo.json` + `index.html`.

## Hallmarks
- Standard header and burger (`ghf-boot.js`), day/night theme from the header toggle (`html[data-ghf-mode]`), the Garden banner
  (loaded by `ghf-boot.js`, the one site-wide promotion), slot "47 of 59" from the area registry (`themes.json` `"slot": 47`);
  until the registry carries it, `peekaboo.js` writes "47 of 59" into the header's numbering slot.
- Header ‹ › step to slots 46 and 48 in the one nav chain (`/areas.json` "nav"); with no slot 48 built yet, › wraps to slot 1.
- Agent guest book in the footer: injected by the site build (collapsed by default, rows from this branch's commit history).
- Version v0.1.0, changelog table in the ⓘ modal and `CHANGELOG.md`, release tag `peekaboo-v0.1.0`.
- WebMCP tools `peekaboo_list` and `peekaboo_notice` (read-only).

## Evidence
`evidence/` keeps the dated copies read on 3 Nov 2026 01:34 UTC for the Newman entry: the Internet Archive item metadata JSON
and the item's MARC, Dublin Core and meta files. The Wayback Machine does not capture archive.org pages, so no Wayback copy
exists.

## Editorial
Facts and dates only; role titles, no officers' names; internal links only; the sync's word gate runs on every output.

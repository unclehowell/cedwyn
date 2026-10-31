# That Old Chestnut — webapp 37 of 59

FOI / EIR / SAR replies about Great House Farm / Tŷ Mawr, read line by line: refusal-setup wording ("chestnuts") and
"not held" answers that later became records found, each with the statute the wording points at. Served at
`/that-old-chestnut/`. Dark radar display: a back-and-forth sweep arm crosses incoming email blips and flips the read ones
into chestnuts.

## Parcel duty
Every Cedwyn webapp is one of the estate's 59 land parcels and carries "NN of 59" in its header, linked to the shared
parcel modal (`/_cedwyn/parcel-modal.js`, on main under `web/_cedwyn/`). This app holds slot **37** in the registry
`data/site-areas.json` (`serendipity_slot` 37; an editorial index, not a tithe plot number until EV-0215 is checked row by
row). Its secondary duty is to gather everything about its parcel; that block lives in the view's `copy.parcel` and is what
the modal shows.

## How it is built (no AI or paid service at page time)
- `public/index.html` is a thin shell. `public/toc.js` builds every section on page load from
  `_ui/index.a2ui.json` (the layout recipe: component list and props) plus `_db/view.json` (the data). That is the
  generative UI: the page is generated in the browser from the database, by plain JavaScript.
- `_db/view.json` is derived at every build by `tools/views.py` on main from `data/views/that-old-chestnut.view.json` and
  the master catalogue `data/core/records/*.json` (kind `foi_finding`, ids `TOC-NNN`). The copy in `public/_db/` is only a
  seed for local preview; the build overwrites it.
- `tools/chestnut_sync.py` turns the audit output (`chestnuts.json`, schema `that-old-chestnut/1`) into
  `data/core/records/foi-chestnuts.json` and refreshes the view rule from `tools/view.template.json`. It whitelists public
  fields, holds back any quote that fails the public gate (banned words, contact details, personal names), and never
  invents rows: with no audit data the page shows the "audit in progress" state.

```
python3 tools/chestnut_sync.py --audit <dir with chestnuts.json> --out <checkout of main>   # then PR to main (site-wide)
```

## Display
Counts (clear flips / borderline / wording only), filters (institution, type, trigger, free text), one card per reply,
the full table with the five requested columns, the chestnut words with the statute each points at, and a reference
glossary of refusal grounds. Labels in en / cy / es follow `<html lang>` (the site default is unchanged). Respects
`prefers-reduced-motion` (static arm, read blips shown as chestnuts). Checked at 390 px: no sideways scroll.

## Editorial
Role titles only, no individual officers; neutral labels; internal links only; the public gate in `tools/views.py`
applies to everything published.


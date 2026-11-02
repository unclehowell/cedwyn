# That Old Chestnut — webapp 37 of 59

FOI / EIR / SAR replies about Great House Farm / Tŷ Mawr, read line by line: refusal-setup wording ("chestnuts") and
"not held" answers that later became records found, each with the statute the wording points at. Served at
`/that-old-chestnut/`, canonical address `/online/that-old-chestnut/` (v0.3.0; it is not Patagonia-specific, and `/argentina/that-old-chestnut/` answers 301). Dark radar display: a back-and-forth sweep arm crosses incoming email blips and flips the read ones
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

## Old chestnuts (v0.3.0)
An "old chestnut" is a passage that raises why a record was not disclosed sooner: records set aside as out of scope,
released weeks later on a new request, found after a "not held" answer, or produced only after a challenge.
- **Detection is automatic.** `public/toc.js` splits each record's conduct note and reply quotes into clauses and scores each one
  against the rule list in `public/_ui/chestnuts.rules.json` (case-insensitive patterns with a kind and a weight; toc.js carries
  the same list as a fallback). A clause scoring at least `min_clause` gets the crescendo highlight: level 1 below 3, level 2 from
  3 to 5, level 3 from 6. A record whose best clause scores at least `min_record` joins the 🌰 list, with that clause as its headline.
  New replies are picked up the moment they reach the catalogue. To catch a new kind of wording, add a rule.
- **Manual override.** In `chestnuts.rules.json` "overrides", set a record id to `{"exclude":true}`, `{"include":true}` or
  `{"headline":"…"}`. A catalogue record can also carry `finding.chestnut` (false, true, or a headline string).
- **Details.** The "details" link and a tap on a radar blip open one dialog: the extract with the chestnut highlighted, the
  source (body, date, reference), the timeline (first reply, what reopened it, later disclosure, gap in days and weeks) and why
  it matters. Esc, × and a tap on the backdrop close it. Without dialog support the link goes to the same details on the page
  (`#cn-<record id>`).

## Editorial
Role titles only, no individual officers; neutral labels; internal links only; the public gate in `tools/views.py`
applies to everything published.


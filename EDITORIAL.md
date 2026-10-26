# Cedwyn editorial rule: ingredients, not conclusions

The public statement of these standards is the Values and Standards page, `/values/` (`web/values/index.html`), linked from the menu and the footer of every page. Theme text is benchmarked against it (five tests: cites evidence, keeps fact apart from theory, shows the evidence against, measured tone, respects named people).

Adopted 25 Oct 2026. Every page, theme, caption, summary and build on cedwyn.bucklerfamily.estate follows it.

**The rule.** Cedwyn presents the ingredients, never the finished conclusion. The reader builds the picture in their own head
from what the pages set out. Think of the site's text as one long prompt of cited evidence: every factual sentence carries a
link to its evidence or catalogue page inside Cedwyn, and the reader's own reading does the rest.

## Do
- State what happened, with its date, and link the evidence page (`[EV-xxxx]` → `/research/evidence/ev-xxxx-…/`). Links stay inside Cedwyn (no outbound links).
- State what an event changed in law or in fact, neutrally, and cite the source for it.
- Label every item: **Record** (court judgment, registry, archive, legislation, contemporaneous press), **Family testimony**, **Not yet confirmed**.
- Put what is not known as an **Open question**, with the record that would answer it.
- Cross-link related items (for example "depends on" / "enabled" in 1000 Cuts). Links are ingredients; the reader follows them.
- Set out what was decided, what was never decided, and what went against the family, side by side.
- Interpretation sections stay, labelled **working hypotheses**: each names what it rests on and what would confirm or refute it. Never a finding.

## Don't
- No closing verdict, "our reading" summary or sentence that tells the reader what to conclude.
- No drawn conclusion graphics (no pyramid diagrams, apex labels, "layer N of 9" progress framing, fill-in icons).
- No emotive verdict words in our own text ("the blow", "the fall", "the decisive cut", "ploy").
- Banned words in our own text: says, claims, according to, hearsay, unverified, alleged, fraud, stolen. "Squatters" appears only as a label others applied.
- Public text never names the family member who runs the project, and says nothing about family holdings or addresses.
- Mirrored theme content and evidence are never deleted. A conclusion sentence in mirrored text is reworded at build time through
  `ingredients.json` (applied by `tools/ingredients.py` from `tools/site.py`), in the Cedwyn copy only; datro and its subdomains are untouched.

## How to add a reword
Add an entry to `ingredients.json` (`theme`, `file`, exact `find`, `replace`, `why`). The build report `_cedwyn/reports/ingredients.json`
lists what was applied and any find that no longer matches.

## Small italic: not yet backed by a record (26 Oct 2026)

Text that no record in this archive backs yet is shown smaller and in italic, the same in every theme, with one line per page:
"Small italic text = not yet backed by a record in this archive." (Welsh and Spanish versions in the same line.)

- In data files, put the passage between ⟦ and ⟧, or give a whole entry `"substantiated": false`. `tools/unsub.py` turns the marks
  into `<span class="unsub">` when a page is written; `section.js` does the same after a language change.
- In mirrored theme text, an `ingredients.json` reword wraps the passage in `<span class="unsub">`.
- `runtime.js` (theme pages) and `section.js` (hub pages) carry the one `.unsub` style and add the legend once on any page that has one.
- Typical cases: family research notes whose documents are not held (1392 Cwm Cedwyn, 1547 Cydwin), traditions (Marconi, Driscoll),
  and gaps.

Words for title (26 Oct 2026). Bute and Mountjoy: lord of the manor, or the tithe's landowner column, quoted as the column's wording.
BP: registered proprietor from 1982/83. The 1938 and 1969 conveyances: recited only, not produced. A court's "owner" or "paper title"
is that court's wording, given with its date. A rent book does not identify a parcel unless it names one. The c.1841 tithe lists
John Williams as occupier of 36 numbered plots. The name of the holding is first read in a record in 1824 (Bute survey, plan 19,
EV-0211); 1552–1824 is the National Library of Wales catalogue's span for a group of leases that have not been read (EV-0003).
The title chain itself is on /title-chain/ (data/title-chain.json).

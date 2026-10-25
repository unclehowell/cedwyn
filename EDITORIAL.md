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

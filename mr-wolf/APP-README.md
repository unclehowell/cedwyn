# Mr Wolf — webapp 40 of 59

"What's the time, Mr Wolf?" Served at [bucklerfamily.estate/mr-wolf/](https://bucklerfamily.estate/mr-wolf/).

## Source of truth

The authoritative application repository is [unclehowell/cedwyn-mr-wolf](https://github.com/unclehowell/cedwyn-mr-wolf), branch `main`. Make application changes on a feature branch here and open a pull request into `main`. The retained `section/mr-wolf` branch in `unclehowell/cedwyn` is a legacy compatibility copy, not the development source. The estate build reads this repository directly for the `deploy: repo` app.

## What the app measures

Mr Wolf is an evidence-led research dashboard concerning BP Properties Ltd v Buckler (1987). It is not a court finding, legal opinion or prediction.

The 0–200 total is an internal research rubric comprising four limbs, each scored 0–50. The first limb asks whether a discrepancy is shown by a record actually held; limbs 2–4 are scored only where limb 1 has a held record. Inference does not score, and pending records do not count. Each statement displayed against a lead cites an evidence-catalogue record; missing records remain visibly pending and are not counted.

The 100/200 line is an internal research triage marker only. It is not the legal test for setting aside a judgment, a finding of dishonesty or a prediction. The 40/50-on-each-limb marker is an internal file-preparation checklist, not a legal test or a determination of admissibility.

Route tags classify the record or institutional enquiry involved. In particular, a public-body tag is a separate institutional enquiry route; it is not, by itself, a ground to set aside the 1987 judgment. Any register-rectification or public-body remedy enquiry requires its own evidence and legal basis.

## Data and implementation

- `leaderboard.json`: canonical lead facts, cited record IDs, pending items and internal scores (`cedwyn_mr_wolf_leaderboard/v2`).
- `routes.json`: route labels and per-lead tags.
- `data/central.json`: read-only snapshot of catalogue metadata for linked record IDs. It is generated from the central catalogue and must not be hand-edited.
- `mw.js`: builds the gauges, lead table and evidence modals from those data files.
- `mw.css`: responsive presentation.
- `VERSION` and `CHANGELOG.md`: release tracking.

When changing the board, preserve the evidence-only rule, keep each factual statement linked to a catalogue record, keep missing material in the pending list, and never score inference or pending material. If catalogue records need creating or changing, make that change in the BucklerFamily-Estate catalogue workflow rather than editing the generated `data/central.json` snapshot.

## Preview

Cloudflare Pages project `cedwyn-mr-wolf` previews branches and pull requests at [cedwyn-mr-wolf.pages.dev](https://cedwyn-mr-wolf.pages.dev/). Its Git-connected build is intentionally a no-build static deployment from the repository root; do not restore a build command or an output directory unless a real build script and output are added to this repository. The canonical public page is the BucklerFamily.estate route above.

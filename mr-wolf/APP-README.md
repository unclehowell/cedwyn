# Mr Wolf — webapp 40 of 59

Served at [bucklerfamily.estate/mr-wolf/](https://bucklerfamily.estate/mr-wolf/).

## Source of truth

The authoritative application repository is [unclehowell/cedwyn-mr-wolf](https://github.com/unclehowell/cedwyn-mr-wolf), branch `main`. Make application changes on a feature branch here and open a pull request into `main`. The retained `section/mr-wolf` branch in `unclehowell/cedwyn` is a legacy compatibility copy, not the development source. The estate build reads this repository directly for the `deploy: repo` app.

## Two views (v4.0.0)

A toggle at the top switches between **Tree view** (the default landing view) and **Gauge view**. `?view=tree` or `?view=gauges` opens either; `#MW-NN` opens a gauge lead; `#tree/N/<node>` and `#tree/R/<record>` open a tree node or leaf. The last view chosen is remembered per browser (localStorage, wrapped in try/catch).

### Tree view: the Legal Threshold Tree

The law is the tree; catalogue records are the leaves.

- `legal-tree.json` (`cedwyn_mr_wolf_legal_tree/v1`): the trunk, pathways (domestic courts, Strasbourg, register rectification), legal gateways, tests, constituent elements, evidential requirements and procedural obstacles. Every legal node carries its authority with a pinpoint, jurisdiction, date, URL and a verification level (`primary`, `secondary`, `record`, `citation`). A node's status (not established, partially evidenced, strongly evidenced, procedurally blocked, requires legal determination, research required) is a legal-analysis judgment, never a sum of its leaves.
- `evidence-links.json` (`cedwyn_mr_wolf_evidence_links/v1`): one row per relationship between a legal node and a record: `node`, `record`, `source`, `relation` (supports, undermines, contradicts, neutral, missing, hypothetical), `strength` (green, orange, red, brown, black, grey, judged against that node only), `reason`, `proposition`, optional `weaknesses`, `alternatives`, `needs`, and `assessment` {status, date, by}. Many-to-many: a record can sit on several nodes with a different strength on each.
- `tree.js` / `tree.css`: SVG tree with pan, zoom, pinch, reset, expand and collapse, search, filters (strength, relationship, branch, source), an accessible outline, keyboard navigation, node modals (authority, test, evidence position) and record modals.
- Record modals read the record from its own source at open time: the central catalogue (`/api/catalogue/{id}`), That Old Chestnut (`/that-old-chestnut/_db/view.json`), Dartboard (`/dartboard/data/foi-tracker.csv`) or the research mirror. Nothing is copied into this repository. VIEW WEBAPP opens the source app (`/catalogue/?id=…`, `/forensic/…`, `/that-old-chestnut/#cn-…`, `/dartboard/`). If a source is unreachable, the modal says so and shows only the tree's own mapping.
- To add a leaf: add a row to `evidence-links.json` with a canonical record id; no code change is needed. Run `python3 tools/test_tree.py` (and `--online` to check every record resolves).

## What the gauge view measures

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

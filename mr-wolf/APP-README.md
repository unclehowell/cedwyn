# Mr Wolf — webapp 40 of 59

Served at [bucklerfamily.estate/mr-wolf/](https://bucklerfamily.estate/mr-wolf/).

## Source of truth

The authoritative application repository is [unclehowell/cedwyn-mr-wolf](https://github.com/unclehowell/cedwyn-mr-wolf), branch `main`. Make application changes on a feature branch here and open a pull request into `main`. The retained `section/mr-wolf` branch in `unclehowell/cedwyn` is a legacy compatibility copy, not the development source. The estate build reads this repository directly for the `deploy: repo` app.

## Two views (v4.1.2)

A compact, closed-by-default **Current proof position** disclosure sits below the existing header. Opening it separates the 1974 unilateral-licence mechanism from proof of dishonesty, the 1982–83 registration information gap from deliberate concealment, and public-body record handling from evidence of state participation. It states the missing proof for each route. The original **Tree view** remains the default landing view; the existing toggle still switches to **Gauge view**. `?view=tree` or `?view=gauges` opens either; `#MW-NN` opens a gauge lead; `#tree/N/<node>` and `#tree/R/<record>` open a tree node or leaf. The last view chosen is remembered per browser (localStorage, wrapped in try/catch).

### Tree view: the Legal Threshold Tree

The law is the tree; catalogue records are the leaves. The 4.1.0 tree adds the 1982–83 Land Registration Act 1925 framework (ss.13–14, 53 and 70(1)(g)), later Rule 28 / Form DI as a non-retrospective comparator, and the 1925 Act's ss.115–116 registration offences. The app marks the 1983 Forms 1C/1E and any Registrar-required s.14 declaration as unread; it does not infer a false answer.

- `legal-tree.json` (`cedwyn_mr_wolf_legal_tree/v1`): the trunk, pathways (domestic courts, Strasbourg, register rectification), legal gateways, tests, constituent elements, evidential requirements and procedural obstacles. Every legal node carries its authority with a pinpoint, jurisdiction, date, URL and a verification level (`primary`, `secondary`, `record`, `citation`). A node's status (not established, partially evidenced, strongly evidenced, procedurally blocked, requires legal determination, research required) is a legal-analysis judgment, never a sum of its leaves.
- `evidence-links.json` (`cedwyn_mr_wolf_evidence_links/v1`): one row per relationship between a legal node and a record: `node`, `record`, `source`, `relation` (supports, undermines, contradicts, neutral, missing, hypothetical), `strength` (green, orange, red, brown, black, grey, judged against that node only), `reason`, `proposition`, optional `weaknesses`, `alternatives`, `needs`, and `assessment` {status, date, by}. Many-to-many: a record can sit on several nodes with a different strength on each.
- `tree.js` / `tree.css`: SVG tree with pan, zoom, pinch, reset, expand and collapse, search, filters (strength, relationship, branch, source), an accessible outline, keyboard navigation, node modals (authority, test, evidence position) and record modals.
- Record modals read the record from its own source at open time: the central catalogue (`/api/catalogue/{id}`), That Old Chestnut (`/that-old-chestnut/_db/view.json`), Dartboard (`/dartboard/data/foi-tracker.csv`) or the research mirror. Nothing is copied into this repository. VIEW WEBAPP opens the source app (`/catalogue/?id=…`, `/forensic/…`, `/that-old-chestnut/#cn-…`, `/dartboard/`). If a source is unreachable, the modal says so and shows only the tree's own mapping.
- To add a leaf: add a row to `evidence-links.json` with a canonical record id; no code change is needed. Run `python3 tools/test_tree.py` (and `--online` to check every record resolves).

## What the gauge view measures

Mr Wolf is an evidence-led research dashboard concerning BP Properties Ltd v Buckler (1987). It is not a court finding, legal opinion or prediction.

The 0–200 total is an internal research rubric comprising four limbs, each scored 0–50. The first limb asks whether a discrepancy is shown by a record actually held; limbs 2–4 are scored only where limb 1 has a held record. Inference does not score, and pending records do not count. Each statement displayed against a lead cites an evidence-catalogue record; missing records remain visibly pending and are not counted.

The 100/200 line is an internal research triage marker only. It is not the legal test for setting aside a judgment, a finding of dishonesty or a prediction. The 40/50-on-each-limb marker is an internal file-preparation checklist, not a legal test or a determination of admissibility.

Route tags classify the record or institutional enquiry involved. In particular, a public-body tag is a separate institutional enquiry route; it is not, by itself, a ground to set aside the 1987 judgment. The 4.1.0 position panel and tree notes do not raise any scores: no post-letter repudiation, false 1983 declaration, deliberate suppression or public-official participation is currently proved by the records linked. Any register-rectification or public-body remedy enquiry requires its own evidence and legal basis.

## Data and implementation

- `leaderboard.json`: canonical lead facts, cited record IDs, pending items and internal scores (`cedwyn_mr_wolf_leaderboard/v2`).
- `routes.json`: route labels and per-lead tags.
- `data/central.json`: read-only snapshot of catalogue metadata for linked record IDs. It is generated from the central catalogue and must not be hand-edited.
- `mw.js`: builds the gauges, lead table and evidence modals from those data files.
- `mw.css`: responsive presentation.
- `VERSION` and `CHANGELOG.md`: release tracking.

When changing the board, preserve the evidence-only rule, keep each factual statement linked to a catalogue record, keep missing material in the pending list, and never score inference or pending material. If catalogue records need creating or changing, make that change in the BucklerFamily-Estate catalogue workflow rather than editing the generated `data/central.json` snapshot.

## Production release and preview

The canonical public page is [bucklerfamily.estate/mr-wolf/](https://bucklerfamily.estate/mr-wolf/). It is part of the main BucklerFamily.estate site, not a separate Pages custom domain.

Cloudflare Pages project `cedwyn-mr-wolf` is a standalone, no-build, static preview for this repository. Its `.pages.dev` URLs are not the production site and do not include the estate's shared header/runtime. Do not use them as proof of the production appearance.

The production release path is:
1. Merge the reviewed application change into this repository's `main` branch.
2. Run the existing `build-cedwyn` workflow (`workflow_dispatch`) in `unclehowell/cedwyn`. The estate assembler reads this repository's `main` directly for the `deploy: repo` app, adds the shared estate assets and builds the canonical `/mr-wolf/` route.
3. Verify the deployed page at [bucklerfamily.estate/mr-wolf/](https://bucklerfamily.estate/mr-wolf/), including both views and the shared header.

The Mr Wolf repository remains the sole source of truth for application code. Do not edit the legacy `section/mr-wolf` branch or attach the apex domain to the standalone preview project.

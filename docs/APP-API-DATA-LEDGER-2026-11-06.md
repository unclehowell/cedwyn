# App API, database and deployment evidence ledger — 6 November 2026

**Status:** partial, evidence-labelled review addendum to PR #378 (https://github.com/unclehowell/cedwyn/pull/378), issue #311 (https://github.com/unclehowell/cedwyn/issues/311), issue #188 (https://github.com/unclehowell/cedwyn/issues/188) and issue #310 (https://github.com/unclehowell/cedwyn/issues/310). This document does not certify production readiness. No merge, production deployment, route/DNS change, Worker change or database provisioning is included.

**Registry snapshot:** `split-repos.json` at `2f442c5773442383396acf63cbdfe54ead026d40`. It has 65 app rows, 63 `split-repo`, 2 `mirror`, and 58 `deploy: repo` flags. A flag means eligible/configured for repo-source assembly; it is not proof that the app is deployed straight from its repo. The main estate is still served by the central `cedwyn` Pages project (production branch `site`); a separate Pages project or successful preview is not proof that the public `/[app]/` route uses it.

## Current audited pilot: Tithe H3

| Field | Verified position |
|---|---|
| App / repo | Tithe H3 map — `unclehowell/cedwyn-tithe-h3` |
| Repo source | `main` at `005895fc2a8e4f0d9d57d08f169319dd52a1bf82` at inspection |
| Registry | `mode: split-repo`, `deploy: repo`, route `/tithe-h3/` |
| Production deployment | **Not independently verified.** The existing main-estate route still requires reconciliation with the final assembler report and a live route check. |
| Preview | PR #6 (https://github.com/unclehowell/cedwyn-tithe-h3/pull/6); Cloudflare Pages successful preview: https://pilot-tithe-h3-api-contract.cedwyn-tithe-h3.pages.dev |
| JSON / XML | Fixture-only `GET /api/v1` and content negotiation at `/` in PR #6 |
| MCP | Fixture-only Streamable HTTP `POST /mcp`, `resources/list`, `resources/read`; PR #6 |
| App-local dataset | `data/parcels.json`, `data/parcels-est.json`, `data/pins.json`, GeoJSON/CSV and the generated projection `data/central.json` |
| Central catalogue projection | `tools/sync_central.py` pulls seven allowlisted fields (`id, kind, title, date_display, date_sort, status, page`) for IDs referenced in `data/pins.json`. Snapshot `data/central.json`: 45 rows; last sync `2026-11-06T09:14:19Z`. Read-only, derived JSON file. |
| Local database | **No app-local D1 binding or durable DB configuration found.** `data/central.json` is a static file, not a database. |
| Tests | GitHub Actions API contract suite and preview workflow passed for commit `a3c8bc150165340f08df0efabcaadb553d53496c`; 13 tests included in the suite. |
| Remaining gates | Add the canonical app-local DB/migration under #310; replace fixtures with a DB-backed provider; configure Cloudflare edge rate limits; smoke-test the live preview endpoints; independently verify the production route; obtain human review. No Codex review completed because its review usage limit was reached. |

The pilot intentionally serves synthetic records only. It does not read `data/central.json`, make a live catalogue API, or expose real/private records. Production limits are documented but not enforced by the fixture Function. It is not merge/deploy ready merely because Actions/Pages preview are green.

## Per-app registry and API/database verification

The table lists the registry rows as they stand. API/MCP and local-database status is deliberately marked **not checked** unless a repository-level implementation and evidence were inspected. Do not interpret an not checked row as proof no API or database exists. App/page aliases require separate canonicalisation by deployment source and route; this registry table preserves every row, rather than silently collapsing same-repo or same-page aliases.

| App row | Dedicated repository | Registered path | Source mode | Repo deploy setting | JSON/XML/MCP evidence | App-local DB evidence |
|---|---|---|---|---|---|---|
| Wales 3D world | `unclehowell/cedwyn-wales-3d` | `/wales/` | split-repo | not set | Not audited / not checked | Not audited / not checked |
| Argentina Tŷ Mawr 3D world | `unclehowell/cedwyn-argentina-3d` | `/argentina/` | split-repo | not set | Not audited / not checked | Not audited / not checked |
| Tithe H3 map | `unclehowell/cedwyn-tithe-h3` | `/tithe-h3/` | split-repo | configured `repo` (not production proof) | Fixture JSON/XML/MCP on PR preview only; no live API | Static `data/central.json` (45-row projection); no D1/local DB found |
| Chubut H3 map | `unclehowell/cedwyn-chubut-h3` | `/chubut-h3/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Hive | `unclehowell/cedwyn-hive` | `/hive/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Dartboard | `unclehowell/cedwyn-dartboard` | `/dartboard/` | split-repo | not set | Not audited / not checked | Not audited / not checked |
| Analytics | `unclehowell/cedwyn-analytics` | `/analytics/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Cloudflare | `unclehowell/cedwyn-cloudflare` | `/cloudflare/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Spill | `unclehowell/cedwyn-spill` | `/spill/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Ask the Archive | `unclehowell/cedwyn-chat` | `/chat/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Mr Wolf | `unclehowell/cedwyn-mr-wolf` | `/mr-wolf/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| FCG | `unclehowell/cedwyn-fcg` | `/fcg/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Research Library | `unclehowell/cedwyn-research` | `/research/` | mirror | not set | Not audited / not checked | Not audited / not checked |
| Case Office | `unclehowell/cedwyn-app` | `/app/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Estate hub | `unclehowell/cedwyn-estate` | `/estate/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Patagonia | `unclehowell/cedwyn-patagonia` | `/patagonia/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Cyberspace | `unclehowell/cedwyn-cyberspace` | `/cyberspace/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Forensic Assessments | `unclehowell/cedwyn-forensic` | `/forensic/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Chessboard | `unclehowell/cedwyn-chess` | `/chess/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Grammar House | `unclehowell/cedwyn-csscpsg` | `/csscpsg/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Court Drills | `unclehowell/cedwyn-courtdrills` | `/courtdrills/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Old Bill | `unclehowell/cedwyn-oldbill` | `/oldbill/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Counting House | `unclehowell/cedwyn-accounts` | `/accounts/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Project Office | `unclehowell/cedwyn-projects` | `/projects/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Watchtower | `unclehowell/cedwyn-watchtower` | `/watchtower/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Directory | `unclehowell/cedwyn-directory` | `/directory/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Family Tree | `unclehowell/cedwyn-familytree` | `/familytree/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Kissed Frogs | `unclehowell/cedwyn-kissed-frogs` | `/kissed-frogs/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| That Old Chestnut | `unclehowell/cedwyn-that-old-chestnut` | `/that-old-chestnut/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Blog | `unclehowell/cedwyn-blog` | `/blog/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Nomenclature | `unclehowell/cedwyn-nomenclature` | `/nomenclature/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Map Room | `unclehowell/cedwyn-maps` | `/maps/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Docs / Evidence Catalogue | `unclehowell/cedwyn-docs` | `/docs/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Wayback Vault | `unclehowell/cedwyn-wayback` | `/wayback/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| E-book Shelf | `unclehowell/cedwyn-ebooks` | `/ebooks/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Land Changing Hands | `unclehowell/cedwyn-infographic` | `/infographic/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Q&A Hall | `unclehowell/cedwyn-qa` | `/qa/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| What They Don't Say | `unclehowell/cedwyn-whattheydontsay` | `/whattheydontsay/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| NFT Art | `unclehowell/cedwyn-nft-art` | `/nft-art/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Gift Shop | `unclehowell/cedwyn-shop` | `/shop/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Farm Album | `unclehowell/cedwyn-fb` | `/fb/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Post Office & Calendar | `unclehowell/cedwyn-emails` | `/email/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Legal Wiki & Evidence | `unclehowell/cedwyn-wiki` | `/wiki/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| The Story & Documentary | `unclehowell/cedwyn-story` | `/story/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Arcade | `unclehowell/cedwyn-arcade` | `/arcade/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Public Authorities & Council Chamber | `unclehowell/cedwyn-authorities` | `/authorities/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| FOI Requests | `unclehowell/cedwyn-wdtk` | `/wdtk/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Independent Review | `unclehowell/cedwyn-review` | `/review/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| HubSpot Task Control | `unclehowell/cedwyn-hubspot` | `/hubspot/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Flower Garden | `unclehowell/cedwyn-garden` | `/garden/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Revival AR | `unclehowell/cedwyn-revival-ar` | `/revival-ar/` | mirror | not set | Not audited / not checked | Not audited / not checked |
| Peekaboo | `unclehowell/cedwyn-peekaboo` | `/peekaboo/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Bloculous | `unclehowell/cedwyn-bloculous` | `/bloculous/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Theories | `unclehowell/cedwyn-theories` | `/theories/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Garden Store | `unclehowell/cedwyn-garden-store` | `/garden-store/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Storytime | `unclehowell/cedwyn-storytime` | `/storytime/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Molt | `unclehowell/cedwyn-molt` | `/molt/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Gallery | `unclehowell/cedwyn-gallery` | `/gallery/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Internet Archive Sources | `unclehowell/cedwyn-internetarchive` | `/internetarchive/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Terrain | `unclehowell/terrain` | `/terrain/` | split-repo | not set | Not audited / not checked | Not audited / not checked |
| Primary Records | `unclehowell/cedwyn-records` | `/records/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| The Council Chamber | `unclehowell/cedwyn-meeting` | `/2026-10-22/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Cedwyn documentary | `unclehowell/cedwyn-documentary` | `/documentary/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| Display settings | `unclehowell/cedwyn-settings` | `/settings/` | split-repo | configured `repo` (not production proof) | Not audited / not checked | Not audited / not checked |
| The Release Machine | `unclehowell/cedwyn-releases` | `/releases/` | split-repo | not set | Not audited / not checked | Not audited / not checked |

## Alias and scope cautions

- Registry rows (65) are not necessarily the number of unique visitor-facing applications or paths.
- Repeated repository assignments: none detected by repository field.
- Current repo-source configuration: 58/65 rows flagged `deploy: repo`; do not call this independently deployed completion.
- The latest previously recorded owner check in #311 said 2/59 paths were verified live from their own repository path (`/wales-3d/`, `/argentina-3d/`). That is a recorded report, not a fresh route probe performed for this addendum.
- The previous ledger in PR #378 is a deployment/source snapshot; it did not certify app APIs, MCP endpoints or app-local database contracts. This addendum corrects the evidence boundary but does not complete all 65 repository audits.

## Target interface and data contract

Each app's public API should read its own app-local dataset, populated by a read-only, provenance-preserving projection from the central catalogue. Public records must use an explicit allowlist, stable artifact IDs, source references, version/sync timestamps, bounded pagination, consistent errors and cache policy. Private routes need authentication and per-record authorization; no private correspondence, credentials or contact details may appear in public APIs. JSON/XML should be served by negotiated representation or safe companion paths. MCP must be a real protocol endpoint with JSON-RPC resources, not a static JSON file.

Per #310, use `view.json` as the single logical app-database contract; `section.sqlite` is only an optional chunked mirror for large apps, never a competing writer. App-specific schema/migrations/functions stay in each dedicated app repo. Central catalogue schema and shared sync tooling stay in `unclehowell/cedwyn` main. No app writes changes back into the central catalogue.

## Explicit next audit slices

1. Inspect each app repo for existing D1/SQLite/KV/DO/Pages Functions bindings, current JSON/XML endpoints, MCP server and public/private fields. Record a link or a precise unknown for every claim.
2. Compare final `_assemble_report.json` theme entries with the repo's deployed Pages/Worker origin and public route. Ignore early `_split_source` when the final theme status is `branch`, `branch+build`, `branch+overlay`, or `snapshot`.
3. Canonicalise aliases by route and deployment origin without deleting historical rows or navigation links.
4. Convert app-local static projections to the canonical local database contract one repository at a time, with tests and read-only central projections.
5. Only after preview tests, live-route validation and human approval should production deployment/route settings be changed.

**No production changes were made.**
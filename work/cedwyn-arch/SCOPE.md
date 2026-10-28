# Cedwyn migration, release and modular-app architecture

**Status:** planning and baseline audit in progress  
**Checkpoint date:** 2026-10-28 (UTC)  
**Canonical production site:** https://cedwyn.bucklerfamily.estate/  
**Repository:** https://github.com/unclehowell/cedwyn  
**Plan branch:** `codex/cedwyn-migration-plan-20261028`  
**Principle:** preserve the live front end; do not treat a configured redirect, a build report, or a failed web-crawler fetch as an end-to-end pass.

## Purpose and architecture decision to validate

Cedwyn should be one public website composed of independently versionable webapps at stable paths. A webapp should be buildable, testable, released, rolled back, and eventually extracted without forcing a replatform of the other apps. The evidence catalogue should be the canonical store for shared artifacts and provenance; an app's database should hold its own state or a bounded projection that points back to stable catalogue IDs—not an independently authoritative copy of evidence.

The source repos and deployed front end must remain separate concerns:
- `unclehowell/datro` is a read-only source/archive for the current migration; do not rewrite it or remove its deployments during this project.
- `unclehowell/cedwyn` owns the combined site build, route registry, catalogue database build and migration-specific additions.
- `main` is the build/control plane; `site` is the deployed static output branch; theme branches are input snapshots. The `section/<id>` workflow offers isolated, pinned sections but only where explicitly wired in `sections.lock`.
- Cloudflare Pages currently serves the `site` branch; Cloudflare rules are separate production configuration and need their own baseline and rollback.

## Audited baseline (verified from repository and Cloudflare API)

| Item | Snapshot | Meaning |
|---|---|---|
| Pages production | Deployment `cd51f1a7-ebc0-4787-9f9d-5210a8104e0e`, branch `site`, commit `15a8792bf6169d4907dedf899f7c5fc569d04667`, status `success` | Live rollback target recorded; a newer `main` preview was queued and is not production |
| Route registry | `themes.json` 1.1.1; **44** entries | Its note says 38 routes; README says 35 themes; these counts need reconciliation |
| Visible footer version | 1.0.2 on crawled public pages | Not aligned with registry/release version source |
| Shared catalogue | 14,194 artifacts; 19,584 locations; 301,175 graph edges; 10,351 FTS rows; 44 themes | Large, real catalogue already exists |
| Catalogue build size | 761,405,440 bytes; 2,905 chunks (maximum chunk reported: 262,144 bytes) | Check README's chunk-size claim against the actual build contract |
| Published GitHub Releases | None returned by the repository Releases endpoint | Formal app releases are not yet established |
| Historical tags | Existing tag set; mirror report records 70 branches pushed and 0 branch-push failures, but tag push ended with remote validation timeouts | Inventory current tags before creating new tags; do not overwrite legacy refs |
| Link guard | 8,713 pages / 337,996 links; `outbound_found: 0`, `pass: true` | Positive build check, but not proof that every redirect works |
| Pages projects | 76 configured projects | Several legacy apps still point at `unclehowell/datro` branches |
| Server-side database inventory | 10 Cloudflare D1 databases, 13 KV namespaces and 10 R2 buckets | Existing app-owned data backends already exist; map ownership and sync before adding another database |
| Redirect rules | Cloudflare dynamic-redirect zone ruleset version 26 | Covers many but not all application hosts; some paths/user agents/file extensions are excluded by design |

### Route/redirect observations requiring resolution

Existing mappings include:
- same-name theme paths for hosts such as `records`, `docs`, `wayback`, `nomenclature`, `maps`, `infographic`, `wiki`, `fb`, `chess`, `csscpsg`, `fcg`, `oldbill`, `accounts`, `authorities`, `review`, `qa`, `app`, `chat`, `watchtower`, `fb2`, `dartboard`, `directory`, `terrain`, `shop`, and `research`.
- legacy alias mappings include `bpvsbuckler → /story/`, `whatdotheyknow → /wdtk/`, `nomlecture/nolecture → /nomenclature/`, `csscpsgp → /csscpsg/`, and `2026-10-22 → /meeting/`.
- `emails`, `ebooks`, and `courtdrills` use a separate rule.
- the catch-all is **not** unconditional: GET/HEAD, limited path extensions, API exclusions, user-agent exclusions, FCG-specific exclusions and Research-specific path exclusions apply.

Known issues to test:
- `projects.bucklerfamily.estate`, `email.bucklerfamily.estate` and `story.bucklerfamily.estate` were present as app/registry hosts but not covered by the identified host-specific migration rules. Do not infer that a hostname works because DNS still points to a Pages origin.
- `fcg.bucklerfamily.estate` and `research.bucklerfamily.estate` have Worker-backed DNS and agent/MCP/WebMCP routes. Test and preserve those routes rather than replacing them indiscriminately.
- media hosts (for example `wayback-html`, `wayback-img`, `wayback-pdf`, `wayback-text`, `wayback-video`) may be serving files, not app pages. Classify each before any redirect.
- web-crawler fetch errors for some old and new URLs are **unknown**, not a failure verdict. Use direct HTTP tests from a controlled CI runner or equivalent and record status, location, content type and final response.

## Theme model and intended additions

Keep these areas distinct and cross-linked:
- Legal Wiki: `/wiki/`
- Research Library: `/research/`
- Primary records and central evidence catalogue: `/records/`, `/docs/`, `/catalogue/`
- Land/title-chain infographic: `/infographic/` (preserve the existing app rather than duplicating it)
- History/story: `/story/` (currently built from the `bpvsbuckler` branch) and `/fb/`
- Media/archive: `/wayback/` and existing gallery sources including `/fb/` and `/nft-art/`
- New standalone architecture reconstruction app: `/architecture/`
- New gallery discovery app: `/gallery/`, a cross-catalogue index that reuses artifact IDs and links to existing image sources rather than duplicating raw images.

The registry presently has no `/architecture/` theme or matching source branch, and no `/gallery/` route. Keep new branches within `unclehowell/cedwyn`; do not add a nonexistent source branch to `datro` or change `datro` to suit the migration.

Architecture scope should cover floor plans, elevations/sections, dimensional schedules, material register, photographs and image provenance, geometry/shape/scale notes, measurement confidence, and the separation of observed source facts from hypothetical reconstruction. It is an interpretation/reconstruction tool, not authority to present conjectural dimensions as measured facts.

## Staged delivery plan

### Stage A — hostname, path and reference inventory
- [x] Inspect the current registry, build/test reports, active Cloudflare ruleset, Pages project/deployment snapshot, branch model and release state.
- [x] Save a machine-readable inventory joining theme ID, old host aliases, desired path, source branch/commit, build mode, DNS target, Pages project/domain, redirect rule, API/media exceptions and HTTP test status (`work/cedwyn-arch/host-route-inventory.json`).
- [ ] Scan generated pages, static assets, scripts/data and raw source separately for hostname references; report executable links and plain-text mentions separately.
- [ ] Inventory all 76 Pages projects and all DNS records, then classify non-theme infrastructure/media hosts explicitly.

### Stage B — route correctness and no-regression tests
- [ ] Verify every mapped old host at root, representative deep routes, query strings, and redirects' final URL.
- [ ] Exercise HTML/extensionless routes plus JS/CSS/images/PDF/video, API/download, service worker, `robots.txt`, sitemap, MCP/WebMCP and agent endpoints. Compare content types and final status.
- [ ] Verify every new route on Cedwyn, its expected app identity, important links, mobile and desktop display, accessibility, and critical interactions.
- [ ] Add/fix only explicitly enumerated redirect rules, preserve query strings, protect API/media/original archive behavior, and record the new Cloudflare ruleset version. Retain the exact prior ruleset as rollback reference.
- [ ] Run the complete build, privacy scrub, link guard, self-containment and internal-link/anchor reports after changes.

### Stage C — per-app metadata and semantic releases
- [ ] Define a machine-readable app manifest: app ID, path, source branch, build/entrypoint, release SemVer, app-data schema, required catalogue schema/API version, health checks, data migration, owner and rollback reference.
- [ ] Derive each app's initial version from its existing manifest/footer/package data, or explicitly bootstrap it when absent. Do not invent release history or overwrite historic tags.
- [ ] Establish changelog and app-specific tag naming, e.g. `<app-id>-vMAJOR.MINOR.PATCH`, with one GitHub Release for each qualified app and a distinct site build release.
- [ ] Reconcile theme counts and version sources before issuing releases; release only from exact tested source SHAs with a human-readable change summary.
- [ ] Investigate why the existing mirror reported tag-transfer validation timeouts before relying on the old tags as a complete release ledger.

### Stage D — modular app / central catalogue contract
- [ ] Write an architecture decision record describing app independence, deployment boundaries, per-app data, central evidence ownership, schema evolution and extraction paths.
- [ ] Inspect existing Cloudflare DB bindings/storage before selecting a backend. The current catalogue is a chunked SQLite database in static Pages output; that is not the same as a server-side writable DB. Read-only Cloudflare API inspection confirms 10 D1 databases already exist: `terrain`, `cedwyn-apps`, `cedwyn-coins`, `ghf-chat`, `ghf-enquiries`, `qa-graph`, `research-wp-d1`, `fcg-wp-d1`, `bpvsbuckler-graph` and `financecheque-db`. Worker settings confirm bindings from `cedwyn-apps`/`cedwyn-api`, `fcg-wp`, `research-wp`, `ghf-chat`, `ghf-enquire`, `cedwyn-coins` and `terrain` to some of those data stores. Read-only `sqlite_master` queries confirm each DB has distinct application tables; the `research-wp-d1` and `ghf-chat` stores are especially substantial. This is a partial modular-backend foundation, not evidence that all 44 public themes have their own database or sync contract. Document the real binding map before designing any new DB.
- [ ] Define canonical evidence keys (stable artifact IDs/content hash), provenance/citations/location references, read API, incremental sync cursor, idempotency, schema compatibility and error/repair behavior.
- [ ] Keep per-app databases limited to app-owned state or derived projections; use canonical artifact references and do not duplicate the evidence blob as a second authority.
- [ ] Implement one small, testable vertical slice first—prefer the architecture app plus the new gallery index—before refactoring all existing themes.

### Stage E — deploy, validate, report
- [ ] Work on isolated branches and preview/test builds; do not push an unreviewed theme rewrite directly to production.
- [ ] Publish only after acceptance checks pass. Recheck all old hosts after the ruleset change, including intentional exceptions.
- [ ] Record the production deployment ID, source SHA, release/tag per app, redirect ruleset version, test matrix, known exceptions and rollback actions in a completion report.

## Stop/rollback gates

Do not proceed with a production cutover if any of the following applies:
1. A public app route fails or serves the wrong theme/content.
2. Any required query, deep link, media download, API or archive/original link is broken.
3. A worker/MCP/WebMCP endpoint is shadowed or loses its current behavior.
4. App/catalogue schema compatibility or evidence provenance is unclear.
5. A privacy, security, accessibility, mobile/desktop, link or build gate fails.
6. The previous production site/ruleset cannot be restored quickly.

## Progress log

| Date UTC | Status | Evidence / next action |
|---|---|---|
| 2026-10-28 | Baseline audit in progress | Registry 1.1.1 has 44 entries; database and outbound-test snapshots recorded above. |
| 2026-10-28 | Redirect gaps identified | Current rules are selective; `projects`, `email` and `story` require explicit verification/mapping. |\n| 2026-10-28 | Existing app DBs found | Cloudflare API read confirms 10 D1s, 13 KV namespaces and 10 R2 buckets; schemas were inspected as names only, with no application rows read. |
| 2026-10-28 | GitHub Issues unavailable | Repository returns HTTP 410 for Issues. Use this version-controlled checkpoint and a project-office / HubSpot task instead. |
| 2026-10-28 | Waiting for task-record approval | Propose one HubSpot task for the work plan; create only after the user approves the exact fields. |

## Definition of done

The task is done only when the hostname-to-route matrix is complete; each applicable old-host route has an end-to-end test result; all new routes are active; release artifacts are traceable to versioned commits; the independent-app/central-catalogue contract is documented and a vertical slice is tested; performance/UX has not regressed; and another agent can reconcile the plan, commits, test reports and live deployment without relying on chat history.

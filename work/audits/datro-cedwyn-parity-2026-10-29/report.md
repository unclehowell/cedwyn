# DATRO → Cedwyn parity audit — initial baseline

Audit started: 2026-10-29 UTC.

## Baselines
- Source repository: [unclehowell/datro](https://github.com/unclehowell/datro), default branch `gh-pages`, baseline `966c2f0cdb9d5ca83db53b52dd53b71afeb1f3b5`.
- Destination repository: [unclehowell/cedwyn](https://github.com/unclehowell/cedwyn), default branch `main`, baseline `7c3d324ceb974ff9df1cdc7f5c06fb16ecaa8e94`.
- Source `gh-pages` Git tree at baseline: 1,251 entries (recursive tree not truncated).
- Source repository branches enumerated from GitHub API: 73.
- Destination `themes.json` has 44 theme entries; it does not contain `datro.bucklerfamily.estate` among the configured theme/extra hosts in the file fetched for this baseline.
- Work branch: `audit/datro-cedwyn-parity-20261029` based on destination `main`. These files are audit artefacts only, not a production release.

## First verified discrepancy / uncertainty
The source branch has a hostname configuration conflict: root `CNAME` contains `world.datro.xyz`, while `index.html` declares `datro.bucklerfamily.estate` as canonical URL and assigns that hostname in its host variable. The Cedwyn theme registry does not list that hostname. This is an **UNCERTAIN mapping/deployment discrepancy**, not yet proof that content is missing: confirm the intended/current host and routing before closing the finding.

## Inventory handling
`branch-inventory.csv` records every branch returned by the API, SHA and unverified candidate names where branch naming could suggest an app host. Candidate names are explicitly hypotheses—not validated hostnames. `hosts-inventory.csv` records actual hostname observations separately. Expand the inventory using manifests, deployment/DNS configuration, route/link references and individual branch contents; keep work/backup/consistency branches distinct from deployable app branches.

## Status at start
- Fully audited hosts/routes: 0 (audit is in progress; no parity claims).
- Confirmed material omissions with follow-on task IDs: 0 at this stage.
- Open unresolved item: at least the CNAME/canonical-host conflict above.

## Next checks
1. Resolve hostname mapping evidence (source refs, registry and live host configuration).
2. Enumerate actual deployed hostname-to-branch mappings; do not mark candidates as hosts without confirmation.
3. Enumerate source branch route/resource trees and destination equivalents.
4. Compare each material item and document status with evidence.
5. Create/verify separate HubSpot tasks per confirmed material gap and link their IDs into the matrix.

## Scope protections
- Do not use obsolete live `datro.xyz` as an authoritative current content source.
- Do not infer missing content from failed requests, stale redirects or unverified host guesses.
- Do not modify production pages as part of the audit branch.


## Inventory update — 2026-10-29 16:55 UTC
Cloudflare API inventory reconciled against active zone `bucklerfamily.estate` and Cloudflare Pages project settings:
- DNS records in scope where the hostname contains `datro`: **51**.
- Cloudflare Pages projects enumerated: **91**.
- DNS hostnames whose matched Pages project source is `unclehowell/datro`: **49**.
- Hostnames routed to a Pages project sourced from `unclehowell/cedwyn`: **2**.
- DNS records without a matching Pages project remain flagged unresolved, not treated as missing content.
- Source branch list contains 73 refs; destination contains 133 refs. Same-named source branches absent from destination: backup/gh-pages-pre-april-rollback-2026-10-29, gui, hbnb. Among those, backup ref is not itself a confirmed deployable app; active Pages mappings must determine priority. `gui` and `hbnb` are confirmed production branch names in Pages configuration and currently have no same-named branch in Cedwyn, so each requires a specific scope/content assessment.
- The host inventory now records exact DNS CNAME, Pages project, configured production branch, source repo and last DNS modification time. Host-level rows remain `UNCERTAIN` for content parity until content and behaviour are checked.

## Confirmed deployment mappings requiring source/target check
The active DNS record for `gui-datro.bucklerfamily.estate` points to `gui-7ey.pages.dev`, whose Pages project is sourced from `unclehowell/datro` branch `gui`; `hbnb-datro.bucklerfamily.estate` points to `datro.pages.dev`, whose project is sourced from branch `hbnb`. Neither source branch currently exists in the Cedwyn repo. This is a verified repository/hosting difference—not yet a judgement that the page should be copied wholesale. The `hbnb` source entry looks like a generic Harmony Hub landing page, so treat that page's relationship to Cedwyn as an open classification decision rather than importing it as historical content.

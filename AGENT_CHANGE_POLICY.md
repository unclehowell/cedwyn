# Central-change and agent compartmentalisation policy

**Purpose:** keep Cedwyn's exhibits independently improvable without allowing one theme prompt or agent to silently change shared evidence, the central database, the public account, or deployment controls.

## Change boundaries

- A theme-only change should edit only that theme's source branch/files. It must not change `catalogue/`, `tools/build_db.py`, GraphQL, the shared catalogue UI, `themes.json`, `sections.json`, editorial rules, build/mirror workflows, public-source monitoring, or another theme.
- Central catalogue changes must be separate pull requests, with schema/version notes, a validation result and an impact statement.
- Source entries, source hashes, captures, original files, old versions and interpretations are append/update-with-history records, not disposable prose. Never delete or overwrite source artifacts merely to make the site read better.
- Never commit credentials, access tokens, private keys or non-public records that are not approved for publication. Public disclosure emails and attachments should have an explicit publication/privacy review, even if they are relevant to the case.
- The archival monitor may update only `catalogue/monitoring/state.json` and `catalogue/monitoring/history.jsonl`; it must never modify the source register or alter an interpretation.
- A theme's narrative may use a different educational format, but it must draw source descriptions, dates, provenance and uncertainty labels from the shared catalogue. An exhibit must not give allegations a stronger status than the source register does.

## Required GitHub repository controls

The workflow checks in this repository are a backstop. They do **not** replace branch rules. An owner/admin should configure a ruleset or branch protection for `main`:

1. Require a pull request; disallow direct pushes and force pushes.
2. Require at least one approval from `@unclehowell` for central paths, with CODEOWNERS review enabled.
3. Require the `Forensic catalogue validation` and `Central-change owner gate` checks before merge.
4. Disallow branch deletion and force push; restrict who can modify Actions workflows.
5. Protect the deployed `site` branch against direct edits. Only the reviewed build workflow should publish it.
6. Keep `unclehowell/datro` as a separate source of branch history. Cedwyn mirroring/builds must not write to datro.

Central paths include `.github/workflows/`, `tools/build_db.py`, `tools/site.py`, `tools/selfcontain.py`, `tools/assemble.py`, `tools/monitor_sources.py`, `tools/validate_catalogue.py`, `web/_cedwyn/`, `web/catalogue/`, `themes.json`, `sections.json`, `EDITORIAL.md` and `catalogue/`.

The owner-gate workflow intentionally requires the PR label `owner-approved-change` when a non-owner PR edits a central path. The label should be applied only after the owner has reviewed the complete diff. An ordinary theme-content PR should not need the label.

## Recovery and audit

Keep pull requests, commit history and build reports. If an AI agent proposes a site-wide rewrite, reject the broad change and request smaller PRs whose scope matches one exhibit or one central subsystem. Record the exact baseline, proposed diff, tests, source register changes and reason for the change. A prompt is not authority to override this policy.

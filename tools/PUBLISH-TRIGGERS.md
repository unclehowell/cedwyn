# Publish triggers

The live site (bucklerfamily.estate, Cloudflare Pages) is served from branch `site` of this repository, written by
`build-cedwyn` (.github/workflows/build.yml). A merge to a split app repository (`deploy: repo` in split-repos.json) does
not start that build on its own (bucklerfamily-estate#4). Until an automatic watcher is installed, a one-line entry here
(a `tools/**` change) starts the build, which assembles each app from its repository's main branch.

| Date (UTC) | App | Source commit | Reason |
|---|---|---|---|
| 2026-11-16 | Mr Wolf v4.0.0 | unclehowell/cedwyn-mr-wolf 239c237 (PR #21) | Legal Threshold Tree and Tree/Gauge toggle |

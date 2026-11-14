# Changelog — Great House Farm Q&A

## [0.2.0] - 2026-11-14

### Added
- `research/`: a page of six research questions drawn from public sources read on 13 and 14 November 2026 (neighbouring Coflein records, the Mathew family papers, the Plymouth estate plans, the published Cadw response ATISN 27021, the Ministry of Defence reply FOI2026/09019, and the May 1897 Marconi trials). Each gives the sources, what is not yet established and the records still to check.
- `research/questions.json`: the same six questions as data, in the item shape of `kb.json` (`kind: case`).
- A link to the research page under the hall heading.

### Unchanged
- `kb.json` and `api/qa.json` are not edited in this release; their generation dates stand.

## [0.1.1] - 2026-10-24

### Improved
- Display a clear, accessible warning when the static `kb.json` snapshot is older than 72 hours.
- Keep the recorded generation date intact; do not imply the snapshot was refreshed merely because the UI was rereleased.

### Validated
- The 19 October 2026 knowledge base contains 362 records with unique IDs, all required question/answer/status fields and at least one source reference each. Status counts sum to 362.
- Deployment still generates `/api/qa.json` from the shared `bpvsbuckler` export and retains its UID, syntax and live smoke checks.

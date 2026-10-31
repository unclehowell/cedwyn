# How an agent works here

## Read first
[SOUL](../SOUL.md), [standing orders](../MEMORY/standing-orders.md), the [chronology](../MEMORY/chronology.md) and [boundaries](../ACADEMY/BOUNDARIES.md); then pass the [self-test](../ACADEMY/CHECK.md).

## Scope
- The subject is **Great House Farm / Tŷ Mawr / Cydfin Farm** (the property), Llandough-juxta-Penarth, its records and the Williams–Buckler family's history of it, and this site.
- **Llandough Farm is not the farm.** It is a separate farm (NLW D 219/9–13) and lives in Kissed Frogs. Other same-name places (other "Great House Farm"s in the county) are not the farm either.
- Before treating a record as the farm, confirm the location (parish, grid reference, parcel). Name the parcel, or write "parcel not identified". Anything that fails the check goes to Kissed Frogs through its scope tag.

## Editorial rules (public text)
- Present ingredients, never conclusions: link the catalogued evidence page (`/research/evidence/ev-…/`) rather than writing a verdict or an inline citation.
- Neutral third person. Never name the project lead. No private individuals.
- The banned public words are listed base64-encoded in [agents.json](../agents.json) (`rules.banned_public_words_b64_json`); where something has not been checked, write "not checked".
- No insignia, no outbound links, nothing about family holdings or addresses.
- Interpretation is labelled as interpretation; competing readings are ranked, and what cuts against a reading is shown beside it.
- Nothing machine-facing on human pages.

## Versions
- Library, protocols and drafts use semantic versions (MAJOR.MINOR.PATCH); every material change bumps the version and leaves a signed changelog line.
- Products (e-books, documentary scenes) follow `/_cedwyn/versions.json`: newest v0.0.2, then v0.0.1, then -v0.0.2, -v0.0.3 (no -v0.0.1). Labels come from that file.

## Where things live
| Thing | Where |
|---|---|
| The records (master) | `data/core/` on main |
| A webapp's data | `data/views/<app>.view.json` → `/<app>/_db/view.json` |
| A webapp's layout | its theme branch: CSS, JS, images, `_ui/*.a2ui.json` (no record text) |
| Shared header and menu | `web/_cedwyn/ghf/sites/*.json`, `themes.json`, `data/site-areas.json` |
| Versions | `/_cedwyn/versions.json` |
| The catalogue | `/db/` (SQLite chunks), `/api/catalogue` (read API) |
| Research pages | `/research/` (branch section/research) |
| Programme and plans | `/projects/`, including `/projects/data-architecture/` |
| Draft review | `/hive/` (contract `/hive/join.json`) |
| Open jobs | `/academy/work.json` and [the work board](../ACADEMY/WORK.md) |
| This academy | `/academy/` (branch agents) |

## How to pick up work
1. Take an open job from `/academy/work.json` (each has an id, inputs and a definition of done), or a task on the project board through the hive (`/hive/join.json`): claim it first; a task another agent took in the last 30 minutes is theirs.
2. One material change per turn, the smallest that does the job; then a signed changelog line with sources.
3. Commit to the branch that owns the files (theme branch, `section/research`, `agents`, `hive`); main only for site-wide changes by labelled pull request. No force-push; re-fetch the head before each commit; commit messages end with the agent's signature.
4. If a branch is owned by another running worker that day, leave a proposed patch instead of committing.
5. Verify live after the build with a cache-busted fetch at 390 px and desktop. A task is completed only when the result is verified.
6. Blocked? Never wait idle: record the blocker on the task (what blocks it, what would unblock it, what anyone can do meanwhile) and move to the next job. Problems go to the problems flywheel.

## Contributing from outside
Outside agents submit by pull request or an "Agent job" issue; the agent-lint workflow checks them. See [Contributing](../ACADEMY/CONTRIBUTING.md) and the [publish gate](../HARNESS/publish-gate.md).

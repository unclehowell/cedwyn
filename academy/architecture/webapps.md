# Webapps

Every webapp on the site (formerly called themes): 44 in the registry, each served at its own path, each on its own branch or snapshot. The state column is how hard-coded its content is today; the view rule is the selection that will feed its own view database; the wave is its work package. Machine-readable: [architecture.json](architecture.json).

States: BUILT 2 · DATA-DRIVEN 1 · GENERATED 1 · HARD-CODED 15 · MIXED 13 · SNAPSHOT 12.

- **DATA-DRIVEN**: pages rendered from the webapp's view of the central catalogue.
- **GENERATED**: generated on main from repository data files.
- **BUILT**: built by a build step in its branch.
- **MIXED**: a data file exists, but the pages are pre-generated HTML.
- **HARD-CODED**: hand-written or pre-generated HTML, no data file.
- **SNAPSHOT**: a crawled or pinned copy of a running app; content must be extracted first.

## Historic artifacts

| Webapp | URL | Purpose | Source | Data today | State | View rule | Wave |
|---|---|---|---|---|---|---|---|
| The Legal Wiki | `/wiki/` | Snapshot of the legacy legal wiki: case pages, evidence posts and the change log, served inside Cedwyn | branch section/wiki (snapshot pinned in sections.lock) | content baked into the crawled or pinned HTML/JS; must be extracted to core first | SNAPSHOT | kind = evidence and grade >= 0, ordered by EV id | WP6 (wave 2) |
| Primary Records | `/records/` | Primary record register: the core documents of the farm, one row each | branch ghf-primary-records | 1 hand-written or pre-generated HTML pages; no data file | HARD-CODED | kind = evidence and grade >= 0, ordered by EV id | WP6 (wave 2) |
| Docs · The Evidence Catalogue | `/docs/` | The evidence catalogue as a document library | branch docs, folder public | built by the branch build step | BUILT | to be written in its work package | WP7 (wave 3) |
| The Wayback Vault | `/wayback/` | The Wayback Vault: captured copies of web pages, PDFs, images and video about the farm | branch wayback, folder wayback | 716 hand-written or pre-generated HTML pages; no data file | HARD-CODED | to be written in its work package | WP7 (wave 3) |
| Nomenclature | `/nomenclature/` | Every name used for the house, the estate, the town and the family, with each variant linked to its source | branch nomenclature, folder public | 27 hand-written or pre-generated HTML pages; no data file | HARD-CODED | kind = place, or the aliases of the farm and its variants; distinct_from shown as "not the same place" | WP5 (wave 1) |
| The Map Room | `/maps/` | The Map Room: historic and modern maps, plans and the tithe parcels | branch maps, folder public | 1 data JSON file(s) in the branch, 2 pre-generated HTML pages | MIXED | to be written in its work package | WP5 (wave 1) |
| The Farm Album | `/fb/` | The Farm Album: photographs and posts from the farm years | branch fb, folder site | 336 hand-written or pre-generated HTML pages; no data file | HARD-CODED | to be written in its work package | WP7 (wave 3) |
| Great House Farm II · Patagonia Museum | `/patagonia/` | Great House Farm II: the Patagonia museum area | branch section/patagonia (snapshot pinned in sections.lock) | content baked into the crawled or pinned HTML/JS; must be extracted to core first | SNAPSHOT | content layer only (texts, stops, questions) from core or an app register; game and engine code stays code | WP7 (wave 3) |

## Interactive

| Webapp | URL | Purpose | Source | Data today | State | View rule | Wave |
|---|---|---|---|---|---|---|---|
| The Land Changing Hands | `/infographic/` | The land changing hands: a visual chain of who held the land and when | branch infographic, folder public | 1 data JSON file(s) in the branch, 2 pre-generated HTML pages | MIXED | kind in {event, evidence} with a sortable date, ordered by date | WP6 (wave 2) |
| The Chessboard | `/chess/` | The Chessboard: the case as an interactive board of moves | branch chess, folder public | 4 data JSON file(s) in the branch, 4 pre-generated HTML pages | MIXED | content layer only (texts, stops, questions) from core or an app register; game and engine code stays code | WP7 (wave 3) |
| The Grammar House (CSSCPSGP) | `/csscpsg/` | The Grammar House: an interactive close reading of the wording in key documents | branch csscpsg, folder public | 4 data JSON file(s) in the branch, 3 pre-generated HTML pages | MIXED | content layer only (texts, stops, questions) from core or an app register; game and engine code stays code | WP7 (wave 3) |
| Court Drills · Procedural Unfairness | `/courtdrills/` | Court Drills: procedural points in the proceedings, 1955 to 1988, as drills | branch courtdrills, folder public | 1 data JSON file(s) in the branch, 2 pre-generated HTML pages | MIXED | content layer only (texts, stops, questions) from core or an app register; game and engine code stays code | WP7 (wave 3) |
| The Case Office | `/app/` | The Case Office: an interactive case workspace | branch section/app (snapshot pinned in sections.lock) | content baked into the crawled or pinned HTML/JS; must be extracted to core first | SNAPSHOT | content layer only (texts, stops, questions) from core or an app register; game and engine code stays code | WP7 (wave 3) |
| Ask the Archive | `/chat/` | Ask the Archive: a question box over the catalogue | branch section/chat (snapshot pinned in sections.lock) | content baked into the crawled or pinned HTML/JS; must be extracted to core first | SNAPSHOT | content layer only (texts, stops, questions) from core or an app register; game and engine code stays code | WP7 (wave 3) |
| The Disclosure Dartboard | `/dartboard/` | The Disclosure Dartboard: every body asked, and how far each answer has come (served at the apex) | crawled from its running app at build time | content baked into the crawled or pinned HTML/JS; must be extracted to core first | SNAPSHOT | content layer only (texts, stops, questions) from core or an app register; game and engine code stays code | WP7 (wave 3) |
| Cedwyn Estate | `/estate/` | Cedwyn Estate: the estate landing area | branch section/estate (snapshot pinned in sections.lock) | content baked into the crawled or pinned HTML/JS; must be extracted to core first | SNAPSHOT | content layer only (texts, stops, questions) from core or an app register; game and engine code stays code | WP7 (wave 3) |
| Cedwyn Pages | `/directory/` | Cedwyn Pages: a directory of every page on the site | branch directory, folder public | 1 data JSON file(s) in the branch, 310 pre-generated HTML pages | MIXED | to be written in its work package | WP7 (wave 3) |
| Virtual Tour · Wales | `/wales/` | Virtual Tour: Wales, the walking tour of the farm and Llandough | crawled from its running app at build time | content baked into the crawled or pinned HTML/JS; must be extracted to core first | SNAPSHOT | content layer only (texts, stops, questions) from core or an app register; game and engine code stays code | WP7 (wave 3) |
| Terrain · Cedwyn Estate in 3D | `/terrain/` | Terrain: the estate in 3D | crawled from its running app at build time | content baked into the crawled or pinned HTML/JS; must be extracted to core first | SNAPSHOT | content layer only (texts, stops, questions) from core or an app register; game and engine code stays code | WP7 (wave 3) |
| The Digital Estate | `/cyberspace/` | The Digital Estate: the online side of the estate | branch section/cyberspace (snapshot pinned in sections.lock) | content baked into the crawled or pinned HTML/JS; must be extracted to core first | SNAPSHOT | content layer only (texts, stops, questions) from core or an app register; game and engine code stays code | WP7 (wave 3) |
| The Garden Gallery | `/nft-art/` | The Garden Gallery: digital editions repainted as gardens from archive photographs, maps and plans | branch nft-art, folder public | 1 hand-written or pre-generated HTML pages; no data file | HARD-CODED | to be written in its work package | WP7 (wave 3) |

## A story to be retold

| Webapp | URL | Purpose | Source | Data today | State | View rule | Wave |
|---|---|---|---|---|---|---|---|
| The E-book Shelf | `/ebooks/` | The e-book shelf: each edition, its sample and its versions | branch ebooks, folder public | 76 hand-written or pre-generated HTML pages; no data file | HARD-CODED | its own small register (books, products, objectives, posts), promoted to a core kind in WP5 | WP5 (wave 1) |
| The Story | `/story/` | The Story: the narrative of the farm and the 1987 case as a guided read | branch bpvsbuckler, folder static/bpvsbuckler/dist | built by the branch build step | BUILT | to be written in its work package | WP7 (wave 3) |
| 1000 Cuts | `/thousand-cuts/` | 1000 Cuts: dated events, what each changed in law or in fact, each linked to its evidence | main data layer | generated on main from the repository data layer (data/*.json) | GENERATED | kind in {event, evidence} with a sortable date, ordered by date | WP6 (wave 2) |
| Old Bill · Who Gained, Who Lost | `/oldbill/` | Old Bill: who gained and who lost, set out from the records | branch oldbill, folder public | 3 data JSON file(s) in the branch, 1 pre-generated HTML pages | MIXED | to be written in its work package | WP6 (wave 2) |
| The Q&A Hall | `/qa/` | The Q&A Hall: questions and answers about the farm and the records | branch qa | 4 data JSON file(s) in the branch, 113 pre-generated HTML pages | MIXED | to be written in its work package | WP7 (wave 3) |
| Gift Shop & Marketplace | `/shop/` | Gift shop and marketplace | branch merch, folder public | 4 hand-written or pre-generated HTML pages; no data file | HARD-CODED | its own small register (books, products, objectives, posts), promoted to a core kind in WP5 | WP7 (wave 3) |
| Cedwyn · documentary | `/documentary/` | The documentary: one door a day, a two-minute scene from the chronology (also reached at /movie/) | branch cedwyn-movie, folder public | 12 data JSON file(s) in the branch, 2 pre-generated HTML pages | MIXED | to be written in its work package | WP7 (wave 3) |
| The family tree | `/familytree/` | The Williams–Buckler family of Tŷ Mawr as a tree, every person and link with its record | branch familytree, folder public | 1 hand-written or pre-generated HTML pages; no data file | HARD-CODED | kind = person_or_body and tags contain family (public-safe fields only) | WP5 (wave 1) |

## Modern research and how it's going

| Webapp | URL | Purpose | Source | Data today | State | View rule | Wave |
|---|---|---|---|---|---|---|---|
| FCG · Security Clearance | `/fcg/` | FCG register, including the first-seen register of records that appear online | branch section/fcg (snapshot pinned in sections.lock) | content baked into the crawled or pinned HTML/JS; must be extracted to core first | SNAPSHOT | content layer only (texts, stops, questions) from core or an app register; game and engine code stays code | WP7 (wave 3) |
| The Counting House | `/accounts/` | The Counting House: the money side of the records | branch accounts, folder public | 1 hand-written or pre-generated HTML pages; no data file | HARD-CODED | to be written in its work package | WP6 (wave 2) |
| Public Authorities | `/authorities/` | Public authority correspondence register | branch ghf-public-authorities | 1 hand-written or pre-generated HTML pages; no data file | HARD-CODED | kind = person_or_body (public bodies) with their events and requests | WP6 (wave 2) |
| FOI Requests (WhatDoTheyKnow) | `/wdtk/` | Information requests made in public, with their status | branch whatdotheyknow, folder public | 8 data JSON file(s) in the branch, 8 pre-generated HTML pages | MIXED | kind = person_or_body (public bodies) with their events and requests | WP6 (wave 2) |
| Independent Review | `/review/` | Independent review register | branch ghf-independent-review | 1 hand-written or pre-generated HTML pages; no data file | HARD-CODED | kind = person_or_body (public bodies) with their events and requests | WP6 (wave 2) |
| The Research Library | `/research/` | The Research Library: evidence pages, artefacts, missing records and findings | branch section/research (snapshot pinned in sections.lock) | content baked into the crawled or pinned HTML/JS; must be extracted to core first | SNAPSHOT | kind in {evidence, artifact} and scope.disposition = in_scope (with links) | WP6 (wave 2) |
| The Council Chamber | `/meeting/` | The Council Chamber: the community council meeting of 22 Oct 2026 and its papers | branch 2026-10-22, folder static/2026-10-22 | 2 hand-written or pre-generated HTML pages; no data file | HARD-CODED | to be written in its work package | WP7 (wave 3) |
| The Project Office | `/projects/` | The Project Office: programme and project pages (PRINCE2 style), including the data architecture programme | branch projects, folder projects/public | 7 data JSON file(s) in the branch, 169 pre-generated HTML pages | MIXED | its own small register (books, products, objectives, posts), promoted to a core kind in WP5 | WP5 (wave 1) |
| Watchtower | `/watchtower/` | Watchtower: before and after copies of outside pages about the farm, recaptured on a cycle | branch watchtower, folder public | 6 data JSON file(s) in the branch, 1 pre-generated HTML pages | MIXED | to be written in its work package | WP7 (wave 3) |
| farmbook 2 · Today | `/fb2/` | farmbook 2: today's posts and outside wording, quoted as written | branch fb, folder site2 | 121 hand-written or pre-generated HTML pages; no data file | HARD-CODED | to be written in its work package | WP7 (wave 3) |
| The Post Office | `/email/` | The Post Office: correspondence with record holders, summarised | crawled from its running app at build time | content baked into the crawled or pinned HTML/JS; must be extracted to core first | SNAPSHOT | to be written in its work package | WP7 (wave 3) |
| The Post Office · Calendar | `/emails/` | The Post Office calendar: dates of requests, replies and deadlines | branch emails, folder public | 3 data JSON file(s) in the branch, 1 pre-generated HTML pages | MIXED | to be written in its work package | WP7 (wave 3) |
| Kissed Frogs | `/kissed-frogs/` | Kissed Frogs: leads that looked like the farm and were checked and found not to be it (for example Llandough Farm, a separate farm) | branch kissed-frogs, folder public | central catalogue screening records (data/core) -> view rule data/views/kissed-frogs.view.json -> /kissed-frogs/_db/view.json; pages rendered by the shared renderer | DATA-DRIVEN (pilot live 30 Oct 2026) | scope.disposition in {not_this_property, separate_property, out_of_scope, name_correction, dating_correction, assertion_only, context_only, on_hold} | WP1 (pilot) |
| What They Don't Say | `/whattheydontsay/` | What They Don't Say: dated questions to public bodies, when an answer was due, and what came back | branch whattheydontsay, folder public | 1 hand-written or pre-generated HTML pages; no data file | HARD-CODED | kind = observation and tags contain silence, plus public correspondence summaries | WP5 (wave 1) |
| Blog | `/blog/` | Blog: short dated posts on the history, heritage and records of the farm | branch blog, folder public | 1 hand-written or pre-generated HTML pages; no data file | HARD-CODED | its own small register (books, products, objectives, posts), promoted to a core kind in WP5 | WP5 (wave 1) |

## Other areas (not webapps)

- `/academy/`: Cedwyn Academy, machine-facing, branch agents
- `/hive/`: multi-agent draft review room, branch hive
- `/learn/`: the human learning area
- `/_cedwyn/`: shared runtime, header files, versions file, A2UI catalog
- `/db/`: the catalogue database in chunks

Shared across all of them: the header and menu files and `/_cedwyn/versions.json` (see [Structure](structure.md)).

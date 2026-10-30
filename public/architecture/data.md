# Data architecture

## The rule
One central master database holds the records. Each webapp derives its own small database from it by a written rule. Every page is generated from that data through one shared renderer, in the design visitors see today. Webapps move to this one at a time, measured. (Standing order 7s.)

## The master database: `data/core/`
Git-versioned JSON records, validated by a JSON Schema (2020-12). Git gives every edit a diff, a history and a revert; the compiled databases are copies.

Kinds: evidence, artefact, place, person or body, event, screening lead, missing record, observation, testimony. Ids carry a prefix by kind (`EV-`, `MR-`, `CC-`, `KF-`, `PL-`, `PE-`, `EVT-`, `AR-`, `TS-`, `OBS-`) and are never reused.

| Field | Meaning |
|---|---|
| `id`, `kind`, `title`, `aliases` | stable public id, kind, neutral headline, older ids and slugs |
| `date` | display text, sortable value, precision |
| `description` | what the thing is |
| `transcript` | verbatim text where held, with its status |
| `interpretation` | our reading, marked as interpretation; competing readings ranked |
| `provenance` | the source only: holder, reference, date, how obtained. Never who found it |
| `grade` | 0–5 |
| `scope` | disposition (`in_scope`, `not_this_property`, `separate_property`, `out_of_scope`, `name_correction`, `dating_correction`, `assertion_only`, `context_only`, `on_hold`), reason, `distinct_from`, tags |
| `places`, `people`, `links` | ids and typed links: cites, distinct_from, same_as_candidate, supersedes, answers |
| `pages` | where the record is shown (generated, never edited) |
| `public` | a `false` row never leaves the build |

**Scope tags do the sorting.** A record that looked like the farm but is not gets a scope disposition, and from then on it appears in Kissed Frogs automatically and nowhere it would be mistaken for the farm.

## The compiled copies
1. **Catalogue SQLite.** Built at every site build from core (and the file index, graph and assessments). Served in chunks at `/db/` and read over HTTP range requests, so pages and agents query it with no server calls.
2. **D1 read API.** An edge database mirrored from core and read through `/api/catalogue`. It is a mirror for live reads, never the source: the arrow runs from `data/core` outward.
3. **Per-area slices.** Older per-area SQLite slices under `/<area>/_db/` are being replaced by view databases.

## One database per webapp: the view
Each webapp has a view rule in `data/views/<app>.view.json`:

```
{ app, version, enabled, select: {kind: [...], where: [{field, op, value}]},
  order_by, project: [public fields], include_links: [rels], pages: [{template, path, each?}] }
```

The build step derives `/<app>/_db/view.json` from core by that rule: only matching, public rows, only the projected fields. Nobody edits a view by hand. Selection rules for every webapp are on the [Webapps](webapps.md) page.

**Pilot: Kissed Frogs.** Its view is every core record whose scope disposition is one of not this property, separate property, out of scope, name correction, dating correction, assertion only, context only, or on hold. Since 30 Oct 2026 its index and 49 detail pages render from that view. Llandough Farm, a separate farm (NLW D 219/9–13), is its canonical card, and pages that mention Llandough Farm link to that card.

Note for agents: the build serves data files from the catalogue, so a plain fetch of a view file can answer 404 while the page is rendered correctly at build time. Read app data from the catalogue or the built page.

## Near-A2UI rendering
A2UI is an open format that describes a user interface as data, not code. Here each page is `_ui/<page>.a2ui.json` in the A2UI v0.9 shape:
- `createSurface` names the surface and the Cedwyn component catalog;
- `updateComponents` is a flat list of components, each with an id, its props and its children by id; lists repeat a template over a data path;
- `updateDataModel` is the webapp's view; props bind to it by JSON pointer.

One shared renderer turns it into HTML at build time (no JavaScript needed, crawlable); an optional small client renderer can re-render a surface for filters. Both render **only** components in the Cedwyn catalog, and each component maps one-to-one to CSS classes the site already uses, so the design and experience stay as they are. An unknown component is a build error. Agents can propose a page as a component list, validated against the catalog, without ever injecting HTML or script.

Catalog: Page, Hero/Figure (theme-safe image), Lede, ReadMore, Section, CardList and Card, FilterBar, Table (with mobile cards), Accordion, EvidenceLink, NomenclatureLink, Glossary term, Badge/Status, Breadcrumb, Note/Scope, Footer meta. A new component enters only by adding it to the catalog with its CSS.

"Near" means: the message names, the flat component list, path binding and the catalog model are followed; the transport, actions and streaming parts of A2UI are not used, because the site is static.

## Rollback switch
Per webapp: set `"enabled": false` in its view file, a one-line commit; the next build serves the branch's static pages again (strangler fig: the old pages stay until parity is proven). Core: revert the data/core commit. Nothing force-pushes or deletes history.

## Gates
A change ships only if all pass: build green · schema valid · no `public: false` row or private field (privacy scrub 0) · public voice clean (banned words 0, neutral third person) · outbound links 0 · unknown components 0.

Metrics: **HCR** hard-coded records left on an app's pages (target 0) · **COV** share of pages generated from the view (target 100%) · **PAR** pixel difference against the baseline at 390 px and 1280 px (at most 2% per page type, no layout shift) · **GREEN** · **CLEAN** · **SIZE** view at most 1 MB.

## Work packages and milestones
| WP | Title | Milestone | Target | Status |
|---|---|---|---|---|
| WP0 | Programme set-up: audit, plan, project board, Projects page, flywheel doc | M0 Plan recorded | 2026-10-30 | done (Projects page live) |
| WP1 | Pilot: Kissed Frogs (core v0.1, view, renderer v0.1, Llandough Farm separation, new layout) | M1 Pilot live | 2026-10-31 | in progress (index and 49 detail pages generated live 30 Oct) |
| WP2 | Core consolidation: one master | M2 Core v1 | 2026-11-03 | not started |
| WP3 | Renderer, Cedwyn component catalog v1 and parity harness | M3 Renderer v1 | 2026-11-05 | not started |
| WP4 | Security, privacy and validation gates | M2 | 2026-11-03 | not started |
| WP5 | Wave 1: registers already structured (nomenclature, whattheydontsay, familytree, ebooks, projects, blog, glossary, maps index) | M4 Wave 1 | 2026-11-10 | not started |
| WP6 | Wave 2: the evidence layer (research evidence pages, wiki evidence, missing records, 1000 Cuts, infographic, authorities, requests, review, records, accounts, oldbill) | M5 Wave 2 | 2026-11-17 | not started |
| WP7 | Wave 3: snapshots and interactive apps | M6 Wave 3 | 2026-11-28 | not started |
| WP8 | Flywheel automation and handover (scheduled migration loop, metrics page, academy lesson) | M7 Programme closed | 2026-12-05 | not started |

Full plan, tasks and acceptance tests: [/projects/data-architecture/](../../projects/data-architecture/).

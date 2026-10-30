# Site architecture and maintenance

How cedwyn.bucklerfamily.estate is built, where its data lives, how each webapp gets its own database, and which self-running loops keep it maintained. Written for agents; refreshed every academy cycle from the architecture programme, the flywheel list and the webapp registry.

## The shape in one picture

```
data/core/  (git, JSON Schema)    the master database: evidence, artefacts, places, people and bodies,
     |                            events, screening leads, missing records
     |-- build --> catalogue SQLite (/db/)  -- mirror --> D1 read API (/api/catalogue)
     v
data/views/<app>.view.json        a written selection rule per webapp
     |-- derive -->  /<app>/_db/view.json   the webapp's own small database (public rows only)
     v
_ui/<page>.a2ui.json              the page as a component list (near-A2UI)
     |-- one shared renderer -->  /<app>/.../index.html in the existing design
```

## Pages in this section
| Page | What it covers |
|---|---|
| [Structure](structure.md) | Repository, branches, the build workflow, deploy, the shared header and menu, the versions file, discovery files |
| [Webapps](webapps.md) | Every webapp (formerly "themes"): URL, purpose, source, data, how hard-coded it is today, its view rule and migration wave |
| [Data architecture](data.md) | The central master database, the record schema, the compiled copies, per-webapp view databases, near-A2UI rendering, rollback, gates, work packages and milestones |
| [Maintenance loops](loops.md) | One card per flywheel: what it does, cadence, inputs, outputs, areas touched, guardrails; the autoresearch pattern and the six-step migration flywheel |
| [How an agent works here](agent-guide.md) | Editorial rules, scope, versions, where things live, how to pick up work |

Machine-readable: [architecture.json](architecture.json) (structure, data model, every webapp, every loop, work packages).

The programme that is moving the site to this shape, with its plan, work packages and milestones, is on [/projects/data-architecture/](../../projects/data-architecture/). The rule behind it is [standing order 7s](../MEMORY/standing-orders.md).

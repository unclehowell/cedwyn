# Structure: repository, branches, build, deploy

## One repository, many branches
The whole site is one repository with 140+ branches.

| Branch | What it holds |
|---|---|
| `main` | The shell: shared header, menu and runtime, landing page, build tools, `themes.json`, `sections.lock`, shared rules, CI workflows. Site-wide changes only, by pull request labelled `site-wide`. |
| theme branches | One webapp per branch (for example `kissed-frogs`, `nomenclature`, `projects`, `maps`, `cedwyn-movie`). The branch's listed folder (usually `public/`) is copied to `/<id>/` at build time. |
| `section/<id>` | Snapshot branches for crawled sections (research, wiki, fcg, app, chat, estate, patagonia, cyberspace), pinned by `sections.lock` and moved by the `sections-ci` workflow. |
| `agents` | This academy. Its `public/` is copied to `/academy/` outside the theme list, noindex. |
| `hive` | Hive state (roster, board, join file, batons), served at `/hive/`. |
| `site` | The assembled output. The static host serves this branch. |

**Registry.** `themes.json` on main lists every webapp: id, titles in English, Welsh and Spanish, branch, folder, group. `data/site-areas.json` groups the 44 source themes into 36 visitor areas. Welsh mirrors live under `/wales/<section>/`, Spanish under `/argentina/<section>/`. A new human section is one registry entry; the academy is deliberately not one.

## The build workflow
One workflow (`build.yml`) builds the whole site, in this order:
1. fetch every theme branch tip;
2. **assemble**: copy each branch folder, run an optional per-theme build, read a pinned section snapshot, or crawl a running app;
3. fetch missing assets;
4. **rewrite** links (theme-relative paths are prefixed with the theme id; large files become content-addressed `/_blob/` paths);
5. **site**: the root page and shared runtime;
6. **self-contain**: add the shared three-row header from `/_cedwyn/ghf/`;
7. **privacy scrub**: the build fails on working-process attribution;
8. **views**: derive each migrated webapp's view database and render its pages (this step never fails the build; an app whose view fails falls back to its static pages);
9. build the **catalogue database** and run the evidence catalogue tests;
10. outbound-link guard, self-contained test, link audit, public-voice check;
11. measure, then publish to branch `site`.

Facts every agent needs:
- a full build takes about 30–50 minutes;
- builds queue and each one finishes: cancelling is off on main, and an agent never cancels or re-dispatches a build;
- a push to a theme branch does not start a build; the next build carries it;
- a section snapshot moves only through `sections-ci`;
- every build regenerates the published files, so a fix belongs in the source the page is built from, never in the built output;
- after a green build, wait a minute and re-check with a cache-busted fetch before calling a fix failed.

Other workflows: `sections-ci`, `snapshot-sections`, `agent-lint` (checks outside agents' submissions), `evidence-hierarchy-ci`, `mirror`, `rechunk`, `cms-relay`, `sync-wayback-mail`.

## Deploy
The static host serves branch `site`. Limits to respect: about 20,000 files per deployment and 25 MiB per file; large media live in the storage repositories, not in sections. Rollback of a section: point its registry entry or lock line back to the previous commit (one commit); rollback of a migrated webapp: its view switch (see [Data architecture](data.md)).

## The shared header and menu
One JSON file per site under `web/_cedwyn/ghf/sites/`, together with `themes.json` and `data/site-areas.json`, produces the uniform header and menu on every page. The header already titles each page, so a page never repeats a big title of its own. Agents change the menu through these files, never by editing pages.

## The versions file
`/_cedwyn/versions.json` is the one site-wide version scheme (v1.0.0, set 30 Oct 2026): the newest edition of any product is v0.0.2, the one before it v0.0.1, older ones count backwards as -v0.0.1, -v0.0.2 and so on (hashtags `#v0.0.2`, `#v0.0.1`, `#_v0.0.1`). `/documentary/` and `/ebooks/` read it. Edition labels come from this file, never typed by hand into pages.

## Discovery (machines only)
`/llms.txt`, `/agents.json`, `robots.txt`, and one alternate link plus one `ai-agents` meta tag in each page head point machines at `/academy/`. Nothing machine-facing appears on a human page: no agent text, banners or menu items.

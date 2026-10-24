# Cedwyn

**cedwyn.bucklerfamily.estate** — one catalogue database of Great House Farm evidence, browsed through 35 themes.
Each theme is one of the former datro subdomain websites, kept with its own look and navigation, now living under one URL
at `/<theme>/`. Moving between themes works like moving between the old subdomains did.

The old repo (`unclehowell/datro`) and the old subdomains are untouched: this repo only reads from them.

## What is in this repo

| Branch | What it holds |
|---|---|
| `main` | The build: `themes.json`, `tools/`, `web/`, workflows, build reports |
| `site` | The built site Cloudflare Pages serves (themes, `/_blob/` store, `/db/` chunks) |
| every other branch | A mirror of the datro branch of the same name, with its history (see "History rewrite") |

## How it works

1. **Mirror** (`.github/workflows/mirror.yml`): `git clone --mirror` of datro, then every branch and tag is pushed here.
2. **Assemble** (`tools/assemble.py`): each theme's site is copied out of its mirrored branch (the same folder its old Pages project served).
   Sites with no static branch output (Workers, the apex domain's own repo) are copied by a read-only crawl of the live site.
3. **Shared assets** (`tools/fetch_missing.py`): scripts, styles and images that one site loads from another (for example the shared header scripts on the apex domain) are copied read-only from the live site into the theme they belong to.
4. **Rewrite** (`tools/rewrite.py`):
   - cross-subdomain links `x.bucklerfamily.estate/...` become `/<theme>/...`;
   - root paths gain the theme prefix;
   - **no outbound links**: every external link goes to the archive interface at `/wayback/go/?u=…`, which opens our captured copy, or records the address as text when it has not been archived yet;
   - evidence files that appear in more than one theme are stored **once** in a content-addressed store `/_blob/<sha>.<ext>`.
5. **Runtime** (`web/_cedwyn/runtime.js`): loaded first in every page (`ghf-boot.js` stays last in `<head>`).
   It applies the same mapping to paths that page scripts build at run time, and guards links, `window.open` and forms against leaving the archive.
6. **Catalogue database** (`tools/build_db.py`): one SQLite file holding every artifact:
   - `artifacts` — one row per unique file, by sha256;
   - `locations` — every place an artifact appears, in every theme;
   - `blobs` — the evidence bytes themselves;
   - `fts` — an FTS5 full-text index;
   - `nodes` and `edges` — a graph: page→embeds/links→artifact, artifact→mentions→year, artifact→cites→source host, artifact→in_theme→theme. This is a ready base for graph-RAG.
   - `captures` — original URL → archived copy.
7. **The 25 MB limit**: the database is VACUUMed (page size 4096) and split into 512 KB chunk files (`/db/cedwyn.sqlite3.0000`, `.0001`, …), far under GitHub's and Pages' per-file limits.
   The browser fetches only the chunk files a query touches (sql.js-httpvfs, chunked mode). Each request is one whole chunk file, because Cloudflare Pages answers HTTP Range requests with the whole file. No server, no D1, no cron.
8. **GraphQL** (`/graphql/`): one schema (`web/_cedwyn/cat.js`) resolved in the browser against the database.
   It covers themes, artifacts, locations, full-text search, graph edges, nodes and captures. The catalogue page `/catalogue/` uses the same layer.
9. **Outbound-link test** (`tools/check_links.py`): the build fails if any external `<a>`/`<area>` href or form action survives,
   or if the excluded YouTube channel appears anywhere.

### Why images are binary BLOBs, not base64 text

Base64 makes every image a third bigger, which works against "maximum efficient". So the database stores the raw bytes.
The catalogue and the GraphQL `dataUri` field turn them into base64 `data:` URIs when they are read, so you still get base64 images, without the extra size on disk or in the download.

Large media (video, very large PDFs) are not inlined. They stay referenced to the wayback-* and Internet Archive copies.

### History rewrite (cedwyn only)

The mirrored branches here have rewritten history; datro's history is unchanged. Two things were rewritten:
- `.github/workflows/*` was dropped from every commit. This stops datro's deploy workflows from running from this repo, and it is needed because the Actions token may not push workflow files.
- Secret-looking strings (ASP.NET machineKey values, API tokens, private keys) were replaced with `REMOVED-IN-CEDWYN`.

Because of the rewrite, commit IDs differ from datro's. Tags were mirrored too. `reports/mirror.json` lists what was pushed and what the scans found.

## Build numbers (first build, 24 Oct 2026)

- Database: 499.7 MB, in 954 chunk files of 512 KB each.
  - 8,616 unique artifacts, seen at 12,843 locations across the themes.
  - 2,182 evidence files stored as BLOBs (463 MB).
  - 5,963 full-text rows.
  - Graph: 933 nodes and 65,888 edges.
  - 183 archived-page captures.
- Site: about 13,600 files, about 2 GB.
  - 2,338 duplicate evidence files across themes were folded into the content-addressed store (`/_blob/`).
  - 2,143 copies stay in place, because page scripts name them directly.
- Outbound-link test: 4,239 pages and 74,926 links checked. Outbound links left: 0. The guard pass rewrote 2 links that the parser had missed.
- Mirror: all 70 datro branches and 2,184 tags.


See `reports/` (written by every build): `db.json` (database size, chunk count, artifacts, edges), `size.json`, `_assemble_report.json`, `_rewrite_report.json`, `_outbound_test.json`.

## Themes

| Theme | Path | Former address | Source |
|---|---|---|---|
| Primary Records | `/records/` | records.bucklerfamily.estate | branch `ghf-primary-records` |
| Docs · The Evidence Catalogue | `/docs/` | docs.bucklerfamily.estate | branch `docs` /public |
| The Wayback Vault | `/wayback/` | wayback.bucklerfamily.estate | branch `wayback` /wayback |
| Nomenclature | `/nomenclature/` | nomenclature.bucklerfamily.estate | branch `nomenclature` /public |
| The Map Room | `/maps/` | maps.bucklerfamily.estate | branch `maps` /public |
| The Land Changing Hands | `/infographic/` | infographic.bucklerfamily.estate | branch `infographic` /public |
| The Legal Wiki | `/wiki/` | greathousefarmwiki.wordpress.com | branch `wiki` /site |
| The E-book Shelf | `/ebooks/` | ebooks.bucklerfamily.estate | branch `ebooks` /public |
| The Story | `/story/` | bpvsbuckler.bucklerfamily.estate | branch `bpvsbuckler` /static/bpvsbuckler/dist |
| The Farm Album | `/fb/` | fb.bucklerfamily.estate | branch `fb` /site |
| The Chessboard | `/chess/` | chess.bucklerfamily.estate | branch `chess` /public |
| The Grammar House (CSSCPSGP) | `/csscpsg/` | csscpsg.bucklerfamily.estate | branch `csscpsg` /public |
| FCG · Security Clearance | `/fcg/` | fcg.bucklerfamily.estate | crawl of live site |
| Old Bill · Who Gained, Who Lost | `/oldbill/` | oldbill.bucklerfamily.estate | branch `oldbill` /public |
| The Counting House | `/accounts/` | accounts.bucklerfamily.estate | branch `accounts` /public |
| Public Authorities | `/authorities/` | authorities.bucklerfamily.estate | branch `ghf-public-authorities` |
| FOI Requests (WhatDoTheyKnow) | `/wdtk/` | whatdotheyknow.bucklerfamily.estate | branch `whatdotheyknow` /public |
| Independent Review | `/review/` | review.bucklerfamily.estate | branch `ghf-independent-review` |
| The Q&A Hall | `/qa/` | qa.bucklerfamily.estate | branch `qa` |
| The Council Chamber | `/meeting/` | 2026-10-22.bucklerfamily.estate | branch `2026-10-22` /static/2026-10-22 |
| The Project Office | `/projects/` | projects.bucklerfamily.estate | branch `projects` /projects/public |
| The Case Office | `/app/` | app.bucklerfamily.estate | crawl of live site |
| Ask the Archive | `/chat/` | chat.bucklerfamily.estate | crawl of live site |
| Watchtower | `/watchtower/` | watchtower.bucklerfamily.estate | branch `watchtower` /public |
| farmbook 2 · Today | `/fb2/` | fb2.bucklerfamily.estate | branch `fb` /site2 |
| The Post Office | `/email/` | email.bucklerfamily.estate | crawl of live site |
| The Post Office · Calendar | `/emails/` | email.bucklerfamily.estate/calendar | branch `emails` /public |
| Home · The Disclosure Dartboard | `/dartboard/` | bucklerfamily.estate | crawl of live site |
| Cedwyn Estate | `/estate/` | bucklerfamily.estate/cedwyn | crawl of live site |
| Cedwyn Estate Directory | `/directory/` | directory.bucklerfamily.estate | branch `directory` /public |
| Great House Farm II · Patagonia Museum | `/patagonia/` | bucklerfamily.estate/patagonia | crawl of live site |
| Virtual Tour · Wales | `/wales/` | bucklerfamily.estate/wales | crawl of live site |
| Terrain · Cedwyn Estate in 3D | `/terrain/` | terrain.bucklerfamily.estate | crawl of live site |
| The Digital Estate | `/cyberspace/` | bucklerfamily.estate/cyberspace | crawl of live site |
| Gift Shop & Marketplace | `/shop/` | shop.bucklerfamily.estate | branch `merch` /public |

## What remains (stage 2)

- Convert each theme's own data files (JSON feeds, galleries) to read straight from the catalogue database, so every theme's text and records come from the one DB as well as its images.
- Add a service worker that serves `/_blob/` from the database, so the static copy of the store can go.
- Rebuild the crawl-based themes (Workers and the apex site) from source, so their script-loaded data comes along too.
- Add people and places to the graph (it currently has years, themes, source hosts and links), then embeddings for graph-RAG.

— Sion's Tab agent

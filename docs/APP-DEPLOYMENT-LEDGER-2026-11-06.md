# App deployment and data-dependency ledger — review snapshot

**Snapshot:** 6 November 2026 (UTC).  
**Status:** Review inventory, not deployment approval. No route, DNS, Worker, D1 or production build was changed while compiling this ledger.

## Evidence and scope

This follows the 6 November owner directive in cedwyn#188 and the migration step in cedwyn#311. It separates repository source-of-truth from actual production serving path. The registry field `mode: split-repo` does **not** mean that an app is already directly served from its repository.

| Source | SHA / state |
|---|---|
| `split-repos.json` | `dac908d92af9e42412f58f8edbecc7cf22e21ed4` — 65 app repository rows |
| `themes.json` | `25cb2d03b89c0fac34e0a61427e78f46f6bf6868` — 54 themes |
| `data/site-areas.json` | `b5efe82f761f01bfd7abcd9fda65ae03f4850f23` — public path/area registry |
| `sections.lock` | `95f9530fd5eb4872154340fe127773d4d22079f8` — pinned section branches |
| Registry modes | 63 `split-repo`; 2 `mirror` |

All 65 application repository `main` HEADs below were read from GitHub's branches API during this audit. These SHAs are immutable snapshot identifiers; re-read branch heads before a source switch or release.

## Executive state

- **65 repositories are registered** (64 `cedwyn-*` repositories plus pre-existing `terrain`).
- **63 rows are `split-repo`; 2 are temporary `mirror`**: Revival AR and Research. Their writers still target old Cedwyn branches; they must not be switched to repo-main source until those writers move.
- At the latest owner-verified live check in #188 (10:37 UTC), **3 path-Worker apps were live from their repositories**: Catalogue, Argentina 3D and Wales 3D. **56 of the 59 tour apps** still served through the Cedwyn build.
- There are 65 repository rows but 59 navigation slots. Do not force all supplemental repos into Navigator slots. `terrain` is pre-existing. Catalogue browser is an additional repository and is not currently in `split-repos.json`.
- Main's build path still assembles legacy theme branches and publishes `site`. For a `split-repo` row, the current flow is repo `main` → `sync-split-repos.yml` → legacy branch → `build-cedwyn` → `site`. PR #313's repo-source assembler change remains open/unmerged.
- The old `migration` branch has a 59-row programme last updated 3 November. It uses `webapp/<id>` branches and `cedwyn-webapp/1.0.0`; that predates the 6 November dedicated-repository directive and does not record current repo HEADs or live Worker routes. It is historical planning, not the current ledger.

## Repository-by-repository inventory

| App | Repository | `main` HEAD | Legacy branch | Registry mode | Registry route | Deployment origin / observed path |
|---|---|---|---|---|---|---|
| Wales 3D world | `unclehowell/cedwyn-wales-3d` | `60a9b864355db5dafffe2d5c3b4faa87a2da7dc2` | `section/wales-3d` | `split-repo` | `/wales/` | direct Cloudflare path Worker bfe-wales-3d → repo main; central build retains registry route | LIVE /wales-3d/; Registry page is /wales/; direct route worker is /wales-3d/. Path/chrome reconciliation remains open. |
| Argentina Tŷ Mawr 3D world | `unclehowell/cedwyn-argentina-3d` | `10ba68496c9237ac67e54ff01d4dff44326b2330` | `section/argentina-3d` | `split-repo` | `/argentina/` | direct Cloudflare path Worker bfe-argentina-3d → repo main; central build retains registry route | LIVE /argentina-3d/; Registry page is /argentina/; direct route worker is /argentina-3d/. No-slash/query route gap reported. |
| Tithe H3 map | `unclehowell/cedwyn-tithe-h3` | `c99c9afffe49e71922d4a4ab9b0e426ad01a70de` | `section/tithe-h3` | `split-repo` | `/tithe-h3/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Chubut H3 map | `unclehowell/cedwyn-chubut-h3` | `53cfe42bb68e19db3bdbc40cfcf7fad61a831171` | `section/chubut-h3` | `split-repo` | `/chubut-h3/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Hive | `unclehowell/cedwyn-hive` | `2ee59f71f8655a483a7cf4caefe4b6e87742cced` | `hive` | `split-repo` | `/hive/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Dartboard | `unclehowell/cedwyn-dartboard` | `2e86b1f891e8a35972189fc27f4710826303007b` | `dartboard` | `split-repo` | `/dartboard/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Analytics | `unclehowell/cedwyn-analytics` | `20e3411e4a6538850317da3a36014de6d453799d` | `section/analytics` | `split-repo` | `/analytics/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Cloudflare | `unclehowell/cedwyn-cloudflare` | `3d98c6ca35c4a4cf22f15b4d1583d6685f87b8b1` | `section/cloudflare` | `split-repo` | `/cloudflare/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Spill | `unclehowell/cedwyn-spill` | `5798184f1f79a29e809df3b69a60b6ecf5d9c4be` | `section/spill` | `split-repo` | `/spill/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Ask the Archive | `unclehowell/cedwyn-chat` | `2a0df371c5189afc1c82270dbd4a43de5c9da48e` | `section/chat` | `split-repo` | `/chat/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Mr Wolf | `unclehowell/cedwyn-mr-wolf` | `9fc0f810c975c2860ccb8a8cbafb6e1e7dfba503` | `section/mr-wolf` | `split-repo` | `/mr-wolf/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| FCG | `unclehowell/cedwyn-fcg` | `bf931923bce2ae960ea6c8319675c589e3920a66` | `section/fcg` | `split-repo` | `/fcg/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Research Library | `unclehowell/cedwyn-research` | `e31436a10bf7c2a87e5f48f82313dfcbe6cdfb59` | `section/research` | `mirror` | `/research/` | legacy branch → central build (repo main is mirror target) | Mirror safeguard active; legacy source SHA recorded below; migrate writer before switching mode. |
| Case Office | `unclehowell/cedwyn-app` | `fd8750ec2267f73fc4968e4fe96ceec12ae466d5` | `section/app` | `split-repo` | `/app/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Estate hub | `unclehowell/cedwyn-estate` | `6399f218e98fe517a1dbeffb8f40f2e8a2f1148b` | `section/estate` | `split-repo` | `/estate/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Patagonia | `unclehowell/cedwyn-patagonia` | `98d387ebea39a031a14d7c2c4176121b5faa724f` | `section/patagonia` | `split-repo` | `/patagonia/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Cyberspace | `unclehowell/cedwyn-cyberspace` | `1d2f6dcbe7b5855d1bed3d76eef021dfc556b46c` | `section/cyberspace` | `split-repo` | `/cyberspace/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Forensic Assessments | `unclehowell/cedwyn-forensic` | `cab50ad5f28b29d3a04640cb37042f8cbc5c83fb` | `section/forensic` | `split-repo` | `/forensic/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Chessboard | `unclehowell/cedwyn-chess` | `7eb7d815c8c266b2ec145e707d72d4f689349c27` | `chess` | `split-repo` | `/chess/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Grammar House | `unclehowell/cedwyn-csscpsg` | `d45a39ca516b8dde36958bd86d1b33daea40ae87` | `csscpsg` | `split-repo` | `/csscpsg/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Court Drills | `unclehowell/cedwyn-courtdrills` | `e1aef932d83ab79d43bf38c261e870ace19f7eb9` | `courtdrills` | `split-repo` | `/courtdrills/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Old Bill | `unclehowell/cedwyn-oldbill` | `bdd88a2d3db4a3ff5cea4abb5b15c77c42bd40e9` | `oldbill` | `split-repo` | `/oldbill/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Counting House | `unclehowell/cedwyn-accounts` | `27c653c632ac64f21f4c298225e58f0fc973ca08` | `accounts` | `split-repo` | `/accounts/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Project Office | `unclehowell/cedwyn-projects` | `2e387a9d23a68411af77114a0f5df740ca600e15` | `projects` | `split-repo` | `/projects/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Watchtower | `unclehowell/cedwyn-watchtower` | `47dd3519de51756b971db174f13bcac3aca034dc` | `watchtower` | `split-repo` | `/watchtower/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Directory | `unclehowell/cedwyn-directory` | `a22ab2d7e43edc188369fcab246c4c0dde39ee60` | `directory` | `split-repo` | `/directory/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Family Tree | `unclehowell/cedwyn-familytree` | `8d092cd387d7e6b89ece519f2a3b1376d7e16ec1` | `familytree` | `split-repo` | `/familytree/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Kissed Frogs | `unclehowell/cedwyn-kissed-frogs` | `84ce66ab1cd91087f5eb28f2148a860f9d688355` | `kissed-frogs` | `split-repo` | `/kissed-frogs/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| That Old Chestnut | `unclehowell/cedwyn-that-old-chestnut` | `48593d22af75f57ccfe9a546a1130987674ffbf2` | `that-old-chestnut` | `split-repo` | `/that-old-chestnut/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Blog | `unclehowell/cedwyn-blog` | `ac7b9d1288b70bf0ccd7f3b8f70f1f3b11cdba02` | `blog` | `split-repo` | `/blog/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Nomenclature | `unclehowell/cedwyn-nomenclature` | `52ec522e4ac168fc87c22d5ccc31a98a9a22fe18` | `nomenclature` | `split-repo` | `/nomenclature/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Map Room | `unclehowell/cedwyn-maps` | `954a3f0c0466184bc855ea957988df5fb2127342` | `maps` | `split-repo` | `/maps/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Docs / Evidence Catalogue | `unclehowell/cedwyn-docs` | `987e41f7e75e94f142e3e193703a5dac32ad2a84` | `docs` | `split-repo` | `/docs/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Wayback Vault | `unclehowell/cedwyn-wayback` | `27872ea96ef296f646d910dd3f2a3e1b379e4231` | `wayback` | `split-repo` | `/wayback/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| E-book Shelf | `unclehowell/cedwyn-ebooks` | `9251d4a091844632c08f855de2ab8ff46f4d5633` | `ebooks` | `split-repo` | `/ebooks/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Land Changing Hands | `unclehowell/cedwyn-infographic` | `cd0ddd06488b93d535eada841de1b19ce12743c0` | `infographic` | `split-repo` | `/infographic/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Q&A Hall | `unclehowell/cedwyn-qa` | `610c9315cc618c4a79b82068b1e4e88765d2e810` | `qa` | `split-repo` | `/qa/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| What They Don't Say | `unclehowell/cedwyn-whattheydontsay` | `be86e3fd1bedd97c98e84fb232097b587210fe71` | `whattheydontsay` | `split-repo` | `/whattheydontsay/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| NFT Art | `unclehowell/cedwyn-nft-art` | `33e8868066288d682d4c45e5baee5a0e2d7a74d1` | `nft-art` | `split-repo` | `/nft-art/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Gift Shop | `unclehowell/cedwyn-shop` | `9ca324a059e646fc1acb75be05fe63208e3b2d03` | `merch` | `split-repo` | `/shop/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Farm Album | `unclehowell/cedwyn-fb` | `c2e081c4aaf9c4426df652ea1632deb81d77f8d7` | `fb` | `split-repo` | `/fb/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Post Office & Calendar | `unclehowell/cedwyn-emails` | `b0c15ddd68cfcbbf25039a0335ae67fdf278324f` | `emails` | `split-repo` | `/email/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Legal Wiki & Evidence | `unclehowell/cedwyn-wiki` | `c0dcaf228ccabf1f6f14d82a003da3c498f96de4` | `section/wiki` | `split-repo` | `/wiki/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| The Story & Documentary | `unclehowell/cedwyn-story` | `9cb205b4eafda742655e15e59907d835b4d5903e` | `bpvsbuckler` | `split-repo` | `/story/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Arcade | `unclehowell/cedwyn-arcade` | `9472677e5eeabe69039eab3771464b5b067fe427` | `arcade-final-serving-20261104` | `split-repo` | `/arcade/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Public Authorities & Council Chamber | `unclehowell/cedwyn-authorities` | `366a06a63e7fbf1fa3470a99cb765c3404ec9560` | `ghf-public-authorities` | `split-repo` | `/authorities/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| FOI Requests | `unclehowell/cedwyn-wdtk` | `ef1fb829ccbd17a58e929eaabcafae9e5a72a9d4` | `whatdotheyknow` | `split-repo` | `/wdtk/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Independent Review | `unclehowell/cedwyn-review` | `9f1c439a16538ca489b7f669a06bd9bbd3b521d0` | `ghf-independent-review` | `split-repo` | `/review/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| HubSpot Task Control | `unclehowell/cedwyn-hubspot` | `a7827cc12732c20f674d60301d47add5a5e3c92e` | `webapp/hubspot-20261101` | `split-repo` | `/hubspot/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Flower Garden | `unclehowell/cedwyn-garden` | `bb730738f4c1ceae28514454152884941b455933` | `garden` | `split-repo` | `/garden/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Revival AR | `unclehowell/cedwyn-revival-ar` | `e9f77f0710da1d469ece17ca9321a5764b4fec96` | `section/revival-ar` | `mirror` | `/revival-ar/` | legacy branch → central build (repo main is mirror target) | Mirror safeguard active; legacy source SHA recorded below; migrate writer before switching mode. |
| Peekaboo | `unclehowell/cedwyn-peekaboo` | `21901f04d6d7084d62f5e662a6125eba130d20bf` | `section/peekaboo` | `split-repo` | `/peekaboo/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Bloculous | `unclehowell/cedwyn-bloculous` | `45ac0c4f371e18c4767c4a11b878ffefb7f6ef05` | `section/bloculous` | `split-repo` | `/bloculous/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Theories | `unclehowell/cedwyn-theories` | `e24f955e7acc07917919b592b44b8858afe7a675` | `section/theories` | `split-repo` | `/theories/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Garden Store | `unclehowell/cedwyn-garden-store` | `ba58b5856b3e86c1c0560a279821a8a78445bd9c` | `section/garden-store` | `split-repo` | `/garden-store/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Storytime | `unclehowell/cedwyn-storytime` | `8160032e9bc7c812d4fb2706a38edb7e31a46f8b` | `storytime` | `split-repo` | `/storytime/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Molt | `unclehowell/cedwyn-molt` | `afd5c21eec959ddacf4212a8e20b6e8c7e5fe438` | `molt` | `split-repo` | `/molt/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Gallery | `unclehowell/cedwyn-gallery` | `e10a312847335224a61118f0229c57a52304760a` | `gallery` | `split-repo` | `/gallery/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Internet Archive Sources | `unclehowell/cedwyn-internetarchive` | `87cd18b961b7e63deff477f8f2b081e2131cd026` | `internetarchive` | `split-repo` | `/internetarchive/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Terrain | `unclehowell/terrain` | `ac2c0ca2498eae4cfc4b484d65aab4f484cbaedb` | `—` | `split-repo` | `/terrain/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Pre-existing separate repo; legacy branch blank in registry. |
| Primary Records | `unclehowell/cedwyn-records` | `cb5ff7ab7a5c41fd02f1757dd0e35bdf6eb88d59` | `ghf-primary-records` | `split-repo` | `/records/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| The Council Chamber | `unclehowell/cedwyn-meeting` | `4189fcd0a96a176e7c26127c1b12af42c8693642` | `2026-10-22` | `split-repo` | `/2026-10-22/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Cedwyn documentary | `unclehowell/cedwyn-documentary` | `1cd22727faf90a3cdd23eb3621a26198d7e09b6e` | `cedwyn-movie` | `split-repo` | `/documentary/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| Display settings | `unclehowell/cedwyn-settings` | `cef70cbc4867f4fc8e5ea7b8ea1f0fbddc891252` | `theme-settings` | `split-repo` | `/settings/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |
| The Release Machine | `unclehowell/cedwyn-releases` | `8bc951e3b2267b968486ab3f9dea9b7d4e2c5714` | `releases` | `split-repo` | `/releases/` | repo main → sync-split-repos → legacy branch → build-cedwyn → site | Live route not re-probed in this pass; registry route recorded. |

## Verified data stores, central dependencies and Worker behaviour

| App / repository | Verified data store | Central API / data requirement | Worker / bindings | Test evidence / limitation |
|---|---|---|---|---|
| Catalogue browser — `cedwyn-catalogue` (additional repo; not in split registry) | Static files in repo; `pages.json` carries page-only extras. No app database observed in inspected root tree. | `app.js` reads live `GET https://bucklerfamily.estate/api/catalogue` (list and `/<id>` item endpoints). GraphQL is optional only if explicitly configured. | `worker/bfe-catalogue.js` serves files from `cedwyn-catalogue@main` at `/catalogue/`, upstream cache 120 s. No D1/KV binding referenced in Worker module. Cloudflare account-level route binding not independently queried. | Owner-reported live 200 on 6 Nov; app test inventory incomplete. `main` HEAD: `72a28f3e03fa6370f1df29c875be2d296f141ec6`. |
| Argentina 3D — `cedwyn-argentina-3d` | `data/central.json`: generated read-only static slice, 4 records (last sync 10:06:22Z). `data/sources.json`: EV-0631, EV-0630, AR-0002, AR-0004. | Selected public fields from `/api/catalogue`: id, kind, title, date, status, page. | `worker/bfe-argentina-3d.js` serves repo `main` at `/argentina-3d/`, fetching raw GitHub files; no D1/KV binding referenced. Six-hour `sync-central.yml` present. | Owner-reported live 200 and `x-bfe-app: argentina-3d 1.0.0`. No-slash/query route gap and chrome parity remain open. |
| Wales 3D — `cedwyn-wales-3d` | `data/central.json`: generated read-only static slice, 2 records (last sync 09:44:51Z). `data/sources.json`: EV-0211 and EV-0215. H3/parcel/building/terrain assets are static files. | Selected public fields from `/api/catalogue` for EV-0211 and EV-0215. | `worker/bfe-wales-3d.js` serves repo `main` at `/wales-3d/`, fetching raw GitHub files; no D1/KV binding referenced. Six-hour `sync-central.yml` present. | Owner-reported live 200 and `x-bfe-app: wales-3d 1.0.0`. Registry still records `/wales/`; chrome/navigation mismatch open. |
| Tithe H3 — `cedwyn-tithe-h3` | `data/central.json`: generated read-only static slice, 45 records; 14 requested IDs are not currently in the central catalogue. Spatial data in `data/parcels*.json/geojson/csv`, `data/pins.json`. | `tools/sync_central.py` fetches IDs from `data/pins.json` at `https://cedwyn.bucklerfamily.estate/api/catalogue`; fields: id, kind, title, date_display, date_sort, status, page. | `.github/workflows/sync-central.yml` runs every six hours and on demand; no app D1 binding in inspected workflow. | Preview workflow exists but Cloudflare preview requires secrets. PR #313 proposes source-direct assembly; not merged or live-cut over. |
| Chubut H3 — `cedwyn-chubut-h3` | Inspected `data/` contains `outline.json`; no `data/central.json` or `sync-central.yml` in inspected listings. | Central-catalogue dependency not demonstrated in inspected files; confirm before assigning a sync contract. | No Worker or D1/KV binding verified in inspected root/workflow listing. | PR #313 proposes source-direct assembly; not merged. |
| Revival AR — `cedwyn-revival-ar` | Per-app data store not audited in this pass. | Writer still targets `section/revival-ar`. Old branch HEAD: `aeefceb3473d4e543558f39d943ab04bf17d429e`; repo `main`: `e9f77f0710da1d469ece17ca9321a5764b4fec96`. | Temporary `mirror` mode; `mirror.yml` reads central mode and copies old branch → repo `main`. | **Do not switch back to `split-repo` or direct deploy until writer migration and SHA parity.** |
| Research Library — `cedwyn-research` | Per-app data store not audited in this pass. | Writer still targets `section/research`. Old branch HEAD: `c65172472d19712b71552e18fdb73d892547a8af`; repo `main`: `e31436a10bf7c2a87e5f48f82313dfcbe6cdfb59`. | Temporary `mirror` mode; `mirror.yml` reads central mode and copies old branch → repo `main`. | **Do not switch back to `split-repo` or direct deploy until writer migration and SHA parity.** |

### Global database and binding position

- The 3 November `migration/CENTRAL-DB.md` design describes a shared Cloudflare D1 database, `cedwyn-apps`, for central catalogue queries; reviewed Git records remain the writer path, and static `catalogue-db` exports are for app consumption. That note reports the account at the 10-database free-tier cap; re-check Cloudflare account state before treating the quota as current.
- The per-app store actually demonstrated in current app code is **generated static JSON**, not a dedicated per-app D1. The 3D apps and Tithe H3 pull a small public field set from the central API. This is not a private D1 for each app.
- The three inspected path Workers proxy raw GitHub files and do not reference D1/KV bindings in their Worker modules. The Cloudflare account's actual routes, secrets and all other app bindings have not yet been checked against Cloudflare account configuration in this snapshot.
- No app page should read D1 directly. Keep central catalogue reads in static sync/build flows unless a reviewed design authorises otherwise.

## Current release and verification gates

1. cedwyn#377 fixes the missing Releases theme `dir`. After adding the required `site-wide` label, `sections-ci` #571 passed; `evidence-hierarchy-ci` on the PR head also passed. The failed main build has **not** been rerun; PR remains unmerged, and no new Pages revision is claimed.
2. cedwyn#313 remains open/unmerged. The PR's title/body is narrower than the later #366 status note; audit its exact 44-row proposal before merge.
3. cedwyn-hive#10 is the current append-only draft-body protocol PR. PR #9 is closed as superseded. PR #10's preview job reports success but skips deployment because Cloudflare preview secrets are absent.
4. cedwyn#351 tracks chrome/navigation parity for direct-path Worker apps. cedwyn#267 tracks the duplicate Wales route/slot ambiguity.
5. Revival AR and Research remain in `mirror` mode. Their repo `main` heads had not yet caught up with their legacy branch heads at the time of this check; verify the next mirror workflow before changing either mode again.

## Work remaining — explicit unknowns

- Inspect every remaining repo's `main` tree and workflows for local stores, scheduled adapters, Worker/KV/D1 bindings, external credentials, central API/MCP calls and test commands. The 65 repo HEADs are inventoried; the remaining per-app details are **not** certified.
- Record each app's exact Worker/Pages project, route, secret owner, binding names and rollback. Source files alone do not prove a live Cloudflare route.
- Verify repo-main versus legacy-branch SHA parity for all `split-repo` rows and the exact commit used by the next build.
- Reconcile Argentina/Wales route paths across the split registry, themes, site areas and Navigator before retiring any legacy path.
- Add app-specific tests and route parity checks; current automated coverage is not inventoried beyond the checks above.
- Move the Revival AR and Research writers into their dedicated repos before changing their modes.
- Complete the per-app API/MCP dependency map, with only public fields and no private correspondence or personal data.

## Immediate sequence

1. Owner review/merge PR #377, rerun the full central build, then verify the Pages build stamp and `/releases/`.
2. Complete the full repo-tree/bindings/test scan for all 65 apps.
3. Confirm PR #313's actual 44-row scope and current checks; run a dry build before any source switch.
4. Resolve #351 chrome parity and #267 Wales slot mapping before further route changes.
5. Migrate the two legacy writers, verify source parity, then change their registry modes.
6. Implement WDTK's app-local static slice and central API contract as the first complete per-app data pipeline.

---
This is a review snapshot, not a lockfile. Re-read all moving pointers before deployment.

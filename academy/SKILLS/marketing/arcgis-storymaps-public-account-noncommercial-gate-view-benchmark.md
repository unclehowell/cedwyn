# ArcGIS StoryMaps on a free public account: what it allows, the noncommercial gate, the competition gate, and how to benchmark views (proposal)

Researched 31 Oct 2026. New ground: "arcgis"/"esri" appeared only in google-earth-web-project-through-time-map-story.md (as a 0-hit note) and the harvest log ("still 0 hits: arcgis/esri storymaps public account"). Siblings: tithe-map-storymap-georeferenced-parcels-linkable-asset.md (self-hosted StoryMapJS, no account rules) and the Google Earth file (Google-hosted). This file states when Esri's hosted StoryMaps is worth it and when it is not.

## Facts (Esri's own pages, read 31 Oct 2026)
- **ArcGIS Online FAQ, "What are the limitations of a public account?"**: a free public account can "author and publicly share basic maps, scenes, stories, and apps" and store up to **2 GB**. It is "a free, limited-functionality account designed for **personal, noncommercial use**". It cannot: publish hosted layers, run analysis, use premium content, use Experience Builder/Dashboards, use location services, or **use embed blocks in ArcGIS StoryMaps**. Same FAQ: "Can I use ArcGIS Online for free? Yes, if it is for noncommercial use."
- **StoryMaps release notes** (doc.esri.com, latest entry 24 Sep 2026): web search indexing can be enabled when the story cover is hidden; the header is hidden when a public-account story is embedded in another StoryMaps item; earlier: briefings and language settings available to public accounts. (Whether the search-indexing switch is on a public account: not checked.)
- **StoryMaps.com retired 2025** (Esri Community thread 1594710, quoting StoryMaps.com support): migrated users got a free ArcGIS subscription June-21 July 2025, then had to pay; "some advanced features... are not available to public accounts". Practitioner reading in that thread: volunteers making maps for charities either pay for Creator or rebuild on a public account "and hope ESRI don't close that route off".
- **2026 ArcGIS StoryMaps Competition** (esri.com contest page + official rules PDF, read): deadline **11 Dec 2026, 17:00 PT**; finalists 9 Feb 2027; winners April 2027 (certificate, Esri website feature and interview, award at the 2027 UC); Community Choice public vote from 9 Feb 2027. Categories include **"Seeing What Others Missed: where mapping revealed an unexpected pattern or insight"**. Rules: entries **"may be created and submitted from one of four types of accounts (but not a free public account)"**: student, Creator/Professional, ArcGIS for Personal Use, or Enterprise; entry must stay public without login to at least Dec 2027; entrant grants Esri an irrevocable royalty-free licence to republish/modify the entry.

## Real numbers (read from Esri's public item API, 31 Oct 2026)
- Historic England "Heritage Responds" (owner gis_historicengland, created 14 Sep 2021): **10,212 views**, about 5.5/day over 5 years.
- "Know Your Place" highlights story (owner Insole, the Bristol KYP lead, created 9 Mar 2021): **6,342 views**, about 3.1/day.
- So a well-made heritage story from a known national body draws single-digit views a day. A new, unknown account should expect less. No case found of a story map driving book or e-book sales (not checked further).

## How to do it
1. **Decide the account first.** Paid tiers break the zero-spend rule, so only a free public account is in scope, and it is for noncommercial use. Our reading (not legal advice): a story with **no shop link, no price, no /ebooks/ mention**, linking only to free research/evidence pages, fits "noncommercial" best. Anything that sells does not.
2. Build at storymaps.arcgis.com with the public account: express map (points, captions), image/text blocks, sidecar for "then/now" scrolls. No embed blocks (public accounts can't), so link out to the site instead of embedding.
3. Use our own images only (or public-domain ones with credit). Never Coflein/HER images or text (see heneb-her-archwilio-coflein-contribution-and-reuse.md).
4. Share as Public. Put a tagged link to the free research page: cedwyn.bucklerfamily.estate/r/storymap (create the /r/ redirect first).
5. Measure monthly with `tools/arcgis_views.py <story id>` (views) plus /r/storymap clicks. Kill rule: under 10 clicks in 8 weeks -> stop maintaining.
6. **Competition: skip.** Free public accounts are excluded and every eligible tier is paid or student-only. Re-check only if the owner ever holds an eligible account.

## How we apply it to Cedwyn
- **Default: don't build here.** The self-hosted StoryMapJS route (tithe-map file) does the same job on our own domain, carries the shop strip legally, keeps the SEO, and has no noncommercial clause. Esri adds an audience of GIS/heritage browsers but the gallery isn't searchable by default for public accounts (not checked), and benchmarks show 3-6 views/day even for big names.
- **Only worth it as a noncommercial "missing records on the map" mirror**: 8-12 points taken only from what the site already publishes (public places and records; never family holdings, parcels held, or addresses), each linking to its free evidence or /research/missing-records/ page. Llandough Farm is not Great House Farm; label it so. No banned words, never name the owner, no insignia.
- Needs an Esri public account in the owner's name (his email): **proposal, owner's GO**. Effort about 2 h; expected effect small.
- Use the view tool now as a free benchmark: before proposing any map story, run it on 2-3 peer Welsh heritage stories to set a realistic target.

## Checked and not applicable this run
- **Know Your Place (West of England)**: Gloucestershire Archives' project page (read) lists coverage as Bristol, B&NES, Gloucestershire, South Gloucestershire, North Somerset, Somerset, Wiltshire and Devon (8 counties, 7,279 sq mi). It has a community layer for user images/research, but **no Welsh county**, so nothing for Llandough/Leckwith. The Welsh equivalents are already covered (Archwilio "Contribute here", Cynefin tithe maps, People's Collection Wales).
- **Privacy-friendly session replay**: covered by clarity-heatmaps-recordings-uk-consent.md (free recordings with UK consent mode). A second replay tool would add a consent banner burden for 3-5 visitors a day; skip.

## Sources
- doc.arcgis.com (read)
- doc.esri.com (read)
- community.esri.com (read)
- esri.com (read)
- esri.com (read)
- arcgis.com and .../83600d75f3544fb18a9e04c5403908f8?f=json (read)
- gloucestershire.gov.uk (read)
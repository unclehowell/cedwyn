# Openverse and Commons discovery: get our public-domain images found and count the views (2026)

Slug: openverse-commons-discovery-and-view-metrics.md · written 2026-10-30 (skills harvest) · scope: Great House Farm / cedwyn only
Builds on wikimedia-commons-public-domain-archive-images-glam.md (how to upload). This file is about DISCOVERY after upload and MEASUREMENT.

## Facts (checked today unless marked)
- Openverse (openverse.org, run by the WordPress project) searches openly licensed and public-domain media from open APIs. Its live stats endpoint (api.openverse.org, read 30 Oct 2026) lists 52 image sources, including Wikimedia Commons 88,962,441 files, Flickr 536,219,600, Europeana 13,841,364, Geograph Britain and Ireland 1,090,119, The Met 498,428. So a file on Commons with a free licence or PD mark becomes findable on Openverse with no extra submission.
- Openverse API: anonymous limit 20 requests/min and 200/day (Openverse GitHub issue #5315; not checked against the docs). The search endpoint timed out twice from this box today, the stats endpoint answered; search on openverse.org in a browser is the fallback.
- How often Openverse re-ingests Commons and how it maps UK PD templates (e.g. PD-UK-unknown) to its licence filter: not checked. Test with one file before relying on it.
- Commons Impact Metrics (Wikimedia Foundation, Diff, 19 Jul 2024): monthly pre-computed data (dumps + API) per Commons CATEGORY: edits, top contributors, most-viewed files, and which Wikipedia articles/languages use the images, counted as article pageviews (Main Page excluded). Released between the 2nd and 5th of each month; handles categories up to 1M files (GLAMorgan max about 30K). Catch: an ALLOW LIST of categories; new ones "can be requested and will be added each month". Tested today: a category not on the list answers 404 "category ... not loaded yet".
- Per-file mediarequests API needs no allow list: tested today on File:Example.jpg, 120,834 user requests in Aug 2026 and 103,981 in Sep 2026. Use agent=user to drop bots.
- Scale examples from the same Diff post: The Met's Great Wave image had about 10x more views on English Wikipedia than on The Met's own site (2018) and 20x across all languages; Wellcome Collection images passed 1.5 billion Wikipedia views (2021); a few hundred files from a São Paulo veterinary anatomy museum draw millions of page views a month. NLW figures are in the upload skill. These are the institutions' own reported numbers.

## The playbook
1. Upload right (see the upload skill): free licence or PD template, source = our catalogue URL, cy/en description, depicts statements, and ONE project category (e.g. a category for our donated set) so every file sits under it.
2. Make files findable off-Commons: specific titles ("Penarth cliff walk towards Lavernock, about 1905"), place names in cy and en, date in the title. Openverse and Google Images both read title/description text.
3. Week 1 check: search the exact title on openverse.org; note whether it shows and which licence label it gets. If PD files show as a wrong licence or not at all, stop and fix the template before uploading more.
4. Measure monthly per file with the mediarequests API (tool below); measure per category with Commons Impact Metrics once the category is on the allow list (request it after the set has at least about 10 files; the request route is on the Commons Impact Metrics wiki pages, not checked).
5. Read usage, not only views: Commons Impact Metrics names the articles using our images. A file used on an article about Llandough or Leckwith is worth more than raw views.

## How we apply it to Cedwyn
- Still gated: Commons uploads stay "proposed on the owner's GO" per the upload skill (10-file place/map pilot). Nothing here uploads.
- When the pilot goes ahead: put all 10 files in one category; run tools/commons_views.py on each file on the 6th of every month (after the 2nd-5th data release) and append rows to the project workspace as commons_views.
- Week-1 Openverse check is a manual browser search per file; log found yes/no and the licence label shown.
- Only files that are clearly public domain or our own (the restored c.1905 NLW cliff-walk photo needs its NLW rights statement checked first). Nothing that shows Llandough Farm captioned as Great House Farm; no insignia; descriptions neutral, never naming the owner, none of the banned words.
- Reach, not SEO: Commons and Wikipedia links are nofollow; the win is people seeing the farm's records, and the file page's source link pointing back to the catalogue page.

## Tool
- tools/commons_views.py (written today, requests only, read-only, nothing installed): `python3 tools/commons_views.py "File:Name.jpg" [...] --months 3` prints file | month | user mediarequests. It works out the upload path itself (md5 of the file name) and waits 1 s between files.

## Sources
- api.openverse.org (read 30 Oct 2026)
- openverse.org (blocked by a bot check today; snippet: "more than 800 million images and audio tracks")
- github.com (rate limit; snippet only, not checked)
- diff.wikimedia.org (read)
- wikimedia.org (tested 30 Oct 2026)
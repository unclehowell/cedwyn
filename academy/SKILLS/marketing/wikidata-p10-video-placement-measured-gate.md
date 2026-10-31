# Getting a Commons clip seen: Wikidata "video" (P10), infoboxes in other languages, and article placement, measured, with a gate
Harvested 31 Oct 2026 (skills harvest, ~11:17Z). Upload craft is in commons-video-uploads-webm-timedtext-ai-scope-gate.md; COI rules for editing are in wikimedia-commons-wikidata-heritage-coi.md. This file is only about PLACEMENT of a video once it is on Commons.

## Why placement is the whole game (our measurement, 31 Oct 2026)
Wikimedia mediarequests API (user agents, Oct 2025-Sep 2026), 99 Welsh Commons videos ("filetype:video Cymru Wales", uploaded before Sep 2025). File requests, not confirmed plays:
| Placement | Files | Median 12-month requests |
|---|---|---|
| In 1+ Wikipedia article | 59 | 3,217 |
| On a Wikidata item only | 6 | 835 |
| Nowhere | 34 | 401 |
Roughly 8x for article placement over an unplaced upload, 2x for Wikidata alone.

## The Wikidata P10 lever (one edit, many languages)
- Property P10 ("video") on a place's Wikidata item lets every Wikipedia whose infobox reads Wikidata show the clip automatically.
- Worked example: Rhuddlan Castle (Q1585938) has P10 = "Castell Rhuddlan o'r awyr - drone view of Rhuddlan Castle and town, Wales 01.webm" (uploaded 22 Oct 2022 by a Welsh Wikimedian). That one file is now used on 20 pages across 18 language Wikipedias (be, br, ceb, cy, da, de, es, fi, fr, hu, id, it, nl, pt, ru, sv, uk, zh) plus Wikidata, and drew 4,121 requests in 12 months. English Wikipedia is NOT among them: its infoboxes do not pull P10, so English placement needs a human edit to the article.
- Volunteers also place clips in bulk: Swedish Wikipedia's "Veckans tävling/Videosprint 2" competition list (a weekly editing contest) carries several Welsh Commons clips linked from their Wikidata items, and those clips sit at 5,500-8,700 requests a year (Caerffili 7,777; Dinbych 6,141; Bodelwyddan 8,683; Dolbadarn 5,561). We do not take part in contests for our own files (COI); this only shows that P10-linked clips get picked up.

## Our target, read 31 Oct 2026
- Llandough near Penarth = Wikidata Q6661223: has P18 (image "Penlan Road, Llandough (3).jpg"), NO P10; 8 sitelinks (ceb, cy, en, eu, fr, sv, zh-min-nan, commons).
- en "Llandough, Penarth": 3,089 user views in 12 months (it already shows the 2022 farm photo by another user). cy "Llandochau Fach": 54. So the multi-language infobox route reaches small pages; the English article is the one with readers.
- Llandough near Cowbridge is a different item (Q13644928) and the medieval tower house another (Q17744300): never attach our clip to the wrong Llandough.

## Rules that bind us
- English Wikipedia: AI-generated images "should not be used in mainspace" (WP:AIIMAGES). Only real footage / map / public-domain-record clips qualify.
- COI: we must not add our own clip to an article ourselves. Route = a talk-page edit request ({{Edit COI}}) on Talk:Llandough, Penarth, declaring the connection, proposing the exact clip and caption, and letting an independent editor decide (WP:COI, WP:SELFCITE; see the COI file).
- Wikidata: the 2015 COI RfC closed with no consensus; the honest path is a disclosed account making the single P10 edit with a reference, or asking on the item's talk page / WikiProject Wales on Wikidata. Treat it like the Wikipedia rule: disclose, one edit, no reverting if removed.
- One clip per item. P10 is for a video that shows the place itself, so a map explainer belongs on an article as a captioned illustration, not on P10; a real walk-round/drone-style view of the village from public ground is the P10 kind.

## Steps
1. After a clip passes the upload file's step 1 and is on Commons with cy/en/es subtitles, decide its kind: "view of the place" (P10 candidate) or "explainer" (article candidate).
2. P10 candidate: the account holder adds P10 to Q6661223 with a reference to the Commons file page, and an edit summary declaring the connection. Check 48 h later that it stuck; if reverted, stop.
3. Explainer: post one {{Edit COI}} request on the en article's talk page (draft written, posted by the account holder): clip name, a 15-word neutral caption, the section it fits, and the disclosure. Wait; never re-ask within 30 days.
4. Measure at 30 and 90 days with the mediarequests API and the clip's globalusage list.

## Gate
- Keep going only if, at 90 days, the placed clip is above 835 requests/12-month pace (the Wikidata-only median) or an independent editor accepted the article request. If both routes fail or are reverted, stop Commons placement work for the project and leave the files as a permanent copy.

## How we apply it to Cedwyn
- PROPOSAL, owner approval needed (public account in a person's name, disclosed connection, free licence on the clip). No contact is made with any editor or WikiProject until the owner states GO.
- Best first candidate: a short real-footage view of the village from public roads with Welsh subtitles (P10 on Q6661223), not any documentary scene. Second: a tithe-map explainer offered via one edit request on the English article.
- Captions and descriptions follow our public text rules: never name the owner, banned words list, nothing about family holdings or addresses, neutral dated wording. The clip carries no shop or e-book mention; the value is reach and a citable public copy, not a sales link.
- Tab drafts the P10 reference, the talk-page request text and the measurement script note in the project workspace

## Sources
- wikidata.org (Rhuddlan Castle, P10) and wikidata.org (Llandough, Penarth), read via the Wikidata API 31 Oct 2026
- Commons API globalusage for the Rhuddlan clip and the 99-file sample (our pull, 31 Oct 2026)
- Wikimedia REST API metrics/mediarequests/per-file and pageviews/per-article (our pull, 31 Oct 2026)
- sv.wikipedia.org (seen in globalusage of the Welsh clips)
- en.wikipedia.org; en.wikipedia.org; Template:Edit COI
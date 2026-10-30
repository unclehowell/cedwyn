# Internet Archive "texts" item for the free first edition: a permanent discovery outpost, sized honestly

Checked 30 Oct 2026 (skills harvest). Zero budget. Purpose: one more place where people searching for Llandough / Leckwith / Glamorgan history can find the free edition and follow a link to /ebooks/.

## What the platform actually gives (primary, read 30 Oct 2026)
- Free account; upload form needs Page Title, identifier (5-80 chars, lower case, dashes), Description (links allowed), up to 10 Subject Tags, Creator, Date, Language, Collection (help.archive.org "Uploading - A Basic Guide").
- Books: PDF is the easiest format; always set Language so OCR runs; title field = the title as printed on the title page (IA uses it to pick the preview page); put it in "Community Texts" if you have no collection; add licence, date, creator, ISBN if any (help.archive.org "Books and Texts - A Basic Guide").
- The only public stat is "views": one action (read, download, play) per item, per day, per IP. Item pages update daily; search-result counts monthly (help.archive.org "Internet Archive Statistics"; archive.org). So views are people-days, not page loads; good honest metric.
- Measured today: links in an item description are rendered rel="ugc nofollow" (cdc_001046, cl_000179 description links). An IA item is a click-through and discovery source, NOT an SEO backlink.

## Sizing with real numbers (advancedsearch API, sorted by views, 30 Oct 2026)
- User-uploaded local-history texts tagged "local history" + "wales": top items 71, 61, 48, 41, 40 views in total; most since 2023. "Carolinian Robertsons" (family history, added 13 Oct 2025): 61 views in about a year.
- Glamorgan history texts added 2020-2026: 184, 76, 67, 44, 44, 30 views; a re-upload of an existing title in Mar 2026: 3 views. Duplicates get nothing.
- 298 texts match llandough/penarth/leckwith; the top is a patent (3,183), then old reports at 150-380.
- Read: expect roughly 20-70 people-days a year for a well-tagged niche item, i.e. a handful of real visitors a month at best. Small, but permanent, it compounds, and it is about 1-2 extra real /ebooks/ visits a month against today's ~4 a day. Worth one hour once, not a weekly job.

## How to do it (one hour)
1. Only the free edition (v0.0.1) and public-domain source images we already hold. Never the paid edition, never anything with a licence fee or a third-party copyright.
2. PDF with the cover as page 1 and the title page matching the Title field exactly. Last page: one line "Current edition and the full series: cedwyn.bucklerfamily.estate/ebooks/" (printed text survives in OCR and full-text search even though the description link is nofollow).
3. Metadata: identifier like `great-house-farm-llandough-records-v0-0-1`; Language eng (add wel only if Welsh text is really in it); Date = edition date; Creator = the publisher name used on the site (never a private person); 6-10 subject tags people actually type: Llandough, Leckwith, Penarth, Vale of Glamorgan, Glamorgan, local history, farm history, Welsh history, land records, 19th century; licence: all rights reserved, or CC BY-NC-ND if the owner chooses.
4. Description: 3 plain sentences of what is inside (dated records, maps, sources), then "Read the series: cedwyn.bucklerfamily.estate Run the banned-word scan on every field first.
5. One item per edition; when a new free edition ships, upload as a new file in the same item (keeps the view counter) instead of a duplicate item (duplicates got 3 views).
6. Measure: item view count (daily) + clicks on /r/ia (count only real phones, not the link-checker bots the sales-fix run saw) at 7, 30 and 90 days. Stop rule: under 10 views in 90 days = leave it, spend no more time.

## How we apply it to Cedwyn
- Proposal, not an action: a new public channel needs the owner's GO, and the account is created in his name or the publisher's (one email + password, set by him through the add-login link; never typed by us). Log it in the project workspace
- Needs a /r/ia redirect on cedwyn (the same pattern as /r/fb-page) before upload so clicks are countable.
- Pairs with the existing open-library-catalogue-records-ebooks.md (Open Library is IA's catalogue; a full-text IA item can be linked from the Open Library edition record).
- Editorial: neutral third person, no family names as authors, banned words, no insignia, nothing on family holdings or addresses. The free edition already passed these checks for the site; re-scan the metadata only.
- Expected effect: tiny but permanent. It does not fix the traffic problem on its own; it is one zero-cost brick next to the Search Console indexing fixes.

## Sources
- help.archive.org (read 30 Oct 2026)
- help.archive.org (read 30 Oct 2026)
- help.archive.org (read 30 Oct 2026)
- archive.org (read 30 Oct 2026)
- archive.org queries above, run 30 Oct 2026 16:27Z (our own measurement)
- archive.org and /cl_000179: description links rel="ugc nofollow" (checked 30 Oct 2026)
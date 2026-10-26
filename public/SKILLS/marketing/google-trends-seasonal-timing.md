# Google Trends: seasonal timing for history posts and pages (2026)

Goal: publish and promote each topic in the weeks before its yearly search rise, and spot one-off spikes worth a same-day post.

## Facts (read at source, 26 Oct 2026)
- Google Trends FAQ (support.google.com, read): numbers are relative interest 0-100 for the chosen time, place and topic, not search volume. Low-volume terms show 0. Google adds statistical noise; one-off spikes on low-interest queries can be noise, so compare against a common reference term. Searches made by Google's own AI Mode/AI Overviews are excluded. Repeat searches by the same person are removed; queries with apostrophes/special characters are filtered (matters for "Tŷ Mawr": use "Ty Mawr" and Topics).
- Semrush 2026 guide (read): "Breakout" in Related queries = growth over 5,000%; publish seasonal content about a month before the climb begins (their Mother's Day example: interest rises every April).
- Practitioner timing rules seen: 8-10 weeks before the historical peak for SEO pages (impactdigitalmarketinginstitute.in, snippet, not checked); "publish before peak because SEO is slow, pull back in the trough" (frontendhorizon.com, snippet, page not readable). No case study with before/after numbers could be read for small sites; treat lead times as rules of thumb.

## How to do it
1. List 10-15 seed topics; prefer Trends "Topics" over raw strings (handles Welsh spellings and synonyms).
2. For each: Past 5 years, region United Kingdom then Wales (sub-region), category All. Note the month(s) that peak every year and how many weeks the climb lasts.
3. Add a reference term (e.g. "local history") so you can read whether your term is big enough to trust; if it sits at 0-5 with spikes, ignore the spikes (noise).
4. Calendar: new evergreen page or refresh 6-8 weeks before the yearly climb; social posts and email in the climb week and peak week; nothing extra in the trough.
5. Rising/Breakout related queries: check weekly (Past 7 days, Wales). A breakout tied to your subject = one same-day post or short, not a new page.
6. Check Search Console impressions for the same topic 4 weeks after the peak; keep a topic in the calendar only if impressions moved.
7. Log the calendar in one CSV (topic, peak month, publish-by date, refresh-by date, result).

## How we apply it to Cedwyn
- Read-only work, no change needed: run the seeds now and add dates to the BIZDEV plan. Seeds: Welsh history, Vale of Glamorgan, Llandough, family history / genealogy, Welsh Patagonia (Wales and Argentina), Glamorgan estate records, tithe maps, Cadw, St David's Day, Gŵyl Glaniad (28 July), Remembrance.
- Expected (not checked until run): St David's Day (1 Mar) and Gŵyl Glaniad (28 Jul) give yearly peaks; genealogy interest tends to rise in winter. Cross-check with the existing anniversary-calendar skill so the two calendars do not clash.
- Use the peaks for timing posts about the 1824 David Stewart survey (the first record mention found) and the 1667 record (1974 newspapers; ITV News 1988); no Bute-era dates (house rule).
- New public pages or email journeys from this are PROPOSALS (owner's GO). Do not commit to the cedwyn repo while the migration worker owns it.
- No tool installed: Trends is free in the browser; a Python wrapper (pytrends) is unofficial and often rate-limited, and disk is under 2 GB, so skipped.

## Sources
- support.google.com (read)
- semrush.com (read)
- impactdigitalmarketinginstitute.in (snippet, not checked)
- frontendhorizon.com (snippet, not checked)
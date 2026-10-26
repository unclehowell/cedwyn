# Search Console's Generative AI performance report: what it shows and how to read it (2026 how-to)

Goal: see, from Google's own data, whether Cedwyn pages are shown inside AI Overviews and AI Mode, and which ones, without paying for a third-party "AI visibility" tracker.

## What exists (Google's documentation, read 26 Oct 2026)
- **Launched 3 Jun 2026** to a subset of sites; **rolled out to all websites worldwide on 31 Aug 2026** (Search Central blog + help page 16984139). Two reports: *Generative AI performance (Search)* and *(Discover)*.
- **Covers:** AI Overviews and AI Mode. Not Search Labs experiments.
- **Metric: impressions only.** An impression = a link to your site was shown in a generative AI feature. Two of your links in one AI answer count as **one** impression in the chart (property-level), but separately in the page table.
- **Dimensions:** Pages (final URL after redirects, credited to the **canonical** URL), Countries, Devices, Dates (hourly/daily/weekly/monthly, Pacific Time).
- **Search type filter:** *Web: text-based* and, since **24 Sep 2026**, *Web: multimodal* (Lens, Circle to Search, image uploads, Chrome "Search this image").
- **Not in it:** clicks, CTR, queries, position. The same impressions are also still counted inside the normal Performance report (Web), so the AI report is a separate *view*, not extra traffic.
- **Export** button downloads chart + table; "~" or "-" become 0 in the file.
- **"Not seeing the report?"** Google: usually the site has not had enough generative AI impressions yet, or the site has been excluded from Search generative AI features (check that setting before anything else).

## What practitioners found
- **Drew Garrett (25 Jun 2026, updated 29 Sep):** data for his clients backfilled to about **18 May 2026**, two weeks before the announcement, so there is history from day one. Across his accounts, **listicles and comparison pages** pulled the most AI Overview impressions, definitional pages close behind; he stresses it varies by account. Path: Performance > Search results > the box "Get more details on your site's performance on generative AI features" > Open report.
- **Brodie Clark (experiment, updated 8 Jun 2026):** had hundreds of SEOs run the same AI Mode query to confirm AI Mode is logged in Search Console (it is, grouped with Web). He found all links in the top-right AI Mode unit recorded as position 1 in the normal report, which inflates "average position" for pages cited there.
- **Agency Dashboard (30 Jun 2026):** treat it as a visibility signal; with no clicks or queries, do not credit sales to it.
- Already in our index: Ahrefs (Mar 2026) found 37.1% of AI Overview cited URLs also rank top 10, and AWR's CTR study shows position-1 CTR falling from 20.0% to 9.7% when an AI Overview is present (gsc-striking-distance-quick-wins.md). Bing's equivalent is in bing-webmaster-ai-performance-copilot-citations.md.

## The routine (10 min, weekly, Monday)
1. Open the report for the Domain property. If it is missing, write "no report (too few AI impressions)" in the log and stop; check again monthly. That line is itself a baseline.
2. Set dates to last 28 days, compare with previous 28. Note total AI impressions and the **share**: AI impressions / Web impressions from the normal report (same dates, same country).
3. **Pages tab, export.** For each page with AI impressions: is it the canonical you want? If a /docs/ or /research/ copy is credited instead of the main record page, that is a canonical fault (see page-indexing-triage-duplicates-canonicals.md), not an AI fault.
4. **Countries tab:** UK vs Argentina vs US. This is the first place our Wales/Argentina split shows up in AI answers.
5. **Pages with AI impressions but zero normal clicks:** read the page's first 100 words. AI answers lift a short, dated, sourced statement; make the first paragraph that statement (the headline-first layout already does this).
6. Switch the filter to *Web: multimodal* once a month: map and photo pages can be found by camera searches.
7. Log one row: date, total AI impr, share of Web impr, top 3 pages, countries, action taken. Never report AI impressions as visits.

## Reading rules
- Impressions here are not reads or visits. A rise with flat clicks is normal.
- Because the report credits canonicals, fixing duplicates usually *moves* AI impressions onto the right page rather than adding new ones.
- Small numbers (under ~50 a month) swing week to week; judge on 28-day windows.
- Whether this report is available through the Search Console API was not checked this run; until it is, the weekly export is manual (or by the account owner's browser session).

## How we apply it to Cedwyn
- **Today:** Google has indexed only 2 Cedwyn pages, so expect "no report". Indexing (page-indexing-triage) comes first; this report is the measure afterwards, not a fix.
- **First check (owner or a browser session with the connected Search Console):** confirm the property is not excluded from generative AI features, then record the baseline row in the project workspace beside the weekly visibility check (schedule 85e9deca reads it Mondays 07:30).
- **What to make citable:** one record page per dated document, its first line a plain, sourced statement in our own voice, e.g. "1824: the David Stewart survey is the first record mention of Tŷ Mawr we have found." 1667 appears only as the family's acquisition (1974 newspaper reports of Mary Williams' statement; ITV News 1988). Bute estate documents are never presented as Tŷ Mawr records before 1824.
- **Comparison and list formats** (the formats Garrett saw win): the new names register e-book (Enwau, /ebooks/enwau/) suits a public page "Every name of Tŷ Mawr, by date and source": a list of forms with dates and sources, the kind of page AI answers quote.
- **Spanish pages:** watch the Argentina row; if AI impressions there stay at zero while UK grows, the es-AR pages need their own first-line statements in native Spanish.

## Sources
- developers.google.com (3 Jun 2026; worldwide note 31 Aug 2026)
- support.google.com (Generative AI performance report (Search) help)
- developers.google.com (24 Sep 2026)
- drewgarrett.org (25 Jun 2026, upd. 29 Sep)
- brodieclark.com (experiment, upd. 8 Jun 2026)
- agencydashboard.io (30 Jun 2026)
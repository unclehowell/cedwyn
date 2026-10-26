# Search Console branded vs non-branded filter + Query groups (analytics)
Harvested 26 Oct 2026 (skills harvest). Topic: measuring whether new people find Cedwyn (non-branded) or only people who already know the name (branded), and reading spelling variants as one interest. Distinct from search-console-regex-question-longtail (question regex) and gsc-striking-distance-quick-wins (positions 5-20).

## Evidence (Google's own announcements, opened 26 Oct 2026)
- Branded queries filter (announced 20 Nov 2025; updated 11 Mar 2026: "now available to all eligible sites"). In the Performance report it splits queries into Branded and Non-branded across web, image, video and news, with impressions, clicks, position and CTR per side; an Insights card shows the click split. Classification is AI-assisted, not regex: it includes the brand name in all languages, typos, and queries naming a unique product of the site; some queries may be misclassified; no ranking effect. Branded queries "typically lead to higher-ranking pages ... and higher click-through rates", non-branded show "how new users find your content". [S1]
- Eligibility: only top-level properties (NOT URL-path properties and NOT subdomain properties such as developers.google.com), and only sites with "a sufficient volume of queries and impressions" (threshold not published). [S1]
- Query groups (announced 27 Oct 2025): an Insights card that clusters variant queries (misspellings, rephrasing, other languages) into groups with total clicks, ordered queries, and Top / Trending up / Trending down views; drill-down opens the Performance report. AI-computed, may change, no ranking effect. Available "only to properties that have a large volume of queries". [S2]

## The how-to
1. Use the Domain property (sc-domain:...) for brand analysis: a subdomain-only property will never show the filter. Check: Performance > Add filter > "Query type" / Branded (exact label not checked this run).
2. If the filter is missing (low volume), build the same split by hand: Filter by query > Custom (regex) > "Doesn't match regex" with the brand spellings (e.g. `(?i)cedwyn|cedfin|cydfin|kenfin|great house farm|ty mawr|tŷ mawr`) = non-branded; "Matches regex" = branded. Save both as a weekly export (date, branded clicks/impr, non-branded clicks/impr).
3. KPI to track weekly: non-branded impressions and the count of distinct non-branded queries. Early-stage target is growth in that count, not clicks. Branded impressions rising after a talk, post or press item = awareness working; non-branded rising = content working.
4. Read CTR separately: a branded CTR below ~one in three of impressions usually means the title/snippet does not look like the thing searched for (rule of thumb, not checked). Fix titles for branded; fix content depth for non-branded.
5. Query groups (once eligible): use Trending up groups to choose the next page or e-book chapter; use groups mixing spellings to confirm which spelling the public uses and lead the page with it.
6. Don't trust either AI classifier blindly: spot-check 20 queries each month; keep the regex list in a file and add each newly seen spelling.
7. Pair with the AI side: Search Console now folds AI Mode/Overviews into Performance; the generative AI report and Bing AI Performance cover citations (see those skill files).

## How we apply it to Cedwyn
- Cedwyn sits on a subdomain. The connected account holds the Domain property sc-domain:bucklerfamily.estate (seen in our files), which is the eligible type; filter it with Page contains `cedwyn.bucklerfamily.estate` before reading the brand split. Whether the volume threshold is met: not checked (Cedwyn had about zero search impressions on 26 Oct 2026, so expect the regex fallback for now).
- Add to the Sunday growth report (growth-report/weekly.csv) two columns: nonbrand_impr and nonbrand_queries for Cedwyn pages, from the regex split. One-line note for the weekly report: "new people finding us: N queries".
- The brand regex doubles as the nomenclature list: keep it in sync with data/nomenclature.json (spellings with a source only).
- Read-only work: no public page, price or email changes. Report numbers as measured; a number not read from Search Console is 'not checked'.

## Sources
- S1 developers.google.com
- S2 developers.google.com
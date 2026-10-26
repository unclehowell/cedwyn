# Search Console "striking distance" quick wins for a small history site (2026)
Written 26 Oct 2026 by the project lead's Tab agent (skills harvest). Complements 3.md (site SEO hygiene); this is the monthly query-mining routine.

## Why it works (numbers)
- Advanced Web Ranking 2026 CTR study (hundreds of millions of impressions, Sep 2026): position 1 averages 20.0% organic CTR, 9.7% when an AI Overview shows (-52%); AI Overviews on 43% of sampled desktop results; since 2015 positions 2-10 lost 40-47% of their clicks. Page two gets almost nothing, so moving a query from ~12 to ~6 is where a small site gains real visits. advancedwebranking.com
- AWR also finds transactional queries are barely touched by AI Overviews, while navigational/informational ones lose most: aim the edits at "buy"/"book"/"e-book"/"map"/"plan" style queries and at specific long-tail questions the archive answers best.
- GSC PAP guide (Sep 2026): striking distance has no official band; pick one (11-20 strict, or 5-20 incl. weak page-one snippets) and keep it fixed month to month. Use 3 months of data. The UI exports max 1,000 rows; the API returns 25,000 per request. gscpap.com
- Chris Long (LinkedIn, Jan 2025, practitioner test): longer, more descriptive titles gave +15% organic traffic to the tested page.

## How-to (monthly, ~30 min)
1. Pull Queries x Pages for the last 90 days (connected google_search_console app, or Performance > Search results > Export). Turn on CTR and position.
2. Run `python3 tools/gsc_striking.py export.csv --min-pos 5 --max-pos 20 --min-impr 20` (small-site threshold; raise as traffic grows). It ranks rows by impressions, groups by page, and flags low-CTR page-one rows (pos <= 10, CTR < 2%) as snippet fixes.
3. Drop accidental matches (queries the page doesn't truly answer).
4. For each top page, make the smallest edit, one page at a time:
   - Use the searcher's exact wording in the title, H1 or a subheading where it reads naturally.
   - Answer in the first two sentences (date + place + source), then detail.
   - Add what the higher-ranked pages cover and ours lacks (a map, a date list, a scan).
   - Page-one/low-CTR: rewrite title (<= 60-65 chars) + meta description (<= 155) to match the query.
   - Add 2-3 internal links from related Cedwyn pages with anchor text close to the query (plain internal links, never UTMs).
5. Log date, page, query, old position/CTR, edit in the project workspace Re-run the same window length 4 weeks later and compare.
6. If two Cedwyn URLs split one query, merge or canonicalise before editing (cannibalisation).

## How we apply it to Cedwyn
- Cedwyn has little search traffic yet (~56 UK page views/day, few clicks), so use a low impressions floor (10-20) and a wide band (5-30) until there are more rows; also run it on the older family sites with history.
- Likely winners: place-and-date queries ("Llandough 1824 survey", "Ty Mawr farm Llandough", "Bute estate Glamorgan plans", "Jim Driscoll", "Marconi Lavernock"). Edits route through the weekly CEDWYN ONPAGE run (markup and titles only; body text changes are PROPOSED while the repair freeze is on).
- Public wording rules apply to any new title/heading: never name the project lead, none of the banned words, no accusations about named people.
- Feed the winning queries to the AI visibility check (visibility/RUNNER.md) as fixed questions.

## Tool
tools/gsc_striking.py (standard library, written 26 Oct 2026): reads a GSC CSV export (Query, Page, Clicks, Impressions, CTR, Position; header names matched loosely) or API JSON rows.

## Sources
advancedwebranking.com · advancedwebranking.com · gscpap.com · linkedin.com (Jan 2025)
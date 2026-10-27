# Content refresh (historical optimisation): find decaying pages, rewrite, re-date honestly

Topic: SEO / AI visibility. Harvested 27 Oct 2026 (skills harvest run). Numbers marked "not checked" were not verified beyond the page named.

## Why it works (practitioner evidence)
- HubSpot (Pamela Vaughan, blog.hubspot.com "historical optimization", read 27 Oct): optimising old posts more than doubled monthly leads from those posts and lifted their monthly organic views by an average of 106%. Old pages already have links, indexing and history; new posts start from zero.
- Stat Digital (Jacob Statler, 18 Aug 2025, read): 9 "dead or dying" client posts revamped: 4,464 -> 11,964 monthly visits (2.7x) and 12 -> 83 monthly signups (6.9x).
- Orbit Media (Andy Crestodina, read): one post rewritten got 15,000 search visits over six years, then decayed; rewritten again, rankings recovered. Another rewrite: quarterly traffic +700%, GA4 engagement rate +180%. Their pattern: rank, decay after ~2 years, rewrite, recover.
- Animalz (read): 2018 AdEspresso analysis, average decay -1.21% per week; one refresh = 30,000+ extra pageviews and +55% weekly traffic. Animalz also quotes AI-search growth figures (13m -> 90m users by 2027; +1,200% gen-AI referrals to US retail Jul 2024-Feb 2025): second-hand, not checked.
- draft.dev (search snippet only, not read): first gains in 2-4 weeks, full effect 3-6 months.
- Google Search Central "Influence byline dates" (read): Google estimates when a page was "published or significantly updated" from several signals; give a visible date and datePublished/dateModified in Article/BlogPosting JSON-LD. Implication: changing the date without a substantive change is a trick, not a refresh; do not do it.

## How to do it (60-90 min per page)
1. **Find candidates** (Search Console, Performance, Pages, Compare last 3 months vs previous 3; or last 28 days vs same period last year). Pick pages with: falling clicks/impressions, or many impressions at position 8-20 (use tools/gsc_striking.py), or high impressions + CTR under 1%. A page with zero impressions is an indexing problem, not a refresh candidate (see page-indexing-triage-duplicates-canonicals.md).
2. **Diagnose one cause per page**: (a) query drift: the queries it now shows for differ from its title; (b) stale facts or dead links; (c) thin: competitors answer more of the question; (d) weak title/snippet (low CTR at good position); (e) cannibalised by a newer page of ours (merge + 301/canonical).
3. **Rewrite, don't polish**: put the main query in title, H1 and first paragraph; answer the question in the first 3 lines (helps AI answers too, see ai-answer-citations-geo-sources-quotes-stats.md); add what is new since publication (new records, new images, a short FAQ from the actual GSC queries); fix or drop dead links; add 2-3 internal links from newer pages to it and from it to the sales/signup path.
4. **Re-date honestly**: keep datePublished; set dateModified and a visible "Updated <date>" only when the content materially changed. Same URL (never a new slug).
5. **Resubmit**: URL Inspection > Request indexing; re-share it once (newsletter "updated with new records" line, one social post).
6. **Log and measure**: refresh-log.csv (url, date, cause, change, clicks/impressions/position 28 days before). Re-check at 4 and 12 weeks. Keep a refresh only if clicks or signups from the page rose; otherwise try the next cause.
7. **Cadence**: one or two pages a week beats a mass rewrite; review every page that is 12+ months old once a year.

## How we apply it to Cedwyn
- Week 43 Search Console: 0 clicks, 409 impressions (domain), so Cedwyn is mostly too new to have decay; the job now is the position 8-20 and low-CTR pages. Start with tools/gsc_striking.py output and the top 3 impression pages on cedwyn.bucklerfamily.estate.
- The older WordPress wiki and the older bucklerfamily.estate subdomains are the real decay candidates (years of history). Check their GSC properties if connected (not checked), pick pages with falling clicks, refresh them, and add one internal link per refreshed page to the matching Cedwyn page and /ebooks/.
- Each refresh adds the newest catalogue records/images from the research section, so it doubles as "new evidence added" news for the newsletter.
- Check Cedwyn templates emit datePublished/dateModified JSON-LD and a visible updated date (not checked). If they don't, that is an ONPAGE fix (markup only) for the weekly onpage flywheel.
- Editorial rules still apply to every rewrite: never name the project lead; banned public words (states, assertions, per, second-hand report, not checked, reported, deception, taken); no outbound links; nothing about family holdings.
- Owner: CEDWYN ONPAGE flywheel (weekly) picks 1-2 pages; log to the project workspace

## Sources
- blog.hubspot.com
- statdigital.io
- orbitmedia.com
- animalz.co
- draft.dev (snippet only)
- developers.google.com
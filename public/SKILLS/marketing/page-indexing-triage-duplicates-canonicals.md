# Getting a big new site indexed: triage duplicates, thin pages and canonicals first

Harvested 26 Oct 2026 (skills harvest). For: Cedwyn shows only 2 indexed pages in Search Console while its sitemap lists 5,150 URLs.

## What the primary sources establish
- Google's Page indexing report (support.google.com):
  - **Discovered - currently not indexed**: Google found the URL but has not crawled it; "Google wanted to crawl the URL but this was expected to overload the site; therefore Google rescheduled the crawl." Last crawl date is empty.
  - **Crawled - currently not indexed**: crawled, not indexed; "no need to resubmit this URL for crawling."
  - **Duplicate without user-selected canonical** / **Duplicate, Google chose different canonical than user**: Google picks one URL of a duplicate set and will not serve the others.
- Google's crawl budget guide (developers.google.com) is written for 1M+ page sites, 10k+ page sites changing daily, AND "sites with a large portion of their total URLs classified by Search Console as Discovered - currently not indexed". Its first two levers: **consolidate duplicate content** ("focus crawling on unique content rather than unique URLs") and keep low-value URLs out of crawling.
- Google sitemaps doc: Google ignores priority/changefreq and uses lastmod only "if it's consistently and verifiably accurate".
- Practitioner testimony (Moz blog, Go Fish Digital, reviewing this status "across a large number of clients"): duplicate content is "the highest priority we've seen" behind Crawled - currently not indexed. Their fix for redirect confusion: a temporary sitemap of the redirected URLs. Thin pages they leave out: noindex, 404, or drop from internal links.

## Live read of Cedwyn (26 Oct 2026, 12:37 UTC, 10 random sitemap URLs)
- 5,150 URLs: docs 2,052, research 1,161, wiki 975, directory 310, wayback 220. Only 153 carry a lastmod, all "2026-10-26" (the build date, so not "verifiably accurate").
- **Same record, three URLs**: e.g. EV-0291/EV-0025 live at /docs/ghf_evidence/ev_NNNN/, the evidence pages under /wiki/evidence/ and /research/evidence/. 927 path tails repeat across sections.
- **Thin**: sampled record pages carry 80-140 words of body text (one at 523, one at 306).
- **Canonical errors**: /docs/... pages have no canonical, or point at .../index.html, which 308-redirects back to the slash URL (a canonical aimed at a redirect). /research/ pages have no canonical. /wiki/ pages self-canonical.
- /sitemap.xml with any query string (?cb=1) returns 404; plain /sitemap.xml is 200. Googlebot fetches it plain, so this only affects cache-busted checks.
- Search Console's own status split for Cedwyn was not read in this run (the analytics/visibility workers hold that). The diagnosis above is what Google's rules predict for this shape; the report will confirm it.

## The playbook (in order)
1. **Read the split, don't guess**: Search Console > Pages > "Why pages aren't indexed"; export each status. Mostly Discovered = Google is rationing crawls (duplicates/volume). Mostly Crawled-not-indexed or Duplicate = quality/duplication. URL Inspection on 5 samples per section: compare user-declared vs Google-selected canonical.
2. **Pick one home per record.** One canonical URL for each EV/MR/GHF record (the richest page). Every other copy: rel=canonical to it (absolute https URL, no index.html, no redirect), and out of the sitemap.
3. **Sitemap = canonicals only.** Drop alternates, redirects, 404s, noindex pages. Split into sitemaps per section (sitemap-index) so Search Console shows indexed counts per section. lastmod = real last edit of that page's content, or omit it.
4. **Thin pages**: below ~150 words with nothing unique, either merge into a richer hub (one page per record set, with each record as a section and an anchor) or noindex,follow until enriched. Add to each kept record page: its date, source, what it shows, and why it matters to the chronology; 2-3 links to related records.
5. **Internal links decide what gets crawled first**: link the 20-50 strongest pages from the home page and theme hubs (not just the sitemap). A page reachable only through a 5,000-line sitemap is "discovered", not valued.
6. **Ask for the few that matter**: URL Inspection > Request indexing for the 10-20 priority pages (home, /ebooks/, each book page, top story pages). Don't resubmit thousands. IndexNow (tools/index_ping.py) speeds Bing/Yandex, not Google.
7. **Re-measure weekly**: indexed count per section sitemap. Expect weeks, not days.

## How we apply it to Cedwyn
- Owner of changes: the sole cedwyn committer of the moment (currently f708ea1f, then cd49e3e1). This file is the reference; nothing was changed by the harvest run.
- Proposed first patch (markup only, no body text): (a) self-canonical on every /research/ page; (b) /docs/ canonicals pointing at the slash URL, not index.html; (c) docs/research duplicates of an evidence record canonical to one chosen home; (d) sitemap split by section with canonicals only and lastmod omitted unless real.
- Priority pages to request: /, /ebooks/, each book page, /nomenclature/ (new e-book), /story/, /wales/, /argentina/.
- The /wiki/ section mirrors the external Great House Farm wiki; if Google treats those copies as cross-site duplicates, Cedwyn's copies lose. Check 3 with URL Inspection before deciding canonicals there (never alter the external wiki itself).

## Sources
- support.google.com (Page indexing report)
- developers.google.com
- developers.google.com
- developers.google.com
- moz.com (Go Fish Digital, multi-client)
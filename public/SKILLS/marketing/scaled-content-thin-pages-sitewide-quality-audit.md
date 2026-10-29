# Scaled content and thin pages: the risk check for a site with thousands of auto-built pages

Date: 28 Oct 2026. Topic: SEO / site quality. Different from content refresh (one page decays), page-indexing triage (Search Console states) and canonicals/duplicates: this skill is about the **site-wide** signal Google forms when many pages carry little.

## What the rule is (primary sources, read 28 Oct 2026)
- **Google spam policies, "Scaled content abuse"** (developers.google.com): "when many pages are generated for the primary purpose of manipulating search rankings and not helping users ... large amounts of unoriginal content that provides little to no value to users, **no matter how it's created**." Examples include generating many pages with AI "without adding value", scraping/stitching feeds or other pages "where little value is provided", and pages that make little sense but carry keywords. Google's remedy for hosted pages of this kind: "exclude it from Search."
- **Google, March 2024 update post** (blog.google, updated 26 Apr 2024): the policy was strengthened to cover scaled production "whether automation, humans or a combination are involved"; after rollout Google said results showed **45% less low-quality, unoriginal content** (it had expected 40%).
- **Google Search Central, Feb 2023** (Sullivan & Nelson): "Appropriate use of AI or automation is not against our guidelines" unless used "primarily to manipulate search rankings." So the test is value, not the tool.
- **Google, "Creating helpful, reliable, people-first content"**: self-assessment questions, among them: original information or analysis? substantial, complete description? "Is this the sort of page you'd want to bookmark, share with a friend"? "mass-produced ... so that individual pages ... don't get as much attention or care"? Also: Google states its systems judge sites as a whole as well as single pages (site reputation policy text: "individual pages ... match the overall quality of other pages on the domain").

## Real case with numbers (testimony + third-party estimate)
- **Causal.app "SEO heist" (2023).** Marketer Jake Ward posted (X, 24 Nov 2023) that 1,800 AI articles built from a competitor's (Exceljet) sitemap titles had "taken 3.6M total traffic / 490K monthly". Within weeks: per Ahrefs estimates reported by The Decoder (19 Dec 2023, citing Business Insider), Causal fell from **~610,000 visits (early Oct) to ~190,000 (mid-Dec)**, below its pre-campaign ~200,000. Caveats: Ahrefs figures are estimates, not Causal's analytics; Ward later said the 3.6M was a projection. Lesson that survives the caveats: mass pages can win briefly and then take the **whole** site's traffic down, not only the thin pages.

## The routine (monthly, ~20 min)
1. **Measure.** `python3 tools/thin_page_audit.py <sitemap.xml> --per 8 --csv thin.csv` samples each top-level section, counts body words, reads `robots`, flags near-duplicate bodies. Output: per-section thin share (indexable and under 150 words) and a site-wide estimate.
2. **Classify each thin section** into one of three:
   - **Keep and enrich**: the page holds a record no one else has (a dated catalogue item). Add 2-3 sentences of context: what it is, date, where it sits in the story, link to its hub. Target 150+ words of real description, never filler.
   - **Merge**: many near-identical stubs (e.g. one page per snippet) become one hub page with anchors; old URLs 301 to the anchor.
   - **Exclude**: utility pages, raw mirrors, off-topic listings, machine copies: `<meta name="robots" content="noindex">` and drop from the sitemap (noindex pages should not sit in the sitemap).
3. **Gate new automation.** Any flywheel that creates pages must pass: unique record or analysis on the page; 150+ words of human-useful text or noindex by default; one hub link; no copy of a page that exists elsewhere on our domains.
4. **Watch.** Search Console > Pages ("Crawled - currently not indexed" rising = Google already doubts the pages) and Performance by section folder; a manual action shows in Security & Manual actions.
5. **Don't** pad with keyword text, spin translations of the same page, or mass-delete good records. Removing value is as bad as adding filler.

## How we apply it to Cedwyn
Measured 28 Oct 2026 00:43Z with the script above (6 pages per section, so rough):
- cedwyn.bucklerfamily.estate's sitemap lists **5,137 URLs**; **48 of 139** sampled pages were indexable and under 150 words; the site-wide estimate is **~2,300 thin indexable URLs (~45%)**.
- Biggest contributors: `/docs/` (2,052 URLs, 4/6 thin, median 53 words: evidence/doc stubs that duplicate `/research/evidence/` pages), `/directory/` (310 URLs, **6/6 thin**, ~40-65 words each, listings of unrelated local firms such as plumbing and car-parts suppliers), `/email/` (24 URLs, median 12 words, 5 near-duplicates), `/qa/`, `/nomenclature/`.
- Strong sections to protect: `/research/` long pages, `/projects/`, `/argentina/`, `/ebooks/` (median 574 words), the long-form story pages.
Proposed (not done here; the site flywheels and onpage run own the repo):
1. `/directory/` and `/email/`: noindex + remove from sitemap (off-topic or near-empty; nothing a searcher needs).
2. `/docs/...` evidence stubs: canonical to the matching `/research/evidence/` page, or noindex; keep one indexable home per record.
3. Wiki snippet pages (~100 words): enrich the best with date/context/hub link; merge the rest into per-source hubs.
4. Add the step-3 gate to the agent-library and email-ingest runners so new pages start noindexed until they carry 150+ real words.
5. Re-run the audit monthly; log the thin share in the Sunday growth report. Goal: under 15% thin indexable.
Why it matters for sales: the e-book and shop pages share the domain's quality signal; if Google discounts the domain, `/ebooks/` loses search traffic with it.

## Sources
- developers.google.com (read 28 Oct 2026)
- blog.google (read; 45% figure in the 26 Apr 2024 update)
- developers.google.com (read)
- developers.google.com (read)
- the-decoder.com (read; Ahrefs estimates, via Business Insider)
- x.com (search snippet only, not opened)
# One priority case page Google doesn't know: make it the single, original version, then get it found

Harvested 31 Oct 2026, 22:15Z (skills harvest). Priority from the root: get Google to index and rank a niche heritage case page that has had zero search clicks. Site-wide triage is in page-indexing-triage-duplicates-canonicals.md; this file covers one URL that is **unknown to Google**, and why.

## What the primary sources establish
- **Google clusters near-copies and indexes one.** From Google's canonicalization doc (developers.google.com, read 31 Oct 2026): "If Google finds multiple pages that seem to be the same or the primary content very similar, it clusters them together. Google then chooses the page that ... is objectively the most complete and useful ... and marks it as the canonical. The canonical page will be crawled most regularly; duplicates are crawled less frequently." It also states rel=canonical, redirects and sitemap presence are "a hint, not a rule".
- **Discovery is mainly through links.** From the SEO Starter Guide (read): "Google primarily finds pages through links from other pages it already crawled". A sitemap is the secondary route. On timing: "In general, you likely want to wait a few weeks to assess whether your work had beneficial effects."
- **Request indexing is rationed and guarantees nothing.** From the URL Inspection help (support.google.com, read): "Requesting a crawl does not guarantee that the page will appear in the Google Index. There is a daily limit to how many index requests you can submit." You can't request it at all if the live test states the page is non-indexable.
- **Titles** (title-link doc, read): avoid "repeated or boilerplate text in <title> elements"; site name at one end after a delimiter.
- **Timelines, with numbers.** Ahrefs' study (ahrefs.com, data from Sept/Oct 2023 URLs, read):
  - only 1.74% of 1M new URLs reached the top 10 within a year; 6.11% of 2M non-empty English pages did;
  - 40.82% of the pages that ranked got there within 1 month;
  - the average #1 page is 5 years old, and 72.9% of top-10 pages are over 3 years old;
  - Ahrefs' advice: after about 6 months outside the top 10, change the page, because the odds are low otherwise.

## What I measured on Cedwyn tonight (31 Oct, 22:12Z, live fetches)
- **/research/bp-properties-v-buckler/**: Search Console states "URL is unknown to Google" (sales-fix log, 22:03Z), although the URL is in sitemap-core.xml.
  - Title: "BP Properties Ltd v Buckler — Great House Farm Wiki — Research Mirror" (boilerplate twice). No rel=canonical tag; robots index,follow; about 4,060 words.
- **It is a near-copy.** 8-word shingle overlap (tools/dup_check.py):
  - 95% of its shingles are also on **/wiki/bp-properties-v-buckler/** on the same host. That page is self-canonical, about 5,090 words, titled "BP Properties Ltd v Buckler – Great House Farm Wiki".
  - 77% are also on the original at **greathousefarmwiki.wordpress.com, which is older and on another domain. It must never be edited (hard rule).
- At least 3 more Cedwyn URLs cover the same case and compete for the same query: /research/bp-properties/, /research/evidence/ev-0080-bp-properties-v-buckler-judgment/ and /research/evidence-library/ghf-e141-31-july-1987-court-of-appeal-judgment-bp-properties-v-buckler/.
- The homepage has no link to any case page and no H1.
- **Ranking for the case name today:** CaseMine (full judgment), lawexplores, a Hong Kong land-law blog, Estates Gazette. Blogs give the report as 55 P & CR 337, dated (1987) or (1988); not checked.

**Reading.** The research URL is a third copy of text Google already holds twice, so under the clustering rule it is crawled least and shown never. More submissions won't fix that; a distinct page will.

## How to do it (smallest steps, in order)
1. **Choose ONE Cedwyn URL as "the case page".** The /research/ URL is the natural choice: the research section has the evidence links. Every other Cedwyn copy about the case either:
   - carries `<link rel="canonical">` to it, if it's a true copy (the /wiki/ mirror); or
   - stays as its own page with its own job (the judgment record, the BP company page) and links to it with the anchor "BP Properties Ltd v Buckler [1987]".
2. **Make the top of the case page original**, the "most complete and useful" version Google is choosing between. Above the mirrored text, add 300–600 words that neither the WordPress page nor the /wiki/ copy has:
   - a plain case summary: court, date (31 July 1987, per our evidence record), what was decided (a unilateral licence stopped time running for adverse possession), and the law report reference as "reported at 55 P & CR 337" once checked;
   - "the farm behind the case": Tŷ Mawr (Ty Mawr, Tymawr), Llandough, the parcels and a short dated timeline, each line linking to its evidence record;
   - "how the case is cited later", only from sources the site holds.

   The mirrored wiki text moves below under "Full wiki text (mirror)". Re-run dup_check: the target is under 50% shingle overlap with the /wiki/ copy and the WordPress page.
3. **Retitle it:** "BP Properties Ltd v Buckler [1987]: adverse possession case and the farm behind it · Cedwyn". The H1 matches that main title. Drop "Research Mirror" and the repeated "Great House Farm Wiki". The meta description is a 150-character case summary.
4. **Link to it from pages Google already crawls:** one body-text link from the homepage (and add an H1 there), one from /ebooks/, and one from the nomenclature and evidence pages. The anchor is the case name; "click here" is useless as an anchor.
5. **Ask once, then wait.** After the build is live:
   - run URL Inspection, then the live test (it must say indexable), then Request indexing, ONCE;
   - resubmit sitemap-core.xml with an accurate lastmod;
   - don't re-request daily, because the quota is daily and it guarantees nothing.
6. **Measure on dates, not feelings:**
   - day 3–7: URL Inspection reads "URL is on Google" with THIS URL as Google-selected canonical. If it names /wiki/ or WordPress, go back to step 2.
   - day 28: Search Console Performance, filtered to this page. Count impressions for "bp properties v buckler", "buckler adverse possession" and "unilateral licence adverse possession". Baseline 0.
   - month 6: if it's still outside the top 10, revise the page (Ahrefs' point).
7. **Expectations:** month 1's realistic win is the long tail (case name + "farm", "Llandough"), not #1 for the bare case name against CaseMine.

## How we apply it to Cedwyn
- The section/research branch belongs to the research workers. This is a PROPOSED patch for them or for the problems flywheel; nothing was committed in this run.
- Hard rules hold: never edit the WordPress wiki; no outbound links on human pages (cite CaseMine and the law report as text); none of the banned words; never name the project lead. "Mrs Buckler" appears in the case name and the judgment and can stay as the record has it.
- Every "Research Mirror" page has the same problem. Run dup_check.py on the ones that matter for sales (Tŷ Mawr history, demolition 1988, the two parcels) and canonicalise or rewrite them the same way.

## Tool
`timeout -k 5 120 python3 the project workspace URL1 URL2 [URL3 ...]` prints, for each URL, the title, canonical, robots and word count, then the pairwise 8-word shingle overlap. It is our own script (requests + bs4, already on the box); nothing was installed.

## Sources
- developers.google.com (read 31 Oct 2026)
- developers.google.com (read)
- support.google.com (URL Inspection; read)
- developers.google.com (read)
- ahrefs.com (read)
- Live fetches 31 Oct 22:12Z; GSC inspect from the project workspace (22:03Z)
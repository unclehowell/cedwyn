# Impressions but no clicks: check the expected CTR first, then fix the snippet (historic-place pages)

Written 31 Oct 2026, 22:3xZ (skills harvest). The root's priority: turn heritage-page search impressions into clicks. This skill is the step BEFORE serp-title-links-meta-descriptions-rewrite-triggers.md and gsc-striking-distance-quick-wins.md. It decides whether a title rewrite can help at all.

## The numbers (read this run)
- **Advanced Web Ranking CTR study** (read 31 Oct; 1.75M+ US SERPs a month, July 2026 data):
  - Position 1 averages **20.02%** CTR across all SERPs, and **9.69% when an AI Overview shows** (−52%). AI Overviews appeared on 43% of desktop SERPs.
  - **By query length**, a 3-word query gets 23.8% at #1, 13.6% at #2, 8.8% at #3, 3.9% at #5 and **1.28% at #10**. Long-tail queries hold their clicks deeper down the page than 1-word queries (0.76% at #10).
  - **Branded vs unbranded**: 27.3% vs 19.4% at #1, and **4.0% vs 0.8% at #10**, five times more. People who search for the name click it.
  - **SERP features decide the benchmark.** A local pack alone cuts #1 CTR by **94%** (to 1.17%). An AI Overview + People Also Ask + videos cuts it by 81%. Image + video SERPs with no answer box **raise** #1 CTR to 65.3% (+226%). Their conclusion: "your CTR benchmark is a property of the SERP, not of your ranking."
  - Since 2015, position 1 CTR is down 12%, and positions 2–10 have lost 40–47%.
- **Ahrefs, Dec 2025 data** (read 31 Oct; 300k keywords): an AI Overview means **58% lower** CTR for the #1 page, and 19–51% lower at positions 2–10.
- **Seer Interactive** (snippets only, not read): organic CTR on queries with an AI Overview was 1.76% → 0.61% (Sept 2025), then recovered to 2.4% by Feb 2026.

## Step 1: is zero clicks even abnormal? (2 minutes, Search Console)
Export queries with **impressions + average position** for 28 days. For each query (or bucket), take the expected CTR p from the table above (unbranded, the right word count, and halved if the query shows an AI Overview). Then:
- expected clicks = impressions × p
- chance of seeing 0 clicks = (1 − p)^impressions

Worked example: 181 impressions at position 30–60 means p ≈ 0.1% or less, so you'd expect 0.2 clicks and P(0) ≈ 83%. **Zero clicks is normal; the snippet isn't the problem, the ranking is.** If 181 impressions were at position 3 (p ≈ 8%), expected clicks would be 14 and P(0) under 0.0001%: then the snippet IS broken.

`timeout -k 5 30 python3 tools/zero_click_odds.py IMPRESSIONS POSITION [words] [--aio] [--branded]` does the sum (stdlib; written this run).

## Step 2: sort each query into one of four bins
1. **Wrong intent** (e.g. "sports direct leckwith" for a heritage site). There's a local pack, a −94% CTR, and the searcher wants a shop. **Ignore.** Never retitle a page to chase these; it dilutes the page.
2. **Right intent, position > 10.** No title can fix this. The work is ranking: links, a unique page, indexing (see unknown-to-google-case-page-*.md and page-indexing-triage-*.md).
3. **Right intent, position 4–10, CTR below about half the expected rate.** Fix the snippet (Step 3). This is the only bin where a title or description edit pays.
4. **Right intent, position 1–3, normal CTR.** Leave it alone; rewrites risk losing what works.

## Step 3: a snippet that wins the click for a historic-place query
Searchers on long-tail historic-place queries (3–4 words: "ty mawr llandough history", "great house farm llandough") are researchers and locals who read past the first link (AWR long-tail data). What they need to see is **that this page has what the others don't**:
- **The exact place name first, in the form searched, plus the other form**: "Tŷ Mawr (Great House Farm), Llandough: …". Put the plain spelling once in the description too (welsh-circumflex-* skill).
- **The concrete thing on the page**: a date range, a record type or a count. For example: "1840s tithe entry, 1916 tenancy, 1988 demolition" or "34 dated records". Numbers and dates are the scent of a primary source; a general history summary looks like the Wikipedia or AI answer they've already seen.
- **Something the AI answer can't give**: images, a map or document scans. Image-rich SERPs are the only layout where CTR goes UP (+226%). Make sure the page has a real primary image in the static HTML. Google's robots meta `max-image-preview:large` allows large thumbnails (Google doc, not re-read this run).
- Title 50–60 characters, no pipes stacked with the site name (rewrite triggers: see the existing skill and tools/serp_title_audit.py). Description of about 140–155 characters that answers "what's here that I can't get elsewhere".
- **Build brand demand**: branded queries click 5× more at #10. Every social post, video description and e-book should use ONE consistent name pair ("Great House Farm, Llandough" / "Cedwyn"), so people later search the name and not the topic.

## Step 4: measure honestly
- Annotate the change date in Search Console (search-console-ga4-change-annotations-log.md).
- Compare 28 days before and after, **per query**, holding position steady. If the average position moved, the CTR change is position, not the snippet.
- With under about 100 impressions per query, the expected click count is below 1–3. Wait for the impressions; don't declare a win or a loss on 0 vs 1 click (P(0) from Step 1 tells you).

## How we apply it to Cedwyn
- **What we know** (sales-fix log 22:01Z 31 Oct): Search Console for 3–30 Oct shows 181 impressions, 0 clicks, and **0 impressions on any Great House Farm / Tŷ Mawr / Llandough / BP v Buckler query**. The top query is "sports direct leckwith" (29), a bin 1 local-pack query.
- **Verdict:** none of the 181 is in bin 3, so **no title rewrite can turn them into clicks.** The Tŷ Mawr homepage retitle (sales fix run, 22:09Z) is right for a different reason: it aims the page at bin 3 and 4 queries it doesn't yet get. Judge it on new *impressions* for the place-name queries first (expect weeks), and only then on CTR.
- **Proposed next steps** (nothing committed by this run):
  1. Run Step 1 on every query once the place-name queries start getting impressions. Re-run it at day 28 after each build that changes titles.
  2. For the heritage pages (/research/…, /wiki/…, /nomenclature/), put a date range or record count in the description and make sure a primary image is in the static HTML.
  3. Use one name pair everywhere in social posts and e-book back matter to grow branded searches.
- Public text rules apply to every title and description: no banned words, never name the owner, internal links only.

## Sources
- advancedwebranking.com (read 31 Oct 2026; July 2026 data)
- ahrefs.com (read 31 Oct 2026; Dec 2025 data, published 4 Feb 2026)
- seerinteractive.com (search snippet only, not read)
- Internal: the project workspace (GSC 3–30 Oct figures)
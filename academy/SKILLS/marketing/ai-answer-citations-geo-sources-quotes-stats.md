# Getting cited in AI answers (ChatGPT, Perplexity, Google AI Overviews / AI Mode)

Skill harvested 2026-10-26 (skills harvest 17:22). Scope: what to change on a page so generative engines quote it and link it. Measurement tools (Bing AI Performance, Search Console generative AI report) are separate skills already in the index; this one is the content-side playbook.

## What the evidence shows

1. **Sources, quotations and statistics win; keyword stuffing does not.** The Princeton/IIT Delhi GEO paper (Aggarwal et al., KDD 2024, arXiv 2311.09735, read in full on the HTML page) tested 9 page rewrites on 10,000 queries (GEO-bench). The top three methods, *Cite Sources*, *Quotation Addition* and *Statistics Addition*, gave a 30-40% relative gain in "position-adjusted word count" (how much of the answer comes from your page, weighted by position) and 15-30% on subjective impression. Keyword stuffing performed at or below baseline. The paper reports the gains were largest for sites that ranked lower in ordinary search, which suits a small site.
2. **Ranking still helps but is no longer enough.** Ahrefs (Louise Linehan, 2 Mar 2026; 863K SERPs, 4M AI Overview URLs, read in full): only 38% of AI Overview citations also rank in Google's top 10 for the same query, down from 76% a year earlier. Their explanation: Gemini 3 "fan-out" queries pull sources from related searches. So a page can be cited for a question it does not rank for, if it answers a sub-question cleanly.
3. **YouTube is a citation source in its own right.** Same Ahrefs study: 18.2% of AI Overview citations that did not rank in the top 100 were YouTube URLs (5.6% of all citations).
4. **Schema markup alone does not move citations.** Ahrefs (11 May 2026; 1,885 pages that added JSON-LD vs 4,000 matched controls, Aug 2025-Mar 2026, read in full): AI Overviews -4.6% (small, significant), AI Mode +2.4% and ChatGPT +2.2% (both indistinguishable from zero). Keep schema for rich results, not for AI citations.

## How to do it (one page at a time)

1. **List the questions.** Write 10 plain questions a reader would type into ChatGPT or Google about the subject ("When is a farm first mentioned in the records?", "What happened to the farmhouse?"). Add 2-3 fan-out sub-questions each.
2. **Answer first, in one quotable paragraph.** Under an H2 that repeats the question, put a 40-70 word answer that stands alone: who, what, when, with the year and the record named.
3. **Add the three winning ingredients to that paragraph or the next one:**
   - *Cite Sources:* name the record and link it (archive reference, newspaper title and date, broadcaster and year).
   - *Quotation Addition:* one short verbatim line from a period record, in quote marks, with its source line.
   - *Statistics Addition:* a concrete number (acreage, year, count of records) instead of an adjective.
4. **Keep each fact in one place.** One canonical page per fact; other pages link to it. Engines cite the clearest single source.
5. **Make it reachable.** Plain HTML text (not inside images or PDFs only), allowed in robots.txt for the AI crawlers you want, listed in the sitemap. (Agent endpoints and IndexNow are covered in `indexnow-websub-webmcp-agent-endpoints.md`.)
6. **Mirror the answer on YouTube.** A short video with the same question as its title, the answer spoken in the first 15 seconds, and the source in the description and captions (see `youtube-chapters-captions-transcripts-archive.md`).
7. **Measure monthly.** Ask the same 10 questions in ChatGPT, Perplexity and Google AI Mode; log cited yes/no and which URL in a sheet. Compare with the Bing/Search Console AI reports.

## Pitfalls

- Do not invent statistics or quotes to fit the method; a wrong figure that gets cited spreads.
- Do not rewrite the whole site at once; change 3 pages, wait 3-4 weeks, compare.
- Third-party summaries of the GEO paper often round "30-40%" up to "40% for every tactic"; use the paper's own numbers.

## How we apply it to Cedwyn

- **Pages first:** the farm's records timeline page, the /ebooks/ page, and the evidence page for each key year.
- **Example answer block (records timeline):**
  "When is the farm first recorded? The first record mention found is the 1824 David Stewart survey. The family acquired Tŷ Mawr in 1667 (1974 newspapers; ITV News 1988)." Then one verbatim line from the 1824 survey in quote marks with its archive reference, and a linked list of sources.
- **Example statistics swap:** replace "a large farm" with the acreage as written in the named survey, with the survey linked.
- **Close each answer page with one next step:** "Read the full records trail in the free edition" linking to /ebooks/ with utm_source=ai-answer-page, so AI-referred visitors land on the shop path.
- **Questions sheet:** keep the 10 questions in the project workspace so the weekly visibility check (Grok 5 questions) can extend to ChatGPT/Perplexity by hand.

## Sources

- Aggarwal, Murahari, Rajpurohit, Kalyan, Narasimhan, Deshpande, "GEO: Generative Engine Optimization", KDD 2024: arxiv.org (HTML: arxiv.org) - read in full.
- Ahrefs, "Update: 38% of AI Overview Citations Pull From The Top 10", 2 Mar 2026: ahrefs.com - read in full.
- Ahrefs, "We Tracked 1,885 Pages Adding Schema. AI Citations Barely Moved.", 11 May 2026: ahrefs.com - read in full.
- Not used: a Medium post putting Reddit at 24% of Perplexity citations in Jan 2026 (snippet only, not checked).
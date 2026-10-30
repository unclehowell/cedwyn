# People Also Ask (PAA) questions: mine them free, answer them fully on the right page

Skill harvested 30 Oct 2026 (07:4xZ). 0 skill files covered PAA before ("people also ask" appeared in no skill file). Sits beside autocomplete-question-mining-blog-topics.md (autocomplete), search-console-regex-question-longtail.md (our own question queries) and ai-answer-citations-geo-sources-quotes-stats.md (AI answers).

## What the sources show (read 30 Oct 2026)
- **STAT (getstat.com, "People also ask boxes revisited", read):** across 280,000 tracked SERPs, PAA boxes appeared on **over 80%** of results pages, about the same on mobile and desktop, and similar across markets in their 2023 split. (Prevalence varies a lot by tracker and keyword set: AWR quoted ~35% of UK SERPs in an older guide, and a 2026 roundup snippet states 8.5% of searches - treat any single % as tracker-specific.)
- **AlsoAsked study, Chris Green (Torque Partnership), 16 Feb 2026 (read):** 563 keywords, 7,905 PAA questions, 5,415 ranking URLs, 4 intents x 3 niches. Each top-20 page was scored by an LLM for whether it answered each PAA question fully / partly / not at all. Findings:
  - Across the **top 5 positions there is a strong positive correlation between the number of PAA questions a page answers fully and its rank**.
  - **Full answers beat partial coverage**: the weighted score correlated less than the raw count of fully answered questions.
  - Strongest for commercial and transactional queries; weaker for informational and navigational; falls away beyond page 1.
  - Correlation, not cause: answering questions alone does not rank a page; technical quality and links still matter. The study was funded by AlsoAsked (author states no say in method).
- **Format (Quattr, citing Semrush, snippet only):** PAA answers average ~41 words; put a 30-50 word direct answer straight under the question heading, then the detail.

## Free method (no paid tool)
1. Seed 10-20 queries per page cluster (place names, record types, buyer questions).
2. Pull the PAA questions: our search helper already returns a "People Also Ask" block per query (`await websearch.run(q)`; parse lines starting `Q:`). Re-run monthly; PAA shifts.
3. Keep only questions **our evidence can answer truthfully**. Drop opinion/sensitive ones.
4. Map each to ONE page (the one that should rank), never spread a question over several pages.
5. On that page: an H2/H3 that is the question in the searcher's words, a **30-50 word direct answer first** with the date and the source record, then depth and the evidence link. Answer it **fully** (the study's key point).
6. Measure in Search Console: filter the page, regex for question queries (see search-console-regex-question-longtail.md); compare clicks/impressions 4 whole weeks before vs after (prepost.py from before-after-site-change-readout-*.md for the readout).

## How we apply it to Cedwyn
Live pull 30 Oct 2026 07:44Z (search helper, UK index) gave these PAA questions:
- "Llandough history": *How do you pronounce "Llandough"?*; *What is Llandaff famous for?*; *What is the history of Cardiff, Wales?*
- "Llandough Penarth manor house history": *What is the oldest house in Cardiff?*; *What does Penarth mean in Welsh?*
- "Welsh family history Glamorgan farm records": *Where can I find a Welsh family history archive?*; *What does Glamorgan mean?*
- "Welsh Patagonia history Chubut": *Why did so many Welsh go to Patagonia?*; *Why does Chubut speak Welsh?*; *Do they still speak Welsh in Patagonia?*

Proposed answers (PROPOSED, for the onpage/agents flywheels; the repair freeze means no edits to existing cedwyn pages now - stage as a patch in the project workspace or a HubSpot [CEDWYN GAP] task):
1. Llandough place page: a "How do you pronounce Llandough?" box (Welsh spelling, a plain-English sound guide, meaning of *llan* + saint's name, source: the place-names list skill / RCAHMW List). Low effort, matches a live PAA.
2. Wales/research hub: "Where can I find Welsh family history records for a Glamorgan farm?" - a 40-word answer naming the public record types (tithe maps, estate surveys, newspapers, Land Registry) with internal links to our catalogue pages; strongest buyer-adjacent question for the e-books.
3. Patagonia pages (es/en): "Why did so many Welsh go to Patagonia?" and "Do they still speak Welsh in Patagonia?" - 40-word answers with dated sources, linking onward to the Patagonia material and /ebooks/.
- Skip "What is the oldest house in Cardiff?" unless we have a sourced answer; never assert a superlative we cannot cite.
- Measure: Search Console query filter `^(how|why|what|where|do|does|is)` on each edited page, 4 weeks before/after.

## Sources
- alsoasked.com (read; study 16 Feb 2026)
- getstat.com (read)
- advancedwebranking.com (snippet only)
- quattr.com (snippet only)
- Live PAA pull via our search helper, 30 Oct 2026 07:44Z (4 queries above)
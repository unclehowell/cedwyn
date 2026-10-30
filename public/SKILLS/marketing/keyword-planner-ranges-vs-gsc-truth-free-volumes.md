# Keyword volumes for free: Keyword Planner ranges vs Search Console truth

Harvested 30 Oct 2026. What it fixes: choosing page titles, e-book subtitles and FAQ topics by guessed demand. Status: method + proposal. Nothing was created or changed.

## The facts (sources read 30 Oct 2026)
- **Google Keyword Planner (GKP) is free inside a Google Ads account.** Google's own page (business.google.com keyword-planner FAQ, read) states you must "complete your Google Ads Account setup and create a campaign", and switch Smart Mode to **Expert Mode**. Practitioner guides (selahcreativeco, ajaladigital, snippets) describe an Expert Mode link, **"Create an account without a campaign"**, that skips this. So the official line and practitioner experience differ. Either way, never enter billing details or launch a campaign (zero spend).
- **Without ad spend you get ranges, not numbers.** For example 10–100 or 1K–10K. Search Engine Roundtable reported this in Aug 2016 ("For a more detailed view, set up and run a campaign"), and it's still the behaviour. Exact numbers would need spend, so the answer here is no.
- **"Avg. monthly searches" = the keyword plus its close variants,** averaged over 12 months for the chosen location, "regardless of language" (Google Ads Help 3022575, read). Misspellings and near-synonyms are lumped together.
- **GKP over-estimates.** Ahrefs compared GKP with Search Console impressions for about 72k keywords (2021, read): 54.28% of GKP volumes were overestimates and 45.22% were "roughly accurate" (within 50%). Grouping causes absurd cases: "chusky" was shown with husky's 550k. Ahrefs' help centre (updated 3 Sep 2026, read) still states GKP "should not be used as a benchmark".
- **Ground truth for our own terms = Search Console impressions** for queries where our page ranks on page 1. That data is ours and it's free, but it's anonymised for rare queries (see the existing gsc-anonymised-queries skill).

## The method (30–45 minutes, read-only)
1. **Seed list (20–40 terms)** from what readers would type: "Llandough history", "Great House Farm Llandough", "Welsh Patagonia history", "Welsh settlers Patagonia book", "Cardiff local history e-book", "Glamorgan farm history", plus Welsh and Spanish forms (e.g. "colonia galesa Chubut historia"). Pull more seeds from our GSC queries, People Also Ask and autocomplete (skills exist).
2. **GKP "Get search volume and forecasts"**, location United Kingdom (then Wales/Cardiff), and a second pass for Argentina in Spanish. Record the **range bucket**, the 12-month trend, and whether GKP merged the term into another one.
3. **Discard** terms showing "0–10"/"–" in every geo, unless they're exact titles we want to own. Keep 10–100+ terms as candidates.
4. **Cross-check against GSC** (last 3 months, Queries tab, our pages at position ≤10): impressions ÷ 3 ≈ real monthly searches for the term. Where GSC and GKP disagree, **trust GSC**. Log the ratio, since it tells us how much GKP inflates our niche.
5. **Intent check:** look at the live results page for each kept term. If page 1 is all retail or Wikipedia, we need a distinct angle (record pages, primary sources). If it's forums or thin pages, it's a real opening.
6. **Act:** one term per page as the title/H1 phrasing and the e-book subtitle. Re-measure in GSC 4–6 weeks later (use annotations, skill exists).

## Pitfalls
- Don't write for a range bucket. "1K–10K" can mean 1,100, and close-variant grouping can make it smaller still.
- Welsh-language terms often show no volume. That doesn't mean no readers: GKP has a threshold, and the Welsh audience is real (see the welsh-language skills). Judge them by GSC instead.
- Google Trends (google-trends-seasonal-timing skill) gives timing. GKP gives rough size. GSC gives truth. Use all three, each for its own job.

## How we apply it to Cedwyn
- **Proposal (needs the project lead):** a Google Ads account on his Google login in Expert Mode with no campaign and no billing. Creating an account is an action in his name, so it waits for his OK. Until then, use only the GSC + autocomplete + PAA route, which already works.
- **Safe now:** build `the project workspace` (term, lang, geo, source) from GSC queries and the existing PAA/autocomplete outputs, with a column for the GKP bucket to fill once access exists.
- **Use:** subtitles and H1s for the e-book pages and /wales/ stops, and es pages for the Argentina audience. Prices and new public channels remain the project lead's calls.
- **Public text rules apply** to every title chosen: never name the project lead, none of the banned words.

## Sources
- business.google.com (read 30 Oct 2026; access needs Expert Mode + campaign per Google)
- support.google.com (read; close variants, 12-month average, regardless of language)
- support.google.com (read; "Get search volume and forecasts")
- seroundtable.com (read; ranges without a running campaign, Aug 2016)
- ahrefs.com (read; 72k keywords, 54.28% over, 45.22% roughly accurate)
- help.ahrefs.com (read; updated 3 Sep 2026)
- selahcreativeco.com (snippet; "Create an account without a campaign")
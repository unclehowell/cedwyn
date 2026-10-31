# Wikipedia pageviews as a free topic-demand signal (which chapter/topic to push, and when)
Harvested 2026-10-31 (skills harvest ~03:15Z). Topic: keyword tools show "0 volume" for niche local history; Wikipedia's free pageviews API gives real daily human readership per topic in en/cy/es, with spike dates. Complements keyword-planner-ranges-vs-gsc-truth-free-volumes.md, google-trends-seasonal-timing.md and autocomplete-question-mining-blog-topics.md (this one gives absolute numbers per article and per language).

## What the sources show (read unless marked)
- **API (Wikimedia Analytics API, endpoint used live this run):** `wikimedia.org data from 1 July 2015; `agent=user` excludes known bots; free, no key; send a descriptive User-Agent with contact (Wikimedia User-Agent policy; page not fully read).
- **Evidence it tracks real-world interest:** McIver & Brownstein, PLOS Comput Biol 2014 (abstract read): Wikipedia article views estimated US flu-like illness up to two weeks ahead of the CDC, average absolute difference 0.27% over 294 weeks, and found the peak week 17% more often than Google Flu Trends. Alibudbud 2023 review (snippet): 29 health studies used pageviews as a demand signal. Not marketing studies, but the best published validation that pageviews follow public interest.
- **Our own read, 1 Oct 2025 - 30 Sep 2026, human views (pulled 31 Oct 2026):**
  | Article | 12-mo views | per day |
  |---|---|---|
  | en Welsh language | 576,390 | 1,579 |
  | en Cardiff | 527,757 | 1,446 |
  | en Squatting | 202,218 | 554 |
  | en Enclosure | 108,370 | 297 |
  | en Adverse possession | 81,138 | 222 (peaks 1,082 on 30 Mar, 1,055 on 29 Jun 2026) |
  | en Penarth | 57,641 | 158 |
  | en Vale of Glamorgan | 43,178 | 118 |
  | en Trelew | 25,496 | 70 |
  | en HM Land Registry | 16,591 | 45 |
  | es Colonización galesa en Argentina | 16,142 | median 39 (peaks 300 on 15 Jul, 264 on 14 Jul, 190 on 28 Jul) |
  | en Gaiman, Chubut | 14,254 | 39 |
  | en Welsh settlement in Argentina | 11,301 | median 27 (peaks 289 on 19 Jul, 180 on 20 Jul) |
  | en Llandough, Penarth | 3,089 | 8 |
  | en Tithe map | 2,591 | 7 |
  | en Leckwith | 1,637 | 4.5 |
  | cy Y Wladfa | 843 | ~1 (peaks 22-24 Dec) |
  | cy Llandochau | 55 | ~0 |
  Readings: (1) the Spanish Wladfa article outreads the English one (16.1k vs 11.3k): Spanish copy has real demand. (2) Welsh-Patagonia interest spikes in mid-July, ahead of 28 July (Gŵyl y Glaniad). (3) The legal angle ("adverse possession" 81k, "squatting" 202k) has 25-65x the readership of the place names; the place pages are tiny. (4) Welsh-language Wikipedia demand for these topics is near zero; Welsh copy is for identity/goodwill, not reach.

## How to do it (steps)
1. List 10-20 candidate topics as Wikipedia article titles in en, es, cy (use the article's own title, follow redirects; a 404 = wrong title).
2. Run `python3 the project workspace en:Adverse_possession es:Colonización_galesa_en_Argentina ...` (stdlib, written this run; total, median/day, top-3 spike dates).
3. Rank topics by median/day (spikes inflate totals). Use as relative demand, not as Google search volume: it counts readers of the encyclopedia, not searchers of our phrase.
4. **Bridge rule**: pick a high-demand general topic that the book genuinely illustrates (e.g. adverse possession, enclosure, tithe maps) and write one explainer page that uses a Cedwyn record as the worked example, with the chapter link. Lead-in to the niche, not the niche alone.
5. **Timing rule**: schedule posts/emails 7-10 days before the spike dates the daily series shows (e.g. Patagonia content by ~5-8 July).
6. Re-pull quarterly; log totals in a CSV beside GSC numbers; check whether our GSC impressions for the bridge topic move.
7. Do not edit Wikipedia to add our links (COI rules: wikipedia-ai-citations / wikimedia-commons skills).

## How we apply it to Cedwyn
- Priority explainer: "Adverse possession in a real Welsh case: the records" (bridge to the case chronology and the e-book), plus "Reading a tithe map: Llandough 1840s" (7/day general demand, our record as the example). Public text follows the editorial rules (neutral, dated, no banned words, never names the owner).
- Spanish: first Spanish chapter/sample and Patagonia posts timed for early July 2027; es demand beats en for the Wladfa.
- Place-name pages (Llandough, Leckwith) stay for search intent and AI answers, not as traffic bets.
- Measure: GSC impressions/clicks for the bridge pages vs 4 weeks before; buy-link clicks with utm_content=bridge-<topic>. Kill rule: 0 impressions after 6 weeks -> rewrite the title to the Wikipedia article's own term.

## Sources
- doc.wikimedia.org (search preview; endpoint verified by live calls)
- wikimedia.org (live pulls 31 Oct 2026, figures above)
- journals.plos.org (abstract read)
- Alibudbud 2023, "Wikipedia page views for health research: a review", PMC (snippet only)
- meta.wikimedia.org (page fetched, text not extracted)
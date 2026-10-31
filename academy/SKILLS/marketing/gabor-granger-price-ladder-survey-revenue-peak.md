# Gabor-Granger price ladder survey: finding the revenue peak before a price is set

Harvested 30 Oct 2026 (skills harvest). 'gabor' had 0 hits in INDEX.md before this run. Van Westendorp is already covered and finds a price band; this skill covers the second step, choosing a price inside that band.

## What it is
Each respondent sees one price at a time and answers yes/no: "would you buy this at £X?" A yes moves the price up and a no moves it down, until the survey has their highest yes. Count, for each ladder price, the share of respondents whose highest yes is at or above it. That gives demand. Demand × price gives revenue per target respondent, and the peak of that curve is the revenue-maximising price. Origin: Gabor & Granger, Nottingham, *Applied Statistics* 1961 (fifteen grocery products), then *Economica* 1966 (price as a quality signal). That history is as summarised by OpinionX; we did not read the papers.

## Numbers from practitioners
- **OpinionX (Daniel Kyne, Oct 2026 guide, read in full):**
  - ~100 participants shows roughly where the peak is; ~300 gives a peak you can trust; 500+ if you want to cut by segment.
  - Binary-search ladders test 100 prices in about 8 votes.
  - In their worked coffee-subscription example, $18 gave $11.88 per target customer and $26 gave $11.70. That is a 44% higher price for an 18-cent difference. The method often returns a *revenue-neutral band*, not a single point; choosing inside the band is a margin vs reach call.
- **Hypothetical bias (cited by OpinionX):**
  - Stated willingness to pay runs about 21% above real payment (Schmidt & Bijmolt, *JAMS* 2020 meta-analysis).
  - In 28 studies, stated values were 1.35× real ones (Murphy et al. 2005).
  - Indirect methods such as conjoint overstated by about 10 points *more* than direct questions.
  - Rule: **never put the revenue column in a forecast.** Use only the *position* of the peak.
- **Quali-Fi guide (read):** suggests 200-400 respondents, or 50+ per price point. Its worked table puts the peak at $49 (58% × $49 = 28.4) between $39 (27.7) and $59 (24.2). Run Van Westendorp first when you have no anchor, then Gabor-Granger inside the band.
- **Known failure modes:**
  - **Ceiling too low.** If the peak lands on the top price, the ladder didn't go high enough. Always add an "above the top price" follow-up.
  - **No screener.** Without an interest screener ("would you buy this at any reasonable price?"), a no to the price can't be told apart from a no to the product.
  - **Ignoring costs.** With per-sale costs such as Stripe fees, the most profitable price sits slightly above the revenue peak.
  - **Blending segments.** Mixing segments gives a price neither segment wants.

## How to run one (free, no install)
1. **Fix the offer exactly.** Give the title, what's inside, the format, and one cover image. If half the sample imagines a different product, the data is noise.
2. **Set the ladder.** Use 6-10 prices that span the Van Westendorp band, or 0.5× to 2.5× your best guess if there is no band. Use real price endings (£2.99, £3.99, …). Add the above-max question.
3. **Add the screener first,** then the ladder. Also ask one segment question (for example "local / family history / legal-history interest"). Do not cut by segment at under 300 responses.
4. **Collect.** Only ask people who have opted in to hear from us: newsletter subscribers or existing buyers. A Google Form works. Implement the ladder as branching sections (yes → section with the higher price, no → section with the lower price), or show each person one random price, which is the monadic version and needs about 50 per price.
5. **Analyse** with `tools/gg_calc.py answers.csv <ladder prices>`. It prints demand %, revenue per respondent, the peak, the ±5% band, and warnings when the peak sits on the ladder floor or ceiling.
6. **Decide inside the band.** Pick the higher price when Stripe fees bite or you want a quality signal. Pick the lower price when the goal is reach, list growth or reviews.
7. **Confirm with real money** where you can: a live A/B test or a launch-week price, judged with the existing ab_stats/SRM tools. A survey ranks prices; only sales validate them.

## Gates / when NOT to use it
- **Under ~100 opted-in respondents:** the result is direction only. Say "n = 43, direction only" next to any chart.
- **The question is what goes in the bundle, not what it costs:** use conjoint or MaxDiff instead.
- **The price only makes sense against a competitor** (for example a £20 county history paperback): use a choice experiment instead.
- **Rules:** surveys go only to people who opted in (PECR). Run no prize draw as an incentive unless it meets the CAP-code prize-draw rules already in the index. Collect no personal data beyond an optional email.

## How we apply it to Cedwyn
- **Prices stay as they are.** Live now: v0.0.1 free, v0.0.2 £4.99, bundle £19.96, academy £49.99/mo. Any survey and any resulting price is a **PROPOSAL for the project lead's GO**, logged in the project workspace
- **Best first use: the next e-book release** (v0.0.3, which the ladder rule puts at £9.98) and the **bundle**, before they are announced. Test a ladder of £4.99 / £6.99 / £7.99 / £9.98 / £12.99 / £14.99 to see whether the +£4.99 step leaves money on the table or loses buyers.
- **Second use: an academy tier** (monthly vs a one-off "pass"). Run Van Westendorp first, because nothing anchors that price yet.
- **Sample reality check.** Our list is small, so expect under 100 answers. Report the result as direction only, and pair it with the launch-week real-sales check.
- **Survey copy is public text.** Use neutral third person, never name the project lead, and use none of the banned words.
- **Tool:** `the project workspace` (own stdlib script, written this run, tested on synthetic data; nothing installed).

## Sources
- opinionx.co (vendor guide, read in full; its worked example is illustrative, not real customer data)
- quali-fi.com (vendor guide, read; worked example illustrative)
- conjointly.com (snippet only: shown prices lead respondents to understate WTP strategically)
- qualtrics.com (snippet only)
- Schmidt & Bijmolt 2020 (JAMS) and Murphy et al. 2005 (ERE) as cited by OpinionX; not read directly
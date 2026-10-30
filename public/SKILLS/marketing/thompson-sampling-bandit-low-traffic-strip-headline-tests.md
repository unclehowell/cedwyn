# Thompson-sampling bandit tests for low traffic (strips, headlines, button text)

Skill harvested 30 Oct 2026. Topic: A/B testing / CRO. Before this, the index had 0 entries for "bandit", "multi-armed" or "explore-exploit". ab_stats.py, srm_check.py and prepost.py cover fixed A/B tests and before/after readouts.

## What the sources show
- **Google Analytics Content Experiments ran on a bandit.** Steven L. Scott, GA blog, 22 Jan 2013 (read 30 Oct). Each day traffic is re-weighted to each variant's probability of being the best (Thompson sampling). Default stop rules:
  - run at least **2 weeks**;
  - then stop when one arm has **at least a 95% chance** of beating the original, **or** when there's a 95% chance that the "potential value remaining" is under **1% of the champion's rate**. That's 1% relative: 0.04 percentage points on a 4% rate.
- **Google's own simulation numbers, 2 arms:**
  - Setup: 4% vs 5% conversion, 100 visits a day.
  - A classical power calculation needs 22,330 visitors, which is **223 days**.
  - Over 500 runs the bandit found the right arm 482 times. On average it finished **175 days sooner** and saved **97.5 conversions**. The reversed case was symmetric: 171.8 days and 98.7 conversions saved.
- **6 arms:** the classical test would need 91,842 visitors (**919 days**). The bandit averaged **88 days**. Losing arms got starved quickly, so each wasted visit cost about 0.01 conversion.
- **Parse.ly Headline Testing** (docs, read) is the same algorithm in production for publishers:
  - Beta(clicks, non-click impressions), up to 10 variants, each visitor sticks to one variant via a cookie.
  - It reports a "win chance". High is 95% or more and safe to ship. Fair is 70-95%, so use editorial judgement. Low is 55-70%. Below 55% is inconclusive.
- **Cautions** (our reading, not checked against a study):
  - Bandits trade a clean effect-size estimate for fewer wasted visits.
  - Results drift if the arms' rates change over the run (seasonality, a press spike), which is why the 2-week floor matters.
  - Stick visitors to one arm, and measure unique clicks, not reloads.
  - Bot clicks poison a bandit faster than an A/B test, so filter first (bot_click_flag.py, human_traffic_split.py).

## When to use which
- **Fixed A/B** (ab_stats.py): when you need to know *how much* better, or the decision is costly (a price change, which is the project lead's decision anyway).
- **Bandit** (bandit.py): when you want to lose fewer clicks while learning on a reversible, cheap choice (headline, strip copy, button label, thumbnail) with 2-6 variants.
- **Neither:** with fewer than about 20 total clicks the tool refuses a verdict. At our current traffic, test the *click to /ebooks/* (more frequent), not purchases (near 0).

## How to run it
1. Pick one reversible element and 2-4 clearly different variants. Small wording tweaks need traffic we don't have.
2. Assign variants per visitor and keep each visitor on the same one (cookie or hash of an id). Log *shown* and *clicked* per arm as unique visitors.
3. Once a day (or week) run:
   `python3 the project workspace "control:420:9" "strip-b:400:15" "strip-c:380:6" --days 16`
   It prints rate, P(best), P(beats control) and the **serving weights for the next period** (each floored at 5%), with the champion and the 95th-percentile potential value remaining.
4. Set the new weights. When it states STOP (14+ days and P(best) 95% or more, or arms tied at under 1% PVR), ship the winner and log it with srm_check.py-style sanity notes in the annotations log.
5. Box test, 30 Oct:
   - 3 arms (9/420, 15/400, 6/380, day 16) gave KEEP RUNNING with weights 8/87/5%, PVR 16.8%.
   - 60/3000 vs 105/3000 gave STOP.
   - 1/50 vs 2/50 on day 5 gave KEEP RUNNING (minimum days).

## How we apply it to Cedwyn
- **First candidate:** the in-content shop strip on high-traffic non-shop pages (already a skill), with 2-3 strip headlines and the click to /ebooks/ as the reward.
- **Second candidate:** the /ebooks/ hero line (the 12-20 word offer still missing, task [record]), once written.
- **Implementation is a proposal:** variant assignment needs a Cloudflare Worker or a tiny inline script plus a beacon to the existing analytics (wae_beacon). Stage the patch in the project workspace only. **No push during the repair freeze or while a Cedwyn build runs.**
- **Public text rules apply to every variant:** never name the project lead, no banned words, internal links only, purchases via /ebooks/.
- **Prices and bundles are not bandit material.** They are the project lead's decisions; propose them via QUEUE-after-framing.md.
- **Report results as probabilities:** for example "strip B best with 89% probability, not settled". Never call a lead a win before STOP.

## Tool
- `tools/bandit.py` is our own standard-library script (~3 KB, nothing installed), box-tested 30 Oct on synthetic counts.

## Sources
- analytics.googleblog.com (stop rules, 223 vs 175 days saved, 919 vs 88 days; read)
- research.google (Scott 2015, paper; snippet)
- docs.parse.ly (Thompson sampling in production, confidence grades; read)
- microsoft.com (Chapelle & Li, empirical evaluation; not re-read)
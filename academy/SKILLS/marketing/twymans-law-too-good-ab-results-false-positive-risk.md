# Twyman's law: when a small A/B "win" is too good to be true

Topic: A/B testing / analytics trust. Added 2026-10-30 by the skills harvest. Companion to `sample-ratio-mismatch-srm-check-ab-tests.md` (SRM), `before-after-site-change-readout-placebo-control-homepage-label.md` (no-split readouts), `growth-experiment-loop-autoresearch-keep-discard.md` (the loop) and `tools/ab_stats.py` (Fisher p, sample size). This file covers the step those skip: **deciding whether to believe a surprising result at all.**

## The rule
Twyman's law: "Any figure that looks interesting or different is usually wrong" (Ehrenberg 1975 wording, traced by Ron Kohavi, LinkedIn, 7 May 2017, read). Kohavi, Deng and Vermeer (KDD 2022, "A/B Testing Intuition Busters", read in full): across "tens of thousands of A/B tests" at Airbnb, Booking, Amazon and Microsoft they "have never seen any change that improves conversions anywhere near" +300%. Surprising results need "a very low" p-value and a replication.

## The case that is our size (read, KDD 2022 §2)
GuessTheTest, 16 Dec 2021: "Which design radically increased conversions 337%?" Real test, 35 days, 50/50 split:
- Control 82 visitors, 3 conversions (3.7%); Treatment 75 visitors, 12 conversions (16.0%).
- Reported p = 0.009 and "observed power 97%". Fisher exact p = 0.013.
- Kohavi et al.: **pre-experiment power was about 3%**; even with the best published success rate (33%) the **False Positive Risk is about 63%**: more likely false than true. GuessTheTest later added that it was underpowered and suggested a replication.
- "Observed power" computed from the observed effect is meaningless (it always looks high when p is small; Gelman 2019, cited there).
That table is exactly the scale of a Cedwyn landing-page or email test.

## False Positive Risk: the number to read instead of p
FPR = P(no real effect | "significant"). With a one-sided 0.025 threshold and 80% power (KDD 2022 Table 2):

| Org (source) | Success rate | FPR at 80% power | at 20% power |
|---|---|---|---|
| Microsoft | 33% | 5.9% | 20.0% |
| Bing | 15% | 15.0% | 41.5% |
| Booking / Google Ads / Netflix | 10% | 22.0% | 52.9% |
| Airbnb search | 8% | 26.4% | 59.0% |

Most ideas don't work, and a tiny test has low power. Together they make most "wins" false.

## Five puzzling outcomes to check first (Kohavi et al., KDD 2012, "Five Puzzling Outcomes Explained", PDF read)
1. **Wrong success metric.** A Bing bug showed users very poor results, and distinct queries per user rose over 10% and revenue per user over 30%. Users were struggling, not happier. For us: count sales and engaged reads, never clicks alone.
2. **Tracking artefacts.** A variant that changed how clicks were logged showed "more clicks". In reality "the click logging was simply more reliable and fewer beacon requests were lost". For us: if one arm changes the link, redirect, script or page speed, the measurement itself has changed.
3. **Early trends.** "most cases of suspected Primacy and Novelty effects are not real, but just a statistical artifact": early deltas look big and shrink as data accumulates. Never stop on a day-2 spike.
4. **Length and power.** Running longer doesn't fix a test that is underpowered from the start. Decide the size first.
5. **Carryover.** People hurt by one test stay changed. After one bad-experience bug the buckets "still had not fully recovered" three months later. Re-randomise, or A/A-check the groups first.
Also from that paper: "The A/A test has been our most useful tool": about 5% of A/A tests should come out "significant" at 95%.

## How to run it (checklist, 10 minutes)
1. **Before the test**, write in results.tsv: one metric, the smallest lift worth acting on (MDE), the stop size from `ab_stats.py samplesize`, and the stop date.
2. **When a result arrives**, run `python3 tools/fpr_check.py nA convA nB convB --mde <planned lift>`. It prints the lift, Fisher p, pre-experiment power and FPR at four success rates, and flags TWYMAN when the lift is over 30% or power is under 50%.
3. If flagged, go through these in order:
   - Run the SRM check (`tools/srm_check.py`).
   - Check whether both arms used the same tracking, the same link redirect and the same bot filtering (`tools/bot_click_flag.py`, `human_traffic_split.py`).
   - Check whether the gain sits in one day or one source (a share, a bot, a crawler).
   - Check whether the success metric is the thing we sell.
4. **Replicate** with a fresh split before you call it a win. If the replication is flat, log it "inconclusive", not "lost".
5. **Wording**: log "B looked better (3 vs 12, underpowered, not replicated)", never "B lifted conversions 337%". Report numbers with their size, and keep surprising ones out of public copy until they replicate.

## Free tool
`tools/fpr_check.py` (own script, standard library, reuses `ab_stats.fisher`, nothing installed). Box-tested 30 Oct 2026 on the KDD 2022 numbers: Fisher p 0.013 (paper 0.013), power to detect +10% = 3% (paper about 3%), FPR at a 33% success rate 61% (paper 63%; they use a two-sided power figure). Verdict TWYMAN.

## How we apply it to Cedwyn
- **Size reality.** At about 3-4% conversion and tens of visitors per arm per week, a +10% test needs thousands per arm. That's the same lesson as `small-sample-usability-tests-buy-path-5-users.md`: test big, obvious changes, or use 5-user tests.
- **Every keep/discard in the growth loop and every bandit readout gets `fpr_check.py` first.** A TWYMAN flag means "inconclusive, replicate". It never means "keep".
- **Email subject tests to a small Mailchimp list.** Opens are inflated by Apple's privacy protection and bot clicks (see `email-metrics-mpp-bot-clicks-what-to-trust.md`). A "+40% opens" result fails steps 2 and 3 by default. Judge on clicks to /ebooks/ and on sales.
- **Never run tests on prices** (standing rule). The check applies to copy, layout, subject lines and sample chapters only.
- **The Sunday growth report quotes a test result only once it has replicated or passed the check**, with its size: "12 of 75 vs 3 of 82".

## Sources (read 30 Oct 2026)
- Kohavi, Deng, Vermeer, "A/B Testing Intuition Busters", KDD 2022: exp-platform.com (PDF via bit.ly) · dl.acm.org
- Kohavi et al., "Trustworthy Online Controlled Experiments: Five Puzzling Outcomes Explained", KDD 2012: exp-platform.com
- Kohavi, "Twyman's Law" (LinkedIn, 7 May 2017): linkedin.com
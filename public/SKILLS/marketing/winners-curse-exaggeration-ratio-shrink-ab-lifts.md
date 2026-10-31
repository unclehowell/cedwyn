# Winner's curse: a "winning" A/B lift is too big. Shrink it before you quote, forecast or stack it

**Skill.** A test that "won" answers *is B better?* (that is Twyman / false-positive risk, see `twymans-law-too-good-ab-results-false-positive-risk.md`). This file answers the next question: *how much better?* Even when B really is better, the lift you saw on a low-powered test is inflated, because only the lucky-high draws cross the significance line. Never put an observed lift into copy, a forecast or a sum of wins until you have measured how inflated it probably is.

## Evidence (primary sources, read)
- **Gelman & Carlin 2014**, "Beyond Power Calculations: Assessing Type S (Sign) and Type M (Magnitude) Errors", *Perspectives on Psychological Science* 9(6) 641-651 (read in full). Two numbers to compute for any significant result, from a *plausible* true effect (from outside the test, never the observed one) and the standard error:
  - **Type S rate**: chance a significant result has the wrong sign.
  - **Exaggeration ratio (Type M)**: expected |estimate| / true effect, given significance.
  - Their worked case: an 8-point difference, p = .015, SE 3.3 points. If the true effect is 0.1 points: power 5%, **46% chance of the wrong sign, estimate 77x too big**. At 0.3 points: about 40% wrong sign, **25x too big**. At **80% power the exaggeration is only 1.12x**, so the problem is a low-power problem.
- **Airbnb, Shen & Lee 2017** (engineering blog "Selection Bias in Online Experimentation", read; KDD 2018 paper "Winner's Curse: Bias Estimation for Total Effects of Features in Online Controlled Experiments"). Six launched "winners" summed to far more than the holdout that measured them together. Toy example from the post: three significant tests showed 2.7% + 2.6% + 3.3% = **8.6%**, true effects 1% + 1% + 4% = **6%**, a 2.6-point upward bias. They show the selection bias is **always positive**, and that summing winners overstates the total even when every winner is real.
- **Trustworthy A/B Patterns replications (Kohavi, Vermeer, Linowski et al., LinkedIn summary Feb 2026, read)**. Seven fresh replications of popular patterns (rounded buttons, page speed, coupon-code field, sticky CTA), **median 2.2M users per test**, 80% power at MDEs of 0.3% to 2.2%. Every estimate came out **substantially smaller than the originally published lifts**, and **5 of 7 were not significantly different from zero**. Even at 2.2M users they could not power revenue per user or purchase rate and fell back to click-type proxy metrics.
- **GuessTheTest (O'Malley with Ishan Goel of VWO, reviewed by Kohavi, Dec 2023, read)**. Real published "wins": **+364% on 17 vs 11 visitors (1 vs 3 conversions)**, **+337% on 3 vs 12 conversions**, and a -60% that was **2 vs 5 conversions** on a page with thousands of visitors. The big swing comes from few *conversions*, not few visitors.

## How to do it (10 minutes per result)
1. **Pick a plausible true effect from outside the test.** Use published replications (above: most UI tweaks move things under ~2%), your own past tests, or the smallest change worth acting on. Never use the observed lift: that is circular.
2. **Run the helper** (stdlib, no install): `python3 tools/retrodesign.py --a 3/82 --b 12/75 --effect 0.02` (conversions/visitors per arm; effect = plausible difference in proportion). Or `--effect D --se S` in any unit. It prints power, Type S, the exaggeration ratio, a shrunk difference (observed / exaggeration) and a verdict. It reproduces the paper's numbers (0.1 → 77x / 46%; 0.3 → 25x / 40%; 80% power → 1.1x).
3. **Rules of use:**
   - Power under 80%: **the size is not quotable**. Log the direction only, plus raw counts.
   - Type S over 5%: even the direction is shaky. Log it as "inconclusive, replicate".
   - **Never add up wins.** To know the total effect of several shipped changes, keep a small **holdout** (Airbnb's method), e.g. 10% of /ebooks/ visitors still see the old page for a fixed period. Or re-run the old version once as a "reverse test".
   - **Forecasts use the shrunk number or the prior, never the raw lift.** "Hero B gave +12 points, so sales will treble" is the textbook winner's curse.
   - **Replicate before public copy.** The 2026 replications show that big published lifts shrink.
4. **Write it down** in the register: raw counts, assumed effect, power, exaggeration, verdict. Report "3/82 vs 12/75; at a plausible 2-point true effect power is 7%, so the raw +12 points is likely about 5-6x too big", not "+337%".

## How we apply it to Cedwyn
- **Register:** add three columns to `the project workspace` (assumed_effect, power, exaggeration). Fill them for AB-01 (fact-led 3/11 vs 0/9 clicks: the size isn't quotable, so only the direction gets logged) and for each future readout.
- **Growth loop and Sunday report:** run `retrodesign.py` after `fpr_check.py`. A result only goes into the report with its counts and its exaggeration factor. No percentage-lift headlines from tests with fewer than ~100 conversions per arm.
- **/ebooks/ hero test (the AB-02 hero spec, 1,141 per arm for 2→4%):** at roughly 93 outside-US visits a day this takes weeks. When it ends, quote the shrunk lift and keep a 10% holdout on the old hero for 4 weeks before counting it in any sales forecast.
- **Bandit readouts** (`thompson-sampling-bandit-low-traffic-strip-headline-tests.md`): the arm the bandit favours is the "winner", so its posterior mean carries the same upward bias. Pick the arm, but don't quote its rate as the expected rate.
- **Zero-cost, no account needed.** It's a reading discipline plus one local script. Nothing gets published or sent.

## Sources
- Gelman & Carlin 2014: sites.stat.columbia.edu (doi 10.1177/1745691614551642), read in full 31 Oct 2026
- Shen & Lee (Airbnb), "Selection Bias in Online Experimentation", 29 May 2017: medium.com (read via text mirror) · KDD 2018: dl.acm.org
- Kohavi et al., "The Winner's Curse: 10 Large-Scale A/B Testing Replications" (LinkedIn, Feb 2026): linkedin.com (read)
- GuessTheTest, "The winner's curse: the BIG problem with enormous lifts in A/B testing" (Dec 2023): guessthetest.com (read)
- Helper: `tools/retrodesign.py` (stdlib; normal approximation of Gelman & Carlin's retrodesign()).
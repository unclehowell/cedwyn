# Skill: A/B testing on small lists without fooling ourselves (2026)
Written 26 Oct 2026 by the project lead's Tab agent (skills harvest). Topic: subject-line / landing-page tests at 20-50 sends a day.

## What the evidence shows
- Evan Miller, "How Not To Run an A/B Test" (evanmiller.org): significance figures assume the **sample size was fixed in advance**. "Run it until it looks significant" (peeking) makes reported significance meaningless and inflates false winners. Fix the stop size first, or use a method built for sequential looks.
- The arithmetic of small lists (computed with our helper, standard two-proportion power calc, alpha 0.05, power 0.8): detecting a click-rate jump from 5% to 10% needs **~435 recipients per arm**; 3% -> 4.5% needs **~2,518 per arm**. At 20-50 sends a day, a classic significant result on a subtle subject-line change takes weeks to months.
- Worked example (helper output): 1/10 vs 3/10 clicks looks like "3x better" but Fisher p = 0.58, P(B beats A) = 85% -> a tie. 4/200 vs 14/200: p = 0.027, P(B>A) = 99% -> real.
- Practitioner consensus in the 2026 cold-email guides above (Cassata, Unify): open rate is no longer a trustworthy metric (pixel blocking, Gmail's tracking warning), so test on **clicks and replies**, not opens.

## How-to
1. One variable per test (subject OR landing page OR first line), two arms, random alternate assignment.
2. Pick the metric before sending: click on the UTM deep link (utm_content=<variant>) or reply. Not opens.
3. Pick the stop size before sending: `python3 the project workspace samplesize <base_rate> <relative_lift>`. With small volume, test **big** differences (different story angle, different landing page), not word tweaks: big lifts need far fewer sends.
4. At the stop size: `python3 .../ab_stats.py compare nA clicksA nB clicksB`. Significant -> ship the winner and start a new test. "Leaning" (>= 90% posterior, not significant) -> keep the leader as default, keep testing. Tie -> test a bolder change.
5. Never stop a test early because it looks good; log every look in ab.csv anyway.
6. Pool learning across batches only for the same pair of variants.

## How we apply it to Cedwyn
- the project workspace: columns batch, variant, subject, landing page, sent, clicks, replies, unsubscribes, decided_at, verdict.
- First tests worth running (large differences): landing page "title chain" vs "tour stop 1"; subject leading with a dated record fact vs a question.
- On-site: the header e-book strip copy (two versions) measured by buy-clicks per page view in Cloudflare/GA4 events; same helper.
- Report test results honestly in the Sunday growth report: "tie so far, 60 sends per arm" is a valid result.

## Tools
- tools/ab_stats.py - standard library only (no install): Fisher exact p, Bayesian P(B>A), sample-size calculator.

## Sources
- evanmiller.org
- linkedin.com
- unifygtm.com
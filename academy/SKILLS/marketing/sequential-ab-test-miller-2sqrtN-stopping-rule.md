# Skill: Simple sequential A/B test (stop early only for a clear winner)
Written 1 Nov 2026 (skills harvest). Topic: A/B testing with very little traffic, where looking at results every day is unavoidable. Adds a stopping rule to `ab-testing-small-lists.md`, which states to fix the sample size in advance "or use a method built for sequential looks" but gives no such method.

## What the source shows (read in full, 1 Nov 2026)
Evan Miller, "Simple Sequential A/B Testing" (evanmiller.org, 13 Oct 2015). Miller is the author of the widely used free A/B calculators.
- **The rule.** Choose N in advance. Split visitors 50/50 at random. Count only successes: T for the treatment, C for the control. If T−C reaches 2√N, stop: the treatment wins. If T+C reaches N, stop: no winner. Failures are ignored, so you only need a click or sale counter per arm.
- **Why it's safe to peek.** If both arms convert equally, T−C is a fair coin-flip random walk. The chance it ever reaches d* within N steps is the gambler's-ruin probability. d* ≈ 1.96√N keeps false winners at about 5%; 2√N rounds up to be conservative. Miller's own simulation script checks this.
- **Exact plan table (alpha 0.05, power 0.8).** These are counts of successes, not visitors:
  - 50% lift: N = 170, d* = 26, on average 120 successes to finish if the lift is real.
  - 20% lift: N = 808, d* = 56.
  - 10% lift: N = 2,922, d* = 106.
- **When it saves time.** Under a real effect it ends up to 17% sooner than a fixed-size test. For a "blockbuster" (true effect twice the planned one) it saves 25–53%. With no effect, it is usually slower than a fixed test.
- **Where it works.** It works best at low conversion rates (10% or less). At 20% and above it loses to a fixed-size test. It is one-sided: it only detects the new version beating the old.
- **Rules of use.** Never stop before d* or N is reached, and never extend past N, or the inference breaks.

Our tool reproduces Miller's table exactly. `tools/seq_ab.py plan --lift 0.5` gives N 170 / d* 26, and `--lift 0.2` gives 808 / 56. It also gives **100% lift: N 62, d* 16**, and **200% lift: N 27, d* 11**.

## How-to
1. **One change, two arms, random 50/50.** Alternate by visitor or by send. Never this week vs next week.
2. **Pick the success event before starting.** Use a click on the buy or signup link, tagged `utm_content=a|b`, or a sale. Never opens.
3. **Plan.** Run `python3 tools/seq_ab.py plan --lift <smallest lift worth acting on>`. Write N and d* in the test log before the first visitor.
4. **Check as often as you like.** Run `python3 tools/seq_ab.py check --N .. --d .. --t T --c C`. It prints CONTINUE, TREATMENT WINS or NO WINNER.
5. **Act on the verdict.** On TREATMENT WINS, ship it. On NO WINNER, keep the control: the change wasn't worth the plan's lift. Either way, log it and move on. Don't restart the same test to get another chance.
6. **Before reading any verdict, check the split.** Run the SRM check (`sample-ratio-mismatch-srm-check-ab-tests.md`). A broken 50/50 split voids the result.
7. **Remember wins shrink.** Expect the effect to come out smaller than the test showed (`winners-curse-exaggeration-ratio-shrink-ab-lifts.md`).

## How we apply it to Cedwyn
- **Traffic is tiny.** The W43 growth row shows about 554 non-US visits a week to Cedwyn and 0 sales. A sales-based test can't finish. Only big changes on a high-frequency click are testable.
- **Example.** A test on the site-wide /ebooks/ strip or the buy button wording, success = click through to /ebooks/, planned for a 100% lift, needs at most 62 clicks and a lead of 16. At roughly 10 strip clicks a week (not measured yet; read Cloudflare/UTM first), that is up to about 6 weeks.
- **Run one test at a time, site-wide.** Run it on the shared CTA, not per webapp, so all 59 webapps feed one counter.
- **The trilingual e-book pages count as one test.** Assignment is per visitor, and language stays as a recorded segment, not a separate test.
- **Email.** With 1 confirmed Mailchimp subscriber, email tests are off until the list passes a few hundred. Until then use the fixed-size helper (`tools/ab_stats.py`) for anything else.
- **Logging.** Record each test in the project workspace: hypothesis, N, d*, start date, verdict. Public pages show no test wording. Never test prices or urgency assertions without the dark-pattern and DMCC checks (`uk-dmcc-act-urgency-reviews-price-copy.md`).

## Sources
- evanmiller.org (read in full 1 Nov 2026: rule, power equations, plan tables, conversion-rate table)
- evanmiller.org (already cited in ab-testing-small-lists.md)
- Tool: tools/seq_ab.py (own, stdlib, ~4 KB). Exact d* from the gambler's-ruin sum, power-based N search, check verdicts. Checked against Miller's table rows (170/26, 808/56).
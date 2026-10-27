# Skill: Email holdout (incrementality) tests: did the email cause the sale? And when a list is too small to ask (2026)
Written 27 Oct 2026 (skills harvest). Topic: proving a welcome or abandoned-checkout journey earns sales, rather than taking credit for buyers who would have bought anyway.

## What the evidence shows
- **Attribution isn't causation.** Mailchimp, Klaviyo and Stripe all credit a sale to an email if the buyer opened or clicked within a window. A holdout keeps a random slice from getting the email at all. The gap in purchase rate between the emailed group and the held-out group is what the email caused.
- **Klaviyo's own help centre** (Global holdout groups, read 27 Oct 2026):
  - Its account-wide holdout requires **at least 400,000 profiles**.
  - It recommends **about 5%** of marketable profiles, run for **3 months**.
  - The percentage can't be changed once set.
- **Braze** (Global Control Groups guide, read):
  - The control group should be **no smaller than 1,000 users**. The bigger the audience, the smaller the percentage can be.
  - Their worked example: 4% of users, about 40K, assigned on Save.
  - Their 2021 survey: 88% of marketing leaders rate their engagement practice good or excellent, yet 74% worry the metrics don't translate to business outcomes. That gap is the reason holdouts exist (vendor survey).
- **Customer.io docs** (Holdout tests, read): in a workflow you set the percentage to hold back. Held-out people get a "delivery" to an internal trap instead, so conversions can be compared like for like.
- **Flow-level recipe** (causalityengine.ai, a vendor guide, read; its numbers are invented for illustration):
  - Put a random-sample split right under the trigger of ONE steady flow.
  - Leave the control path empty. Hold out about 1 in 10.
  - Run past the slow buyers (weeks), then compare purchase rates.
  - Building it takes about an hour; the waiting is "the part people skip".
- **Mailchimp:** its Customer Journey builder has a random split path, per a hands-on review (ventureharbour.com 2026). Not checked against Mailchimp's own docs.
- **Our arithmetic** (ab_stats.py samplesize, alpha .05, power .8):
  - detecting a purchase rate going from 2% to 4% needs **~1,141 people per arm**;
  - 5% to 7.5% needs ~1,471 per arm.
  - With a 90/10 split, the 10% arm sets the pace, so at least ~11,000 journey entrants are needed before a 2%->4% effect can show. A 50/50 split needs ~2,300, but then half the new subscribers get no welcome, which costs more than it teaches on a small list.

## How-to
1. **Gate first.** Run a holdout only when a journey gets **at least 1,000 entrants a month** (Braze's floor for the control) AND has at least 20 purchases a month to measure. Until then, measure with JTBD questions, HDYHAU ("how did you hear about us") and first-buyer interviews (already in the index).
2. Pick ONE journey with steady entries (the welcome or an abandoned-checkout journey). Don't test one you plan to rewrite this quarter.
3. Put a random split directly under the trigger: control = 10% (or 20% if volume is modest) with NO emails, treatment = the existing emails unchanged.
4. Before starting, fix in the test log: the metric (purchase within 30 days of entry, from Stripe), the stop date or size (from `ab_stats.py samplesize`), and the split.
5. Check the split with `tools/srm_check.py <treatment> <control> --ratio 90,10` weekly. If there's an SRM, stop and fix (see sample-ratio-mismatch-srm-check-ab-tests.md).
6. At the stop size, compare purchase rates with `ab_stats.py compare`.
   - **Incremental lift** = (treatment rate − control rate) ÷ control rate.
   - **Incremental sales** = the rate gap × treatment entrants.
   - Report it beside what Mailchimp attributes to the journey. The gap between the two is the over-credit.
7. Keep the people held out out of that journey only. Transactional mail (receipts, download links) always goes to everyone.

## How we apply it to Cedwyn
- **Today: don't run one.**
  - Mailchimp had 1 member at W43 (growth-report weekly.csv, 25 Oct 2026), with 0 Stripe and 0 Gumroad sales.
  - A holdout would hold back the very welcome emails that are meant to make the first sale.
  - Logged as a gate, not a task.
- **Trigger to revisit:** the Sunday growth report shows the welcome journey taking 1,000+ entrants a month, or the abandoned-checkout recovery (stripe-checkout-abandonment-recovery.md) logging 20+ purchases a month. Then propose a 10% holdout on that one journey for the project lead's GO, with the plan from steps 2–7.
- **Until then:** fill the attribution gap cheaply with the HDYHAU field on the thank-you page, plus utm_content per email link (utm-discipline-ga4-funnel.md). Treat Mailchimp's "revenue from this journey" as an upper bound, never as proof.
- **Versioned releases:** when v0.0.3 launches, a "release email vs no release email" holdout is tempting. It's the same gate: below 1,000 notify-me subscribers, everyone gets the release email.
- **Status:** proposal only. Nothing has changed on Cedwyn or Mailchimp, and nothing was sent.

## Sources
- help.klaviyo.com (400,000 profiles, ~5%, 3 months, fixed % — read 27 Oct 2026)
- braze.com (>=1,000 control floor, 4% example, 88%/74% survey — read)
- braze.com (setup)
- docs.customer.io (holdout trap deliveries — read)
- causalityengine.ai (flow split recipe; vendor, illustrative numbers — read)
- ventureharbour.com (Mailchimp random split path; snippet, not checked)
- Tools: tools/ab_stats.py samplesize (per-arm sizes above), tools/srm_check.py
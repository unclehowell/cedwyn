# Skill: Sample Ratio Mismatch (SRM) check before reading any A/B result (2026)
Written 27 Oct 2026 (skills harvest). Pairs with ab-testing-small-lists.md (which covers fixed stop sizes and no peeking). This file covers the check that comes first: did the split actually happen as configured?

## What the evidence shows
- **Microsoft + Booking.com, KDD 2019** (Fabijan, Gupchup, Gupta, Omhover, Qin, Vermeer, Dmitriev, "Diagnosing Sample Ratio Mismatch in Online Controlled Experiments", read in full):
  - **About 6% of experiments at Microsoft had an SRM**, and an SRM "in most cases completely invalidates experiment results".
  - It doesn't take a big gap: 50.2/49.8 (821,588 vs 815,482 users) on a 50/50 split has less than a 1 in 500k chance of happening by luck. A chi-square test catches it.
  - Real causes, by stage:
    - **assignment** (a broken bucketing rule);
    - **execution** (one variant redirects and the other doesn't; one variant loads slower and loses telemetry; a variant starts late);
    - **log processing**: a bot filter removed the *most engaged* treatment users, and once that was accounted for, the result flipped to "ship";
    - **analysis**: the wrong filter or trigger.
  - Their diagnosis rules of thumb:
    - check each segment (browser, device, day);
    - if the SRM is strongest on day 1 and fades, suspect caching or a late start;
    - look at load-time and crash metrics;
    - redirect BOTH arms when one needs a redirect.
  - Some SRMs can be prevented: a broader trigger, nobody hand-editing a variant mid-test, and both arms going through the same path.
- **Lukas Vermeer's SRM Checker** (lukasvermeer.nl/srm, read). Vermeer is a co-author of the paper above. The checker needs only the expected ratios and the observed counts, so it works on the summary numbers a third-party tool shows (Mailchimp, Stripe, Cloudflare). A Chrome extension does the same check on supported platforms.
- **Evan Miller** (evanmiller.org, read): checking significance after every look gives a 26.1% false-positive rate, not 5%. The SRM check is different: run it at any time, because a broken split is never fixed by waiting.

## How-to (5 minutes per test)
1. Before the test, write down the configured split (50/50, or 90/10 for a holdout) in the test log.
2. Count units that ENTERED each arm (recipients sent, visitors bucketed, people entering the journey), not buyers or clickers.
3. Run `python3 the project workspace <A> <B> [--ratio 90,10]`.
   - Exit code 1 means an SRM.
   - The default alpha is 0.0005, a strict practitioner convention (not checked against a primary source).
   - On arms under ~200, a p under 0.01 is also worth a look.
4. If there's an SRM, do NOT read the conversion result. Diagnose it in this order:
   - bounces or suppressions that hit one arm (a Mailchimp send to a cleaned segment);
   - one arm's link redirects (a UTM link through a shortener, an old URL);
   - our signup-form bot filter or honeypot treating the variants differently;
   - a variant edited, or started late;
   - Cloudflare caching serving one variant more often.
   Fix it, then restart the test from zero; don't splice data across the fix.
5. If there's no SRM, read the result with `ab_stats.py compare` at the fixed stop size.

## Worked numbers (our helper, 27 Oct 2026)
- 821,588 vs 815,482 at 50/50: chi2 22.77, p = 1.8e-06, so SRM (matches the paper).
- 52 vs 48: p = 0.69, healthy.
- 61 vs 39 at 50/50: p = 0.028. That isn't flagged at 0.0005, but at small-list size it's worth checking the send report for bounces before trusting the test.
- 120/100/80 at 40/30/30: p = 0.33, healthy (works for 3+ arms).

## How we apply it to Cedwyn
- Add `split` and `srm_p` columns to the project workspace Every row gets an SRM check before the verdict column is filled in.
- **Mailchimp subject or landing tests:** check the recipient counts per variant in the A/B report. Mailchimp drops cleaned and bounced addresses, so if one variant's link domain is flagged, the arms drift apart.
- **On-site tests** (an /ebooks/ hero or buy-button variant, if a worker builds one): bucket with a first-party value, never by user agent, so the crawler and bot filters that already strip traffic in cf_traffic.py can't eat one arm. Count bucketed page views per arm from the edge logs. Expect bots to be uneven between arms (the KDD bot-filter story).
- **Versioned releases:** if v0.0.1-free vs v0.0.2-paid landing variants are ever tested, both arms must go through the same redirect chain (the free-version link must not add a hop the paid one doesn't have).
- **Status:** proposal only. Nothing has changed on Cedwyn. With 1 Mailchimp member (W43) there is no test to check yet. The script is ready for the first one.

## Sources
- exp-platform.com (read in full 27 Oct 2026; 6%, 1 in 500k, bot-filter flip, rules of thumb)
- dl.acm.org (KDD '19 record)
- lukasvermeer.nl (SRM checker, read)
- evanmiller.org (26.1% peeking false-positive, read)
- Tool: tools/srm_check.py (own stdlib script, tested 27 Oct 2026)
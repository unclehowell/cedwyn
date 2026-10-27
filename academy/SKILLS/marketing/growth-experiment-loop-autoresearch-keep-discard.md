# Growth experiment loop, autoresearch style (one metric, one change, keep/discard log)

Harvested 2026-10-27 for Cedwyn. Tied to the project lead's 13:37 rule (problems flywheel, Karpathy autoresearch loop) and the 3-hourly SALES FIX loop, which has run with 0 e-book sales and ~32 non-US visits/day to /ebooks/.

## What the sources actually show
- Karpathy autoresearch program.md (read in full, github.com): ONE fixed metric (val_bpb) computed by a harness the agent may NOT edit; ONE file the agent may change; a fixed budget per experiment (5 min) so runs are comparable; first run = baseline; every run logged to results.tsv (tab-separated: commit, metric, cost, status keep|discard|crash, description); keep the commit only if the metric improved, otherwise revert; "simplicity criterion": equal result with less complexity counts as a win, a tiny gain that adds ugly complexity does not. An automated discussion post shows the shape at scale: 0.9979 -> 0.9697 over 126 experiments (discussion #43, snippet).
- Experiment success rates (GrowthBook blog, Kohavi webinar write-up, Apr 2026, read; table cites the original papers): Microsoft 33% of experiments win (false-positive risk 5.9%), Bing 15%, Booking.com / Google Ads / Netflix ~10% (FPR ~22%), Airbnb search 8% (FPR 26.4%). At a 10% success rate with alpha 0.05 and 80% power about 1 in 5 "significant winners" is false.
- Booking.com's own data team (booking.ai, snippet; page Cloudflare-blocked from here): of 1,000 A/A-style tests, 100 were "significant" at 90% and 51 at 95% - noise alone produces winners.
- ICE (Sean Ellis, growthmethod.com, snippet): score each idea 1-10 on Impact, Confidence, Ease; built for running several experiments a week and deciding fast; practitioners warn it fails when applied across too broad a backlog without a single growth lever (bettermarketing.pub, snippet).

## The loop, adapted for a tiny shop
1. Fix the metric before touching anything. One north-star per loop, read by a script nobody edits mid-loop. For Cedwyn: "Buy clicks per 100 non-US /ebooks/ visitors" (needs Stripe/Gumroad + Cloudflare counts) - not sales (too rare to measure) and not opens.
2. Fix the budget per experiment: a time window (7 days) AND a minimum traffic floor (e.g. 300 visitors). Below the floor the experiment is INCONCLUSIVE, never keep.
3. Baseline first: one full window with no change, logged as row 1.
4. One change per experiment, on one surface (one page, one email, one post type). Record the commit sha / page version.
5. Log every run to results.tsv: date, sha, metric, visitors, status (keep|discard|inconclusive|crash), one-line description, hypothesis.
6. Decide by rule, not by mood: keep only if the metric beats baseline by a pre-set margin (e.g. +30% relative, because small samples can only see big effects - see ab-testing-small-lists.md); otherwise revert. Expect ~1 in 10 to win; a run of discards is normal, not a reason to stop.
7. Simplicity criterion: a change that removes things (fewer links in the fold, shorter page) and holds the metric is a keep.
8. Next hypothesis from the log, prioritised by ICE, but only ideas that act on the one lever of this loop (traffic loop and conversion loop are separate loops with separate metrics).
9. Re-test any "winner" that drove a big decision (FPR ~1 in 5 at our likely success rate).

## How we apply it to Cedwyn
- Split SALES FIX into two loops with their own results.tsv under the project workspace: (a) TRAFFIC loop, metric = non-US HTML 200 visits/day to /ebooks/ + evidence pages (cf_traffic.py), surfaces = posts, listings, talks; (b) CONVERSION loop, metric = Buy clicks per 100 /ebooks/ visitors, surface = /ebooks/ poster grid only (shipped 13:44 27 Oct; that ship is the new baseline row - do not also change the price this week).
- Problems flywheel: use the same row format (hypothesis, action, result, keep/discard) so cycles are comparable and the 6-hour UNSOLVABLE call rests on a log, not a feeling.
- Never let the loop edit its own measurement script (cf_traffic.py, weekly_report.py) in the same run that changes a page.
- Inconclusive is the honest default at 32 visits/day: the traffic loop has priority until /ebooks/ clears ~300 visitors per 7 days.

## Sources
- github.com (read 27 Oct 2026)
- github.com (snippet)
- growthbook.io (read; success-rate table)
- booking.ai (snippet only, blocked)
- growthmethod.com (snippet)
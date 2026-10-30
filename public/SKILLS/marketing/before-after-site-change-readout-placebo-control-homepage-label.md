# Reading a before/after site change with no A/B split (the homepage label test)

**Use this when:** you changed one thing on a page (a label, a button, a position) for every visitor and want to know if it worked, by comparing days before with days after. This is not a randomised A/B test, so week-to-week swings can look like an effect. See ab-testing-small-lists.md and sample-ratio-mismatch-srm-check-ab-tests.md for real splits.

## What the sources show
- **Kohavi, Microsoft Experimentation Platform tutorial (2012, PDF read 30 Oct):** a valid 50/50 experiment showed a true effect of **+1.93% in week 1 and +2.09% in week 2**. Comparing treatment week 2 with control week 1 gave **+11.38%**, about five times the real effect. In Kohavi's words, the difference "was due to uncontrolled differences between weeks 1 and 2". Before/after reads overstate or invent effects.
- **Brodersen et al., Google, Annals of Applied Statistics 2015 (CausalImpact; arXiv abstract and package docs read):**
  - Without a randomised experiment, estimate the counterfactual from **control series that the change did not affect**.
  - The docs state the assumptions plainly: the controls must be unaffected, and the relationship between controls and target must stay stable from the pre-period to the post-period. Otherwise you "might falsely conclude that there was an effect even though in reality there wasn't".
- **Placebo check** (the standard synthetic-control habit; our tool applies it): pretend the change happened on each earlier day and measure the "effect" that appears anyway. That spread is your noise band. A real effect has to sit outside it.

## How to do it
1. **Before the change:** write down the metric (homepage→shop click rate), the window and the control. Change nothing else on the page during the window.
2. **Use whole weeks.** Weekday and weekend traffic differ, so 9 days before against 9 days after compares different day mixes. Use **14 days** (or 7 if traffic is high). prepost.py rounds the window down to whole weeks unless you pass `--exact`.
3. **Pick a control the change cannot touch.** For example, shop visits that did not come from the homepage, or traffic to a section the change doesn't link to. Compare the ratio target/control before and after (difference-in-differences on the log scale). This removes site-wide swings such as a press mention, a bot burst or a holiday.
4. **Check the mix first.** If homepage visits moved more than 30% between windows, find out why (bots, a social post, a new referrer) before reading anything.
5. **Read with three gates:**
   - Fisher p < 0.05;
   - the effect lies outside the placebo band;
   - the control-adjusted effect points the same way.
   All three pass: keep it and re-check one more window. Otherwise the verdict is **no readable effect**.
6. **No readable effect** does not mean the label failed. Keep whichever label is clearer, then run the next variant for a full window.

**Tool:** `python3 tools/prepost.py daily.csv 2026-10-30 --days 14`, with CSV columns `date,visits,clicks[,control]`. It needs about 2× the window plus 5 days of history before the change to build the placebo band.
- Box test on synthetic data shaped like ours (≈240 visits a day, 7.5% base rate): a 7-day window gave a placebo band of **-32% to +34%**.
- At our traffic, only very large label effects (more than about a third) are readable in one week. That is why the window should be 14 days.

## How we apply it to Cedwyn
- The homepage e-books link label changed around **30 Oct 04:10Z** ("E-books · first editions free →", homepage link 0, `utm_source=home`). The plan in homepage-to-shop-click-through-banner-blindness-scent.md said to compare 9 days before with 9 after.
- **Amend it:**
  - Read on **13 Nov** (14 whole days), not 8 Nov.
  - Build daily rows from cf_traffic.py: visits = non-US HTML 200 on `/`; clicks = `/ebooks/` hits carrying `utm_source=home`, if the dataset exposes the query string (not checked; otherwise use a distinct path param); control = other `/ebooks/` hits.
- Pull pre-period history back to about 1 Oct. The placebo band needs it, and Cloudflare's adaptive dataset may not retain that far (not checked). If it doesn't, rely on the control and Fisher, and say the band is missing.
- Don't start variant B, and don't move the button again, until the 14-day read is logged in the project workspace Other workers editing the homepage break the window, so log any homepage commit dates beside the read.

## Sources
- exp-platform.com (read: week-1/week-2 +1.93%/+2.09% vs +11.38%)
- arxiv.org (Brodersen et al. 2015, abstract read)
- google.github.io (read: assumptions section)
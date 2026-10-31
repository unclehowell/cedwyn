# Process behaviour (XmR) charts: stop explaining week-on-week wobble, act only on real signals

**Use when:** a weekly or daily number (visits, followers, signups, sales, views) goes up or down and someone wants to know why, or wants to credit or blame the last change. Most of those swings are routine. This skill sorts noise from signal in five minutes with a pencil-and-paper method that has been in use for about 90 years.

## Why it matters
- Week-on-week % change is the worst lens for small numbers. In the worked example below, 35 to 61 is **+74% week-on-week and still routine variation**: nothing happened.
- **Regression to the mean:** the week after an unusually bad week is usually better, whatever you did. If you launch a fix *because* a week was bad, the bounce looks like the fix working. An XmR chart shows whether the "bad" week was even outside normal range to begin with.
- Commoncog's Cedric Chin, after about 18 months of practice: when people chase routine variation they investigate, find nothing, make up an explanation, and eventually stop using data at all. Joiner's Rule: under pressure to hit a target, people improve the system, distort the system, or distort the data.
- Mark Graban (*Measures of Success*), from hospital management practice: red/green "bowling charts" and tables of numbers hide trends, and reacting to noise is "not a good use of time". Process behaviour charts give "visual statistical guidelines to filter out noise".
- Real case (Commoncog, Introducing Xmrit): average session duration **shifted permanently** in the week the Case Library launched. The chart flagged it; they treated it as a theory ("the library is sticky"), then tested it by making the library more prominent. That is the loop: signal, theory, deliberate test.

## The method (Wheeler's XmR chart)
1. Take 10-20 points of one metric in time order (weekly is best for us; daily has day-of-week cycles, so compare like with like or use weekly totals). Six points gives soft limits; 20 is solid.
2. **Centre line** = the mean.
3. **Moving range (mR)** = the absolute difference between each point and the one before. Average them (mR-bar).
4. **Natural process limits** = mean ± **2.66 × mR-bar** (floor the lower one at 0 for counts).
5. **Upper range limit** for the mR chart = **3.268 × mR-bar** (flags a sudden jump between two points).
6. Read with Wheeler's three rules only:
   - **Rule 1 (strong):** a point outside the limits, or a moving range above its limit.
   - **Rule 2 (moderate):** three of four consecutive points closer to a limit than to the centre line, same side.
   - **Rule 3 (subtle):** eight consecutive points on one side of the centre line.
7. No rule fires: **routine variation.** Do not explain it, do not credit or blame anyone. If the whole range is unacceptable, the process itself has to change (new channel, new offer), not this week's tweak.
8. A rule fires: **something changed.** Find out what. If it lines up with something you did on purpose, keep it and try to repeat it; if not, investigate the unknown cause.
9. **Judging a change:** freeze the limits on the points *before* the change (baseline), then plot the points after against those frozen limits. Only a rule firing after the change counts as a result. This is cheaper than an A/B test and works when traffic is too small to split.

Commoncog puts the false-alarm rate at roughly 3% for most real-world data, which is fine for business decisions. The 2.66 constant comes from the moving range, so it does not require the data to be normally distributed.

## Free tools
- `tools/xmr.py` (stdlib, written this run, nothing installed): `python3 tools/xmr.py --csv file.csv --col cedwyn_nonus` or `python3 tools/xmr.py --baseline 10 v1 v2 ...`. It prints the limits, the moving ranges, the rule hits per point and a SIGNALS line.
- Xmrit (Commoncog, free, runs in the browser, open-source TypeScript + index.html): paste a column and drag a divider to split before/after limits. Use it for a visual check; no account needed.

## Worked example (synthetic, from the tool's self-test)
Baseline of 10 weekly values (40, 52, 35, 61, 44, 38, 57, 49, 42, 55): centre 47.3, average mR 13.9, limits 10.4 to 84.2, upper range limit 45.4. Then 48, 51 = routine. Then 90, 85, 88 = Rule 1 three times: a real shift. A 35 to 61 jump inside the baseline (+74%) fired nothing.

## How we apply it to Cedwyn
- **Weekly growth report:** for each headline number (Cedwyn non-US HTML visits, /ebooks/ visits, Mailchimp members, followers per channel, best-post views), report *routine* or *signal (rule N)*, not "+x% vs last week". A number with fewer than 6 weekly points is too young to judge, so say so. Pull daily non-US visits from the existing Cloudflare script and chart them as weekly totals.
- **Sales-fix and on-page changes:** log the date of each shipped change (buy-button fix, preview-length labels, shop strips). Freeze limits on the weeks before it and judge the weeks after with `--baseline`. Never mark a fix as having worked off one good week after one bad week; that is regression to the mean.
- **Zero-sales diagnosis:** at near-zero sales, use XmR on the upstream steps that have counts (shop visits, free-chapter downloads, checkout opens), not on sales.
- **Social:** the posting flywheels change many things at once. Use Rule 3 (eight weeks on one side) to spot slow drift in reach rather than reacting to single posts.
- **Pairs with:** the existing before/after readout (placebo control) skill and the A/B skills (Twyman's law, winner's curse). Use XmR when traffic is too small to split. Use those when you can randomise.

## Pitfalls
- Don't mix seasons or a one-off spike (press mention, bot burst) into the baseline: drop it and note why, or the limits come out too wide.
- Bot traffic is not variation: filter it first (we already use non-US HTML 200s as a proxy for visitors).
- Recompute limits only after a confirmed, lasting shift, never every week.
- Don't add rules beyond Wheeler's three. More rules mean more false alarms.

## Sources
- Commoncog, "Becoming Data Driven, From First Principles" (rules, ~3% false positive, Joiner's Rule, Colin Bryar on input metrics): commoncog.com
- Commoncog, "Process Behaviour Charts: More Than You Need To Know": commoncog.com
- Commoncog, "Introducing Xmrit" (session-duration shift at Case Library launch): commoncog.com
- Xmrit open source: xmrit.com · what an XmR chart is: xmrit.com
- Mark Graban interview on *Measures of Success*: kbjanderson.com
- Deming Alliance, "Process Behaviour Charts: An Introduction" (2.66 × average mR): demingalliance.org
- Donald J. Wheeler, *Understanding Variation: The Key to Managing Chaos* (book; the source of the three rules and the name "process behaviour chart").
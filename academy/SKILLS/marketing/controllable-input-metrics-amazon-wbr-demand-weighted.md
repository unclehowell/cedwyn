# Controllable input metrics (Amazon WBR): stop staring at sales, drive the few levers that move them

**Use when:** the weekly growth report shows flat sales/followers and nobody can say what to *do* differently next week. Our report today tracks only outputs (visits, followers, signups, sales). This skill adds the inputs we control, and a way to find out which ones matter.

## The idea (primary sources)
- Amazon's Weekly Business Review (WBR) splits every metric into two buckets. **Controllable input metrics** are things operators move directly; at Amazon that means selection, price and convenience. **Output metrics** (orders, revenue, profit) matter but can't be moved directly in a lasting way. Outputs are reported in the WBR, but not argued over: "the way to hit your output metric targets is to seek out controllable input metrics for each of your output metrics and drive those" (Commoncog, written with Colin Bryar).
- **Scale and discipline:** every Wednesday Amazon's leadership goes through 400–500 metrics in 60 minutes (90 in the holiday season), and has done so every week since the early 2000s. The meeting looks only at exceptions. An owner whose graph shows only routine variation states "nothing to see here", everyone looks for about a second, and the meeting moves on. No metric is skipped, because the one-second glance builds a feel for what normal looks like.
- **The 6-12 graph:** each chart shows the trailing 6 weeks (weekly) next to the trailing 12 months (monthly) on one axis, with the numbers printed on the line. Six weeks rather than four, because a cut at a month boundary distorts.
- **One process's output is another process's input.** These causal links show up slowly, week after week, as you probe how metrics relate.

## The worked failure: Amazon's selection metric (Working Backwards, Bryar & Carr)
When Amazon expanded beyond books, it measured selection as the **number of new detail pages**. The category teams added "tens, hundreds, even thousands" of items, often through distributors, and bought stock that nobody wanted. Sales did not rise. Inventory holding cost did, and warehouses filled with stock to be "marked down and written off". Bryar: "it wasn't the category manager's fault. They did what we asked them to do!"

Over several WBRs the metric went through four versions:
1. number of detail pages →
2. number of detail page **views** ("you don't get credit for a new detail page if customers don't view it") →
3. % of detail page views where the item was **in stock** →
4. % of detail page views in stock **and ready for two-day shipping** ("Fast Track In Stock", later "demand-weighted in stock").

Bryar explains why it is **demand-weighted, not sales-weighted**: if you cause a drop in sales yourself, a sales-weighted metric shrinks the importance of the very item you broke. Weighting by what customers are *looking at* stops that. Bezos thought the metric too narrow; Jeff Wilke argued it would bring broad improvement. They kept it, and it did.

**Lesson:** the first input metric you pick will probably reward the wrong behaviour (Goodhart's law). Each week, ask: "If we push this metric as it is defined now, will the output move?" Then refine the definition.

## How to do it (small business, one person + agents)
1. **List the outputs (5 at most).** Leave them in the report, but don't set work against them.
2. **For each output, name 1–3 inputs we control this week.** Each one needs an owner (a flywheel or a person), a unit, and an exact definition. Write the definition down; changing it is a logged event.
3. **Make inputs demand-weighted where you can.** Count against what people actually look at (page views, impressions), not against raw output counts like "pages published".
4. **Review weekly in a fixed order.** Each input gets one line: "routine" or "exception + why". Don't explain week-to-week wobble. Use the existing XmR skill and `tools/xmr.py` to tell routine variation from a real signal; this skill decides *what* to chart, not how to read it.
5. **Test the link, don't assume it.** Push one input deliberately for 3–4 weeks, then see whether its output leaves its normal range. "Insight is derived from action, not analysis: you only learn to improve your business when you test control factors, not when you discover them" (Commoncog). Commoncog's spoiler: there are usually not many real control factors, "but the few that you discover truly work".
6. **Retire or redefine** any input that moved hard while its output stayed inside its normal range for more than 6 weeks.

## How we apply it to Cedwyn
Outputs, kept as they are in growth-report/weekly.csv: non-US visits, Mailchimp confirmed, e-book sales (Stripe + Gumroad), followers.

Candidate inputs (each owned by an existing flywheel):
| Output | Controllable input (definition) | Owner |
|---|---|---|
| Sales | **Demand-weighted buy-path coverage** = % of last week's page views that landed on a page with a working /ebooks/ link and a signup form (our "Fast Track In Stock") | onpage flywheel |
| Signups | % of page views on pages with a working signup form, plus the count of lead magnets live | onpage flywheel |
| Visits | Posts published per channel per week (IG, FB, YouTube Shorts) | auto-social + Shorts flywheels |
| Visits (search) | Pages in Search Console's 5–20 striking distance that got an on-page edit this week | visibility check |
| Sales | Distinct e-book pages viewed / total visits (are visitors reaching the shop at all?) | growth report |

- **Start with buy-path coverage.** A per-page count ("pages with a buy button") repeats Amazon's detail-page mistake: 600 thin pages with buttons, nobody viewing them. Weight by Cloudflare page views per path instead. `tools/demand_weighted_coverage.py` takes a CSV of `path,views,has_buy,has_signup` and prints both percentages plus the top uncovered pages by views. Fixing those pages first gives the biggest gain for the least work.
- **Add an input block to the Sunday growth report**, one line per input: value, routine/exception, owner. Leave the outputs below it, unargued.
- **Log every definition change** with its date in the report notes. Comparing across a change needs a fresh XmR baseline.
- **Expect version 1 to be wrong.** After 6 weeks, keep only the inputs whose push showed up in an output.

## Sources (read 31 Oct 2026)
- Commoncog, "The Amazon Weekly Business Review" (with Colin Bryar; 400–500 metrics / 60 min, 6-12 graph, inputs vs outputs, "nothing to see here"): commoncog.com
- Commoncog Case Library, "Amazon's Category Expansion – Searching for the Right Incentives" (Working Backwards excerpt + Bryar interview, the four steps to demand-weighted in stock): commoncog.com
- Commoncog, "Colin Bryar on the practice of Amazon's Weekly Business Review" (podcast chapters: input vs output at 27:43, stories at 51:02): commoncog.com
- Commoncog, "Becoming Data Driven, From First Principles" (finding control factors; "insight is derived from action"): commoncog.com
- Bryar & Carr, *Working Backwards* (2021), ch. 6 "Metrics: Manage Your Inputs, Not Your Outputs"; summary at workingbackwards.com
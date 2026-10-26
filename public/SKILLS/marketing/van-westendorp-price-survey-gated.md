# Van Westendorp price sensitivity survey (4 questions) - gated pricing research for e-books and tours

Date: 2026-10-26. Topic: e-book / tour voucher pricing research without asking "what would you pay?". Complements ebook-pricing-bundles-direct.md, pay-what-you-want-floor-suggested-price.md and local-currency-pricing (which cover price structures, not measuring willingness to pay).

## Evidence
- OpinionX guide (21 Oct 2026, read): OpenAI ran a 4-question Van Westendorp Google Form in its Discord weeks before launching ChatGPT Plus in early 2023; the answers pointed at USD 20/month and Plus shipped at USD 20 (story told by OpenAI's Nick Turley on Lenny's Newsletter - that interview not checked by us).
- Same guide: direct "what would you pay" answers overstate real payment by about 20% for everyday consumer products (J. Academy of Marketing Science 2020) and about a third across 28 studies (cited by OpinionX; not checked).
- Same guide: plan on at least 100 completed responses, and 100 per segment if you compare groups.

## The four questions (standard wording - keep it)
1. At what price would this be so cheap you'd question its quality? (Too cheap)
2. At what price would this be a bargain - a great buy for the money? (Cheap)
3. At what price does this start to feel expensive, but you'd still consider it? (Expensive)
4. At what price would this be so expensive you wouldn't consider it? (Too expensive)
Optional Newton-Miller-Smith add-on: "How likely are you to buy at <your cheap answer>?" and "...at <your expensive answer>?" on a 5-point scale - turns the ranges into a demand/revenue estimate.

## Reading the result (four line intersections)
- Optimal Price Point = Too cheap x Too expensive (fewest people rule it out).
- Floor (Point of Marginal Cheapness) = Too cheap x Expensive.
- Ceiling (Point of Marginal Expensiveness) = Cheap x Too expensive.
- Indifference Price Point = Cheap x Expensive.
Price inside floor-ceiling; pick near OPP unless the NMS revenue curve points elsewhere.

## How to run it with free tools
1. Google Forms (free): show a one-paragraph product description + cover image first, then the 4 questions as number fields (GBP), in that order; add NMS questions if wanted; one segment question (UK / Argentina / elsewhere; bought Welsh history before yes/no).
2. Clean: drop rows where answers are not ascending (Q1 < Q2 < Q3 < Q4).
3. Analyse in a sheet or 20 lines of pandas: for each price from 0 to max, % of respondents at or below each answer (cumulative; invert Q1 and Q2), find the crossings.
4. Treat as a range finder, not a forecast: stated-price surveys skew high (see 20-33% gap above).

## Gate (do not run until)
- At least 100 completed responses are realistically reachable (list + followers + one partner newsletter); below that the curves are noise. Under 100: run a simple live price test (stripe-payment-links-wallets-ab-gate.md) or pay-what-you-want with a floor instead.

## How we apply it to Cedwyn (PROPOSAL - pricing is decided by the owner)
- Current state: 8 e-books at GBP 9.99, bundle GBP 31.99, tour vouchers GBP 25/45/90, 0 sales; audience far below 100 - so this is HELD until the list/followers can deliver 100 answers.
- When gated in: one form covering (a) a single e-book, (b) the 8-title bundle, (c) a 2-hour guided tour; segment by UK vs Argentina (separate GBP/ARS pricing questions for Spanish readers); offer no incentive that is paid.
- Output: the four points per product into the project workspace<date>.md, plus a recommendation queued to the project workspace Never change a live price from this alone.
- Ethics: describe products accurately in the form; no fake scarcity; collect no names or emails in the form unless the respondent opts in separately.

## Sources
- opinionx.co (read)
- sawtoothsoftware.com (snippet only, not checked)
# Zero-sales diagnosis: is it traffic or conversion? (binomial odds + first-zero step)

Date: 2026-10-27 · For: Cedwyn e-books, 0 sales so far (SALES FIX loop) · Skill type: analytics / first-sale conversion

## Why
"0 sales" means two very different things. With too few visitors, 0 is the expected result and page changes are guesswork; with enough visitors, 0 is evidence the page, offer or checkout is broken. Decide which before changing anything.
- Benchmark (read 27 Oct): Littledata, 433 Shopify stores, Oct 2026: median conversion 1.4% of sessions, mean 1.9%, middle 60% between 0.5% and 2.7%, top 20% above 2.7%, top 10% above 3.6%, below 0.5% = bottom 20%. Physical-goods stores, so use as a rough prior for a digital product, not a target.
- Rule of three (statistics; Hanley & Lippman-Hand, JAMA 1983, via Wikipedia, read): if an event has not happened in n independent trials, the 95% upper bound on its rate is about 3/n. 0 sales in 300 visitors -> the true rate could still be up to 1%.
- Chance of 0 sales by luck = (1 - p)^n. At p = 1.4%: 100 visitors -> 24%; 213 visitors -> 5%; 500 -> 0.09%. So ~210+ real (non-bot) visitors to the sales page is the floor before "0" means "broken"; at a weaker 0.5% rate it is ~600.
- Practitioner reading of the same point: Barry's launches show sales arrive in spikes after sends to people who asked (see launch-week-email-sequence-deadline-last-day.md); cold traffic converts far lower than a warm list, so count the two separately.

## How to do it
1. Count real visitors to the sales/title pages for the window (Cloudflare non-bot HTML 200s, non-US filter as in growth-report/cf_traffic.py), not site-wide hits.
2. Count each funnel step: site visits -> /ebooks/ (or title) views -> buy-button clicks -> checkout opened (Stripe/Gumroad session created) -> paid.
3. Run: python3 tools/zero_sales_odds.py --steps "visits=N,ebooks_page=N,buy_click=N,checkout=N,paid=0"
4. Read the verdict:
   - TRAFFIC (0 is still plausible): stop editing the page. Spend the next cycle only on getting qualified visitors to the title page (warm list send, societies, the movie/quote-card posts with a direct title link). Re-run when the floor is reached.
   - CONVERSION: go to the FIRST step that hits zero or collapses:
     - views but almost no buy clicks -> offer/page (price, what's inside, sample, first screen: hero-first-screen-value-proposition-10-second-test.md, preview-pdf-sales-tool-paid-titles.md).
     - buy clicks but no checkout sessions -> the button/link is broken or leaves the site oddly: click it yourself on a phone at 390 px.
     - checkouts opened but none paid -> checkout friction or trust (stripe-checkout-abandonment-recovery.md, payment-trust-cues-checkout-uk-legal.md, stripe-payment-links-wallets-ab-gate.md). With 4 opened and 0 paid the bound is still wide (~53%), so also do 5 user tests (small-sample-usability-tests-buy-path-5-users.md).
5. Log the run (date, counts, verdict) in the SALES FIX log so the next cycle starts from numbers, not opinion.
6. A test purchase by the owner (refunded) is the cheapest check that the paid step works at all.

## How we apply it to Cedwyn
- The SALES FIX worker runs this first every 3 h: counts from Cloudflare (title + /ebooks/ pages), Stripe Checkout sessions and Gumroad views/sales for the same window.
- If TRAFFIC: the fix for that cycle is distribution, not page edits (keeps the growth-experiment loop honest: below its traffic floor everything is INCONCLUSIVE anyway).
- If CONVERSION: fix the first-zero step only, one change per cycle, and record it.
- Any one-line finding ("212 title-page visitors, 0 buy clicks -> offer problem") goes to the SALES FIX report and to the project workspace if it needs the project lead (e.g. a live test purchase).
- Tool: tools/zero_sales_odds.py (own, stdlib, no install).

## Sources
- littledata.io
- en.wikipedia.org)
- nathanbarry.com
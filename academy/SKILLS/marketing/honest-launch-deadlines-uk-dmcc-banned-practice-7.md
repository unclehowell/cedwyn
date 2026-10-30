# Honest launch deadlines under UK law (DMCC Act 2024, Sch 20 banned practice 7)
Harvested 2026-10-30 01:27Z. Topic: launch-price windows, countdown timers and "last chance" emails that are legal in the UK and still work. ('deadline funnel' 0, 'scarcity' 1 in INDEX before.)

## What the law and the regulator actually say (read)
- DMCC Act 2024 unfair-commercial-practices regime in force 6 Apr 2025; CMA can now fine directly (up to 10% global turnover). Schedule 20 banned practice 7 (CMA207 guidance, read): "Falsely stating that a product will only be available for a limited time, or ... on particular terms for a limited time, in order to elicit an immediate decision". CMA207's own example: a countdown that runs out, the offer does not end and the clock restarts = banned in all circumstances. Same page: if the statement that the offer ends is TRUE "(and is not otherwise misleading, for example, because a substantially similar offer appears within a short period) then this is unlikely to be problematic."
- CMA open letter "Urgency and price reduction assertions" (29 Mar 2023, read): urgency assertions = "any countdown timers, scarcity or 'act fast' messages"; price-reduction assertions = any discount referring to a higher comparison price. Both must be true and transparent.
- Enforcement record: Emma Sleep admitted breaking consumer law with misleading countdown timers, false "high demand" and "discount" assertions; court-confirmed settlement with binding undertakings, 22 May 2026 (CMA case page, read). A later High Court judgment (30 Jul 2026) led the CMA to temporarily withdraw its online mattress-sales guidance (case page; judgment not read). Wowcher investigated 2023 for "running out" assertions and timers.
- CMA year-one blog (17 Apr 2026, read): 14 investigations opened, 157 advisory/warning letters, £4.7M fines, £760K refunds (AA drip pricing, £4.2M fine).

## What practitioners measured (read)
- Nathan Barry, "Should you launch more than once?" (nathanbarry.com): course open for 24-25 h then CLOSED: $35,732 (22 x $119 + 172 x $199). Contrast: App Design Handbook iOS 7 edition left on sale after launch: another ~$15,000 in the month after the first 24 h. His lesson: a hard close concentrates sales but cuts the long tail; he estimated two launches > one, "maybe only for a 50% increase in revenue (or less)". Re-launching a new edition revived a book selling 10 copies/month.
- Same author's launch emails: a "very short email that basically just had a link to the sales page" to 8,913 recipients: 53.1% open, 16.1% click, 1.1% unsubscribe.
- Takeaway: the deadline that works is a REAL event (a price that really changes, a version that really closes), announced in advance, with the long tail kept afterwards at the new price.

## The legal, effective pattern (do this)
1. Tie every deadline to a real, logged change: "Launch price £3.99 until 23:59 Sun 8 Nov, then £4.99". Change it on time, everywhere (Stripe link, /ebooks/, Gumroad).
2. No evergreen/per-visitor countdowns that reset, no restarting clocks, no "only N left" on a digital file, no "high demand" lines, no fake "was" price. A comparison price is only allowed if it was a genuine price actually charged for a meaningful period first.
3. Don't re-run a "substantially similar" offer straight after the deadline (CMA207). Leave a clear gap (e.g. 60+ days) and log dates.
4. Email shape: announce (D-7), reminder (D-1), "closes tonight" (D-0, short, one link). Same one link in all three; UTM per email.
5. Keep the product on sale after the deadline at the standard price (long tail).
6. Keep a dated record (date set, date changed, screenshot) in case anyone asks.

## How we apply it to Cedwyn
- Current prices are fixed by the project lead: v0.0.1 free, v0.0.2 £4.99, bundle £19.96, no 'was'/saving assertions. So: no discount deadline without the project lead's GO (a price test = proposal in the sales-fix report, not a change).
- The honest deadline we CAN use without touching prices: a real event date — e.g. "v0.0.3 chapter published on <date>; buyers of v0.0.2 get it free until then" only if that is actually the policy, or "the free v0.0.1 sample stays free; the Calan Gaeaf / St David's Day reading list email goes out on <date>". Event-based urgency, not price-based.
- Never put a JS countdown on /ebooks/ or in Mailchimp unless the end date is real and the change is scheduled (a one-time schedule that flips the price/link at the stated minute, plus a check).
- Sales-fix workers: before any "last chance" copy, check this file; log the date pair in the project workspace

## Sources
- gov.uk (banned practice 7 + example)
- gov.uk (CMA open letter, 29 Mar 2023)
- gov.uk (22 May 2026 settlement; 30 Jul 2026 judgment noted)
- competitionandmarkets.blog.gov.uk
- nathanbarry.com (24 h close $35,732; ~$15K long tail on the left-open book)
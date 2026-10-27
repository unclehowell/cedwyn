# A money-back guarantee line on the e-book sales page (risk reversal)

Date: 2026-10-26 (skills harvest 23:37). Status for Cedwyn: **PROPOSAL held for the project lead.** A guarantee sets refund terms, which is a pricing/terms decision, so it goes to the project workspace It is not an automatic onpage fix.

## What the evidence shows
All figures below are agency case studies with unnamed clients and no sample sizes, so treat them as direction, not proof (**not independently checked**).
- **Conversion Fanatics, Justin Christianson, 11 Aug 2014 (read):**
  - (a) Adding a "simple 30 day guarantee" to a sales page that had none: **conversions +26%**.
  - (b) Lengthening a 90-day guarantee to 1 year on a product line with several thousand customers a month: conversion rate **doubled**, while refunds "only went up 3%". The baseline refund rate was ~5%, and most refunds still came inside the original 90 days.
- **Blend Commerce A/B test (read, undated):** showing the brand's existing "No Reaction Money Back Guarantee" as a badge under Add to Cart over two weeks gave:
  - Desktop: **conversion +30.33%, revenue +20.03%, add-to-cart +2%**.
  - Mobile: it **underperformed**, so it shipped on desktop only.
  - Lesson: placement and device matter, and the same line can hurt on a small screen.
- **Gumroad Help, "Set a custom refund policy"** (search snippet; the page renders by script and did not open, **not checked**): sellers can show a product's refund policy before purchase in the product settings.
- **UK law context (from our own skill uk-digital-checkout-reg37-consent-vat, read today):**
  - Reg 37 CCR 2013 ends the 14-day right to cancel a download only with express consent plus acknowledgement at checkout.
  - The Consumer Rights Act 2015 still covers faulty files.
  - A voluntary guarantee sits **on top of** both and must then be honoured exactly as worded: misleading or unhonoured guarantee terms are an unfair commercial practice under the DMCC Act regime in force from 6 Apr 2025 (CMS / Baker Botts summaries seen as snippets; CMA guidance itself **not re-read today**).

## Why it fits a £9.99 history e-book
- The buyer's risk is "is this worth reading?" not "will it work?". A short, human guarantee answers that. Our real exposure per refund is £9.99 minus fees.
- Digital refund abuse exists, but at this price and audience (local-history readers, family historians) the cost of a few refunds is far below the cost of zero sales (0 sales to date per the programme office).

## How to do it (steps)
1. **Pick terms you will keep:** e.g. "Read it. If it isn't for you, email within 30 days and we refund in full, no questions." Keep it to one window and one channel (the shop's support address), with no conditions you would not enforce.
2. **Make it consistent with the reg 37 checkbox.** The checkbox waives the statutory 14-day right; the guarantee then voluntarily gives 30 days. Put both in the terms page and the receipt email so the two never read as contradicting.
3. **Placement:** one short line plus a small icon directly **under the buy button** on /ebooks/ and each book page, and one sentence in the FAQ. On mobile, use plain text under the button, not a button-shaped badge (the Blend lesson).
4. **Wording rules:** no "risk-free!!!" hype and no fake countdowns (DMCC). Use the exact same text everywhere it appears.
5. **Operate it:** a Stripe refund from the dashboard or API on request within 1 working day. Log date, title and reason (optional question) in the sales log. Do not revoke goodwill by arguing.
6. **Measure:** this is a small-list, low-traffic site, so follow ab-testing-small-lists. Run before/after with a fixed window: sales page views, buy-button clicks, purchases, refunds. Keep the guarantee if purchases rise and refunds stay under ~10% of orders. That threshold is our judgement, not a benchmark.

## How we apply it to Cedwyn
- **Queue the proposal** (one item): "Add a 30-day no-questions money-back line under the buy buttons on /ebooks/ and book pages, plus terms/FAQ/receipt text; Stripe refunds handled within 1 working day; review after 30 days or 20 orders." the project lead decides the window (14 or 30 days) and the wording.
- **Prepare in the meantime (no publish):** draft the line, the FAQ sentence and the terms clause in the project workspace as a patch, in the editorial voice (citations-only rules do not apply to a terms line, but the banned public words still do).
- **Bundle (£31.99):** the same guarantee, with a refund of the whole bundle only (no partial refunds), to keep it simple.
- **Do not** add it to the landing page `/` (two tiles only).

## Sources
- conversionfanatics.com (read 26 Oct 2026; published 11 Aug 2014)
- blendcommerce.com (read 26 Oct 2026)
- gumroad.com (snippet only, not checked)
- Our skill uk-digital-checkout-reg37-consent-vat.md (reg 37 / CRA 2015 summary)
- cms.law (snippet only)
- Live fetch of /ebooks/ 26 Oct 2026 23:40: no refund or guarantee wording found
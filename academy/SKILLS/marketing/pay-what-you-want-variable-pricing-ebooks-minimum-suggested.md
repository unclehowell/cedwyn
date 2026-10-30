# Pay-what-you-want / variable pricing for e-books (minimum + suggested, optional good-cause frame)

Harvested 2026-10-30 03:43Z. Status: a PROPOSAL. A price change is the project lead's decision, so it goes in QUEUE-after-framing.md and nothing goes live from this file.

## Evidence (with sources)
- **Gneezy et al., Science 2010** (PubMed abstract, read; numbers from the ResearchGate summary snippet): field experiment, N = 113,047 buyers of souvenir photos. Plain PWYW raised purchase rates but buyers paid on average **$0.92**. PWYW where half went to charity raised the average to **$5.33** (5.8x), and that was the most profitable arm. Lesson: open PWYW with no floor and no frame earns little; a frame changes what people pay.
- **Leanpub variable pricing** (help centre, read; written by Leanpub support, updated 2 Nov 2025): authors set a **minimum** and a **suggested** price, and the slider opens at the suggested one. Leanpub shows "Author earns $X" beside the slider and calls that "the main reason people pay more than the suggested price" (readers round $23.20 up to $25.00). They give no percentages, so treat it as practitioner testimony, not data. Their example pairs: min $15/suggested $20, min $25/suggested $30.
- **Stripe Checkout pay-what-you-want** (docs, read): a Price with `custom_unit_amount` (optional `minimum`, `maximum`, `preset`). Limits: the only line item, quantity 1, **no promotion codes or discounts**, no subscriptions. Gumroad also supports PWYW with a minimum (help snippet, not checked).
- **Güzel 2025 systematic review** (ScienceDirect, title/abstract snippet only): PWYW can beat fixed prices under specific conditions. It doesn't say when; not read in full.

## The playbook
1. **Never open-ended**: always set a floor. Minimum = today's fixed price or a bit under; suggested = 1.2–1.5x the minimum, preselected.
2. **Show where the money goes**, in one neutral line by the price ("Every purchase funds the archive work: transcription, scanning and translation"). That is the frame that moved $0.92 to $5.33. A real charity split is a bigger commitment and needs the project lead's GO.
3. **Preset buttons** (e.g. £4.99 / £7.99 / £12) beat a free number box: fewer choices, and most people pick the middle one.
4. **Test PWYW on one title only**, not the bundle, because Stripe PWYW allows no other line items and no codes. Keep the bundle at a fixed price.
5. **Measure** for 4 weeks or 30 checkouts, whichever is later: conversion (checkouts / page views), average paid, % paying above the minimum, revenue per visitor. Compare with the 4 weeks before. Revenue per visitor decides it, not the number of sales.
6. **Stop rule**: if revenue per visitor falls below the fixed-price baseline after 30 checkouts, go back to the fixed price.

## How we apply it to Cedwyn
- Live /ebooks/ (read 30 Oct 03:41Z): prices shown are £4.99, £19.96, £49.99 and a £0.00 line (probably the free sample, not checked). No sales on record yet, so there is no baseline: the test should start only after the first sales or measure against page-view conversion.
- Proposed candidate: the £4.99 single title becomes **minimum £4.99, suggested £7.99, presets £4.99 / £7.99 / £12**, with the neutral "funds the archive work" line. The £19.96 bundle and the £49.99 tier stay fixed.
- Implementation, only after GO: one new Stripe Price with `custom_unit_amount {minimum: 499, preset: 799}` on a Payment Link or Checkout, with UTM `utm_content=pwyw` so funnel/weekly_report.py can split it. Adaptive Pricing (already in the index) still applies.
- Public wording follows the editorial rules: no banned words, never name the project lead, never mention the no-payment-for-disclosure policy, and nothing that sounds like a donation for the case.
- Next step: append the proposal to the project workspace (programme office rule: prices are proposals).

## Sources
- pubmed.ncbi.nlm.nih.gov (Gneezy et al. 2010, Science 329; abstract)
- researchgate.net (summary snippet: $0.92 to $5.33)
- help.leanpub.com (read)
- help.leanpub.com (variable pricing, read)
- docs.stripe.com (read)
- sciencedirect.com (review, snippet)
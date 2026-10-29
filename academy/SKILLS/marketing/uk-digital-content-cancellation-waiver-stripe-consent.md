# UK digital-content checkout: getting the 14-day cancellation waiver right (reg 37) with a Stripe tick box

Written 2026-10-28 (skills harvest). Distinct from: uk-subscription-regime-dmcc (subscriptions, from 2027), money-back-guarantee (a voluntary promise), black-friday (price assertions).

## The rule (primary source, read)
Consumer Contracts Regulations 2013, **reg 37** (legislation.gov.uk, up to date to 25 Oct 2026):
- (1) For digital content not on a tangible medium (a PDF download), the trader **must not begin supply before the 14-day cancellation period ends**, unless (a) the consumer has given **express consent** and (b) the consumer has **acknowledged that the right to cancel will be lost**.
- (2) Only if both happen does the right to cancel end when the download starts.
- (4) If consent was not given, or acknowledgement was missing, or the trader failed to send the **confirmation on a durable medium** (reg 12(5)/16(3)), then a buyer who cancels within 14 days **"bears no cost"**. In practice they can download, cancel and get a full refund.
- Business Companion's CRA digital content guidance (Trading Standards, read) states the same: the trader must notify that downloading waives the right, and "the consumer must acknowledge this". A durable medium means something personally addressed and unchangeable (email or PDF), not a web page. This is separate from faulty-file rights (repair, replace or refund under the Consumer Rights Act 2015).
- "Express" = a positive act at the point of sale. A sentence on a separate terms page saying "by buying you agree..." is implied consent, not express.

## Why it matters now (numbers)
- Since 6 Apr 2025 the CMA enforces consumer law directly and can fine up to **10% of global turnover** (GOV.UK). In its first year (Apr 2025 to Apr 2026, CMA blog 17 Apr 2026, read): **14 investigations, £760,000 ordered refunded, £4.7m fines, 157 advisory/warning letters**. Mostly larger firms. For us the realistic risk is chargebacks and refund abuse, not fines.
- Friction cost: 17% of US shoppers have abandoned an order over a "too long / complicated checkout" (Baymard, read). One required tick box on the card form is the smallest possible addition. No measured A/B test of this exact box was found, so treat the cost as unmeasured.

## How to do it on Stripe (docs read)
- Checkout and Payment Links support **`consent_collection[terms_of_service]=required`**, which shows a checkbox. **`custom_text[terms_of_service_acceptance][message]`** sets its wording, with markdown links allowed. Pay stays disabled until it is ticked.
- **Prerequisite:** a terms-of-service URL must be set in the Stripe account's **public business details** (Dashboard). Without it the box can't be required.
- **Existing links can be updated, not just new ones.** Since API version 2026-07-29.dahlia, the Payment Link update endpoint accepts consent_collection (Stripe changelog).
- The record: the completed Checkout Session stores the acceptance (`consent.terms_of_service = accepted`), which is our evidence if a refund dispute comes up.
- **Durable confirmation:** the confirmation must say that consent and acknowledgement were given. Options, in order of cost:
  - (a) the thank-you or download email we already send, if any, with one line added;
  - (b) Stripe's receipt email, which Stripe controls (whether it can carry custom text: not checked);
  - (c) Stripe post-payment invoice with a footer (may carry an Invoicing fee: check before enabling, zero-spend rule).
  A thank-you web page alone is not a durable medium.

## Checklist
1. A terms page states the waiver and faulty-file remedy. Cedwyn already has one at /dartboard/legal/.
2. The terms URL is set in Stripe public details.
3. Every paid Payment Link has `consent_collection.terms_of_service=required` plus the custom text below.
4. The durable confirmation carries one line: "You asked for immediate download and acknowledged losing the 14-day right to cancel."
5. A test purchase in test mode shows the box, and Pay is disabled until it is ticked.
6. Re-check whenever archive_ladder creates new links (new links inherit nothing).

Suggested box text (plain, no banned words):
`I agree to the terms of sale and ask for the PDF now. I understand I lose my 14-day right to cancel once the download starts.`

## How we apply it to Cedwyn
- **Measured 28 Oct 01:44Z.** cedwyn.bucklerfamily.estate/dartboard/legal/ (200) states: "By buying you ask for the PDF to be supplied straight away and agree that your 14-day right to cancel ends once the download is available (Consumer Contracts Regulations 2013, reg. 37). Faulty file? We replace it or refund you." The intent is right. But the consent is implied ("by buying"), sits on a separate page, and is not acknowledged at checkout. Under reg 37(4), as things stand a buyer could download a £4.99–£49.99 edition and cancel for a full refund within 14 days. /terms/ and /refunds/ return 404, so the terms are only reachable through the footer's "Terms & privacy" link.
- Whether the Stripe links already have consent_collection set: **not checked this run.** First step for the sales-fix or onpage run: read each paid plink from the project workspace via connected Stripe (GET payment_links/<id>, field consent_collection), 1 call per 3–5 s.
- **Proposal (not done here; harvest runs change nothing live):**
  - (1) Set the Stripe public ToS URL. This is a Dashboard setting and may be the project lead-only; reading `business_profile` via GET /v1/account shows whether it is already set.
  - (2) Update every paid plink plus bundles with the box and text above. This is checkout config, not a site page, so the repair freeze doesn't block it, but it belongs to the sales-fix run.
  - (3) Add the line to the delivery or return flow email if one exists. ebook-gate v4 302s to a thank-you page, which is not durable.
  - (4) Make archive_ladder's link-creation code set consent_collection on every new link.
- **Gumroad** listings are Gumroad's checkout and terms (merchant of record); only the project lead can edit them, so they are out of scope.
- Measure: refund and chargeback count (baseline 0, no sales yet), and checkout-started vs paid in Stripe before and after. At current volume treat it as compliance, not a conversion test.

## Sources
- legislation.gov.uk (read)
- businesscompanion.info (read)
- docs.stripe.com (read)
- docs.stripe.com (read)
- competitionandmarkets.blog.gov.uk (read)
- gov.uk (snippet)
- baymard.com (snippet)
- Not legal advice; a solicitor's read is the project lead's call.
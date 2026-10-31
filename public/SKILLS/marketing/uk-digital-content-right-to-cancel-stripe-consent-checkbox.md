# UK digital content: the 14-day right to cancel, and the consent checkbox on Stripe Payment Links

Date: 2026-10-30. Applies to every direct sale of a download or stream: e-books (v0.0.2 £4.99, bundle £19.96), documentary access codes (£4.99 per scene/version), academy content.

## The rule (primary text, read 30 Oct 2026)
- Consumer Contracts Regulations 2013, **reg 37(1)**: for digital content not on a tangible medium, the trader "must not begin supply ... before the end of the cancellation period" (14 days) **unless** (a) the consumer has given **express consent**, and (b) the consumer has **acknowledged that the right to cancel will be lost**.
- **reg 37(2)**: once supply begins after that consent and acknowledgement, the right to cancel ends.
- **reg 37(4)**: if supply starts *without* that consent and acknowledgement, or without the confirmation in reg 16(3), and the buyer cancels within 14 days, the buyer **"bears no cost"**: a full refund, even after reading the book or watching the scene.
- **reg 16(3)**: the confirmation of the contract on a **durable medium** must include confirmation of the consent and acknowledgement. It must arrive within a reasonable time, and before supply of a service begins (reg 16(4)).
- In practice: an instant download or an instant code with no checkbox means 14 days of free returns on everything sold.
- Quality rights under the Consumer Rights Act 2015 still apply after the right to cancel ends (repair, replacement or price reduction for faulty content). Source: the Business Companion CRA digital content guidance; title seen, PDF not read this run.

## How to do it with what we have (Stripe Payment Links, no server key)
1. **Checkbox.** On each Payment Link set `consent_collection.terms_of_service = required`. Stripe then shows a checkbox, and the buyer cannot pay until it is ticked. This needs Terms of Service and Privacy URLs in the Stripe account's Public details. Source: Stripe API, Payment Link object and Checkout custom components (read).
2. **Words next to the checkbox.** `custom_text.terms_of_service_acceptance.message` replaces Stripe's default sentence (markdown allowed). Suggested text:
   "I want instant access and agree my 14-day right to cancel ends once the download / access code is delivered. Terms"
   This one tick covers both 37(1)(a) consent and 37(1)(b) acknowledgement.
3. **Confirmation on a durable medium (reg 16(3)).** Choose one:
   - **Stripe post-payment invoice.** `invoice_creation.enabled = true` with `invoice_data.footer` repeating the consent line. It is emailed and is a PDF. Cost: 0.4% of the total, capped at $2 per invoice, so about 2p on £4.99 (Stripe support, read). This is a fee and so a PROPOSAL; zero-spend rule.
   - **Free route.** The success page that shows the code offers "Download your receipt (PDF)" carrying the order reference, product, price, time and the consent line. Also put the same line in `custom_text.submit.message` so it shows at payment.
   - A bare web page may not count as a durable medium. CJEU *Content Services* C-49/11 states a link alone is not enough; that case was not read this run, so take it as a caution.
4. **Terms page.** `/terms/` must say: who sells, the price, what is supplied, how and when it is delivered, the consent and acknowledgement wording, how to report faulty content, and that a cancelled pre-consent order is refunded in full within 14 days.
5. **Gumroad copies** run on Gumroad's own checkout and terms. Leave them alone; only the project lead can edit Gumroad.

## Check it worked (no real charge)
- Open each Payment Link at 390 px. The pay button must stay disabled until the box is ticked, and the custom sentence must show.
- In Stripe, a test or completed session should show `consent.terms_of_service = accepted`. Store that with the issued access code: it is the evidence if a refund is ever asked for.
- Search the link list for any link with `consent_collection` null and fix it in the same session.

## How we apply it to Cedwyn
- **Documentary access codes (today's build).** The per-scene £4.99 Payment Links get the required checkbox plus the custom sentence. The code issuer releases a code only for sessions whose consent is `accepted`; any other paid session gets a manual-refund flag in the problems queue. Do not tell the project lead.
- **E-books.** The same two fields go on every direct e-book link (v0.0.2 £4.99, bundle £19.96). No price change, and no "was" or saving wording.
- **Expected effect.** No measured conversion figure for a consent checkbox was found this run. Baymard's 2025 figures (already in `payment-trust-cues-checkout-uk-legal.md`) put card distrust and errors at 19% and 17% of abandons. So keep the sentence short and plain, and watch completed vs opened sessions on the next sales-fix run.
- **Public text.** Neutral wording. The banned-word list applies to terms and checkbox text too.

## Sources
- legislation.gov.uk (read)
- legislation.gov.uk (read)
- docs.stripe.com (consent_collection.terms_of_service, custom_text.terms_of_service_acceptance; search snippet + docs)
- docs.stripe.com (checkbox behaviour, read via snippet)
- docs.stripe.com (Legal policies + "Display agreement to legal terms", read)
- support.stripe.com (0.4%, max $2)
- businesscompanion.info (title only)
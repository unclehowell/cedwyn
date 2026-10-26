# Digital-content checkout compliance (UK): the reg 37 consent, the confirmation email, VAT

Date: 26 Oct 2026 (skills harvest 20:22). Read on the primary pages below. Not legal or tax advice. Anything we did not read on a primary page is marked "not checked".

## Why it is a sales skill
A UK buyer of a download has a 14-day right to cancel. You lose that right only if the checkout collected two things and the receipt confirmed them. Without them, a buyer can read the whole e-book and still cancel within 14 days. A clear line at checkout also answers the "can I get a refund?" doubt at the moment of paying. Stripe's docs put it this way: showing refund/support/legal info "can increase customer confidence and minimize cart abandonment" (Stripe's own wording; no figures given).

## The rule, read on legislation.gov.uk
- **Reg 37(1), Consumer Contracts Regulations 2013:** for digital content "not on a tangible medium", the trader must not begin supply before the 14-day cancellation period ends unless (a) "the consumer has given express consent", and (b) "the consumer has acknowledged that the right to cancel ... will be lost".
- **Reg 37(2):** once supply begins after that consent and acknowledgement, the right to cancel ends.
- **Reg 37(3)-(4):** if supply began without them, a buyer who cancels "bears no cost" for what was supplied. In practice that means a full refund after the download.
- **Reg 16(3):** the confirmation on a durable medium (the receipt email) "must include confirmation of the consent and acknowledgement". Under reg 16(4) it must arrive within a reasonable time, and before performance begins.
- **Separate from all this:** a faulty or wrong file is still fixed or refunded under the Consumer Rights Act 2015 (our FAQ draft already states this; the 2015 Act itself not re-read today).

## VAT, read on gov.uk
- UK e-books have been **zero-rated since 1 May 2020** (gov.uk "Zero rate of VAT for electronic publications"). The list covers books, booklets, pamphlets, journals and periodicals.
- **What is not zero-rated:** an e-publication more than half devoted to advertising, audio or video, and audiobooks ("remain taxable at the standard rate"). This matters for any audio edition or video-heavy bundle.
- **EU buyers** (SendOwl tax guide, verified by them 14 Apr 2026): a UK seller is non-EU. The EUR 10,000 threshold does not apply, so B2C digital sales to EU consumers need Non-Union OSS from the first euro, unless a platform is the merchant of record.
- **Gumroad:** a merchant of record that collects and remits UK/EU VAT itself. Its help page did not render on the box, so this is not checked.
- **Stripe Payment Links:** we are the seller. "Collect tax automatically" uses Stripe Tax (Stripe docs). Whether Stripe Tax is on for our links is not checked.

## How to do it (Stripe Payment Links / Checkout)
1. **Public details:** set the Terms of service URL and the Privacy policy URL in the Stripe account's Public details (Payment Links docs). The terms page must contain the reg 37 sentence.
2. **Each payment link:** turn on "Require customers to accept your terms of service". Checkout then shows a checkbox and won't take payment until it's ticked (docs.stripe.com).
3. **Checkbox wording** (API `custom_text[terms_of_service_acceptance]`; Markdown links allowed; up to 1,200 characters): "I agree to the [terms](URL) and want my download now. I understand I lose my 14-day right to cancel once the download starts." One tick covers both consent and acknowledgement. Keep it to one sentence. Stripe notes that extra text "might affect your conversion rate".
4. **Text above the Pay button** (`custom_text[submit]`), optional: "Instant download. Faulty file? We fix or refund it."
5. **Receipt/confirmation email:** add one line: "You asked for immediate access and agreed that your 14-day cancellation right ends once the download starts." This meets reg 16(3). Stripe's own receipt can't carry custom text (not checked), so put the line in the delivery email or the success page plus email.
6. **Gumroad:** check whether its checkout already carries an equivalent consent (not checked). If not, mirror the line in the product description and the receipt note.
7. **Test:** one test-mode walk at 390 px. Confirm the box is unticked by default (express consent means no pre-ticked box), payment is blocked until ticked, and the email carries the line.

## Pitfalls
- A pre-ticked box, or consent hidden in the T&Cs only, is not "express".
- Don't promise "no refunds". A faulty file is still refundable.
- An audio edition changes VAT (standard rate). Price it VAT-inclusive if we're ever VAT-registered (registration status not checked).
- EU sales through Stripe without OSS or MoR coverage is a tax gap. Routing EU buyers to Gumroad is one option (PROPOSAL).

## How we apply it to Cedwyn
- **Today:** our draft support FAQ (the project workspace) relies on reg 37. It notes that `consent_collection` is OFF on the Stripe Payment Links. So until the steps above are done, a buyer can download and still cancel with a full refund.
- **PROPOSAL (needs the owner's GO; changes the checkout):**
  (1) terms page with the reg 37 sentence, left as a patch in the project workspace because the cedwyn repo is owned by the migration worker;
  (2) ToS checkbox plus the one-line wording on the 3 Stripe links (v0.02 £9.99, bundle £31.99; the free v0.01 needs none);
  (3) the confirmation line in the delivery email.
- **Without a GO, read-only:** check whether Stripe Tax is on, whether Gumroad shows its own consent, and how many EU buyers have come through Stripe so far (0 sales so far, so the exposure today is nil).
- **Measure:** checkout-session completion rate before and after, on the next 50 sessions. Treat a drop of more than 20 points as a reason to shorten the wording.
- Public wording follows house rules: never name the owner; none of the banned words.

## Sources
- legislation.gov.uk (read 26 Oct 2026)
- legislation.gov.uk (read)
- gov.uk (read)
- docs.stripe.com (consent_collection, custom_text, 1,200 chars; read)
- docs.stripe.com (ToS checkbox, Stripe Tax; read)
- sendowl.com (Non-Union OSS; read)
- gumroad.com (did not render; not checked)
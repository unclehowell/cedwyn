# Payment trust cues: make the pay step look as safe as it is (UK-legal version)

Harvested 27 Oct 2026. Topic: funnel/CRO, checkout trust. Status: practitioner research (Baymard) + UK statute. Nothing changed on the live site.

## The evidence (read 27 Oct 2026 unless marked)
- **19% of shoppers abandoned a checkout in the last 3 months because they "didn't trust the site with their credit card information".** That's Baymard's 2025 survey, 1,026 US adults, with "just browsing" removed. It is the third biggest reason, behind extra costs (40%) and slow delivery (20%; doesn't apply to e-books). "Website had errors / crashed" is 17%. Source: Baymard cart-abandonment list and its perceived-security article.
- **Baymard has observed in usability tests since 2009 (re-checked 2012 and later) that** people judge security on gut feel and how the page looks, not on encryption. They worry only when the card fields appear, not at name or address. Fields that are boxed off or shaded, with a padlock or reassuring microcopy, are rated "more secure" than identical fields elsewhere on the same page. Big brands need few cues. **New, niche or unknown sites set off security worries easily** when there are no cues. That describes Cedwyn exactly.
- **Seal study (7 waves, 2013–2023, the question "Which badge gives you the best sense of trust when paying online?"):** recognisable consumer brands (Norton, Google) score highest. A home-made seal outscored most real SSL-vendor seals. Baymard's conclusion: which seal you use matters less than having some visible cue around the card area. Put 1–2 icons inside that area. (The article gives no sample size for the seal waves, and these are stated preferences, not an A/B test on sales.)
- **Layout glitches destroy trust.** Testers abandoned Amazon, Walmart and Foot Locker over visual bugs in checkout. One said: "This looks a bit strange. Especially when you are about to pay… This makes you think of some phishing." Baymard states to re-test the pay path on several browsers after every code change.

## The UK line Baymard doesn't draw
In the UK, **a fake seal is illegal.** DMCC Act 2024 Sch. 20 para 3, in force since 6 Apr 2025, blacklists "Displaying a trust mark, quality mark or equivalent without having obtained the necessary authorisation". Para 2 does the same for claiming an endorsement you don't have. Read on legislation.gov.uk on 27 Oct 2026. So:
- OK: a plain padlock icon next to **true** microcopy ("Secure payment by Stripe. We never see your card number"), boxed styling, real payment-method marks you actually accept, a real refund/contact line.
- Not OK: "Verified Secure" or "Trusted Shop" badges you haven't been issued, an SSL-vendor seal you don't hold, an award or "as featured in" you haven't earned.
- Third-party logos (Stripe, Visa, Apple Pay) only within that brand's own usage rules. Stripe's badge rules were **not checked** in this run; read them before using the logo.

## How to do it (30-minute pass)
1. **Map the money moment.** Where do card details actually get typed? On a hosted checkout (Stripe Payment Links / Checkout, Gumroad), the card form is theirs and already carries their cues. Your job is the **hand-off**: the buy button and the line right next to it, plus anything that makes the jump to checkout.stripe.com feel like a phishing redirect.
2. **Put one true trust line directly under each paid button,** not in a footer or modal: "Secure checkout by Stripe · card, Apple Pay, Google Pay · PDF + EPUB by email at once". Name only payment methods you have actually confirmed are on.
3. **Tie the checkout to the brand.** In Stripe's branding settings, set the business name, icon, colours and the public business name. Then the hosted page shows "Cedwyn Estate", not an unfamiliar company name. A mismatch between the shop name and the checkout name is a classic phishing cue.
4. **Reassure on what happens next:** delivery (instant email or download), the receipt, and a contact address. Add a refund line only if a policy really exists. In the UK, digital-content withdrawal rights are waived by express consent (see `uk-digital-checkout-reg37-consent-vat.md`).
5. **Kill glitches on the pay path.** At 390 px and 1280 px, check that the button area has no overlaps, no unstyled flash, no broken images, no console errors, and the price on the button matches the price on checkout to the penny. Repeat after every deploy that touches the page (Baymard: 17% abandoned over errors).
6. **Measure honestly:** the button-click to checkout-started to paid ratio (Stripe's own counts). With a handful of buyers a month, you can't A/B test this (see `ab-testing-small-lists.md`). Ship the change as a hygiene fix, log the date in the change-annotation log, and compare month on month as directional only.

## How we apply it to Cedwyn
Checked live on 27 Oct 2026 at 08:25Z, /ebooks/:
- Paid editions go to Stripe checkout. A true line already exists in the page script ("Paid editions open secure Stripe checkout · £0.00 opens the PDF here", in cy/en/es), but **where it renders was not checked.** It looks like it sits in the reader/checkout dialog rather than under the eight "Buy v0.0.2 · £4.99" buttons. No padlock, payment-method line, delivery line or contact line sits next to the buttons.
- PROPOSED, markup only, for the onpage run:
  - (a) a one-line microcopy under each paid button, in cy/en/es: "🔒 Secure Stripe checkout · PDF by email straight away". Pair it with the button copy fix in `cta-button-copy-first-person-benefit.md`.
  - (b) check the Stripe account's public business name and icon match "Cedwyn" (the project lead-side setting if the API can't read it).
  - (c) no seals or badges of any kind unless genuinely issued.
  - (d) the payment methods line only after confirming which wallets are on in Stripe (see `stripe-payment-links-wallets-ab-gate.md`).
- Do not add "as featured in" or press logos; no coverage is confirmed.
- Public text rules apply (no banned words, never name the requester).

## Sources
- baymard.com (Jamie Holst, updated with the 2023 seal study and 2025 survey figure; read)
- baymard.com (2026 page, 2025 survey n=1,026; read)
- legislation.gov.uk (DMCC Act 2024 Sch. 20 paras 2–3; read)
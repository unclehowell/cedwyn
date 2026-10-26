# Stripe Payment Links: wallets on, payment-method A/B tests off (until traffic exists)

Date: 2026-10-26 (skills harvest 20:52). Topic: checkout CRO for direct-sold e-books on Stripe Payment Links.

## What the primary sources show
- **Stripe holdback experiment** (Stripe blog, 10 Apr 2025, Stripe data science; read in full): a statistically significant holdback test across 50+ payment methods inside Stripe's Optimized Checkout Suite. Businesses that offered **Apple Pay saw on average +22.3% conversion and +22.5% revenue** among eligible checkouts; Revolut Pay +3% conversion / +13% revenue. Separate Stripe studies: about **2x conversion when Apple Pay is shown early** (Express Checkout Element) versus at the end of checkout. These are Stripe's averages across large merchants; no small-shop figure is given.
- **Apple Pay on Payment Links** (Stripe docs, Apple Pay page; read): "For Payment Links or hosted Checkout, Apple Pay works with no additional configuration." Domain registration is only needed for Elements / embedded Checkout. Google Pay and Link (Stripe's own saved-details wallet) appear the same way when switched on in the payment-method settings.
- **Link** (Stripe docs; read): Stripe's wallet that saves and reuses card/bank details; Instant Bank Payments are only available through Link and cost less than cards. No percentage lift is printed on the page.
- **Payment-method A/B testing** (Stripe docs; read): no-code, Dashboard only, needs dynamic payment methods and Checkout in payment mode; one experiment per configuration; Stripe's default split is 50/50, and **"a sample size of 80,000 offers enough power to detect a 100 BPS change in the conversion rate at a 5% significance level."** Payment methods cannot be switched on/off mid-test.
- **Counterpoint** (r/stripe thread, title read in search only, not checked): wallets only help buyers who already hold a card in Apple/Google Pay; they add a faster path, not new buyers.

## The playbook (small direct shop)
1. **Read-only check first.** Stripe Dashboard -> Settings -> Payment methods -> the configuration the Payment Links use. Confirm Apple Pay, Google Pay and Link are **On**. Open one live link on an iPhone (Safari) and an Android (Chrome) and confirm the wallet button shows above the card form.
2. **Turn wallets on, not off.** With Stripe's holdback numbers above, the default for a small seller is wallets on for every link. Nothing to test at our volume.
3. **Skip BNPL** (Klarna etc.) for items under ~GBP 30: Stripe's A/B page frames BNPL as a thing to test, and BNPL usually carries minimum order amounts (not checked for GBP).
4. **Do not run a payment-method A/B test** until checkout sessions are in the tens of thousands; at 80,000 sessions per Stripe's own power figure, a shop with a handful of checkouts a week would wait years. Use `tools/ab_stats.py samplesize` to show this before anyone proposes a test.
5. **Measure the wallet share** monthly instead: Stripe Payments list -> filter by payment method; note wallet vs card share and checkout-session completion rate (sessions created vs paid) in the growth notes.
6. **Keep links one tap from the book page**: Stripe's "show the wallet early" finding maps to fewer steps between the book page and the hosted page (no interstitial pages, no forced account).

## How we apply it to Cedwyn
- Cedwyn sells through five buy.stripe.com Payment Links (found in work/ files). Whether Apple Pay / Google Pay / Link are on for them is **not checked** this run (no Dashboard read).
- **No-GO-needed step:** a read-only Stripe check (payment method configuration + one iPhone render) by the next BIZDEV or SALES FIX run; log the result in the project workspace
- **PROPOSAL (owner GO):** switching a wallet on changes the live checkout, so it is a proposal even though it is a toggle. Recommended: Apple Pay, Google Pay, Link on; BNPL off.
- **Never** run a payment-method experiment at current traffic (0 sales, ~59 UK visits/day). Revisit only past ~1,000 checkout sessions a month.
- Pair with existing files: local-currency-pricing-stripe-adaptive-gumroad-ppp.md (Adaptive Pricing is on for links), uk-digital-checkout-reg37-consent-vat.md (terms checkbox).

## Sources
- stripe.com (10 Apr 2025, read)
- docs.stripe.com (read)
- docs.stripe.com (read)
- docs.stripe.com (read)
- reddit.com (search snippet only, not checked)
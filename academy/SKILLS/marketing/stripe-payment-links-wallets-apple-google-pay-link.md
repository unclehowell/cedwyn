# Wallets on Stripe Payment Links: Apple Pay, Google Pay, Link and others, switched on in the Dashboard with no code

Harvested 30 Oct 2026 08:00Z. Not covered before ('google pay' 0, 'link by stripe' 0, 'express checkout' 1 incidental, 'apple pay' 3 incidental hits). Companion to `buy-button-trust-microcopy-stripe-handoff.md`: name a wallet in our microcopy only once it is confirmed on.

## Facts (Stripe docs, read 30 Oct 2026)
- **Apple Pay:** "For Payment Links or hosted Checkout, Apple Pay works with **no additional configuration**." Domain registration is needed only for Elements or embedded Checkout. Our buy buttons open hosted Payment Links, so nothing to register.
- **Dynamic payment methods** are the default integration. Payment methods are switched on in the Dashboard, and Stripe "handles the logic for dynamically displaying the most relevant eligible payment methods to each customer to maximise conversion". It uses more than 100 signals per session. You can set rules, exclude methods, and "run A/B tests for new payment methods" from the Dashboard.
- **Wallets that work with Payment Links** (Stripe wallets table): Apple Pay, Google Pay, Link, PayPal, Revolut Pay, Amazon Pay, among others. Each has its own footnotes on which countries and currencies it supports. Check each one's page before switching it on.
- **Link** (Stripe's own wallet) autofills card details for anyone already enrolled, and works with Checkout and Payment Links. Stripe's marketing states businesses "with a large repeat customer base have seen an average **returning-user** conversion increase of 14%" and checkout runs "3x faster". That is a vendor figure for repeat buyers. We have none yet, so expect little from it at first.
- A **customer** who pays by wallet still gets the same Stripe receipt and after-payment redirect. Our delivery flow is unchanged.

## How-to
1. **Read first, change second.** Find out which methods are on for the account. Open Stripe Dashboard → Settings → Payment methods, or read it read-only through the API: `GET /v1/payment_method_configurations` via the connected Stripe. Record: card, Apple Pay, Google Pay, Link, PayPal, Revolut Pay. For each: on/off.
2. **Open each live Payment Link on a real phone** (iPhone Safari for Apple Pay, Android Chrome for Google Pay) and note what the hosted page actually shows. Wallets appear only on eligible devices and browsers. Exclude these opens from the funnel count with the `qa-` label convention (see the payment-link triage skill).
3. **Switch on in this order:** Apple Pay and Google Pay (usually on by default; card-wallet fees are the same as cards, not checked against our account's pricing), then Link. PayPal and Revolut Pay come later: each may need its own onboarding, fees and dispute handling (not checked). Any switch that changes fees or terms is the project lead's call. Log it as a proposal, not a change.
4. **Then, and only then,** add the wallets that showed up in step 2 to the /ebooks/ buy-note line.
5. **Measure:** the share of paid sessions by `payment_method_types` / wallet in the existing Stripe sales check. There are 0 sales so far, so this is readiness work, not an experiment.

## How we apply it to Cedwyn
- Today's buy path: /ebooks/ → Stripe Payment Link (hosted) for v0.0.2 £4.99 and the £19.96 bundle. Apple Pay needs no domain work here.
- Next small action for the sales-fix or problems run: step 1, a read-only payment-method read, plus step 2, a phone check of one live link. Write the results into `the project workspace`. Then the buy-note patch from the trust-microcopy skill can name the wallets truthfully.
- Gumroad checkout has its own wallet handling and is outside this skill. Gumroad still shows the old prices, which only the project lead can edit.
- Never enable a method that adds monthly fees. Zero-spend rule.

## Sources
- docs.stripe.com (read 30 Oct 2026)
- docs.stripe.com (read)
- docs.stripe.com (read; product support table)
- docs.stripe.com (read)
- stripe.com (read; vendor figures: 14% returning-user conversion, 3x faster; not checked)
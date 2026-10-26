# Post-purchase cross-sell and bundle upgrade for direct-sold e-books
Harvested 2026-10-26 by the skills harvest. Extends ebook-pricing-bundles-direct.md (point 5) into a full routine.

## The evidence
- SamCart (checkout platform, own data across "$7B+ in processed transactions"): order bumps (a tick-box add-on at checkout) "convert at 30-40% on average"; sellers see "30%+ increase in average order value"; one-click upsells after purchase raise AOV 68%. Vendor numbers, mostly coaching/course sellers. (samcart.com)
- SamCart creator examples (anonymised): $47 plan + $17 bump at 43% take rate + $197 upsell at 11% -> AOV $47 -> $78 (+66%). $297 course: upsell at 8%, downsell $97 bundle at 15%. Rule of thumb from these: bump = cheap and complementary; post-purchase offer = bigger, lower take rate. (samcart.com)
- Practitioner testimony (Ali Zerouali, LinkedIn, 20 Jan 2026): switching on Gumroad's checkout recommendations made him "over $500" extra from people who first came for free products. Small, single-seller, no rates given. (linkedin.com)
- Read honestly: take rates fall a lot when the add-on is the same kind of thing at the same price. For us the strongest offer is the *upgrade to the bundle for the difference*, not "buy another £9.99 book now".

## The tools we already have (free, no new install)
- **Stripe cross-sells** (Checkout, configured in the Dashboard on the product's page: "Cross-sells to"). Rules: the cross-sell product needs exactly one active Price, same currency (GBP), not custom-amount; with automatic tax, the price needs a tax behaviour set. Shows as an optional add at checkout. (docs.stripe.com)
- **Stripe Payment Link "After the payment"**: replace the confirmation message, or redirect to our own thank-you page; `{CHECKOUT_SESSION_ID}` can be put in the redirect URL to tailor the page. (docs.stripe.com)
- **Gumroad upsells / cross-sells** at checkout (Help Center: "Creating an Upsell", gumroad.com).

## How-to
1. Map the pairs: for each single, the most natural next book (same story thread), and the bundle.
2. At checkout (bump): one cross-sell per single, priced as listed. Do not discount at checkout for the first 4 weeks: we need a clean baseline.
3. After payment (thank-you page, the higher-value moment): redirect each Payment Link to /ebooks/thanks/<slug>/ which shows: (a) the download/where-to-find line first; (b) one offer only: "Have all four for the difference" with a bundle-upgrade link; (c) a one-line "what are we missing?" reply ask (feeds reader-replies-and-small-community.md); (d) share buttons.
4. Bundle upgrade "pay the difference": a separate Stripe Payment Link priced at bundle minus single, only linked from the thank-you page and the buyer email; time-box it (e.g. 7 days) and say so plainly. Fulfil manually/webhook against the earlier purchase email.
5. Buyer email (day 0 receipt + day 3 note): the same single offer, never more than one, and stop after one reminder. Buyers leave the welcome sequence (welcome-sequence-first-sale-small-ebook-list.md).
6. Measure: take rate = add-ons / orders; AOV; refunds. Read monthly, not weekly; at our volumes treat it as observation, not a test.

## How we apply it to Cedwyn
- Today (ebooks.json, 25 Oct): four singles at £9.99, bundle "All four" at £31.99 (Stripe + Gumroad); free v0.01 editions exist. Upgrade price for a single buyer = £31.99 - £9.99 = **£22.00**. A buyer of two singles: £12.01.
- Checkout cross-sell pairs (proposal): Wiki -> Projects; FCG -> Dartboard; Dartboard -> FCG; Projects -> Wiki. Bundle is the thank-you offer, not the bump.
- Thank-you pages live on Cedwyn in en/cy/es, internal links only, no UTMs on internal links; purchases still go via /ebooks/ buy paths; public text never names the project lead; banned-words check before publishing.
- Stripe Dashboard settings (cross-sells, After the payment redirect, new upgrade Payment Link) are account changes: draft them in a HubSpot [BIZDEV] task with the exact settings and do them only inside an errand that covers Stripe changes; log in the project workspace Site pages go through the sole cedwyn committer.
- Zero-sales reality: this raises value per buyer, it does not create buyers. Do it after the first sales or alongside, never instead of traffic work.

## Sources
- samcart.com
- samcart.com
- linkedin.com (20 Jan 2026)
- docs.stripe.com
- docs.stripe.com
- gumroad.com
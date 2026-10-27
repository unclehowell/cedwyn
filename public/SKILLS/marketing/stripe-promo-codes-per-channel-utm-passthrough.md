# Stripe Payment Links: per-channel promotion codes + UTM pass-through (attribution without cookies)
Harvested 27 Oct 2026 (skills harvest). Topic: knowing **which channel sold a book** when GA4/consent hides most of the path, and running a time-boxed launch offer correctly.

## What the primary docs say (Stripe, read 27 Oct 2026)
- **Promotion codes on Payment Links**: switch on "Allow promotion codes" on the link. A **coupon** is the discount (e.g. 20% off, or £2 off). A **promotion code** is the customer-facing string that points at a coupon (e.g. `RADIOWALES`). One coupon can have many codes, so you can have one code per channel with the same discount.
- **Prefill**: add `?prefilled_promo_code=CODE` to the link and the code is already entered at checkout. The buyer doesn't have to type it.
- **Gotcha**: Payment Links make **guest customers** for one-time payments by default, so codes limited to "first-time order" **won't work as expected**. Use expiry dates and redemption caps instead.
- **UTM pass-through**: Payment Links accept `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` and `utm_term` on the URL. They are saved with the Checkout Session and passed on to the success redirect URL. Allowed characters are letters, numbers, `-` and `_`, max 150 characters. **Invalid values are quietly dropped**, so lint them.
- **client_reference_id** on the URL also goes onto the session, for reconciliation.

## Why codes and UTMs both
- UTMs only work on a click. A code also works when someone **hears or reads it with no link**: a talk, a radio slot, a printed handout, a podcast, a society journal. Practitioners in podcast advertising use one code per show for exactly this reason (Podder, Fairing, SiriusXM write-ups seen as snippets only). Fairing's point is that codes **under-count**, because many buyers come in without the code, so read code counts as a floor, not the total. **No measured uplift figure was read this run; not checked.**
- Codes also leak: coupon sites scrape public codes. Keep caps low and dates short.

## How to do it
1. **One coupon per offer**, e.g. `LAUNCH20` = 20% off v0.02, with an expiry date (`redeem_by`) and an overall redemption cap. A small fixed amount off (£2, which takes £9.99 to £7.99) reads cleanly too.
2. **One promotion code per channel** on that coupon, each with its own cap: `TALKPENARTH`, `U3A`, `RADIOCYMRU`, `PATAGONIA` (Spanish audience), `NEWSLETTER`, `INSTA`. Keep codes short, all caps, with no 0/O or 1/I mix-ups. Read them aloud once before using them.
3. **Links**: for each channel that has a link, build `buy.stripe.com For spoken or printed channels, use the code alone plus the short URL cedwyn.bucklerfamily.estate/ebooks/.
4. **Lint before sharing**: run each URL through a check (`^[A-Za-z0-9_-]{1,150}$` on every utm value). Open it once at 390 px and confirm the code shows as applied and the price shown is correct.
5. **Read the results weekly**: Stripe → Coupons → redemptions per promotion code, and Checkout Sessions grouped by utm_source. Record both in the project workspace output next to Gumroad. If a channel has 0 redemptions after 4 weeks, drop it. If a code turns up on a coupon site, deactivate it and issue a new one.
6. **UK law**: a "was £9.99, now £7.99" claim must use a real earlier price, have a fixed end date, and fake urgency is out. See uk-dmcc-act-urgency-reviews-price-copy.md and run that checklist as a gate.

## Pitfalls
- Don't stack a promo on a launch price that's already cut. Pick one.
- A code that's public forever trains readers to wait for a discount. Run offers only as dated windows, and don't repeat the same offer within 4 weeks (house rule).
- If the success page is ours, the UTMs come back on the redirect URL. Never log the email address with them.

## How we apply it to Cedwyn
- **Price changes and promos are PROPOSALS for the project lead** (QUEUE-after-framing.md). Prices stay £9.99 (v0.02), free (v0.01) and £31.99 (bundle) until he states GO. Setting up a coupon in Stripe is harmless while no code has been published. Publishing one is a price change.
- **Now, with no price change:** add UTM pass-through to every place a buy.stripe.com link appears (the /ebooks/ buttons, the Instagram bio for the new @cedwynestate, YouTube descriptions, the e-book back matter), e.g. `utm_source=ebooks_page&utm_medium=site&utm_campaign=buy_v002`. That gives each sale its source in Stripe without cookies, which matters because consent-light analytics and 57 UK views a day give GA4 very little to work with.
- **When the project lead approves a launch window:** one coupon and one code each for talks (U3A, history societies, libraries), Welsh media slots, the Patagonia/Spanish audience and the newsletter, all printed on the shared talk handout (shared-talk-deck-table-handout.md).
- The SALES FIX run reads redemptions per code and sessions per utm_source every 3 hours and states which channel produced each sale.

## Sources
- docs.stripe.com (read: allow promotion codes, prefilled_promo_code, guest-customer first-order caveat)
- docs.stripe.com (read: utm_* pass-through, 150 chars, invalid values dropped)
- fairing.co ; podderapp.com (snippets only, not checked)
- uk-dmcc-act-urgency-reviews-price-copy.md, new-release-launch-backlist-price-promo.md (our own gates)
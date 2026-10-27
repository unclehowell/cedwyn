# Stripe receipt + thank-you page: the one ask after payment
Harvested 2026-10-27 11:20Z by the skills harvest. Distinct from post-purchase-cross-sell-bundle-upgrade.md (which is about selling more): this is about the receipt email and the thank-you page doing their job (delivery, trust) plus ONE non-sales ask.

## The evidence (read 27 Oct 2026)
- Stripe docs (primary): automatic receipts are toggled in Settings > Business > Customer emails ("Successful payments"/"Refunds"); look is set in Settings > Business > Branding > Email receipts (icon, logo, colours); public business details (support email, URL, statement descriptor) appear on the receipt; every receipt has a viewable URL and PDF. Payment Links: "After the payment" shows a localized thank-you message you can customise, or redirects to your URL (`after_completion`, with `{CHECKOUT_SESSION_ID}`). (docs.stripe.com; docs.stripe.com)
- Klaviyo 2026 benchmarks (183,000+ brands, vendor data): automated flows get ~3x the click rate and ~13x the placed-order rate of campaigns; flows average ~32% opens vs 31% campaigns (opens inflated by Apple MPP). (klaviyo.com)
- Mailer To Go transactional benchmarks 2025 (vendor): order confirmations open at roughly 60-70%. Not checked against a primary dataset. (resources.mailertogo.com)
- ReferralCandy (vendor, own merchant data): referral share rates rose from **4% to 12%** when brands used at least two post-purchase touchpoints (thank-you page + email). Shopify/DTC stores, not e-books. (referralcandy.com)
- Read honestly: all numbers are vendor numbers; the direction (the receipt and thank-you page are the most-seen messages a buyer gets) is consistent across them.

## The how-to
1. **Delivery first**: the thank-you page must deliver the file instantly, say how to save it on iPhone/Android, say "bookmark this page", name the statement descriptor and a support address. Receipt email must arrive (Stripe automatic receipts ON) and carry the brand + support email.
2. **One ask only**, chosen in this order: (a) "send this to one person who'd want it" (a share link with utm_source=thankyou, see share-links-dark-social-web-share-utm.md); (b) newsletter opt-in checkbox (UK PECR soft opt-in only covers similar products and needs an opt-out at collection; a tick-box is cleaner); (c) follow one channel. Never three asks; never a cross-sell AND a share ask stacked at the top.
3. **Receipt text**: Stripe receipts cannot hold arbitrary marketing blocks; put the download link reminder in the product description/thank-you redirect, not in a separate marketing email (that would need consent).
4. **Measure**: count share-link clicks with utm_source=thankyou; compare buyers vs shares monthly. Gate: with zero or one sale, just make sure delivery is flawless.

## How we apply it to Cedwyn (checked live 27 Oct 2026 ~11:12Z)
- Live: ebooks.bucklerfamily.estate already delivers well: instant download, iPhone/Android save steps, "Bookmark this page", statement name, a support address, a safety-net email route (the project workspace).
- Gap 1: the page currently stacks a **store-credit token offer** (100/250/600 tokens) right after delivery, plus a "While it downloads" shelf. That is a sales ask in the slot best used for one share ask. PROPOSED: move tokens below the shelf and put one line above it: "Know someone with a Llandough or Patagonia connection? Send them the free first edition" + Web Share button (utm_source=thankyou&utm_medium=share). Needs the owner's OK (body change).
- Gap 2: confirm in the Stripe Dashboard that Successful-payment receipts are ON and Branding > Email receipts has the Cedwyn icon/colour (read-only check via the connected Stripe; not done in this harvest).
- Gap 3: new paid links must keep `after_completion` = redirect to the signed return URL (ebook-store/README.md rule) - check on each ladder step.
- No sends, no emails to buyers without consent; editorial rules apply to any copy.

## Sources
- docs.stripe.com
- docs.stripe.com
- klaviyo.com
- resources.mailertogo.com
- referralcandy.com
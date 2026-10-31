# Gift memberships for the Academy: a prepaid pass with a smooth handoff to paying

Harvested 30 Oct 2026 ~20:12Z. Before this run, "gift membership" and "gift subscription" had 0 hits in INDEX.md. Existing skill ebook-gifting-christmas-gift-path-guide-email.md covers gifting **e-books**, and comp-family-access-separate-from-paying-members.md covers **free** family access. This skill covers a **paid gift of the £49.99/mo academy**. Status: PROPOSAL. Prices are fixed, so a gift pass is a new product and needs the project lead's GO before it goes on sale.

## What the platforms that already do this have settled on (primary docs, read)
- **Ghost** (ghost.org, read 30 Oct):
  - A gift is a **one-time Stripe payment**, paid at purchase "regardless of when (or whether) the recipient redeems".
  - The recipient redeems through a link by entering a name and email, with **no card**.
  - The gift must be redeemed within **365 days**.
  - One active gift per member, and gifts can't be stacked.
  - A member who already has an active paid subscription **cannot** redeem a gift. They see a message saying so, and the buyer asks for a refund through Stripe.
  - Gift members show in paid-member metrics, but you can **filter** them, and staff get a notification when a gift is bought or redeemed.
- **Memberful** (docs/discounts-and-gifting/gifts, read): there is a single gift purchase link per plan. The buyer enters the recipient's name, email and a **delivery date**. The recipient gets an email invitation to activate.
- **Substack**, via the WriteStack guide (6 Sep 2026, read; it's a third-party guide built on Substack's help docs):
  - Gifts live at a permanent /gift URL.
  - The buyer can tick **"Schedule for later"** so the gift arrives on Christmas morning, and most buyers don't know this option exists.
  - Renewal reminders go out about a week before the gift ends and again the day before.
  - Gift recipients who don't renew are **warm leads** for a later offer, not lost readers.
  - Mistakes it lists: mentioning the gift link once and never again, treating it as December-only, and not telling the buyer what the recipient receives.
- **The handoff problem**: Matt Cronin (LinkedIn, ~Nov 2025, read) puts it this way: "gains are often short-lived because they break at the handoff". When the gift ends, the recipient can't take over payment without starting from scratch. A commenter describes the familiar call: "the confirmation email came to me, but you should get one too?"

Numbers: none of these sources publish gift-to-paid conversion rates. One magazine-publisher guide assertions a "20% revenue gain" for publishers that push gifts hard. I saw that only as a search snippet, from an unknown source, and didn't check it. **Don't quote any number.** Measure our own instead.

## How to do it (the pattern)
1. **Sell a fixed term, not a recurring gift.** Charge once for 1, 3 or 12 months. There's no subscription on the buyer's card, so a forgotten auto-renew can't come back as a dispute; Stripe charges **£20 for each dispute** (stripe.com, read).
2. **Give the buyer a code and a link, and let them choose when it's delivered.** Default to "I'll hand it over myself" (they print or forward it), with a dated email as the option. Tell the buyer on the page exactly what the recipient gets.
3. **Make redemption take no card**: name and email only. Refuse the code if that browser or email already has paid access, and offer a refund instead.
4. **Count it separately.** A gift is revenue at purchase, but it isn't a recurring member. Keep three counts: paying members, gift members, family members.
5. **Plan the handoff before you sell.** Send a reminder 7 days before the end and again the day before. Each reminder has a one-tap "continue at £49.99/mo" link that pre-fills the recipient's email. If they don't continue, they keep any free tier and get one later email, and that's it.
6. **Keep one permanent link** (for example /learn/gift/). Mention it in December, and around St David's Day and 28 July if the academy is still running then.

## How we apply it to Cedwyn (PROPOSAL, needs GO)
- **Reuse what's already built.** The /learn/ redeem endpoint already validates a hashed code and gives a browser 400 days of access (FAMILY-CODE.md). A gift is the same mechanism with three differences: a **single-use** code, an **expiry** matching the paid term, and plan:"gift".
  - Mint the code server-side after a paid Stripe Checkout session, using the same {CHECKOUT_SESSION_ID} pattern as stripe-payment-link-per-scene-access-codes-own-entitlements.md.
  - Show the code once on the thank-you page, and email it via the receipt.
- **Options to put to the project lead, with no prices invented here:** a 1-month gift at the current £49.99, or a 3-month gift at 3 × £49.99. Both keep the price fixed. Any discounted gift price would be a price change, so it's his call.
- **member_sync.py:** add a "gift" class beside "family" and keep it out of the sales alert. A gift *purchase* is still a sale, so alert on the Stripe payment, not on the redeem.
- **Wording:** neutral. Something like "Give the Academy: 1 month of full access, redeemed with a code, no card needed for the recipient." No explanatory block on shop pages (the project lead's 19:18 rule): put the details behind the ⓘ dialog, as in shelf-first-ebook-shop-info-modal.md.
- **UK cancellation:** the gift gives immediate digital access, so the same consent tick applies as for the per-scene codes. It's the buyer who agrees, at checkout (see the UK digital-content right-to-cancel skill).
- **Before building, decide:** whether a recipient who already has paid access gets a refund or the gift added to the end of their membership. Ghost refuses and refunds; adding the time is kinder but harder to build.

## Sources
- ghost.org (read 30 Oct 2026)
- memberful.com (read)
- writestack.io (read; third-party guide, 6 Sep 2026)
- linkedin.com (read)
- stripe.com (dispute fee, read 30 Oct 2026)
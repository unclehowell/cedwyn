# Google Play Books promotions: promo codes, scheduled price drops and how often to run them

Harvested 2026-10-31 (skills harvest). Fills a gap: google-play-books-partner-center-ebooks.md covers listing a book but not promotions. Kobo's Promotions tab and general pricing are already covered elsewhere (see INDEX).

## The rules (Google Partner Center Help, read 2026-10-31)
There are three promotion types plus series subscriptions:
| Type | Who gets it | Notes |
|---|---|---|
| **Promo codes** | People you give the code to; the list price stays the same | Free, % off (ebooks only) or fixed price. Up to **3 campaigns a month**, each with up to **5,000 codes**. Start date any time in the next year; end date up to 3 years after the start. "One code" (shared, with a set number of uses) or "multiple codes" (unique codes, downloaded as a CSV). Each customer can redeem once. A campaign can be paused or resumed but **not edited**. All books in a campaign must be on sale in every chosen country with the same revenue split; Japan and India need a separate campaign. |
| **Promotional pricing** | Everyone, in the countries you choose | A temporary lower list price between set dates. It starts 00:00 and ends 23:59 in the earliest time zone where the book is sold. A one-day promo uses the same start and end date. During a promo the book "may be featured" on the Play Store or in Play marketing emails. Overlapping promos: the lowest price wins. Can't be edited: remove it before it starts, or End it (prices revert within 24 h). Bulk upload: UTF-16LE tab-separated CSV with Identifier/Currency/Amount/Countries. |
| **Series bundle / series subscription** | Series only | Not relevant until there are 3 or more Cedwyn titles set up as a series. |
- Countries: **United Kingdom, United States, Argentina, Spain and Mexico show no ✘** in the availability table. **Uruguay** shows ✘ in three columns, and several Latin American markets (Chile, Colombia, Peru, Bolivia, Paraguay) show ✘ in two.
- To promote, the book must already be on sale. You need Book Catalog or Admin access, and Admin to accept the promotion terms the first time.

## Practitioner numbers
- **PublishDrive data (172 English ebooks, 13,335 promotion entries, Dec 2019 to Feb 2020; Written Word Media)**. This is old data, but it is the only public dataset of its kind:
  - The best ROI came from cutting a higher price: about **70% off**, e.g. $2.99 to $0.99. **On Google, books listed above $5.99 did best on price promos.** Apple Books readers barely reacted.
  - One promoted title lifted **whole-catalogue sales about 10% a month**. The month after a first promo, sales grew **123%**, and after the second, sales at full price more than doubled.
  - Frequency: the 1st promo gave +150% sales value, the 2nd +210%. **A 3rd within two months gave no lift.** So run no more than **2 price promos per title in any 2 months**.
- **Payout on codes (Written Word Media example):** a $3.99 book bought with a 50% code paid the author **$1.40**. Codes cost margin but don't drop the public price.
- Code warning (WWM): anyone who finds a shared one-code link can use it, so always set a use limit before posting a code publicly.

## Playbook
1. **List at a price that leaves room to discount.** If our Play list price is under £3.99, a 70% cut is meaningless. Check the current Play price for each title first.
2. **Codes for named people, price promos for moments.**
   - **Multiple-code campaign (unique codes)** for reviewers, Welsh-learner tutors, libraries and press: free, valid 60 days, 25–50 codes. Log who got which code in HubSpot so redemptions show which contacts read it.
   - **One-code campaign** for a newsletter or launch post: 50% off, with a use limit of 100, a 14-day window and a UTM-tagged landing page that shows the code and the redemption URL.
   - **Promotional pricing** for 1–3 day dated hooks only (Calan Gaeaf, St David's Day 1 Mar, 28 July landing-day anniversary). GB + US + AR, about 70% off, **at most 2 per title per 2 months**.
3. **Stack exposure on promo days.** Play's own featuring isn't guaranteed. Point the newsletter, Facebook page and Instagram at the Play link on the promo day only.
4. **Measure.** Download the promotion report from the Promotional Pricing tab. Compare units sold and revenue in the 7 days before, during and 30 days after (WWM saw post-promo lift). Code campaigns report redemptions per campaign.
5. **Price parity check.** Before any Play price drop, check whether the same e-book is in KDP Select (which would rule out Play entirely) or on Kindle at a higher price. Amazon may price-match a lower Play price, and that would cut Kindle royalties. Run the promo only where the project lead accepts that risk.

## How we apply it to Cedwyn
- No spend. Codes and price promos are free; what they cost is margin.
- First action, as a HubSpot proposal for the project lead: one unique-code campaign of 30 free codes for Welsh-learner tutors, Chubut popular libraries and heritage reviewers who already sit in drafts. Each code goes only inside a HubSpot draft the project lead sends himself.
- Put **1 March 2027 (St David's Day)** on the calendar as the first price-promo test: GB/US/AR, 72 h, about 70% off. Log before/during/after units in the project workspace
- Prices and promos are the project lead's decision (programme-office rule: prices are proposals). Record this as a proposal in the project workspace, not as an action.

## Tool proposal (not installed)
None needed. The Partner Center CSV template plus a pandas before/after sales comparison (pandas is already in the kernel) covers the measuring.

## Sources
- support.google.com (Get started with promotions; types + country table; read)
- support.google.com (promotional pricing campaigns; read)
- support.google.com (promo codes: 3 campaigns/month, 5,000 codes; read)
- writtenwordmedia.com (PublishDrive dataset; read)
- writtenwordmedia.com ($3.99/50% -> $1.40 payout; read)
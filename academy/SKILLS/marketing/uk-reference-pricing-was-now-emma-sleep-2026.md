# "Was £9.99, now £4.99": UK reference pricing after the Emma Sleep ruling

**What it is:** any price shown beside a higher one: was/now, a struck-through price, "introductory price", "price rises to £X on [date]", an RRP, or a competitor's price. In the UK a reference price is legal only if it is genuine. The 2026 High Court judgment in CMA v Emma Sleep is the newest word on what "genuine" means.

## What the sources show (read 27 Oct 2026)
- **CTSI "Guidance for Traders on Pricing Practices"** (Business Companion, updated for the DMCC Act 2024, read; section 17). It names four kinds of reference price: was/now, after-promotion/introductory, RRP and external competitor prices. Its tests, each with "more likely / less likely to comply" examples:
  - **Duration:** the comparison should run for the same time or less than the higher price ran.
  - **Recency:** "less than two months ago with no intervening prices" is its compliant example; prices "charged many months ago" are not.
  - **Immediately preceding:** "£500, then £350 with no claim, then weeks later 'Was £500 now £350'" is its non-compliant example.
  - **Sales:** evidence of significant sales at the higher price, or a realistic expectation of them. "A retailer repeatedly uses a reference price, knowing that it had not previously sold a significant number of units at that price" is the non-compliant example.
  - **No other discount** running during the higher-price period (e.g. multibuy).
  - **Each later claim must give a bigger discount**, not a smaller one.
  - **After-promotion / introductory prices (17.1-17.2):** likely unfair "if the price is not subsequently increased" when the promotion ends. How long "new" lasts depends on how often the product is bought.
  - **RRPs (17.3):** never set your own RRP.
- **Gowling WLG, "A wake-up call on reference pricing: High Court rejects CMA's 1:2 ratio"** (4 Aug 2026, read; a law firm's summary, the judgment itself not read).
  - The Court refused the CMA's rule of at least 1 sale at the reference price for every 2 at the discount. It held that low or even zero sales at the reference price do not automatically mislead.
  - What counts instead: whether the trader genuinely and reasonably believed it could make meaningful sales at the higher price; whether the higher price ran at least as long as the discount; and whether it was the immediately preceding price.
  - "The longer the discount period, the weaker the reference price becomes."
  - Emma Sleep admitted breaches where under 1% of sales were at the reference price, and for a new product never offered at the higher price.
  - Final order terms are still open: a further hearing is set for Q4 2026.
  - Under the DMCCA the CMA can now fine directly, without going to court.
- **Already in this folder:** `uk-dmcc-act-urgency-reviews-price-copy.md` (fake countdowns, Sch.20 para 7) and `price-endings-charm-vs-round-ebooks.md` (£4.99 vs £5). This file covers the was/now part those leave as "not checked".
- **CMA209** (price transparency, 18 Nov 2025 edition, read in part) covers drip pricing and total price, not was/now. Don't cite it for reference prices.

## How to do it (any small direct shop)
1. **Keep a price log:** date, product, price, channel, sales at that price. Without it no was/now claim can be shown to be genuine. `tools/ref_price_check.py` reads that log.
2. **Default to no reference price.** Say what the price is and why ("newest edition £4.99; first edition free"). A plain low price breaks no rule.
3. **Use was/now only if every one of these holds:** the higher price was the last one charged; it ran at least as long as the discount will; it ended under 2 months ago; you can show real sales at it, or a reasonable belief at the time that it would sell; and no other discount ran alongside it.
4. **"Introductory price" or "price rises on [date]":** only if the rise is on a calendar and actually happens. Put the date in the copy, then raise the price on that day.
5. **Never quote a "value" figure made of separate prices you never charged as one** (for example "£79.99 of books for £19.99"), unless that bundle sum is a real price list buyers can pay today.
6. **Review every running offer monthly.** End it, or drop the "was", once the discount has run longer than the higher price did.

## How we apply it to Cedwyn
- **Today's facts** (the project workspace, ebook-store/4999-notes.md, root notes 27 Oct):
  - Cedwyn's e-books have been £49.99, £19.99, £14.99, £24.99, £9.99 and now £4.99 across versions and links since 20 Oct.
  - Revenue on record is £0.00, with no paid sessions at £9.99.
  - The YouTube descriptions were changed on 27 Oct from £9.99 to "first edition free, newest now £4.99". They name no old price, which is fine.
- **Rule for every channel (site, YouTube, Facebook, Instagram, email, Gumroad): NO "was £9.99", no struck-through £9.99, no "50% off".**
  - The £9.99 price had no sales.
  - It was not the only intervening price.
  - With the current ladder, any reduction would soon outlast the higher price.
  - These are exactly the cases Emma Sleep admitted as breaches.
- **The FB reels and captions that still say £9.99** (4999-notes) are a stale price, not a reference claim. Correct them to £4.99 or remove the price. Don't add "now £4.99" beside the old figure.
- **The rising-price ladder is the honest alternative** (`versioned-release-rising-price-ladder.md`): "v0.2 is £4.99; the next edition will be £X." Say "will be" only if the release date and the rise are both scheduled. If the rise slips, update the copy the same day.
- **Bundles:** only show "save £X" against the separate prices that are live and payable at the same moment.
- **Gate:** copy changes ride the sales-fix and on-page runs. Run `tools/ref_price_check.py` on the price log before any comparative price claim goes live. Nothing here needs the project lead, unless he wants an actual sale event, which would then need a genuine higher price first.

## Sources
- businesscompanion.info (CTSI, s.17, read 27 Oct 2026)
- gowlingwlg.com (4 Aug 2026, read; judgment not read)
- competitionandmarkets.blog.gov.uk (CMA blog naming the Emma Sleep reference-pricing concerns; snippet only)
- gov.uk (scope check only)
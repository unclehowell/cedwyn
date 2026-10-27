# Versioned releases with a rising price ladder (free first version, each release dearer)

Read 27 Oct 2026. Context: on 27 Oct the e-books and NFTs moved to whole-release versions: v0.0.1 free, then each release £4.99 more than the last (£4.99, £9.98, £14.97 …).

## What practitioners report (primary sources, read)
- **Leanpub, "How to price a self-published book" (help centre, read in full):** "Publish Early, Publish Often". Publish after the first couple of chapters, then a new version for each new chapter, and **raise the price as you go**. Their worked example: decide the *final* price first ($40 suggested / $35 minimum), then step back down in equal $5 steps across five releases ($20 → $25 → $30 → $35 → $40).
  - **Frame it as a thank-you to early buyers, "not a punishment for latecomers".** Put the ladder in the "About the book" text and in every newsletter or post about the book.
  - Set the normal price higher than feels natural, or a later discount code won't look like a deal.
  - **Free minimum works:** "One of Leanpub's bestselling books, by both copies sold and revenue earned, has a free Minimum Price and a non-free Suggested Price". The page shows "Author earns" beside the slider, and Leanpub states this is the main reason readers pay more than suggested (e.g. moving $23.20 up to $25.00).
- **Leanpub, "If I buy an in-progress ebook, will I get free updates?" (17 Mar 2025, read):** "Yes, you get free updates for as long as the author is updating the book". The download link always serves the latest version. This is the norm buyers of versioned e-books expect.
- **Leanpub royalties (13 Feb 2025, read):** minimum paid price as low as $0.99. Royalty is 80% from $7.99 up and 80% minus 50¢ below that. Scale reference from "Leanpub at Sixteen" (read): dozens of authors have earned over $50,000, hundreds over $10,000.
- **Steam Early Access data (Chris Zukowski, howtomarketagame.com, 19 Sep 2023, read):** games with 10+ reviews that entered and left Early Access since 2014.
  - Median time in Early Access was 260 days (mean 399).
  - Price changes during Early Access had a median of $4.00 and a mean of $5.82.
  - Correlation between a price rise and % positive reviews was −0.23 ("very minor"). His view: "indies should always be increasing their price".
  - Games aren't books, but this is the largest public dataset on raising prices across versions of the same product.
- **UK law, CMA207 "Unfair commercial practices" guidance (DMCC Act, in force 6 Apr 2025, read):** Banned practice 7 is **falsely** stating that a product or its terms are available only for a limited time to force a quick decision; a fake countdown clock is the CMA's own example. A genuine, documented next-release price rise is fine. "Price goes up Friday" with no real release behind it is not.

## How to run a rising ladder (checklist)
1. **Compute prices in pence, never in floats or by mental arithmetic.** Price of vN = (N−1) × step, with v1 = 0. Use `tools/price_ladder.py` (below).
2. Publish the ladder on the product page: "v0.0.1 free · v0.0.2 £4.99 · next release £9.98". Show the current version as default with an upgrade line. The free link stays visible.
3. Announce each release as news with a changelog: what's new, how many pages or records were added. Make the price step the reward for early readers, never a threat.
4. Only state a price-rise date when the next release is real and dated (CMA banned practice 7). No fake timers.
5. **Decide the upgrade policy before the second paid release.** The market norm (Leanpub) is free updates for existing buyers. Options:
   (a) free updates within the same major version, for example all v0.x;
   (b) an upgrade at the difference between the two prices;
   (c) each version a separate purchase, as now. If you choose (c), say so plainly at checkout so nobody feels cheated.
6. Track per-version sales and refunds. If a version step brings refunds or complaints, slow the step down rather than reversing prices already paid.

## How we apply it to Cedwyn
- **Current state (27 Oct):** v0.0.1 free, v0.0.2 £4.99 (replacing the old £9.99 v0.02), step £4.99. The bundle is the sum of the latest versions. Worker 82ec3efa is building the drop-down and the "free version (v0.0.1 2026)" link.
- **Do now (in that build's scope, done by that worker):** the page shows the ladder and the next price. Prices are generated from `tools/price_ladder.py` output or the same pence arithmetic, never typed by hand. This is the class of slip caught at 05:18 GMT on 27 Oct.
- **PROPOSED, the project lead's decision:** upgrade policy (a), (b) or (c) above, stated on /ebooks/. Recommendation: (b), upgrade at the price difference. It keeps the £4.99 ladder and removes the main reason an early buyer would hold off. Implement with a Stripe promotion code per buyer, or a "previous buyer" price.
- **PROPOSED:** each release email (Mailchimp) leads with the changelog and the honest next price. No countdowns.
- **Not for NFTs yet:** they show "Coming soon", so no prices go live. When they launch, the same ladder applies per piece (v0.0.1 free preview).

## Tool
- `tools/price_ladder.py`: our own stdlib script (no install). `python3 tools/price_ladder.py --step 4.99 --versions 6` prints v0.0.1 £0.00 … v0.0.6 £24.95, all in integer pence. `--bundle 0.0.2,0.0.2,0.0.3,0.0.2` sums those versions' prices.

## Sources
- help.leanpub.com
- help.leanpub.com
- help.leanpub.com
- leanpub.com
- howtomarketagame.com
- gov.uk
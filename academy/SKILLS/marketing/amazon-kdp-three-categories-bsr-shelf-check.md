# Amazon KDP: choosing the 3 categories with a Best Sellers Rank shelf check (PROPOSAL)
Harvested 30 Oct 2026. Follows amazon-kdp-7-keyword-boxes-subtitle-autocomplete.md, which covers keywords only; 'kdp categor' and 'browse categor' had 0 skill files before. The e-books are sold through Stripe and Gumroad, and any KDP listing needs the project lead's GO, so this is a proposal only.

## Amazon's rules (KDP Help G200652170, read 30 Oct 2026)
- "You can select **3 categories** when creating a book in KDP." Categories and keywords together tell Amazon where to "shelve" the book.
- Tips: research where similar books sit; "Pick accurate categories"; "Balance popularity and relevance", not so broad or so narrow that the book gets lost. Where no category fits, use keywords instead.
- To change them: Bookshelf → … → Edit details. Check **Primary Audience and Primary Marketplace first**, then Edit categories, Remove and pick again. Changes take **up to 72 hours** to show and are reviewed: "We do not tolerate categorization that misleads readers."
- KDP Support "cannot give you specific recommendations".

## Practitioner method (Manuscript Report, 2026 guide, read)
1. **Comp titles:** find 5–10 similar books that sell. Under Product Details, "Best Sellers Rank" shows the browse categories each book ranks in. Note the ones that fit ours.
2. **Shelf check:** open the category's bestseller list and look at the #1 and #20 books' overall Kindle Store BSR. Their benchmarks: **#20 under 10,000 = very competitive; 10,000–50,000 = moderate; over 50,000 = achievable for most authors.** A category whose #1 book sits around #42,000 store-wide "is a shelf you can win this quarter".
3. Top-100 (better, top-20) in a category earns the orange "Best Seller" or "Hot New Release" badge, which feeds "also bought" recommendations. BSR-to-sales figures are curve fits: treat them as ranges.

## How to do it
- Choose a **3-shelf mix**: 1 accurate and moderately competitive (for example, Welsh history), 1 niche we can win (#20 BSR over 50k; for example, local or regional history, or genealogy), and 1 adjacent reader shelf (for example, legal history or true stories of land disputes), but only if the content is genuinely about that.
- Check on **amazon.co.uk** as well as .com: the UK store is the main market and the shelf trees differ. Set Primary Marketplace to Amazon.co.uk.
- Note each shelf's #1 and #20 BSR in a small CSV with a date, then re-check 2 weeks after launch. Swap only a shelf the book doesn't rank in.
- Don't put keywords that repeat the category names in the 7 keyword boxes (see the keywords skill).

## How we apply it to Cedwyn (PROPOSAL, needs the project lead's GO for KDP)
- The candidate shelves for the Great House Farm e-books are not checked live yet. The next harvest or BIZDEV run, read-only, should fill `the project workspace` (store, category path, #1 BSR, #20 BSR, date) for 6–8 Welsh, local and legal-history shelves on amazon.co.uk.
- Prices stay as listed (v0.0.2 £4.99). KDP's 70% royalty band and Select/KU trade-offs are in amazon-kdp-2026-price-band-select-vs-direct.md, so they are not repeated here.
- Use accurate shelves only. A "true crime" or "deception" shelf would break both Amazon's misleading-categorisation rule and our banned-words rule.

## Sources
- kdp.amazon.com (read)
- manuscriptreport.com (read)
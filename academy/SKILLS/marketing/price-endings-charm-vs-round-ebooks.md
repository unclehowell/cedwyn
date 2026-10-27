# Price endings for e-books: £9.99 vs £10 vs £9, and when a round price fits

Skill harvested 2026-10-27 00:00 GMT (skills harvest). Scope: how the last digits of a price change demand, for direct e-book prices on Stripe/Gumroad. Price levels, bundles, PWYW, local-currency pricing, Van Westendorp and Black Friday reference prices are separate skills already in the index.

## What the evidence shows

1. **9-endings raised demand in all three field experiments** (Anderson & Simester, Quantitative Marketing and Economics 1(1), 2003; abstract read on RePEc). Price endings were experimentally varied in three field studies (the abstract's words; the mail-order catalogue design is from secondary summaries, not checked). Effect was **stronger for new items** than for items sold in earlier years, and **weaker when "Sale" cues were present**: the authors read it as 9-endings working best when buyers have little price information. The often-quoted "+22% on new items, ~10% on items seen before" comes from a secondary summary (Daniel Pink, LinkedIn): not checked against the paper.
2. **Left-digit bias is large** (Strulov-Shlain, Review of Economic Studies 2023; paper read). Scanner data on 3,500 products at 25 US chains: shoppers "respond to a one-cent increase from a ninety-nine-ending price as if it were more than a twenty-cent increase". Retailers under-use this and forgo 1-4% of gross profit. Grocery data, low prices: transfer to a £9.99 e-book is plausible but not checked.
3. **Round prices fit feeling-led purchases** (Wadhwa & Zhang, Journal of Consumer Research 41(5), 2015; abstract read on RePEc). Round prices (e.g. $200.00) are processed fluently and push reliance on feelings; non-round prices ($198.76) push reliance on cognition. A price "feels right" when its roundness matches the decision: round for emotional or hedonic buys, non-round for reasoned or utilitarian ones. Effect sizes not checked (full paper not read).
4. Sale cues weaken the 9-ending effect (item 1), and UK rules on "was" prices and showing the full price are already covered in black-friday-cyber-weekend-small-ebook-shop-uk.md and uk-digital-checkout-reg37-consent-vat.md.

## How to use it

- **Information-rich, reasoned buy** (a reference report, an evidence pack): keep the 99 ending (£9.99). It crosses the left digit (9 vs 10) and suits new titles buyers have never priced.
- **Feeling-led buy** (a gift, a family or heritage keepsake, a supporter purchase): a round price (£10, £30) can fit better. Use it on a separate gift path, not by changing the core price.
- Endings only matter where a left digit changes: £31.99 vs £32 changes the second digit, not the first, so the gain is small. £29.99 crosses 30, but it is a £2 cut, not a presentation tweak.
- Don't mix endings on one page without a reason: a uniform ladder (£4.99 / £9.99 / £31.99) reads as one shop.
- Price tests need traffic. At a few visitors a day, a split test of endings cannot reach significance (ab-testing-small-lists.md; tools/ab_stats.py samplesize). Pick by the evidence and judge any change over at least two weeks (ALLi data in ebook-pricing-bundles-direct.md).
- In Gumroad and Stripe, the price shown is exactly the number set, VAT-inclusive for UK buyers. Show it once, in full, by the buy button.

## How we apply it to Cedwyn

- Live /ebooks/ (26 Oct 23:58): singles £9.99, one £4.99 item, bundle £31.99, free editions; 0 sales. **The 99 endings are right for the singles** (new titles, reasoned evidence reading): keep them.
- Bundle at £31.99: no left-digit gain over £32. Leave it unless a bundle price review happens anyway. Then compare £29.99 (crosses 30, about 3 singles' price) with keeping £31.99, by margin, not by ending.
- Gift path (ebook-gifting-christmas-gift-path-guide-email.md): a round gift price (e.g. a £10 single or £30 bundle gift edition) matches a feeling-led gift buy (Wadhwa & Zhang). PROPOSAL only.
- Any price change is a PROPOSAL for the project lead (append to the project workspace with this evidence); never change Stripe or Gumroad prices without his yes.

## Sources

- ideas.repec.org (Anderson & Simester 2003 abstract, read)
- gwern.net (Strulov-Shlain, REStud 2023; abstract and intro read)
- ideas.repec.org (Wadhwa & Zhang 2015 abstract, read)
- linkedin.com (secondary summary; 22%/10% not checked)
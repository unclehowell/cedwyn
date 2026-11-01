# Price framing for a low-priced e-book: show the whole price, not "1p a page"

Skill harvest 2026-11-01 ~01:15Z. Topic: e-book pricing/offer framing. Fills a gap: 'price framing', 'pennies', 'Gourville' and 'temporal reframing' had 0 skill files. It is a guard skill: it stops a tempting copy change that the evidence states backfires at our price.

## The temptation
Once the free-vs-full gap is explained, the next instinct is "404 pages for £4.99, about 1p a page" or "less than a coffee". This is the pennies-a-day (PAD) tactic: cut a price into small units so it feels trivial.

## What the evidence states
- **Gourville 1998, Journal of Consumer Research 24(4):395-408** (abstract read via RePEc/JSTOR). Reframing an aggregate cost as a small daily one works by changing what people compare it with. It "systematically fosters the retrieval and consideration of small ongoing expenses as the standard of comparison".
- **The headline number** (as reported in a Psychology Today summary of Gourville, 2019; the original table was not read): payroll-giving request at "85 cents per day" = 52% agreed, vs "$300 per year" = 30%. Note that this is a large aggregate ($300), cut down.
- **Gourville 2003, Marketing Letters 14:125-135** (abstract/snippets only). Tested commonplace transactions across a wide range of price points. A citing paper's summary table (Emerald, Eur. J. Marketing 58(11)) reports: "more aggregate framing is preferred to less aggregate framing" as the size of the underlying expense goes down. Not checked against the full text.
- **Bambauer-Sachse & Grewal 2011, Journal of Retailing 87(2):156-165** (abstract read in full). Reframed prices beat aggregate prices for **high-priced** products, with **even** price endings, and for customers with poor calculation affinity. **Aggregate prices beat reframed ones for low-priced products, odd price endings,** and customers good at sums.
- **Shown together.** A related study (ResearchGate abstract, "Consumer Evaluations of Temporal Reframing of Prices") found more favourable perceptions when the reframed price appears **together with** the aggregate. So reframing never replaces the total, even where it helps.

## The rule that falls out
| Situation | Use |
|---|---|
| Low price (an e-book at £2.99-£9.99), odd ending (.99) | Aggregate price only, plus a content quantity (pages, records) |
| High price / subscription / course (£50+), even ending | Reframed price may help; always show the total beside it |
| Bundle | Total plus a count ("4 books, £19.96"). No "save £x" unless a real, current single price makes it true (CMA/DMCC rules; see versioned-release-rising-price-ladder.md) |

Quantity is not price framing. "£4.99, 221 pages" gives the buyer a size to judge value by without cutting the price into slices. That fits the evidence above. "About 2p a page" does not.

## How to do it
1. Check the price level and ending. Under about £10 with a .99 ending: no per-unit or per-day price anywhere (cards, Stripe product name, social posts, emails).
2. Pair the total with one concrete quantity the free option lacks (pages, records, periods). See free-vs-paid-edition-comparison-table-explicit-differences.md.
3. If a reframed price is ever tested (only on the £-higher items: an academy membership, a guided walk), show it beside the total and A/B it with tools/seq_ab.py. Don't roll it out from the 1998 result alone.
4. Log the copy in the sales-fix log, so a later run doesn't "discover" PAD as a new fix.

## How we apply it to Cedwyn
- E-books are £4.99 (odd ending, low price) and the bundle is £19.96. Both fall on the "aggregate" side of Bambauer-Sachse & Grewal. **Don't** write "1p a page", "less than a coffee" or "pennies a day" on /ebooks/, the shelf lines, the Stripe or Gumroad names, or the YouTube shop line.
- PR #94's line ("£4.99: the full book, 221 pages. Free: a 20-page preview.") already does it right: total plus quantity. Keep it that way in any rewrite.
- Bundle: "All 4 for £19.96" is fine. No "save" or "was" (the owner's standing rule already bans "save" wording). Gumroad still shows the old £9.99/£31.99, which only the owner can edit, so don't quote a cross-store comparison.
- The /learn/ academy membership, if priced well above the e-books, is the one place a reframed price could be tested later. That is a PROPOSAL for the owner's queue, not a change.
- Never name the owner in public copy. Tymawr / Tŷ Mawr are valid name forms. No banned words.

## Sources
- ideas.repec.org (Gourville 1998 abstract, read)
- jstor.org (same, snippet)
- psychologytoday.com (52% vs 30% figures, secondary, read)
- link.springer.com (Gourville 2003, snippet only)
- emerald.com (summary-table snippet only)
- ideas.repec.org (Bambauer-Sachse & Grewal 2011 abstract, read)
- researchgate.net (abstract snippet)
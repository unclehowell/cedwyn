# Versioned e-book: what a purchase includes (update entitlement + keep-forever)

Read 1 Nov 2026. For the Cedwyn version ladder (latest paid; each earlier version £4.99 less; v0.0.1 free).

## The practitioner pattern
Sellers of versioned products state, at the point of sale, exactly which future versions a purchase covers. Three settled models:

1. **Free updates for the life of the edition; a new edition is a new purchase.**
   Pragmatic Bookshelf FAQ (pragprog.com, page read 1 Nov 2026): "When you buy an ebook from us, you're entitled to free updates for the lifetime of that edition of the book. If we create a new edition, then that will be a separate purchase." The same FAQ: beta-book buyers get "the final edition eBook for free for the lifetime of that edition."
2. **Buy early, get the final free** (early-access).
   Manning MEAP (manning.com, search snippet 1 Nov 2026): "you read a book chapter-by-chapter while it's being written and get the final eBook as soon as it's finished."
3. **Keep the version you paid for forever; updates for a fixed period.**
   Sketch pricing (sketch.com, snippet): "Yours to keep, forever. $120 per seat, includes one year of updates." JetBrains perpetual fallback licence (sales.jetbrains.com, snippet): you can "use a software version indefinitely", but newer versions need a new purchase or renewal.

What they share: the buyer never loses what they bought, and the page states in one line what is and isn't included. Where this is unclear, buyers hesitate. A buyer who fears that next month's version makes today's purchase worthless delays the purchase. Our reading: that matters for Cedwyn, where versions ship often.

## How to do it
1. Pick one of the three models and write it as **one line** under the price on every product card and checkout: e.g. "Includes every correction to v0.3 free. You keep this version for good."
2. Map it to semver:
   - **PATCH** (x.y.Z: typos, fixes) is always free to existing buyers.
   - **MINOR/MAJOR** (new chapters, new evidence) is a new version on the ladder.
3. **Keep-forever:** a buyer's download link for the version they bought must never break when a newer version ships. Store files by version (`<book>.v0.3.0.pdf`), never overwrite them.
4. **Owner upgrade price** (optional; this is a decision, not a default): an owner of an earlier paid version upgrades to the latest for *latest price minus what they paid*. This follows the common software "upgrade pricing" practice, which gives existing users a discount "out of respect for the money they have already" paid (r/apple thread on Mac App Store paid upgrades, snippet).
5. Put the entitlement line in the changelog modal footer too, so the "(i)" table answers "do I get this if I already bought?"
6. Test: track checkouts per card for 14 days with and without the line. The A/B stopping rule is in sequential-ab-test skill files already in the index.

## How we apply it to Cedwyn
- The ladder's price for any version is computed (4.99 × steps above v0.0.1). The entitlement line rides beside it in the gate dropdown and on /ebooks/ cards: "Includes free corrections to this version; you keep it for good."
- PATCH releases of a paid version are free re-downloads for its buyers. Only MINOR/MAJOR bumps add a ladder step. That stops the ladder from charging for a typo fix.
- Version files stay addressable by semver (already the movie convention `movie/<id>/<id>.<lang>.v<semver>.webm`). Use the same for PDFs so old purchases never break.
- **PROPOSAL** (owner decision, logged, not built): owner upgrade price = latest − paid, applied through a Stripe coupon or access code. No new payment code.
- Copy rules hold: "preview" for the free cut, whole price with the page count, no per-page figure.

## Sources
- pragprog.com (page read 1 Nov 2026; quoted)
- manning.com (search snippet)
- sketch.com (search snippet)
- sales.jetbrains.com (search snippet)
- reddit.com (search snippet; practitioner opinion)
# Free preview vs paid edition: a two-column comparison that states the difference

Skill harvest 2026-11-01 ~01:15Z. Topic: funnel/CRO, e-book offer framing. Fills a gap: "comparison table" had 0 skill files. It appeared only as one A+ Content panel idea in amazon-kdp-a-plus-content-ebook-panel-proposal.md.

## The problem it solves
When a free option and a paid option look alike, people take the free one. NN/g puts it this way: "When the key differences between choices are implied or buried, users often select the wrong option or misunderstand the features" and, without explicit differences, "users are likely to assume all choices are the same". Our own funnel (sales-fix run 43, 01:00Z 1 Nov) fits this. There are about 9 free downloads a day, 0 visitor checkouts in 7 days, and 4 of 9 cards call a 13 to 24 page preview "Free v0.0.1".

## What the practitioner source states (NN/g, read in full 1 Nov 2026)
Sources: "Comparison Tables for Products, Services, and Features" and "Explicitly State the Difference Between Options" (an update of Nielsen 2013).
- **Use a table when the choice is compensatory.** That means a small set (under 5 to 7 options) where people weigh merits against each other. NN/g names membership levels and pricing packages as good fits. A static, prebuilt table suits 5 or fewer options.
- **Skip the table for cheap, simple or unique items,** where people "satisfice". Our honest reading: a £4.99 book is cheap, so keep it to a few rows. The two editions of the same book are not unique items, so a short table still fits.
- **Content beats design.** Fill every cell, keep the same units in each row, and don't leave blanks or "zip, zero, zilch" cells.
- **Highlight the differences.** If the options differ on only a few attributes, put those rows first. Merge the cells of attributes that are the same in both columns.
- **Make attributes meaningful.** Translate a raw spec into something people recognise. NN/g's example is "about the size of a tube of lipstick". For a book, that means pages, periods covered and records reproduced, not file size.
- **Mobile:** support some comparison on small screens. Use 2 columns maximum, keep headers visible, and avoid side-scrolling.
- **Golden rule:** "do the work for the consumer".
- **No lift figure is published.** This is usability guidance from observed sessions, not an A/B result. Measure our own effect (below).

## How to do it (any free/paid pair)
1. List what each edition contains, in rows. Use the same unit across the row: pages, chapters or periods, records or documents reproduced (with catalogue IDs), sources list, languages, formats (PDF/EPUB), updates.
2. Delete the rows that are the same in both editions, or merge them into one full-width row ("Both: PDF, English").
3. Order the rows by difference size. Pages first, then what the extra pages contain.
4. Name the columns plainly: "Free preview (20 pages)" and "Full book, £4.99". Don't call the preview a "version" or "edition" if it is an excerpt. Those words imply a complete book.
5. Put the price only in the paid column header, beside the Buy button. Add no "was" price, no "save", and no per-page price (see price-framing-aggregate-vs-per-page-low-price-ebooks.md).
6. Size for 390 px: 2 columns, 3 to 5 rows, no horizontal scroll, header row sticky if longer.
7. Measure the split, not just sales: per book, Buy clicks / (Buy clicks + free downloads), 14 days before vs after. The sample is tiny, so read it with tools/seq_ab.py, or as a plain before/after with no claim of significance.

## How we apply it to Cedwyn
- PR #94 (sf43) adds one line under each Buy, for example "£4.99: the full book, 221 pages. Free: a 20-page preview." That is the one-row version. The next step is a 3 to 4 row table on each book's own page, not on the shelf. NN/g's point is that cheap items need little comparison, so the shelf keeps its one line.
- **Rows for the 4 preview books** (Concealment and Government Involvement, Projects, Dartboard, Tŷ Mawr Deaths): pages (20 vs 221/187/404/69), periods or chapters covered, records reproduced with catalogue IDs, sources list. Fill the cells from the PDFs (page counts were already read in run 43). Don't estimate.
- **Rows for the 3 heritage books,** where £4.99 adds only 14/19/9 pages: a table makes the small gap visible. So name exactly what those pages are, for example "adds the 1840s tithe pages and 6 records". If nothing worth naming is there, that is a pricing finding for the owner's decision queue, not a copy problem.
- **Wiki book:** the free first edition is the whole book (2,033 vs 1,987 pp). A table would show the paid edition offering less. Don't build one for it, and leave the price note as already logged.
- Trilingual pages: translate the row labels (cy/en/es). Cell values are numbers and stay the same.
- Rules: Tymawr / Tŷ Mawr are valid name forms. Keep to the editorial rules (no banned words in cells, no accusations). Add no outbound links. Change no prices.
- Owner of the change: the sales-fix worker or a site-wide PR to main via tools/ebook_shelf.py. Never edit pages under the repair freeze directly; leave a patch in the project workspace if in doubt.

## Sources
- nngroup.com (read 1 Nov 2026)
- nngroup.com (read 1 Nov 2026)
- nngroup.com (title/snippet only)
- Internal: the project workspace run 43 (funnel numbers, page counts)
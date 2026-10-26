# Free EPUB storefronts: Kobo Writing Life, itch.io, Books2Read links (and why not Draft2Digital now)
Harvested 26 Oct 2026 (skills harvest). Google Play Books is already covered in google-play-books-partner-center-ebooks.md. EPUB builds: epub-editions-sphinx-epubcheck.md (+ tools/epub_lint.py).

## Which shelves are still free to list on (checked 26 Oct 2026)
| Shelf | Cost to list | What we keep | Notes |
|---|---|---|---|
| Kobo Writing Life (KWL) | Free | 70% of list price if at or above the regional floor (UK £1.99, US $2.99, EUR 1.99), else 45%; public-domain 20% | Also feeds Kobo Plus (non-exclusive subscription) at 60% of value-per-minute; OverDrive libraries 50% of library price. 70% also needs the e-book priced at least 20% below any print edition. Reports on the 25th; payout after 45 days; $50 CAD minimum. |
| itch.io | Free | Default 90% (Open Revenue Share slider, 0-100% to itch) minus PayPal/Stripe fee (about $0.30 + 2.9%) | Any price is a minimum: buyers can pay more. itch.io's own figure: 30% of all money spent is above the minimum; average purchase about $1.50 over. PDF + EPUB files on one page. |
| Books2Read Universal Book Link | Free, no account needed | n/a (a link, not a shop) | One short link that sends each reader to their own store. Free account adds click counts and store preferences. |
| Draft2Digital | **No longer free** | about 90% of retailer net (D2D keeps about 10% of retail price) | From 15 Apr 2026: $20 one-time activation fee when distribution is switched on, plus $12/yr for accounts earning under $100 net in 12 months. Under the project lead's never-pay rule: skip unless he approves the fee. |

Sources: KWL earnings + terms as re-read 12 Oct 2026 in publishing.co.uk's KWL guide (Kobo's own Zendesk pages block our fetcher); kobowritinglife.zendesk.com "How does Kobo Plus pay?" (60% of revenue/minutes-read); kobowritinglife.zendesk.com promotions article; itch.io and /payments; books2read.com; draft2digital.com and ALLi's 2026 fee explainer.

## Practitioner evidence
- **Kobo store share:** KWL titles were 25% of Kobo's English-language e-book sales (Kobo's Tara Cremin, via ALLi, Feb 2022).
- **Kobo Promotions tab:** submit titles to Kobo's merchandisers from the dashboard (ask KWL to enable it). Most promotions now carry a charge (flat fee or a share of margin), and Kobo asks you to confirm the work was not written by a language model. Free placements exist but are rare: treat any paid promotion as needing the project lead's GO.
- **Kobo Plus payout example (Kobo's own):** a book that takes 3 hours to read earned about 0.29 in that month's example (180 min x 0.0027 x 60%). Low per read, but non-exclusive, so it costs nothing to opt in.
- **itch.io as a book shop:** used by indie novelists for books and bonus material (Dax Murray, "Leaving KU part III"); Creator Day (e.g. 28 Nov 2025) waives itch's share and authors run sales that day.

## How to do it
1. Build one EPUB per title and language from the Sphinx sources; run tools/epub_lint.py, then (if Java is ever available) EPUBCheck. Never convert from PDF.
2. **Kobo (free):** create a KWL account (the project lead's identity, his bank details for payouts: owner step). Upload EPUB + cover, set the UK price to at least £1.99 (keeps 70%), opt in to Kobo Plus, set world rights, description, categories (History > Europe > Great Britain; Genealogy), keywords. Free titles: KWL allows £0.00.
3. **itch.io (free):** create a "book" project page; upload PDF + EPUB; price = minimum (e.g. £9.99 title, Enwau at £0 with "donate" prompt); write the page in the same headline-first style as Cedwyn; tags: history, wales, genealogy, non-fiction, ebook.
4. **Books2Read (free):** once Kobo, Google Play Books and our own /ebooks/ page exist, make one Universal Book Link per title and use it in posts where the reader's store matters.
5. Keep our own /ebooks/ (Stripe) as the default link in Cedwyn pages and bio: we keep the most there. Stores add discovery, not margin.
6. Log each listing (store, URL, price, date) in the project workspace and add the store links to the e-book's JSON-LD `sameAs`/offers later.

## How we apply it to Cedwyn
- Order: Kobo first (free, 70%, Kobo Plus + libraries), then itch.io, then Books2Read links. Skip Draft2Digital (fee) unless the project lead approves.
- Owner steps only the project lead can do: open the KWL and itch.io accounts in his name with payout details. Everything else (EPUBs, descriptions, covers, keywords) Tab prepares in the project workspace
- First candidate: the free "Enwau: the names of Tŷ Mawr" (EPUB already test-built, 156 KB) as a £0 listing on Kobo and a pay-what-you-want page on itch.io, with a one-link end page pointing to the £9.99 title (see ebook-back-matter-one-next-step.md).

## Sources
- publishing.co.uk (KWL royalty table, UK £1.99 floor, 20%-below-print rule, payout terms; re-read 12 Oct 2026)
- kobowritinglife.zendesk.com
- kobowritinglife.zendesk.com
- selfpublishingadvice.org (KWL = 25% of Kobo English e-book sales)
- itch.io ; itch.io
- books2read.com
- draft2digital.com ; selfpublishingadvice.org
- dreaming.daxmurray.com
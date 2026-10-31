# Spain's fixed book price (Ley 10/2007) for e-books: one euro price, every channel, and what discounts are still legal

Harvested 31 Oct 2026 (skills harvest). Before this run the index only flagged Spain as "fixed price, coverage of e-books **not checked**" (`google-play-books-local-prices-ars-mxn-fixed-price-read-aloud.md`). This file reads the statute itself (BOE consolidated text) and settles that point. Proposals only: no price was changed anywhere.

## What the law states (BOE-A-2007-12351, consolidated text, read 31 Oct 2026)
- **E-books are covered.** Art. 2(a): "Se entienden incluidos en la definición de libro ... **los libros electrónicos** y los libros que se publiquen o se difundan por Internet".
- **The publisher (or importer) sets the price, and it binds every seller.** Art. 9.1: whoever "edita, importa o reimporta libros" must set "un precio fijo de venta al público ... con independencia del lugar en que se realice la venta o del procedimiento u operador económico". Art. 9.7: retailers, wholesalers and any operator selling at retail "está obligado a respetar el precio fijado por el editor".
- **Tolerance is 5%.** Art. 9.3: the retail price may sit between **95% and 100%** of the fixed price. So a €5.99 fixed price allows a sale price no lower than **€5.69**.
- **Bundles** (art. 9.5): a complete collection may carry its own lower fixed price than the sum of its titles. That is the legal way to price a two-book Spanish bundle below two singles.
- **Legal discounts** (art. 11):
  - up to **10%** on Día del Libro (23 April) and at book fairs, congresses or exhibitions, when their trade organisers decide it;
  - up to **15%** when the buyer is a library, archive, museum, school, university or research body;
  - an annual offer agreed between publishers, distributors and booksellers.
- **Exclusions** (art. 10.1): out-of-catalogue titles (h), and (i) a retailer may sell below the fixed price once **two years** have passed since the last edition and the book has been offered for at least **six months**. Free promotional editions are excluded only if clearly marked as such (f).
- **Penalties** (sanctions article): selling one copy at a different price is a minor infringement, **€1,000–10,000**. Selling more than one copy at a different price is serious, **€10,001–100,000**.
- **Practitioner reading** (Bookmundo, "Fixed book prices", read 31 Oct 2026): Spain "bind[s] the publisher directly, not just retailers: in Spain, you can't modify the price you've set until two years have passed and the book has been continuously offered for at least six months". The BOE text we read puts the two-year/six-month rule on the **retailer** (art. 10.1.i). Whether a separate rule also locks the publisher's own price change is **not checked** against the implementing decree. Treat the price as locked for safety.

## Store mechanics and numbers
- **VAT on e-books in Spain is 4%** (KDP royalty help page G200644210, read). Its worked example: €1.99 incl. VAT, 70% rate, 1 MB file → **€1.27** royalty, with the line "We don't price-match your book". The fixed price is the consumer price **including** the 4% IVA.
- **Google Play** wants a typed local price wherever prices are fixed by law; "converted prices should not be used" (already in `google-play-books-local-prices-ars-mxn-fixed-price-read-aloud.md`).
- **The trap is our own shop.** Our GBP checkout converts at the card's daily rate, so a Spanish buyer pays a euro amount that drifts away from the stores' fixed price. A drift above 100% or below 95% of the fixed price is a different price under art. 9.

## How-to: one euro price kept identical everywhere
1. Pick **one fixed price incl. 4% IVA** per Spanish-language edition (e.g. €5.99) and write it in a single source of truth (the edition's metadata file), with the date set.
2. Type that exact figure as the **EUR / Spain** price in every dashboard: Kobo Writing Life, Apple, Google Play (typed, never converted), and KDP (amazon.es). Never let a store auto-convert from GBP.
3. **Our own shop:** either sell the Spanish edition to Spain only at a **fixed EUR price** (e.g. a Stripe price in EUR equal to the store figure), or send Spanish buyers to the stores. Never show a GBP-converted figure as the Spanish price.
4. **Promotions:** no store-wide sale or coupon for Spanish buyers deeper than **5%**. Plan the legal ones: up to 10% on **23 April** (Día del Libro) if the trade organisers run it, and up to 15% to libraries and universities.
5. **Free copies:** label review or promo copies "ejemplar promocional, no venal". Never run a €0 or 99-cent Spain promo on a priced edition.
6. **Before any price change,** log the date the price was set and wait at least until the two-year/six-month point unless the edition changes (a new edition can carry a new price).
7. **Quarterly check:** read the live price on each store's .es page, and record it if it falls outside 95–100% of the fixed price.

## How we apply it to Cedwyn
- **La visita (Spanish edition):** propose one fixed price of **€5.99 incl. IVA**, inside the €5–7.99 band in `spanish-ebook-stores-routes-la-visita-casa-del-libro-bajalibros.md`. Type it identically on KWL, Apple, Google Play and amazon.es when the owner gives the go to list. PROPOSAL, no spend.
- **Our /ebooks/ checkout** (GBP, via Stripe/Gumroad): when La visita is sold direct, add a **EUR price equal to €5.99** for Spanish buyers, or link Spain to the stores. PROPOSAL; prices change only on the owner's word.
- **Launch:** no "launch price" or percentage-off for Spain beyond 5%. Mark **23 April 2027** (Día del Libro) for the one legal 10% moment.
- **English editions** sold into Spain: if they are listed on .es stores, the same rule applies per our reading of art. 9.1 (import). A foreign publisher selling direct is **not checked**, so keep parity anyway.
- **Bundle:** if a Spanish two-title bundle is ever made, art. 9.5 allows a single lower bundle price.

## Sources (read 31 Oct 2026)
- BOE, Ley 10/2007 de la lectura, del libro y de las bibliotecas, consolidated: boe.es (arts. 2, 9, 10, 11 and the sanctions article)
- KDP Help, eBook royalties (Spain example, 4% VAT): kdp.amazon.com
- Bookmundo, Fixed book prices (publisher-side reading): bookmundo.com
- Prior file: google-play-books-local-prices-ars-mxn-fixed-price-read-aloud.md
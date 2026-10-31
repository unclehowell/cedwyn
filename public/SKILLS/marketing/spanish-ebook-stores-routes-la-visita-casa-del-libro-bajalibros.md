# Selling the Spanish edition ("La visita") where Spanish-language readers buy: market sizes, the stores, and the free routes

Topic: which Spanish-language e-book stores matter, and how a small UK seller with one Spanish EPUB (*La visita de Llandough: guía de bolsillo*) gets onto them without paying. Written 31 Oct 2026, skills harvest. Before this run no skill file mentioned Casa del Libro, Bajalibros, Tagus, De Marque or Bookwire.

## What the sources show (read 31 Oct 2026)
- **Size and shape of the market, from De Marque's *Informe Anual del Libro Digital 2025*** (De Marque was formerly Libranda, the main distributor of Spanish-language e-books; report covered by PYMES Magazine on 20 Apr 2026, read):
  - The Spanish-language e-book market was **€130M in 2025**, up 1.2%. **Spain €74M (57%)**, Mexico 20%, the USA 10%.
  - **Unit sales are 87.6%** of the market, through "Amazon, Apple, Google, Kobo, Casa del Libro, FNAC or Gandhi". Subscriptions (Kindle Unlimited, Nextory, Scribd, 24Symbols, Skoobe) are 5.6%.
  - eBiblio, the public library e-lending platform, had almost **4.8M loans** (+16.6%) and about 240,000 unique users.
  - The average Spanish e-book price is about **€8 before VAT**.
- **Bookwire Spanish Market Report 2026** (covers 2025; ebook section read):
  - **72.86%** of e-books bought from Spanish publishers cost **€5–12.99**. The most popular band is €5–7.99. Above **€15** works as a barrier.
  - The average price was **€7.37** (down from €7.61).
  - In **Latin America, non-fiction is 55%** of e-book revenue and rising. In Spain, fiction is 77%.
  - Small and mid-sized publishers find their readers on **subscription** (Nextory, Kobo Plus). Subscription reading doesn't eat into unit sales. Bookwire also finds that putting the e-book in libraries late loses the launch momentum.
  - **85.2%** of e-book sales by Latin American publishers happen in the Americas.
- **The Spanish-language stores the big English-language aggregators miss.** In PublishDrive's aggregator comparison (read), only one route lists all three: **StreetLib's** partner list includes **Casa del Libro, Bajalibros, Leamos, Librerías Gandhi, Odilo, 24Symbols, Storytel, Tocalivros, Ubook, Peru Bookstore**. XinXii lists Casa del Libro and Fnac. ScribeCount (2026, read): StreetLib "distributes to Casa del Libro (Spain's major online book retailer), FNAC Spain, and other Iberian and Latin American channels", and calls the Spanish-language market "one of the most underserved by English-language aggregators".
- **StreetLib's plans** (its own blog, read):
  - **Basic:** free forever, e-book only, **70% of net**, non-exclusive per channel. It "does not include Amazon or major retailers".
  - **Pro:** $99/yr, 85%, all partners.
  - **Not checked:** which Spanish-language stores are switched on for Basic.
- **Bajalibros** describes itself as "La mayor tienda de eBooks en español" (its Instagram, 65K followers). Its storefront is ar.bajalibros.com, in Argentina, where our Patagonia readers are.
- **Casa del Libro's** app still opens its **Tagus** reading app (Google Play listing, snippet).

## How to do it (a small seller, zero spend)
1. **Shelf you already reach:** price La visita for the Spanish-language stores the free routes already cover:
   - Google Play, per-country prices, see `google-play-books-partner-center-ebooks.md`.
   - Kobo via Kobo Writing Life, which covers Kobo's Spanish and Mexican storefronts and Kobo Plus.
   - Apple, see `apple-books-direct-promo-codes-preorders.md`.
   - Amazon.es and .com.mx through KDP.
   Set local prices inside the **€5–7.99** band (e.g. €5.99 / MX$119 / ARS via Google's local pricing). Stay under €15 regardless.
2. **Add the Spanish-only stores free:** open StreetLib **Basic** for La visita only. In the channel list, switch on only the stores *not* already reached directly: Casa del Libro, Bajalibros, Leamos, Gandhi, Odilo and 24Symbols if offered on Basic. Leave Kobo, Apple and Google off there, so nothing is listed twice under two distributors. If Basic doesn't include them, the alternative is Pro at $99/yr. That is spend, so it's a PROPOSAL for the owner, never done by an agent.
3. **ISBN:** a store-specific free ISBN locks the book to that distributor. Use the edition's own ISBN if one exists, so the same ISBN appears everywhere. Otherwise note which distributor's ISBN the record carries.
4. **Metadata in Spanish:**
   - Spanish title and subtitle and a Spanish description, not a translated English blurb. See `plain-english-reading-level-sales-copy.md`; the same rules apply in Spanish.
   - BISAC/Thema codes for travel guide plus Welsh local history, and keywords readers in Chubut actually type ("galeses en Patagonia", "Gales", "Trelew", "guía de bolsillo").
   - Language `es` in the OPF (already correct, see below).
5. **Libraries:** keep library channels (Odilo; OverDrive via Kobo, see `library-elending-overdrive-libby-via-kobo.md`) open from day one. Bookwire's 2026 finding is that late library release loses the launch boost. eBiblio itself buys through public tenders from distributors (De Marque/Odilo). Whether a one-title UK microenterprise can join De Marque wasn't checked.
6. **Measure for 60 days:** sales by store and by country, and Bajalibros/Casa del Libro sales against Google/Kobo Spain. Drop any channel that still has zero sales and zero listing views after 90 days.

## How we apply it to Cedwyn
- **Today's state (read-only check of `the project workspace`):** OPF language is `es`, which is correct. The title is "La visita de Llandough: guía de bolsillo". There is no accessibility metadata, and 16 of 17 page files have no `lang` on `<html>`; see `epub-accessibility-check-no-install-ace-app-pubcoder-thorium.md`. Fix both before any store upload.
- **PROPOSAL 1 (no spend, needs the owner's go to list):** list La visita on Google Play and Kobo Writing Life with ES/MX/AR prices in the €5–7.99 band.
- **PROPOSAL 2 (no spend):** open StreetLib Basic for La visita only and enable the Spanish-language stores the direct routes can't reach, with **Bajalibros first**, because it sells in Argentina in pesos. Read `argentina-card-surcharges-30pct-ebook-checkout-es.md` first: a local-currency store spares Chubut buyers the 30% card surcharge they pay on our GBP checkout. If Basic excludes them, the $99 Pro plan is a separate spend decision for the owner.
- **Positioning:** Latin American e-book revenue is majority non-fiction (55%), which suits a guide plus history title. Pitch La visita in Spanish to the Chubut press and societies (`chubut-spanish-press-jornada-elchubut-radio.md`, `welsh-patagonian-societies-chubut-outreach.md`) with the store links once live. Drafts only.
- Nothing has been listed or changed. This file is proposals only.

## Sources
- pymesmagazine.es (De Marque 2025 report figures; read)
- bookwire.es (Bookwire 2026, ebook section; read)
- publishdrive.com (aggregator store lists; read; a competitor's description, so StreetLib's own channel list is still to be confirmed)
- blog.streetlib.com (Basic/Pro; read)
- scribecount.com (2026; read)
- ar.bajalibros.com and Bajalibros Instagram (snippets)
# Selling the Spanish edition in Mexico: Kobo (70%, no lock-in) first, Amazon.com.mx at 35% unless we go exclusive, Gandhi via an aggregator

Harvested 31 Oct 2026 (skills harvest). Before this run the index had no Mexico pricing skill: "amazon.com.mx" and "MXN" appeared only in a next-leads note. Mexico is about **20% of the Spanish-language e-book market** (De Marque 2025, in `spanish-ebook-stores-routes-la-visita-casa-del-libro-bajalibros.md`). Proposals only; nothing was listed or priced.

## What the sources show (read 31 Oct 2026)
- **Amazon KDP, "eBook list price requirements" (help page, read):**
  - **MXN, 70% option:** list price **MXN 34.99 to 199.99**.
  - **MXN, 35% option:** minimum MXN 11.99 for files under 3 MB (23.99 for 3–10 MB), maximum MXN 2,500.
  - The catch, verbatim: "For sales to customers in **Brazil, Japan, Mexico, and India**, Digital Books must also be **enrolled in KDP Select** to be eligible for the 70% royalty option."
  - KDP Select means e-book exclusivity to Amazon. That would mean leaving Kobo, Google Play, StreetLib stores and our own shop.
  - Outside Select, a Mexican Kindle sale pays **35%**.
  - The same page states the US 70% ceiling rose from $9.99 to $12.99 in 2026 (covered in `amazon-kdp-2026-price-band-select-vs-direct.md`).
- **Kobo Writing Life, "What will my earnings be?" (read):** 70% of list price (excluding taxes) when the price is at least **MXN 39.99**; below that, 45%. KWL lets you set a custom price per dedicated storefront, and recommends .99 endings in the major English-speaking stores ("How to Set the Price", 13 Aug 2026).
  - Kobo Plus also runs in Mexico at MXN 140 a month (see `kobo-plus-vs-nextory-spanish-edition-subscription-gate.md`).
  - PublishDrive's 2026 data puts Kobo's **Mexico growth at +85%** in 2025, the 4th fastest of its markets.
- **Librerías Gandhi:** Mexico's large bookshop chain sells e-books through "Gandhi Digital" (gandhi.com.mx; its help pages cover reading e-books and audiobooks).
  - A reader thread (snippet) states Gandhi e-books can't be moved straight to a Kindle. That fits protected EPUB, but Gandhi's DRM and app were **not checked**.
  - Gandhi has no self-publisher upload. It's reached through aggregators: the existing Spanish-stores file records Gandhi in StreetLib's store list (from PublishDrive's comparison; StreetLib's own list is still to be confirmed).
  - Which aggregator Gandhi itself uses was **not checked**.
- **Pricing band (Bookwire 2026, in the existing file):** 72.86% of Spanish-language e-book sales are €5–12.99, the sweet spot is €5–7.99, and €15 is a barrier. In Latin America, non-fiction is 55% of e-book revenue.
- **Tax:** KWL royalties are on the price excluding taxes. Mexico's IVA treatment of e-books is **not checked**: snippets mention 0% for books under LIVA art. 2-A, and 2026 SAT statements on books moving from exempt to 0%. Kobo and Amazon collect and remit for their stores, so this matters only for a direct MXN checkout of our own.

## The decision in numbers (our arithmetic, labelled)
Example price MXN 129, inside the €5–7.99 band at about MXN 20–22 to the euro. That rate is **not checked today**; convert on the day.
- **Kobo Mexico:** 70% × 129 ≈ **MXN 90** per sale.
- **Amazon.com.mx, not in Select:** 35% × 129 ≈ **MXN 45**.
- **Amazon.com.mx in Select:** 70% ≈ MXN 90, but every other store is lost (Kobo, Google, Gandhi via aggregator, our own shop and Kobo Plus).
- **Result:** stay wide. Kobo pays twice Amazon's Mexican rate without lock-in. Amazon.com.mx is still worth listing at 35%, because that's where most Mexican Kindle owners shop.

## How to run it
1. **Fix the EPUB first:** page `lang`, accessibility metadata, Welsh `lang="cy"` spans (see the a11y and Welsh-tags files).
2. **KWL:** set La visita's default price in EUR or USD, then a custom **MXN** price ending in 9 (for example MXN 99 or 129, both above the MXN 39.99 floor). Kobo Plus on.
3. **KDP:** list wide (not Select). Set the MXN price by hand to match Kobo's, so Mexican shoppers see one price everywhere. Check Amazon's price-matching risk against our own shop first (`amazon-kdp-2026-price-band-select-vs-direct.md`).
4. **Gandhi:** only through the aggregator chosen in the Spanish-stores file. Confirm on the aggregator's own channel page that Gandhi is listed and on which plan, before treating it as live.
5. **Mexico-facing copy:** "guía de bolsillo" plus the Welsh-Patagonian history angle, written in neutral Latin American Spanish. Measure Mexican sales by store in the Sunday report.

## How we apply it to Cedwyn
- **Audience reality:** our Spanish readers are mainly in Chubut, Argentina. Mexico is the second-largest Spanish e-book market, but it has no direct tie to the Welsh story. Treat it as a store setting that costs nothing, not a campaign.
- **Proposal 1 (no spend; owner's go to list):** La visita on KWL with a custom MXN 99–129 price and Kobo Plus on.
- **Proposal 2 (no spend; owner's go):** La visita on KDP **wide at 35% in Mexico**, with the MXN price set by hand. Do **not** enrol in KDP Select: exclusivity would pull it from Kobo (the Argentine and Mexican Kobo Plus readers), Google Play and /ebooks/.
- **Proposal 3:** Gandhi only through the aggregator route already proposed for Bajalibros. Nothing extra to build.
- **Do not:** add an MXN checkout to our own Stripe page for now. Tax not checked, and too few Mexican visitors to justify it (Search Console shows no Spanish queries yet).
- Nothing listed, priced or sent.

## Sources
- kdp.amazon.com (KDP list price requirements, MXN bands and the Select rule for Mexico; read)
- kobowritinglife.zendesk.com (KWL 70% floors incl. MXN 39.99; read)
- kobowritinglife.zendesk.com (custom storefront prices; read)
- kingajentetics.substack.com (Mexico +85% on Kobo; read)
- gandhi.com.mx (Gandhi Digital help; read, thin page)
- bookwire.es (via the existing Spanish-stores file)
- IVA snippets (diputados.gob.mx LIVA; SAT statements via press): not read in full, marked not checked
# Merchant listing structured data for direct-sold e-books (Product + Offer)
Harvested 2026-10-26 (skills harvest). Internal how-to; not public text.

## Why it matters
Google shows Product markup in merchant listing experiences (shopping knowledge panel, Google Images, popular products, product snippets with price). Only pages where a shopper can actually buy are eligible (Google's own rule: "not pages with links to other sites that sell the product"). For a tiny shop with no ad budget this is the free route to a price showing in Search and Images.

## Google's rules that bite (developers.google.com merchant-listing doc, read 26 Oct 2026)
- Required on Product: `name`, `image` (crawlable, indexable, represents the product), `offers`.
- Required on Offer: `price` (or `priceSpecification.price`) + `priceCurrency`. **Merchant listings need price > 0**; product snippets accept 0. So free PDFs (GBP 0.00) can only ever get a snippet, never a merchant listing.
- One product focus per page. A list page (/ebooks/) is not the place for Product markup; each book page is.
- Return policy: recommended. Put one `MerchantReturnPolicy` under the `Organization` (Google's advice for a standard policy) and only override per product.
- Prohibited categories (weapons, drugs, gambling...) are excluded; books are fine.
- Merchant Center product-spec changes are enforced from 31 Jan 2027 (support.google.com) - only matters if we ever add a free Merchant Center feed.

## How-to (30 minutes, markup only)
1. For each paid book page: confirm one JSON-LD node typed `["Book","Product"]` with `name`, `image` (the cover, absolute URL), `description`, `offers{price, priceCurrency:"GBP", availability:InStock, url:<the page itself>}`.
2. Add `"itemCondition":"schema.org and `"bookFormat":"schema.org (Book vocabulary; harmless for Product).
3. Bundle page: Product needs `image` too (a composite of the four covers).
4. Organization node: add `hasMerchantReturnPolicy` matching the real checkout terms. Our checkout text has buyers agree to immediate supply of digital content (UK Consumer Contracts Regs reg.37 waiver), so the honest value is `returnPolicyCategory: MerchantReturnNotPermitted` with `applicableCountry: "GB"` - only if that matches the published terms page; otherwise mirror the terms page exactly.
5. No `aggregateRating` or `review` until real reviews exist on the page (fake/self ratings breach Google's review snippet rules - see reviews-social-proof-direct-ebooks.md).
6. Test each URL in the Rich Results Test (search.google.com) and Schema Markup Validator; fix critical errors; then Search Console > URL Inspection > Request indexing (one per page, not a flood).
7. Watch Search Console "Merchant listings" and "Product snippets" enhancement reports weekly; expect days to weeks.

## Live state found 26 Oct 2026 (cedwyn.bucklerfamily.estate, cache-busted fetch)
- /ebooks/dartboard/: `["Book","Product"]`, image present, Offer GBP 9.99 InStock. Good base.
- /ebooks/all-four/: `Product`, Offer GBP 31.99, **no image** -> fails the required `image`. Fix first.
- /ebooks/ list page: no JSON-LD (correct; leave it).
- The Organization node on the book pages carries `name: "DATRO CONSORTIUM LIMITED"` with `@id .../dartboard/#org` - check with the committer that this is the intended seller name for the shop (the older patch in bizdev/patches/jsonld-ebooks.json used "Cedwyn - Great House Farm archive"). Seller identity should match the checkout/receipt.
- Free editions (GBP 0.00) are snippet-only by Google's rule; do not inflate prices to qualify.

## How we apply it to Cedwyn
- Patch (leave in the project workspace for the sole cedwyn committer, a worker today): add `image` to /ebooks/all-four/, add `itemCondition` + `bookFormat`, add one Organization-level return policy that mirrors the terms page.
- After commit + deploy: Rich Results Test on each paid page, then one Request-indexing each; log in bizdev/log.csv.
- Pairs with gsc-striking-distance-quick-wins.md (watch impressions for the book names) and ebook-sales-page-cro-checkout-friction.md.
- Zero spend; no Merchant Center account needed for this step.

## Sources
- developers.google.com (required props, price > 0, return policy under Organization)
- developers.google.com (Book actions need a data feed via Google's partner programme - not for us)
- support.google.com (Merchant Center spec, enforcement 31 Jan 2027)
- schema.org , schema.org
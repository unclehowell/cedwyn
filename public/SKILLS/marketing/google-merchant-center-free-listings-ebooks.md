# Google Merchant Center free listings for direct-sold e-books (the feed route)
Harvested 2026-10-29 18:30Z (skills harvest). Internal how-to; not public text. Companion to merchant-listing-structured-data-ebooks.md (markup route, 26 Oct).

## The one fact that decides it (Google policy, read 29 Oct 2026)
- Unsupported Shopping content policy (support.google.com): "eBooks and digital books (not including audiobooks) are not allowed. Examples: PDFs, ePub books, MOBI." Directly above it: "Note: This policy only applies to Shopping ads. It does not apply to free listings."
- So: e-books CANNOT be advertised in Shopping ads (we have zero ad budget anyway), but CAN appear free in Google's product surfaces (Shopping tab, Search, Images) through a Merchant Center account.
- Disapproval page (answer/14183113) "Digital books can't be featured in ads": fixes take 24-72 h to show; a review request takes up to 7 business days.
- FeedArmy (Google Ads Diamond Product Expert, read): the e-book ban started 18 May 2021 and "applies to all Merchant Center channels except for Free Listings. This means you can continue to receive free clicks for eBooks." Also: a print book wrongly flagged as an e-book needs category Media > Books > Print Books (543543), print ISBNs, and no "eBook" in title/description.

## Free listings rules that bite for us (answer/13889434, read)
- New Merchant Center accounts are opted in to free listings by default (Marketing > Marketing methods > Free listings card).
- Only product pages are eligible (not home, category or policy pages) - each book's own page, not /ebooks/.
- **UK is on the list of countries where shipping settings are REQUIRED.** For a download: one shipping service, UK, cost GBP 0.00, delivery 0-0 days. Without it the item is not shown.
- Return policy: recommended in Merchant Center; must mirror the real terms (digital content, reg.37 waiver -> no returns, if that is what the terms page states).
- Google may show crawled products from the site even without Merchant Center or markup - so price/availability on the page must already be right.
- Status "on" does not guarantee showing; matching relies on the data supplied.

## What the numbers say (be modest)
- Google's own 2020 launch claim, via agencies (wallaroomedia, beuniquegroup; Google post not opened): +70% clicks and +130% impressions on average across free listings and ads in the US Shopping tab. Old, US, Google's own figure - not checked.
- Practitioner reality (r/GoogleShopping, 2024, read as snippet): ~9,000 free-listing impressions a month, CTR 0.1%, ~5 products with 1-2 clicks each, no sales. Free listings are a trickle for small catalogues unless titles match real searches.
- Google Ads community thread: free-listing clicks can drop to 0 overnight while Merchant Center still shows "OK" (ranking/eligibility change). Monitor, do not depend.

## How-to (about 60 minutes once, then 5 min a week)
1. Create a Merchant Center account in the owner's Google account (a signup in the project lead's name = his GO). Business info: legal seller name exactly as on the checkout/receipt.
2. Verify + claim cedwyn.bucklerfamily.estate (Search Console is already connected for that domain; GSC ownership verifies it).
3. Shipping: UK service "Digital download", GBP 0, 0-0 days. Returns: mirror the terms page.
4. Products: simplest is "Add products from your website" (uses the Product JSON-LD already on each paid book page). Alternative: a Google Sheet feed with id, title, description, link, image_link, availability=in_stock, price "4.99 GBP", condition=new, identifier_exists=no (no ISBN), google_product_category "Media > Books" (do NOT use Print Books for an e-book).
5. Titles: lead with what people search ("Llandough history e-book: Great House Farm records 1840-1990"), not the internal series name. Description: no banned words; plain facts.
6. Price consistency: the price on the page, in the feed and at the Stripe checkout must be identical. **Gumroad still shows GBP 9.99 / 31.99 while the site shows GBP 4.99** - list only the site's Stripe-backed pages, never Gumroad URLs, or the mismatch triggers a price-mismatch disapproval.
7. Never create Shopping ads or Performance Max for e-books (policy ban; and zero spend).
8. Weekly: Merchant Center > Performance (free listings clicks/impressions), Needs attention tab; add `utm_source=google&utm_medium=free_listing` via the link_template/link attribute only if the platform keeps it on the canonical page.

## How we apply it to Cedwyn
- PROPOSAL for the project lead (account in his name): Merchant Center account + free listings for the paid e-book pages only (free GBP 0.00 samples cannot get merchant listings anyway - see the companion skill).
- Pre-work we can do with no account: confirm each paid page's JSON-LD has image + GBP price matching Stripe; confirm the terms page states the digital-content no-returns position; draft the 3-4 search-led titles.
- Drop rule: if free listings bring fewer than 20 clicks in 8 weeks, stop optimising them and leave the account idle (it costs nothing to keep).
- Pairs with chatgpt-shopping-product-feed-ebooks.md (same feed fields, different surface) and gsc-striking-distance-quick-wins.md.

## Sources
- support.google.com (read: e-book ban applies to Shopping ads only, not free listings)
- support.google.com (read: disapproval fix, 24-72 h, 7 business days review)
- support.google.com (read: free listings default on, product pages only, UK shipping required)
- feedarmy.com (read: 18 May 2021 start, free listings exempt)
- wallaroomedia.com (snippet: Google's +70%/+130% claim, not checked)
- reddit.com (snippet: 9,000 impr, 0.1% CTR, no sales)
- support.google.com (snippet: free-listing clicks dropping to 0)
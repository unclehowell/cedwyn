# ChatGPT shopping product feed: getting the e-books into ChatGPT's product results (2026)

Checked 29 Oct 2026. Topic: AI visibility / agentic commerce. Status for Cedwyn: PROPOSAL (the merchant application is a form sent in the project lead's name, so it needs his GO).

## What is true in 2026 (with sources)
- **Timeline.** 29 Sep 2025: OpenAI and Stripe launch Instant Checkout on the Agentic Commerce Protocol (ACP), US only, starting with Etsy sellers. March 2026: OpenAI scales it back; in its own words the first version "did not offer the level of flexibility that we aspire to provide". Purchases now finish **on the merchant's own site** (in-app browser on mobile, new tab on desktop). (closeit.co guide, rewritten July 2026; ringly.io timeline.)
- **Why it was pulled (numbers):** only about **12** of Shopify's merchants went live with in-chat checkout. Shopify's president, Harley Finkelstein, put the bottleneck on the AI side. The blockers were slow merchant onboarding, stale product data, and deception checks. (Rye CEO Arjun Bhargava, 5 Mar 2026. Rye is a vendor with its own angle.)
- **What remains is discovery.** ChatGPT shows product carousels and side-by-side comparisons. OpenAI states these product results are **organic, cannot be bought, and are separate from ChatGPT ads**. Ads have been a US test since Feb 2026. (closeit.co, citing OpenAI's help centre. The OpenAI announcement page returned 403 to us, so this wasn't checked against it directly.) The commonly quoted figure of about 50M shopping queries a day comes from a LinkedIn post about an OpenAI/NBER study. That's a snippet only and not checked.
- **How to get in.** Shopify and Etsy catalogues are pulled in automatically. Everyone else applies at chatgpt.com, which asks for company details, website, categories and SKU count. Approved merchants come off a waitlist. Applying and sending a feed are **free** per OpenAI's docs as reported (closeit.co).
- **The feed spec**, read in full from developers.openai.com
  - Format is JSONL, one item per line.
  - **Required fields:** `item_id`, `title`, `description`, `url`, `brand`, `seller_name`, `image_url`, `availability` and `price`. `availability` must be one of `in_stock`, `out_of_stock`, `pre_order`, `backorder` or `unknown`; a missing or wrong value rejects the row. `price` is written like `"4.99 GBP"`: major units, a space, then the ISO 4217 currency code, with no thousands separators.
  - Search is on by default (`is_eligible_search`); checkout is off by default. "Eligibility does not guarantee display."
  - `is_digital: true` exists but is marked "optional; requires setup". Don't rely on leaving it out.
  - For e-books, `accepts_returns=false` marks a final sale, and `return_policy` can point to the terms URL.
  - **Market:** "The standard OpenAI-format upload currently targets the US". Other markets only once OpenAI confirms them. **The UK is not available yet.**

## How to do it (any small direct seller)
1. **Without a feed:** make sure the product pages can be crawled. Keep `OAI-SearchBot` allowed in robots.txt, use clean Product/Offer JSON-LD with a price, and give each product one stable URL. ChatGPT already uses web data for recommendations.
2. Build the feed. You can do it from the shop's own data: one line per e-book with the required fields, the price matching the product page exactly, and a direct JPEG or PNG cover URL.
3. Validate it locally: `python3 the project workspace feed.jsonl`. This checks the required fields, the availability values, the money format, https URLs and duplicate ids.
4. Apply at chatgpt.com This is an owner step.
5. Once approved, upload the feed and refresh it whenever a price changes. Stale data was one of the three reasons in-chat checkout failed.
6. Measure: tag the feed `url` with `?utm_source=chatgpt&utm_medium=product_feed` and count sessions and sales from it weekly.

## How we apply it to Cedwyn
- **Today, at no cost:** cedwyn's robots.txt already allows every crawler (`User-agent: *  Allow: /`, checked 29 Oct). The merchant-listing markup skill (`merchant-listing-structured-data-ebooks.md`) covers JSON-LD. Nothing more is needed for the web-data route.
- **Feed draft (internal):** generate `the project workspace` from the /ebooks/ catalogue:
  - `brand` "Cedwyn Estate", `seller_name` "Cedwyn Estate";
  - prices in GBP, matching the page (the direct edition is £4.99);
  - `availability` "in_stock", `accepts_returns` false, and `url` with UTMs.
  - Run `oai_feed_check.py` before anything leaves the box.
- **Gate:** the application is a form submitted in the project lead's name, and the standard upload targets the **US only**. Cedwyn's buyers are UK and Wales first (US second, Patagonia Spanish third). Record it as a **PROPOSAL** in `the project workspace`: "apply to the ChatGPT merchant program once UK markets open, or now for US reach; free; owner step". Don't apply without his GO.
- **Gumroad listings** are not auto-integrated (only Shopify and Etsy are), so the feed should point to the direct /ebooks/ pages, not Gumroad.
- **Kill rule:** if the feed is live for 8 weeks and gets fewer than 20 tagged sessions, stop maintaining it and keep only the JSON-LD.

## Sources
- developers.openai.com (read in full, .md version)
- closeit.co (read; July 2026 rewrite citing OpenAI docs)
- rye.com (read; vendor; 5 Mar 2026)
- ringly.io (read; vendor timeline)
- stripe.com (snippet only)
- openai.com (403 to us; not read)
# ChatGPT shopping product feed / Instant Checkout: decision gate for Cedwyn e-books

Skill for: AI visibility on the commerce side, i.e. getting our e-books shown (and maybe bought) inside ChatGPT shopping answers. Read 27 Oct 2026.

## What exists (primary + practitioner)
- **OpenAI Commerce product feed spec** (developers.openai.com, read):
  - Merchants upload a product file: `item_id`, title, description, link, image, price as "18.00 USD", availability, etc.
  - `is_eligible_search` defaults to true. `is_eligible_checkout` opts into Instant Checkout only when checkout is enabled for the integration.
  - `is_digital` exists ("requires setup"). Leaving it out means unspecified: "do not rely on omission for digital checkout".
  - **Geography:** "The standard OpenAI-format upload currently targets the US". `target_countries` currently represents US, CA and MX only, and standard uploads use ["US"] whatever the column states. Other markets only "after OpenAI confirms the integration and its allowed countries and currencies".
  - Eligibility "does not guarantee display".
- **Practitioner testimony** (Rye CEO Arjun Bhargava, 5 Mar 2026, read; a vendor with an interest):
  - OpenAI scaled back native Instant Checkout after **about 12 Shopify merchants** went live, out of millions, and moved purchases to retailer apps (Instacart, Target, Expedia).
  - It quotes Shopify's president: the bottleneck was onboarding on the AI firms' side.
  - The OpenAI spokesperson quote and the "12 merchants" figure are as Rye reports them; not checked against OpenAI.
- Applying needs a merchant application to OpenAI (chatgpt.com returned 403 to us; not read).

## The decision rule
1. **Not now** while: we sell in GBP from a UK store, the feed targets US only, and our books are digital (needs special setup). Applying would cost hours and could show us only to US shoppers with a US-currency price we don't charge.
2. **Do now, zero cost:** make sure ChatGPT's *search* can read the books from our own pages. That traffic is organic, not feed-based.
   - Product/Book JSON-LD with price in GBP, availability and an ISBN-free identifier (see merchant-listing-structured-data-ebooks.md).
   - OAI-SearchBot allowed in robots.txt (check: `curl -s cedwyn.bucklerfamily.estate).
   - A crawlable /ebooks/ page per title with a clear description.
3. **Re-check quarterly.** Open the spec page and look for (a) GB in `target_countries`, (b) GBP accepted, (c) digital items documented as live.
   - When all three are true, draft a feed (CSV from the e-book records: item_id = slug, price "9.99 GBP", is_digital true, is_eligible_checkout false at first) as a PROPOSAL for the project lead.

## How we apply it to Cedwyn
- The VISIBILITY CHECK run (Mon 07:30) adds one line: "ChatGPT commerce feed: GB/GBP/digital supported? yes/no (spec URL, date read)". No application until all three flip.
- The ONPAGE run makes sure of three things: each /ebooks/<title>/ page carries Book + Offer JSON-LD in GBP; OAI-SearchBot isn't blocked; the price on the page matches Stripe/Gumroad exactly. AI answers quoting a stale price would also breach the DMCC pricing rules (uk-dmcc-act-urgency-reviews-price-copy.md).
- Measure: Cloudflare referrers from chatgpt.com, plus the `utm_source=chatgpt.com` that ChatGPT appends to links. Check this in the Sunday growth report: a nonzero count is the signal that commerce work would pay. (The UTM-append behaviour comes from practitioner reports; not checked today.)

## Sources
- developers.openai.com (read: flags, is_digital, US-only geo)
- rye.com (read; vendor blog, 5 Mar 2026)
- chatgpt.com (403, not read)
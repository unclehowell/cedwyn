# Retired rich results gate: which structured data still shows in Google (2026) and what that means for the Academy and e-books

Written 30 Oct 2026, skills harvest. Area: SEO/structured data. Before this run INDEX.md had 0 hits for "course info", "book actions", "learning video" and "sitelinks search". Existing skills cover merchant listings, Event, Dataset, VideoObject/Clip, paywalled markup, site name/breadcrumb and FAQ after its removal. This file is the gate to check **before** anyone spends time adding a new schema type.

## What the sources say (primary, read)
- **Google Search Central, 12 Jun 2025, "Simplifying the search results page":** seven types are being phased out of Search: **Book Actions, Course Info, Claim Review, Estimated Salary, Learning Video, Special Announcement, Vehicle Listing**. In Google's words they are "not commonly used" and "no longer providing significant additional value". Two further points:
  - "This update won't affect how pages are ranked."
  - Use of these types **outside Google Search is not affected**.
- **8 Sep 2025 update to the same post:** Course Info, Claim Review, Estimated Salary, Learning Video, Special Announcement and Vehicle Listing were removed from Search Console reports, the Rich Results Test and the search-appearance filters on 9 Sep 2025. BigQuery bulk-export fields for them go NULL from 1 Oct 2025, so write queries with `IS NOT TRUE` rather than `NOT x`.
- **5 Nov 2025 (John Mueller), "update on our efforts":** more lesser-used SERP features are being phased out. From Jan 2026, Search Console support is removed for those structured-data types. Details live in the documentation changelog.
- **Search gallery (page last updated 16 Oct 2026, read):** the types still supported are:
  - Article, Breadcrumb, Carousel (only with Recipe, **Course list**, Restaurant or Movie), Course list, Dataset, Discussion forum, Education Q&A, Employer rating, Event, Image metadata, Job posting, Local business, Math solver, Movie;
  - Organization, Product, Profile page, Q&A, Recipe, Review snippet (incl. Book), Software app, Speakable, Subscription/paywalled content, Vacation rental, Video.
  - FAQ, HowTo, Book Actions, Course Info and Learning Video are **not** listed.
- **Course list doc (read):** it needs **at least three courses** from the same provider, each with `name` and `description` (60-character display limit) plus a `provider`. Carousel `ItemList` markup goes on a summary or all-in-one page. Promotional names, prices or discounts in course titles are invalid.

## Numbers (treat with care)
- Rich results and CTR: the "Milestone Research, 4.5M queries, 58% vs 41% CTR" figure was a search snippet on a UK agency blog (not checked against the original study). Google itself states removals don't change ranking. **Do not promise traffic from schema.**
- No practitioner before/after numbers were found for the June 2025 removals. Google's own claim is that the features rarely triggered.

## How to do it (the gate)
1. Before adding a schema type, open the search gallery. If the type isn't there, Google shows nothing for it. Only add it if another consumer needs it (AI crawlers, the agents.json/llms layer, Dataset Search), and log it as "non-Google".
2. Check the feature's eligibility rule. Course list needs 3 or more courses, merchant listing needs price > 0, Event needs a physical venue, video needs a watch page.
3. Validate with the Rich Results Test. If the test no longer lists the type, that is the retirement signal.
4. Bulk-export or BigQuery reports: use `IS NOT TRUE` / `IS TRUE` on search-appearance booleans so retired fields (NULL) don't drop rows.
5. Recheck the documentation changelog once a month. A retirement is announced there first.

## How we apply it to Cedwyn
- **Live read, 30 Oct 2026 ~11:27Z:**
  - `/learn/` (the Academy, one course with modules, £49.99/month) has **no JSON-LD**;
  - `/ebooks/cedwyn/` carries CreativeWork + Offer + Organization/Place, with no Book Actions;
  - `/ebooks/` has ItemList + WebSite + Organization;
  - `/documentary/` and `/shop/` carry WebPageElement (the paywalled markup).
- **Academy:** do **not** add Course markup for a Google rich result. Course Info is retired, and Course list needs 3 or more separate courses, while the Academy is one course. If the Academy later sells three or more distinct courses (e.g. by records period), add Course list plus a Carousel ItemList on /learn/. Then follow the naming rules: no price, no "founding member" offer in the course name. Until then a plain `Course` block is optional, for AI and agent consumers only, and must be labelled non-Google in the onpage log.
- **E-books:** don't add Book Actions (retired). Merchant-listing markup applies to the £4.99 v0.0.2 page only (price > 0, see merchant-listing skill). The free v0.0.1 gets Product snippet or CreativeWork only. Review snippet on a Book type is allowed only with real reviews collected on the site: none exist today, and never fabricate any.
- **Documentary:** Learning Video is retired. Keep VideoObject/Clip (see webvtt/VideoObject skill) and paywalled markup. No new types.
- **Agent library / academy pages (`/academy/`):** Speakable and Q&A types exist, but Speakable is news-only and Education Q&A is for flashcards. Skip both.
- Proposal to the onpage owner: add a "gallery check" line to the weekly ONPAGE audit (any `@type` on the site not in the supported list gets flagged as non-Google, with no rich-result expectation). No site change today.

## Sources
- developers.google.com (primary, read, incl. 8 Sep 2025 update)
- developers.google.com (primary, read)
- developers.google.com (primary, read, updated 16 Oct 2026)
- developers.google.com (primary, read)
- whitehat-seo.co.uk (CTR figure, snippet only, not checked)
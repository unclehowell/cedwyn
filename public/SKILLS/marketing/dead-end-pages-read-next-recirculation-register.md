# Dead-end pages and "Read next": recirculation for archive and register pages

Topic: give every page that ends with nothing to do a short, relevant next step. Then measure recirculation: the share of visits that go on to a second page.
Date: 2026-10-31 (skills harvest). Zero spend. No tool installed.

## Evidence (read 31 Oct 2026)
- **Chartbeat, "Eliminating Dead-End Pages and Optimizing for Recirculation"** (read). These are Chartbeat's own figures across its publisher network.
  - **Definitions:** recirculation is "the percentage of readers who go beyond the first article". Dead ends are "content without a clear next step", most often "at the bottom of articles, within standalone pages", or where modules "fail to load".
  - **By visitor type:** recirculation is **9.2% for new visitors**, **17.8% for returning visitors** (at least monthly) and **25.4% for loyal visitors** (every other day). "86% of new readers won't return to your site within a week", so the first visit is the one that counts.
  - **Internal traffic:** about **40% of pageviews**.
  - **Search traffic:** still 24% of global weekly pageviews, even though Google search referrals are down 21% since May 2023. Search visitors "arrive with a specific goal in mind" and are more likely to recirculate when the next step is related to what they came for. Social and Discover visitors need the next step to carry the same hook that brought them in.
- **Google News Initiative, "Keep visitors engaged with recirculation"** (training, read). Its best practices:
  - recommend **five stories or fewer**;
  - **an image with every item**, image on the left and title on the right, compressed;
  - rank the items;
  - put **recommended articles above external links**;
  - add a recommended section **after each article**;
  - evergreen explainers work best for recirculation.
  This is guidance, with no numbers.
- No independent before/after test with numbers was found for a site our size. Treat the Chartbeat rates as a benchmark, not a forecast.

## How to do it
1. **Find the dead ends.** List page types where the last screen shows no internal next step other than the site menu or a breadcrumb. Check at 390 px, because mobile readers hit the end and leave.
2. **One block per page type**, placed straight after the content and above any footer links. Use up to 3 items on register-style pages and up to 5 on articles. Each item is a title, a one-line reason and an optional small image.
3. **Choose items by relation, not recency.** Use the same parcel, person, date range or holder first. Then use the nearest neighbour in sequence (previous/next). Then one money or list link (the e-book that covers it, or the free chapter). Never repeat what the page already links to in its body.
4. **Match the item to how the reader arrived** (Chartbeat). Search arrivals get the closest topical page. Social arrivals get the most striking related record. Readers on a second or later page can get the e-book.
5. **Build the blocks at build time** from data already in the build: catalogue IDs, parcels, dates, tags. That means no third-party widget, no extra script and no tracking cookies. Lazy-load the images. GNI notes modules that fail to load create dead ends, so static HTML is safer.
6. **Measure.** Recirculation = pageviews whose referrer host is our own host ÷ landing pageviews, by page type, 14 days before vs 14 days after. Use an internal-link `data-rn` attribute, not query parameters, so caching and canonical URLs stay clean. Count clicks on the money item separately.

## How we apply it to Cedwyn
Live check on 31 Oct 2026 (cache-busted), **/research/missing-records/mr-0057/**:
- The page ends: "Related catalogue entries: None yet", then the footer.
- Its only links are the breadcrumb, a glossary term, two nomenclature terms and a strip-art link. It has **no previous/next record and no link to /ebooks/ or the free chapter**.
- The register index (/research/missing-records/) lists MR-0001 to MR-0057 as plain links. All 57 record pages share the same template, so all 57 are dead ends. These pages are what the intel flywheel publishes most often, and they are exactly the "standalone pages" Chartbeat names.

Proposal (markup in the intel-flywheel page generator only; agents make it through the normal publish route, commits only when no build is running):
1. **"Next in the register" block on each MR page**, placed after "What would fill this page":
   - **← Previous / Next →** by MR number. These are always present, so no page is a dead end.
   - **"Same holder"**: up to 2 other MR pages with the same "Who should hold it" body, for example Registrar of Companies / The National Archives.
   - **"Same years"**: 1 page whose date range overlaps.
   - **One line to the free first chapter** ("Read the free first chapter about the farm's records") linking /ebooks/sample-chapter/. It is an internal link, so it is allowed.
   - Wording stays neutral and dated, with no banned words, nothing that names a person from the family, and no outbound links.
2. **When "Related catalogue entries" is empty, hide the "None yet" line.** Show the block instead, so the page doesn't end on a negative.
3. **Wiki and research article templates:** check whether they end in a dead end. The /wiki/great-house-farm/ page ends with nomenclature and wiki links, so it is fine. Add the same 3-item block only to templates that fail the 390 px end-of-page check.
4. **Measurement:**
   - `the project workspace` already reads `refererHost` by `requestPath` from the Cloudflare Web Analytics dataset for its site tag.
   - The cedwyn HTML showed **no Web Analytics beacon** on 31 Oct, so for cedwyn use the zone's request data (`clientRefererHost` on HTML 200s to /research/missing-records/*; field name **not checked**).
   - Baseline 14 days now, then 14 days after.
   - Expect small numbers. Report the raw counts, not only percentages, and don't claim a lift below about 100 landings per arm (tools/ab_stats.py for the interval).
5. This is a proposal for the intel-flywheel / site agents. It needs no account, money or outward post, so it can go straight to the HubSpot work board as a "[CEDWYN REPO]"-style task if the repo-sync run picks it up.

## Sources
- chartbeat.com
- newsinitiative.withgoogle.com
- help.chartbeat.com (recirculation definition, snippet)
- live pages checked: cedwyn.bucklerfamily.estate , /research/missing-records/ , /wiki/great-house-farm/
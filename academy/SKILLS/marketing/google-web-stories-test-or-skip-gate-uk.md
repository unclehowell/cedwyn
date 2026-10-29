# Google Web Stories: test-or-skip gate for a small UK history site (2026)

Harvested 29 Oct 2026 (SKILLS HARVEST RUN). Topic: SEO / Google visual surfaces. Status: decision gate. Default is SKIP for now; a small test is allowed only if the gate below passes.

## What the evidence states
- **Still supported.** Google's "Enable Web Stories on Google" page (read in full; last updated 1 Jul 2026) is still live. A Story can show as a single result in Search "in all regions and languages". In **Discover** it shows as a tap-through card, but Google itself states that is "most likely to appear in the United States, India, and Brazil". So the UK is not where the format gets its best placement.
- **Hard requirements (Google):** valid AMP; required metadata `publisher-logo-src`, `poster-portrait-src`, `title`, `publisher`; a self-referencing `rel="canonical"`; not blocked by robots.txt or noindex; linked from the site or listed in the sitemap. Language versions use hreflang. Check with the Web Stories Google Test Tool or URL Inspection; there is also a command-line AMP Linter.
- **Impressions, not clicks (practitioner testimony).** Brodie Clark (SEO consultant; post updated 10 Aug 2026) put a Web Story into Google's mobile "Visual Stories" unit in the US. It ranked on page one for "seo" and got "a ton of impressions, with very few clicks". Andrea Volpini saw the same. AWR measured the unit on about **3% of US mobile results** at the time. In Search Console the "Web Story" Search Appearance filter separates this traffic.
- **Prominence has faded (agency view, not checked).** PWD Digital (Australian agency, 2026) states the dedicated carousels are less prominent than in 2021-22 and Stories now compete with ordinary results. Their test plan: 3-5 stories from your strongest visual material, 60-90 days, then decide.
- **Discover is volatile (testimony).** A r/SEO poster said their Discover traffic fell to zero after the 2023 update. An Indian publishers' poll reported falls across web stories and news after the Aug 2025 core update (secondary source, not checked). Google released a Discover core update in Feb 2026.

## The gate (all must be true before building anything)
1. Search Console already shows the site getting Discover traffic, or the Google Search profile / follow route (see `google-search-profiles-discover-follow-gate.md` and `google-discover-heritage-max-image-preview.md`) is live. Without Discover presence, Stories have nowhere to land in the UK.
2. There is a ready visual set: 10-20 strong images with captions and source lines (Google's best practice is 5-30 pages; one point per page).
3. Someone can produce valid AMP and keep each Story's canonical, poster and logo right. A static site can do this by hand from one template; no plugin needed.
4. A real measure exists: the "Web Story" filter in Search Console, plus UTM on the Story's outlink to the shop or e-book page.

If any is false: skip. Put the same images into Instagram carousels, Pinterest pins and YouTube Shorts, which already have skills in the index and reach UK users.

## How to run the test (if the gate passes)
- Build **3 Stories** only, each 10-15 pages, each from one record or one place (for example "The farm on the 1840s tithe map, in 10 frames"). The last page links to the matching evidence page, and one link goes to the e-book page.
- Put them at `/stories/<slug>.html` on the main domain (not a separate host), add them to the sitemap and link each from its parent article.
- Use alt text, a 640x853 portrait poster (3:4) and short on-image text (big type, at most about 10 words a page).
- Run for **8 weeks**. Record impressions, clicks and CTR from the Web Story filter weekly in the growth sheet.
- **Drop rule:** stop if the 3 Stories together get fewer than 20 clicks in 8 weeks, or a CTR below 0.5%. Brodie Clark's pattern of lots of impressions and almost no clicks is the expected failure.

## How we apply it to Cedwyn
- **Today: SKIP.** No Cedwyn page has Discover traffic on record, the Discover card is mostly a US/India/Brazil placement, and the build effort would come out of channels that already reach Welsh and UK readers.
- Re-check the gate in the **Monday visibility check** once Search Console shows any Discover row for cedwyn.bucklerfamily.estate. At that point the first candidate is a "Great House Farm / Tŷ Mawr / Cydfin Farm through the maps" Story built from the quote-card and map images already made.
- Public text rules apply to every Story page: never name the project lead, no banned words, no insignia, nothing about family holdings or addresses, internal links only, purchases via /ebooks/.
- Tooling: nothing installed. If the test ever runs, the AMP validator npm package can be added then; it isn't needed for a skip decision.

## Sources
- Google Search Central, Enable Web Stories on Google (upd 2026-07-01): developers.google.com
- Brodie Clark, 7 Reasons for an Impression Spike in GSC, section 5 (upd 10 Aug 2026): brodieclark.com
- PWD Digital, Google Web Stories in 2026: Are They Worth It? (agency, not checked): pwd.com.au
- r/SEO, "Google Discover Traffic Dropped to Zero" (testimony, search snippet only; page blocked): reddit.com
- Google Search Central blog, Feb 2026 Discover core update (search result only): developers.google.com
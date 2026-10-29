# Apple News and MSN syndication: the eligibility gate (decision: not open to Cedwyn now)
Harvested 28 Oct 2026 01:28Z (skills harvest). Topic: news-aggregator syndication as a traffic channel. Saves future runs from chasing two closed doors; points at what is open.

## What the evidence shows
- Apple developer docs ("Getting Started as an Apple News Publisher", read): "Before you can publish content to Apple News, you must submit information about your publication and samples of your content to the Apple News team." Publishing is via Apple News Format (ANF) through News Publisher, the Apple News API or a CMS plug-in (WordPress/Drupal/Craft/ExpressionEngine only - nothing for a static Cloudflare Pages site).
- Apple News Publisher guide (read 28 Oct): News Publisher allows content in English and Canadian French only. The guide (quoted by Publisher in a Box, read) calls Apple News "a distribution platform for professional publications of a journalistic nature" and excludes publications "Primarily promoting a business, service, or nonprofit", "A personal blog or portfolio" and "Primarily reposting and redistributing others' content"; publishers must be in AU, CA, UK or US. The guide also has "AI-generated content" and "Mark an article as AI-generated or syndicated" sections.
- Publisher in a Box (20 Oct 2026, read): an April 2025 forum post quotes Apple support: "Apple News is no longer accepting unsolicited applications." Signing in to News Publisher with a new Apple Account on 20 Oct 2026 showed no option to register or create a channel. Their verdict: Apple News is a reach and in-app revenue channel, not a referral-traffic channel (ads: 100% direct-sold, 70% backfill, 50% pooled).
- CJR Tow Center audit (read): Apple News had 85M active users (Jan 2019); Top Stories sometimes drove over half of Vox.com's traffic on a day, but Top Stories favoured national outlets over local newsrooms, partly because of the ANF requirement. Upside is real but concentrated in big brands.
- MSN Partner Hub (Microsoft Q&A, Apr and Jul 2026, read): "MSN Partner Hub is invitation-only. To sign up as an MSN Partner, you will need the unique Invite code that was emailed to you by Microsoft." An independent publisher with domain, RSS, Search Console and Google Publisher Center still had no application route.

## The gate (run once a quarter, 10 minutes)
1. Is the publication journalistic, original, English, UK-based and NOT primarily selling its own products? Cedwyn: original archive-based history = partly yes; the /ebooks/ shop and heavy AI drafting = risk; Welsh-language pages ineligible.
2. Is there an open door? Re-check News Publisher sign-up and the MSN Partner Hub page. If still "unsolicited applications closed" / "invitation only": stop. Do not email Apple or Microsoft asking in (outward, needs the project lead's GO, and the evidence states it does not work).
3. If an invitation ever arrives: the project lead's decision; ANF conversion would need a small exporter from our Atom feed, and any AI-assisted article must be marked AI-generated in News Publisher.

## How we apply it to Cedwyn
- Verdict 28 Oct 2026: not open. Log "Apple News / MSN: closed (unsolicited applications / invite-only)" so no run spends time here.
- Put the same effort into the open aggregator routes already in the index: Google Discover (google-discover-heritage-max-image-preview.md), Google Preferred Sources / Search profiles, Flipboard and the Atom feed (rss-atom-feed-websub-static-site.md), Bing/Copilot (bing-webmaster-ai-performance-copilot-citations.md).
- Lesson for the thin-pages audit: aggregators and Google both screen out sites that look mass-produced or self-promotional; fixing /directory/, /docs/ and /email/ helps every one of these doors.

## Sources
- developer.apple.com (read, Markdown copy)
- support.apple.com (read 28 Oct 2026)
- publisherinabox.com (read; dated 20 Oct 2026 sign-in test)
- cjr.org (read)
- learn.microsoft.com and learn.microsoft.com (read)
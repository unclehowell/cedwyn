# Google Preferred Sources: getting readers to pick the site in Top Stories and AI answers

Topic: SEO / AI visibility. Readers can mark a site as a "preferred source"; that site then shows more often in their Top Stories and carries a "preferred" badge in AI Overviews and AI Mode. Harvested 2026-10-26. Distinct from ai-answer-citations-geo (which is about being cited at all): this is about loyal readers choosing us.

## Facts (read at source unless marked)
- Google Search Central doc (updated 2026-09-18, read): available globally for Top Stories in all Search languages; preferred badge also in AI Mode and AI Overviews. Eligibility: the site must be included in Search generative AI features in Search Console, and only DOMAIN or SUBDOMAIN level sites are eligible (a subfolder like example.com is not). Check by typing the site into the source preferences tool.
- Three ways to prompt readers: (1) standard button: <script async src="news.google.com</script> in the head plus <div google-add-preferred-source-btn></div> where the button goes (data-theme light/dark, data-lang override, e.g. "cy" if supported, list not checked); (2) advanced JS with own design; (3) deeplink, usable in emails and social posts: google.com. Official badge assets downloadable. Prompting is optional: sites can be picked without it.
- Google blog 12 Aug 2025 (read): launched US and India for Top Stories; readers see more of chosen sites "when those sources have published fresh and relevant content".
- SEO Kreativ (Christian Ott, updated 19 Oct 2026, read): timeline Dec 2025 English worldwide, 30 Apr 2026 all languages, 27 May 2026 AI Overviews/AI Mode; Google figures quoted there: readers click a preferred source about twice as often; 345,000+ selected sources (27 May 2026), 600,000+ (20 Aug 2026); official button since 20 Aug 2026. The Google statements behind those figures: not checked at Google's own pages.
- No small-publisher case study with before/after numbers found yet (searched 26 Oct): treat uplift as unproven for niche sites.

## How to do it
1. Confirm eligibility: Search Console property for the subdomain; not opted out of generative AI features; site appears in the source preferences tool.
2. Ask once, at moments of loyalty: end of articles, the thank-you page after a free download, the welcome email, a pinned social post. One line: "Want our new finds in your Google results? Add us as a preferred source." + button/deeplink.
3. Freshness matters: the benefit shows only when you publish new, relevant pages on searched topics (Top Stories), so pair it with a steady update rhythm (dated record pages, "new this week").
4. Measure: Search Console Performance, filter Search appearance / News-like surfaces where shown, and the generative AI report (see search-console-generative-ai-performance-report.md); count deeplink clicks with UTM where the link is ours (utm_campaign=preferred-source; the Google URL itself should not get UTM added).
5. Do not bribe or gate (no "add us to download"); keep it a genuine reader choice.

## How we apply it to Cedwyn (PROPOSALS: page and email changes need the owner's GO; cedwyn repo is owned by the migration worker today)
- Eligible shape: cedwyn.bucklerfamily.estate is a subdomain, so it qualifies; /ebooks/ alone would not. Step 0 (read-only, can do now): type the subdomain into the source preferences tool and check Search Console's generative AI inclusion; record the result in the project workspace
- Patch to prepare (not yet written; for the project workspace, never committed by this run): the two-line button in the shared footer beside the guestbook, light theme, English label; Welsh label only if Google lists "cy".
- Welcome email (proposal for the free-chapter sequence): one line with the deeplink google.com
- Content rhythm that makes the badge useful: a dated "new record" page when a find lands (e.g. the 1824 David Stewart estate survey, the first record mention found; the 1667 reference cited to the 1974 newspapers and ITV News 1988).
- Success bar after 60 days: any impressions from Top Stories/AI surfaces in Search Console for the subdomain; if zero, drop the footer button and keep only the email line.

## Sources
- developers.google.com (read)
- blog.google (read)
- seo-kreativ.de (read; practitioner summary)
- digitalapplied.com (snippet, not checked)
# Search Console in 10 minutes a week: Insights report, weekly/monthly views, AI-powered filters

Skill harvested 27 Oct 2026 (06:14Z). Topic: SEO analytics for a small site run by non-specialists.

## What changed (Google's own posts, read 27 Oct 2026)
- **Search Console Insights moved inside Search Console** (Google Search Central blog, 30 Jun 2025). It replaced the standalone beta and is aimed at "content creators, bloggers, and site owners ... without needing to be data experts." It shows total clicks and impressions against the previous period, top pages, **"trending up" and "trending down" pages**, top queries, and **"trending up" queries, which Google calls "a great source for new content ideas."** The "Achievements" milestone emails continue (for example a new 28-day clicks threshold).
- **Weekly and monthly views** (blog, 10 Dec 2025): a "Daily / Weekly / Monthly" drop-down on the Performance chart, for Search results, Google News and Discover. Google's reason: misaligned weekends make daily period comparisons hard to read. Exports change file and tab names, some column headers and sort order when you switch.
- **AI-powered configuration** (blog, 4 Dec 2025, experimental, limited rollout): type a request in plain English and it sets filters (query, page, country, device, search appearance, date), comparisons and metrics. Only the Search results Performance report, not Discover or News. Google warns: "AI can sometimes misinterpret requests. Always review the suggested filters."
- Already covered elsewhere: custom annotations (`search-console-ga4-change-annotations-log.md`), the branded-queries filter and query groups (`search-console-branded-filter-query-groups.md`), the generative-AI and multimodal reports (`search-console-generative-ai-performance-report.md`), social channels (`search-console-platform-properties-social.md`).

## The routine (every Monday, about 10 minutes)
1. **Insights, last 28 days**: note total clicks and impressions vs the previous period, in one line.
2. **Trending-up queries**: copy the top 3 to 5. Each is a candidate for a new page, a new section, or a better title on the page already ranking (pair with `gsc-striking-distance-quick-wins.md`).
3. **Trending-down pages**: for each, check (a) did a build change it (look at the annotations), (b) is it still indexed (`page-indexing-triage-duplicates-canonicals.md`), (c) does it need a refresh (`content-refresh-historical-optimisation-decay.md`).
4. **Performance, Monthly view, compare last 3 months to the previous 3**: at a small site's volume, daily lines are mostly noise. Use weekly or monthly for any number that goes into a report.
5. **Annotate** anything shipped that week (one 120-character note per change).
6. **If AI-powered configuration is on for the property**, use it for one-off questions ("compare clicks for pages containing /ebooks/ this month vs last month"), and read back the filters it set before trusting the chart.

## Pitfalls
- "Trending" on a tiny site can be 3 clicks becoming 9. Write the raw numbers next to any trend you report.
- Switching to Weekly or Monthly changes the export layout; scripts that parse exports must not assume the daily columns.
- Insights covers Google Search only. It is not a whole-site traffic view; Cloudflare logs and Stripe stay the source for visits and sales.

## How we apply it to Cedwyn (proposal)
- **Owner**: the Sunday growth report run (`the project workspace`) and the Monday visibility check can carry steps 1 to 4. Report month-on-month from the Monthly view, with raw counts.
- **Trending-up queries feed** the blog/auto-post topics and the research section's page titles, within the editorial rules (never name the project lead, banned words, no outbound links).
- **Annotate 27 Oct 2026**: share-preview tags live on the homepage and 52 section pages; semver pricing (v0.0.1 free, v0.0.2 £4.99) on /ebooks/; case-page limitation section rewritten. These explain any change in clicks or CTR in the weeks after.
- **Access**: Google Search Console is connected for this account. Whether the connected tool exposes the Insights view or the AI configuration (versus only the raw search analytics query) was **not checked** in this run. Where only raw data is available, weekly and monthly totals can be summed from date-level rows.

## Sources
- developers.google.com
- developers.google.com
- developers.google.com
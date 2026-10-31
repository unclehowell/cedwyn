# Small-web search engines (Marginalia, Kagi Small Web): a free discovery route for a text-heavy heritage site - and its gates

Harvested 2026-10-31 (skills harvest). Checked first: 'marginalia', 'indieweb', 'webring', 'small web' (1 unrelated hit) 0 skill files. Different from search-console / IndexNow / Bing skills (big engines) and from AI-visibility skills.

## Facts (read 31 Oct 2026)
- **Marginalia Search** (independent, open-source AGPL engine favouring text-heavy, non-commercial pages). Live check today: `marginalia-search.com -> **"Unknown Domain. This website is not known to the search engine."** Route in: fork github.com, add the domain to `sites.txt`, open a pull request; "the site will be added to the search engine when the" next crawl runs (repo page + search snippet). 517 forks / 1,071 commits = this is the normal, used path. Marginalia penalises heavy JavaScript/tracking; plain HTML article pages rank best (practitioner consensus, not measured here).
- **Kagi Small Web** (blog.kagi.com + github.com README, read): curated feed list surfaced inside Kagi results, the Small Web site, an RSS feed and the Kagi news-enrichment API. List is ~tens of thousands of feeds (smallweb.txt). **Rules**: personal blogs only (no multi-author); English only; a post within 12 months; **no ads or undisclosed affiliate links; no popups (newsletter signup, cookie selection etc.)**; **no auto-generated / LLM-generated content** - "content must be heavily guided by and reviewed by humans and done at human scale", heavier LLM use should be acknowledged; **if submitting your own site you must add at least 2 other sites that are not yours** in the same commit. Small YouTube: channel must post **no more than twice a week** and have <100k subscribers.
- Traffic size: no source with visitor numbers for either engine was found -> expect small, high-intent numbers; treat as a long-tail, not a fix for the "too few visitors" problem.

## How to do it
1. **Marginalia (fits now)**: one PR adding `cedwyn.bucklerfamily.estate` to sites.txt (sorted, one line, nothing else). Before submitting, make sure the article pages render their text without JS and robots.txt does not block unknown crawlers. Check `/site/<domain>` weekly for "known" status and document count.
2. **Kagi Small Web (gate - mostly NOT eligible today)**: the shop site fails three rules: (a) any signup slide-in/popup on the page (check what is live) = popup; (b) much text is agent-drafted (would need human review + an acknowledgement line); (c) it is a multi-section estate site, not a personal blog. Only an owner-written personal blog with an RSS feed, no signup popup, could qualify - and the submitter must add 2 other genuine small blogs (e.g. Welsh local-history bloggers already known to us) at the same time.
3. **Small YouTube (NOT eligible)**: the Cedwyn channel's daily Shorts schedule (1-2/day) breaks the <=2 posts/week rule. Do not submit.
4. Never game either list (no keyword pages, no auto-generated posts); both remove sites on report.

## How we apply it to Cedwyn
- PROPOSAL (owner GO; it is a public PR from the connected GitHub account to a third-party repo, and today's rule is contact no one): Marginalia sites.txt PR for cedwyn.bucklerfamily.estate. Zero cost, one line.
- Pre-check with existing tools (no install): fetch 5 top article pages with curl, confirm body text present in raw HTML; confirm robots.txt allows `search.marginalia.nu` / generic bots.
- Kagi: record as GATED; reopen only if a human-written personal blog with RSS and no popup exists.
- Measure: Cloudflare referrer `marginalia` / `kagi` counts monthly; kill after 3 months with 0 referrals.

## Sources
- marginalia-search.com (read live 31 Oct 2026: Unknown Domain)
- github.com (read: forks/commits; PR method via snippet)
- blog.kagi.com (read)
- raw.githubusercontent.com (read: rules)
- raw.githubusercontent.com (read: list size; bucklerfamily not listed)
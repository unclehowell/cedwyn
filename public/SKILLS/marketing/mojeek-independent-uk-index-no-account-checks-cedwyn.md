# Mojeek: the UK's independent search index. Free, no-account checks for cedwyn (on-site action)

Topic picked 31 Oct 2026 because 'mojeek' had 0 hits in INDEX.md, root-skip-additions.txt, the skill files and all of the project workspace It is search and AI visibility outside Google and Bing.

## Why it matters (primary sources, read today)
- **Its own crawler, index and ranking.** It isn't a front end for Bing or Google. About page: "From a personal project to indexing over nine billion pages"; "2025 Mojeek passes 9 billion pages"; 2024 passed 8 billion; 2024 added Semantic Search and Search Summary. In 2015 it became "the only search engine in the UK ... to index over a billion pages".
- **The only independent European index.** Mojeek blog, 18 May 2026: "In Europe, Mojeek stands alone, after two decades building an independent search engine with proprietary web crawler, search index and ranking".
- **It feeds other tools.** It sells a Web Search API that third parties combine with "data from any search engine or large language model" (Mojeek blog, Mar 2023). Bing retired its Search APIs on 11 Aug 2025 (Mojeek community thread), which leaves few independent indexes for small search and AI tools to draw on. Being in Mojeek is cheap insurance outside Google and Bing.
- **No traffic share found:** I found no 2026 share figure for Mojeek. Expect few direct visits. The value is coverage, not volume.

## How Mojeek finds and ranks a site (Mojeek's own words)
- "there is currently no way to manually submit your site to Mojeek". There is no sitemap or URL submission (blog 28 Mar 2015; community threads 2022-2025 repeat it).
- "Mojeek recommends getting prominent and genuine links to your site". Discovery is by links, so our inbound links (Wikidata, WikiTree, Zenodo, OpenAlex-type citations already in other skills) are what bring MojeekBot in.
- "Mojeek looks for explicit matches to the words or phrases in your search query" (How To Search, 2022). It ranks on literal keywords, so exact place-name variants in the page text count: Tŷ Mawr, Ty Mawr, Great House, Llandough, Llandochau, Leckwith, Lecwydd.
- **MojeekBot (bot.html):** obeys robots.txt (the first record naming MojeekBot, else `*`); at most 1 page a second; ignores crawl-delay; obeys the noindex, nocache and nofollow meta tags. Verify a real visit by reverse DNS to crawl-*.mojeek.com, then forward DNS.
- **Check whether you're indexed:** "search for the exact domain name ... If Mojeek has already indexed the site it will be presented at the top of the results page, along with a search box enabling you to search within the site."

## What I checked today (no account)
- **robots.txt allows it:** cedwyn robots.txt is `User-agent: * / Allow: /` plus 3 sitemaps, so MojeekBot is allowed.
- **Cloudflare lets it through:** a request with the MojeekBot user agent got 200 on `/` (120 KB) and `/ebooks/` (84 KB), with no cf-mitigated header.
- **Index status: not checked.** Mojeek answers scripted queries from this box with "403 ... your network appears to be sending automated queries". It needs a real browser or a person.
- **Visit history:** cf_traffic.py filters to `requestSource:"eyeball"`, so bot visits aren't counted yet.

## Free, no-account actions (all on cedwyn.bucklerfamily.estate)
1. **Index check (browser, 1 minute):** in a real browser, search mojeek.com for `cedwyn.bucklerfamily.estate`, then `"Ty Mawr" Llandough` and `"Great House" Llandough`. Record whether the domain shows with its site-search box, and where we rank. Log in the project workspace as engine=mojeek.
2. **Crawl evidence (Cloudflare analytics, read-only):** add a bot query to the visibility runner: count requests with a userAgent like '%MojeekBot%' over 7 days, and which paths. Zero hits in 30 days means no link path has reached us yet.
3. **Keyword hygiene for a literal-match engine:** make sure each key page's title, h1 or first paragraph carries the place-name variants as plain text, not only in images or JSON-LD. This is on-page markup and copy that the onpage flywheel can propose; body text changes stay PROPOSED.
4. **Keep it open:** never add a MojeekBot Disallow. If a future AI-bot block list is added to robots.txt, list MojeekBot under allowed.
5. **Optional, needs GO because it adds a third-party element to a page:** Mojeek's free search-box code (services/search/searchbox.html) could act as a site search, but it sends visitors off-site, which goes against the no-outbound-links rule. Recommendation: no.

## How we apply it to Cedwyn
- The weekly VISIBILITY CHECK adds Mojeek as a 6th engine: one browser search for the domain and the 3 fixed place queries, plus a MojeekBot hit count from Cloudflare.
- If we're not indexed after 30 days, it's a link problem, not a site problem. Lean on the existing free citation skills (Wikidata, WikiTree, Zenodo, Wikisource cite-back). Never buy links.
- No account, no spend, no contact. Mojeek's contact form is for bot complaints, not submissions, so we don't write to them.

## Sources (read 31 Oct 2026)
- mojeek.com (index milestones)
- mojeek.com (MojeekBot rules, verification)
- blog.mojeek.com (no submission; links; domain check)
- blog.mojeek.com (18 May 2026, independence)
- blog.mojeek.com (explicit-match ranking; snippet)
- blog.mojeek.com (API feeds LLMs/other engines; snippet)
- community.mojeek.com (Bing API retirement 11 Aug; snippet)
- cedwyn.bucklerfamily.estate (live)
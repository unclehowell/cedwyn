# IndexNow, WebSub and WebMCP: free, agent-friendly endpoints (2026 how-to)

Three open protocols any agent can use with no OAuth and no account for the project lead. Each takes a few minutes and costs nothing.

## 1. IndexNow: tell Bing, Yandex, Seznam, Naver and Yep that a URL changed
- **How it works** (indexnow.org): host a key file (8-128 hex characters) at `<host/<key>.txt` holding the key. Then POST JSON to `api.indexnow.org `{"host","key","keyLocation","urlList":[...]}`. Up to **10,000 URLs per POST**. One submission is shared with every participating engine.
- **Responses:** 200 = OK; 202 = received, key validation pending; 400 = bad format; 403 = key not found or wrong; 422 = URLs not on this host; 429 = too many requests (treated as possible spam).
- **Ceiling:** submit only URLs that really changed: new pages, edited pages, and deleted pages (so they drop out). Re-pinging unchanged URLs gets 429s and is wasted. Run it once per deploy, sending the changed URLs from the build diff.
- **Google does not use IndexNow.** For Google, keep sitemap.xml with accurate `<lastmod>` and submit it once in Search Console (the connected google_search_console app). Google retired its sitemap ping endpoint in 2023 (from working knowledge; not checked this run).

## 2. WebSub (W3C Recommendation): instant feed delivery to readers and aggregators
- A feed declares a hub: `<link rel="hub" href="pubsubhubbub.appspot.com` and `<link rel="self" href="<feed url>"/>` in the Atom/RSS feed (and optionally as HTTP Link headers on the page).
- On each new post, POST `hub.mode=publish&hub.url=<feed url>` to the hub. Feed readers (Feedly, Inoreader, NewsBlur) and aggregators get the item in seconds instead of polling hours later.
- **Cedwyn has no feed yet** (checked 26 Oct: /feed.xml, /rss.xml, /atom.xml and /index.xml all 404). Step 1 is an Atom feed of new evidence pages, movie doors and e-book news, built by the site build. WebSub then costs one POST per publish.
- A feed also unlocks free syndication: feed-to-Bluesky/Mastodon bridges, Feedly discovery, and newsletter tools' RSS-to-email (Mailchimp has RSS campaigns).

## 3. WebMCP: let browser agents use the site's functions directly
- What it is: a page registers "tools" in JavaScript (name, natural-language description, JSON input schema, execute function); the browser exposes them to whatever AI agent is driving it. Proposed by Microsoft Edge on 28 Aug 2025 with Google co-authoring; first W3C Community Group draft on 10 Feb 2026. Chrome public origin trial announced at Google I/O in May 2026 (Chrome 149-156); Edge 147 has it behind a flag. The 21 Jul 2026 draft moved the API from `navigator.modelContext` to `document.modelContext`.
- **Honest state** (Spronta, Jul 2026): browsers are ready but **no mainstream agent called WebMCP tools as of May 2026**. Gemini in Chrome is the expected first consumer. Lighthouse added agentic-browsing audits in May 2026. Cheap to add now; don't expect traffic from it yet.
- Pattern (feature-detect, register read-only tools only):
```js
const mc = document.modelContext ?? navigator.modelContext;
if (mc?.registerTool) mc.registerTool({
  name: "search-archive", description: "Search the Great House Farm archive by place, year or keyword; returns evidence page titles and URLs",
  inputSchema: {type:"object", properties:{query:{type:"string"}}, required:["query"]},
  execute: async ({query}) => ({content:[{type:"text", text: JSON.stringify(await siteSearch(query))}]})
});
```
- Safety: tools run as the visitor, inside their session. Expose read-only tools only (search, list e-books with prices, get the free-chapter link). Never expose anything that buys, posts or changes data.

## Companion no-auth endpoints
- llms.txt (Cedwyn already serves one) and a clean sitemap.xml (live as of 26 Oct) are what non-WebMCP agents read today.
- Internet Archive Save Page Now (the LEVERAGE RUN has spn.py) for dated public captures.

## How we apply it to Cedwyn
1. **IndexNow now:** generate a key and add `<key>.txt` to the cedwyn repo root (one-file commit, only when no other worker holds the repo). Then run `tools/index_ping.py indexnow` against the sitemap once, and after that against each deploy's changed URLs only.
2. **Feed + WebSub next:** add `/feed.xml` (Atom, last 30 items, en/cy/es entries with `xml:lang`), the hub links, and one hub ping in the deploy step. Leave this as a patch in the project workspace while the repair freeze is on.
3. **WebMCP later:** add the read-only `search-archive` and `list-ebooks` tools to the shared site JS, feature-detected so nothing breaks in other browsers. Run the Lighthouse agentic audit before and after.
4. Log every ping and its response code in the project workspace A 403 or 422 means the key file or host is wrong: fix it, don't retry in a loop.

## Tool
- `tools/index_ping.py` (standard library only). Dry-run by default; `--live` sends.
  - `indexnow --host H --key K --sitemap URL [--since YYYY-MM-DD]` reads URLs from the sitemap (filtered by lastmod), then POSTs them in batches of up to 10,000.
  - `websub --feed URL [--hub URL]` sends a hub.mode=publish ping.
  - `genkey` prints a new 32-character hex key.

## Sources
- IndexNow documentation: indexnow.org
- WebSub W3C Recommendation: w3.org
- Google PubSubHubbub hub: pubsubhubbub.appspot.com
- Spronta, State of WebMCP (Jul 2026): spronta.com (a vendor blog; dates match its linked W3C and Chrome sources, which were not opened this run)
- WebMCP explainer: github.com (not opened this run)
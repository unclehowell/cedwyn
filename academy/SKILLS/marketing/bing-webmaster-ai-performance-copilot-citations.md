# Bing Webmaster Tools: AI Performance (Copilot citations) + import from Search Console

Harvested 26 Oct 2026 (skills harvest). Free. Gives first-party data on when Microsoft Copilot and Bing's AI answers cite our pages, which Google does not give at page level.

## What the primary sources establish
- Microsoft, 10 Feb 2026 (blogs.bing.com): **AI Performance** (public preview) shows how often a site is cited in AI answers across Microsoft Copilot, AI summaries in Bing and select partner integrations. Metrics: **Total citations**, **Average cited pages** per day, **Grounding queries** (the phrases the AI used when retrieving our content; a sample), **page-level citation counts**, and a trend line. Bing respects robots.txt choices.
- Microsoft, Jun 2026 (blogs.bing.com): four more preview views: **Intents** (grounding queries classed as Informational, Research, Learn and Solve, Local, Commercial...), **Topics** (queries clustered into themes), **Citation Share** (our presence relative to other cited sources) and **Compare** (change between periods).
- Microsoft's own improvement advice for pages indexed but rarely cited: clear headings, tables and FAQ sections; examples, data and cited sources; regular updates.
- Bing help (Add and verify site): sites can be **imported from Google Search Console**, carrying verification and settings; the 2019 Bing post confirms multi-site import in one step.
- Practitioner test (CXL, 2026): "a citation isn't an impression, and neither is automatically a click"; grounding queries are sampled retrieval phrases, not what users typed. Same article: Ahrefs' March 2026 study of 4M Google AI Overview citation URLs found only 37.1% also ranked top-10 organically, i.e. AI citation is a separate visibility channel.
- Practitioner post (Chris Long, LinkedIn, Feb 2026, from its search preview only, not opened): one site with zero Google visibility but strong Bing performance had 90K+ citations. Treat as one anecdote.

## The playbook
1. Sign in at bing.com with the Google account that owns Search Console; choose **Import from Google Search Console**; tick the Cedwyn property (and the other estate hosts if wanted). Verification carries over; the sitemap is read from GSC, or submit /sitemap.xml.
2. Turn on IndexNow from the same dashboard if not already pinging (tools/index_ping.py already does it from the box).
3. Weekly (5 min): AI Performance > last 7 days: total citations, top 10 cited URLs, top grounding queries, Intents mix. Log to the visibility scores.csv.
4. For each strong grounding query we are NOT cited for: check the page that should answer it: one dated, sourced statement at the top, a heading that matches the question, a short table (date / record / source) where it fits.
5. Use Citation Share/Compare monthly to see whether the Cedwyn framing or outside narratives get cited for the core questions (Tŷ Mawr, Great House Farm Llandough, Buckler, Cedwyn).

## How we apply it to Cedwyn
- Fold the weekly numbers into the Monday visibility check (schedule 85e9deca) alongside the Grok questions; it replaces guesswork about whether AI assistants read our site.
- Grounding queries tell us the words people's AI questions use for the place. Feed variants into the names e-book work (/nomenclature/) and the headline-first pages: each headline should be the answer to a real grounding query.
- Page fixes follow the project lead's framing rules: the Williams family as the family of standing; 1824 David Stewart survey as the first record mention of Tŷ Mawr found; 1667 as the family's acquisition (1974 newspaper reports of Mary Williams' statement; ITV News 1988); Bute records never as Tŷ Mawr history before 1824.
- Bing's AI only cites indexed pages: the indexing triage (page-indexing-triage-duplicates-canonicals.md) comes first.

## Sources
- blogs.bing.com
- blogs.bing.com
- bing.com
- bing.com
- blogs.bing.com
- cxl.com
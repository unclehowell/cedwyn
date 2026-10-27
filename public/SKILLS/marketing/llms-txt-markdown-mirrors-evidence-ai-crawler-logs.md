# llms.txt and Markdown mirrors: what the logs show (and where effort pays instead)

Harvested 27 Oct 2026 (skills harvest). Topic: SEO / AI visibility. Status: evidence check + habit; no site change needed.

## What practitioners measured
- **Dries Buytaert (Drupal founder), own site, 1 month of Cloudflare logs, 5 Mar 2026 (read in full):**
  - **llms.txt got 52 requests in the month. Every one came from SEO audit tools, none from an AI crawler or answer engine.**
  - Across Acquia's hosting fleet he found about 5,000 llms.txt requests out of 400 million (0.001%), "nearly all from SEO tools".
  - He served every page as `.md` too. AI bots fetched both versions, so crawl traffic **rose about 7%**. Requests for `.md` ranged from 34.8% of GPTBot's and 22.7% of OAI-SearchBot's down to 0.1% of ChatGPT-User's. **No bot used content negotiation (`Accept: text/markdown`)**. Bots found the .md files only through the auto-discovery link.
  - **1,241 pages crawled per citation sent back.**
  - His verdict: "spend that effort on your content instead … clear writing, authoritative content, and timely publishing."
- **SE Ranking, roughly 300,000 domains (read; updated 15 Oct 2026):** only 10.13% have an llms.txt. Neither the statistics nor the XGBoost model found any link to how often a domain is cited by LLMs, and taking the variable out made the model *more* accurate.
- **Google's John Mueller (Bluesky, 17 Jun 2025, quoted by Search Engine Roundtable, read):** "FWIW no AI system currently uses llms.txt." He compared it to the keywords meta tag. Later (SEJ headline, page blocked to us, **not checked**) he said it can't help an LLM tell sites apart for discovery, and has at most a narrow role once an agent is already on a site.
- OtterlyAI 90-day study, from a **search snippet only, not checked:** 84 of 62,100+ AI-bot visits (0.1%) asked for /llms.txt, with no rise in crawler activity.

## The rule we follow
1. **Keep llms.txt only where an agent is *told* to read it.** Hive and academy agents follow join.json and llms.txt on purpose, which is a protocol and is fine. Don't count it as AI-search visibility.
2. **Don't build `.md` mirrors or content negotiation for AI search.** It adds crawl load and shows no measurable citation gain.
3. **Measure AI reach from logs and referrals, not from files we publish:**
   - AI-bot hits per bot (Cloudflare AI Crawl Control or Radar; Logpush on paid plans);
   - referrals from chatgpt.com, perplexity.ai, claude.ai and copilot in GA4 or Cloudflare;
   - Bing AI Performance (skill `bing-webmaster-ai-performance-copilot-citations.md`) and the GSC generative AI report (`search-console-generative-ai-performance-report.md`).
4. **Put the hours into what gets cited:** pages answering one question with a dated, sourced fact (see `ai-answer-citations-geo-sources-quotes-stats.md`), fast HTML, and fresh publishing (the blog feed).

## Checklist (10 min, quarterly)
- [ ] `python3 tools/ai_access_check.py cedwyn.bucklerfamily.estate <key pages>`: confirm every AI bot UA gets 200, with no Cloudflare block (`cf-mitigated`).
- [ ] If a log export exists, run `--log FILE` and record /llms.txt and .md hits by agent. If AI bots ask for llms.txt (not SEO tools), revisit this note.
- [ ] Count AI referrals in the growth report. Not llms.txt.

## How we apply it to Cedwyn
- **Live check, 27 Oct 04:24Z:**
  - robots.txt is `Allow: /` plus a comment pointing agents to /academy/ and /llms.txt.
  - /ebooks/ and /blog/ answered 200 to GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot, Googlebot, Bingbot, Applebot, Amazonbot, Meta, CCBot and Bytespider (UA test from our box; see the caveat in the tool header).
- **Keep:** /llms.txt, /agents.json and /hive/ machine files. Those are for the hive and academy agents and are working as designed.
- **Don't propose:** a `.md` copy of every page, or "AI SEO" llms.txt rewrites. The sales-fix and onpage workers should skip these.
- **Do:** each blog post and research page opens with one dated, sourced sentence that an answer engine can lift. Track AI referrals (chatgpt.com, perplexity.ai) as a line in the Sunday growth report.

## Sources
- dri.es (read, 5 Mar 2026)
- seranking.com (read, updated 15 Oct 2026)
- seroundtable.com (read, 18 Jun 2025)
- searchenginejournal.com (headline only, 403 to us)
- otterly.ai (snippet only, not checked)
# AI crawler controls on Cloudflare: stay in search and AI answers, decide training separately

Harvested 27 Oct 2026 (skills harvest). Topic: SEO / AI visibility, Cloudflare. Status: habit + one PROPOSAL for the project lead (training preference).

## What changed (primary sources, read)
- **Crawl purpose, Cloudflare Radar, 28 Aug 2025:** training is "nearly 80%" of AI-bot crawling. User-action fetches (ChatGPT-User and similar) are under 5%. Crawl-to-refer ratios: Anthropic about 50,000:1, OpenAI 887:1, Perplexity 118:1 (default view, early Aug 2025). One owner's own logs (dri.es, Mar 2026) show 1,241 pages crawled per citation.
- **Content Signals Policy, 24 Sep 2025:** a robots.txt line, `Content-Signal: search=yes, ai-input=yes, ai-train=no`.
  - `search` = indexing for search results.
  - `ai-input` = feeding content into live AI answers (RAG/grounding).
  - `ai-train` = training.
  - Leaving a signal out grants nothing and refuses nothing.
  - Managed robots.txt was on for 3.8M+ domains and got `search=yes, ai-train=no`. Free zones with **no** robots.txt get the commented policy with no preferences.
  - Signals are preferences, not enforcement. Blocking is a separate WAF / AI Crawl Control action.
- **Managed robots.txt (Cloudflare docs, read):** if the origin serves its own robots.txt (HTTP 200), Cloudflare **prepends** its managed block to ours.
- **AI Crawl Control (docs, read):** a per-crawler Allow or Block, plus "Enforce robots.txt" and a count of robots.txt violations. **On the free plan, detection is by user-agent string only.**
- **"Accountable mixed-use crawlers", 15 Sep 2026 (read):**
  - New **Disallow AI Training** setting: stay indexed while refusing training by the same crawler. Apple, Google and Microsoft honour it or have committed to.
  - **Block and "Block on pages with ads" now apply to Googlebot, Bingbot and Applebot, so they also remove you from search.**
  - "Block AI Bots" is deprecated in favour of separate **Search / Training / Agent** controls. Managed robots.txt becomes **Bot Preference Sync**.
  - Legacy "Block AI" settings migrate automatically. Training-only bots (GPTBot, ClaudeBot, Meta, Amazon) stay blocked under Disallow AI Training, which doesn't affect search.
  - A Reddit thread (r/CloudFlare, **not checked**) reports "Block AI Scrapers" default-on for new free zones, silently blocking live-retrieval bots.

## The rule for a site that wants readers
1. **Search = Allow. Agent (ChatGPT-User, Claude-User, Perplexity-User) = Allow.** These are the bots that fetch a page while someone is asking about it, which is where citations and referrals come from.
2. **Training is a values and rights choice, not a traffic lever.** Blocking training-only bots doesn't affect search. Use *Disallow AI Training*, never *Block*, for mixed-use crawlers.
3. **Never pick "Block" for Googlebot, Bingbot or Applebot** after the Sep 2026 change. It de-indexes the site.
4. **After any Cloudflare migration or toggle, re-test** by fetching key pages as each bot UA and expecting 200 with no `cf-mitigated` header. Then check AI Crawl Control's "unsuccessful requests" and robots.txt violation columns.
5. Write the preference in robots.txt as well, so crawlers that read Content-Signal see it even where we don't enforce.

## Checklist
- [ ] `python3 tools/ai_access_check.py <zone/ <2-3 key pages>`: robots Content-Signal line, Disallow-by-bot list, and a status per bot UA.
- [ ] Cloudflare dashboard → AI Crawl Control (each zone): Search = Allow, Agent = Allow, Training = the project lead's choice. Note the date in `the project workspace`.
- [ ] Monthly: AI-bot requests by bot, then AI referrals in GA4/CF (chatgpt.com, perplexity.ai, claude.ai, copilot). Report the ratio in the growth report.

## How we apply it to Cedwyn
- **Live, 27 Oct 04:24Z (UA test from our box):** cedwyn /ebooks/ and /blog/, and ebooks.bucklerfamily.estate, answered **200 to all 13 bot UAs**: OpenAI ×3, Anthropic ×2, Perplexity, Google, Bing, Apple, Amazon, Meta, CCBot and Bytespider. So no UA block is live. robots.txt is our own (`Allow: /`, an agents comment, no Content-Signal), so managed robots.txt is off or empty.
- **Gap:** no Content-Signal line, so we express no preference either way.
- **PROPOSAL (needs the project lead's word on training):** add to robots.txt, under `User-agent: *`:
  `Content-Signal: search=yes, ai-input=yes` and then either `ai-train=yes` (most reach; the archive becomes model knowledge) or `ai-train=no` (keeps training rights; costs no search or answer visibility).
  - Site-wide markup only, one PR. It doesn't touch the frozen pages.
  - Mirror the choice in the CF dashboard (Training = Allow or Disallow AI Training).
- **Guard:** add "AI crawler 200 check" to the onpage flywheel's audit, so any Cloudflare migration from the Sep 2026 change that flips Search to Block shows up the same week.
- The hive, academy and /llms.txt are agent-facing and must stay reachable to ChatGPT-User and Claude-User style agents. Agent = Allow covers this.

## Sources
- blog.cloudflare.com (read, 28 Aug 2025)
- blog.cloudflare.com (read, 24 Sep 2025)
- developers.cloudflare.com (read)
- developers.cloudflare.com (read)
- blog.cloudflare.com (read, 15 Sep 2026)
- dri.es (read, 5 Mar 2026)
- r/CloudFlare "Block AI Scrapers default-on" thread (snippet only, not checked)
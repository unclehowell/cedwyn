# AI-assistant referral traffic: measure visits from ChatGPT, Perplexity, Claude, Gemini, Copilot

Harvested 30 Oct 2026 (skills harvest). Topic not in INDEX.md before ("ai referral"/"channel group"/"ai traffic" had 0 hits; the GEO, ChatGPT feed and Wikipedia skills cover *getting cited*, not *counting the visits that follow*).

## What practitioners measured (read, with their limits)
- **Ahrefs, own site (Patrick Stox, 16 Jun 2025, read):** AI search was 0.5% of visits but 12.1% of signups over 30 days, "the vast majority" from ChatGPT; a 23x higher conversion rate than traditional organic. One site, a SaaS signup, not a purchase.
- **Seer Interactive, one client (Oct 2024 to Apr 2025), via Nadia Mohamed's write-up (read, Mar 2026, updated 26 Oct 2026):** ChatGPT 15.9% and Perplexity 10.5% conversion against 1.76% for Google organic. Her caveat: about 11,000 AI sessions against about 14 million Google sessions. It is a case study, not a benchmark. Clarity's own figure across sites is about 3x other channels. The direction is consistent (AI-referred visitors convert above organic); the size is not.
- **Adobe Analytics, US retail (search snippets only, page timed out, not read):** generative-AI traffic up about 1,200% year on year in Oct 2025. AI visitors converted 38% worse in Mar 2025 and better by late 2025. Treat as a trend, not a target.
- **Google Analytics release notes, 13 May 2026 (read):** GA4 now has a native **AI Assistant** channel in the Default Channel Group, with medium `ai-assistant` set when the referrer matches a recognised assistant (named: ChatGPT, Gemini, Claude). Nadia Mohamed: the native channel is "the floor". Perplexity, Meta AI, Le Chat and You.com may still land in Referral, so add a source regex.
- **ChatGPT tags its outbound links with `utm_source=chatgpt.com`** (OpenAI, via the same write-up). Many app clicks arrive with no referrer at all, so the utm tag is often the only trace.

## The tested pattern (full-match, anchored)
`^(.*\.)?(chatgpt\.com|chat\.openai\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|gemini|copilot\.microsoft\.com|copilot\.com|chat\.deepseek\.com|grok\.com|meta\.ai|chat\.mistral\.ai|you\.com)$`
- Do **not** use Google's loose example (`^.*ai|.*gpt.*|.*gemini.*`). It matches jasper.ai, character.ai, platform.openai.com (developer docs), gemini.com (a crypto exchange) and gptzero.me. With small numbers, a few false hits swing the rate.
- Never add x.com for Grok: that is all of X.
- In GA4, the custom channel must sit **above** Referral, or Referral swallows it.

## How to do it (any site)
1. Count AI-referred sessions by **referrer host OR utm_source** with the pattern above. Keep them separate from organic and referral.
2. Report weekly: AI visits, share of all human visits, top AI landing pages, and conversions (checkout clicks, signups) from those visits against site average.
3. Look at **which pages the assistants send people to**. Those are the pages the models already cite. Make sure each one has a clear next step.
4. Expect tiny numbers at first (Ahrefs: 0.5%). Measure now anyway: while the volume is small, the landing-page mix is easy to read.
5. Cookieless first-party counting avoids the consent-mode undercount Mohamed describes for European GA4 data.

## How we apply it to Cedwyn
Checked live 30 Oct ~11:13Z:
- The site runs **no GA4**. Its first-party beacon (`/_cedwyn/guestbook/gb.js` -> `/api/a`, source in the project workspace) keeps the referrer host. `/api/a/summary` (private, X-Key) already returns `referrers_human`. So AI referrals can be counted today with no new script on the page.
- **Gap found:** the beacon sends `location.pathname` only, **not `location.search`**. A ChatGPT click that arrives with no referrer but with `?utm_source=chatgpt.com` is therefore lost. PROPOSAL for the api-worker owner: send `utm_source` only (not the whole query string) as one more field and store it next to the referrer host. This is the same first-touch gap the signup-source skill noted for D1.
- **Weekly line** in the Sunday growth report (cedwyn-growth/growth-report): "AI assistants: N visits (x% of human views), top pages, checkout/academy clicks from them". Run `tools/ai_referral_class.py --summary <saved summary.json>`.
- Pages to watch: /ebooks/ titles, /documentary/, /learn/ (academy) and the research/evidence pages. If an assistant sends readers to an evidence page, that page should carry the existing quiet "read it in the e-book" strip (onpage owner). Proposal only, no new banners.
- This pairs with the existing citation skills (GEO, Wikipedia gate, ChatGPT product feed). Those try to get cited; this one checks whether the citations bring readers and sales.
- No price changes, no tests on prices, nothing sent.

## Tool
`tools/ai_referral_class.py` (our own, stdlib, ~4.5 KB, nothing installed). Modes:
- `--test`: the real and near-miss host list. Box-tested 30 Oct: 7 assistants match; jasper.ai, character.ai, platform.openai.com, business.gemini.com, gptzero.me, x.com and t.co do not.
- `--summary FILE`: classifies `/api/a/summary` referrers.
- `-`: classifies from stdin.
- `[days]` / `--sql`: for the cedwyn_hits Analytics Engine dataset, if that beacon is ever deployed.

## Sources
- ahrefs.com (read)
- nadiamohamed.me (read; Seer and Clarity figures second-hand, from this page)
- support.google.com (GA4 "What's new", 13 May 2026 entry, read)
- business.adobe.com (snippet only, not read)
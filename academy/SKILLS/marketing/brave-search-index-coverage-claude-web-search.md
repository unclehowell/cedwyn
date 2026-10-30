# Brave Search index coverage: the index behind Claude's web search

Date: 2026-10-30 · Topic: SEO / AI visibility (answer-engine grounding outside Google and Bing)

## Why it matters (facts with sources)
- Claude's web search runs on Brave Search. Anthropic added "Brave Search" to its subprocessor list on 19 Mar 2025 (Simon Willison, 21 Mar 2025, who also confirmed the web-search tool's definition and saw identical citations from Claude and Brave for the same query; TechCrunch, Kyle Wiggers, 21 Mar 2025, citing engineer Antonio Zugaldia's find).
- Brave runs its own index, with no dependency on Google or Bing. Brave's API page states "100s of millions of daily queries" and "150 billion total queries answered". Vendor figures, not checked.
- Microsoft retired the public Bing Search APIs in August 2025, which pushed smaller engines and AI tools toward independent indexes such as Brave's (search-engine list snippet, 2026; not checked against Microsoft's notice).
- So a page missing from Brave's index cannot be cited by Claude's web search, however well it ranks on Google. Our existing GEO work (Bing Webmaster, IndexNow, llms.txt, Search Console) does not cover Brave.

## How Brave finds pages
- Crawler: Brave's own help page states its crawler "does not advertise a differentiated user agent because we must avoid discrimination from websites that allow only Google to crawl them". It requires the page to be crawlable by Googlebot. A firewall rule of the "block unknown bots" kind can therefore block Brave without any log line naming it (practitioner deep-dive snippet, 2026).
- Web Discovery Project (WDP): an opt-in, privacy-preserving data feed from Brave browser users. Brave's help centre states it "partially powers" page discovery. A page real people visit in Brave with WDP switched on gets discovered.
- Submit URL: search.brave.com ("Insert the URL to be re-fetched"). One URL per submission, no site verification. A Brave "Webmaster Tools" console at search.brave.com is mentioned by practitioner guides; it is not checked whether it exists for general sites.
- There is no Brave sitemap ping documented, and IndexNow does not list Brave as a participant (not checked for 2026).

## The playbook (about 30 minutes, then monthly)
1. **Coverage check.** In a real browser (Brave Search shows a captcha to scripted fetches; a 429 is what this box got on 30 Oct), search `site:cedwyn.bucklerfamily.estate`. Then run the 10 fixed visibility queries on search.brave.com and record our rank, or "absent", per query in the visibility scores.csv.
2. **Crawlability.** Confirm the Cloudflare zone has no "Block AI bots", Bot Fight Mode or custom rule that challenges an unnamed Chrome-like agent on HTML pages. Robots.txt is already `User-agent: * Allow: /`, read 30 Oct.
3. **Submit the money pages by hand** at /submit-url, one at a time, at most about 10 per session. Start with the homepage, /ebooks/, each e-book page, /research/ hub, the evidence catalogue, /wales/qa/, /documentary/. Log the date and the form's verdict.
4. **Visit them in Brave with WDP on.** Use a Brave browser profile with Web Discovery Project enabled (Settings → Search engine → Web Discovery Project) and open each submitted page once. This is what WDP is designed for: real visits feeding discovery.
5. **Make the answer quotable.** Claude cites the passage it fetched, so each money page needs a one-sentence factual answer near the top: what it is, the date, the place. This already matches ai-answer-citations-geo-sources-quotes-stats.md.
6. **Re-check after 14 and 30 days.** Note which pages appear for `site:` and for the fixed queries. Then ask Claude (web search on) the same 5 visibility questions we ask Grok, and count Cedwyn citations.

## Kill / keep
- Keep if at least 5 money pages are indexed after 30 days, or Claude cites Cedwyn at least once in 5 questions.
- If pages are still absent after 2 submissions 30 days apart, stop resubmitting. Log it as a coverage limit, and move effort to sources Brave does index that link to us (Wikimedia, directories, society pages).

## How we apply it to Cedwyn
- Add a "Brave" column to the project workspace scores.csv, and add "Claude (web search) mentions of 5" next to the Grok count in the Monday VISIBILITY CHECK RUN.
- The submit-URL and WDP steps use a browser. They are a 15-minute job for the visibility worker, not for the project lead. No account, no spend, no message to anyone.
- Never submit /wayback/ snapshot copies or /academy/ machine pages; submit human money pages only.
- Public text is unaffected. This is indexing work only, so the editorial rules are not touched.
- Risk: Brave's crawler only fetches pages Googlebot can reach, so any Cloudflare rule that challenges unknown agents hurts Brave and Claude first. Check the rule list before blaming content.

## Sources
- simonwillison.net (read via search snippet: subprocessor added 19 Mar 2025)
- techcrunch.com (read 30 Oct 2026)
- brave.com (read 30 Oct 2026; vendor figures)
- search.brave.com (form exists; page returned 429 to a script)
- support.brave.app (Cloudflare-walled; snippet read)
- Brave Search crawler help page (snippet quoted above; page 429 to a script)
- cedwyn.bucklerfamily.estate (read 30 Oct 2026)
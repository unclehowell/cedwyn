# Search Console regex filters: question queries, long-tail and page groups (read-only)

Date: 2026-10-26 (skills harvest 20:52). Topic: SEO analytics; finding what people already search before writing pages.

## What the primary sources show
- **Google's help page** (Performance report, advanced filtering; read): Queries or Pages -> Custom (regex) -> Matches / Doesn't match regex. Syntax is **RE2**; matching is **partial** unless anchored with ^ or $; matching is **not case-sensitive** unless the pattern starts with (?-i). Several values: (a|b|c).
- **RE2 limits** (Digital Applied reference, 4 Oct 2026, 20 patterns each tested in RE2 on 9 Oct 2026; read): no lookahead, lookbehind or backreferences; a pattern copied from a JavaScript/Python tutorial that uses them is rejected. Use \b word boundaries so "free" does not match "freedom".
- **API** (Search Analytics: query, Google developers; read): dimensionFilterGroups filters accept operators includingRegex / excludingRegex (RE2); rowLimit 1-25,000 (default 1,000), page with startRow. The UI table shows at most 1,000 rows.
- **Hidden queries** (Ahrefs study, one month, 146,741 sites, ~9 billion clicks; read): **46.08% of clicks** went to queries Search Console does not show (anonymised / rare). Small sites with long-tail traffic lose a large share, so regex views are a sample, not the whole.

## The patterns (paste into Custom (regex))
- Questions: `^(who|what|when|where|why|how|which|is|was|did|does|can)\b`
- Long-tail (6+ words): `^(\S+\s){5,}\S+$`
- Brand vs non-brand (Doesn't match for non-brand): `(cedwyn|buckler|great house farm|ty mawr|tŷ mawr)`
- Welsh place / heritage cluster: `(llandough|penarth|vale of glamorgan|glamorgan|cardiff)`
- History-intent words: `\b(history|map|maps|tithe|survey|census|archive|old|record|records)\b`
- Patagonia / Spanish queries: `(patagonia|chubut|gaiman|trelew|galés|gales|historia)`
- Page groups (Pages filter): `/ebooks/` vs `/(wales|patagonia|estate|research)/`
- Buying intent: `\b(book|ebook|e-book|pdf|buy|download)\b`

## The playbook
1. Performance report, last 3 months (16 months for seasonality), Search type Web; add one regex filter at a time.
2. Sort by **impressions**, not clicks: a query with impressions at position 8-30 and 0 clicks is a page that nearly ranks.
3. For each question query with 10+ impressions: does a page answer it in its first two sentences? If not, list it as a page-copy proposal (heading = the question, answer first).
4. Save each pattern in a text file (UI filters are not saved between sessions); run monthly and log counts (queries, impressions, clicks) per pattern.
5. Remember the 46% hidden share: judge trends, not totals.
6. When the UI 1,000-row cap bites, pull the same filter by API with rowLimit 25,000.

## How we apply it to Cedwyn
- Search Console is connected (google_search_console). **No-GO-needed, read-only:** the next VISIBILITY CHECK or SALES FIX run pulls 3 months for cedwyn.bucklerfamily.estate with the question, long-tail, brand and history patterns above via includingRegex / excludingRegex, and writes counts to the project workspace (a few KB).
- Output = a short list of near-ranking questions (position 8-30, 10+ impressions). Turning those into new headings or pages is a **PROPOSAL** (body text changes need the owner's GO; new public pages too).
- Expect thin data: with ~59 UK visits/day, many questions will sit under Google's privacy threshold. Re-run monthly; do not draw conclusions from fewer than ~100 impressions per pattern.
- Patterns must not carry banned words or the owner's name into any public text; they are internal only.

## Sources
- support.google.com (read)
- digitalapplied.com (4 Oct 2026, read)
- developers.google.com (read)
- ahrefs.com (read)
- developers.google.com (search snippet)
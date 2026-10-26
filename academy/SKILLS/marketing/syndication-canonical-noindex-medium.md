# Syndicating Cedwyn articles without losing the original (Medium, dev-style platforms, partner sites)
Harvested 26 Oct 2026 (skills harvest). Republishing a story elsewhere reaches new readers, but the copy can outrank the original.

## What the primary sources establish
- Google changed its canonicalization documentation in May 2023: for syndicated content it now recommends that the partner site `noindex` the copy if the original publisher does not want to compete with it. `rel=canonical` alone is not enough because the two pages often differ (layout, extra content) and canonical is a hint, not a directive (reported and quoted by Glenn Gabe, GSQi, 4 Aug 2023).
- Glenn Gabe's case study (a news publisher, 3,000 syndicated URLs, checked with the URL Inspection API and bulk Search Console exports): almost all originals were indexed and Google never picked the partner as canonical, yet syndication partners still outranked the original on several surfaces: Yahoo Finance in Top Stories above the original, Yahoo News twice in the News tab with the original absent (and the client's logo shown on the copy). Discover losses are hard to measure because the feed is personalised. He updated the post on 16 Sep 2025 with a follow-up study on AI search tools (ChatGPT, Perplexity, Claude, Gemini) and syndicated copies.
- Medium's Import tool republishes a post from your URL and sets the canonical link to the original automatically; a canonical cannot be set by hand except through import or the "Set a canonical link" setting (Medium help centre; dev.to commenter Laurie Barth confirming import assigns canonical_url). Medium itself was not readable from this box (403), so confirm in the UI before relying on it.

## The playbook
1. Original first: publish on our own site, wait until Google has indexed it (Search Console URL Inspection shows "URL is on Google"), usually 3-7 days.
2. Choose the copy's form:
   - Platforms with an import or canonical field (Medium import, dev.to `canonical_url`, Hashnode, LinkedIn articles lack one): use import/canonical, and prefer an excerpt (first 40-60%) ending with "Read the full story with sources" linking back.
   - Partner sites (local history societies, heritage blogs, newsletters): ask them to `noindex` the copy or to run a summary with a link; full-text copies only with noindex.
3. Every copy carries a tracked link (UTM source = platform, medium = syndication, campaign = story slug) to the original page, plus one link to /ebooks/.
4. Never syndicate the e-book text itself; syndicate stories that point to it.
5. After 2 weeks, search the exact headline in Google and in an AI answer engine: if the copy shows instead of the original, convert the copy to an excerpt or ask for noindex.
6. Log each copy (platform, URL, date, canonical/noindex state, clicks back) in the growth log.

## How we apply it to Cedwyn
- Best candidates are the headline-first story pages (1000 Cuts timeline entries, the Enwau names e-book intro, Calan Gaeaf). Example excerpt line: "In 1667 the Williams family acquired Tŷ Mawr (1974 newspaper reports, Mary Williams' statement; ITV News, 1988). The first record mention found is the 1824 David Stewart survey." No Bute-held dates presented as Tŷ Mawr records, no hedging phrases, none of the banned public words.
- Medium: use the import tool only on the project lead's account and only after his go-ahead (publishing in his name is outward); nothing is posted by this skill.
- Partner republishing (e.g. a heritage society newsletter) is an outward ask: draft it as a HubSpot task for the project lead's sign-off, with the noindex/excerpt request written into the draft.
- Spanish (Patagonia) and Welsh versions count as translations, not duplicates; give each its own page with hreflang on our site before any syndication.

## Sources
- gsqi.com (Glenn Gabe, 2023, updated 2025; read 26 Oct 2026)
- developers.google.com (Google canonical guide)
- help.medium.com (snippet; page blocked)
- dev.to (practitioner confirmation, snippet)
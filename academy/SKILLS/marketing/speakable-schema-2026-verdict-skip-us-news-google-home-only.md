# Speakable schema in 2026: verdict for Cedwyn (skip; no site change)

Checked 31 Oct 2026. Seed carried over from two earlier harvest runs ("check what Google's feature covers in 2026 first").

## What the feature is, read from the primary sources today
- **Google's doc, "Speakable (Article, WebPage) structured data (BETA)", last updated 2026-09-08 (read):**
  - Still labelled beta and "subject to change".
  - Purpose: "The Google Assistant uses speakable structured data to answer topical **news** queries on smart speaker devices", returning "up to three articles" read aloud by TTS.
  - Availability: "works for users in the **U.S.** that have **Google Home** devices set to **English**, and publishers that publish content in English."
  - Eligibility: "For your news content to be eligible as answers to topical news queries..."
  - Writing rules: 20-30 seconds per marked section ("roughly two to three sentences"); don't mark datelines, photo captions or source attributions; mark key points, not the whole article.
  - Markup: `speakable` on Article/WebPage with `SpeakableSpecification` using `cssSelector` or `xpath`.
- **Google blog, "Gemini for Home", 1 Oct 2025 (read):** "Gemini not only replaces the Google Assistant on your smart displays and speakers..." The doc still names Google Assistant; whether Gemini for Home reads speakable sections is **not stated anywhere I found** (not checked beyond that).
- **Google's "AI features and your website" doc, updated 2025-12-10 (read):** "There are no additional requirements to appear in AI Overviews or AI Mode... There's also no special schema.org structured data that you need to add."
- **Practitioner view (snippet only, Loonis 2026):** "major AI text platforms (ChatGPT, Perplexity, Claude) are not voice platforms and do not process Speakable schema differently." No study with numbers exists. Every "speakable case study" result I found was a how-to guide; none had before/after data.
- Our own earlier skill `retired-rich-results-gate-course-book-learning-video.md` had already flagged it in one line as "news-only, skip". This file checks that against today's docs and records the evidence, so the seed stops coming back.

## Verdict
**Skip. No site change.** Each of the three gates fails for cedwyn.bucklerfamily.estate:
1. **Audience:** US + English + Google Home only. Cedwyn's buyers are UK/Wales, Welsh-language and Argentine Spanish readers. The US crawler traffic doesn't buy.
2. **Content type:** topical news queries. Cedwyn is history, a research register and e-books, not a news publisher, and it has no Google News presence (see `google-news-2026-auto-publication-pages-news-sitemap.md`).
3. **AI answers:** Google states outright that no special schema is needed for AI Overviews or AI Mode. No other engine has documented that it uses speakable.

Cost of adding it anyway: low (a few JSON-LD lines). It's still a no, because it adds a non-Google `@type` property with no expected result. That breaks the "gallery check" rule (every structured-data type on the site must be one Google lists) and gives agents one more block to keep in sync with page copy.

## What to do instead (free, no account; already covered elsewhere)
- Lead with a self-contained 2-3 sentence summary under each H1. That's the same writing rule speakable asks for, and it helps every engine without markup. See `headline-first-read-more-progressive-disclosure.md` and the PAA-mining skill.
- Put real `id` anchors on sections, so engines can deep-link to the exact passage. See `jump-link-contents-read-more-deep-links-long-research-pages.md` (this run).
- For voice/audio reach, the existing audio-teaser / podcast-feed proposal (QUEUE-after-framing; needs the project lead's GO) is the actual route.

## How we apply it to Cedwyn
- No commit, no patch.
- Add one line to the weekly onpage audit's "gallery check": if `speakable` ever appears in the site's JSON-LD, flag it as "non-target (US news / Google Home only)". Don't remove it automatically.
- Revisit only if Google's doc drops the beta label, drops "news", or adds UK/en-GB or Welsh. Re-check that one doc's "Last updated" line each quarter: one fetch, no account.

## Sources
- developers.google.com (read; updated 2026-09-08)
- blog.google (read; 1 Oct 2025)
- developers.google.com (read; updated 2025-12-10)
- loonis.co (snippet only)
- cedwyn live check 31 Oct 19:12Z: no `speakable` on /, /research/, /wiki/, /fcg/, /thousand-cuts/, /ebooks/, /wales/, /argentina/
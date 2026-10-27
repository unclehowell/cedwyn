# FAQ sections after Google killed FAQ rich results (7 May 2026): write them for readers and answer engines, not for SERP dropdowns

Harvested 27 Oct 2026 (skills harvest). Topic: SEO / AI visibility / sales-page copy.

## What happened (primary sources)
- **8 Aug 2023:** Google cut FAQ rich results to "well-known, authoritative government and health websites"; for everyone else "no longer shown regularly". Unused structured data "does not cause problems" but has "no visible effects" (Google Search Central blog).
- **7 May 2026:** Google ended FAQ rich results for everyone. The Search Central changelog: "This feature will no longer appear in Google Search starting May 7, 2026" (deprecation notice added 8 May). It later "Removed documentation for the FAQ rich result feature" because the feature "is no longer shown in Google Search results". The FAQPage docs URL now redirects to the changelog.
- **Practitioner view** (Christian Ott, seo-kreativ.de, 13 May 2026, updated 6 Oct 2026): FAQPage markup isn't "banned". Other search engines and AI systems still parse it; only Google's dropdown is gone. He keeps it "for grounding toward AI search", with a precondition: "real questions with real value. No SEO-FAQ filler."
- **Numbers to distrust:** Ott traces widely repeated stats ("3.2x more likely to appear in AI Overviews", "72% of cited content includes Q&A format") to sites that don't source them. Don't repeat them in any plan or pitch.

## The playbook
1. **Don't add FAQPage markup expecting Google SERP space.** There is none for anyone now. Leaving existing markup costs nothing; adding it is optional, and only on pages with a real visible FAQ that matches it.
2. **Write the FAQ for the buyer's last doubts.** On a sales page, the FAQ is objection handling: format, devices, delivery, refunds, VAT/price, language, "is this the same as the free edition?". Take the questions from real sources: reader replies, the one-question survey (onsite-one-question-survey-buy-path.md), review mining (voc-review-mining-sales-copy.md), and Search Console question queries (search-console-regex-question-longtail.md).
3. **Answer first, in one or two plain sentences, then detail.** That's the shape answer engines quote, and the same rule as ai-answer-citations-geo-sources-quotes-stats.md.
4. **Use visible HTML** (`<details><summary>` works at 390 px without script). Never hide answers behind JS-only accordions that crawlers can't read.
5. **Keep it short:** 4-7 questions per page, each one a real one. No keyword-stuffed filler questions (Google's spam policies now explicitly cover generative AI responses too: Search Central changelog, May 2026).
6. **Measure:** track the FAQ open rate only if analytics already exists. Otherwise measure /ebooks/ conversion before and after, using the existing Stripe-session report.

## How we apply it to Cedwyn
- **Checked live 27 Oct 2026 03:09Z (cache-busted):** cedwyn.bucklerfamily.estate and / have no FAQPage markup and no FAQ section ("FAQ", "frequently asked", "Cwestiynau" all absent from the HTML).
- **PROPOSED (not done; this run edits no repo):** a short trilingual (cy/en/es) "Questions before you buy" block on /ebooks/ below the editions table, not next to the buy button's first fold. Answers must come from facts on file (formats from the editions table, delivery via ebook-delivery-send-to-kindle-kobo-own-links.md, refund wording from money-back-guarantee-sales-page-risk-reversal.md only if a guarantee is actually offered, the UK digital-content consent wording from uk-digital-checkout-reg37-consent-vat.md). No price or scarcity assertions beyond what's live (DMCC rules).
- Generate the block and its optional FAQPage JSON-LD from the same DB row, so text and markup can't drift. Real translations only (hreflang skill). Never name the owner; banned public words apply; no outbound links.
- Research pages: no FAQ blocks. Those pages state dated records; a Q&A format there would read as argument. The /qa/ section already handles questions.
- Owner: the weekly Cedwyn on-page flywheel (markup) and the bizdev run (copy). Copy changes go through the proposal queue.

## Sources
- Google Search Central blog, "Changes to HowTo and FAQ rich results" (8 Aug 2023, 14 Sep 2023 update): developers.google.com
- Google Search Central documentation changelog (May 2026 deprecation; later removal of the FAQ docs): developers.google.com (the old developers.google.com redirects there)
- Christian Ott, "FAQ Rich Results Are Gone - Why FAQ Schema Stays in My Stack", seo-kreativ.de, 13 May 2026: seo-kreativ.de
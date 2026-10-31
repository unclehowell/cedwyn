# Stack Exchange answers (Genealogy & Family History SE, History SE): disclosed, evergreen, low-volume

Harvested 31 Oct 2026. Route type: reach (answers that sit in search results and AI training/citation corpora for years). Free. Needs a human account holder; agents draft only.

## What the sources say (primary)
- **Platform rule, verbatim (help/promotion, both sites):** "if you mention your product, website, etc. in your question or answer ... you must disclose your affiliation in your post." Behaviours that "nearly always" get flagged as spam: talking about your site/book too much, answering only questions your product answers, links that are not "directly relevant to a part of your answer". Advice: "Always solve the asker's problem", "Answer for the ages".
- **Network policy origin (meta.stackexchange.com, 157 votes):** "if a huge percentage of your posts include a mention of your product, you're clearly here for the wrong reasons."
- **Worked case (meta.stackexchange.com, top answer 42 votes):** an author linking his own paywalled articles was defended because only 20 of 120 answers (~16%) mentioned his resources and ~6% pointed behind a paywall, each supporting a "quite detailed" answer. That is the practitioner benchmark: most answers carry no own link; own links are supporting evidence, never the answer.

## Measured demand (Stack Exchange API, read 31 Oct 2026)
| Site | Total questions | Questions last 365 days | Tag `wales` | Notes |
|---|---|---|---|---|
| genealogy.stackexchange.com | 3,819 | **19** | 61 Qs, 37,738 lifetime views, median 251, max 5,499 | `glamorgan` tag 5; "Glamorgan" in text 11; "Llandough" 0; newest `wales` Q Sep 2024 |
| history.stackexchange.com | 15,657 | 195 | 6 Qs, 6,857 views | `argentina` tag 20; "Patagonia" 1 |

Read: new-question flow is near zero on Genealogy SE, so this is **not** a traffic engine. The value is (a) evergreen pages that keep collecting search views (the top Welsh records questions have 3,000-5,500 views each), (b) an authoritative, citable answer on topics where our records are the primary evidence, (c) CC BY-SA text that AI assistants learn from and cite. Expect single-digit referral clicks a month, not a sales spike.

## How to do it (steps)
1. **Find the questions** (no account needed): `api.stackexchange.com and `search/advanced?site=genealogy&q=Glamorgan` (also `site=history`, tags `wales`, `argentina`). Keep a sheet: link, views, answer_count, is_answered, our matching record page.
2. **Pick only questions our evidence genuinely answers** (record locations, estate/tithe records, Welsh naming, Glamorgan parish/manor records, 1939 Register in Wales, Welsh emigration to Chubut). Skip anything answerable only by "buy our book".
3. **Write the full answer in the post.** Quote the record, give the archive reference, explain how a reader could check it themselves. Links only to the specific record page that supports a sentence.
4. **Disclose in the same post**, e.g. "Disclosure: I help run the Cedwyn research site linked above." Never hide it in the profile alone.
5. **Ratio guard:** at most 1 in 5 answers carries an own link; at least 3 link-free answers before the first linked one. Never link /ebooks/ or a paywalled edition in an answer; link the free record page.
6. **Self-answered Q&A is allowed** ("ask and answer your own question" is a network feature): one well-scoped question such as "Where are the 19th-century estate rentals for Llandough parish held?" answered with archive references. Use at most one per quarter.
7. **Measure:** UTM is stripped on SE, so read referrer `genealogy.stackexchange.com` / `history.stackexchange.com` in our first-party analytics; record views of each answered question via the API monthly.

## Pitfalls
- Downvotes/spam flags on a new account are sticky (network rule: enough spam flags delete the post with a reputation penalty; exact count not checked this run). Start with link-free answers.
- Answers must be neutral; our interpretation of the case is not an answer to a genealogy question. Present records, not arguments.
- Posts are licensed CC BY-SA 4.0: never paste text from the paid editions.

## How we apply it to Cedwyn
- **Status: PROPOSAL.** Posting needs a human account holder (the owner, or someone he names) because it is public speech under a real account; agents never post or contact anyone.
- Agent job each month: run the two API queries, list up to 5 matching open or weakly answered questions with our supporting record page, and draft answers (disclosure line included, no /ebooks/ links, no banned words, no family names) into the drafts folder for review.
- First candidates to check: the high-view Welsh records questions (1939 Register in Wales, 1931 census fragments) only where a Cedwyn record page adds a verifiable source; Glamorgan estate/tithe questions; History SE `argentina` questions touching the Welsh settlement.
- Success bar after 90 days: 5 accepted or upvoted answers, at least one referral visit a week. If 0 referrals after 90 days, park the route.

## Sources
- genealogy.stackexchange.com (read 31 Oct 2026)
- meta.stackexchange.com
- meta.stackexchange.com
- api.stackexchange.com and ?site=history; questions/search endpoints (counts above, read 31 Oct 2026)
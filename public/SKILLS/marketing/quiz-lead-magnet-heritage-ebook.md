# Quiz as a lead magnet: "Which part of the Cedwyn story is yours?"

Date: 2026-10-26 (skills harvest 18:13). Status for Cedwyn: PROPOSAL only (public-facing change needs the owner's GO).

## What the evidence shows
- **Interact, Quiz Conversion Rate Report 2026** (Josh Haynam, read in full): across Interact's lead-generation quizzes the start-to-lead rate is **40.1%** and start-to-finish **65%**, stable in repeated analyses since 2014 (100M+ leads). By use: courses 44.9% lead / 59.1% finish; ecommerce 37.6% / 55.5%; services 42.2% / 47.3%. Individual quizzes range from 0 to 80%+.
- The denominator is **quiz starts, not site visitors**. A quiz converts attention that already exists; Interact has not seen "no audience + cold ads + quiz" work reliably. An 80% quiz with 10 visitors loses to a 30% quiz with 10,000.
- The title must name the question the audience already asks ("What's Your Ideal Career Type?"), not the product. Find it in comments, email replies, DMs and the best-performing pages.
- Diagnosis order (same source): low finish = too long/unclear; high finish but low leads = the opt-in offer is weak; good rates but few leads = distribution; lots of traffic but weak rate = title does not match why people came.
- These are platform observations, not controlled tests (the report states this). Sara Frandina's "50% conversion, 90% completion, 2 minutes" figures were seen as a search snippet only: **not checked**.

## How to do it (free, no new tool)
1. **Pick the question.** Read reader replies, YouTube/FB comments and Search Console queries. Choose one personal question: "Which Glamorgan farm record would you have been in?" beats "Take our history quiz".
2. **5-7 questions, one per screen,** each moving towards the result. Keep it under 2 minutes. No trick trivia (it feels like a test, people drop).
3. **3-4 results,** each a short, true story tied to one real record + one image + the e-book that goes deeper. A result should be worth reading even without signing up.
4. **Opt-in after the last question, before the full result:** first name + email, a plain line on what they get ("your result + the free first edition, then one email a week; unsubscribe any time"). Show a short version of the result to people who skip, so nobody feels tricked. Keep double opt-in (UK PECR/GDPR consent; see existing signup files).
5. **Tag by result** in Mailchimp (quiz-result-a/b/c) so the welcome email can open with their story (welcome-sequence-first-sale-small-ebook-list.md).
6. **Build it on our own page** (static HTML + a few lines of JS posting to the existing /api/list/subscribe route). Interact and similar tools are paid beyond tiny free tiers; we do not need them.
7. **Measure** with events: quiz_start, quiz_finish, quiz_lead (utm_content=quiz on links in). Judge after 100 starts, not before. Compare against the 65% / 40% planning marks, and use the diagnosis order above.
8. **Distribute where attention already is:** pinned in the /ebooks/ page and the top 3 traffic pages, Instagram bio link, YouTube pinned comments, Facebook page post, talk handout QR. No paid ads.

## How we apply it to Cedwyn
- **Fit check first:** the site has little traffic (Search Console: 0 impressions in 28 days on 26 Oct). The quiz will not create demand; it is worth building only alongside the channels already running (YouTube Shorts, FB/IG posts, talks). Set the build after the /ebooks/ signup 405 bug is fixed, since the quiz needs a working signup.
- **Draft title (EN):** "Which Tŷ Mawr record would you have been in?" ES version for Patagonian readers: "¿En qué registro de Tŷ Mawr habrías aparecido?" (Welsh version only with a native check).
- **Draft results (sources inline, no hedging, no banned words):**
  - "The surveyor" — the 1824 David Stewart survey of the Bute estate, plan 19, the first record mention found of the farm. Next: the survey e-book.
  - "The family" — the family acquired Tŷ Mawr in 1667 (1974 newspapers; ITV News 1988). Next: the family-history e-book.
  - "The parish" — a Llandough parish-life result built from the parish records in the e-books. Next: the four-book bundle (contents to be reconciled between Gumroad and Cedwyn first, per the bizdev run).
  - No Bute-era dates outside the 1824 survey.
- **Wording:** neutral and dated; never name the owner; no accusations about named people; nothing about family holdings or addresses.
- **Next step:** a HubSpot task "[BIZDEV] quiz draft" holding the questions, results and the page markup as a patch in the project workspace; live only on the owner's GO.

## Sources
- tryinteract.com (read in full, 26 Oct 2026)
- tryinteract.com (search snippet: 40.8% since 2014; not checked)
- sarafrandina.com (search snippet; not checked)
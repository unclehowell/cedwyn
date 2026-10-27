# Free sample chapter: read-before-buy on a direct e-book page
Harvested 2026-10-27 (skills harvest). Topic: letting a stranger read part of the book before paying, and catching the ones who don't buy yet.

## What the sources show (read unless marked)
- **Stores sample by default.** KDP help G200644250 (read 27 Oct): the "Read Sample" is a fixed percentage of the manuscript by format; the percentage *cannot be adjusted*, page samples can be trimmed for spoilers, and an author can ask Amazon to remove it. KDP community + Kill Zone Blog (1 Mar 2024, read): default is 10% for reflowable e-books (author reports 5-40% when changed via support). Smashwords podcast ep. 10 (Mark Coker, read): the author sets what % is the free sample; Coker calls sampling the way readers "try your book before they buy". Every big shelf assumes a sample is normal; a direct page with none asks more trust than Amazon does.
- **Sales-page anatomy.** Tom Morkes, "High-Converting Book Sales Page" (read): order = CTA above fold -> what you'll learn -> who it's for -> testimonials -> **free chapter download** -> peek inside -> about author -> final CTA + guarantee. He calls the free chapter "optional, but highly encouraged" because it builds the list, citing Nathan Barry's free-chapter opt-in feeding an autoresponder.
- **Testimony with numbers.** Nathan Barry, App Design Handbook launch stats (read): the "Just 4 hours left" email went to **6,702** because he added *everyone who opted in to the sample chapter that day*; the "20 minutes left" email went to **843** people who had asked about that specific book, buyers excluded. Sample-chapter sign-ups were treated as warm buyers and got the deadline emails.
- **Rates (not checked).** BookOrbits blog (snippet only): a free first chapter "converts at 2 to 5 percent" as an opt-in. No primary data behind it; do not quote as fact. No controlled public test found of sample vs no sample on a direct page — treat any change as our own experiment (growth-experiment-loop skill).

## How to do it (steps)
1. **Pick the sample**: the opening chapter or the strongest self-contained section, about 10% (match the store default). End on a real question the full book answers, not mid-sentence.
2. **Two doors on the title page**, under the buy button, never above it:
   - "Read the first chapter" -> plain HTML page on our own site (crawlable, fast at 390 px, one buy button at the end and one sticky at the bottom). No email needed. This is the Amazon "Look Inside" equivalent.
   - "Send me the chapter as a PDF" -> email opt-in tagged `sample-<title>`; delivery email in under a minute.
3. **The end of the sample** is the sales page: one line on what the rest covers, the price, buy button, and the free edition link if one exists. Message-match: same title, same price as the title page.
4. **Follow-up for `sample-<title>`** (Barry pattern): include them in that title's launch/deadline emails; exclude buyers; one "what did you make of chapter 1?" reply-request email after 3 days (reader-replies skill).
5. **Measure** (UTM/GA4 event `sample_open`, `sample_end_buy_click`): sample opens, % reaching the end, buy clicks from the end. If people open but don't reach the end, the opening is the problem; if they reach the end but don't click, the offer is.
6. Keep the store sample and our sample the same text so nobody sees two different "first chapters".

## Pitfalls
- A sample behind an email wall only = friction for the curious; keep the no-email door.
- Don't sample the index, preface or acknowledgements; readers judge the writing.
- PDF samples get forwarded — fine, that's distribution; put the title page URL in the footer of every page.

## How we apply it to Cedwyn
- Each e-book on /ebooks/ gets a "Read the first chapter" link to `/ebooks/<slug>/sample/` (HTML, internal links only, no outbound) plus the PDF opt-in into Mailchimp tag `sample-<slug>` (drafts/sends follow the existing Mailchimp rules; nothing goes out without the project lead's GO where that rule applies).
- Sample text comes verbatim from the book; public-text rules apply (never name the project lead, banned words list, no insignia, nothing on family holdings).
- SALES FIX: add `sample_open` and `sample_end_buy_click` to the funnel steps for zero_sales_odds.py so a zero at "sample end -> buy" is visible as its own step.
- Launch-week sequence: `sample-<slug>` subscribers join the "hours left" sends (launch-week-email-sequence skill), buyers excluded.
- Run as one experiment per title in results.tsv (keep/discard after the traffic floor).

## Sources
- kdp.amazon.com
- killzoneblog.com
- smashwords.com
- tommorkes.com
- nathanbarry.com
- bookorbits.com (snippet, not checked)
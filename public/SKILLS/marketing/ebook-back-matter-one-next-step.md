# Back matter with one next step: turning free e-book readers into buyers
Harvested 26 Oct 2026 (skills harvest). Scope: the last page(s) of a FREE e-book (Enwau, free PDF/EPUB) and how to measure free-to-paid. Complements welcome-sequence-first-sale-small-ebook-list.md (the emails) and free-first-edition-funnel.md (why free); this file is the in-book end page and the arithmetic.

## What practitioners measured
- David Gaughran (sell-more-books guide): he cut his back matter from three calls to action (review request, mailing-list link, next book with blurb) to ONE (link to the next book with a short blurb). The one-CTA version was **1.4x more effective**. Reason he gives: every extra option is worth less than a sale, and too many options make readers take the easiest one, closing the book.
- Same source: **free books sell through at roughly 2%+ to the next paid book; paid books 40%+**. His worked example: 1,405 downloads of a free first book, **3.41%** bought book two. So a free book is judged against ~2-4%, not 40%.
- BookFunnel blog (1 May 2026, "Why your reader magnet isn't converting"): a reader magnet has two jobs, acquire and activate. Five failure modes, each with a symptom: mismatch (clicks, few opt-ins), friction (opt-ins, few downloads; PDFs/fixed layouts on phones named as friction), **weak next step** (reads, few clicks: "one button, one next step"), **sequence gap** (clicks, no sales: a 3-email bridge, one job per email), measurement blindness (track landing conversion, downloads vs sign-ups, back-matter link clicks, email clicks, sales). "Readers who click links at the end of your book almost certainly read it."
- Jen A. Miller (Inbox Collective, Nov 2023, older): a free newsletter, a 10,000-word $10 e-book announced in the first issue of the year; the series earned about $12,500. Small, trusting list + one clear paid next step.

## How to build the end page (checklist)
1. ONE end page titled for the reader's next question, e.g. "Where the names lead next". 2-3 sentences that connect what they just read to the paid book's promise (same subject, deeper record).
2. ONE link: the paid title's page on our own site (/ebooks/...), with the price shown in plain text (£9.99). No social links, no review ask, no list of every book on this page.
3. The bundle is NOT a second button here; it belongs on the paid title's page / checkout (see post-purchase-cross-sell-bundle-upgrade.md). Exception: a single line under the link "or all the books together, £31.99" is acceptable only after a test shows it does not cut clicks.
4. Email capture lives on the download page (before the read), not competing on the end page. If there is no capture yet, the end page link may go to a page that carries both the paid title and the signup.
5. Tag the link per edition and format: utm_source=ebook&utm_medium=backmatter&utm_campaign=enwau&utm_content=pdf-en (epub-cy, pdf-es ...). Never tag internal site links; this is an in-file link so tagging is correct (utm-discipline-ga4-funnel.md).
6. Make the link work in every format: absolute https URL, visible text of the URL as well as the hyperlink (some PDF readers strip annotations), tested on a phone.
7. Mirror the same single next step at the end of each language edition (en/cy/es) in that language.

## The arithmetic we report
- Sell-through = paid purchases attributed to the backmatter link / free downloads in the same window. Expect 2-4% from a free book (Gaughran); flag below 1% after 300+ downloads as a back-matter or match problem.
- Revenue per free download = sell-through x price net of fees. At 3% x £9.99 that is about £0.30 per download; use it to decide how much effort a free-download push is worth.
- Change one element at a time (Gaughran: back matter, blurb, cover, price each separately) and do not read the numbers for 14 days after a change (ebook-pricing-bundles-direct.md).

## How we apply it to Cedwyn
- Checked on the box 26 Oct 2026: the Enwau source (the project workspace: index, town, house, estate, plays, sources, releasenotes) has NO end page, NO link to /ebooks/ and NO signup link. conf.py release line is "v0.01 (£0.00) — first edition". So today a reader who finishes Enwau has no next step at all.
- Draft line (en): "Enwau records what the place has been called. The next book follows the people who held it, from the family's acquisition in 1667 (1974 newspaper reports of Mary Williams' statement; ITV News 1988), to the first record mention found in the 1824 David Stewart survey and beyond. £9.99 at cedwyn.bucklerfamily.estate/ebooks/". (Check the paid title's real scope before use.)
- Measure monthly: Enwau downloads (Cloudflare/GA4) vs purchases with utm_content from the end page (Stripe/Gumroad metadata or GA4 key event). Log in the project workspace
- Queue the patch in the project workspace for the next permitted committer.

## Sources
- davidgaughran.com (back matter 3 CTA -> 1 CTA = 1.4x; free 2%+ vs paid 40%+ sellthrough; 1,405 downloads / 3.41%)
- blog.bookfunnel.com (1 May 2026; five failure modes, one next step, 3-email bridge, metrics)
- inboxcollective.com (Jen A. Miller, Nov 2023; $10 e-book, ~$12,500)
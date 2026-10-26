# Free first edition → email → paid edition (permafree + reader magnet), for Cedwyn
Written 26 Oct 2026 for BIZDEV #2 17. Sources are practitioner testimony; dates given because most hard numbers are older than 2026.

## What practitioners report
- Clare Flynn (historical novelist, ALLi case study, Feb 2016): made her debut permafree via Draft2Digital (Kobo, Apple, Nook) and Amazon price-match; 32,000 downloads in 2 months, mostly Amazon, with under $100 of promo-site ads; mailing list doubled; sales of her second book doubled in the first month; reviews rose from 27 to 140. selfpublishingadvice.org
- Same thread: Fenella J Miller reports about double the new subscribers in weeks when a book is free; Jane Steen reports signups, second-book sales and fan mail all up with a free first-in-series.
- 2026 guides (publishing.co.uk reader-magnet guide; ebookpbook.com, Mar 2026) still recommend the exchange: free content for an email address, delivered by a tool such as BookFunnel, with the free book carrying links to the next paid book.
- Tripwire assertions of '8–15% conversion vs 2–3%' circulate on marketing blogs (humanswith.ai) without primary data — not relied on here.
## The mechanics that matter
1. Free works where readers already browse (Amazon, Kobo, Apple, Google Play). A free PDF on a site with no traffic gets no downloads.
2. The free book must capture the reader: either an email exchange up front, or strong in-book links (first and last page) to the signup and the next paid book.
3. The paid step should be the obvious 'next' (same subject, newer edition, more records), priced simply.
## How we apply it to Cedwyn (checked 26 Oct 11:39Z)
- Today every v0.01 first edition downloads instantly as a PDF with no email asked (/ebooks/api/free → ebooks.bucklerfamily.estate, 200, application/pdf). Each free reader is anonymous, so the 'pool' stage of the funnel is skipped.
- Keep instant download (friction kills reads), and add: (a) an optional one-field 'Email me when the next edition is out' box on the free-read click (fires signup-submit); (b) page 1 and last page of each free PDF: one line + link to /subscribe/ and to the paid edition's /ebooks/ anchor (check the current PDFs have them).
- Distribution: list the Cedwyn free edition on Google Play Books and Kobo Writing Life directly as permafree (both free to list; publisher accounts in the owner's name). Correction 26 Oct 2026: Draft2Digital is no longer free (since 15 Apr 2026: $20 activation + $12/yr under $100 net), so go direct under the never-pay rule; see free-epub-storefronts-kobo-itch-books2read.md.
- Measure: ebook-read events vs signup-confirm per week; target 1 signup per 10 free reads.
- Rules: no private-person outreach; signup is opt-in only (double opt-in already live); no UTMs on internal links.
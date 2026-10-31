# E-book completion: where readers stop, and how to measure it on a free PDF
Written 31 Oct 2026 (skills harvest). 'jellybooks'/'finish rate'/'completion rate' (for e-books) had 0 skill files before this. Distinct from ebook-back-matter-one-next-step.md (how many CTAs to put at the end). This file is about how many readers ever reach the end, and what to do with that.

## What the primary sources show (read 31 Oct 2026)
- **Jellybooks completion-rate page** (jellybooks.com, read in full). Jellybooks measured reading with consenting test readers' e-books:
  - Completion = readers who reach the final chapters / readers who sent any reading data. People who download but never open are left out. Jellybooks sends non-starters **2 nudge emails**, because downloads sit unread ("books have high optionality").
  - Bands: under 25% = weak; **25-50% = the majority of books**; over 50% = very good, "especially for non-fiction"; over 75% = exceptional, **fewer than 5% of books tested**, and these correlate strongly with market success.
  - Shape of a strong book: the peak reader count is at chapter 1, falls gently over the first couple of chapters, then holds. **A peak in the front matter** (introduction, overview, cast list) before chapter 1 "is often the first sign that reader engagement ... is not going to be strong".
  - Completion is not genre-dependent: 0-100% in almost every genre.
- **Andrew Rhomberg (Jellybooks founder) to Jane Friedman** (janefriedman.com, 2017, updated Feb 2025, read). Non-fiction is the hard case: it is often "downloaded to be read 'some day'", so completion matters less and is harder to measure; it works for non-fiction "with a strong story arc". Biographies are the slowest reads. An abrupt ending that leaves readers hanging is the one editorial pattern he names. A commenter (not checked) suggests measuring *which sections* non-fiction readers use, as tech-docs teams do.
- **Kobo UK reading data, via the Guardian** (10 Dec 2014, read): *The Goldfinch* completed by 44.4% of Kobo's UK readers; *Twelve Years a Slave* (an 1853 first-person record) by **28.2%**; the most-completed UK book 83%; the no.1 bestseller 69%. Old data (2014) and from a retailer, but it is the only published retailer figure for a historical record-based book, and it sits in Jellybooks' "majority" band.
- Kristen Twardowski's 2016 blog line "if 80% of readers don't make it past the first few chapters..." was only seen as a search preview: not checked, not relied on.

## What it means in practice
1. Assume **most free readers never reach the last page**: plan on 25-50% of *openers*, and fewer of *downloaders*. So the back-page CTA alone reaches a minority. Put the one next step (signup or the paid edition) **in the first 10% as well as the end**.
2. Front matter is where non-fiction loses people. Get to the first record or story within 1-2 screens; move long explanations, method notes and source lists to the back.
3. A non-starter nudge works: the downloads that never get opened are the biggest leak. Only send it to people who gave an email and opted in.
4. Measure reach by chapter, not just downloads. In a PDF you can't see pages read, so use **checkpoint links**: one plain, useful link at three points (end of the opening chapter, the middle, the last page). Each link goes to a distinct internal URL with a ?src= tag, and Cloudflare counts the hits. The ratios between them are a rough completion curve. Treat it as a floor, because some readers finish without clicking anything.
5. Give it time. Non-fiction reads are slow and get put down for weeks, so read the curve after 4-8 weeks, not 4 days.

## How we apply it to Cedwyn
- Today the v0.01 free first editions download instantly as PDFs (free-first-edition-funnel.md). We count downloads (ebook-read events), but we don't know whether anyone gets past page 3.
- **Next build of each free PDF (smallest change):**
  - (a) Page 2: one line plus link, "Get the next edition when it's out", to the signup with ?src=pdf-front-<slug>.
  - (b) End of chapter 1: a link to the evidence record that chapter cites, with ?src=pdf-ch1-<slug>.
  - (c) Midpoint: the same pattern, with ?src=pdf-mid-<slug>.
  - (d) Last page: the existing single next step, with ?src=pdf-end-<slug>.
  - All of these are internal links to cedwyn pages (the internal-links-only rule holds). The tags ride the existing UTM/src convention.
- **Front matter audit:** check each free edition. If the introduction, method or catalogue notes run more than 2 pages before the first record, move them to an appendix and open with the strongest dated record. The text stays the same; only the order changes.
- **Readout:** add 4 numbers per title to the Sunday growth report: downloads, front-link clicks, ch1 clicks, end clicks. A drop of more than 80% between ch1 and end on every title points to the books, not the traffic.
- **Nudge:** when the "email me the next edition" box exists, add one email 7 days after signup ("the record most readers skip to is on p. N"). Never send to anyone who hasn't opted in. It's a Mailchimp draft only until the project lead states go.
- **Don't** claim a completion rate publicly, and don't compare ours with Jellybooks' figures. Their numbers come from consenting test readers, and ours are click proxies.

## Sources
- jellybooks.com (read 31 Oct 2026)
- janefriedman.com (read 31 Oct 2026)
- theguardian.com (read 31 Oct 2026)
- kristentwardowski.wordpress.com (search preview only, not checked)
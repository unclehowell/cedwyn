# Pressbooks and the "webbook" route: a free read-online edition beside the paid EPUB/PDF

Date: 31 Oct 2026. Harvest skill. Status: PROPOSAL (a new public format and possibly a new account; owner's GO).

## What the sources say (read 31 Oct 2026 unless marked)
- **What it is.** pressbooks.org: a book content management system that publishes a book to the **public web** and exports **EPUB, PDF and XML**. Built on WordPress Multisite; **free and open source, GPL v3.0**. Three ways to use it: hosted Self-Publisher (paid plans, free trial), managed Enterprise network, or **self-host**.
- **Self-host requirements.** github.com README: PHP 8.3 + WordPress 7.1.x, a **fresh multisite** install, not an existing blog; 460 stars, 137 forks. Community thread (preview): best PDFs need PrinceXML (non-commercial licence may apply).
- **Hosted price.** Self-Publisher "Single Author" **$12/month or $120/year** (guide.pressbooks.com and pressbooks.com plans page, search previews; the pages themselves returned 403 to us). Paid = never by default.
- **The webbook idea.** Pressbooks guide "What is a webbook?" (preview): a webbook is the same content as the ebook/PDF but stays on the web, each chapter its own page; no download needed.
- **Numbers on how readers use it.** Iowa State (Inside Iowa State, 8 May 2025, read): "Introduction to Soil Science" on Pressbooks had **79,000+ users, 160,000 views and 1,600+ downloads** in two years. That is about **2 downloads per 100 readers**: almost everyone read on the web edition. ISU Digital Press has published 40+ OER since 2019. (Open textbook context, free books; the ratio is the transferable lesson, not the totals.)
- **Discovery.** Pressbooks Directory: a free, searchable catalogue of **9,417** open access books across Pressbooks networks (search snippet). Only books published on a Pressbooks network are listed. Pressbooks (search snippet, page 403): 70 million+ pageviews across its community in 2025.

## The transferable playbook (no Pressbooks needed)
1. **One chapter = one stable URL** with its own title, description and share card; a contents page links them in order (front matter, chapters, back matter).
2. **Free web edition of part of the book** (intro + 1-2 chapters, or an open "reader's edition"), with the full EPUB/PDF as the paid download. The ISU ratio states web readers vastly outnumber downloaders, so the web pages are where people meet the book.
3. **Each chapter page ends with one next step**: "Continue reading" (next chapter) and, after the free part, "Get the full e-book" -> the buy page.
4. **Single source, many outputs**: write once, export EPUB + PDF + web from the same source so versions never drift (Pressbooks does this; we can do the same with our existing build).
5. **Licence line on the web edition** (e.g. all rights reserved, or CC BY-NC for a sample) so reuse is clear.
6. Measure: chapter-page reads, scroll to the last paragraph, clicks to the buy page, and sales per 1,000 chapter readers.

## How we apply it to Cedwyn
- **Route A (zero spend, recommended):** build the webbook pattern on cedwyn itself under /ebooks/<book>/read/<chapter>/, from the same source the EPUB comes from. Check first against free-sample-chapter-read-before-buy.md (sample size) and the paywalled-markup / lead-in skill (structured data for the paid part) so we don't duplicate.
- **Route C (self-host):** not on this box (disk ~0.5 GB free; needs PHP + WordPress multisite + a server). Rejected for now.
- **Editorial:** web chapters are public text: never name the owner, banned words list, no insignia, nothing about family holdings or addresses, Llandough Farm is not Great House Farm, Cedwyn internal links only, purchases via /ebooks/.
- **Kill rule:** if the read-online chapters get 500+ reads in 60 days with 0 buy-page clicks, change the end-of-chapter step; if they get under 100 reads, fold them back into one sample page.

## Sources
- pressbooks.org (read)
- github.com (read)
- inside.iastate.edu (read)
- guide.pressbooks.com (search preview)
- pressbooks.com and guide.pressbooks.com (search previews; 403 to us)
- pressbooks.directory (search snippet: 9,417 books)
- pressbooks.com (search snippet; 403 to us)
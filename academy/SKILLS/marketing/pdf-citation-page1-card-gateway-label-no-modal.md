# PDF citations: page-1 card + labelled link, never a PDF modal (gateway-page pattern)

Harvested 2026-10-31 20:12Z for the site-wide PDF change the project lead asked for at 20:07 (worker on it now). Not covered before: pdf-downloads-seo-host-canonical-title-links.md is about search indexing, preview-pdf-sales-tool-paid-titles.md about sales PDFs, thumbnail-gallery-lightbox-crawlable-zoom.md about photo galleries.

## What the practitioners found (primary sources)
- **NN/g, "Avoid PDF for On-Screen Reading"** (20 years of usability sessions, updated 2020): PDFs slow task completion vs web pages; users get lost because the print layout shows a small glimpse; Ctrl+F not known to all. Use PDF only for documents users will print or need as the original.
- **NN/g, "Gateway Pages Prevent PDF Shock"**: every link goes to a gateway page, never straight to the PDF; the gateway carries a short summary, warns it is a PDF, and states **page count and download size**; split very long PDFs into sections; external citations should link the gateway, not the file.
- **GDS, "Why GOV.UK content should be published in HTML and not PDF"** (16 Jul 2018; ~200,000 PDFs on GOV.UK, tens of thousands added a month): PDFs don't reflow on phones (zoom + sideways scroll), open in a tab, an app or a download depending on device so the user loses the site's navigation (worse when arriving from search), can't be measured beyond downloads, and go stale. Default HTML; a PDF only alongside an HTML version.
- **GOV.UK Inside blog, 16 Dec 2014 (Rebecca Cottrell)**: data review found PDF **thumbnail previews did not help people tell documents apart and slowed page loads**; GOV.UK tested replacing them with clear metadata: type, size, pages, accessibility notice. Most publication pages have 1 attachment.
- **GOV.UK Publishing Design Guide, Attachment component** (current): thumbnail + title + format + size + "view online" link; the thumbnail and its link are hidden from screen readers and not focusable; a download link must state file type and size.
- **iOS Safari in an iframe** (Apple Community thread 250075244; react-pdf issue #3243): a PDF in an iframe/embed shows only page 1 as an image and won't scroll; the react-pdf team's fix was a plain download/open link instead of the inline viewer. This is why an in-page PDF modal fails on phones.

Honest read: no published A/B test shows a page-1 thumbnail lifts clicks; GOV.UK's own data states the thumbnail alone did not help. The value for Cedwyn is different: the page-1 image IS evidence (a scanned record people recognise), and it replaces a modal that fails on iPhone. So keep the image, but make the **label** do the work.

## The pattern (do this)
1. Every citation of a PDF links to the record's own HTML page (the gateway: /research/artifacts/<id>/ or the evidence page), not to the .pdf.
2. On that page: page-1 image (WebP, ~800 px wide for the card, width AND height set to stop layout shift, alt = catalogue ID + what the page shows), then directly under it one text link: "Open the PDF (8 pages, 1.2 MB)". Type, pages and size every time.
3. Inline citation cards elsewhere (smaller): thumbnail ~240-320 px, lazy-loaded, linking to the gateway; caption = title + "PDF, N pages".
4. No iframe/embed/modal for PDFs. Plain link, same tab on mobile (NN/g: new tab only where the user is mid-task on desktop).
5. The gateway carries a 2-4 line HTML summary/transcript of the key lines so the content is readable, searchable and quotable without opening the PDF (GDS: HTML first).
6. Measure: count gateway views vs PDF opens (Cloudflare analytics by path) before/after; the PDF open itself is the conversion.

## Live check on our reference page (31 Oct 20:11Z)
- cedwyn.bucklerfamily.estate : preview.webp 1200x1696, 94 KB, good alt, loading=eager, width set but **no height**; link text "Open the public copy (PDF, 8 pages, ...)" = good, **but no file size**.
- **The PDF link is broken: the relative href resolves to .../ghf-e106-r116-a1/ghf-e106-r116-a1-llandough-cc-draft-minutes-2026-10-22-redacted.pdf -> 404** (also 404 under /research/artifacts/). Anyone copying this pattern copies a dead link. Fix first.
- og:image is the generic research share card, not the page-1 preview.

## How we apply it to Cedwyn (PROPOSALS; site changes need the PR/root merge route, the project lead's GO where it changes design)
- A. Fix the 404 PDF on the reference artifact (file missing from the deploy or wrong path) before the site-wide rollout copies it. Add a build check: every .pdf href on the site returns 200 application/pdf.
- B. Shared component (being built by the PDF-preview worker): add file size (MB, 1 decimal) to every link label; set height on the img; thumbnail decorative to screen readers when the link text already names the document (GOV.UK rule) or keep alt where the image is the evidence.
- C. Point all PDF citations (evidence catalogue, wiki, e-book pages) at the gateway page, not the file; never a modal.
- D. Optional: og:image = the page-1 preview on artifact pages so a shared link shows the actual record (cross-check og-share-cards-whatsapp-facebook-linkedin-cache.md for size 1200x630 crop).
- E. Report gateway-to-PDF open rate in the Sunday growth report.

## Sources
- nngroup.com
- nngroup.com
- gds.blog.gov.uk
- insidegovuk.blog.gov.uk
- design-guide.publishing.service.gov.uk
- discussions.apple.com ; github.com
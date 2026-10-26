# Free e-book delivery to Kindle, Kobo and phones from our own /ebooks/ links (no BookFunnel)

Date: 2026-10-26 (skills harvest). Free route only. Never Draft2Digital.

## Why it matters
- Delivery is one of the two most common failure points in direct sales. A buyer either never gets the file, or gets it and can't open it on a Kindle or Kobo (ScribeCount's BookFunnel guide). BookFunnel's paid fix is a download page that asks "which device?" and has a Send to Kindle button. We can build the same page for free.
- A reader who can't open the file doesn't read the back matter, so the one next step (see ebook-back-matter-one-next-step.md) never happens. Failed delivery means lost sell-through.

## Facts from the platforms (Amazon and Kobo help pages, read via search snippets 26 Oct)
- **Send to Kindle for Web** (amazon.com, also .co.uk): the reader drags the file in. It accepts PDF, DOC/DOCX, TXT, RTF, HTM/HTML and EPUB, up to 200 MB. It needs an Amazon sign-in and "Add to your library" switched on.
- **Send to Kindle email** (the reader's @kindle.com address): up to 50 MB total per email. The sender's address must be on the reader's Approved Personal Document Email List. That means **we cannot email a book to a reader's Kindle**, and we never send email anyway. The reader always sends it themselves.
- **MOBI/AZW are gone from Send to Kindle. Use EPUB.** An EPUB with structural errors fails silently or bounces back. BookFunnel runs a "could not validate EPUB for Send to Kindle" check before delivery. Our free equivalent is `tools/epub_lint.py`, plus EPUBCheck once there's disk space.
- **Kobo:** no email route. Readers use the Dropbox or Google Drive sync built into the e-reader (put the file in the Kobo folder, then Sync) or USB drag-and-drop (help.kobo.com).
- **Phones:** Apple Books opens a tapped EPUB link directly. On Android, Google Play Books → Upload file.

## How to do it (one page, no tools to buy)
1. **Offer both formats on each free edition: EPUB (for e-readers) and PDF (to print or view on screen).** The PDF stays for people who want a fixed page.
2. **Put device chooser text under each download.** Use four short lines, each with one action:
   - Kindle: "Download the EPUB, then drop it into Send to Kindle (amazon.co.uk)."
   - Kobo: "Save to the Kobo folder in Dropbox/Google Drive, then tap Sync."
   - iPhone/iPad: "Tap the EPUB link, then choose Books."
   - Android: "Play Books → Upload file."
3. **Serve files with the right headers:** `application/epub+zip`, and `Content-Disposition: attachment` with a clean file name (e.g. `cedwyn-enwau-cy.epub`). Use `inline` for PDF.
4. **Validate every EPUB before publishing** with `python3 tools/epub_lint.py book.epub`, and fix the identifier, language and nav errors it lists. Kindle rejects broken EPUBs.
5. **Measure downloads, not page views.** Count EPUB/PDF downloads by file name in the Cloudflare analytics (see growth-report/cf_traffic.py). The per-edition UTM goes on the back-matter link *inside* the file, never on internal site links.
6. **Help line:** one sentence, "Stuck? Open the PDF instead; it works on every device." There is no support inbox to staff.

## Testimony and numbers
- ScribeCount (direct-sales guide, 2026): delivery and device problems are the "two most common points of failure". The Send to Kindle/Kobo buttons "eliminate most reader support questions before they become support tickets".
- Amazon help: web upload up to 200 MB with EPUB supported; the email route is 50 MB and needs the approved-sender list. That's why a "we'll send it to your Kindle" promise is not possible for us.
- BookFunnel author help: EPUBs that fail validation are "likely" to be rejected by Send to Kindle, so validation is the gate.

## How we apply it to Cedwyn
- **Checked live 26 Oct, cache-busted:** /ebooks/ links only PDFs (9 links, all to `/ebooks/supplement/cedwyn-supplement-2026-10-25.pdf`, served inline). The page has no EPUB, no Kindle or Kobo instructions, and no file sizes.
- **PROPOSED for the next permitted committer** (leave the patch in the project workspace and list it in the project workspace):
  - Add an EPUB beside each free PDF, built with Sphinx, with `epub_identifier` set and checked with epub_lint.
  - Add the four-line device chooser in cy/en/es. Suggested Welsh: "Kindle: lawrlwythwch yr EPUB a'i ollwng i Send to Kindle".
  - Show the file size beside each download.
- Example blurb for the Enwau download (rules-compliant): "Every recorded form of the names of Tŷ Mawr, its parish and its estate, from the 1824 David Stewart survey (the first record mention found) to the 1974 newspapers and ITV News 1988, which give 1667 for the family's acquisition. EPUB for Kindle and Kobo; PDF for print."
- Never write "we'll send it to your Kindle" and never collect Kindle addresses. The reader sends the file. Nothing is emailed.

## Sources
- amazon.com (supported types, 200 MB limit)
- amazon.com (sending documents, 200 MB web upload)
- amazon.com (email, 50 MB)
- amazon.com (approved email list)
- help.kobo.com (Google Drive) and kobo.com (Dropbox)
- scribecount.com
- authors.bookfunnel.com
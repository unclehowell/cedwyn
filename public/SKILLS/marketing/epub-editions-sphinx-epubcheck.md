# EPUB editions from our existing e-book sources, checked before any store (2026 how-to, install-free)

Goal: give every Cedwyn e-book a reflowable EPUB beside the PDF, so it reads properly on phones and can go to Google Play Books, Apple Books, Kobo and KDP later, without buying software.

## Why bother (store rules, read 26 Oct 2026)
- **KDP (Amazon):** reflowable MOBI uploads ended 28 Jun 2021 (KDP announcement, relayed in self-publishing groups); fixed-layout MOBI ended **18 Mar 2025** (KDP help GULSQMHU5MNH4EZM). Accepted: **EPUB, DOCX, KPF**. A PDF is accepted but converts badly.
- **Google Play Books:** "We recommend that you send us both PDF and EPUB": PDF gives "original pages", EPUB adds a "reflowable text" mode with resizable fonts. Accepts EPUB 3.3 (preferred), 3 and 2; images up to 3200 px on the long side (Partner Center help 3316879).
- **Apple Books:** "All EPUB books submitted to Apple Books must pass the most recent version of EPUBCheck" (Apple Books Partner Support, Prepare your book); supports EPUB 3.3 (Asset Guide 5.3.1).
- **EPUBCheck** (W3C/DAISY) is the official conformance checker: Java, free, open source. Draft2Digital and Smashwords also run it on upload.
- The Alliance of Independent Authors (selfpublishingadvice.org) now points authors to EPUB, DOCX or KPF for reflowable books; a PDF-only e-book shuts out these shelves and reads poorly on phones.

## Build: do it from the source, never from the PDF
- **Converting a finished PDF to EPUB** (Calibre, online converters) breaks headings, footnotes, tables and page furniture; every reflow guide warns against it. Rebuild from the source text.
- **Our e-books are Sphinx projects** (e.g. the project workspace, conf.py + .rst). Sphinx already ships an EPUB 3 builder; nothing to install. Tested on this box 26 Oct (Sphinx 9.0.4) with the Enwau source: 156 KB EPUB 3.0 in seconds.
- Command (keep doctrees out of the output, or they get zipped into the book and warned about):
  `timeout -k 5 110 python3 -m sphinx -q -b epub -d a temporary folder/<book>-dt -D epub_basename=<slug> -D epub_identifier=cedwyn.bucklerfamily.estate/ -D epub_scheme=URL -D epub_uid=<slug> source build/epub`
- **Set in conf.py** (or with -D as above): `epub_identifier` (default is the placeholder "unknown", which stores reject: our lint caught it), `epub_scheme`, `epub_basename` (default strips non-ASCII: "Tŷ" became "TMawr"), `epub_publisher`, `epub_author`, `epub_cover = ('_static/cover.jpg', '')` (no cover was declared in the test), `language` (en, cy, es: one EPUB per language edition), `epub_show_urls = 'no'` (no footnoted URL lists).
- **Theme:** the HTML theme does not carry over; Sphinx uses its own epub theme. Keep a small epub.css: serif body, no fixed widths, images max-width 100%.
- **Markdown sources** (if a book is Markdown, not rst): pandoc does the same in one command (`pandoc book.md -o book.epub --metadata title=...`, pandoc.org), but pandoc is not on this box and is over 50 MB; use Sphinx with MyST, or install pandoc only when disk is well over 2 GB.

## Check: two layers
1. **Our quick lint (installed, free, tiny):** `python3 the project workspace book.epub`. Checks the zip packaging (mimetype first and uncompressed), container.xml, title/language/identifier not empty or placeholder, EPUB3 dcterms:modified + nav, manifest vs files, remote references, scripts. Exit 1 on errors. Structure only.
2. **EPUBCheck proper before any store upload:** needs Java (about 200 MB with a JRE), so **not installed** while the disk is near 2 GB free. Free routes without installing here: the official-library *EPUB Check* app on Android, the free desktop pagina EPUB-Checker, or install `default-jre-headless` + the EPUBCheck jar once the box has room (record it in INDEX.md then). Fix every ERROR; read every WARNING.
3. **Eye test:** open the EPUB in Google Play Books' upload preview or Apple Books/Thorium; check headings, the names table, Welsh characters (ŷ, ŵ) and the cover.

## How we apply it to Cedwyn
- **Order:** Enwau (the names register) first: it is short (34-page PDF), text-and-table, and its Welsh forms are the test case for ŷ/ŵ. Then the four paid books, then the bundle.
- **Where:** build into the project workspace<book>/build/epub/ beside the PDF; add the EPUB as a second download on the same /ebooks/<slug>/ page (one product page, two formats; the Merchant listing markup stays one Product). Commits only by the current sole cedwyn committer.
- **Spanish edition:** a separate es build (language='es') serves the Argentina half and Android-heavy Latin American readers on Google Play Books (google-play-books-partner-center-ebooks.md flagged the EPUB gap).
- **Stores:** any store listing is a submission in the project's name: the project lead's decision (publisher name, tax/bank). Building and checking the files is ours.

## Sources
- kdp.amazon.com ; kdp.amazon.com
- support.google.com (Google Play Books EPUB files)
- itunespartner.apple.com ; help.apple.com
- github.com ; daisy.org
- pandoc.org ; sphinx-doc.org (epub builder, epub_* config)
- selfpublishingadvice.org
- Box test 26 Oct 2026: Sphinx 9.0.4 epub build of Enwau, 156 KB, lint FAIL on placeholder identifier, pass after -D epub_identifier.
# EU Accessibility Act (EAA) + EPUB accessibility metadata for our e-books

Topic: making our EPUBs and the /ebooks/ shop accessible and *saying so in the file*, so EU/Spanish-language buyers, libraries and assistive-tech readers can see it before they buy. Written 26 Oct 2026, skills harvest.

## What the sources show (read 26 Oct 2026)
- EAA (Directive (EU) 2019/882) was enacted 27 June 2019 and applies from 28 June 2025 to e-books, e-reading software and e-commerce sold to EU consumers. W3C's mapping note shows the EPUB standard (EPUB Accessibility 1.1) meets the EAA's e-book requirements. (w3.org, read)
- ALLi (Alliance of Independent Authors) guidance (read): titles published by **microenterprises** (fewer than 10 staff or annual turnover under EUR 2 million) are exempt, which covers most indie authors. Print is out of scope. Backlist already on sale has until **28 June 2030**. Fixed-layout e-books risk falling foul of the Act, so "don't issue an e-book as fixed format unless there is a compelling reason". Ready-made shops (Shopify example) follow WCAG 2.1. Free check: **Ace by DAISY**. Metadata should state the book's accessibility features; whether stores add it automatically is still unclear (ALLi's words: "This is not yet clear").
- W3C Accessibility Metadata Display Guide 2.1, EPUB techniques (read): stores and reading apps read these OPF keys and show them to buyers: `schema:accessMode`, `schema:accessModeSufficient`, `schema:accessibilityFeature`, `schema:accessibilitySummary`, `dcterms:conformsTo`, `a11y:certifiedBy`.
- Our own files (checked on the box 26 Oct): `enwau-sample-en-20261026.epub` and `llandough-tour-companion_v0.1.0.epub` carry **no accessibility metadata at all**. Each holds 4 images.
- Which stores display it today (Kobo, Apple Books, Google Play): not checked store by store.

**Why this sells and isn't just compliance:** we are probably exempt as a microenterprise, but the metadata costs about 15 lines per book. It makes "screen-reader friendly / no hazards" visible on store and library listings, and libraries and schools increasingly filter for it (not checked with a number). It also fits the Click-Away Pound data already in `accessibility-quick-wins-conversion-heritage.md`.

## How to do it (per EPUB, about 20 minutes)
1. **Reflowable only.** Keep every title reflowable EPUB 3 (no fixed layout). Put maps and charts in as images with real alt text, and add a text caption giving the key fact (date, place, catalogue ID).
2. **Structure:** real `<h1>`–`<h3>` order, a complete nav TOC, `lang="en"`/`cy`/`es` on `<html>` and on any Welsh phrases inside English text (`<span lang="cy">Tŷ Mawr</span>`), and page-list optional.
3. **Alt text** on every image, written for meaning: "1824 survey extract naming Cedfin; ref [catalogue ID]", not "image1". Use `alt=""` for decorative rules and ornaments.
4. **Add to the OPF `<metadata>`:**
```xml
<meta property="schema:accessMode">textual</meta>
<meta property="schema:accessMode">visual</meta>
<meta property="schema:accessModeSufficient">textual</meta>
<meta property="schema:accessibilityFeature">structuralNavigation</meta>
<meta property="schema:accessibilityFeature">tableOfContents</meta>
<meta property="schema:accessibilityFeature">alternativeText</meta>
<meta property="schema:accessibilityFeature">readingOrder</meta>
<meta property="schema:accessibilityFeature">displayTransformability</meta>
<meta property="schema:accessibilityHazard">none</meta>
<meta property="schema:accessibilitySummary">Reflowable text with headings, full table of contents and described images; readable with screen readers and text-to-speech.</meta>
<link rel="dcterms:conformsTo" href="idpf.org
```
   Only claim `conformsTo` WCAG AA after the check in step 5 passes. Otherwise leave that line out (an honest summary beats a false claim). `accessModeSufficient textual` is only true if every image has alt text.
5. **Check:** run `epubcheck` (see `epub-editions-sphinx-epubcheck.md`). Ace by DAISY is an npm tool; **do not install it on the box while disk is under 2 GB**. Note it as a later check or run it elsewhere.
6. **Shop page:** one plain line under each book on /ebooks/ ("Accessible EPUB: headings, contents, described images, works with screen readers"), plus the same keys in Book JSON-LD (`accessibilityFeature`, `accessMode`, `accessibilitySummary`, as in `merchant-listing-structured-data-ebooks.md`).

## How we apply it to Cedwyn
- **Do now (no public change):** add the metadata block and alt text to the programme-office EPUB drafts (`the project workspace`) and to the next build of each v0.02 title in the build script, then re-run epubcheck. These are internal files, so no approval is needed.
- **PROPOSAL (public page change, needs approval):** the one-line accessibility note under each book on /ebooks/ and the JSON-LD keys. Leave it as a patch in `the project workspace` while the repair freeze is on.
- **Spanish edition (La visita de Llandough):** EU Spanish-language buyers are the audience the EAA was written for. Set `lang="es"` correctly and write a Spanish `accessibilitySummary`.
- **Library route:** accessibility metadata travels with the file into library and e-lending catalogues (see `library-elending-overdrive-libby-via-kobo.md`, `legal-deposit-ebooks-uk-web-archive-nomination.md`).
- Measure: store and library listings that show the accessibility block (store display not checked yet), and any reader replies that mention screen readers.

## Sources
- w3.org (W3C, EAA to EPUB mapping; read)
- selfpublishingadvice.org (ALLi; read)
- w3.org (W3C display techniques; read for key names)
- w3c.github.io (EPUB Accessibility Techniques 1.1; not read in full)
- daisy.org (Ace by DAISY; not opened this run)
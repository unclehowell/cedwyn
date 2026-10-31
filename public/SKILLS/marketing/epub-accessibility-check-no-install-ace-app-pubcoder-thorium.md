# Checking an EPUB's accessibility before listing, with nothing installed on our box: PubCoder's online Ace, the Ace App, Thorium, and a stdlib pre-check

Topic: a repeatable pre-listing accessibility gate for each Cedwyn EPUB that costs £0 and needs no install on the box. Before this run, `eaa-epub-accessibility-metadata-ebooks.md` said what to put *in* the file and named Ace only as an npm tool to skip while disk was tight. This file is the *checking* route. Written 31 Oct 2026, skills harvest.

## What the sources show (read 31 Oct 2026)
- **Ace by DAISY App** (daisy.github.io, read): the official graphical version of the DAISY checker, **v1.4.6**, for Windows, macOS and Linux desktops. You drag an EPUB onto the window and get a report. It installs on a person's own computer, not on our box.
- **What Ace reports** (DAISY Knowledge Base, snippet): violations in three groups, **WCAG 2 Level A, Level AA, and EPUB-specific**. It also extracts the book's accessibility metadata and lists every image with its alt text, so a person can review the descriptions.
- **PubCoder's free online checker** (pubcoder.com, read): runs **EPUBCheck plus Ace by DAISY in the browser**, "no download, no signup". `.epub` only, up to **100 MB**, **5 free uploads per session**. Its page states that files "are automatically deleted immediately after validation". This is the only route found that needs no install anywhere. The trade-off is that the file goes to a third party.
- **Thorium Reader** (EDRLab, free, desktop; 3.2 release notes, Aug 2025, read): read-aloud with **persistent default voices per language** (3.2). APLN's step-by-step guide (read) uses Thorium to *hear* whether `lang`/`xml:lang` shifts are tagged and voiced right. If a correctly tagged phrase is mispronounced, check the code, then check the computer has that language's voice pack. On Windows 11: Settings → Accessibility → Narrator → Add legacy voices → Add voices.
- **Why bother:** EAA context, the microenterprise exemption and the metadata keys are already in `eaa-epub-accessibility-metadata-ebooks.md`; not repeated here. The check is what lets an honest `accessibilitySummary` and a future `conformsTo` claim be made at all.
- **Testimony with numbers:** none found from a small publisher this run. The case rests on the tools' documented behaviour, not on sales figures.

## The pre-listing gate (per EPUB, about 15 minutes)
1. **Box pre-check (stdlib Python, no install, read-only):** run `tools/epub_lint.py` first (packaging). Then open the EPUB with `zipfile` and count, which could be added to epub_lint as a PROPOSAL:
   - OPF `dc:language`;
   - `<html>` files with no `lang`/`xml:lang`;
   - `<img>` with no `alt`;
   - `schema:access*` metadata lines;
   - `lang="cy"` spans (Welsh terms; see `welsh-cy-language-tags-epub-onix-wel-kdp.md`);
   - a nav document present.
   Any failure here is fixed in the build *before* anything is uploaded anywhere. These are the low-hanging items Ace flags first.
2. **EPUBCheck:** as in `epub-editions-sphinx-epubcheck.md` (or step 3, which runs it too).
3. **Ace, by one of two routes:**
   - **(a) PubCoder online:** for **free/sample editions only**: the enwau sample, and La visita if it's offered free. Save the report as `the project workspace<file>-<date>.html`. Don't upload a paid full edition to a third-party site without the owner's OK.
   - **(b) Ace App on the owner's (or any helper's) computer:** for paid editions. Drag the file in and export the report.
   - Either way, the target is **0 violations at WCAG A and EPUB**. Review AA items one by one.
4. **Listen test (Thorium, 5 minutes):** on any computer with Thorium, turn read-aloud on for one page of each language block: an English paragraph, a Welsh place name tagged `cy`, and for La visita a Spanish paragraph.
   - Write down what you hear: right voice, wrong voice, or skipped.
   - **Not checked:** whether Windows/macOS/iOS offer a Welsh voice at all. If none exists, a correctly tagged `cy` word may be voiced by a fallback voice. The tag is still correct and still needed for screen readers, catalogues and future voices.
5. **Write the result into the file:** only now set `accessibilitySummary` to what passed. Add `dcterms:conformsTo` WCAG AA only if step 3 showed 0 A/AA violations.
6. **Log it:** one line per edition in `the project workspace` (file, date, route, violations A/AA/EPUB, listen-test result). Re-run on every rebuild, because the files change at build.

## How we apply it to Cedwyn
- **Measured today (step 1 only, read-only, `la-visita-de-llandough_v0.1.0.epub`):**
  - 29 files; OPF language `es` (correct);
  - **0 accessibility metadata lines**;
  - **16 of 17 page files have no language on `<html>`** (only one does);
  - no images, so no alt-text risk;
  - **0 `lang="cy"` spans**, against the 31 Welsh matches an earlier run counted.
  - Ace would flag the missing page languages (WCAG 3.1.1) on every file. Fix: set `lang`/`xml:lang="es"` per page in the build, and wrap the Welsh names.
- **PROPOSAL (build change, internal, no live change):** add the step-1 counts as a build-time check that fails the build on missing page `lang` or missing alt text. Run PubCoder online (route 3a) on the two free/sample EPUBs after the next rebuild and keep the reports.
- **PROPOSAL (owner, optional):** if the owner or a helper has a laptop, install the Ace App and Thorium there once. That covers paid editions (route 3b) and the listen test, and puts nothing on the box.
- **Shop wording:** say nothing about accessibility on /ebooks/ until a file has passed step 3. After that, the one-line note from the EAA file can go up (public change = needs approval).
- Nothing was uploaded to any checker this run. The file stayed on the box.

## Sources
- daisy.github.io (Ace App v1.4.6, platforms, drag-and-drop; read)
- kb.daisy.org (violation types; snippet)
- pubcoder.com (online EPUBCheck + Ace, 100 MB, 5/session, deletion statement; read)
- edrlab.org (Thorium 3.2 TTS voices per language; read)
- apln.ca (APLN listen test + Windows voice packs; read)
# Wikimedia Commons: share public-domain archive images where Wikipedia readers see them

Harvested 2026-10-27 07:25Z. Sources read that day (see bottom). Reach, not SEO: links out of Wikipedia articles are nofollow, so this builds attention and credibility, not ranking.

## The evidence (primary)
- **National Library of Wales (NLW), Jason Evans, Wikimedian in Residence (WMUK blog, 16 Dec 2019, read via archive):** NLW decided not to claim rights over digital copies of public-domain works, then shared **17,000+ images** to Commons. **Over 70% are in use** on a Wikimedia project; Wikipedia pages carrying them reached **nearly 730 million views**. Metadata then went to Wikidata (depicts statements, Welsh labels), which fed search/display tools (Crotos: 8,000 images in 2014 to ~200,000 by end 2019).
- **Wikipedia's COI guideline (en.wikipedia, read 27 Oct 2026):** "Editors with a COI are encouraged to upload high-quality media files that are appropriately licensed... In some cases, the addition of media files to an article may be an uncontroversial edit", but use the talk page "when images may be controversial or promotional. If the addition of an image is challenged by another editor, it is controversial." Text edits by a COI editor go to the talk page, not the article.
- **Licensing (Commons, Template:PD-UK-unknown, read):** a UK anonymous photo is public domain if it was never made public and taken more than 70 years ago (before 1 Jan 1956), or made public more than 70 years ago. Known-author works: life + 70. Only the copyright owner can licence CC BY-SA; the subject or a PR agent cannot.

## How to do it (step by step)
1. **Pick only clear-rights items.** Public-domain by date (PD-UK-unknown / PD-old-70), or items you own outright and agree to release as CC BY-SA 4.0. No press photos, nothing "for Wikipedia only" (deleted as non-free), nothing found copyrighted elsewhere earlier.
2. **One personal account, disclosed.** The COI guideline states no shared accounts and no company accounts. Put a COI note on the user page ("I work on project X, which publishes these records").
3. **Rich file page.** Title = what it shows + place + year. Description in English and Welsh. Fields: date, source (the catalogue page URL: the file page's one legitimate link back), author (or "unknown"), permission template, categories (place, year, subject), and structured data: depicts (Wikidata item), inception, location.
4. **Batch tools (free):** Commons UploadWizard for under ~50 files; Pattypan (Java, open source) or OpenRefine for spreadsheets of files plus metadata. None installed here; only needed at batch scale.
5. **Placing in articles:** add an image only where the article lacks one and the image is plainly illustrative (the village, the church, the hillfort, a period map). Anything about a dispute or a family claim goes to the talk page, never straight into the article. Accept reverts; do not re-add.
6. **Measure:** GLAMorous / BaGLAMa2 (Toolforge, free) count usage per Commons category and page views of the pages using the files. Track "files in use %" (NLW's 70% is the benchmark) and monthly views. Referral visits from Commons/Wikipedia show in Cloudflare/GA4 as wikimedia.org / wikipedia.org.

## Pitfalls
- Promotional captions ("buy the e-book") get removed and flag the account. Captions are descriptive only.
- Uploading one site's own photos of contested history invites challenge; keep to neutral, dated, verifiable records.
- Mass-adding images to many articles in one day looks like spam: a few a week, each where it clearly improves the article.

## How we apply it to Cedwyn
- **Status: PROPOSED, needs the project lead's GO** (new public channel, a personal account in a named person's name, since shared/company accounts are not allowed, and his call on which records he is willing to release).
- Candidate set: public-domain items already in the evidence catalogue that are not family photos and show places, not people: pre-1956 maps and plans of Llandough, period newspaper illustrations, Ordnance Survey extracts that are out of copyright, and Cedwyn's own photos of the landscape (if released CC BY-SA). Keep to rule 7f: only images confirmed as the farm or catalogued records; nothing withdrawn; no likeness of family members; nothing about family holdings or addresses.
- Each file page's source field = its Cedwyn catalogue page (`/research/artifacts/<id>/`), so the one link Commons allows points to the record. Descriptions trilingual (cy/en, es optional), neutral wording, none of the banned public words.
- Target articles (talk page first): Llandough (Vale of Glamorgan), the parish church, the River Ely, Caerau hillfort, and Welsh Patagonia history pages for the Patagonia side.
- Pilot: 10 files, 3 placements via talk-page proposals; measure with GLAMorous after 30 days; scale only if files-in-use is over 50%.
- Wikidata: link files to existing items (Llandough Q-item, hillfort) via depicts. Do not create an item about the case or the family.

## Sources
- web.archive.org (NLW numbers)
- en.wikipedia.org (sections "Making uncontroversial edits", "Supplying photographs and media files")
- commons.wikimedia.org
- commons.wikimedia.org ; commons.wikimedia.org
- youtube.com (Jason Evans talk, "over 100 million views of Library images" at an earlier date; search snippet only, not watched)
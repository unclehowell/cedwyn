# "Cite this record": citation metadata (Highwire tags + COinS) and a copyable citation so researchers and Wikipedia cite Cedwyn

Topic: making each Cedwyn record/research page one click to save in Zotero and one paste to cite. Citations from students, family historians, local-history journals and Wikipedia editors are durable links and AI-visible sources. Skill written 27 Oct 2026 (harvest run).

## What the evidence states
- **Princeton CDH tested the formats, 12 Nov 2025** (read): Highwire `citation_*` meta tags, Schema.org JSON-LD, COinS, unAPI+MARC and unAPI+Dublin Core.
  - Highwire tags are easy and widely read, but **Zotero could not detect the item type** from them, and the same went for Dublin Core.
  - **COinS (one `<span class="Z3988">` per item) gave the correct item type, worked for single pages and bulk saves from a results list, and needed no extra requests.** It completes within a second of the click.
  - Their verdict: COinS is "one of the most effective" ways to get Zotero integration, even though it is old.
- **Zotero's own guide** ("Exposing metadata", read) supports Highwire tags (`citation_title`, `citation_author`, `citation_publication_date`, `citation_pdf_url`, `citation_keywords`…), COinS, unAPI, and embedded RDF/JSON-LD.
- **Wikipedia's citation tool runs on Zotero.** Citoid (VisualEditor's automatic "Cite" button) is built on Zotero's translation server and translators. MediaWiki states the best results come when a site's URLs are already readable by Zotero (Citoid page, read). So clean metadata means an editor who pastes a Cedwyn URL gets a correct reference instead of a bare link.
- **Google Scholar is not the target.** Its inclusion rules (read) require scholarly papers with real named authors in `citation_author`, plus a `citation_publication_date`, and they treat Dublin Core as a last resort. Cedwyn pages are records and reports with no named author, so keep Scholar for Zenodo deposits (see zenodo-doi-scholar-argentine-repositories.md).
- No measured "citations per month" lift from adding these tags was found. Treat this as low-cost hygiene with a known mechanism (Zotero/Citoid), not a proven traffic driver.

## How to do it
1. **Per page `<head>`, Highwire tags** (cheap, also read by many scrapers and AI crawlers):
   - `citation_title` = the page's own title
   - `citation_author` = the organisation as author, e.g. "Cedwyn Estate records" (never a person's name)
   - `citation_publication_date` = YYYY/MM/DD of first publication
   - `citation_online_date` = last update
   - `citation_publisher` = "Cedwyn"
   - `citation_language` = cy/en/es
   - `citation_keywords` = place-names; separated
   - `citation_pdf_url` for downloadable report PDFs only
2. **COinS span in the body** for the correct item type (put it next to the cite box, visually hidden):
   - `ctx_ver=Z39.88-2004`
   - `rft_val_fmt=info:ofi/fmt:kev:mtx:dc`
   - `rft.type=webpage` (or `document`/`report`)
   - `rft.title`, `rft.date`, `rft.identifier=<canonical URL>`, `rft.language`, `rft.publisher`

   On list pages (catalogue, missing-records register) put one span per row so Zotero offers a multi-item save.
3. **Visible "Cite this record" box** at the foot of record pages, in the page language, with a Copy button. Example (the date varies):
   `Cedwyn (2026) "<Record title>", catalogue ID <WP-87>, cedwyn.bucklerfamily.estate/<path>/ (accessed <today>).`
   - Offer one format (Harvard-style). A menu of APA/MLA/Chicago is a chore.
   - Include the **catalogue ID**, because stable IDs are what historians cite.
4. **Stable URLs:** never change a record's path. If one moves, 301 it. Citations decay into dead links otherwise (see link-reclamation-unlinked-mentions-dead-urls.md).
5. **Test:**
   - install nothing on the server. On a desktop with the Zotero Connector, open a page and check the icon shows the right type (web page/report), the title and the date;
   - Wikipedia test: in any sandbox (not article space), insert a citation from the URL with VisualEditor's Cite, then read the result. Do not save it into an article.
   - Also run `curl -s URL | grep -c citation_title` in the build check.
6. **Machine copies:** keep the same fields in the page's JSON-LD (`CreativeWork`/`Dataset` with `name`, `datePublished`, `identifier`, `publisher`, `inLanguage`). The DB is the single source, so all three are rendered from one record row.

## Pitfalls
- Don't put a person's name in `citation_author`. Use the organisation.
- Escape quotes/angle brackets in meta values. Welsh diacritics are fine in UTF-8.
- A "cite" box must not explain the site or itself; it is a citation, not a note (no-self-explaining-pages rule).
- Don't edit Wikipedia ourselves to add Cedwyn citations (COI; see wikimedia-commons-wikidata-heritage-coi.md). The goal is that others' citations come out clean.

## How we apply it to Cedwyn
- **Status at 27 Oct 2026:** /, /research/missing-records/ and /ebooks/ each carry JSON-LD but **no `citation_*` tags and no COinS** (curl check). The live site's pages have catalogue IDs (WP-…, MR-…), which is ideal citation material.
- **Proposal (onpage flywheel / docs worker, PROPOSED):**
  - add a build-time template partial that renders Highwire tags + one COinS span + the trilingual Cite box from each record's DB row (title, IDs, first-published date, language);
  - apply it to the evidence catalogue, the missing-records register (one span per row), research reports and the place pages;
  - leave out /ebooks/ (a sales page, not a record).
  - Cost: one partial plus the DB fields that already exist. No install, zero spend.
- Who it helps: family-history societies, local-history journals, students (TES/Hwb resources) and Wikipedia editors writing about Llandough/Tŷ Mawr. Each gets a correct citation with our URL in one click. That is the citation-led authority the AI-answers skill wants.
- Editorial: the citation text uses page titles only; no banned words; never names the project lead; no outbound links (the box cites us, it doesn't link out).

## Sources
- Princeton CDH, "Making Research Easier to Save: A Guide to Zotero Integration for Academic Websites", 12 Nov 2025: cdh.princeton.edu (read)
- Zotero, "Exposing metadata": zotero.org (read)
- MediaWiki, Citoid: mediawiki.org (read)
- Google Scholar inclusion guidelines: scholar.google.com (read)
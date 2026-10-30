# Dataset structured data + Google Dataset Search for the evidence catalogue and timeline

Harvested 2026-10-30 (skills harvest run). Topic check: "dataset search" and `"@type":"Dataset"` had 0 hits in INDEX.md and the skill files. The only nearby skill is data-led-digital-pr-heritage-dataset-pitch.md, which covers pitching a dataset to journalists, not markup.

## Why it matters (numbers, primary sources)
- Google Dataset Search finds datasets by crawling the web for schema.org `Dataset` (or DCAT) markup. Sizes over time: 25 million datasets at public launch (Google blog). 28 million from 3,700+ sites in March 2020 (Benjelloun, Chen & Noy, "Google Dataset Search by the Numbers", arXiv 2006.06894, read). 45 million from 13,000 sources (Sostek et al., Harvard Data Science Review 2024, abstract read).
- The same 2020 paper (read) found that **37% of URLs carrying dataset metadata in June 2019 had lost the metadata or were gone by March 2020**. Google's authors recommend persistent identifiers (DOI, compact identifiers) in `identifier` / `sameAs`.
- From the 2024 user study (abstract read): the open approach brings mixed, uneven datasets, and users struggle to make sense of them. Good descriptions and clear titles are what tell a dataset apart.
- Practitioner traffic numbers: **none found this run.** Google's own examples are science and government data. Treat this as a cheap discovery surface for researchers, students and AI tools that read schema, not as a proven traffic channel. Measure it before claiming any effect.

## The rules (Search Central, Dataset structured data page, read 2026-10-30)
- **Required:** `name` (unique and descriptive, e.g. "Snow depth in the Northern Hemisphere", not a bare "Data") and `description` (**50 to 5,000 characters**; Markdown is allowed; use `\n` for new lines in JSON-LD).
- **Recommended:** `url`, `sameAs`, `identifier` (DOI/ARK), `keywords`, `license` (a URL), `isAccessibleForFree`, `creator` (Organization/Person, with `sameAs` where possible), `temporalCoverage` (ISO 8601 interval, e.g. `1841/1987`), `spatialCoverage` (Place with geo), `distribution` (`DataDownload` with `encodingFormat` + `contentUrl`), `includedInDataCatalog`, `hasPart` / `isPartOf`, `variableMeasured`, `version`, `dateModified`.
- The markup describes the dataset (its metadata: what it covers, who made it, which variables). It does not carry the data values.
- Validate with the Rich Results Test, then watch the Search Console Dataset enhancement report. Data catalogues can use `DataCatalog` with `dataset` entries.
- Datasets show in **Dataset Search** (datasetsearch.research.google.com), and sometimes in Google Search dataset features.

## How-to (one afternoon, no tools to install)
1. Pick 2 to 4 real tables we already build: e.g. the evidence catalogue index (id, date, type, holder, page URL), the research timeline events (date, category, source id), the /wales/qa/ question log (date asked, institution, status; the build already emits /qa/api/qa.json), and the furniture catalogue (FUR ids, room, image links).
2. Publish each as a **stable CSV and JSON** at a versioned URL (e.g. `/data/evidence-catalogue.csv`), kept at the same path forever. The 37% churn finding is the reason.
3. Give each a **landing page** (one per dataset) with a human summary, column list, coverage dates, licence, "how to cite", and the download links. Put the `Dataset` JSON-LD on that page only, never on every page.
4. Licence: only for **our own compiled metadata** (dates, ids, categories, our summaries). Never license archive images or third-party transcriptions; see archive-image-permission-terms-ai-animation-paid-versions.md. CC BY 4.0 is the usual choice because it requires citation.
5. Optional DOI: deposit a frozen version on Zenodo (zenodo-doi-scholar-argentine-repositories.md) and put the DOI in `identifier` and `sameAs`. That gives the persistent identifier Google's authors recommend.
6. Validate in the Rich Results Test, add the landing pages to the sitemap, and request indexing in Search Console. After 2 to 4 weeks, search Dataset Search for "Llandough" and "Great House Farm".

Template (fill per dataset):
```json
{"@context":"schema.org
 "name":"Llandough Great House Farm evidence catalogue, 1841-1987",
 "description":"Index of catalogued records ... (50-5000 chars)",
 "url":"cedwyn.bucklerfamily.estate
 "keywords":["Llandough","Vale of Glamorgan","farm history","land records"],
 "license":"creativecommons.org
 "isAccessibleForFree":true,
 "creator":{"@type":"Organization","name":"Cedwyn"},
 "temporalCoverage":"1841/1987",
 "spatialCoverage":{"@type":"Place","name":"Llandough, Vale of Glamorgan, Wales"},
 "variableMeasured":["record date","record type","holding institution"],
 "distribution":[{"@type":"DataDownload","encodingFormat":"text/csv","contentUrl":"cedwyn.bucklerfamily.estate],
 "dateModified":"2026-10-30"}
```

## How we apply it to Cedwyn
- **Fits the graph work now in progress.** Worker 348231ae builds per-section scatter JSON at build time. The same build step can write the CSV, the landing page and the JSON-LD for 2 to 4 sections, so it costs nothing extra. Raise it as a [CEDWYN] HubSpot proposal for the build owner rather than editing their files.
- Use `temporalCoverage` and `spatialCoverage` honestly: the catalogue's real first and last record dates, and the place name only, with no family addresses or holdings.
- Public text rules apply to the dataset descriptions too: neutral third person, never name the project lead, none of the banned words (write "not checked"), no outbound links (`sameAs` only to our own Zenodo DOI if one is made).
- **Measure:** Search Console Dataset report (valid items), Dataset Search presence, and referrals from datasetsearch.research.google.com in the Analytics Engine beacon. Keep it only if it shows up within 8 weeks; otherwise leave the markup in place (it costs nothing) and stop investing.
- **Status:** proposal. No GO is needed for markup on our own site, but the licence choice should be logged in the HubSpot task body with its reasoning.

## Sources
- developers.google.com (read)
- arxiv.org (Benjelloun, Chen, Noy 2020, read)
- research.google (Sostek et al. 2024, abstract read)
- blog.google (launch, 25M; snippet)
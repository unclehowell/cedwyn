# Wikisource: scan-backed transcriptions of public-domain source documents (cite-back, not traffic)

Harvested 2026-10-30. Zero budget. Status for Cedwyn: PROPOSAL (a new public outpost needs the owner's GO; any account is his own, made by him).

## What the rules say (primary: en.wikisource policy pages, read 30 Oct 2026)
- **What qualifies.** Anything published, or created but never published, **before 1931** may be added if it is verifiable from "uploaded scans and printed paper sources" ({{PD-old}} licensing). After 1930, "documentary sources" qualify only if out of copyright or freely licensed: "official documents of the body producing them, or ... evidentiary in nature, and created in the course of events" (constitutions to "personal correspondence and diaries", "judicial proceedings").
- **Not accepted:** second-hand transcriptions (no copying our own site text or Gutenberg-style text, even if scan-backed), **extracts/partial works**, user-compiled reference material (lists, tables, timelines), original writing.
- **Language.** English Wikisource takes English texts (plus English translations / bilingual editions). Welsh-language originals go to the Welsh subdomain or the multilingual wikisource.org.
- **Workflow** (Help:Adding texts): find/create a scan (PDF or DjVu) -> upload it to **Wikimedia Commons** -> create an `Index:` page -> proofread page by page against the scan -> a *second* editor validates -> transclude into the main namespace. Being scan-backed is what lets anyone check the transcription against the image.

## What the numbers say (own measurement, Wikimedia pageviews API, user agents only, Oct 2025-Sep 2026)
| Wikisource page | views / 12 months |
|---|---|
| 1911 Britannica / Penarth | 55 |
| 1911 Britannica / Llandaff | 52 |
| 1911 Britannica / Barry | 93 |
| DNB 1885-1900 / Richards, David (Llandough-linked) | 69 |
| The Glamorgan Gazette (index page) | 171 |
| Glamorgan Gazette / 26 Sep 1919 / an obituary | 252 |
| Glamorgan Gazette / 22 Jun 1894 / a poem | 87 |

- en.wikisource search 30 Oct: "Llandough" 13 hits, "Leckwith" 1, all incidental (Alumni Oxonienses, DNB). **No Llandough/Leckwith source document is transcribed there.**
- External links on Wikisource pages carry `rel="nofollow"` (measured on the Penarth page). Expect **0 SEO value and ~0-5 clicks a year** from a niche local transcription.
- The local Wikipedia article "Llandough" got 209 user views in the same 12 months, so even sister-project links from there would bring very little.

**Honest read:** Wikisource is not a traffic channel. What it does offer:
1. a **neutral, third-party, scan-checked copy** of a public-domain record that our evidence pages can cite. That makes the evidence-first stance more credible to readers, archivists and AI answer engines, because the text is not hosted only by an interested party;
2. a stable, citable URL that Wikipedia editors can use;
3. permanence (a 1919 obituary there gets ~250 views a year, every year).

## How to do it (practitioner steps)
1. **Pick only pre-1931 printed or official items with a clean scan we are free to share.** Examples: a 19th-century printed directory or gazetteer entry for Llandough (a **whole** article or work, not an extract), a pre-1931 newspaper report (whole article, as the Glamorgan Gazette precedent does), a printed sale particular. A record held by an archive needs the **archive's reproduction terms** checked first: Glamorgan Archives' own photographs may carry reuse conditions even when the text is out of copyright.
2. Check Wikisource and Commons for an existing copy first; never duplicate.
3. Upload the scan to Commons with the source archive reference and {{PD-old-70}} / {{PD-UK-unknown}} as fits; categorise it under the place.
4. Create the `Index:` page, proofread each page **from the image**, not from our own transcript (the second-hand rule).
5. Ask on the Wikisource Scriptorium for a validator; or leave it "proofread" (yellow), which is still public.
6. Transclude it. Add an `{{author}}` or `{{header}}` note with the archive reference only. **No link to cedwyn on Wikisource** (it is not a promotion venue, the links are nofollow, and it would read as conflict of interest).
7. **Cite back the other way:** on the matching cedwyn evidence page, add "Transcription: Wikisource (scan-checked)" with the link. On Wikipedia, only an uninvolved editor should add it (see wikipedia-ai-citations-coilegal-llm-rules-gate.md / wikimedia-commons-wikidata-heritage-coi.md).

## Gate and stop rule
- GO only if the owner approves a Wikimedia account in his own name (or the existing Commons route in wikimedia-commons-public-domain-archive-images-glam.md is already approved), and the item passes the pre-1931 / documentary-source and archive-terms checks.
- Time box: one item, 2 hours max of proofreading. Measure its views with the pageviews API at 90 days. Do a second item only if the first one is cited by someone else (a Wikipedia ref, a forum answer) or passes 25 views.

## How we apply it to Cedwyn
- Best first candidate: a **whole** pre-1931 printed newspaper report or gazetteer entry about Tŷ Mawr / Great House Farm or Llandough already in the evidence catalogue with a scan. Check the catalogue for items with `date < 1931` and `scan: yes`.
- Public wording on cedwyn stays neutral and third-person and avoids the banned words. Describe the link plainly as a "scan-checked transcription".
- Log it in the project workspace with the pageviews URL so the 90-day check is one fetch.

## Sources
- en.wikisource.org (read 30 Oct 2026)
- en.wikisource.org ; en.wikisource.org
- outreach.wikimedia.org (an Armenian national-library programme; community growth, no traffic figures; not read in full)
- Wikimedia REST pageviews API (own measurement): wikimedia.org
- en.wikisource search API, 30 Oct 2026 (Llandough 13 / Leckwith 1 / Penarth 38 hits)
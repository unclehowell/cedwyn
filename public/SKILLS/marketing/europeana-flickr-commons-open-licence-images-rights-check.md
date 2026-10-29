# Open-licence archive images for posts: Europeana + Flickr Commons rights check
Harvested 2026-10-29 21:13Z by the skills harvest. Free, no install, zero spend. Use it for quote-card backgrounds, carousel slides, blog and Shorts stills when we don't hold our own image.

## Facts (primary pages, read 29 Oct 2026)
- **Europeana API filter:** `reusability=open` returns only **Public Domain Mark, CC0, CC BY or CC BY-SA** items (Europeana Knowledge Base, API FAQ 1.12). Metadata on europeana.eu is CC0 (Europeana terms of use). The images themselves carry each item's own rights statement.
- **Box test, 29 Oct 2026, demo key `api2demo`, all items vs open-only:** Penarth 1,686 / 126 · Cardiff 19th century 18,542 / 673 · Glamorgan farm 12 / 9 · Leckwith 3 / 3 · Llandough 2 / 2. So **only about 7% of the Penarth hits are reusable**. Assume a find is NOT reusable until its rights code states so.
- **Useful open finds:** British Library "Mechanical Curator" book illustrations under PDM ("near Cardiff from 'Industrial rivers of the United Kingdom'", "Cardiff: an illustrated handbook"). Also Portable Antiquities Scheme finds from Leckwith and Llandough under CC BY 3.0 (Bronze/Iron Age axeheads, a medieval brooch), and a Penarth beach & pier photo under CC0 (Central Library of Zurich).
- **RightsStatements.org has 12 statements.** These ones block commercial posts:
  - **InC-EDU** (educational use only; our posts sell e-books, so not educational)
  - **NoC-NC** (public domain, but non-commercial use agreed in a digitisation partnership)
  - **NoC-US** (free of copyright "under the laws of the United States" only; not valid for the UK)
  - **NoC-CR / NoC-OKLR** (contractual or other legal restrictions)
  - **CNE / UND** (copyright not evaluated / undetermined)
  - **NKC** (No Known Copyright; the institution has "reasonable cause" but no conclusive determination)
  - **InC** (needs the rights-holder's permission)
  Rule: anything outside PDM / CC0 / CC BY / CC BY-SA = skip, or ask the institution (an outward email, so the project lead's GO).
- **Flickr Commons:** historical photos from "over 100 cultural institutions", "almost two million photographs" with "over 4 billion views since 2008" (Flickr Foundation FAQ). Members must be recognised cultural memory organisations, not individuals, so we can only reuse, never join. The label is **"No known copyright restrictions" (NKCR)**. It is an institution's assertion at account level, not a licence. Reasons given include expired copyright, lapsed formalities, or the institution owning the copyright and choosing not to exercise it. So read the institution's own rights page before commercial use, and credit the institution.
- **CC BY-SA share-alike:** an edited derivative, such as a quote card laid over the image, must itself be BY-SA. Use BY-SA images unedited only.

## How to do it (5 minutes per image)
1. `python3 the project workspace "Penarth" 10` (stdlib, written this run). It lists title | provider | rights code | edit note | ready credit line | item page | image URL, open licences only.
2. Open the item page and confirm the rights statement on the page matches. Record the URL + rights + date in the post's log row.
3. Prefer **PDM/CC0**, then **CC BY** (credit required), then BY-SA (unedited only).
4. For Flickr Commons, open the photo page, check the NKCR label **and** the institution's rights link. If the institution adds "non-commercial" wording anywhere, skip.
5. Credit line in the caption or alt text: `"<title>", <institution>, via Europeana, <licence>`. Credit PDM/CC0 too, as a courtesy (our public text always cites records).
6. Never imply the image shows our farm unless the record states so. Caption it as what it is ("Penarth beach and pier, c. 1890s-1900s, Central Library of Zurich, CC0"). Date unknown? Write "date not checked".

## How we apply it to Cedwyn
- **Quote packs (weekly, Tue):** when a quote card needs a period background, use a PDM British Library illustration of Cardiff or the Ely rather than a generated image. Real period imagery fits the "records speak" voice.
- **Prehistory / Roman frames and the Shorts renderer:** the Leckwith and Llandough Portable Antiquities finds (CC BY 3.0) are real local objects for the c. AD 200 frame and the early-history posts. Credit "Portable Antiquities Scheme, CC BY". Add them to the evidence catalogue as context images, not evidence about the farm.
- **Sunday report:** log images used as "open-licence images used N (PDM/CC0/BY)". Kill rule: if 3 posts with open-licence images score no better than our own-photo posts over 4 weeks (same slot, reach per follower), stop sourcing and reuse our own stills.
- **Never:** InC-EDU / NoC-NC / NoC-US images in anything on a page that links to /ebooks/. No People's Collection Wales images unless their own licence is CC BY or open (see peoples-collection-wales-contributions.md). No insignia images.
- Not checked: `api2demo` rate limits (keep to a few queries per run). A free personal key needs a sign-up from a Tab mail address, which is optional.

## Sources
- europeana.atlassian.net (API FAQ: reusability=open = PDM/CC0/CC BY/CC BY-SA; read 29 Oct 2026)
- europeana.eu (metadata CC0)
- api.europeana.eu (box queries 29 Oct 2026, counts above)
- rightsstatements.org ; rightsstatements.org (12 statements and their wording)
- flickr.org (100+ institutions, ~2M photos, 4B+ views since 2008, NKCR reasons, membership rules)
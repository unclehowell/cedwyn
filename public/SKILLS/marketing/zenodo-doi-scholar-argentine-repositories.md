# Open-access deposit with a DOI: Zenodo, Google Scholar and Argentine university repositories

Topic: giving Cedwyn's free research outputs (evidence catalogue extracts, the names register, research notes) a permanent, citable DOI that scholarly and AI search harvests, and how Argentine repositories (SNRD / UNPSJB / SEDICI / CONICET) can be reached. Queued idea "Argentine university repositories" worked here. Added 2026-10-26 (skills harvest 14:52).

## The facts (checked 26 Oct 2026)

**Zenodo (CERN, free):**
- Anyone may register and deposit; all fields of research; any language; any research artefact (papers, datasets, reports, books). 50 GB per record (100 files), free. A DOI is minted for every published upload; you can **reserve the DOI before publishing** and print it inside the PDF/EPUB.
- Records are kept for the lifetime of the repository (CERN's programme, 20+ years). Withdrawal leaves a tombstone page; the DOI stays. **Treat a deposit as permanent.**
- A licence must be chosen for open files (CC BY 4.0 is usual). Metadata is exposed over OAI-PMH, which OpenAIRE and other aggregators harvest.
- Gap check: a Zenodo API search on 26 Oct for "Welsh" AND "Patagonia" returned 8 records, none on the Welsh settlement; "colonia galesa" returned 0. The niche is empty, so a Cedwyn record would be the first one there.

**Google Scholar (inclusion guidelines):**
- Scholar wants scholarly documents (papers, reports, theses, pre-prints). News, magazine pieces and book reviews are excluded. Files over 5 MB "such as books" are pointed to Google Books instead.
- An individual author can simply put a PDF on their own site: title large on page 1, authors on the next line, a "References" or "Bibliography" section at the end, and a link to it from a publications page. Repositories should expose Highwire tags (citation_title, citation_author, citation_publication_date, citation_pdf_url). Dublin Core only as a last resort. robots.txt must not block the PDFs; moved PDFs need 301s, never a redirect to the homepage.

**Argentine repositories:**
- SNRD (Ministry of Science; Law 26.899) is a network of institutional repositories; its portal repositoriosdigitales.mincyt.gob.ar already indexes UNPSJB work on the Welsh colony (e.g. De Bella 2020, gender and class in the Welsh colony of Chubut).
- RDI UNPSJB (rdi.unp.edu.ar, DSpace) is free but built for the university's own academic units. SEDICI (UNLP) takes self-archiving from registered authors or delegated deposit, CC licences, non-exclusive. CONICET's RI is for CONICET researchers.
- So an outside author **cannot self-deposit** in these. The routes are: (a) co-authorship or a research note with a UNPSJB/CONICET academic who deposits it; (b) being cited by their work, which a citable DOI makes easy. We did not confirm whether LA Referencia (the regional aggregator) harvests Zenodo; assume it does not.

## How to do it

1. Pick a **free** output, never the paid e-book: e.g. a 4-10 page research note or a dataset (CSV of the names register; object/custody register with sources). Paid e-books stay on /ebooks/.
2. Build it as a scholarly PDF: title, creator line, date, abstract, body, References, and on the last page "Full series: cedwyn.bucklerfamily.estate/ebooks/" (UTM: utm_source=zenodo&utm_medium=referral).
3. Zenodo > New upload > reserve DOI > put the DOI on page 1 > upload PDF (+ CSV, + an es/cy abstract) > resource type Publication/Report or Dataset > licence CC BY 4.0 > keywords (Llandough, Tŷ Mawr, Great House Farm, Welsh Patagonia, colonia galesa, Chubut) > related identifier: "is supplemented by" the Cedwyn page URL. Create a Zenodo **community** ("Tŷ Mawr / Cedwyn records") so later notes group together.
4. On Cedwyn, give each research note its own page with Highwire meta tags and a link to the PDF; add the DOI to the page's JSON-LD (identifier) and to llms.txt.
5. Put the DOI in every e-book's back matter and in outreach signatures to archives and universities; a DOI reads as a citable record to librarians and academics.
6. Argentina: draft (HubSpot only, sent on the owner's GO) a note to UNPSJB's history department / Instituto de Investigaciones Históricas offering the DOI'd dataset in Spanish for citation or a co-authored research note. Never ask them to deposit our paid work.
7. Check after 2-4 weeks: Zenodo views/downloads on the record page, Google Scholar search for the exact title, OpenAIRE Explore search.

## How we apply it to Cedwyn

- **Second:** the names register from the Enwau e-book as CSV (form, date, source, writer), with cy/en/es abstracts; it pulls academic citation in Argentina and Wales.
- **Owner decisions before any deposit (it is public and permanent):** the creator name (an organisation name such as "Cedwyn archive", so no person is named), the licence, and which documents are cleared for open release. Nothing is deposited without the owner's GO.
- Public text checks: no banned words (states, assertions, per, second-hand report, not checked, reported, deception, taken), no accusations about named people, nothing about family holdings or addresses.
- Tools: none to install. Zenodo has a free REST API, so a later run can script uploads with requests and a personal token the owner creates.

## Sources
- about.zenodo.org
- help.zenodo.org
- openaire.eu
- zenodo.org (gap search, 26 Oct 2026)
- scholar.google.com
- sedici.unlp.edu.ar
- rdi.unp.edu.ar
- repositoriosdigitales.mincyt.gob.ar
- argentina.gob.ar (SNRD resolution)
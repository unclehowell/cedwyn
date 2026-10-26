# WorldCat and Library Hub Discover: getting our e-books into library catalogues
Harvested 26 Oct 2026 (skills harvest 15:52). Internal skill file.

## The key fact: we cannot add records ourselves
- **WorldCat** (OCLC) shows only what member libraries catalogue. OCLC's author help: a library's holding may not show because the library is not an OCLC member, catalogued a different edition, or chose not to show its collection; "WorldCat.org only displays what is submitted from the member library". Corrections go first to the publisher or the cataloguing library.
- **Library Hub Discover** (Jisc) is the UK and Irish equivalent: one search across 100+ academic, national and special libraries (Jisc's own description, search snippet; the Jisc pages refused our fetch). A US library guide quotes it as 45.5M records from 162 institutions [secondary, not checked at Jisc]. It runs on Jisc's National Bibliographic Knowledgebase.
- So the route is: get the book into a library that catalogues it, then it appears.

## Routes that put a record there (free)
1. **Electronic legal deposit** (see legal-deposit-ebooks-uk-web-archive-nomination.md). The six legal deposit libraries (British Library, National Library of Wales, National Library of Scotland, Bodleian, Cambridge, Trinity College Dublin) share one e-deposit system. Cambridge University Library (5 Mar 2025) reports access restored only for e-books collected before October 2023 after the British Library cyber-attack; newer deposits are stored but access was still being rebuilt. Expect a long delay before a catalogue record shows.
2. **Library e-lending** via Kobo Writing Life -> OverDrive (see library-elending-overdrive-libby-via-kobo.md). When a library buys a licence it catalogues the title in its own system; whether that record reaches WorldCat depends on the library [not checked at source].
3. **A local-studies purchase or donation** by a library that is an OCLC member or contributes to Library Hub Discover.
4. **Open Library** (open-library-catalogue-records-ebooks.md) links to WorldCat once an edition has an ISBN or OCLC number.

## How to check (monthly, 5 minutes)
- search.worldcat.org: search each title and author; record the OCLC number (the "OCLC control number" assigned once a library catalogues the book, per Indies Unlimited [snippet only]).
- discover.libraryhub.jisc.ac.uk: search each title (the box is blocked; check from the browser or ask the owner).
- National Library of Wales catalogue: search the titles after any legal deposit.
- Log hits in the project workspace with date, catalogue and record URL.

## Numbers (with how far each was checked)
- WorldCat: 15,637 libraries in 207 countries, 512M+ bibliographic records (Book Launchers guide, read in full, but the figures are undated and secondary).
- Library Hub Discover: 45.5M records from 162 institutions [secondary libguide quote, not checked at Jisc].
- No practitioner case study ties WorldCat listing to sales; its value is authority (researchers, librarians and AI answers trust a catalogue record) and inter-library discovery.

## How we apply it to Cedwyn
- **Fit: medium, slow, zero spend.** Nothing to submit to OCLC or Jisc directly. Our job is to feed the routes above and check monthly.
- **Order:** (1) owner GO on electronic legal deposit (HubSpot draft to the deposit office only, never sent by us); (2) OverDrive opt-in for the paid £9.99 volumes once on Kobo; (3) Open Library records now; (4) ISBNs if the owner decides to buy them.
- **Record wording** must match the title pages and the editorial rules: 1824 David Stewart survey = first record mention of Tŷ Mawr found; 1667 = the family's acquisition, cited to the 1974 newspapers and ITV News 1988; no Bute dates before 1824; none of the banned public words; never name the owner.
- **Once a record exists,** cite its WorldCat or Library Hub link on the /ebooks/ page as "Held by ..." (library name), and add it to the JSON-LD sameAs list (merchant-listing-structured-data-ebooks.md).
- Never Draft2Digital.

## Sources
- help.oclc.org
- help.oclc.org
- jisc.ac.uk (snippet; fetch refused)
- acrl.libguides.com (secondary quote)
- lib.cam.ac.uk
- booklaunchers.com
- indiesunlimited.com (snippet only)
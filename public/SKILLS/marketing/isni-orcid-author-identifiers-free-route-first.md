# Skill: ISNI and ORCID author identifiers for an estate/imprint, free route first
Written 31 Oct 2026 (skills harvest). Zero-spend rule applies: any paid step below is a PROPOSAL only.

## What they are and why they matter for discovery
- ISNI (ISO 27729) is the international ID for a *public identity* (person, pseudonym, organisation, imprint). Libraries, Wikidata (P213), VIAF and book-trade metadata use it to tell same-name creators apart.
- ORCID is the free researcher ID (Wikidata P496). ORCID's own FAQ: "Can I use ORCID for free? Yes. Anyone who participates in research, scholarship, or innovation can register"; no institutional affiliation is needed (info.orcid.org, read via search snippet; support page returned 403 to us).
- Knowledge-panel practitioners list both as the "authoritative identifier" layer: "Add identifiers that already exist for you, like an ISNI, a VIAF record..." (instantpress.co, Knowledge Panel Without Wikipedia); Jason Barnard (Kalicube) names ISNI as a UK-based source Google pulls together (deepseoconference.com talk notes). These are practitioner opinion, not Google documentation; not checked against Google.

## Facts checked (31 Oct 2026)
- ISNI is "not quite" free: "the RA and RAGs charge fees to cover operating costs" (isni.org FAQs, read).
- isni.org (read): first SEARCH the ISNI database, because "if you have published works already available via library or commercial databases, then your ISNI may have been assigned via data from one of our many source databases". That is the free route.
- UK/Ireland: the British Library runs an ISNI Portal (launched 26 Apr 2021: register new ISNIs, search, and suggest corrections to existing records; isni.org article, read). The UK legal deposit libraries, including the National Library of Wales, are an ISNI registration consortium (isni.org registration agencies page, read). The portal's price was not found; treat it as paid until a page states otherwise.
- Bowker: "Each successful ISNI registration has a one-time fee of $5" (myidentifiers.com, search snippet; page 403 to us). Paid, so a proposal.
- The public ISNI search (isni.oclc.org SRU) works without a login. Test: "tolkien" gives 39 records. "cedwyn" and "great house farm" both give 0 today.

## How to do it
1. Search first: `python3 tools/isni_lookup.py "<exact author or imprint name>"`. A record may already exist from a library catalogue.
2. Free trigger: deposit the e-books (see legal-deposit-ebooks-uk-web-archive-nomination.md). BL/NLW cataloguing creates name authority data, and ISNI ingests library data. This is a mechanism, not a promise. Re-run step 1 monthly after deposit.
3. If a record exists: use the BL portal's free review function to suggest additions (official website URL, titles), so the record points back to the site.
4. ORCID (free, 5 minutes) only fits a named person who publishes research. It does NOT fit an organisation: ORCID is for individuals. Fill in Works with the e-books' ISBNs/URLs, and Websites with the site's /about/ page.
5. Wire the IDs together. Add to the site's Organization/Person JSON-LD `sameAs` (isni.org digits>, orcid.org). Add them to the Wikidata item if one exists (P213, P496), with a reference URL. Add them to Author Central and Books2Read profiles where there is a field.
6. Measure: whether a Google knowledge panel or AI answer engine names the author/imprint correctly within 8 weeks (visibility check queries). No click data exists for this. It is an entity-clarity move, not a traffic move.

## Pitfalls
- One identity = one ISNI. Do not request a second ISNI for a name that already has one; ask for a merge or correction.
- An ISNI record is public. Put no private address or birth date on it.
- Paying $5 to Bowker breaks the zero-spend rule. It needs the owner's GO.

## How we apply it to Cedwyn
- The e-books' schema names the author as the estate organisation (`bucklerfamily.estate/#org`) and one product as "Cedwyn editors". The identity to register is the imprint/organisation name. It is never a named family member, because public text never names the owner.
- Now (no account needed): isni_lookup.py run for "cedwyn" / "great house farm" = 0 hits (baseline 31 Oct 2026). Add a monthly re-check line to the visibility check runner.
- After legal deposit lands, re-search. If an ISNI appears, add it to the Organization JSON-LD `sameAs` on cedwyn (markup-only change, allowed for the onpage flywheel).
- PROPOSAL (owner GO needed, spend): a $5 Bowker ISNI for the imprint name, or the BL portal if its price is confirmed as nil. ORCID: skip unless a named researcher on the project wants one; it is the owner's decision because it is personal.

## Sources
- isni.org (read 31 Oct 2026)
- isni.org (read)
- isni.org (read)
- isni.org (read)
- myidentifiers.com (snippet: $5)
- info.orcid.org ; support.orcid.org (snippets)
- instantpress.co ; deepseoconference.com (practitioner opinion)
- isni.oclc.org (live queries 31 Oct 2026)
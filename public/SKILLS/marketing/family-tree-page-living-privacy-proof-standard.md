# Publishing a family tree page: living-people privacy, proof and search

Written 2026-10-27 for cedwyn.bucklerfamily.estate /familytree (family tree web app, the project lead asked 10:14-10:16 GMT).
Sources read today unless marked.

## The rules the big genealogy sites use (copy them)
- **UK law draws the line at living people.** ICO "What is personal data?" (read): "The UK GDPR only applies to information
  which relates to an identifiable living individual. Information relating to a deceased person does not constitute personal data."
  So the dead can be published in full; every living person is personal data and needs a reason (consent, or the family's own
  legitimate interest kept minimal).
- **FamilySearch** (help centre, snippet): a person is treated as **living until a death record is found, unless born more than
  110 years ago or married more than 95 years ago**; living people are visible only to whoever entered them (private trees /
  family group trees).
- **WikiTree** Help:Privacy (snippet; page behind a bot check): profiles of people **born over 150 years ago or who died over
  100 years ago must be Open**; recent people get privacy levels.
- **Ancestry** privacy centre (read): living people in public trees show as "Private"; trees export as GEDCOM.

=> House rule for Cedwyn: anyone born within the last 110 years with no death record = LIVING: show given name + surname + birth
**year** only, no exact date, place of residence, school, photo or relatives' contact details. Minors (Milo, b. 2013): the same,
plus never name his town or school. A living person appears only if they or their parent (here: the project lead for Milo) asked.

## Proof: what makes a tree trusted (and cited by others)
Genealogical Proof Standard, Board for Certification of Genealogists (FamilySearch wiki + BCG skillbuilding, snippets):
five elements: (1) reasonably exhaustive research; (2) complete, accurate citation of the source of each fact;
(3) analysis and correlation of the evidence; (4) resolution of conflicting evidence; (5) a soundly reasoned, written conclusion.
Practical form for the web page:
- Every person card lists its sources (catalogue ID or record name + date). A link with no source is shown dashed and labelled "not yet found".
- Where records conflict (two Mary Williamses of Great House Farm), show both and say which record supports which person.
- A short "How this tree was built" note: records searched, what is still missing. Missing records invite readers to help.

## Search and discovery
- Each deceased ancestor deserves a crawlable text entry (name, years, place, sources) in the HTML, not only in JS/SVG,
  so "Frederick Buckler Yorkshire" style surname+place searches can find it. Keep living people out of crawlable text beyond
  name + year.
- Do **not** use Google's ProfilePage markup: Google's doc (read) states it "is designed for any site where creators ...
  share first-hand perspectives" (forums, social), not for historical people. Plain schema.org Person in JSON-LD with
  birthDate/deathDate (years) is harmless but earns no rich result; the visible text matters more.
- Offer a GEDCOM download of deceased people only (the format every genealogy tool imports) - the thing family historians
  actually reuse and link to.
- Free genealogy directories (GENUKI, Cyndi's List) are covered in heritage-genealogy-directory-listings.md; list /familytree there once live.

## How we apply it to Cedwyn
1. /familytree: deceased people in full with sources; living people (the project lead, Milo Stewart b. 2013) name + birth year only;
   Milo's place never shown (the project lead said he is in Yorkshire: do not publish). Frederick Buckler "born Yorkshire" only once a
   birth or census record backs it; until then show "birthplace: Yorkshire (family account; record not yet found)" so the
   lead is visible but clearly unproven, and keep searching (FreeBMD, 1851-1911 census).
2. Apply the 110-year rule automatically in the data file: `living = death is None and (birth_year is None or birth_year > this_year-110)`.
3. Version table + "How this tree was built" panel; each gap becomes a call for records (links to /ebooks/ and the contact path).
4. Crawlable text list under the diagram; GEDCOM of deceased people later (v0.2.0).

## Sources
- ico.org.uk (read)
- familysearch.org (snippet)
- wikitree.com (snippet)
- ancestry.com (read)
- familysearch.org ; bcgcertification.org (snippets)
- developers.google.com (read)
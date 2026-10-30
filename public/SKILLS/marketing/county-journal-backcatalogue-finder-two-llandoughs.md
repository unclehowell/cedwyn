# County journal back-catalogue finder: what Morgannwg and Cardiff Naturalists printed on our parishes

Harvested 30 Oct 2026. A free content-and-credibility skill: find every article the county
societies have printed on Llandough, Leckwith, Cogan and Penarth, read them, and turn them into
cited "From the journals" posts and a further-reading block. Zero spend, no outreach needed.

## What exists (measured 30 Oct 2026)
- Morgannwg (Glamorgan History Society journal), vols 1-48, 1957-2004, free on Welsh Journals
  (glamorganhistory.org states the run is online; Vale of Glamorgan libraries page states the
  same). Welsh Journals collection id 1169834: 48 issues, 1,057 article/review rows.
- Reports and Transactions of the Cardiff Naturalists' Society, 1900-1981: collection id
  1373290, 63 issues, 934 rows.
- journals.library.wales is Cloudflare-walled from this box; the IIIF manifests at
  iiif.llyfrgell.cymru are not. tools/nlw_journal_articles.py reads them (stdlib only); this run
  added a regex flag: `python3 tools/nlw_journal_articles.py 1169834 --re "llandough|leckwith|cogan|penarth"`
  (a whole collection takes about 15 s with --delay 0.2). The PDFs are scans; read page by page
  with `pdftoppm -r 80` and eyes, then delete the temp files.

## Hits for our area (titles grepped 30 Oct 2026; each PDF is datasyllwr.llgc.org.uk)
| Journal | Title | Where | Code | Our Llandough? |
|---|---|---|---|---|
| CNS Trans. | The Manors of Sully, Cosmeston, Penarth and Cogan | vol. LXVII p.17-30 | AWJBW036004 | Cogan/Penarth — read next |
| CNS Trans. | The occurrence of jet at lower Penarth | vol. XLIII p.36 | AWJBW012007 | geology, minor |
| CNS Trans. | Some reasons for believing that Barry and Sully gave names to their Lords' families | vol. XXXVI p.116 | AWJBW005012 | neighbour, place-names |
| Morgannwg | The place-names of Dinas Powys Hundred, by Gwynedd O. Pierce (review) | vol. 12 p.111 | AWJBQ012011 | yes: the hundred holds Llandough-juxta-Penarth and Leckwith |
| Morgannwg | Biglis, Caldicot and Llandough ... excavations 1977-79 (review) | vol. 33 p.80 | AWJBQ033013 | the Roman villa site; not checked which Llandough on the page |
| Morgannwg | Llandough Castle, near Cowbridge | vol. 33 (1989) p.7-36 | AWJBQ033002 | NO — the other Llandough |
| Morgannwg | Gabriel Fauré and the Llandough connection | vol. 47 p.47 | AWJBQ047004 | NO — read p.48: the Ebsworth lease of Llandough Castle (1893), i.e. near Cowbridge |
| Morgannwg | Dinas Powys. An Iron Age and early medieval settlement (review) | vol. 8 p.76 | AWJBQ008010 | neighbour |
| Morgannwg | A history of the parishes of St Andrew Major and Michaelston-le-Pit (review) | vol. 4 p.86 | AWJBQ004016 | neighbour |
| Morgannwg | Penarth: the garden by the sea (review) | vol. 42 p.101 | AWJBQ042033 | Penarth |

Morgannwg volume numbers above come from the PDF file code (AWJBQ0NN = volume NN); vol. 33 = 1989 is
confirmed by an outside citation of "Llandough Castle, near Cowbridge", Morgannwg 33 (1989), pp. 7-36.

## The two-Llandough trap (the main lesson)
Glamorgan has two Llandoughs: Llandough-juxta-Penarth (Llandochau Fach; our parish, St Dochdwy's,
the hospital) and Llandough-juxta-Cowbridge (Llandough Castle). Two of the three "Llandough" titles
in Morgannwg are the Cowbridge one. Before a title becomes a post or a citation, read the first
page and look for Cowbridge, the Castle, St Mary Church, Penllyn (Cowbridge side) versus Penarth,
Cogan, Leckwith, Ely river, Dinas Powys hundred (our side). Write which one it is in the table.

## Playbook
1. Run the finder on both collections with the parish regex plus neighbours (sully, lavernock,
   dinas pow, wenvoe, michaelston, ely). Save hits to a table like the one above.
2. Triage by reading the first page of each; mark "ours / other Llandough / neighbour".
3. For each "ours" article: one 150-250 word "From the journals" note — the finding in our own
   neutral words, a short quotation at most (NLW notes copyright may apply: never re-host the
   PDF), full citation as text (author, title, journal, vol., year, pages).
4. Add a "Printed in the county journals" further-reading block to the matching Cedwyn research
   or wiki page: citations as plain text, no outbound links (site rule).
5. Re-use the notes on social on the matching hashtag day (see the #FolkloreThursday and
   heritage hashtag skills), each with the internal Cedwyn page link.
6. A neighbour article that names our places in passing is still a lead: log it, read later.

## How we apply it to Cedwyn
- First read: "The Manors of Sully, Cosmeston, Penarth and Cogan" (CNS LXVII, 14 pages) — the
  manorial frame for Cogan next to Llandough; then the Pierce place-names review for the Leckwith
  and Llandough entries. One note each, queued as HubSpot tasks for the research lane.
- Put the two-Llandough check in the research editorial checklist, beside "Llandough Farm is
  not Great House Farm": a Cowbridge source must never be cited for our parish.
- Further-reading block on /research/sources-and-archives/ (citations only), proposed through
  the engineering lane, not committed from this lane.
- Editorial rules: neutral third person, never name the project lead, banned words, no insignia, nothing

## Sources
- IIIF manifests: iiif.llyfrgell.cymru (Morgannwg) and .../1373290/manifest.json (CNS), read 30 Oct 2026
- Article PDFs: datasyllwr.llgc.org.uk (pages 1-3 read), others titles only
- Morgannwg id found via the Wikidata entry Q6911960 search snippet (journals.library.wales)
- valeofglamorgan.gov.uk (snippet: Morgannwg 1957-2004 at NLW)
- Related skill files: nlw-welsh-journals-iiif-pdf-route-past-cloudflare.md, review-copies-welsh-local-history-journals.md

## Run 2 (BIZDEV R6, 30 Oct 18:4xZ): neighbour regex added (sully|lavernock|dinas pow|wenvoe|michaelston|leckwith|cogan|penarth|llandaff|tithe)
- New neighbour leads: CNS LXV pp.30-40 "The Manors of Michaelston-Le-Pit and Wrinstone and their early owners" (AWJBW034004; Michaelston-le-Pit shares a community with Leckwith; read next); CNS XCVIII pp.4-17 "Contributions towards a history of Wenvoe Castle" (AWJBW061004).
- Triage done: Biglis/Caldicot/Llandough review (Morgannwg 33) does not name the place; Heneb GGAT 73 puts the Llandough villa beside the church and excavated cemetery, i.e. ours (BAR 188 not checked). Pierce review (Morgannwg 12) has no parish detail; the 1968 book is in Welsh public libraries (llyfrgelloedd.cymru), not online.
- CNS vol. LXVII = 1934 (issue label). Notes: the project workspace; research-lane task [CEDWYN GAP] [record].
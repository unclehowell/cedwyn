# Standing orders

These bind every agent, every cycle. When two orders conflict, the newer one wins; record the conflict in LESSONS.md.

## Public text
1. Never name the project lead. Present material as cited historic record, not as anyone's personal account.
2. Banned public words: the list is stored encoded so this page stays clean. Decode it once and load it into your scanner:
   `python3 -c "import base64,json;print(json.loads(base64.b64decode('WyJzYXlzIiwgImNsYWltcyIsICJhY2NvcmRpbmcgdG8iLCAiaGVhcnNheSIsICJ1bnZlcmlmaWVkIiwgImFsbGVnZWQiLCAiZnJhdWQiLCAic3RvbGVuIl0=')))"`
   Where a fact is not checked, write "not checked".
3. No family insignia or emblem designs. Nothing about the family's present holdings or addresses. No outbound links from Cedwyn.
4. No accusations against named private people. Public bodies are assessed on their records.
5. No hedging or disclaimer lines that downplay family evidence; unbacked points go in the small italic style instead.
6. Prices come from the store's data; never hard-code a price in copy. Any price or fact change triggers a sweep of everything scheduled or queued.
7. Photos taken on archive visits under a private-photography undertaking are never published. Personal social channels of family members are never linked or embedded.

7a. Text blocks show a title and two or three lines on load, then "Read more", which reveals one more paragraph at a time, with a new "Read more" at the end of each revealed paragraph, and "Less" to collapse back. The full text stays in the page for search engines and agents; without scripts everything shows. Never a heading followed by a bare "Read more" fold. Landing pages carry minimal text: titles, a few lines, then images, graphs, animations, infographics and video. A page with several prose blocks merges them into one segment.
7b. Pages never explain themselves to human readers; how the site works lives in the docs library and in machine-facing files. Front ends carry layout only; words and data come from the database, and the whole database is exportable.
7c. Public provenance names the source only: holder or archive, reference, date. Never who found, read or catalogued a record; no internal cycle or finding numbers. Change logs credit "Cedwyn editors".
7d. A new section is a new branch with its own data, registered in the site's section list by one site-wide pull request.
7e. Every e-book and digital art edition carries a whole-release semantic version; v0.0.1 is the free edition. The version picker opens on the latest release, with a link to the free edition beneath it. Art editions show a disabled "Coming soon" in place of a buy button until sales open.
7f. Generated or edited media (art editions, quote cards, film stills and sets) use as sources only images confirmed as the farm, or catalogued records of it (maps, plans, documents). Images withdrawn as not of the farm never serve as sources anywhere.
7g. Every attachment on an institution's reply becomes an evidence record with its own page at /research/artifacts/<catalogue-id>/: a preview first (personal data boxed out), then three segments: Transcript, Artifact description, Our integration. Logos, letterheads and email signature images are not artefacts. Material from personal-data requests is read but held privately.
7h. Visitor and destination pages (tours, places) lead with history, heritage, family, landscape and what a visitor sees and does. The legal dispute is one short point among many there: a line or two and a link to the research section, never the headline and never longer than the other points.
7i. Tour stops label what stands today as Real and what is reconstructed as Augmented (AR), with a small badge per stop. Anything that physically stands is never shown as a hologram or virtual.
7j. The site publishes its own corrections. When something we published proves wrong, it is corrected on every page, file and image where it appears (the image first), logged as a dated entry in the public register of disproven theories and corrections (what we stated, where and when, what the record shows with its source, when corrected), and raised as a change request in the project records. Outreach that carried the error gets a short correction draft for the project lead's sign-off.

## Outward actions
8. Agents draft; the project lead sends. No agent sends email.
9. Information-request drafts live first as HubSpot tasks and go through the hive (see HARNESS/hive.md). Only after the exact-version gate passes may one in-thread Gmail draft be created, by the dealer seat only.
10. Outreach goes to companies and institutions only — never to private individuals — and respects the do-not-contact list.
11. Press, prices, new public channels and new email journeys are proposals for the project lead's GO.
12. Zero spend: no ads, no bought followers or views, no paid tools.
13. Before any draft: search sent and draft mail for the same body and question; never re-ask what is pending; never commit to anything on the project lead's behalf.

## Working
14. Triple-check anything that touches the outside world (HARNESS/publish-gate.md).
15. Long work goes to a worker; the conversation is never held by a job.
16. One worker per job; check what is running before spawning.
17. One relay per worker report; never repeat news already given.
18. Bring the project lead only what truly needs him: a sale, a real milestone, a decision or login only he can give.
19. Every time in a brief or log names its zone (UTC, GMT or BST).
20. Each Cedwyn section lives on its own branch; main changes only for site-wide work. The old datro repository and the WordPress wiki are frozen: redirects only.

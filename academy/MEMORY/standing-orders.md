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

7a. Text blocks show three lines on load, then "read more", which expands in place and becomes "less". Never a heading followed by a "Read more" fold.
7b. Pages never explain themselves to human readers; how the site works lives in the docs library and in machine-facing files. Front ends carry layout only; words and data come from the database, and the whole database is exportable.
7c. Public provenance names the source only: holder or archive, reference, date. Never who found, read or catalogued a record; no internal cycle or finding numbers. Change logs credit "Cedwyn editors".
7d. A new section is a new branch with its own data, registered in the site's section list by one site-wide pull request.

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

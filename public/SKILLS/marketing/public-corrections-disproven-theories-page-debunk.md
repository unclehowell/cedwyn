# Public corrections + "disproven theories" page (debunk structure, due prominence)
Harvested 2026-10-27 (tied to the project lead 12:28: "Add a disproven theories page ... treat this like a change request. Damage control this news").

## What the evidence states
- Corrections work; "backfire" is rare. Wood & Porter (Political Behavior 2019): 5 experiments, 10,100+ subjects, 52 issues — corrections moved people toward the facts, including against their own side; backfire essentially did not appear (abstract read via SSRN/APA). Swire-Thompson et al. 2020 (PMC7462781): earlier backfire findings largely measurement/design artefacts.
- Debunking Handbook 2020 (Lewandowsky + 21 researchers; PDF read): structure every correction as FACT -> MYTH (once, flagged as a myth) -> FALLACY (why it was wrong / how the error arose) -> FACT (repeat). Lead with the fact if it is clear and pithy; don't rely on a bare "this is not true". Give an alternative explanation to fill the gap the myth leaves.
- UK press norm: IPSO Editors' Code Clause 1(ii) — a significant inaccuracy "must be corrected, promptly and with due prominence"; IPSO's digital guidance: prominence judged against where the error appeared (ipso.co.uk returned 403 to our fetch; wording from the Code page snippet + Society of Editors copy).
- Search: Google is phasing out ClaimReview (fact-check) rich results (Search Central doc read 27 Oct 2026; Poynter 2025) — markup still feeds Google's Fact Check Explorer, but don't expect a SERP badge. FAQ rich results restricted since 7 May 2026 (third-party, not checked).

## Page recipe (/research/disproven/ or similar)
1. One-line purpose: "Ideas we tested and set aside, and corrections to our own pages. Kept so the record stays honest."
2. Two lists, newest first: (a) CORRECTIONS (our own errors), (b) THEORIES SET ASIDE (ideas tested and not supported).
3. Each entry, 4 short lines in Handbook order:
   - Fact: what the record shows (with EV-ID / source link on our site).
   - Earlier version: what we (or a theory) previously stated — once, labelled.
   - Why it was wrong: the source or measurement that changed it.
   - Date corrected + pages changed (each linked).
4. Due prominence: on every page that carried the error, a dated one-line note at the place of the error ("Corrected 27 Oct 2026: ... see Corrections"), not only a footer.
5. Keep the version table / changelog line per page (semver bump) — the PRINCE2 change record.
6. Optional: ClaimReview JSON-LD only for "theories set aside" (Fact Check Explorer); no expectation of rich results.
7. Neutral wording; never name private people; disproven ≠ accusation.

## PRINCE2 framing (the project lead: "treat this like a change request")
Log as an Issue (type: off-specification for our error; request for change for the new page) in the Issue Register: description, impact (pages, emails, e-books), priority, decision, date closed. The corrections page is the public face of closed off-specification issues.

## How we apply it to Cedwyn
- First entry: Parcel A boundary — Fact: Parcel A ends before the 1970-registered green; Earlier version: site/infographic showed the green inside Parcel A (only if the parcels worker confirms); Why: the drawing and registration record; Pages changed: /parcels/, infographic, others the worker lists.
- Move existing "kissed frogs" / open questions (e.g. demolition Nov vs 6 Dec 1988 — that's OPEN, not disproven) carefully: only items actually set aside go on the page.
- Banned words apply (no "assertions", "reported", "not checked": write "not checked" / "not supported by the record").
- Link the page from footers and llms.txt so agents and readers find it; an honest corrections page is a trust signal for press and institutions.

## Sources
- papers.ssrn.com ; psycnet.apa.org
- pmc.ncbi.nlm.nih.gov
- climatecommunication.gmu.edu
- ipso.co.uk ; ipso.co.uk (403 to fetch)
- developers.google.com ; poynter.org
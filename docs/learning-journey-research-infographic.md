# Cedwyn learning journey: research and infographic requirements

Status: implementation brief, not a claim that these acceptance criteria have passed.

## Visitor model

Cedwyn is one ordered learning journey of approximately 38 themes/segments under one domain. Each stop is a distinct application or presentation mode over a shared Great House Farm catalogue: catalogue/research, timeline, map, story, e-book, augmented tour, game, infographic, and other useful views.

The canonical theme registry/site chain is the single source of truth for ordering. Each included stop must have working Previous and Next controls in the standard third header row, including mobile. Every stop must also provide a clear return to the theme directory. Test direct loads, refresh, deep links, internal links, keyboard operation, and narrow screens. Do not claim the tour is complete until every included stop has passed.

## Shared database

The shared SQLite catalogue remains the source of truth for artifacts and relationships. Different themes should query or render the same records in different ways; they should not maintain competing copies of the same artifact metadata or hand-maintained relationship chains.

For each view, preserve provenance and stable artifact identity. Keep source artifacts, interpretation, and presentation separate so later corrections propagate consistently.

## Research Library

The former Legal Wiki / Research Library should present a searchable catalogue. Each artifact record should show, where available:

- stable catalogue ID, title, date, source/provenance and record type;
- a plain description and the original document/image or archived representation;
- a separate interpretation / forensic assessment grounded in the full known chronology;
- links to related artifacts and the events/parties/land parcels mentioned;
- evidence supporting and challenging each material interpretation;
- confidence/status distinctions: established record, family account, inference, hypothesis, unresolved question.

Do not present an allegation, inference, or suspected coordination as a court finding or established fact. Preserve contrary evidence and explain what primary record would confirm or refute a hypothesis.

### Parcel B research entry

Add or update the Research Library entry to assess Parcel B separately from Parcel A. It should cover:

1. The 1916 Bute–John Williams yearly agricultural tenancy reportedly covering the whole farm, as recited in the Court of Appeal judgment; verify the original deed and plan.
2. The 1938 Bute–Western Ground Rents conveyance: inspect the operative wording, schedules, recitals, plan, reservations/exclusions, root of title, and whether Parcel B is actually included. Do not infer the exact legal interest solely from a later recital that a reversion was conveyed.
3. The May 1939 DBDT123/7 monthly letting between WGR and John Williams: transcribe the full instrument and plan, identify parcel and acreage, and distinguish the fact that WGR acted as landlord from proof of its underlying freehold title.
4. The 1949 tenancy arrangement and the 1955 possession proceedings/execution, including the exact land covered and the legal effect of the unchallenged order.
5. The possible 1926 copyhold route: seek manorial admissions, court rolls, rentals, surveys and plans tying any customary estate to the same Parcel B land. Do not equate an agricultural tenancy with copyhold.
6. The reported last rent paid to Alfred Thomas in 1928 and the theory that the 1939 agreement was intended to defeat a twelve-year adverse-possession claim. Label the latter as a hypothesis; explain what establishes possession, intention, continuity, parcel extent and any relevant acknowledgement/tenancy.
7. Counter-evidence, including the tenancy history and the 1987 Court of Appeal's treatment of the family's possessory-title case.

Primary-record priorities: original 1938 conveyance and plan; full DBDT123/7; original 1916 tenancy and plan; Bute manorial records; 1949 tenancy papers; 1955 claim, affidavits, sealed order, warrant and execution return; rating books and correspondence if the rates-sabotage theory is pursued.

## Infographic: Land Changing Hands

Build the “Land Changing Hands” theme as an animated and narrated arc diagram or chord diagram over the shared database's entities and relationships.

- Nodes: parties, parcels, institutions, courts and registrations.
- Edges/events: conveyance, reversion, tenancy, possession order, registration, ownership assertion, physical possession and demolition. Use distinct types; do not portray every relationship as a transfer of ownership.
- Each edge/event must have date (or an explicit approximate/unknown status), parcel scope, source artifact(s), and a link to the Research Library record.
- Narration should step through the chronology with pause/replay, Previous/Next, keyboard controls and reduced-motion support.
- Mark disputed, incomplete or unverified edges visually. In particular, do not assert that the 1938 conveyance included Parcel B until the deed and plan establish it.
- Keep the diagram data-driven. Its title chain must derive from the same catalogue relationships as the Research Library, not from a separate hard-coded story that can drift out of sync.

## Acceptance criteria

- The ordered registry and deployed tour agree on the expected ~38 stops.
- Every included stop has functioning Previous/Next and return-to-directory navigation; no broken internal routes or missing header rows.
- Smoke-test every theme at its direct URL and under its Cedwyn path, including mobile layout.
- A Research Library user can find an artifact, view its source/description and separate assessment, inspect supporting and contrary records, and navigate between related artifacts.
- The infographic narration and every material relationship open the underlying source artifact; uncertainty is explicit.
- Add a concise changelog entry and increment the relevant semantic version when implementation ships.
- Report build/deployment verification and list any acceptance criteria that remain unmet.

This document is a requirements baseline only. It is not proof that implementation or deployment is complete.

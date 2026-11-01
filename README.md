# Bloculous — webapp 41 of 59 (slot provisional)

Served at /bloculous/ on cedwyn.bucklerfamily.estate from the snapshot branch `section/bloculous`
(pinned in `sections.lock` on main; themes.json id `bloculous`; listed in the Online area only).

The theme and concept come from one paper: DATRO Consortium, *Bloculus – Business Case, Communications Protocol*, v0.0.0
(24 July 2021), in unclehowell/datro, branch `library`, `wayback/2021-08-24_dao_society-bloculus_businesscase_v0.0.0.pdf`.
The page restates only what that paper contains: the solar geodesic communications equipment rooms ("Neo Domes"), the name
(Bloc + Loculus), the four technical challenges, H3 resolution 8 hexagons + Handshake top-level domains, the address shape
`service.category.<h3 cell>` (the paper's example `matrix.messaging.8843a13687fffff`), HotspotBnB / Cacher, and the open
security issue. The paper's market and finance section (2.3) is deliberately not shown (no money words on this page).
The honeycomb demo is an illustration, not a real H3 lookup.

Look: the paper's own palette (white page, cobalt #1f4fb5 / sky #5b8de8 honeycomb), its honeycomb mark (img/bloculus-mark.png,
cut from the paper's cover) and its annexure figures (img/h3-*.jpg). Photographs of the domes (img/dome-*.jpg) were supplied by
the owner for this webapp; captions never name anyone.

Files: index.html, bloculous.css, bloculous.js, lang.json (interface strings), img/. Static, no network calls, no outbound links,
390 px first, scope tag data-scope="online". No paid version, so no version gate (docs/VERSION-STANDARD.md §1).
When the page changes: bump VERSION, add a CHANGELOG entry and the footer changelog line.

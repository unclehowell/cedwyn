# LESSONS — mistakes and the rules they produced

Each lesson: what happened → why → the rule now. Newest lessons are appended by the library flywheel from the project's lessons log and worker reports.

## Coordination
- **Relay loop (26 Oct 2026).** One worker's report was relayed to the project lead five times in three minutes, plus an apology. → Why: each new turn re-read the same report and nothing recorded that it was sent. → Rule: one relay per report; record "sent once" in memory before ending the turn; check the record before any relay.
- **Duplicate spawns.** Schedules firing every few minutes started second workers for jobs already running. → Rule: every schedule checks running work by a fixed goal prefix and does nothing if one is running.
- **A held conversation (20 Oct 2026).** The main conversation was held by a long job for over ten hours; scheduled runs queued and the project lead heard nothing. → Rule: long work always goes to a worker; any gap over two hours in an active programme gets a one-line status.
- **Wiki write races (20 Oct 2026).** A bulk wording pass wrote pages from copies read before another worker's edits and silently undid them. → Rule: re-read the record's modified time immediately before writing; re-verify your change a few minutes later while other writers run.
- **Stale generated file (21 Oct 2026).** A push overwrote a sibling's rebuilt script with an old local build. → Rule: after every fetch or rebase, re-run the generator on the fetched sources.
- **Superseded runner steps (26 Oct 2026).** A runner still mandated steps that a newer order had replaced, and a refresh committed to a frozen target. → Rule: read the newest standing orders before step one of any runner; newer orders win.

## Outward actions
- **Quoted history in a reply (20 Oct 2026).** An email re-quoted an earlier message the recipient had been asked to disregard. → Rule: send as a new message or strip quoted history; scan the full outgoing bytes, quoted parts included.
- **Fee wording.** A request offered to pay copying charges. → Rule: scan drafts for pay, quotation and cost wording; no draft commits the project lead to anything.
- **Asking the same body twice.** A ladder step suggested a question already asked months earlier. → Rule: search sent and draft mail for the body and its predecessors before drafting; re-check the premise.
- **Time zones (20 Oct 2026).** A brief gave a UTC time as BST. → Rule: every time names its zone.

## Publishing
- **Price drift (20 Oct 2026).** After a price change, old prices stayed on eight surfaces and in scheduled captions. → Rule: prices are read from the store data; any price or fact change triggers a sweep of everything scheduled or queued.
- **A banned phrase on a mirror (20 Oct 2026).** → Rule: scan every publish, mirrors and copied pages included; builds fail on a hit.
- **A private surname in an e-book (19 Oct 2026).** → Rule: privacy scan on the final bytes of every book or page.
- **A date inferred from a filename (20 Oct 2026).** A plan was captioned with a date and origin taken from its media title. → Rule: captions state only what the record shows; never infer dates from filenames, titles or neighbours.
- **Archive photos nearly published (20 Oct 2026).** Photos taken under a private-photography undertaking almost went public. → Rule: never publish them without the archivist's written authority.
- **Outside dates repeated (26 Oct 2026).** Pages repeated pre-1824 outside catalogue dates as if they were records of the house. → Rule: outside records are tested, not repeated; see the chronology corrections.
- **Process notes in provenance (26 Oct 2026).** Some catalogue provenance fields described how a record was gathered rather than where it is held. → Rule: provenance is the source only (holder, reference, date); the site build fails on finder or cycle wording.
- **Two kinds of "read more" (26 Oct 2026).** A site-wide three-line clamp met older section-level teasers, giving two styles on one page. → Rule: when a site-wide pattern lands, unwrap the older section versions at build time and check every section at 390 px.
- **Hedging family evidence (26 Oct 2026).** Phrases framing the 1667 acquisition as an unsupported story. → Rule: cite the record; never hedge it.

## Tools and platforms
- **Connected-app retries.** After one failure an identical retry can be refused, and a server error on a write does not prove nothing was written. → Rule: read the target state, then retry once with one harmless change.
- **Cache-busting parameters** are rejected by some payment APIs as unknown parameters. → Rule: no cache-buster on those calls.
- **Wildcard edge workers (25 Oct 2026)** ran on every asset request and exhausted the free daily quota by midday. → Rule: scope page-injecting workers to HTML or bake the change into the build.
- **Library catalogues behind bot protection** refuse plain fetches. → Rule: use a real browser session, or the cycle's saved article text for re-reads.
- **Measuring build stamps, not data (24 Oct 2026).** An adapter read dates from a homepage's HTML. → Rule: point adapters at the data endpoint the page itself fetches.
- **Broad sweeps vs named pointers (26 Oct 2026).** A week of broad newspaper sweeps moved no score; named pointers (a register entry, a deed, a case citation) produced the finds. → Rule: prefer named-pointer routes.
- **Truncated attachment IDs (26 Oct 2026).** Three mail-attachment downloads failed as "invalid token" because the long attachment ID had been cut short in a brief. → Rule: never slice an ID; pass it whole from a file.
- **Stale script after a build (26 Oct 2026).** A site-wide form fix shipped, but the edge kept serving the old script because its version parameter did not change. → Rule: bump the asset version in the build whenever a script changes, then purge the cache for that file.
- **Rate-limited forms (26 Oct 2026).** The sign-up list accepts six sign-ups per hour from one address; live tests used five. → Rule: test with one designated test address, sparingly, and note the window in the report.
- **Already-published media keeps old wording (26 Oct 2026).** Reels aired before a wording change still carried an old price and outdated lines, and the platform refused edits. → Rule: when a standing order changes, list every published item it touches; replacements and deletions of live posts are proposals for the project lead.
- **Dark-mode inversion (22 Oct 2026)** muddied data visualisations. → Rule: mark the figure to keep its own colours; never edit the shared theme for one page.

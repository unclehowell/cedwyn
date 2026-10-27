# The publish gate (three passes)

Every public or outward action — a site deploy, a page, an e-book, a social post, a HubSpot record, a mail draft — passes all three. A failed pass stops the action.

**Pass 1 — Rules.** Run the scanner on the exact bytes that will go out: banned words, the project lead's name, private names, phone numbers, email addresses, keys and tokens, outbound links, insignia imagery, pre-1824 outside dates, hedging phrases, payment wording, process wording in provenance (who found or catalogued a record, internal cycle numbers), and any line where a human page explains itself. Check the sign-off and footer.

**Pass 2 — Fresh re-read.** Re-open the primary source for every date, ID, reference, name and number. Re-read the live page or record you are changing; it may have moved since you started. For anything addressed to a body: search sent and draft mail for the same body and question first.

**Pass 3 — Look at the real result.** Fetch the live URL with a cache-buster, render it at 390 px wide and check text, links, images, footer and layout. For records, re-read by ID. Put the evidence (URL, commit, record ID, screenshot path) in the report.

The library's own scanner (tools/scan.py in the library flywheel) implements pass 1 for this section; it fails the build on any hit. The main site build runs its own privacy check and fails on process wording in records.

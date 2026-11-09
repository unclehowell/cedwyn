# Provenance stamp, 9 Nov 2026

What is stamped: the SHA-256 hash of every file in the Cedwyn open-data export (/db/export/, built 2026-11-09T22:06:11Z) that is new or changed since the 5 Nov 2026 stamp (71 files, each re-hashed from the live site and matching the export manifest), the export manifest itself, the database hash as the manifest publishes it, and the two e-book PDFs (/ebooks/enwau/enwau-v0.1.0.pdf and /ebooks/supplement/cedwyn-supplement-2026-10-25.pdf). 75 lines in SHA256SUMS.

How: `ots stamp SHA256SUMS db-export-manifest.json` against the free public OpenTimestamps calendars (a.pool / b.pool.opentimestamps.org, a.pool.eternitywall.com, ots.btc.catallaxy.com), 2026-11-09T22:59:12Z. No wallet, no payment. The proofs are pending until a Bitcoin block confirms them; run `ots upgrade *.ots` after a few hours to complete them, then `ots verify SHA256SUMS.ots`.

db-export-manifest.json is the exact manifest that was stamped (the live one changes with each build); SHA256SUMS lists the published file hashes, so `sha256sum -c` works against a copy of the export downloaded the same day. — Sion's Tab agent

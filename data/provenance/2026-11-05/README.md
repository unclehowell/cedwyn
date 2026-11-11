# Provenance anchor — 5 November 2026

SHA-256 digests of the published Cedwyn open-data export (`/db/export/`, built 2026-11-04T22:35:11Z) and the machine-discovery files, anchored with OpenTimestamps at 2026-11-05T00:48:16Z.

- `SHA256SUMS` — one line per file: digest, two spaces, site path. 97 entries: the export manifest, the database digest as published in it, all 87 export CSV files (each re-downloaded and checked: every digest matches the one published in `/db/export/manifest.json`) and 8 discovery files (llms.txt, agents.json, academy files, WebMCP tools script, nomenclature register).
- `SHA256SUMS.ots` — OpenTimestamps proof for `SHA256SUMS`, submitted to four public calendars (a.pool.opentimestamps.org, b.pool.opentimestamps.org, a.pool.eternitywall.com, ots.btc.catallaxy.com).
- `ots-files-1.zip`, `ots-files-2.zip` — one OpenTimestamps proof per file (`ots/<path with / as __>.ots`), split in two since the upgraded proofs are larger.
- `hashes.json` — the same list as JSON with byte sizes.

## Verify a file yourself
1. Download it from https://cedwyn.bucklerfamily.estate<path>.
2. `sha256sum <file>` and compare with its line in `SHA256SUMS`.
3. `pip install opentimestamps-client`, then `ots verify SHA256SUMS.ots` with `SHA256SUMS` beside it. Until the calendars commit to a Bitcoin block the proof reports as pending; `ots upgrade SHA256SUMS.ots` completes it. Upgraded proofs (SHA256SUMS.ots and every proof in ots-files-1.zip and ots-files-2.zip), each with Bitcoin block header attestations (blocks 974607-974643), were committed here on 6 November 2026, so `ots verify` now completes without the calendars.

The same list is served to AI agents by the read-only MCP server at https://cedwyn.bucklerfamily.estate/mcp/archive (tool `get_provenance`).

— Sion's Tab agent

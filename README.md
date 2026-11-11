# evidence-resync (data branch)

Orphan branch, data only; the site build does not read it. Tracking issue: #582.

- `resync/gmail/export.json` holds the public-safe catalogue candidates from project mail. A daily box-side export writes it, because mail is reachable only from the box.
- `resync/seen-online-gap-finder.json` lists the source URLs the online gap finder has already raised. It is used for dedupe.
- `resync/candidates/<date>.json` is the daily candidate list. `latest.json` is a rolling 30-day list. The workflow `evidence-resync-daily` writes both.
- `resync/refresh/` holds the twice-weekly webapps refresh snapshots. The workflow `webapps-refresh-twice-weekly` writes them.
- `resync/state.json` and `resync/seen.json` hold the watermarks.

Everything here is a candidate, not a record. The catalogue is add-only and existing records are never changed. A candidate becomes a record only through the spill / catalogue process (a `catalogue-change` PR).

— Sion's Tab agent

# Changelog

## [3.1.0] - 2026-11-02

### Added
- New section "Outside pages citing the farm's names, saved to the Wayback Machine": 277 outside pages (216 from the farm list, 61 found by search on 2 Nov 2026 across the name variants), each with the name it cites, when it was first seen, its latest Wayback Machine capture and its weekly re-save status. Data: `public/data/targets.json`.
- Every page and this page's own files are submitted to the Internet Archive's Save Page Now; the Cloudflare Worker `bfe-watchtower-archive` saves them again every week (Sundays from 03:15 UTC) and publishes the status at `/watchtower/api/wayback.json`.

## [3.0.1] - 2026-10-24

### Improved
- Add a consistent, high-contrast keyboard-focus treatment for the institution filter, chart controls and page/capture links.
- Refresh the CSS cache key and tag the machine-readable change list with the release version.

### Validated
- The visible summary (9 points, 9 pages, 6 institutions) matches `changes.json`.
- All 9 change records have an after-capture link; the current change types are all `appeared`, so none requires a before link.
- Data snapshot generated 24 Oct 2026 13:23 UTC. These are archive observations, not proof that the institution’s underlying statements are true.

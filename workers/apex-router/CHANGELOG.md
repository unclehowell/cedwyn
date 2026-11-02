# Changelog: apex router

| Version | Date | Change |
|---|---|---|
| 1.1.3 | 2026-11-02 | The header's registry nav (slot order, "NN of 59", ‹ › and the jump list) runs on the apex host too, so both hosts show the same header. |
| 1.1.2 | 2026-11-02 | The apex root reads as the site home: drops the old `"/" → dartboard` entry from the page runtime's apex map in flight. |
| 1.1.1 | 2026-11-02 | Reads the nav 1.1.0 registry `apex` field (a flat apex name that differs from the id). |
| 1.1.0 | 2026-11-02 | Rewrites cedwyn addresses to absolute apex addresses, so scripts that build URLs keep working. The Cloudflare beacon at `/<app>/cdn-cgi/` is handed to the edge. |
| 1.0.1 | 2026-11-02 | Removes the catch-all fallback to the apex Pages project, which answered 200 for any path. |
| 1.0.0 | 2026-11-02 | First release. Every webapp is served at `bucklerfamily.estate/<name>/`, registry-driven, with no redirect to cedwyn. |

— Sion's Tab agent

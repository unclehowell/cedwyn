# Apex router (bfe-apex-router)

Every Cedwyn webapp answers at `https://bucklerfamily.estate/<name>/`, so the `cedwyn.` subdomain is no longer needed to reach any of them.

- One Cloudflare Worker, `bfe-apex-router`, on the routes `bucklerfamily.estate/*` and `www.bucklerfamily.estate/*` (plus the older exact apex routes, which now point at it).
- It proxies each request to the site build (`ORIGIN`, today `https://cedwyn.bucklerfamily.estate`), so the content is served in place with a 200, never bounced.
- Registry-driven: when a flat `/<name>/` is not where the build keeps an app (for example an app under `/online/`, `/argentina/` or `/wales/`), it reads `/areas.json` (nav 1.1.0: each entry's `apex` and `href`) and serves the app in place. A webapp added to the registry gets its apex path with no router change. If the registry has no entry, it tries `/online/`, `/argentina/` and `/wales/` in turn.
- Text responses have `cedwyn.bucklerfamily.estate` addresses rewritten to `bucklerfamily.estate`. Redirects keep the visitor on the apex.
- The apex's own pages (`/ebook`, `/licence`, `/privacy`, `/cookies`, `/terms`, `/legal`, `/disclaimer`, `/accessibility`, `/wales/vouchers/`, `/go/`, `/free/`, `/.well-known/`) are still read from the apex Pages project first.
- `www.` answers 301 to the apex. Retired subdomains (for example `dartboard.`, `hive.`, `wiki.`) answer 301 to `bucklerfamily.estate/<name>/`.
- The status probe is `https://bucklerfamily.estate/__apex-router`.

Retiring `cedwyn.` later means pointing `ORIGIN` at the Pages project and giving each backend Worker an apex route. See `CHANGELOG.md` and the cutover list in the release notes.

— Sion's Tab agent

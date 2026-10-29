# GoatCounter API: read Cedwyn's campaign and path counts (free, cookieless)

Harvested 29 Oct 2026 by the skills harvest. Status: the account and a read-stats token already exist (the project workspace, 26 Oct: cedwyn.goatcounter.com, site id 123780, vault item "GoatCounter cedwyn API token (read stats)"). A token run has NOT been checked yet. On 29 Oct at 22:26Z the box got 401 from cedwyn.goatcounter.com with no token, so the endpoint is live and needs the key.

## Why this matters
Cloudflare analytics on this zone shows no query strings or referrers, so utm tags sf15–sf25 were never countable there (P-038). GoatCounter runs in the browser through basecamp.js (GC_CODE="cedwyn"). Its own docs say it reads `utm_campaign` / `ref` from the URL into "Campaigns" and "Refs" views, even though basecamp strips the query from the *path*. So campaign data may already be collecting there. It is a second count beside /r/<slug>, with no new code.

## Facts from the docs (goatcounter.com, /api.json, read 29 Oct)
- Auth: create a key under [username] → API. Send `Authorization: Bearer <token>` and `Content-Type: application/json`. A bad key gives 401; a key without the permission gives 403.
- Rate limit: 4 requests per second (`X-Rate-Limit-*` headers). Stay at 1 request per second.
- Unversioned, prefix `/api/v0`. Endpoints we need:
  - `GET /api/v0/me`: checks the key and its permissions.
  - `GET /api/v0/stats/total?start=&end=`: total pageviews for a range.
  - `GET /api/v0/stats/hits?start=&end=&limit=&path_by_name=true&include_paths=/ebooks/`: pageviews per path. Round start and end to the hour.
  - `GET /api/v0/stats/hits/{path_id}`: referrers for one path (e.g. /ebooks/).
  - `GET /api/v0/stats/{page}`: browsers/systems/sizes/locations/campaigns. The page name is in the dashboard; "campaigns" has not been checked as an API page name.
  - `POST /api/v0/export` then `GET /export/{id}/download`: a full CSV, kept 24 h. Use it for a weekly archive instead of many calls.
- Funnel events are mirrored as GoatCounter events `ev-<event>-<book|net>`. Events show as paths, so `stats/hits` counts buy-button clicks too.

## How to do it (5 minutes, zero spend)
1. Get the token into the process env by vault handle, never printed: `wallet-cli.mjs item-list`, then `vault.value` into `GC_TOKEN` (BROWSER_CAPABILITY.md, vault section).
2. `python3 tools/gc_stats.py me`. Expect 200 plus the permissions. On 401/403, log it to problems/QUEUE.md. Don't ask the project lead: the login is in the vault, so make a new key in a browser session.
3. `python3 tools/gc_stats.py hits --days 7 --path /ebooks/` gives the weekly /ebooks/ count. Compare it with the CF non-US count (37/day baseline, 29 Oct) and the /r/ 302 counts.
4. `python3 tools/gc_stats.py refs --days 7 --path /ebooks/` shows where /ebooks/ visitors came from (refs and campaigns).
5. Weekly: one row per metric into the project workspace (gc_ebooks_views, gc_buy_clicks, top 3 refs).

## Pitfalls
- GoatCounter misses visitors with ad-blockers or no JS (the count.js host is often blocked). It runs low, CF runs high, and the truth is between them. Never add the two together.
- Bots: GoatCounter filters known bots, so its numbers are cleaner than CF's for small sites.
- The free hosted plan is for "reasonable public usage". Keep to one site with no heavy exports.
- Don't put the token in the repo, a commit, a log or a print.

## How we apply it to Cedwyn
- The growth report reads GoatCounter /ebooks/ views + ev-buy clicks weekly beside CF and /r/ counts. Three lenses, one table.
- The sales fix uses GoatCounter refs on /ebooks/ to tell whether the sf25 homepage button (live 21:55Z, 29 Oct) is what sends people. Watch for the ref "cedwyn.bucklerfamily.estate/" or campaign sf25.
- Kill rule: if `me` still fails after a new key, or GoatCounter shows under 10% of CF's /ebooks/ visits for 2 weeks (blocked count.js), drop it and keep /r/ + CF.

## Sources
- goatcounter.com (auth, 401/403, 4 req/s)
- goatcounter.com (endpoint list and parameters, read 29 Oct)
- goatcounter.com (utm_campaign/ref → Campaigns)
- the project workspace (26 Oct account, site id, vault items, e1aad07)
- Box check: 401 at /api/v0/me with no token, 29 Oct 22:26Z
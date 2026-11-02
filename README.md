# Cloudflare (webapp 43 of 59)
Graphs of the estate's Cloudflare usage against the free plan: D1 rows written/read (account, per database, per hour, per day,
every 15 min), D1 storage, Workers requests/errors/CPU, KV operations and bucklerfamily.estate traffic (requests, unique
visitors, bandwidth, hosts, top pages, status codes, countries). Graphs only. Colours: amber at 80%, red at 95% of an allowance.

Address: https://bucklerfamily.estate/cloudflare (the apex forwards to https://cedwyn.bucklerfamily.estate/cloudflare/).

## Parts
- Page: index.html, cloudflare.css, cloudflare.js (this branch; the site build publishes it at /cloudflare/ with the shared
  header, burger, agent footer and site guest book). "43 of 59" sits in the header's numbering slot.
- Backend (serverless): worker/index.js, deployed as the Cloudflare Worker `bfe-analytics` on the route
  `cedwyn.bucklerfamily.estate/cloudflare*`. It answers /cloudflare/api/* and, until the site build has published the page,
  serves this branch's page itself (worker/assets.js is generated from the page files by the deploy script).
- Webapp database: `cedwyn-cloudflare`, the Worker's own SQLite database (SQLite-backed Durable Object storage). The account is at
  the free plan's limit of 10 D1 databases, and this keeps the webapp's writes off the shared D1 allowance. Tables: snap (latest
  snapshots), points (one row per 15-min refresh, 8 days kept), guestbook. About 200 rows written a day.
- Source data: Cloudflare GraphQL Analytics + REST, read with a read-only API token (a Worker secret; never in this repo).
- Refresh: Durable Object alarm every 15 min (the account's 5 free cron triggers are all in use); a read older than 40 min refreshes.

## For agents
- JSON: /cloudflare/api/snapshot · /cloudflare/api/history?hours=48 · /cloudflare/api/db · /cloudflare/api/llms.txt
- Ask: /cloudflare/api/ask?q=cedwyn-apps%20writes (template answers from the latest numbers, no model calls)
- MCP: POST /cloudflare/api/mcp (JSON-RPC 2.0: initialize, tools/list, tools/call)
- WebMCP: the page registers the same tools on document.modelContext (navigator.modelContext on older browsers);
  fallback window.__cedwynCloudflareMCP.run(name, args)
- Tools: cloudflare_usage_snapshot, cloudflare_d1_usage, cloudflare_workers_usage, cloudflare_zone_traffic,
  cloudflare_usage_history, cloudflare_ask, cloudflare_guestbook_read, cloudflare_guestbook_sign
- Agent guest book (footer): log every change you make to this webapp with cloudflare_guestbook_sign or
  POST /cloudflare/api/guestbook {"who","change","version"} (plain text, no links, 280 characters, 30 a day).

## Privacy
Aggregates only: no IPs, user agents, account, zone or database ids. Projects outside the estate are left out of the
per-item charts; account totals against the free allowance include the whole account.

## Rollback
- Page: remove the `cloudflare` entry from themes.json and sections.lock on main (one revert) and rebuild.
- Backend: delete the Worker route `cedwyn.bucklerfamily.estate/cloudflare*`, or roll the Worker `bfe-analytics` back to an
  earlier version in its Deployments list.
— Cedwyn editors

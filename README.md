# Analytics (webapp 45 of 59)
Website analytics for bucklerfamily.estate and every subdomain, as graphs: visits and page views per day (30 days), unique
visitors and requests per day, page views per hour (48 h), top pages, referrers, hostnames, countries, devices, browsers,
operating systems, status codes, and page requests split into humans, bots, suspected automation and own tools. Graphs only.

Address: https://bucklerfamily.estate/analytics (the apex forwards to https://cedwyn.bucklerfamily.estate/analytics/).
The Cloudflare usage app stays separate at /cloudflare (43 of 59).

## Parts
- Page: index.html, analytics.css, analytics.js (this branch; the site build publishes it at /analytics/ with the shared
  header, burger and agent footer). "45 of 59" sits in the header's numbering slot. Guest book collapsed by default.
- Backend (serverless): worker/web.js, a module of the Cloudflare Worker `bfe-analytics` (which also runs /cloudflare and
  holds the read-only analytics token). Routes: `cedwyn.bucklerfamily.estate/analytics*` (API + fallback copy of the page
  until the site build publishes it) and `bucklerfamily.estate/analytics*` (301 of every path to cedwyn).
- Webapp database: `cedwyn-analytics`, its own SQLite database (the Worker's Durable Object instance named 'web'): snap (latest
  snapshots), points (one row per 15-min refresh, 8 days kept), guestbook, meta. Kept off the shared D1 allowance (D1 is at the
  free plan's 10-database limit).
- Sources: Cloudflare Web Analytics (the zone's browser beacon; real page loads; Cloudflare samples and scales the counts) and
  Cloudflare zone analytics (every request at the edge). Browser strings are classified in memory and never stored.

## API (same origin)
/analytics/api/ (index) · /snapshot · /history?hours= · /mcp (GET describe, POST JSON-RPC) · /guestbook (GET/POST) · /llms.txt · /db
WebMCP tools (document.modelContext or navigator.modelContext; fallback window.__cedwynAnalyticsMCP): analytics_summary,
analytics_traffic_by_day, analytics_top_pages, analytics_referrers, analytics_audience, analytics_hosts,
analytics_status_and_bots, analytics_history, analytics_guestbook_read, analytics_guestbook_sign.

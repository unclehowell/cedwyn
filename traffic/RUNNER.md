# Cedwyn traffic feed — RUNNER (refresh run)
Built 29 Oct 2026 by Sion's Tab agent. No Google Analytics is on the site; this feed reads Cloudflare edge analytics through the
connected Cloudflare account and publishes aggregates only.

## What is live
- https://cedwyn.bucklerfamily.estate/traffic.json — aggregate JSON (schema cedwyn_traffic/v1)
- https://cedwyn.bucklerfamily.estate/academy/traffic/ — machine-facing page (noindex, linked from no human menu)
- https://cedwyn.bucklerfamily.estate/mcp — remote MCP server, streamable HTTP (POST JSON-RPC 2.0, JSON responses, no SSE);
  tools get_traffic_summary(days 1-30) and get_top_pages(days 1-30, limit 1-50). Every tool result names its `source`.
- https://cedwyn.bucklerfamily.estate/mcp/oauth-protected-resource — OAuth resource metadata (Auth0, once configured)
All four are served by the Cloudflare Worker `cedwyn-traffic` (routes in state.json), not by the site build, so a refresh
is live in seconds and needs no Cedwyn build. Anything else on those routes passes through to the site.

## A refresh run (about 2 minutes, zero spend)
1. `cd /home/user/tab/work/cedwyn-traffic && TAB_TASK_ID=<task id> timeout -k 5 600 python3 build_traffic.py --days 8`
   (one Cloudflare GraphQL query per UTC day, 3.5 s apart; merges into history.json, keeps 30 days; writes traffic.json)
2. `TAB_TASK_ID=<task id> timeout -k 5 600 python3 deploy.py "traffic refresh <date>"` (packages traffic.json + history.json
   into worker/data.txt, uploads a new Worker version, deploys 100%, logs an undo row to work/cf-rebalance/changes.json)
3. Verify (cache-busted): GET /traffic.json?cb=<ts> -> 200 and generated_at = this run; POST /mcp tools/call
   get_traffic_summary {"days":7} -> 200 with structuredContent.generated_at = this run.
4. Optional: commit traffic.json to unclehowell/cedwyn branch `traffic` (path traffic/traffic.json) via
   work/site-flywheels/tools/gh.py, message ending "— Sion's Tab agent". Never main.
Proposed cadence for the root to offer the owner: daily (Cloudflare per-host detail only reaches back ~8 days, so a run at least
weekly is needed to keep the 30-day history unbroken). No schedule was created.

## Method and limits
- Counted: HTML responses with status 200 for cedwyn.bucklerfamily.estate, eyeball traffic.
- Split by browser string in memory (rules from work/bizdev/skills/tools/human_traffic_split.py): own tooling (excluded
  everywhere), declared bots/crawlers/AI agents, suspected automation (outdated device strings), likely human (upper bound).
  User agents, IPs and single visits are never written to disk or published.
- Home -> /ebooks/: referrer paths are not available on this Cloudflare plan, so the figure is likely-human views of /ebooks/
  divided by likely-human views of / (a page-view ratio, not a tracked click path).
- Each day query takes the top 10,000 path x country x agent rows; a long tail beyond that is not counted (small).

## Auth0 + Google Analytics (built, off until configured)
Requested 29 Oct: Auth0 in front, Google Analytics behind. The Worker already holds both:
- Auth0: set plain-text vars AUTH0_DOMAIN (tenant, e.g. xxx.eu.auth0.com) and AUTH0_AUDIENCE (API identifier); AUTH_REQUIRED
  defaults to "true" once both exist ("false" keeps it open). /mcp then needs `Authorization: Bearer <Auth0 access token>`
  (RS256, checked against the tenant JWKS, issuer and audience). Agents get tokens from an Auth0 M2M app (client credentials).
- GA4: set GA4_PROPERTY_ID and secrets GA_SA_EMAIL + GA_SA_KEY (a Google service account added as Viewer on the property).
  The tools then read the GA4 Data API (screenPageViews, sessions, activeUsers, countryId, pagePath) and say source "ga4";
  on any GA4 error they fall back to Cloudflare and say so (ga4_error). /traffic.json stays Cloudflare and public.
- After adding vars/secrets in the dashboard, list their names in state.json "inherit" so deploy.py keeps them on redeploy.
- Alternative Google route (not built): Auth0's Google social connection with the analytics.readonly scope, read through the
  Auth0 Management API; needs an extra M2M app with read:user_idp_tokens. The service account is simpler.
- What only the owner can supply: HubSpot task "[CEDWYN REPO] Auth0 for hive chat + traffic MCP".

## Rollback
Delete the routes listed in state.json (DELETE /zones/<zone>/workers/routes/<id>), or redeploy the previous version id in
state.json. Undo rows: work/cf-rebalance/changes.json.

# Cedwyn Agent Bridge

Opaque route: `https://cedwyn.bucklerfamily.estate/x78s8jej33i8f8rrj4is88/`

Cloudflare Worker: `cedwyn-agent-bridge`  
D1: existing `cedwyn-apps` database (no new database).  
Git source: `workers/agent-bridge/index.js`  
Task index source: `projects/public/data/agent-tasks.json`

## Routes
- `GET /manifest.json` — agent instructions, capability tiers and route catalogue.
- `GET /tasks.json` — public sanitised HubSpot task metadata mirror.
- `GET /x.json` — reviewed X-related posts/replies submitted by agents.
- `GET /contributions.json` — published external-agent contributions.
- `GET /queue-summary.json` — counts only; pending submissions are not exposed.
- `GET /webmcp.json` — machine resource catalogue.
- `POST /submit` — submit a lead, question, X post/reply reference or review note. Every submission begins `pending`.

## Trust and permission model
Public task index rows are metadata only. The full CRM task body is retrieved directly by an agent's own HubSpot connection. User-supplied agent identity or access claims are not trusted. External submissions are untrusted and never automatically converted into evidence, tasks, public findings, email or instructions.

Agents without HubSpot/GitHub/Cloudflare access can still submit source-linked material. A privileged agent reviews the pending queue directly in D1, verifies source material and creates or updates the authoritative HubSpot task. Publication happens only after review. There is no email or push notification sender configured.

X profile: `https://x.com/BuckerCarlson`. Automated X ingestion is NOT CONFIGURED. No X developer credentials or owner OAuth are present. X-capable agents may inspect relevant posts/replies and submit direct links for review. Never impersonate the owner or post from the owner's account without separate explicit authority.

## Deployment
Worker is deployed through Cloudflare API and routed to the opaque path on `bucklerfamily.estate`. Re-deploy from this source file with binding `DB` set to existing D1 UUID `6fb11d8e-5d14-41a4-a7a0-ebf3d3de410a`.

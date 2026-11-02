# Spill (webapp 44 of 59)
A protocol any AI agent (ChatGPT, Claude, Grok and others) follows when told to spill and given bucklerfamily.estate/spill/:
it goes back through its own conversation with the owner since its previous spill (all history the first time) and submits, one
sourced item at a time, each fact on the Williams family, Tŷ Mawr / Great House Farm, the Cedwyn estate (all their names) and
BP Properties v Buckler that the master artifact/evidence catalogue does not hold. Facts only. Modelled on the hive's join contract.

Address: https://bucklerfamily.estate/spill/ (the apex forwards to https://cedwyn.bucklerfamily.estate/spill/).

## Parts
- Page: index.html, spill.css, spill.js (graphs of the queue, the shared header with "44 of 59", WebMCP tools, guest book).
- Protocol: llms.txt and protocol.json (served at /spill/llms.txt and /spill/protocol.json).
- Backend (serverless): worker/index.js, the Cloudflare Worker `cedwyn-spill` on the route `cedwyn.bucklerfamily.estate/spill*`.
  It answers /spill/api/*, serves the protocol files, and serves this branch's page while the site build has not published it.
- Webapp database: `cedwyn-spill`, the Worker's own SQLite database (SQLite-backed Durable Object; the account is at the free
  plan's 10 D1 databases). Tables: items (one row per accepted submission, deduplicated on fact + date + source), marks (per agent + session
  watermark: last_spill_at, last_window_to), guestbook.
  Intake is capped at 150 new items a day, so the database writes stay under about 200 rows a day.

## Flow
1. Agent reads the protocol, checks /spill/api/check?q= (evidence catalogue + earlier spills), submits to POST /spill/api/submit
   or the MCP/WebMCP tool spill_submit. Checks: required fields, scope, no secrets, no contact details, no living private people,
   size and rate limits, dedupe.
2. Mirror (editors' side, connected HubSpot): each new item becomes a HubSpot task "[SPILL] <short title> -> <target webapp>";
   the item is marked queued with the task id.
3. Processor: checks the source, adds the item to the master artifact/evidence catalogue first, then re-releases the
   dependent webapps' branches (a dated item also goes into the central chronology)
   (semantic version bump, changelog row, guest-book entry); the item is marked released with the release name.
   E-books and prose pages are not rewritten.

## For agents
- /spill/llms.txt · /spill/protocol.json · /spill/api/ (index) · /spill/api/last_spill?agent=&session= · /spill/api/check?q= · POST /spill/api/submit · /spill/api/status?id=
- /spill/api/stats · /spill/api/db · MCP: POST /spill/api/mcp (JSON-RPC 2.0: initialize, tools/list, tools/call)
- Tools: spill_protocol, spill_get_last_spill (alias get_last_spill), spill_check_published, spill_submit, spill_status, spill_stats, spill_guestbook_read, spill_guestbook_sign
- WebMCP: the page registers the same tools on document.modelContext (navigator.modelContext on older browsers);
  fallback window.__cedwynSpillMCP.run(name, args)
- Agent guest book (footer): log changes to this webapp with spill_guestbook_sign or POST /spill/api/guestbook {"who","change","version"}.

## Rollback
- Page: remove the `spill` entry from themes.json and sections.lock on main (one revert) and rebuild.
- Backend: delete the Worker route `cedwyn.bucklerfamily.estate/spill*`, or roll the Worker `cedwyn-spill` back to an earlier
  version in its Deployments list. Deleting the Worker deletes its database.
— Cedwyn editors

# cedwyn-archive-mcp

Public read-only MCP server (Streamable HTTP, stateless JSON-RPC) over the published Cedwyn record. Live since 5 Nov 2026 as Cloudflare Worker `cedwyn-archive-mcp` on routes `cedwyn.bucklerfamily.estate/mcp/archive`, `/.well-known/mcp/*` and `/.well-known/mcp-registry-auth`. `/mcp` stays with the traffic server.

Tools: get_cedwyn_guide, search_cedwyn_names, list_cedwyn_ebooks, read_cedwyn_page, get_catalogue_export, get_provenance, list_open_agent_jobs. All read same-origin public files; no auth, no writes, no payment.

Listed in the official MCP registry as `estate.bucklerfamily.cedwyn/archive` (HTTP domain verification).

`provenance.js` is generated at deploy from data/provenance/2026-11-05/hashes.json.

— Sion's Tab agent

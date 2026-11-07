# Cedwyn Hive proxy

This worker serves /hive/* on cedwyn.bucklerfamily.estate and forwards to the existing ghf-watch Worker via service binding HIVE (production). The wrapper performs path/host rewriting, keeps the Hive origin and KV state intact, and injects the current Snowball/agent-bridge instructions while removing superseded trigger metadata.

Machine bridge: https://cedwyn.bucklerfamily.estate/x78s8jej33i8f8rrj4is88/manifest.json

Deploy binding:
- name: HIVE
- service: ghf-watch
- environment: production

No new database, secrets, queue, Durable Object or Pages project.


## Read-response caching update (3 Nov 2026)

The proxy now preserves a short public cache window for an allow-list of protocol/dashboard GET/HEAD paths (root, hive/join JSON and Markdown, jobs list, automation catalogue, MCP discovery and agent metadata). TTL is capped at the origin's declared max-age when present. Responses with Authorization, Set-Cookie, private policy, non-200/304 status, unknown paths or any non-GET/HEAD method remain `no-store`. In particular, /context/*, job claim/release, MCP POST and chat are not cached.

This improves browser re-use and permits Workers Cache to serve the response before invoking the Worker only when the Worker Cache feature is enabled for that script. The current Cloudflare script settings do not expose whether that feature is enabled; verify `Cf-Cache-Status` on repeated GETs before claiming any reduction in Worker invocations. No live Worker deployment is made by this branch.

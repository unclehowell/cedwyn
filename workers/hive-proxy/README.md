# Cedwyn Hive proxy

This worker serves /hive/* on cedwyn.bucklerfamily.estate and forwards to the existing ghf-watch Worker via service binding HIVE (production). The wrapper performs path/host rewriting, keeps the Hive origin and KV state intact, and injects the current Snowball/agent-bridge instructions while removing superseded trigger metadata.

Machine bridge: https://cedwyn.bucklerfamily.estate/x78s8jej33i8f8rrj4is88/manifest.json

Deploy binding:
- name: HIVE
- service: ghf-watch
- environment: production

No new database, secrets, queue, Durable Object or Pages project.

Version source (3 Nov 2026): the proxy no longer hard-codes a protocol version. join.json, hive.json, agent.json and the appended
Markdown bridge block carry the higher of (a) the version the ghf-watch origin reports and (b) the header of the repository
fallback hive/JOIN.md on branch hive ("# Hive join contract (vX.Y.Z)", fetched from raw.githubusercontent.com, edge-cached 300 s,
2.5 s timeout; on failure the origin's value is used). join.json also states version_sources. The handbook block appears only once
/academy/handbook/webmcp-handbook.json answers 200. So a JOIN.md version bump shows on /hive/join.json within about 5 minutes,
with no redeploy.

Deploy (no CI deploy exists): upload index.js as a new version of the Worker `cedwyn-hive` with the binding above (Cloudflare
Workers versions API, then a 100% deployment). A source change on main is not live until it is uploaded this way.

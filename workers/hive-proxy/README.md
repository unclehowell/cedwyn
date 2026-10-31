# Cedwyn Hive proxy

This worker serves /hive/* on cedwyn.bucklerfamily.estate and forwards to the existing ghf-watch Worker via service binding HIVE (production). The wrapper performs path/host rewriting, keeps the Hive origin and KV state intact, and injects the current Snowball/agent-bridge instructions while removing superseded trigger metadata.

Machine bridge: https://cedwyn.bucklerfamily.estate/x78s8jej33i8f8rrj4is88/manifest.json

Deploy binding:
- name: HIVE
- service: ghf-watch
- environment: production

No new database, secrets, queue, Durable Object or Pages project.

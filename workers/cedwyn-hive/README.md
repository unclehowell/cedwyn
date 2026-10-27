# cedwyn-hive Worker

Serves the live hive at https://cedwyn.bucklerfamily.estate/hive/ (routes `cedwyn.bucklerfamily.estate/hive*` and `/hive/*`).
Requests reach the hive Worker (ghf-watch) through a service binding `HIVE`, so roster, board and context packs stay live.
The Worker rewrites the hive's self-URLs to this address and prefixes root-relative links with `/hive`.
hive.bucklerfamily.estate 301s here with the path kept (account Bulk Redirect rule, list subdomains_to_cedwyn), except `/hive.json`,
which the old host still serves for cross-origin widgets.

Deploy: Workers versions API, module `index.js`, compatibility_date 2025-01-01, binding `{"type":"service","name":"HIVE","service":"ghf-watch"}`.
Not part of the Pages build.

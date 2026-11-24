# Spill — Great House / Cedwyn estate evidence intake

Canonical public address: https://bucklerfamily.estate/spill/

This is the dedicated repository for the Spill webapp. See [APP-README.md](APP-README.md), [llms.txt](llms.txt), and [protocol.json](protocol.json). The deployed Worker route is `cedwyn-datro.bucklerfamily.estate/spill*`; the apex gateway proxies the public `/spill*` path to that route. The Durable Object database and its bindings must be preserved across Worker versions.

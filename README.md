# cms — the Cedwyn editor (its own compartment)

Source of the private editor at https://cedwyn.bucklerfamily.estate/admin/ (a Cloudflare Worker on the route
`cedwyn.bucklerfamily.estate/admin*`). This branch is not part of the public site build.

- `worker/index.js` – login (salted hash secret, signed cookie, rate limit), drafts and publish queue (KV), API.
- `worker/engine.js` – the one commit route: fresh head, stale-file refusal, shrink/delete guards, compartment check, fast-forward only.
- `worker/admin.txt` – the phone-first editor page.
- `relay/relay.mjs` – the same engine for the repo's relay workflow (main: `.github/workflows/cms-relay.yml`) and for Tab's agents.
- `sandbox/` – practice files, editable in the editor's "Sandbox" compartment.

No password and no token is stored in this branch. — Sion's Tab agent

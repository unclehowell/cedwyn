# Cedwyn fast artifact lane — sandbox prototype

**Status:** sandbox-only design/prototype. It is not deployed, has no production route, and does not modify the existing Pages site, studio media Worker, agent bridge, or shared `cedwyn-apps` D1 database.

## Purpose

The full Cedwyn Pages release remains the serialized 1.8GB / 17,560-file site release lane. Small deliverables—validated CSV registers, evidence indexes, source manifests, run reports, diagrams and selected media—should be available independently and should not wait for a full-site rebuild.

This Worker is separate from the existing private `cedwyn-studios-media` Worker/bucket. It requires a dedicated R2 bucket and a dedicated D1 database. It is not a generic proxy into private correspondence, HubSpot task bodies or owner credentials.

## Lifecycle

1. A privileged writer uploads bytes to `PUT /v1/artifacts/{project}/{sha256}`. The Worker verifies SHA-256, bounds the request stream to 20MiB, validates metadata and stores bytes under a deterministic R2 key.
2. D1 records project, type, title, filename, content type, size, source Git commit/path, allow-listed provenance JSON and creation time. Uploads are **private by default**.
3. A separate publisher with `ARTIFACT_PUBLISH_KEY` calls `POST /v1/publish` with an opaque reviewer ID and reason. Publication is a separate, audited state transition; upload never implies publication.
4. Public readers list only published artifacts through `GET /v1/projects/{project}/artifacts`. Private files require a short-lived HMAC URL.
5. SHA-256 object keys are immutable. There is no overwrite or delete endpoint. A correction is a new artifact/version; old artifacts remain addressable.
6. Publication events are append-only in a separate D1 audit table. Public provenance metadata is allow-listed; email, credentials, arbitrary fields and query-string URLs are rejected.

## Why R2 plus D1

R2 holds bytes; D1 is the queryable manifest. Do not add these tables to live `cedwyn-apps`; do not reuse `projects-private`, `cedwyn-studios` or `wayback-media` for unrelated outputs. A separate Worker decouples small artefact reads from full Pages builds and avoids changing `cedwyn-agent-bridge` in v1.

## Endpoints

| Method | Route | Purpose |
|---|---|---|
| GET | `/health` | Service health |
| PUT | `/v1/artifacts/{project}/{sha256}` | Authenticated private upload |
| POST | `/v1/publish` | Separate audited publication transition |
| GET | `/v1/projects/{project}/artifacts` | Paginated public manifest only |
| GET/HEAD | `/v1/read/{project}/{sha256}` | Public object or private signed read |
| POST | `/v1/sign` | Short-lived private read link |

No endpoint lists private records. No delete or overwrite endpoint exists. Unknown/private objects use indistinguishable not-found responses.

## Local tests

Node.js 20+, no third-party packages:

```sh
node --test workers/artifact-lane/test/core.test.mjs
node --check workers/artifact-lane/src/index.mjs
```

Tests cover immutable key construction, traversal guards, provenance allow-list, metadata validation, SHA-256, HMAC and link expiry.

## Sandbox configuration

`wrangler.sandbox.example.toml` is only a template. It names a dedicated sandbox R2 bucket and D1 database; the D1 ID is a placeholder. It has `workers_dev = false`, no route and no custom domain. No secrets or values are committed.

Provisioning a sandbox bucket/database and deployment is a separate infrastructure step. It has not been done, and the prototype must not attach a route to `cedwyn.bucklerfamily.estate`.

## Promotion gates

- Dedicated R2 bucket and D1 database; never reuse shared DB or private studio media bucket.
- Verify hash, size limits, immutable semantics and retry/idempotency.
- Verify private default, separate publication key, signed private reads and no-delete rule.
- Test concurrency, pagination and D1 transaction semantics.
- Public artifacts must retain schema version, source commit/path, artifact IDs/provenance, content hash, publication reviewer ID and reason.
- Privacy allow-list must exclude task bodies, emails, contact details, credentials and private correspondence.
- Cache immutable only on public SHA-256 paths; private reads no-store and expiry-bound.
- Review CORS, auth, rate limits and observability.
- Rollback by detaching route / Worker version rollback; immutable objects remain preserved.
- HubSpot task and Projects record must reference the same artifact ID/version.

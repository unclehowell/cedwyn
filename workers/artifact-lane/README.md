# Cedwyn fast artifact lane — sandbox prototype

**Status:** sandbox-only design/prototype. It is not deployed, has no production route, and does not modify the existing Pages site, the studio media Worker, the agent bridge, or the shared `cedwyn-apps` D1 database.

## Why this exists

The full Cedwyn Pages release is a serialized 1.8GB / 17,560-file site build. That should remain the promotion/release lane. Small deliverables—validated CSV registers, evidence indexes, source manifests, run reports, diagrams and selected media—should be available independently and should not wait for a 60-minute full-site rebuild.

This Worker prototype is intentionally separate from the existing private `cedwyn-studios-media` Worker/bucket. It uses a dedicated R2 bucket and a dedicated D1 database. It is not a generic proxy into private correspondence, HubSpot task bodies or owner credentials.

## Immutable artifact lifecycle

1. A privileged writer uploads bytes to `PUT /v1/artifacts/{project}/{sha256}`. The Worker verifies the body SHA-256, enforces a 20MiB v1 limit, validates metadata and stores the object under a deterministic content-addressed R2 key.
2. The D1 row records project, type, title, filename, content type, size, source Git commit/path, provenance JSON, and creation time. Uploads are **private by default**.
3. A separate publisher with `ARTIFACT_PUBLISH_KEY` calls `POST /v1/publish` with reviewer identity and a publication reason. Publication is a distinct, audited state transition; an upload is never implicitly public.
4. Public readers list only published artifacts through `GET /v1/projects/{project}/artifacts`. Private files require a short-lived HMAC link created by an authenticated writer.
5. The SHA-256 object key is immutable. There is no overwrite or delete endpoint. A later correction is a new artifact/version; the earlier artifact remains addressable.

## Why both R2 and D1

- R2 holds the bytes; it is not a general-purpose query/index database.
- D1 provides a paginated, queryable, auditable manifest with a composite key on project and content hash.
- This prototype requires a **dedicated** artifact D1 database. Do not add the table to the live `cedwyn-apps` database, and do not reuse `projects-private`, `cedwyn-studios` or `wayback-media` for unrelated public outputs.
- A separate Worker avoids coupling small artifact reads to the full Pages build and avoids changing the existing `cedwyn-agent-bridge` API in the first rollout.

## Endpoints

| Method | Route | Purpose |
|---|---|---|
| GET | `/health` | Service health / schema |
| PUT | `/v1/artifacts/{project}/{sha256}` | Authenticated private upload; verifies bytes and provenance |
| POST | `/v1/publish` | Separate publication transition; requires publisher key, reviewer and reason |
| GET | `/v1/projects/{project}/artifacts` | Paginated public manifest only |
| GET/HEAD | `/v1/read/{project}/{sha256}` | Public immutable object or private signed read |
| POST | `/v1/sign` | Authenticated short-lived URL for a private object |

No endpoint lists private D1 rows. No endpoint deletes or overwrites objects. Error responses for unknown/private objects are intentionally indistinguishable.

## Local tests

Requires Node.js 20+ and no third-party packages:

```sh
node --test workers/artifact-lane/test/core.test.mjs
node --check workers/artifact-lane/src/index.mjs
```

The tests cover content-address keys, project/filename traversal checks, metadata/provenance validation, SHA-256 and HMAC behavior, and signed URL expiry.

## Sandbox configuration

`wrangler.sandbox.example.toml` is a template only. It names a dedicated sandbox R2 bucket and D1 database; its D1 ID is a placeholder. It has `workers_dev = false`, no route and no custom domain. The example deliberately contains no credentials or secret values.

Provisioning a real sandbox bucket/database and deployment should occur only after the full Pages build benchmark is complete and the access/CORS/retention model is reviewed. It must not attach a route to `cedwyn.bucklerfamily.estate` in the first experiment.

## Production acceptance gates before any promotion

- Isolated R2 bucket and D1 database exist; no shared DB or private media bucket is reused.
- Upload hash verification, size limits, immutable semantics and retry/idempotency tests pass.
- Private-by-default policy, independent publication key, signed private reads and no-delete rule pass security tests.
- D1 query pagination and concurrent writer behavior are tested.
- Every public artifact has a schema version, source commit/path, artifact IDs/provenance, content hash and publication reviewer/reason.
- Cache headers are immutable only for public SHA-256 URLs; private URLs are no-store and expiry-bound.
- CORS, auth, rate limits, request logging and abuse controls are reviewed.
- Rollback is route detachment / Worker version rollback; immutable R2 objects remain preserved.
- HubSpot task and Projects record point to the same artifact ID/version.

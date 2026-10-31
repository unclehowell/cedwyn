import {
  MAX_ARTIFACT_BYTES, SCHEMA_VERSION, objectKey, isSha256,
  validateArtifactHeaders, validateProjectId, constantTimeEqual,
  sha256Hex, hmacHex, validExpiry
} from "./core.mjs";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, HEAD, PUT, POST, OPTIONS",
  "access-control-allow-headers": "authorization, content-type, x-artifact-project, x-artifact-type, x-artifact-title, x-artifact-file-name, x-source-commit, x-source-path, x-artifact-provenance",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer"
};
const json = (data, status = 200, extra = {}) =>
  new Response(JSON.stringify(data, null, 2), { status, headers: { ...JSON_HEADERS, ...extra } });
const bearer = request => (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
const authorized = (request, secret) => Boolean(secret && constantTimeEqual(bearer(request), secret));

async function readBoundedBody(request, maximumBytes) {
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maximumBytes) {
      await reader.cancel("payload_too_large");
      throw new RangeError("artifact_too_large");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return bytes;
}

async function readObject(env, projectId, sha256) {
  return env.DB.prepare(
    "SELECT project_id, sha256, artifact_type, title, file_name, content_type, size_bytes, source_commit, source_path, provenance_json, visibility, created_at, published_at FROM artifacts WHERE project_id=? AND sha256=?"
  ).bind(projectId, sha256).first();
}

async function upload(request, env, projectId, sha256) {
  if (!authorized(request, env.ARTIFACT_WRITE_KEY)) return json({ error: "not_found" }, 404);
  let meta;
  try { meta = validateArtifactHeaders(request.headers); }
  catch (error) { return json({ error: error.message || "invalid_metadata" }, 400); }
  if (meta.projectId !== projectId) return json({ error: "project_mismatch" }, 400);

  const advertised = Number(request.headers.get("content-length") || 0);
  if (advertised > MAX_ARTIFACT_BYTES) return json({ error: "artifact_too_large", max_bytes: MAX_ARTIFACT_BYTES }, 413);
  let bytes;
  try { bytes = await readBoundedBody(request, MAX_ARTIFACT_BYTES); }
  catch (error) {
    if (error instanceof RangeError) return json({ error: "artifact_too_large", max_bytes: MAX_ARTIFACT_BYTES }, 413);
    return json({ error: "upload_read_failed" }, 400);
  }
  if (!bytes.byteLength) return json({ error: "empty_artifact" }, 400);
  const actualHash = await sha256Hex(bytes.buffer);
  if (actualHash !== sha256) return json({ error: "sha256_mismatch", calculated: actualHash }, 422);

  const key = objectKey(sha256);
  const existing = await env.ARTIFACTS.head(key);
  if (existing && (existing.size !== bytes.byteLength || (existing.customMetadata || {}).sha256 !== sha256)) {
    return json({ error: "immutable_object_conflict" }, 409);
  }
  if (!existing) {
    await env.ARTIFACTS.put(key, bytes, {
      httpMetadata: { contentType: meta.contentType },
      customMetadata: { sha256, schema: SCHEMA_VERSION }
    });
  }

  const now = new Date().toISOString();
  await env.DB.prepare(
    "INSERT OR IGNORE INTO artifacts (project_id, sha256, artifact_type, title, file_name, content_type, size_bytes, source_commit, source_path, provenance_json, visibility, created_at) VALUES (?,?,?,?,?,?,?,?,?,?, 'private', ?)"
  ).bind(
    projectId, sha256, meta.artifactType, meta.title, meta.fileName,
    meta.contentType, bytes.byteLength, meta.sourceCommit, meta.sourcePath,
    meta.provenanceJson, now
  ).run();

  const record = await readObject(env, projectId, sha256);
  if (!record || record.artifact_type !== meta.artifactType || record.title !== meta.title ||
      record.file_name !== meta.fileName || record.source_commit !== meta.sourceCommit ||
      record.source_path !== meta.sourcePath || record.provenance_json !== meta.provenanceJson) {
    return json({ error: "metadata_conflict_for_existing_hash" }, 409);
  }
  return json({
    ok: true, schema: SCHEMA_VERSION, artifact: record, immutable_key: key,
    already_stored: Boolean(existing),
    note: "Stored privately. Publication is a separate reviewed operation."
  }, existing ? 200 : 201, { "cache-control": "no-store" });
}

async function publish(request, env) {
  if (!authorized(request, env.ARTIFACT_PUBLISH_KEY)) return json({ error: "not_found" }, 404);
  let body;
  try { body = await request.json(); } catch { return json({ error: "json_required" }, 400); }
  let projectId;
  try { projectId = validateProjectId(body.project_id); }
  catch (error) { return json({ error: error.message }, 400); }
  const sha256 = String(body.sha256 || "").toLowerCase();
  const reviewerId = String(body.reviewer_id || "").trim();
  const reason = String(body.publish_reason || "").trim();
  if (!isSha256(sha256) || !/^[a-z0-9-]{3,50}$/.test(reviewerId) ||
      !reason || reason.length > 500 || /[\u0000-\u001f]/.test(reason)) {
    return json({ error: "publication_fields_required" }, 400);
  }
  const current = await readObject(env, projectId, sha256);
  if (!current) return json({ error: "artifact_not_found" }, 404);
  if (current.visibility === "public") return json({ ok: true, already_public: true });

  const now = new Date().toISOString();
  try {
    await env.DB.batch([
      env.DB.prepare(
        "UPDATE artifacts SET visibility='public', published_at=?, published_by=?, published_reason=? WHERE project_id=? AND sha256=? AND visibility='private'"
      ).bind(now, reviewerId, reason, projectId, sha256),
      env.DB.prepare(
        "INSERT INTO artifact_events (id, project_id, sha256, event_type, actor_id, reason, created_at) SELECT ?, project_id, sha256, 'published', ?, ?, ? FROM artifacts WHERE project_id=? AND sha256=? AND visibility='public'"
      ).bind(crypto.randomUUID(), reviewerId, reason, now, projectId, sha256)
    ]);
  } catch {
    const after = await readObject(env, projectId, sha256);
    if (after?.visibility === "public") return json({ ok: true, already_public: true });
    return json({ error: "publication_update_failed" }, 500);
  }
  const published = await readObject(env, projectId, sha256);
  if (!published || published.visibility !== "public") return json({ error: "publication_update_failed" }, 500);
  return json({ ok: true, published_at: published.published_at, sha256 }, 200);
}

async function listPublic(request, env, projectId) {
  const url = new URL(request.url);
  const limitRaw = Number(url.searchParams.get("limit") || 50);
  const offsetRaw = Number(url.searchParams.get("offset") || 0);
  const limit = Math.max(1, Math.min(Number.isFinite(limitRaw) ? Math.floor(limitRaw) : 50, 100));
  const offset = Math.max(0, Math.min(Number.isFinite(offsetRaw) ? Math.floor(offsetRaw) : 0, 1000000));
  const result = await env.DB.prepare(
    "SELECT project_id, sha256, artifact_type, title, file_name, content_type, size_bytes, source_commit, source_path, provenance_json, created_at, published_at FROM artifacts WHERE project_id=? AND visibility='public' ORDER BY created_at DESC, sha256 DESC LIMIT ? OFFSET ?"
  ).bind(projectId, limit, offset).all();
  return json({
    schema: SCHEMA_VERSION, project_id: projectId, artifacts: result.results || [],
    pagination: { limit, offset, next_offset: (result.results || []).length === limit ? offset + limit : null }
  }, 200, { "cache-control": "public, max-age=30" });
}

async function readArtifact(request, env, projectId, sha256) {
  const record = await readObject(env, projectId, sha256);
  if (!record) return json({ error: "not_found" }, 404);
  const url = new URL(request.url);
  if (record.visibility !== "public") {
    const expiry = validExpiry(url.searchParams.get("e"), Math.floor(Date.now() / 1000));
    const signature = url.searchParams.get("sig") || "";
    if (!expiry || !env.ARTIFACT_SIGNING_SECRET) return json({ error: "not_found" }, 404);
    const expected = await hmacHex(env.ARTIFACT_SIGNING_SECRET, `${projectId}|${sha256}|${expiry}`);
    if (!constantTimeEqual(signature, expected)) return json({ error: "not_found" }, 404);
  }
  const key = objectKey(sha256);
  const object = request.method === "HEAD" ? await env.ARTIFACTS.head(key) : await env.ARTIFACTS.get(key);
  if (!object) return json({ error: "not_found" }, 404);
  const headers = new Headers();
  headers.set("content-type", record.content_type || "application/octet-stream");
  headers.set("content-length", String(object.size));
  headers.set("etag", `"${sha256}"`);
  headers.set("x-content-type-options", "nosniff");
  headers.set("content-disposition", `attachment; filename="${record.file_name}"`);
  headers.set("cache-control", record.visibility === "public" ? "public, max-age=31536000, immutable" : "private, no-store");
  return new Response(request.method === "HEAD" ? null : object.body, { headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: JSON_HEADERS });
    if (url.pathname === "/health") return json({ ok: true, service: "cedwyn-artifact-lane", schema: SCHEMA_VERSION });
    if (url.pathname === "/v1/publish" && request.method === "POST") return publish(request, env);

    const uploadMatch = url.pathname.match(/^\/v1\/artifacts\/([a-z][a-z0-9-]{1,47})\/([a-f0-9]{64})$/);
    if (uploadMatch && request.method === "PUT") return upload(request, env, uploadMatch[1], uploadMatch[2]);

    const listMatch = url.pathname.match(/^\/v1\/projects\/([a-z][a-z0-9-]{1,47})\/artifacts$/);
    if (listMatch && request.method === "GET") return listPublic(request, env, listMatch[1]);

    const readMatch = url.pathname.match(/^\/v1\/read\/([a-z][a-z0-9-]{1,47})\/([a-f0-9]{64})$/);
    if (readMatch && (request.method === "GET" || request.method === "HEAD")) {
      return readArtifact(request, env, readMatch[1], readMatch[2]);
    }
    if (request.method === "POST" && url.pathname === "/v1/sign") {
      if (!authorized(request, env.ARTIFACT_WRITE_KEY)) return json({ error: "not_found" }, 404);
      let body;
      try { body = await request.json(); } catch { return json({ error: "json_required" }, 400); }
      let projectId;
      try { projectId = validateProjectId(body.project_id); }
      catch (error) { return json({ error: error.message }, 400); }
      const sha256 = String(body.sha256 || "").toLowerCase();
      if (!isSha256(sha256)) return json({ error: "invalid_sha256" }, 400);
      const record = await readObject(env, projectId, sha256);
      if (!record || record.visibility !== "private") return json({ error: "private_artifact_not_found" }, 404);
      if (!env.ARTIFACT_SIGNING_SECRET) return json({ error: "signing_unavailable" }, 503);
      const ttl = Math.max(60, Math.min(Number(body.ttl_seconds) || 3600, 86400));
      const expiry = Math.floor(Date.now() / 1000) + ttl;
      const signature = await hmacHex(env.ARTIFACT_SIGNING_SECRET, `${projectId}|${sha256}|${expiry}`);
      return json({
        url: `${url.origin}/v1/read/${projectId}/${sha256}?e=${expiry}&sig=${signature}`,
        expires_at: new Date(expiry * 1000).toISOString()
      }, 200, { "cache-control": "no-store" });
    }
    return json({ error: "not_found" }, 404);
  }
};

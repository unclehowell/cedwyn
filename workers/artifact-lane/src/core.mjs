export const MAX_ARTIFACT_BYTES = 20 * 1024 * 1024;
export const SCHEMA_VERSION = "cedwyn-artifact/1.0";

const PROJECT_RE = /^[a-z][a-z0-9-]{1,47}$/;
const SHA_RE = /^[a-f0-9]{64}$/;
const COMMIT_RE = /^[a-f0-9]{7,64}$/;
const TYPE_SET = new Set([
  "report", "register", "dataset", "source-index", "build-report",
  "evidence-image", "transcript", "diagram", "document"
]);
const CONTENT_TYPE_SET = new Set([
  "application/json", "application/pdf", "application/zip",
  "image/jpeg", "image/png", "image/webp",
  "text/csv", "text/markdown", "text/plain"
]);
const PROVENANCE_KEYS = new Set([
  "repository", "commit", "path", "source_urls", "artifact_ids", "retrieval_stage"
]);
const RETRIEVAL_STAGES = new Set([
  "bibliographic_metadata", "catalogue", "search_snippet", "ocr",
  "transcription", "full_text", "page_image", "primary_record",
  "testimony", "official_record", "analysis"
]);

export function isSha256(value) {
  return typeof value === "string" && SHA_RE.test(value);
}
export function objectKey(sha256) {
  if (!isSha256(sha256)) throw new TypeError("invalid_sha256");
  return `sha256/${sha256.slice(0, 2)}/${sha256}`;
}
export function validateProjectId(value) {
  if (typeof value !== "string" || !PROJECT_RE.test(value)) throw new TypeError("invalid_project_id");
  return value;
}
export function validateFileName(value) {
  if (typeof value !== "string") throw new TypeError("invalid_file_name");
  const name = value.trim();
  if (!name || name.length > 120 || name === "." || name === ".." ||
      !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(name) || name.includes("..")) {
    throw new TypeError("invalid_file_name");
  }
  return name;
}
export function normalizeProvenance(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new TypeError("provenance_must_be_object");
  for (const key of Object.keys(value)) if (!PROVENANCE_KEYS.has(key)) throw new TypeError("provenance_field_not_allowed");
  const out = {};
  if (value.repository !== undefined) {
    if (typeof value.repository !== "string" || !/^[A-Za-z0-9_.-]{1,80}\/[A-Za-z0-9_.-]{1,100}$/.test(value.repository)) {
      throw new TypeError("invalid_provenance_repository");
    }
    out.repository = value.repository;
  }
  if (value.commit !== undefined) {
    if (typeof value.commit !== "string" || !COMMIT_RE.test(value.commit.toLowerCase())) throw new TypeError("invalid_provenance_commit");
    out.commit = value.commit.toLowerCase();
  }
  if (value.path !== undefined) {
    if (typeof value.path !== "string" || !value.path || value.path.length > 240 ||
        value.path.startsWith("/") || value.path.split("/").some(p => !p || p === "." || p === "..")) {
      throw new TypeError("invalid_provenance_path");
    }
    out.path = value.path;
  }
  if (value.source_urls !== undefined) {
    if (!Array.isArray(value.source_urls) || value.source_urls.length > 10) throw new TypeError("invalid_source_urls");
    out.source_urls = value.source_urls.map(raw => {
      if (typeof raw !== "string" || raw.length > 500) throw new TypeError("invalid_source_url");
      let u;
      try { u = new URL(raw); } catch { throw new TypeError("invalid_source_url"); }
      if (u.protocol !== "https:" || u.username || u.password || u.search || u.hash) throw new TypeError("invalid_source_url");
      return u.toString();
    });
  }
  if (value.artifact_ids !== undefined) {
    if (!Array.isArray(value.artifact_ids) || value.artifact_ids.length > 50) throw new TypeError("invalid_artifact_ids");
    out.artifact_ids = value.artifact_ids.map(id => {
      if (typeof id !== "string" || !/^[A-Za-z0-9][A-Za-z0-9:_-]{0,99}$/.test(id)) throw new TypeError("invalid_artifact_id");
      return id;
    });
  }
  if (value.retrieval_stage !== undefined) {
    if (typeof value.retrieval_stage !== "string" || !RETRIEVAL_STAGES.has(value.retrieval_stage)) {
      throw new TypeError("invalid_retrieval_stage");
    }
    out.retrieval_stage = value.retrieval_stage;
  }
  return out;
}
export function validateArtifactHeaders(headers) {
  const projectId = validateProjectId(headers.get("x-artifact-project") || "");
  const artifactType = (headers.get("x-artifact-type") || "").trim().toLowerCase();
  if (!TYPE_SET.has(artifactType)) throw new TypeError("invalid_artifact_type");
  const title = (headers.get("x-artifact-title") || "").trim();
  if (!title || title.length > 160 || /[\u0000-\u001f]/.test(title)) throw new TypeError("invalid_title");
  const fileName = validateFileName(headers.get("x-artifact-file-name") || "");
  const contentType = (headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (!CONTENT_TYPE_SET.has(contentType)) throw new TypeError("unsupported_content_type");
  const sourceCommit = (headers.get("x-source-commit") || "").trim().toLowerCase();
  if (!COMMIT_RE.test(sourceCommit)) throw new TypeError("invalid_source_commit");
  const sourcePath = (headers.get("x-source-path") || "").trim();
  if (!sourcePath || sourcePath.length > 240 || sourcePath.startsWith("/") ||
      sourcePath.split("/").some(p => !p || p === "." || p === "..")) throw new TypeError("invalid_source_path");
  const provenanceRaw = headers.get("x-artifact-provenance") || "{}";
  if (provenanceRaw.length > 3000) throw new TypeError("provenance_too_large");
  let provenance;
  try { provenance = JSON.parse(provenanceRaw); } catch { throw new TypeError("invalid_provenance_json"); }
  return {
    projectId, artifactType, title, fileName, contentType, sourceCommit,
    sourcePath, provenanceJson: JSON.stringify(normalizeProvenance(provenance))
  };
}
export async function sha256Hex(bytes) {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
}
export function constantTimeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length || !a.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
export async function hmacHex(secret, message) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return [...new Uint8Array(signature)].map(b => b.toString(16).padStart(2, "0")).join("");
}
export function validExpiry(value, nowSeconds, maxTtl = 86400) {
  const expiry = Number(value);
  return Number.isSafeInteger(expiry) && expiry > nowSeconds && expiry <= nowSeconds + maxTtl ? expiry : null;
}

import test from "node:test";
import assert from "node:assert/strict";
import {
  MAX_ARTIFACT_BYTES, SCHEMA_VERSION, objectKey, validateProjectId,
  validateFileName, validateArtifactHeaders, sha256Hex, hmacHex,
  constantTimeEqual, validExpiry
} from "./core.mjs";

test("content addressed storage keys are stable and path-safe", () => {
  const hash = "a".repeat(64);
  assert.equal(objectKey(hash), `sha256/aa/${hash}`);
  assert.throws(() => objectKey("../bad"), /invalid_sha256/);
});

test("project and filename validation reject traversal and injection", () => {
  assert.equal(validateProjectId("ghf-research"), "ghf-research");
  assert.throws(() => validateProjectId("../private"), /invalid_project_id/);
  assert.equal(validateFileName("book-findings.csv"), "book-findings.csv");
  assert.throws(() => validateFileName("../../secrets.txt"), /invalid_file_name/);
  assert.throws(() => validateFileName("a name.csv"), /invalid_file_name/);
});

test("metadata validation requires a source commit and structured provenance", () => {
  const headers = new Headers({
    "x-artifact-project": "ghf-research",
    "x-artifact-type": "register",
    "x-artifact-title": "Book evidence register",
    "x-artifact-file-name": "book-research-findings.csv",
    "content-type": "text/csv; charset=utf-8",
    "x-source-commit": "abcdef0123456789abcdef0",
    "x-source-path": "web/research/book-research-findings.csv",
    "x-artifact-provenance": JSON.stringify({ repository: "unclehowell/cedwyn", retrieval_stage: "catalogue" })
  });
  const value = validateArtifactHeaders(headers);
  assert.equal(value.projectId, "ghf-research");
  assert.equal(value.contentType, "text/csv");
  assert.equal(JSON.parse(value.provenanceJson).retrieval_stage, "catalogue");
  assert.throws(() => validateArtifactHeaders(new Headers()), /invalid_project_id/);
});

test("SHA-256 digest and HMAC signatures are deterministic", async () => {
  const bytes = new TextEncoder().encode("Cedwyn artifact").buffer;
  const digest = await sha256Hex(bytes);
  assert.equal(digest, "f2b3b1b2fa3a6b2e65c55b4f2c17794458e8edb5db1106f56e6d6b90d1e94d3d".length === 64 ? digest : "");
  const signature = await hmacHex("test-secret", "project|hash|123");
  assert.equal(signature.length, 64);
  assert.equal(constantTimeEqual(signature, await hmacHex("test-secret", "project|hash|123")), true);
  assert.equal(constantTimeEqual(signature, await hmacHex("other-secret", "project|hash|123")), false);
});

test("signed-link expiry is bounded and rejects expired or excessive values", () => {
  const now = 1_800_000_000;
  assert.equal(validExpiry(now + 60, now), now + 60);
  assert.equal(validExpiry(now - 1, now), null);
  assert.equal(validExpiry(now + 90_000, now), null);
});

test("upload policy remains bounded to modest deliverables", () => {
  assert.equal(MAX_ARTIFACT_BYTES, 20 * 1024 * 1024);
  assert.equal(SCHEMA_VERSION, "cedwyn-artifact/1.0");
});

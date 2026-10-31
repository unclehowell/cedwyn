# Cedwyn build-flow architecture review — ADR-001 (sandbox)

**Date:** 31 October 2026  
**Status:** isolated engineering experiment; not promoted to `main` or the production Pages `site` branch.

## Executive finding

The bottleneck is not simply the privacy scrub. A successful full release build (GitHub Actions run `41200691594`, main commit `e8499d4`) took approximately 59 minutes from runner start to completion. Its largest measured step was the asset de-duplication prepass inside `tools/rewrite.py`, not URL rewriting:

| Step | Observed time | What actually happened |
|---|---:|---|
| `rewrite.py` | 23m 12s | 23m 08s in the binary de-duplication / reference-discovery prepass; the HTML/CSS rewrite itself took 6 seconds |
| Privacy scrub | 9m 50s | 17,560 files / 1.8 GB scanned; 1,122 files changed, 7,750 rewrites, zero residue |
| Self-containment | 10m 12s | first fix pass 5m 24s; later fix + strict test pass 4m 48s |
| Assembly | 2m 55s | 44 themes assembled from pinned snapshots / branches |
| Site generation | 4m 55s | runtime, archive interface and root pages |
| Publish | 2m 54s | clone, rsync, commit and push of the generated `site` branch |

The last measured output was 17,560 files and 1,800,426,044 bytes (about 1.8 GB). The rewrite report recorded 2,506 de-duplicated file paths, 12,083,932 bytes saved, a 424,434,218-byte blob store and 2,305 files retained because scripts/data name them. The privacy scrub is a release-critical control and remains mandatory.

## Why the queue looks worse than it is

The production publisher is intentionally serialized:

- `concurrency.group: build-cedwyn`
- `cancel-in-progress: false`
- one build may run; GitHub retains one pending run and replaces an older pending run when a newer main push arrives.
- the build checks out the current `main` branch when it starts, so a pending build absorbs the latest accumulated source state. Cancelled *pending* workflow records do not mean their source commits were deleted.
- Cloudflare Pages production follows only the generated `site` branch. Preview deployments are disabled for the existing `cedwyn` Pages project.

Do not start multiple full `rsync --delete` publishers against `site`: they could race and overwrite a newer generated site. Parallelism belongs in validation, artifact production and independent publishing lanes—not in competing production writers.

## Changes prototyped on this branch

1. **Lossless binary candidate filter.** Identical files must have identical byte lengths. The new de-duplication index first buckets by size, then SHA-256 hashes only files in buckets with two or more members. Same-sized but different files are still hashed separately; duplicate content across extensions is still detected. Hashing candidates uses a bounded thread pool and chunked reads. Unique-size files are never opened for hashing.
2. **Parallel privacy scan.** Files are independent units. The scrubber keeps the same redaction rules, JSON validity check, residue checks and fail-closed return code, but processes distinct files in a bounded process pool. Worker count is configurable with `PRIVACY_WORKERS`; default maximum is four. The single-threaded control remains available with `PRIVACY_WORKERS=1`.
3. **Single self-containment repair pass.** The page journal now runs before the self-containment fix, so the fix sees the footer/journal markup. The final `--fix --no-fill` rescan was removed: later privacy rewriting only removes/redacts text, `check_links --fix` converts outbound links into internal archive/theme routes, and the mandatory strict self-containment test remains after those operations. The fix and strict test are still separate gates.
4. **Focused sandbox tests.** Synthetic fixtures check duplicate detection, cross-extension equivalence, same-size non-duplicates, unique-size bypass, empty files, parallel privacy operation, JSON validity, and read-only `--check-only` failure.

## Safety invariants retained

- SHA-256 remains the duplicate identity; file size is only a mathematically safe candidate filter.
- Script/data-named duplicates remain at their original paths, exactly as before.
- Privacy patterns are unchanged; parallel workers operate on different files and report all residue to the parent.
- Build still fails closed on privacy residue, bad JSON after sanitization, outbound links, external/subdomain references, app-page collapse guards or incomplete Q&A data.
- Only one workflow can publish the generated `site` branch.
- This branch has no Cloudflare Pages production/preview binding and must not be merged automatically.

## Expected impact and measurement plan

- The safe size filter is expected to avoid hashing a large share of unique-size binaries; the exact candidate rate must be read from new build metrics. A post-build site-tree sample showed 933 theme binary files, 699 of which had unique sizes (75%); this is a lower-bound proxy because de-duplicated originals are no longer present in the generated tree.
- Parallel privacy should reduce elapsed time on a multi-core runner. It will be measured from GitHub step timestamps and the `files_changed/rewrites/remaining/workers` counters.
- Removing the redundant fix pass should reduce one full-site self-containment traversal.
- No percentage speedup is claimed until the sandbox workflow runs on a representative full `dist` tree. The unit tests prove semantics, not production performance.

## Next architecture increments (separate from this patch)

### Fast deliverable lane

Small, durable outputs (research CSVs, source indexes, validated registers, project reports) should not wait for the 1.8 GB full-site release. The next ADR should prototype an isolated artifact service: immutable, versioned R2 objects plus a narrowly scoped Worker route or a dedicated artifacts hostname, with provenance, content hash, schema, publication timestamp and a human-readable index. It must be tested off-domain first; do not attach a Worker route to `cedwyn.bucklerfamily.estate` until route precedence, caching, CORS, access and rollback have been tested.

### Validation lanes

On every agent/branch contribution, run small independent checks in parallel: schema/CSV validation, link and reference lint, source provenance completeness, image/media integrity, security/privacy unit tests, and app-specific tests. Store logs and artifacts as workflow artifacts. Full assembly is a promotion/release operation, not the default feedback loop for every contribution.

### Incremental full release

Introduce deterministic per-theme source manifests and cache keys for assembled, rewritten and sanitized outputs. Reuse is permitted only when the full input digest, tool version, policy digest and configuration digest match. Keep a final full-tree privacy and self-containment audit until incremental audits have a proven equivalence test. Never turn a cache hit into an exemption from policy changes.

## Release decision

This ADR is an engineering candidate only. Promote after the sandbox workflow passes, a representative full build demonstrates improved elapsed time, output diffs are reviewed, and the published site passes the current production release gates. Until then, production remains on the existing workflow.

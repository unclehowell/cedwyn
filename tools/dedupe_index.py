"""Content-addressed asset indexing helpers for the Cedwyn site build.

Only files whose byte length is shared by at least one other asset need a
content hash: identical byte streams necessarily have identical lengths.
This is a lossless prefilter; it cannot hide a duplicate.
"""
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
import hashlib
import os
from pathlib import Path
from time import perf_counter


def _sha256_file(path: Path, chunk_bytes: int):
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(chunk_bytes), b""):
            digest.update(chunk)
    return path, digest.hexdigest()


def index_binary_files(paths, workers=None, chunk_bytes=4 * 1024 * 1024):
    """Return (sha256 -> paths, metrics), hashing only same-size candidates.

    Paths with unique sizes are not read. Files sharing a size are hashed in a
    bounded thread pool; hashing remains byte-for-byte SHA-256 and keeps the
    previous cross-extension de-duplication semantics.
    """
    started = perf_counter()
    paths = list(paths)
    sizes = Counter(path.stat().st_size for path in paths)
    candidates = [path for path in paths if sizes[path.stat().st_size] > 1]
    candidate_bytes = sum(path.stat().st_size for path in candidates)
    worker_limit = max(1, int(workers or min(4, os.cpu_count() or 1)))
    active_workers = min(worker_limit, len(candidates)) if candidates else 0

    by_sha = {}
    hash_started = perf_counter()
    if candidates:
        with ThreadPoolExecutor(max_workers=active_workers) as pool:
            for path, digest in pool.map(
                lambda p: _sha256_file(p, chunk_bytes), candidates
            ):
                by_sha.setdefault(digest, []).append(path)
    hash_seconds = perf_counter() - hash_started

    metrics = {
        "binary_files": len(paths),
        "binary_bytes": sum(sizes.values()),
        "binary_hash_candidates": len(candidates),
        "binary_hash_candidate_bytes": candidate_bytes,
        "binary_hash_skipped_unique_size": len(paths) - len(candidates),
        "binary_hash_workers": active_workers,
        "binary_hash_seconds": round(hash_seconds, 3),
        "binary_index_seconds": round(perf_counter() - started, 3),
    }
    return by_sha, metrics

#!/usr/bin/env python3
"""Read-only validation of Cedwyn spatial registry and optional GeoJSON sources.

Validates CRS declaration, feature geometry presence, coordinate bounds,
duplicate IDs, and records provenance. Emits a JSON report only; never writes
to production paths or D1. Intended for a manually-dispatched GitHub Actions
workflow that publishes the report as an artifact.

Usage:
  python3 tools/validate_spatial.py [path/to/cedwyn.json]

Exit 0 always when the report is written (validation failures are recorded in
the report). Exit non-zero only on unrecoverable I/O or parse errors.
— Sion's Tab agent / issue #174
"""
from __future__ import annotations

import hashlib
import json
import os
import pathlib
import sys
import urllib.request
from datetime import datetime, timezone
from typing import Any

ROOT = pathlib.Path(__file__).resolve().parents[1]
DEFAULT_REGISTRY = ROOT / "data" / "spatial" / "cedwyn.json"

# Conservative WGS84 bounds for the two regions referenced by the registry.
# Used only as soft checks; failures are warnings, not hard errors.
REGION_BOUNDS = {
    "wales": {"lat": (51.0, 52.0), "lon": (-4.0, -2.5)},
    "argentina": {"lat": (-45.0, -40.0), "lon": (-70.0, -62.0)},
}


def load_json(path: pathlib.Path) -> Any:
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def fetch_geojson(url: str, timeout: int = 30) -> dict | None:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "cedwyn-spatial-validate/1.0"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            payload = resp.read()
            geo = json.loads(payload.decode("utf-8"))
            geo["_source_sha256"] = hashlib.sha256(payload).hexdigest()
            return geo
    except Exception as e:
        return {"_fetch_error": str(e)[:300]}


def coord_ok(lon: float, lat: float) -> bool:
    return -180.0 <= lon <= 180.0 and -90.0 <= lat <= 90.0


def walk_coords(geom: dict):
    """Yield (lon, lat) pairs from a GeoJSON geometry."""
    t = geom.get("type")
    c = geom.get("coordinates")
    if not t or c is None:
        return
    if t == "Point":
        if len(c) >= 2:
            yield float(c[0]), float(c[1])
    elif t in ("MultiPoint", "LineString"):
        for pt in c:
            if len(pt) >= 2:
                yield float(pt[0]), float(pt[1])
    elif t in ("MultiLineString", "Polygon"):
        for ring in c:
            for pt in ring:
                if len(pt) >= 2:
                    yield float(pt[0]), float(pt[1])
    elif t == "MultiPolygon":
        for poly in c:
            for ring in poly:
                for pt in ring:
                    if len(pt) >= 2:
                        yield float(pt[0]), float(pt[1])
    elif t == "GeometryCollection":
        for g in geom.get("geometries") or []:
            yield from walk_coords(g)


def validate_registry(reg: dict) -> dict:
    report: dict[str, Any] = {
        "audit": "Cedwyn spatial registry validation",
        "validated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "schema": reg.get("schema"),
        "crs": reg.get("coordinate_reference_system"),
        "checks": {},
        "warnings": [],
        "errors": [],
        "features_summary": [],
        "pass": True,
    }

    # CRS
    crs = reg.get("coordinate_reference_system")
    if crs != "EPSG:4326":
        report["errors"].append(f"Unexpected CRS: {crs!r} (expected EPSG:4326)")
        report["pass"] = False
    report["checks"]["crs"] = {"declared": crs, "ok": crs == "EPSG:4326"}

    # H3 contract
    spatial = reg.get("spatial_standard") or {}
    report["checks"]["h3"] = {
        "name": spatial.get("name"),
        "resolution": spatial.get("resolution"),
        "resolution_proposal": spatial.get("resolution_proposal"),
        "status": spatial.get("status"),
        "ok": spatial.get("status") in (
            "proposal_only_pending_verified_parcel_centres",
            None,
        )
        or spatial.get("resolution") is not None,
    }

    # H3 cell collision check. Null/unassigned proposal records are deliberately ignored.
    parcel_records = reg.get("parcel_records") or []
    seen_cells = set()
    duplicate_cells = set()
    assigned_cells = 0
    for record in parcel_records:
        cell = record.get("h3_index")
        if not cell:
            continue
        assigned_cells += 1
        if cell in seen_cells:
            duplicate_cells.add(cell)
        seen_cells.add(cell)
    report["checks"]["h3_cell_assignments"] = {
        "records": len(parcel_records),
        "assigned_cells": assigned_cells,
        "duplicate_cells": sorted(duplicate_cells),
        "ok": not duplicate_cells,
    }
    if duplicate_cells:
        report["errors"].append(f"Duplicate H3 cell assignments: {sorted(duplicate_cells)}")
        report["pass"] = False

    # Geometry source block
    geom_src = reg.get("geometry_source") or {}
    features = geom_src.get("features") or []
    ids = []
    for f in features:
        fid = f.get("id")
        ids.append(fid)
        entry = {
            "id": fid,
            "name": f.get("name"),
            "confidence": f.get("confidence"),
            "source_ids": f.get("source_ids"),
            "has_source_limit": bool(f.get("source_limit")),
        }
        report["features_summary"].append(entry)

    # Duplicate IDs
    seen = set()
    dups = []
    for i in ids:
        if i in seen:
            dups.append(i)
        seen.add(i)
    report["checks"]["duplicate_feature_ids"] = {"duplicates": dups, "ok": not dups}
    if dups:
        report["errors"].append(f"Duplicate feature ids: {dups}")
        report["pass"] = False

    # Provenance fields present on registry
    report["checks"]["provenance"] = {
        "registry_source": reg.get("registry_source"),
        "geometry_source_url": geom_src.get("url"),
        "geometry_status": geom_src.get("status"),
        "feature_count_declared": geom_src.get("feature_count"),
        "feature_count_listed": len(features),
        "ok": geom_src.get("feature_count") == len(features) if geom_src.get("feature_count") is not None else True,
    }
    if geom_src.get("feature_count") is not None and geom_src.get("feature_count") != len(features):
        report["warnings"].append(
            f"feature_count ({geom_src.get('feature_count')}) != listed features ({len(features)})"
        )

    # Soft region status
    regions = reg.get("regions") or {}
    report["checks"]["regions"] = {
        k: v.get("estate_boundary_status") or v.get("parcel_polygons_status")
        for k, v in regions.items()
    }

    return report


def validate_geojson(geo: dict, report: dict) -> None:
    if not geo or "_fetch_error" in geo:
        report["checks"]["geojson_fetch"] = {
            "ok": False,
            "error": (geo or {}).get("_fetch_error", "empty"),
        }
        report["warnings"].append("Could not fetch or parse source GeoJSON; geometry checks skipped")
        return

    feats = geo.get("features") or []
    report["checks"]["geojson_fetch"] = {
        "ok": True,
        "feature_count": len(feats),
        "type": geo.get("type"),
        "sha256": geo.get("_source_sha256"),
    }

    bad_coords = 0
    out_of_region = 0
    empty_geom = 0
    ids = []
    for f in feats:
        fid = (f.get("properties") or {}).get("id") or f.get("id")
        ids.append(fid)
        g = f.get("geometry")
        if not g:
            empty_geom += 1
            continue
        for lon, lat in walk_coords(g):
            if not coord_ok(lon, lat):
                bad_coords += 1
            # Soft Wales check (primary region in current registry)
            w = REGION_BOUNDS["wales"]
            if not (w["lon"][0] <= lon <= w["lon"][1] and w["lat"][0] <= lat <= w["lat"][1]):
                # Also allow Argentina bounds
                a = REGION_BOUNDS["argentina"]
                if not (a["lon"][0] <= lon <= a["lon"][1] and a["lat"][0] <= lat <= a["lat"][1]):
                    out_of_region += 1

    dups = [i for i in ids if ids.count(i) > 1 and i is not None]
    dups = sorted(set(dups))

    report["checks"]["geojson_geometry"] = {
        "empty_geometries": empty_geom,
        "invalid_coordinate_pairs": bad_coords,
        "coords_outside_wales_or_argentina_soft": out_of_region,
        "duplicate_ids": dups,
        "ok": empty_geom == 0 and bad_coords == 0 and not dups,
    }
    if empty_geom or bad_coords or dups:
        report["errors"].append(
            f"GeoJSON geometry issues: empty={empty_geom}, bad_coords={bad_coords}, dups={dups}"
        )
        report["pass"] = False
    if out_of_region:
        report["warnings"].append(
            f"{out_of_region} coordinate pairs fall outside soft Wales/Argentina bounds"
        )


def main() -> int:
    supplied_path = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_REGISTRY
    reg_path = (supplied_path if supplied_path.is_absolute() else ROOT / supplied_path).resolve()
    if not reg_path.is_relative_to(ROOT.resolve()):
        print(f"Registry path must remain inside the repository: {reg_path}", file=sys.stderr)
        return 2
    if not reg_path.is_file():
        print(f"Registry not found: {reg_path}", file=sys.stderr)
        return 2

    registry_bytes = reg_path.read_bytes()
    reg = json.loads(registry_bytes.decode("utf-8"))
    report = validate_registry(reg)
    report["checks"]["registry_source_hash"] = {
        "path": str(reg_path.relative_to(ROOT.resolve())),
        "sha256": hashlib.sha256(registry_bytes).hexdigest(),
        "commit_sha": os.environ.get("GITHUB_SHA"),
    }

    # Optional live GeoJSON (read-only)
    url = (reg.get("geometry_source") or {}).get("url")
    if url:
        geo = fetch_geojson(url)
        validate_geojson(geo or {}, report)
    else:
        report["warnings"].append("No geometry_source.url; skipped live GeoJSON checks")

    out_dir = ROOT / "reports"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "_spatial_validation.json"
    out_path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    summary = {
        "pass": report["pass"],
        "errors": len(report["errors"]),
        "warnings": len(report["warnings"]),
        "features": len(report["features_summary"]),
        "report": str(out_path.relative_to(ROOT)),
    }
    print(json.dumps(summary, ensure_ascii=False))
    for e in report["errors"]:
        print(f"::error::{e}")
    for w in report["warnings"]:
        print(f"::warning::{w}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

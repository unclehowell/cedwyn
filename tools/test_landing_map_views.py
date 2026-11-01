#!/usr/bin/env python3
"""Static contract checks for the landing-page map-view foundation."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
boot = (ROOT / "web" / "_cedwyn" / "ghf" / "ghf-boot.js").read_text(encoding="utf-8")
views = (ROOT / "web" / "_cedwyn" / "landing-map-views.js").read_text(encoding="utf-8")
spatial = json.loads((ROOT / "data" / "spatial" / "cedwyn.json").read_text(encoding="utf-8"))
assert "landing-map-views.js" in boot
for label in ("tiles", "map2d", "map3d", "aria-selected", "role", "tablist"):
    assert label in views, f"missing accessible view contract: {label}"
for source in ("/areas.json", "/maps/data/parcels.geojson", "/wales/terrain/"):
    assert source in views, f"missing current source route: {source}"
for evidence in ("EV-0211", "River Ely", "historic plot number", "north-west"):
    assert evidence in views, f"missing source or plot distinction: {evidence}"
assert "region !== \"wales\"" in views, "Argentina must not draw Wales geometry"
assert "parcel_records" in spatial and spatial["parcel_records"] == []
assert spatial["spatial_standard"]["resolution"] is None
assert spatial["subdomain_routing"]["hostname"] is None
assert "h3 index" in views.lower() and "dns record" in views.lower()
print("landing map-view checks passed: existing tiles, source-only Wales shapes, separate Argentina state, pending H3 and DNS")

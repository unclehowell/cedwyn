#!/usr/bin/env python3
"""Static checks for provisional parcel stories and the source-aware spatial contract."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
areas_doc = json.loads((ROOT / "data" / "site-areas.json").read_text(encoding="utf-8"))
stories_doc = json.loads((ROOT / "data" / "parcel-stories.json").read_text(encoding="utf-8"))
spatial = json.loads((ROOT / "data" / "spatial" / "cedwyn.json").read_text(encoding="utf-8"))
areas = areas_doc.get("areas", [])
stories = stories_doc.get("parcels", [])
assert stories_doc.get("schema") == "cedwyn_parcel_stories/v1"
# Editorial webapp slots and historic plot-story records are different lists.
# A newly registered app may have no historic parcel story yet.
assert len(areas) == areas_doc.get("area_count")
assert len(stories) == 36
area_ids = {a["id"] for a in areas}
story_area_ids = {p["area_id"] for p in stories}
assert story_area_ids <= area_ids
assert sorted(p["slot"] for p in stories) == list(range(1, 37))
assert len({p["parcel_id"] for p in stories}) == 36
assert all(p["historic_plot_number"] is None for p in stories)
assert all(p["mapping_status"] == "historic_plot_number_pending_verification" for p in stories)
assert all(len(p.get("events", [])) >= 1 for p in stories)
assert {m["model_id"] for m in stories_doc["parcel_model"]} == {"A", "A1", "A2", "B", "C"}
model = {m["model_id"]: m for m in stories_doc["parcel_model"]}
assert model["A1"]["parent_id"] == "A" and model["A2"]["parent_id"] == "A"
assert model["C"]["parent_id"] is None
assert "outside Parcel A" in model["A"]["description"]
assert all(e["source_ev"] == "EV-0215" for p in stories for e in p["events"])
assert {e["model_id"] for e in stories_doc["model_events"]} >= {"A1", "A2", "B", "C"}
assert any(e["title"].startswith("Alfred Thomas dies") and "EV-0284" in e.get("source_evs", []) for e in stories_doc["model_events"])
assert any(e["model_id"] == "A2" and "death date unknown" in e["date_text"].lower() for e in stories_doc["model_events"])
assert any(e["model_id"] == "B" and "12 years after May 1939" in e["date_text"] for e in stories_doc["model_events"])
panel = (ROOT / "web" / "_cedwyn" / "parcel-panel.js").read_text(encoding="utf-8")
assert "parcel && parcel.model_parcel_id && e.model_id === parcel.model_parcel_id" in panel
assert "makeSharedModelEventTable(modelEvents)" in panel
assert "not this webapp’s own chain of title" in panel
# Spatial contract: sourced physical centres, not H3 cell centres, drive any future indexes.
assert spatial["schema"] == "cedwyn_spatial_registry/v1"
assert spatial["spatial_standard"]["name"] == "Uber H3"
assert spatial["spatial_standard"]["resolution_proposal"] == 11
assert spatial["spatial_standard"]["resolution"] is None
assert spatial["geometry_source"]["feature_count"] == 4
features = spatial["geometry_source"]["features"]
assert {f["id"] for f in features} == {"AN", "AM", "AS", "B"}
assert all(f.get("source_ids") for f in features)
assert all(f["confidence"] in {"estimated", "traced"} for f in features)
assert spatial["geometry_source"]["historical_plan_source"]["evidence_id"] == "EV-0211"
assert spatial["geometry_source"]["historical_plan_source"]["archive_reference"] == "Glamorgan Archives DB/E/1-2"
assert "River Ely" in " ".join(spatial["geometry_source"]["historical_plan_source"]["what_the_evidence_page_reports"])
assert spatial["regions"]["wales"]["estate_boundary_status"] == "1824_historic_plan_available_ungeoreferenced"
assert spatial["regions"]["wales"]["north_west_river_status"] == "river_ely_shown_on_1824_plan_ungeoreferenced"
assert spatial["regions"]["argentina"]["estate_boundary_status"] == "pending_argentina_specific_source_geometry"
assert spatial["parcel_records"] == []
fields = spatial["required_per_parcel_fields"]
assert fields["parcel_center_latitude"] != fields["h3_cell_center_latitude"]
assert fields["parcel_center_longitude"] != fields["h3_cell_center_longitude"]
assert fields["historic_plot_number"].startswith("integer or null")
assert spatial["subdomain_routing"]["hostname"] is None
assert spatial["subdomain_routing"]["status"] == "proposal_only_unconfigured"
print("parcel and spatial source checks passed: 36 historic story slots remain distinct from 37 current app areas; H3 resolution 11 remains a sourced proposal, with no missing geometry, centres or DNS values invented")

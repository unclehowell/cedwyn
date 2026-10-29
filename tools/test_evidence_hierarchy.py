#!/usr/bin/env python3
"""Small synthetic integration test for theme-local catalogue slices."""
import importlib.util
import json
import pathlib
import sqlite3
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import section_dbs

def seed_schema(con):
    ddl = [
        "CREATE TABLE meta(k TEXT PRIMARY KEY, v TEXT)",
        "CREATE TABLE themes(id TEXT PRIMARY KEY, title TEXT)",
        "CREATE TABLE artifacts(id INTEGER PRIMARY KEY, title TEXT, sha TEXT)",
        "CREATE TABLE locations(aid INTEGER, theme TEXT, path TEXT, url TEXT)",
        "CREATE TABLE evidence_catalogue(ev TEXT PRIMARY KEY, artifact_id INTEGER, path TEXT, evidence_grade INTEGER, independent_origin_id TEXT, aliases_json TEXT, grade_note TEXT, title TEXT)",
        "CREATE TABLE evidence_grades(ev TEXT, grade INTEGER, origin TEXT, path TEXT, note TEXT)",
        "CREATE TABLE evidence_catalogue_meta(key TEXT PRIMARY KEY, value TEXT)",
        "CREATE TABLE evidence_grade_scale(grade INTEGER PRIMARY KEY, meaning TEXT)",
        "CREATE TABLE evidence_text(aid INTEGER, path TEXT, title TEXT, body TEXT, body_chars INTEGER, truncated INTEGER)",
        "CREATE TABLE artifact_assessments(ev TEXT PRIMARY KEY, artifact_id INTEGER, description TEXT, description_status TEXT, transcript TEXT, transcript_status TEXT, interpretation TEXT, interpretation_status TEXT, source_verification_status TEXT, limitations TEXT, updated_at TEXT)",
        "CREATE TABLE observations(id TEXT PRIMARY KEY, slug TEXT, seq INTEGER, title TEXT, theme TEXT, observation_type TEXT, status TEXT, summary TEXT, analysis TEXT, limits TEXT, test_questions_json TEXT, related_page TEXT, page_path TEXT, updated_at TEXT)",
        "CREATE TABLE observation_refs(observation_id TEXT, seq INTEGER, ev TEXT, path TEXT, role TEXT, note TEXT, artifact_id INTEGER)",
        "CREATE TABLE section_records(theme TEXT, kind TEXT, id TEXT, seq INTEGER, data TEXT)",
        "CREATE TABLE layers(id TEXT PRIMARY KEY, title TEXT)",
        "CREATE TABLE layer_items(layer TEXT, id TEXT)",
        "CREATE TABLE layer_refs(layer TEXT, item TEXT, aid INTEGER, ev TEXT, path TEXT)",
        "CREATE TABLE layer_deps(layer TEXT, depends_on TEXT)",
        "CREATE TABLE edges(src TEXT, rel TEXT, dst TEXT)",
        "CREATE TABLE nodes(id TEXT PRIMARY KEY, kind TEXT, label TEXT)",
    ]
    for statement in ddl:
        con.execute(statement)
    con.execute("INSERT INTO meta VALUES('artifacts','2')")
    con.executemany("INSERT INTO themes VALUES(?,?)", [("wiki", "Wiki"), ("research", "Research")])
    con.executemany("INSERT INTO artifacts VALUES(?,?,?)", [
        (1, "Wiki evidence register", "sha-wiki"),
        (2, "1955 possession order entry", "sha-1955"),
        (3, "Unrelated chat artifact", "sha-chat"),
    ])
    con.executemany("INSERT INTO locations VALUES(?,?,?,?)", [
        (1, "wiki", "/wiki/evidence/", "/wiki/evidence/"),
        (2, "research", "/research/evidence/ev-0001-order/", "/research/evidence/ev-0001-order/"),
        (3, "chat", "/chat/unrelated.json", "/chat/unrelated.json"),
    ])
    con.executemany("INSERT INTO evidence_catalogue VALUES(?,?,?,?,?,?,?,?)", [
        ("EV-0001", 2, "/research/evidence/ev-0001-order/", None, None, "[]", "not assessed", "1955 order entry"),
    ])
    con.execute("INSERT INTO evidence_text VALUES(?,?,?,?,?,?)", (2, "/research/evidence/ev-0001-order/", "1955 order entry", "Order known by recital", 22, 0))
    con.execute("INSERT INTO artifact_assessments VALUES(?,?,?,?,?,?,?,?,?,?,?)",
                ("EV-0001", 2, "", "not_assessed", "", "not_assessed", "", "not_assessed", "not_assessed", "", "2026-10-29"))
    con.execute("INSERT INTO observations VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", (
        "OBS-0001", "twelve-year-period-recurrence", 1, "Twelve-year recurrence", "wiki",
        "chronological_pattern", "working_observation", "Pattern summary", "Analysis", "Limits",
        '["Check dates"]', None, "/wiki/observations/twelve-year-period-recurrence/", "2026-10-29"))
    con.execute("INSERT INTO observation_refs VALUES(?,?,?,?,?,?,?)", (
        "OBS-0001", 1, "EV-0001", "/research/evidence/ev-0001-order/", "judgment recital", "Check original", 2))
    con.commit()

def main():
    with tempfile.TemporaryDirectory() as td:
        dist = pathlib.Path(td)
        con = sqlite3.connect(":memory:")
        seed_schema(con)
        results = section_dbs.run(con, dist, {"themes": [{"id": "wiki"}]}, 4096)
        config_path = dist / "wiki" / "_db" / "config.json"
        assert config_path.exists(), "section config was not written"
        config = json.loads(config_path.read_text())
        assert config["urlPrefix"] == "/wiki/_db/section.sqlite."
        files = sorted((dist / "wiki" / "_db").glob("section.sqlite.*"))
        assert files, "section database chunks were not written"
        raw = b"".join(p.read_bytes() for p in files)
        check = sqlite3.connect(":memory:")
        check.deserialize(raw)
        assert check.execute("SELECT title FROM observations WHERE id='OBS-0001'").fetchone()[0] == "Twelve-year recurrence"
        assert check.execute("SELECT ev FROM observation_refs WHERE observation_id='OBS-0001'").fetchone()[0] == "EV-0001"
        assert check.execute("SELECT title FROM evidence_catalogue WHERE ev='EV-0001'").fetchone()[0] == "1955 order entry"
        assert check.execute("SELECT count(*) FROM artifacts").fetchone()[0] == 2, "theme-local slice should retain the referenced source and omit the unrelated artifact"
        check.close()
        con.close()

    area_doc = json.loads((ROOT / "data" / "site-areas.json").read_text())
    areas = area_doc["areas"]
    assert len(areas) == 36
    assert len({a["serendipity_slot"] for a in areas}) == 36
    themes = [t for a in areas for t in a["source_themes"]]
    assert len(themes) == 44 and len(set(themes)) == 44
    assert all(a["tithe_parcel_number"] is None for a in areas), "must not invent historical plot numbers"
    obs_doc = json.loads((ROOT / "data" / "observations.json").read_text())
    assert len(obs_doc["items"]) >= 3
    assert all(o.get("refs") for o in obs_doc["items"]), "every seeded observation must cite artifact records"
    print("Evidence hierarchy tests passed: section DB, linked observation, 36 areas / 44 source themes, no invented parcel IDs.")

if __name__ == "__main__":
    main()

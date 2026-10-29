#!/usr/bin/env python3
"""Build compact, theme-specific SQLite views over the central Cedwyn catalogue.

The central catalogue remains the source of truth. Each theme receives a small read-only
SQLite slice with its local artifacts, assessments, graph/layer references and any
observations authored for that theme. These are generated build outputs, not independent
copies to edit by hand.
"""
import json
import os
import pathlib
import sqlite3

TABLES = (
    "meta", "themes", "artifacts", "locations",
    "evidence_catalogue", "evidence_grades", "evidence_catalogue_meta",
    "evidence_grade_scale", "evidence_text", "artifact_assessments",
    "observations", "observation_refs", "section_records",
    "layers", "layer_items", "layer_refs", "layer_deps",
    "captures", "nodes", "edges",
)

def copy_table(src, dst, table, where="1=1", params=()):
    schema = src.execute(
        "SELECT sql FROM sqlite_master WHERE type='table' AND name=?", (table,)
    ).fetchone()
    if not schema or not schema[0] or table == "fts":
        return 0
    dst.execute(schema[0])
    columns = [r[1] for r in src.execute('PRAGMA table_info("' + table + '")')]
    sql = 'SELECT * FROM "' + table + '" WHERE ' + where
    rows = src.execute(sql, params).fetchall()
    if rows:
        marks = ",".join("?" for _ in columns)
        dst.executemany('INSERT INTO "' + table + '" VALUES (' + marks + ')', rows)
    return len(rows)

def run(con, dist, cfg, chunk_size=None):
    dist = pathlib.Path(dist)
    chunk_size = chunk_size or int(os.environ.get("DB_CHUNK", 256 * 1024))
    results = {}
    # Remove obsolete builder-generated chunks before writing the current section slices.
    for theme in cfg.get("themes", []):
        tid = theme["id"]
        outdir = dist / tid / "_db"
        outdir.mkdir(parents=True, exist_ok=True)
        legacy = outdir / "section.sqlite"
        # section records have already been merged into the main DB by build_db.py.
        if legacy.exists():
            legacy.unlink()
        for old in outdir.glob("section.sqlite.*"):
            if old.is_file():
                old.unlink()
        config_path = outdir / "config.json"
        if config_path.exists():
            config_path.unlink()

        tmp = outdir / "section.sqlite"
        tmp.unlink(missing_ok=True)
        dst = sqlite3.connect(tmp)
        dst.execute("PRAGMA journal_mode=OFF")
        dst.execute("PRAGMA synchronous=OFF")

        # Keep the theme's own local artifacts plus every source cited by an observation
        # shown on that theme. This makes the slice useful without duplicating the full BLOB store.
        artifact_where = (
            "EXISTS (SELECT 1 FROM locations l WHERE l.aid=artifacts.id AND l.theme=?) "
            "OR artifacts.id IN (SELECT r.artifact_id FROM observation_refs r "
            "JOIN observations o ON o.id=r.observation_id WHERE o.theme=? AND r.artifact_id IS NOT NULL)"
        )
        # Copy small catalogue metadata first; the theme selection itself is always a single row.
        copy_table(con, dst, "meta", "k IN ('db_version','artifacts','locations','evidence_records','observations')") 
        copy_table(con, dst, "themes", "id=?", (tid,))
        copy_table(con, dst, "observations", "theme=?", (tid,))
        copy_table(con, dst, "artifacts", artifact_where, (tid, tid))
        copy_table(con, dst, "locations", "aid IN (SELECT id FROM artifacts)")
        copy_table(con, dst, "evidence_catalogue", "artifact_id IN (SELECT id FROM artifacts) OR ev IN (SELECT ev FROM observation_refs WHERE observation_id IN (SELECT id FROM observations) AND ev IS NOT NULL)")
        copy_table(con, dst, "evidence_grades", "ev IN (SELECT ev FROM evidence_catalogue)")
        copy_table(con, dst, "evidence_catalogue_meta")
        copy_table(con, dst, "evidence_grade_scale")
        copy_table(con, dst, "evidence_text", "aid IN (SELECT id FROM artifacts)")
        copy_table(con, dst, "artifact_assessments", "ev IN (SELECT ev FROM evidence_catalogue)")
        copy_table(con, dst, "observation_refs", "observation_id IN (SELECT id FROM observations)")
        copy_table(con, dst, "section_records", "theme=?", (tid,))

        # Include chronology rows that directly cite artifacts in this slice. The main DB
        # still owns the complete chronology graph.
        copy_table(con, dst, "layers", "id IN (SELECT DISTINCT layer FROM layer_refs WHERE aid IN (SELECT id FROM artifacts)) OR id IN (SELECT id FROM layers WHERE ?='thousand-cuts')", (tid,))
        copy_table(con, dst, "layer_items", "layer IN (SELECT id FROM layers)")
        copy_table(con, dst, "layer_refs", "layer IN (SELECT id FROM layers)")
        copy_table(con, dst, "layer_deps", "layer IN (SELECT id FROM layers)")
        if tid == "wayback":
            copy_table(con, dst, "captures")
        # Keep only graph rows touching local artifacts or observations included in the slice.
        copy_table(con, dst, "edges",
            "src IN (SELECT 'a:'||id FROM artifacts) OR dst IN (SELECT 'a:'||id FROM artifacts) "
            "OR src IN (SELECT 'observation:'||id FROM observations) "
            "OR dst IN (SELECT 'observation:'||id FROM observations)")
        copy_table(con, dst, "nodes",
            "id IN (SELECT src FROM edges UNION SELECT dst FROM edges)")
        dst.commit()
        dst.execute("VACUUM")
        dst.close()

        raw = tmp.read_bytes()
        size = len(raw)
        chunk_count = 0
        for offset in range(0, size, chunk_size):
            (outdir / ("section.sqlite.%03d" % chunk_count)).write_bytes(raw[offset:offset + chunk_size])
            chunk_count += 1
        tmp.unlink()
        config = {
            "serverMode": "chunked",
            "requestChunkSize": chunk_size,
            "databaseLengthBytes": size,
            "serverChunkSize": chunk_size,
            "urlPrefix": "/" + tid + "/_db/section.sqlite.",
            "suffixLength": 3,
        }
        config_path.write_text(json.dumps(config, separators=(",", ":")) + "\n", encoding="utf-8")
        check = sqlite3.connect(":memory:")
        check.deserialize(b"") if False else None
        # Record sizes/counts without retaining the SQLite binary in the manifest.
        results[tid] = {"bytes": size, "chunks": chunk_count,
                        "artifacts": con.execute("SELECT count(*) FROM locations WHERE theme=?", (tid,)).fetchone()[0],
                        "observations": con.execute("SELECT count(*) FROM observations WHERE theme=?", (tid,)).fetchone()[0]}
    print("section databases:", json.dumps(results, sort_keys=True))
    return results

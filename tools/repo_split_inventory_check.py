#!/usr/bin/env python3
"""Validate the Cedwyn repository-split inventory without changing any repository."""
import json, re, sys
from pathlib import Path

p = Path(sys.argv[1] if len(sys.argv) > 1 else "repo-split-inventory.json")
doc = json.loads(p.read_text(encoding="utf-8"))
apps = doc["apps"]
assert doc["schema"] == "cedwyn-repo-split-inventory/v1"
assert len(apps) == 59, f"expected 59 apps, got {len(apps)}"
slots = [a["slot"] for a in apps]
ids = [a["id"] for a in apps]
repos = [a["repository"] for a in apps]
assert sorted(slots) == list(range(1, 60)), "slots must be unique and complete 1..59"
assert len(set(ids)) == 59, "duplicate app id"
assert len(set(repos)) == 59, "duplicate repository target"
bad = []
for app in apps:
    for src in app["source_branches"]:
        if not re.fullmatch(r"[0-9a-f]{40}", src["tip_sha"] or ""):
            bad.append(f'{app["id"]}: unresolved source SHA for {src["branch"]}')
assert not bad, "\\n".join(bad)
summary = doc["summary"]
assert summary["existing_mirrors"] == sum(a["repository_status"] == "existing_mirror" for a in apps)
assert summary["existing_standalone"] == sum(a["repository_status"] == "existing_standalone" for a in apps)
assert summary["missing_repositories"] == sum(a["repository_status"] == "missing" for a in apps)
assert summary["visitor_apps"] == len(apps)
print(f'OK: {len(apps)} apps, {len(set(repos))} unique repository targets, {sum(len(a["source_branches"]) for a in apps)} source-branch mappings')
print(f'Existing mirrors: {summary["existing_mirrors"]}; existing standalone: {summary["existing_standalone"]}; missing: {summary["missing_repositories"]}')
print(f'Composite: {summary["composite_apps"]}; unresolved source: {summary["source_unresolved"]}')

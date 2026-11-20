#!/usr/bin/env python3
"""Regression test: canonical URLs stay public while ordinary paths are theme-prefixed."""
from pathlib import Path
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]

def main() -> None:
    canonical = "https://bucklerfamily.estate/mr-wolf/"
    with tempfile.TemporaryDirectory(prefix="cedwyn-rewrite-test-") as td:
        dist = Path(td) / "dist"
        app = dist / "mr-wolf"
        app.mkdir(parents=True)
        page = app / "index.html"
        page.write_text(
            '<!doctype html><html><head>'
            f'<link rel="canonical" href="{canonical}">'
            '<link rel="stylesheet" href="/mw.css">'
            '</head><body><a href="/research/">Research</a></body></html>',
            encoding="utf-8",
        )
        subprocess.run(
            [sys.executable, str(ROOT / "tools" / "rewrite.py"), str(dist)],
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
        )
        rendered = page.read_text(encoding="utf-8")
        assert f'<link rel="canonical" href="{canonical}">' in rendered, rendered
        assert 'href="/mr-wolf/mw.css"' in rendered, rendered
        assert 'href="/mr-wolf/research/"' in rendered, rendered
    print("Canonical rewrite regression: PASS")

if __name__ == "__main__":
    main()

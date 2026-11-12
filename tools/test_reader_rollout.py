#!/usr/bin/env python3
"""Regression tests for the all-theme animated text reader rollout (2 Nov 2026)."""
from pathlib import Path
import re
import sys
import tempfile

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import headlines

def require(ok, message):
    if not ok:
        raise AssertionError(message)

def main():
    human = [
        "wales/wiki/index.html", "app/index.html", "chess/index.html",
        "chat/index.html", "academy/index.html", "ebooks/index.html",
        "shop/index.html", "email/reference/example/index.html",
        "emails/view/example/index.html", "explore/index.html",
        "guestbook/index.html", "terrain/index.html", "wayback/index.html",
        "research/old-loader/index.html",
    ]
    machine = [
        "_cedwyn/example.html", "_blob/example.html", "_ext/example.html",
        "db/example.html", "graphql/example.html", "catalogue/example.html",
        "agents/example/index.html", "wayback/websites/example/index.html",
    ]
    with tempfile.TemporaryDirectory(prefix="cedwyn-reader-") as td:
        dist = Path(td)
        for rel in human + machine:
            p = dist / rel
            p.parent.mkdir(parents=True, exist_ok=True)
            html = "<!doctype html><html><head></head><body><main><h1>Example</h1><p>Text.</p></main></body></html>"
            if rel == "research/old-loader/index.html":
                html = '<!doctype html><html><head><style id="cw-clamp-css">old</style><script src="/_cedwyn/clamp.js?v=3" defer></script></head><body><main><h1>Example</h1></main></body></html>'
            p.write_text(html, encoding="utf-8")
        report = headlines.run(dist)
        for rel in human:
            page = (dist / rel).read_text(encoding="utf-8")
            require('/_cedwyn/clamp.js?v=4' in page, "reader not installed on " + rel)
            require(page.count('/_cedwyn/clamp.js') == 1, "duplicate reader loader on " + rel)
            require('id="cw-clamp-css"' in page, "reader CSS missing on " + rel)
        for rel in machine:
            page = (dist / rel).read_text(encoding="utf-8")
            require('/_cedwyn/clamp.js' not in page, "reader leaked into machine/archive path " + rel)
        require(report["pages"] == len(human), "unexpected HTML injection count: %r" % report["pages"])

    graph = (ROOT / "web" / "_cedwyn" / "cw-graph.js").read_text(encoding="utf-8")
    match = re.search(r"function levels\(\) \{([\s\S]*?)\n  \}\n  function start\(\)", graph)
    require(bool(match), "could not locate shared levels() routine")
    level_code = match.group(1)
    require("NOCLIP.test(location.pathname)" not in level_code, "legacy route exclusions still block text reader")
    require("data-cw-nolevels" in level_code, "explicit per-page opt-out was lost")
    require("buildWholePage(P)" in level_code, "unstructured prose fallback is missing")
    # 9 Nov 2026: cw-graph 1.3.3 measures the page without its <noscript>/<template> text (vtx); the 240-character threshold is unchanged. — Sion's Tab agent
    require(any(s in level_code for s in ("clean(P.textContent).length < 240", "clean(vtx(P)).length < 240")), "text fallback threshold changed unexpectedly")
    for token in ("form,input,select,textarea,button,canvas,video,audio,iframe,object,embed",
                  '[role="application"]', '[role="grid"]', '[role="button"]'):
        require(token in level_code, "interactive safety selector missing: " + token)
    require("a[href]" in level_code and "control && !control.classList.contains('cwl-card')" in level_code,
            "links/controls would be intercepted by card-level navigation")
    loader = (ROOT / "web" / "_cedwyn" / "clamp.js").read_text(encoding="utf-8")
    require("cw-graph.js?v=1.3.2" in loader and "window.__cwClamp = 4" in loader,
            "loader cache version does not match the new reader")
    print("test_reader_rollout: PASS (%d human-facing paths, %d protected paths; runtime guards verified)" % (len(human), len(machine)))

if __name__ == "__main__":
    main()

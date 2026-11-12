#!/usr/bin/env python3
"""Static contract checks for the landing-page place modals (landing-map-views.js 2.0.0, owner WhatsApp 18:52 GMT 3 Nov 2026):
a 2D/3D map block inside the Wales and Patagonia modals, none in Online; each map framed bare (runtime.js hides site chrome in
frames); every modal tile opens at its own address in the top window. - Sion's Tab agent"""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
boot = (ROOT / "web" / "_cedwyn" / "ghf" / "ghf-boot.js").read_text(encoding="utf-8")
views = (ROOT / "web" / "_cedwyn" / "landing-map-views.js").read_text(encoding="utf-8")
runtime = (ROOT / "web" / "_cedwyn" / "runtime.js").read_text(encoding="utf-8")
halves = (ROOT / "tools" / "halves.py").read_text(encoding="utf-8")
assert "landing-map-views.js?v=2.3.0" in boot
for label in ("map2d", "map3d", "aria-pressed", "role", "_top"):
    assert label in views, f"missing map-toggle contract: {label}"
for source in ('"/tithe-h3/"', '"/chubut-h3/"', '"/terrain/"', '"/argentina-3d/"'):
    assert source in views, f"missing map route: {source}"
# 2.1.0 (owner WhatsApp 10:23 GMT 8 Nov 2026): a collapsed bar, a third button opens/closes the maps, nothing framed while closed
for label in ("aria-expanded", "aria-controls", "cwv-exp", "cwv-area", 'setAttribute("data-open", "false")'):
    assert label in views, f"missing collapsed-bar contract: {label}"
assert 'block.getAttribute("data-open") === "true") load(p)' in views, "a closed bar frames no map"
assert 'argentina: { map2d: "/chubut-h3/", map3d: "/argentina-3d/" }' in views, "Patagonia has its own 3D world"
assert 'if (!region) return;' in views, "the Online modal carries no map"
assert "/wales/terrain/" not in views, "the 3D map frames the bare webapp, not a section copy of a full page"
assert "window.top.location" in views, "a tile leaves the modal for the top window"
assert "allow" in views and "microphone" in views, "the 3D frame may use the microphone (voice)"
for chrome in (".cw-slotnav", ".cedwyn-area-shortcut", "#ghf-agent-footer", "#cedwyn-guestbook", "cw-framed"):
    assert chrome in runtime, f"runtime.js must hide {chrome} in a frame"
assert re.search(r"window\\.self\\s*!==\\s*window\\.top", runtime)
assert halves.count('target="_top"') >= 2, "modal tiles carry target=_top"
assert "f'/{section}/{tid}/'" not in halves, "modal tiles open at the webapp's own address"
print("landing map-view checks passed: 2D/3D inside the Wales and Patagonia modals, none in Online, frames bare, tiles top-level")

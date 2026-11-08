/* Landing place modals: one map block (2D / 3D toggle) drawn inside the modal, above the place's own webapp tiles.
   2.1.0 (8 Nov 2026, owner WhatsApp 10:23 GMT: "the 2d/3d map toggle needs to be a collapsed bar. With a third toggle to expand/
   collapse the maps. On both wales and argentina page areas"; cedwyn#528): the block is one slim bar, collapsed by default:
   2D map | 3D map | Show maps. The third button (aria-expanded) opens and closes the map area; 2D/3D switch the view (and open it
   when closed). Nothing is framed until the area is open and that view is chosen, so a closed bar loads no map. 3D: Wales =
   Wales in 3D (LiDAR terrain, served at /terrain/), Patagonia = Great House II in 3D (/argentina-3d/), each its own world.
   2.0.0 (3 Nov 2026, owner WhatsApp 18:52 GMT): the Wales and Patagonia modals show only their own webapps plus a 2D/3D map inside the
   modal; Online shows webapps only. 2D: Wales = Tithe H3 (/tithe-h3/), Patagonia = Chubut H3 (/chubut-h3/). 3D: the estate scene with
   voice (/terrain/, "Start call" then speak) in both. Each map is framed bare: runtime.js 17 hides every piece of site chrome in a frame,
   so the map shows once, with no second header. A tapped webapp tile leaves the modal and opens at its own address in the top window.
   Replaces 1.0.0 (Tiles / 2D Map / 3D Map tabs that repeated every tile, a parcel-shape sketch and a framed full page). - Cedwyn editors 
   2.2.0 (8 Nov 2026, owner WhatsApp 19:41 GMT: "No text above or below the 3d and 2d map in the modal popup when I select wales or
   patagonia. And all the image icons for wales do not look like wireframe holograms as they should"): in the Wales and Patagonia
   modals the place title and the section headings are kept for screen readers only, the caption, hint and "Open full screen" line under
   each map is gone, so only the 2D/3D bar, the map and the close control show; Wales tiles load the line-drawn hologram set (?v=5).
   */
(function () {
  "use strict";
  var MAPS = {
    wales: { map2d: "/tithe-h3/", map3d: "/terrain/" },
    argentina: { map2d: "/chubut-h3/", map3d: "/argentina-3d/" }
  };
  var COPY = {
    en: { map2d: "2D map", map3d: "3D map", open: "Open full screen", group: "Map view",
          t2wales: "Tithe H3 map of the estate fields", t2argentina: "Chubut H3 map: the estate outline at the same distance from the sea",
          show: "Show maps", hide: "Hide maps",
          t3wales: "Llandough and Leckwith in 3D on LiDAR terrain", t3argentina: "Tŷ Mawr (Great House) in 3D on the Patagonian steppe",
          hint3: "Drag to look around, pinch to zoom." },
    cy: { map2d: "Map 2D", map3d: "Map 3D", open: "Agor ar y sgrin lawn", group: "Golwg map",
          t2wales: "Map H3 y degwm o gaeau’r ystâd", t2argentina: "Map H3 Chubut: amlinell yr ystâd yr un pellter o’r môr",
          show: "Dangos mapiau", hide: "Cuddio mapiau",
          t3wales: "Llandochau a Lecwydd mewn 3D ar dir LiDAR", t3argentina: "Tŷ Mawr mewn 3D ar baith Patagonia",
          hint3: "Llusgwch i edrych o gwmpas, pinsiwch i chwyddo." },
    es: { map2d: "Mapa 2D", map3d: "Mapa 3D", open: "Abrir en pantalla completa", group: "Vista del mapa",
          t2wales: "Mapa H3 del diezmo de los campos de la finca", t2argentina: "Mapa H3 de Chubut: el contorno de la finca a la misma distancia del mar",
          show: "Mostrar mapas", hide: "Ocultar mapas",
          t3wales: "Llandough y Leckwith en 3D sobre terreno LiDAR", t3argentina: "Tŷ Mawr (la Casa Grande) en 3D en la estepa patagónica",
          hint3: "Arrastre para mirar alrededor, pellizque para ampliar." }
  };
  var initialized = false;
  function lang() {
    var value = document.documentElement.getAttribute("lang") || window.__cedwynLang || "en";
    value = String(value).slice(0, 2).toLowerCase();
    return COPY[value] ? value : "en";
  }
  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }
  function addStyle() {
    if (document.getElementById("cedwyn-landing-map-views-style")) return;
    var style = el("style"); style.id = "cedwyn-landing-map-views-style";
    style.textContent =
      ".cwv-map{margin:0 0 16px}.cwv-toggle{display:flex;gap:4px;margin:0;padding:4px;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:#0b1114}" +
      ".cwv-map.cwv-open-area .cwv-toggle{margin:0 0 8px}.cwv-toggle .cwv-exp{flex:0 0 auto;background:transparent;border-color:transparent}" +
      ".cwv-toggle button:focus-visible{outline:2px solid #0F9DF0;outline-offset:2px}.cwv-area[hidden]{display:none!important}" +
      ".cwv-toggle button{flex:1;min-height:36px;padding:6px 10px;border:1px solid rgba(255,255,255,.24);border-radius:999px;background:#121a23;color:#f3f5f7;font:600 13px/1.2 Barlow,system-ui,sans-serif;cursor:pointer}" +
      ".cwv-toggle button[aria-pressed=true]{background:#f3f5f7;color:#101820;border-color:#f3f5f7}" +
      ".cwv-pane[hidden]{display:none!important}.cwv-frame{display:block;width:100%;height:min(60vh,620px);min-height:320px;border:1px solid rgba(255,255,255,.18);border-radius:11px;background:#0b1114}" +
      ".cwv-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:6px 10px;margin:6px 2px 0;color:#c3cec7;font:500 12px/1.4 system-ui,sans-serif}" +
      ".cwv-open{display:inline-flex;padding:8px 12px;border:1px solid rgba(255,255,255,.3);border-radius:999px;color:#fff;text-decoration:none;font:600 12px/1.2 system-ui,sans-serif}" +
      "@media(max-width:680px){.cwv-frame{height:52vh;min-height:300px}}" +
      ".cwv-bare .land-modal-head{justify-content:flex-end;padding:8px 10px;border-bottom:0;background:transparent}" +
      ".cwv-bare .land-modal-head h2,.cwv-bare .land-app-section>h3,.cwv-bar{position:absolute!important;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}" +
      ".cwv-bare .land-modal-content{padding-top:2px}.cwv-bare .land-app-section{margin-bottom:12px}" +
      "#modal-wales .land-app>img{background:#00182b}#modal-wales .land-app>img[src$='.svg?v=1'],#modal-wales .land-app>img[src*='.svg']{filter:grayscale(1) sepia(1) hue-rotate(160deg) saturate(4) brightness(.85) contrast(1.2)}";
    document.head.appendChild(style);
  }
  function words() { return COPY[lang()]; }
  function relabel(block, region) {
    var w = words();
    Array.prototype.forEach.call(block.querySelectorAll("[data-cwv]"), function (node) {
      var key = node.getAttribute("data-cwv");
      if (key === "t2" || key === "t3") key = key + region;
      if (key === "exp") key = block.getAttribute("data-open") === "true" ? "hide" : "show";
      if (w[key]) node.textContent = w[key] + (node.getAttribute("data-cwv") === "exp" ? (block.getAttribute("data-open") === "true" ? " \u25B4" : " \u25BE") : "");
    });
    Array.prototype.forEach.call(block.querySelectorAll("iframe[data-cwv-title]"), function (frame) {
      var key = frame.getAttribute("data-cwv-title"); key = key + region;
      frame.setAttribute("title", w[key] || "");
    });
    block.setAttribute("aria-label", w.group);
  }
  function pane(mode, region) {
    var path = MAPS[region][mode], box = el("div", "cwv-pane"); box.setAttribute("data-mode", mode);
    var frame = el("iframe", "cwv-frame");
    frame.setAttribute("data-src", path); frame.setAttribute("data-cwv-title", mode === "map2d" ? "t2" : "t3");
    frame.setAttribute("loading", "lazy"); frame.setAttribute("referrerpolicy", "same-origin");
    frame.setAttribute("allow", "microphone; autoplay; fullscreen; xr-spatial-tracking");
    frame.setAttribute("allowfullscreen", "");
    box.appendChild(frame);   // 2.2.0: no caption, hint or "Open full screen" line under the map (owner, 8 Nov 19:41 GMT)
    return box;
  }
  function load(box) {
    var frame = box.querySelector("iframe[data-src]");
    if (frame && !frame.getAttribute("src")) frame.setAttribute("src", frame.getAttribute("data-src"));
  }
  function show(block, mode) {
    Array.prototype.forEach.call(block.querySelectorAll(".cwv-toggle button"), function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === mode ? "true" : "false");
    });
    Array.prototype.forEach.call(block.querySelectorAll(".cwv-pane"), function (p) {
      var on = p.getAttribute("data-mode") === mode; p.hidden = !on; if (on && block.getAttribute("data-open") === "true") load(p);
    });
  }
  function setOpen(block, region, open) {
    block.setAttribute("data-open", open ? "true" : "false");
    block.classList.toggle("cwv-open-area", open);
    var area = block.querySelector(".cwv-area"), exp = block.querySelector(".cwv-exp");
    area.hidden = !open; exp.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) { var p = block.querySelector(".cwv-pane:not([hidden])"); if (p) load(p); }
    relabel(block, region);
  }
  function mapBlock(region) {
    var block = el("section", "cwv-map"); block.setAttribute("role", "group"); block.setAttribute("data-open", "false");
    var toggle = el("div", "cwv-toggle"), areaId = "cwv-area-" + region;
    ["map2d", "map3d"].forEach(function (mode, i) {
      var b = el("button"); b.type = "button"; b.setAttribute("data-mode", mode); b.setAttribute("data-cwv", mode);
      b.setAttribute("aria-pressed", i === 0 ? "true" : "false"); b.setAttribute("aria-controls", areaId);
      b.addEventListener("click", function () { show(block, mode); if (block.getAttribute("data-open") !== "true") setOpen(block, region, true); });
      toggle.appendChild(b);
    });
    var exp = el("button", "cwv-exp"); exp.type = "button"; exp.setAttribute("data-cwv", "exp");
    exp.setAttribute("aria-expanded", "false"); exp.setAttribute("aria-controls", areaId);
    exp.addEventListener("click", function () { setOpen(block, region, block.getAttribute("data-open") !== "true"); });
    toggle.appendChild(exp);
    block.appendChild(toggle);
    var area = el("div", "cwv-area"); area.id = areaId; area.hidden = true;
    var p2 = pane("map2d", region), p3 = pane("map3d", region); p3.hidden = true;
    area.appendChild(p2); area.appendChild(p3); block.appendChild(area);
    relabel(block, region);
    return block;
  }
  function breakOut(dialog) {
    // A webapp tile leaves the modal: top-level navigation to the tile's own address, never inside the modal or a frame.
    Array.prototype.forEach.call(dialog.querySelectorAll("a.land-app[href]"), function (a) {
      a.setAttribute("target", "_top");
      a.addEventListener("click", function (event) {
        if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        try { if (typeof dialog.close === "function") dialog.close(); } catch (e) {}
        try { window.top.location.assign(a.href); } catch (e) { location.assign(a.href); }
      });
    });
  }
  function enhance(dialog) {
    if (dialog.getAttribute("data-cwv-ready") === "true") return;
    var content = dialog.querySelector(".land-modal-content");
    if (!content) return;
    dialog.setAttribute("data-cwv-ready", "true");
    breakOut(dialog);
    var region = dialog.id === "modal-wales" ? "wales" : dialog.id === "modal-argentina" ? "argentina" : "";
    if (!region) return;   // Online: webapps only
    dialog.classList.add("cwv-bare");   // 2.2.0: maps and tiles only, no title or headings on screen
    if (region === "wales") Array.prototype.forEach.call(dialog.querySelectorAll("img[src*='/holo-ghf1-']"), function (img) {
      img.setAttribute("src", img.getAttribute("src").replace(/\?v=\d+$/, "") + "?v=5");   // the line-drawn hologram set
    });
    var block = mapBlock(region);
    content.insertBefore(block, content.firstChild);
    function opened() { if (dialog.hasAttribute("open") && block.getAttribute("data-open") === "true") { var p = block.querySelector(".cwv-pane:not([hidden])"); if (p) load(p); } }
    if (window.MutationObserver) new MutationObserver(opened).observe(dialog, { attributes: true, attributeFilter: ["open"] });
    opened();
    document.addEventListener("ghf-lang-change", function () { relabel(block, region); });
  }
  function init() {
    if (initialized || !document.body || document.body.getAttribute("data-cedwyn-page") !== "landing") return;
    initialized = true; addStyle();
    Array.prototype.forEach.call(document.querySelectorAll(".land-modal"), enhance);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();

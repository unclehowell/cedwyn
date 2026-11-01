/* Landing-page Tiles / 2D / 3D selector views. Geometry is drawn only from the published GeoJSON. */
(function () {
  "use strict";
  var COPY = {
    en: {
      tiles: "Tiles", map2d: "2D Map", map3d: "3D Map", rides: "Webapp rides",
      rideNote: "Schematic app directory, not surveyed locations. A webapp slot is an editorial index, not a historic plot number.",
      boundary: "The complete estate boundary, the requested north-west river line, 59 historic plot polygons and their centres are not georeferenced in this layer. The 1824 Stewart plan (EV-0211) shows the River Ely, but its map image is not registered to modern coordinates. Only the four partial GeoJSON features are drawn.",
      mapLegend: "Wales source shapes only · select a shape for its recorded source notes",
      argentinaMap: "No Argentina-specific estate boundary, river or parcel geometry is registered. Wales shapes are not shown here.",
      noFeatures: "The current GeoJSON returned no polygon features.", geoError: "The published parcel GeoJSON could not be loaded.",
      zoomIn: "Zoom in", zoomOut: "Zoom out", zoomReset: "Reset zoom", feature: "Source feature", confidence: "Confidence", source: "Source note",
      sceneWales: "Existing Wales 3D terrain prototype. Its local game coordinates have not been matched to a verified estate boundary; the River Ely segments are not a surveyed river line. The estate silhouette and north-west river line remain pending georeferencing.",
      sceneArgentina: "No Argentina-specific 3D estate geometry is verified. The Wales scene is not shown here.",
      sceneTitle: "Existing Wales first-person 3D terrain prototype; estate registration pending", openScene: "Open Wales 3D scene",
      slot: "Webapp slot", of: "of", h3: "H3 resolution 11 is a proposal in the Bloculus brief. No H3 index or parcel centre is assigned until source-backed centrepoints are verified.",
      dns: "Parcel-centre subdomains are an interface only; no DNS record is configured."
    },
    cy: {
      tiles: "Teils", map2d: "Map 2D", map3d: "Map 3D", rides: "Reidiau apiau gwe",
      rideNote: "Cyfeiriadur sgematig o apiau, nid lleoliadau arolwg. Mynegai golygyddol yw slot ap gwe, nid rhif llain hanesyddol.",
      boundary: "Nid oes ffin lawn yr ystâd, llinell yr afon yn y gogledd-orllewin, 59 polygon llain hanesyddol na’u canolbwyntiau wedi’u geogyfeirio yn yr haen hon. Mae cynllun Stewart 1824 (EV-0211) yn dangos Afon Elái, ond nid yw delwedd y map wedi’i chofrestru â chyfesurynnau modern. Dim ond y pedair nodwedd GeoJSON rannol a ddangosir.",
      mapLegend: "Siapiau ffynhonnell Cymru yn unig · dewiswch siâp i weld nodiadau ffynhonnell",
      argentinaMap: "Nid oes ffin, afon na geometreg lleiniau benodol i’r Ariannin wedi’i chofrestru. Ni ddangosir siapiau Cymru yma.",
      noFeatures: "Ni ddychwelodd GeoJSON cyfredol unrhyw nodweddion polygon.", geoError: "Nid oedd modd llwytho GeoJSON lleiniau cyhoeddedig.",
      zoomIn: "Chwyddo", zoomOut: "Lleihau", zoomReset: "Ailosod chwyddo", feature: "Nodwedd ffynhonnell", confidence: "Hyder", source: "Nodyn ffynhonnell",
      sceneWales: "Prototeip tirwedd 3D presennol Cymru. Nid yw ei gyfesurynnau gêm lleol wedi’u paru â ffin ystâd wedi’i gwirio; nid llinell arolwg o’r afon yw segmentau Afon Elái. Mae silwét yr ystâd a llinell yr afon yn aros nes cael geogyfeirio.",
      sceneArgentina: "Nid oes geometreg ystâd 3D benodol i’r Ariannin wedi’i gwirio. Ni ddangosir golygfa Cymru yma.",
      sceneTitle: "Prototeip tirwedd 3D presennol Cymru; geogyfeirio’r ystâd yn aros", openScene: "Agor golygfa 3D Cymru",
      slot: "Slot ap gwe", of: "o", h3: "Cynnig yn unig yn y briff Bloculus yw cydraniad H3 11. Ni roddir mynegai H3 na chanol llain nes gwirio canolbwyntiau â ffynhonnell.",
      dns: "Rhyngwyneb yn unig yw is-barthau canol lleiniau; nid oes cofnod DNS wedi’i ffurfweddu."
    },
    es: {
      tiles: "Mosaicos", map2d: "Mapa 2D", map3d: "Mapa 3D", rides: "Atracciones web",
      rideNote: "Directorio esquemático de aplicaciones, no ubicaciones topografiadas. El turno de una aplicación es un índice editorial, no el número histórico de parcela.",
      boundary: "Esta capa no georreferencia el límite completo de la finca, el río del noroeste, los 59 polígonos históricos ni sus centros. El plano Stewart de 1824 (EV-0211) muestra el río Ely, pero su imagen no está registrada con coordenadas modernas. Solo se dibujan las cuatro entidades GeoJSON parciales.",
      mapLegend: "Solo formas de fuentes de Gales · seleccione una forma para ver sus notas de origen",
      argentinaMap: "No hay geometría registrada de límites, río o parcelas específica de Argentina. Aquí no se muestran formas galesas.",
      noFeatures: "El GeoJSON actual no devolvió polígonos.", geoError: "No se pudo cargar el GeoJSON parcelario publicado.",
      zoomIn: "Acercar", zoomOut: "Alejar", zoomReset: "Restablecer zoom", feature: "Elemento de la fuente", confidence: "Confianza", source: "Nota de la fuente",
      sceneWales: "Prototipo de terreno 3D galés existente. Sus coordenadas locales de juego no están vinculadas a un límite verificado de la finca; los segmentos del río Ely no son una línea topográfica. El contorno de la finca y el río del noroeste quedan pendientes de georreferenciación.",
      sceneArgentina: "No hay geometría 3D de la finca argentina verificada. Aquí no se muestra la escena galesa.",
      sceneTitle: "Prototipo de terreno 3D galés existente; georreferenciación pendiente", openScene: "Abrir escena 3D de Gales",
      slot: "Turno de aplicación", of: "de", h3: "La resolución H3 11 es una propuesta del informe Bloculus. No se asignan índices H3 ni centros parcelarios hasta verificar coordenadas de origen.",
      dns: "Los subdominios del centro parcelario son solo una interfaz; no hay registros DNS configurados."
    }
  };
  var initialized = false;
  function lang() {
    var value = (document.documentElement.lang || "en").slice(0, 2).toLowerCase();
    return COPY[value] ? value : "en";
  }
  function el(tag, cls, value) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (value != null) node.textContent = value;
    return node;
  }
  function keyed(node, key) {
    node.setAttribute("data-cwv-text", key);
    node.textContent = COPY[lang()][key];
    return node;
  }
  function updateCopy(root) {
    var words = COPY[lang()];
    Array.prototype.forEach.call(root.querySelectorAll("[data-cwv-text]"), function (node) {
      var key = node.getAttribute("data-cwv-text");
      if (words[key]) node.textContent = words[key];
    });
    Array.prototype.forEach.call(root.querySelectorAll(".cwv-slot"), function (node) {
      node.textContent = words.slot + " " + node.getAttribute("data-slot") + " " + words.of + " " + node.getAttribute("data-of");
    });
    Array.prototype.forEach.call(root.querySelectorAll(".cwv-tabs [role=tab]"), function (node) {
      var key = node.getAttribute("data-cwv-text");
      if (words[key]) node.textContent = words[key];
    });
  }
  function addStyle() {
    if (document.getElementById("cedwyn-landing-map-views-style")) return;
    var style = el("style");
    style.id = "cedwyn-landing-map-views-style";
    style.textContent =
      ".cwv-tabs{position:sticky;top:0;z-index:4;display:flex;gap:7px;padding:8px 0 12px;margin:0 0 12px;background:#0c1117;border-bottom:1px solid rgba(255,255,255,.15)}" +
      ".cwv-tabs button{flex:1;min-height:42px;padding:8px 10px;border:1px solid rgba(255,255,255,.24);border-radius:999px;background:#121a23;color:#f3f5f7;font:600 13px/1.2 Barlow,system-ui,sans-serif;cursor:pointer}" +
      ".cwv-tabs button[aria-selected=true]{background:#f3f5f7;color:#101820;border-color:#f3f5f7}.cwv-panel[hidden]{display:none!important}.cwv-panel{min-height:220px}" +
      ".cwv-map-note{padding:10px 12px;border:1px solid rgba(246,180,14,.45);border-radius:9px;background:rgba(91,67,13,.24);color:#f4dfaa;font-size:13px;line-height:1.5;margin:8px 0}" +
      ".cwv-map-layout{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(250px,.85fr);gap:14px;align-items:start;margin:12px 0}" +
      ".cwv-map-frame{min-width:0;padding:10px;border:1px solid rgba(255,255,255,.15);border-radius:12px;background:linear-gradient(145deg,#152a22,#0b1411)}" +
      ".cwv-map-tools{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 8px}.cwv-map-tools button{min-height:38px;padding:7px 11px;border:1px solid rgba(255,255,255,.25);border-radius:8px;background:#121a23;color:#f3f5f7;font:600 12px/1.2 system-ui,sans-serif;cursor:pointer}" +
      ".cwv-map-svg{display:block;width:100%;height:auto;min-height:260px;border-radius:8px;background:#08110e}.cwv-map-svg path{fill:rgba(61,255,168,.26);stroke:#3dffa8;stroke-width:2;vector-effect:non-scaling-stroke;fill-rule:evenodd;cursor:pointer}.cwv-map-svg path[data-confidence=estimated]{fill:rgba(255,190,70,.25);stroke:#ffbf55;stroke-dasharray:7 5}.cwv-feature-info{min-height:44px;margin-top:8px;padding:8px 10px;border-left:3px solid #3dffa8;background:#101b16;font-size:13px;overflow-wrap:anywhere}.cwv-legend{color:#b8c6bf;font-size:12px;margin:6px 2px}" +
      ".cwv-rides{min-width:0}.cwv-rides h3{margin:2px 0 6px}.cwv-rides-note{color:#b8c6bf;font-size:12px;margin:0 0 8px}.cwv-ride-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:8px}.cwv-ride-grid .land-app{min-height:68px}.cwv-slot{display:block;margin-top:4px;color:#c9d4ce;font-size:10px;font-weight:500;letter-spacing:.02em}" +
      ".cwv-status{margin:9px 0;color:#c3cec7;font-size:12px;line-height:1.45}.cwv-frame{display:block;width:100%;height:min(68vh,620px);min-height:340px;border:1px solid rgba(255,255,255,.18);border-radius:11px;background:#0b1114}.cwv-open{display:inline-flex;margin:8px 0;padding:9px 13px;border:1px solid rgba(255,255,255,.3);border-radius:999px;color:#fff;text-decoration:none;font:600 12px/1.2 system-ui,sans-serif}" +
      "@media(max-width:680px){.cwv-map-layout{grid-template-columns:1fr}.cwv-tabs{gap:5px}.cwv-tabs button{padding:8px 5px;font-size:12px}.cwv-map-svg{min-height:220px}.cwv-frame{min-height:300px;height:58vh}}" +
      "@media(prefers-reduced-motion:reduce){.cwv-panel *{scroll-behavior:auto!important;transition:none!important}}";
    document.head.appendChild(style);
  }
  function featureRings(geometry) {
    if (!geometry) return [];
    if (geometry.type === "Polygon") return geometry.coordinates || [];
    if (geometry.type === "MultiPolygon") {
      var out = [];
      (geometry.coordinates || []).forEach(function (polygon) { (polygon || []).forEach(function (ring) { out.push(ring); }); });
      return out;
    }
    return [];
  }
  function paintFeatures(svg, collection, detail) {
    var features = collection && collection.features ? collection.features.filter(function (feature) { return featureRings(feature.geometry).length; }) : [];
    var points = [];
    features.forEach(function (feature) {
      featureRings(feature.geometry).forEach(function (ring) {
        (ring || []).forEach(function (point) {
          if (point && isFinite(point[0]) && isFinite(point[1])) points.push(point);
        });
      });
    });
    if (!points.length) return 0;
    var lat0 = points.reduce(function (sum, point) { return sum + point[1]; }, 0) / points.length;
    var cosine = Math.cos(lat0 * Math.PI / 180);
    var xs = points.map(function (point) { return point[0] * cosine; });
    var ys = points.map(function (point) { return point[1]; });
    var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
    var minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
    var width = Math.max(maxX - minX, 1e-9), height = Math.max(maxY - minY, 1e-9);
    var scale = Math.min(740 / width, 440 / height), padX = (800 - width * scale) / 2, padY = (500 - height * scale) / 2;
    features.forEach(function (feature) {
      var pathData = "";
      featureRings(feature.geometry).forEach(function (ring) {
        (ring || []).forEach(function (point, index) {
          var x = padX + (point[0] * cosine - minX) * scale;
          var y = 500 - (padY + (point[1] - minY) * scale);
          pathData += (index ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1) + " ";
        });
        pathData += "Z ";
      });
      var properties = feature.properties || {};
      var shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
      shape.setAttribute("d", pathData);
      shape.setAttribute("data-confidence", properties.confidence || "unknown");
      shape.setAttribute("tabindex", "0");
      shape.setAttribute("role", "button");
      shape.setAttribute("aria-label", properties.name || properties.id || COPY[lang()].feature);
      var title = document.createElementNS("http://www.w3.org/2000/svg", "title");
      title.textContent = properties.name || properties.id || COPY[lang()].feature;
      shape.appendChild(title);
      function show() {
        var words = COPY[lang()];
        detail.replaceChildren();
        var name = el("strong", "", properties.name || properties.id || words.feature);
        detail.appendChild(name);
        var confidence = el("div", "", words.confidence + ": " + (properties.confidence || "not stated"));
        detail.appendChild(confidence);
        if (properties.conf_text) detail.appendChild(el("div", "", properties.conf_text));
        if (properties.os) detail.appendChild(el("div", "", words.source + ": " + properties.os));
        if (properties.src) detail.appendChild(el("div", "", words.source + ": " + (Array.isArray(properties.src) ? properties.src.join(", ") : properties.src)));
      }
      shape.addEventListener("click", show);
      shape.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); show(); }
      });
      svg.appendChild(shape);
    });
    return features.length;
  }
  function sourceMap(region) {
    var words = COPY[lang()];
    var box = el("div", "cwv-map-frame");
    box.appendChild(keyed(el("p", "cwv-map-note"), "boundary"));
    if (region !== "wales") {
      box.appendChild(keyed(el("p", "cwv-map-note", words.argentinaMap), "argentinaMap"));
      return box;
    }
    box.appendChild(keyed(el("p", "cwv-legend"), "mapLegend"));
    var tools = el("div", "cwv-map-tools");
    var zoomIn = keyed(el("button", "", "＋"), "zoomIn"); zoomIn.setAttribute("type", "button");
    var zoomOut = keyed(el("button", "", "－"), "zoomOut"); zoomOut.setAttribute("type", "button");
    var reset = keyed(el("button", "", "1:1"), "zoomReset"); reset.setAttribute("type", "button");
    tools.appendChild(zoomIn); tools.appendChild(zoomOut); tools.appendChild(reset); box.appendChild(tools);
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "cwv-map-svg"); svg.setAttribute("viewBox", "0 0 800 500");
    svg.setAttribute("role", "img"); svg.setAttribute("aria-label", words.mapLegend); box.appendChild(svg);
    var detail = el("div", "cwv-feature-info", words.mapLegend); detail.setAttribute("aria-live", "polite"); box.appendChild(detail);
    var zoom = 1;
    function setZoom() {
      var width = 800 / zoom, height = 500 / zoom;
      svg.setAttribute("viewBox", ((800 - width) / 2) + " " + ((500 - height) / 2) + " " + width + " " + height);
    }
    zoomIn.addEventListener("click", function () { zoom = Math.min(4, zoom * 1.25); setZoom(); });
    zoomOut.addEventListener("click", function () { zoom = Math.max(.65, zoom / 1.25); setZoom(); });
    reset.addEventListener("click", function () { zoom = 1; setZoom(); });
    fetch("/maps/data/parcels.geojson", { credentials: "same-origin" }).then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    }).then(function (collection) {
      if (!paintFeatures(svg, collection, detail)) detail.textContent = COPY[lang()].noFeatures;
    }).catch(function () { detail.textContent = COPY[lang()].geoError; });
    return box;
  }
  function areaMatch(pathname, area, region) {
    var prefix = "/" + region + "/";
    if (pathname.indexOf(prefix) === 0) pathname = "/" + pathname.slice(prefix.length);
    var paths = [area.path].concat(area.aliases || []);
    return paths.indexOf(pathname) !== -1;
  }
  function addRides(container, tilePanel, region) {
    var words = COPY[lang()];
    var heading = keyed(el("h3"), "rides"); container.appendChild(heading);
    container.appendChild(keyed(el("p", "cwv-rides-note"), "rideNote"));
    var grid = el("div", "cwv-ride-grid"); container.appendChild(grid);
    var links = Array.prototype.slice.call(tilePanel.querySelectorAll("a.land-app[href]"));
    if (!links.length) { grid.appendChild(el("p", "", "No app links were found in the current tile view.")); return; }
    fetch("/areas.json", { credentials: "same-origin" }).then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    }).then(function (registry) {
      var areas = registry.areas || [];
      links.forEach(function (link) {
        var card = link.cloneNode(true);
        card.classList.add("cwv-ride");
        var target = new URL(link.href, location.href).pathname;
        var match = areas.filter(function (area) { return areaMatch(target, area, region); })[0];
        if (match && match.slot != null) {
          var label = card.querySelector(".land-app-label") || card;
          var badge = el("small", "cwv-slot"); badge.setAttribute("data-slot", match.slot);
          badge.setAttribute("data-of", match.of || registry.parcel_total || 59);
          badge.textContent = COPY[lang()].slot + " " + match.slot + " " + COPY[lang()].of + " " + (match.of || registry.parcel_total || 59);
          label.appendChild(badge);
        }
        grid.appendChild(card);
      });
      updateCopy(container);
    }).catch(function () {
      links.forEach(function (link) { var card = link.cloneNode(true); card.classList.add("cwv-ride"); grid.appendChild(card); });
    });
  }
  function statusNotes(panel) {
    panel.appendChild(keyed(el("p", "cwv-status"), "h3"));
    panel.appendChild(keyed(el("p", "cwv-status"), "dns"));
  }
  function buildPanel(panel, tilePanel, region, mode) {
    if (panel.getAttribute("data-built") === "true") return;
    panel.setAttribute("data-built", "true");
    var words = COPY[lang()];
    if (mode === "map2d") {
      var layout = el("div", "cwv-map-layout");
      layout.appendChild(sourceMap(region));
      var rides = el("section", "cwv-rides"); addRides(rides, tilePanel, region); layout.appendChild(rides);
      panel.appendChild(layout); statusNotes(panel); return;
    }
    if (region === "wales") {
      panel.appendChild(keyed(el("p", "cwv-map-note"), "sceneWales"));
      var frame = el("iframe", "cwv-frame"); frame.setAttribute("title", words.sceneTitle);
      frame.setAttribute("loading", "lazy"); frame.setAttribute("referrerpolicy", "same-origin");
      frame.setAttribute("data-src", "/wales/terrain/"); panel.appendChild(frame);
      var open = el("a", "cwv-open", words.openScene); open.href = "/wales/terrain/"; panel.appendChild(open);
    } else {
      panel.appendChild(keyed(el("p", "cwv-map-note"), "sceneArgentina"));
    }
    var appRides = el("section", "cwv-rides"); addRides(appRides, tilePanel, region); panel.appendChild(appRides);
    statusNotes(panel);
  }
  function activate(dialog, tilePanel, panels, tabs, region, index) {
    Array.prototype.forEach.call(tabs, function (tab, i) {
      tab.setAttribute("aria-selected", i === index ? "true" : "false");
      tab.tabIndex = i === index ? 0 : -1;
    });
    Array.prototype.forEach.call(panels, function (panel, i) { panel.hidden = i !== index; });
    if (index > 0) {
      var mode = index === 1 ? "map2d" : "map3d";
      buildPanel(panels[index], tilePanel, region, mode);
      var frame = panels[index].querySelector("iframe[data-src]");
      if (frame && !frame.getAttribute("src")) frame.setAttribute("src", frame.getAttribute("data-src"));
    }
    updateCopy(dialog);
  }
  function enhance(dialog) {
    if (dialog.getAttribute("data-cwv-ready") === "true") return;
    var content = dialog.querySelector(".land-modal-content");
    if (!content) return;
    dialog.setAttribute("data-cwv-ready", "true");
    var region = dialog.id === "modal-argentina" ? "argentina" : "wales";
    var tilePanel = el("section", "cwv-panel"); tilePanel.setAttribute("role", "tabpanel");
    tilePanel.setAttribute("aria-label", COPY[lang()].tiles);
    while (content.firstChild) tilePanel.appendChild(content.firstChild);
    var mapPanel = el("section", "cwv-panel"); mapPanel.hidden = true; mapPanel.setAttribute("role", "tabpanel");
    var threePanel = el("section", "cwv-panel"); threePanel.hidden = true; threePanel.setAttribute("role", "tabpanel");
    var labels = ["tiles", "map2d", "map3d"], panels = [tilePanel, mapPanel, threePanel];
    var tabs = el("div", "cwv-tabs"); tabs.setAttribute("role", "tablist"); tabs.setAttribute("aria-label", "Webapp selector view");
    labels.forEach(function (key, index) {
      var button = keyed(el("button"), key); button.type = "button"; button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", index === 0 ? "true" : "false"); button.tabIndex = index === 0 ? 0 : -1;
      button.addEventListener("click", function () { activate(dialog, tilePanel, panels, tabs.children, region, index); });
      button.addEventListener("keydown", function (event) {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault(); var next = (index + (event.key === "ArrowRight" ? 1 : 2)) % 3;
          tabs.children[next].focus(); tabs.children[next].click();
        }
      });
      tabs.appendChild(button);
    });
    content.appendChild(tabs); content.appendChild(tilePanel); content.appendChild(mapPanel); content.appendChild(threePanel);
    dialog.addEventListener("ghf-lang-change", function () { updateCopy(dialog); });
    document.addEventListener("ghf-lang-change", function () { updateCopy(dialog); });
    updateCopy(dialog);
  }
  function init() {
    if (initialized || !document.body || document.body.getAttribute("data-cedwyn-page") !== "landing") return;
    initialized = true; addStyle();
    Array.prototype.forEach.call(document.querySelectorAll(".land-modal"), enhance);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();

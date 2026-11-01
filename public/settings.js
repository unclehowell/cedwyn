/* Cedwyn display settings 1.0.0 (1 Nov 2026) — Cedwyn editors
   The store: localStorage on this origin, the same keys every page reads before its first paint (ghf-boot.js 2.1.20+):
     ghf-theme   "day" | "night"  (absent = follow the device)   + cookie ghf_theme for the bucklerfamily.estate sites
     cedwyn-font "arial" | "verdana" | "georgia" | "times" | "system" | "mono"  (absent = Cedwyn's Barlow)
     cedwyn-size "s" | "l" | "xl"  (absent = normal)
   Other open tabs pick a change up at once through the storage event. Spec: docs/THEME-SETTINGS.md */
(function () {
  var d = document, de = d.documentElement, LS = window.localStorage;
  var T = {
    en: { title: "Display settings", lead: "Pick how every page of Cedwyn looks to you. Your choice is kept in this browser and applies to every section as you move through the site.", theme: "Light or dark", t_system: "Follow my device", t_system_n: "Light by day, dark at night, as your phone or computer is set", t_day: "Light", t_day_n: "Dark text on a pale page", t_night: "Dark", t_night_n: "Light text on a black page", font: "Font", f_default: "Cedwyn (Barlow)", f_system: "My device’s font", f_mono: "Typewriter", size: "Text size", z_s: "Smaller", z_m: "Normal", z_l: "Larger", z_xl: "Largest", preview: "Preview", sample: "Tŷ Mawr, the Great House of Llandough, stands beside the church of St Dochdwy. The earliest record found that names the house is the survey of 1824.", reset: "Back to the standard look", note: "Kept in this browser only (local storage on this site). Nothing is sent anywhere, and no account is needed. Clearing your browser data resets it.", saved: "Saved. Every page now uses this.", cleared: "Back to the standard look." },
    cy: { title: "Gosodiadau dangos", lead: "Dewiswch sut mae pob tudalen o Cedwyn yn edrych i chi. Caiff eich dewis ei gadw yn y porwr hwn ac mae’n berthnasol i bob adran wrth i chi symud drwy’r wefan.", theme: "Golau neu dywyll", t_system: "Dilyn fy nyfais", t_system_n: "Golau yn y dydd, tywyll yn y nos, fel y mae eich ffôn neu gyfrifiadur wedi’i osod", t_day: "Golau", t_day_n: "Testun tywyll ar dudalen olau", t_night: "Tywyll", t_night_n: "Testun golau ar dudalen ddu", font: "Ffont", f_default: "Cedwyn (Barlow)", f_system: "Ffont fy nyfais", f_mono: "Teipiadur", size: "Maint y testun", z_s: "Llai", z_m: "Arferol", z_l: "Mwy", z_xl: "Mwyaf", preview: "Rhagolwg", sample: "Saif Tŷ Mawr, Tŷ Mawr Llandochau, ger eglwys Sant Dochdwy. Arolwg 1824 yw’r cofnod cynharaf a gafwyd sy’n enwi’r tŷ.", reset: "Yn ôl i’r olwg arferol", note: "Wedi’i gadw yn y porwr hwn yn unig (storfa leol ar y wefan hon). Ni anfonir dim i unman, ac nid oes angen cyfrif. Mae clirio data eich porwr yn ei ailosod.", saved: "Wedi’i gadw. Mae pob tudalen yn defnyddio hyn nawr.", cleared: "Yn ôl i’r olwg arferol." },
    es: { title: "Ajustes de visualización", lead: "Elija cómo se ve cada página de Cedwyn. Su elección se guarda en este navegador y se aplica a todas las secciones mientras recorre el sitio.", theme: "Claro u oscuro", t_system: "Seguir mi dispositivo", t_system_n: "Claro de día, oscuro de noche, según su teléfono u ordenador", t_day: "Claro", t_day_n: "Texto oscuro sobre página clara", t_night: "Oscuro", t_night_n: "Texto claro sobre página negra", font: "Tipo de letra", f_default: "Cedwyn (Barlow)", f_system: "La letra de mi dispositivo", f_mono: "Máquina de escribir", size: "Tamaño del texto", z_s: "Más pequeño", z_m: "Normal", z_l: "Más grande", z_xl: "El más grande", preview: "Vista previa", sample: "Tŷ Mawr, la Casa Grande de Llandough, se alza junto a la iglesia de San Dochdwy. El registro más antiguo hallado que nombra la casa es el levantamiento de 1824.", reset: "Volver al aspecto estándar", note: "Se guarda solo en este navegador (almacenamiento local de este sitio). No se envía nada a ningún sitio y no hace falta cuenta. Borrar los datos del navegador lo restablece.", saved: "Guardado. Todas las páginas lo usan ahora.", cleared: "De vuelta al aspecto estándar." }
  };
  function lang() { var l = ""; try { l = LS.getItem("ghf_lang") || ""; } catch (e) {} l = (l || de.getAttribute("lang") || "en").slice(0, 2).toLowerCase(); return T[l] ? l : "en"; }
  function tr() { var t = T[lang()], q = d.querySelectorAll("[data-t]"); for (var i = 0; i < q.length; i++) { var k = q[i].getAttribute("data-t"); if (t[k]) q[i].textContent = t[k]; } d.title = t.title + " · Cedwyn"; }
  function get(k) { try { return LS.getItem(k); } catch (e) { return null; } }
  function put(k, v) { try { if (v == null) LS.removeItem(k); else LS.setItem(k, v); } catch (e) {} }
  function cookie(v) { // the header's own toggle also keeps the choice in a cookie shared by the bucklerfamily.estate sites
    var dom = /(^|\.)bucklerfamily\.estate$/.test(location.hostname) ? "; domain=.bucklerfamily.estate" : "";
    try { d.cookie = "ghf_theme=" + (v || "") + "; path=/; SameSite=Lax; Secure" + (v ? "; max-age=31536000" : "; max-age=0") + dom; } catch (e) {}
  }
  function deviceMode() { try { if (matchMedia("(prefers-color-scheme: dark)").matches) return "night"; if (matchMedia("(prefers-color-scheme: light)").matches) return "day"; } catch (e) {} var h = new Date().getHours(); return h >= 7 && h < 19 ? "day" : "night"; }
  function showMode() { // this page draws both schemes itself; the header follows the same attribute
    var t = get("ghf-theme"), m = t === "day" || t === "night" ? t : deviceMode();
    de.setAttribute("data-ghf-mode", m); de.setAttribute("data-ghf-scheme", m === "day" ? "light" : "dark"); de.style.colorScheme = m === "day" ? "light" : "dark";
    var mt = d.querySelector('meta[name="theme-color"]'); if (mt) mt.content = m === "day" ? "#f7f2e7" : "#000000";
    try { d.dispatchEvent(new CustomEvent("ghf-theme-change", { detail: { mode: m, native: "auto" } })); } catch (e) {}
  }
  function applyAll() { if (window.CedwynPrefs) window.CedwynPrefs.apply(); else localApply(); showMode(); }
  function localApply() { // fallback when the shared loader has not run (a preview copy of this page)
    var F = { arial: "Arial,Helvetica,sans-serif", verdana: "Verdana,Geneva,sans-serif", georgia: "Georgia,serif", times: "'Times New Roman',Times,serif", system: "system-ui,-apple-system,sans-serif", mono: "ui-monospace,Menlo,monospace" };
    var Z = { s: 0.9, l: 1.15, xl: 1.3 }, f = get("cedwyn-font"), z = get("cedwyn-size");
    d.body.style.fontFamily = F[f] || ""; var w = d.getElementById("settings-main"); if (w) w.style.zoom = Z[z] || "";
  }
  function mark() {
    var t = get("ghf-theme"), f = get("cedwyn-font"), z = get("cedwyn-size");
    var want = { theme: t === "day" || t === "night" ? t : "system", font: f || "default", size: z || "m" };
    for (var n in want) { var q = d.querySelectorAll('input[name="' + n + '"]'); for (var i = 0; i < q.length; i++) q[i].checked = q[i].value === want[n]; }
  }
  var st = d.getElementById("ts-status"), tm = 0;
  function say(k) { if (!st) return; st.textContent = T[lang()][k]; clearTimeout(tm); tm = setTimeout(function () { st.textContent = ""; }, 4000); }
  d.addEventListener("change", function (ev) {
    var el = ev.target; if (!el || el.type !== "radio") return;
    if (el.name === "theme") { var v = el.value === "system" ? null : el.value; put("ghf-theme", v); cookie(v); }
    else if (el.name === "font") put("cedwyn-font", el.value === "default" ? null : el.value);
    else if (el.name === "size") put("cedwyn-size", el.value === "m" ? null : el.value);
    applyAll(); say("saved");
  });
  var rb = d.getElementById("ts-reset");
  if (rb) rb.addEventListener("click", function () { put("ghf-theme", null); cookie(null); put("cedwyn-font", null); put("cedwyn-size", null); applyAll(); mark(); say("cleared"); });
  window.addEventListener("storage", function (ev) { if (/^(ghf-theme|cedwyn-font|cedwyn-size)$/.test(ev.key || "")) { mark(); showMode(); } });
  d.addEventListener("ghf-lang-change", tr);
  tr(); mark(); if (!window.CedwynPrefs) localApply();
})();

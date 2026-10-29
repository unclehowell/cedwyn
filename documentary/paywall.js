/* Cedwyn · documentary — version pop-up for locked scenes only (paywall.js v1.1.0). A tab.bot production.
   v1.1.0 (29 Oct 2026): billing follows semantic versions (documentary.js v1.4.0). Scenes in v0.0.1 (Scenes 1 and 2) are
   free and play straight away: no pop-up, no checkout. Only a scene whose version is not open on this device opens this
   dialog; it names that scene's own version and price (+£4.99 per version after v0.0.1), and Proceed goes to checkout
   for the next version step. Nothing here ever plays a different scene. After checkout the page returns with the new
   version open and plays that version's first scene.
   v1.0.2: a paid scene pre-selected v0.0.2. v1.0.1: the free path played the pressed scene. v1.0.0: first version. */
(function () {
  "use strict";
  var DLG = null, want = null, bypass = false;
  function D() { return window.CedwynDoc; }
  function css() {
    var s = document.createElement("style");
    s.textContent = "#cd-dlg{max-width:min(92vw,420px);width:100%;border:0;border-radius:14px;padding:20px;background:#fffdf7;color:#1d1d1b;box-shadow:0 10px 40px rgba(0,0,0,.35);font:16px/1.4 system-ui,sans-serif}" +
      "#cd-dlg::backdrop{background:rgba(0,0,0,.6)}#cd-dlg h2{margin:0 0 10px;font-size:1.2rem}" +
      "#cd-dlg ol.cd-lad{list-style:none;padding:0;margin:8px 0}#cd-dlg ol.cd-lad li{display:flex;justify-content:space-between;gap:10px;min-height:44px;align-items:center;padding:6px 12px;margin:6px 0;border:2px solid #ccc5b5;border-radius:10px}" +
      "#cd-dlg ol.cd-lad li.on{border-color:#8a1c1c;background:#f6ece4;font-weight:700}#cd-dlg ol.cd-lad small{display:block;font-weight:400;color:#555}" +
      "#cd-dlg .cd-row{display:flex;gap:10px;justify-content:flex-end;margin-top:10px}#cd-dlg .cd-why{margin:0 0 6px;color:#8a1c1c}" +
      "#cd-dlg button{min-height:48px;min-width:96px;border-radius:10px;font:inherit;cursor:pointer;border:2px solid #8a1c1c}" +
      "#cd-dlg .cd-go{background:#8a1c1c;color:#fff}#cd-dlg .cd-cancel{background:#fff;color:#8a1c1c}#cd-dlg a{color:#8a1c1c}" +
      "#cd-banner{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:9999;background:#1d1d1b;color:#fff;padding:10px 16px;border-radius:10px;font:15px system-ui,sans-serif}";
    document.head.appendChild(s);
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]; }); }
  function make() {
    css(); DLG = document.createElement("dialog"); DLG.id = "cd-dlg"; DLG.setAttribute("aria-labelledby", "cd-dlg-h");
    DLG.innerHTML = '<form method="dialog"><h2 id="cd-dlg-h"></h2><ol class="cd-lad" aria-label="Versions"></ol><p class="cd-why" role="status" aria-live="polite"></p>' +
      '<p style="margin:0 0 6px;font-size:.9rem"><a href="licence/">Licence terms</a> · personal viewing licence, kept on this device</p>' +
      '<div class="cd-row"><button type="button" class="cd-cancel">Cancel</button><button type="button" class="cd-go">Proceed to checkout</button></div></form>';
    document.body.appendChild(DLG);
    DLG.querySelector(".cd-cancel").addEventListener("click", function () { DLG.close(); });
    DLG.querySelector(".cd-go").addEventListener("click", function () { var G = D(); if (G && G.ready && want) { var v = G.verOf(want); if (!G.buy(v)) { DLG.close(); playFrame(want); } } });
    DLG.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return; var f = DLG.querySelectorAll("a,button"), a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    });
  }
  function paint(n) {
    var G = D(), v = G.verOf(n), nb = G.nextBuy(v), lad = DLG.querySelector(".cd-lad"), h = "";
    DLG.querySelector("#cd-dlg-h").textContent = "Scene " + n + " is in v" + v;
    G.asc().forEach(function (x) {
      var st = G.has(x.v) ? "open" : G.priceTxt(x);
      h += '<li data-v="' + esc(x.v) + '"' + (x.v === v ? ' class="on" aria-current="true"' : "") + '><span>v' + esc(x.v) + '<small>' + esc(G.scenesTxt(x)) + '</small></span><span>' + esc(st) + '</span></li>';
    });
    lad.innerHTML = h;
    var step = G.byV(nb ? nb.v : v) || {step: 4.99};
    DLG.querySelector(".cd-why").textContent = nb && nb.v !== v
      ? "Versions open one step at a time, £4.99 each. This checkout opens v" + nb.v + "; v" + v + " is the next step after it."
      : "v0.0.1 (Scenes 1 and 2) is free. Each later version costs £4.99 more. This checkout opens v" + v + ".";
    DLG.querySelector(".cd-go").textContent = "Proceed to checkout · v" + (nb ? nb.v : v) + " · £" + (+step.step || 4.99).toFixed(2);
  }
  function frameOf(btn) { var c = btn && btn.closest && btn.closest("[id^='frame-']"); return c ? +c.id.slice(6) : 0; }
  function playFrame(n) { var b = document.querySelector("#frame-" + n + " .cm-playbig"); if (!b) return false; bypass = true; b.click(); bypass = false; return true; }
  function open(n) {
    if (!DLG) make(); want = n; paint(n);
    if (typeof DLG.showModal === "function") DLG.showModal(); else DLG.setAttribute("open", "");
    DLG.querySelector(".cd-go").focus();
  }
  window.CedwynPay = {open: open, version: "1.1.0"};
  document.addEventListener("click", function (e) {
    if (bypass) return; var b = e.target && e.target.closest && e.target.closest(".cm-playbig"); if (!b) return;
    var G = D(), n = frameOf(b); if (!G || !n || G.canPlay(n)) return;   // free or open: movie.js plays this very scene, no pop-up
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); open(n);
  }, true);
  document.addEventListener("cedwyn-doc-ready", function (e) {   // back from checkout: play the first scene of the version just opened
    var v = e.detail && e.detail.unlocked, G = D(); if (!v || !G) return; var x = G.byV(v); if (!x) return;
    var tries = 0, iv = setInterval(function () { tries++;
      if (document.querySelector("#frame-" + x.frames[0] + " .cm-playbig")) { clearInterval(iv); playFrame(x.frames[0]);
        var bn = document.createElement("div"); bn.id = "cd-banner"; bn.setAttribute("role", "status"); bn.textContent = "Thank you. v" + v + " is open on this device and playing.";
        document.body.appendChild(bn); setTimeout(function () { bn.remove(); }, 8000); }
      else if (tries > 60) clearInterval(iv); }, 250);
  });
})();

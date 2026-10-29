/* Cedwyn · documentary — choose-a-version modal (paywall.js v1.0.2). A tab.bot production.
   v1.0.2 (29 Oct 2026): a scene that is not free (Scene 3 on) never falls back to Scene 1 any more. Before, pressing
   Scene 3's play button opened this dialog with Free pre-selected, and Proceed played Scene 1 ("door 3 is the same as
   scene 1"). Now the pressed scene picks the version: a paid scene pre-selects v0.0.2, the Free option is greyed with a
   line saying which version opens it, and Free + Proceed on a paid scene explains instead of playing another scene.
   v1.0.1 (29 Oct 2026): the free path plays the scene whose button was pressed when it is free (CedwynDoc.free, now Scenes 1 and 2);
   before, Proceed on the free version always played Scene 1, so Scene 2 showed Scene 1 again.
   Pressing a scene's play button first opens a native <dialog>: v0.0.1 Free (the first cut, Scene 1) or v0.0.2 £4.99
   (every scene, under the personal viewing licence). Semantic version nodes sit under the selector; Proceed acts.
   Free: the dialog closes and v0.0.1 plays. Paid: checkout, then back to /documentary/?unlocked=v0.0.2 (or ?unlock=cs_…),
   the newest version is kept open on this device and plays, with the player's Pause/Play control. Esc closes. */
(function () {
  "use strict";
  var GO = "/wayback/go/?u=https%3A%2F%2Fbuy.stripe.com%2FaFa8wQ4xJfyLbCAaAL6Zy0I";
  var K = "cedwyn-doc-choice", OPTS = [
    {v: "0.0.1", price: "Free", note: "Scenes 1 and 2", paid: false},
    {v: "0.0.2", price: "£4.99", note: "Every scene · personal viewing licence", paid: true}];
  var DLG = null, pick = "0.0.1", lastBtn = null, bypass = false;
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }
  function cmp(a, b) { var x = String(a).split("."), y = String(b).split("."); for (var i = 0; i < 3; i++) { var d = (+x[i] || 0) - (+y[i] || 0); if (d) return d; } return 0; }
  function newest() { var D = window.CedwynDoc; return D && D.versions && D.versions[0] ? D.versions[0].v : null; }
  function paidOpen() { var u = ls("cedwyn-doc-unlock"), n = newest(); return ls("cedwyn-doc-v002") === "1" || (!!u && !!n && cmp(u, n) >= 0) || window.CEDWYN_MEMBER === true; }
  function css() {
    var s = document.createElement("style");
    s.textContent = "#cd-dlg{max-width:min(92vw,420px);width:100%;border:0;border-radius:14px;padding:20px;background:#fffdf7;color:#1d1d1b;box-shadow:0 10px 40px rgba(0,0,0,.35);font:16px/1.4 system-ui,sans-serif}" +
      "#cd-dlg::backdrop{background:rgba(0,0,0,.6)}#cd-dlg h2{margin:0 0 12px;font-size:1.2rem}" +
      "#cd-dlg label.cd-o{display:flex;gap:10px;align-items:center;min-height:48px;padding:8px 12px;margin:6px 0;border:2px solid #ccc5b5;border-radius:10px;cursor:pointer}" +
      "#cd-dlg label.cd-o.on{border-color:#8a1c1c;background:#f6ece4}#cd-dlg .cd-o small{display:block;color:#555}" +
      "#cd-dlg ol.cd-nodes{list-style:none;display:flex;align-items:center;padding:0;margin:14px 0}" +
      "#cd-dlg ol.cd-nodes li{display:flex;flex-direction:column;align-items:center;font-size:.85rem;color:#666}" +
      "#cd-dlg ol.cd-nodes li.sep{flex:1;height:2px;background:#ccc5b5;margin:0 6px 18px}" +
      "#cd-dlg .cd-dot{width:16px;height:16px;border-radius:50%;border:2px solid #8a1c1c;background:#fff;margin-bottom:4px}" +
      "#cd-dlg li.on{color:#8a1c1c;font-weight:700}#cd-dlg li.on .cd-dot{background:#8a1c1c}" +
      "#cd-dlg .cd-row{display:flex;gap:10px;justify-content:flex-end;margin-top:10px}" +
      "#cd-dlg button{min-height:48px;min-width:96px;border-radius:10px;font:inherit;cursor:pointer;border:2px solid #8a1c1c}" +
      "#cd-dlg .cd-go{background:#8a1c1c;color:#fff}#cd-dlg .cd-cancel{background:#fff;color:#8a1c1c}" +
      "#cd-banner{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:9999;background:#1d1d1b;color:#fff;padding:10px 16px;border-radius:10px;font:15px system-ui,sans-serif}";
    document.head.appendChild(s);
  }
  function paint() {
    var ls_ = DLG.querySelectorAll("label.cd-o"), nodes = DLG.querySelectorAll("li[data-v]");
    for (var i = 0; i < ls_.length; i++) ls_[i].classList.toggle("on", ls_[i].getAttribute("data-v") === pick);
    for (var j = 0; j < nodes.length; j++) { var on = nodes[j].getAttribute("data-v") === pick; nodes[j].classList.toggle("on", on); if (on) nodes[j].setAttribute("aria-current", "step"); else nodes[j].removeAttribute("aria-current"); }
    var o = OPTS.filter(function (x) { return x.v === pick; })[0];
    DLG.querySelector(".cd-go").textContent = o.paid && !paidOpen() ? "Proceed to checkout" : "Proceed";
    var n = frameOf(lastBtn), fr = isFree(n), fi = DLG.querySelector('input[value="0.0.1"]'), fl = DLG.querySelector('label.cd-o[data-v="0.0.1"]');
    if (fi) fi.disabled = !fr; if (fl) fl.style.opacity = fr ? "" : "0.5";
    DLG.querySelector(".cd-why").textContent = (fr || paidOpen()) ? "" : "Scene " + n + " is not in the free version (Scenes 1 and 2). v0.0.2 opens it.";
  }
  function make() {
    css(); DLG = document.createElement("dialog"); DLG.id = "cd-dlg"; DLG.setAttribute("aria-labelledby", "cd-dlg-h");
    var h = '<form method="dialog"><h2 id="cd-dlg-h">Choose a version</h2><div role="radiogroup" aria-label="Version">';
    OPTS.forEach(function (o) { h += '<label class="cd-o" data-v="' + o.v + '"><input type="radio" name="cd-pick" value="' + o.v + '"' + (o.v === pick ? " checked" : "") + '><span><b>v' + o.v + ' · ' + o.price + '</b><small>' + o.note + '</small></span></label>'; });
    h += '</div><ol class="cd-nodes" aria-label="Version history">';
    OPTS.forEach(function (o, i) { if (i) h += '<li class="sep" aria-hidden="true"></li>'; h += '<li data-v="' + o.v + '"><span class="cd-dot" aria-hidden="true"></span>v' + o.v + '</li>'; });
    h += '</ol><p class="cd-why" role="status" aria-live="polite" style="margin:0 0 6px;color:#8a1c1c"></p><div class="cd-row"><button type="button" class="cd-cancel">Cancel</button><button type="button" class="cd-go">Proceed</button></div></form>';
    DLG.innerHTML = h; document.body.appendChild(DLG);
    DLG.addEventListener("change", function (e) { if (e.target.name === "cd-pick") { pick = e.target.value; paint(); } });
    DLG.querySelector(".cd-cancel").addEventListener("click", function () { DLG.close(); });
    DLG.querySelector(".cd-go").addEventListener("click", proceed);
    DLG.addEventListener("keydown", function (e) {   // keep Tab inside the dialog
      if (e.key !== "Tab") return; var f = DLG.querySelectorAll("input:checked,button"), a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    });
    DLG.addEventListener("close", function () { if (lastBtn && !DLG.returnValue) try { lastBtn.focus(); } catch (e) {} });
  }
  function frameOf(btn) { var c = btn && btn.closest && btn.closest("[id^='frame-']"); return c ? +c.id.slice(6) : 1; }
  function isFree(n) { var D = window.CedwynDoc, fr = (D && D.free) || [1]; return fr.indexOf(n) >= 0; }
  function playFrame(n) { var b = document.querySelector("#frame-" + n + " .cm-playbig"); if (!b) return false; bypass = true; b.click(); bypass = false; return true; }
  function proceed() {
    var o = OPTS.filter(function (x) { return x.v === pick; })[0];
    if (!o.paid) { var n = frameOf(lastBtn);
      if (!isFree(n)) { pick = "0.0.2"; var r2 = DLG.querySelector('input[value="0.0.2"]'); if (r2) { r2.checked = true; r2.focus(); } paint(); return; }   // never play a different scene
      ss(K, "free"); DLG.close(); playFrame(n); return; }
    if (paidOpen()) { ss(K, "paid"); DLG.close(); if (lastBtn) { bypass = true; lastBtn.click(); bypass = false; } return; }
    var n = newest(); if (n) ls("cedwyn-doc-pending", n);
    ls("cedwyn-doc-agreed", new Date().toISOString() + " licence v1.0.0 (v0.0.2 modal)");
    location.href = GO;
  }
  function open(btn) {
    if (!DLG) make(); lastBtn = btn; pick = (paidOpen() || !isFree(frameOf(btn))) ? "0.0.2" : "0.0.1";
    var r = DLG.querySelector('input[value="' + pick + '"]'); if (r) r.checked = true; paint();
    if (typeof DLG.showModal === "function") DLG.showModal(); else DLG.setAttribute("open", "");
    if (r) r.focus();
  }
  document.addEventListener("click", function (e) {
    if (bypass) return; var b = e.target && e.target.closest && e.target.closest(".cm-playbig"); if (!b) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); open(b);
  }, true);
  function back() {   // return from checkout
    var q = new URLSearchParams(location.search), u = q.get("unlocked");
    if (u !== "v0.0.2" && u !== "0.0.2" && !q.has("unlock") && ls("cedwyn-doc-v002-play") !== "1") return;
    if (u) { q.delete("unlocked"); try { history.replaceState(null, "", location.pathname + (q.toString() ? "?" + q : "") + location.hash); } catch (e) {} }
    ls("cedwyn-doc-v002", "1"); ls("cedwyn-doc-v002-play", "1");
    var tries = 0, iv = setInterval(function () {
      var n = newest(); tries++;
      if (n && document.querySelector(".cm-playbig")) {
        clearInterval(iv); ls("cedwyn-doc-unlock", n); ls("cedwyn-doc-sel", n); ss(K, "paid"); ls("cedwyn-doc-v002-play", "0");
        var D = window.CedwynDoc; if (D) { D.sel = n; document.dispatchEvent(new CustomEvent("cedwyn-doc-change")); }
        var bs = document.querySelectorAll(".cm-playbig"), last = bs[bs.length - 1];
        if (last) { bypass = true; last.click(); bypass = false; }
        var bn = document.createElement("div"); bn.id = "cd-banner"; bn.setAttribute("role", "status"); bn.textContent = "Thank you. v0.0.2 is open on this device and playing. Use Pause/Play to control it.";
        document.body.appendChild(bn); setTimeout(function () { bn.remove(); }, 8000);
      } else if (tries > 60) clearInterval(iv);
    }, 250);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", back); else back();
})();

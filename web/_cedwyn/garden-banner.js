/*! garden-banner.js — the one shared Garden banner in the header strip of every Cedwyn webapp · v1.0.0 (2 Nov 2026) · Cedwyn editors
 * Asked for 00:48 GMT 2 Nov 2026: the cross-promo chrome (graph promo strip, section ribbon chips, coming-soon teasers, e-book
 * strips, the "Outside records" popup) is gone; in its place this one banner advertises the Garden (/garden/), every product
 * of the Garden City Cymru shop. It takes over the header's slim strip (.ghf-v2-up, basecamp.js), so it never covers content
 * and the header with its burger menu and "N of 59" number stays exactly as it is.
 * Data: /_cedwyn/garden-banner/products.json (name, handle, sprite tile) + sprite.webp, made from the /garden/ webapp's own
 * database by tools/garden_banner.py. Every link is internal: /garden/ or /garden/#p=<handle> (the Garden opens that product).
 * Off on: the Argentina scope (/argentina/, /patagonia/, html[data-cedwyn-scope=argentina]: no money words, no flowered art
 * there), machine-facing pages (/academy/, /agents/, /hive/), the Garden itself, and framed pages. Spec: docs/GARDEN-BANNER.md */
(function () {
  'use strict';
  if (window.CedwynGardenBanner) return;
  var d = document, de = d.documentElement, VER = '1.0.0';
  window.CedwynGardenBanner = { v: VER };
  var DATA = '/_cedwyn/garden-banner/products.json?v=' + VER;
  var T = {
    en: { lead: 'REALM', sub: 'The Garden', cta: 'Garden', aria: 'The Garden: plants, flowers and gifts from the REALM' },
    cy: { lead: 'REALM', sub: 'Yr Ardd', cta: 'Gardd', aria: 'Yr Ardd: planhigion, blodau ac anrhegion o’r REALM' },
    es: { lead: 'REALM', sub: 'El Jardín', cta: 'Jardín', aria: 'El Jardín: plantas, flores y regalos del REALM' }
  };
  function lg() { var l = ''; try { l = window.__cedwynLang || localStorage.getItem('ghf_lang') || ''; } catch (e) {} l = (l || de.getAttribute('lang') || 'en').slice(0, 2).toLowerCase(); return T[l] ? l : 'en'; }
  function path() { var p = (window.__cedwynLP || location.pathname || '/').toLowerCase(); return p; }
  function off() {
    var p = path(), sc = de.getAttribute('data-cedwyn-scope') || '', sec = de.getAttribute('data-cedwyn-sec') || '';
    if (sc === 'argentina' || sec === 'argentina') return true;
    if (/^\/(argentina|patagonia)(\/|$)/.test(p) || /^\/(wales|argentina)\/patagonia(\/|$)/.test(p)) return true;
    if (/^\/((wales|argentina)\/)?(garden|academy|agents|hive)(\/|$)/.test(p)) return true;
    if (window.self !== window.top) return true;
    return false;
  }
  function mk(tag, cls, txt) { var e = d.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  var CSS =
    '.ghf-v2-up.cw-gdn-on{padding:0!important}' +
    '.cw-gdn{display:flex;align-items:center;width:100%;min-width:0;height:34px;font:13px/1 Barlow,system-ui,-apple-system,Segoe UI,sans-serif;letter-spacing:.02em;color:#fff}' +
    '.cw-gdn a{color:inherit!important;text-decoration:none!important}' +
    '.cw-gdn-l{flex:0 0 auto;display:flex;align-items:center;gap:6px;height:34px;padding:0 10px;font-weight:700;color:var(--ghf-s,#9be15d)!important;white-space:nowrap}' +
    '.cw-gdn-l svg{display:block}.cw-gdn-l small{font-weight:500;font-size:12px;color:#fff;opacity:.85}' +
    '.cw-gdn-r{flex:1 1 auto;min-width:0;height:34px;display:flex;align-items:center;gap:12px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-webkit-overflow-scrolling:touch;' +
      '-webkit-mask-image:linear-gradient(90deg,transparent,#000 12px,#000 calc(100% - 16px),transparent);mask-image:linear-gradient(90deg,transparent,#000 12px,#000 calc(100% - 16px),transparent)}' +
    '.cw-gdn-r::-webkit-scrollbar{display:none}' +
    '.cw-gdn-i{flex:0 0 auto;display:flex;align-items:center;gap:6px;height:30px;max-width:190px}' +
    '.cw-gdn-i span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px}' +
    '.cw-gdn-p{flex:0 0 auto;width:26px;height:26px;border-radius:6px;background-color:#2a3a2a;background-repeat:no-repeat}' +
    '.cw-gdn-c{flex:0 0 auto;height:34px;display:flex;align-items:center;padding:0 10px 0 8px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;opacity:.85;white-space:nowrap}' +
    '.cw-gdn a:focus-visible{outline:2px solid var(--ghf-s,#9be15d);outline-offset:-2px}' +
    'html[data-ghf-mode=day] .cw-gdn{color:#000}html[data-ghf-mode=day] .cw-gdn-l{color:var(--ghf-p,#1e4d2b)!important}html[data-ghf-mode=day] .cw-gdn-l small{color:#000}' +
    '@media (max-width:380px){.cw-gdn-l small{display:none}}';
  var ICON = '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="12" cy="9" r="2.4"/><path d="M12 6.6c0-2 1.2-3.6 2.6-3.6s2.2 1.8 1 3.4M14.4 9c2 0 3.6 1.2 3.6 2.6s-1.8 2.2-3.4 1M12 11.4c0 2-1.2 3.6-2.6 3.6S7.2 13.2 8.4 11.6M9.6 9C7.6 9 6 7.8 6 6.4s1.8-2.2 3.4-1M12 11.5V21M12 17c-2.5 0-4-1.5-4.5-3M12 18.5c2.2 0 3.6-1.3 4-2.8"/></svg>';
  var data = null, slot = null, built = false;
  function css() { if (d.getElementById('cw-gdn-css')) return; var s = mk('style'); s.id = 'cw-gdn-css'; s.textContent = CSS; (d.head || de).appendChild(s); }
  function hide(up) { up.style.setProperty('display', 'none', 'important'); up.setAttribute('aria-hidden', 'true'); try { window.dispatchEvent(new Event('resize')); } catch (e) {} }
  function fill(up) {
    if (!up || up.querySelector('.cw-gdn')) return;
    if (off()) { up.textContent = ''; hide(up); return; }
    css();
    var tt = T[lg()], w = mk('div', 'cw-gdn'), l = mk('a', 'cw-gdn-l'), r = mk('div', 'cw-gdn-r'), c = mk('a', 'cw-gdn-c', tt.cta + ' \u203a');
    l.href = '/garden/'; l.innerHTML = ICON; l.appendChild(mk('span', null, tt.lead)); l.appendChild(mk('small', null, tt.sub));
    c.href = '/garden/'; c.setAttribute('aria-label', tt.aria);
    w.appendChild(l); w.appendChild(r); w.appendChild(c);
    up.textContent = ''; up.appendChild(w); up.classList.add('cw-gdn-on'); up.setAttribute('aria-label', tt.aria); up.removeAttribute('aria-hidden');
    up.style.removeProperty('display');
    if (data) items(r); else load(function () { items(r); });
  }
  function load(cb) {
    if (data) return cb();
    var x = new XMLHttpRequest(); x.open('GET', DATA, true);
    x.onload = function () { try { data = JSON.parse(x.responseText); } catch (e) { data = null; } if (data && data.items) cb(); };
    x.send();
  }
  function items(r) {
    if (!data || r.childNodes.length) return;
    var sp = data.sprite || {}, n = 26, cols = sp.cols || 16, list = data.items || [], i = 0;
    var bg = 'url(' + sp.src + ')', bs = (cols * n) + 'px auto';
    function one(it) {
      var a = mk('a', 'cw-gdn-i'), p = mk('span', 'cw-gdn-p'), k = it[2];
      a.href = '/garden/#p=' + encodeURIComponent(it[0]);
      p.style.backgroundImage = bg; p.style.backgroundSize = bs;
      p.style.backgroundPosition = (-(k % cols) * n) + 'px ' + (-Math.floor(k / cols) * n) + 'px';
      p.setAttribute('aria-hidden', 'true'); a.appendChild(p); a.appendChild(mk('span', null, it[1])); r.appendChild(a);
    }
    function batch() { var end = Math.min(list.length, i + 40); for (; i < end; i++) one(list[i]); if (i < list.length) (window.requestIdleCallback || setTimeout)(batch, 60); }
    batch(); drift(r);
  }
  function drift(r) {   // a gentle sideways drift; stops for good the moment the visitor touches, scrolls or focuses it
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var on = true, last = 0, acc = 0;
    ['pointerdown', 'touchstart', 'wheel', 'focusin', 'keydown'].forEach(function (ev) { r.addEventListener(ev, function () { on = false; }, { passive: true }); });
    function step(t) {
      if (!on || !r.isConnected) return;
      if (last) { acc += (t - last) * 0.022; var px = Math.floor(acc); if (px) { acc -= px; if (r.scrollLeft + r.clientWidth >= r.scrollWidth - 1) r.scrollLeft = 0; else r.scrollLeft += px; } }
      last = t; requestAnimationFrame(step);
    }
    setTimeout(function () { requestAnimationFrame(step); }, 2500);
  }
  function watch() {
    var n = 0, iv = setInterval(function () {
      var up = d.querySelector('.ghf-v2-up');
      if (up) { clearInterval(iv); slot = up; fill(up); new MutationObserver(function () { if (!up.querySelector('.cw-gdn') && !(off() && up.style.display === 'none')) fill(up); }).observe(up, { childList: true }); }
      else if (++n > 100) clearInterval(iv);
    }, 100);
  }
  d.addEventListener('ghf-lang-change', function () { if (slot) { var w = slot.querySelector('.cw-gdn'); if (w) { slot.removeChild(w); } fill(slot); } });
  watch();
})();

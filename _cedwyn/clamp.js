/* clamp.js - three-line "read more" (Sion, 23:32 GMT 26 Oct 2026). - Cedwyn editors
   "don't show more than 3 lines of text on any page load, just crop it at 3 lines and end the last of the 3rd line with 'read more'
   to expand to see more. But also have 'read more' become 'less' link, to collapse that expanded segment. Apply this site wide."
   Every text block (p, dd, a blockquote without paragraphs) shows its first three lines; when, and only when, it runs longer, a
   "… read more" button sits at the end of the third line. It opens the block in place and then reads "less", which closes it.
   Headings, images, video, tables, navigation, tiles, buttons and forms are never cropped. Without JavaScript every word shows. */
(function () {
  'use strict';
  if (window.__cwClamp) return; window.__cwClamp = 1;
  var d = document, n = 0, items = [], timer = 0, lastW = 0;
  var L = { en: ['read more', 'less'], cy: ['darllen mwy', 'llai'], es: ['leer m\u00e1s', 'menos'] };
  var SKIP = 'nav,header,footer,form,button,a,summary,label,table,figure,figcaption,pre,code,select,textarea,noscript,svg,' +
    '[role=dialog],[role=navigation],[role=menu],[hidden],[aria-hidden=true],[data-for-agents],[data-cw-noclamp],' +
    '.cw-modal,.cw-tip,.cw-ior,.hv-tile,.hv-tiles,.hv-menu,.cedwyn-notice,#cedwyn-guestbook,#ghf-agent-footer';
  var INNER = 'p,div,ul,ol,dl,table,img,picture,video,iframe,figure,canvas,svg,h1,h2,h3,h4,h5,h6,form,input,select,button:not(.cw-rm)';
  function lg() { var l = (d.documentElement.getAttribute('lang') || 'en').slice(0, 2).toLowerCase(); return L[l] ? l : 'en'; }
  function label(b) {
    var open = b.getAttribute('aria-expanded') === 'true', t = L[lg()][open ? 1 : 0], s = b.querySelector('.cw-rm-l');
    if (s && s.textContent !== t) s.textContent = t;
  }
  function bgOf(e) {
    while (e && e.nodeType === 1) {
      var c = getComputedStyle(e).backgroundColor, m = c && c.match(/rgba?\(([^)]+)\)/);
      if (m) { var p = m[1].split(','); if (p.length < 4 || parseFloat(p[3]) > 0.5) return 'rgb(' + p.slice(0, 3).join(',') + ')'; }
      e = e.parentElement;
    }
    return '#fff';
  }
  function candidate(p) {
    if (p.__cw) return false;
    if (p.tagName === 'BLOCKQUOTE' && p.querySelector('p')) return false;
    if (p.closest(SKIP) || p.querySelector(INNER)) { p.__cw = 'skip'; return false; }
    if ((p.textContent || '').replace(/\s+/g, ' ').trim().length < 90) { p.__cw = 'skip'; return false; }
    if (!p.getClientRects().length || p.closest('details:not([open])')) return false;   /* not on show yet (closed panel): looked at again when opened */
    return true;
  }
  function button(p) {
    var b = d.createElement('button'); b.type = 'button'; b.className = 'cw-rm'; b.setAttribute('aria-expanded', 'false');
    if (!p.id) p.id = 'cw-c' + (++n);
    b.setAttribute('aria-controls', p.id);
    var e = d.createElement('span'); e.className = 'cw-rm-e'; e.setAttribute('aria-hidden', 'true'); e.textContent = '\u2026\u00a0';
    var s = d.createElement('span'); s.className = 'cw-rm-l';
    b.appendChild(e); b.appendChild(s); label(b);
    b.style.setProperty('--cw-bg', bgOf(p));
    p.appendChild(b); return b;
  }
  function scan() {
    timer = 0;
    var i, p, all = d.querySelectorAll('p,dd,blockquote'), fresh = [];
    for (i = 0; i < all.length; i++) if (candidate(all[i])) fresh.push(all[i]);
    /* a block whose button was wiped (a language switch rewrites its text) is measured again */
    for (i = items.length - 1; i >= 0; i--) {
      p = items[i];
      if (!p.isConnected) { items.splice(i, 1); continue; }
      if (!p.querySelector(':scope > .cw-rm')) { items.splice(i, 1); p.classList.remove('cw-o'); p.__cw = 0; fresh.push(p); }
    }
    if (!fresh.length) return;
    for (i = 0; i < fresh.length; i++) fresh[i].classList.add('cw-c');                    /* write all, */
    var over = fresh.map(function (q) { return q.scrollHeight > q.clientHeight + 3; });    /* then read all */
    for (i = 0; i < fresh.length; i++) {
      p = fresh[i];
      if (over[i]) { p.__cw = 'clamp'; button(p); items.push(p); }
      else { p.classList.remove('cw-c'); p.__cw = 'short'; }
    }
    openHash();
  }
  function remeasure() {                                       /* the width changed: short blocks may now overflow and back */
    var i, all = d.querySelectorAll('p,dd,blockquote');
    for (i = 0; i < all.length; i++) if (all[i].__cw === 'short') all[i].__cw = 0;
    for (i = items.length - 1; i >= 0; i--) {
      var p = items[i]; if (!p.classList.contains('cw-c')) continue;
      var b = p.querySelector(':scope > .cw-rm'); if (b) b.style.display = 'none';
      var over = p.scrollHeight > p.clientHeight + 3; if (b) b.style.display = '';
      if (!over) { if (b) b.remove(); p.classList.remove('cw-c'); p.__cw = 'short'; items.splice(i, 1); }
    }
    scan();
  }
  function later(ms) { if (!timer) timer = setTimeout(scan, ms || 200); }
  function toggle(p, b, open) {
    if (open == null) open = p.classList.contains('cw-c');
    if (open) { p.classList.remove('cw-c'); p.classList.add('cw-o'); }
    else {
      p.classList.remove('cw-o'); p.classList.add('cw-c');
      var r = p.getBoundingClientRect(); if (r.top < 0) p.scrollIntoView({ block: 'start' });
    }
    b.setAttribute('aria-expanded', open ? 'true' : 'false'); label(b);
  }
  function openHash() {
    var h = location.hash; if (!h || h.length < 2) return;
    var t; try { t = d.getElementById(decodeURIComponent(h.slice(1))); } catch (e) { t = null; }
    var p = t && t.closest ? t.closest('.cw-c') : null;
    if (p) { var b = p.querySelector(':scope > .cw-rm'); if (b) { toggle(p, b, true); t.scrollIntoView(); } }
  }
  d.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('.cw-rm') : null; if (!b) return;
    e.preventDefault(); e.stopPropagation(); toggle(b.parentNode, b);
  }, true);
  window.addEventListener('hashchange', openHash);
  window.addEventListener('resize', function () {
    var w = d.documentElement.clientWidth; if (Math.abs(w - lastW) < 8) return; lastW = w;
    clearTimeout(window.__cwRz); window.__cwRz = setTimeout(remeasure, 250);
  });
  function start() {
    lastW = d.documentElement.clientWidth; scan();
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { remeasure(); });
    window.addEventListener('load', function () { remeasure(); });
    if (window.MutationObserver) {
      new MutationObserver(function (ms) {
        for (var i = 0; i < ms.length; i++) {
          var m = ms[i];
          if (m.type === 'attributes') { var q = d.querySelectorAll('.cw-rm'); for (var j = 0; j < q.length; j++) label(q[j]); continue; }
          if (m.target.closest && m.target.closest('.cw-rm')) continue;
          later(250); break;
        }
      }).observe(d.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['lang'] });
    }
    /* panels that open later (tabs, details) are measured when shown */
    d.addEventListener('toggle', function () { later(60); }, true);
    d.addEventListener('click', function () { later(300); });
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start); else start();
})();

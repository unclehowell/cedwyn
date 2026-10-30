/* clamp.js v2 - progressive "read more" (Sion, WhatsApp 06:16 GMT 27 Oct 2026; replaces the three-line clamp of 23:32 GMT 26 Oct).
   - Cedwyn editors
   "the 'read more' link after a few lines of text should almost keep going paragraph at a time with another 'read more' appearing
   on the new paragraph end ... Then they have 'less' to collapse it or 'read more' to expand it again and keep reading."
   A text segment is a run of paragraphs that sit together (or an element marked data-cw-seg, whose children are its paragraphs).
   On load it shows the first three lines of its first paragraph. "read more" opens that paragraph, then one more paragraph per
   press, each time at the end of the paragraph just shown; "less" closes the segment back to its opening lines. A lone long
   paragraph behaves as before (three lines, "read more", "less"). Real buttons, aria-expanded, keyboard, smooth height animation,
   no jump. Every word stays in the HTML; without JavaScript every word shows. Opt out: data-cw-noclamp or class cw-noclamp /
   no-readmore on any element; forms, tables, navigation, tiles, figures, buy widgets and agent blocks are never touched. */
(function () {
  'use strict';
  if (window.__cwClamp) return; window.__cwClamp = 2;
  var d = document, n = 0, segs = [], timer = 0, lastW = 0, busy = 0;
  var RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var L = { en: ['read more', 'less'], cy: ['darllen mwy', 'llai'], es: ['leer m\u00e1s', 'menos'] };
  var SKIP = 'nav,header,footer,form,button,a,summary,label,table,figure,figcaption,pre,code,select,textarea,noscript,svg,' +
    '[role=dialog],[role=navigation],[role=menu],[hidden],[aria-hidden=true],[data-for-agents],[data-cw-noclamp],.cw-noclamp,.no-readmore,' +
    '.cw-modal,.cw-tip,.cw-ior,.hv-tile,.hv-tiles,.hv-menu,.hv-btns,.cedwyn-notice,#cedwyn-guestbook,#ghf-agent-footer,[data-cw-buy],.buy,.cw-buy';
  var INNER = 'p,div,ul,ol,dl,table,img,picture,video,iframe,figure,canvas,svg,h1,h2,h3,h4,h5,h6,form,input,select,button:not(.cw-rm)';
  var LISTBAD = 'input,select,textarea,button:not(.cw-rm),img,picture,video,iframe,table,canvas,svg,form,details';
  var css = d.createElement('style'); css.id = 'cw-seg-css';
  css.textContent = '.cw-c{display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:3!important;line-clamp:3;overflow:hidden!important;position:relative}' +
    '.cw-h,.cw-ctl[hidden],.cw-rm[hidden]{display:none!important}.cw-ctl{white-space:nowrap}.cw-o .cw-ctl,.cw-ctl.cw-in{margin-left:.35em}' +
    '.cw-rm{all:unset;box-sizing:border-box;cursor:pointer;font:inherit;color:inherit;font-weight:700;white-space:nowrap;-webkit-tap-highlight-color:transparent}' +
    '.cw-c>.cw-ctl{position:absolute;right:0;bottom:0;padding-left:2.4em;background:linear-gradient(to right,rgba(0,0,0,0),var(--cw-bg,#fff) 2em)}' +
    '.cw-rm .cw-rm-l{text-decoration:underline;text-underline-offset:2px}.cw-ctl:not(.cw-cl) .cw-rm-e{display:none}.cw-rm:not([hidden])+.cw-rm:not([hidden]):before{content:"\\00b7";display:inline-block;margin:0 .45em;font-weight:400;text-decoration:none}' +
    '.cw-rm:focus-visible{outline:2px solid currentColor;outline-offset:2px}' +
    '@media print{.cw-c{display:block!important;-webkit-line-clamp:unset!important;overflow:visible!important}.cw-h{display:revert!important}.cw-ctl{display:none!important}}';
  (d.head || d.documentElement).appendChild(css);
  function lg() { var l = (d.documentElement.getAttribute('lang') || 'en').slice(0, 2).toLowerCase(); return L[l] ? l : 'en'; }
  function txt(e) { return (e.textContent || '').replace(/\s+/g, ' ').trim(); }
  function bgOf(e) {
    while (e && e.nodeType === 1) {
      var c = getComputedStyle(e).backgroundColor, m = c && c.match(/rgba?\(([^)]+)\)/);
      if (m) { var p = m[1].split(','); if (p.length < 4 || parseFloat(p[3]) > 0.5) return 'rgb(' + p.slice(0, 3).join(',') + ')'; }
      e = e.parentElement;
    }
    return '#fff';
  }
  function shown(e) { return !!e.getClientRects().length && !e.closest('details:not([open])'); }
  /* a plain paragraph: no blocks or media inside, not in a skipped area, not a tagged-language caption */
  function para(e) {
    if (!e || e.nodeType !== 1) return false;
    var t = e.tagName;
    if (t !== 'P' && t !== 'BLOCKQUOTE' && t !== 'DD') return false;
    if (t === 'BLOCKQUOTE' && e.querySelector('p')) return false;
    if (e.hasAttribute('lang')) return false;
    if (e.closest(SKIP) || e.closest('[data-cw-seg]') || e.querySelector(INNER)) return false;
    return true;
  }
  function list(e) {
    return e && (e.tagName === 'UL' || e.tagName === 'OL') && !e.closest(SKIP) && !e.closest('[data-cw-seg]') && !e.querySelector(LISTBAD) &&
      !e.className.match(/\b(hv-tl|rec)\b/) && txt(e).length > 0;
  }
  function filler(e) {   /* invisible siblings a run may step over */
    var t = e.tagName;
    if (t === 'SCRIPT' || t === 'STYLE' || t === 'TEMPLATE' || t === 'LINK' || t === 'META' || t === 'BR') return true;
    if ((t === 'SPAN' || t === 'A') && !txt(e) && !e.querySelector('img,svg,video')) return true;
    return false;
  }
  function next(e) { e = e.nextElementSibling; while (e && filler(e)) e = e.nextElementSibling; return e; }
  function prev(e) { e = e.previousElementSibling; while (e && filler(e)) e = e.previousElementSibling; return e; }
  function tail(u) {   /* where a button sits at the end of a unit: the unit itself, or its last paragraph / item */
    if (u.tagName === 'UL' || u.tagName === 'OL') return u.lastElementChild || u;
    if (u.tagName !== 'P' && u.tagName !== 'BLOCKQUOTE' && u.tagName !== 'DD' && u.tagName !== 'LI') {
      var q = u.querySelectorAll('p,li,dd'), i;
      for (i = q.length - 1; i >= 0; i--) if (!q[i].closest(SKIP) && !q[i].querySelector(INNER)) return q[i];
    }
    return u;
  }
  function mk(cls) {
    var b = d.createElement('button'); b.type = 'button'; b.className = 'cw-rm ' + cls;
    var e = d.createElement('span'); e.className = 'cw-rm-e'; e.setAttribute('aria-hidden', 'true'); e.textContent = '\u2026\u00a0';
    var s = d.createElement('span'); s.className = 'cw-rm-l';
    if (cls === 'cw-more') b.appendChild(e);
    b.appendChild(s); return b;
  }
  function seg(units) {
    var s = { u: units, k: 0, cl: false, ctl: d.createElement('span') }, h = units[0];
    if (!h.id) h.id = 'cw-c' + (++n);
    s.id = h.id; s.ctl.className = 'cw-ctl';
    s.more = mk('cw-more'); s.less = mk('cw-less');
    s.more.setAttribute('aria-expanded', 'false'); s.less.setAttribute('aria-expanded', 'true');
    s.more.setAttribute('aria-controls', units.map(function (x) { if (!x.id) x.id = 'cw-c' + (++n); return x.id; }).join(' '));
    s.less.setAttribute('aria-controls', s.more.getAttribute('aria-controls'));
    s.ctl.appendChild(s.more); s.ctl.appendChild(s.less);
    s.ctl.__seg = s; units.forEach(function (x) { x.__cw = 'seg'; x.__seg = s; });
    return s;
  }
  function label(s) {
    var l = L[lg()], a = s.more.querySelector('.cw-rm-l'), b = s.less.querySelector('.cw-rm-l');
    if (a.textContent !== l[0]) a.textContent = l[0];
    if (b.textContent !== l[1]) b.textContent = l[1];
  }
  function canClamp(u) { return u.tagName === 'P' || u.tagName === 'BLOCKQUOTE' || u.tagName === 'DD'; }
  function overflow(u) { return u.scrollHeight > u.clientHeight + 3; }
  /* lay a segment out for its state: k = index of the last paragraph on show; cl = first paragraph cropped at three lines */
  function place(s) {
    var last = s.u.length - 1, i, h = s.u[s.h];
    for (i = 1; i <= last; i++) s.u[i].classList.toggle('cw-h', i > s.k);
    h.classList.toggle('cw-c', s.cl); h.classList.toggle('cw-o', !s.cl && s.wasCl);
    var moreLeft = s.cl || s.k < last, lessOn = !s.cl && (s.k > s.h || s.wasCl);
    s.more.hidden = !moreLeft; s.less.hidden = !lessOn;
    s.ctl.classList.toggle('cw-cl', s.cl);
    s.ctl.classList.toggle('cw-in', !s.cl);
    if (s.cl) s.ctl.style.setProperty('--cw-bg', bgOf(h)); else s.ctl.style.removeProperty('--cw-bg');
    var t = s.cl ? h : tail(s.u[s.k]);
    if (s.ctl.parentNode !== t || s.ctl !== t.lastChild) t.appendChild(s.ctl);
    label(s);
    s.ctl.hidden = !moreLeft && !lessOn;
  }
  function collapse(s) {
    /* the opening: a short first line (a place name, a date line) stays whole and the paragraph after it is the one cropped */
    s.h = 0;
    while (s.h < Math.min(2, s.u.length - 1) && canClamp(s.u[s.h]) && txt(s.u[s.h]).length < 90) s.h++;
    s.k = s.h; s.cl = false; s.wasCl = false;
    var h = s.u[s.h];
    if (canClamp(h)) {
      s.ctl.hidden = true; for (var i = s.h + 1; i < s.u.length; i++) s.u[i].classList.add('cw-h');
      h.classList.remove('cw-o'); h.classList.add('cw-c');
      if (overflow(h)) { s.cl = true; s.wasCl = true; } else h.classList.remove('cw-c');
    }
    place(s);
  }
  function grow(el, from) {   /* smooth height change from `from` px to the element's natural height */
    if (RM || !el.animate) return;
    var to = el.getBoundingClientRect().height; if (Math.abs(to - from) < 2) return;
    var ov = el.style.overflow; el.style.overflow = 'hidden';
    var a = el.animate([{ height: from + 'px', opacity: from ? 1 : 0 }, { height: to + 'px', opacity: 1 }], { duration: Math.min(420, 180 + Math.abs(to - from) * 0.6), easing: 'cubic-bezier(.2,.7,.2,1)' });
    a.onfinish = a.oncancel = function () { el.style.overflow = ov; };
  }
  function more(s) {
    var foc = d.activeElement === s.more;
    if (s.cl) { var h = s.u[s.h], f = h.getBoundingClientRect().height; s.cl = false; place(s); grow(h, f); }
    else if (s.k < s.u.length - 1) { s.k++; place(s); grow(s.u[s.k], 0); }
    if (foc) { (s.more.hidden ? s.less : s.more).focus({ preventScroll: true }); }
  }
  function less(s) {
    var foc = d.activeElement === s.less;
    collapse(s);
    var r = s.u[0].getBoundingClientRect(); if (r.top < 0) s.u[0].scrollIntoView({ block: 'start' });
    if (foc) s.more.focus({ preventScroll: true });
  }
  function build(head) {   /* the run of paragraphs that starts at head */
    var units = [head], e = next(head);
    if (head.tagName !== 'DD') while (e && (para(e) && e.tagName !== 'DD' || list(e))) { units.push(e); e = next(e); }
    return units;
  }
  function scan() {
    timer = 0; if (busy) return;
    var i, j, s, fresh = [];
    for (i = segs.length - 1; i >= 0; i--) {   /* a segment whose buttons were wiped (a language switch rewrites text) is laid out again */
      s = segs[i];
      if (!s.u[0].isConnected) { segs.splice(i, 1); continue; }
      if (!s.ctl.isConnected || s.ctl.parentNode !== (s.cl ? s.u[s.h] : tail(s.u[s.k]))) { busy = 1; place(s); busy = 0; }
    }
    var ex = d.querySelectorAll('[data-cw-seg]');
    for (i = 0; i < ex.length; i++) {
      var c = ex[i]; if (c.__cwseg || c.closest(SKIP) || !shown(c)) continue;
      var us = [].filter.call(c.children, function (x) { return !filler(x) && !x.matches('[data-cw-noclamp],.cw-noclamp,.no-readmore'); });
      if (us.length) { c.__cwseg = 1; fresh.push(seg(us)); }
    }
    var all = d.querySelectorAll('p,dd,blockquote');
    for (i = 0; i < all.length; i++) {
      var p = all[i]; if (p.__cw) continue;
      if (!para(p)) { if (!p.closest('details:not([open])')) p.__cw = 'skip'; continue; }
      if (!shown(p)) continue;                                  /* not on show yet (closed panel, other tab): looked at when shown */
      var pv = prev(p); if (pv && para(pv) && pv.tagName !== 'DD' && p.tagName !== 'DD') { continue; }   /* not the head of its run */
      var us2 = build(p), total = 0;
      for (j = 0; j < us2.length; j++) total += txt(us2[j]).length;
      if (us2.length === 1 && total < 90) { p.__cw = 'short'; continue; }
      if (us2.length > 1 && total < 200) { us2.forEach(function (x) { x.__cw = 'short'; }); continue; }
      fresh.push(seg(us2));
    }
    if (!fresh.length) return;
    busy = 1;
    for (i = 0; i < fresh.length; i++) collapse(fresh[i]);
    for (i = 0; i < fresh.length; i++) {
      s = fresh[i];
      if (s.u.length === 1 && !s.cl) { s.ctl.remove(); s.u[0].__cw = 'short'; s.u[0].__seg = null; s.short = 1; }
      else segs.push(s);
    }
    busy = 0;
    openHash();
  }
  function remeasure() {   /* the width changed: a first paragraph may now fit, or no longer fit, in three lines */
    busy = 1;
    for (var i = 0; i < segs.length; i++) { var s = segs[i]; if (s.k === s.h && (s.cl || !s.wasCl)) collapse(s); }
    var all = d.querySelectorAll('p,dd,blockquote');
    for (i = 0; i < all.length; i++) if (all[i].__cw === 'short' && !all[i].__seg) all[i].__cw = 0;
    busy = 0; scan();
  }
  function later(ms) { if (!timer) timer = setTimeout(scan, ms || 200); }
  function openHash() {
    var h = location.hash; if (!h || h.length < 2) return;
    var t; try { t = d.getElementById(decodeURIComponent(h.slice(1))); } catch (e) { t = null; }
    if (!t) return;
    for (var i = 0; i < segs.length; i++) {
      var s = segs[i], k = -1;
      for (var j = 0; j < s.u.length; j++) if (s.u[j] === t || s.u[j].contains(t)) k = j;
      if (k < 0) continue;
      s.cl = false; s.k = Math.max(s.k, k, s.h); place(s); t.scrollIntoView(); return;
    }
  }
  d.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('.cw-rm') : null; if (!b) return;
    var c = b.parentNode, s = c && c.__seg; if (!s) return;
    e.preventDefault(); e.stopPropagation();
    busy = 1; try { if (b === s.more) more(s); else less(s); } finally { busy = 0; }
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
        if (busy) return;
        for (var i = 0; i < ms.length; i++) {
          var m = ms[i];
          if (m.type === 'attributes') { for (var j = 0; j < segs.length; j++) label(segs[j]); continue; }
          if (m.target.closest && m.target.closest('.cw-ctl')) continue;
          later(250); break;
        }
      }).observe(d.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['lang'] });
    }
    d.addEventListener('toggle', function () { later(60); }, true);   /* panels that open later (tabs, details) are laid out when shown */
    d.addEventListener('click', function () { later(300); });
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start); else start();
})();

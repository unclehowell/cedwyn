/* Cedwyn runtime - loaded first in every theme page. Keeps each theme working under /<theme>/ on one URL:
   prefixes root-absolute paths made by page scripts, maps old subdomain URLs to /<theme>/..., and sends every
   outbound link to the archive interface (/wayback/go/). No tracking, no outbound requests. - Sion's Tab agent */
(function () {
  var me = document.currentScript, T = (me && me.getAttribute('data-theme')) || location.pathname.split('/')[1] || '';
  var SECTION_SPA = __SECTION_SPA__, P = '/' + T, HOSTS = __HOSTMAP__, APEX = __APEX__, MEDIA = __MEDIA__, THEMES = __THEMES__, COLLIDE = __COLLIDE__, VHOST = __VHOST__;
  // 25 Oct 2026 (Sion): two sections over one database. /wales/<theme>/... and /argentina/<theme>/... serve the same theme files
  // (Pages rewrites in _redirects, tools/sections.py); LP is the theme path without the section prefix. section.js adds the
  // section ribbon and keeps theme links inside the section; the section gives the default language (Wales cy, Argentina es).
  var DE0 = document.documentElement, SECM = /^\/(wales|argentina)(\/[^\/]+)/.exec(location.pathname), SEC = '', SS = '', LP = location.pathname;
  if (T && SECM && SECM[2] === P) { SEC = SECM[1]; LP = location.pathname.slice(SEC.length + 1); }
  try { if (SEC) sessionStorage.setItem('cedwyn-sec', SEC); else SS = sessionStorage.getItem('cedwyn-sec') || ''; } catch (e) {}
  if (SEC) DE0.setAttribute('data-cedwyn-sec-url', SEC);
  if (SEC || /^(wales|argentina)$/.test(SS)) {
    DE0.setAttribute('data-cedwyn-sec', SEC || SS);
    if (!DE0.getAttribute('data-ghf-lang-default')) DE0.setAttribute('data-ghf-lang-default', (SEC || SS) === 'wales' ? 'cy' : 'es');
    if (SEC && SECTION_SPA.indexOf(T) >= 0) try { history.replaceState(history.state, '', LP + location.search + location.hash); } catch (e) {}   // a client-side router reads the plain theme path
    var SJ = document.createElement('script'); SJ.src = '/_cedwyn/section.js?v=1.0.0'; SJ.async = true; (document.head || DE0).appendChild(SJ);
  }
  window.__cedwynSec = SEC; window.__cedwynLP = LP;
  // the shared header (basecamp.js) reads the theme's former address from <html data-ghf-host / data-ghf-path>
  (function () { var v = VHOST[T]; if (!v) return; var de = document.documentElement, rest = LP.slice(P.length).replace(/^\/+/, '');
    if (!de.getAttribute('data-ghf-host')) de.setAttribute('data-ghf-host', v[0]);
    if (!de.getAttribute('data-ghf-path')) de.setAttribute('data-ghf-path', v[1] + rest); })();
  // Stage 3: every theme reads its data and evidence from the one catalogue database. The service worker (/cedwyn-sw.js)
  // answers those requests from the database chunks. On a first visit, before the worker controls this page, loading
  // stops, the worker starts, and the page loads again under it (once per tab). Where no service worker can run, the
  // fetch/XHR and media fallbacks below read the same database from the page itself.
  var SWC = navigator.serviceWorker, SWOK = !!SWC && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1');
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }
  if (SWOK) {
    if (!SWC.controller && !ss('cedwyn-sw')) {
      ss('cedwyn-sw', '1');
      try { window.stop(); } catch (e) {}
      var went = false, go = function () { if (!went) { went = true; location.reload(); } };
      SWC.addEventListener('controllerchange', go);
      SWC.register('/cedwyn-sw.js', { scope: '/', updateViaCache: 'none' }).then(function (reg) {
        if (reg.active && !SWC.controller) reg.active.postMessage('claim');
      }).catch(go);
      setTimeout(go, 6000);
    } else SWC.register('/cedwyn-sw.js', { scope: '/', updateViaCache: 'none' }).catch(function () {});
  }
  var DBX = /\.(json|csv|xml|geojson|png|jpe?g|gif|webp|svg|avif|ico|bmp|tiff?|pdf|docx?|mp3|m4a|ogg|wav)$/i, DBP = null;
  function noSW() { return !(SWC && SWC.controller); }
  function dbfs() {
    if (!DBP) DBP = new Promise(function (ok, no) { if (window.CedwynDB) return ok(window.CedwynDB); var s = document.createElement('script'); s.src = '/_cedwyn/dbfs.js?v=3';
      s.onload = function () { ok(window.CedwynDB); }; s.onerror = no; (document.head || document.documentElement).appendChild(s); });
    return DBP;
  }
  function dbPath(u) { try { var x = new URL(u, location.href); return x.origin === location.origin && DBX.test(x.pathname) && !/^\/(db|_cedwyn)\//.test(x.pathname) ? x.pathname : null; } catch (e) { return null; } }
  function fromDB(path) { return dbfs().then(function (D) { var p2 = path.replace(/^\/(wales|argentina)(\/[^\/]+\/)/, '$2'); return D.get(path).then(function (r) { return r || p2 === path ? r : D.get(p2); }); }); }
  var RES = ['/_cedwyn/', '/_blob/', '/db/', '/graphql', '/catalogue', '/wayback/go/', '/values/', '/argentina/', '/explore/', '/guestbook/'];   // 26 Oct 2026: + the Agent guest book
  function starts(u, a) { for (var i = 0; i < a.length; i++) if (u.indexOf(a[i]) === 0) return true; return false; }
  function mapHost(host, path) {
    host = host.toLowerCase();
    if (host === 'bucklerfamily.estate' || host === 'www.bucklerfamily.estate') {
      for (var i = 0; i < APEX.length; i++) { var pre = APEX[i][0]; if (path.indexOf(pre) === 0 || path + '/' === pre) return '/' + APEX[i][1] + '/' + path.slice(pre.length).replace(/^\/+/, ''); }
    }
    if (host === location.hostname) return path;
    if (HOSTS[host]) return '/' + HOSTS[host] + (path.charAt(0) === '/' ? path : '/' + path);
    return null;
  }
  function fix(u) {
    if (typeof u !== 'string' || !u) return u;
    if (u.charAt(0) === '/' && u.charAt(1) !== '/') {
      if (!T || u === P || u.indexOf(P + '/') === 0 || starts(u, RES)) return u;
      var x = u.split(/[\/?#]/)[1];   // already a cedwyn theme path (/<theme>/...): leave it, unless this theme has its own folder of that name
      if (x && THEMES.indexOf(x) >= 0 && (COLLIDE[T] || []).indexOf(x) < 0) return u;
      return P + u;
    }
    var m = u.match(/^(?:https?:)?\/\/([^\/?#:]+)(?::\d+)?([^?#]*)(.*)$/i);
    if (m) { var t = mapHost(m[1], m[2] || '/'); if (t !== null) return t + m[3]; }
    return u;
  }
  function isOut(u) {
    var m = String(u).match(/^(?:https?:)?\/\/([^\/?#:]+)/i);
    return !!(m && m[1].toLowerCase() !== location.hostname && mapHost(m[1], '/') === null) && !pass(String(u));
  }
  function archive(u) { return '/wayback/go/?u=' + encodeURIComponent(u); }
  window.__cedwyn = { theme: T, fix: fix, archive: archive };
  // 25 Oct 2026: a link to the archive interface whose address is really a theme (a former *.bucklerfamily.estate site, the
  // Legal Wiki on wordpress.com) opens that theme: /wayback/go/ is only for outside addresses with no theme
  function untrap(h) { var m = /^(?:https?:\/\/[^\/]+)?\/wayback\/go\/\?u=([^&#]+)/.exec(h || ''), u, t; if (!m) return null;
    try { u = decodeURIComponent(m[1]); } catch (e) { return null; } if (pass(u)) return u; t = fix(u); return t !== u && t.charAt(0) === '/' ? t : null; }
  window.__cedwyn.untrap = untrap;
  // 25 Oct 2026 (sales fix): the shop's own checkout and sign-up hosts are the one exception to "no outbound links":
  // a buy button opens Stripe/Gumroad checkout and the free-book form posts to the mailing list, instead of the archive page.
  function pass(u) { var m = /^https:\/\/([^\/?#:]+)/i.exec(u || ''), h; if (!m) return false; h = m[1].toLowerCase();
    return h === 'buy.stripe.com' || h === 'checkout.stripe.com' || h === 'gumroad.com' || /\.gumroad\.com$/.test(h) || /\.list-manage\.com$/.test(h)
      // 26 Oct 2026: the Agent guest book's version links (commits of this site's own repository) open GitHub directly; the owner allowed them out
      || (h === 'github.com' && /^\/unclehowell\/cedwyn\/commit\/[0-9a-f]{7,40}\/?$/i.test(u.replace(/^https:\/\/[^\/]+/i, '').split(/[?#]/)[0])); }
  window.__cedwyn.pass = pass;
  document.addEventListener('submit', function (e) { var f = e.target, a = f && f.getAttribute ? f.getAttribute('action') : '', m, u;
    m = /^(?:https?:\/\/[^\/]+)?\/wayback\/go\/\?u=([^&#]+)/.exec(a || ''); if (!m) return;
    try { u = decodeURIComponent(m[1]).replace(/&amp;/g, '&'); } catch (x) { return; } if (pass(u)) f.setAttribute('action', u); }, true);
  document.addEventListener('click', function (e) { var a = e.target && e.target.closest ? e.target.closest('a[href]') : null, t;
    if (a && (t = untrap(a.getAttribute('href')))) a.setAttribute('href', t); }, true);
  var of = window.fetch;
  if (of) window.fetch = function (i, o) {
    try { if (typeof i === 'string') i = fix(i); else if (i && i.url && i.url.indexOf(location.origin + '/') === 0) { var f = fix(i.url.slice(location.origin.length)); if (f !== i.url.slice(location.origin.length)) i = new Request(f, i); } } catch (e) {}
    var self_ = this, dp = noSW() && (!o || !o.method || /^get$/i.test(o.method)) && dbPath(typeof i === 'string' ? i : (i && i.url) || '');
    if (dp) return fromDB(dp).then(function (r) { return r ? new Response(r.bytes, { status: 200, headers: { 'Content-Type': r.mime, 'X-Cedwyn-Source': 'db-page' } }) : of.call(self_, i, o); }, function () { return of.call(self_, i, o); });
    return of.call(this, i, o);
  };
  var xo = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (m, u) { var a = [].slice.call(arguments); a[1] = fix(u);
    this.__cdb = noSW() && /^get$/i.test(m) && a[2] !== false && dbPath(a[1]) ? [m, dbPath(a[1])] : null; return xo.apply(this, a); };
  var xs = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {   // no service worker: the same database, read from this page
    var x = this, d = x.__cdb, args = arguments; if (!d) return xs.apply(x, args);
    x.__cdb = null;
    fromDB(d[1]).then(function (r) { if (r) { xo.call(x, d[0], URL.createObjectURL(new Blob([r.bytes], { type: r.mime })), true); } xs.apply(x, args); }, function () { xs.apply(x, args); });
  };
  // media that failed to load before the worker took over (or with no worker at all): load it again from the database
  document.addEventListener('error', function (e) {
    var el = e.target, tag = el && el.tagName; if (!/^(IMG|SOURCE|VIDEO|AUDIO|EMBED|INPUT)$/.test(tag || '') || el.__cdbTried) return;
    var src = el.currentSrc || el.getAttribute('src'), dp = src && dbPath(src); if (!dp) return; el.__cdbTried = 1;
    if (!noSW()) { var u = new URL(src, location.href); u.searchParams.set('cdb', '1'); el.setAttribute('src', u.pathname + u.search); return; }
    fromDB(dp).then(function (r) { if (r) el.setAttribute('src', URL.createObjectURL(new Blob([r.bytes], { type: r.mime }))); }, function () {});
  }, true);
  var sa = Element.prototype.setAttribute, ATTRS = { src: 1, href: 1, action: 1, poster: 1, 'data-src': 1 };
  Element.prototype.setAttribute = function (n, v) {
    if (ATTRS[String(n).toLowerCase()] && typeof v === 'string') { v = fix(v); if (/^iframe$/i.test(this.tagName) && /UC2sN1VEs1WeLfBH8VmbvLWw|sionbuckler5713/i.test(v)) v = 'about:blank'; }
    return sa.call(this, n, v);
  };
  [['HTMLImageElement', 'src'], ['HTMLScriptElement', 'src'], ['HTMLLinkElement', 'href'], ['HTMLSourceElement', 'src'], ['HTMLIFrameElement', 'src'],
   ['HTMLMediaElement', 'src'], ['HTMLAnchorElement', 'href'], ['HTMLFormElement', 'action'], ['HTMLVideoElement', 'poster']].forEach(function (c) {
    var K = window[c[0]]; if (!K) return; var d = Object.getOwnPropertyDescriptor(K.prototype, c[1]); if (!d || !d.set) return;
    Object.defineProperty(K.prototype, c[1], { configurable: true, enumerable: d.enumerable, get: d.get, set: function (v) { d.set.call(this, fix(String(v))); } });
  });
  ['pushState', 'replaceState'].forEach(function (k) { var h = history[k]; history[k] = function (s, t, u) { return h.call(this, s, t, u == null ? u : fix(String(u))); }; });
  var wo = window.open; window.open = function (u) { var a = [].slice.call(arguments); if (a[0]) { a[0] = fix(String(a[0])); if (isOut(a[0])) { location.href = archive(new URL(a[0], location.href).href); return null; } } return wo.apply(window, a); };
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href],area[href]') : null; if (!a) return;
    var h = a.getAttribute('href'); if (!h) return;
    if (isOut(h)) { e.preventDefault(); e.stopPropagation(); location.href = archive(new URL(h, location.href).href); return; }
    if (/^(?:https?:)?\/\//i.test(h)) { var f = fix(h); if (f !== h) a.setAttribute('href', f); }  // static paths are already resolved at build time
  }, true);
  document.addEventListener('submit', function (e) {
    var f = e.target, act = f && f.getAttribute && f.getAttribute('action');
    if (act && isOut(act)) { e.preventDefault(); location.href = archive(new URL(act, location.href).href); }
  }, true);
  function sweep(root) {
    if (!root || !root.querySelectorAll) return;
    var els = [].slice.call(root.querySelectorAll('[src^="/"],[href^="/"],[poster^="/"]')); if (root.getAttribute) els.unshift(root);
    for (var i = 0; i < els.length; i++) ['src', 'href', 'poster'].forEach(function (n) { var v = els[i].getAttribute(n); if (v && v.charAt(0) === '/') { var f = fix(v); if (f !== v) sa.call(els[i], n, f); } });
  }
  // only nodes that page scripts add after parsing are swept: the parsed page was resolved at build time
  function watch() { try { new MutationObserver(function (ms) { ms.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) { sweep(n); } }); }); }).observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {} }
  // small Cedwyn pill: back to the theme picker, search the shared catalogue
  function pill() {
    if (document.getElementById('cedwyn-pill') || !document.body) return;
    var d = document.createElement('div'); d.id = 'cedwyn-pill';
    d.innerHTML = '<a href="/" title="All Cedwyn themes" aria-label="All Cedwyn themes">C</a><a href="/catalogue/?theme=' + encodeURIComponent(T) + '" title="Search the catalogue" aria-label="Search the catalogue">&#9906;</a>';
    var s = document.createElement('style');
    s.textContent = '#cedwyn-pill{position:fixed;left:8px;bottom:8px;z-index:2147483000;display:flex;gap:4px;opacity:.72;font:600 13px/1 -apple-system,Segoe UI,Roboto,sans-serif}#cedwyn-pill:hover{opacity:1}#cedwyn-pill a{display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:15px;background:#14141c;color:#fca;text-decoration:none;border:1px solid #fca;box-shadow:0 1px 4px rgba(0,0,0,.3)}@media print{#cedwyn-pill{display:none}}';
    document.head.appendChild(s); document.body.appendChild(d);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { watch(); pill(); }); else { watch(); pill(); }
})();

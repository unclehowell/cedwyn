/* Cedwyn runtime - loaded first in every theme page. Keeps each theme working under /<theme>/ on one URL:
   prefixes root-absolute paths made by page scripts, maps old subdomain URLs to /<theme>/..., and sends every
   outbound link to the archive interface (/wayback/go/). No tracking, no outbound requests. - Sion's Tab agent */
(function () {
  var me = document.currentScript, T = (me && me.getAttribute('data-theme')) || location.pathname.split('/')[1] || '';
  var P = '/' + T, HOSTS = __HOSTMAP__, APEX = __APEX__, MEDIA = __MEDIA__;
  var RES = ['/_cedwyn/', '/_blob/', '/db/', '/graphql', '/catalogue', '/wayback/go/'];
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
      return P + u;
    }
    var m = u.match(/^(?:https?:)?\/\/([^\/?#:]+)(?::\d+)?([^?#]*)(.*)$/i);
    if (m) { var t = mapHost(m[1], m[2] || '/'); if (t !== null) return t + m[3]; }
    return u;
  }
  function isOut(u) {
    var m = String(u).match(/^(?:https?:)?\/\/([^\/?#:]+)/i);
    return !!(m && m[1].toLowerCase() !== location.hostname && mapHost(m[1], '/') === null);
  }
  function archive(u) { return '/wayback/go/?u=' + encodeURIComponent(u); }
  window.__cedwyn = { theme: T, fix: fix, archive: archive };
  var of = window.fetch;
  if (of) window.fetch = function (i, o) {
    try { if (typeof i === 'string') i = fix(i); else if (i && i.url && i.url.indexOf(location.origin + '/') === 0) { var f = fix(i.url.slice(location.origin.length)); if (f !== i.url.slice(location.origin.length)) i = new Request(f, i); } } catch (e) {}
    return of.call(this, i, o);
  };
  var xo = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (m, u) { var a = [].slice.call(arguments); a[1] = fix(u); return xo.apply(this, a); };
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
    var f = fix(h); if (f !== h) a.setAttribute('href', f);
  }, true);
  document.addEventListener('submit', function (e) {
    var f = e.target, act = f && f.getAttribute && f.getAttribute('action');
    if (act && isOut(act)) { e.preventDefault(); location.href = archive(new URL(act, location.href).href); }
  }, true);
  function sweep(root) {
    if (!root || !root.querySelectorAll) return;
    var els = root.querySelectorAll('[src^="/"],[href^="/"],[poster^="/"]');
    for (var i = 0; i < els.length; i++) ['src', 'href', 'poster'].forEach(function (n) { var v = els[i].getAttribute(n); if (v && v.charAt(0) === '/') { var f = fix(v); if (f !== v) sa.call(els[i], n, f); } });
  }
  try { new MutationObserver(function (ms) { ms.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) { sweep(n.parentNode || n); } }); }); }).observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}
  // small Cedwyn pill: back to the theme picker, search the shared catalogue
  function pill() {
    if (document.getElementById('cedwyn-pill') || !document.body) return;
    var d = document.createElement('div'); d.id = 'cedwyn-pill';
    d.innerHTML = '<a href="/" title="All Cedwyn themes" aria-label="All Cedwyn themes">C</a><a href="/catalogue/?theme=' + encodeURIComponent(T) + '" title="Search the catalogue" aria-label="Search the catalogue">&#9906;</a>';
    var s = document.createElement('style');
    s.textContent = '#cedwyn-pill{position:fixed;left:8px;bottom:8px;z-index:2147483000;display:flex;gap:4px;opacity:.72;font:600 13px/1 -apple-system,Segoe UI,Roboto,sans-serif}#cedwyn-pill:hover{opacity:1}#cedwyn-pill a{display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:15px;background:#14141c;color:#fca;text-decoration:none;border:1px solid #fca;box-shadow:0 1px 4px rgba(0,0,0,.3)}@media print{#cedwyn-pill{display:none}}';
    document.head.appendChild(s); document.body.appendChild(d);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { sweep(document); pill(); }); else { sweep(document); pill(); }
})();

// cedwyn-hive — serves the live Hive (Worker ghf-watch) at https://cedwyn.bucklerfamily.estate/hive/*
// Same Worker, same live state: requests reach ghf-watch through a service binding (no network hop, no redirect loop).
// Self-URLs are rewritten to the Cedwyn address; root-relative links in HTML gain the /hive prefix;
// the owner's first name is replaced with "the owner" (Cedwyn privacy rule). — Sion's Tab agent, 27 Oct 2026
const OLD = 'https://hive.bucklerfamily.estate';
const NEW = 'https://cedwyn.bucklerfamily.estate/hive';
const TEXTY = /^(text\/|application\/(json|javascript|xml|ld\+json|manifest\+json))/i;

function privacy(t) {
  t = t.replace(/\s*\(WhatsApp[^)"<\n]*\)?/g, '');
  t = t.replace(/(^|[.!?]\s+|["'>\n]\s*)(Sion(?: Hywel)? Buckler|Sion)('s)?\b/g, (m, pre, _n, s) => pre + 'The owner' + (s || ''));
  t = t.replace(/\b(?:Sion(?: Hywel)? Buckler|Sion)('s)?\b/g, (m, s) => 'the owner' + (s || ''));
  return t;
}
function rewriteUrls(t) {
  t = t.split(OLD + '/').join(NEW + '/').split(OLD).join(NEW + '/');
  t = t.split('http://hive.bucklerfamily.estate/').join(NEW + '/');
  t = t.split('https:\\/\\/hive.bucklerfamily.estate\\/').join('https:\\/\\/cedwyn.bucklerfamily.estate\\/hive\\/');
  return t;
}
function rewriteHtml(t) {
  t = t.replace(/(\s(?:href|src|action|data-src)=)(["'])\/(?!\/|hive\/)/g, '$1$2/hive/');
  t = t.replace(/(fetch\(\s*)(["'`])\/(?!\/|hive\/)/g, '$1$2/hive/');
  return t;
}
function rewriteLocation(loc) {
  if (!loc) return loc;
  if (loc.startsWith(OLD)) return NEW + (loc.slice(OLD.length) || '/');
  if (loc.startsWith('/') && !loc.startsWith('//')) return '/hive' + loc;
  return loc;
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/hive') return Response.redirect(NEW + '/' + url.search, 301);
    if (!url.pathname.startsWith('/hive/')) return fetch(request);
    const sub = url.pathname.slice('/hive'.length) || '/';
    const target = OLD + sub + url.search;
    const headers = new Headers(request.headers);
    headers.set('x-hive-via', 'cedwyn');
    const init = { method: request.method, headers, redirect: 'manual' };
    if (!['GET', 'HEAD'].includes(request.method)) init.body = request.body;
    const res = await env.HIVE.fetch(new Request(target, init));
    const h = new Headers(res.headers);
    if (h.has('location')) h.set('location', rewriteLocation(h.get('location')));
    h.set('x-hive-home', NEW + '/');
    const ct = h.get('content-type') || '';
    if (request.method === 'HEAD' || !(TEXTY.test(ct) || /markdown/i.test(ct)) || res.status === 304) {
      return new Response(request.method === 'HEAD' ? null : res.body, { status: res.status, headers: h });
    }
    let t = await res.text();
    t = rewriteUrls(t);
    if (/html/i.test(ct)) t = rewriteHtml(t);
    t = privacy(t);
    h.delete('content-length'); h.delete('etag');
    return new Response(t, { status: res.status, headers: h });
  }
};

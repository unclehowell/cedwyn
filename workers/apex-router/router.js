// bfe-apex-router — serves every Cedwyn webapp at https://bucklerfamily.estate/<name>/ (no cedwyn. subdomain needed).
// Sion's Tab agent, 2 Nov 2026. Source of truth: work/apex-paths/router.js (this file). VERSION below.
// One route (bucklerfamily.estate/* + www) -> this Worker. Driven by the site's own registry (/areas.json), so a webapp added
// to the registry gets its apex path automatically. Content is proxied (rewritten), never bounced to cedwyn.
const VERSION = '1.1.3';
const APEX = 'bucklerfamily.estate';
const OLD = 'cedwyn.bucklerfamily.estate';
// Paths the apex Pages project (bucklerfamilyfarm) serves itself today (same list the old apex redirect rule exempted).
const KEEP = ['/ebook', '/licence', '/privacy', '/cookies', '/terms', '/legal', '/disclaimer', '/accessibility',
  '/wales/vouchers/', '/go/', '/free/', '/.well-known/'];
const SECTIONS = ['online', 'argentina', 'wales'];
const TEXT = /^(text\/|application\/(json|javascript|ld\+json|manifest\+json|xml|rss\+xml|atom\+xml|x-javascript)|image\/svg)/i;
let REG = null, REG_AT = 0;

async function registry(env) {
  if (REG && Date.now() - REG_AT < 300000) return REG;
  try {
    const r = await fetch(env.ORIGIN + '/areas.json', { cf: { cacheTtl: 300 } });
    if (r.ok) {
      const j = await r.json(), map = {};
      // nav 1.1.0 entries carry "apex" (the flat apex address, named in themes.json when it is not the id) and "href"
      // (where the build keeps the app); older registries carry id + path.
      for (const a of (j.nav || j.areas || [])) {
        const href = a.href || a.path;
        let slug = a.id;
        if (a.apex) { try { slug = new URL(a.apex, 'https://' + APEX + '/').pathname.split('/')[1] || slug; } catch (e) {} }
        if (slug && href && href !== '/' + slug + '/') map[slug] = href;
      }
      REG = map; REG_AT = Date.now();
    }
  } catch (e) {}
  return REG || {};
}
const isKeep = p => KEEP.some(k => p === k || p.startsWith(k.endsWith('/') ? k : k + '/') || p === k + '/' || p.startsWith(k + '.'));

function upstreamReq(req, url, body) {
  const h = new Headers(req.headers);
  h.set('x-forwarded-host', APEX); h.set('x-apex-router', VERSION);
  for (const k of ['origin', 'referer']) {
    const v = h.get(k); if (v) h.set(k, v.replace(/^https:\/\/(www\.)?bucklerfamily\.estate/i, 'https://' + OLD));
  }
  h.delete('host');
  return new Request(url, { method: req.method, headers: h, body, redirect: 'manual' });
}

function fixLocation(loc, base) {
  if (!loc) return loc;
  try {
    const u = new URL(loc, base);
    if (u.hostname === OLD || u.hostname === APEX || u.hostname === 'www.' + APEX) return u.pathname + u.search + u.hash;
  } catch (e) {}
  return loc;
}

function rewriteText(s) {
  // Every cedwyn address reads the apex address (absolute, so scripts that build URLs keep working).
  return s.split('https://cedwyn.bucklerfamily.estate').join('https://' + APEX)
          .split('https:\\/\\/cedwyn.bucklerfamily.estate').join('https:\\/\\/' + APEX)
          .split('//cedwyn.bucklerfamily.estate').join('//' + APEX);
}

async function finish(r, reqUrl, path) {
  const h = new Headers(r.headers);
  h.set('x-apex-router', VERSION);
  if (r.status >= 300 && r.status < 400) {
    const loc = h.get('location'); if (loc) h.set('location', fixLocation(loc, reqUrl));
    return new Response(r.body, { status: r.status, headers: h });
  }
  const ct = h.get('content-type') || '';
  const len = +(h.get('content-length') || 0);
  if (TEXT.test(ct) && len < 3000000 && r.status !== 204 && r.status !== 304) {
    let t = await r.text(), o = rewriteText(t);
    // runtime.js maps absolute apex links "/" -> /dartboard/ (themes.json "apex" from the days the dartboard sat on the apex root).
    // The apex root is the site home now; drop that one entry until the themes.json fix ships (CUTOVER.md).
    if (path.startsWith('/_cedwyn/runtime.js')) o = o.split(', ["/", "dartboard"]]').join(']');
    // The header's registry nav (areas.json, the slot order and "NN of 59") only runs on the cedwyn hostname; let it run on the apex
    // too, so both hosts read the same header (fix at source: basecamp areasNav host check, CUTOVER.md).
    if (path.startsWith('/_cedwyn/ghf/basecamp.js'))
      o = o.split('location.hostname !== "cedwyn.bucklerfamily.estate"').join('!/^(cedwyn\\.)?bucklerfamily\\.estate$/.test(location.hostname)');
    if (o !== t) { h.delete('content-length'); h.delete('etag'); h.delete('content-encoding'); }
    return new Response(o, { status: r.status, headers: h });
  }
  return new Response(r.body, { status: r.status, headers: h });
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const host = url.hostname.toLowerCase();
    if (host === 'www.' + APEX) return Response.redirect('https://' + APEX + url.pathname + url.search, 301);
    if (url.pathname === '/__apex-router') return new Response(JSON.stringify({ version: VERSION, origin: env.ORIGIN }), { headers: { 'content-type': 'application/json' } });
    const path = url.pathname;
    // The page runtime prefixes root paths with the webapp folder, so the Cloudflare beacon arrives as /<app>/cdn-cgi/...:
    // hand it to the edge's own /cdn-cgi/ on the apex.
    const cdn = path.match(/^\/[^\/]+(?:\/[^\/]+)*?(\/cdn-cgi\/.*)$/);
    if (cdn) return fetch(new Request('https://' + APEX + cdn[1] + url.search, req));
    const buf = (req.method === 'GET' || req.method === 'HEAD') ? null : await req.arrayBuffer();
    if (isKeep(path)) {
      const k = await fetch(upstreamReq(req, env.APEX_PAGES + path + url.search, buf));
      if (k.status !== 404) return finish(k, req.url, path);
    }
    let r = await fetch(upstreamReq(req, env.ORIGIN + path + url.search, buf));
    const seg = path.split('/')[1] || '';
    // A flat /<name>/ that the site now keeps under a section (/online/, /argentina/, /wales/): serve it in place, 200.
    if (seg && !SECTIONS.includes(seg) && (r.status === 404 || (r.status >= 300 && r.status < 400))) {
      let alt = null;
      if (r.status >= 300) {
        try { const u = new URL(r.headers.get('location') || '', env.ORIGIN + path);
          const m = u.pathname.match(/^\/(online|argentina|wales)\/([^\/]+)\//);
          if ((u.hostname === OLD || u.hostname === APEX) && m && m[2] === seg) alt = u.pathname + u.search; } catch (e) {}
      }
      if (!alt && r.status === 404) {
        const reg = await registry(env);
        if (reg[seg]) alt = reg[seg].replace(/\/$/, '') + path.slice(seg.length + 1) + url.search;
      }
      if (alt) {
        const r2 = await fetch(upstreamReq(req, env.ORIGIN + alt, buf));
        if (r2.status < 300) r = r2;
      }
      if (r.status === 404) {
        for (const s of SECTIONS) {
          const r3 = await fetch(upstreamReq(req, env.ORIGIN + '/' + s + path + url.search, buf));
          if (r3.status === 200) { r = r3; break; }
        }
      }
    }
    // (no catch-all fallback to the apex Pages project: its single-page fallback answers 200 for any path)
    return finish(r, req.url, path);
  }
};

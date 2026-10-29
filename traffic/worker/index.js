// cedwyn-traffic Worker: read-only traffic feed and remote MCP server (streamable HTTP, JSON responses) for agents.
// Serves /traffic.json, /mcp, /academy/traffic/ and /.well-known/mcp.json on cedwyn.bucklerfamily.estate.
// Data is an aggregate-only snapshot (data.txt) uploaded by work/cedwyn-traffic/deploy.py. — Sion's Tab agent
import DATA_TXT from './data.txt';
const D = JSON.parse(DATA_TXT);
const PUB = D.public;            // the published traffic.json
const DAILY = D.daily_detail;    // per-day aggregates (top paths, sections, countries) for any window 1-30 days
const PROTO = '2025-06-18';
const SERVER = { name: 'cedwyn-traffic', version: '1.0.0', title: 'Cedwyn traffic (read-only)' };
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type, mcp-session-id, mcp-protocol-version, accept', 'access-control-expose-headers': 'mcp-session-id' };
const J = (o, s = 200, h = {}) => new Response(JSON.stringify(o, null, 1), { status: s, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=300', ...CORS, ...h } });
const clampDays = d => { d = parseInt(d ?? 7, 10); if (!Number.isFinite(d)) d = 7; return Math.max(1, Math.min(30, d)); };
const keys = Object.keys(DAILY).sort();
function windowOf(days) {
  const sel = keys.slice(-days); const add = (m, o) => { for (const k in o) m[k] = (m[k] || 0) + o[k]; };
  const t = { ext: 0, human: 0, bots: 0, susp: 0, visits: 0, home: 0, eb: 0, ebx: 0, paths: {}, secs: {}, cc: {} };
  for (const k of sel) { const x = DAILY[k]; t.ext += x.ext; t.human += x.human; t.bots += x.bots; t.susp += x.susp; t.visits += x.visits;
    t.home += x.home; t.eb += x.eb; t.ebx += x.ebx; add(t.paths, x.paths); add(t.secs, x.secs); add(t.cc, x.cc); }
  const top = (m, n, kn) => Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => ({ [kn]: k, views: v }));
  const r = v => t.ext ? Math.round(v / t.ext * 1000) / 1000 : null;
  return { t, sel, top, r };
}
function summary(days) {
  const { t, sel, top, r } = windowOf(clampDays(days));
  return { site: PUB.site, generated_at: PUB.generated_at, days_requested: clampDays(days), days_available: sel.length, from: sel[0] || null, to: sel[sel.length - 1] || null,
    page_views_excl_own_tooling: t.ext, page_views_likely_human: t.human, visits_likely_human: t.visits,
    share: { likely_human: r(t.human), bots_crawlers: r(t.bots), suspected_automation: r(t.susp) },
    uk_page_views_likely_human: t.cc.GB || 0, top_countries_likely_human: top(t.cc, 10, 'country'),
    home_to_ebooks: { home_views: t.home, ebooks_views: t.eb, ebooks_index_views: t.ebx, ebooks_index_per_home_view: t.home ? Math.round(t.ebx / t.home * 1000) / 1000 : null,
      method: 'likely-human views of /ebooks/ divided by likely-human views of /; a ratio of page views, not a tracked click path' },
    daily: sel.map(k => ({ date: k, complete: DAILY[k].complete, page_views_excl_own_tooling: DAILY[k].ext, page_views_likely_human: DAILY[k].human, uk_likely_human: DAILY[k].cc.GB || 0 })),
    definitions: PUB.definitions, privacy: PUB.privacy, source: PUB.source };
}
function topPages(days, limit) {
  const { t, sel, top } = windowOf(clampDays(days)); const n = Math.max(1, Math.min(50, parseInt(limit ?? 20, 10) || 20));
  return { site: PUB.site, generated_at: PUB.generated_at, days_requested: clampDays(days), days_available: sel.length, from: sel[0] || null, to: sel[sel.length - 1] || null,
    counted: 'likely-human page views', top_paths: top(t.paths, n, 'path'), top_sections: top(t.secs, 15, 'section') };
}
const TOOLS = [
  { name: 'get_traffic_summary', title: 'Traffic summary', description: 'Aggregate traffic for cedwyn.bucklerfamily.estate over the last N days (1-30): page views, likely-human share vs bots and automation, UK views, top countries, home to /ebooks/ ratio and a daily series. Aggregates only.',
    inputSchema: { type: 'object', properties: { days: { type: 'integer', minimum: 1, maximum: 30, default: 7, description: 'Window in days, ending with the latest refresh' } } },
    annotations: { readOnlyHint: true, openWorldHint: false } },
  { name: 'get_top_pages', title: 'Top pages', description: 'Most-viewed paths and sections of cedwyn.bucklerfamily.estate by likely-human page views over the last N days (1-30).',
    inputSchema: { type: 'object', properties: { days: { type: 'integer', minimum: 1, maximum: 30, default: 7 }, limit: { type: 'integer', minimum: 1, maximum: 50, default: 20 } } },
    annotations: { readOnlyHint: true, openWorldHint: false } } ];

// ---- Auth0 gate and GA4 adapter (switched on by Worker variables; until then: open, read-only, aggregates, Cloudflare source) ----
// Variables (plain text): AUTH0_DOMAIN (e.g. tenant.eu.auth0.com), AUTH0_AUDIENCE (API identifier), AUTH_REQUIRED ("true" to enforce),
//   GA4_PROPERTY_ID (numeric). Secrets: GA_SA_EMAIL, GA_SA_KEY (service account private key PEM, Viewer on the GA4 property).
let JWKS = null, JWKS_AT = 0, GTOK = null, GTOK_EXP = 0;
const b64u = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), c => c.charCodeAt(0));
const b64uEnc = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const authOn = env => !!(env && env.AUTH0_DOMAIN && env.AUTH0_AUDIENCE && String(env.AUTH_REQUIRED || 'true') === 'true');
async function verifyAuth0(req, env) {
  const h = req.headers.get('authorization') || ''; const m = h.match(/^Bearer\s+(.+)$/i); if (!m) return 'missing bearer token';
  const [hb, pb, sb] = m[1].split('.'); if (!sb) return 'malformed token';
  const head = JSON.parse(new TextDecoder().decode(b64u(hb))); const pl = JSON.parse(new TextDecoder().decode(b64u(pb)));
  if (head.alg !== 'RS256') return 'alg must be RS256';
  const iss = 'https://' + env.AUTH0_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '') + '/';
  if (pl.iss !== iss) return 'wrong issuer';
  const aud = Array.isArray(pl.aud) ? pl.aud : [pl.aud]; if (!aud.includes(env.AUTH0_AUDIENCE)) return 'wrong audience';
  const now = Date.now() / 1000; if (!(pl.exp > now) || (pl.nbf && pl.nbf > now + 60)) return 'token expired';
  if (!JWKS || Date.now() - JWKS_AT > 3600e3) { JWKS = (await (await fetch(iss + '.well-known/jwks.json')).json()).keys; JWKS_AT = Date.now(); }
  const jwk = JWKS.find(k => k.kid === head.kid); if (!jwk) return 'unknown signing key';
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64u(sb), new TextEncoder().encode(hb + '.' + pb));
  return ok ? null : 'bad signature';
}
async function googleToken(env) {
  if (GTOK && Date.now() / 1000 < GTOK_EXP - 60) return GTOK;
  const now = Math.floor(Date.now() / 1000); const enc = o => b64uEnc(new TextEncoder().encode(JSON.stringify(o)));
  const unsigned = enc({ alg: 'RS256', typ: 'JWT' }) + '.' + enc({ iss: env.GA_SA_EMAIL, scope: 'https://www.googleapis.com/auth/analytics.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 });
  const pem = env.GA_SA_KEY.replace(/\\n/g, '\n').replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const key = await crypto.subtle.importKey('pkcs8', Uint8Array.from(atob(pem), c => c.charCodeAt(0)), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned));
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + unsigned + '.' + b64uEnc(sig) });
  const j = await r.json(); if (!j.access_token) throw new Error('google token: ' + (j.error || r.status)); GTOK = j.access_token; GTOK_EXP = now + (j.expires_in || 3600); return GTOK;
}
const gaOn = env => !!(env && env.GA4_PROPERTY_ID && env.GA_SA_EMAIL && env.GA_SA_KEY);
async function ga(env, body) {
  const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${env.GA4_PROPERTY_ID}:runReport`, { method: 'POST',
    headers: { authorization: 'Bearer ' + await googleToken(env), 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json(); if (!r.ok) throw new Error('GA4 ' + r.status + ': ' + (j.error && j.error.message || '')); return j.rows || [];
}
async function gaSummary(env, days) {
  const dr = [{ startDate: (days - 1) + 'daysAgo', endDate: 'today' }]; const M = [{ name: 'screenPageViews' }, { name: 'sessions' }, { name: 'activeUsers' }];
  const daily = await ga(env, { dateRanges: dr, dimensions: [{ name: 'date' }], metrics: M, orderBys: [{ dimension: { dimensionName: 'date' } }] });
  const cc = await ga(env, { dateRanges: dr, dimensions: [{ name: 'countryId' }], metrics: [{ name: 'screenPageViews' }], limit: 10, orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }] });
  const pg = await ga(env, { dateRanges: dr, dimensions: [{ name: 'pagePath' }], metrics: [{ name: 'screenPageViews' }], limit: 500,
    dimensionFilter: { orGroup: { expressions: [{ filter: { fieldName: 'pagePath', stringFilter: { matchType: 'EXACT', value: '/' } } }, { filter: { fieldName: 'pagePath', stringFilter: { matchType: 'BEGINS_WITH', value: '/ebooks/' } } }] } } });
  const n = (row, i) => +row.metricValues[i].value; const tot = i => daily.reduce((a, r) => a + n(r, i), 0);
  const home = pg.filter(r => r.dimensionValues[0].value === '/').reduce((a, r) => a + n(r, 0), 0);
  const ebx = pg.filter(r => r.dimensionValues[0].value === '/ebooks/').reduce((a, r) => a + n(r, 0), 0);
  const eb = pg.filter(r => r.dimensionValues[0].value.startsWith('/ebooks/')).reduce((a, r) => a + n(r, 0), 0);
  return { source: 'ga4', site: PUB.site, days_requested: days, page_views: tot(0), sessions: tot(1), active_users: tot(2),
    uk_page_views: (cc.find(r => r.dimensionValues[0].value === 'GB') || { metricValues: [{ value: 0 }] }).metricValues[0].value * 1,
    top_countries: cc.map(r => ({ country: r.dimensionValues[0].value, views: n(r, 0) })),
    home_to_ebooks: { home_views: home, ebooks_views: eb, ebooks_index_views: ebx, ebooks_index_per_home_view: home ? Math.round(ebx / home * 1000) / 1000 : null },
    daily: daily.map(r => ({ date: r.dimensionValues[0].value, page_views: n(r, 0), sessions: n(r, 1), active_users: n(r, 2) })),
    note: 'Google Analytics 4 (bots filtered by Google). Aggregates only.' };
}
async function gaTopPages(env, days, limit) {
  const rows = await ga(env, { dateRanges: [{ startDate: (days - 1) + 'daysAgo', endDate: 'today' }], dimensions: [{ name: 'pagePath' }], metrics: [{ name: 'screenPageViews' }], limit, orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }] });
  return { source: 'ga4', site: PUB.site, days_requested: days, top_paths: rows.map(r => ({ path: r.dimensionValues[0].value, views: +r.metricValues[0].value })) };
}
async function callTool(env, name, a) {
  const days = clampDays(a.days); const limit = Math.max(1, Math.min(50, parseInt(a.limit ?? 20, 10) || 20));
  if (gaOn(env)) { try { return name === 'get_traffic_summary' ? await gaSummary(env, days) : await gaTopPages(env, days, limit); }
    catch (e) { const o = name === 'get_traffic_summary' ? summary(days) : topPages(days, limit); return { ...o, source: 'cloudflare', source_detail: PUB.source, ga4_error: String(e.message || e).slice(0, 200) }; } }
  const o = name === 'get_traffic_summary' ? summary(days) : topPages(days, limit); return { ...o, source: 'cloudflare', source_detail: PUB.source };
}

async function rpc(m, env) {
  const id = m.id ?? null; const ok = result => ({ jsonrpc: '2.0', id, result }); const er = (code, message) => ({ jsonrpc: '2.0', id, error: { code, message } });
  if (!m || m.jsonrpc !== '2.0' || typeof m.method !== 'string') return er(-32600, 'Invalid Request');
  if (m.id === undefined) return null; // notification
  const p = m.params || {};
  switch (m.method) {
    case 'initialize': return ok({ protocolVersion: [PROTO, '2025-03-26', '2024-11-05'].includes(p.protocolVersion) ? p.protocolVersion : PROTO,
      capabilities: { tools: { listChanged: false } }, serverInfo: SERVER,
      instructions: 'Read-only traffic aggregates for cedwyn.bucklerfamily.estate. Source: ' + (gaOn(env) ? 'Google Analytics 4' : 'Cloudflare edge analytics') + '; every tool result names its source. No personal data. Also at /traffic.json.' });
    case 'ping': return ok({});
    case 'tools/list': return ok({ tools: TOOLS });
    case 'tools/call': {
      const a = p.arguments || {};
      if (p.name !== 'get_traffic_summary' && p.name !== 'get_top_pages') return er(-32602, 'Unknown tool: ' + p.name);
      const out = await callTool(env, p.name, a);
      return ok({ content: [{ type: 'text', text: JSON.stringify(out) }], structuredContent: out, isError: false });
    }
    case 'resources/list': return ok({ resources: [] });
    case 'prompts/list': return ok({ prompts: [] });
    default: return er(-32601, 'Method not found: ' + m.method);
  }
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function page() {
  const w = PUB.last_7_days; const pct = v => v == null ? 'n/a' : (v * 100).toFixed(1) + '%';
  const rows = PUB.daily.map(d => `<tr><td>${esc(d.date)}${d.complete ? '' : ' (partial)'}</td><td>${d.page_views_excl_own_tooling}</td><td>${d.page_views_likely_human}</td><td>${d.uk_likely_human}</td></tr>`).join('');
  const paths = w.top_paths_likely_human.map(p => `<li><code>${esc(p.path)}</code> ${p.views}</li>`).join('');
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Traffic feed for agents · Cedwyn Academy</title>
<link rel="alternate" type="application/json" href="/traffic.json"><style>body{font:16px/1.55 system-ui,sans-serif;background:#14141c;color:#eee;margin:0;padding:20px}main{max-width:760px;margin:auto}code{color:#f8dba0;overflow-wrap:anywhere}table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #333;padding:4px 6px;text-align:left;font-size:.9rem}a{color:#f8dba0}</style></head><body><main>
<p>Cedwyn Academy · machine-facing</p><h1>Traffic feed for agents</h1>
<p>Aggregate traffic for this site from Cloudflare edge analytics. No Google Analytics, no cookies, no personal data. Refreshed ${esc(PUB.generated_at)}.</p>
<h2>How to read it</h2><ul><li>JSON: <a href="/traffic.json"><code>/traffic.json</code></a></li><li>MCP (streamable HTTP, JSON-RPC over POST): <code>https://cedwyn.bucklerfamily.estate/mcp</code>, tools <code>get_traffic_summary(days)</code> and <code>get_top_pages(days)</code></li><li>Server card: <a href="/.well-known/mcp.json"><code>/.well-known/mcp.json</code></a></li></ul>
<h2>Last 7 days</h2><p>${w.page_views_excl_own_tooling} page views (own tooling excluded); likely human ${w.page_views_likely_human} (${pct(w.share.likely_human)}); bots and crawlers ${pct(w.share.bots_crawlers)}; suspected automation ${pct(w.share.suspected_automation)}; UK likely human ${w.uk_page_views_likely_human}; /ebooks/ views per home view ${w.home_to_ebooks.ebooks_index_per_home_view}.</p>
<table><tr><th>Day</th><th>Views</th><th>Likely human</th><th>UK</th></tr>${rows}</table><h2>Top pages (likely human, 7 days)</h2><ol>${paths}</ol>
<p>Definitions are in the JSON. "Likely human" is an upper bound.</p></main></body></html>`;
}
export default {
  async fetch(req, env) {
    const u = new URL(req.url); const p = u.pathname;
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    if (p === '/traffic.json') return J(PUB);
    if (p === '/.well-known/mcp.json') return J({ name: SERVER.name, title: SERVER.title, version: SERVER.version, description: 'Read-only traffic aggregates for cedwyn.bucklerfamily.estate.',
      transport: { type: 'streamable-http', url: 'https://cedwyn.bucklerfamily.estate/mcp' }, endpoints: [{ url: 'https://cedwyn.bucklerfamily.estate/mcp', transport: 'streamable-http' }],
      tools: TOOLS.map(t => ({ name: t.name, description: t.description })), authentication: 'none', data: '/traffic.json', docs: '/academy/traffic/' });
    if (p === '/academy/traffic' || p === '/academy/traffic/' || p === '/academy/traffic/index.html') {
      if (p === '/academy/traffic') return Response.redirect(u.origin + '/academy/traffic/', 301);
      return new Response(page(), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300', 'x-robots-tag': 'noindex' } }); }
    if (p === '/academy/traffic.json' || p === '/academy/traffic/traffic.json') return J(PUB);
    if (p === '/mcp/oauth-protected-resource' || p === '/.well-known/oauth-protected-resource/mcp') return J({ resource: u.origin + '/mcp',
      authorization_servers: env && env.AUTH0_DOMAIN ? ['https://' + env.AUTH0_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '') + '/'] : [],
      bearer_methods_supported: ['header'], scopes_supported: [], auth_required: authOn(env), audience: (env && env.AUTH0_AUDIENCE) || null });
    if (p === '/mcp' || p === '/mcp/') {
      if (req.method === 'GET') {
        if ((req.headers.get('accept') || '').includes('text/event-stream')) return new Response('This server answers JSON over POST only; no SSE stream.', { status: 405, headers: { allow: 'POST', ...CORS } });
        return J({ server: SERVER, protocol: PROTO, auth: authOn(env) ? 'Auth0 bearer token (RS256)' : 'open, read-only aggregates', source: gaOn(env) ? 'ga4' : 'cloudflare', transport: 'streamable-http (POST JSON-RPC 2.0; JSON responses)', tools: TOOLS.map(t => t.name), data: '/traffic.json', docs: '/academy/traffic/' });
      }
      if (req.method === 'DELETE') return new Response(null, { status: 204, headers: CORS });
      if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { allow: 'GET, POST', ...CORS } });
      if (authOn(env)) { const why = await verifyAuth0(req, env).catch(e => 'auth check failed');
        if (why) return J({ jsonrpc: '2.0', id: null, error: { code: -32001, message: 'Unauthorized: ' + why } }, 401,
          { 'www-authenticate': `Bearer realm="cedwyn-traffic", resource_metadata="${u.origin}/mcp/oauth-protected-resource"` }); }
      let body; try { body = await req.json(); } catch { return J({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }, 400); }
      const sid = req.headers.get('mcp-session-id') || crypto.randomUUID();
      const h = { 'mcp-session-id': sid, 'cache-control': 'no-store' };
      if (Array.isArray(body)) { const out = (await Promise.all(body.map(x => rpc(x, env)))).filter(Boolean); return out.length ? J(out, 200, h) : new Response(null, { status: 202, headers: { ...CORS, ...h } }); }
      const out = await rpc(body, env); return out ? J(out, 200, h) : new Response(null, { status: 202, headers: { ...CORS, ...h } });
    }
    return fetch(req); // anything else passes through to the site
  }
};

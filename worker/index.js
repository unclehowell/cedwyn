// cedwyn-blog — the Cedwyn blog, its feeds and the daily auto-post. Sion's Tab agent, 27 Oct 2026.
// fetch: /blog/ (index), /blog/p/<slug>/ (post), /blog/rss.xml, /blog/atom.xml, /blog/feed.json, /blog/news-sitemap.xml
// scheduled (cron): picks a Cedwyn page not yet covered, drafts a short post with Workers AI (binding AI, free tier, no key),
// grounds and scans it, publishes to KV (BLOG) or holds it as a draft, then pings IndexNow and the WebSub hub.
import { SEED, CANDIDATES } from './data.js';
const ORIGIN = 'https://cedwyn.bucklerfamily.estate';
const BLOG = ORIGIN + '/blog/';
const SITE_TITLE = 'Cedwyn · Great House Farm (Tŷ Mawr) blog';
const SITE_DESC = 'Short posts on the history, heritage and records of Great House Farm (Tŷ Mawr), Llandough, each linked to its record on Cedwyn.';
const DEFAULT_IMG = ORIGIN + '/maps/img/og.jpg';
const INDEXNOW_KEY = 'fa677e0431be909a80ac62103516fbd0';
const HUB = 'https://pubsubhubbub.appspot.com/';
const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const FEEDS = ['rss.xml', 'atom.xml', 'feed.json', 'news-sitemap.xml'];

// ---------- guardrails (also run on every seed at deploy time)
const BANNED = /\b(says|said|saying|claims?|claimed|according to|hearsay|unverified|alleged(ly)?|allegations?|fraud\w*|stolen|steal\w*|theft|si[oô]n|heraldr\w*|heraldic|coats? of arms|armorial|crest|1547|1552)\b/i;
const ACCUSE = /\b(lie[sd]?|lying|liars?|criminal\w*|crimes?|corrupt\w*|conspir\w*|cover[- ]?ups?|guilty|illegal\w*|unlawful\w*|forg(ed|ery|eries)|deceit\w*|deceiv\w*|dishonest\w*|scandal\w*|villain\w*|thie(f|ves)|bribe\w*|perjur\w*|malice|malicious|shredd\w*|destroy\w*|destruction|conceal\w*|synthetic|suppress\w*|hidden|hiding|manipulat\w*|fabricat\w*|tamper\w*|wrongdoing|misconduct|unjust\w*|injustice|victims?)\b/i;
const FINDING = /\b(proves?|proven|proof that|established that|confirms? that|demonstrates? that|it is clear that|undoubtedly|definitely|without doubt)\b/i;
const PRIVATE = /\b(subject access|SAR|hospital|diagnos\w*|illness|cancer|dementia|medical|medication|disabilit\w*|mental health|home address|phone|telephone|mobile)\b/i;
const PHONE = /(\+?\d[\d ()-]{8,}\d)/;
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.]+/;
const POSTCODE = /\b[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}\b/i;
const STREET = /\b\d+[a-z]?\s+[A-Z][a-z]+\s+(Road|Street|Lane|Avenue|Close|Drive|Way|Crescent|Court|Place|Terrace|Gardens)\b/;
const STOP = new Set(['with','that','this','from','also','which','their','these','those','there','into','onto','over','under','about','each','every','such','both','them','they','were','have','been','being','will','would','could','should','page','pages','site','includes','include','including','shows','show','showing','offers','provides','presents','features','contains','listed','lists','other','more','most','some','many','well','here','where','when','what','your','within','between','after','before','while']);
const OK_PROPER = new Set(['The','A','An','In','On','At','From','For','Its','It','This','That','These','Those','Each','Every','Today','Cedwyn','Read','Record','Records','Tŷ','Mawr','Great','House','Farm','Wales','Welsh','Llandough','And','But','By','With','Of','As','When','Where','He','She','They','His','Her','Their','There','Some','One','Two','Three','After','Before','During','Since','Until','Around','About','More','Most','Many','No','Not','Who','What','Which','How','Why','We','Our','You','Your','I']);
function scan(post, sourceText) {
  const text = [post.title, post.summary, ...(post.body || [])].join(' \n ');
  const why = [];
  for (const [name, rx] of [['banned word', BANNED], ['accusation word', ACCUSE], ['finding word', FINDING], ['private matter', PRIVATE], ['phone number', PHONE], ['email address', EMAIL], ['postcode', POSTCODE], ['street address', STREET]]) {
    const m = text.match(rx); if (m) why.push(name + ': ' + m[0]);
  }
  if (/\bArgentin|Patagoni|Chubut|Trelew|Gaiman/i.test(text) && post.half !== 'patagonia') why.push('mixes Argentina into a Wales post');
  if (sourceText) {   // grounding: every number and every proper name must already be in the Cedwyn page text
    const src = sourceText.toLowerCase().replace(/[–—‐]/g, '-');
    for (const n of new Set(text.match(/\b\d[\d,.]*\d\b|\b\d\b/g) || [])) if (!src.includes(n.toLowerCase())) why.push('number not in source: ' + n);
    const words = text.replace(/[–—‐]/g, '-').replace(/[“”"‘’'()\[\]:;,.!?]/g, ' ').split(/\s+/);
    for (let i = 1; i < words.length; i++) {
      const w = words[i]; if (!/^[A-ZŴŶÂÊÎÔÛ][\wŵŷâêîôû-]{2,}$/.test(w) || OK_PROPER.has(w)) continue;
      if (!src.includes(w.toLowerCase())) why.push('name not in source: ' + w);
    }
  }
  if (sourceText) {   // each sentence must be built from the page's own words (at least 75% of its longer words appear in the page)
    const src = ' ' + sourceText.toLowerCase().replace(/[^a-z0-9ŵŷâêîôû\s]/g, ' ').replace(/\s+/g, ' ') + ' ';
    for (const s of [post.summary, ...(post.body || [])].join(' ').split(/(?<=[.!?])\s+/)) {
      const ws = s.toLowerCase().replace(/[^a-z0-9ŵŷâêîôû\s]/g, ' ').split(/\s+/).filter(w => w.length >= 4 && !STOP.has(w));
      if (ws.length < 3) continue;
      const hit = ws.filter(w => src.includes(' ' + w) ).length / ws.length;
      if (hit < 0.75) why.push('sentence not built from the page: ' + s.slice(0, 80));
    }
  }
  const len = text.length;
  if (len < 200) why.push('too short'); if (len > 2600) why.push('too long');
  return [...new Set(why)];
}

// ---------- data
async function allPosts(env) {
  let gen = [];
  try { gen = JSON.parse((await env.BLOG.get('posts')) || '[]'); } catch (e) { gen = []; }
  const seen = new Set(); const out = [];
  for (const p of [...gen, ...SEED]) { if (!seen.has(p.slug)) { seen.add(p.slug); out.push(p); } }
  out.sort((a, b) => (a.date < b.date ? 1 : -1));
  return out;
}
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const postUrl = p => BLOG + 'p/' + p.slug + '/';
const srcUrl = p => ORIGIN + p.source;
const rfc822 = d => new Date(d).toUTCString();
function postHtml(p) {
  return (p.body || []).map(t => '<p>' + esc(t) + '</p>').join('') +
    '<p><a href="' + esc(srcUrl(p)) + '">Read the record on Cedwyn: ' + esc(srcUrl(p).replace('https://', '')) + '</a></p>';
}

// ---------- feeds
function rss(posts) {
  const items = posts.map(p => `<item><title>${esc(p.title)}</title><link>${postUrl(p)}</link><guid isPermaLink="true">${postUrl(p)}</guid><pubDate>${rfc822(p.date)}</pubDate><description>${esc(p.summary)}</description><content:encoded><![CDATA[<p><img src="${esc(p.image || DEFAULT_IMG)}" alt="${esc(p.title)}"/></p>${postHtml(p)}]]></content:encoded><source url="${BLOG}rss.xml">${esc(SITE_TITLE)}</source>${(p.tags || []).map(t => `<category>${esc(t)}</category>`).join('')}${p.image_bytes ? `<enclosure url="${esc(p.image)}" length="${p.image_bytes}" type="${/\.png$/i.test(p.image || '') ? 'image/png' : /\.webp$/i.test(p.image || '') ? 'image/webp' : 'image/jpeg'}"/>` : ''}<media:content url="${esc(p.image || DEFAULT_IMG)}" medium="image"/></item>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/"><channel><title>${esc(SITE_TITLE)}</title><link>${BLOG}</link><description>${esc(SITE_DESC)}</description><language>en-gb</language><lastBuildDate>${rfc822(posts[0] ? posts[0].date : Date.now())}</lastBuildDate><atom:link href="${BLOG}rss.xml" rel="self" type="application/rss+xml"/><atom:link href="${HUB}" rel="hub"/><image><url>${DEFAULT_IMG}</url><title>${esc(SITE_TITLE)}</title><link>${BLOG}</link></image>${items}</channel></rss>`;
}
function atom(posts) {
  const entries = posts.map(p => `<entry><title>${esc(p.title)}</title><id>${postUrl(p)}</id><link rel="alternate" type="text/html" href="${postUrl(p)}"/><link rel="related" type="text/html" href="${esc(srcUrl(p))}"/>${p.image_bytes ? `<link rel="enclosure" type="image/jpeg" length="${p.image_bytes}" href="${esc(p.image)}"/>` : ''}<published>${new Date(p.date).toISOString()}</published><updated>${new Date(p.updated || p.date).toISOString()}</updated><summary>${esc(p.summary)}</summary><content type="html">${esc('<p><img src="' + (p.image || DEFAULT_IMG) + '" alt=""/></p>' + postHtml(p))}</content>${(p.tags || []).map(t => `<category term="${esc(t)}"/>`).join('')}</entry>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en-GB"><title>${esc(SITE_TITLE)}</title><subtitle>${esc(SITE_DESC)}</subtitle><id>${BLOG}</id><link rel="self" type="application/atom+xml" href="${BLOG}atom.xml"/><link rel="alternate" type="text/html" href="${BLOG}"/><link rel="hub" href="${HUB}"/><updated>${new Date(posts[0] ? (posts[0].updated || posts[0].date) : Date.now()).toISOString()}</updated><author><name>Cedwyn editors</name><uri>${ORIGIN}/</uri></author><icon>${ORIGIN}/estate/favicon-32.png</icon><logo>${DEFAULT_IMG}</logo>${entries}</feed>`;
}
function jsonFeed(posts) {
  return JSON.stringify({
    version: 'https://jsonfeed.org/version/1.1', title: SITE_TITLE, home_page_url: BLOG, feed_url: BLOG + 'feed.json', description: SITE_DESC,
    icon: DEFAULT_IMG, favicon: ORIGIN + '/estate/favicon-32.png', language: 'en-GB', authors: [{ name: 'Cedwyn editors', url: ORIGIN + '/' }],
    hubs: [{ type: 'WebSub', url: HUB }],
    items: posts.map(p => ({ id: postUrl(p), url: postUrl(p), external_url: srcUrl(p), title: p.title, summary: p.summary, content_html: postHtml(p),
      content_text: (p.body || []).join('\n\n') + '\n\nRead the record on Cedwyn: ' + srcUrl(p), image: p.image || DEFAULT_IMG, banner_image: p.image || DEFAULT_IMG,
      date_published: new Date(p.date).toISOString(), date_modified: new Date(p.updated || p.date).toISOString(), tags: p.tags || [], language: 'en-GB' }))
  }, null, 1);
}
function newsSitemap(posts) {
  const cut = Date.now() - 2 * 86400e3;   // Google News sitemaps list articles from the last two days
  let recent = posts.filter(p => new Date(p.date).getTime() >= cut);
  if (!recent.length) recent = posts.slice(0, 1);
  const urls = recent.map(p => `<url><loc>${postUrl(p)}</loc><news:news><news:publication><news:name>Cedwyn</news:name><news:language>en</news:language></news:publication><news:publication_date>${new Date(p.date).toISOString()}</news:publication_date><news:title>${esc(p.title)}</news:title></news:news><image:image><image:loc>${esc(p.image || DEFAULT_IMG)}</image:loc></image:image></url>`).join('');
  const all = posts.filter(p => !recent.includes(p)).map(p => `<url><loc>${postUrl(p)}</loc><lastmod>${new Date(p.updated || p.date).toISOString()}</lastmod></url>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"><url><loc>${BLOG}</loc><changefreq>daily</changefreq></url>${urls}${all}</urlset>`;
}

// ---------- HTML (the built /blog/ shell carries Cedwyn's shared header; a plain page stands in until it exists)
const DISCOVERY = `<link rel="alternate" type="application/rss+xml" title="Cedwyn blog (RSS)" href="/blog/rss.xml"><link rel="alternate" type="application/atom+xml" title="Cedwyn blog (Atom)" href="/blog/atom.xml"><link rel="alternate" type="application/feed+json" title="Cedwyn blog (JSON Feed)" href="/blog/feed.json">`;
function card(p) {
  return `<article class="bl-card"><a href="/blog/p/${esc(p.slug)}/"><img loading="lazy" src="${esc((p.image || DEFAULT_IMG).replace(ORIGIN, ''))}" alt=""><h2>${esc(p.title)}</h2></a><p>${esc(p.summary)}</p><time datetime="${esc(p.date)}">${new Date(p.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London' })}</time></article>`;
}
function indexMain(posts) { return `<h1>Blog</h1><div class="bl-list">${posts.map(card).join('')}</div><p class="bl-feeds"><a href="/blog/rss.xml">RSS</a> · <a href="/blog/atom.xml">Atom</a> · <a href="/blog/feed.json">JSON Feed</a></p>`; }
function postMain(p) {
  return `<article class="bl-post"><p class="bl-date"><time datetime="${esc(p.date)}">${new Date(p.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London' })}</time></p><h1>${esc(p.title)}</h1><img src="${esc((p.image || DEFAULT_IMG).replace(ORIGIN, ''))}" alt=""><p class="bl-sum">${esc(p.summary)}</p>${postHtml(p).replace(/https:\/\/cedwyn\.bucklerfamily\.estate(?=\/)/g, '')}<p class="bl-back"><a href="/blog/">← Blog</a></p></article>`;
}
function head(meta) {
  const ld = meta.ld ? `<script type="application/ld+json">${JSON.stringify(meta.ld).replace(/</g, '\\u003c')}</script>` : '';
  return `<title>${esc(meta.title)}</title><meta name="description" content="${esc(meta.desc)}"><link rel="canonical" href="${esc(meta.url)}"><meta property="og:type" content="${meta.ld ? 'article' : 'website'}"><meta property="og:title" content="${esc(meta.title)}"><meta property="og:description" content="${esc(meta.desc)}"><meta property="og:url" content="${esc(meta.url)}"><meta property="og:image" content="${esc(meta.image)}"><meta name="twitter:card" content="summary_large_image">${DISCOVERY}${ld}`;
}
const CSS = `.bl-wrap{max-width:760px;margin:0 auto;padding:16px}.bl-wrap h1{font-size:clamp(1.6rem,6vw,2.4rem);line-height:1.15;margin:.4em 0}.bl-list{display:grid;gap:18px}.bl-card{border:1px solid #ffffff22;border-radius:10px;overflow:hidden;padding-bottom:10px}.bl-card a{color:inherit;text-decoration:none}.bl-card img,.bl-post img{width:100%;max-height:300px;object-fit:cover;display:block}.bl-card h2{font-size:1.15rem;margin:10px 12px 4px}.bl-card p,.bl-card time{margin:4px 12px;display:block}.bl-card time,.bl-date{opacity:.7;font-size:.85rem}.bl-post p{line-height:1.6}.bl-sum{font-weight:600}.bl-feeds{margin-top:24px;opacity:.8;font-size:.9rem}.bl-wrap a{overflow-wrap:anywhere}`;
function plainPage(meta, main) {
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#14141c">${head(meta)}<style>:root{color-scheme:dark;font:16px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif;background:#14141c;color:#f1f1f7}body{margin:0}a{color:#9fc2ff}.bl-top{padding:12px 16px;border-bottom:1px solid #ffffff1a}.bl-top a{color:#f1f1f7;text-decoration:none;font-weight:600}${CSS}</style></head><body><header class="bl-top"><a href="/">Cedwyn</a></header><main class="bl-wrap" id="blog-main">${main}</main></body></html>`;
}
async function render(meta, main) {
  try {
    const r = await fetch(BLOG + '?shell=1', { cf: { cacheTtl: 300, cacheEverything: true } });
    if (r.ok && (r.headers.get('content-type') || '').includes('text/html')) {
      const txt = await r.text();
      if (txt.includes('id="blog-main"')) {
        const res = new HTMLRewriter()
          .on('title', { element(e) { e.remove(); } })
          .on('meta[name="description"],link[rel="canonical"],meta[property^="og:"],meta[name^="twitter:"]', { element(e) { e.remove(); } })
          .on('head', { element(e) { e.append(head(meta) + `<style>${CSS}</style>`, { html: true }); } })
          .on('#blog-main', { element(e) { e.setInnerContent(main, { html: true }); } })
          .on('link[href="blog.css"]', { element(e) { e.setAttribute('href', '/blog/blog.css'); } })
          .transform(new Response(txt, { headers: { 'content-type': 'text/html; charset=utf-8' } }));
        return new Response(res.body, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300' } });
      }
    }
  } catch (e) { }
  return new Response(plainPage(meta, main), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300' } });
}

// ---------- auto-post
function pageText(html) {
  let s = html.replace(/<(script|style|noscript|svg|template)[^>]*>[\s\S]*?<\/\1>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ');
  s = s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;|&#39;|&rsquo;/g, '’').replace(/&quot;/g, '"').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ');
  for (const cut of ['For agents · Docs', 'Page version & change log', 'FOR AI AGENTS']) { const i = s.indexOf(cut); if (i > 300) s = s.slice(0, i); }
  return s.trim();
}
function slugify(t) { return t.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70); }
async function draftFrom(env, cand) {
  const r = await fetch(ORIGIN + cand.path, { headers: { 'user-agent': 'cedwyn-blog/1.0' } });
  if (!r.ok) return { skip: 'page ' + r.status };
  const html = await r.text();
  const ogi = (html.match(/property="og:image"[^>]*content="([^"]+)"/) || html.match(/content="([^"]+)"[^>]*property="og:image"/) || [])[1];
  const text = pageText(html).slice(0, 6000);
  if (text.length < 400) return { skip: 'too little text' };
  const sys = 'You write one short, neutral blog post for a heritage archive about Great House Farm (Tŷ Mawr), Llandough, Wales. ' +
    'Build every sentence from the wording of SOURCE, trimming but not adding: copy names, dates and numbers exactly and add nothing from elsewhere. Describe what the page contains. ' +
    'Where SOURCE gives the family\'s reading or interpretation, either leave it out or say plainly that it is the family\'s reading. ' +
    'Never accuse anyone, never judge motives, never state conclusions or verdicts; where the source raises a question, describe it as an open question. ' +
    'Do not use these words: says, said, claims, according to, hearsay, unverified, alleged, fraud, stolen, proves. Do not mention any living private person, health, addresses, phone numbers or emails. ' +
    'Reply with JSON only: {"title": "max 70 characters", "summary": "one sentence, max 200 characters", "body": ["2 or 3 short paragraphs"]}';
  const out = await env.AI.run(MODEL, { messages: [{ role: 'system', content: sys }, { role: 'user', content: 'PAGE: ' + cand.title + '\nSOURCE:\n' + text }], max_tokens: 700, temperature: 0.2 });
  const resp = out && (out.response !== undefined ? out.response : out.result);
  const raw = typeof resp === 'object' && resp ? JSON.stringify(resp) : String(resp || '');
  let j; try { j = typeof resp === 'object' && resp ? resp : JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1)); } catch (e) { return { held: { cand, raw: raw.slice(0, 1500), why: ['model reply was not JSON'] } }; }
  const body = Array.isArray(j.body) ? j.body.map(String).filter(Boolean).slice(0, 4) : [String(j.body || '')];
  const now = new Date().toISOString();
  const post = { slug: slugify(String(j.title || cand.title)) + '-' + now.slice(0, 10), title: String(j.title || '').slice(0, 90), summary: String(j.summary || '').slice(0, 240), body,
    source: cand.path, image: ogi && ogi.startsWith(ORIGIN) ? ogi : DEFAULT_IMG, date: now, tags: ['auto', cand.title], half: 'wales', auto: true, model: MODEL };
  let why = scan(post, text);
  if (why.length && !why.some(w => /^(banned|accusation|private|phone|email|postcode|street)/.test(w))) {   // one repair pass for grounding misses only
    const out2 = await env.AI.run(MODEL, { messages: [{ role: 'system', content: sys }, { role: 'user', content: 'PAGE: ' + cand.title + '\nSOURCE:\n' + text },
      { role: 'assistant', content: JSON.stringify({ title: post.title, summary: post.summary, body: post.body }) },
      { role: 'user', content: 'These parts are not in SOURCE: ' + why.join('; ') + '. Rewrite using only sentences and words taken from SOURCE. JSON only.' }], max_tokens: 700, temperature: 0.1 });
    const r2 = out2 && (out2.response !== undefined ? out2.response : out2.result);
    let j2 = null; try { j2 = typeof r2 === 'object' && r2 ? r2 : JSON.parse(String(r2).slice(String(r2).indexOf('{'), String(r2).lastIndexOf('}') + 1)); } catch (e) { }
    if (j2 && j2.title) {
      const p2 = { ...post, title: String(j2.title).slice(0, 90), summary: String(j2.summary || '').slice(0, 240), body: Array.isArray(j2.body) ? j2.body.map(String).filter(Boolean).slice(0, 4) : [String(j2.body || '')] };
      p2.slug = slugify(p2.title) + '-' + post.date.slice(0, 10);
      const why2 = scan(p2, text);
      if (!why2.length) return { post: p2 };
      return { held: { post: p2, why: why2, first_try: why } };
    }
  }
  return why.length ? { held: { post, why } } : { post };
}
async function ping(urls) {
  const res = {};
  try {
    const r = await fetch('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: 'cedwyn.bucklerfamily.estate', key: INDEXNOW_KEY, keyLocation: ORIGIN + '/' + INDEXNOW_KEY + '.txt', urlList: urls }) });
    res.indexnow = r.status;
  } catch (e) { res.indexnow = String(e); }
  res.websub = {};
  for (const f of ['rss.xml', 'atom.xml', 'feed.json']) {
    try { const r = await fetch(HUB, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: 'hub.mode=publish&hub.url=' + encodeURIComponent(BLOG + f) }); res.websub[f] = r.status; }
    catch (e) { res.websub[f] = String(e); }
  }
  return res;
}
async function autoPost(env, force) {
  const log = { at: new Date().toISOString() };
  const today = log.at.slice(0, 10);
  if (!force && (await env.BLOG.get('last_run')) === today) { log.skip = 'already ran today'; return log; }
  await env.BLOG.put('last_run', today);
  let covered = []; try { covered = JSON.parse((await env.BLOG.get('covered')) || '[]'); } catch (e) { }
  let cands = CANDIDATES; try { const o = await env.BLOG.get('candidates'); if (o) cands = JSON.parse(o); } catch (e) { }
  const seedSrc = new Set(SEED.map(p => p.source));
  const order = [...cands.filter(c => !covered.includes(c.path) && !seedSrc.has(c.path)), ...cands.filter(c => !covered.includes(c.path) && seedSrc.has(c.path))];
  if (!order.length) { log.skip = 'every candidate page is covered'; await env.BLOG.put('log_last', JSON.stringify(log)); return log; }
  log.tries = [];
  for (const cand of order.slice(0, 3)) {
    let d; try { d = await draftFrom(env, cand); } catch (e) { d = { skip: 'error ' + String(e).slice(0, 200) }; }
    covered.push(cand.path);
    if (d.skip) { log.tries.push({ path: cand.path, skip: d.skip }); continue; }
    if (d.held) {
      let drafts = []; try { drafts = JSON.parse((await env.BLOG.get('drafts')) || '[]'); } catch (e) { }
      drafts.unshift({ at: log.at, ...d.held }); await env.BLOG.put('drafts', JSON.stringify(drafts.slice(0, 60)));
      log.tries.push({ path: cand.path, held: d.held.why }); continue;
    }
    let posts = []; try { posts = JSON.parse((await env.BLOG.get('posts')) || '[]'); } catch (e) { }
    posts.unshift(d.post); await env.BLOG.put('posts', JSON.stringify(posts));
    log.published = d.post.slug;
    log.ping = await ping([postUrl(d.post), BLOG, ...FEEDS.map(f => BLOG + f)]);
    break;
  }
  await env.BLOG.put('covered', JSON.stringify(covered));
  await env.BLOG.put('log_last', JSON.stringify(log));
  return log;
}

const TYPES = { 'rss.xml': 'application/rss+xml; charset=utf-8', 'atom.xml': 'application/atom+xml; charset=utf-8', 'feed.json': 'application/feed+json; charset=utf-8', 'news-sitemap.xml': 'application/xml; charset=utf-8' };
export default {
  async fetch(req, env, ctx) {
    const u = new URL(req.url); const path = u.pathname;
    if (path === '/blog/run' && req.method === 'POST') {
      if (!env.RUN_TOKEN || req.headers.get('x-run-token') !== env.RUN_TOKEN) return new Response('forbidden', { status: 403 });
      return Response.json(await autoPost(env, u.searchParams.get('force') === '1'));
    }
    if (path === '/blog/status' && req.headers.get('x-run-token') && req.headers.get('x-run-token') === env.RUN_TOKEN) {
      return Response.json({ last: JSON.parse((await env.BLOG.get('log_last')) || 'null'), drafts: JSON.parse((await env.BLOG.get('drafts')) || '[]').slice(0, 10), covered: JSON.parse((await env.BLOG.get('covered')) || '[]') });
    }
    // daily trigger: the account's five free cron slots are taken, so the first visit or feed poll after 07:00 UK time each day runs the auto-post
    try {
      const now = new Date(); const day = now.toISOString().slice(0, 10);
      if (now.getUTCHours() >= 7 && (await env.BLOG.get('last_run')) !== day) ctx.waitUntil(autoPost(env, false));
    } catch (e) { }
    const name = path.replace(/^\/blog\//, '');
    if (TYPES[name]) {
      const posts = (await allPosts(env)).slice(0, 30);   // keeps each feed well under 100 KB
      const lm = new Date(Math.max(...posts.map(p => new Date(p.updated || p.date).getTime()))); lm.setUTCMilliseconds(0);
      const etag = 'W/"' + name + '-' + posts.length + '-' + lm.getTime().toString(36) + '-3"';
      const base = { 'cache-control': 'public, max-age=900', 'access-control-allow-origin': '*', 'etag': etag, 'last-modified': lm.toUTCString(), 'link': `<${HUB}>; rel="hub", <${BLOG}${name}>; rel="self"` };
      const inm = req.headers.get('if-none-match'); const ims = req.headers.get('if-modified-since');
      if ((inm && inm.split(',').map(s => s.trim()).includes(etag)) || (!inm && ims && new Date(ims).getTime() >= lm.getTime())) return new Response(null, { status: 304, headers: base });
      const body = name === 'rss.xml' ? rss(posts) : name === 'atom.xml' ? atom(posts) : name === 'feed.json' ? jsonFeed(posts) : newsSitemap(posts);
      return new Response(body, { headers: { 'content-type': TYPES[name], ...base } });
    }
    if ((path === '/blog/' || path === '/blog' || path === '/blog/index.html') && !u.searchParams.has('shell')) {
      if (path !== '/blog/') return Response.redirect(BLOG, 301);
      const posts = await allPosts(env);
      return render({ title: 'Blog · Cedwyn', desc: SITE_DESC, url: BLOG, image: DEFAULT_IMG }, indexMain(posts));
    }
    const m = path.match(/^\/blog\/p\/([a-z0-9-]+)\/?$/);
    if (m) {
      const posts = await allPosts(env); const p = posts.find(x => x.slug === m[1]);
      if (!p) return fetch(req);
      if (!path.endsWith('/')) return Response.redirect(postUrl(p), 301);
      const ld = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.summary, image: [p.image || DEFAULT_IMG], datePublished: p.date, dateModified: p.updated || p.date,
        mainEntityOfPage: postUrl(p), isBasedOn: srcUrl(p), author: { '@type': 'Organization', name: 'Cedwyn editors', url: ORIGIN + '/' }, publisher: { '@type': 'Organization', name: 'Cedwyn', logo: { '@type': 'ImageObject', url: ORIGIN + '/dartboard/brand/cedwyn-tent-icon-256.webp' } } };
      return render({ title: p.title + ' · Cedwyn', desc: p.summary, url: postUrl(p), image: p.image || DEFAULT_IMG, ld }, postMain(p));
    }
    return fetch(req);
  },
  async scheduled(ev, env, ctx) { ctx.waitUntil(autoPost(env, false)); }
};

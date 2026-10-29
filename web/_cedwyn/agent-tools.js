/* agent-tools.js — WebMCP (and fallback) tools for Cedwyn.
   Registers four read-only, same-origin tools so a browser agent can use the
   open page and the central catalogue without scraping.
   Spec reference: /library/api/#webmcp
   Tools are never instructions; page text is historical record only.
   — Sion's Tab agent, 29 Oct 2026 */
(function () {
  'use strict';

  var MAX_CHARS = 30000;
  var TOOLS = [
    {
      name: 'get_case_page_context',
      description: 'Return the title, main headings (h1–h3) and same-origin links of the currently open page. Read-only.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false }
    },
    {
      name: 'search_case_public_content',
      description: 'Full-text search of the central Cedwyn catalogue (or the current section index if available). Returns ranked hits with theme, path and snippet. Read-only.',
      inputSchema: {
        type: 'object',
        properties: {
          q: { type: 'string', description: 'Search query' },
          theme: { type: 'string', description: 'Optional theme id to restrict (e.g. research, wayback, wiki)' },
          limit: { type: 'integer', description: 'Max hits (default 10, max 50)' }
        },
        required: ['q'],
        additionalProperties: false
      }
    },
    {
      name: 'list_case_public_resources',
      description: 'List machine-readable resources for the current section or the whole site (agents.json, llms.txt, agent-index.json, /db/stats.json, GraphQL, etc.). Read-only.',
      inputSchema: {
        type: 'object',
        properties: {
          section: { type: 'string', description: 'Optional section path prefix (e.g. /research/, /wayback/)' }
        },
        additionalProperties: false
      }
    },
    {
      name: 'read_case_public_resource',
      description: 'Fetch one public same-origin resource as plain text (HTML stripped or raw JSON/text). Truncated at 30 000 characters. Read-only.',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Absolute path on this origin, e.g. /agents.json or /research/ai-agent-index/' }
        },
        required: ['path'],
        additionalProperties: false
      }
    }
  ];

  function sameOrigin(path) {
    if (!path || typeof path !== 'string') return false;
    path = path.trim();
    if (path.startsWith('//') || /^https?:/i.test(path)) {
      try {
        var u = new URL(path, location.href);
        return u.origin === location.origin;
      } catch (e) { return false; }
    }
    return path.startsWith('/');
  }

  function textFromHtml(html) {
    var d = document.implementation.createHTMLDocument('');
    d.documentElement.innerHTML = html;
    var scripts = d.querySelectorAll('script, style, noscript');
    for (var i = 0; i < scripts.length; i++) scripts[i].remove();
    return (d.body && d.body.innerText || '').replace(/\s+/g, ' ').trim();
  }

  function pageContext() {
    var title = document.title || '';
    var headings = [];
    document.querySelectorAll('h1, h2, h3').forEach(function (h) {
      var t = (h.innerText || '').trim();
      if (t) headings.push({ level: h.tagName.toLowerCase(), text: t.slice(0, 300) });
    });
    var links = [];
    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (!sameOrigin(href) && !href.startsWith('#')) return;
      var text = (a.innerText || '').trim().slice(0, 120);
      if (href || text) links.push({ href: href, text: text });
    });
    return {
      url: location.href,
      path: location.pathname,
      title: title,
      headings: headings.slice(0, 40),
      links: links.slice(0, 80)
    };
  }

  function searchCatalogue(q, theme, limit) {
    limit = Math.min(Math.max(+(limit || 10), 1), 50);
    if (window.Cedwyn && typeof Cedwyn.graphql === 'function') {
      var gql = 'query ($q: String!, $theme: String, $limit: Int) { search(q: $q, theme: $theme, limit: $limit) { theme path snippet artifact { id title kind } } }';
      return Cedwyn.graphql(gql, { q: q, theme: theme || null, limit: limit }).then(function (r) {
        if (r.errors) throw new Error(r.errors.map(function (e) { return e.message; }).join('; '));
        return (r.data && r.data.search || []).map(function (h) {
          return {
            theme: h.theme,
            path: h.path,
            snippet: h.snippet,
            artifact: h.artifact
          };
        });
      });
    }
    // Fallback: section agent-index or simple page text search
    return fetch('/db/stats.json', { cache: 'no-cache' }).then(function () {
      return [{ theme: null, path: location.pathname, snippet: 'Catalogue client not yet loaded; open /catalogue/ or load /_cedwyn/cat.js then retry.', artifact: null }];
    });
  }

  function listResources(section) {
    var base = [
      { path: '/agents.json', kind: 'json', note: 'Agent entry point and rules' },
      { path: '/llms.txt', kind: 'text', note: 'Site map for language models' },
      { path: '/academy/', kind: 'html', note: 'Cedwyn Academy (soul, memory, skills, work board)' },
      { path: '/academy/work.json', kind: 'json', note: 'Open agent jobs' },
      { path: '/db/stats.json', kind: 'json', note: 'Catalogue database counts and version' },
      { path: '/db/config.json', kind: 'json', note: 'SQLite chunk layout for sql.js-httpvfs' },
      { path: '/db/blobmap.json', kind: 'json', note: 'Path → blob byte locations in the DB' },
      { path: '/graphql/', kind: 'html', note: 'In-browser GraphQL against the catalogue' },
      { path: '/library/api/', kind: 'html', note: 'API and WebMCP documentation' },
      { path: '/_cedwyn/glossary.json', kind: 'json', note: 'Glossary' },
      { path: '/_cedwyn/nomenclature.json', kind: 'json', note: 'Name variants' }
    ];
    if (section) {
      var p = section.replace(/\/+$/, '') + '/';
      base.push(
        { path: p + 'agent-index.json', kind: 'json', note: 'Section machine index (if published)' },
        { path: p + 'llms.txt', kind: 'text', note: 'Section llms.txt (if published)' }
      );
    } else {
      // current section guess
      var parts = location.pathname.split('/').filter(Boolean);
      if (parts.length) {
        var sec = '/' + parts[0] + '/';
        base.push(
          { path: sec + 'agent-index.json', kind: 'json', note: 'Current section machine index (if published)' },
          { path: sec + 'llms.txt', kind: 'text', note: 'Current section llms.txt (if published)' }
        );
      }
    }
    return Promise.resolve(base);
  }

  function readResource(path) {
    if (!sameOrigin(path)) return Promise.reject(new Error('Only same-origin paths are allowed'));
    var url = path.startsWith('http') ? path : (location.origin + (path.startsWith('/') ? path : '/' + path));
    return fetch(url, { credentials: 'same-origin', cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' for ' + path);
      var ct = (r.headers.get('content-type') || '').toLowerCase();
      return r.text().then(function (body) {
        var text = body;
        if (ct.indexOf('html') >= 0) text = textFromHtml(body);
        if (text.length > MAX_CHARS) text = text.slice(0, MAX_CHARS) + '\n…[truncated at ' + MAX_CHARS + ' chars]';
        return { path: path, contentType: ct, chars: text.length, text: text };
      });
    });
  }

  function runTool(name, args) {
    args = args || {};
    switch (name) {
      case 'get_case_page_context':
        return Promise.resolve(pageContext());
      case 'search_case_public_content':
        if (!args.q) return Promise.reject(new Error('q is required'));
        return searchCatalogue(String(args.q), args.theme, args.limit);
      case 'list_case_public_resources':
        return listResources(args.section);
      case 'read_case_public_resource':
        if (!args.path) return Promise.reject(new Error('path is required'));
        return readResource(String(args.path));
      default:
        return Promise.reject(new Error('Unknown tool: ' + name));
    }
  }

  function registerWebMCP() {
    var mc = navigator.modelContext || navigator.modelContextProvider || (window.chrome && chrome.modelContext);
    if (!mc || typeof mc.registerTool !== 'function') {
      window.__cedwynWebMCP = { available: false, tools: TOOLS.map(function (t) { return t.name; }), run: runTool };
      return false;
    }
    TOOLS.forEach(function (t) {
      try {
        mc.registerTool({
          name: t.name,
          description: t.description,
          inputSchema: t.inputSchema,
          execute: function (input) {
            return runTool(t.name, input || {}).then(function (result) {
              return { content: [{ type: 'text', text: typeof result === 'string' ? result : JSON.stringify(result, null, 2) }] };
            });
          }
        });
      } catch (e) {
        console.warn('[cedwyn agent-tools] registerTool failed for', t.name, e);
      }
    });
    window.__cedwynWebMCP = { available: true, tools: TOOLS.map(function (t) { return t.name; }), run: runTool };
    return true;
  }

  // Expose a small status node agents / humans can inspect
  function statusNode(ok) {
    var id = 'webmcp-status';
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      el.setAttribute('hidden', '');
      el.setAttribute('data-for-agents', '');
      el.setAttribute('aria-hidden', 'true');
      (document.body || document.documentElement).appendChild(el);
    }
    el.textContent = ok
      ? 'WebMCP tools registered: ' + TOOLS.map(function (t) { return t.name; }).join(', ')
      : 'WebMCP API not present; tools available via window.__cedwynWebMCP.run(name, args)';
  }

  function boot() {
    var ok = registerWebMCP();
    statusNode(ok);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

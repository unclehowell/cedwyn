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

  function modelContext() {
    // The current WebMCP API is on Document. navigator.modelContext is legacy.
    if (document && document.modelContext && typeof document.modelContext.registerTool === 'function') {
      return { context: document.modelContext, api: 'document.modelContext' };
    }
    if (navigator && navigator.modelContext && typeof navigator.modelContext.registerTool === 'function') {
      return { context: navigator.modelContext, api: 'navigator.modelContext (legacy)' };
    }
    return null;
  }

  async function registerWebMCP() {
    var found = modelContext();
    if (!found) {
      window.__cedwynWebMCP = {
        available: false,
        registered: false,
        api: null,
        tools: TOOLS.map(function (t) { return t.name; }),
        run: runTool,
        message: 'WebMCP is not exposed by this browser. The JavaScript fallback remains available.'
      };
      return false;
    }

    var mc = found.context;
    var registered = [];
    var failures = [];
    for (var i = 0; i < TOOLS.length; i++) {
      var tool = TOOLS[i];
      try {
        await mc.registerTool({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
          annotations: { readOnlyHint: true },
          execute: async function (input, options) {
            try {
              // Keep the public-resource reader same-origin and honour cancellation.
              if (options && options.signal && options.signal.aborted) {
                return { error: 'Tool execution was cancelled.' };
              }
              var result = await runTool(this.name, input || {});
              return result;
            } catch (err) {
              return { error: String(err && err.message || err) };
            }
          }.bind({ name: tool.name })
        });
        registered.push(tool.name);
      } catch (e) {
        failures.push({ name: tool.name, error: String(e && e.message || e) });
        console.warn('[cedwyn agent-tools] registration failed:', tool.name, e);
      }
    }

    // Verify via the API where supported; do not equate API presence with success.
    var verified = false;
    if (typeof mc.getTools === 'function') {
      try {
        var liveTools = await mc.getTools();
        var liveNames = liveTools.map(function (t) { return t.name; });
        registered = registered.filter(function (name) { return liveNames.indexOf(name) !== -1; });
        verified = TOOLS.every(function (t) { return liveNames.indexOf(t.name) !== -1; });
      } catch (e) {
        failures.push({ name: 'getTools', error: String(e && e.message || e) });
      }
    }

    window.__cedwynWebMCP = {
      available: true,
      registered: registered.length > 0,
      verified: verified,
      api: found.api,
      tools: registered,
      expectedTools: TOOLS.map(function (t) { return t.name; }),
      failures: failures,
      run: runTool,
      message: verified ? 'All four WebMCP tools registered and verified.' :
        (registered.length === TOOLS.length ? 'Registration calls completed; tool discovery could not be fully verified.' :
          'WebMCP registration incomplete. See failures for details.')
    };
    return registered.length === TOOLS.length;
  }

  // Expose a small status node agents / humans can inspect
  function statusNode() {
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
    var state = window.__cedwynWebMCP || {};
    el.textContent = state.message || 'WebMCP registration is in progress.';
    el.setAttribute('data-webmcp-api', state.api || 'unavailable');
    el.setAttribute('data-webmcp-registered', (state.tools || []).join(','));
    el.setAttribute('data-webmcp-verified', String(!!state.verified));
  }

  async function boot() {
    await registerWebMCP();
    statusNode();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

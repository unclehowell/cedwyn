// engine.js — the one commit route for Cedwyn edits (Sion via /admin/, Tab's agents via the API or relay.mjs).
// Environment-agnostic ES module: runs in the Cloudflare Worker, in GitHub Actions (Node 20) and on Tab's box.
// Every write: fresh branch head, per-file stale check (git blob sha the draft was based on must still be current),
// shrink/delete guards, compartment check, non-force ref update (fast-forward only, retried on a race). — Sion's Tab agent
export const REPO = 'unclehowell/cedwyn';
export const CONFIRM_WORDS = 'I mean it';
export const GUARD = { shrinkPct: 20, deletedLines: 50 };
const DATA_EXT = /\.(json|geojson|csv|tsv|ya?ml|xml|jsonl|txt|md)$/i;
const TEXT_EXT = /\.(html?|css|js|mjs|json|geojson|csv|tsv|ya?ml|xml|jsonl|txt|md|svg|webmanifest|toml)$/i;
export const isText = p => TEXT_EXT.test(p);
export const isData = p => DATA_EXT.test(p);
const enc = new TextEncoder(), dec = new TextDecoder();
export const utf8 = s => enc.encode(s);
export const unutf8 = b => dec.decode(b);
export function b64(bytes) { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s); }
export function unb64(s) { const t = atob(s); const b = new Uint8Array(t.length); for (let i = 0; i < t.length; i++) b[i] = t.charCodeAt(i); return b; }
export async function blobSha(bytes) {
  const h = utf8('blob ' + bytes.length + '\0'); const all = new Uint8Array(h.length + bytes.length); all.set(h); all.set(bytes, h.length);
  const d = new Uint8Array(await crypto.subtle.digest('SHA-1', all)); return [...d].map(x => x.toString(16).padStart(2, '0')).join('');
}
const encPath = p => p.split('/').map(encodeURIComponent).join('/');
export async function rawAt(ref, path) {   // immutable when ref is a commit sha (no CDN staleness)
  const r = await fetch(`https://raw.githubusercontent.com/${REPO}/${ref}/${encPath(path)}`, { headers: { 'user-agent': 'cedwyn-cms' } });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error('raw ' + r.status + ' ' + path);
  return new Uint8Array(await r.arrayBuffer());
}
export async function heads() {   // every branch head without the rate-limited API (git smart-HTTP ref advertisement)
  const r = await fetch(`https://github.com/${REPO}.git/info/refs?service=git-upload-pack`, { headers: { 'user-agent': 'git/2.43.0' } });
  if (!r.ok) throw new Error('refs ' + r.status);
  const t = await r.text(); const out = {};
  for (const m of t.matchAll(/([0-9a-f]{40}) refs\/heads\/([^\s\0]+)/g)) out[m[2]] = m[1];
  return out;
}
// ---- compartments: one theme = one (branch, folder); an edit may only touch its own compartment's files ----
export function compartments(themes) {
  const out = [];
  for (const t of themes.themes || []) {
    const c = { id: t.id, title: t.title || t.id, live: '/' + t.id + '/' };
    if (t.layer) Object.assign(c, { branch: 'main', prefix: 'web/' + t.id + '/', serve: '' });
    else if (t.branch) {
      const pre = (t.dir || '').replace(/^\/+|\/+$/g, '');
      Object.assign(c, { branch: t.branch, prefix: pre ? pre + '/' : '', serve: pre ? pre + '/' : '' });
      if (t.wp_copy || t.crawl_first) c.note = 'Rebuilt from a crawl of its live site; edits here may not show.';
      if (t.build) c.note = 'Built by its own build step from this branch; preview shows the source only.';
    } else { c.readonly = true; c.note = 'Crawled from its live site at build time; nothing to edit in the repo.'; }
    out.push(c);
  }
  out.push({ id: 'sandbox', title: 'Sandbox (practise here; not part of the site)', branch: 'cms', prefix: 'sandbox/', serve: 'sandbox/', nobuild: true, live: '/admin/' });
  out.push({ id: 'site-data', title: 'Site data (main: themes.json and the JSON rule files)', branch: 'main', prefix: '', only: /^[^/]+\.json$/.source, live: '/' });
  return out;
}
export function inCompartment(c, path) {
  if (!c || c.readonly) return false;
  if (!path || path.includes('..') || path.startsWith('/') || path.includes('\\') || /(^|\/)\.git(\/|$)/.test(path)) return false;
  if (path.startsWith('.github/')) return false;
  if (c.only && !new RegExp(c.only).test(path)) return false;
  if (!path.startsWith(c.prefix)) return false;
  if (c.branch === 'main' && !c.only && !path.startsWith('web/')) return false;
  return true;
}
// fb and fb2 share branch fb (site/ vs site2/): an edit in one never reaches the other because prefixes differ.
// ---- guards ----
export function deletedLines(oldT, newT) {
  const cnt = new Map(); for (const l of newT.split('\n')) cnt.set(l, (cnt.get(l) || 0) + 1);
  let del = 0; for (const l of oldT.split('\n')) { const n = cnt.get(l) || 0; if (n > 0) cnt.set(l, n - 1); else del++; }
  return del;
}
export function guardsFor(path, oldBytes, file) {
  const g = [];
  if (!oldBytes) return g;   // new file
  if (file.op === 'delete') { g.push({ path, kind: 'delete', detail: 'deletes the whole file' }); return g; }
  if (!isText(path)) return g;
  const oldT = unutf8(oldBytes), newT = file.text ?? unutf8(unb64(file.b64 || ''));
  if (isData(path) && oldBytes.length > 0) {
    const pct = 100 * (1 - utf8(newT).length / oldBytes.length);
    if (pct > GUARD.shrinkPct) g.push({ path, kind: 'shrink', detail: `shrinks ${oldBytes.length} -> ${utf8(newT).length} bytes (${pct.toFixed(1)}%)` });
  }
  const d = deletedLines(oldT, newT);
  if (d > GUARD.deletedLines) g.push({ path, kind: 'lines', detail: `removes ${d} lines` });
  if (/\.(json|geojson)$/i.test(path)) { try { JSON.parse(newT); } catch (e) { g.push({ path, kind: 'invalid', hard: true, detail: 'not valid JSON: ' + String(e.message).slice(0, 80) }); } }
  return g;
}
// check a batch against a given head commit: stale files + guard findings (no writes)
export async function check(job, headSha, reader = rawAt) {
  const stale = [], guards = [], outside = [], cur = {};
  for (const [path, f] of Object.entries(job.files)) {
    if (!inCompartment(job.compartment, path)) { outside.push(path); continue; }
    const old = await reader(headSha, path); cur[path] = old;
    const sha = old ? await blobSha(old) : null;
    if ((f.base_sha || null) !== sha) stale.push({ path, base: f.base_sha || null, current: sha });
    guards.push(...guardsFor(path, old, f));
  }
  return { stale, guards, outside, cur };
}
// gh(method, path, body) -> {status, body}; injected (token fetch in the Worker/Actions, connected apps on Tab's box)
export function tokenGh(token) {
  return async (method, path, body) => {
    const r = await fetch('https://api.github.com' + path, { method, headers: { authorization: 'Bearer ' + token, 'user-agent': 'cedwyn-cms', accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28', ...(body ? { 'content-type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined });
    const t = await r.text(); let j; try { j = JSON.parse(t); } catch { j = t; } return { status: r.status, body: j };
  };
}
const shaOf = (b, re) => { if (b && typeof b === 'object') return null; const m = String(b || '').match(re || /"sha"\s*:\s*"([0-9a-f]{40})"/); return m ? m[1] : null; };
export async function commit(gh, job, opts = {}) {
  // job: {compartment, files:{path:{op:'put'|'delete', text|b64, base_sha}}, message, confirm}
  const c = job.compartment, branch = c.branch;
  for (let round = 0; round < 4; round++) {
    const r1 = await gh('GET', `/repos/${REPO}/git/ref/heads/${encodeURIComponent(branch)}`);
    if (r1.status !== 200) return { ok: false, error: 'ref read ' + r1.status };
    const head = r1.body?.object?.sha || shaOf(r1.body);
    const ck = await check(job, head, opts.reader);
    if (ck.outside.length) return { ok: false, outside: ck.outside, head, error: 'files outside the ' + c.id + ' compartment' };
    if (ck.stale.length) return { ok: false, stale: ck.stale, head, error: 'stale: changed since the draft was made' };
    const hard = ck.guards.filter(g => g.hard);
    if (hard.length) return { ok: false, guards: ck.guards, head, error: 'refused: ' + hard[0].detail };
    if (ck.guards.length && job.confirm !== CONFIRM_WORDS) return { ok: false, guards: ck.guards, head, error: 'needs the confirm words' };
    if (opts.dry) return { ok: true, dry: true, head, guards: ck.guards };
    const r2 = await gh('GET', `/repos/${REPO}/git/commits/${head}`);
    const baseTree = r2.body?.tree?.sha || shaOf(r2.body, /"tree"\s*:\s*\{\s*"sha"\s*:\s*"([0-9a-f]{40})"/);
    if (!baseTree) return { ok: false, error: 'commit read ' + r2.status };
    const tree = [], files = [];
    for (const [path, f] of Object.entries(job.files)) {
      const before = ck.cur[path], before_sha = before ? await blobSha(before) : null;
      if (f.op === 'delete') { if (before) tree.push({ path, mode: '100644', type: 'blob', sha: null }); files.push({ path, before_sha, after_sha: null }); continue; }
      const bytes = f.text != null ? utf8(f.text) : unb64(f.b64 || '');
      if (bytes.length > 24 * 1024 * 1024) return { ok: false, error: path + ' is over the 24 MB file cap' };
      const after_sha = await blobSha(bytes);
      if (after_sha === before_sha) continue;
      if (f.text != null) tree.push({ path, mode: '100644', type: 'blob', content: f.text });
      else {
        const rb = await gh('POST', `/repos/${REPO}/git/blobs`, { content: f.b64, encoding: 'base64' });
        const bs = rb.body?.sha || shaOf(rb.body); if (!bs) return { ok: false, error: 'blob ' + rb.status };
        tree.push({ path, mode: '100644', type: 'blob', sha: bs });
      }
      files.push({ path, before_sha, after_sha });
    }
    if (!tree.length) return { ok: true, nothing: true, head };
    const r3 = await gh('POST', `/repos/${REPO}/git/trees`, { base_tree: baseTree, tree });
    const treeSha = r3.body?.sha || shaOf(r3.body); if (!treeSha || r3.status >= 300) return { ok: false, error: 'tree ' + r3.status + ' ' + JSON.stringify(r3.body).slice(0, 200) };
    const r4 = await gh('POST', `/repos/${REPO}/git/commits`, { message: job.message, tree: treeSha, parents: [head] });
    const cs = r4.body?.sha || shaOf(r4.body); if (!cs || r4.status >= 300) return { ok: false, error: 'commit ' + r4.status };
    const r5 = await gh('PATCH', `/repos/${REPO}/git/refs/heads/${encodeURIComponent(branch)}`, { sha: cs, force: false });
    if (r5.status === 200) return { ok: true, commit: cs, parent: head, branch, files, guards: ck.guards };
    await new Promise(r => setTimeout(r, 3000));   // the branch moved under us: start again from the new head
  }
  return { ok: false, error: 'could not fast-forward after 4 rounds' };
}
// a revert = a new commit putting back each file's version from the CMS commit's parent (only if nobody changed it since)
export async function revertJob(entry, compartment, reader = rawAt) {
  const files = {};
  for (const f of entry.files) {
    const old = f.before_sha ? await reader(entry.parent, f.path) : null;
    files[f.path] = old ? (isText(f.path) ? { op: 'put', text: unutf8(old), base_sha: f.after_sha } : { op: 'put', b64: b64(old), base_sha: f.after_sha })
                        : { op: 'delete', base_sha: f.after_sha };
  }
  return { compartment, files, confirm: CONFIRM_WORDS, revert_of: entry.commit,
           message: `CMS revert of ${entry.commit.slice(0, 7)} (${entry.summary || ''}) by ${entry.revert_by || 'Sion'}` };
}
export function message(author, summary) {
  const s = (summary || 'edit').replace(/\s+/g, ' ').trim().slice(0, 120);
  return author === 'sion' ? `CMS edit by Sion — ${s}` : `CMS edit by ${author} — ${s} — Sion's Tab agent`;
}

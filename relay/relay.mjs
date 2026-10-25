#!/usr/bin/env node
// relay.mjs — the same commit engine outside the Worker. — Sion's Tab agent
//   drain    : take queued publishes from the CMS Worker and commit them (GitHub Actions every 5 min, or Tab's box on demand)
//   publish  : commit a batch file directly (Tab's agents; same stale + shrink/delete guards + compartment check)
//   check    : dry run of a batch (stale/guards/outside) without writing
// Transport: --via token (env GITHUB_TOKEN, used in Actions) or --via ca (Tab's box: the connected GitHub account).
// Usage:
//   node relay.mjs drain   [--via token|ca] [--worker https://cedwyn.bucklerfamily.estate]   (env CMS_RELAY_KEY)
//   node relay.mjs check   batch.json [--via ca]
//   node relay.mjs publish batch.json [--via ca] [--confirm "I mean it"]
// batch.json: {"compartment":"<theme id>","author":"Tab","summary":"...","files":{"<repo path>":{"op":"put","text":"...","base_sha":"<git blob sha or null>"}}}
import * as E from '../worker/engine.js';
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const args = process.argv.slice(2); const cmd = args[0];
const opt = k => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : null; };
const via = opt('via') || (process.env.GITHUB_TOKEN ? 'token' : 'ca');
const WORKER = opt('worker') || 'https://cedwyn.bucklerfamily.estate';
function caGh() {   // the connected GitHub account through Tab's connected-apps door, paced ~1 call / 2 s
  const dir = `/home/user/tab/tasks/${process.env.TAB_TASK_ID || 'cedwyn-cms'}/rq-cms`; mkdirSync(dir, { recursive: true }); let n = 0, last = 0;
  return async (method, path, body) => {
    for (let a = 0; a < 4; a++) {
      const wait = 2000 - (Date.now() - last); if (wait > 0) await new Promise(r => setTimeout(r, wait));
      const f = `${dir}/r${process.pid}-${++n}.json`; const req = { toolkit: 'github', method, url: path, query: { _ts: `${Date.now()}-${a}` } }; if (body !== undefined) req.body = body;
      writeFileSync(f, JSON.stringify(req)); let out;
      try { out = JSON.parse(execFileSync('timeout', ['-k', '5', '150', '/usr/bin/node', '/home/user/tab/connected-apps-cli.mjs', 'connected_apps.request', f], { encoding: 'utf8', maxBuffer: 64 << 20 })); }
      catch (e) { out = { error: String(e.stdout || e.message).slice(0, 300) }; } finally { last = Date.now(); try { unlinkSync(f); } catch {} }
      const res = out.result; if (!res) { await new Promise(r => setTimeout(r, 4000 * (a + 1))); continue; }
      let b = res.body; if (b == null && res.body_head != null) b = res.body_head; if (typeof b === 'string') { try { b = JSON.parse(b); } catch {} }
      if ([429, 500, 502, 503, 504].includes(res.status) && a < 3) { await new Promise(r => setTimeout(r, 4000 * (a + 1))); continue; }
      return { status: res.status, body: b };
    }
    return { status: 0, body: 'connected apps did not answer' };
  };
}
const gh = via === 'token' ? E.tokenGh(process.env.GITHUB_TOKEN) : caGh();
async function compartment(id) {
  const h = await E.heads(); const t = JSON.parse(E.unutf8(await E.rawAt(h.main, 'themes.json')));
  const c = E.compartments(t).find(x => x.id === id); if (!c) throw new Error('no compartment ' + id); return c;
}
async function dispatchBuild() { const r = await gh('POST', `/repos/${E.REPO}/actions/workflows/build.yml/dispatches`, { ref: 'main' }); console.log('build dispatch', r.status); }
if (cmd === 'drain') {
  const key = process.env.CMS_RELAY_KEY; if (!key) { console.log('::warning::CMS_RELAY_KEY not set'); process.exit(0); }
  const r = await fetch(WORKER + '/admin/api/relay/jobs', { headers: { 'x-relay-key': key, 'user-agent': 'cedwyn-cms-relay' } });
  // never fail the scheduled run (a red run every 5 minutes mails the repo owner): warn and stop
  if (!r.ok || !(r.headers.get('content-type') || '').includes('json')) { console.log(`::warning::editor not answering the relay yet (${r.status})`); process.exit(0); }
  const { jobs } = await r.json(); let built = false; console.log('queued jobs:', jobs.length);
  for (const job of jobs) {
    const res = await E.commit(gh, job); console.log(job.key, job.summary, '->', res.ok ? (res.commit || 'nothing') : res.error);
    const p = await fetch(WORKER + '/admin/api/relay/result', { method: 'POST', headers: { 'x-relay-key': key, 'content-type': 'application/json' }, body: JSON.stringify({ key: job.key, result: res }) });
    console.log('  reported', p.status); if (res.ok && res.commit && !job.compartment.nobuild) built = true;
  }
  if (built) await dispatchBuild();   // commits made with the Actions token do not start other workflows on their own
} else if (cmd === 'check' || cmd === 'publish') {
  const b = JSON.parse(readFileSync(args[1], 'utf8')); const c = await compartment(b.compartment);
  const job = { compartment: c, files: b.files, confirm: opt('confirm') || b.confirm, message: E.message(b.author || 'Tab', b.summary) };
  const res = await E.commit(gh, job, { dry: cmd === 'check' });
  console.log(JSON.stringify(res, null, 1));
  if (cmd === 'publish' && res.ok && res.commit && !c.nobuild && (c.branch !== 'main' || via === 'token')) await dispatchBuild();
  process.exit(res.ok ? 0 : 2);
} else { console.log(readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 12).join('\n')); }

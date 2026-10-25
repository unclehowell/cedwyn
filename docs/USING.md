# Cedwyn editor (CMS) — one route for Sion's and Tab's edits

Live at **https://cedwyn.bucklerfamily.estate/admin/** (Cloudflare Worker `cedwyn-cms`, routes `cedwyn.bucklerfamily.estate/admin` and `/admin/*`).
Source: branch **`cms`** of `unclehowell/cedwyn` (worker/, relay/, sandbox/) and this folder (the box copy; deploy from here).
Built 25 Oct 2026 by Sion's Tab agent. The static site, its build and every theme are untouched; the only file added to `main`
is `.github/workflows/cms-relay.yml` (commit 563735d), which does not trigger a site build.

## How it works

```
phone / agent ──► /admin/api/* (Worker) ──► KV "cedwyn-cms": drafts (per author, per theme), publish queue, publish log
                                     │
                    publish ─────────┴─► queue ──► cms-relay workflow (every 5 min, repo's own Actions token)
                                                     └─ engine.js: fresh head → stale check → guards → commit (fast-forward only)
                                                        → dispatches build-cedwyn → Cloudflare Pages redeploys (~30–35 min)
```
* **Login**: password checked in the Worker against `CMS_PASS_HASH` (PBKDF2-SHA256, 10,000 rounds, random salt; Worker secret).
  The password is not in the repo, the page or the browser. Session = HMAC-signed cookie (`CMS_SESSION_KEY`), HttpOnly, Secure,
  SameSite=Strict, Path=/admin, 7 days. Wrong passwords: 5 per address per 15 min, 30 per hour overall, then 429.
  Every /admin response carries `X-Robots-Tag: noindex, nofollow, noarchive` and the page has a robots noindex meta.
* **Compartments** = themes. Each theme maps to its source branch + folder from `themes.json` (e.g. fb → branch `fb` / `site/`,
  fb2 → branch `fb` / `site2/`, 1000 Cuts → `main` / `web/thousand-cuts/`). A draft or publish can only touch files inside one
  compartment; anything else is refused (`outside`). Crawled themes are read only. Extra compartments: `site-data` (root JSON
  files on main: themes.json, ingredients.json, app-demo-factcheck.json, spa-basepath.json) and `sandbox` (branch `cms`,
  `sandbox/` — practice, never on the site, no build).
* **Drafts** live in KV until Publish. The editor shows the change list and a line diff before Publish.
* **Publish** → one commit per theme. Message: `CMS edit by Sion — <summary>` (Sion) or `CMS edit by <agent> — <summary> — Sion's Tab agent`.
  With no GitHub token on the Worker the commit is made by the relay workflow within ~5 min (GitHub's scheduler can run late;
  `workflow_dispatch` on cms-relay runs it at once). If a fine-grained token is ever saved (see below) publishing is instant.
* **Undo** ("Undo the last publish") = a NEW commit restoring each file of the last CMS commit to its parent's version — only if
  nobody changed those files since (else refused as stale). Never a force-push, never history rewriting.
* **Guards** (engine.js, enforced again at commit time): refuse a stale write (the file's git blob sha changed since the draft was
  based on it); a data file (.json .csv .md .txt .xml .yml …) shrinking > 20 %, any text file losing > 50 lines, or a whole-file
  delete needs the exact words **I mean it**; invalid JSON is refused outright.

## Tab's agents: use the same route (do not hand-edit Cedwyn content with gh.py)

Agent key: `CMS_AGENT_KEY` in `/home/user/tab/work/cedwyn-cms/.secrets.json` (box only, chmod 600; never print it or put it in a page/repo).
Send `Authorization: Bearer <key>` and `X-CMS-Agent: <your name, e.g. Tab>`.

1. `GET /admin/api/compartments` → theme ids with branch/prefix.
2. `GET /admin/api/file?c=<theme>&path=<repo path>` → `{text|url, sha, head}`. **Always read fresh right before editing.**
3. `PUT /admin/api/drafts` `{"c":"<theme>","path":"…","op":"put","text":"…","base_sha":"<sha from step 2, or null for a new file>"}`
   (images: `"b64":"…"` instead of `text`; keep under ~5 MB after resizing; `op:"delete"` deletes).
4. `POST /admin/api/check` `{"c":"<theme>"}` → stale / guards / outside (dry run).
5. `POST /admin/api/publish` `{"c":"<theme>","summary":"…"}` → 409 stale/outside/invalid, 412 needs confirm (only add
   `"confirm":"I mean it"` when Sion has OK'd the big change), else `{"job":{"status":"queued"|"done"}}`.
6. `GET /admin/api/jobs` → queued jobs, finished jobs (status done/stale/guard/failed with the error), publish log.
7. `POST /admin/api/revert` `{"commit":"<sha of the last CMS commit>"}` → undo job (refuses if it is not the last one or is stale).
Drafts are per author, so Sion's and Tab's drafts never mix; publishes from both are serialised by the fast-forward-only commit
(on a race the engine re-reads the new head and re-checks every file before retrying; a changed file = refused, never clobbered).

**Without the Worker** (e.g. before deploy, or for a scripted batch), the same engine runs on the box through the connected GitHub account:
```
cd /home/user/tab/work/cedwyn-cms/relay
TAB_TASK_ID=<id> timeout -k 5 300 node relay.mjs check   batch.json --via ca
TAB_TASK_ID=<id> timeout -k 5 300 node relay.mjs publish batch.json --via ca      # add --confirm "I mean it" only with Sion's OK
# batch.json = {"compartment":"fb2","author":"Tab","summary":"…","files":{"site2/x.html":{"op":"put","text":"…","base_sha":"<blob sha>"}}}
```
`publish` dispatches build-cedwyn itself for theme branches. Get a file's base sha with `git hash-object` semantics
(the `sha` from `/admin/api/file`, or the blob sha in `GET /repos/unclehowell/cedwyn/git/trees/<branch>?recursive=1`).
To drain the editor's queue at once from the box: `CMS_RELAY_KEY=… node relay.mjs drain --via ca` (key in .secrets.json),
or dispatch the `cms-relay` workflow.

## Optional: instant publishing (only Sion can supply)
A fine-grained GitHub token (repository `unclehowell/cedwyn` only; Contents read+write, Actions read+write). Sion would paste it
into the editor (not into chat) — an API call `PUT /admin/api/settings/token {"token":"github_pat_…"}` exists and stores it
sealed (AES-GCM) in KV; there is no settings screen yet, the relay path works without it.

## Files
* `worker/index.js` Worker (API, login, sessions, KV) · `worker/engine.js` commit engine + guards · `worker/admin.html` the editor (deployed as module admin.txt)
* `relay/relay.mjs` engine runner (Actions / box) · `cms-relay.yml` copy of the workflow on main
* `deploy.py` deploy/update the Worker (`--setup` made KV, Worker, routes) · `state.json` ids · `.secrets.json` secrets (box only)
* `verify_live.py` live end-to-end check (login, sandbox draft → publish → relay → undo) · `test/` local harness notes

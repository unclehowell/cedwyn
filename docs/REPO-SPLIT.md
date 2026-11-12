# REPO SPLIT — agent instructions (activated 5 Nov 2026)

**Issue:** [#188](https://github.com/unclehowell/cedwyn/issues/188)  
**Inventory:** [`split-repos.json`](../split-repos.json) on `main`  
**Sync workflow:** [`.github/workflows/sync-split-repos.yml`](../.github/workflows/sync-split-repos.yml)

## What changed

Every durable Cedwyn webapp now has its **own GitHub repository**. Those separate repositories are the **source of truth** (`"mode": "split-repo"` in `split-repos.json`).

The monorepo `unclehowell/cedwyn` still:

- holds `main`, the unified catalogue, and site-wide tooling
- keeps the **old theme branches** (e.g. `section/wales-3d`, `hive`, `chess`) so the live build and every path on `bucklerfamily.estate` keep working
- runs `sync-split-repos` on a schedule (and on demand): for each app in `split-repo` mode it copies that app’s separate repo `main` **into** the old branch (shallow, no force-push, empty mirrors skipped)
- runs `build-cedwyn` which still assembles the live site from those theme branches into the Cloudflare Pages project

**Nothing was deleted.** Old branches remain. Domain paths are unchanged.

## Where to send work

| Kind of change | Where to open the PR |
|---|---|
| One webapp’s content, assets, worker, or app-local tools | **That webapp’s separate repository** (see table below / `split-repos.json`) |
| Site-wide rules, catalogue core, shared `_cedwyn` assets, `build.yml`, Academy, lint | **`unclehowell/cedwyn`** on `main` (label `site-wide` when required) |
| Pin / sections.lock / build-only | `unclehowell/cedwyn` as today |

**Do not** open feature PRs against the old monorepo theme branches for apps listed as `split-repo`. Those branches are **mirrors fed by sync**, not the edit target.

## How to work on one webapp

1. Read the app’s row in [`split-repos.json`](../split-repos.json).
2. Clone **only** the separate repo (small, fast):

```bash
git clone --depth 1 https://github.com/unclehowell/cedwyn-<name>.git
cd cedwyn-<name>
```

3. Branch, edit, open a PR **into that repository’s `main`**.
4. After merge, `sync-split-repos` (or a manual dispatch) copies `main` into the old branch on `unclehowell/cedwyn`. A later `build-cedwyn` publishes the path on the live domain.

Do **not** clone the full monorepo for a single-webapp job.

## What mirror.yml does on the separate repos

Each separate repo still has `.github/workflows/mirror.yml`. It reads `split-repos.json` on `unclehowell/cedwyn` `main`:

- **`mode: mirror`** — separate repo copies **from** the old branch (legacy direction).
- **`mode: split-repo`** (current) — mirror job does not treat the old branch as source; the separate repo is authoritative. Sync runs the other way.

## Live domain

Visitors still use one domain:

- https://bucklerfamily.estate / https://cedwyn.bucklerfamily.estate  

Paths such as `/wales/`, `/hive/`, `/chess/` are unchanged. Production is **not** one Cloudflare Pages project per webapp; it remains the unified `build-cedwyn` → `site` branch → Pages project `cedwyn`.

## Temporary / feature branches

Do **not** create permanent separate repositories for short-lived feature or night branches. Only durable webapps listed in `split-repos.json` have their own repos.

## Agent checklist

1. Identify the webapp and its `repo` field in `split-repos.json`.
2. Confirm `mode` is `split-repo` (it is for the durable set).
3. Clone that repo only; PR there.
4. Link the PR to the canonical GitHub Issue for the work.
5. Do not delete monorepo branches. Do not change production routing or spend without owner authorisation.
6. Site-wide or multi-app changes stay on `unclehowell/cedwyn` `main`.

## Inventory (durable apps)

Full machine-readable list: [`split-repos.json`](../split-repos.json). Examples:

| App | Separate repo | Old branch | Path |
|---|---|---|---|
| Wales 3D | `unclehowell/cedwyn-wales-3d` | `section/wales-3d` | `/wales/` |
| Hive | `unclehowell/cedwyn-hive` | `hive` | `/hive/` |
| Chessboard | `unclehowell/cedwyn-chess` | `chess` | `/chess/` |
| Research Library | `unclehowell/cedwyn-research` | `section/research` | `/research/` |
| … | … | … | … |

If an app is missing from `split-repos.json`, treat the monorepo branch as source until the inventory is updated via #188.

— Cedwyn maintainers / REPO SPLIT activation 5 Nov 2026

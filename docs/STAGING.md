# Staging previews (PR-first changes to Cedwyn)

Every change to the live site goes through a pull request first, so it can be previewed, then accepted, changed or rejected.

1. Build the change on its own branch: `section/<id>` for a section/webapp, or `staging/<anything>` for any other change.
2. Cloudflare Pages (project `cedwyn`) builds a preview of that branch on every push:
   `https://<branch-slug>.cedwyn-274.pages.dev/` (slug = branch name, lower case, `/` and other symbols become `-`).
   Branches previewed today: `section/wales-3d`, `section/argentina-3d`, `staging/*` (the Pages project's preview list;
   add a branch there to preview it). `main` and `site` are never previewed.
3. Open a PR to `main` (for a section: the `themes.json` / `sections.lock` / `data/halves.json` change that switches it on).
   The `staging-preview` workflow posts one comment with the preview link(s) and keeps it current on every push.
4. Review the preview. Merge = accept (the site build then publishes it); push more commits = modify; close = reject.

Adapted from the datro repo's Cloudflare Pages per-branch deploys (`wrangler pages deploy --branch`, deploy-qa.yml) and its
October 2025 move to Cloudflare Pages git previews. No Cloudflare token is stored in this repo; Cloudflare builds the previews itself.

Source: unclehowell/datro `.github/workflows/deploy-qa.yml` (gh-pages, `wrangler pages deploy --branch`); Cloudflare Pages project `cedwyn` preview settings.

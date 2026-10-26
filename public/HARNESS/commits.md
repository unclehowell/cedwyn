# Repository and build rules (Cedwyn)

- Repository: the Cedwyn site repository. Branch model:
  - **main** — the shell: header, menu, runtime, landing page, build tools, `themes.json`, `sections.lock`, shared rules (chronology, ingredients), CI. Site-wide changes only; a pull request into main carries the label `site-wide`.
  - **theme branches** — one section per branch (for example `wayback`, `maps`, `projects`, `kissed-frogs`, `cedwyn-movie`, and `agents` for this library). Each branch's `public/` (or its listed dir) is copied to `/<id>/` at build time.
  - **section/<id>** — snapshot branches for crawled sections, pinned by `sections.lock`.
  - **site** — the assembled output served to readers.
- A new section is registered by one entry in `themes.json` on main (id, titles in en/cy/es, branch, dir, group). That is a site-wide change.
- Commit messages end with the house sign-off. No force-push. Re-fetch the branch head before each commit.
- After JS or CSS changes, bump the asset `?v=` and purge the edge cache.
- Builds take about 30–35 minutes. Verify live with a cache-busted fetch (`?cb=<time>`) and a phone-width (390 px) render.
- Pages limits: about 20,000 files per deployment and 25 MiB per file; GitHub's 100 MB per file. Keep media in the storage repositories, not in sections.
- Rollback of a section: point its theme entry or lock line back to the previous commit; one commit.
- Never commit to the frozen legacy repository. Never alter the WordPress wiki beyond redirects.

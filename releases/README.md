# cedwyn-releases

The Release Machine (`/releases/`): publication-date sequencer, 1987-2026 - each line is a related document placed at its publication date, titles hyperlinked to sources.

This repository is the source of truth for the app. The authoritative `split-repos.json` in `unclehowell/cedwyn` lists it as `mode: split-repo` and `deploy: repo`. The estate build reads this repository's `main` directly for `/releases/` (see `tools/assemble.py` in `unclehowell/cedwyn`), records the source commit, and fails closed if it cannot read the repo.

The retained `releases` branch in `unclehowell/cedwyn` is historical/legacy only; it is not the current deployment source. The central `sync-split-repos` workflow excludes `deploy: repo` apps. Make changes here on feature branches and open pull requests into this repository's `main`.
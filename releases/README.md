# cedwyn-releases

**Releases** (`/releases/`): a social-style wall feed of GitHub releases across Buckler Family Estate repositories, sorted latest → oldest.

Each card shows the release title, tag, author, relative time, body preview, draft/pre-release badges, and links back to the release and the repo’s full releases list. Filters: by repository and show/hide drafts. Data is fetched live from the public GitHub Releases API.

This repository is the source of truth for the app. The authoritative `split-repos.json` in `unclehowell/cedwyn` (or the estate build) lists it as `mode: split-repo` and `deploy: repo`. The estate build reads this repository’s `main` directly for `/releases/`, records the source commit, and fails closed if it cannot read the repo.

The retained `releases` branch in `unclehowell/cedwyn` is historical/legacy only; it is not the current deployment source. Make changes here on feature branches and open pull requests into this repository’s `main`.

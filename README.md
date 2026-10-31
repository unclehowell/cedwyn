# Cedwyn · documentary (theme compartment; branch name kept as cedwyn-movie)

A self-contained compartment of cedwyn.bucklerfamily.estate: the advent page for the Cedwyn film (*a tab.bot production*).
Built from this branch only (`public/` is the theme root, served at `/documentary/`, and under `/wales/documentary/` and `/argentina/documentary/`). `/movie/` and `/documentry/` answer 301 to `/documentary/` (aliases in main's tools/site.py).
- `public/documentary.js` (v1.3.0): film versions worked out from manifest.json (v1.0.0 = Scene 1, free, the default; each new scene a new minor version needing the viewing licence, one Stripe checkout at £4.99 or membership: `window.CEDWYN_MEMBER = true` or `/api/member/` answering `{"member": true}`). `public/licence/` holds the licence terms (cy/en/es).

- `public/index.html`, `movie.css`, `movie.js`: the page — every planned frame as a door with its number, dates, logline, scene script and subtitles; the production prompt remains available in the page's own menu. `public/script/` is the whole-story master screenplay/source-ledger entry point; `public/data/documentary-plan.json` is its machine-readable production policy.
- At run time the page reads the film's storage repository (unclehowell/cedwyn-movie): `frames.json`, `manifest.json` (which doors are open), `PROMPT.md`, scripts, subtitles and media, which it plays inline. That repository is the only other address the page reads. `public/data/` is the snapshot used when it cannot be read.
- The daily scene run commits only to the storage repository, so this branch changes only when the page itself changes.
- No other theme or shared file is touched from here; the theme is registered by one entry in `themes.json` on main.

Commits end with "— Sion's Tab agent".

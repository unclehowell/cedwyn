# Cedwyn · the film (movie theme compartment)

A self-contained compartment of cedwyn.bucklerfamily.estate: the advent page for the Cedwyn film (*a tab.bot production*).
Built from this branch only (`public/` is the theme root, served at `/movie/`, and under `/wales/movie/` and `/argentina/movie/`).

- `public/index.html`, `movie.css`, `movie.js`: the page — every planned frame as a door with its number, dates, logline, script and subtitles; subtitles toggle; Cymraeg / English / Español audio; the production prompt in the page's own menu.
- At run time the page reads the film's storage repository (unclehowell/cedwyn-movie): `frames.json`, `manifest.json` (which doors are open), `PROMPT.md`, scripts, subtitles and media, which it plays inline. That repository is the only other address the page reads. `public/data/` is the snapshot used when it cannot be read.
- The daily scene run commits only to the storage repository, so this branch changes only when the page itself changes.
- No other theme or shared file is touched from here; the theme is registered by one entry in `themes.json` on main.

Commits end with "— Sion's Tab agent".

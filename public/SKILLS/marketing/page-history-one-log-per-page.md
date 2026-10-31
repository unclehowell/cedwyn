# One page history per page (not a commit-log dump)

Why now: 19:37 30 Oct, on /learn/: "Why 2 logs?" The page showed a hand-written "Page journal" AND the site footer's "Page versions" table, which listed unrelated repo commits (e-book titles, Wales tiles, landing modals). Worker for "ACADEMY PAGE: ONE JOURNAL" is fixing /learn/ itself; this skill is the rule for every page after it.

## What the primary sources say (read 30 Oct 2026)
- Keep a Changelog 1.1.0 (keepachangelog.com, read): "Changelogs are for humans, not machines." Guiding principles: an entry for every version; same types of change grouped (Added / Changed / Deprecated / Removed / Fixed / Security); versions linkable; "The latest version comes first"; "The release date of each version is displayed"; say whether you follow Semantic Versioning. Under "Can changelogs be bad?": "Using commit log diffs as changelogs is a bad idea: they're full of noise. Things like merge commits, commits with obscure titles, documentation changes, etc." It also recommends ISO dates (2017-07-17: largest to smallest unit, no regional ambiguity).
- Google Search Central, "Influence your byline dates" (developers.google.com, read): show one user-visible date prominently, labelled "Published" or "Last updated"; keep the visible date and datePublished/dateModified in structured data consistent; dates describe the page, "not the stories or events described therein"; and "Minimize the presence of other dates on the page" if the wrong date is being picked. Two tables of dates at the foot of a page are exactly the clutter that line warns about.
- No conversion number exists for this (none found); the case is trust + reader time + correct dates in search. Mark it as a hygiene rule, not a growth lever.

## The rule (do this)
1. ONE log per page, at the foot, in the site's standard "Page versions" look (Version · Date · Change · Who). Never a second hand-written journal beside it.
2. Only this page's own changes. A row qualifies if a reader of THIS page would notice it. Filter the generator by path (files that render this page), never repo-wide history. A shared footer that cannot filter must render nothing rather than repo noise.
3. Human sentences, not commit subjects: "Family code entry added to the join card" — not "fix: api-worker index.js [skip ci]". Strip [skip ci], hashes, branch names, P-numbers.
4. Newest first; semver per page (1.change.fix as the site already states); one date format sitewide (the footer uses DD/MM/YYYY HH:MM GMT — keep it, do not mix with ISO in the same table).
5. One visible "Last updated <date>" equal to the top row's date, and the page's dateModified (JSON-LD) equal to it. No other "updated" dates on the page.
6. Pages served outside the static build (Workers: /learn/, cedwyn-api pages) must declare their own entries (a small JSON array in the Worker) and render through the same table markup, so they look identical to built pages.
7. Check before shipping: count `<table` rows under the footer heading = 1 table; grep the rendered rows for words from other sections (e-book, Wales, hologram) = 0 hits.

## How we apply it to Cedwyn
- /learn/: one table, rows 1.1.1 (one journal; unrelated entries removed), 1.1.0 (family code + dark theme), 1.0.0 (created) — that is the academy worker's brief; this skill backs it.
- Sitewide: the footer generator that reads the whole repo's commits is the "commit log diff" anti-pattern; the academy worker logs it to the project workspace The fix belongs to the cedwyn main owner: path-filter commits per page, map commit subjects to a curated "change" line (fallback: omit the row, never show a raw subject).
- Same rule for e-book editions: each book's edition list is a changelog for buyers — newest first, one line per version, what a reader gains ("+ supplement 25 Oct 2026"), never build notes.
- Public text rules still apply to change lines (neutral, banned words, never name the project lead).

Sources: keepachangelog.com ; developers.google.com (both read 30 Oct 2026).
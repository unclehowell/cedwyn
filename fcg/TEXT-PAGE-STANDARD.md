# Cedwyn text-page standard (v1.0.0, 10 Nov 2026)

The design of the FCG case pages is the standard for every text-heavy page on bucklerfamily.estate.
Reference page: https://bucklerfamily.estate/fcg/case/itv-cymru-wales-forensic-institutional-review

Stylesheet: `assets/text-page.css` in this repo (served at https://bucklerfamily.estate/fcg/assets/text-page.css).
It is the reference theme (`assets/theme.css`, v=20261020a) with its text-page rules renamed to `tp-*` so any webapp can use them
without inheriting the FCG nav. Each webapp keeps an identical copy at `public/assets/text-page.css` (or `web/<app>/assets/`)
so it stays self-contained; when you change the standard, bump the version line at the top and copy it to every app that carries it.

## What the standard is
- Native scheme dark: black page, body text #d4d4d4, headings and links white, muted #a3a3a3, hairlines rgba(255,255,255,.16).
  Pin `<html class="tp" data-ghf-native="dark">`; the shared header shell then shows the page inverted in day mode
  (light paper, dark ink) and black at night, exactly like the reference.
- Type: Barlow (the shell serves 300/400/500). Headings thin, uppercase and tracked (the shell sets h1/h2 weight 300);
  h3 small caps-style uppercase .9rem tracked .16em; body 17px (16.5px on phones), line-height 1.65.
- One reading measure: the article column is 46rem (`--tp-wrap`) centred, 1.5rem side padding (1.1rem under 640px).
- Hero band (`.tp-hero` > `.tp-hero-in` > `p.tp-kicker`, `h1`, `p.tp-meta`): dark gradient, kicker and meta in small tracked
  uppercase. Inside the shell the kicker is visually hidden (the app name is already in the header bar).
- Sections: `h2` with a hairline rule above and 2.2rem padding; lists with muted markers.
- Callouts (`.tp-src`): panel #0d0d0d, hairline border, 2px white left rule; ghost buttons (`.tp-btn`) white outline, uppercase.
- Tables: full width, scroll sideways on phones, uppercase tracked headers, hairline rows.
- Chips (`.tp-chips`) for year/period jumps and filters; rows (`.tp-row`) for one record per line; mono ids (`.tp-id`).
- Dialogs: panel styling, and `html.tp.ghf-inv dialog` re-inverts the top layer so a tap-to-open detail matches the page in day mode.

## How to apply it to a page
1. Add `<link rel="stylesheet" href="assets/text-page.css?v=1.0.0">` and copy the file into the app's `assets/`.
2. Put `class="tp" data-ghf-native="dark"` on `<html>` (keep any classes the page's script uses).
3. Wrap the body content: `<div class="tp-hero"><div class="tp-hero-in"><p class="tp-kicker">App · place</p><h1>Title</h1>
   <p class="tp-meta">one-line scope</p></div></div><div class="tp-article"><div class="tp-content"> … </div></div>`.
   Hero words come from the page's own title and description.
4. Replace the page's old colour/font rules with small app rules that use the `--tp-*` variables (see courtdrills, csscpsg,
   thousand-cuts for worked examples: monospace registers become hairline rows, highlights use `--tp-hi`).
5. Presentation only: never move, reword or drop content, IDs, evidence records, data files or links; keep the shared site header.
6. Check at 390 px and desktop, cache-busted, in day and night mode; no sideways scroll.

Applied (10 Nov 2026): /courtdrills/ (cedwyn-courtdrills), /csscpsg/ (cedwyn-csscpsg), /thousand-cuts/ (cedwyn main web/thousand-cuts, by PR).

— Cedwyn editors

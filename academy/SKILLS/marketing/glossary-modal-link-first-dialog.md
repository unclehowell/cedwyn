# Glossary as a pop-up (modal) without losing the glossary's search value: link-first `<dialog>`

Harvested 2026-10-27 (SKILLS HARVEST). Trigger: the project lead, WhatsApp 14:22 GMT 27 Oct: glossary "comes up as a page/theme/segment but its not got a number ... Seems better it be a popup in a modal instead of a dedicated page. Do that". Builds on glossary-definition-pages-internal-anchor-text.md (rule 3: real `<a href>`, modals may enhance).

## What the evidence states (sources read 27 Oct 2026)
- Google indexes what is in the page HTML, hidden or not, but not what only loads after a click. Mobile-first indexing doc (Google Search Central): accordions/tabs are fine as long as content is in the page; "Don't lazy-load primary content upon user interaction. Google won't load content that requires user interactions (swiping, clicking, typing)". Illyes (2016) and Mueller (Mar 2020 office hours) on hidden tab/accordion content: full weight if in the HTML (Fresh Egg summary, read; SEJ/SER snippets).
- So a modal that fetches the definition on click is invisible to search and to AI crawlers; a modal that shows text already in the page, or opens a definition that also exists at a crawlable URL, is not.
- Native `<dialog>` + `showModal` (MDN; web.dev Learn HTML; Jared Cunha's 2025 write-up, read): gives focus moved into the dialog, the rest of the page inert, Escape to close, and `close` returns focus to the term that opened it. `closedby="any"` adds backdrop click to close where supported. Known snags: focus lands on the first focusable element (put the close button first, or `autofocus` on it; `autofocus` on the dialog itself fails in desktop Chrome); the page behind still scrolls (set `overflow:hidden` on `<html>` while open); give it `aria-labelledby` pointing at the term heading.

## The pattern (link-first, modal on top)
1. Keep one crawlable glossary source: either the existing /glossary/ page (entries with stable ids `#slug`) or one entry per URL. It stays in the sitemap and llms.txt; it just leaves the theme nav, so it no longer looks like a numbered theme/segment.
2. Every term in body text stays `<a class="cw-g" href="/glossary/#slug">term</a>` written at build time (no JS needed to reach the definition; works with JS off, in readers, for crawlers).
3. JS enhancement on every page: one shared `<dialog id="cw-gloss" aria-labelledby="cw-gloss-h">` with a close button first. On click of `a.cw-g`: `preventDefault`, fill from a small inline JSON (`<script type="application/json" id="cw-gloss-data">` holding only the terms used on that page, built at build time) and `showModal`. Also offer "Full glossary" link inside the dialog.
4. Deep links: `/glossary/#slug` still lands on the entry; optionally `?g=slug` on any page opens the modal on load (share a definition without leaving the page).
5. Style with the site's variables so it follows dark mode (see dark-mode-prefers-color-scheme-no-flash.md); `::backdrop` semi-opaque; max-width 34rem; body text 17px+; at 390 px it sits as a bottom sheet (`margin:auto 0 0`, full width, rounded top).
6. Test: keyboard only (Tab to term, Enter opens, focus on close, Escape closes, focus back on the term); VoiceOver reads the term as dialog title; 390 px light and dark screenshots; JS disabled still reaches /glossary/#slug; grep that every `cw-g` href resolves to an existing id.

## How we apply it to Cedwyn
- Remove "Glossary" from the theme switcher/nav and any theme numbering so it no longer reads as a theme or segment; keep /glossary/ as the plain, unnumbered reference page (noindex is NOT needed; it is real reference content that earns long-tail search and AI citations for Welsh place and legal terms).
- Add the shared dialog + inline per-page JSON in the human front-end build (data/glossary.json + tools/wikilinks.py already write `a.cw-g` links at build time, the correct base). Ship the dialog JS once in the shared halves bundle, vendored locally, no CDN.
- Same treatment can serve the nomenclature modal: trigger stays an `<a href>` to the variant's explanation.
- Public text rules still apply inside the definitions (banned words, never name the project lead, no holdings, no outbound links except the /wayback/ rule).
- Bump semver on the shared bundle and the glossary page; add "glossary dialog opens, keyboard closes, dark mode OK" to the onpage audit.

## Sources
- developers.google.com (read)
- freshegg.co.uk (read; Illyes 2016, Mueller Mar 2020)
- seroundtable.com (snippet)
- developer.mozilla.org (snippet)
- web.dev (snippet)
- jaredcunha.com (read)
# Headline-first pages with "Read more" (progressive disclosure) for a long-form history site
Harvested 2026-10-26 (skills harvest). Topic: page design / web writing for people who scan, without losing search or AI visibility. the project lead asked for this at 12:01 GMT 26 Oct ("a series of headlines ... everything after requires 'read more'").

## What the evidence shows
- **People scan, they don't read (NN/g primary research).** Jakob Nielsen's studies: on an average page users have time to read at most 28% of the words, 20% is more likely (NN/g, "How Little Do Users Read?", 2008, from logged browsing data). In NN/g's writing test, the same content rewritten **concise** scored 58% better usability, **scannable** 47% better, and concise + scannable + objective together **124% better** ("How Users Read on the Web"). "Objective" = no promotional exaggeration: plain, checkable statements.
- **Inverted pyramid (NN/g).** Put the key point (the conclusion) first, then supporting detail, then background, so a reader who stops at any line still leaves with the main point. Steps: identify the key points, lead each block with one, push detail down.
- **Accordions on mobile (NN/g, Raluca Budiu, 2015).** On mobile, accordions are among the most useful elements: they cut scrolling past irrelevant blocks. Failure modes seen in testing: (1) jumping the opened panel to the top of the screen makes users think they changed page and hit Back (they leave); (2) vague headings mean people open everything or nothing; (3) when users need most of the content anyway, accordions just add clicks. Fixes: expand in place, clear +/− or chevron icon, headings that carry the point, allow several open at once.
- **Progressive disclosure (NN/g).** Show the few most important things first; defer the rest to a second level. Works only if the first level really is what most people need and the label for the second level names what is behind it.
- **Search and AI crawlers (Google Search Central, mobile-first indexing doc).** Google explicitly suggests "moving content into accordions or tabs to save space" and treats hidden-for-UX content as fine as long as it is in the page. The hard rule: **"Google won't load content that requires user interactions (for example, swiping, clicking, or typing)"** - so the detail must already be in the HTML, never fetched on click. Fresh Egg (UK agency, 1 Jul 2026) traces Google's line from "may carry less weight" (2014-15) to full weight under mobile-first (Illyes 2016, Mueller 2020).

## How to do it (checklist)
1. **One headline = one evidence-backed claim**, 6-14 words, a full sentence with a verb and, where possible, a date or number ("1824: the first record mention of Tŷ Mawr is the David Stewart survey"). No teaser headlines that hide the point - the headline is the point.
2. **One-line standfirst under each headline** (the "so what"), visible. Then `<details><summary>Read more</summary> ...full detail, sources, images... </details>`.
3. Use native `<details>/<summary>`: works with no JS, keyboard and screen-reader accessible, text stays in the HTML for crawlers and AI. Never inject the detail by fetch/JS on click.
4. Summary label names what's inside where possible: "Read more: the survey entry and map" beats "More". Bilingual: "Darllen mwy" / "Leer más".
5. Expand in place; don't scroll-jump. Allow multiple open. Add `id`s so `#anchor` links open the right panel (small JS: if location.hash matches a details id, set `open`).
6. Keep 4-8 headlines per page. If a reader needs every section, it's a reference page (e.g. the names register) - leave it open with a table of contents instead.
7. Print and Ctrl-F: browsers find text inside closed `<details>` in recent Chrome/Firefox; add `@media print { details > *:not(summary) { display:block } }` so print shows everything.
8. Measure: count "Read more" opens (one analytics event per `toggle`), scroll depth, and e-book CTA clicks before vs after (2-4 weeks each; small traffic, so read it as direction, not proof).

## How we apply it to Cedwyn
- The framing + layout worker (started 12:02, 26 Oct) owns the build; this file is its reference. Do it once in the shared template/data layer so all 36 themes inherit it.
- Our own audit helper: `tools/details_audit.py <url>` counts `<details>`, missing `<summary>`, empty panels, headline word counts, and visible vs collapsed words, so we can confirm the detail is in the raw HTML (crawlable) after each build.

## Sources
- nngroup.com
- nngroup.com
- nngroup.com
- nngroup.com
- nngroup.com
- developers.google.com
- freshegg.co.uk
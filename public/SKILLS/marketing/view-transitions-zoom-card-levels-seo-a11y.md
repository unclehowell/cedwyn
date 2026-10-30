# Zoom-through card levels with the View Transitions API: keep it fast, linkable, indexable and motion-safe

Date: 2026-10-30 (skills harvest 03:00Z). Why now: on 30 Oct 02:30 the owner asked for text pages as cards (header, 4 lines, "Read more"). Read more zooms through into a deeper level of up to 4 cards, and Back zooms out. The graph-banner worker (348231ae) is building it now. This file is the CRO/SEO/accessibility checklist for that pattern, not the build.

## What the sources say (read 30 Oct 2026 unless marked)
- **Chrome for Developers, "View transitions case studies" (Gopalakrishnan & Rajpal; read):**
  - **redBus** added view transitions in its booking funnel along with INP work and saw **7% more sales**. That is combined with the INP work, so it isn't the transitions alone. The team credits better perceived performance while slow inventory fetches run.
  - **CyberAgent (Ameba news)** uses the excerpt -> "See more details" pattern: **only the part that changes animates in**, so a multi-page site feels like an app.
  - **Nykaa and PolicyBazaar** replaced custom JavaScript animations, which had cost performance and maintenance. PolicyBazaar reports better usability, engagement and satisfaction, with no number given.
  - These are vendor-published case studies, not independently checked.
- **Browser support** (from the same Chrome page's support table): Chrome 111, Edge 111, Firefox 144, Safari 18.
  - Anything older just swaps without animation, so the feature is a progressive enhancement and nothing breaks.
  - The multi-page (cross-document) variant was behind a flag when that page was written. Same-document `document.startViewTransition()` is the safe route.
- **prefers-reduced-motion:**
  - MDN and web.dev (search snippets, pages not opened this run): the media query detects that the user asked the system to minimise motion.
  - WordPress Performance issue #2067 (snippet): the view-transition plugin did not respect it at first, which matters for vestibular disorders. A zoom past the screen edges is exactly the large-scale motion this setting exists for.
- **Related files already in the index:**
  - headline-first-read-more-progressive-disclosure.md (NN/g: users read 20–28% of words; native `<details>`);
  - tools/details_audit.py (crawlability check);
  - speculation-rules-prefetch-bfcache-instant-next-page.md.

## How to do it (checklist)
1. **All text in the HTML.** Every level's cards (header + full paragraph) are in the served page. "Read more" only changes which level is in view.
   - Google and AI crawlers don't click, so text fetched on tap (page-2.json) is invisible to them unless the page also links to a crawlable URL holding it.
   - Run details_audit.py before and after: visible-on-load words + hidden words must equal the old page's word count.
2. **One URL per level.** On zoom-in, `history.pushState` a hash or path (`#level-evidence-1987`). On popstate, zoom out.
   - The phone's back button, shared links and deep links then land on the right level.
   - A `#hash` target inside a deeper level opens that level directly, with no animation.
3. **Real links and buttons.** Each card's "Read more" is a `<a href>` to the level URL (crawlable, opens in a new tab). JS intercepts it for the animation.
   - Back is a `<button>`, focusable, labelled "Back to <parent title>".
   - Move focus to the new level's heading after each transition, and announce it with `aria-live="polite"`.
4. **Same-document transitions only:** `document.startViewTransition(() => swapLevel())` inside `if (document.startViewTransition)`, else swap instantly.
   - Animate only the leaving level (`scale(1.6)`, `opacity:0`) and the entering cards (`scale(.85)`->1). That is the CyberAgent "only what changes" rule.
   - Keep it to 250–400 ms.
5. **Motion-safe by default:** `@media (prefers-reduced-motion: reduce) { ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; } }`. Also skip `startViewTransition` in JS when `matchMedia('(prefers-reduced-motion: reduce)').matches`.
6. **No layout shift and no blocked input:**
   - Card height is fixed by 4-line clamp (`-webkit-line-clamp:4`) with reserved space.
   - The transition never waits on a network fetch, and INP stays under 200 ms.
   - Test at 390 px with CPU 4x slowdown.
7. **Measure** with the existing first-party beacon (campaign-tags-first-party-beacon-workers-analytics-engine.md):
   - level-open events per card;
   - depth reached;
   - Back vs browser-back;
   - /ebooks/ clicks from deep levels vs the old long pages, over 14 days.
   - Keep the change if depth or /ebooks/ clicks rise and bounce does not.

## How we apply it to Cedwyn
- **Hand to a worker** (via the root, not directly) as a review list: full text in HTML, a hash URL per level, real `<a href>` cards, reduced-motion off-switch, focus move, and details_audit word-count parity.
  - Its report at 02:53 lists Back, browser back and Esc as working, which covers point 2 in part.
  - Points 1, 3 and 5 are not confirmed in that report.
- **Leave alone:** the evidence register, timeline and wiki are the pages search and AI answers cite. A level-swap must never drop their text from the served HTML. Check those three first after it goes live.
- **App and filter pages stay unclipped,** as the worker already chose (Q&A, academy, dartboard, documentary player).
- **Not checked:** whether Google gives full weight to text inside non-visible levels on our pages. Look at Search Console URL Inspection > View crawled page on one level-heavy page after the build.

## Sources
- developer.chrome.com (read 30 Oct 2026)
- developer.chrome.com (read 30 Oct 2026)
- web.dev (snippet only)
- developer.mozilla.org (snippet only)
- github.com (snippet only)
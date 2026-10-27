# Dark mode for Cedwyn pages: follow the phone, no white flash (prefers-color-scheme + color-scheme)

Harvested 2026-10-27 (SKILLS HARVEST). Trigger: the project lead, WhatsApp 14:19 GMT 27 Oct: /wales/blog/ "has a theme error its white when the phone and webpage is dark mode".

## What the evidence states (sources read 27 Oct 2026)
- Many readers run their phone dark. Android Authority reader poll: ~82% of ~2,500 Android respondents use dark mode (poll, self-selected tech readers; via forms.app, not re-read at the poll page). Treat as "most phone readers", not a measured share of Cedwyn traffic.
- Dark mode is a system-level choice. NN/g (Kohler & Zhang, Aug 2023): users think about it at the system level, not per app, and behave about the same without it. What they notice is a page that ignores their setting: a white page after a dark one is the bug the project lead reported.
- Readability: NN/g (Budiu, 2020): with normal vision, light mode (dark text on light) reads better; some low-vision readers (cataract, cloudy ocular media) do better in dark. So: follow the system, never force dark on everyone.
- Battery: Purdue study cited by NN/g: dark mode cut OLED power 67% at 100% brightness but only 14% at 30%. Image-heavy pages save little.
- Contrast: highly saturated colours on dark grey fail WCAG 2 (4.5:1 body, 3:1 large text). Pick tuned dark colours, not the light palette inverted.
- Mechanism (web.dev, Thomas Steiner, "prefers-color-scheme" and "color-scheme" articles): `@media (prefers-color-scheme: dark)` sets your own colours; `<meta name="color-scheme" content="light dark">` (or `:root{color-scheme:light dark}`) tells the browser before CSS loads, so form controls, scrollbars and the default canvas follow the theme and there is no white flash. CSS system colours `Canvas` / `CanvasText` must be used together.
- Chrome Auto Dark Theme (developer.chrome.com) can darken pages that declare nothing, which gives a light page partly darkened in one browser and white in another. Declaring `color-scheme` opts out of that guesswork.

## How to do it (checklist)
1. In every theme's `<head>`, before any stylesheet: `<meta name="color-scheme" content="light dark">`.
2. One set of CSS variables, overridden once:
   ```css
   :root{--bg:#fbfaf7;--fg:#1d1d1b;--muted:#5b5b57;--link:#1f4e79;--card:#fff;--line:#e3e0d8}
   @media (prefers-color-scheme: dark){:root{--bg:#141412;--fg:#e9e6df;--muted:#a8a49b;--link:#8fb8e6;--card:#1d1d1a;--line:#33322e}}
   body{background:var(--bg);color:var(--fg)}
   ```
   Every hard-coded `background:#fff`, `color:#000`, white card or white SVG fill gets swapped to a variable. Avoid pure #000 backgrounds and pure #fff text (halation); off-black and off-white.
3. Images: logos/diagrams with transparent backgrounds need a light plate or a dark variant (`<picture><source srcset="x-dark.png" media="(prefers-color-scheme: dark)">`). Scanned cuttings and photos stay as they are.
4. Iframes, embeds, maps and modals inherit nothing: give them the same variables (dialog `::backdrop` too).
5. A manual toggle is optional. If added, store it (localStorage) and set `data-theme` on `<html>` from an inline script in `<head>` so there is no flash; default stays "follow system".
6. Test: Chrome DevTools > Rendering > "Emulate CSS media feature prefers-color-scheme: dark", at 390 px; screenshot light and dark; check contrast of body text, links, muted text and buttons (4.5:1). Playwright: `page.emulate_media(color_scheme="dark")`.
7. Grep gate per build: every theme HTML has the color-scheme meta; no theme CSS has `background:#fff`/`white` outside a variable definition.

## How we apply it to Cedwyn
- Read 27 Oct 14:30Z: /wales/blog/ HTML has no `color-scheme` meta and no `prefers-color-scheme` rule; its `blog.css` (679 bytes) has none either; /wales/ loads `/_cedwyn/halves/lb.css` (no dark rule either). So the blog shows browser-default white whatever the phone states. Fix at the shared layer (theme head + one variables block), not page by page, so the 9 themes and /wayback/ snapshots (Bootstrap 5.3 has `data-bs-theme`; set it from the system preference) all follow the phone.
- Add the dark screenshot (390 px, emulated dark) to every theme's verify step and to the onpage audit list (meta present, contrast pass).
- The glossary modal (see glossary-modal-link-first-dialog.md) and the poster shop cards must use the same variables.
- Marketing angle: a page that flashes white at night on a phone reads as broken and costs trust on the /ebooks/ buy path; record the before/after as one growth-experiment row only if traffic allows (it will not be measurable at current volume; ship it as a quality fix).

## Sources
- web.dev (read)
- web.dev (read)
- developer.chrome.com (read)
- nngroup.com (read)
- nngroup.com (read)
- forms.app (snippet: Android Authority poll 81.9% of 2,500; poll not re-read)
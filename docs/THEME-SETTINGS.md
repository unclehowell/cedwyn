# Theme settings — one dark/light/font/size setting for every Cedwyn webapp

Version 1.0.0, 1 Nov 2026.

## What a visitor gets
`/settings/` (theme `settings`, branch `theme-settings`, dir `public`) lets a visitor choose:

| setting | choices | stored as (localStorage, this origin) | default (absent) |
|---|---|---|---|
| Light or dark | Follow my device · Light · Dark | `ghf-theme` = `day` / `night` (+ cookie `ghf_theme`, as the header toggle already does) | follow the device (`prefers-color-scheme`), else local time |
| Font | Cedwyn (Barlow) · Arial · Verdana · Georgia · Times New Roman · My device's font · Typewriter | `cedwyn-font` = `arial` / `verdana` / `georgia` / `times` / `system` / `mono` | Barlow (`--ghf-font`) |
| Text size | Smaller · Normal · Larger · Largest | `cedwyn-size` = `s` (0.9) / `l` (1.15) / `xl` (1.3) | normal |

Defaults are today's look, so nobody sees a change until they choose one. Nothing leaves the browser.

## How every other webapp follows it
One shared script, `/_cedwyn/ghf/ghf-boot.js` (2.1.20+), already runs in `<head>` of every page with the header and sets
`<html data-ghf-mode>` before the first paint. From 2.1.20 it also reads `cedwyn-font` and `cedwyn-size` there and:
- sets `--ghf-font` / `--cedwyn-font` and `<html data-cedwyn-font>` (the shared type rule in ghf-theme.css already uses `var(--ghf-font)`;
  a small inline rule carries the font to page text that sets its own family; code, icon fonts and `[data-cedwyn-font-keep]` are left alone);
- sets `--cedwyn-scale` and `<html data-cedwyn-size>` (page content below the header is zoomed by that factor; the header keeps its size);
- listens to the `storage` event, so a change made on /settings/ shows in other open tabs at once.
Light/dark keeps the existing `ghf-theme` key, so the header toggle and /settings/ are the same switch.
A page with its own drawing of both schemes pins `<html data-ghf-native="auto">` (as /settings/ does) and is never inverted.

## Night mode for inverted light pages (the name-variations fix)
Light pages are shown at night by inverting the page and flipping photos back (`.ghf-bgimg`). The wiki's archivist pages paint a
tiled paper texture on the whole text column; basecamp.js took it for a photo and flipped it back, so the text column was dark
text on a dark tinted page (unreadable, e.g. /wiki/great-house-farm/name-variations/). From 2.1.20:
- a repeating background that covers more than half the screen and carries text is marked `.ghf-tex` and dropped at night;
- every inverted light page gets the same plain black night (`html.ghf-inv[data-ghf-native=light] body` is painted white before inversion);
- a black band drawn by a light page (the wiki's own header row) keeps its real colours, like a photo.

## Checks
`work/theme-settings/AUDIT.md` (worker notes) lists every webapp checked at 390 px, live and with the change applied.

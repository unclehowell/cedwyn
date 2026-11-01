# theme-settings — Cedwyn display settings webapp (/settings/)

Visitor page at /settings/ (theme id `settings`, branch `theme-settings`, dir `public`). It writes three keys to
localStorage on the cedwyn.bucklerfamily.estate origin; every page applies them before its first paint through the shared
loader /_cedwyn/ghf/ghf-boot.js (2.1.20+):

| key | values | absent means |
|---|---|---|
| `ghf-theme` (+ cookie `ghf_theme`) | `day`, `night` | follow the device (prefers-color-scheme) |
| `cedwyn-font` | `arial`, `verdana`, `georgia`, `times`, `system`, `mono` | Cedwyn's Barlow |
| `cedwyn-size` | `s` (90 %), `l` (115 %), `xl` (130 %) | normal (100 %) |

Defaults match the look before 1 Nov 2026 (device light/dark, Barlow, normal size). Spec: docs/THEME-SETTINGS.md on main.
Why /settings/: one short, plain word a visitor can guess; the page holds display settings only.

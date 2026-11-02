# Garden banner (one shared banner on every webapp)

Version 1.0.0, 2 Nov 2026. Owner instruction, 00:48 GMT 2 Nov 2026: the cross-promo chrome on the webapps is purged and replaced by one banner ad for the Garden (/garden/) carrying the Garden City Cymru products.

## What was retired

| Item seen on the pages | Where it came from | Now |
|---|---|---|
| "See this section as a graph · Graph ›" strip with × | `web/_cedwyn/cw-graph.js` took over the header's slim strip (`.ghf-v2-up`) | cw-graph.js 1.3.0 no longer calls `watchBanner()`; the 100vh "Read more" clip and card levels are unchanged |
| "Wales · AR tour of Llandough, coming soon" + Vouchers / E-books / Argentina chips with × (and the Argentina twin: museum / retelling / Wales) | `web/_cedwyn/section.js` `ribbon()` on /wales/<theme>/ and /argentina/<theme>/ pages | `ribbon()` is not called |
| ⓘ "Outside records" popup | `tools/chronology.py` notice box after the first `</h1>` | `HTML_NOTICE = False`; the chronology rewrites and the llms.txt paragraph stay |
| "Read the farm's history in the e-books: first edition free →" strips | `tools/site.py` `_shop_strip()` and `tools/halves.py` (Wales hub) | not called / removed |
| Home "E-books · first editions free →" button | `tools/halves.py` landing | removed |
| E-book upsell line in the header strip | `basecamp.js` `fillUp()` | hidden before first paint by ghf-boot.js; the Garden banner replaces it |

`tools/purge_promo.py` runs at the end of `tools/site.py` and removes the same items from every built page, including copies kept from earlier builds and branch pages copied from the live site (archived copies under `wayback/websites|mail|html|snapshot` are left as captured; the `/wayback/go/` embed viewer is cleaned). Report: `/_cedwyn/reports/purge_promo.json`.

The per-theme notices in `notices/<theme>.json` (for example "Provisional model", "Artifacts") are page content, not cross-promo, and stay.

## The banner

- Component: `web/_cedwyn/garden-banner.js`, loaded by `ghf-boot.js` on every page with the standard header. It fills the header's existing 34 px strip (`.ghf-v2-up`), so it never covers content and the header row with the burger menu and the "N of 59" number is untouched.
- Content: a REALM label linking to /garden/, a slim row of every Garden City Cymru product (thumbnail + name, plants first) that drifts slowly sideways and stops the moment the visitor touches it, and a "Garden ›" link. No prices.
- Links: internal only. Each product opens `/garden/#p=<handle>` (the Garden opens that product's sheet); the Garden is the one page that links out to gardencity.cymru.
- Data: `web/_cedwyn/garden-banner/products.json` and `sprite.webp`, made by `tools/garden_banner.py` from the garden branch's `public/_db/section.sqlite`. Re-run it when the Garden's product digest changes and commit both files by PR.
- Languages: en / cy / es labels follow the shared language choice.

## Where it does not show

- Argentina scope: `/argentina/…`, `/patagonia/…`, any page with `html[data-cedwyn-scope=argentina]` or `data-cedwyn-sec=argentina`. The strip is hidden there (no money words, no flowered art in Argentina scope).
- Machine-facing pages: `/academy/`, `/agents/`, `/hive/` (llms.txt and agents.json are not HTML and never load it).
- The Garden itself (`/garden/`) and framed pages.

## Rule for flywheels

No runner re-adds an e-book strip, a section ribbon, a graph promo strip or a "coming soon" teaser to the pages. The one site-wide promotion is this banner.

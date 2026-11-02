# Garden City banner (one shared banner on every webapp)

Version 2.1.0, 2 Nov 2026. Owner instructions: 00:48 GMT 2 Nov 2026, the cross-promo chrome on the webapps is purged and replaced by one banner carrying the Garden City Cymru products; 03:25 GMT 2 Nov 2026, the strip ("See this section as a graph · Graph › · Argentina · Great House II, Puerto Madryn, coming soon · Museum · The retelling · Wales · Local history … First edition free →") goes on all webapps and the banner promotes the Garden City flowers at gardencity.cymru.

## Changelog

| Version | Date | Change |
|---|---|---|
| 2.1.0 | 2 Nov 2026 | Shown on the Argentina scope too (owner, 03:45 GMT): one consistent banner on every webapp; there no prices or money words (products whose names carry one are left out) and only Garden City's own product photos, never farm flower or NFT images |
| 2.0.0 | 2 Nov 2026 | Links open gardencity.cymru (home page, or /products/<handle> for a product) in a new tab; × closes it for 30 days; shows on webapps that had hidden the header strip; gardencity.cymru allowed in runtime.js pass() and selfcontain.py OUT_SITE; new cache keys (boot 2.1.20, section.js 1.3.0, clamp.js v3) |
| 1.0.0 | 2 Nov 2026 | Cross-promo chrome retired; banner of Garden City products in the header strip, linking to /garden/ |

## What was retired

| Item seen on the pages | Where it came from | Now |
|---|---|---|
| "See this section as a graph · Graph ›" strip with × | `web/_cedwyn/cw-graph.js` took over the header's slim strip (`.ghf-v2-up`) | cw-graph.js 1.3.0 no longer calls `watchBanner()`; the 100vh "Read more" clip and card levels are unchanged |
| "Wales · AR tour of Llandough, coming soon" + Vouchers / E-books / Argentina chips with × (and the Argentina twin: museum / retelling / Wales) | `web/_cedwyn/section.js` `ribbon()` on /wales/<theme>/ and /argentina/<theme>/ pages | `ribbon()` is not called |
| ⓘ "Outside records" popup | `tools/chronology.py` notice box after the first `</h1>` | `HTML_NOTICE = False`; the chronology rewrites and the llms.txt paragraph stay |
| "Read the farm's history in the e-books: first edition free →" / "Local history: Great House Farm (Tŷ Mawr), Llandough, 1667–1988, in the e-books. First edition free →" strips | `tools/site.py` `_shop_strip()` and `tools/halves.py` (Wales hub) | not called / removed |
| Home "E-books · first editions free →" button | `tools/halves.py` landing | removed |
| E-book upsell line in the header strip | `basecamp.js` `fillUp()` | hidden before first paint by ghf-boot.js; the Garden banner replaces it |

`tools/purge_promo.py` runs at the end of `tools/site.py` and removes the same items from every built page, including copies kept from earlier builds and branch pages copied from the live site (archived copies under `wayback/websites|mail|html|snapshot` are left as captured; the `/wayback/go/` embed viewer is cleaned). Report: `/_cedwyn/reports/purge_promo.json`.

The per-theme notices in `notices/<theme>.json` (for example "Provisional model", "Artifacts") are page content, not cross-promo, and stay.

## The banner

- Component: `web/_cedwyn/garden-banner.js` (2.0.0), loaded by `ghf-boot.js` on every page with the standard header. It fills the header's existing 34 px strip (`.ghf-v2-up`), so it never covers content and the header row with the burger menu and the "N of 59" number is untouched. Webapps whose own CSS hid that strip to drop the old promo (for example /tithe-h3/, /cloudflare/) show it again for the banner only.
- Content: the REALM label (the flowers' name) with "Garden City Cymru", a slim row of every Garden City Cymru product (thumbnail + name, plants first) that drifts slowly sideways and stops the moment the visitor touches it, a "Visit ›" link and a × that closes it for 30 days in that browser. No prices.
- Links: the label and "Visit ›" open https://gardencity.cymru/; each product opens https://gardencity.cymru/products/<handle>; all in a new tab. gardencity.cymru is the one outside shop the site promotes: `runtime.js` `pass()` lets the click through and `selfcontain.py` `OUT_SITE` keeps the address as written (like the checkout hosts).
- Data: `web/_cedwyn/garden-banner/products.json` and `sprite.webp`, made by `tools/garden_banner.py` from the Garden City catalogue copy in the garden branch's `public/_db/section.sqlite`. Re-run it when the product digest changes and commit both files by PR.
- Languages: en / cy / es labels follow the shared language choice.

## Where it does not show

- Machine-facing pages: `/academy/`, `/agents/`, `/hive/` (llms.txt and agents.json are not HTML and never load it).
- `/garden/` and framed pages.
- Any browser where a visitor pressed × in the last 30 days.

## Rule for flywheels

No runner re-adds an e-book strip, a section ribbon, a graph promo strip or a "coming soon" teaser to the pages. The one site-wide promotion is this banner.

Source: Garden City Cymru's public catalogue (gardencity.cymru), read 1 Nov 2026; site-owner requests of 00:48, 03:25 and 03:45 GMT, 2 Nov 2026.

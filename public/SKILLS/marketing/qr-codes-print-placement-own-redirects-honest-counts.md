# QR codes on print: per-placement links you own, honest expectations, honest counting

Read 27 Oct 2026. This is for printed things that point people to the site: tour stop plaques, talk handouts, Open Doors posters, the back page of a printed e-book sample, festival flyers.

## The evidence (numbers)
- **Kera Collective** (Katie Chandler, senior researcher; evaluation firm). Across seven exhibition evaluations in five years, **6 of 7 found 8% or fewer of visitors used any QR code**. The settings were art, science and community museums and botanical gardens; the codes led to audio tours, extra object information, recipes and activities. The highest use was where the labels carried the artists' own voices and the codes gave context.
  - Visitors said they skipped codes for three reasons: they came to get off their phones, the destination was a long video or text-heavy page to read standing up, and **the label didn't say where the code leads**.
- **Whitney Museum** (2019 web guide, reported in GWU Museum Studies "Museum Digital Practice 2022", essay 12; the Whitney's own write-up wasn't read). The museum printed **slightly different codes per location** to see where people opened the guide. About **one-fifth of guests** accessed it over 7 months. That is the upper end, for a useful guide with a clear invitation.
- **MuseumNext practical guide** (Manuel Charr, Dec 2024):
  - Choose the visitor task first, and say what opens and how long it takes.
  - Print a **short typed URL** beside the code.
  - Point codes at **stable pages you control**. "Dynamic QR" services add a redirect you don't own, so check who controls it and what happens when the subscription ends.
  - Test at the real size, height, lighting and glare, including from a seated position, with weak signal.
  - Count recorded opens as **link opens, not unique visitors, dwell time or learning**.
  - Keep a register of where each code is displayed, inspect it for tamper stickers, and name an owner who checks links.
  - Cambridge University Museums (Sarah-Jane Harknett) warns against using QR codes as "a digital dumping ground" for surplus content.
- **Print sizing** is a vendor rule of thumb, not a standard read here: the code should be at least **1/10 of the scan distance** (10 cm wide at 1 m; at least 2 × 2 cm at arm's length). Keep a **quiet zone at least 4 modules wide** on every side, and use SVG or vector for print, not JPEG (qrforever, qrcodenova, flyn.to; the 4-module zone matches the ISO/IEC 18004 spec, which wasn't read).

## How to do it
1. **One code per placement**, never one code for everything. Each points to an own-domain short path, e.g. `cedwyn.bucklerfamily.estate A 301 on our side forwards it to the real page with UTMs (`utm_source=wales-stop-03&utm_medium=qr&utm_campaign=tour-2026`, built with `tools/utm.py build`). The printed code then never changes, and we can re-point it without a paid redirect service.
2. **Write the label first.** It should say "Scan: hear this stop in Welsh, English or Spanish (2 min)" plus the typed short URL. Fewer modules scan better, so keep the encoded URL short (the /q/ path, not the UTM string).
3. **The destination should be one small thing** that fits a phone at the spot: one audio clip, one image comparison, the free v0.0.1 e-book link. Long pages stay off QR codes.
4. **Size and test.** Apply the 10:1 rule and the 4-module quiet zone, with dark modules on a light background. Before printing, test on an old Android, an iPhone and a cracked screen in daylight glare, and test the page on weak 3G.
5. **Count honestly.** Hits per /q/ path from Cloudflare analytics or logs are opens. For a sale, join through the Stripe client_reference_id / UTM pass-through (stripe-ga4-server-side-purchase-reference-join-gate.md, stripe-promo-codes-per-channel-utm-passthrough.md). Budget for single-digit percent of passers-by, and judge placements against each other, not against a vendor's "scan rate".
6. **Keep a register** (`the project workspace`: code, path, target, where placed, date placed, owner, last checked) and check every path monthly with `og_check.py` or curl, watching for 404s.

## How we apply it to Cedwyn (PROPOSED; nothing printed or committed by this run)
- **Wales AR guided tour:** one code per tour stop (w01…wNN). Each opens that stop's 2-minute trilingual audio or AR view, and the label states the language choice and the length. This is the Kera "voices" case, the one that scored best.
- **Talks** (WI, U3A, Probus, Rotary, libraries; see shared-talk-deck-table-handout.md): a code on the last slide (t-slide) and another on the A5 handout (t-hand), so we learn which one works. Both lead to the free v0.0.1 e-book.
- **Open Doors / Cadw posters and festival flyers:** one code per venue or poster run (od-<venue>), pointing to /ebooks/ or the tour landing page.
- **Redirects:** a `/q/*` rule in the Cloudflare Pages `_redirects` (or a Cloudflare redirect rule), added in the next ONPAGE run once no other worker holds the cedwyn repo. Paths are lower-case and short, with no personal names.
- **Generating codes:** no QR library is installed on this box. `segno` (pure Python, MIT) is the choice once disk is above 2 GB; it was skipped today because 1.4 GB is free. Until then, generate the SVG on the print-design side, from the /q/ URL only.

## Sources
- keracollective.com (read 27 Oct 2026)
- gwu-museum-studies.github.io (Whitney figure, secondary; read 27 Oct 2026)
- museumnext.com (read 27 Oct 2026)
- qrforever.com ; qrcodenova.com ; flyn.to (sizing; search snippets only, vendor guidance)
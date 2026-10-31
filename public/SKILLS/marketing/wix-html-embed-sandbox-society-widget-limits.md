# Wix HTML embeds for heritage-society widgets: what works, what breaks (2026)

Topic: getting a Cedwyn "this day in the farm's history" card (or calendar strip) onto a local society site that runs on Wix. Extends `embeddable-this-day-card-society-sites-image-first.md`, which left "Wix plan limits" as not checked. Of 6 local society sites checked on 31 Oct, one (Penarth Society) runs on Wix.

## What Wix's own help pages say (read 31 Oct 2026)
- **Two different doors.** (1) The **Embed HTML / "Embed a Site" element** placed on a page in the editor. (2) **Settings → Custom Code** (head/body snippets, site-wide). Wix's help pages put Custom Code behind a premium plan with a connected domain. The page element is not described as premium-only. A free Wix site can therefore usually take an element embed but not a head script. Check this on the society's own plan; don't assume it.
- **The element is a sandboxed iframe.** Wix re-enables `allow-scripts`, `allow-same-origin`, `allow-forms`, `allow-popups` and `allow-pointer-lock`. Everything else in the sandbox stays blocked: plugins (`<embed>/<object>`), autoplay, auto-focus and most browser APIs. It "does not have direct access to the other elements on your page" (Velo docs). So a script that tries to write into the host page, such as a "drop-in div + script" widget, will NOT reach the page. It renders only inside its own box.
- **It is not responsive.** "The HTML and URL elements in our editor are iFrames. Therefore, the code or site you are embedding won't be responsive, even if it is originally." The box has a fixed size set in the editor. Wix suggests `width="100%" height="100%"` inside the element so the content fills that box. The society volunteer still has to size the box separately for desktop and for the mobile editor.
- **HTTPS only.** "Your code must contain HTTPS and not HTTP, or it will not be displayed on your live site." There is no character limit.
- **Storage sandboxing (from 1 Jan 2025):** the help page lists sessionStorage, localStorage, cookies, IndexedDB and cache access as limited in iframes and custom elements, at least in the editor and Preview. Wix states the live site is not affected, but a widget that needs storage may look broken to the volunteer while they set it up. Build the card stateless.
- **Wix does not support third-party code** ("We cannot provide support for codes that were not created or tested by Wix"). If it breaks, the volunteer has nowhere to go but us, so the snippet must be dead simple.

## Practical consequences (our inference)
1. **Ship a ready-made iframe snippet, not a script.** One line: `<iframe src="<our-host/embed/today?utm_source=<society>&utm_medium=embed" width="100%" height="100%" style="border:0" title="This day in the farm's history"></iframe>`, plus "set the box to about 320 x 420 on desktop, 300 x 420 on mobile".
2. **Design the card for a fixed box.** Assume a 300-360 px wide box at a fixed height. Make the text sit inside it (clamp the quote to 3 lines with a "more" link), with no scroll inside the iframe and no auto-height postMessage tricks. The Wix element can't resize itself from inside anyway.
3. **Links must open a new tab.** Use `target="_blank" rel="noopener"` on every link in the card. A click inside the sandbox otherwise tries to navigate within the box. `allow-popups` is on, so a new tab works.
4. **Framing headers.** If `/embed/` sends a `frame-ancestors` list, Wix element code may be served from a Wix file-hosting origin, not the society's domain. That claim is not checked; test it on a free Wix test site before any society gets a snippet. The safe option for a public, read-only card is `frame-ancestors *` on `/embed/*` only, with the rest of the site staying `'self'`.
5. **Fallback is the image tier.** A daily `today.png` with a link pastes into a Wix image element and works on every plan with zero code. Offer it first to any volunteer who hesitates.
6. **Measure per society.** Give each society its own `utm_source`, and count embed views server-side (hits on `/embed/today?utm_source=x`), because the sandbox blocks most client analytics. Kill rule: if fewer than 20 card views a month per society after 8 weeks, stop offering the iframe tier and keep the PNG.

## Evidence quality
- Wix behaviour is from Wix's own help/developer pages (primary, read 31 Oct 2026).
- No case study with click or visit numbers for heritage widgets on Wix was found. Treat this as a cheap test with a kill rule, not a proven channel.

## How we apply it to Cedwyn
- PROPOSAL for the calendar webapp Worker (cedwyn-calendar). Serve `/embed/today` as a stateless HTML card, 300-360 px, dark Cedwyn theme (no white background), exact-day records only, with a "nearest dated record" fallback on empty days. Also serve `/embed/today.png`, and a copy page `/embed/` with three tabs: Wix, WordPress, and image (PNG).
- Test on a free Wix site first (frame-ancestors, mobile box, link target) and log the result here.
- The offer to the Penarth Society (Wix) goes out only as a HubSpot draft for the owner's GO, via the existing society route. Never contact anyone directly.
- Card text follows the editorial rules: neutral third person, verbatim quotes with catalogue IDs, banned words never, no outbound links except back to Cedwyn's own evidence page.

## Sources
- support.wix.com (sizing, not responsive, HTTPS, no character limit)
- support.wix.com (sandbox flags re-enabled)
- dev.wix.com (no access to page, messaging model)
- support.wix.com (storage sandboxing from 1 Jan 2025)
- support.wix.com (Custom Code door)
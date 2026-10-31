# Skill: An embeddable "this day in the farm's history" card that local-history society sites can actually paste in
Written 31 Oct 2026 (skills harvest). Pairs with the Cedwyn Calendar webapp (in build), subscribable-chronology-ics-feed-anniversaries.md and on-this-day-posts-from-own-chronology.md. The 'Embed this graph' skill (embeddable-charts-attribution-nofollow-embed-this-graph.md) already covers Google's widget-link policy; read its link rules, they apply here unchanged.

## The finding: an iframe or script widget will NOT paste into many society sites; a plain image + link will
Measured/read 31 Oct 2026:
- Local platforms (our check of 6 reachable society sites, generator tags): Glamorgan History Society, Llantwit Major History Society and Radyr Local History = self-hosted WordPress; Roath Local History Society = WordPress.com; Penarth Society = Wix; Glamorgan FHS = Joomla. (Cowbridge and Barry society domains did not answer from our box.)
- WordPress.com (Custom HTML block help page, read): iframe, script, embed, object, form, style and link tags "need a paid plan with hosting features activated". A society on a free/low WordPress.com plan cannot paste an iframe or a script. It CAN paste img and a.
- Squarespace (Code blocks help page, read): "To add JavaScript or an iframe to a code block, your site needs to be on the Core, Plus, or Advanced plan."
- Self-hosted WordPress (oEmbed handbook, read): pasting a bare URL only auto-embeds from WordPress's internal whitelist; since 4.4 discovery from other sites is allowed but HTML is filtered to links, blockquotes and sandboxed iframes, and full discovery for non-whitelisted sites is a site-admin opt-in for unfiltered_html users. "link" and "photo" oEmbed types are filtered less.
- Wix: an HTML-embed element exists (it renders inside its own iframe); plan limits not checked.
So the card must work in three tiers, simplest first.

## Build (three tiers, one data source)
1. IMAGE CARD (works everywhere, including WordPress.com free and Joomla editors):
   - A daily PNG at a stable URL, e.g. /embed/today.png (1200x630, also used as og:image), rendered from the calendar's derived events: date, year, one-line title, one verbatim quote line with its catalogue ID, a small "Cedwyn Calendar" wordmark.
   - The paste code is two tags: <a href="calendar...&utm_medium=embed&utm_campaign=thisday"><img src="calendar... alt="On this day at Great House Farm, Llandough" width="600"></a>
   - Cache: Cache-Control max-age about 3600 so the image turns over each day; the society's page never needs editing again.
   - Empty days: show the nearest dated record ("This week in ..."), never a blank and never an invented day (the calendar's exact-day rule).
2. IFRAME CARD (self-hosted WordPress, Wix, Squarespace Core+): /embed/today?theme=dark|light, a 320-600 px responsive card, no cookies, no third-party scripts, loading="lazy", a visible title attribute; send Content-Security-Policy frame-ancestors * only on /embed/ paths (keep the rest of the site non-frameable).
3. oEmbed "photo"/"rich" endpoint (/oembed?url=...) plus the <link rel="alternate" type="application/json+oembed"> tag on each day page, for sites whose admin has enabled discovery. Lowest priority: per the handbook most WordPress sites will not auto-embed us.
- One "Add this to your site" page (/embed/) with a copy button per tier, a live preview, and a one-line note: "No tracking cookies. Free to use with the credit link kept."
- Credit link: one visible, plainly worded link (site name or "Cedwyn Calendar"), no keyword anchors, no hidden links (the 'Embed this graph' skill's Google policy reading). Societies may add rel="nofollow"; say so.

## Measuring it
- utm_source per society in the paste code (we generate a code per society) -> first-party beacon / Cloudflare analytics counts clicks by source.
- The image requests themselves are the "impressions": count /embed/today.png hits by Referer host in Cloudflare (Referer may be stripped by some sites; treat as a floor).
- Kill rule: if after 8 weeks no society has pasted it, stop offering it; the image still earns its keep as the og:image and in our own posts.

## No practitioner case study with numbers found
Searches this run found no heritage/local-history widget with published install or click numbers (only vendor "widget use case" pages). Treat this as a cheap test, not a proven channel. The platform limits above are documented by the platforms themselves and are the reason the image tier comes first.

## How we apply it to Cedwyn
- PROPOSAL for the cedwyn-calendar Worker (zero spend, no new D1, uses the derived events db): /embed/today.png (server-rendered SVG -> PNG, or an SVG fallback if PNG rendering is heavy in the Worker), /embed/today (iframe card), /embed/ (copy page). Public text neutral third person, banned words checked, quotes verbatim with catalogue IDs, no insignia, nothing about what the family holds.
- Distribution stays within the rules already in place: offer the paste code inside the existing talk/journal routes (civic-local-history-society-talks-penarth.md, cowbridge-history-society-talk-route.md, family-history-society-journals-forums.md) as a HubSpot draft for the project lead to send himself. No cold emails from Tab, no DMs.
- Cedwyn has a no-outbound-links rule; this skill only adds INBOUND links (society -> calendar), so it does not conflict.
- First targets by platform: Llantwit Major, Glamorgan History Society, Radyr (self-hosted WordPress: any tier works); Roath (WordPress.com: image tier); Penarth Society (Wix: image or HTML element).

## Sources
- wordpress.com (read 31 Oct 2026: iframe/script need paid plan with hosting features)
- support.squarespace.com (read: JavaScript/iframe need Core, Plus or Advanced)
- developer.wordpress.org (read: whitelist, 4.4 discovery limits, unfiltered_html opt-in)
- oembed.com (spec: photo/rich types, discovery link tag; not re-read this run)
- Society sites checked by generator tag 31 Oct 2026: glamorganhistory.org, llantwitmajorhistorysociety.co.uk, radyr.org.uk, roathlocalhistorysociety.org, penarthsociety.org.uk, glamfhs.org.uk
- web.dev (third-party embed performance: lazy loading; listed, not read)
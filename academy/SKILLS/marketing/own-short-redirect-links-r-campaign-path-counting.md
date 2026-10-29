# Campaign measurement with own short redirect links (/r/<campaign>) when analytics can't see query strings

Harvest 2026-10-29 22:15Z. Internal working note. It builds on campaign-tags-first-party-beacon-workers-analytics-engine.md (the beacon route), qr-codes-print-placement-own-redirects-honest-counts.md (print/QR) and email-links-shorteners-tracking-safe-links-bot-clicks.md (don't use bit.ly in email). New here: the operating rules for the live /r/ rule.

## Why
- On Cedwyn's Cloudflare zone, analytics refuse query strings and referrers (clientRequestQuery / clientRefererHost answer "authz", tested by sales-fix run 26, 29 Oct 22:02Z). So **no utm-tagged link (sf15, sf22, sf24, sf25) has ever been countable there.** Path is countable.
- Problems flywheel P-038 shipped one dynamic Pages rule (live 21:55Z, build 40954218944): `/r/:c  /ebooks/?utm_source=r&utm_medium=link&utm_campaign=:c  302`. Re-checked by this run at 22:13Z: `/r/test` answers 302 to `/ebooks/?utm_source=r&utm_medium=link&utm_campaign=test`, Cache-Control `no-transform` (no browser-cache lifetime set).
- Practitioner precedent: Michigan Tech's marketing office (UTM guide, read): for print, "Create a shortened vanity URL, preferably within the branded domain of your website, that then redirects to your UTM tagged URL", and verify within the first few days that tracking is being picked up. MuseumNext/Kera figures for QR are in the QR skill.

## Facts from the docs (read 29 Oct)
- Cloudflare Pages `_redirects`: default code **302**; a file holds **2,000 static + 100 dynamic** rules (2,100 total), each line up to 1,000 characters; placeholders and splats are allowed. P-038 counted 53 of 90 dynamic in use on the live branch (the site's own headroom figure, which is below Cloudflare's 100). **One** placeholder rule covers every campaign, so new campaigns cost no new rules.
- Cloudflare Single Redirect Rules: 10 on Free; Bulk Redirects are static only. We don't need either.
- **Use 302, never 301, for counting links.** MDN's own 301 example is served with `cache-control: max-age=2592000` (30 days). A permanent redirect may be cached by the browser, so repeat clicks never reach the edge and are never counted. A 302 with no cache lifetime goes back to the edge every time.

## Rules
1. **One slug per placement, not per campaign theme.** `yt-<videoId>` (one per video description), `ig-bio`, `fb-<postdate>`, `pdf-v002-p1` (the free PDF's buy line), `talk-<venue>-<yyyymm>`, `print-<item>`, `email-<yyyymmdd>`. If two placements share a slug, you can't tell which one worked.
2. **Slug charset** `A-Z a-z 0-9 _ -`, at most 40 characters. Keep YouTube IDs in their real case. Lowercase everything else. Never reuse a retired slug.
3. **Register before you post:** `python3 tools/r_links.py add <slug> "<where placed>" "<note>"` appends to `the project workspace` and refuses duplicates. Then `r_links.py check <slug>` must show `ok: true` before the link goes anywhere.
4. **Count by path, weekly:** `r_links.py query --days 1` prints the GraphQL body (httpRequestsAdaptiveGroups, `clientRequestPath_like "/r/%"`, `edgeResponseStatus 302`, grouped by path). Run it through the connected Cloudflare account one day at a time. How far back the Free plan allows each query to reach is **not checked**: start with 1-day windows and sum them.
5. **Discount bots.** When a link is posted, link-preview fetchers (WhatsApp, Facebook, LinkedIn, Slack) request it, and some email security scanners click every link (see the email-links skill and tools/bot_click_flag.py). Rule of thumb: ignore a new slug's first-hour hits, and treat a burst in the same minute from one placement as bots. The truth test is the downstream count: non-US /ebooks/ visits and Stripe sessions in the same window.
6. **Social posts:** paste the /r/ link itself. A pasted utm URL survives the click (GA-style tools could read it), but this zone can't see it.
7. **Email:** an own-domain /r/ link is fine (same domain as the From/links, no third-party shortener). Keep to 1–2 links per cold email, per the email-links skill.
8. **GoatCounter cross-check:** the site already loads GoatCounter, which reads utm_campaign into its own Campaigns view. Every /r/ hit lands on /ebooks/ carrying `utm_campaign=<slug>`, so if a GoatCounter login or token is ever available, its Campaigns view is a second, bot-filtered count. Whether a token exists is **not checked** (P-038 note 21:10Z).

## How we apply it to Cedwyn
- **Now:** register the slugs already in flight: `fb-calan-gaeaf` (live-checked by P-038) and the 27 `yt-<videoId>` slugs prepared for sf26 (P-045, waiting on YouTube quota after 07:00Z). Any runner that posts or drafts a link (auto-social, quote pack, bizdev, sales-fix, outreach drafts) uses `/r/<slug>` from the register instead of a utm URL. That's a file note for those runners, not a message to anyone.
- **Sunday growth report:** add a "/r/ clicks by slug (7 d)" line next to non-US /ebooks/ visits and Stripe sessions. Any slug with 0 clicks in 4 weeks gets its placement reviewed or dropped.
- **Kill / change rule:** if after 2 weeks /r/ counts are mostly bot-shaped (same-minute bursts, no matching /ebooks/ visits), switch counting to the beacon route (Workers Analytics Engine skill) for the landing page and keep /r/ only for print/QR.
- Never point /r/ anywhere but Cedwyn's own pages (the zero-outbound rule).

## Sources
- the project workspace P-038 (rule, live check 21:59Z) and P-045; the project workspace run 26 (authz finding) (internal, read)
- developers.cloudflare.com (read: 302 default, 2,000/100 limits)
- developers.cloudflare.com (read: Single Redirects 10 on Free; Bulk static)
- developer.mozilla.org (read: 301 example cached 30 days)
- mtu.edu (read: branded vanity URL for print; verify in first days)
- Box check 29 Oct 22:13Z: `r_links.py check test` -> 302, Location utm_campaign=test, ok true
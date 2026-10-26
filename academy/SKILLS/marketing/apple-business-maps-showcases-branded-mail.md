# Apple Business (ex-Business Connect): Apple Maps place card, Showcases, Branded Mail logo

Date: 2026-10-26. Topic: free local listing + inbox logo across Apple Maps, Siri, Spotlight, Safari and Apple Mail. Complements google-maps-gbp-demolished-heritage-site.md (Google side) and mailchimp-sending-domain-auth-dmarc-free-from.md (DMARC basics). Status for Cedwyn: PROPOSAL (new public listing + DNS change).

## What changed in 2026 (primary)
- Apple newsroom, 24 Mar 2026 (read): "Apple Business" replaced Apple Business Connect, Business Essentials and Business Manager from 14 Apr 2026; free in the US and 200+ countries; existing Business Connect data (place cards, photos) migrated automatically. Brand tools now live there: brand profiles (name/logo across Maps and Wallet), rich place cards (photos, hours, details shown in Maps, Safari, Spotlight), Showcases and custom actions ("order"/"reserve" button to a chosen website), location insights (searches, views, taps), and Branded Mail (logo in Apple Mail and iCloud Mail). Some features "may be available in select countries".
- Apple newsroom, 11 Jan 2023 (read): the original free tool for place-card customisation.

## Numbers from practitioners
- Uberall (listings agency blog, read): multi-location clients VIP Tires and SUNMED saw +27% year-on-year Apple Maps interactions, and up to +312% YoY interactions on some profiles after active place-card management (agency figures; method not checked).
- Iterable (ESP blog, read): BIMI's Verified Mark Certificate typically costs USD 1,000-1,500/yr plus trademark fees; Apple Branded Mail needs no certificate and is free.

## Requirements (Apple support, read)
- Location: Brands > Locations > Add. A first location needs the organisation verified by Apple; an existing Maps location can also be verified by an Apple phone call to the listed number. Set mail filters to allow all apple.com domains (review mail).
- Branded Mail (Apple support "Intro to Branded Mail" + "Verify your email domain", read): organisation verified; brand + logo approved by Apple; every email DKIM-authenticated (SPF-only not supported); DMARC with v=DMARC1, p=quarantine or reject (sp=quarantine/reject when the record sits on the parent and you register a subdomain), pct=100. Example: v=DMARC1;p=reject;pct=100;
- Service-area businesses without a storefront: Apple Community and local-SEO forum threads (2025-26, read as titles/snippets) show Apple often refuses listings with no public premises; one home-services vendor page states a service area can be listed without a home address (not checked against Apple's own docs).

## How to do it (30-45 min once eligible)
1. Decide what the listing IS: a tour that starts at a public meeting point (church gate, village green) - never a private address. If Apple insists on premises, skip the place card and do Branded Mail only.
2. Sign up at business.apple.com, verify the organisation (company or sole-trader documents; Apple review).
3. Brand: upload the Cedwyn logo (square, plain background), short description, website link to the tour/booking page.
4. Place card: category (tour operator / historical landmark tours), hours = tour times, 6-10 real photos (site, church, archive images with rights), custom action "Book" -> the booking page with UTM (utm_source=apple_maps&utm_medium=place_card).
5. Showcase: one timed post per season (St David's Day, Open Doors September, Christmas gift vouchers). Body limits vary by source (agencies quote 58-100 characters; not checked) - keep to one sentence + one action.
6. Branded Mail: only after DMARC is at quarantine/pct=100 with DKIM aligned (see DMARC skill rollout). Register the sending domain; test by sending to an iCloud address and checking the logo on iPhone Mail.
7. Monthly: read location insights (searches, views, action taps) into the growth report.

## Pitfalls
- p=none blocks Branded Mail outright. Jumping to quarantine before every sender (Mailchimp, Stripe receipts, Gmail alias, HubSpot) passes DKIM risks losing real mail - roll out pct 25 -> 100 with rua reports first.
- A listing at a former house site can pull visitors to a residential close; choose a public meeting point and say "site of" in text only.
- Apple review rejects places that look 24-hour/unstaffed; give real tour hours.

## How we apply it to Cedwyn (PROPOSAL - new public listing and DNS change)
- Checked today: _dmarc.bucklerfamily.estate TXT = "v=DMARC1; p=none;" (Cloudflare DNS read 26 Oct 2026) - so Branded Mail is NOT available yet. Prerequisite = finish the DMARC rollout in mailchimp-sending-domain-auth-dmarc-free-from.md (add rua, then quarantine pct=25 -> 100).
- Place card: only when the guided tour has a launch date and a public meeting point (church gate or village green), booking page live, and a verifiable organisation. Hold until the Wales tour project names the operator entity.
- Showcase calendar ready to reuse: St David's Day (1 Mar), Open Doors (Sept), 28 July Glaniad, Christmas vouchers.
- KPI: place-card views and "Book" taps per month (insights) + utm_source=apple_maps sessions; Branded Mail = iCloud-reader open-rate change vs prior 4 sends (directional only on a small list).

## Sources
- apple.com (read)
- apple.com (read)
- support.apple.com (read)
- support.apple.com (read)
- support.apple.com (read)
- uberall.com (read)
- iterable.com (read)
- discussions.apple.com (snippet only, not checked in full)
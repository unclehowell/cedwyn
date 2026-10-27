# Web push notifications on a static heritage site: when it is worth it (2026)

Harvested 2026-10-27 06:41Z. Read today: Chrome for Developers (CrUX notification data; Jan 2026 push rate limits), WebKit blog (iOS web push), a practitioner's CrUX read (Erwin Hofman). Mozilla's 2019 blog answered 403 to a script; its figures are quoted via Hofman and the search snippet.

## The numbers (primary where possible)
- Firefox (Mozilla, Nov 2019): "about 99% of notification prompts go unaccepted, with 48% being actively denied". Mozilla then restricted prompts.
- Chrome 80 (2020) introduced a "quieter" permission UI for sites with low acceptance rates; later versions add quiet UI for abusive notification content.
- Chrome UX Report carries per-origin notification permission data (accept / deny / dismiss / ignore). Chrome's worked example (Google News origin): 82.3% accept, 4.8% deny, 5.0% ignore, 7.9% dismiss - a site people actively want alerts from. Not typical.
- A practitioner's CrUX read of a news site that prompted on arrival, desktop: Feb 2.47% accepted, 39.63% dismissed, 13.96% denied, 44.21% ignored; Mar 3.55% accepted (erwinhofman.com, read).
- Vendor claim (PushPushGo 2025, vendor data, not checked): about 6% average opt-in among unique visitors.
- Chrome, Jan 2026: Push API message rate limits for sites that send many notifications with little site engagement; Chrome also removes notification permission per user for sites the user has not interacted with (developer.chrome.com, read).
- iOS/iPadOS 16.4+ (WebKit, Feb 2023): web push works only for Home Screen web apps (a manifest with display standalone/fullscreen, added via Share > Add to Home Screen). A normal Safari tab on an iPhone gets no push.

## What the numbers mean
1. Prompting on arrival is what fails (2-4% accept, about half actively annoyed). The same prompt, asked after the person clicked "notify me", is what sites like Google News see (80%+ of those asked).
2. A low accept rate is now penalised: quiet UI, then rate limits, then auto-revoked permission. Fewer, wanted notifications protect the channel.
3. On iPhone, push requires the reader to install the site to the Home Screen first. For a mostly mobile, UK audience this cuts reach hard.

## How to do it well (steps)
1. Never call Notification.requestPermission() on page load. Show your own soft button ("Notify me when the next chapter / door opens"), and request permission only after that click.
2. Promise a cadence in the button text and keep it (for example one notification per new film scene or new e-book version).
3. Each notification: one event, one link with UTM (utm_source=webpush, utm_medium=push, utm_campaign=<event>).
4. Watch your origin's CrUX notification permission data (BigQuery / CrUX) and your own click-through; if accept falls or blocks rise, stop prompting.
5. Pair with email: email remains the main owned channel; push is a nudge for people who already said yes.
6. Free self-hosted route: a service worker plus the Push API with VAPID keys and a small sender (open-source libraries such as web-push for Node or pywebpush for Python). Hosted free tiers exist, but check data processing, UK GDPR terms and cookies/consent before adding any third-party script.

## How we apply it to Cedwyn (PROPOSED, not built)
- Verdict: low priority while traffic is small. Email signups (Mailchimp) and the WhatsApp/Instagram channels come first; push adds a second opt-in for the same few readers.
- If built, use exactly one trigger, the project lead's own flywheel: "Door N is open" for the daily Cedwyn movie scene, plus new e-book version releases. Button only on /movie/ and /ebooks/ ("Tell me when the next door opens"), never a prompt on arrival, never on research/evidence pages.
- iPhone readers need the Home Screen install; add a manifest only if the site is otherwise ready to behave as an app. Otherwise point iPhone readers to email or WhatsApp.
- Measure: UTM clicks per notification in GA4; stop if fewer than about 1 in 10 recipients click after 4 sends (our own rule of thumb, not checked).
- Tools: none installed (disk 1.6 GB free, under the 2 GB line). web-push (npm) / pywebpush are small, free, open-source options for later.
- Public text rules apply to notification text (never name the project lead; banned words; no outbound links).

## Sources
- developer.chrome.com (read 2026-10-27)
- developer.chrome.com (read, published 6 Jan 2026)
- blog.chromium.org (snippet)
- blog.mozilla.org (snippet; 403 to script)
- erwinhofman.com (read)
- webkit.org (read)
- pushpushgo.com (vendor snippet, not checked)
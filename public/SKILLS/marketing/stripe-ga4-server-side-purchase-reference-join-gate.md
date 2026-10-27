# Stripe sales into analytics: server-side purchase events, joined by a reference (gated: GA4 is not on Cedwyn)

Harvested 27 Oct 2026 (skills harvest). Topic: analytics / funnel attribution.

## The problem
A Stripe Payment Link sale happens on buy.stripe.com, so the shop's analytics never sees the purchase unless something reports it. Browser "thank-you page" tags miss buyers who close the tab, block scripts or decline consent. The robust pattern (Stripe + Google docs, practitioner guide below) is: stamp a reference on the buy link, read it back from Stripe's webhook, and send the purchase server-side.

## How it works (facts, with sources)
1. **The join key.** Payment Links accept `?client_reference_id=` on the link URL; it comes back on the Checkout Session in `checkout.session.completed`. Stripe's Payment Link URL-parameter page (quoted by Advanced Tracking Academy, checked 17 Oct 2026): alphanumeric, dashes or underscores, up to 200 chars; "Invalid values are silently dropped, but your payment page continues to work". A dot or colon silently kills the join, so generate references from `[A-Za-z0-9_-]` only.
2. **UTMs don't reach the webhook.** On a Payment Link, UTMs are appended to the redirect URL (only when confirmation = redirect). The reference, not the UTMs, carries the join.
3. **Webhook hygiene.** Verify the signature on the raw body; check livemode, event type, payment_status and amount; return 2xx fast and queue the work (Stripe webhooks guide). Stripe retries failed live deliveries for up to three days, so dedupe on the session id (`transaction_id` = `cs_live_...`).
4. **The GA4 send (Measurement Protocol).** POST to `/mp/collect?measurement_id=G-...&api_secret=...` with `client_id` (from the `_ga` cookie captured at click time), event `purchase` with `transaction_id`, `currency`, `value` (Stripe amounts are minor units: divide by 100), `items`. Test against `/debug/mp/collect` first.
5. **Session stitching has a 24-hour limit.** Google's MP use-case page: include `session_id`, send "no later than 24 hours after the start of the online session". Later payments still record revenue, but the source shows as (not set)/new session. Don't backdate `timestamp_micros` to fake the match.
6. **Stripe's own funnel option.** Stripe's "Analyze your conversion funnel" doc tracks Checkout steps in GA4 for server-created Checkout Sessions. It doesn't fit a plain no-code Payment Link set-up.

No case-study numbers: these are documented platform behaviours, not a conversion lift. The win is complete sale attribution, not more sales.

## Steps (when the gate opens)
1. Capture `_ga` client id + GA session id on the click, store them server-side keyed by a short reference (e.g. `r_<random>`); put only the reference on the buy link.
2. Webhook (Cloudflare Worker): verify, dedupe, look up the stored ids, send MP `purchase`; log status.
3. Mark `purchase` as a key event in GA4; compare GA4 revenue against Stripe weekly. A gap over about 5% means a leak (consent, dropped reference, missing webhook).

## How we apply it to Cedwyn
- **Gate: not now.** Checked 27 Oct 2026 03:09Z: the live cedwyn.bucklerfamily.estate and /ebooks/ HTML carry no gtag/GTM tag and no buy.stripe.com link in the static HTML (buy links are injected by script). Cedwyn measures with Cloudflare traffic (growth-report/cf_traffic.py) plus Stripe sessions (the project workspace). Adding GA4 means a cookie banner under UK PECR (see uk-analytics-statistical-exception-duaa-ga4.md), so don't add it just for this.
- **Use the pattern without GA4, today:** our A/B script (the project workspace) already writes `client_reference_id=<test>_<variant>` onto Payment Links, and weekly_report.py groups sessions by it. Keep it charset-safe (`[A-Za-z0-9_-]`, max 200). Extend the same field to carry the channel (`ig_`, `fb_`, `em_`, `qr_`) on every buy link, so Stripe alone answers "which channel sold".
- **Collision rule:** one field, one scheme. If GA4 is ever added, put an opaque reference in `client_reference_id` and keep test/variant/channel in the server-side lookup row. Never put a raw GA client id there next to the A/B label.
- If GA4 is ever adopted, build steps 1-3 as a Worker on the existing Cloudflare zone (free tier). The MP api_secret lives in the Worker's secrets, never in the repo.
- Zero spend; no new tool needed (requests/fetch are enough).

## Sources
- Stripe, "Analyze your conversion funnel": docs.stripe.com
- Advanced Tracking Academy, Stripe conversion tracking (practitioner guide quoting Stripe + Google docs, checked 2026-10-17): advancedtrackingacademy.com
- Google, GA4 Measurement Protocol, sending events: developers.google.com
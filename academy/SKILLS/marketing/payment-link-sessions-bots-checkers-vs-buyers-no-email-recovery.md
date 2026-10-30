# Payment Link "opened, not paid": separate buyers from bots and our own checkers before diagnosing abandonment

Date: 30 Oct 2026 (skills harvest 07:24Z). Topic: checkout-abandonment diagnosis for Stripe Payment Links when no email was captured. Complements `stripe-checkout-abandonment-recovery.md` (recovery flows once an email exists) and `stripe-promo-codes-per-channel-utm-passthrough.md` (UTMs on links).

## The facts this rests on (read 30 Oct 2026)
- **Every open of a Payment Link URL creates a new Checkout Session.** Stripe's developer blog: "A Payment Link object generates Checkout Session objects each time the shareable URL is opened." So the session count in Stripe counts URL opens, not people. Our own sales-fix log (run 29, 07:00Z) saw the same: a plain GET of a payment link opens a session.
- **buy.stripe.com lets search crawlers in.** Its robots.txt (fetched 07:27Z) is `Disallow: /` for `*` but an empty `Disallow:` for Googlebot (and Image/Video/News/Mobile), Bingbot and Slurp. Google follows links in PDFs like HTML links (Search Central PDF FAQ). So any buy link we publish (pages, PDFs, video descriptions) can be opened by crawlers, and each open is a session.
- **Payment Links cannot use Stripe's own recovery link.** `after_expiration.recovery` (the recovery URL plus the `checkout.session.expired` flow) is set when you create a *Checkout Session*. The Payment Link create API (reference read 30 Oct, version 2026-10-28) has `consent_collection` and `restrictions` but **no `after_expiration`**. Recovery emails also need the customer's email plus promotional consent (Stripe abandoned-carts doc).
- **`client_reference_id` and `utm_*` pass through a Payment Link URL** (alphanumeric, dash, underscore; invalid values are silently dropped; UTMs up to 150 characters). `client_reference_id` is stored on the session, so it can label a test open.

## Measured on Cedwyn, 30 Oct 07:28Z (tools/stripe_session_triage.py, live read-only, last 24 h)
- 38 sessions, 0 paid, **0 reached the email field**.
- 17 "metronome" on a single link: one link opened at a steady 20 to 40 minute cadence through the night, which looks like a checker or crawler. 12 "walker bursts": 3 or more opens within 5 minutes, matching our own sales-fix walks. 9 "unknown", spread across 3 links.
- Our own checkers GET live payment links: `bizdev/tools/buylink_check.py` and `bizdev/skills/tools/buybutton_check.py` (urllib), plus the 390 px walker. Each run adds sessions.
- The 25 Oct supplement PDF links straight to `buy.stripe.com (and to /ebooks/). Crawlers that follow PDF links will open it.
- **Read:** the "38 opened, 0 paid" figure is not 38 abandoned buyers. At most 9 opens could be people, and none of them started typing. The bottleneck is still the traffic wall (about 14 non-US shop visits a day), not the checkout form.

## The method (do it in this order)
1. **Label your own opens.** Any script or walker that must load a live payment link adds `?client_reference_id=qa-<tool>` (and `utm_source=qa`). Better still, checkers stop GETting buy links at all: check that the link exists and is active through the API (`payment_links/{id}`, `active: true`, with the right price on its line items) and check the shop page's `href` without following it.
2. **Don't publish raw buy links where crawlers roam.** In PDFs, video descriptions and social posts, link to the shop page (`/ebooks/?utm_...`) and let the buy button carry the Stripe link. Keep `buy.stripe.com` only on the shop/book page next to the button.
3. **Triage before you diagnose.** Run `stripe_session_triage.py --hours 24` (or `--file` on an export). It sorts every session as one of: paid / qa-tagged / walker-burst (3 or more within 5 minutes) / metronome (4 or more on one link, 5 to 90 minute gaps, coefficient of variation under 0.5) / typed-email / unknown. Only `typed-email` sessions are true checkout abandonment. Count `unknown` as checkout page views.
4. **Diagnose by stage, not by session count.**
   - typed-email is 0 and unknown is under 10 a day: it's a traffic or offer problem. Fix the shop page and channels, not checkout.
   - typed-email is 1 or more with 0 paid: look at the form itself. Check wallets, price and currency shown (Adaptive Pricing), the reg 37 consent tick and card errors (`payment-trust-cues-checkout-uk-legal.md`, `stripe-payment-links-wallets-ab-gate.md`).
   - unknown opens bunched by one link or one hour: match them to a post, a video or a person's visit by time and UTM before calling them intent.
5. **Recovery when no email is captured** (zero spend, no tracking of individuals):
   - On-site return path: when a visitor clicks Buy, store only the book slug in `localStorage`. On their next visit to /ebooks/, show one line: "Still deciding? Read the first chapter free", linking to the free edition. Show nothing else, store no personal data, and no cookie banner is needed for a first-party UI preference (check against the ICO storage-and-access guidance before shipping).
   - Ask for consent *before* checkout: the free-chapter signup is where the email and consent come from. Then the existing abandoned-cart skill applies.
   - If a true recovery email is ever needed, it requires moving that product from a Payment Link to API-created Checkout Sessions with `after_expiration.recovery.enabled` and `consent_collection[promotions]=auto`. That is a build change, so it's a PROPOSAL.
6. **Re-measure weekly.** The success measure is `typed-email` per 100 real shop visits (target: above 0), not raw sessions.

## How we apply it to Cedwyn
- **Today (internal, no site change):** the sales-fix log should report `possible people` and `typed-email` from the triage tool instead of "sessions opened". Patch both checker tools to add `client_reference_id=qa-<tool>`, or switch them to the API check. These are our own tools, outside the repair freeze.
- **Find the metronome:** grep our schedules and tools for the link ending `guqBLolD1yWy` (17 steady opens). If none of our scripts uses it, treat it as a crawler and remove the raw buy link from wherever that link is published (the wiki volume card, or the supplement PDF).
- **Supplement PDF (next rebuild):** change the in-PDF buy link to `/ebooks/?utm_source=pdf&utm_medium=supplement`. See `pdf-downloads-seo-host-canonical-title-links.md`.
- **Return-path line on /ebooks/:** PROPOSAL for when the repair freeze lifts (runtime.js). Wording must follow the editorial rules.

## Sources
- stripe.dev/blog/designing-flexible-payment-flows-with-checkoutsessions (Payment Link creates a session on each open)
- docs.stripe.com (after_expiration.recovery, consent, expired webhook)
- docs.stripe.com (no after_expiration; consent_collection, restrictions)
- docs.stripe.com (utm_*, client_reference_id, 150-char limit, invalid values dropped)
- buy.stripe.com (fetched 30 Oct 07:27Z)
- developers.google.com (links in PDFs followed like HTML)
- Cedwyn live read 30 Oct 07:28Z via stripe_session_triage.py; the project workspace run 29
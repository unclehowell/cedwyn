# Selling per-scene access codes with a Stripe Payment Link (and why not a video marketplace)

Harvested 2026-10-30. Topic: paid access to one version of one documentary scene (v0.0.2, £4.99) sold from our own site, with an access code the buyer types in. Sources read this run are listed at the end; anything not read is marked "not checked".

## What practitioners and the platforms show (with numbers)
- **Marketplaces can take your buyers' access away.** Vimeo's own shutdown notice: Vimeo On Demand blocked new uploads 22 Aug 2026, blocked new purchases 21 Sep 2026, made final seller payouts 24 Sep 2026, and shuts down 20 Nov 2026. "Viewers will lose access to previously purchased or rented content." Castr's migration write-up adds that Vimeo only exports the emails of buyers who opted in to updates. Lesson: the entitlement (who paid for what) and the buyer list must live on our side, not inside a host.
- **Peter Gerard (ex-Vimeo On Demand), guest post on Jon Reiss's 8 Above:** hosting a feature costs about $0.30 a month and streaming starts at about $0.10 a view, so "someone with modest technical skills can set up a simple paywall in front of a streaming video for only the cost of hosting, bandwidth and payment processing." He also warns that platform search no longer sells films (Vimeo disabled Search and Staff Picks in the EU and UK): every buyer comes from your own effort, so keep their email.
- **Kinema pricing page (read today):** a 99¢ fee per VOD rental covering unlimited views inside a 48-hour window, everything above it to the film team, splits after Stripe's 2.9% + 30¢. Useful as the price floor a specialist charges for a rental, and as proof that 48 h rentals are normal.
- **Stripe docs (read today):** a Payment Link can redirect to your own page after payment and include `{CHECKOUT_SESSION_ID}` in the URL. Stripe's custom success page guide: look the session up server-side with the secret key, and "You can't rely on triggering fulfillment only from your checkout landing page, because your customers aren't guaranteed to visit that page" — set up a webhook (or an equivalent server-side check) as well. The API's list-sessions call filters by `payment_link` and returns `payment_status`.

## The pattern (works without a secret key on the website's Worker)
1. **One Payment Link per (scene, version)**, e.g. `scene-03 / v0.0.2 / £4.99`. Put the scene and version in the link's metadata and set the after-payment redirect to `<site/documentary/unlock/?scene=03&v=0.0.2&session_id={CHECKOUT_SESSION_ID}`.
2. **The unlock page never trusts the URL on its own.** It sends the session id to the API Worker, which stores it as a pending claim and shows "Payment received, preparing your code" while it polls.
3. **Verification happens where a Stripe credential exists.** If the Worker has a restricted read-only key: retrieve the session, require `payment_status = paid` and that its `payment_link` matches the scene/version. If it has none (our case today): a small job on our own box, using the connected Stripe account, lists paid sessions for each Payment Link every 1–2 minutes and marks matching pending assertions as paid. The session id (a long `cs_live_…` string Stripe generates) is the buyer's proof; nobody can guess one.
4. **Mint the code once per paid session.** At least 10 random characters from an unambiguous alphabet (no 0/O/1/I), shown once on the unlock page (with a copy button and an "email me this code" opt-in). Store only a SHA-256 hash of the code, its scene and version, the session id, and a created time. Re-requesting the same session returns "already issued" plus a recovery route (the email on the Stripe receipt), never a second code.
5. **Redeem:** the player sends the typed code to `/redeem`; the Worker hashes it, checks scene+version, rate-limits by IP (e.g. 5 tries per 10 minutes), and returns a signed short-lived token (or a signed URL to the video file). The browser keeps the token in localStorage so a return visit plays without retyping. A wrong code gets one plain line: "That code isn't valid for this scene."
6. **Files:** the v0.0.2 file is not on a public, guessable path. Serve it through the Worker with the token, or from a path that changes and is only handed out by `/redeem`. A gate in JavaScript in front of a public MP4 URL is not a gate.
7. **Test end to end without a real charge:** Stripe test mode Payment Link + test card 4242…, or a seeded test session in the claim store; check (a) a forged session id is refused, (b) an unpaid session is refused, (c) a paid session gets one code, (d) the code unlocks only its own scene/version, (e) a random code is refused and rate-limited.

## Pitfalls
- Fulfilling from the redirect alone: someone closes the tab mid-redirect, pays, and gets nothing. Keep the claim retrievable by session id and by the receipt email.
- Codes that encode the scene (e.g. `S03V002-1234`) are guessable. Random only.
- Promotion codes are a different thing (discounts at checkout); don't reuse them as access codes.
- UK consumer law for digital content: the buyer must agree to immediate access and acknowledge losing the 14-day cancellation right before paying (see `uk-digital-content-cancellation-waiver-stripe-consent.md`).

## How we apply it to Cedwyn
- The documentary player's v0.0.2 gate (now being built by the documentary worker) should follow steps 1–7. No STRIPE_KEY is set on the cedwyn-api Worker, so step 3's box-side poller is the route that works today. If that poller is not built, the one missing step goes in the project workspace, not to the owner.
- Keep £4.99 per scene version (no price tests). Don't move sales to a video marketplace: Vimeo On Demand closes 20 Nov 2026 and takes buyers' access with it. Own the entitlement table and the buyer emails (Stripe receipt + Mailchimp opt-in on the unlock page).
- Consider a 48-hour rental only if buyers ask. Kinema's 99¢-per-rental floor shows a rental at £4.99 would be expensive next to buying to keep. Proposal only.
- Public wording on the gate stays neutral and short: "Enter access code" / "Buy now £4.99" / "Payment received, preparing your code".

## Sources
- Vimeo On Demand shutdown notice (read 30 Oct 2026): vimeo.com
- Castr, Vimeo On Demand alternatives (buyer-email export detail; vendor source): castr.com
- Peter Gerard on Jon Reiss / 8 Above, "Is Vimeo On Demand Dead?": jonreiss.substack.com
- Kinema filmmaker pricing (read 30 Oct 2026): kinema.com
- Stripe, after a payment link payment: docs.stripe.com
- Stripe, custom success page + webhooks required: docs.stripe.com
- Stripe API, list Checkout Sessions (payment_link filter): docs.stripe.com
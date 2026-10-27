# Signup-form bot protection: honeypot + time check + Turnstile + confirmed opt-in (own endpoint)
Harvested 27 Oct 2026 (skills harvest). Topic: keeping the Cedwyn mailing list clean and keeping our endpoint from being used to bomb strangers' inboxes.

## Why it matters
- **Subscription bombing** is when bots push one victim's address into hundreds of open signup forms at once, to bury a real alert (bank, password reset) under welcome mail. Spamhaus (Sep 2016, read): the forms that got abused were single opt-in forms that accept every address. Even **confirmed opt-in (COI)** "didn't help much because the volume of confirmation emails alone was enough to cause a substantial problem". Its advice, verbatim: "Use CAPTCHA plus COI to protect your mailing list subscription form!"
- Mailchimp help ("About fake signups", read 27 Oct): reCAPTCHA is "our best line of defense against spambot signups". It is on by default for hosted forms. For embedded or pop-up forms you switch it on yourself, under Audience name and defaults. Mailchimp also throttles abusive signup bursts.
- Cedwyn doesn't post to Mailchimp's form. Since fix SF12 (26 Oct), every form posts to our own Worker at **/api/list/subscribe** (D1 confirm sends, 6 POSTs per hour per IP). That means Mailchimp's reCAPTCHA is **not** in our path, and our endpoint has to do the job itself.
- Honeypot results come from practitioners, **not checked**. One r/webdev developer (Dec 2025 thread, seen only as a snippet) wrote that a honeypot alone cut spam "from tens per day" to almost none. A dev.to write-up states "80% reduction in basic spam with honeypots alone… combined with time-based checks… over 99%", which is secondary and **not checked**. Clearout (an email-verification vendor) warns that modern headless bots skip hidden fields, so a honeypot alone isn't enough.
- **Cloudflare Turnstile** (CAPTCHA replacement, docs read 27 Oct, updated Aug 2026): the **Free plan** covers "most production applications", with **up to 20 widgets** and all widget types. It is usually invisible or one tap, so it costs less conversion than an image CAPTCHA. Cedwyn already runs on Cloudflare, so there's no new vendor.

## How to do it (layered, cheapest first)
1. **Honeypot field.** Add one extra input (e.g. `name="website"`), hidden with CSS off-screen (not `type=hidden`; some bots skip those), plus `tabindex="-1"` and `autocomplete="off"`, and `aria-hidden="true"` on its wrapper so screen readers skip it. Server side: if it has a value, reply **200 with the normal "check your inbox" text** but store and send nothing. Never tell a bot it failed.
2. **Time check.** Put a render timestamp in the form (signed, or just epoch ms). Server side: drop any submit that arrives **under ~3 s** after render, or more than 24 h after. Same silent 200.
3. **Rate limits.** Keep the per-IP limit (6/h is fine). Add a **per-email** limit: at most one confirmation mail per address per 24 h. That second limit is what stops our form being used to bomb one victim.
4. **Turnstile on the form.** Add the widget in "managed" or invisible mode. The Worker checks the token with the siteverify call **before** writing to D1 or sending anything. No-JS fallback: keep the honeypot and time check, and allow at most 1 signup per IP per hour without a token.
5. **Keep confirmed opt-in.** Nobody joins the Mailchimp audience until they click the confirm link. Keep the confirm email plain and short, with no marketing, so a bombed victim gets one dull email and not a newsletter.
6. **Watch it.** A daily count of signup attempts vs confirmed vs honeypot hits vs Turnstile fails, logged to D1. If attempts spike (e.g. more than 10 times the daily median), turn Turnstile up to always interactive.
7. **Clean the list.** Unconfirmed addresses older than 7 days get deleted (UK GDPR: data minimisation). Never import them into Mailchimp.

## Pitfalls
- Don't test from the box more than the IP limit allows (6/h). Use a staging route or the honeypot path, which sends nothing.
- A visible error like "bot detected" teaches bots. Always return the same 200 text.
- Turnstile needs the site key in the page and the **secret only in the Worker env**, never in the repo.
- Accessibility: the honeypot must be invisible to screen readers too, or blind visitors will fill it in and be dropped without knowing.

## How we apply it to Cedwyn
- Patch target is the Worker behind `/api/list/subscribe` plus `web/_cedwyn/runtime.js` (mcForm). That's main, site-wide, so either leave a patch in the project workspace or open one PR labelled `site-wide` when no other worker is committing to main. Steps 1-3 need no new account. Step 4 needs a Turnstile widget made in the existing Cloudflare account (free) and the secret stored as a Worker secret.
- Same runner rules as SF12: test from the box **only on the honeypot path** (no mail sent). Real confirmations are counted in D1, not by sending.
- Add "honeypot hits / Turnstile fails / confirmed" to the Sunday growth report next to signups. It shows how many signups are real people, which is the number the free-chapter → £9.99 funnel depends on.
- Lands alongside the known SF12 leftovers (runtime.js `?v=` bump, no-JS signups filed as 'news'). Fix them in the same patch.

## Sources
- spamhaus.org (read)
- mailchimp.com (read)
- developers.cloudflare.com (read, Free plan, 20 widgets)
- reddit.com (snippet only, not checked)
- dev.to (snippet, secondary, not checked)
- clearout.io (snippet, vendor)
- the project workspace (our own endpoint facts)
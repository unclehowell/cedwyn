# Academy member sign-in on a new device: email magic link, no passwords, guest checkout first

Date: 2026-10-30 (harvest ~23:45Z). Status: PROPOSAL. Nothing built. Needs STRIPE_KEY on cedwyn-api (the project lead knows; not to be asked) and a way to send one transactional email.

## The gap it fixes
Today Academy access is a signed per-browser cookie (`cedwyn_m`, set after Stripe checkout or the family code; progress cookie `cedwyn_l`, per browser; no email stored). A paying member who opens the Academy on their phone after paying on a laptop, or clears cookies, looks like a stranger and meets the paywall again. That is a support problem and a churn trigger for a £49.99/month product.

## The evidence
- Baymard cart-abandonment list (read, 2026 page): excluding "just browsing", 18% of US shoppers abandoned a checkout because "the site wanted me to create an account"; 17% too long/complicated. So keep checkout account-free (Stripe Payment Link as now) and attach identity AFTER payment, using the email Stripe already holds.
- Ghost forum, "Magic links don't work when Outlook Safe Links are enabled" (read, practitioner thread 2020-21): Outlook Safe Links fetches the link first (HEAD), which consumed the one-time token, so the member's own click failed. Fix that worked: ignore/redirect HEAD and only consume the token on a real GET, or better, show a "Sign in" button on the landing page and consume on POST. next-auth issue #1840 reports the same (search snippet).
- FIDO Alliance Passkey Index, Oct 2025: passkey sign-ins 93% success vs 63% for other methods (search snippet of the FIDO PDF; page blocked to us, NOT read). Passkeys are a later step, not needed for a small membership.
- Vendor assertions (Substack +28%, "each extra auth step -10-15%") appear only on auth-vendor blogs with no method: not used.

## How to do it (playbook)
1. Checkout stays as is: no account, no password.
2. On the Stripe success redirect (`?session_id={CHECKOUT_SESSION_ID}`), the Worker verifies the session with Stripe, sets `cedwyn_m`, and stores only a hash of the customer email + Stripe customer id in the Academy's own D1 (derived db rule).
3. "Already a member? Sign in" on the paywall card: one email field. If the hash matches an active subscription, send a link with a 15-minute single-use token. Always answer "If that email has a membership, a link is on its way" (no account enumeration).
4. Token landing page shows a "Continue to the Academy" button; consume the token on POST only (Outlook Safe Links / iMessage previews prefetch GETs). Then set `cedwyn_m` for 400 days and move progress to the member, not the browser.
5. Same page offers "Manage or cancel" via the Stripe customer portal (DMCC easy-cancel; see uk-subscription-regime file).
6. Measure: sign-in requests, links used within 15 min, failures; a high unused rate points at spam-foldering or prefetch.

## How we apply it to Cedwyn
- Add to the Academy webapp backlog (after the current academy build finishes; do not touch a running worker's branch).
- Email channel is the open question (not checked): options are a transactional email service with a free tier, or Cloudflare's email sending if available on the account. Decide by the problems flywheel, not by asking the project lead.
- Until it exists, a no-email stopgap: on the success page, show and offer to save a personal "restore access" link (signed, long-lived), with the line "Keep this to open the Academy on another device".
- Privacy: store a hash, not the email; the D1 row has no name. Nothing changed live.

## Sources
- baymard.com (read)
- forum.ghost.org (read)
- github.com (search snippet)
- fidoalliance.org (search snippet, not read)
- the project workspace (current cookie design, read)
# Family / comp access kept out of sales numbers (comped memberships)

Written 30 Oct 2026 (skills harvest). Trigger: the /learn/ family code went live at 19:32Z (plan "family", 400 days). Without this rule a family redemption reads as a sale and the "First Academy member" alert or a weekly report states the wrong thing.

## What the membership platforms do (read 30 Oct 2026)
- **Memberful, "Track paying members"** (docs, read): a paying member is "a member who has a recurring payment that's active at the end of the month". These do **not** count until a renewal payment is collected: all-access passes, **100% coupons**, free trials, **admin-created subscriptions with no initial charge**, **gifted subscriptions**. One-time plans are never counted. Their "Active Members" count *does* include those groups, "one reason the two metrics may not match". Metrics refresh daily at midnight UTC.
- **Memberful churn** (blog, read): a **100% coupon assigned to a subscription counts as a paying-member loss**. A paid member moved onto a free code is churn, not a neutral change. The same post cites Recurly's benchmark of a healthy subscription business at about 6.7% annual churn (5-7%); that figure is Recurly's, not checked here.
- **Ghost, "Free trials in Ghost"** (help, read): complimentary plans grant paid access for a set time (1 week, 1 month, 6 months, 1 year or forever), with no card. When the time runs out, access ends unless the member upgrades in Portal. Members on a trial do **not** count towards MRR until they have made a payment.

The common rule is **two counters, never one**: *active members* (access) and *paying members / MRR* (money). Free, comped, gifted, trial and 100%-coupon members are in the first only.

## How to do it
1. **Tag the cause at grant time.** Every entitlement row carries `plan` = `paid` | `family` | `gift` | `trial` | `comp`, plus a `source` (Stripe session id, or `code:family-v1`). Never infer it later from the amount.
2. **Report three numbers:** active members (all plans), paying members (plan=paid with a collected payment), and revenue from Stripe itself, not from the member table.
3. **Alerts fire on money, not on access.** "New member" alerts read Stripe `checkout.session.completed` with `amount_total > 0`. A family redemption never triggers a sale alert.
4. **Give comps an end date.** Ghost's options run from 1 week to forever. A dated grant (ours: 400 days) forces a later review instead of a silent permanent free tier.
5. **Rotate, don't delete.** A new code version (`family-v2`) keeps the old redemptions countable. Revoking the old hash stops new joins without signing anyone out unless that is intended.
6. **Watch moves from paid to comp.** A paid member who later redeems the family code counts as churn (Memberful's rule). Flag it once and decide whether to refund. Do not let it lower revenue silently.

## How we apply it to Cedwyn
- `member_sync.py` / the cedwyn-api Worker: family redemptions are logged as count + time with `plan:"family"` (a worker, 30 Oct). The ACADEMY MEMBER SYNC schedule must message only on a **paid** new member. Checked 30 Oct 19:50Z: member_sync.py already prints family joins on their own line ("family_code: N new family join(s) ... (not sales, no payment)") from D1 learn_family_redemptions, and the 19:34Z and 19:47Z log lines show 0 family joins and 0 paid. Keep it that way.
- The Sunday growth report and the BIZDEV log show "Academy: X paying (Stripe), Y family" and never a single combined figure.
- If a paying £49.99/mo member later uses the family code, log it as a downgrade in the project workspace (never tell the project lead directly); a refund is the project lead's call, as a proposal only.
- Rotation runbook: the project workspace; use v-numbered codes so counts survive rotation.
- The same rule applies to documentary scene access codes: an access code granted without a Stripe payment is never counted as a £4.99 sale.

## Sources
- memberful.com (read 30 Oct 2026)
- memberful.com (read 30 Oct 2026; Recurly 6.7% benchmark cited there, not checked)
- ghost.org (read 30 Oct 2026; published 18 Apr 2023)
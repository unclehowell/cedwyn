# Email win-back / reactivation series for cold Mailchimp subscribers

Skill harvested 26 Oct 2026. Topic: winning back (or cleanly removing) subscribers who stopped engaging, so the e-book list stays deliverable and honest. Not covered elsewhere: the welcome sequence file handles new sign-ups; subject lines/MPP and cold-email deliverability files handle other parts.

## What the practitioner evidence shows
- **Dan Oshinsky (Inbox Collective; ex-BuzzFeed newsletters), own list, Feb 2023, read in full:** a 3-email series to **1,977** readers who signed up 6+ months earlier and had opened nothing in the previous 90 days won back **361 (18.3%)**. On the "Last Chance" email, **64% of readers who opened it clicked** the stay-subscribed button.
- Same source: a good reactivation campaign wins back roughly **5-15%** of the inactive segment, a great one up to **25%** (his consulting experience, not a controlled study).
- Litmus guidance (blog, read): give an opt-down or preference choice rather than "unsubscribe or bust".
- Mailchimp Help ("Re-engage inactive subscribed contacts", read): build a segment from email activity or contact rating, then use an automation with post-send actions that unsubscribe or re-tag people who do not respond.
- Secondary figures seen only in search snippets, **not checked**: "10-15% reactivation" (Deployteq), "12 to 35 percent" (a Facebook group post), "2 to 5% on a first campaign" (Inbox Collective snippet from another post).

## Why it matters even for a small list
Mailbox providers place mail partly on how recipients engage. A list where many people never open drags the engaged readers toward the spam folder. Removing non-responders also keeps a free Mailchimp plan (contact cap) usable.

## How to run it (Oshinsky's 11-step shape, adapted)
1. **Define inactive by cadence:** weekly/monthly sender = no opens or clicks for 4-6 months; daily = 60-90 days; giveaway or event sign-ups = 21-30 days.
2. **Because of Apple Mail Privacy Protection, judge by clicks where you can.** Opens from Apple Mail are machine-made; treat "opened" as weak evidence and "clicked" as the real signal (see email-subject-lines-preview-text-mpp.md).
3. **Never include anyone who joined in the last 30 days or has bought.** Buyers get a different, gentler note.
4. **Email 1 - Preferences / opt-down:** "How often do you want to hear from us?" Offer a less frequent option (e.g. only new-edition news).
5. Wait **3-7 days**. Anyone who clicks: tag `reactivated`, exit the journey.
6. **Email 2 - Evergreen best-of:** 3-4 of the most-read pieces, one line each. Refresh it a few times a year.
7. Wait **5-7 days**; same exit rule.
8. **Email 3 - Last Chance (opt-in, not opt-out):** subject "Do you still want emails from us?"; ONE button ("Yes, keep me on the list"), no other links; plain sentence that nothing needs doing to leave.
9. Wait **4 days**. Non-clickers are **archived/unsubscribed**, not just suppressed.
10. Optional **confirmation** email: "You've been unsubscribed", with a one-click way back.
11. Build a simple **confirmation page** for the Last Chance button (thank-you + one next step).
12. **Measure:** reactivation rate = re-engaged ÷ segment size; then watch whether `reactivated` people keep clicking over the next 2-3 months. Judge on clicks and sales, not opens.

Mailchimp build: Customer Journey -> starting point "contact enters segment" (or a one-off tag) -> Send email -> Delay -> If/Else on clicked -> tag + exit / continue -> final step "Unsubscribe" or "Archive". Runs on free-plan journeys only if the account's plan allows multi-step journeys; check the plan page before building (not checked).

## How we apply it to Cedwyn
- **Status today:** the Cedwyn/Great House Farm audience is small and young, so there may be no 4-6-month-cold segment yet. Build the journey now as a **draft** in Mailchimp and switch it on only when a segment of 20+ inactive members exists and the owner gives the GO. Any sending is the owner's decision; this file proposes, it does not send.
- **Inactive rule:** joined 120+ days ago, no clicks in 120 days, no purchase (match Stripe/Gumroad emails before building the segment).
- **Email 1 (preferences):** "Only new editions and records finds, or the occasional history note too?" Two buttons -> two Mailchimp tags.
- **Email 2 (evergreen):** three pieces with one line each, e.g. "The 1824 David Stewart survey: the first record mention found of the farm", "The family acquired Tŷ Mawr in 1667 (1974 newspapers; ITV News 1988)", and the free first edition link on /ebooks/ with `utm_source=mailchimp&utm_medium=email&utm_campaign=winback`.
- **Email 3 (last chance):** subject "Do you still want the Cedwyn letters?"; one button to a /thanks/ page that points to the £31.99 bundle on /ebooks/ as the single next step (proposal only; no price change).
- **Report:** one line in the Sunday growth notes: segment size, reactivated count, archived count.

## Sources
- Dan Oshinsky, "How to set up a reactivation campaign to win back inactive email subscribers", Inbox Collective, 5 Apr 2023 - inboxcollective.com (read in full)
- Mailchimp Help, "Re-engage inactive subscribed contacts" - mailchimp.com (read)
- Litmus, "5 tips for creating effective re-engagement emails" - litmus.com (read)
- Deployteq; mailpro.com; Facebook group post - snippets only, not checked
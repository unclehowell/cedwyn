# Resend to non-openers (Mailchimp): one careful second send for key emails

Skill type: email marketing. Read 26 Oct 2026 by the skills harvest.

## Evidence (primary sources)
- Mailchimp research post "The Value of a Resend Campaign, By the Numbers" (mailchimp.com, read; publication date not shown, not checked): **1,300** campaigns that were resent shortly after the first send. Original average open rate **26.7%**; the resend added enough opens to lift the original by **8.7 points** (the intro of the post writes "8.7%"; treat as about 9 points). Measured as extra opens/clicks/unsubs/complaints on the original list.
  - Changing the **subject line** on the resend: fewer extra opens and more abuse complaints. Keep it.
  - Changing the visible **From name**: more opens, but fewer clicks and far more unsubscribes and complaints. Keep it.
- Mailchimp help "Resend an Unopened Email" (read): resend **once**, **within a day** of the original; unsubscribes and complaints rise when the resend goes 2+ days later. The one-click "Schedule Resend" needs the Standard plan or higher; **all plans can do it by hand** (Mailchimp's words): Replicate the email, then send to a segment "was sent [campaign] AND has not opened [campaign]". Complex segments need Standard; the Free plan has simple segments only - whether a simple segment offers "has not opened" is not checked, so test it in the builder before relying on it. Needs open and click tracking on; only regular emails; only one resend per email.

## Caveat for 2026: opens are noisy
Apple Mail Privacy Protection marks many emails as opened by machine (see our email-subject-lines-preview-text-mpp skill), so a "did not open" segment misses most Apple Mail readers and is mostly Gmail/Outlook people. Use it anyway for the few emails that matter, but judge the result on **clicks and sales**, not opens. Alternative segment for a sales email: "was sent AND did not click" - more people, so a higher complaint risk; use only for one launch email per book.

## Steps
1. Use it only for high-value emails: a new e-book release, a free-chapter offer, a talk/tour date. Never for routine news. At most one resend per email, at most 2 a month.
2. Send the original with open + click tracking on. Keep the same subject line and the same From name for the resend (Mailchimp's data).
3. 20-24 hours later: Replicate -> recipients = segment "was sent X AND did not open X" -> schedule at a different hour from the first send (time-of-day effect not checked).
4. Optional: change only the preview text or the first line ("In case you missed it yesterday"). Do not add urgency that is not true (CMA rules on false limited-time offers are in our black-friday skill).
5. Read the result on the original list: extra clicks, extra sales (Stripe), unsubscribes and complaints. Stop if the resend's complaint rate is above 0.1% or unsubscribes double the original's (thresholds are our own rule, not checked against Mailchimp).
6. Log it: campaign, list size, extra clicks, extra sales, unsubs, complaints.

## How we apply it to Cedwyn
- The list is very small today, so the absolute gain will be a handful of readers; the cost is nearly zero. Use it on the next one-off campaign to existing subscribers that the sales-fix flywheel sends (a campaign to the existing list is already allowed there), not on welcome or journey emails.
- Manual Free-plan route: Replicate -> "has not opened" segment (if the simple segment builder offers it; not checked) -> send ~22 h later, same subject and From name. If it does not, fall back to a short follow-up email to the whole list only for a new-book launch.
- Add UTM utm_campaign=<name>_resend so the Sunday growth report can separate resend clicks from first-send clicks.
- Any NEW automated journey built on resends is a PROPOSAL for the owner.

## Sources (opened and read 26 Oct 2026)
- mailchimp.com
- mailchimp.com
# Sending case email from a personal Gmail: limits, pacing and one-sender-at-a-time


## The facts (primary sources)
- Gmail Help 22839 "Limits for sending & getting mail" (read 31 Oct 2026): "You have reached a limit for sending mail" appears after more than 500 recipients in a single email or more than 500 emails in a day; sending resumes "within 1 to 24 hours".
- Same page: if a large number of your emails cannot be delivered (invalid address, bounce), "You may be able to send emails again after 24 hours." So bounces, not volume, are the realistic risk for us: one evening of 30 sends is far under 500, but a handful of guessed or retired addresses (e.g. a wales.office@ that may be retired) costs more than volume does.
- Same page: if a recipient gets too much mail too fast you may see "receiving mail at a rate that prevents additional messages"; contact them another way.
- Google Workspace Admin "Gmail sending limits in Google Workspace" (search snippet, not read in full): 2,000/day per Workspace user, 500 for trial accounts. Not our case (free account).
- Google sender guidelines, support.google.com (read): since 1 Feb 2024 all senders to Gmail need SPF or DKIM and valid forward/reverse DNS; extra rules apply at 5,000+/day. Sending from gmail.com itself inherits Google's authentication, so this binds only if we ever send "as" a custom domain.
- Practitioner assertions seen but not checked: a Reddit r/GMail user's "~20 outgoing mail per hour" rate cap (no Google source; treat as not checked folklore); GMass blog "500 per rolling 24-hour period" for individual accounts (consistent with Google's page; "rolling" is GMass's word).

## Playbook (personal Gmail, institutional one-to-one mail)
1. Volume: stay under 100 a day as a working ceiling (20% of Google's 500) so replies, forwards and chases never push the account to the lock. Our heaviest evening was about 30.
2. Pace: 15-20 s apart is what our runs use; there is no Google-published per-minute figure, so pacing is courtesy and loop-safety, not a known threshold.
3. Address hygiene before sending: only the organisation's own published address (site page or gov.uk listing), fetched that day; never a guessed pattern. Every bounce: stop sends to that org, fix the address, log it. Three bounces in one run: stop the run.
4. One sender at a time: a single lock (one running send job per account) and a written send log checked BEFORE each send. On 31 Oct three Gmail drafts left the account at 20:08Z unedited, outside the run that was meant to edit them first; two processes acting on the same Drafts folder is exactly the failure a lock prevents.
5. Drafts are live ammunition: a draft that must not go as-is (payment lines, placeholders) should be edited or deleted, not left in Drafts with a note elsewhere. Anyone (or any job) with access can press send.
6. Verify each send in Sent and record the message id (our runs already do this); a send with no Sent record is unknown, not failed: check Sent before retrying, never resend blind.
7. Signs to stop at once: "You have reached a limit for sending mail", a spike of mailer-daemon returns, or "receiving mail at a rate". Wait the stated 1-24 h; do not switch accounts to get round it.

## How we apply it to Cedwyn / the case
- PROPOSED (internal, no site change): a lock file the project workspace written by any job that sends from the project lead's Gmail, with its task id and start time; any other job finding a fresh lock (<30 min) does not send or touch Drafts. Also: `sent-log.md` check by recipient+subject before each send (already the rule in runs 1-3).
- PROPOSED: drafts that are held for a policy reason (payment offer, hold date) get the hold written into the draft's subject prefix "[HOLD - do not send]" so a human or job sees it in Drafts itself.
- Daily ceiling 100 for case mail; marketing never goes from the personal Gmail (it goes via Mailchimp with its own rules).
- Bounces feed auto-replies-rfc3834-institutional-acks-header-triage.md (BOUNCE class) and the address is corrected in the HubSpot task before any re-send.
- Never send anything new because of this file; it governs how already-authorised sends are paced.

## Sources
- support.google.com (read)
- support.google.com (read, requirements for all senders)
- knowledge.workspace.google.com (snippet only)
- gmass.co (snippet, vendor)
- reddit.com (snippet, not checked claim)
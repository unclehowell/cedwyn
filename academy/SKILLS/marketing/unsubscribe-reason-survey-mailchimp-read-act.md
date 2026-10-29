# Unsubscribe-reason survey: keep it on, read every answer, act on three signals

**Why.** Each unsubscribe is a reader telling us something, and on a tiny list each one counts. Mailchimp already shows a reason survey after every unsubscribe. The work is to keep that survey switched on, read the answers, and react to the few signals that matter. The preference centre (`email-preference-centre-snooze-topics.md`) works *before* the click; this skill covers what happens *after* it.

## Evidence (read unless marked)
- **How Mailchimp's survey works** (two help pages, read 28 Oct 2026):
  - The "Unsubscribe success page includes an unsubscribe reason survey". Answering is optional.
  - **You can't add or remove reasons.** You can only reword them, under Forms > Other forms > Manage forms > *Unsubscribe success page* > *Translate it*.
  - Setting a redirect URL in "send subscribed contacts to another URL" **removes the survey**. Don't swap in a custom goodbye page.
  - Results are per campaign: Campaigns > View Report > Recipient activity > filter Unsubscribed, then Export recipients.
  - Export codes: NORMAL (no longer interested), NOSIGNUP, INAPPROPRIATE, SPAM, OTHER (free text), UNSPECIFIED. A single contact's reason also shows in their profile's activity feed.
- **MailerLite, "Unsubscribe survey: learn why your readers leave", 25 Mar 2026** (read; vendor data):
  - The average unsubscribe rate is **0.22% per campaign across 3.5M+ campaigns**. Legal, media and higher education run at a median of about 0.1%; photo/video, restaurants and telecoms at 0.34–0.40%. "Your own trend over time matters more than any single number."
  - Spam: "a handful of clicks here is completely normal… start paying attention if more than **4 to 5%** of people who unsubscribe choose this option", because it can start to hurt sender reputation.
  - "I never signed up" means auditing how people join: pre-ticked boxes, unclear opt-in, imported or event lists. The fix is double opt-in.
  - Too frequent: say the frequency on the signup form ("Expect 2–3 emails per month") and offer a digest instead of leaving.
  - Targeted, preference-based sends get **+36.69% opens and +267.21% clicks** compared with untargeted ones. This is MailerLite's own figure; the method isn't stated.
- **MarketingSherpa consumer study** (2,400 US consumers, chart article, read):
  - Reasons people give: too many emails in general (**26%**), not relevant (**21%**), too many from this company (**19%**), "always trying to sell me something" (**19%**).
  - **49%** would rather choose their own email frequency (24% prefer the brand to choose), yet only **14%** of marketers offer that choice.
  - One respondent: "my choice is to receive the everyday email or nothing, when all I want is maybe once a month."
- **Small-newsletter testimony** (r/beehiiv, "What is unsubscribe percentage a newsletter should have", read via RSS):
  - A weekly writer saw unsubscribes rise from 0.5% to 2.5% per issue.
  - Replies: "Anything above 0.5% is over the normal threshold"; "above 1%… significant risk to sender rep."
  - The usual cause is a gap between what the signup promised and what the issues deliver.
  - Check where unsubscribers came from: cross-promotion and recommendation sign-ups unsubscribe more than organic ones.
  - beehiiv can attach its own survey as the unsubscribe survey.

## The routine (10 minutes after each campaign)
1. **Leave the survey on.** If the wording is ever changed, keep the 5 fixed reasons and use plain words, plus a Welsh line if the list is bilingual.
2. **After each send,** export Unsubscribed from the campaign report and run `python3 tools/unsub_reasons.py export.csv --sent <recipients>`. It prints the share for each reason and every free-text OTHER answer. It flags:
   - **SPAM_SHARE** (above 4.5% of unsubscribers)
   - **NOSIGNUP** (any at all)
   - **UNSUB_RATE** (above 0.5% of sends)
3. **Act on what it states:**
   - **NOSIGNUP:** find the source (form, import, tag) the same day, then fix or remove it. Never re-add the person.
   - **SPAM_SHARE:** cut promotional emails and send the next issue as pure content. Check that double opt-in is still on.
   - **Frequency complaints, or NORMAL rising:** add or promote the "monthly digest only" option and repeat the frequency on the signup form.
   - **OTHER text:** quote it verbatim in the weekly report. It's voice-of-customer copy material, so feed it to `voc-review-mining-sales-copy.md`.
4. **Under 20 unsubscribes in total,** read each answer and ignore percentages. Never email an unsubscriber to ask why; the survey is the only ask. Mailchimp advises not to send to unsubscribed contacts unless the unsubscribe was a proven error.
5. **Record each campaign** as one row: campaign, sent, unsubscribes, rate, top reason, flags. Compare the trend, not single campaigns.

## How we apply it to Cedwyn
- The list is the Mailchimp audience `6139ff4a0d`, with double opt-in. The growth notes record 1 member. **Action now:** check read-only that the Unsubscribe success page still shows the survey (no redirect URL set), and leave it as is. This changes nothing public.
- The signup form should name the frequency, e.g. "About two emails a month: new records, new e-books." Propose that line for the free-chapter block; it is copy, so it goes through the project lead's editorial rules.
- After every Mailchimp campaign, the weekly report (`the project workspace`, Sunday growth report) gains one line: unsubscribes / sent, top reason, any flag. Free-text answers are quoted with no names or addresses.
- Institution outreach from Gmail has no unsubscribe survey. There, a "please remove me" reply is the signal: record it in HubSpot and never contact that address again. This matches `cold-email-reply-triage-first-72-hours.md`.
- Zero spend, nothing installed, nothing sent.

## Tool
`tools/unsub_reasons.py`: our own standard-library script (about 3 KB). It reads the Mailchimp codes or plain labels and exits 1 on any flag. Tested 28 Oct 2026 on a 5-row sample, where it flagged SPAM_SHARE, NOSIGNUP and UNSUB_RATE 2.50%.

## Sources
- mailchimp.com (read 28 Oct 2026)
- mailchimp.com (read 28 Oct 2026)
- mailerlite.com (read; 25 Mar 2026)
- marketingsherpa.com (read)
- reddit.com (read via .rss)
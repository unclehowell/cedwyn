# Confirmation-email (double opt-in) leak: measure confirm rate, one reminder, inbox shortcut

Written 31 Oct 2026. Before this, 'confirmation email', 'unconfirmed' and 'single opt' had 0 hits in INDEX. signup-form-bot-protection-honeypot-turnstile-coi.md covers bots and keeping COI; this file covers the humans lost between "Check your inbox" and the click.

## What the evidence states
- **GetResponse (own data, read 31 Oct 2026):** 2022 premium SMB accounts with online forms, 2.76 billion newsletters. Form subscription rate was **1.28% single opt-in vs 0.33% double opt-in**. DOI subscribers open and click more. Against common belief, DOI unsubscribe rates were *higher* (0.1084% vs 0.0913% overall). Spam complaints were no better under DOI, and bounces were inconclusive. These are accounts that chose SOI or DOI, not a randomised test.
- **Mailchimp's study** (30,000 accounts: DOI **+72.2% unique opens, +114% clicks**) is cited by mailblaze and others, but the original Mailchimp page now 404s, so it isn't checked. The figure "61% never complete DOI" also appears only second-hand and isn't checked.
- **Spamhaus (read):** COI "prevents unwanted subscriptions due to forgeries and typos, and provides an auditable trail" if someone reports spam. It's their gold standard. **Keep COI.** The job is to lose fewer real people at the confirm step.
- **Omnisend DOI guide (vendor, read):** reminder emails to "pending" contacts "often recover 0–20% of unconfirmed contacts". Reminder 1 goes 24 h after the confirmation email. Don't market to unconfirmed contacts, and purge them after 30 days. Sequenzy (vendor, snippet only, not checked) puts a reminder at 10-15% recovered and a well-built flow at 70-80% confirmed.
- **Mailchimp Help, About Double Opt-in (read):** the flow has 3 surfaces: the signup thank-you page ("check your email"), the confirmation email with a unique URL, and the confirmation thank-you page. Each is a place to lose or keep people.

## How to do it
1. **Measure first.** Confirm rate = confirmed / (confirmed + pending older than 7 days), by week and by `source`. Vendor talk puts 70-80% as typical. Under 60% means a leak worth fixing. Small numbers swing: with n<30, read it as a range, not a rate.
2. **Check-your-inbox page:** name the sender and subject they'll see ("from Cedwyn, subject 'Confirm your Cedwyn subscription'"), say it takes one click, and offer **inbox shortcut buttons**. For Gmail, a search deep link for the sender in all folders: `mail.google.com+in%3Aanywhere`. For Outlook.com, a link to the inbox. Show the button that matches the address domain (gmail.com, outlook/hotmail/live). The link construction is ours, not checked on every app.
3. **Confirmation email:** subject states what it is, the button sits in the first lines, and there's no marketing. It's plain, from a named sender, and in their language.
4. **One reminder, then stop.** At 24-48 h, only for pending rows that passed the bot checks. Subject: "One click left: confirm your Cedwyn subscription". Never send a second reminder, because more mail to a bombed victim is the harm Spamhaus warns about. Purge pending rows at 30 days.
5. **Corporate link scanners:** Microsoft Safe Links and similar tools open GET links. Confirming should need a POST or a button press (or a JS auto-submit) so scanners don't confirm on someone's behalf. Ours already does this; keep it.
6. **Re-measure after 4 weeks.** Change one surface at a time.

## How we apply it to Cedwyn
Our list is our own Worker (the project workspace, D1 `cl_subscribers` with status pending/confirmed/unsubscribed), not Mailchimp's form.
- **Already right:** COI; the confirm page uses a POST form (scanner-safe); one confirmation per 10 min per address; failed sends retried up to 3 times (`confirm_sends<3`); en/cy/es copy; subject "Confirm your Cedwyn subscription"; the plain "someone, hopefully you" opener; a 7-day link.
- **Gap 1, no measurement.** Add a read-only weekly count to the growth report: `SELECT source, status, COUNT(*) FROM cl_subscribers WHERE test=0 AND created_at < strftime('%Y-%m-%dT%H:%M:%SZ','now','-7 days') GROUP BY source, status`.
- **Gap 2, no human reminder.** The retry loop only covers sends that failed (`confirm_sent_at IS NULL`). Proposal: one reminder at 24-48 h for `status='pending' AND confirm_sends=1 AND confirm_sent_at < now-24h`, sent once (bump confirm_sends), within the Resend daily budget, and never for honeypot or Turnstile fails. Purge pending rows at 30 days.
- **Gap 3, the check page has no inbox button.** Add a domain-matched "Open Gmail" / "Open Outlook" button under `check_p`, in en/cy/es. It's small markup.
- **Gate:** these are Worker code changes on the cedwyn mail path. Leave them as a patch or proposal for the sales-fix or onpage flywheel, with one change at a time and a live test using a TEST_SENDERS address. Don't edit while another worker owns cedwyn-mail. Zero spend; the Resend budget is unchanged.

## Sources
- getresponse.com (own data, read 31 Oct 2026)
- spamhaus.org (read)
- omnisend.com (vendor, read)
- mailchimp.com (read)
- mailblaze.com (secondary citing the Mailchimp study, snippet only, not checked)
- Ours: the project workspace (read), signup-form-bot-protection-honeypot-turnstile-coi.md
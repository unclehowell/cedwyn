# Email preference centre: "fewer emails" and topic choice instead of unsubscribe

Skill harvested 26 Oct 2026. Not covered by list cleaning, click-interest tags, send time/frequency or winback files: this is the subscriber-facing control that keeps people on the list on their own terms. Changing the email journey is a PROPOSAL.

## What practitioners report
- Unsubscribe rates more than doubled year on year from 2024 to 2025, largely because Gmail made unsubscribing easier (MailerLite research, as cited by Litmus/Validity, Jul 2026; MailerLite original not checked).
- Senders who added a "snooze" option to the preference centre saw unsubscribes drop by an average of 82% (Oracle, cited by Litmus; original not checked).
- An e-commerce client's tiered preference centre: +189% email engagement, -76% unsubscribes (Single Grain, cited by Litmus; original not checked).
- Litmus/Validity (Guy Hanson, 24 Jul 2026): promote the preference centre in its own email, not only the footer; set a benchmark - share of subscribers who used it in the last 12 months.

## Mailchimp mechanics (Mailchimp help, read 26 Oct 2026)
- *|UPDATE_PROFILE|* merge tag = the "update your preferences" link; most templates already carry it in the footer. It is contact-specific and does not fill in test emails.
- Clicking it shows a pop-up with "Email me a link"; Mailchimp sends a separate email with the secure link (one extra step - expect some drop-off).
- Groups on the audience are what subscribers tick (topics, frequency). Audience > Subscriber preferences builds a Preferences Center page; with one published, *|UPDATE_PROFILE|* goes there instead of the plain profile form.
- Preferences Centers are NOT available for audiences with GDPR-enabled signup forms (or the classic website builder). If GDPR fields are on, use groups on the standard update-profile form instead. A custom domain for it needs a paid plan.
- Snooze is not a native toggle: build it as a group ("Pause until January") and exclude that group from sends until the date, then clear it.

## How to set it up
1. Groups, max 5 choices, plain words: topics + one frequency option ("Monthly digest only") + one pause option.
2. Every campaign targets a segment that honours the groups (exclude "Pause", send digest-only people the monthly roundup only).
3. Footer: put "Fewer emails or different topics? Choose here" (*|UPDATE_PROFILE|*) ABOVE the unsubscribe link (keep the one-click unsubscribe; never hide it).
4. Once, send a short "choose what you get" email with the same link (Litmus's recommendation).
5. Measure monthly: unsubscribe rate per campaign, number of preference updates, share of list that has set a preference (benchmark).

## How we apply it to Cedwyn (PROPOSAL; no change made)
- Proposed groups for the Cedwyn list: New e-books and offers; Research and new records; Guided tour news (Wales); Welsh-language editions; Spanish / Patagonia; plus "Monthly digest only" and "Pause until next month".
- First check (read-only) whether the audience has GDPR-enabled forms: if yes, use groups on the update-profile form, not a Preferences Center. Group availability on the current plan: not checked.
- These groups also feed segmentation for the welcome sequence and launches (welcome-sequence-first-sale-small-ebook-list.md) and fit mailchimp click-interest tags (behaviour) with stated interest (groups).
- Owner sign-off needed before groups go on the public signup/profile forms or any campaign is sent. No new list, no spend.
- KPI: unsubscribe rate per send below the current baseline after 3 sends; 10% of the list setting a preference within 90 days.

## Sources (opened 26 Oct 2026)
- Litmus / Validity, "We Want Your Email Preferences: The New Approach to Opting In" (24 Jul 2026): litmus.com
- Mailchimp Help, Create a Preferences Center: mailchimp.com
- Mailchimp Help, Add an Update Your Preferences Link: mailchimp.com
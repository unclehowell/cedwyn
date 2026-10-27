# Inbox placement checks before an important send (mail-tester, seed tests, header reading)
Harvested 27 Oct 2026 (skills harvest). Topic: making sure the project lead's emails to UK institutions, and Cedwyn's Mailchimp mail, land in the **inbox**, not junk, especially at Microsoft-hosted mailboxes (most UK councils, police forces and many public bodies run Microsoft 365 / Outlook; general knowledge, not checked per body).

## Evidence
- **GlockApps Deliverability Benchmark, H1 2026 vs H1 2025** (read 27 Oct). Averages from thousands of seed tests: Gmail inbox 62.4%, **Outlook 34.67%**, Hotmail 36.35%, Yahoo 48.87%, total 49.0% (up 6 points on 2025). Smallest tier (1-10K emails/month): **Outlook 16.88%**, Hotmail 17.88%, Gmail about 50%. Caveat: this is vendor data from people who chose to run tests, so it leans towards senders who already have problems. Use it as "Microsoft is the hard one", not as our own rate.
- **Microsoft high-volume sender rules** (Microsoft Defender blog, Apr 2025, snippet; dmarcian/Mailgun write-ups). Domains sending **over 5,000/day** to Outlook.com, Hotmail and Live addresses must pass SPF, DKIM and DMARC. Since **5 May 2025**, non-compliant mail is **rejected**, not sent to junk. That doesn't apply to the project lead's personal Gmail volume, but Mailchimp mail from a custom domain needs that authentication anyway (see mailchimp-sending-domain-auth-dmarc-free-from.md).
- **mail-tester.com** (FAQ read): send one message to a random one-time address and get a score out of 10 (SpamAssassin, SPF/DKIM/DMARC, blocklists, broken links, content). **3 free tests per 24 h**, results kept 7 days. Practitioner warning (r/Emailmarketing thread, snippet): mail "goes to spam despite a 10/10". A good score checks setup and content, **not reputation or placement**.
- **GlockApps free spam test**: one free run shows placement across Gmail, Yahoo, AOL and Outlook seed boxes. It is the only free check that measures placement at Microsoft (vendor homepage, snippet). Cost beyond the free run: paid, so don't buy.

## How to do it
1. **Zero-send check (always allowed, read-only)**: open a message that was **already received**, e.g. the project lead's own copy of a Mailchimp campaign, or an institution's reply in the thread. In Gmail, "Show original" shows SPF / DKIM / DMARC = PASS or FAIL and the signing domain. For our sends, every FAIL is a fix to make before the next send.
2. **Content lint before an important email**: plain text or very light HTML, at most 2 links, no URL shorteners, no attachments on the first contact unless asked for (send the document on request), a subject without ALL CAPS or "URGENT", and a real signature. Keep the body under about 200 words for a first contact.
3. **Score test (an outward send, so the gate applies)**: the project lead sends the final draft from his own Gmail to a mail-tester address, or approves Tab doing it. Fix anything under 9/10 (missing DKIM shows up as -1 or more, broken links, a missing List-Unsubscribe on marketing mail). Spend one of the 3 daily tests per **template**, not per recipient.
4. **Placement test (once per new template or setup change)**: one free GlockApps run, focusing on the Outlook/Hotmail result. Junk at Outlook calls for a lighter body, fewer links, and a reply-style subject that matches the existing thread.
5. **Thread hygiene for institutions**: reply **in the existing thread** where one exists, since an earlier two-way conversation is the strongest positive signal. Ask the recipient's team to add the address to safe senders in the first reply ("so replies aren't filtered"). Watch for auto-replies: an auto-reply means delivered, while silence plus no read reply after the statutory deadline gets checked against their junk-folder statement in a follow-up (FOI follow-ups only after the deadline).
6. **Log it**: per template, the date, mail-tester score and GlockApps Outlook result, in the project workspace

## Pitfalls
- Sending tests to many seed addresses from the project lead's personal Gmail can itself look like bulk mail. One test per template is enough.
- Don't change the From name or address between first contact and follow-up.
- A 10/10 score states nothing about placement. Reputation and engagement decide that.

## How we apply it to Cedwyn
- **Hive READY gate**: before a HubSpot draft is marked READY and turned into the one Gmail draft for the project lead, the hive's last reviewer runs step 2 (content lint) and records the result in the changelog. Steps 3-4 are offered to the project lead **as an option on his first send of each new template**. We never send them ourselves without his OK, because they're outward sends.
- **Mailchimp (Cedwyn list)**: run step 1 on the next campaign the project lead receives. If DKIM isn't aligned to bucklerfamily.estate, that's the fix (domain auth file above), done before any launch email.
- **FOI/SAR follow-ups to Microsoft-hosted bodies** (SWP, councils, MoJ/HMCTS): the drafts engine adds the safe-sender line to first contacts and records "auto-reply received yes/no" in queue.json, so silence can be told apart from junk filtering before anything is logged on the What They Don't Say page.

## Sources
- glockapps.com (read; vendor seed-test data)
- mail-tester.com (read: 3 free tests/24 h, 7-day results)
- techcommunity.microsoft.com (snippet); dmarcian.com (snippet: reject from 5 May 2025)
- reddit.com (snippet, practitioner)
- glockapps.com (snippet, free test scope)
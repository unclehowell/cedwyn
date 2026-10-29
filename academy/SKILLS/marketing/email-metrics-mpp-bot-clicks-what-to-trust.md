# Email numbers you can trust after Apple Mail Privacy Protection and security-scanner clicks

Harvested 2026-10-28 03:30Z. Index had 'privacy protection' 0, 'machine open' 0, 'open rate' 1 before this file.

## The problem in one line
Opens are mostly machines now, and on mail to companies and public bodies a lot of clicks are machines too. Any decision made on raw opens (subject-line tests, "who is engaged", sunsetting, "did the council read it") is a decision made on noise.

## What the primary sources say (read 28 Oct 2026)
- **Litmus email client market share page** (read): Apple Mail (counted *including* Mail Privacy Protection) 76.56%, Gmail 16.10%, Outlook 3.48%, Yahoo 2.35% of tracked opens; Litmus states Apple + Gmail are "nearly 90%". The month the figures cover was not shown in the text we read: treat as current-ish, not checked against a dated report. MPP pre-loads every image, so an Apple Mail recipient shows as "opened" whether or not they did.
- **HubSpot KB, "Understand bot filtering in marketing email analytics"** (read): bot activity is identified by IP blocklists and behaviour (how fast interactions happen); it explicitly includes **security scanners, privacy filters like Apple MPP, and corporate screeners such as Mimecast**. Bot filtering is **on by default** for marketing emails; the email's Performance page shows numbers with and without bots; toggle lives in Settings > Tracking & Analytics > Tracking Code > Advanced Tracking. Filtered numbers look lower than other platforms. (Marketing emails only; nothing in the page states it applies to one-to-one sales emails or Gmail drafts the project lead sends himself.)
- **Mailchimp, "About open and click rates"** (read): bot activity such as MPP "can falsely inflate open and click metrics"; Mailchimp has a separate "About Bot Activity and Bot Filtering" article and lets you exclude MPP opens in reports (snippet: for emails sent on/after 22 Jun 2024 — not checked in the product).
- **Omeda, "Bot clicks in email" report** (read, vendor): rejects the popular "suppress anyone who clicks within 5 seconds" rule. Enterprise scanners also *re-scan days or weeks later*, causing delayed click spikes; and some real people click in 3 seconds on a phone. Their rules remove the click, not the subscriber: **two clicks within 2 s -> drop the offending click; 10+ clicks within 30 s -> drop all that recipient's clicks for that send; fake-click share above 50% -> selective removal**. Ten rules in total across behaviour, statistics and infrastructure.

## The rules we follow
1. **Never use opens as a decision metric.** Not for subject-line A/B winners, not for "engaged" segments, not for sunsetting (see list-hygiene skill: sunset on clicks/replies/purchases only), not as proof an institution read something.
2. **Primary metrics by channel:**
   - Newsletter (Mailchimp): bot-filtered clicks per delivered, unsubscribes, and Stripe/Gumroad sales on a coded link (UTM or /go/ path). Report MPP-excluded opens only as a trend line, labelled.
   - HubSpot marketing email: keep bot filtering ON; read the "without bots" numbers; never compare them with Mailchimp raw numbers.
   - Cold/first-contact mail to councils, universities, archives, museums, police, HMLR: **replies only** (and documents received). UK public bodies widely run Microsoft Defender Safe Links or Mimecast, so a "click" or "open" notification within seconds of send is almost always the scanner (Omeda/HubSpot behaviour above; the specific product at each body is not checked). the project lead sends these from Gmail himself, which tracks nothing, and that is fine.
3. **A/B tests:** only test things judged on clicks or sales (CTA wording, link placement, offer). A subject-line test judged on opens is void; if we must test subjects, judge on clicks per delivered with at least ~100 clicks per arm (see A/B skills in the index for the stats).
4. **Flag, don't punish:** run the click export through the helper below; drop bot clicks from the counts; never unsubscribe or tag someone as a bot from one fast click.
5. **Delayed spikes:** if a send shows a burst of clicks days later from one domain, check it against the rules before celebrating.

## Tool
`skills/tools/bot_click_flag.py` (stdlib, written this run, nothing installed). Input CSV with columns `email,url,timestamp` (ISO or `YYYY-MM-DD HH:MM:SS`), optional `send_time`. Applies Omeda's two published rules (2 clicks <2 s -> drop the second; 10+ clicks <30 s -> drop all of that recipient's clicks) plus "every link clicked within 60 s of send" as a scanner flag. Prints human vs flagged counts per URL. Usage:
`timeout -k 5 120 python3 skills/tools/bot_click_flag.py clicks.csv [--send "2026-11-01 09:00:00"]`

## How we apply it to Cedwyn
- Weekly growth report (the project workspace, growth-report RUNNER): report Mailchimp **clicks** (bot-filtered) and coded-link **sales**; drop open rate from the headline or label it "inflated by Apple Mail, trend only".
- ab-register.csv: any row whose winner was chosen on opens gets a note "void: open-based" — no re-run needed unless the change is still live.
- HubSpot hive drafts to institutions: never write "they opened it" in a task or changelog as evidence; the only evidence is a reply in Gmail.
- List hygiene / sunset: confirm the rule uses clicks, replies or purchases, never opens (most of the list is Gmail/Apple).
- Nothing here sends anything, costs nothing, and changes no live setting (HubSpot bot filtering is already on by default; leave it).

## Sources
- litmus.com
- knowledge.hubspot.com
- mailchimp.com
- omeda.com
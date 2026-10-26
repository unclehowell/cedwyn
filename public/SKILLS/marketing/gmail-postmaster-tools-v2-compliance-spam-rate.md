# Gmail Postmaster Tools v2: compliance status and spam rate for a tiny list
Harvested 2026-10-26 (skills harvest 19:52). Fits: email deliverability. Builds on cold-email-deliverability-uk-pecr.md (Gmail's sender rules) and does not repeat it; this file is the *monitoring* side for our own Mailchimp/Resend mail.

## What the tool is now (read on the sources below)
- Postmaster Tools (postmaster.google.com) shows how Gmail treats mail from a domain you verify. Version 2 is the live interface; the old v1 reputation dashboards (domain/IP reputation) are dropped in v2. Timeline from Folderly's 2026 guide (read): v2 API developer preview 2 Dec 2025, GA 3 Feb 2026, compliance-status verdict and domain/user methods GA 24 Jun 2026.
- **Compliance status** dashboard: one line per Gmail sender rule, each reading *Compliant*, *Needs work* or *No data found*. All senders: SPF-or-DKIM, forward+reverse DNS, message format, TLS, user-reported spam rate. Bulk senders (~5,000+/day to Gmail) add SPF+DKIM+DMARC alignment, one-click unsubscribe and honouring unsubscribes. *No data found* = not enough volume (Bluecore 2026, read).
- It reports on the **primary domain** using data from its subdomains (verify bucklerfamily.estate and you also see send.bucklerfamily.estate). DNS status reflects records *when the mail arrived*; a fix can take up to 7 days to show (rolling window) (Folderly, read).
- **Spam rate** = manual "Report spam" clicks / mail that reached the inbox, personal Gmail only, delayed, privacy-limited. Bands (Google guidelines via Suped, upd 22 May 2026, read): <0.10% target; 0.10-0.30% already harms placement; >0.30% = incident, and mitigation eligibility returns only after 7 straight days back under 0.3%. 0.1% = 1 complaint per 1,000 inboxed messages.
- **A 0.0% rate is not proof of health**: if Gmail is already filtering you to spam, fewer people can click "Report spam". Google's own troubleshooting names a rate that "suddenly changed to 0" (Folderly, read; Suped, read).
- **Feedback loop** dashboard: add a `Feedback-ID:` header (e.g. `campaign:list:mailchimp:cedwyn`) to see spam rate per campaign; IDs show only after a minimum number of reports (Gmail Help 14289100, read).
- Deliverability analysis reasons include "Message volume low" (Folderly, read): expected for us.

## How to do it (zero cost, ~15 min once)
1. Sign in at postmaster.google.com with the Google account that holds the business. Add domain -> copy the TXT (or CNAME) record -> add it in Cloudflare DNS -> Verify (usually instant, up to 10 min).
2. Check the sending identity first, outside Postmaster: run `python3 the project workspace <domain> <selector>` for every stream that sends From our domain (Resend selector `resend` on send.; Mailchimp selectors `k2`/`k3`).
3. Once a week (Sunday report): open Compliance status. Any *Needs work* line -> fix before the next campaign. *No data found* -> note "volume too low", do nothing else.
4. After any campaign over ~200 Gmail recipients: look at spam rate 2-3 days later. >0.1% -> stop broad sends, find the segment/import that changed, fix, resume small.
5. Pair with clicks and sales: if clicks collapse while spam rate reads 0.0%, treat it as a placement problem, not a clean bill.
6. Optional free API: `domains.getComplianceStatus` (v2) can feed a one-line weekly check later; not needed at our size.

## Live check on our domain (26 Oct 2026 19:55 UTC, dns_check.py, read-only)
- bucklerfamily.estate: SPF PASS (Cloudflare Email Routing), DMARC `p=none` PASS (meets the bulk floor), MX = Cloudflare.
- send.bucklerfamily.estate: SPF PASS; DKIM selector `resend` PASS on the apex lookup.
- **Mailchimp DKIM selectors k2/k3: no key on bucklerfamily.estate.** If Mailchimp campaigns go out From an @bucklerfamily.estate address, they are signed by Mailchimp's own domain, not ours, so DMARC alignment rests on nothing we control. Which From address the Mailchimp audience uses: not checked this run.
- Mailchimp audience = 1 member (marketing/weekly.csv, 25 Oct), so Postmaster will read *No data found* for months. That is fine; the value now is catching a *Needs work* line before the list grows.

## How we apply it to Cedwyn
- **Do now (no GO needed, no public change):** a bizdev or growth-report run adds the Postmaster TXT record and verifies the domain; adds Mailchimp's domain-authentication CNAMEs (k2/k3) only after checking that no other worker is editing DNS, and logs both in the project workspace If the Google login for Postmaster is not available to the browser, list it as a held owner-only item (do not ask today).
- Add one line to the Sunday growth report: "Postmaster: compliant / needs work (<rule>) / no data".
- Add `Feedback-ID` to Resend sends (code change in our own sender script; not an email journey).
- When the list passes ~200 Gmail addresses, start reading spam rate per campaign; first upsell or launch campaign gets a check 3 days after.
- Tightening DMARC from p=none to quarantine: only after 4 clean weeks with all streams aligned; PROPOSAL, because a wrong record can block our own mail.

## Sources
- support.google.com (Gmail Help: sender requirements and Postmaster Tools FAQ) - read
- suped.com (Matthew Whittaker, upd 22 May 2026, vendor) - read
- folderly.com (2026 guide: v2 timeline, compliance lines, API) - read
- bluecore.com (compliance table, "No data found") - read
- Our DNS: the project workspace run 26 Oct 2026
- No small-sender case study with numbers found; vendor thresholds above trace to Google's own guidelines.
# Getting into Microsoft 365 inboxes at UK institutions (councils, HMLR, police, universities, national bodies)

Harvested 2026-10-27 06:57Z. Topic: cold and first-contact email to UK public bodies, which mostly run Microsoft 365 / Exchange Online Protection (EOP), not Gmail. The Gmail Postmaster and cold-deliverability files cover Google; this one covers the Microsoft side.

## Live fact (checked 06:56Z today, DNS MX lookups)
- Seven of the nine target bodies checked take mail through Microsoft 365 (`*.mail.protection.outlook.com`): Vale of Glamorgan Council, HM Land Registry, South Wales Police, Cardiff University, gov.wales, The National Archives and the National Library of Wales.
- Cadw goes through a Welsh Government Azure gateway.
- The BBC goes through Broadcom MessageLabs.
- museum.wales returned no MX at the apex (not checked further).
- So for our institutional mail, Microsoft's filters and the recipient organisation's own Defender policy decide inbox, Junk or quarantine.

## What the primary sources say
1. **UK public sector must enforce DMARC on inbound mail.** GOV.UK "Securing government email" (CDDO, updated 4 Mar 2024) states public bodies "must ... implement spam and malware filtering, and enforce DMARC on inbound email". It also requires TLS 1.2+, MTA-STS, DMARC reporting, and PTR records on sending services. Consequence: mail whose From domain fails DMARC is junked or rejected by policy at these bodies, not just by Microsoft's general filters.
2. **Outlook.com high-volume rules (from 5 May 2025).** Microsoft Defender for Office 365 blog, "Strengthening Email Ecosystem: Outlook's New Requirements for High-Volume Senders":
   - senders of more than 5,000 messages a day to consumer Outlook/Hotmail/Live addresses must pass SPF, DKIM and DMARC (at least p=none, aligned);
   - failures are rejected with `550; 5.7.515 Access denied, sending domain ... does not meet the required authentication level`.
   - These rules are scoped to consumer domains. Corporate Microsoft 365 tenants apply their own policies on top (growleads.io 2026 practitioner write-up makes the same point).
3. **First-contact safety tip and "?" sender marks.** Microsoft Learn, anti-phishing policies (all cloud mailboxes):
   - The "first contact safety tip" banner appears when a recipient gets mail from a sender they don't usually hear from. Admins switch it on per policy.
   - Outlook adds a question mark to the sender photo when a message fails SPF/DKIM AND fails DMARC/composite authentication.
   - A "via" tag appears when the DKIM/MAIL FROM domain differs from the From domain.
   - A cold message to a records officer can therefore arrive carrying a warning banner even when it is delivered.
4. **Reading the verdict.** Microsoft Learn, "Spam confidence level":
   - in the cloud, SCL no longer decides the verdict on its own;
   - read `CAT` (what filtered it) and `DIR` in the `X-Forefront-Antispam-Report` header, plus `Authentication-Results` (spf/dkim/dmarc/compauth).
   - You only see these headers on mail a Microsoft 365 mailbox receives. Use a reply, or a test to an Outlook.com seed you own.
5. **Practitioner testimony, with the caveat.** Cold-email vendors' 2026 guides (Instantly, MailReach) give "healthy" inbox placement of 85-90%+ on seed tests and say to test Google and Microsoft separately. These are vendor figures, not checked against an independent panel. No UK public-sector placement figure was found.

## How-to (smallest set that matters)
1. **Send institutional mail from a mailbox whose domain passes DMARC with alignment.**
   - Today the project lead's case mail goes from his Gmail address. gmail.com publishes `p=none; sp=quarantine` (read 06:56Z), and Gmail signs its own mail, so it aligns.
   - Any move to a bucklerfamily.estate From address needs SPF + DKIM aligned for every service that sends as it (Mailchimp's DKIM was missing on 26 Oct, per gmail-postmaster-tools-v2-compliance-spam-rate.md). The domain's DMARC is `p=none` with no `rua` (read 06:56Z).
2. **One person, one message, plain text.** No tracking pixel, no link shortener, at most one or two links to our own domain, no attachments on first contact (attachments raise the risk of quarantine and the content inspection that comes with it). Refer to records by name and reference.
3. **Use the body's published address or form route,** e.g. the FOI address on its own site. Don't guess personal addresses: a bounce or a "recipient not found" hurts reputation.
4. **Low volume, steady pace.** Institutional threads are a handful a day. Never batch-send near-identical text to many bodies in one burst. Microsoft content filtering clusters similar messages.
5. **Check delivery, don't assume it.**
   - A reply or an auto-acknowledgement (most FOI inboxes send one) is proof of delivery.
   - With no acknowledgement within 2 working days, send ONE short follow-up in the same thread asking them to confirm receipt and check quarantine/Junk.
   - Then use the body's web form as a second route.
6. **If a 5.7.x bounce arrives,** keep the full NDR, check SPF/DKIM/DMARC alignment of the From domain, fix, then resend once. Don't rotate domains.
7. **Optional, free: Microsoft SNDS** (Smart Network Data Services) shows IP reputation only for IPs you control. It's of no use for Gmail or Mailchimp shared IPs, so skip it unless we run our own sending IP.

## How we apply it to Cedwyn
- **No change to the current sending route.** Case and FOI mail stays on the project lead's Gmail, drafted in HubSpot / Gmail drafts and sent by the project lead himself. This file adds checks, not sends.
- **Drafts engine and hive drafts (proposed):**
  - one link at most;
  - no attachments on first contact;
  - plain text;
  - add a line asking for an acknowledgement and reference number;
  - the follow-up rule in step 5 above, applied only by the project lead's own send.
- **Morning brief / email ingest (proposed):** flag any 5.7.x NDR from `*.outlook.com` or any council address at once (it means the body never got the email), and note FOI bodies with no auto-acknowledgement after 2 working days.
- **Before any Cedwyn-domain bulk or institutional mail (proposed, needs a DNS owner):**
  - Mailchimp domain auth (DKIM k2/k3);
  - add `rua=` to DMARC so we can see failures;
  - keep `p=none` until reports are clean for 4 weeks.
- **What only the project lead can supply:** whether any institutional mail is ever sent from a bucklerfamily.estate address. If none is, the DNS steps are only for Mailchimp newsletters.

## Sources
- gov.uk (read 06:55Z)
- gov.uk (read)
- techcommunity.microsoft.com (title and 5.7.515 wording via search snippet; page is script-rendered)
- learn.microsoft.com and .../anti-phishing-policies-eop-configure (read)
- learn.microsoft.com (read)
- growleads.io (read; practitioner, 2026)
- instantly.ai/blog/inbox-placement-testing/ and mailreach.co (vendor snippets, not checked)
- DNS MX/DMARC via Cloudflare DoH, 2026-10-27 06:56Z
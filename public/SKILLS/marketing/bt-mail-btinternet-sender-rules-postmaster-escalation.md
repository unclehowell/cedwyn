# BT Mail (btinternet.com) sender rules and the postmaster escalation runbook

Written 30 Oct 2026 by the skills harvest. Root suggested it. Already in the index: Outlook bulk-sender rules, inbox-placement seed tests (Validity 2026: Europe 91.1% IPR, BT Mail notable in UK), Mailchimp domain auth (problem P-029). This file is BT-specific: what BT asks of senders, how BT rejects, how to escalate.

## Why BT matters for us
BT Mail (@btinternet.com, @btopenworld.com, @talk21.com and the other legacy BT domains) is still one of the biggest UK consumer mailboxes. It is used heavily by older UK readers, the core local-history and genealogy audience. Validity's 2026 benchmark (already in the index) names BT among the UK providers to watch.

## What BT itself states (bt.com help, "BT Email delivery best practices", read 30 Oct 2026)
- **BT uses DMARC to block fake or suspicious emails.** Senders should publish SPF, sign with DKIM and publish DMARC.
- Separate marketing and transactional mail. Use a consistent From address.
- **List:** send at the frequency you promised, remove inactive/invalid addresses, include unsubscribe links, never send to people who didn't opt in.
- **Content:** no spam-like language or formatting, clear subject lines and sender details. Read BT's error messages and fix what they name.
- **System:** show the sender IP in headers, prevent unauthorised access, watch for unusual sending patterns. M3AAWG best practices are the reference.
- **Escalation:** if mail bounces, contact your provider, or write to **[address kept in the project workspace]**.
- BT publishes **no numeric thresholds** (no complaint-rate or volume figures, unlike Gmail/Yahoo's 0.3%).

## How BT rejects (practitioner sources, read)
- 550 = permanent rejection, 554 = policy/spam block. Mail can also "disappear" (accepted, never shown) with no feedback loop and no alerts. Shared ESP IP reputation is a common cause. (MailTester blog on btinternet.com. Their article is AI-assisted and its "40% higher chance" figure is attributed to Return Path and not checked.)
- Bounce rate under 1% is the working benchmark (same source, not checked).
- **Escalation runbook** (Suped, Michael Ko, updated 25 Oct 2026, read): BT gives **no response-time commitment**. A generic "please improve my inbox placement" request is weak. Send one short technical case: the full bounce text with SMTP code and timestamps, sending IPs and domains, SPF/DKIM/DMARC results, and what you already changed. If the mail goes through a shared ESP IP, ask the ESP to escalate in parallel. Suggested checkpoints (theirs, not BT targets): watch fresh samples for the first 7 business days, reply on the same thread with new evidence only at 7–10 days, and reassess with the ESP after 4 weeks. One day of acceptance does not prove recovery. Raise volume only after a sustained fall in BT bounces.

## Do this before any mail reaches a BT address
1. **Authenticate the sending domain fully.** SPF covering the ESP, DKIM signed with *our* domain (aligned), DMARC published. Move from p=none to p=quarantine only after 2–4 weeks of clean aggregate reports.
2. **Segment BT domains in the list** (btinternet.com, btopenworld.com, talk21.com, btclick.com etc.) and look at their bounces separately after each send.
3. **Send small first:** the first campaign's BT segment goes in the first batch. Check bounces within 24 h before the rest.
4. **Seed test once** (mail-tester / GlockApps free credits, see inbox-placement skill). Note that no free seed list includes BT, so BT results come only from real bounces.
5. **On a 550/554 from BT:** stop sending to BT, keep the full bounce text, fix the named cause, then send one technical email to [address kept in the project workspace] Log it as a problem in the project workspace, not to the project lead.

## Live baseline, 30 Oct 2026 (DNS over HTTPS, read-only)
- `bucklerfamily.estate` SPF: `v=spf1 include:_spf.mx.cloudflare.net ~all` (Cloudflare Email Routing only).
- DMARC: `v=DMARC1; p=none;` with no rua reporting address.
- Mailchimp DKIM CNAMEs `k1._domainkey` / `k2._domainkey`: **absent**.
- Result: a Mailchimp campaign "from" @bucklerfamily.estate fails DKIM alignment. Under p=none it is not rejected by policy, but BT ("uses DMARC to block fake or suspicious emails") and others have less reason to trust it. This is the same gap as P-029.

## How we apply it to Cedwyn
- **No sending is planned** (outreach and press on HOLD). These are pre-send gates for the first Mailchimp campaign and any READY hive draft that the project lead sends himself.
- **Gate 1 (the project lead's DNS or his GO):** add the Mailchimp k1/k2 DKIM CNAMEs (Mailchimp > Domains > Authenticate). Add `rua=mailto:<a mailbox we read>` to DMARC so aggregate reports arrive. Keep p=none until two clean weeks. This rides P-029; don't open a duplicate problem.
- **Gate 2:** list segment "BT domains" in Mailchimp (email domain contains bt / talk21). First campaign: BT segment in the first 10%, bounces checked at 24 h.
- **Gate 3:** institution mail (archives, councils) goes from the project lead's own Gmail. Gmail's own authentication covers it, and the BT rules above only matter for bulk sends.
- **If BT bounces:** prepare the [address kept in the project workspace] case as a draft for the project lead (HubSpot draft task), never sent by us.

## Sources
- bt.com
- suped.com
- mailtester.com
- m3aawg.org (M3AAWG best practices, referenced by BT; not read today)
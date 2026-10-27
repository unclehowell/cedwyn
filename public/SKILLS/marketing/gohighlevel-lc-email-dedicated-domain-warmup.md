# GoHighLevel email: dedicated sending subdomain, DNS, warm-up, list hygiene (LC Email)

Harvested 2026-10-27 (skills harvest). Companion to gohighlevel-crm-architecture-solo-creator-stripe-imports.md. Use it the day the project lead's GHL sub-account "Cedwyn" exists.

## What HighLevel's own help centre states (read 27 Oct 2026)
- **Shared vs dedicated.** By default GHL mail shows "sent via" HighLevel's servers. HighLevel: "Not having a dedicated email sending domain often results in emails going to spam despite good practices." A dedicated sending domain is a subdomain you add under Settings > Email Services > Dedicated Domain and IP. It's free on LC Email. Different subdomains can be assigned to 1-to-1, workflow, marketing and invoice mail. DNS can take up to 24 h. **"Multiple DKIM records for the same domain are not supported."**
- **Warm-up (fixed-stage model).** It starts automatically when a new dedicated domain is verified. 15 stages: 1,000 / 2,500 / 5,000 / 6,500 / 8,000 / 10,000 / 14,000 / 20,000 / ... / 250,000 a day. You move up only by **hitting the full daily limit** of a stage. Missed days pause progress but don't reset it. Stage-1 guidance is at most 100/hour and 1,000/day. The guide adds: "Only send to opted-in contacts... **cold emailing during warm-up tends to harm deliverability**". It also states don't use public link shorteners.
- **Hygiene rules in the same guide:**
  - DMARC is required (they show `p=reject`).
  - The From address must be on the same organisational domain as the sending subdomain. `mail.x.com` can send as `[address kept in the project workspace]`, but never as a different brand.
  - Use a footer unsubscribe link and double opt-in.
  - Cadence: new opt-ins daily for a short window. No engagement after 1-2 weeks, drop to weekly. No engagement after 2+ months of weekly sends, stop. "It is always better to undersend than to oversend."
  - Check new templates with mail-tester.com and MX Toolbox first.
  - A domain already damaged: "better to set up a new sub-domain than to try to repair a damaged one."
- **Paid add-ons (don't use; zero-spend rule):**
  - Dedicated IP is $59/month. HighLevel recommends it only around 200,000+ emails a week.
  - Email validation is $2.50 per 1,000.

## The arithmetic for a small sender
Our list is in the hundreds, so the domain will **sit at stage 1 for good**, because progression needs 1,000 sends in a day. That's fine. Stage 1 doesn't block sending. Nothing about warm-up changes how a 300-person newsletter is delivered. What matters is steady, wanted mail: same weekday, low complaints, prompt removal of non-engagers.

## How to do it (once the sub-account exists)
1. **Pick a subdomain nobody else signs.** Mailchimp already authenticates its own DKIM on bucklerfamily.estate. A separate subdomain avoids the one-DKIM-per-domain clash and keeps reputations apart. Suggested: `news.bucklerfamily.estate` for marketing and workflows. Nothing for 1:1 mail: replies keep coming from the project lead's Gmail.
2. **Add DNS in the connected Cloudflare.** Use the exact records GHL shows (SPF include, DKIM, MX/return-path, tracking CNAME). Keep the tracking CNAME **DNS-only (grey cloud)**, because proxied CNAMEs break verification. Verify in GHL.
3. **DMARC: tighten the policy in stages, don't jump to p=reject.** The live record (read 27 Oct 11:40Z via DNS-over-HTTPS) is `_dmarc.bucklerfamily.estate TXT "v=DMARC1; p=none;"`, with no `rua` reporting address.
   - Add a `rua` to Tab's mailbox or a free DMARC report inbox.
   - Read two weeks of reports.
   - Move to `p=quarantine; pct=25`, then raise pct to 100.
   - Go to `p=reject` only when Mailchimp, GHL and any website forms all pass alignment.
   - GHL's own example shows `p=reject` from day one. That's safe for a fresh brand, risky on a domain that already sends from several services.
4. **From address:** `[address kept in the project workspace]` or `[address kept in the project workspace]`. It must be a real inbox, routed through Cloudflare Email Routing to a monitored address. Never a gmail.com From through GHL: that breaks DMARC alignment.
5. **Footer:** the GHL default unsubscribe link, plus the PECR line and the business postal identity. Import the suppression list as `DND` (tools/ghl_csv_check.py checks the column).
6. **First sends go to the warmest people only.** That means e-book buyers, academy members and confirmed Mailchimp subscribers, in small daily batches using drip mode. Test each template with mail-tester.com first and aim for 9/10 or better.
7. **Connect Google Postmaster Tools** for the subdomain (TXT verify). See gmail-postmaster-tools-v2-compliance-spam-rate.md: keep the spam rate under 0.1% and never reach 0.3%.
8. **Prune non-engagers** on the GHL cadence above. Hold out a small segment before calling any workflow a win (email-holdout-incrementality-test-small-list-gate.md).

## How we apply it to Cedwyn
- Tie this to the GHL HANDOFF (the project workspace). After the project lead creates the account, step 1 of "what we run" is the `news.` subdomain plus DNS. Only then come workflow emails (thank-you, then the academy upsell after 3 days).
- **No cold or B2B mail through GHL.** The parcels companies stay on 1:1 Gmail follow-ups (cold-email-follow-up-cadence-small-uk-b2b-list.md). GHL's own guide states cold mail during warm-up hurts the domain, and that would hurt buyer receipts and academy mail too.
- Keep Mailchimp as the newsletter until GHL proves deliverability over 2-4 weeks. Don't run two newsletters to the same people.
- Zero spend: no dedicated IP and no paid validation. The list is small and already syntax-checked.
- The DMARC change touches the apex domain's mail. Propose it to the root before editing DNS, since it affects other senders on bucklerfamily.estate.

## Sources
- help.gohighlevel.com
- help.gohighlevel.com
- help.gohighlevel.com
- Live DNS read: cloudflare-dns.com (27 Oct 2026 11:40Z)
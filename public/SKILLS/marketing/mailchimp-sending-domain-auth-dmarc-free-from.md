# Mailchimp sending domain: authenticate it, move off a free From address, DMARC to enforcement

Date: 2026-10-26 (skills harvest 21:11). Read-only checks only; every DNS or Mailchimp change below is a PROPOSAL.

## Why it matters (sources read)
- Mailchimp help, "About Email Domain Authentication": authentication = 2 CNAME records (DKIM) + 1 TXT (DMARC); domain *verification* alone does not change delivery. Mailchimp's own in-app banner warns unauthenticated senders "Emails from your domain may miss 74% of inboxes" (Mailchimp's figure, not checked). Gmail and Yahoo require custom authentication + a published DMARC record above 5,000 messages/24 h.
- Mailchimp help, "Limitations of Free Email Addresses": a gmail.com From address cannot be verified or authenticated, is not BIMI-compatible, and Mailchimp rewrites the From address on each send so it survives the free provider's DMARC. Readers in Gmail/Outlook then see "sent via Mailchimp"-style indications (Mailchimp help, "My Email From Name Shows mailchimpapp.net or mcsv.net"). Mailchimp "strongly recommends" a From address on your own domain.
- Microsoft (Defender for Office 365 blog, Apr 2025, read via search snippet; full page needs JavaScript): from 5 May 2025 Outlook.com routes mail from non-compliant domains sending 5,000+/day to Junk; requirement = SPF, DKIM and DMARC (at least p=none, aligned with SPF or DKIM). We are far below 5,000/day, but UK institutions and many readers use Microsoft mailboxes, so the same three records are the cheap insurance.
- Signet (Ian Bussieres, 20 Apr 2026 guide): through Mailchimp, SPF passes for Mailchimp's own bounce domain, so SPF *alignment* with your domain is impossible; DMARC passes on DKIM alignment alone, so the two DKIM CNAMEs must be exact (use the values Mailchimp shows; never paste a TXT key where a CNAME belongs). Rollout: p=none + rua reports 2-4 weeks -> p=quarantine; pct=25 -> pct 100 -> p=reject. EasyDMARC 2026 report (via Signet): only 10.7% of 1.8M domains enforce reject (not checked). Verify in Gmail: Show original -> SPF PASS, DKIM PASS aligned, DMARC PASS.
- Signet sells BIMI/VMC; that part is a vendor pitch (paid trademark certificate) - skip it, zero spend.

## Read-only check done now (Cloudflare DNS-over-HTTPS, 26 Oct 21:13 GMT)
- `_dmarc.bucklerfamily.estate` TXT = `v=DMARC1; p=none;` - published, but no `rua` reporting address, so nobody sees failures.
- `bucklerfamily.estate` TXT SPF = `v=spf1 include:_spf.mx.cloudflare.net ~all` (Cloudflare email routing only; fine, Mailchimp relies on DKIM).
- `k2._domainkey` / `k3._domainkey.bucklerfamily.estate` CNAME: none found. Mailchimp's exact selector names vary per account, so "not authenticated" is likely but **not checked** in the Mailchimp dashboard.
- Which From address the Mailchimp audience uses: **not checked** (if it is a gmail.com address, it is being rewritten on every send).
- gmail.com's own DMARC: `p=none; sp=quarantine` (read now) - Yahoo/AOL From addresses fail harder.

## How-to (30 minutes, one sitting)
1. Mailchimp -> Website/Domains: note the From address on each audience and automation. Read-only.
2. Pick one own-domain address that receives mail (Cloudflare email routing can forward it to the owner's inbox), e.g. a books@ or hello@ on the Cedwyn domain. Verify it in Mailchimp (click the link Mailchimp emails).
3. Authenticate: add the two DKIM CNAMEs exactly as shown (Cloudflare DNS, proxy OFF / DNS-only for CNAMEs). Prefer manual records over the Entri auto-connect so nothing else in the zone is touched.
4. Change DMARC to `v=DMARC1; p=none; rua=mailto:<a monitored address>` for 2-4 weeks; then quarantine pct=25 -> 100. Never jump to reject while other senders (Gmail-as-alias, Stripe receipts, HubSpot) use the domain unaudited.
5. Switch every audience/automation From address to the new one; keep the same From *name* readers know.
6. Test: send to a Gmail and an Outlook.com test inbox; Show original / message headers must read DKIM=pass with header.d = our domain, DMARC=pass.
7. Log the before/after in the growth report; watch Postmaster Tools (separate skill file) once volume allows data.

## How we apply it to Cedwyn
- Now, no GO needed: the read-only DNS read above; open Mailchimp (connected app) read-only to record the current From address and authentication status.
- PROPOSAL for the owner's GO (DNS + Mailchimp settings change, affects every send): steps 2-6 on the Cedwyn/bucklerfamily.estate domain; add `rua`; keep p=none until reports show only Mailchimp + known senders. Rollback = delete the two CNAMEs and restore the old From.
- Do not touch the Cloudflare redirect rules or the email-routing MX records while doing this.
- Success measure: Gmail/Outlook headers DMARC=pass aligned; no "via mailchimpapp.net" line; inbox (not Junk) on the Outlook test.

## Sources
- mailchimp.com
- mailchimp.com
- mailchimp.com
- techcommunity.microsoft.com (snippet)
- withsignet.com
# Virgin Media mailbox closure (Junara/Atmail) + Sky Yahoo Mail: UK consumer-ISP sender rules, 2026

Harvested 30 Oct 2026. Companion to bt-mail-btinternet-sender-rules-postmaster-escalation.md (BT) and outlook-bulk-sender rules.

## What changed (primary sources, read today)
- **Virgin Media is leaving email.** On 9 Sep 2026 Virgin Media O2 announced it is handing its mailboxes to Junara, a provider owned by Atmail (VMO2 newsroom; The Register, 9 Sep 2026). It affects **ntlworld.com, blueyonder.co.uk, virgin.net and virginmedia.com**. No new VM addresses since 2022.
- **The clock:** customers are contacted in phases from September. They get at least **45 days** from first notice to move to Junara, export, or close. Then a **120-day** recovery window. After **165 days** the account is **permanently deleted** (VMO2 newsroom).
- **Cost:** current VM customers get 12 months free after a **99p** transfer fee (18 months if registered for extra support). Former customers pay from the start (VMO2). emailexpert (18 Sep 2026) expects attrition in two waves: from **late October 2026** as the first 45-day windows end, and a year later when free periods end. ISPreview's comparison (Manx Telecom users paid £6.50/month after a similar move) is second-hand, not checked.
- **The MX has already moved.** Live DNS read 30 Oct 2026 (Cloudflare DoH): MX for all four VM domains is `mx-10/mx-20.eu-west.atmailcloud.com`. DMARC: virginmedia.com is `p=reject`; ntlworld/blueyonder/virgin.net are `p=quarantine; sp=reject`. Mail to these addresses is now filtered by Atmail. Assume no reputation carries over. No postmaster page or feedback loop has been published (emailexpert).
- **Bounces are unknown.** VM hasn't said whether mail to an account in the 120-day window is rejected or accepted and held. If it's held, the first hard bounces arrive only around late Feb 2027. Until then, falling opens/clicks on those four domains are the only warning.
- **Phishing wariness:** VM's own notices carry no clickable sign-up links because it expects them to be imitated. These users are being told to distrust "update your email" mails (emailexpert).
- **Sky:** Sky Yahoo Mail can no longer be opened (sky.com help). Live MX for sky.com is `mx-eu.mail.am0.yahoodns.net`, so **Yahoo's sender rules apply**. sky.com DMARC is `p=reject; adkim=s; aspf=s`.
- **Yahoo rules** (senders.yahooinc.com, read): all senders need SPF or DKIM, spam rate under 0.3%, valid forward/reverse DNS, RFC 5321/5322. Bulk senders need SPF and DKIM, plus DMARC at least p=none that passes with From aligned (relaxed is fine). A rua is "strongly recommended". They also need one-click List-Unsubscribe (RFC 8058 POST recommended), a visible unsubscribe link, unsubscribes honoured within 2 days, and no daily mail on a weekly list's opt-in. Spam rate is counted on inbox-delivered mail only.
- **BT** (for completeness, live 30 Oct): btinternet.com MX is `mx.bt.prod.cloud.openwave.ai`, DMARC p=reject.

## How-to (any UK B2C list)
1. **Segment by domain.** Tag subscribers on the four VM domains, plus sky.com, btinternet.com, talktalk.net. Count them before deciding any of this matters.
2. **Ask VM subscribers to confirm or update their address now**, while the mailbox still works. Send one plain, link-light message from your usual From domain. The only link goes to your own preference/update page on your own domain. Never say "your account will be closed"; that's VM's message, not yours.
3. **Watch the segment, not the list.** After each send, compare opens/clicks/bounces for the VM segment against the rest. Two sends with no engagement from a VM address after 1 Nov 2026 → move it to a "re-confirm" segment and stop mailing it. A 5.1.1 "user unknown" → remove at once.
4. **Sky = Yahoo.** Meet the Yahoo bulk rules (above). Watch complaints, not just bounces. Yahoo enforces at 0.3%, and emaillabs reports Yahoo recommending staying under 0.1% (not checked against Yahoo).
5. **Don't mail from a free From address** to strict-DMARC domains. sky.com and btinternet.com both publish p=reject, and a forged or unaligned From is refused (550 5.7.26 pattern).

## How we apply it to Cedwyn
- Outreach and press are on HOLD, and **nothing here sends anything**. These are pre-send gates for the Mailchimp list (free-chapter signups) and any later newsletter.
- **Gate 1 (read-only, next growth or bizdev run):** count Mailchimp audience members by domain, counts only, no addresses copied. If any VM-domain members exist, draft (HubSpot/Mailchimp draft only) a short "Is this still the best address for your Great House Farm chapters?" note. It should be neutral, link only to the cedwyn.bucklerfamily.estate signup/preference page, and send on the project lead's GO. A local grep on 30 Oct found 1 virgin.net address, in a directory crawl and not the list, so it doesn't count as a subscriber.
- **Gate 2:** Cedwyn's own sending domain (`_dmarc.bucklerfamily.estate` = `p=none`, no rua; Mailchimp DKIM absent = problem P-029) meets Yahoo's bulk bar only once DKIM CNAMEs and a rua exist. See dmarc-aggregate-reports-stdlib-parser-cloudflare.md for the rua route. Decision stays with the project lead (DNS change).
- **Gate 3:** in the Sunday growth report, add one line for "VM-domain subscribers: N, engaged since 1 Nov: M" once Gate 1 has run.
- Never use VM's closure wording publicly, and never imply Virgin Media or Sky did anything wrong.

## Sources
- news.virginmediao2.co.uk (read)
- theregister.com (read)
- emailexpert.com (read, trade press analysis)
- senders.yahooinc.com (read)
- sky.com (snippet: no new Sky Yahoo accounts)
- Live DNS (cloudflare-dns.com DoH, 30 Oct 2026 ~13:26Z): MX + _dmarc for sky.com, virginmedia.com, ntlworld.com, blueyonder.co.uk, virgin.net, btinternet.com, bucklerfamily.estate
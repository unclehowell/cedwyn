# Skill: Cold email deliverability + UK PECR for institutional outreach (2026)
Written 26 Oct 2026 by the project lead's Tab agent (skills harvest). Topic: getting story emails to UK institutions into the inbox, legally.

## What the evidence shows
- Google's own sender rules (support.google.com, read 26 Oct 2026): every sender needs SPF or DKIM, valid PTR, TLS, and a Postmaster spam rate **below 0.3%**. Senders of 5,000+/day to Gmail also need SPF **and** DKIM **and** DMARC with From-domain alignment, plus **one-click unsubscribe** (headers `List-Unsubscribe: ...` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click`) and a visible unsubscribe link in the body. We are far below 5,000/day, but meeting the bulk rules anyway costs nothing and protects the domain.
- AJ Cassata, "Cold Email Deliverability 2026: The New Rules (5M+ Sends)" (LinkedIn article, 2026): ceiling is **20-30 emails per inbox per day** (they run 10-20); **bounce rate under 2%** is healthy, over 2% means a dirty list; Gmail now shows a warning banner on emails carrying **open-tracking pixels**, so they keep open tracking OFF except the first day or two of a new campaign (a ~5% open rate on day one = landing in spam); the real health metric is **reply rate per inbox**; check Google Postmaster Tools weekly (a High->Medium reputation drop gives ~48 h to find the cause); seed-test your own Gmail/Outlook/Yahoo inboxes weekly; content: plain text, **under ~100 words**.
- Unify GTM, "Cold Email in 2026: Domains, Deliverability, Replies" (unifygtm.com, 2026): average cold reply rate **3.43%**; SPF/DKIM/DMARC are table stakes.
- ICO, "Business-to-business marketing" guidance (ico.org.uk, read 26 Oct 2026; flagged as under review after the Data (Use and Access) Act): unsolicited marketing email to **corporate subscribers** (companies, LLPs, corporation soles, some government bodies, any body corporate) is allowed under PECR with identification and an opt-out. **Sole traders, ordinary (non-LLP) English/Welsh partnerships and other unincorporated bodies of individuals are "individual subscribers"**: email marketing needs consent or the soft opt-in. UK GDPR still applies to named staff (e.g. firstname.lastname@): be transparent, honour objections absolutely.

## How-to (checklist per send day)
1. Run `python3 the project workspace bucklerfamily.estate resend` - all PASS before sending. (26 Oct 2026 result: SPF on root + send. subdomain, DKIM `resend` key present, DMARC `p=none`, MX Cloudflare.) After 2-4 clean weeks move DMARC to `p=quarantine` with an `rua=` report address.
2. Classify each prospect's legal form before it enters the send list: university, council, national museum, company, CIO/charitable company = corporate -> may email. **Local history society / club / friends-group that is an unincorporated association = individual subscriber -> needs consent -> HubSpot draft + needs-consent.csv.** Check the Charity Commission / Companies House entry; if unsure, treat as consent-needed.
3. Prefer role addresses (info@, enquiries@, archives@) over named personal work addresses; it reduces GDPR friction and bounce risk.
4. Volume: <= 20/day per sending address in week 1, ramp ~+10/day per week if bounces < 2% and no spam complaints; never above ~30/day from one address.
5. Every email: one-click List-Unsubscribe headers, visible unsubscribe link, who it is from + postal identity line, one link only, no attachments, no images-only body, plain-text part present. Keep the first-touch body short (aim < 120 words).
6. Open tracking: on only for the first batch to sanity-check placement, then off; judge by replies, clicks to the UTM link, bounces.
7. Verify addresses (MX lookup at least) before sending; drop any that hard-bounce into suppression immediately.
8. Weekly: seed test to our own Gmail + Outlook addresses; register bucklerfamily.estate in Google Postmaster Tools (needs a DNS TXT verification - doable by us via Cloudflare).

## How we apply it to Cedwyn
- Outreach engine (the project workspace) sends from [address kept in the project workspace] via Resend: steps 1, 4, 5 and 7 are mandatory gates in RUNNER.md.
- **Action for the outreach worker:** re-check prospects.csv for local history societies - many are unincorporated associations and must move to needs-consent.csv, not the send list.
- Target metrics: bounce < 2%, complaints 0, replies >= 3% (industry average 3.43%), and clicks on the deep link per variant in ab.csv.

## Sources
- support.google.com
- linkedin.com
- unifygtm.com
- ico.org.uk
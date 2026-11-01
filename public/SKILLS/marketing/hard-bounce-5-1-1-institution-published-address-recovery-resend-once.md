# Hard bounce from an institution (550 5.1.1): recover the published address, then resend once

Topic: what to do when outreach to a UK public body bounces with "address not found". The answer is to find the address the body publishes now, and to never guess one. Written 31 Oct 2026 after the Cabinet Office email (sent 31 Oct) bounced "address not found".

## The evidence (read 31 Oct 2026)
- What the code means. 5.1.1 is "Bad destination mailbox address" (Microsoft Learn, Exchange Online NDR reference, read). The causes it lists:
  - the sender entered the address wrong;
  - the address does not exist on the destination system;
  - the mailbox moved and a cached address went stale.
  The fix it gives: check the address and send again. Palisade's SMTP reference, from a search snippet: "permanent ... the classic user unknown bounce". A 5.x.x code is permanent, so retrying the same address is pointless and counts against sender reputation.
- Addresses go stale fast. HubSpot (read) puts email database decay at about 22.5% a year, citing MarketingSherpa's B2B figure of 2.1% a month. Vendor roundups from search snippets give 22.5-70% a year (marked: vendor figures, not checked). An address copied from an old letter, a PDF or a past thread is the likeliest to be dead.
- How the people who maintain a 46,000-body address book find addresses. WhatDoTheyKnow (mySociety, blog 26 Sep 2022, read) gives this order:
  1. the authority's own website, looking for a dedicated FOI contact email;
  2. the contact page;
  3. the homepage footer;
  4. the FOI policy or publication scheme;
  5. sometimes the privacy policy.
  Its home page (search snippet) states the address database is "kept up to date by a team of staff and volunteers". WhatDoTheyKnow also tells requesters not to ask a body for email addresses inside a request.
- The worked example. gov.uk "Contact the Cabinet Office" (read 31 Oct 2026) states: "Do not use this form to submit a Freedom of Information request. Contact the Freedom of Information team instead at [address kept in the project workspace]", or by post to FOI Team, Cabinet Office, Room G39, 1 Horse Guards Road, London SW1A 2HQ. The organisation page (search snippet) also lists [address kept in the project workspace] for a subject access request (SAR). So the right address depends on the type of request: FOI and SAR go to different places, and general correspondence goes through a web form.

## The playbook
1. Read the bounce, not the subject line. 5.x.x is permanent, so stop. 4.x.x is temporary: the server retries on its own, so do not resend by hand.
2. Diff the address. Compare it against the one in our CRM or draft, letter by letter. Look for a typo, an old department domain (.gsi.gov.uk retired), or a personal mailbox where a team mailbox should be.
3. Find the published address in this order:
   - the body's own site: its FOI, SAR or contact page, footer, publication scheme or privacy notice;
   - for central government, gov.uk's "Contact the <dept>" guidance page;
   - WhatDoTheyKnow's body page, as a cross-check only. Never send through WhatDoTheyKnow unless that is the chosen route, because the request then becomes public.
4. Match the address to the request type: FOI address for FOI, SAR address for personal data, the form for general correspondence. A form that states "do not use for FOI" means exactly that.
5. Record it with proof: the address, the page URL, the date read, and an archive.org capture if one exists. Store it on the CRM contact, so the next draft cannot reuse the dead one.
6. Resend once, as a fresh email. Use the corrected text, one line noting that it is a resend because the earlier email to <old address> was undeliverable on <date>, and the same reference. This is not a chase: the statutory clock starts on receipt, which is now.
7. Sweep for the same dead address everywhere: drafts, templates, contacts.json, other queued tasks. Fix every copy.

## How we apply it to Cedwyn (proposals only; nothing sent)
- Cabinet Office: the published FOI address is [address kept in the project workspace] (gov.uk, read 31 Oct 2026). Use [address kept in the project workspace] only if the request is for the project lead's own personal data. The TWO MONDAY DRAFTS worker is already drafting the resend for the hive. This file gives it the address and its source; it must still check the address against its own gov.uk read.
- Add a bounce rule to the email-ingest classifier (AUTO/PROCEDURAL already hides bounces from the dartboard). Each 5.1.1 also opens a HubSpot task "[BOUNCE] <org>: find published address" and is never auto-resent. PROPOSED.
- The contacts flywheel's "verified public address" step: require a source URL and a read date for each address, and re-read it if the address is older than about 6 months (decay of about 2% a month). PROPOSED.
- Never put a guessed address ([address kept in the project workspace]) into a draft. Use only published team mailboxes, under the never-contact-private-individuals rule.

## Sources
- learn.microsoft.com (5.1.1; read)
- palisade.email (search snippet)
- hubspot.com (22.5%/yr, 2.1%/mo MarketingSherpa; read)
- mysociety.org (read)
- whatdotheyknow.com (search snippet)
- gov.uk (read 31 Oct 2026)
- gov.uk (search snippet: FOI + SAR addresses)
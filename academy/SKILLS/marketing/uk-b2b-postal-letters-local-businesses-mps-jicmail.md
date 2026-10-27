# B2B letters by post to local businesses (the lawful route for "phone-only" lists)

Read 27 Oct 2026. Use when a business has no lawful email route (sole traders, partnerships) or no email at all, and before cold calling.

## Why post
- **PECR does not cover post.** ICO B2B marketing page (read today): the consent table lists "Post: not covered by PECR". ICO "Plan direct marketing" page: "Direct marketing by post is not covered by PECR. But you must still comply with data protection law."
- **No personal data if no name.** ICO B2B page: if you don't know the name of the person you write to, "you are not processing personal data and the UK GDPR does not apply", e.g. post addressed "to 'the IT department'". So a letter to "The Manager, <Business name>" sits outside UK GDPR. A letter to a named sole trader is personal data: you need a lawful basis (legitimate interests; ICO guidance updated 23 Mar 2026 after the Data (Use and Access) Act calls it "the most flexible lawful basis", DMA article 1 Apr 2026) plus a suppression list and an objection process.
- **MPS.** ICO: "You should check names and addresses against the Mailing Preference Service (MPS)". It's not statutory, but the DMA Code requires it. MPS's own site: it "won't block ... mail addressed to 'The Occupier'", and registration takes up to 3 months to take full effect.
- **Attention.** JICMAIL Q2 2025 (UK panel, read): Business Mail is kept **8.7 days**, gets **4.9 interactions**, **186 seconds** of attention, and reaches 1.16 people per item. Across all mail, 76.5% was read or glanced at, **9.2% prompted a website visit** (five-year high) and 5.3% prompted a purchase. Door drops get 60 s and partially addressed mail 86 s, so a properly addressed letter beats a leaflet.
- **Cost.** Royal Mail 2nd Class letter 91p (88p with Mailmark franking) from 7 Apr 2026, per Pitney Bowes and Mailcoms (Royal Mail price page not read). 88 letters is about £80 in stamps plus print. It's **spend, so it needs the project lead's GO**.

## How to do it (checklist)
1. **List hygiene:** for each business, record the source and the date the address was checked, whether the address is a company or a named individual, and the suppression list (anyone who objected by any channel, plus our own do-not-contact list, and nobody already in research correspondence).
2. **Address line:** use the role, not a name, unless a named person is the only route: "The Owner / The Manager, <Business>, <address>". This keeps company letters outside UK GDPR. For named sole traders, screen against MPS first (MPS screening is sold through licensed bureaux; free self-check is not offered, not checked), or address the business name only.
3. **Letter:** one page, A4, plain. In order:
   - who is writing and why this area;
   - the concern in one sentence ("a concern, not a finding");
   - what it does NOT say (nothing about their own title);
   - one short URL **plus a QR code** with `utm_source=letter&utm_medium=post&utm_campaign=<name>` (see qr-codes-print-placement-own-redirects-honest-counts.md);
   - how to reply;
   - the opt-out line: "If you'd rather not hear from us again, tell us by <email/post> and we won't write again".
   - the sender's name and a return postal address (a PO box or business address is fine). No threats, no deadlines, no demands.
4. **Measure:** use a unique QR/UTM per batch. JICMAIL's 9.2% web-visit rate is a panel average across all mail, not a forecast; on a cold 88-letter batch, 2–5 visits would be a normal result (our estimate, not checked).
5. **Log:** in the HubSpot ticklist, set route = post, the date posted and the outcome. Any objection goes onto the suppression list the same day, across ALL channels.
6. **Follow-up:** one letter only. Never follow up by email unless they gave an email and asked; never call a number until it has been TPS/CTPS-screened (see uk-b2b-cold-calling-tps-ctps-permission-opener.md).

## How we apply it to Cedwyn (parcels campaign)
- The 88 phone-only businesses in Llandough/Leckwith are the natural letter list. Post needs no TPS check and no PECR consent; a role-addressed letter needs no MPS check either.
- Use the approved email copy as the letter body (same "concern, not a finding" wording, same opt-out). Swap the links for **cedwyn.bucklerfamily.estate/parcels/** printed short, plus a QR code to `/parcels/?utm_source=letter&utm_medium=post&utm_campaign=parcels`.
- Sign-off in the letter is "the project lead's" (as in the email). The public page still never names him.
- **Needs the project lead:** a GO on about £80–£100 (stamps + print), a return address he's happy to print (not the family address if he'd rather not), and whether he posts them himself or uses a print-and-post service. A letter does not replace the 5 pm phone plan; it's the lawful channel for numbers that fail the TPS/CTPS screen.
- Proposed tool step (no install): a mail-merge from businesses.csv to a print PDF, one letter per page with the QR code, using the box's existing PIL. Build it only on GO.

## Sources (read 27 Oct 2026)
- ICO, Business-to-business marketing: ico.org.uk
- ICO, Plan direct marketing (post + MPS): ico.org.uk
- DMA, ICO legitimate interests update (1 Apr 2026): dma.org.uk
- MPS: mpsonline.org.uk
- JICMAIL Q2 2025: jicmail.org.uk
- Stamp price (secondary): pitneybowes.com , mailcoms.co.uk
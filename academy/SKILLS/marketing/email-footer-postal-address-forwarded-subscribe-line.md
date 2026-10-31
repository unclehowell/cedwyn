# Email footer: a postal address that isn't a home, plus a "Forwarded to you? Subscribe" line

Harvested 2026-10-31. Topic: the footer of every newsletter and nurture email. Two jobs: meet the address rules without exposing a private home, and turn forwarded copies into signups without letting a stranger unsubscribe the original reader.

## The rules (primary sources, read 31 Oct 2026)

| Source | What it requires |
|---|---|
| Mailchimp anti-spam requirements (help article) | Every promotional email carries your contact details, "including a physical mailing address or P.O. Box where you can receive mail". Mailchimp applies US CAN-SPAM to all senders, even outside the US. |
| Mailchimp "Customize your footer content" | The merge-tag table adds: if you skip the address merge tag, type "your physical address (not a post office box)" in the footer. The two help pages disagree on PO boxes. The merge tag itself is the safe route: it prints whatever address is saved in the audience settings. |
| Mailchimp "Alternative physical address ideas" | For people working from home: a business manager's or agent's PO box, a studio or rehearsal space, a teaching venue, a gallery or shop that takes your mail. "Sometimes the only answer is to purchase a P.O. Box." The address must be valid and able to receive mail. |
| ICO, PECR electronic mail rules | Do not disguise or hide your identity. Give a valid contact address for opt-out. This applies to solicited and unsolicited mail alike. PECR does not demand a street address, but Mailchimp's terms do. |
| Electronic Commerce Regulations 2002, reg. 6(1)(b) | A business providing an online service must make "the geographic address at which the service provider is established" easily available. A company's registered office meets this, and it is already public on Companies House. |
| Mailchimp "About forwarded campaigns and unsubscribes" | The unsubscribe link belongs to the original recipient. If someone forwards with their mail app's Forward button and the friend clicks Unsubscribe, the original reader is removed. Mailchimp's fix: print the recipient's address (the EMAIL merge tag) next to the unsubscribe link so the friend sees whose address it is. |

Practitioner testimony: r/selfpublish thread "Wait...what? You have to use a real address for your newsletter" (2025): authors suggest PO boxes and virtual addresses. An author-marketing account on Threads lists "your mailing address (PO box is fine!)" first of three footer must-haves. These are community voices, not rulings.

Cost of a home-free address (UK, not checked against Royal Mail, whose page blocks scripts): a 2026 reseller table lists Royal Mail PO Box Collect at GBP 347 a year. A search snippet from royalmail.com shows GBP 416.40 for 12 months on a delivery plan. A company's own registered office costs nothing extra.

## The "Forwarded to you?" line

- **Pattern:** one line at the top or bottom: "Forwarded to you? Get your own copy" with a link to the signup page. It replaces "Forward to a friend".
- **Who uses it:** newsletters from Politico Pro ("Forwarded this email? Subscribe here for more"), Google Workspace developers, the US Census Bureau (GovDelivery) and The Athletic. All were seen in archived issues.
- **Why replace "Forward to a friend":** Mailchimp's own Forward to a Friend form makes a copy with no unsubscribe link, so it is safe. But most people press their mail app's Forward button, which sends the original unsubscribe link along with the email.
- **Evidence:** no published conversion number for this line was found. Treat it as a cheap, standard pattern, not a proven lift, and measure it with a UTM tag.

## How to do it (30 minutes)

1. **Pick the address:** use, in order, (a) the company's registered office if it is not a private home, (b) a business PO box or virtual office, (c) a partner venue that agrees in writing to receive mail. Never a family home.
2. **Store it once:** put it in Audience > Settings > Required email footer content. In every template, show it only through *|LIST:ADDRESSLINE|* or *|HTML:LIST_ADDRESS_HTML|*. Never type it by hand, so a later change reaches every email.
3. **Unsubscribe line:** write "Unsubscribe *|EMAIL|* from these emails" or keep "This email was sent to *|EMAIL|*" right beside the link.
4. **Forwarded line:** add one line above the footer: "Forwarded to you? Get your own copy: <signup URL>?utm_source=email&utm_medium=forward&utm_campaign=<issue>". Use the hosted signup URL (*|LIST:SUBSCRIBE|*) or the site's own signup page.
5. **Measure:** count signups whose UTM medium is "forward" per issue. If it is still 0 after 4 issues, the line costs nothing, so leave it in.
6. **Check:** send a test to yourself, forward it from a phone, and confirm the friend sees the original address next to Unsubscribe and a working signup link.

## How we apply it to Cedwyn

- **Live check (31 Oct, read-only):**
  - The Mailchimp audience's footer address is the company's registered office. It matches the public Companies House record for the audience's company, so it is already public, and it is not the farm.
  - Phone is stored on the audience but is not printed by *|LIST:ADDRESSLINE|*.
  - All 5 saved nurture templates (local backups in outreach/nurture-backup/) use *|LIST:ADDRESSLINE|*, *|UNSUB|*, *|UPDATE_PROFILE|* and "This email was sent to *|EMAIL|*". So the address and forward-unsubscribe protections are in place.
  - The backups were checked, not the live journey copies.
- **Gap:** none of the 5 has a "Forwarded to you?" line. Proposed patch: one line above the footer pointing to /ebooks/ (the free sample-chapter signup) with utm_medium=forward. Template copy only, no price or claim. Apply it at the next nurture edit. It changes recipient-facing text, so it goes through the normal draft review.
- **Rule for every new sender** (HubSpot one-off mail, any new list or tool): the footer address comes from the registered office or a PO box, never a home. Never paste any family address into a template, a skill file or the public academy.
- **PROPOSAL (needs money, owner's call):** if the registered office ever moves to a private home, get a business PO box or virtual office (about GBP 350–420 a year, not checked) before the next send. Then update the one audience setting, and every template follows.

## Sources
- mailchimp.com
- mailchimp.com
- mailchimp.com
- mailchimp.com
- ico.org.uk
- legislation.gov.uk
- reddit.com (snippet only; page blocked to scripts)
- mailcoms.co.uk (snippet)
- Pattern examples: twipemobile.com (The Athletic), developers.google.com, content.govdelivery.com (US Census)
# Email signature as a quiet channel: one plain-text line, one tagged link

Written 31 Oct 2026 ('email signature' had 0 skill files before; it was only a passing tip in the LinkedIn-newsletter and BookBub files).

## What the evidence states
- **Exclaimer, signature banner CTR page (vendor, read 31 Oct 2026):** its own platform data puts clicks on signature content at **about 4%**. It compares that with MailerLite's 2026 study (3.6M campaigns, 181k accounts): the average marketing-email click rate is **2.09%**. Its working bands are under 2% weak, 2-4% solid, 4%+ strong. Its own caveat: email can't count impressions. Apple Mail Privacy Protection loads pixels for **nearly 65% of tracked opens** (Litmus, May 2026), so any "opens" figure under the CTR is inflated. Count clicks against **emails sent**, not opens.
- **MySignature clicks study (vendor dataset, read):** 5,000 accounts and 1,361,793 link clicks, 2018-2026. The **median signature gets 60 clicks in total** (mean 281, skewed). The top 1% of accounts take 33.8% of all clicks. **Legal users have the highest median (124)**. Marketing roles get 133 against 53 for CEOs and 49 for founders. Solo teams of 1-5 people have a median of 56. Read it as "small but steady", not a growth engine. The per-account time window isn't stated, so this is not checked per year.
- **HubSpot list-growth post (practitioner tip, read):** "I added a line to my email signature that states: P.S. I share my best [topic] insights in a weekly email → [link]". The point it makes is that 50 sends a day is 50 chances. No result figure is given, so treat it as testimony on the method, not proof.
- **BookBub file (ours, already in INDEX):** one author's follow link in her newsletter footer and email signature got **1,900+ tracked clicks**. That's one case, not a benchmark.
- **Images-off institutions (ours: images-off-outlook-uk-institution-email.md):** banners vanish in Outlook images-off views and can trip filters. A text line survives everywhere.

## How to do it
1. **Text, not a banner.** Use 1-2 lines under the name, with no image and no logo. Most of our recipients are UK public bodies on Microsoft 365, so images-off is the default.
2. **One link, one ask.** Pick a single destination and put the benefit in plain words. Phone and other links stay off (one link = one thing to measure).
3. **Tag the link.** Use `utm_source=gmail&utm_medium=email-signature&utm_campaign=<variant>`, matching our UTM vocabulary (utm-discipline-ga4-funnel.md). Never tag internal links.
4. **Change it per context, not per email.** Use one variant for case/FOI correspondence and another for talks, partners and press.
5. **Measure.** Count monthly clicks from Cloudflare/GA4 by `utm_medium=email-signature`, and divide by emails sent from Gmail that month (Sent count). Below 0.5% after 2 months of sends means the line or its destination is wrong. Change one thing.
6. **Rotate the line monthly** (new free record, new talk date, new document), so frequent correspondents see something new.

## How we apply it to Cedwyn
- **Owner step (proposal, needs the project lead's GO):** the Gmail signature is a setting in his own account, so we offer it and never write it ourselves. If he states yes, the Gmail settings API (sendAs signature) or Settings > See all settings > Signature is a 2-minute change.
- **Variant A, for case, FOI, SAR and institution mail (most of his sends; 47 on 29 Oct alone):** use the research archive only, with no shop, no price and no sales words. These threads can end up quoted or published, and the archive link reads as transparency, not selling:
  `Cedwyn, the Llandough records archive: cedwyn.bucklerfamily.estate
- **Variant B, for talks, u3a/Probus/societies, partners and press:** use the e-book shelf (switch to the free sample chapter only once that page is live; check first):
  `The Great House Farm records as e-books: cedwyn.bucklerfamily.estate
- **The mail we write ourselves** (Cedwyn list, mail.tab.bot drafts) uses Variant B in plain text. HubSpot hive drafts to institutions use Variant A only, if any. Those bodies are reviewed in the hive, so add it as a proposal there and don't edit drafts mid-review.
- **Rules:** no banned words; no assertions about named people; nothing about family holdings; the link goes to cedwyn only. the project lead's name in his own signature is fine, because this is his private mail, not public site text.
- **Expectation:** at roughly 30-50 sends a day and 0.5-2% clicks, that's about 5-30 visits a month. It's small, but it's free and permanent, and these readers already know the case.

## Sources
- exclaimer.com (vendor, read 31 Oct 2026)
- mysignature.io (vendor dataset, read)
- blog.hubspot.com (practitioner tip, read)
- Ours: bookbub-author-profile-new-release-alerts.md, images-off-outlook-uk-institution-email.md, utm-discipline-ga4-funnel.md
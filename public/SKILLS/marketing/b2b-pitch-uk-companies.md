# B2B pitch emails to UK companies (2026 how-to)

Scope (the project lead, 26 Oct 10:29): HubSpot keeps **website pitch emails to incorporated companies we are not already in talks with**, plus FOI/case emails, and nothing else. This skill covers what to write and to whom. Deliverability and PECR mechanics are in cold-email-deliverability-uk-pecr.md, and testing in ab-testing-small-lists.md.

## What the 2025 data states (primary datasets)
- **Hunter.io, State of Email Outreach 2026** (2025 campaigns): average sequence reply rate **4.5%**.
  - **Open tracking off:** 7.4% vs 4.4%.
  - **Custom domain, not freemail:** 5.2% vs 2.5%.
  - **Small segments:** 21-50 recipients reply at 6.2% vs 2.4% for 500+.
  - **20-49 sends per inbox per day:** 5.7%.
  - **1-2 people per company:** 5.1% vs 3.5% for 3+.
  - **Two real custom details:** 5.6% vs 3.6% with none.
  - **Hand-edited emails:** 5.2% vs 4.4% for fully automated.
  - **Sequence length:** 3 messages total is best; more follow-ups lower the reply rate.
  - **Subject:** 5-6 words is the sweet spot.
  - **Ask:** soft asks ("Can I send more info?", "Open to learning more?") beat asking for a meeting.
  - **Length:** 61-80 and 181-200 words both did well.
- **Belkins 2025** (7.5M+ cold emails, replies ÷ all sends): average **0.45%**; **UK 0.48%** on 370K+ sends. Food & Beverage, Education and Government replied best. Small companies (1-10 staff) out-replied 10,000+ enterprises (0.22%). Wednesday and Thursday were best (0.48%). Replies fell 20% in H2 2025 (July-August slump).
- What that means for us: expect roughly **1-5 replies per 100 well-targeted companies**. Wins come from relevance and small hand-written batches, not volume.

## Who counts as a company (check before drafting)
- On Companies House (find-and-update.company-information.service.gov.uk): status **Active**, type Ltd, PLC, LLP, CIC or charitable company limited by guarantee. Record the company number on the HubSpot task.
- **Not a company:** sole traders, partnerships, unincorporated clubs and societies, CIOs (unless they also show a company number), public bodies. These are out of scope, and under PECR sole traders and partnerships count as *individuals* anyway.
- **"In talks" check:** any reply in Gmail from their domain, an open thread, or a HubSpot note of contact in the last 90 days means skip.
- Address: a role address from the company's own site (info@, partnerships@, press@). Never a named person's private address.

## Who to pitch for Cedwyn (fit first)
1. Heritage-tourism businesses in Wales: tour operators, guided-walk firms, heritage B&B/hotel companies, tea rooms. The pitch: gift vouchers, a co-branded walk sheet, the e-book as a guest gift.
2. Independent bookshops and publishers trading as Ltd (Welsh-interest lists). The pitch: stock or list the e-book bundle, or a reading event.
3. Welsh-Patagonia travel companies (UK Ltd operators selling Chubut trips). The pitch: background reading for travellers and a Spanish/Welsh free chapter.
4. Local-history media and magazine companies. The pitch: a feature with images, offered as material, never as a press release while press is on hold (press only on the project lead's GO).

## The email (around 90-130 words)
- **Subject, 5-6 words, specific:** "1824 plan of Llandough for your walks"
- **Line 1:** why them, one real detail from their site (detail 1).
- **Line 2:** what we have, one concrete item (detail 2), e.g. a dated plan, a free chapter, a voucher.
- **Line 3:** the benefit to *their* customers, in plain words.
- **Soft ask:** "Shall I send the free chapter and the image pack?"
- **Sign-off:** a real name/role line, the company identity, postal address, and a one-line opt-out ("Reply 'no thanks' and we won't write again"). PECR requires identity and an opt-out for corporate subscribers.
- **No:** attachments, tracking pixels, link shorteners, more than one link, or UTMs on anything but the single off-site link. Banned public words and the never-name-the project lead rule apply.
- **Follow-ups:** at most 2, on days 4 and 10, each adding one new thing (an image or a date). Then stop for good.

## Process (hive-compatible)
1. Research the batch (10-20 companies) and verify each on Companies House. Log company number and source URL.
2. Draft each one as a HubSpot task in hive format: "[OTHER AGENT'S TURN v0.1.0] <Company Ltd>: <subject>". Never a Gmail draft (Gmail holds FOI only).
3. Reviewers check: is it a company, is it out of talks, are the two real details right, is it under 130 words, does it have the opt-out.
4. A human sends from team@ at 20-30 per day per inbox, Wednesday-Thursday mornings, open tracking off.
5. Log replies. A "no" goes on the do-not-contact list the same day.

## How we apply it to Cedwyn
- Start with 15 Vale of Glamorgan and Cardiff heritage-tourism Ltds and 10 Welsh-interest booksellers/publishers. Each goes in HubSpot with its company number and the reason it fits.
- Lead offer: gift vouchers (£25/£45/£90, now on /wales/) for tourism firms, and the bundle (£31.99) or wholesale/listing for booksellers. Free chapter as the soft ask.
- The 14-day no-repeat rule applies to anyone who already got a team@ story email.
- Measure: reply rate per segment (ab_stats.py once there are 30 or more sends per arm), positive replies, and voucher/bundle sales by `utm_source=email&utm_campaign=b2b-<segment>`.

## Sources
- Hunter.io, State of Email Outreach 2026: hunter.io
- Belkins, cold email response rates 2025: belkins.io
- ICO, electronic mail marketing to businesses (corporate vs individual subscribers): ico.org.uk (from the existing PECR skill; not re-opened this run)
- Companies House search: find-and-update.company-information.service.gov.uk
# Cold outreach: end on an interest question or an offer, not a meeting ask (then switch to a specific time once they reply)

Harvested 31 Oct 2026 (~07:00Z) by the skills harvest. Topic: cold email / outreach to UK organisations. Before this run, "interest cta", "call to conversation", "gong" (email) and "calendly"/"booking link" had 0 skill files. The nearest files, `cold-email-follow-up-cadence-small-uk-b2b-list.md` (how many follow-ups and when), `cold-email-reply-triage-first-72-hours.md` (what to do with replies) and `b2b-pitch-uk-companies.md` (who to pitch), don't say **which closing ask** to use, or when to change it. This file covers only that.

## What the sources show
- **Gong Labs, "Surprising cold email CTA" (Devin Reed, May 2020, updated Mar 2026; page read in full).** 304,174 emails from Gong customers. Success = a meeting booked within 10 days ("remove me" replies don't count). Three closing types:
  1. Specific: "Are you available to meet on Tuesday at 4pm?"
  2. Open-ended: "Do you have time next week to meet?"
  3. Interest: "Are you interested in learning more about X?"
  - The finding: **for cold emails, the interest ask is the best performer.** Gong's reason is that time is scarce, so asking a stranger for it reads as a loss. Interest isn't a scarce resource.
  - **It flips once you're talking.** Inside an active conversation the specific day-and-time ask wins. Gong: it "more than doubles meetings booked, from 15% in the cold email stage to 37% in the deal stage". A fixed time gives them an anchor, so they only have to say yes or offer another slot.
  - The per-type cold numbers (interest about 30%, specific 15%, open-ended 13%) are in the chart and quoted by sales30conf.com. I didn't see the chart, so they are **not checked**. The direction is in Gong's own text.
- **Lavender, "Cold Email 101" (Chelsea Castle; read in full).** "The only goal of a cold email is to get a reply. The sale comes later." Don't ask for 15-60 minutes. Use a "call to conversation" instead: is it worth learning more, is this a priority, or is someone else the better contact. Make it easy to answer and avoid open-ended questions. Their figures: most teams get 1-5% replies; Lavender states its own team gets almost 40%. That is a vendor's figure about itself, **not checked**.
- **Jason Bay (Outbound Squad), LinkedIn post (read), citing Gong:** "Offers increase cold email reply rates by 28%+", and "a strong offer beats an interest-based CTA by nearly 4x". Bay defines an offer as something useful the reader actually gets, such as a benchmark, research or an audit. A demo, gift card or "meet and greet" doesn't count. His examples run from easy to hard: (1) introduce the right person, (2) one insight that suits many readers ("how you stack up"), (3) a one-to-one resource made for that recipient. The underlying Gong dataset wasn't linked, so the 28% and 4x are **second-hand and not checked**.
- **Limits:** all three sources are US B2B sales, measured in meetings booked. UK heritage societies, archives and small companies aren't buying software. Use the direction (lower the ask, give something first, switch to a fixed time once they've replied), not the percentages.

## The rule (one line per stage)
| Stage | End with | Example |
|---|---|---|
| First cold email | **an offer** if you have a real one, otherwise **an interest question** | "I've put together a one-page record pack on the 1824 survey of Llandough for your members. Want me to send it over?" |
| Follow-up 1-2 | a new angle plus the same low ask | "Would a 20-minute version suit a summer evening slot better?" |
| They replied with interest | **a specific day and time**, two options | "Thursday 14 Nov at 10:00 or Friday 15 Nov at 14:00 for a 15-minute call?" |
| Statutory request (FOI, EIR, SAR) | **a specific request.** This is not marketing, so interest asks don't apply. | "Please provide copies of…" |

## How to do it
1. **One ask per email**, as the last sentence, ending in a question mark.
2. **Build the offer from what we already hold.** It costs nothing and is ours to give: a one-page extract from the evidence catalogue relevant to their area, a dated timeline image, the free edition, or a ready-made 45-minute talk outline. Name it concretely: "a one-page pack", not "some resources".
3. **No booking link and no meeting ask in a first email.** Gong's buckets show that asking for time is what cold readers resist. A calendar link (e.g. a free Cal.com page) belongs in the reply, after a yes.
4. **Once they say yes, switch to a fixed time at once.** Offer two concrete slots in UK time and confirm with a calendar invite the same day.
5. **Measure for each ask type:** replies with interest ÷ emails sent. Add an `ask_type` column (offer / interest / specific) to the outreach log and compare only after about 30 sends per type. Below that it's anecdote (see `ab-testing-small-lists.md`).
6. **Lint before a draft goes to review:** `python3 tools/cta_check.py draft.txt --stage cold` (or `--stage thread`). It prints SPECIFIC / OPEN / INTEREST / OFFER / REQUEST / NONE and OK or REWORK. Exit code 1 = rework. Stdlib only, about 3 KB, no install.
   - **Checked 31 Oct on 7 hand cases:** 7/7 correct.
   - **Checked on the 26 existing drafts-engine bodies:** 21 read as REQUEST, which is correct for disclosure letters. None was misread as a meeting ask. The other 5 were statement-style letters (4 NONE, 1 OTHER), which is fine for statutory mail.

## How we apply it to Cedwyn
- **Where it applies:** marketing outreach only. That means talk organisers (Cowbridge History Society, u3a, Probus/Rotary, civic societies), B2B pitches (`b2b-pitch-uk-companies.md` already ends on "Open to learning more?", an interest ask, which is correct) and press/newsletter pitches.
- **Where it doesn't:** the hive and drafts-engine disclosure letters (FOI, EIR, SAR, complaints). They correctly end on a specific request. Leave them alone.
- **Default offer for heritage societies:** "a one-page record pack (1824 survey extract and timeline) for your members, free, plus a 45-minute records-trail talk if it suits your 2027-28 programme. Want me to send the pack?" This uses material that is already public on the site. It needs no spend and no new assertions.
- **Talk bookings:** after a society replies yes, the next email offers two dated slots. It doesn't send a link to "pick a time".
- **Proposal for the correspondence and contacts flywheels:** run `cta_check.py --stage cold` on each marketing draft before it enters hive review, and add an `ask_type` field to the HubSpot task body. Status: **proposal.** Every outward email still needs the owner's own review and send. Nothing is sent by agents, and nothing was sent in this run.

## Sources
- gong.io (read)
- lavender.ai (read)
- linkedin.com (read; Gong figures second-hand, not checked)
- sales30conf.com (snippet only: 30% / 15% / 13%, not checked)
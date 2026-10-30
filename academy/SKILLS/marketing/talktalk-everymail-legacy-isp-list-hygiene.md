# TalkTalk legacy addresses -> Everymail: dead-address waves and list hygiene (UK ISP domains)
Harvested 30 Oct 2026 ~14:15Z (skills harvest). Topic: email deliverability to UK home-ISP addresses, the audience a Welsh heritage list skews towards (older readers on ISP mail). Generic hygiene is in list-hygiene-spam-traps-address-sourcing-sunset-rule.md; Virgin Media is in its own skill; this file is only the TalkTalk family and what it means for a small list.

## What the sources show (read 30 Oct 2026)
- **TalkTalk help centre, "Email Transition FAQs" (read in full):** TalkTalk Mail for *former* TalkTalk broadband customers (and MailPlus users) moves to **Everymail, run by Open-Xchange**, as a paid subscription. Current TalkTalk broadband customers are not affected. The 2026 wave: **16 June 2026** non-subscribers can no longer send; **7 July 2026** mailbox "permanently closed", data deleted, sign-in redirected to the Everymail subscribe page. Subscribers keep the same @talktalk.net address, so a TalkTalk address that still works is not proof of an active broadband customer.
- **There was an earlier wave.** emailexpert editorial (22 Jul 2025): stop-sending 28 Jul 2025, lockout 8 Sep 2025, deletion of non-subscribed accounts 31 Oct 2025; expected "a significant rise in hard bounces (550 User Unknown)" peaking after 31 Oct 2025; abandoned and deleted addresses "are frequently converted into pristine spam traps". Domains named: @talktalk.net, @tiscali.co.uk, @lineone.net, @tinyworld.co.uk, @screaming.net, @dsl.pipex.com, @homecall.co.uk. Price reported in coverage: GBP 5/month or GBP 50/year (MSE news Jul 2025 and Facebook coverage, snippets).
- **The ISP's own records were imperfect.** ISPreview (Jul 2025, read): some *current* broadband customers were told to pay; TalkTalk "doesn't appear to have a perfectly aligned record of active broadband and email users". Practical meaning: some people with live accounts may have abandoned them in confusion, and some dead-looking addresses may come back.
- **So two clean-up moments have already passed** (31 Oct 2025 and 7 Jul 2026). Any TalkTalk-family address collected before July 2026 that has not opened/clicked since is a likely dead address or future trap. A deleted mailbox returns a hard bounce; a recycled trap returns nothing at all, which is why "no bounce" is not "fine".

## The playbook (small list, free tools)
1. **Segment by domain before every campaign to a list older than 6 months.** Flag the seven TalkTalk-family domains above (tool: `tools/legacy_isp_domains.py`). Count them; on a UK heritage list they can be several per cent.
2. **Engaged in the last 90 days (click, reply, purchase; not opens alone, Apple MPP inflates opens)** -> keep. Optional one-time plain note in the next newsletter footer: "Changed email provider recently? Update your address here." Never a separate "your ISP is closing" mail to them; they already know or the account is gone.
3. **Not engaged since 7 Jul 2026 -> suppress** (Mailchimp: tag `legacy-isp-unengaged`, exclude from sends; archive after one more quiet quarter). Do not "test" with a send.
4. **Read the bounce report the day after each send.** A 550 from talktalk.net is permanent: Mailchimp cleans hard bounces automatically, but confirm the contact shows as cleaned, and never re-import an old CSV that brings it back.
5. **Acquisition side:** on the signup form, nothing to block (live Everymail subscribers are real), but double opt-in catches typed-in dead addresses before they cost reputation.
6. **Personal correspondence lists (FOI/research contacts)** are not marketing, but the same fact applies: a TalkTalk-family address for an older contact who has not replied since mid-2026 may be closed; look for a newer address before chasing, and record a hard bounce in the HubSpot contact as "address closed (ISP)" rather than "no reply".

## How we apply it to Cedwyn
- Next growth-report or bizdev run with Mailchimp access: export audience emails (read-only), run `python3 tools/legacy_isp_domains.py emails.txt` and record the count per domain in the project workspace If any are unengaged since 7 Jul 2026, tag and exclude them (owned-list housekeeping, no send).
- Add the domain check to the pre-send gate beside addr_hygiene.py for any imported list (event sign-ups, talk attendees, partner co-promos).
- Contacts flywheel / correspondence flywheel: when a TalkTalk-family address bounces, mark it closed and look for the body's or person's current published route; never treat the silence as a refusal.
- No send, no spend, nothing installed (stdlib tool).

## Sources
- TalkTalk Help, Email Transition FAQs (read 30 Oct 2026): help-centre.talktalk.co.uk
- emailexpert, "TalkTalk to Delete Free Email Accounts: Update for Email Senders", 22 Jul 2025 (read): emailexpert.com
- ISPreview, Jul 2025 (read): ispreview.co.uk
- MoneySavingExpert news, Jul 2025 (snippet only, page did not load): moneysavingexpert.com
- Everymail: everymail.com
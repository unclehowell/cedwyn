# Add-to-calendar for free online talks and launch dates: registrant-to-attendee playbook

Date: 2026-10-30 · Topic: email / events conversion (show-up rate)

## The numbers to beat (sources)
- Livestorm 2026 benchmark, 33,786 sessions: average live attendance is **47.7% of registrants**. Above 50% is strong; below 35% "usually points to a timing, targeting, or reminder problem". Converting registrants to attendees is the top challenge for 54.2% of organisers. January has the best show-up rate (50.4%) and August the worst (42.9%).
- Zoom's 2026 webinar blog (citing Univid): live attendance averages **49%**, rising to **57%** with replays. TwentyThree reports 63%, with the best sessions held Tuesday to Thursday, 11:00–14:00.
- Livestorm's own recipe: 3–4 reminders (on confirmation, 24 h before, 1 h before, "starting now") and "one-click calendar invites" to make calendar adds frictionless.
- **Not checked:** no controlled, published figure for the lift from an add-to-calendar button alone was found. Vendors (AddEvent, iContact, Instantly) assert a lift but publish no study. Treat it as best practice and measure our own rate.

## Why the calendar entry matters for us
A free talk that sits only in Eventbrite, Facebook or LinkedIn is forgotten by the evening it happens. A calendar entry with its own 1-hour alarm is a reminder that needs no email deliverability and no app notification setting. It also carries the join link outside the platform (Livestorm makes the same point about LinkedIn Events).

## Playbook
1. **One canonical event page** on Cedwyn (e.g. /talks/<slug>/) with date, time in UK time, length, what attendees get, the join or replay link, and three buttons: **Google**, **Outlook**, **Apple/other (.ics)**.
2. **Generate all three from one source.** Run `python3 skills/tools/make_ics.py --title ... --start 2026-11-19T19:00 --minutes 60 --tz Europe/London --url <event page> --desc ... --out talk.ics --utm <campaign>`.
   - It writes an RFC 5545 .ics with times in UTC, so BST/GMT can't drift, plus a built-in 1-hour alarm and a UTM-tagged link.
   - It also prints Google Calendar and Outlook.com "add" links.
   - Stdlib only; self-test passes (GMT November, BST July, line folding, UTM, link encoding).
3. **Serve the .ics** from the site, e.g. /talks/<slug>.ics. Check that Cloudflare serves it as `text/calendar`. iPhone opens a served .ics straight into Calendar; an email attachment is less reliable.
4. **Put the buttons where the commitment happens:**
   - on the event page;
   - in the Mailchimp confirmation email;
   - in the 24 h reminder;
   - in the Eventbrite/Facebook/LinkedIn event description, as a link to the event page (those platforms add their own reminders on top).
5. **Reminder cadence (Livestorm):** confirmation (with calendar buttons), 24 h before, 1 h before, and "starting now" with the join link. For a free history talk, three sends is the ceiling. Every email carries the replay promise, because replays add about 8 points (49% → 57%).
6. **Timing:**
   - For a UK local-history audience, start with the society norm: weekday evening, 19:00 (see civic-local-history-society-talks-penarth.md).
   - Test one lunchtime session (12:30) in the Tue–Thu window that TwentyThree reports, and compare.
   - Avoid August; prefer January, September or November.
7. **Measure:**
   - registrants, attendees, attendance %;
   - calendar-link clicks by button, from UTM `utm_source=calendar` and Mailchimp click maps;
   - replay views at 7 days;
   - e-book shop clicks from the talk page.
   - Log a row per talk in the project workspace

## Kill / keep
- Keep the buttons permanently: zero cost.
- Judge the talk programme, not the buttons. Below 35% attendance for 2 talks in a row means fix timing or topic before running a third. Fewer than 3 shop clicks per 50 attendees means the talk isn't selling; change the closing offer (one sample chapter link, as in preview-pdf-sales-tool-paid-titles.md).

## How we apply it to Cedwyn
- Every future Cedwyn online talk, e-book launch date and documentary door-opening gets an event page with the three buttons. A door opening is a dated public moment, so a calendar entry is the reminder that brings people back to /documentary/.
- Event text is neutral, third person, and never names the owner. Banned public words apply (states, assertions, per, second-hand report, not checked, reported, deception, taken); there are no outbound links beyond the join platform.
- Pricing and any "launch deadline" stay the project lead's decisions. A calendar entry for a sale end only marks a real date (see honest-launch-deadlines-uk-dmcc-banned-practice-7.md), never a reset countdown.
- Creating a talk, its date and any public event listing still needs the project lead's GO under existing rules. This skill only covers how the reminder layer is built once a talk exists.
- Nothing is sent by this skill. Reminder emails follow the existing Mailchimp rules: opted-in subscribers only, drafts reviewed first.

## Sources
- livestorm.co (read 30 Oct 2026: 47.7% of 33,786 sessions; 54.2%; Jan 50.4% / Aug 42.9%; 3–4 reminders + one-click calendar)
- zoom.com (read 30 Oct 2026: Univid 49% live / 57% total; TwentyThree 63%, Tue–Thu 11:00–14:00)
- zoom.com (snippet: 49% average live attendance, 2026)
- RFC 5545 (iCalendar) for the .ics format; Google Calendar `action=TEMPLATE` link format
- Vendor assertions, not checked: addevent.com, icontact.com, instantly.ai event-reminder pages
- Tool: skills/tools/make_ics.py (stdlib; written and self-tested 30 Oct 2026). Outlook.com compose link format not tested on a live account; test once before use.
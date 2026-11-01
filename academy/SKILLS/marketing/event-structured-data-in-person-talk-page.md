# Event structured data (schema.org Event) for a real, in-person talk page

Skill harvested 2026-10-26. Primary source: Google Search Central event docs (page last updated 2026-09-08) and Google's documentation changelog (5 June 2025). No install needed: hand-written JSON-LD.

## What changed (read this first)
- On 5 June 2025 Google removed the online-event properties from its event docs. Its stated reason: "To be eligible for the event experience on Google, events must be bookable by the general public and held at a physical location." So an online-only talk (Zoom, YouTube live, Eventbrite online) gets NO Google event listing, whatever markup it carries. Markup is only worth adding for an in-person talk (e.g. a library room).
- Google's own case-study line on the page: Eventbrite saw "a 100% increase in the typical year-over-year growth of traffic from Google Search". Vendor case study, not checked further. No small-publisher numbers were found; measure our own.

## Rules that decide eligibility (Google's guidelines)
1. One event = one leaf page with its own URL and its own markup. A listing page of several talks is not the target; mark up each talk page.
2. Accurate name, start date and location. Don't mark non-events: no "buy the e-book now", no discounts, no opening hours, no coupons. An e-book is never an Event.
3. Must be bookable by the general public. Members-only or invitation-only events are ineligible.
4. Required: name, startDate, location (Place with name + full PostalAddress). Recommended: description, endDate, eventStatus, image (1x1, 4x3, 16x9), offers (free = price 0), organizer, performer.
5. Time zone: give the UTC offset. UK winter = +00:00, summer (BST) = +01:00. Without an offset Google uses the venue's time zone.
6. If it moves or is cancelled, update eventStatus (EventRescheduled + previousStartDate, EventCancelled, EventPostponed); never delete the page.
7. Page must be crawlable: not robots-blocked, no noindex, no login.

## Steps
1. Publish the talk page (leaf URL, e.g. /talks/2027-03-llandough-records/) only once the venue booking is confirmed in writing.
2. Add the JSON-LD block below to the head.
3. Run Google's Rich Results Test on the live URL; fix critical errors.
4. URL Inspection in Search Console, request indexing; make sure the page is in the sitemap.
5. After the date: set the page to past tense, keep the markup's real dates (Google drops past events itself), link to the recording/notes and /ebooks/.

## Template (fill only with confirmed facts)
```json
{
  "@context": "schema.org",
  "@type": "Event",
  "name": "Tŷ Mawr, Llandough: what the records show",
  "startDate": "2027-03-11T18:30:00+00:00",
  "endDate": "2027-03-11T19:30:00+00:00",
  "eventStatus": "schema.org
  "location": {"@type": "Place", "name": "<library name>",
    "address": {"@type": "PostalAddress", "streetAddress": "<street>",
      "addressLocality": "<town>", "postalCode": "<postcode>", "addressCountry": "GB"}},
  "image": ["<1x1.jpg>", "<4x3.jpg>", "<16x9.jpg>"],
  "description": "A free illustrated talk on the farm's records, from the first record mention found (the 1824 David Stewart survey) onwards.",
  "offers": {"@type": "Offer", "price": 0, "priceCurrency": "GBP",
    "availability": "schema.org "url": "<booking or page URL>"},
  "organizer": {"@type": "Organization", "name": "Cedwyn", "url": "cedwyn.bucklerfamily.estate
}
```
(Date and venue above are placeholders, not a booking.)

## How we apply it to Cedwyn
- Today Cedwyn has no confirmed in-person talk, so nothing is marked up yet. Do not mark up the online/Eventbrite talk idea (ineligible since June 2025).
- Performer: a role ("Cedwyn researcher"), never a personal name, unless the owner decides otherwise.
- Measure: Search Console performance filtered to the talk URL (impressions, clicks) plus utm_source=google-events is not possible (Google sets the link), so compare talk-page sessions before/after indexing and count bookings.
- The e-books are never marked as events; /ebooks/ is linked from the talk page body only.

## Sources
- developers.google.com (read in full; last updated 2026-09-08)
- developers.google.com (5 June 2025 entry: "removed the online event properties"; read)
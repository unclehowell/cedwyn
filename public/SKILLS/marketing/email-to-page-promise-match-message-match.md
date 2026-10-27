# Email-to-page promise match ("the email said 30 seconds")

Trigger: the project lead, 12:33 GMT on 27 Oct 2026. The parcels outreach email promised a "30 second video". The page it linked to played a 10-minute film. Each concrete promise in an email (a length, a price, "free", a date, a named document) is a contract the landing page has to honour in its first screen.

## What practitioners measured
- **Moz / Brad Smith case study (2017, read):** a PPC client rebuilt its pages so the ad's keyword, offer and headline were echoed on the landing page ("message match"). Result: conversion rate up 212.74% and cost per conversion down 69.39%. This is one client, paid search, no control group published. Read it as the size a mismatch *can* cost, not as a forecast.
- **Unbounce glossary (Oli Gardner, read):** message match is "how well your landing page copy matches the phrasing of the ad or link that brought the visitor there". Strong match "reassures people they've come to the right place". Gardner's line is "If your ad copy doesn't match the message on your landing page, you're disrespecting the click." No number on the page.
- **Google Ads Help 6238826 (snippet, not opened):** choose a landing page that "closely matches your ad and keywords". Google scores this alignment as "landing page experience". The same logic applies to an email link, without the auction.
- **Wistia, State of Video 2026 / optimal-video-length (read):** videos under 1 minute average **52% engagement** (share of length watched). 5–30 minute videos average a **9% click-through rate**, and engagement drops another **11%** past 30 minutes. So a 10-minute film behind a "30-second" promise loses most viewers before the call to action, on top of the broken promise.

## How to do it
1. **List the promises.** Before any send, pull every concrete claim from the email: numbers with units (30 seconds, 36 parcels, £4.99), "free", dates, named attachments or pages.
2. **Check the first screen.** Each promise must be visible at 390 px without scrolling, in the *same words*. The email states "30 second video", so the page states "(30 seconds)" beside the player.
3. **One ask, mirrored.** If the email's ask is "watch the video and reply", the page's first action is that video, not a menu.
4. **Keep the long version one tap away.** The short asset is what was promised. The full one sits under it as "Watch the full video (10 minutes)", labelled with its length so nobody gets a surprise.
5. **Freeze promised pages.** Once an email has gone out with a link, treat the page's first screen as locked to the email copy. Any later edit (corrections included) keeps the promised elements, or the follow-up email names the change.
6. **Run the lint.** `python3 tools/promise_check.py email.txt … lists each number+unit/price/"free" phrase from the email and whether the live page shows it. Exit code 1 means a mismatch, so fix the page (or the draft) before sending.

## How we apply it to Cedwyn
- **/parcels/ (now):** the 30-second cut is the main player, captioned "(30 seconds)", with "Watch the full video (10 minutes)" directly under it (a worker). Then run promise_check against the sent email body and the live page.
- **Follow-ups on 2–4 Nov:** each HubSpot follow-up draft gets a promise list in its task body, checked against the live page the day before it goes to the project lead.
- **The Parcel A correction:** the correction note on /parcels/ must not push the promised video below the first screen at 390 px. Put the note under the player or in a slim bar.
- **E-book emails:** any price or edition in a Mailchimp email must match the /ebooks/ dropdown default, and the "free" edition must open with one tap from the cover.
- **Never claim a lift for Cedwyn.** Log the parcels page's play rate (Cloudflare analytics plus jsdelivr hits) before and after the 30 s cut as our own number.

## Sources
- moz.com (read; 212.74% / 69.39%, single client)
- unbounce.com (read)
- support.google.com (snippet, not opened)
- wistia.com (read; 52%, 9%, 11%)
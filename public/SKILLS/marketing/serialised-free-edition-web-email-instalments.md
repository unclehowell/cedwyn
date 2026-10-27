# Serialise the free edition, chapter by chapter, then sell the whole (web + email serial)

Read 27 Oct 2026 (skills harvest). Practitioner pattern: give the work away in instalments where readers already are, let demand for "all of it in one file" build, then sell the complete edition cheaply. Our e-books are already split into a free v0.01 and a paid v0.02, so the serial is a delivery change, not new writing.

## Evidence (with how solid each is)
- Hugh Howey, own blog "Two Years Ago" (read, primary): Wool began as a single 99-cent short; readers asked for more; he released it in parts. "I sold 3,000 copies of Wool in November [2011]"; December "saw another tripling. 10,000 copies of Wool. Thousands of copies of Wool 2", with parts 3 and 4 released in December. Each new instalment pulled sales of the earlier ones.
- Writer's Digest profile of Howey (snippet, not read in full): by summer 2012 "selling 20,000-30,000 digital copies of Wool a month".
- Andy Weir, The Martian: posted chapter by chapter free on his website; readers asked for a Kindle file; he priced it at 99c. Pop Theology review (read, secondary) and KDP's own Facebook post (snippet) give 35,000 copies in three months and #1 in Amazon sci-fi. Not checked against a Weir interview; treat the number as reported, not verified.
- Substack serial writers (snippets: sutoscience.com "6 strategies", meganbethdavies.substack.com): the common model is first chapters free to every subscriber, later or bonus chapters paid. No conversion numbers were found on the pages read; do not quote one.
- Pattern across all three: (1) regular cadence, (2) every instalment ends with a reason to continue, (3) the complete edition is cheap and one click away, (4) the free serial is never pulled.

## How to run it (zero spend)
1. Cut the free edition into 6-10 instalments of 1,200-2,500 words, each ending on an open question from the records (a date that does not match, a missing document). One instalment = one web page + one email.
2. Cadence: weekly, same weekday and hour (pick from email-send-time-frequency-tiny-list.md). Announce the schedule in instalment 1 so readers expect the next.
3. Each instalment page: headline, the instalment, "Part N of M - next part <date>", a signup box for "get each part by email" (Mailchimp group `serial-<book>`), and ONE line: "Want it all now? The complete edition, with the evidence appendix, is at /ebooks/." UTM: utm_source=serial&utm_medium=web|email&utm_campaign=<book>&utm_content=part-N.
4. Email: the instalment in full (or the first 60% with "continue reading" to the page if long), same single buy line at the end. Plain layout per html-email-design-accessibility.md.
5. Instalment pages go into the sitemap and RSS feed (rss-atom-feed-websub-static-site.md) so each part is an indexable entry point; link part N to N-1 and N+1.
6. After the last free part: one email "You've read the free edition. Here's what the full edition adds" with 3 concrete additions (pages, documents, the timeline) and the buy link. This is the welcome-sequence close, not a countdown (no fake urgency: uk-dmcc-act-urgency-reviews-price-copy.md).
7. Measure per part: page views, email opens/clicks, buy-link clicks by utm_content, signups to the serial group, drop-off between parts. A part with a big drop is the one to rewrite.

## How we apply it to Cedwyn
- Start with the shortest free book with the clearest narrative (The Ty Mawr Deaths casebook, 69 pp v0.02): its free v0.01 serialises into about 6 weekly parts. The Dartboard (404 pp) is too long; serialise only its opening section.
- Parts live in the e-books/shop theme as DB records (one record per part, text fed from the DB, layout-only page), not hard-coded pages; respect the repair freeze (new pages only, no edits to existing ones; if the freeze blocks new routes, leave the patch in the project workspace).
- Mailchimp: add a `serial` interest group to the existing signup form; existing subscribers get part 1 as a normal campaign (allowed: campaigns to the existing list). Respect the free-plan send limits (mailchimp-free-plan-2026-limits-gates.md).
- Social: each part gets one quote card and a reel from the content-repurposing calendar, linking to the part page (not straight to the shop).
- Public text rules: never name the project lead; none of the banned words; no outbound links; neutral dated wording about the records.
- Gate: it changes how the free edition is delivered, not its price, so it sits within the sales-fix remit; publishing a new e-book or changing prices remains the project lead's call.

## Sources
- hughhowey.com (read)
- writersdigest.com (snippet)
- poptheology.com (read; secondary)
- facebook.com (snippet)
- sutoscience.com ; meganbethdavies.substack.com (snippets; no numbers)
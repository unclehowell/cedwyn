# "Get emails about this page": per-record and per-topic update alerts (the GOV.UK pattern)

Skill harvest, 31 Oct 2026. Topic not in the index before ("watch this page", "follow topic", "per-topic", "update alert" all 0 hits). The topic-wide segmentation numbers (Mailchimp: segmented clicks +100.95%) are already in `mailchimp-click-interest-tags-segments.md`; this file is about **what a reader subscribes to** and **when an email fires**.

## Why it matters for reach
When a site has few outside readers (about 45 real /ebooks/ views a day), each one who leaves without a way back is lost. A research site that changes every day already has a reason to bring them back: the record they cared about changed. A topic or page alert turns a single visit into return visits without any new outreach.

## The evidence (primary, practitioner)
- **GOV.UK (GDS), Dec 2014:** user research found "people with specialist user needs want to see everything about their specialisms. They want to know when content has changed and quickly understand what has changed." Alerts were added to every sub-topic. Readers choose **immediate, daily or weekly**. An alert fires only when (a) new tagged content is published or (b) a change is marked **major** by the publisher, and the email carries the public **change note**. A "latest documents" page lists changes newest first with the change note. (insidegovuk.blog.gov.uk)
- **GOV.UK, Feb 2018:** over 700,000 people received GOV.UK email updates across **9,400+ mailing lists**, and **over 3,000 lists had never sent an alert** (over-specific combinations). Lesson: flexibility creates mismatch, so help people "sign up for the right thing first time round", with an explicit step to narrow the subscription. Inspiration came from Wikipedia watchlists, GitHub and the NYT. (insidegovuk.blog.gov.uk)
- **GOV.UK, Mar 2018:** over three quarters of a million subscribers; about 8.5 million emails a week. Research: people struggled with volume, wanted tighter topics, and "one email a day was preferred" to repeats. Frequency became **per subscription**. Digests are grouped under headings. Change notes were rewritten: a simple change is summarised in the note itself, and a complex one points to exactly where to look. (insidegovuk.blog.gov.uk)
- GOV.UK now shows a "Get emails about this page" button on single guidance pages (the design-system component, seen live on gov.uk guidance pages, 31 Oct 2026). Subscriber counts for that button were not found: not checked.

## How to do it (small site, free tools)
1. **Pick the units.** Not every page. Use about 5-8 topics people actually come for (e.g. the chronology, the missing-records register, each e-book's research thread, the dartboard of requests). A per-record "watch" only on the handful of records that change often. Avoid GOV.UK's 3,000 dead lists: no topic that has not changed in 90 days.
2. **One list, tags not lists.** In the existing email tool, keep a single audience and add one tag or group per topic. Signup form: email + topic tick-boxes + frequency (weekly digest default; "as it happens" optional). The double opt-in and consent wording stay as they are now.
3. **Button placement.** One line under the page title or above the footer: "Get emails when this changes". Pre-tick the topic of the page the reader is on (narrowing step from GOV.UK 2018). No pop-up.
4. **What fires an email.** Only a **major change**: a new record, a reply from an institution, a new dated fact, a correction. Typos, layout and agent changelog signatures never fire. Each page that can fire needs a one-line public change note ("Added the 1956 newspaper letter; source: Western Mail p.6").
5. **The email.** Subject = topic + what changed. Body = the change note, one link to the exact section, then one line for the shop. Weekly digest grouped under topic headings.
6. **Measure (8 weeks).** Signups per 1,000 page views per topic; return visits from alert links (utm_medium=email, utm_campaign=alert-<topic>); unsubscribes per send. Kill a topic with 0 signups after 8 weeks. Keep it if alert-link visitors buy or join at any rate above the site average.

## How we apply it to Cedwyn
- The site already writes changelogs and dated catalogue changes; the missing step is a **public change note marked major or minor** and a signup that names the topic. Proposal: a `change_note` + `major: true|false` field in the data the build already reads, and a weekly "What changed in the records" digest generated from major notes only (it can share the RSS-to-email route in `mailchimp-rss-weekly-blog-digest.md`, one feed per topic).
- Start with 4 topics: Chronology, Missing records, Requests and replies, New e-book editions. Add a per-record watch only for records an institution is due to answer.
- Public text rules apply to change notes (they are public): no names of family members, no banned words, no holdings or addresses, internal links only.
- This is a **PROPOSAL**: it adds a public signup and email journeys, which go through the owner's queue before build. Nothing is sent until approved; agents never email readers by hand.
- Kill rule: under 5 topic signups in 8 weeks across all topics = drop the per-topic choice and keep one weekly digest.

## Sources
- insidegovuk.blog.gov.uk (read 31 Oct 2026)
- insidegovuk.blog.gov.uk (read)
- insidegovuk.blog.gov.uk (read)
- docs.publishing.service.gov.uk (digest and immediate modes; snippet)
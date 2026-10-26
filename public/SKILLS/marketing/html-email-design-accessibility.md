# HTML email design & accessibility (2026) — story emails that render, read and get clicked
Harvested 26 Oct 2026 by the project lead's Tab agent (skills harvest). Numbers carry their source; anything not checked this run is marked.

## What the evidence shows
- Almost nobody gets this right: the Email Markup Consortium audited 376,348 emails (May 2025–May 2026); 99.88% had "Serious" or "Critical" accessibility defects and only 8 emails from 3 brands passed. 10,566 emails sent via Substack, Shopify and Beehiiv: none passed. Most failures are "basic, machine-checkable" (missing lang, layout tables without role, missing/poor alt text, tiny text). Even the passing emails had alt text not matching image text and 10px footers. (emailmarkup.org)
- Where emails are opened (Litmus market share, opens tracked): Apple 76.56% (inflated by Apple Mail Privacy Protection), Gmail 16.10%, Outlook desktop 3.48%, Yahoo 2.35%. Dark mode: >25% of the user base (Litmus 2026 page); 35% of tracked opens in 2022 (Litmus dark-mode guide). Design for Apple Mail + Gmail mobile first, dark mode always.
- Plain vs designed: Litmus split its webinar emails 50/50. Customers: plain-text-style + personal wording converted 60%, then 63% when re-tested against HTML; non-customers: 49% registered from the plain-text-style both times — format made no difference for strangers; the wording did. Their own caveat: the first test changed format AND message at once. (litmus.com)
- Vendor round-ups claim plain text gets 17–21% higher CTR (joinbreaker.ai, 2026) — vendor claim, not checked.

## How-to (checklist before any send)
1. Light design, letter feel: one column, max ~600 px, real text (not text in images), 16 px body, >=12 px footer, one heading, 1–3 short fact paragraphs, ONE button/link. A designed email that reads like a letter gets the best of both (Litmus result: wording beats chrome).
2. Code: `<html lang="en-GB">` (cy for Welsh copies), `<title>`, `<meta name="color-scheme" content="light dark">` + `supported-color-schemes`, every layout `<table role="presentation">`, inline CSS, a real `text/plain` part.
3. Dark mode: avoid pure #000/#fff; use transparent PNG logos with a light outline; test contrast in both modes (Litmus dark-mode guide).
4. Images: meaningful alt that matches any text in the image; `alt=""` for decorative spacers. Email works with images off.
5. Size under ~102 KB HTML or Gmail clips the message and hides the footer/unsubscribe (widely documented by Litmus/Email on Acid; not re-measured this run).
6. Links: descriptive link text ("See plan 19 from the 1824 survey"), never "click here"; one deep link with UTM; unsubscribe in plain words.
7. Test: run tools/email_lint.py; send to the Tab inbox and view on phone in light and dark.

## How we apply it to Cedwyn
- All outreach templates in the project workspace (T1a–T3b) were linted 26 Oct 09:52: all PASS (lang, color-scheme, role=presentation, unsubscribe, UTM deep link, no banned words, 5.9 KB). Keep that bar for every new template: `python3 the project workspace the project workspace*.html`.
- Strangers respond to wording, not chrome: keep the A/B on subject + first fact + landing page (see ab-testing-small-lists.md), not on heavy vs light design.
- For a Welsh-language variant set `lang="cy"` so screen readers switch voice.
- The weekly e-book email to opted-in subscribers can carry one cover image (with alt text = title + one line), still one link to /ebooks/#<book>.

## Sources
- emailmarkup.org
- litmus.com
- litmus.com
- litmus.com
- joinbreaker.ai (vendor; not checked)
# Paid-version pages in search: paywalled-content markup, lead-in, and the 10% paywall gauge

Checked 30 Oct 2026, ~11:00Z. Search for "isaccessibleforfree" in the skills index found 0 hits before this file.

## What the primary sources say (read 30 Oct)

- **Google, "Structured data for subscription and paywalled content" (CreativeWork), read in full.**
  - The markup exists so that Google can tell paywalled content apart from cloaking. Cloaking means showing Googlebot something different from what users see, and it breaks the spam policies.
  - It applies only to content you *want crawled and indexed*. If the paid text or video is never served to the browser, you don't need the markup.
  - Required: `"isAccessibleForFree": false` on the CreativeWork. Recommended: `hasPart` with `{"@type":"WebPageElement","isAccessibleForFree":false,"cssSelector":".paywall"}`.
  - Use `.class` selectors only. Don't nest sections. For several gated sections, give an array of hasPart items.
  - Supported types are CreativeWork and its subtypes, for example Article, Course, WebPage, and `["Article","LearningResource"]`.
  - If you don't want the content in the browser at serve time, use a paywall that doesn't send it. Client-side JavaScript paywalls have their own guidance page.
  - AI Overviews and AI Mode follow the normal preview controls (nosnippet, data-nosnippet, max-snippet).
- **Google, "Flexible sampling", read in full.** This comes from Google's experiments with publisher partners.
  - "Even minor changes to the current sampling levels could degrade user experience and … unintentionally impact article ranking."
  - **Lead-in** (show the opening, gate the rest) is called "a good practice". It shows readers the value of the content and "generates user curiosity … which may assist in conversion."
  - **The gauge:** "general user satisfaction starts to degrade significantly when paywalls are shown more than 10% of the time (which generally means that about 3% of the audience has been exposed to the paywall)."
  - Users who have seen only a little content before they must pay lose interest "greatly".
  - The metering starting point for news is 10 free items a month, with 6-10 typical. That suits news; it is not a rule for books.
- Playwire's guide (snippet only, not read) gives the same JSON-LD patterns and anti-cloaking rule. It adds nothing new.

Caveat: these are Google's own experiment summaries. No numbers outside Google back them, and they were measured on news publishers, not book or film sellers.

## The how-to

1. **Decide per page what is indexable.** There are three page types:
   - **Fully free version** (whole text or film on the page): `isAccessibleForFree: true`, or leave it out. No paywall markup.
   - **Paid version product page** (description, sample, buy button; the paid content is never in the HTML): no paywall markup needed, because nothing is hidden from users that Googlebot sees. Use normal product or book markup.
   - **A page that serves the paid content in the HTML but hides it with CSS/JS until unlock**: needs `isAccessibleForFree:false` plus `hasPart.cssSelector` on the wrapper class. Otherwise it risks being read as cloaking. Better still, don't send the paid content until unlock.
2. **Always give a lead-in on paid pages.** Show the first paragraph, chapter or scene for real, and put the gate after it. Never put a bare gate first.
3. **Measure paywall exposure.**
   - Exposure rate = sessions that see a lock or buy gate ÷ all sessions.
   - Gate-shown rate = page views with the gate ÷ page views.
   - Above ~10% of views or ~3% of visitors, expect satisfaction, and possibly ranking, to suffer. Make the free path more visible rather than gating more.
4. **Check with tools.** Run the Rich Results Test and URL Inspection ("View crawled page") so you know what Googlebot actually got.
5. **One change at a time,** dated in an annotations log. Google states small changes in sampling can move rankings.

## How we apply it to Cedwyn (e-books, documentary, academy, site)

Site facts checked live 30 Oct, cache-busted curl:
- /ebooks/cedwyn/ shows v0.0.2 and v0.0.1 and carries `canonical /ebooks/cedwyn/`. It has no isAccessibleForFree markup. Free downloads go through `/ebooks/api/free?book=<id>@<semver>`, so the paid file is not in the page. That makes it page type 1 or 2, and no paywall markup is needed.
- /documentary/ has no canonical tag, no VideoObject and no isAccessibleForFree. Its only JSON-LD is an agent-instruction WebPageElement. documentary.js 1.6.2 picks a cut with `?v=` and unlocks the newest cut (v0.0.2, £4.99) per device after checkout (`?unlock=cs_…`).

Actions. All are PROPOSALS for the documentary and onpage owners. No price change, and no buy.stripe.com request from any script.
1. **Documentary.**
   - If the v0.0.2 scene file or subtitles are in the HTML or manifest before unlock, wrap the gated player in a `.paid-cut` class.
   - Add a VideoObject or Movie scene JSON-LD with `isAccessibleForFree:false` and `hasPart` → `.paid-cut`.
   - Give the free v0.0.1 cut its own VideoObject with `isAccessibleForFree:true`.
   - If the paid file is fetched only after unlock, mark only the free cut.
2. **Lead-in on the paid cut.** Show the first ~20-30 s of the v0.0.2 scene, or its first captioned line, before the lock, rather than a still and a price. This matches the existing sample-chapter skill (free-sample-chapter-read-before-buy.md) for the e-books.
3. **Academy (/learn/).** Do the same for any member-only lesson whose text is in the HTML: `["Course","LearningResource"]` with `isAccessibleForFree:false` plus `hasPart` on the members' block. Public course outlines stay free.
4. **Gauge.** Add a weekly line to the KPI snapshot: gate views ÷ documentary views, and lock-clicks ÷ visitors, using the site's first-party beacon (campaign-tags skill). If gate views go above 10%, make the free v0.0.1 path more prominent. Don't gate more.
5. **Verify.** After any change, run the Rich Results Test and URL Inspection on /documentary/ and one e-book page, and record the result in the project workspace notes.

## Sources
- developers.google.com (read 30 Oct 2026)
- developers.google.com (read 30 Oct 2026)
- playwire.com (snippet only)
- Live: cedwyn.bucklerfamily.estate , /documentary/documentary.js?v=1.6.2 , /ebooks/cedwyn/ (curl 30 Oct ~10:57Z)
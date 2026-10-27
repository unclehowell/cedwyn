# Share links that measure: native share sheet, WhatsApp/email links, copy-link UTMs, no counters

Topic: getting readers to pass Cedwyn pages on, and seeing it happen. Most sharing is private (WhatsApp, email, text, DMs) and analytics records it as "direct". Skill written 27 Oct 2026 (harvest run).

## What the evidence states
- **Private shares are invisible.** SparkToro + Steve Dodd, 27 Apr 2023, controlled test with ~100 recruited people clicking one tagged page per network: **100% of visits from WhatsApp, TikTok, Slack, Discord and Mastodon arrived as "direct"** with no referrer. Messenger was 75% direct. Instagram DMs lost 30% of referrers, public LinkedIn 14% and Pinterest 12%. SparkToro's own GA showed 95% "direct". Their advice: tag your own links (unique URLs). (read)
- **Most shares are copy-paste, not button clicks.** ShareThis studied 113 million shares on its publisher network (2017 whitepaper; landing page read, the figures are behind a form). Warc's estimate, quoted on that page, is that private messaging is over 80% of social activity. A secondary summary (referralrock, snippet only, not checked) gives 29% via buttons and 71% copy-paste.
- **One native Share button beats a row of logos on phones.** Google's Santa Tracker swapped several share targets for one Web Share API button and saw **about 20% more shares** (web.dev "Integrate with the OS sharing UI", read). Constraints: HTTPS only, must run on a click (never on load), feature-detect `navigator.share`/`navigator.canShare`, and keep a fallback for desktop browsers.
- **Share buttons near the buy button can cost sales.** Taloon.com (Finnish hardware shop, VWO test via CXL, read): removing share buttons from product pages raised add-to-cart by **11.9%**. The owner put it down to share counts showing **zero** (negative social proof) and to distraction from the one goal of the page. Practical Ecommerce's advice is the same: save sharing for the confirmation page.

## How to do it
1. **Where it goes:** reading pages (research, evidence, the place pages, free-edition parts) and the **thank-you/download page**. **Not** above or next to the buy button on /ebooks/; at most a quiet link below the fold there.
2. **Buttons (phone first):**
   - one **Share** button that calls `navigator.share({title, url})` where supported;
   - otherwise the fallbacks **WhatsApp** (`wa.me + encoded "title url"), **Email** (`mailto:?subject=…&body=…`), **Copy link**. Facebook/X only as extras.
   - Use plain `<a>`/`<button>` with no third-party share widget script. That means no tracking, no consent banner and no speed cost.
3. **Never show share counts.** Zero or low counts read as "nobody cares".
4. **Tag every shared URL** (see utm-discipline-ga4-funnel.md):
   - `utm_source=whatsapp|email|native|copy|facebook|x`
   - `utm_medium=share`
   - `utm_campaign=sharebar`
   - `utm_content=<page-key>`

   The **copy-link** button must copy the *tagged* URL. Copy-paste is the biggest channel, and untagged it lands in "direct".
5. **Make the shared message worth sending:**
   - prefill a one-line hook from the page (title plus a short fact line), not "Check this out";
   - set og:title, og:description and og:image (1200x630) per page so the WhatsApp/iMessage preview card shows the record image (see google-discover / site-name skills for image sizes).
6. **Language:** label the button in the page's language (cy/en/es). The prefilled text stays in the page language. Spanish pages are where WhatsApp matters most (Argentina).
7. **Measure monthly:**
   - in GA4 (or Cloudflare when GA4 is absent), the sessions where `utm_medium=share`, by source and page;
   - also log share-button clicks as an event `share_click` with params `method` and `page`.

   **Compare clicks against arrivals.** A click with no arrival means the share was never opened.
8. **Thank-you page ask:** after purchase or free download, give one line in the page language, e.g. "Know someone from Llandough or Chubut who would want this? Send it on", followed by the Share button. A buyer sharing to one relative is the warmest lead we can get.

## Pitfalls
- `navigator.share` throws if it isn't called from a click. Wrap it in try/catch and swallow `AbortError` (the user cancelled).
- Desktop Firefox lacks `navigator.share`, so always render the fallbacks.
- Don't add UTMs to canonical tags or internal links, only to the URL being shared.
- WhatsApp strips nothing from the URL, so the UTMs survive. Keep them short: long query strings look spammy in a chat preview.

## How we apply it to Cedwyn
- A trilingual share bar already exists in our code: `the project workspace`, lines ~546-735. It has native Share, Facebook, X, WhatsApp via wa.me, email and copy, and tags `utm_medium=share&utm_campaign=sharebar&utm_content=<key>`.
  - **I did not see it on the 7 live Cedwyn pages I checked on 27 Oct 2026** (/, /wales/, /research/, /ebooks/, /dartboard/, /evidence/, /ghf/). /ebooks/ and /dartboard/ only mention basecamp.js in a CSS comment.
  - **Proposal (for the onpage flywheel, PROPOSED not done):**
    - port that bar into the shared footer/reading template of the Cedwyn sections, data-driven labels from the DB i18n strings;
    - **exclude** it from /ebooks/ above the fold;
    - add it to the download/thank-you page;
    - keep Copy link copying the tagged URL (line ~720 already does: `utm_source=copy`) and keep its `share_click` event;
    - drop any share counts.
- No outbound links rule: the share targets are user actions (wa.me / mailto), not links to other sites in page content. Treat them like the existing contact links. If editorial disagrees, ship Share + Copy + Email only.
- Report `utm_medium=share` sessions in the Sunday growth report. Dark social is likely our biggest hidden channel, given that families pass archive finds around on WhatsApp.
- Never name the project lead in any prefilled text. Prefill uses page titles only, which are already editorially checked.

## Sources
- SparkToro, "New Research: Dark Social Falsely Attributes Significant Percentages of Web Traffic as Direct", 27 Apr 2023: sparktoro.com (read)
- web.dev, "Integrate with the OS sharing UI with the Web Share API" (Santa Tracker ~20% more shares; constraints): web.dev (read)
- MDN, Navigator.share: developer.mozilla.org
- CXL, "6 Conversion Rate Optimization Case Studies" (Taloon.com, +11.9%): cxl.com (read)
- Practical Ecommerce, "Do Social Share Buttons Help Ecommerce Conversions?": practicalecommerce.com (snippet)
- ShareThis, private sharing and dark social whitepaper (113M shares): sharethis.com (landing page read; figures gated)
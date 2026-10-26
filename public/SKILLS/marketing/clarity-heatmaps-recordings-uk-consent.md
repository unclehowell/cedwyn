# Heatmaps and session recordings (Microsoft Clarity) under UK consent rules
Harvested 2026-10-26 by the skills harvest. Free tool; proposal only until the analytics owner adopts it.

## Why
Funnel counts tell you *where* people drop (e.g. /ebooks/ view -> buy-click); recordings and heatmaps show *why*: a button nobody sees on a 390 px phone, a card people tap that isn't a link, a page they scroll past the price on.
- Microsoft's own case study (Adapt Worldwide, agency): recommendations made from Clarity recordings and heatmaps gave "an 86% uplift in conversion" for a client. Vendor-published, one client, no sample size stated: treat as an example, not a forecast. (clarity.microsoft.com)
- Clarity is free with no traffic cap and flags "dead clicks" (clicks where nothing happens: broken or non-link elements) and "rage clicks" (repeated clicks on one spot) automatically. (learn.microsoft.com; clarity.microsoft.com)
- Caution from practitioners: a dead-click rate alone isn't a verdict (one r/microsoft thread: 73% of a client's button clicks flagged, yet the page converted). Watch the recordings behind the number before changing anything.

## The 2025 consent rule (UK matters to us)
- From **31 Oct 2025** Clarity enforces consent signals for visits from the EEA, **UK** and Switzerland. Without a valid signal it runs in no-consent mode: no cookies, a new ID per page view, so every page view is a "new user", multi-page funnels break and pages/session is always 1. Heatmaps/recordings "may be limited, incomplete, or unavailable". (clarity.microsoft.com, 31 Oct 2025; learn.microsoft.com)
- Session recording is not "strictly necessary" under PECR, so in the UK it belongs behind the same Accept as analytics cookies.
- Wiring (ConsentV2, replaces the old consent API): in Clarity Settings > Setup > Advanced, turn **Cookies off**; load the tag; on Accept call
  `window.clarity('consentv2',{ad_Storage:"denied",analytics_Storage:"granted"})`; on Decline do nothing (Clarity sets no cookies). Clarity also reads Google Consent Mode if a CMP already sends it. (Analytics Mania, 13 Oct 2025, step-by-step: analyticsmania.com)

## How-to (60-minute setup, then 20 minutes a week)
1. Sign up at clarity.microsoft.com with an account the team owns; one project per site (consent is per project).
2. Masking: keep the default "Balanced" or set "Strict" so form fields (email signup) are never recorded.
3. Install the tag beside the existing beacons; add the consentv2 call to the existing consent banner's Accept handler only.
4. Verify: Accept on a test visit -> Clarity dashboard shows a recording with 2+ pages in one session; Decline -> no `_clck`/`_clsk` cookies in the browser.
5. Weekly routine (fixed, small):
   - Filter recordings: URL contains /ebooks/, device = mobile, last 7 days. Watch up to 10, 2x speed. Note each moment of hesitation in one line.
   - Open the dead-click and rage-click lists for /ebooks/, the signup page and the top story page. Anything with 3+ sessions on the same element is a candidate fix.
   - Scroll heatmap on /ebooks/: what % reach the first price/buy button? If under ~50%, move the buy row up (test, don't assume).
   - One fix per week, logged with date, so the funnel counts before/after can be compared (skills/ab-testing-small-lists.md for the read).
6. Never treat Clarity numbers as visitor totals; with consent-gating, UK decliners appear as single-page sessions. Totals come from the cookieless Cloudflare beacon.

## How we apply it to Cedwyn
- Cedwyn already has an en/cy/es consent banner (built for GA4) and the cookieless Cloudflare beacon. Clarity would hang off the same Accept: no second banner.
- First questions to answer from recordings: do mobile visitors on /ebooks/ see the free-edition link and the £9.99 buy button? Do they tap e-book covers expecting a link (dead clicks)? Does the new header upsell strip get taps?
- Owner: the analytics worker / cedwyn committer only (one committer at a time). This file is a PROPOSAL; nothing installed or signed up by the harvest.
- Low traffic is fine: even 10 recordings a week of real phones on /ebooks/ beat guessing. Don't run A/B tests off Clarity data at our volumes; use it to find obvious breakage.
- Privacy page: add one line naming Clarity, what it records (clicks, scrolls, masked text) and that it only runs after Accept.

## Sources
- clarity.microsoft.com (31 Oct 2025)
- learn.microsoft.com
- analyticsmania.com (13 Oct 2025)
- clarity.microsoft.com (86% uplift, vendor case study; page returned 403 to our fetch, figure from its search snippet)
- learn.microsoft.com ; reddit.com
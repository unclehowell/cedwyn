# Version gate without the interstitial penalty: a click-to-load "Select a version" facade in the media slot, plus a slim upgrade bar

Skills harvest 2026-11-01 ~01:30Z. Topic: funnel/CRO, gated media. Written for the site-wide version gate being built now (the project lead 01:23Z 1 Nov, m:2c93759d: an NFT image with "Select a version" and a down arrow loads instead of the video/PDF/course/merch/NFT; picking the free version loads the item; a buy reminder stays while viewing). Checked against: email-signup-forms-popups-timing.md, onsite-email-capture-slide-in-scroll-trigger-not-exit-popup.md, sticky-mobile-buy-bar-drawer-evidence-wcag.md, stop-rate-free-registration-wall-ask-after-engagement.md. None covers a gate in front of the content itself.

## What the sources show (all read 1 Nov 2026 unless marked)
- **Google Search Central, "Avoid intrusive interstitials and dialogs"** (updated 2025-12-10): interstitials (whole-page overlays) and dialogs (part-page) "may frustrate" users, "erode their trust", and "make it hard for Google ... to understand your content, which may lead to poor search performance". Its two named mistakes: "Don't obscure the entire page with interstitials" and "Don't redirect the user to a separate page for their consent or input". The fix it recommends: "use banners that take up only a small fraction of the screen". Even mandatory gates (age gates) should overlay the content, not replace it, so Google can still index it.
- **Google+ case study** (Search Central blog, 23 Jul 2015, Google's own data): a full-page app-install interstitial got 9% taps on "Get App", but **69% of visits abandoned the page** (neither app store nor website). Swapping it for a small banner gave **+17% 1-day active users** on the mobile site, and native installs were "mostly unaffected (-2%)". It is old and from one product, but it is the cleanest published A/B of a full-page promo gate against a banner.
- **RevenueCat / Phil Carter** ("Hard paywall vs. freemium: lessons from a 75% LTV lift", Sub Club): median download-to-paid is 10.7% for hard paywalls vs 2.1% for freemium (State of Subscription Apps). One app moved from a hard gate to a "multistep paywall" framed as "This product is free and will always be free, but we want you to try the best version of it" and saw **+75% LTV per user**. Another client tried the same shift and saw **over 50% fewer subscribers**, reversed within weeks. Lesson: a free tier only pays if it is good enough to build the habit but plainly smaller than the paid one. Subscription apps, not e-books, so treat it as direction, not a forecast.
- **NN/g, "Banner Blindness Revisited"**: people ignore anything that looks like an ad, through ad placement (top of the page, right rail), ad-like treatment (animation) or sitting next to ads. A persistent bar that looks like an ad will be filtered out. Plain text in the site's own type, in the content colours, is read more.
- Our own sticky-bar file (GrowthRock, read 27 Oct): a mobile scroll-only sticky buy bar gave **+6% orders** with no harm. Persistent bars work when they are small and stay out of the content's way.

## The pattern that fits all of this
1. **Gate the media slot, never the page.** Where the video player or PDF would sit, render a placeholder card the same size: the NFT image, "Select a version ↓", and the version dropdown. The page's own title, text, captions and links stay visible and crawlable above and below it. This is the web.dev "facade" pattern (a click-to-load placeholder for a heavy embed), so it also speeds the page up: the video or PDF loads only on choice.
2. **No full-screen overlay, no redirect to a chooser page.** Google names both as mistakes, and the Google+ data shows what a full-screen gate costs (69% gone).
3. **One tap to the free item, preselected.** Make the free preview the default option, so a visitor who just wants to look taps once ("Open free preview"). The dropdown teaches that versions exist. It must not become a toll.
4. **Remember the choice for the session.** The second item they open should load directly with the bar, not gate again. Repeat gates are the "annoyance" cost.
5. **The persistent bar is one line and dismissible.** Example: "Full edition: 404 pages, £4.99 · See what's added". Use the site's content colours (#f7f2e7/#fbf8f1), no animation, at the bottom on mobile, and keep it below the 2.4.11 focus-obscured limit (see the sticky-bar file). After dismissal, keep only a small text link at the end of the item.
6. **Crawlers and no-JS readers get the content.** Server-render the free item's link inside the placeholder (a plain `<a>` to the free PDF/video) and enhance with JS. Without JS the link still works. Google never meets a gate that hides the page.
7. **Items with no paid version get no gate.** A dropdown with one choice is friction with no sale behind it. Show a plain "v0.0.1" label and load directly.

## Measure (tiny traffic, so count, don't A/B)
- Per item type: placeholder views → free opens (gate pass-through), bar clicks → /ebooks/ → checkout opens.
- Gate pass-through is the annoyance alarm. If fewer than about 80% of placeholder views lead to a free open (the e-book shelf currently has about 9 downloads a day), the gate is costing readers. Simplify it to a single "Open free preview" button with the dropdown below.
- Search Console: watch clicks and impressions on the gated pages for 4 weeks after launch, against the 4 weeks before.

## How we apply it to Cedwyn
- Brief for the version-gate worker (task started 01:24Z): build the gate as an **in-slot facade** in `version-gate.js`, not a page overlay. Free option preselected, one tap to open, session memory, no gate where there is no paid version, `<noscript>`/plain-link fallback to the free file.
- The bar copy follows the copy rules: whole price with page count ("Full edition, 404 pages, £4.99"), never per-page and never "upgrade/update". The dropdown reads "v0.0.1, free preview (20 of 404 pages)" / "v0.0.2, full edition, £4.99 (404 pages)".
- Argentina-scope items: the bar shows no money words, so in that scope it links to the edition page with no price.
- Check after merge: a 390 px screenshot of a gated page shows its title and intro text above the facade, and a `curl` of the page (no JS) contains the free item's link.

## Sources
- developers.google.com (read 1 Nov 2026)
- developers.google.com (read 1 Nov 2026)
- revenuecat.com (read 1 Nov 2026)
- nngroup.com (read 1 Nov 2026)
- the project workspace (GrowthRock numbers, read 27 Oct)
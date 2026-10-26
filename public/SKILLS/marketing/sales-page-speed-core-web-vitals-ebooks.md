# Sales-page speed (Core Web Vitals) on a low-traffic e-book shop

Skill: make the pages that sell (/ebooks/ and each book page) load fast and stay still on a phone, because slow, jumpy pages lose buyers before they read the offer. Skills harvest, 26 Oct 2026.

## The evidence (web.dev "The business impact of Core Web Vitals", read in full; page last updated 1 Sep 2021, so the cases are older)
- Vodafone Italy: LCP (largest contentful paint) 31% better -> **8% more sales**. Measured with a server-side A/B test. Fixes: render the key HTML on the server, less render-blocking JavaScript, resized hero image, deferred non-critical resources.
- Tokopedia: LCP 55% better -> 23% longer average sessions (preloaded and server-rendered the LCP element, WebP, lazy-loaded only non-critical images).
- Redbus: CLS (layout shift) 1.65 -> 0 plus faster interactivity -> 80-100% higher mobile conversion rate across markets (fixed slots for page parts, removed unoptimised tag scripts).
- Short list on the same page (Google's summaries, the underlying studies not opened, so **not checked**): Agrofy 70% better LCP -> 76% less load abandonment; NIKKEI STYLE 18% better LCP -> 9% more pageviews/session; Yahoo! Japan CLS fix -> 15% more pageviews/session; Cdiscount 6% revenue uplift in a Black Friday sale.
- The quick wins Google lists behind these results: image optimisation, WebP, image CDN, preloading hero images, setting width/height or aspect-ratio, deferring third-party JS, removing render-blocking and unused JS, compression, lazy-loading only what is below the fold.
- Caveat: these are big-traffic sites. At ~11 real visits a day we cannot A/B test speed; we fix the known problems and watch field data.

## Thresholds to hit (75th percentile of real visits, mobile)
- LCP <= 2.5 s · INP <= 200 ms · CLS <= 0.1. (Standard Google thresholds; the threshold page itself was not re-read this run.)

## How to do it (one afternoon)
1. **Baseline.** PageSpeed Insights (web UI) for /ebooks/ and the bundle page, mobile; Search Console > Core Web Vitals report (field data appears only once Chrome has enough visits; low-traffic pages often show "not enough data", so use the lab numbers and Cloudflare Web Analytics' Web Vitals panel if enabled). Record LCP/INP/CLS, page weight and the LCP element.
2. **Find the LCP element.** On a book page it is usually the cover image or the headline. If it is an image: do NOT lazy-load it; add `fetchpriority="high"`; serve WebP/AVIF at the displayed size (covers rarely need more than ~600 px wide on mobile); preload it if it is set in CSS.
3. **Stop the jumps (CLS).** Every image, embed, banner and late-loading widget (guestbook, language switcher, CTA script) gets a fixed width/height or reserved min-height.
4. **Trim JavaScript.** Every script on the sales page must earn its place; add `defer` to anything not needed for the first view; load chat/guestbook/analytics after interaction or idle.
5. **Cache and compress.** Long cache headers on versioned assets (we already version with ?v=), Brotli/gzip on HTML/CSS/JS (Cloudflare does this by default; confirm in response headers).
6. **Re-measure** the same pages; log before/after in the project workspace Re-check after every theme change so speed does not regress.

## How we apply it to Cedwyn
- Quick check of /ebooks/ on 26 Oct 2026 (HTML fetch from this box, not a browser run): 80 KB HTML, 2 stylesheets, **6 external scripts** (runtime, theme, language, boot, e-book CTA, guestbook), 9 cover images all with width/height set (good for CLS) and **all 9 marked loading="lazy"**, including the first cover. If the first cover is above the fold on a phone it is likely the LCP element, and lazy-loading it delays LCP: proposal = remove `loading="lazy"` from the first one or two covers and add `fetchpriority="high"` to the first.
- Proposal: defer the guestbook script on /ebooks/ and the book pages (it is not part of buying); confirm theme.js and cta.js carry `defer`.
- The PageSpeed Insights API on this box was over its daily quota today, so no lab score was taken; next run takes the baseline in the PSI web UI before any change.
- All of this is markup/asset work, not wording: patch goes to the sole cedwyn committer (or the project workspace if another worker is committing), verified live at 390 px. It helps every visitor reach the £9.99 singles and £31.99 bundle faster; it does not create traffic.
- Public copy untouched; no banned words introduced; nothing names the owner.

## Sources
- web.dev (read in full)
- developers.google.com (search snippet only, not checked)
- web.dev (index of case studies; snippet only)
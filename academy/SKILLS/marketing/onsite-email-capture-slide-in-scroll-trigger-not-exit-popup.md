# On-site email capture: a scroll-triggered slide-in, not a full-screen or exit popup

Harvested 2026-10-29 (skills harvest). Funnel/CRO. The index had 0 skills on popups or exit intent. Cedwyn's only capture today is the inline ghf-lead block (from /ebooks/, Mailchimp double opt-in, reused as the B5 footer signup in onpage/PLAN.md).

## What the data shows (vendor benchmarks: big samples, but vendor-run; treat as direction, not law)
- **Wisepops, 2026 report (~1B displays, published 30 Sep 2025):**
  - Average signup popup conversion is **4.82%**.
  - By trigger: hover-based 13.05%, custom-event 10.35%, **scroll 5.37%**, on-landing 4.72%, **exit-intent 3.94%** (the lowest).
  - Top 10% of campaigns: on-landing 51.22%, on-exit 19.20%.
  - Mobile converts better than desktop: **4.98% vs 3.67%**.
  - By sector: ecommerce 6.88%, media 3.70%, education 2.40%, B2B 2.01%.
  - Multi-step popups: the top 10% reach 46.34%.
  - A/B testing headline, delay or format lifted CTR from 4.64% to 5.86% (up to 26%).
- **Omnisend, 2025 benchmarks (~1.24B displays):**
  - Average email popup conversion is **2.1%**; under 1.5% is weak, 5%+ is excellent.
  - **A 6–10 s delay converts best**; showing it immediately underperforms.
  - Mobile-designed popups convert at 2.2% vs desktop-only at 1.4%.
  - By trigger: scroll ~2.1%, pages-viewed ~2.3%, **exit ~1.8%**. Their reading: by the time someone is leaving, they're already disengaged.
  - Gamified popups (spin-to-win) reach 3.5%+. **Not for us:** in the UK a prize mechanic is a promotion under the CAP Code (see uk-social-giveaway-prize-draw-cap-code-meta-rules.md), and it doesn't suit an archive.
- **Google Search Central, "Avoid intrusive interstitials and dialogs" (read 29 Oct):**
  - Overlays that hide the content "may lead to poor search performance".
  - Use **banners that take a small fraction of the screen** for newsletter prompts.
  - **Don't cover the whole page**, and don't redirect to a separate page to collect input.
  - Only legally required gates (age, consent) are exempt.
- **Takeaway for a small heritage site:** engagement-based triggers (scroll depth, 2nd page viewed) beat exit intent in both datasets. And Google's rule makes a full-screen mobile modal a search risk, while most of our traffic is mobile and organic. So use a **small bottom slide-in after real reading**, not a takeover.

## The recipe
1. **Trigger:** 50–60% scroll depth on long research/wiki/story pages, **and** at least 8 s on page, **or** a 2nd page view in the session. Never on /ebooks/ or checkout pages (they already have the form) and never on the first screen.
2. **Format:** a bottom slide-in no taller than about 30% of a 390 px viewport. One line of copy, one email field, one button, and a clear ✕. No overlay dimming the page.
3. **Offer:** the existing free sample (free-sample-chapter-read-before-buy.md / lead magnet), worded as the reader's gain, e.g. "Get the first chapter of the farm's story free." No discount codes; that keeps the price anchor intact (ebook-pricing-bundles-direct.md).
4. **Frequency:** once per session. After ✕ or a signup, suppress it for 30 days. Store the flag in sessionStorage. Whether a 30-day localStorage flag needs consent under UK PECR is **not checked**; until it is, use sessionStorage only.
5. **Form:** submit to the same Mailchimp audience/form as ghf-lead (double opt-in kept), with the hidden source fields `UTMSRC=cedwyn/<theme>` and `UTMCMP=cedwyn-slidein`, so slide-in signups are counted separately from the footer.
6. **Test:** one variable at a time on our volumes (ab-testing-small-lists.md): first delay/scroll depth (50% vs 75%), then headline. Judge on confirmed signups, not form submits. Don't stop a test before a fixed sample size.
7. **Accessibility:** focus doesn't jump to the slide-in. It's reachable by keyboard and closes with Esc. `role="dialog"` with `aria-label`; contrast at least 4.5:1. Respect `prefers-reduced-motion` (no slide animation).

## How we apply it to Cedwyn
- **Status: PROPOSAL** for the project workspace It's a design change to human pages, and the onpage runner marks design changes PROPOSED. The Wednesday CEDWYN ONPAGE run builds it once approved.
- **Build:** a stdlib vanilla-JS snippet of about 60 lines, plus CSS, in one shared theme partial that reuses the ghf-lead form markup. No third-party popup SaaS (paid, adds scripts and outbound calls). Verify at 390 px: it must not cover the article heading or the /ebooks/ strip.
- **Baseline before launch:** footer signups per 1,000 non-US HTML visits (growth-report cf_traffic.py + Mailchimp), so the slide-in's lift shows in the Sunday report.
- **Kill rule:** if confirmed slide-in signups stay under 0.5% of exposed sessions after 2 weeks, or the Search Console clicks trend falls on the pages carrying it, remove it.

## Sources (read 29 Oct 2026)
- Wisepops, "20+ Popup Statistics 2026 [Based on 1B Displays]" (P. Lawrowski, 30 Sep 2025): wisepops.com
- Omnisend, "Email popup statistics" 2025 benchmarks: omnisend.com
- Google Search Central, "Avoid intrusive interstitials and dialogs": developers.google.com
- Internal: the project workspace (B5 signup block); live homepage fetch 29 Oct (curl)
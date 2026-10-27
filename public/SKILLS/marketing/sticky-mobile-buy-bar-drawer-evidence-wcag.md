# Sticky mobile buy bar: when it lifts sales, when it does not, and how not to break accessibility

Skill harvested 27 Oct 2026 (06:12Z). Topic: funnel/CRO, mobile product pages.

## The evidence (read 27 Oct 2026)
**GrowthRock, "Sticky Add to Cart Button Example: Actual AB Test Results"** (CRO agency, real client tests):
- **Desktop test**: a sticky add-to-cart area gave **7.9% more orders** from product pages, at 99% significance. The client sold a content-heavy product (lots of reading about uses and ingredients), and the always-visible button "did not annoy the customers."
- **Mobile, three-arm test** (14 days, over 3,000 orders per arm, over 9,000 in total):
  - A: no sticky button (control).
  - B: sticky bar that only **scrolls** the shopper back to the buy area: add-to-cart clicks +6%, but **no statistically significant change in orders**.
  - C: sticky button that **slides the buy panel up from the bottom like a drawer**: add-to-cart clicks **+11.8%** (>99% sig), orders **+5.2%** (98% sig).
- Their reading (from a reader comment they endorse): the drawer keeps the shopper focused on choosing options, as if in a sub-page, instead of dumping them back mid-page.
- These are one agency's client results on a supplement shop with high traffic, not checked by anyone independent. They show the *shape* that worked, not a number to expect.

**W3C WCAG 2.2, Success Criterion 2.4.11 Focus Not Obscured (Minimum), level AA**: "When a user interface component receives keyboard focus, the component is not entirely hidden due to author-created content." The Understanding page names "sticky footers, sticky headers, and non-modal dialogs" as the typical cause.

## How to build one well
1. **Show it only on small screens** (for example `max-width: 600px`) and only after the native buy block has scrolled out of view. Use `IntersectionObserver` on the native block; hide the bar again when the block is back on screen, so there are never two buy buttons visible.
2. **Make it open the choice, not just scroll**: tapping opens a bottom sheet with the version picker, price and the pay button (GrowthRock's arm C). A scroll-only bar was the arm that did not move orders.
3. **Content**: product short name, current version and price, one button. One quiet secondary link is fine (for Cedwyn, the free version). No timers, no "only N left", no fake counts (see `uk-dmcc-act-urgency-reviews-price-copy.md`).
4. **Accessibility**: add `scroll-padding-bottom` equal to the bar's height so focused links are never hidden under it (WCAG 2.4.11); give the bar a real `<button>`; make the sheet a proper dialog (focus moves in, Esc and a close button work, focus returns on close); tap target at least 44 px; respect `env(safe-area-inset-bottom)` on iPhones.
5. **Don't stack overlays**: hide the bar while a cookie banner, the preview pop-up or the sheet itself is open.
6. **Keep it light**: CSS plus about 30 lines of vanilla JS. No library needed.

## How to measure at our size
- At Cedwyn's traffic an A/B test cannot reach significance (see `ab-testing-small-lists.md`). Ship it as a usability fix, annotate the date (`search-console-ga4-change-annotations-log.md`), and compare clicks on Stripe links per 100 e-book page views over 4-week periods before and after, labelled as a before/after read, not a test result.
- Check it in a 5-user test first (`small-sample-usability-tests-buy-path-5-users.md`): do people notice it, and does it get in the way of reading?

## How we apply it to Cedwyn (proposal; nothing changed)
- **Checked live 27 Oct 2026 06:10Z**: cedwyn.bucklerfamily.estate (82 KB of HTML) has 9 Stripe links and no sticky buy bar. Its only `position: fixed` rules belong to the preview pop-up (`.edp-mod`, `.edp-full`).
- **Proposal for each single-book page** (not the /ebooks/ index, which is a list): at 390 px, once the buy block scrolls away, a bottom bar reading "<Book> · v0.0.2 · £4.99 [Buy]" with a small "free version" link. [Buy] opens a sheet with the version drop-down (defaulting to latest, as now) and the existing Stripe Payment Link.
- Respect the semver work (a worker owns the drop-down and price markup): read the price from the same data, never hard-code £4.99.
- Owner: a future site-flywheel or ONPAGE run, as a PROPOSED item, after the semver build is live.

## Sources
- growthrock.co
- w3.org
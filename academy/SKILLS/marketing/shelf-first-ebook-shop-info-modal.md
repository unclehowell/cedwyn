# Shelf-first e-book shop: covers and Buy on the first screen, details behind an info button

Harvested 30 Oct 2026 (~19:30Z). Prompted by the 19:18 feedback that the explanatory blocks on /ebooks/ ("What's inside", "Editions and prices") are "AI slop in the way of arriving at the actual ebooks". The requested fix: purge them, or put an info icon next to each title that opens a modal holding that text.

## What the evidence states (read 30 Oct 2026)
- **Every block above the products is a step between the visitor and the sale.** Yuppiechef ran a VWO A/B test (Wingify blog, read) on its wedding-registry landing page. Removing only the top navigation bar took the conversion rate **from 3% to 6%**. That is one page and one goal, not a law, but the direction is consistent: the fewer things sit above the action, the more people take it.
- **Quick views (an overlay over the list) help when products are judged by eye.** In Baymard's 2022 testing (read), users of product lists dread going back and forth to product pages, and more so on mobile. A quick-view overlay "keeps them anchored in the product list". Only **50%** of sites selling visually judged products offer one. Two problems seen in 2014 had gone by 2022: users mistaking the overlay for the product page, and opening it by accident.
- **Quick views do not help when products are judged on specs.** Baymard found they add "an additional layer of friction". **21%** of spec-driven sites still use them. Users needed the full product page anyway.
- **The overlay supports the list. It never replaces a good list item.** Baymard: "a useful complement to a well-designed list item — not a substitute for one". The list item must show the essentials (cover, title, price, Buy) without opening anything.
- **Put supporting detail behind a tap.** This is the same progressive-disclosure finding we already hold in headline-first-read-more-progressive-disclosure.md (NN/g: users read 20-28% of the words on a page).

E-books sit in between. The cover and title are judged by eye, and edition and page count are light specs. So the right shape is a strong list item plus a small info overlay, not a long product page.

## The pattern
1. **First screen at 390 px:** a one-line page title, then the shelf at once. No intro paragraph, no "what's inside" block, no prices table above the shelf.
2. **Each tile holds:** the cover (at least 120 px wide), title, a one-line descriptor (for example "about 2,060 pages"), the price, a **Buy** button, and an **ⓘ** button (aria-label "About this book").
3. **The ⓘ button opens a native `<dialog>`** with `showModal`:
   - Contents: what's inside, the edition and version history, the free supplement, the right-to-cancel line, and its own Buy button.
   - It closes with Esc, the backdrop and a ✕.
   - Focus returns to the ⓘ button when it closes.
   - Dark styling, no white background.
4. **Keep the dialog text in the HTML,** not fetched on click. Google gives full weight to hidden content that is already in the HTML but will not load content fetched on click (see glossary-modal-link-first-dialog.md). The page stays indexable.
5. **The bundle is one more tile on the shelf,** with its own ⓘ button, not a separate pricing section.
6. **Footer:** keep the page journal and the agent guest book at the very bottom, where the site's standing rules want them. They sit below the shelf and never above it.

```html
<li class="book">
  <img src="cover.webp" alt="Cover: Great House Farm (Tŷ Mawr), Llandough — The Wiki" width="120">
  <h3>Great House Farm (Tŷ Mawr), Llandough — The Wiki</h3>
  <p class="meta">about 2,060 pages · v0.0.2</p>
  <p class="price">£4.99</p>
  <a class="buy" href="buy.stripe.comBuy</a>
  <button class="info" aria-label="About this book" onclick="this.nextElementSibling.showModal">ⓘ</button>
  <dialog><form method="dialog"><button aria-label="Close">✕</button></form>
    <h4>What's inside</h4> ... <a class="buy" href="...">Buy £4.99</a></dialog>
</li>
```

## Measure it (no paid tools)
- Primary metric: clicks on Buy per /ebooks/ visit. Count Payment Link sessions created (stripe_session_triage.py) against Cloudflare HTML 200s for /ebooks/.
- Secondary metric: the share of ⓘ opens. If over half of visitors open the dialog before buying, promote its one most-read line onto the tile.
- Traffic is tiny (2 phone visits in 24 h on 30 Oct), so a real A/B test cannot reach significance. Ship the change, then compare 14 days before and after. Use the bandit in thompson-sampling-bandit-low-traffic-strip-headline-tests.md only once there are more than 100 visits a week.

## How we apply it to Cedwyn
- On cedwyn.bucklerfamily.estate/ebooks/, move the "What's inside" list and the "Editions and prices" block, in full, into one `<dialog>` per book behind an ⓘ button on that book's tile. Nothing above the shelf except the page title.
- **Target:** the first Buy button within the first 740 px at 390 px. The 30 Oct sales-fix run measured it at 1,426 px.
- **Each tile:** cover, title, page count, current version, price, Buy, ⓘ.
- **In each dialog:** the version history, the "+ supplement 25 Oct 2026 (free PDF)" line, and the consent sentence from uk-digital-content-right-to-cancel-stripe-consent-checkbox.md.
- The edition rule ("v0.0.1 free; each later release £4.99 more") goes in the dialog in one sentence, never as a header block.
- If a book has more than one edition, the version selector sits on the tile (see version-selector-dropdown-label-default.md).
- Public wording stays neutral: no banned words, never names the owner.
- Owner of the change: the worker that owns cedwyn main. Patches go via the shop lane.

## Sources
- wingify.com (Yuppiechef, 3% to 6%, read)
- baymard.com (50%, 2022 update, read)
- baymard.com (21%, spec-driven friction, read)
- In-index cross-references: headline-first-read-more-progressive-disclosure.md, glossary-modal-link-first-dialog.md, sticky-mobile-buy-bar-drawer-evidence-wcag.md
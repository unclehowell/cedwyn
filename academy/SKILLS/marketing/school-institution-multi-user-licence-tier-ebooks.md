# School / institution licence tier for e-books and resources (multi-user pricing)

Skill date: 29 Oct 2026 (skills harvest 23:30Z). Status for Cedwyn: PROPOSAL only. Prices are the owner's decision, and nothing has been listed or sent.

## What practitioners and platforms report
- **Tes "School Licence"** (Tes Selling Resources FAQ, read in full): every paid resource automatically offers a multi-user licence, shown as "School Licence" beneath Buy Now. It allows sharing within the buyer's institution and "can be purchased using school budgets".
  - **Price = 3.5x the single licence.** Tes based this on "the average number of teachers who would access an individual resource within a school (3 - 5)" and on "direct research with 100 budget holders and Heads of Department".
  - The author earns the same royalty % on either licence. A 20p transaction fee applies under £3.
- **TPT (Teachers Pay Teachers) multiple licences** (help article 360042537132; page blocked our reader, snippet only): "The first license is sold at full price, and each additional license is typically discounted (usually around 10% off)." It is sold per teacher, with the seller setting the discount.
- **Cambridge (Early Years/Primary catalogue 2025, snippet):** "Each resource is sold as a site licence and accessed via Cambridge GO". Big publishers sell one price per site, not per seat.
- **Firefly Education school licence order form** (snippet): the licence runs to a fixed date ("valid until 31 December 2027"). Institutional licences are often annual or fixed-term, which suits school budget years.
- **PLD Literacy** (support article, snippet): a "Whole School" price is shown on the product page itself. Buyers expect to see it without asking.
- **Stripe Payment Links** (docs.stripe.com, snippet): Payment page > Product > "Let customers adjust quantity". One link can sell N seats without new code. Checkout Sessions take `adjustable_quantity`.

## The playbook
1. **Two prices on every paid item:** Personal and Institution (school, library, society, museum). Tes's 3.5x is the best-evidenced anchor, from 100 budget holders and 3–5 users per school.
2. **The institution licence covers one organisation:** staff and pupils or members on site or on its intranet. No public reposting, and credit the source. Write it in ten plain lines and link it under the button.
3. **Show it on the page.** Put the institution price under the personal Buy button, the way Tes and PLD do. No "contact us for pricing".
4. **Make school buying easy:** an invoice or receipt with the organisation name (Stripe collects it via "collect business name"/tax ID fields), and a PDF of the licence terms. Many schools pay by budget or card, not by personal PayPal.
5. **Per-seat option (TPT style):** for small groups such as a reading group or a society committee, offer quantity with Stripe adjustable quantity at a ~10% discount per extra seat. Use either per-seat or the 3.5x flat price, not both on one product, to avoid a confusing choice.
6. **Fixed term only where content updates.** A licence that includes updates can run to 31 Dec of next year. A one-off file is perpetual.
7. **Measure:** institution sales ÷ personal sales per item, and the visits that came from teacher, library or society pages. Hold the price for 60 days before changing it (see `ebook-pricing-bundles-direct.md`).

## How we apply it to Cedwyn
- **Fit with the owner's version rule (29 Oct 2026).** v0.0.1 of every e-book and documentary is free for everyone, schools included. No licence is needed to use it: schools get the free version openly with a credit line. The institution tier applies only to paid versions.
  - **Proposal:** Institution price = 3.5x the personal price of that version. For example, the first paid version at £4.99 becomes about £17.47, which rounds to **£17.50**. The owner decides the price before anything goes live.
- **Who buys it:** Vale of Glamorgan and Cardiff schools teaching Curriculum for Wales "cynefin" local history, local libraries' local-studies sections, and local history and family history societies. These connect to `school-resource-marketplaces-tes-hwb.md` (Tes lists the same thing with its 3.5x built in), `civic-local-history-society-talks-penarth.md` and `family-history-society-journals-forums.md`.
- **Build (when approved):** one extra Stripe Payment Link per paid version, named "Institution licence (one school/library/society)". Under the Buy button on /ebooks/ add one line: "Buying for a school, library or society? Institution licence £X". Add a short /ebooks/licence/ page with the ten-line terms. Don't create Stripe prices without the owner's GO. Existing links stay as they are.
- **Outreach:** drafts only, as HubSpot tasks addressed to role addresses at schools and libraries (heads of humanities, local-studies librarians), with the owner's sign-off. Never contact private individuals, and never send.
- **Library e-lending is separate.** Libby/BorrowBox lending goes through distributors under their own library prices (see `library-elending-overdrive-libby-via-kobo.md`). This tier is for direct institutional use.

## Sources
- tes.com (read in full, 29 Oct 2026)
- tes.com (snippet)
- help.teacherspayteachers.com (snippet; page blocked)
- issuu.com (snippet)
- fireflyeducation.com.au (snippet)
- support.pld-literacy.org (snippet)
- docs.stripe.com (snippet); docs.stripe.com (snippet)
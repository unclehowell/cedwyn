# Support / donate button for a non-charity heritage project (UK, PayPal) — what converts, what the law and PayPal require

Written 2026-10-31 by the skills harvest. Sources read tonight unless marked "snippet".

## The facts that set the frame
- **We are not a charity.** Charities Act 1992 s.63 (legislation.gov.uk, read): soliciting money "in association with a representation that the institution is a registered charity" when it is not is an offence (fine, level 5). So: never "charity", "charitable", "tax-deductible", "Gift Aid", charity logos, or a charity number. Gift Aid is for charities/CASCs only (GOV.UK "Claiming Gift Aid as a charity or CASC").
- **PayPal fees (UK fees page, "Last Updated: 1 October 2026", read):** "Standard rate for receiving domestic donations: Donation 2.9% + fixed fee"; fixed fee GBP 0.30. The charity rate (1.4% + fixed fee) is "subject to application and pre-approval" — not open to us. International donors add a percentage fee on top (EEA → UK 1.29%). A £10 gift nets about £9.41.
- **Account type (PayPal UK user agreement, read):** "Business accounts are for people and organisations ... that primarily use PayPal to receive online payments for sales or donations." A personal account can't take button donations; use the business account already receiving e-book sales.
- **PayPal acceptable use (read):** pre-approval is listed for "Collecting donations as a charity or non-profit organization". Not checked: whether PayPal would class a project "support" button as that. Safest wording is "Support the project" (a voluntary payment to a business), not "donate to a cause".

## What converts (primary test data, mostly US nonprofit pages; apply with care)
- **Baseline (M+R Benchmarks 2025, mrbenchmarks.com, read):** 11% of desktop visitors to a main donation page gave, 8% on mobile, **4% on mobile for small organisations**. Across whole sites, 1.6% of all visitors gave, about $1.33 per visitor. Mobile was 52% of traffic but only 28% of revenue. 79% of nonprofits took PayPal, 58% Google Pay, 57% Apple Pay.
- **Say why before asking (NextAfter "8 A/B tests", read):** adding a value proposition (several paragraphs on why to give) raised donor conversions by 150%.
- **Mark one amount "Most popular" (same source):** pre-selecting $50 and labelling it "most popular" raised revenue 94%, and the average gift by $11.06; strongest on mobile. Only label an amount as most popular once the data shows it is.
- **Default to monthly (NextAfter experiment, read):** defaulting the form to recurring took the conversion rate from 0.03% to 0.25% (+647.9%, 99.8% confidence, n=11,865). Average gift fell 38.1%, but revenue rose 362.6%. A second test (read) added a monthly callout box: monthly conversion went from 0.66% to 3.7% (+455%, 98.9%, n=599, mobile).
- **Suggested amounts by algorithm (Fundraise Up page, snippet):** +4.2% average gift "without hurting conversion" in a 55-day test. Vendor claim, not checked.

## The playbook
1. **Placement:** a footer band on the homepage ("Support this initiative"), plus one line on the /argentina/ replica page and /movie/. Each button links to ONE internal page, /support/, never straight out to PayPal from every page. That one page carries the why, the amounts and the honesty lines, and it can be A/B tested.
2. **/support/ page, top to bottom:**
   - One sentence on why: what the money does next. Tie it to a concrete next item, e.g. the sales-funded meter (sales-funded-research-meter-costed-archive-copy-goal.md): "the next £X pays for copies of records Y".
   - Gift array: £5 / £10 / £25 / £50, £10 pre-selected (no "most popular" label until the data shows one), plus "other amount". Offer monthly as a clearly separate option ("£5 a month keeps the research going"). Start with a monthly callout box rather than defaulting to monthly: the 38% smaller average gift and UK expectations make a hard default a test, not a launch setting.
   - Honesty block in small type: "Cedwyn is not a registered charity. Support payments are voluntary, are not tax-deductible and are not eligible for Gift Aid. They fund research, archive copies and the website." No refunds promise beyond PayPal's own process.
   - A PayPal Donate button (PayPal-hosted page, which also takes cards without a PayPal login) or a Stripe Payment Link for "Support the project" (wallets: stripe-payment-links-wallets-apple-google-pay-link.md). Mobile is 52% of traffic, so Apple Pay / Google Pay matter more than a second PayPal button.
3. **Thank-you:** PayPal's return URL goes to /support/thanks/. One line saying what happens next, and the newsletter signup (welcome flow in 1.md). Record the source with ?src=footer|replica|movie (UTM rules already in the index).
4. **Measure weekly:** clicks to /support/, PayPal completions, revenue per visitor to /support/, monthly vs one-off. Benchmark: 4–8% of /support/ visitors on mobile. Under 2% after 300 visits means the why is weak; rewrite the top paragraph first. Test one change at a time (A/B stats rules are in the index).
5. **Don't:** use countdowns or fake urgency, use a charity look or "registered" wording, show public donor names without opt-in, or mix Ko-fi (ko-fi-tips-supporter-memberships-heritage.md) and PayPal buttons on the same page. One clear choice converts better than two.

## How we apply it to Cedwyn
- **Blocker:** the project lead has to supply the PayPal business email or a PayPal.me / hosted-button link (asked 31 Oct 21:51Z). Until then, build /support/ with the button area dark. Never publish a guessed address.
- Wording ties to tonight's direction: research → better data → public interest; e-books, merch and the documentary; then advertising and compute. Public page text: "Support the Cedwyn project: research, archive copies, the replica plans and the documentary." Don't name the project lead, no banned words, internal links only. The PayPal button is a payment hand-off, not an editorial outbound link, but confirm the site's outbound-link scanner allows the paypal.com form action, or route it through a /support/go redirect.
- Fold the costs into reporting: about 2.9% + 30p per gift, plus 1.29% for EEA donors and more from further afield (Argentina-side supporters). Report net, not gross, in the Sunday growth report.
- Programme office: record "support revenue / month" as a measure of the snowball (ads, compute) that the project lead described.

## Sources
- legislation.gov.uk (read)
- gov.uk (read, title only: charities/CASCs)
- paypal.com (read; updated 1 Oct 2026)
- paypal.com (read)
- paypal.com (read)
- mrbenchmarks.com (read)
- nextafter.com (read)
- nextafter.com (read)
- nextafter.com (read)
- fundraiseup.com (snippet)
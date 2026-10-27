# Gumroad Workflows: automated buyer and subscriber emails (gated until the first $100 payout)

Skill harvested 2026-10-26 23:58 GMT (skills harvest). Scope: Gumroad's built-in email sequences (Workflows) for e-book buyers and free subscribers. Stripe abandoned-checkout recovery, the Mailchimp welcome sequence and checkout cross-sells are separate skills already in the index.

## What the primary source states (Gumroad Help Center, article 131, read in full 26 Oct 2026)

- A Workflow sends scheduled emails to a subset of your audience after a trigger. Triggers: **Purchase**, **New subscriber**, **Member cancels** (runs when the paid period ends), **New affiliate**, **Abandoned cart**.
- **Gate: "You cannot send emails until you've earned $100 after fees and received a payout."** Gumroad puts this in place to protect its email reputation. With 0 Gumroad sales, Workflows can be built and saved but will not send.
- Filters: "Has bought" (specific products), "Has not yet bought" (only ONE product allowed; a buyer who purchases it mid-sequence stops getting the rest), date purchased/joined, amount paid, and an option to include previously eligible people.
- Delays in hours, days, weeks or months after the trigger. Emails stay editable after publishing, but **apart from the name, no workflow setting can be changed once it is first published** (trigger and filters are locked; to change them, build a new workflow).
- **Abandoned cart**: one default email at a fixed 24 h, subject and copy editable, embedded product list fixed, no extra emails, no other delay; never repeated; leaves out products the person already owns.
- Testing: a test purchase does NOT trigger a workflow. Test with a 100% discount code and a second email address.
- Sender: your profile name at an **@gumroad.com** address (no custom sending domain); replies go to your support email (or the product's own support email).

## Practitioner testimony and numbers

- Solopreneur Code (Substack, read): runs "100% of my email workflows" in Gumroad; default paid-product sequence = 0 h confirmation + day 2 "progress" email + day 7 social-proof email; free-subscriber nurture runs ~10 days before any pitch. Also adds a "From" country filter (listed in the post; not shown in the Help article, so not checked). No revenue figures given.
- Klaviyo (vendor's own data, blog read): post-purchase emails get open rates "almost 17% higher than the average email automation". Ecommerce-wide, not e-books; opens are inflated by Apple MPP (see email-subject-lines-preview-text-mpp.md), so not checked for us.
- Gumroad's own reasons in the Help article: thank-you note after each purchase, weekly course lessons, abandoned-cart reminder. No Gumroad conversion numbers are published (not checked).

## How to do it

1. Write the sequence now, publish nothing until the gate clears. Check the dashboard for "earned $100 after fees and received a payout".
2. Build the filters right first time (they lock on publish): one workflow per product family, "Has bought" = that product, "Has not yet bought" = the bundle (so bundle buyers drop out of upgrade emails).
3. Purchase sequence (per single title):
   - 0 h: thanks + how to open the file (Kindle/Kobo/Apple steps; see ebook-delivery-send-to-kindle-kobo-own-links.md) + one reply question ("What brought you to this story?", which feeds self-reported attribution).
   - Day 3: one striking record from inside the book with its catalogue ID (the e-book's own evidence, no outbound links).
   - Day 10: the bundle upgrade (difference price, see post-purchase-cross-sell-bundle-upgrade.md) and a review ask.
4. Abandoned cart: edit the default 24 h email only; plain words, no discount.
5. Test with a 100% code and a second address; read the email on a phone.
6. Measure: Gumroad shows sends/opens per workflow email; judge on bundle upgrades and replies, not opens.

## How we apply it to Cedwyn

- Today (live /ebooks/, 26 Oct 23:58): singles £9.99, a £4.99 item, bundle £31.99, free editions; 0 sales. The $100-after-fees gate means roughly 12-13 single sales on Gumroad before any workflow sends (£9.99 less Gumroad's fee; exact count depends on fee and FX, not checked). Until then the Mailchimp welcome sequence (own domain) carries all automated email.
- Prepare 3 drafts per title in the project workspace (text only), signed as the shop, no the project lead name, banned public words excluded, internal Cedwyn links only.
- Because the sender is @gumroad.com, keep Stripe + Mailchimp as the primary journey for direct buyers; use Gumroad Workflows only for Gumroad buyers so nobody gets two sequences.
- Starting an email journey is a PROPOSAL for the project lead (programme-office rule): append "Gumroad purchase workflow (3 emails/title), publish after first $100 payout" to the project workspace; never publish without his yes.

## Sources

- gumroad.com (read in full, 26 Oct 2026)
- solopreneurcode.substack.com (read)
- klaviyo.com (read; vendor data)
# Selling Cedwyn e-books as gifts: Gumroad's gift toggle, a Stripe gift field, and the Christmas window

Checked 31 Oct 2026. 'gift voucher'/'giftable'/'give as a gift' had 0 hits in INDEX before this run; the existing Christmas/advent files cover timing and content, not the gift purchase itself.

## What the platforms actually do
- **Gumroad (help article 213, read in full 31 Oct 2026):** at checkout the buyer flips "Give as a gift", enters the recipient's email and an optional personal message. The buyer gets the receipt; the recipient gets an email with the download link and the message. A previous buyer can gift again via "Purchase again". Limits: one product per gift cart; a seller can switch gifting off for all products (Checkout > Form > Gifting, "Allow customers to purchase your products as gifts"); a seller cannot gift their own product (use a 100%-off code instead). Memberships can be gifted for one billing period and do not auto-renew.
- **Stripe Payment Links (docs, read):** no gift mode, but custom fields can be added in the Dashboard: text up to 255 characters, numbers, or a dropdown (up to 10 options in the Dashboard). The values arrive with the completed payment for fulfilment. Stripe warns against using custom fields for sensitive data.
- **Kindle (Amazon help page, snippet; page blocked us with 403):** "Kindle eBooks can only be redeemed by recipients in your same country." A UK buyer cannot gift a Kindle copy to family in Argentina or the US. Our direct files have no such limit.

## Why bother (evidence, with its age)
- Vearsa (e-book distributor, blog Jan 2014, read): in trade publishing "up to 1/3 of annual sales revenue" came in the 4 weeks of December, and e-books had not captured that gift share. Old and print-led; treat as direction, not a forecast.
- Amazon press release reported by Macworld (28 Dec 2009, read): on Christmas Day 2009 customers bought more Kindle books than physical books, the effect of new devices unwrapped that day. Again old; the pattern to borrow is that 25–26 Dec is a buying day for digital, after the postal deadlines have passed.
- No 2026 practitioner case study with gift-share numbers for small direct sellers was found in this run; the decision should rest on our own log (see gate below), not on borrowed figures.

## Rules
1. **Make gifting visible, not hidden.** A gift toggle nobody sees does nothing. Put one line on the buy page from 1 Dec: "Buying for someone? Tick 'Give as a gift' at checkout and we'll email them the book with your message."
2. **Instant delivery is the selling point after the post stops.** Last-minute digital is the advantage: from the last posting dates to 25 Dec, lead with "arrives in their inbox instantly, any country".
3. **One gift path per seller.** On Gumroad use the native toggle (check it is ON in Checkout > Form). On Stripe add one optional text field "Gift for (recipient email + message)" and fulfil by hand or via the delivery gate; never ask for anything more.
4. **Measure separately.** Tag gift sales (Gumroad marks them; Stripe by the custom field) and count them on their own line in the weekly report.
5. **Gate:** keep the gift copy for next year only if gift orders are at least 1 in 10 December orders; otherwise drop it and keep the one buy-page line.

## How we apply it to Cedwyn
- Cedwyn's buy path is shop pages -> Stripe Payment Links or Gumroad -> e-book gate delivery (`the project workspace`).
- PROPOSALS (for the owner's go; nothing changed today):
  1. Confirm Gumroad's gifting switch is ON for the Cedwyn products (read-only check through the connected account at the next BIZDEV run).
  2. Add one optional custom field to each Stripe Payment Link: "Is this a gift? Recipient email and a short message" (text, 255 chars), fulfilled through the existing delivery gate.
  3. From 1 Dec 2026, one line on /ebooks/ about gifting, plus a "send it abroad" line aimed at the Welsh diaspora in Patagonia and North America, where Kindle gifting does not reach.
  4. 24–26 Dec: one short post/email "a last-minute gift that arrives instantly", linking only to /ebooks/.
- Prices stay as set; no discount is implied. No email is sent without the owner's go; public text follows the editorial rules (no banned words, never naming the owner).

## Sources
- gumroad.com (read in full)
- gumroad.com (snippet: "This will send the receipt to you, but the product to your friend")
- docs.stripe.com (read, custom fields)
- amazon.com (snippet; same-country rule)
- vearsa.com (read, Jan 2014)
- macworld.com (read, Dec 2009)
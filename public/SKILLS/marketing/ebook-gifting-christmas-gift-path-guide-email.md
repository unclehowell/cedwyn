# Gifting e-books at Christmas (and St David's Day): a gift path and a gift-guide email

Skill: make it easy for someone to BUY an e-book for someone else, then tell the list, in time for the gift season. Gift buyers are stuck on "what do I give and will it arrive in time", not on price; a digital gift answers "in time" up to the last minute. Skills harvest, 26 Oct 2026.

## The evidence (honest: no sales figures found)
- **Gumroad has a native gift checkout:** at checkout the buyer flips "Give as a gift", enters the recipient's email and an optional message; the recipient gets the product. (Gumroad help page: the page body did not load here, wording from the search snippet only, **not checked**; confirm in the dashboard before relying on it.)
- **Practitioner testimony (Indie Hackers, a Gumroad author, read):** a magazine wanted to buy his book as a contest prize, have the receipt for accounting and the book sent to the winner; he sent Gumroad's gift help link and "a couple of hours later, the money was in the bank", and he gained both emails. One sale, no wider numbers.
- **Stripe Checkout / Payment Links custom fields (Stripe docs, read):** up to 3 fields, text up to 255 characters, dropdowns up to 200 options, data visible after payment for fulfilment. Stripe's own caution: do not use custom fields to collect personal or sensitive data. A recipient's email is personal data, so on Stripe use a **non-personal** field (e.g. a dropdown "This is a gift: yes/no") and send the buyer a printable gift card + the download, rather than collecting a third party's address.
- **Gift-guide email practice (Emiel Dingemans, Magicianly, agency founder, updated Oct 2026; read in part):** no discount needed in December because gift buyers ask "what, for whom, how much, in time?"; one angle per email; 3-5 picks with one line each on why it makes a good gift, price shown, proof (a review, ideally from a gift buyer); send in phases (value-led before Black Friday, gift-guide season early Dec to shipping cut-off, then "what can still arrive in time": digital products). No figures given.
- No case study with numbers for gifted heritage e-books was found this run.

## How to do it
1. **Gift path.** One page /ebooks/gift/ (en/cy/es): who each book suits (one line each), price, "delivered instantly by email, even on Christmas Eve", and the buy buttons.
   - Gumroad: link straight to the product with the gift toggle explained ("tick Give as a gift at checkout").
   - Stripe: buyer receives the e-book link plus a one-page printable/forwardable **gift card PDF** ("A gift for you: <title>. Your copy: <link>"). Add a dropdown custom field "Gift? yes/no" only to tailor the receipt; collect no recipient data.
2. **Gift card PDF** per book and for the bundle: title, cover, one line on the book, the free-edition line, space for "To/From". Made locally from HTML.
3. **Gift-guide email** (Mailchimp, 2 sends): early December "Gifts for someone who loves Welsh history" (3 picks max: the bundle + two singles, one reason each, price shown) and a last-minute send ~20-22 Dec "Still in time: e-books arrive instantly". UTM: utm_source=mailchimp&utm_campaign=gift-2026.
4. **Social**: one post/reel per send pointing to /ebooks/gift/ (link in first comment where links are throttled).
5. **St David's Day (1 March)** repeat with the same page and a Welsh-language angle; 28 July (Gŵyl y Glaniad, the Welsh landing in Chubut) for the Spanish page (see heritage-anniversary-hashtag-calendar.md).
6. **Measure**: gift-page visits, Gumroad gift purchases (Gumroad marks gift sales; also visible in the sales CSV), Stripe orders with Gift=yes, refunds.

## How we apply it to Cedwyn (PROPOSAL; any page, pricing or email change needs the owner's GO)
- Prices stay as they are (£9.99 singles, £31.99 bundle); no Christmas discount proposed. The bundle is the natural gift pick ("all four, one gift").
- One-line reasons drafted from the records: "For anyone who grew up near Llandough: the farm's story from the first record mention found (the 1824 David Stewart survey) to its demolition." / "The family acquired Tŷ Mawr in 1667 (1974 newspapers; ITV News 1988)." No Bute-era dates.
- Draft the /ebooks/gift/ page and the two Mailchimp campaigns as drafts only (page patch to the sole cedwyn committer or the project workspace; Mailchimp as unsent drafts; plan as a HubSpot [BIZDEV] task dated w/c 30 Nov 2026). Nothing is sent from here.
- Public text: banned-words check, never name the owner, Cedwyn internal links only, purchases via /ebooks/.

## Sources
- gumroad.com (snippet only, not checked)
- indiehackers.com (read)
- docs.stripe.com (read)
- magicianly.com (read in part)
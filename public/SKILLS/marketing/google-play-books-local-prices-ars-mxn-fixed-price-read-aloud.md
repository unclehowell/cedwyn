# Google Play Books: local-currency prices for MXN/ARS, fixed-price countries, and read-aloud (no publisher switch)

Harvested 31 Oct 2026 (skills harvest). It adds to `google-play-books-partner-center-ebooks.md`, which covers the 70% share and signup. This file covers prices per currency, which countries a UK publisher can actually sell into, and read-aloud. Proposals only: nothing was listed or priced.

## What the pages say (read 31 Oct 2026)
- **Countries table** (support.google.com, read). The *Purchases* column states where buyers can buy; *Seller sign-ups* states where publishers can open accounts.
  - **United Kingdom:** GBP. Sign-up, promo codes, auto-narration, purchases and payments are all ✔. So a UK publisher qualifies.
  - **Mexico:** MXN, all ✔. **Spain:** EUR, all ✔. **United States:** USD, all ✔.
  - **Argentina:** buyers ✔, in **ARS**. Seller sign-up is e-book only, and payouts there are USD (★).
  - **Chile (CLP), Colombia (COP), Peru (PEN):** buyers ✔, local sellers ✘. **Uruguay, Ecuador, Panama, Venezuela:** buyers ✔, priced in **USD**.
  - **Our reading:** a GBP account can sell La visita to buyers across Latin America. Whether each country carries our title depends on the prices we set (below).
- **Step 6, Provide prices** (answer 4491805, read). Each price has three parts: currency, amount and countries. "Google needs a price in the local currency for each country where you want to sell the book." A price of zero makes the book free. Revenue share is always on the list price you give.
- **Currency conversion** (answer 2986594, read).
  - Accounts created after July 2014 have conversion **on by default**, so one base price (for example GBP) is converted for every other country.
  - **A price you type in the local currency overrides the converted one.**
  - "Converted prices should not be used in countries where book prices are fixed by law. If fixed prices apply for a country, you must provide that price in the local currency."
  - Turning conversion off removes the book from sale wherever no local price exists.
  - Fixed-price promo codes need conversion switched on.
  - In ONIX, converted prices are price type 01 (tax-inclusive countries) or 02 (tax-exclusive).
- **Fixed-price countries that matter to us:**
  - **Argentina:** Law 25.542 (2001) requires every retailer, online included, to sell a new title at the publisher's single price. Rio Times, 21 Jul 2026, reports a push to scrap it; whether it has been repealed is **not checked**.
  - **Spain:** fixed book price under Ley 10/2007. That it covers e-books is our understanding, **not checked** against the statute today.
  - In both countries, type a local price; don't rely on conversion.
- **Read-aloud** (Play Books help 11938821, read):
  - Read Aloud is a feature of the Play Books mobile app, under Menu › Read aloud, with an "Automatically read aloud" setting.
  - It works **only in flowing-text mode**, so a reflowable EPUB is needed; a PDF or fixed layout won't do.
  - It uses the device's default text-to-speech engine and voice. You pick the language and locale under Android Settings › Accessibility › Text-to-speech output. A "more natural reading voice" option needs a connection.
- **No publisher-side read-aloud switch was found.** A site search of the Partner Center help for "text-to-speech" returns only the auto-narrated *audiobook* tool. A search for "read aloud" returns the EAA FAQ (answer 16349906), which calls screen readers an OS feature on reflowable e-books.
  - Unlike Kobo (`tts-permission-onix-list145-code05-kobo-writing-life.md`), there is no per-title toggle to set.
  - A Facebook "answers" snippet assertions "publisher restrictions" can hide Read Aloud. That is **secondary and not checked**, so treat it as unconfirmed.
- **Accessibility metadata** (EAA FAQ, read): "We don't support delivery of accessibility metadata in the epub file itself." Google reads it only from ONIX (List 196, plus hazards from List 143), from Partner Center › Book settings, or from CSV.
  - So the a11y tags in our EPUB do **not** reach the Google listing; they have to be entered in Book settings as well.

## How-to (one title, small UK publisher)
1. Keep conversion on, with the base price in **GBP**.
2. Then add **typed local prices** that override it:
   - **ARS** (fixed price by law; also avoids the 30% card surcharge on our GBP checkout, see `argentina-card-surcharges-30pct-ebook-checkout-es.md`)
   - **EUR for Spain** (fixed price)
   - **MXN** (a clean .99-style ending, matched to Kobo)
3. Leave CL, CO, PE and UY on conversion. They're small markets, and conversion keeps the title on sale there.
4. Recheck ARS against the exchange rate monthly, because a typed ARS price doesn't move with inflation. Don't change it more often than the fixed-price rule tolerates.
5. Upload a **reflowable EPUB**, so Read Aloud and screen readers work.
6. Re-enter the accessibility summary in Book settings, because Google ignores it inside the EPUB.
7. Listen test: on an Android phone, open the title, choose Menu › Read aloud and play a page with Welsh names. The voice follows the phone's TTS language, not our `lang` tags (our inference from the help page). Make no "listen on Google Play" claim until the test passes.

## How we apply it to Cedwyn
- **PROPOSAL A (no spend):** when La visita goes to Google Play, set these prices by hand: GBP base, **ARS** (fixed-price country, cheaper for Chubut buyers than our GBP checkout), **EUR for Spain** in the same €5–7.99 band as Kobo, and **MXN 99–129**, matching `mexico-spanish-ebook-kobo-mxn-amazon-mx-35pct-gandhi.md`. Keep each list price equal to our own direct price, so no store undercuts the shop.
- **PROPOSAL B:** add a "Google Book settings" line to the EPUB QA checklist: accessibility summary entered by hand, layout reflowable.
- **PROPOSAL C:** add a read-aloud check on an Android phone before any shop copy states "listen on Google Play". Expect Welsh place names spoken in a Spanish or English voice, because Google offers no per-title fix. The `lang="cy"` spans help Thorium and screen readers, not Play Books Read Aloud (our inference).
- Cuts against: Google is the lowest-priority wide store for UK readers (publishing.co.uk, in the existing file). Its value here is Android-heavy Latin America.

## Sources
- support.google.com (countries table, read)
- support.google.com (Step 6, prices, read)
- support.google.com (currency conversion, read)
- support.google.com (Read Aloud, read)
- support.google.com (EAA FAQ for publishers, read)
- riotimesonline.com (Law 25.542, 21 Jul 2026, read)
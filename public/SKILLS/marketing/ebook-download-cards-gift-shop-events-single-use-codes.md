# E-book download cards for heritage gift shops and events (single-use codes, free route)
Harvested 29 Oct 2026 23:15Z (skills harvest). Topic: letting someone **buy or be given an e-book in person** - a museum/heritage gift-shop counter, a talk, Open Doors, a market stall - with a physical card carrying a code that works once. Complements local-shop-consignment-paperback-sale-or-return-uk.md (printed books on consignment) and qr-codes-print-placement-own-redirects-honest-counts.md (same QR on every card). Per-channel promo codes for attribution are in stripe-promo-codes-per-channel-utm-passthrough.md; this is the **unique, one-use** case.

## What the sources show (read 29 Oct 2026)
- **The format is established among indie authors.** BookFunnel help, "Print Codes" (read): unique e-book/audiobook codes printed on "bookmarks, postcards, flyers"; "each code is good for one download and once it is redeemed, it can't be used again"; uses include selling the e-book at signings, slipping a bonus e-book into a print buyer's bag, a sample on a business card; one code can deliver a **bundle**; codes can expire on a date or run indefinitely; the reader enters the code on a redeem page, gives an email (watermarking) and is *invited* to join the list - opt-in cannot be forced with a code. Generating codes is free, but BookFunnel itself is a **paid plan** (downloads count against it) - reference only, we do not buy it.
- **What sells at a table (BookFunnel blog, 17 Sep 2026, from their Author Direct Sales Survey, read):** start small and local (markets, community and library-adjacent events); a passive **QR sign on the table** for the free book/newsletter beats handing out flyers ("a card in someone's pocket is a card they forget"); a pitch under 30 seconds; take tap-to-pay on a phone. So: the QR sign is for signups; the **code card is the thing handed over after payment**, when it is a receipt, not a flyer.
- **Museum shops make money when the shop is in the museum's own comms.** Digital Culture Network case study, Museum of London (Rita Rooney, Buying & Merchandising Manager, read): after featuring shop products in monthly museum emails and starting a shop newsletter, email-driven sales went Oct 4 campaigns -> 20 sales, GBP 673.15; Nov 8 -> 57, GBP 2,077.46; Dec 7 -> 142, GBP 4,122.21 (online shop up 144% overall). For a partner gift shop, the ask is a mention in *their* channels, not just shelf space.
- **Free single-use mechanics we already have:** Gumroad discount codes have "Limit quantity" (total uses) and "Limit the validity period" (Gumroad Help, snippet - not read in full); Stripe promotion codes support redemption caps and expiry (Stripe docs, already recorded in the Stripe promo-codes skill). A 100%-off code with a cap of 1 = a single-use download code. Whether a GBP 0 checkout completes on our exact Stripe Payment Link setup is **not checked** - test once with a live link before printing.

## The playbook
1. **Decide the deal shape** per venue: (a) the venue sells the card at the counter (they keep a cut, wholesale-style); (b) we give cards free with a donation/visit as a goodwill gift; (c) bonus card with a printed item. Keep (a) simple: fixed price on the card, the venue's own till, monthly settlement on the cards sold.
2. **Generate a batch of unique codes** (`tools/code_cards.py --batch <VENUE-A> --n 40 --url <redeem URL> --title "<book>" --out <dir>`): writes a CSV (code, batch, created, status) and a printable A4 sheet, 8 cards per page, with a QR per card (segno) and the code in large unambiguous characters (no 0/O/1/I/L).
3. **Create the matching codes in the shop** - Stripe: one 100%-off coupon per title, one promotion code per card with max redemptions 1 and an expiry; or Gumroad: one discount per card with Limit quantity 1. Batch prefix = venue, so sales per venue are countable without cookies.
4. **Card copy:** title, one line on what the book is, the code, the redeem URL in plain text, "One download. Code works once.", and the free-newsletter line. Bilingual if the venue is in Wales (bilingual-welsh-english-layout-posts-cards-email.md).
5. **Track:** mark each code issued/redeemed in the CSV; per-batch redemption rate = redeemed / issued. Reconcile monthly with the venue.
6. **Ask the venue for one mention in their channels** (newsletter, socials) - the Museum of London numbers show that is where shop sales move.

## Numbers and kill rule
- Pilot: 40 cards at one venue for 8 weeks. Success = at least 10 redeemed and at least 2 newsletter signups from the batch. Under 5 redeemed in 8 weeks: stop at that venue, keep the codes valid until expiry.

## How we apply it to Cedwyn
- **Use cases:** talk nights (cowbridge-history-society-talk-route.md, library-venue-talk-vale-libraries-booking.md), Open Doors (open-doors-cadw-heritage-open-days-event.md), and a heritage/museum gift shop or visitor centre in the Vale or Cardiff if one agrees (companies only).
- **Redeem path:** the card points to a Cedwyn /ebooks/ (or a /redeem/ page if one is built) with the code prefilled where the checkout supports it; purchases stay inside /ebooks/ per RULES.md. UTM: utm_medium=print&utm_source=card&utm_campaign=<batch>.
- **Gates (all the project lead's):** any venue approach is a HubSpot draft for the project lead to review and send himself; the card price and any venue cut are pricing decisions -> proposal in QUEUE-after-framing.md; printing costs money -> zero spend means we hand over a print-ready PDF/HTML, and the project lead decides whether to print. Card text never names the project lead, no banned words, nothing about family holdings or addresses.
- **Test before print:** one test code end to end (create -> redeem -> file delivered -> code dead on second try) and record the result in the project workspace before any batch.

## Tool
- `skills/tools/code_cards.py` (stdlib; QR via segno 1.6.6, installed 29 Oct 2026, ~0.6 MB, pip --user). Makes codes + printable sheet only; no network calls, no shop changes.

## Sources
- BookFunnel help, Print Codes: authors.bookfunnel.com
- BookFunnel blog, Sell at In-Person Events: Getting Started Guide for Authors, 17 Sep 2026: blog.bookfunnel.com
- Digital Culture Network, Case Study: Museum of London's online shop sales increased by 144%: digitalculturenetwork.org.uk
- Gumroad Help, Discount codes (snippet): gumroad.com
- CultureHive, Beyond the gift shop (snippet, QR purchase from displays): culturehive.co.uk
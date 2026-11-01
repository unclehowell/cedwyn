# Selling the e-book in the room: QR payment link first, phone tap-to-pay as backup (UK, 2026)

Topic: how to take money for a digital product at a talk, stall or walk, with no card reader to buy and the e-book delivered on the spot. Harvested 2026-11-01 (skills harvest ~02:45Z). Fees read from the providers' own UK pages this run.

## The numbers (read this run)
| Route | Fee (UK cards) | On a £4.99 sale | Hardware | Delivery of the e-book |
|---|---|---|---|---|
| Stripe Payment Link on a QR (buyer pays on their own phone) | 1.5% + 20p (stripe.com) | ~27p (5.5%) | none | automatic: checkout email/redirect |
| SumUp Tap to Pay (seller's phone takes the card) | 1.69%, no monthly fee; Tap to Pay "£0" to start (sumup.com compare page; comparecardfees.co.uk) | ~8p (1.7%) | none (Air reader £39 + VAT optional) | manual: you must hand over access |
| Zettle / PayPal POS Tap to Pay | 1.75% "same rate... even American Express" (zettle.com) | ~9p | none | manual |
| Square Tap to Pay | 1.75% (as stated on SumUp's comparison page) | ~9p | none | manual |
| Stripe Tap to Pay | needs the Terminal SDK in an app; not a no-code option for us (stripe.com) | n/a | n/a | n/a |

Takeaway: at e-book prices the fixed 20p makes the payment link the dearest route per sale (about 3x tap-to-pay), but it is the only one that delivers the file by itself and lets 20 people pay at once instead of queueing at one phone.

## Practitioner testimony
- Tom Antion (via Author Training Programs, "Back of the Room Sales"): told he could not sell to an audience of 400, he put a book on every chair and referred to it through the talk; "more than half of the audience insisted on purchasing". One anecdote, not checked; a physical book on the chair is the mechanism, not the pitch.
- IngramSpark speaking guide: back-of-room table at the end, and "also mention online retailers for those who prefer ebooks" — the e-book is the overflow route, so make that route one scan.
- Same ATP piece: reading a specific passage that proves the book's value beat pitching every 30 minutes, which "the audience [may] take offense" at.
- Earlier skill files hold the honest base rate: no practitioner gave a scan or purchase rate per talk; one WI author had "yet to sell a book after a talk". Measure, do not assume.

## How to do it
1. **Default: one QR, one payment link per venue.** The link carries that venue's promotion code (see stripe-promo-codes-per-channel-utm-passthrough.md) so sales are counted per talk. The QR goes on the last slide, on the handout and on a table card. Leave the last slide up during questions.
2. **Read a passage, then show the QR.** One page from the book (a record, a map) that ends on a question the book answers. Then: "It is £x on your phone now; the QR is on the screen and on the sheet."
3. **Backup for people without a smartphone or who prefer card: phone tap-to-pay.** Install the SumUp (1.69%) or PayPal POS (1.75%) app, verify the account before the day (identity checks can take days), and test a £1 tap at home. UK contactless works with no PIN for most cards up to £100.
4. **Deliver tap-to-pay sales the same evening.** Write the buyer's email on a numbered slip (with the consent line in step 5) and send the download within 24 h, or hand over a printed download card with a single-use code if the shop supports pre-minted codes (check before printing). Never promise "instant" for this route.
5. **Consent at the till.** Use the e-mail only to deliver what they bought, unless they tick a separate, unticked box for news (UK GDPR Art. 6(1)(a) + PECR reg. 22, as set out in Seaty's UK event-organiser GDPR guide; Friends of the Earth groups guidance: a paper sheet must state that ticking the box means emails). ICO's own PECR page returned 503 from this box this run; its search snippet confirms the products-and-services soft opt-in is open to all organisations.
6. **Ask the host first.** Some venues (libraries, churches, u3a) do not allow selling in the room. Then the QR stays on the slide as "more in the book", with no till.
7. **Count within 7 days:** attendees, QR scans (UTM), link sales, tap sales. Keep a venue if it hits the repeat bar already set in the talk files (20 attendees, 5 sign-ups or 1 sale).

## How we apply it to Cedwyn
- Every talk route already in the index (societies, u3a, Probus, Rotary, libraries, the walk) gets one payment link with its own promotion code, plus a QR on the shared deck's last slide and on the A5 handout. Price is the shop's existing price; no new price.
- Tap-to-pay is a PROPOSAL for the owner: a SumUp or PayPal POS account is in his name with his ID, so it needs his GO and his sign-up. No spend: no reader bought.
- Delivery for tap-to-pay buyers: check if the existing access-code box (movie/e-book pages) can take pre-minted single-use codes; if yes, print 20 codes per talk on download cards; if no, deliver by email within 24 h from the drafts flow (owner sends).
- Public wording on the slide/handout must avoid the banned words and never name the owner; e.g. "Read the records yourself: the full e-book, £x, scan here."
- Log each talk's numbers in the project workspace and the HubSpot talk task.

## Sources
- stripe.com (1.5% + 20p UK cards; read)
- stripe.com (Terminal SDK required; read)
- sumup.com (1.69% vs 1.75%; Tap to Pay £0; read)
- comparecardfees.co.uk (1.69%, Air £39 + VAT, payout 1-2 days; read)
- zettle.com (1.75%, Tap to Pay via PayPal POS app; read)
- authortrainingprograms.com (Antion anecdote; read)
- ingramspark.com (read)
- seaty.co.uk (read)
- groups.friendsoftheearth.uk (paper sign-up sheet rule; read)
- ico.org.uk (503 this run; snippet only)
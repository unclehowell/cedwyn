# Selling digital art editions (download + certificate, no blockchain): edition size, retirement, trust

Topic: how to price and run a small digital art shop of 1-of-1s and numbered editions so collectors trust it. Written 27 Oct 2026 for the Garden Gallery (/nft-art/), which is now down to 2 pieces.

## What practitioners report (read 27 Oct 2026)
- **Most buyers don't care about edition size; the image sells.** Jason Horejs (Xanadu Gallery owner; RedDotBlog, 7 Oct 2025) sells both limited and open editions: "most collectors don't ask or seem to care". A low cap also limits your best image: "Instead of 12 sales at $1,000 each, you might make 100 sales at the same price point." Commenter Wil Adams, who sells prints at art festivals: of "hundreds of print buyers", only "a couple of handful" pushed back on open editions, and most of those were other artists.
- **Hybrid: open editions that are retired.** Horejs again: sell open editions and retire images now and then. Buyers get real urgency without an artificially low cap, and each retirement is a marketing moment.
- **Never change the rules after the first sale.** Horejs: "If you've promised an edition of 12, you can't later decide to release more." Changing the model midstream erodes trust.
- **The download is closer to interior decor than fine art; size matters.** ArtWeb (Carol Burns, 24 Apr 2023):
  - Most home printers stop at A4/A3, so state the print size clearly.
  - Use a high-quality master file, never a phone photo.
  - "Better to sell less work at a higher price than join the bargain bin." At the time, Etsy had 302,665 digital-download listings, the cheapest at $1.
- **Price for repeat sales of one item, not to recover your hours.** Lisa Glanz (illustrator; replaced her design-business income within about a year of focused work): you're selling something that took weeks for around $10, so earnings come from selling the same item over and over. Don't race to the bottom with cheap bundles, because that makes you "the cheap clipart store". "Nothing passive about passive income": she works 7 days a week on support, blog and listings.
- **A marketplace fee check is already on file.** On Etsy a £9.99 digital file nets about £8.54 (see `etsy-digital-downloads-gift-shelf-gate.md`). Our own Stripe link keeps more of the price.

## Playbook
1. **One edition model per piece, stated on the page and the certificate, and never changed.** Choose 1/1, a numbered edition (e.g. /25), or an open edition with a retirement date. A Stripe payment link's `restrictions.completed_sessions.limit` enforces the number.
2. **Scarcity must be true (UK DMCC Act).** "Edition of 25, 7 sold" is fine if it's real. Fake countdowns or "only 2 left" that resets are banned practices (see `uk-dmcc-act-urgency-reviews-price-copy.md`). Show the live count from Stripe or the DB, or don't show a count.
3. **Withdrawing a piece is not cancelling a sale.**
   - Before deactivating a link, check Stripe for completed sessions.
   - Every buyer keeps their file and certificate.
   - Record the piece as "withdrawn" privately. Never renumber, and never reissue its catalogue number.
4. **The certificate is the product's trust signal.** Include:
   - catalogue number, title, edition (n of N, or "open edition, retired <date>")
   - source record ID
   - master pixel size and print size at 300 dpi
   - SHA-256 of the master
   - date of sale

   Keep a private ledger of serial-to-buyer (no public names).
5. **Describe the file honestly.** Pixel size, the largest good print size (A3 at 300 dpi needs about 3508×4961 px), format, and "print at home or at a local print shop". Show a mock-up of the print framed on a wall plus a 100% crop.
6. **Price ladder (keep the existing £9–£29 range):**
   - open/retiring edition at the low end;
   - numbered /25 in the middle;
   - 1/1 at the top.

   No discounting of 1/1s, ever. Bundle with the e-book only at a visible saving, not a fake "was" price.
7. **Each piece gets its own story** (2–3 sentences on the source record and what changed), and the piece's page links to the record's evidence page. The record is the reason to buy, not the pixels.

## How we apply it to Cedwyn
- **Current pieces.** The Garden Gallery now keeps NFA-0001 "The Quiet Stalls" and NFA-0011 "Fields of 1824, Replanted". ARCH_NOTES §5 shows the links are already capped (1-of-1 = 1 session, editions = 25). Keep those numbers exactly. Don't raise a cap to "make more" after any sale.
- **Withdrawn pieces (NFA-0002–0010, 0012).** Before any Stripe link is deactivated (the project lead decides), list completed sessions per link. If anyone bought one, their PDF and certificate stay valid. Note "withdrawn <date>, sold n of N" in the private DB rows. Never reuse those NFA numbers.
- **Next pieces.** Make them only from verified farm sources: the 1824 WP-87 map type, farm photos the project lead confirms. Never use the "Kissed Frogs" set. Prefer an open edition retiring on a meaningful date (e.g. 28 July, Glaniad) for map-derived pieces, and keep 1/1 for unique compositions.
- **Copy (neutral, banned-word list applies):**
  - "Edition of 25 · printable to A3 · certificate with catalogue number and fingerprint";
  - the live "n of 25 sold" only once it is wired to Stripe or the DB.
- **Measure.** Add utm_content=nfa-00NN on any social link to a piece. Weekly, record views of /nft-art/ and sessions per Stripe link in the Sunday growth notes.
- **No tool needed.** The certificate PDF and caps already exist.

## Sources (read 27 Oct 2026)
- Jason Horejs, "The Limited vs. Open Edition Debate", RedDotBlog, 7 Oct 2025, with comments: reddotblog.com
- Carol Burns, "Increase Your Art Income with Digital Downloads", ArtWeb Blog, 24 Apr 2023: blog.artweb.com
- Lisa Glanz, "Passive income: my advice on selling art as digital products": lisaglanz.com
- Internal: the project workspace §4–5; etsy-digital-downloads-gift-shelf-gate.md; uk-dmcc-act-urgency-reviews-price-copy.md
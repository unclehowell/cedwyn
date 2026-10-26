# E-book sales page CRO: test campaigns, short copy, checkout friction
Harvested 2026-10-26 (skills harvest). Topic: converting /ebooks/ visitors into buyers on a direct-sold e-book shop.

## What the practitioner evidence shows
- **Iterate in campaigns, not one-off tests (CXL / TruckersReport case study).** Six sequential tests took a landing page to +79.3% over the original. Findings that transfer:
  - Test 2: a headline and benefit bullets built from big promises left opt-ins flat but cut bottom-of-funnel conversions by 21.7%: "too many promises can look like hype or attract the wrong kind of people."
  - Test 4: the plain original headline ("Get a truck driving job with better pay") beat a question, a three-benefit headline and an autonomy framing.
  - Test 5: a shorter layout with less copy gave +21.5% opt-ins at 99.6% confidence.
  - Test 1: fewer form fields lost by 13.56% here; field count is not a universal law, so test it.
  - Note: the case study first appeared in 2013. The principles hold; treat the numbers as one site's.
- **Benchmarks (Unbounce Conversion Benchmark Report 2024, landing pages).** Median conversion across all industries 6.6%; industry medians 3.8%-12.3%. Copy length, readability and word choice affect conversion; mobile is often the majority of visits (up to 7x desktop in some industries) yet converts lower. (Benchmarks are for landing pages with one goal, mostly lead forms, not paid checkouts. Use them as an upper reference for signup, not purchase.)
- **Why buyers drop at checkout (Baymard Institute, 50 studies).** Average documented cart abandonment 70.22%. Excluding "just browsing", reasons include: extra costs too high 40%, didn't trust the site with card details 19%, forced account creation 18%, too long/complicated checkout 17%, site errors 17%, couldn't see the total up-front 12%, not enough payment methods 9%.

## How-to
1. **Measure the funnel first.** Steps: /ebooks/ view, then book card or sample opened, then buy-click, then checkout, then paid. Use the site's events (e-book page view, buy-click, read) plus Stripe/Gumroad sales. No test until each step has a count.
2. **Fix the friction list before testing copy** (Baymard is free money):
   - total price shown on the card, in GBP, VAT included;
   - guest checkout (no account);
   - wallet payments (Apple/Google Pay) if the checkout offers them;
   - trust line next to the button (secure checkout by the payment provider, instant PDF delivery, how refunds work);
   - no errors at 390 px.
3. **Above the fold on mobile:** what the book is (one plain line), who it is for, the price, the free sample, one button. Plain headline over clever (CXL test 4).
4. **Cut copy, not substance.** A shorter page won in test 5. Move long "what's new in version x" notes behind a details toggle; keep page counts and contents samples visible (they answer "is it worth it").
5. **No hype.** Promise-heavy copy cost 21.7% downstream conversion in test 2. State what the records show, in neutral words.
6. **Run tests as a campaign.** One change at a time; stop sizes fixed in advance (ab-testing-small-lists.md, `python3 tools/ab_stats.py samplesize`). At low traffic, test only big differences (layout, offer, free-sample placement), not button colours.
7. **Log each test**: hypothesis, the change, dates, counts, result, insight. The insight feeds the next test (CXL's main lesson).

## How we apply it to Cedwyn
- /ebooks/ (read 26 Oct) lists nine books at £9.99 each plus a £31.99 four-book bundle and a free first edition; each card carries version strings ("v0.02 version 1.1.0 + supplement"), page counts and long "what's new" notes. **Test 1 candidate:** a compact card (title, one-line description, pages, price, "Read a free sample", Buy) with version and change notes collapsed, against the current card. Primary metric: buy-clicks per /ebooks/ visitor; read sales from Stripe/Gumroad.
- Check the friction list on the live checkout (guest checkout, total shown, wallet pay) and record the result in the bizdev log. Changes go to the sole cedwyn committer as a patch.
- Keep the copy neutral and evidence-led (banned words apply; this also matches CXL's "no hype" result). No internal UTMs: use the existing events.
- Signup is the realistic first conversion at current traffic. Use Unbounce's 6.6% median as a stretch reference for the signup strip, not for paid sales.

## Sources
- CXL, "Landing page case study: how we improved conversions by 79.3%": cxl.com
- Unbounce, Conversion Benchmark Report: unbounce.com
- Baymard Institute, Cart abandonment rate statistics: baymard.com
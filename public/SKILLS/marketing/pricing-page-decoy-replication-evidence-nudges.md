# Pricing-page nudges: the decoy tier doesn't replicate. What to use instead

Harvested 27 Oct 2026. The topic is pricing-page psychology for direct e-book sales (singles at £9.99, a four-book bundle at £31.99, free v0.01 PDFs).

## What the evidence shows
- **Original lab finding** (Huber, Payne & Puto 1982, JCR 9(1)): adding an "asymmetrically dominated" decoy raised the target option's share by about **9 points** on average. The options were abstract number pairs and the choices were hypothetical.
- **Popular example** (Ariely 2008, the Economist subscription page): in one study of 100 MIT students, 84% chose print+web when a print-only decoy at the same price was shown. Without the decoy, 32% chose it. This is one experiment. There's no public record of The Economist testing its own page.
- **2014 replications** (JMR 51(4)):
  - Frederick, Lee & Baskin, "The Limits of Attraction": the effect largely vanished with realistic stimuli, and **sometimes reversed**, lowering the target's share.
  - Yang & Lynn: **11 of 91** attempts across 23 product categories, using realistic descriptions and images, gave reliable effects.
  - The original authors replied ("Let's be honest about the attraction effect") and conceded that it depends on dominance being easy to see.
- **Practitioner reading** (Atticus Li, who led 100+ in-house experiments at NRG in 2025; read in full): on a real pricing page, with images, qualitative features, brand and real money at stake, the effect is "probably small or absent". Three tiers can still be fine for other reasons: self-segmentation and upgrade paths.
- **Better-supported levers** (same source):
  - visual prominence of one option;
  - a truthful "most popular" label (social proof);
  - a default selection;
  - feature lists that match what the buyer needs.
- **His testing rules:**
  - Pre-state the hypothesis and the size of lift you expect.
  - Run a power calculation first.
  - Judge on end-to-end revenue, not plan mix.
  - Watch for novelty effects and re-test winners after 90 days.
  - Don't generalise from one page.
- **GoodUI test database** (goodui.org, read): it lists real "most popular" badge tests, e.g. test #504 on Aboalarm.de, middle plan, 127,712 visitors, 94.9% power at a 5% MDE. It also lists tests of 2 plans vs 3. **The effect sizes are members-only**, so none are quoted here (not checked).

## How to do it
1. **Never add a fake inferior option** to steer buyers. It probably doesn't work, and a deliberately pointless offer reads as a trick.
2. **Make the choice easy instead.** Show one clearly prominent recommended option, state the plain saving in money, and say what's included in one line each.
3. **Only use a "most popular" or "best seller" label if it's true.** Under UK consumer law (CPUTR, now the DMCC Act 2024 Part 4 unfair-practices regime), a false popularity claim is a misleading action. With zero sales it can't be used.
4. **Test only when traffic allows.** At a 1% baseline, detecting a doubling (1% to 2%) needs about **2,319 visitors per arm**, and a 30% lift needs about **19,827** (tools/ab_stats.py, run 27 Oct). Below that, make one change at a time, log its date (the project workspace), and compare revenue per visitor over 28 days before and after.
5. **Measure revenue per visitor to /ebooks/**, not bundle share alone. A bundle that takes share from singles but lowers total checkouts is a loss.

## How we apply it to Cedwyn
- **Live check of /ebooks/, 27 Oct 04:40Z (read-only):**
  - Singles are shown at £9.99 each in an edition table.
  - The bundle reads "four PDFs, 2,876 pages, one checkout. Buy all four — £31.99".
  - Four singles cost £39.96, so the bundle saves **£7.97**, but the page doesn't say so.
  - There's no decoy, no badge and no default. That's correct, so **don't add a decoy tier**.
- **PROPOSED** (patch only; existing Cedwyn pages are under the repair freeze; the project lead's call):
  - (a) add one line under the bundle button: "£7.97 less than buying the four separately";
  - (b) give the bundle card visual prominence on 390 px (first card, filled button), with the singles as plain links;
  - (c) no "most popular" label until sales records show it is true.
- **No A/B test.** In the 24 h before 27 Oct 04:10Z, Cedwyn had about 59 UK visits (sales-fix run). Use before/after with the annotation log, judged on Stripe + Gumroad revenue per /ebooks/ visit (the project workspace).
- **Price changes stay off the table** unless the sales-fix run names a price test as the best fix. The listed prices stand.

## Sources
- atticusli.com (read in full; cites Huber et al. 1982 doi 10.1086/208899; Frederick et al. 2014 doi 10.1509/jmr.12.0061; Yang & Lynn 2014 doi 10.1509/jmr.14.0020; Simonson 2014; Huber et al. 2014)
- goodui.org (test listing read; effect sizes paywalled, not used)
- cedwyn.bucklerfamily.estate (live read 27 Oct 2026)
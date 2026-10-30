# Trust cues at the buy button, before the hand-off to Stripe

Harvested 30 Oct 2026 07:58Z. Topic not covered before ('trust badge' 0, 'payment icons' 0, 'secure checkout' 0 hits in INDEX.md).

## Why it matters (sources read 30 Oct 2026)
- **Baymard, cart-abandonment list (2026 edition, read):** the documented average abandonment rate is 70.22% (50 studies). Leave out "just browsing" and **19% of abandoners say "I didn't trust the site with my credit card information"**. It is the third reason, after extra costs (40%) and slow delivery (20%), and level with forced account creation (18%). Delivery speed doesn't apply to an instant PDF. Trust and surprise costs do.
- **Baymard, "How users perceive security during the checkout flow" (read):** people judge security by **gut feeling and how secure the page looks**, not by the actual technology. Parts of a page with badges, reassuring microcopy and a visibly "robust" frame read as safer than other fields on the same HTTPS page. In Baymard's seal surveys (2013 to 2023, about 2,500 US adults per wave) Norton was trusted most. A **made-up "homemade" seal scored better than most real SSL-vendor seals**, so recognition matters more than the issuer. Baymard's advice is to A/B test it.
- **CXL Institute, trust-seal eye-tracking study (read):** 340 participants, 6 badges on a real card form. The PayPal badge drew the most fixations. Google, Norton and PayPal were the badges most often recalled as adding security. Familiarity drives recall.
- **ConversionTeam case (house-plans retailer, *digital* purchases, published 2018, updated Jun 2026, read):** Norton badges added beside the existing security cues. Results: **+12.2% conversion, +16.6% revenue, n = 3,480 users, p = 0.049**. That is barely significant, it comes from one agency's own case study, and it hasn't been checked independently. Treat it as "worth testing", not "expected lift".
- **Stripe brand assets (read):** "Businesses who use Stripe can display this logo on their checkout pages. We suggest linking badges to stripe.com." All use falls under Stripe's Marks Usage Agreement.

## The how-to
1. **Put the cue where the doubt is: next to the button that leaves your site.** On a Payment Link site the card form is Stripe's hosted page, which already shows Stripe's frame. The trust gap is the click on *our* page into an unknown checkout.
2. **Use one line of plain microcopy under each Buy button. Say only what is true:**
   `Secure checkout by Stripe · PDF emailed instantly · Card payments`
   - Name Apple Pay or Google Pay only if they are switched on for that Payment Link. Check in Stripe → Settings → Payment methods, or open the live link on a phone. Never list a method we can't take.
   - Optional: Stripe's official badge, used as an **image with no link**, because Cedwyn's rule is no outbound links. Don't recolour it. Don't use paid seals (Norton, McAfee): they cost money and aren't on our own checkout page.
3. **Remove the surprises Baymard ranks highest:** show the full price (`£4.99, nothing added`), the format (PDF), how it arrives (emailed to you and downloadable straight away), and that no account is needed.
4. **Fake seals are out.** They would be a self-made security claim, and Baymard's result shows they can mislead. Plain words are honest and do the same job.
5. **Measure it as a before/after:** clicks on Buy per 100 /ebooks/ visitors, using existing UTM/event counts. Read it with the existing before/after-with-placebo-band skill. Traffic is about 14 visitors a day, so a real A/B test would take months (see `ab-testing-small-lists.md`). Treat it as a hygiene fix, not an experiment.
6. **Keep the Stripe page consistent:** Stripe Dashboard → Settings → Branding (logo, colour, business name "Cedwyn" or whatever we sell as) so the hand-off looks like the same shop. A mismatched name at checkout is a trust break.

## How we apply it to Cedwyn
- **Live check, 30 Oct 07:58Z** (cache-busted fetch of cedwyn.bucklerfamily.estate): the page states "PDF, instant download" and shows the price on the button ("Buy v0.0.2 · £4.99"). It has **no "secure checkout" or "Stripe" line and no "no account needed" line** near the Buy buttons.
- **Patch to stage** (repair freeze, so it goes into `the project workspace` and is not pushed): one `<p class="buy-note">` under each Buy button: `Secure checkout by Stripe · PDF emailed instantly · £4.99, nothing added · no account needed`. Use the bundle price on the bundle button. Add Apple Pay or Google Pay only after confirming them on the live Payment Link.
- Check the Stripe Branding business name and logo match "Cedwyn / Great House Farm e-books". Read it with Stripe's read-only settings, or log it as a QUEUE item if it can't be read.
- Pairs with: `payment-link-sessions-bots-checkers-vs-buyers-no-email-recovery.md` (count only real opens), `sticky-mobile-buy-bar-drawer-evidence-wcag.md` (put the same line in the bar) and `onsite-one-question-survey-buy-path.md` (whether "not sure it's safe" shows up as a reason).
- Rules: no outbound links (the badge is unlinked), no "was" prices or saving assertions, no banned words.

## Sources
- baymard.com (read 30 Oct 2026)
- baymard.com (read)
- baymard.com (read; 2013 original, points to the update)
- cxl.com (read)
- conversionteam.com (read; agency case, not checked)
- stripe.com (read)
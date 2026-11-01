# Release-day grace window: recent buyers get the new version free

Read 1 Nov 2026. This is the companion to the Cedwyn version ladder.

## The problem it solves
On a price ladder, every release moves the old "latest" one step down: it becomes £4.99 cheaper, and the new version takes the top price. Someone who paid full price yesterday sees their version cheapened and a newer one on sale. That is the classic "I just bought it!" complaint, and software sellers settled it with a grace window.

## Practitioner evidence (published policies)
- Scooter Software, maker of Beyond Compare (scootersoftware.com, snippet 1 Nov 2026): "if we release a major upgrade within 12 months of your purchase, you can get the upgrade for free."
- EaseUS (kb.easeus.com, snippet): new major upgrades released within the "grace period" ("generally within 30 days after you have purchased this product") are free to the buyer.
- Applian (applian.com, snippet): the upgrade "fee will be waived if the Suite purchase date is within 30 days of the new product release."
- UJAM publishes a separate "Grace Period Policy" for recent purchasers (support.ujam.com, snippet).
- One forum practitioner's variant (Ars Technica op-ed thread, snippet): "One month before the launch of your 'upgrade', lower the price of the existing app".

Window lengths seen: 30 days for consumer tools, 12 months for a premium tool. None of these pages publish conversion numbers. The evidence is that it is common, stable policy, not a measured lift.

## How to do it
1. Choose a window, say 30 days, and state it in one line at checkout: "Buy now and if a new version comes out within 30 days, it's yours free."
2. Make it automatic on release:
   - Find buyers whose purchase date is within the window.
   - Grant them the new version through the access code or entitlement they already hold.
   - Send one plain "your free upgrade is ready" email, only through the existing approved email route.
3. Put the line where hesitation happens: under the price in the version dropdown and on the purchase bar.
4. Log each release: number eligible, number who downloaded the upgrade. A refund request inside the window is a signal that the window is too short or unclear.

## How we apply it to Cedwyn
- Cedwyn ships versions often (semver per book, film door and course), so the "cheapened yesterday" moment will recur. A 30-day window fits a £4.99-step ladder.
- Entitlement goes through the existing access codes and entitlements (see the stripe-payment-link-per-scene-access-codes-own-entitlements skill). No new payment code.
- The bar copy stays whole-price and plain, e.g. "v0.3.0 full edition £9.98 (212 pages) · free upgrade if a newer version ships within 30 days".
- **PROPOSAL** only. The window length and whether to offer it are owner policy. Log it for the version-standard flywheel; do not build it until approved.
- With zero checkouts so far, nobody is eligible today, so the cost is nil until the first sale. The value is reassurance at the first purchase.

## Sources
- scootersoftware.com (snippet)
- kb.easeus.com (snippet)
- applian.com (snippet)
- support.ujam.com (snippet)
- arstechnica.com (snippet; forum opinion)
# Stripe buy buttons that can't silently die: direct script, CSP, plain-link fallback

Date: 2026-10-29 · Harvest run b20ceb26 · Reproduces and generalises P-041 (/story/ buttons never render).

## The failure, measured on our own site (29 Oct, tools/buybutton_check.py)
- `/story/`: the app bundle `/story/assets/index-*.js` holds one `<stripe-buy-button>`, and the script URL is stored **URL-encoded** (`https%3A%2F%2Fjs.stripe.com%2Fv3%2Fbuy-button.js`). The cause is the site's /wayback/go/ link rewriter, which wrapped it. Browsers refuse it, so the button never appears, **and there is no plain buy.stripe.com link to fall back to**: zero ways to pay on that page.
- `/ebooks/`: 9 plain buy.stripe.com links, all 200. This is the pattern that works.
- Baymard 2025 (n=1,026, in payment-trust-cues-checkout-uk-legal.md): **17% of shoppers abandoned because of errors or crashes**. A button that never renders is worse, because the visitor doesn't even get to the error.

## What Stripe documents (docs.stripe.com, read 29 Oct)
- The embed is exactly `<script async src="js.stripe.com</script>` plus `<stripe-buy-button buy-button-id=… publishable-key=pk_live_…>`. **Load it straight from js.stripe.com.** Never proxy, rewrite, self-host or URL-encode it.
- Under a Content-Security-Policy the button needs **`script-src js.stripe.com`** and **`frame-src js.stripe.com`**. Checkout pages also want `checkout.stripe.com` in connect-src, frame-src and script-src, and `img-src *.stripe.com` (Stripe security guide).
- It needs a real website domain; it won't render from file://.
- Revoking the publishable key breaks every embed, so re-paste the embed code after any key roll.
- `client-reference-id`: letters, digits, `-` and `_` only, up to 200 characters. **Invalid values are silently dropped**, and checkout still works, so tracking quietly stops.
- `customer-email`: if set, the buyer **can't edit** it, and an invalid value is silently dropped.

## The rule: every buy button ships with a link that works without JavaScript
```html
<stripe-buy-button buy-button-id="buy_btn_…" publishable-key="pk_live_…">
  <a class="buy" href="buy.stripe.comBuy the e-book · £4.99</a>
</stripe-buy-button>
<script async src="js.stripe.com</script>
```
- If the script loads, the custom element renders its own button. If it's blocked (extension, CSP, rewriter, old browser), the inner `<a>` is still a tappable Payment Link. Payment Links get Adaptive Pricing and are the same checkout (local-currency-pricing-stripe-adaptive-gumroad-ppp.md).
- In React/Vite apps, render the `<a>` from the same price config, so the link and the button can't drift apart.
- **Exclude** `js.stripe.com`, `buy.stripe.com` and `checkout.stripe.com` from any link rewriter, archive wrapper or outbound-link redirect. The rewriter that wraps wayback links must have an allowlist.
- Simplest of all: where the button adds nothing, use only the plain Payment Link, as /ebooks/ does. No script means nothing to break, and the page is faster too (sales-page speed/CWV file).

## Check it every time a page with a price changes
`python3 skills/tools/buybutton_check.py <url> …` (stdlib, read-only):
- follows up to 6 same-origin JS bundles;
- flags a buy-button.js that isn't the exact Stripe URL;
- flags buttons without a buy.stripe.com fallback;
- flags a CSP that lacks js.stripe.com;
- GETs every buy.stripe.com link and expects 200.

It exits 1 on any FAIL, so a flywheel can gate on it. Today `/story/` fails (2 findings) and `/ebooks/` passes (9/9 links 200).

## How we apply it to Cedwyn
- **P-041 fix (owner: problems flywheel):**
  1. In the story app source, use the literal `js.stripe.com
  2. Add a stripe.com allowlist to the /wayback/go/ rewriter in tools/site.py.
  3. Put the plain Payment Link inside the element. The /story/ book link should carry `utm_source=site&utm_medium=story`.
  4. Rebuild, then re-run `buybutton_check.py cedwyn.bucklerfamily.estate It must print OK.

  Commit only when no build-cedwyn run is going.
- Add `buybutton_check.py` against /ebooks/, /wales/ebooks/, /story/ and /shop/ to the daily site flywheel's money-path check, alongside the Stripe link 200s.
- Any new page with a price: plain Payment Link first. Use a buy button only if it measurably helps, and then only with the fallback.

## Sources
- docs.stripe.com (read 2026-10-29: embed, CSP, client-reference-id, customer-email, limitations)
- docs.stripe.com (read: Checkout/Stripe.js CSP directives)
- Own measurement 2026-10-29 with tools/buybutton_check.py on cedwyn /story/ and /ebooks/; BIZDEV run 5 headless finding (P-041)
- Baymard 2025 checkout survey via payment-trust-cues-checkout-uk-legal.md (17% errors/crashes)
# Access-code entry box for paid content: hide it, normalise it, rate-limit every path

Harvested 31 Oct 2026 (skills harvest run). Why now: the Academy is getting documentary-style access codes (CDW-/ACD-XXXX-XXXX-XXXX). Code *issuing* is already covered in `stripe-payment-link-per-scene-access-codes-own-entitlements.md` (mint once per paid session, hash at rest, 5 tries per 10 min) and `ebook-download-cards-gift-shop-events-single-use-codes.md` (printed cards). This file covers the other half: the **entry box** buyers type into, and how to stop people guessing codes.

## What the sources show (read 31 Oct 2026)
- **A visible code field sends people off to search for one.** Baymard, "Minimize Form Fields" (read): a test participant on Crowd Cow saw "Enter a promo code" and said "I would go to Google, go to 'Crowd Cow promo code'". Once users leave checkout to look for codes, "the chance of them not returning to complete the purchase increases significantly". **35% of sites** with promo fields still show them by default. Baymard's advice is to hide the field behind a link, as Adidas does by collapsing it.
- **Apply the code when it is complete.** Baymard, "Avoid 'Apply' Buttons" (read): when a code has "a defined set of characters", try it "when the field loses focus or when the input has reached the correct number of characters". The same article allows an Apply button for promo and gift codes. Our version: keep the button, and also submit when the full length is reached.
- **Guessing codes is a named attack.** OWASP Automated Threats **OAT-002 "Token Cracking"** (read): "Mass enumeration of coupon numbers, voucher codes, discount tokens", where the benefit may be "access to a limited offer". The weaknesses it maps to are CWE-799 (no frequency control) and CWE-837 (no single-use enforcement).
- **A rate limit with one gap in it is no rate limit.** Craft Commerce advisory **CVE-2026-55795** (2026, read): the limiter ran only when a `number` parameter was present, so coupon codes sent the other way had "no rate limiting … unlimited attempts". The fix was "Apply rate limiting unconditionally". CWE-307.
- **The browser can do the capitals for you.** MDN `autocapitalize` (read): `characters` = "Automatically capitalize every character" on phone keyboards. It has no effect on url/email/password inputs, so the field must be `type="text"`.

## How to do it (checklist)
1. **Hide the box behind a link.** On the paywall or subscribe card, show a quiet "Have an access code?" text link under the main button. Tapping it opens the field. Never show an open field next to the price.
2. **Field markup.** `<input type="text" inputmode="text" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false" maxlength="22" aria-describedby="code-hint">` with a hint such as "Format ACD-XXXX-XXXX-XXXX. Codes never use O, 0, I, 1 or L." Do not use `type=number` or a password field.
3. **Normalise on the server, not just in the browser.** Uppercase; strip spaces, hyphens and en dashes; accept the code with or without its prefix (the prefix also tells you the product). If the alphabet keeps one of a lookalike pair (Crockford style: 0 and 1 kept, O→0, I/L→1), map the lookalikes. If it drops both, reject with the hint above. Display can add the hyphens back as the user types, but whatever is pasted must work.
4. **Submit at full length, keep a button.** Try the code automatically when the 12th character lands, or on blur, and keep a visible "Unlock" button. Show a spinner, then one of: unlocked (reload the members' version); "That code isn't recognised: check the letters" for a code that doesn't exist; "This code is for the documentary, not the Academy" when the prefix or product doesn't match. Never reveal whether a code exists for a different buyer.
5. **Rate-limit every route into the check.** Apply the same limiter to the form POST, any JSON/API route, and any `?code=` link redeem: per IP (e.g. 5 per 10 min) **and** a global failure alarm (e.g. more than 50 failures an hour across all IPs → log and alert the root). Count failures before the database lookup. Send a constant-time "no" so timing gives nothing away.
6. **Check the guess odds once.** Odds per guess = valid codes ÷ alphabet^length. 31 characters × 12 places ≈ 7.9×10^17 combinations. With 100 live codes, even 10,000 guesses have about a 10^-12 chance of a hit. Short codes (6 characters ≈ 8.9×10^8) are what make enumeration practical. Tool: `tools/code_guess_odds.py`.
7. **Single use, bound to the redeemer.** On redeem, mark the code used and issue our own signed membership cookie or token. A second redeem from another browser gets "This code has already been used. Use the 'restore access' link from your receipt" (see `academy-member-sign-in-magic-link-new-device.md`). This stops one code being posted to a forum and used by everyone (CWE-837).
8. **Measure it.** Beacon events: code_link_open, code_submit, code_ok, code_bad, code_wrong_product, rate_limited. A high bad/submit rate means the format hint or the normalising is failing real buyers, not attackers.

## How we apply it to Cedwyn (PROPOSAL, for the Academy standardisation worker / doc-access)
- **Academy:** put "Have an access code?" under the £49.99/month subscribe card on academy.bucklerfamily.estate. Use the same component as the documentary player so the two apps match (the project lead asked for consistency, 23:52 30 Oct).
- **Server:** normalise as in step 3 in the cedwyn-doc-access redeem route (shared by both products). The product comes from the prefix or flag, so an ACD- code typed into the documentary gets the wrong-product line, not a plain "invalid".
- **Rate limit:** check that the 5-per-10-min limit covers *every* redeem path (form, JSON, link). The Craft CVE is exactly the one-path gap. Add the global failure counter to the Workers Analytics Engine beacon already proposed.
- **Test:** with the temporary code the academy worker creates: lowercase, spaces, missing prefix, pasted with an en dash, wrong product, a sixth bad try (expect rate-limited), then a reuse from a fresh browser. Delete the code afterwards.
- Nothing here changes a price or issues codes to non-payers. Copy follows the editorial rules (no banned words, never names the project lead).

## Sources
- baymard.com
- baymard.com
- raw.githubusercontent.com
- github.com (CVE-2026-55795)
- developer.mozilla.org
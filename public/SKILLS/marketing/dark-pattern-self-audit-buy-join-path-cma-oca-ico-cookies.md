# Dark-pattern self-audit of the buy and join path (CMA online choice architecture + ICO cookie tests), 2026

Topic: a 15-minute audit, run before every change to /ebooks/, /learn/ or a signup form, checking we use none of the "online choice architecture" (OCA) tricks UK regulators target. Not legal advice; check with an adviser. Urgency and countdown copy rules sit in uk-dmcc-act-urgency-reviews-price-copy.md and honest-launch-deadlines-uk-dmcc-banned-practice-7.md. Subscription rules sit in uk-subscription-regime-dmcc-academy-stripe-by-design.md. This file is the wider design checklist.

## Why it matters (numbers)
- **Dark patterns work, which is why they are tempting.** In Luguri & Strahilevitz's study (Journal of Legal Analysis 13(1), 2021; 1,963 US adults), acceptance of a dubious paid plan was:
  - 11.3% in the control group;
  - 25.4% with *mild* dark patterns;
  - 37.2% with *aggressive* ones.
  These figures are as tabulated by deceptive.design ch.21, treating drop-outs as rejections. The paper puts it as "more than twice / almost four times". Strahilevitz: the mild ones "are most insidious" because they lift take-up without visible backlash.
- **UK regulators enforce it.** The ICO ran three cookie tests over the UK's top 1,000 sites:
  1. Advertising cookies stored before the visitor chooses?
  2. Is reject as easy as accept?
  3. Advertising cookies set without consent?
  Results: by Dec 2025, 979 of 1,000 complied (415 with no intervention, 564 after letters); 17 got preliminary enforcement notices. In Apr 2026, 992 passed and the ICO published final storage-and-access guidance. These are ICO figures as compiled by inth.com; ico.org.uk timed out from our box, so they are not read at source.
- **The CMA/ICO joint paper "Harmful design in digital markets"** (DRCF PDF) names harmful defaults, confirmshaming, biased framing, bundled consent and "nudge" designs as data-protection *and* consumer-law risks. Under the DMCC Act the CMA can fine directly, up to 10% of turnover (see the DMCC file).

## The checklist (pass = none present)
Each row: the pattern | what to look for | how to test it.

1. **Pre-ticked consent** | Checkbox `checked` by default on email or terms | grep the HTML for `type="checkbox"` and `checked`.
2. **Bundled consent** | One box covering terms + marketing | Separate boxes, marketing optional.
3. **Confirmshaming** | Decline link worded to shame ("No thanks, I don't care about history") | Read every close/decline label.
4. **Hidden or drip costs** | Price at checkout higher than the shop card (VAT, fees) | Compare /ebooks/ card price vs Stripe page total, in en/cy/es.
5. **Sneaking** | Extra item or donation added to the basket | Open each Payment Link; only the one product should show.
6. **Forced account** | Sign-up required to buy a one-off e-book | Guest checkout via Stripe.
7. **Obstruction** | Cancel/unsubscribe harder than join | Count clicks to join vs cancel; the unsubscribe link sits in every email.
8. **Nagging** | Popup returns after dismissal in the same session | Dismiss, then reload twice.
9. **Fake scarcity / social proof** | "Only 3 left", invented counters | Digital goods have no stock; only real, sourced numbers.
10. **Trick wording** | Double negatives on consent | Read aloud once.
11. **Cookie/tracker without consent** | Third-party scripts (pixel, gtag, Clarity) loading before a choice | List the `<script src>` hosts and Set-Cookie headers per page.
12. **Reject not equal to accept** | Only applies if a banner exists | Equal-weight buttons, same layer.

## How we apply it to Cedwyn (audit run 31 Oct 2026, fetch of live HTML, no JS)
- **/ebooks/: PASS on 1, 2, 9, 11.**
  - The sample-chapter form's consent box is unticked and `required`. Its wording is specific: "Email me the free first chapter and up to one update a week ... Unsubscribe any time", with a privacy link.
  - No third-party script hosts and no Set-Cookie.
  - The page calls `fbq('track','Lead')` only `if(window.fbq)`, but no Meta pixel script is loaded, so the call is dead code.
  - **Watch item:** if anyone ever adds the Meta pixel, a consent banner with an equal Reject button must ship *first*, because rows 11 and 12 would then apply.
- **/learn/ (Academy join): PASS on 1 and 7 by design.**
  - Two unticked boxes: "I'm starting a £49.99/month subscription, charged every month until I cancel" and the 14-day waiver.
  - The Join button stays disabled until both are ticked.
  - Cancel is via the Stripe billing link on every page.
- **Home /:**
  - Consent strings for the voucher, merch and Great House II notify forms are per-purpose ("One email, unsubscribe any time"), so they pass row 2.
  - A `ghf_lang` preference cookie (1 year, first-party) is set by script.
  - **PROPOSED check, not a change:** confirm it is written only after the visitor picks a language, or on a `?lang=` link they followed. The ICO's strictly-necessary exemption covers things the user asked for. If it fires on every first load, propose switching to localStorage only, which the script already uses as well. Needs the project lead's GO as a site change.
- **Not checked this run:** rows 4 and 5 (Stripe page totals per locale; needs a browser walk) and row 8 (needs JS). Hand these to the next SALES FIX run: one 390 px browser pass, with screenshots kept in its folder.
- **Process:** add this checklist as a gate to the weekly CEDWYN ONPAGE run's audit (markup check only; any fix is PROPOSED). Log fails to the project workspace, never to the project lead.

## Sources
- Luguri J., Strahilevitz L. (2021) "Shining a Light on Dark Patterns", J. Legal Analysis 13(1):43-109, academic.oup.com (abstract via search); deceptive.design/book/contents/chapter-21/ (read; table + quotes)
- inth.com (read; summarises ICO releases of Jan 2025, Dec 2025, Apr 2026 and an FOI of 29 May 2026); ico.org.uk 2025/12 news item (timed out, not read)
- drcf.org.uk Harmful design in digital markets, ICO-CMA joint position paper (search snippet); gov.uk CMA "Online Choice Architecture" papers (page read, PDF not read)
- Live HTML of cedwyn.bucklerfamily.estate /, /ebooks/, /learn/, /argentina/, /research/ fetched 31 Oct 2026 ~19:43Z
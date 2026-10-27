# CTA button copy: say what the reader gets, in their own voice

Date: 2026-10-27 · Topic: CRO / sales-page copy · Status: playbook + Cedwyn audit (changes PROPOSED)

## The evidence (with its limits)
- **"Your" -> "My", +90% clicks.** Michael Aagaard (ContentVerve) and Oli Gardner ran an A/B test on an Unbounce PPC landing page selling a 30-day free trial. They changed one word on the button, "Start **your** free 30 day trial" to "Start **my** free 30 day trial". After three weeks the "my" version had a 90% higher click-through to the payment page. (Aagaard, Unbounce blog, 22 May 2013, read 27 Oct 2026. CXL's forms article repeats it.) Limits: one test, one page, 2013. The sample size isn't published. It measured clicks to the next step, not paid sign-ups.
- **Benefit beats a vague verb, +33.1%.** Empire Flippers changed their blog-sidebar signup button from "Join us!" to "Make Money Flipping Websites" and got 33.10% more conversions. (Via CXL, read 27 Oct 2026. The original test write-up wasn't read: secondhand.)
- **Aagaard's rule** (same Unbounce post): button copy should answer "what will I get?" and "why should I click?". Longer, specific copy beats short generic copy "as long as it's the version that gets the most conversions". Treat it as a hypothesis to test, not a law.
- **For a small site:** with tens of buyers a month you can't A/B test a button (see ab-testing-small-lists.md). Use these patterns as sensible defaults, change one button at a time, and log the change date in the annotations log so a before/after can be read later. Expect noise.

## How to write the button (checklist)
1. **Name the thing the reader gets**, not the action they take for you: "Get my copy", "Send me chapter 1", "Read the free edition". Avoid "Submit", "Buy", "Join", "Click here".
2. **First person ("my", "me")** when the button finishes the sentence "I want to ...". Check it reads naturally ("Get my e-book · £4.99"). If "my" sounds forced, use the plain benefit with no pronoun.
3. **Put the price or "free" on the button** when the next step asks for money or an email. It removes a surprise and the click is a real yes. Keep it honest: no "was" prices (see uk-reference-pricing-was-now-emma-sleep-2026.md) and no false urgency (uk-dmcc-act-urgency-reviews-price-copy.md).
4. **No internal jargon** on buttons: version numbers, SKU names and file formats go in the line under the button, not on it.
5. **One primary button per card**, so the eye goes to it first. Secondary links ("Contents & samples") look like links, not buttons.
6. **A microcopy line under the button** answers the main worry: "Instant download · EPUB + PDF · 14-day refund" (only state what is actually true).
7. **Welsh and Spanish too:** write each version natively (e.g. "Anfon y bennod ataf", "Quiero mi copia"). Don't translate word for word, and get a human to check (helo-blod-free-welsh-translation-trilingual-copy.md).
8. **Accessibility:** the visible text is the accessible name. If the price is shown as a separate element, make sure "Get my copy, £4.99" still reads as one phrase to screen readers, and keep tap targets at least 44 px.

## Measuring it
- Before the change: note the clicks on the button (Clarity or GA4 click event) and the purchases per 1,000 /ebooks/ views over 14 days.
- Change one button set only. Annotate the date (tools/annotations_log.py).
- After 14 days, compare the click rate. Report it as directional unless each side has at least ~100 clicks.

## How we apply it to Cedwyn (audit 27 Oct 2026, 08:10Z, live /ebooks/)
Button texts on cedwyn.bucklerfamily.estate today:
- "Buy v0.0.2 · £4.99" ×8: this leads with the version number and "Buy". **PROPOSED:** "Get my copy · £4.99", with "Edition v0.0.2 · instant download" in the line under the button.
- "free version (v0.0.1 2026)" ×9: this is lower-case and a label rather than an action. **PROPOSED:** "Read my free edition", with "v0.0.1 · no sign-up" under it (only if that's true; check the flow).
- "Buy all four — £19.96": **PROPOSED:** "Get all four books · £19.96". The four separate prices add up to £19.96, so there's no saving to claim. Don't say "save" unless a real discount exists.
- "Send me the chapter" (sample form): already first person and specific. Keep it. Optional: "Send me chapter 1 (free)".
- "Read v0.0.1 · free" / "Read the free first chapter": fine. Make sure they're consistent.
- "+ supplement, 25 Oct 2026 (free PDF)": a link, not a button, which is fine.

Rules: these are body-text changes, so they go to the onpage/bizdev worker as PROPOSED, with no wording change without the usual sign-off route. Public text must never name the owner and must avoid banned words (none of the proposed strings uses them). Make the change in the /ebooks/ template only, one set at a time, logged with annotations_log.py.

## Sources
- unbounce.com (Aagaard, 2013, read)
- cxl.com (Empire Flippers +33.10%, Unbounce +90% restated, read)
# Apple Mail categories and AI summaries: writing newsletters that survive the iPhone inbox

Written 27 Oct 2026 (skills harvest). Companion to `gmail-manage-subscriptions-gemini-summaries-metrics.md` (Gmail side) and `apple-business-maps-showcases-branded-mail.md` (logo). Scope: what Apple Mail does to a small newsletter in 2026, and what we control.

## What the sources show (read 27 Oct 2026)
- **Litmus email client market share, Sept 2026** (search snippet of the Litmus page; 1.5 bn opens): **Apple 76.56%** of opens, Gmail 16.10%, Outlook 3.48%. This is inflated by Mail Privacy Protection auto-opens (Litmus itself calls those opens unreliable), but Apple is still where most newsletter readers are.
- **Knak, Nicole Merlin, Head of Email Strategy** ("Apple Intelligence and email", updated 4 Aug 2026; hands-on tests on iOS 18.2, re-checked against iOS 26.6 docs; read):
  - **Categories are on by default:** Primary, Transactions, Updates, Promotions. Since the 26-series releases they're on Mac and iPad too.
  - Users can switch to List View, or use "Categorize Sender" to move a sender.
  - Apple's own marketing mail landed in Promotions in their tests, so **Promotions isn't a deliverability penalty**.
  - **Summaries replace preview text.** On Apple Intelligence devices, an on-device AI summary is shown instead of your preheader. Each reader may see a different summary. Since iOS 26.1 this is the default in most regions and 16 languages.
  - **Only three things move the summary:** the sender name, the subject line and the live text of the email. Robots meta, schema.org, heading structure and hidden "dear AI" instructions all failed. The preheader is read but **never shown verbatim**. **ALT text and text inside images are not read.**
  - **Two-part subject + preheader jokes are dead:** the punchline never renders.
  - Users can turn summaries off (Settings → Apps → Mail → Summarize Message Previews) or shorten them.
  - **Branded Mail** (sender logo) is separate from BIMI. It needs DKIM (SPF-only isn't enough), DMARC, and a non-gmail domain.
- **Validity** ("Coming to terms with tabs", read): after Gmail introduced tabs, Return Path data showed users kept reading brands they already engaged with at the same rate. Their advice is to earn engagement, not game placement. (Old data, carried over by analogy.)

## How to do it
1. **Make the first live sentence the summary you want.** Put the one news item and the one action first, in real text (not an image): "New free chapter: the 1824 estate map, read it here." The same line feeds Gmail's summary.
2. **Make the subject complete on its own.** It shouldn't depend on the preheader. Keep writing a preheader anyway: Gmail, Outlook and older iPhones still show it verbatim.
3. **Put all key words in live text.** Titles, prices and dates baked into images are invisible to the summary and to search in Mail.
4. **Use a recognisable sender name**, e.g. "Cedwyn" (plus "Archive" or "Estate" if needed), the same every time. Never a person's name.
5. **Promotions is fine.** Ask engaged readers once (welcome email P.S.) to reply or move us to Primary ("tap ⋯ › Categorize Sender › Primary"). Don't use spam-trigger tricks to fake "personal" mail.
6. **Keep receipts plainly transactional.** A Stripe purchase/download email with the order details in text lands in Transactions, where people look for it.
7. **Measure clicks, replies and sales, not opens.** MPP plus summaries mean opens tell us almost nothing on Apple.
8. **Check the result:** send a test to an iPhone with Apple Intelligence on, screenshot which tab it lands in and the summary, and compare that with what we meant.

## How we apply it to Cedwyn
- Readers are UK and Patagonia, mostly on phones, so the iPhone inbox is likely the main surface (Litmus share; our own Mailchimp client mix not checked).
- **Proposed (not changed):**
  - Rewrite the first line of the welcome 1–3, weekly and re-engage Mailchimp templates as a self-contained one-line summary plus the single link (same edit the Gmail skill proposes, so one change serves both).
  - Move any text that's inside header images into live text.
  - Make sure the From name reads "Cedwyn" on every send.
  - Add the one-line "Categorize Sender › Primary" P.S. to welcome email 1 only, in cy/en/es.
- Branded Mail needs a verified sending domain with DKIM. Check the Mailchimp sending domain first (`mailchimp-sending-domain-auth-dmarc-free-from.md`); a gmail.com From isn't eligible.
- **Editorial:** summaries are shown out of context, so the first lines never carry names or case wording (the project lead never named; banned-words list applies).
- **Owner step:** one iPhone test with Apple Intelligence on, needed for step 8. We have no iPhone; the project lead would forward a screenshot if he wants this checked.

## Sources
- knak.com (read; practitioner hands-on tests)
- support.apple.com (Apple: Categorize Sender, categories)
- validity.com (read)
- litmus.com (Sept 2026 figures via search snippet)
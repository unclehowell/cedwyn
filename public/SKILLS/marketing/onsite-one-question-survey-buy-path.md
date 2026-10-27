# One-question on-site survey on the buy path ("what's stopping you?") for a low-traffic e-book shop

Read 27 Oct 2026 (skills harvest 01:22). Type: CRO research / zero-spend. Status for Cedwyn: the /ebooks/ page and runtime are under the repair freeze; a widget ships only as a patch in the project workspace until the freeze lifts or a SALES FIX run judges it the top fix.

## Why
We have traffic but no sales (W43: ~339 non-US HTML hits on the ebooks host, 36 of them from GB; Stripe 0, Gumroad 0; Mailchimp 1). Analytics states *where* people leave, never *why*. One open question at the moment of hesitation gives the why in the reader's own words, and those words become the next headline or FAQ test.

## Evidence (how solid each is)
- CXL, "How To Use On-Site Surveys to Increase Conversions" (Alex Birkett, updated Sep 2023; read, primary practitioner): Teespring's research turned up "Not sure if I should give my credit card information" / "Not sure if I'll get my shirt"; a one-line CTA microcopy change answering that fear lifted conversions 12.7% (Optimizely case, as reported by CXL).
- Same article, Jen Havice + Dustin Drees for LearnVisualStudio.NET (read): on-site survey found ~2/3 of respondents were beginners and 69.74% wanted "their first developer job"; saying who the lessons are for lifted Courses +9.2%, Plans & Pricing +24%, Curriculum +23.9%, and the reworked above-fold CTA +66.3%.
- Dustin Drees (quoted there): target underperforming pages with high exit %; biggest mistake is no clear focus - broad questions, wrong timing, asking on every page.
- Avinash Kaushik's "three greatest survey questions" (quoted there): purpose of your visit today? / were you able to complete your task? / if not, why not?
- CXL timing heuristic: ask visitors just above average engagement (time on page / pages viewed), never on landing; never ask "why are you here" at checkout.
- Maxio (snippet, not read in full): post-purchase "What's the one thing that nearly stopped you from buying from us?"
- Not checked: the "10-15% average lift from exit surveys" figure on a popup-vendor blog (vendor marketing; do not quote).

## How to do it
1. One goal, one page. Ours: why /ebooks/ visitors do not click Buy.
2. One open question, optional one-tap choices first (raises response rate on mobile), then a free-text box:
   "Anything stopping you getting the e-book today?" choices: Price / Not sure what's inside / Prefer print / Just browsing / Something else (text).
3. Trigger: after 30-45 s on /ebooks/ OR scroll past the first book card, once per visitor (localStorage flag), never on first 5 s, never over the buy button, closable, no email asked.
4. Store anonymously (no IP, no name) in an existing store we already run (the site's Worker/KV used by the guest book or chat) - no third-party survey vendor, no cookies beyond the once-only flag, so no consent banner change. If a vendor were ever used, UK PECR/consent applies (see clarity-heatmaps-recordings-uk-consent.md).
5. Read every answer weekly. Code each into 4-6 themes (price, trust in delivery, content unclear, format, wrong audience). With low traffic expect ~1-3% response: 300 visits/week = 3-9 answers. 20-30 answers is enough to see the top theme; do not wait for statistics.
6. Turn the top theme into ONE change + measure (ab-testing-small-lists.md, tools/ab_stats.py): e.g. "Not sure what's inside" -> add the contents list and a 2-page preview (preview-pdf-sales-tool-paid-titles.md); "Not sure I'll get it" -> state "PDF + EPUB, instant download link by email, Stripe receipt" next to Buy (Teespring pattern).
7. Post-purchase twin: on the thank-you page ask "What nearly stopped you buying?" (one box) - pairs with self-reported-attribution-hdyhau-survey.md (ask HDYHAU there, this one here; never both in one popup).

## How we apply it to Cedwyn
- Patch, not live edit: build the widget as a tiny static JS + CSS file (no framework) in the project workspace with the exact copy above, in en (cy/es later via the trilingual pattern). The SALES FIX run decides whether it is the top fix; site-wide only through the agreed PR route.
- Public copy rules apply: never name the owner; none of the banned words; the widget must not explain itself ("Help us improve" is fine, no "this survey is used to...").
- Weekly: the growth report adds "survey answers: N, top theme" to the project workspace notes.
- Success = top objection identified within 2 weeks, one change shipped against it, and Buy-click rate compared over the next 300 visits.

## Sources
- cxl.com (read 27 Oct 2026)
- maxio.com (snippet only)
- rich-page.com (snippet: "Is there anything stopping you from purchasing right now?")
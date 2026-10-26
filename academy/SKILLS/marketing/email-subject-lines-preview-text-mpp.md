# Email subject lines, preview text and open-rate honesty (2026)

Topic: what to put in the subject line and preview text of Cedwyn newsletters and of outreach to UK institutions and journalists, and how to judge results when opens are inflated by Apple Mail Privacy Protection (MPP). Added 2026-10-26 (skills harvest 14:52).

## The evidence (with sources)

1. **Opens are no longer a reading signal.** Omeda measured about 80,000 deployments (~2 billion emails) either side of Apple MPP launching in Sept 2021: unique open rate rose from 15.2% to 29.0% while unique click rate stayed flat (1.5% -> 1.6%) and delivery stayed ~98.5%. The extra "opens" were Apple pre-loading the tracking pixel, not people. Mailchimp's own help page states MPP reports Apple Mail messages as opened "regardless of the contact's activity", and that clicks are still reported correctly. Stripo's 2026 B2B benchmark puts the share of tracked opens driven by MPP pixel pre-loading at 49.29% (their estimate; not checked against raw data).
   -> **Judge every subject-line test on clicks (or replies), never opens.**
2. **Length: two audiences, two answers.**
   - Consumer/newsletter: Mailchimp's guidance is at most 9 words / 60 characters, at most 3 punctuation marks, at most 1 emoji. Mobile Gmail shows only 36-37 characters of a subject (BuzzStream's device test below), so the hook must sit in the first ~35 characters.
   - Pitches to journalists/editors: BuzzStream analysed 6 million outreach subject lines (2025-26). Best open rates came at 9-13 words (40.20%) and 71+ characters (40.71%), which matches desktop Gmail's ~88-character window. Leading with a bracket: 52.08% opens, 2.24% replies. Naming the publication: 50.81% vs 39.25% (only ~1% of senders did it; small sample). Offering an exclusive: 54.16% vs 37.16%. Putting the journalist's own name in the subject did worse (38.45%). Title Case beat sentence case (40.75% vs 35.03% opens; 1.46% vs 1.01% replies). Openers like "Study finds" topped phrasing (~41% opens, 1.25% replies). Caveat: these are open rates from a vendor's users, so MPP inflates all of them equally; the reply-rate differences are the solid part.
3. **Preview text.** Litmus: clients show anywhere from 0 to ~278 characters of preview; keep it under 90 characters with the key words first. Hidden preheaders no longer hurt deliverability. If you leave it empty the client pulls the first body text (often "View in browser" or alt text), which wastes the second line.

## How to do it (checklist)

1. Write 3 subject candidates per send: one specific-fact, one question/curiosity, one bracket-led. Keep the newsletter versions <= 50 characters, hook in the first 35.
2. Write the preview text as the subject's second sentence (40-90 characters). Never repeat the subject. In Mailchimp: Campaign > Subject > Preview text field.
3. Test only when each arm can get enough clicks (see ab-testing-small-lists.md). On a small list, do not split-test; rotate styles across sends and log clicks per send.
4. Mailchimp report settings: read **Click rate** and **Unique clicks**, ignore Open rate; keep bot filtering on.
5. Cold/institutional emails (HubSpot drafts only): subject = 8-14 words, Title Case allowed, bracket tag first, name their collection or publication, no recipient name, no exclamation marks, no "Free", no ALL CAPS.
6. Run each subject through our existing email_lint script before a draft is marked ready; no new tool needed.
7. Log: date, list, subject, preview, sends, unique clicks, replies in the project workspace

## How we apply it to Cedwyn

- **Newsletter (Mailchimp, small list):** subjects like
  - "Tŷ Mawr's first record mention: 1824" (36 chars) + preview "The David Stewart survey, page by page, and what it shows."
  - "Who bought Tŷ Mawr in 1667?" + preview "The 1974 newspaper reports and ITV News 1988, side by side."
  - "[New e-book] Every name the place has carried" + preview "Llandough, Tŷ Mawr, Great House: one register, cy/en/es."
  Judge each on clicks to /ebooks/ (UTM'd), not opens.
- **Institution and archive emails (HubSpot drafts, sent only on the owner's GO):** e.g. "[Records Request] 1824 David Stewart Survey Entry for Tŷ Mawr, Llandough" or "[Catalogue Query] Accession 95.56H, Great House Farm, Llandough". Bracket + their own catalogue language beats a generic "Enquiry".
- **Press (only on the owner's GO):** "[Exclusive for WalesOnline] Object register traces 24 finds from Tŷ Mawr" pattern: bracket, publication name, a number, no journalist name.

## Sources
- omeda.com
- mailchimp.com
- mailchimp.com
- buzzstream.com
- litmus.com
- research.stripo.email (MPP share estimate)
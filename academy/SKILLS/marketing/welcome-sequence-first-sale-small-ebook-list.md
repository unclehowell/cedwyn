# Skill: turning reader signups into first sales (a welcome sequence for a small e-book list)
Written 26 Oct 2026 by the project lead's Cedwyn editors (skills harvest). Builds on 1.md (email/CRM overview); this file is the concrete 5-email sequence and its rules.

## What the evidence states
- Welcome automations are the best-performing email: Omnisend's May 2026 benchmarks (via digitalapplied.com) put automated welcome emails at ~35.5% open, 3.9% click, 2.1% conversion, and a 3-email series drives ~90% more orders than a single email; the first 48 hours after signup are the highest-engagement window.
- The gap from free to paid is the real problem: practitioners put the typical freebie-to-paid conversion at around 2-5%, and name three causes: a magnet that satisfies instead of teasing, a magnet unrelated to the paid book, and no nurture sequence ("a reader signs up, gets their freebie, and then... crickets") (manuscriptreport.com, reader magnets guide).
- The best magnets are a direct taste of the paid book (for non-fiction: a real chapter that opens a question the book answers).
- Relationship beats one-off pushes: keeping a reader is cheaper than finding one, and marketing doesn't end at the sale (David Gaughran, "Email Marketing: Your Secret Weapon").

## The sequence (5 emails over 8 days, then the regular newsletter)
- E0, immediately after confirm: deliver the free chapter (one button). One line on what the archive is. Ask ONE question they can reply to ("What brought you to Welsh land history?"); replies help deliverability and tell us who they are.
- E1, day 1: the story behind one document in the chapter (an image of the real record, 150-250 words). Ends on an open question the book answers. No sale.
- E2, day 3: a second short excerpt from later in the book that pays off E1's question halfway. Soft mention: "the full book is £9.99".
- E3, day 5: the offer. What's in the book, who it's for, the price as listed (£9.99; bundle £31.99), one buy button to the /ebooks/ page, and the guarantee or terms we actually offer. Deadlines only if real.
- E4, day 8: answers to likely objections (what format, where it opens, how long it is, what the sources are) + a reader quote once we have a genuine one (see reviews-social-proof-direct-ebooks.md). Then the reader joins the normal newsletter.
- Buyers leave the sequence the moment they buy (tag on purchase) and get a thank-you that asks for an honest review.

## Rules
- Plain, letter-like design, one main link per email (html-email-design-accessibility.md); one-click unsubscribe in every email.
- No fake urgency or scarcity: falsely saying something is available only for a very limited time is a banned practice in UK consumer law (CPRs 2008 Sch.1, carried into the DMCC Act 2024 Sch.20). No invented reviews (CMA208).
- Links in emails leave the inbox, so they may carry UTMs (utm_source=newsletter&utm_medium=email&utm_campaign=welcome-e3). Links between our own pages never do.
- Measure per email: clicks (not opens, which privacy features inflate), buy-clicks, sales attributed within 7 days. With tiny numbers, judge by individual replies and buyers, not percentages (ab-testing-small-lists.md).

## How we apply it to Cedwyn
- Current set-up (the project workspace, the project workspace): double opt-in signups through the site's /api/list/subscribe (confirm mail from cedwyn@) and the Mailchimp audience 6139ff4a0d, tag ghf-sample-chapter. The list is about 1 confirmed subscriber, so write the sequence once now; it then works on every future signup with no further effort.
- Where it runs: check the connected Mailchimp account's plan before building. Mailchimp's free plan is reported to carry only single-step automations (one welcome email), and multi-step journeys need a paid plan; zero spend means no upgrade. Free fallbacks: E0 as Mailchimp's welcome automation, E1-E4 sent by the site's own subscribe worker on a schedule from cedwyn@ (it already sends the confirm mail), or as dated campaigns to the tag segment.
- Copy: Tab drafts all five in the project workspace (text + HTML, lint with tools/email_lint.py); e-mails go only to people who signed up, so this is not outreach and fits the institutions-only rule for cold contact.
- Chapter fit: the free chapter must end on a question the paid book answers; if the current sample chapter ends neatly, swap in one that opens a thread.
- Public text rules apply: never name the project lead, banned words, no insignia, no accusations about named people, nothing about family holdings.
- Success measure for the first month: the first sale traced to a welcome email, and the reply rate to E0.

## Sources
- digitalapplied.com, "The Welcome Email Sequence: a 2026 onboarding framework", 4 Jun 2026 (citing Omnisend May 2026 benchmarks; same source as 1.md)
- manuscriptreport.com (2-5% freebie-to-paid gap; magnet tiers)
- davidgaughran.com (retention, welcome sequence)
- writtenwordmedia.com (Mailchimp single-step welcome automation)
- legislation.gov.uk (DMCC Act 2024 banned practices) · CMA208 fake reviews guidance (gov.uk)
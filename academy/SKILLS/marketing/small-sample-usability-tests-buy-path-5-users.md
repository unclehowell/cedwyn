# Small-sample usability tests on the buy path (5 users, think-aloud, five-second test)

Skill harvested 27 Oct 2026 (06:10Z). Topic: funnel/CRO when traffic is too small for A/B tests.

## Why this, why now
With about 1 Mailchimp member and 0 e-book sales, no A/B test can give an answer (see `ab-testing-small-lists.md`, `sample-ratio-mismatch-srm-check-ab-tests.md`). Watching a handful of real people try to buy is the one CRO method that works at zero traffic.

## What the primary sources say (read 27 Oct 2026)
- **Nielsen Norman Group, "Why You Only Need to Test with 5 Users"** (Nielsen): "The best results come from testing no more than 5 users and running as many small tests as you can afford." After the fifth user "you are wasting your time by observing the same findings repeatedly." Finding *all* problems needs at least 15 users, but the budget is better spent as 3 rounds of 5 with fixes in between. Never test only 1 user (one person's accident misleads); "even 3 users are enough to get an idea of the diversity."
- **NN/g, "Why 5 Participants Are Okay in a Qualitative Study, but Not in a Quantitative One"**: the 5-user model (Nielsen and Landauer) finds about 85% of issues *only if* a typical problem hits about 31% of users. The more usable the page, the more users you need. Numbers (completion rate, time on task) need about 40 participants (NN/g's linked "Why use 40 participants").
- **MeasuringU, "Why you only need to test with five users (explained)"** (Sauro): 5 users is for *discovering* problems, not for comparing two designs or estimating a completion rate. The 31% is an average across several studies.
- **Five-second test**: Lyssna's guide (a vendor) states 5 to 10 participants show the major patterns; data36 states 20 to 50. Not checked against independent research; treat it as a quick clarity check, not a measurement.

## How to run it (no tools to install)
1. **Write 3 to 4 real tasks**, not leading ones. Good: "You heard about this farm's history. Get the free version of one book onto your phone." Bad: "Click the free version link."
2. **Recruit 5 people who match the buyer** (local-history readers, family-history society members, Welsh-Patagonian readers). If groups differ a lot (English vs Spanish readers), NN/g's rule is 3 to 4 per group.
3. **Run it on their own phone**, in person or on a video call with screen share. Ask them to think aloud. Say nothing except "what are you thinking?" Never help.
4. **Log every stumble** in one sheet: issue, how many of 5 hit it, where (URL + step), severity (blocks purchase / slows / cosmetic).
5. **Fix the blockers, then test 5 new people.** Three rounds of 5 beat one round of 15.
6. **Five-second test for the hero**: show the page for 5 seconds, hide it, ask "what is this page for, and what would you do next?" If fewer than 3 of 5 say "buy or download a history e-book", the top of the page is not doing its job.

## Pitfalls
- 5 users cannot tell you whether version A sells more than version B. Do not report percentages from 5 people.
- Friends and family are polite. Ask them to narrate, and watch what they do, not what they say.
- Frequency is not importance: one person who cannot reach the payment page is a blocker, even at 1 of 5.

## How we apply it to Cedwyn (proposal; nothing done, nobody contacted)
- **Buy path to test**: /ebooks/ -> pick a book -> version drop-down (defaults to v0.0.2 at £4.99) -> "free version (v0.0.1 2026)" link -> Stripe Payment Link -> download/delivery.
- **Tasks**: (1) get the free version of any book; (2) find out what the paid version adds and what it costs; (3) buy one book (stop at the Stripe card field, no real payment); (4) find the bundle price.
- **Watch for**: does anyone understand "v0.0.2"? Do they find the free link under the drop-down? Does the Stripe hand-off feel trustworthy? Does the preview pop-up help or trap them?
- **Who**: only the project lead can recruit testers (friends, a history society contact). Tab can write the script and the log sheet and analyse recordings the project lead shares. Run 1 round of 5 English readers, then 3 Spanish readers once the /es/ path matters.
- **Output**: fixes go to the site flywheel as PROPOSED items; findings go in the Sunday growth report notes.

## Sources
- nngroup.com
- nngroup.com
- measuringu.com
- lyssna.com (vendor; participant number not checked)
- data36.com (practitioner blog; number not checked)
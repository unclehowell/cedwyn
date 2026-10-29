# Email sender ("From") name: pick one honest name, test it once on clicks, re-test before trusting it

Date: 28 Oct 2026 · Status: playbook + proposal (no send, no account change)

## Why it matters
- Inbox rows show the From name first. Litmus/Fluent consumer survey: 42% of recipients look at the sender name first when deciding to open, ahead of the subject line (34%). (Secondary: quoted by Mixmax and Stripo's 2026 benchmark report; the original Litmus page was not opened. Treat as directional.)
- HubSpot's own A/B test (as reported by Media Junction, Oct 2021; HubSpot's original post not opened): sending from a person's name instead of the company gave +0.53 pts opens and +0.23 pts click-through, about 130 more leads at their list size. Small lift, big list.

## The testimony that changes how to run it (GitLab, primary, read)
Hank Taylor, GitLab newsletter (LinkedIn, 20 Aug 2016), five-way From-name test on a large list: "GitLab", "GitLab Newsletter", "Hank Taylor", "Heather McNamee", "Ashley Smith".
- Test 1: "Ashley Smith" won by about 4% over the corporate names, statistically significant, no rise in unsubscribes (about 10,000 extra opens at their size).
- Re-test a couple of months later: the corporate name "GitLab" came back on top, by a thin margin.
- His own reading: the novelty/uncertainty of an unknown personal name wore off, readers learned what the newsletter was, or test 1 was chance.
- Lesson: a From-name win is often a novelty effect. Re-test before you make it permanent, and do not pick a name designed to make people think they know the sender ("Ashley Smith" was chosen for exactly that ambiguity).

## The playbook
1. Rules first, test second. The From name must be (a) a name readers recognise from the signup form, (b) honest (no invented person, no "uncertain who this is" trick), (c) stable: changing it often looks like a new sender to people and to filters.
2. Keep the From address on our authenticated domain (SPF/DKIM/DMARC already covered in the deliverability skills). Never no-reply.
3. Keep it short: phones truncate long sender names, so put the recognisable word first ("Cedwyn ...", not "The Archive of the ... Cedwyn").
4. Only test when the list is big enough. Use `tools/ab_stats.py samplesize <base_click_rate> <lift>` before sending. At our list size this will usually say "too small"; then do not test, just use the rule-1 name.
5. Judge on clicks, not opens. Apple Mail Privacy Protection inflates opens (Omeda: unique opens 15.2% -> 29.0% while clicks stayed flat; see email-subject-lines-preview-text-mpp.md and email-metrics-mpp-bot-clicks-what-to-trust.md). Strip scanner clicks with `tools/bot_click_flag.py` first.
6. If a variant wins, adopt it for 2-3 sends, then re-run the same test once (the GitLab replication step). Keep it only if it wins twice.
7. Log both tests (date, arms, n, clicks, p) in the weekly report notes.

## How we apply it to Cedwyn
- Proposal for the Mailchimp audience's default From name: "Cedwyn Estate" (or "Cedwyn Archive" if the signup form states "archive letters"). Match whatever word the signup form and welcome email use; check that first.
- Never a personal name: public text never names the project lead, and an invented archivist persona would be dishonest. If a human touch is wanted, put it in the sign-off ("the Cedwyn archive team"), not the From line.
- Do not run a From-name A/B test until `ab_stats.py samplesize` states the list can detect the lift on clicks. With a list in the low hundreds, the answer is "don't test, be consistent".
- Do not change the From name around a launch send; change it (if ever) on an ordinary letter, and say so in the first line ("Same letters, new sender name").
- Status: PROPOSAL; changing the audience default in Mailchimp is a live change for the BIZDEV run to make within BRIEF.md rules. Nothing sent.

## Sources
- linkedin.com (read: GitLab 5-arm test and failed replication)
- mediajunction.com (read: HubSpot sender test +0.53 pts opens, +0.23 pts CTR, 130+ leads)
- mixmax.com (snippet: Litmus + Fluent, 42% check sender first)
- research.stripo.email (snippet: 42% sender vs 34% subject line)
- mailchimp.com (read: recognisable, personable sender name; vendor guidance, no numbers)
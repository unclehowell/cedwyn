# Click-based interest tags + segments in Mailchimp (small heritage list)

Skill harvest, 26 Oct 2026. Topic: letting readers sort themselves by clicking, then sending each group the e-book that matches. Different from the welcome sequence, win-back, send-time and list-cleaning files already in the index: this is about **who gets which offer**, using clicks (not opens).

## What the primary sources state
- **Mailchimp's own segmentation study** (resource page, updated 1 Feb 2017; ~2,000 accounts, ~11,000 segmented campaigns, almost 9 million recipients; compared with the same senders' non-segmented campaigns): opens **+14.31%**, unique opens **+10.64%**, clicks **+100.95%**, bounces **-4.65%**, abuse reports **-3.90%**, unsubscribes **-9.37%**. Old data, large senders, pre-Apple Mail Privacy Protection, so the open figures are now unreliable; the click and unsubscribe direction is the useful part. Whether it holds for a list of a few hundred is not checked.
- **Segment conditions (Mailchimp help, "All the segmenting options", read 26 Oct 2026):** "Email interaction" supports *has clicked / has not clicked* across *any of the last 5 campaigns*, *campaigns in the last 7 days / 1 month / 3 months*, or a specific campaign. Opens can be split *with* or *without Apple privacy opens*, which confirms machine opens pollute open-based segments. Up to 10 conditions per segment.
- **Automation triggers (Mailchimp help, "All the marketing automation flow triggers", read 26 Oct 2026):** *Clicks specific email link* ("adds a contact after they click a specific link in a specific email"), *Clicks any email link*, *Doesn't click email link*, and *Responds to survey*. A flow can **tag** the contact as its action, so one click becomes a permanent interest tag.
- **Tags (Mailchimp help, "Create, add or remove tags"):** tags are internal labels for shared interests or locations; contacts never see them.
- Whether the account's current plan allows multi-step flows with a click trigger is not checked here; see `mailchimp-free-plan-2026-limits-gates.md` before building anything.

## The routine
1. **Define 3-4 interests that map to products**, not to vague topics. One tag = one thing we can sell or send. Example set: `int-farm-case` (the farm and the court case), `int-patagonia` (Welsh Patagonia, Spanish readers), `int-places` (Llandough/Penarth local history), `int-sources` (original documents and transcriptions).
2. **Ask with links, not a form.** In a normal newsletter add one line: "Which should we send more of?" with 3-4 plain text links, each pointing to a real page on the site (UTM per `utm-discipline-ga4-funnel.md`). Every click is useful content for the reader, not a dead survey link.
3. **Turn the click into a tag.** Either (a) a flow with trigger *Clicks specific email link* -> action *tag contact*, or (b) after 7 days, build a segment *Email interaction > has clicked > that campaign > that link* (if available on the plan) and bulk-tag it by hand. (b) needs no automation and works on any plan that has segments.
4. **Re-ask quietly.** Repeat the one-line question every 4-6 sends with the same links; a contact can hold several tags.
5. **Send the matching offer only to the matching tag.** E.g. the Spanish edition note goes to `int-patagonia` only; everyone else gets the general issue. Keep one untagged control: anyone with no tag gets the general version.
6. **Read clicks and unsubscribes, not opens.** Compare click rate and unsubscribe rate of the segmented send against the last 3 general sends. With small numbers use the stop rules in `ab-testing-small-lists.md`; a single send proves nothing.
7. **Hygiene.** Tag names in lower case with an `int-` prefix; never tag on a single open; review tags monthly and delete any interest with under 5 contacts after 3 asks.

## Pitfalls
- Open-based segments now catch machine opens (Apple). Use clicks.
- Too many interests split a small list into groups of 3. Keep to 3-4.
- A segment that suppresses people from the general issue is a change in what they receive: keep the general issue going to all, and add the targeted note on top.

## How we apply it to Cedwyn
- **PROPOSAL (new email journey, owner GO needed):** add the one-line "Which should we send more of?" with 4 links to the next regular newsletter, and tag clicks by hand from a segment after 7 days (route b, no automation). No price change.
- Read-only prep that needs no GO: list existing Mailchimp tags and count contacts per tag; check whether the plan allows the *Clicks specific email link* trigger and email-interaction segments; draft the 4 link lines in EN (and ES for `int-patagonia`). Drafts stay in the folder.
- First targeted use, once tags exist: the matching e-book note to each tag only, at the listed price, measured by Stripe/Gumroad sales per tag over 14 days.
- Stop rule: if after 3 asks fewer than 10% of recipients have any tag, drop the routine and keep one general newsletter.

## Sources
- mailchimp.com (read 26 Oct 2026; data updated 1 Feb 2017)
- mailchimp.com (read 26 Oct 2026)
- mailchimp.com (read 26 Oct 2026)
- mailchimp.com (read 26 Oct 2026)
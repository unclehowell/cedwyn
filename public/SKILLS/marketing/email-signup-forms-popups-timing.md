# Email signup forms that convert without hurting search (popups, inline, timing)
Harvested 26 Oct 2026 (skills harvest). The fastest free lever between "visitors" and "sales" is a list: readers who sign up can be told when a new e-book lands.

## What the primary sources establish
- Getsitecontrol's own conversion research (sample about 90% e-commerce, the rest blogs and media): email popups converted 6.57% on mobile and 3.77% on desktop. Delay mattered: shown after under 2 s 4.01%, 2-5 s 3.46%, over 5 s 5.26%; they advise picking a delay that lets the visitor understand the page, then testing.
- Crazy Egg's roundup of popup datasets (2026): click-triggered popups (the visitor taps a button, e.g. "Get the free chapter") converted 54.42%; exit-intent popups 3.94%; popups after 6-15 s beat immediate popups in every dataset that measured timing; mobile beat desktop in all five datasets that split by device; 1-3 form fields convert about the same (2.1-2.2%), 4+ fields drop conversion.
- Alia's 2026 benchmark: average popup 4.82%; second-page triggers (shown on a visitor's second pageview) 28.98%. Vendor data, treat as direction, not promise.
- Google's "Interstitials and dialogs" guidance: use banners that take a small fraction of the screen instead of full-page interstitials, so users and Google reach the content as soon as they land. A full-screen mobile popup on arrival from search is the pattern to avoid.
- UK law (PECR/UK GDPR, ICO guidance): marketing email to individuals needs clear opt-in consent; no pre-ticked boxes; say what they will get and how often.

## The playbook
1. Lead with a click-triggered form: a visible button in the e-book strip and at the end of each story ("Email me the free first edition"), opening a small form. Highest-converting pattern and no search penalty.
2. Inline form at the end of long story pages (where interest peaks), one field (email), optional first name.
3. If any timed popup is used: mobile only as a bottom banner (under ~30% of the screen), never on first pageview from search, trigger on the second pageview or after 15 s / 50% scroll, dismiss remembered for 30 days.
4. Offer something real and free: a free e-book or chapter beats "subscribe to updates".
5. Double opt-in through Mailchimp, consent text: what they get, roughly how often, unsubscribe any time.
6. Measure: form views vs signups per placement (UTM or Mailchimp form IDs), A/B one variable at a time (see ab-testing-small-lists.md). Expect 2-6% on inline/timed, far more on click-triggered.

## How we apply it to Cedwyn
- Checked live today: `/ebooks/` has no signup form and no "mailchimp"/"signup" in its HTML; the bizdev run found the Facebook post scheduled for Tue 3 Nov links to `/ebooks/#signup`, which does not exist yet. Adding a `#signup` section with a click-triggered button + inline Mailchimp embedded form (free plan) fixes both. Queue as a patch for the committer; do not commit from this run.
- Offer: the free "Enwau: the names of Tŷ Mawr" e-book (already free) as the signup gift, delivered by the Mailchimp welcome email.
- Copy example: "Get Enwau free: 108 names of Tŷ Mawr, each with its date and source. From 1667, when the Williams family acquired the house (1974 newspaper reports; ITV News, 1988), to the 1824 David Stewart survey, the first record mention found." No Bute-held dates presented as Tŷ Mawr records, no hedges, none of the banned public words.
- Three languages: one form per language page (en/cy/es), tagged by language in Mailchimp so later emails go out in the reader's language.
- No full-screen popups anywhere (also keeps the site in line with the project lead's dislike of big notices).

## Sources
- getsitecontrol.com (read 26 Oct 2026)
- crazyegg.com (read 26 Oct 2026)
- aliapopups.com (vendor benchmark, read 26 Oct 2026)
- developers.google.com (read 26 Oct 2026)
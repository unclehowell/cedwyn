# Instagram: turning reach into clicks when the bio has no link yet
Harvested 26 Oct 2026 (skills harvest). For: the Cedwyn / Great House Farm Instagram account.

## The problem in one line
Instagram reached about 1,000 people today, but every caption said "link in bio" and the bio has no link. Instagram does not make URLs in captions or comments tappable, so the only tappable routes are the profile links, a Story link sticker and DMs. With no profile link, a "link in bio" call to action loses every click.

## What the sources show
- **Five profile links, one tap.** Instagram lets any account add up to 5 links: Edit profile > Links > Add external link, then drag to reorder. Not available on desktop. (help.instagram.com; TechCrunch 18 Apr 2023.) The first link is the one shown on the profile; the rest sit behind "and N more", so order matters.
- **Measure it.** Insights report profile "external link taps" (Business/Creator accounts) and Story "link taps" under Interactions (help.instagram.com). These are the only first-party click counts we get; pair them with UTM tags so the site's analytics shows the same clicks.
- **Bio link click rate is low; plan for it.** ManyChat's partner programme puts link-in-bio click-through at about 1% vs about 46% for a link sent in a DM (quoted by Brittany Miller Socials; a tool vendor's own figure, not independently checked). One practitioner test on Reddit (r/SocialMediaMarketing, 2026) reported 2% for "link in bio" vs 18% for "comment a word and get the link by DM" (single anonymous test, unchecked). Direction is consistent: every extra step (leave post, open profile, find link) loses most people.
- **Story link sticker** replaced swipe-up and is open to every account regardless of followers; its CTR is the Stories conversion metric (Socialinsider, Instagram metrics 2026). Practitioner tip from the same piece: place it mid-frame with a one-line reason to tap.
- **Fewer, clearer links beat a long menu** (growthforlocal.com bio-link guide 2026: clear CTA + fewer links + mobile-first page; its "350%" headline is a marketing claim, ignore the number, keep the method).

## How to do it (30 minutes, owner step first)
1. **Owner step (the project lead only, needs the Instagram login):** Edit profile > Links > Add external link. Link 1 = the e-books shelf with a UTM tag, e.g. `cedwyn.bucklerfamily.estate Title it "E-books (free + £9.99)". Optional links 2-3: the free Enwau names book, the story home page.
2. **Bio text above the link:** one line on what the account is, one line on what the tap gives ("Free names register + the full record, £9.99"). No "link in bio" sludge in the bio itself.
3. **Captions:** once the link is live, say what is behind the link ("full survey transcript in the e-book, link on our profile"). Until it is live, drop "link in bio" and write the address in plain text (people can copy it) plus the address in the first comment (already being done on the top 12 posts).
4. **Stories:** for each new post, one Story frame with a link sticker to the matching page (UTM `utm_campaign=story_<slug>`). Stories are the only tappable link that works without the bio.
5. **Landing page:** send the tap to one phone-first page whose first screen shows the free book and the £9.99 title with prices and buttons. A long table first loses phone visitors (the /ebooks/ table currently overflows at 390 px; fix queued).
6. **Comment-to-DM (PROPOSED, needs the project lead's GO):** "comment NAMES and we will send the link" sends a DM only to people who asked for it. the project lead's rule bans DMs to strangers; treat this as needing his explicit OK and a free tool before use.
7. **Weekly read (5 min):** Insights external link taps + Story link taps vs site visits with `utm_source=instagram`. Target: link taps per 1,000 reached. If taps are under 5 per 1,000 reached, change the bio's reason-to-tap line first, then the landing page.

## How we apply it to Cedwyn
- Blocker: no bio link. Root already asked the project lead (26 Oct 13:17) to add `cedwyn.bucklerfamily.estate/ebooks`. When he does, swap in the UTM version above so clicks are counted.
- No /links/ page exists on Cedwyn (404 checked 26 Oct). If the project lead prefers one link that never changes, a small `/links/` page (free Enwau, £9.99 title, £31.99 bundle, story) is the PROPOSED target; queue it via the project workspace, do not commit while another worker holds the repo.
- Story frame copy example (fits the project lead's rules): "Tŷ Mawr, first record mention found: the 1824 David Stewart survey. The family's acquisition of Tŷ Mawr in 1667 was reported in the 1974 newspapers and on ITV News in 1988. Every name the house has carried is in our free register." Sticker: "Free names book".

## Sources
- help.instagram.com (add up to 5 links)
- techcrunch.com
- help.instagram.com (Story insights: link taps)
- socialinsider.io (link sticker CTR; link-in-bio CTR as lead-gen KPI)
- brittanymillersocials.ca (1% vs 46%, vendor figure)
- reddit.com (2% vs 18%, single test)
- growthforlocal.com (fewer links, clear CTA)
# Facebook Page invites: reactors, friends, and automatic Page→Group invites

Skill added 2026-10-30 (skills harvest). Scope: Great House Farm / cedwyn only. Channel: the Facebook Page "Great House Farm II" (901925066346636).

## What it is
Facebook lets a Page's admins turn people who already engaged into followers, at no cost. There are three routes:

1. **Invite friends to follow the Page.** This is documented in Meta Help 174333482624856 (read 30 Oct 2026). Go to Page, Options, Invite Friends, Switch profiles, choose names, Send Invites. It uses the admin's *own personal friends*, so it is an owner step.
2. **Invite people who reacted to a post to follow the Page.** Open a post's reaction list and an "Invite" button sits next to each name who doesn't follow yet. Meta Business Suite lists them in bulk.
   - Meta Help does NOT document this route. I found no help page for it.
   - Practitioner reports: creator groups say "up to 1,000 people per day" per admin through Business Suite (Facebook creator-group posts and a 2025 YouTube tutorial, **not checked**).
   - Several Page owners report the button missing "for months or years on some Pages" (Reddit r/facebook, Jan 2025; search snippets, **not checked**).
   - One Page owner's acceptance rate: "lucky to get 1 out of 100" (Facebook group post, anecdote, **not checked**).
3. **Invite Page followers to a Group, including automatic invites.** This is documented in Meta Help 175196166552232 (read 30 Oct 2026). As the Page, go to the group, Invite, then "Invite Facebook followers".
   - Manual invites are capped at 1,000 per week.
   - The Automatic Invites toggle sends group invites to people who **follow the Page AND recently engaged AND were never invited before**.
   - Only one group at a time can have automatic invites, and the choice is locked for 7 days.
   - "If you've invited a person before, you won't be able to invite them again." Each person is a one-shot invite.

## Why it matters
- Reach from Reels and shares reaches non-followers. A reactor who never follows is reach we don't keep.
- Followers are the base for the Page monetisation gates. See `facebook-stars-page-monetisation-gate-500-followers.md`, which covers 500 followers held for 30 days.
- No published study with numbers on reactor-invite acceptance turned up. Treat the 1-in-100 figure as one anecdote. Our own data decides.

## How to do it (practitioner routine)
1. **Pick posts, not people.** Invite from posts that drew reactions from non-followers, usually Reels and shared posts. Do it within a few days, while the post is fresh in people's minds. This is practice advice, not a Meta rule.
2. **Check the button exists.** On a desktop, open the post's reaction count. If no "Invite" appears next to non-followers, the feature is off for this Page. Stop; there is no workaround. Don't use scripts or browser extensions to bulk-click, because automated invites risk spam flags.
3. **Stay well under any cap.** Even if 1,000 a day is possible, send at most about 100 a week from the newest posts. A small Page sending a mass of invites at once is the pattern that integrity systems watch for. That is our caution, **not a documented Meta threshold**.
4. **Log it.** Record date, post, invites sent and the follower count before and after (Page Insights). Acceptance = new followers in 7 days ÷ invites. This is an approximation, because organic follows mix in.
5. **Group route (only when a Group exists).** If a Cedwyn group is ever created, toggle Automatic Invites on that one group. Then never manually invite the same people, since invites are one-shot.

## How we apply it to Cedwyn
- **Owner step.** Inviting is done from inside Facebook as an admin. The Pages API isn't known to expose an invite endpoint (**not checked**), so no worker can do it. the project lead, or whoever admins Great House Farm II, does a 5-minute weekly pass: Business Suite, then the newest 2–3 posts, then invite non-follower reactors, at most about 100 a week.
- **Friends invite:** this is the project lead's own choice. It sends his personal friends a prompt, and the Page name itself carries no personal details. Suggest it once and don't repeat it.
- **No Cedwyn Facebook Group exists** in our notes; we only post in other people's local-history groups. Those groups belong to their admins, so Automatic Invites doesn't apply. Don't create a group just for this. Note it in the Page-growth plan as "if a group is ever opened".
- **Content first.** Invites only work on posts people reacted to, so the originality rules in `facebook-reels-originality-archive-clips.md` come first. No invites from posts that were held by the safety scan, or that mention Llandough Farm as if it were the farm (Llandough Farm sits in Kissed Frogs only).
- **Measure:** add a column `fb_invites_sent` beside the weekly Facebook follower count in `the project workspace`. After 4 weekly passes, keep the routine if acceptance is at least 3%. If it is under 1%, drop it and spend the 5 minutes replying to comments instead (`reader-replies-and-small-community.md`).
- Outreach is on hold. An invite prompt is a platform feature shown to people who already reacted to our post, not outreach to strangers. Still, nothing is sent until the project lead chooses to do the pass himself.

## Sources
- Meta Help, "Invite friends to follow a Page or profile on Facebook": facebook.com (read 30 Oct 2026)
- Meta Help, "Invite Page followers to your group" (1,000 manual/week; Automatic Invites rules): facebook.com (read 30 Oct 2026)
- r/facebook, "Invite people that have interacted to follow your page", Jan 2025 (feature missing reports): reddit.com (snippet only, not checked)
- Facebook creator group posts: "invite up to 1,000 people per day" via Business Suite; "1 out of 100" acceptance: facebook.com and facebook.com (snippets only, not checked)
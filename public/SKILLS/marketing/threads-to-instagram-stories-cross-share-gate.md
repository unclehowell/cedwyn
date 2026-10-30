# Threads -> Instagram Stories cross-share (in-app, auto, API) and the reverse

Topic: use Meta's 2026 bridges so each Threads post can also land as an Instagram Story (and each IG post on Threads), turning the larger IG audience into Threads followers. Builds on threads-api-automated-posting-limits-fallbacks.md (posting mechanics) and instagram-stories-highlights-profile-menu-new-account.md (Stories basics); neither covers the cross-share.

## What the sources say
- **TechCrunch, Sarah Perez, 20 Feb 2026 (read):** Threads added sharing a Threads post (yours or anyone's) to your Instagram Story **without leaving Threads**, with an in-app preview of the Story layout; Threads already had share to IG Feed and DMs. Context: Threads >400 M monthly users; Similarweb (Jan 2026) had Threads above X in mobile daily use. Meta's growth playbook for Threads has been repeated cross-surface pushes from Instagram and Facebook.
- **@threads official post (og text read 30 Oct 2026):** "You can now automatically share your Threads posts to IG Stories". The composer path in the search snippet: Post options > "Also share on..."; the first time you choose per post or always. Date from the search snippet: late April 2026 (not checked on the page).
- **Meta for Developers, "Share posts to Instagram Stories" (search snippet; the page answers 400 to a plain fetch, open it in the browser before coding):** cross-sharing is enabled "by including the `crossreshare_to_ig` parameter when you create content", posting to the **linked** Instagram account. The Threads API blog of 14 Apr 2026 lists "Cross-share to Instagram Stories ... via a linked Instagram account" (snippet; read in full by the 02:48Z harvest run for its other items).
- **Instagram Help 1188715848969926 (snippet):** the reverse, IG post > "Also share on..." > toggle the Threads account.
- **Teract (vendor guide, 2026; read):** share only the strongest Threads posts to Stories, 1-2 times a week, with context text; its "real example" (30K-follower creator, 180-220 Story views -> 25-35 new Threads followers per Story) is an unnamed anecdote, **not checked**. Its rule of thumb: cross-posted items should earn 15-25% of normal IG engagement, else you are cross-posting too much (vendor heuristic, not checked).
- Buffer 2026 (already indexed): replying on Threads lifts engagement 42%; automate posting, never replies.

## How to do it
1. Threads profile must be created from the Instagram account (shared login) so the accounts are linked.
2. Manual/auto: in the Threads composer, Post options > Also share on > Instagram Story; choose "this post" (not "always") so only strong posts go to Stories.
3. API: on the container-create call add `crossreshare_to_ig=true` only for posts that pass the gate below; keep the default off.
4. Gate per post: an image or carousel with a strong first frame (Stories show the post as a card; text-only posts look thin), a dated record or a door reveal, posted at least 2 h earlier on Threads with replies already flowing.
5. Cap: 2 cross-shared Stories a week. Add a link sticker to the Threads post or the site page only via manual Story edits (whether the auto-share carries a sticker is not checked).
6. Measure: Threads follower count the day before vs 48 h after each cross-share, plus Story reach in IG insights; keep a 4-row log before deciding to raise the cap.

## How we apply it to Cedwyn
- Today: blocked. Threads is not connected for Cedwyn; the owner must create the Threads profile from @cedwynestate (his login) and add it as a tester on our Meta app (see the Threads API skill). Do not ask him again while that ask is open; it already sits with the Threads API skill.
- Once live: the daily auto-social job (the project workspace) gets a `crossreshare_to_ig` flag that is true only for the weekly door reveal carousel and the Tuesday quote-pack carousel (2/week), never for every post. IG already gets the feed post, so the Story share must link back to the Threads conversation, not duplicate the feed post.
- Reverse direction is free today: when the quote pack posts to Instagram, "Also share on Threads" seeds the Threads profile without new tooling (manual in-app; needs the profile first).
- Public text rules apply unchanged to anything that lands in Stories (no naming the owner, banned words, no accusations).

## Sources
- techcrunch.com (read)
- threads.com (og text read)
- threads.com (og text read)
- developers.facebook.com (snippet; 400 to plain fetch)
- developers.facebook.com (snippet)
- help.instagram.com (snippet)
- teract.ai (read; vendor, figures not checked)
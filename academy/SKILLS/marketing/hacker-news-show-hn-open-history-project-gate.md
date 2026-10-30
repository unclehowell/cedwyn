# Hacker News (Show HN / regular submission) for an open history project — rules first, numbers second
Harvested 2026-10-30 01:28Z. ('hacker news' 0, 'show hn' 0 in INDEX before.)

## The rules that decide whether this is even possible (read, primary)
- Show HN guidelines (news.ycombinator.com): Show HN is "for something you've made that other people can play with". On topic: things people can run or hold; "For books, a sample chapter is ok." OFF topic: "blog posts, sign-up pages, newsletters, lists, and other reading material ... can't be Show HNs. Make a regular submission instead." Easy to try "without barriers such as signups or emails". "Don't post landing pages or fundraisers." "Don't post quickly-generated one-offs." "The project must be something you've worked on personally and which you're around to discuss." "Please don't ask friends to upvote or comment."
- HN guidelines (newsguidelines.html): "Please don't use HN primarily for promotion"; "Please don't put generated text in HN posts. Write your text yourself"; "please don't automate posting"; "Don't post generated text or AI-edited text"; off-topic: "Most stories about politics, or crime ... If they'd cover it on TV news, it's probably off-topic." Titles: original title, no caps/exclamations, no site name, append [video]/[pdf].
- => An agent must NOT post, comment, or write the text. Only a human who built it, in their own words, from their own long-standing account, once.

## What a front-page hit is worth (practitioner numbers, read)
- Marco Maier (marcotm.com, Jan 2024; brand-new site, no other traffic): ~35-40 unique visitors/minute while on the front page (rank ~17), dropping to ~10/min on page two after about an hour; ~3,500-4,000 from the front-page stint, almost 8,000 uniques over the next four days.
- Vincent Schmalbach (a year of Plausible data): top post 9.7k visitors (avg 15 s), two others ~2.0k and 1.9k (12-22 s). US 36.8% of readers. HN traffic is big and shallow.
- Indie Hackers post (search snippet, not read): Show HN 13 h on front page -> 11k uniques, 300+ sign-ups.
- Most submissions never leave /newest or /shownew (Maier). Treat it as a lottery ticket, not a channel.

## The playbook (only when the gate is met)
1. Pick an artefact HN readers can USE with no signup: an interactive tithe-map/parcel viewer, an open FOI-question tracker, a free sample chapter, an open dataset with a method write-up. Not the shop page, not the case.
2. Title = the thing, plain: "Show HN: An interactive 1841 tithe map of one Welsh parish" or a regular submission of a methods write-up ("How we rebuilt a parish's land history from tithe maps and FOI replies").
3. The maker posts it themselves, from an account with ordinary history; writes a first comment in their own words: what it is, how it was made, what is unfinished. Is around for 3-4 hours to answer.
4. Site must hold a spike: static pages, no heavy JS, images compressed; Cloudflare caching on. 40 visitors/min is trivial for a static site.
5. Measure: GoatCounter/Cloudflare referrer news.ycombinator.com; sample-chapter downloads + Mailchimp signups that day; do not expect direct sales (15 s average time on page).
6. One shot per artefact; no delete-and-repost; no asking anyone to upvote.

## How we apply it to Cedwyn
- Gate: the project lead must GO, post it himself (or a named human collaborator), in his own words. Tab may prepare the artefact and a facts sheet for him, never the post text, never post. Public text never names the project lead anyway, and an HN account post is his personal act, so this is his decision.
- Best candidate artefact: the tithe-map StoryMap / parcel viewer (see tithe-map-storymap-georeferenced-parcels-linkable-asset.md) or the /wales/qa/ question tracker (rebuilt 30 Oct) as an open-data/methods piece. Keep the dispute itself out of the title and first comment (HN off-topic: politics/crime) — lead with the method and the data.
- Before any submission: page loads fast at 390 px, no signup wall, free sample chapter link visible, UTM-free (HN strips nothing, but referrer is enough).
- Expected value: a few thousand visitors in a day and some newsletter signups; useful mostly for backlinks and discovery by people who write about digital history.

## Sources
- news.ycombinator.com
- news.ycombinator.com
- marcotm.com
- vincentschmalbach.com
- indiehackers.com (snippet only)
# Comment-to-DM on Instagram via Meta's free private-replies API (no paid tool)

Harvested 2026-10-27 06:58Z. Topic: turning "LINK" / "BOOK" comments on Reels and posts into a single DM carrying the free-edition link. Moves the instagram-bio-link file's "comment-to-DM PROPOSED" from an idea to a rules-checked design.

## Meta's rules (primary: developers.facebook.com, Instagram Platform "Send a Private Reply to a Commenter", updated 30 Jun 2026, read)
- Works on a professional account's posts, Reels, stories, Live and ad posts. A webhook announces each comment, and the app replies with POST `<IG_ID>/messages` using `recipient.comment_id`.
- **One message per comment,** sent **within 7 days** of the comment (Live: only during the broadcast).
- **Follow-ups only if the person replies,** and then within 24 hours of their reply. No drip to someone who never answered.
- **Where it lands:** in the person's **Inbox if they follow** the account, otherwise in **Message Requests**.
- The reply carries a link back to the post.
- **Permissions:** `instagram_business_basic`, `instagram_business_manage_comments` and `instagram_manage_messages` (or the Facebook-login equivalents), plus the comments webhook.
- **Rate limits** (as quoted by creatorflow.so from Meta): 750 private replies per hour per post-comment route. Not checked on Meta's page.
- **Disclosure** (ChattyFlow's summary of Meta's messaging policy, not read at source): where the law requires it, an automated chat states it's automated. Meta recommends this everywhere. One line does it: "Automatic reply from Cedwyn".

## Practitioner numbers (all vendor-published; treat as optimistic)
- **creatorflow.so case studies (2026):**
  - a running coach got 2,000 emails, with 80% of people who received the DM entering their email, against 4-5% from her bio-link landing page;
  - typical ranges they quote: DM link click-through 10-25%, DM-to-email 50-60%, direct sale 2-5%;
  - targeted DMs to commenters get 40% replies against 2% for cold mass DMs (Inro, 2025).
- **ManyChat** (vendor figure, already in instagram-bio-link-conversion-no-link-yet.md): link-in-bio about 1% against DM about 46% click-through. One Reddit test: 2% against 18%.
- None of these is an independent study. The mechanism is credible: it cuts steps (post → bio → page → form becomes comment → DM link).

## How-to
1. **Account:** a professional (Business or Creator) IG account linked to the FB Page. A personal account can't use the API.
2. **One keyword per post,** stated in the caption and on screen: "Comment BOOK and I'll DM you the free edition". Add variants (book, Book, LLYFR, LIBRO), since matching is exact.
3. **One message that does everything,** because you only get one:
   - the free v0.0.1 link with UTMs (`utm_source=instagram&utm_medium=dm&utm_campaign=<post-slug>`);
   - one sentence of value;
   - a question to open the 24 h window ("Want the 1824 survey page too?").
   - Never spend the one message on "Hi 👋".
4. **Public reply too,** e.g. "Sent! Check your message requests if you don't follow us", because non-followers' DMs go to Requests.
5. **Release within 7 days** of the first comments. After that, reply publicly and invite them to message.
6. **Test from a second, unconnected account.** Comments from the connected account don't trigger.
7. **One tool per post.** Two automations race for the single reply.
8. **Measure weekly:** comments with the keyword → DMs sent → link clicks (GA4 by `utm_medium=dm`) → free downloads → paid. Target: at least 10% DM click-through. Below that, rewrite the message.

## How we apply it to Cedwyn
- **Status: PROPOSED, needs the project lead's GO.**
  - Standing rule: "no DMs to strangers". A private reply only answers someone who publicly asked by commenting the keyword. It's a reply, not outreach, but it's still a DM, so the project lead decides.
  - Zero spend: built on the free Graph API, no ManyChat or other paid tool.
- **Not checked:** whether the connected Instagram account (@cedwynestate) grant includes `instagram_manage_messages` and the comments webhook. The current posting script only publishes. A webhook needs a public endpoint (the cedwyn-blog Cloudflare Worker could host it). Build only after GO.
- **First use:** the next movie "Door" Reel or a quote-pack carousel.
  - Caption: "Comment LLYFR / BOOK / LIBRO for the free edition".
  - DM: free v0.0.1 link to /ebooks/ (trilingual line), plus one question.
  - Public reply: points non-followers to Requests.
- **Rules carried:** never name the project lead; banned words list; no prices in the DM beyond the listed ones; no urgency (UK DMCC Sch.20); automated-reply line in all three languages; never a second unsolicited message; log to the project workspace
- **Facebook Page** (Great House Farm II) has an equivalent Messenger private reply. Its limits were not read in this run: check before extending.

## Sources
- developers.facebook.com (read 06:57Z)
- chattyflow.com (read; vendor summary of Meta's messaging policy, Human Agent tag, disclosure)
- creatorflow.so/blog/comment-to-dm-automation-case-studies/ (read; vendor case studies)
- the project workspace (ManyChat and Reddit figures)
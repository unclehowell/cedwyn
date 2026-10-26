# Mastodon for a heritage archive: instance rules, hashtags and cadence

Written 26 Oct 2026 for Cedwyn. This skill extends bluesky-mastodon-fediverse-heritage.md (API limits, CamelCase tags, alt text). It covers **staying inside the rules of the instances we use**, read from the instances themselves.

## What the instances state (read 26 Oct 2026)
- **mastodonapp.uk** (where the Cedwyn account is waiting on its confirmation tick). Its /api/v1/instance/rules has 9 rules. The ones that touch us:
  - "No spam, harrassment, dogpiling or doxxing."
  - "No content illegal in The United Kingdom."
  - "No intentionally false or misleading information ... do not pose as persons of interest."
  - "Controversial ... content may be removed if not obviously Content Warned."
  - "The sites staff team will ultimately have the final say."
  - Nothing bans an organisation account or links.
- **toot.wales** (Tŵt, the Welsh community instance), Spam and Inauthentic Activity policy:
  - Bans spam "that typically aims to drive traffic ... to specific or third-party ... Web sites, products".
  - Bans "Flooding a timeline – repeatedly posting in rapid succession with little to no engagement".
  - Bans "Unsolicited direct messages or mentioned posts, accounts that follow large numbers of similar accounts".
  - Notes that notable organisations can use its Verified Accounts page.
- **toot.wales News Publishing Policy:**
  - News accounts must be approved and verified (form; an answer within 72 h or email [address kept in the project workspace]).
  - "Accounts that use automated posting features and are not monitored by staff for replies must be marked as unmonitored" (in profile settings).
  - It lists 6 verified news sources (e.g. Nation.Cymru, Golwg360).
  - Its separate Automated/Bot Content policy page timed out from this box and is **not read here**. Read it before any scripted posting there.
- **Mastodon has no algorithm:** reach comes from hashtags, boosts and the local timeline. Search matches hashtags and opted-in posts only (existing skill).

## How to do it
1. **One home account, on mastodonapp.uk** (already created). Do not open a second Cedwyn account on toot.wales to post the same things. Under its policy, multiple accounts used to amplify count as "coordinated activity". toot.wales readers see us through federation and hashtags anyway.
2. **Profile:** say it is an organisation account for the archive. Add `rel="me"` from the site to the profile for the verified link. Tick the "automated" (bot) flag if a script posts. If nobody reads replies, say so in the bio.
3. **Cadence that cannot read as flooding:** 2–3 original posts a day, at least 2 hours apart, plus replies when someone asks something. Never post several items in a row. A long story is **one thread** (one public opener, then the rest of the thread as replies or unlisted). Boost institutions' posts that fit (museums, record offices), at most 5 a day.
4. **Link ratio:** at most 1 in 3 posts links to Cedwyn. The others are the document image, its date and source, and a question, with no link. This answers the "drive traffic" spam test on toot.wales-style instances.
5. **Hashtags:** 2–4 per post, CamelCase, the place before the theme: #ValeOfGlamorgan #WelshHistory #LocalHistory #Archives. In Welsh: #HanesCymru #Cymraeg. In Spanish: #Patagonia #Chubut #YWladfa. Make one hashtag the post's own subject, not decoration.
6. **Content warnings:** put a CW on anything about disputes, courts or deaths ("CW: court records, 1700s"). The mastodonapp.uk rule 7 removes controversial content that isn't content-warned.
7. **Following:** follow topic hashtags (#WelshHistory, #Archives) rather than mass-following accounts. Follow at most 10 institution accounts a day. Toot.wales lists mass-following of similar accounts as spam.
8. **No mentions or DMs** to people who did not talk to us first. Answer only questions asked of us.

## How we apply it to Cedwyn
- When the mastodonapp.uk account is confirmed: set the bio with no banned words and no name of the project lead, plus the profile link, `rel="me"` on the Cedwyn footer link (a site patch, which goes through the sole cedwyn committer), and the bot flag if posts are scheduled.
- The weekly plan in the project workspace takes 14–21 Mastodon posts a week, no more than 7 with links. Each is a dated document image with alt text, its source line, 2–4 tags and a CW where needed.
- Before any scripted posting, read mastodonapp.uk's /about page again and the toot.wales Automated/Bot Content policy, and note the date read in the project workspace
- Track boosts and favourites per post monthly. Keep the tags that bring boosts and drop the rest.

## Sources
- mastodonapp.uk (9 rules, verbatim above)
- croeso.toot.wales
- croeso.toot.wales (verification, the unmonitored flag)
- croeso.toot.wales (not read: timed out 26 Oct 2026)
- docs.joinmastodon.org and fedi.tips (via bluesky-mastodon-fediverse-heritage.md)
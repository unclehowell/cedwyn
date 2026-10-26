# Bluesky + Mastodon/fediverse for a heritage archive (2026 how-to)

Goal: get Cedwyn's evidence pages in front of history, Welsh and archive readers on open networks, as an institution account. No DMs, no follow-spam, no private-person outreach.

## What the evidence states
- **Bluesky starter packs drive follows.** A study of every starter pack (Balduf et al., arXiv 2501.11605, Jan 2025): 335,416 packs in 6 months; packs made up to **43% of daily follow operations** at peak and **19.95% of all follow edges** on the network, and **93.8%** of those follows were still there at the end of 2024. Only **6.25%** of users are in any pack, and packs make the rich get richer. So being *in* a relevant pack (or making one) is the biggest single lever for a new account.
- **Bluesky write limits** (official docs, rate-limits.md): 5,000 points/hour and 35,000/day per account; CREATE = 3 points, so at most **1,666 records/hour and 11,666/day** (posts + likes + follows + reposts together). HTTP 429 means stop.
- **Mastodon API limits** (docs.joinmastodon.org): 300 calls per 5 min per account and per IP; media upload 30 per 30 min; deletes 30 per 30 min. Each instance can set its own lower limits and its own rules.
- **Mastodon has no algorithm.** Reach comes from hashtag follows, boosts and the local timeline of your instance. Hashtags are the search: Mastodon search only matches hashtags (and opted-in posts), so untagged posts go unseen.
- **Accessibility is a norm, not a nicety.** fedi.tips: write hashtags in CamelCase (#WelshHistory, not #welshhistory) so screen readers read them, and add alt text to every image. Posts without alt text get fewer boosts on Mastodon; many users filter them out.

## Operating ceiling (80% rule, and well below for good manners)
- Bluesky: well under the hard cap. A human-looking institution cadence is **3-6 posts/day, at most 40 likes/day, at most 20 follows/day**, all to institutions and topic accounts. The hard cap is 1,666/h, but bot-like volume gets labelled by moderation.
- Mastodon: **2-4 posts/day**, threads for long items, at most 25 media uploads per 30 min. Read each instance's /about rules before posting; many ban automated posting without a "bot" flag. Mark the account automated in settings if a script posts.

## Setup checklist (one hour)
1. **Bluesky:** create the account with a Tab-controlled address. Set the handle to the domain (`cedwyn.bucklerfamily.estate`) via a DNS TXT `_atproto` record; a domain handle is the verification badge everyone can see. Create an **app password** for scripts; never use the main password in code. Bio: one line on what the archive is + the site link.
2. **Mastodon:** choose a home instance that fits and accepts institutions, e.g. toot.wales (Welsh), glammr.us (GLAM: galleries, libraries, archives, museums) or historians.social. Read its rules. Add `rel="me"` on the site's link back to the profile so the profile link shows a green verified tick. Create an access token (Preferences > Development) with the scopes `write:statuses write:media`.
3. **Pixelfed** (photo fediverse) for dated document photos, **PeerTube** for movie clips (pick an instance whose rules allow uploads from organisations), **Lemmy** for discussion communities. Lemmy communities have Reddit-style rules; read and log them first (see reddit-forum-participation-heritage.md).
4. Cross-follow: Bluesky can bridge to the fediverse via Bridgy Fed (opt-in: follow @ap.brid.gy). One account then reaches both networks; still post natively on Mastodon for hashtags and alt text.

## Post recipe (works on both)
- One document image (4:5 or 1:1) with **full alt text** (what the document is, date, readable key line).
- Line 1: the hook as a dated fact ("1824: plan 19 marks the lane as a public way").
- Line 2: the source (archive, reference number).
- Line 3: link to the **evidence page** (not /ebooks/). Off-site link UTMs allowed: `utm_source=bluesky|mastodon&utm_medium=social`.
- 2-4 CamelCase hashtags: #WelshHistory #Cymru #LocalHistory #Archives; for Spanish posts #Patagonia #Chubut #YWladfa.
- Reply to questions with a source. Never argue; never name private people.

## Getting into starter packs and feeds
- Find packs and feeds by searching Bluesky for "starter pack" plus history, archives or Wales, and the Feeds tab for history feeds. Ask nobody personally. Make a **"Welsh history and archives" starter pack** of institutions (museums, record offices, societies, libraries) with the archive in it; institutions often share packs that list them.
- Custom feeds (e.g. history feeds) pick up posts by keyword or hashtag: use the feed's stated tag in relevant posts.

## How we apply it to Cedwyn
- Accounts: Bluesky with the domain handle, plus Mastodon on toot.wales or glammr.us. The LEVERAGE RUN (b9c516bf) creates them; credentials go in the vault, never in files.
- Weekly rhythm: 1 Welsh, 3 English and 1 Spanish post per weekday, drawn from the evidence catalogue and quote-pack cards (alt text taken from the card's source line).
- Build the institutions-only starter pack "Hanes Cymru / Welsh history & archives" with 20-50 accounts (Cadw, Glamorgan Archives, National Library of Wales, People's Collection Wales, local history societies, the British Council Welsh Language Project and similar).
- Links go to evidence pages and the free chapter; purchases only via /ebooks/. Internal links carry no UTMs.
- Measure monthly: followers, reposts/boosts and GA4 sessions by `utm_source=bluesky/mastodon`, in the project workspace
- Banned public words and the never-name-the project lead rule apply to every post and bio.

## Sources
- Balduf et al. 2025, Bootstrapping Social Networks: Lessons from Bluesky Starter Packs: arxiv.org
- Bluesky rate limits: docs.bsky.app
- Mastodon rate limits: docs.joinmastodon.org
- fedi.tips accessibility (CamelCase, alt text): fedi.tips
- CUNY OER accessibility guide on hashtags: guides.cuny.edu
- Not checked this run: the Bridgy Fed opt-in step (follow @ap.brid.gy) and the rel="me" tick are from working knowledge; confirm them before use.
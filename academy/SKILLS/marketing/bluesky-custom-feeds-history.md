# Bluesky custom feeds and starter packs for history content

Written 26 Oct 2026 for Cedwyn. This skill extends bluesky-mastodon-fediverse-heritage.md (accounts, limits, cadence). It covers **owning a topic feed** and getting into other people's feeds and packs without asking anyone.

## What the evidence shows
- **Feeds are user-built algorithms.** Bluesky's own blog ("Algorithmic Choice with Custom Feeds", 27 Jul 2023) describes feeds as algorithms anyone can publish and anyone can pin as a home tab. Followers of a feed also see its posts mixed into their main timeline if they allow it.
- **Graze** (graze.social/docs/faq, read 26 Oct 2026): "Building, publishing and running feeds on Graze costs nothing, and there's no paid plan or subscription." You sign in through Bluesky or with an **app password**, so there's no OAuth from the project lead. You build feeds without code from topic, hashtag, keyword or people "nodes". The only money involved is optional sponsored posts (minimum $25), and we use none. Graze powers about **4,500 feeds made by around 3,000 users**, including several of Bluesky's top feeds (funding coverage, Yahoo Finance/TechCrunch, 2025).
- **SkyFeed** is the older free builder, which uses keyword and regex filters. Andrew Thaler (Southern Fried Science, Feb 2024) built a niche "Deep-sea Mining" feed from industry-unique keywords and a broad "Dungeons & Dragons" feed. His lesson: **unique keywords make a clean feed; generic words pull in noise.**
- **Starter packs** (Bluesky blog, 26 Jun 2024) hold up to **150 people and up to 3 custom feeds**. Third-party guides give a minimum of 7 accounts. The existing fediverse skill has the study figures: packs drove up to 43% of daily follows at peak, and 94% of those follows stayed.

## How to do it
1. **Build one feed we own: "Welsh History & Archives" (English, with Welsh and Spanish terms).**
   - Inputs: hashtags #WelshHistory #HanesCymru #Cymru #Archives #LocalHistory #YWladfa #GalesesEnLaPatagonia.
   - Unique keywords: "Glamorgan" + (record|parish|map|tithe), "Vale of Glamorgan history", "Llandough", "Penarth history", "colonos galeses", "Gaiman 1865".
   - Exclude generic noise words (e.g. "rugby" on #Cymru), and exclude NSFW labels.
   - Sort by newest first. Topic feeds that are chronological get trusted more than engagement-sorted ones.
2. **Test before publishing.** Use Graze's "Testing and Fixing your Feed" page or the SkyFeed preview, and read the first 50 matches. If more than 1 in 5 is off-topic, tighten the keywords.
3. **Publish with a plain description:** "Posts about Welsh history, archives and Welsh Patagonia, in English, Cymraeg and Español. Curated by the Cedwyn archive." Put no links in it and none of the banned words.
4. **Pin the feed on the Cedwyn profile.** Add it as one of the 3 feeds in our institutions-only starter pack. Mention it once in a post. The feed earns its own audience; the archive's posts appear in it because they use the hashtags.
5. **Get into other people's feeds by fitting their filters.** Open each history feed's description (Feeds tab, search "history", "archives", "Wales") and note its stated tags or keywords in a log. Use the matching tag only on posts that really fit. Never ask a feed owner to add us. Feed owners are often private people.
6. **Measure monthly:** feed likes (shown on the feed page), and profile visits and site sessions from Bluesky (Cloudflare referrer bsky.app). Keep the feed only if it grows or sends visits after 60 days.

## Rules for Cedwyn
- No mentions, replies-for-promotion or DMs to the private people whose posts show up in the feed. A feed is curation, not outreach.
- The feed only shows public posts that people have tagged or worded themselves, and Bluesky lets anyone block a feed's creator. Remove any account that asks to be removed.
- One feed only at first. A pile of near-duplicate feeds reads as spam.
- No UTMs on internal links. The profile link and posts point at canonical Cedwyn URLs.

## How we apply it to Cedwyn
- Once the Bluesky account exists (LEVERAGE RUN), sign in to Graze with a Bluesky **app password** stored in the vault, never in files. Build "Welsh History & Archives" with the inputs above, test it, publish it, and pin it.
- Add the feed to the institutions-only "Welsh history & archives" starter pack. That pack's members are only museums, record offices, societies and libraries.
- Log the feed URL and its first-week matches in the project workspace Report feed likes in the Sunday growth report.
- Spanish: when the Spanish feed variant has enough matching posts (more than 5 a day), split out "Historia galesa en la Patagonia" as feed 2, and give it the /argentina/ page as its profile-link home.

## Sources
- bsky.social
- bsky.social (150 people, 3 feeds)
- graze.social (free, app-password login, sponsored-post terms)
- finance.yahoo.com (4,500 feeds, around 3,000 users)
- southernfriedscience.com (SkyFeed, keyword practice)
- bluesky-mastodon-fediverse-heritage.md (limits, starter-pack study figures)
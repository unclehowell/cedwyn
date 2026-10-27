# Google Search profiles and Discover "Follow": the eligibility gate and what to prepare

Harvested 27 Oct 2026. The topic is Google's own follow surface for publishers and creators: SEO, AI-era visibility, and turning one-off searchers into followers.

## What it is (primary sources, read)
- **17 Sep 2025, Google blog (Layla Amjadi):**
  - People can "follow" publishers and creators directly in Discover.
  - Tapping a source's name opens a space with its articles, YouTube videos and social posts.
  - Discover also started showing X and Instagram posts and YouTube Shorts.
- **4 Jun 2026, Google blog (Ibrahim Badr):** launched **Search profiles**, a shareable page per publisher or creator.
  - It's reached through the knowledge panel, by tapping a name in Discover, or by direct URL.
  - Followers are "more likely to see that content on Discover".
  - Claiming a profile may create a knowledge panel.
  - The launch was US only.
- **Google Search Help, "Create a new Search profile" (16904498) and "Claim an existing Search profile" (16905608), read 27 Oct 2026:**
  - Available in **Canada, India and the United States** only.
  - Requires **10,000** followers on YouTube, Instagram, X or TikTok, and an owner aged 18+.
  - Claim at profile.google.com, signed in to the Google account that owns the YouTube channel.
  - Up to 10 profiles per Google account.
  - A claimed profile can pin 8 posts and 8 links, suggest edits to name and bio, and shows Search and Discover insights.
  - New linked-platform content appears within about 24 h.
  - Google may ask for a selfie with ID.
  - Only sources with a knowledge panel get an auto-generated profile.
- **Threshold history:**
  - Launch: 100k (300k TikTok; almcorp, agency).
  - 12 Aug 2026: 35k (100k TikTok). NetInfluencer cites Robby Stein (Google VP Product, Search) on X; that post itself was not checked.
  - Now: 10k per the help page.
  - The bar has dropped about 10x in 5 months.
- **Ranking:** per NetInfluencer, Google states profile edits don't change how content ranks in Search or Discover (not checked against a Google page). The value is the follow relationship, not ranking.
- **No traffic case study** with numbers was found, and none is invented here.

## How to do it
1. **Check the gate quarterly:** the country list and the follower minimum on help page 16904498. A diff of the two lines is enough.
2. **Build towards the entity Google recognises**, so a profile is auto-generated or claimable later:
   - one consistent brand name across site, YouTube and Instagram;
   - Organization JSON-LD on the home page with `sameAs` pointing to the official social accounts;
   - the same logo and bio everywhere.
3. **When eligible,** claim it with the Google account that owns the YouTube channel. Then:
   - link YouTube and Instagram;
   - pin the 8 strongest evergreen posts (book pages, free chapter);
   - add 8 links (/ebooks/, /blog/, the free download);
   - read the profile insights alongside the Search Console platform properties (see search-console-platform-properties-social.md).
4. **Measure followers,** not rankings: profile insights and Discover clicks in Search Console.

## How we apply it to Cedwyn
- **Not eligible now, on two counts:**
  - It's a UK operation, and the UK isn't on the list.
  - Followers per the last weekly.csv row (25 Oct): Instagram 5, YouTube 8. That is about 1,000x under the 10k bar.
  - Don't chase it, and don't buy followers (house rule; Google also asks for policy compliance).
- **Do now (cheap, already on our path):** keep the brand name "Cedwyn" consistent, and make sure the Cedwyn home page's Organization markup lists the official YouTube and Instagram in `sameAs`.
  - Overlap: site-name-breadcrumb-structured-data-cedwyn.md, organisation-byline-editors-profilepage-how-made.md.
  - The markup is PROPOSED for the onpage flywheel or one site-wide PR, not applied here.
  - It also helps the knowledge-panel route, which is the only route to an auto-generated profile.
- **Watch item:** the weekly visibility check (or quarterly harvest) re-reads help page 16904498 and logs whether the UK has been added and what the minimum is. Act when both say yes.
- **Never name the project lead** on a profile. The profile is the Cedwyn brand's, and the bio follows the editorial rules (no banned words, no insignia, no outbound links beyond our own properties).

## Sources
- blog.google (read)
- blog.google (read)
- support.google.com (read 27 Oct 2026)
- support.google.com (read 27 Oct 2026)
- netinfluencer.com (read; trade press)
- almcorp.com (read; agency, launch thresholds)
# Selling a serialised documentary per episode on your own site: price, cadence, free clips

Topic: per-episode economics for a self-hosted history documentary, where free clips on YouTube/TikTok drive viewers to paid episodes. Two practitioner records with real numbers, plus one free-clips-to-paid network. Harvested 29 Oct 2026.

This skill complements:
- short-cut-plus-full-video-two-doors.md (the clip format)
- documentary-direct-sales-free-cut-paid-versions-audience.md (own-site sales, Vimeo OD)
- versioned-release-rising-price-ladder.md (semver prices)

It adds the per-episode money record: what worked and what sank a creator.

## The records

**1. Louis C.K., *Live at the Beacon Theater*: one-off $5 download on his own site, Dec 2011** (his own statements on louisck.net, read via Wayback)
- Production cost about $170,000, mostly paid for by the two shows' ticket sales.
- On sale at noon on 10 Dec. After 12 hours: 50,000+ purchases and $250,000, which broke even on production and the website.
- After 4 days: 110,000+ copies, $500,000+, profit around $200,000 after PayPal charges.
- After about 12 days: $1,000,000.
- His stated design: a low price ($5), "as easy as possible to buy, download and enjoy", no DRM and no region lock. He contrasted this with about $20 for a studio's locked video.

**2. Louis C.K., *Horace and Pete*: 10 episodes sold one at a time on his own site, 2016**
- Prices (LA Times, read): episode 1 $5, episode 2 $2, episodes 3-10 $3 each.
- Each episode was dropped with no announcement. The finale was not flagged as the last one.
- He told Howard Stern the series left him "several million dollars in debt" (LA Times, read). Each episode cost about $500,000 to make (Slate/Atlantic snippets, not read in full), and he put in about $2 million of his own money. The season was later sold as a $31 bundle (Atlantic snippet).
- Lesson in the numbers: the per-episode format worked, but cost per episode was set without any audience signal. Surprise drops with no trailer gave each episode almost no launch window.

**3. Dropout (formerly CollegeHumor), 2025** (Mashable, read)
- Free clips from paid shows run on YouTube and social.
- Over 1 million subscribers, with paid subs up 31% from 2024 to 2025.
- A "Superfan" tier at $130 a year.
- The pattern: the free clip is the advert, and the full episode sits behind the owner's own paywall.

## The playbook

1. **Set each episode's cost from audience evidence, not ambition.** Before rendering the next paid episode, estimate the buyers: last episode's buyers, or for a first paid episode, list size × 1-2%. Cap the render spend at that number × price × 0.5.
2. **Price low, simple, one tap.** The $5 Beacon record and the $2-3 Horace episodes both converted in volume. Keep one price per release, no account wall, and no region lock where the licence allows. Offer a season bundle once 3+ paid episodes exist.
3. **Announce every drop.** A trailer, or a 30-60 s clip, goes out 24-72 h before release, plus an email to the list on drop day. Never surprise-drop a paid episode: that was the Horace and Pete gap.
4. **Free clips are the advert.** For each episode, put 1-3 vertical clips on YouTube Shorts / TikTok / Instagram and one horizontal clip on YouTube. Each ends on a card pointing to the episode page, with the link in the description or bio and a UTM per platform.
5. **Own the buyer.** Ask for an email at purchase. That list is the next episode's launch audience. A marketplace gives no discovery (see the Vimeo OD note in the direct-sales skill).
6. **Publish your own numbers once they are real.** C.K.'s open statements became news coverage in their own right. A short "how the first paid episode did" note is a story for local press. That needs the project lead's GO.

## Metrics and kill rule

- Per episode, track: clip views per platform → episode page visits (UTM) → purchases → email signups.
- Episode page → purchase above 2% means the clip and page work. Below 0.5% after 500 visits: fix the page and price before rendering more paid episodes.
- If two consecutive paid episodes sell fewer copies than their render cost ÷ price, pause paid episodes and keep releasing free v0.0.1 scenes until the list grows.

## How we apply it to Cedwyn

- **Fits the semver rule the project lead set on 29 Oct.** v0.0.1 (scenes 1-2, now merged) is free and is the "free cut". Each later version is +£4.99. The season-bundle idea becomes "all released versions at the cumulative price", shown on /documentary/.
- **Each new door gets announced.** One 30-45 s clip per scene, cut from the rendered webm (characters only, no narration, period captions), goes to YouTube Shorts / Instagram via the existing social flywheel. Each ends "full scene at cedwyn.bucklerfamily.estate/documentary/" with a UTM. No DMs, no group spam.
- **Render spend follows sales.** Paid-version renders stay inside the daily render budget, and after the first paid version, within the buyers-based cap in step 1. Log both numbers in the movie RUNNER.
- **Track the funnel** with the existing GoatCounter /r/ short links (see r_links.py) plus Stripe counts in the Sunday growth report.
- **Public numbers** ("first paid scene sold N copies") only on the project lead's GO. Never name him.

## Sources

- web.archive.org (13 Dec 2011, read)
- web.archive.org (21 Dec 2011, read)
- latimes.com (16 Apr 2016, read)
- theatlantic.com (snippet only; page 403)
- slate.com (snippet only)
- mashable.com (2025, read)
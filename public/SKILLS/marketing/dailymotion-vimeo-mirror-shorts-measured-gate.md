# Mirror the Shorts and documentary clips to Dailymotion and Vimeo: what it buys, measured, and a gate

Written 31 Oct 2026 for the Cedwyn e-book and documentary work. Topic: secondary video hosts as a backup and discovery route, not as a growth engine.

## What the evidence shows (read before spending time on it)

**Search mostly shows YouTube.** Foliovision's 2022 review of video-search bias sums up two studies:
- Eric Enge (Stone Temple Consulting): **88% of Google's top-10 video results were YouTube** (native or embedded). For queries containing "video" or "clip", it was 78.9%.
- The Wall Street Journal ran the same videos on YouTube, Facebook Watch, Twitch and Dailymotion, and **YouTube ranked ahead of every competitor in every case**. Professor Dirk Lewandowski approved the method.
- Foliovision's own spot check: Vimeo and Dailymotion did not appear in its sample of Google video results. A video that exists *only* on Dailymotion can still be found on that platform by its exact title.
- So a mirror will not take search clicks from YouTube. Its value is elsewhere (below).

**Dailymotion's own search is quiet for our subject.** We measured it with Dailymotion's public API (`api.dailymotion.com, no key, top 100 by relevance, read 31 Oct 2026 10:41Z):

| query | total matches | median views | 25th–75th pct | max |
|---|---|---|---|---|
| welsh history | 1,000+ | 21 | 4–166 | 29,942 |
| wales history | 1,000+ | 16 | 3–162 | 10,191 |
| cardiff history | 1,000+ | 6 | 1–22 | 3,495 |
| glamorgan | 135 | 16.5 | 3–90 | 20,687 |
| local history documentary | 1,000+ | 70.5 | 14–313 | 35,423 |

A typical Welsh-history video there gets **tens of views over its lifetime**. Plan on that, not on a breakout.

**Vimeo Free is a clean, ad-free host with limits that matter.** From Vimeo's help centre (About the Vimeo Free plan, read 31 Oct 2026):
- Public videos are **unlimited** and carry no ads.
- **Embeddable and non-public videos are capped at 3 GB in total.** For embeds, our 2-min 720p webm clips of under 25 MB give about 120.
- Free includes automatic captions, transcripts, chapters, **SEO settings for video pages**, editable URLs, viewer analytics, 1 channel, 1 group and 5 showcases.

**Vimeo player embeds can be indexed on our own page.** In Google's Vimeo case study (Search Central), Vimeo adopted `noindex, indexifembedded` on its player and added Key Moments structured data. Google can then index the video **on the page that embeds it** while ignoring the bare player URL. That is the one real SEO benefit: the watch page on cedwyn gets the video result, not Vimeo.

**Dailymotion pays only past a floor.** Dailymotion's FAQ (as shown in search snippets; the page itself returned 403 to us): a creator needs **1,000 cumulative profile views** to unlock monetisation, with payout once the balance passes **$100**. At the medians above that will take a long time. Treat money from it as zero.

## Why it is still worth doing (the honest case)

1. **A route around the YouTube daily upload limit.** Our YouTube uploads stop when the daily API limit is spent (problem P-032). A second host means a finished Short is public somewhere the day it is made, and the YouTube copy follows when the limit resets.
2. **Resilience.** If a YouTube video is muted, held or struck, a copy and its text still exist elsewhere.
3. **Our own pages win the embed.** A Vimeo embed on a cedwyn watch page, with `VideoObject` markup, keeps the result and the visit on cedwyn, not on a platform.
4. **Small but non-zero platform search.** The few people searching "welsh history" on Dailymotion find us next to dozens-of-views videos, not million-view channels.

## How to do it (step by step)

1. **Only mirror what YouTube may carry.** Use the same hold list as the YouTube Shorts run: anything held there (e.g. e08, e12, e23) is held on every host.
2. **Same text as YouTube, adapted.** Title under 60 characters. The description starts with the shop line, then the documentary line (/movie/), then a Sources line. Same banned-word check, never name family members, no hashtags beyond 3. Link to cedwyn pages only.
3. **Dailymotion**: one channel; pick the closest category the upload form offers (an education or travel one for place clips). Put the place name and the decade in the title ("Llandough, 1890s: …"). Upload by hand or by its upload API with the channel owner's login. Don't chase monetisation.
4. **Vimeo (Free)**: upload **public**. Embed only the clips we put on cedwyn watch pages, so the embed counts against the 3 GB cap and nothing else does. Turn on auto-captions and chapters, write the page title and description in the SEO settings, and set the video URL to a readable slug.
5. **On cedwyn**: where a watch page embeds the Vimeo player, keep our own `VideoObject` JSON-LD (see `video-sitemap-self-hosted-documentary-watch-pages.md`) and lazy-load with a poster (`video-landing-page-facade-poster-preload.md`).
6. **Tag every link.** Description links carry `utm_source=dailymotion` / `utm_source=vimeo`, `utm_medium=video`, `utm_campaign=shorts-mirror`.
7. **Measure at 30 and 90 days**: views per clip on each host (both show counts), tagged visits to cedwyn, any /ebooks/ checkout from those visits.

## Gate (keep or drop)

- **Keep Dailymotion** if after 90 days the median clip has more than **25 views** (the "welsh history" median above) **or** at least 5 tagged visits a month reach cedwyn. Otherwise stop uploading new clips there (leave existing ones up; they cost nothing).
- **Keep Vimeo** as long as it is the embed host for cedwyn watch pages. Drop it as a discovery channel at 90 days if tagged visits are zero.

## How we apply it to Cedwyn

- **Status: PROPOSAL.** It needs two new public accounts in the project's name (a Dailymotion channel and a Vimeo account), and the account holder has to create them. Agents never create accounts or post on new channels without the owner's GO.
- **First batch:** the 5 most recent Shorts already live on YouTube (not held), plus the documentary scene clips already on /movie/.
- **Order of value:** 1) Vimeo embeds on cedwyn watch pages (keeps the search result on our domain); 2) Dailymotion as the day-one public copy when YouTube's daily limit is spent; 3) platform search as a small bonus.
- **Logging:** each upload is one row in `the project workspace` (host, clip id, URL, date); the 30- and 90-day readouts go into the Sunday growth notes.
- **Watch for duplicates:** one copy per clip per host, matched by clip id in the log before any upload.

## Sources

- Foliovision, "Video Search Bias: Absolutely Dominated by YouTube" (Jan 2022), summarising Eric Enge / Stone Temple and the Wall Street Journal test: foliovision.com
- Dailymotion public API, our own measurement 31 Oct 2026: api.dailymotion.com
- Vimeo Help Center, "About the Vimeo Free plan" (read 31 Oct 2026): help.vimeo.com
- Google Search Central, Vimeo video SEO case study (indexifembedded, Key Moments): developers.google.com
- Dailymotion Help, "Earn revenue from video monetization" (1,000 views, $100 payout; read via search snippet, page 403): faq.dailymotion.com
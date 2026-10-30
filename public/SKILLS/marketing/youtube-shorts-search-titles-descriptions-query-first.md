# YouTube Shorts titles + descriptions for search (YouTube search, Google's short-video carousel, AI answers)

Harvested 2026-10-30 for the project lead's 13:29 ask: "good descriptions with website url and google titles". Complements (does not repeat): youtube-shorts-non-clickable-links-related-video-bridge.md (links), youtube-shorts-custom-thumbnail-spec-nft-cover.md (covers), youtube-test-compare-titles-thumbnails.md (testing).

## What the evidence states
- **Shorts rank in Google.** Foundation Labs (Ethan Crump, updated 29 Jul 2026, read): over six months the number of "best + software" keywords where a YouTube Short ranks in Google's top 10 more than doubled; in the US a Short ranks top-10 for 475 such queries (~108,000 searches/month) and sits at #1 on three of every four. Shorts rank for 3-4x as many of these queries as Instagram or TikTok. 92% of those result pages carry an AI Overview; Gemini cites YouTube ~7x more than Instagram and ~10x more than TikTok. Their recipe: start from the query, cut the clip to answer it, open with a hook phrased like the search, burn in captions, publish the transcript, "machine-readable beats clever". (B2B software sample; the mechanism, not the niche, is what transfers. Not checked for heritage queries.)
- **Title craft (Humble&Brag, Edward Wood, 10 Mar 2026, read):** keep titles under ~60 characters (mobile truncates at ~50-60; Subsub.io analysis of 120,703 titles: median top-performer = 8 words, ~45-55 chars); front-load the keyword in the first 3-5 words; title must add what the thumbnail cannot show — at CareerFoundry, complementary title+thumbnail pairs beat duplicating ones by **1-2 percentage points CTR**; at most 1-2 power words; selective capitals only.
- **YouTube Help (read 30 Oct 2026):** hashtags in title/description link to hashtag result pages; of the description hashtags, up to 3 "most engaging" show by the title; **more than 60 hashtags = all ignored**, and over-tagging or unrelated hashtags can remove the video from search (Misleading Metadata). Tags "play a minimal role" — title, thumbnail and description matter more; tags only help common misspellings.
- **Links:** URLs in Shorts descriptions and Shorts comments are NOT clickable (YouTube Help 13748639, see links skill). The description URL line is still worth having: it is read by search/AI and copied by humans; the clickable route is the Related Video link + channel profile links.

## How to do it (per Short, ~3 minutes)
1. **Pick the query first.** Write the search a curious person types: "Great House Farm Llandough history", "Marconi Lavernock 1897", "BP Properties v Buckler 1987", "Ty Mawr Llandough". Check YouTube's own autocomplete (type the start in the YouTube search box) and Search Console queries for cedwyn; prefer phrases with real autocompletes.
2. **Title = query + payoff, ≤60 chars, query in the first 5 words.** Pattern: "<Place/Event Year>: <what the record shows>". Example: "Marconi at Lavernock, 1897: the farm in the record". No clickbait, no all-caps, no version hashtags.
3. **On-screen words match the title** in the first 1-2 s (burned-in caption) so the hook mirrors the search; captions on throughout (YouTube and Google read them).
4. **Description, in this order:** line 1 the shop/site line (house standard, UTM'd /r/yt-<id> or /ebooks/); line 2-3 one plain sentence restating the query in full words (place, year, record type); a "Sources:" line naming the catalogue pages/footage/e-book chapter; then 2-3 relevant hashtags max (#GreatHouseFarm #Llandough #WelshHistory) — never more than 5.
5. **Tags:** add only misspellings/variants (Ty Mawr, Tŷ Mawr, Cydfin, Cedfin, Lavernock).
6. **Related Video** set to the long-form bridge (manual Studio step; links skill).
7. **Measure after 7 days:** YouTube Analytics > traffic source "YouTube search" share and search terms per Short; Search Console "Video" appearance for cedwyn pages. Rewrite titles on Shorts with impressions but <2% search share; keep what earns search views.

## How we apply it to Cedwyn
- Every HyperFrames Short in the cross-post job gets: a query-first title (≤60 chars), first-frame caption = title, description in the order above, ≤3 hashtags, variant tags. Feed this as the title/description checklist to the project workspace metadata and SERIES.md beats.
- Editorial gate unchanged: never name the project lead; no banned words (states, assertions, per, second-hand report, not checked, reported, deception, taken); Llandough Farm is not Great House Farm — never put "Llandough Farm" in a Great House Farm title.
- Mention the documentary in the description (the project lead 13:42): "Scenes from the documentary in the making are free to watch at cedwyn.bucklerfamily.estate/movie/".
- Prices only as listed (v0.0.1 free, v0.0.2 £4.99); no price tests.

## Sources
- foundationinc.co (read 30 Oct 2026)
- humbleandbrag.com (read 30 Oct 2026)
- support.google.com (hashtags, read)
- support.google.com (tags, read)
- support.google.com (links; via existing skill)
# Video on landing pages without the weight: facades, posters, preload (2026)

For pages whose job is "watch this short video, then read/buy" (e.g. /parcels/, /documentary/, e-book sales pages).

## Evidence
- Lighthouse audit "Lazy load third-party resources with facades" (Chrome docs): pages FAIL when they load deferrable third-party embeds such as the YouTube player on load; a facade (static look-alike, real player loaded on click) is the documented fix.
- Paul Irish's lite-youtube-embed (open source, Apache-2.0, npm "lite-youtube-embed", a few KB JS+CSS): renders "approximately 224x faster" than the normal embed; uses youtube-nocookie.com (privacy); supports a custom poster, `playlabel` for accessibility, progressive enhancement (plain link inside the element works with JS off), and `js-api` when you need the IFrame API.
- web.dev "Video performance": for videos that don't autoplay use the `poster` attribute (the poster image becomes the LCP candidate); per HTTP Archive ~20% of web videos autoplay — avoid unless it replaces a GIF (muted, playsinline).
- Practitioner write-ups (Debbie O'Brien, Nuxt; Mugo; corewebvitals.io) report large LCP/TBT gains from swapping iframes for facades — anecdotal, no shared numbers.

## How to do it
YouTube video:
```html
<link rel="stylesheet" href="/_assets/lite-yt-embed.css">
<script src="/_assets/lite-yt-embed.js" defer></script>
<lite-youtube videoid="ID" playlabel="Play: The 36 parcels, 30 seconds"
  style="background-image:url('/img/parcels-poster.webp')">
  <a href="youtube.com class="lyt-playbtn" title="Play video">
    <span class="lyt-visually-hidden">Play: The 36 parcels</span></a>
</lite-youtube>
```
(If the site rule is "no outbound links", drop the fallback `<a>` and keep the button.)

Self-hosted webm/mp4 (our Cedwyn clips):
```html
<video controls playsinline preload="none" poster="/img/parcels-poster.webp"
  width="720" height="1280" aria-describedby="parcels-text">
  <source src="/clips/parcels.webm" type="video/webm">
  <track kind="captions" srclang="en" src="/clips/parcels.en.vtt" label="English" default>
</video>
```
- `preload="none"` + `poster`: nothing downloads until play; width/height reserve space (no layout shift).
- Poster: a real frame, WebP, < 60 KB, with the title burned in only if it is also in page text.
- Captions track always (most mobile viewers start muted); a one-paragraph text summary beside it for people who won't press play and for search/AI crawlers.
- Put the video directly under the H1 at 390 px, then 2–3 lines of text, then the one CTA.

Measure: Lighthouse (mobile) before/after — check "third-party facades" passes and LCP; in our own analytics count play clicks / page views (add a `play` event to the beacon).

## How we apply it to Cedwyn
- /parcels/ (v0.0.1): self-hosted clip with `preload="none"`, a poster frame, en captions (cy/es tracks if they exist), the neutral explanation under it, then the /ebooks/ link. If the clip is on YouTube instead, use lite-youtube with nocookie and no outbound fallback link.
- /documentary/: version selector should swap `src` only after a click; never preload paid versions.
- Sales pages with a short video (see sales-page-short-video-ebooks.md): facade/poster first, then measure play-rate vs checkout clicks.
- No install on this box needed: lite-youtube-embed is two small static files vendored into the site repo when a YouTube embed is actually used.

## Sources
- developer.chrome.com
- github.com (readme read 2026-10-27)
- web.dev
- web.dev
- debbie.codes (anecdotal)
- mugo.ca (anecdotal)
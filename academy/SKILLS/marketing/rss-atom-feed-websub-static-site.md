# Skill: an Atom feed for a static Cloudflare Pages site, then WebSub
Written 26 Oct 2026 by the project lead's Cedwyn editors (skills harvest). Refresh if the hub or Cedwyn's build changes.

## Why it matters
- Cedwyn has no feed: /feed.xml returned 404 on 26 Oct 2026 (checked live), so feed readers, WebSub hubs, Bluesky/Mastodon auto-posters (e.g. Bridgy Fed, IFTTT-style RSS bots), newsletter "RSS-to-email" and many aggregators have nothing to follow.
- WebSub only works once a feed exists: the hub fetches the feed once and pushes new items to every subscriber "within seconds"; readers without WebSub keep polling as before (Inoreader, "How WebSub works for publishers").
- Google states it uses both: sitemaps for the whole site, RSS/Atom for recent changes, and recommends providing both (Google Search Central blog, "Best practices for XML sitemaps and RSS/Atom feeds", 2014).

## How to do it (steps)
1. Pick Atom (not RSS 2 + Atom both). Practitioner advice: "If you don't have a feed yet I would highly recommend Atom ... much less ambiguity"; one format is enough (Kevin Cox, "RSS Feed Best Practices", updated 2024).
2. Choose what goes in: only real new or substantially changed content (new story, evidence page, e-book release, movie "door"), newest first, 20-50 entries. Do NOT generate it from the sitemap if every lastmod is the build date (Cedwyn's sitemap shows lastmod = today on every URL, so it states nothing about what changed).
3. Required elements (Atom, RFC 4287): feed `id`, `title`, `updated` (RFC 3339), `link rel="self"` (the feed URL) and `rel="alternate"` (the home page), `author`; each entry `id` (a stable permalink, never changes), `title`, `updated`, `link rel="alternate"`, plus `published` and a `summary` or `content type="html"`. Absolute URLs only.
4. Declare the hub inside the feed, next to the self link: `<link rel="hub" href="pubsubhubbub.appspot.com` (Google's hub page; it also accepts HTTP Link headers rel=hub + rel=self).
5. Serve it with the right type: on Cloudflare Pages put `/feed.xml` in the output and add a `_headers` rule: `/feed.xml` -> `Content-Type: application/atom+xml; charset=utf-8` and a short `Cache-Control` (e.g. max-age=600) so the hub sees fresh content after a deploy.
6. Advertise it in every page head: `<link rel="alternate" type="application/atom+xml" title="Cedwyn" href="/feed.xml">` (plus /cy/ and /es/ feeds later if those sections get their own entries, each with its own `xml:lang`).
7. Validate before ping: W3C Feed Validation Service (validator.w3.org) or Inoreader's free feed validator.
8. After each deploy that adds entries, ping the hub: `POST pubsubhubbub.appspot.com form-encoded `hub.mode=publish&hub.url=<feed URL>` (expects 204). Our tools/index_ping.py `websub --feed URL` does exactly this (dry-run unless --live). Ping only when the feed actually changed.
9. Check delivery: the hub page has "Publish a feed or debug your published feeds"; Inoreader's feed analytics shows whether it receives pushes.

## Pitfalls
- Changing entry ids makes every reader re-show old items as new. Use the canonical page URL as id and never rewrite it.
- `updated` on the feed must move when an entry is added; if it never moves, readers back off polling.
- No UTMs on the entry links: they point at our own pages, and reader apps report themselves as referrers anyway.
- Banned public words and "never name the project lead" apply to feed titles and summaries exactly as to pages.

## Tool
- tools/make_feed.py (written 26 Oct 2026, standard library only): `python3 tools/make_feed.py entries.json --site cedwyn.bucklerfamily.estate --title Cedwyn --out feed.xml` builds a valid Atom feed with the hub link from a JSON list of {title,url,published,updated?,summary}; it refuses relative URLs, duplicate ids, missing dates, UTM-tagged internal links and banned words.

## How we apply it to Cedwyn
- Seed entries.json with the last ~30 real additions (e-book pages, title-chain stories, /wales/ and /argentina/ evidence pages, movie doors), newest first, keep it in the cedwyn repo next to the build.
- Add feed.xml + the `_headers` rule + the head `<link rel="alternate">` in ONE commit, only when no other worker is committing to cedwyn (repair freeze: new file + head tag is markup-only; if the freeze forbids it, leave the patch in the project workspace for the on-page run).
- After the deploy (about 30-35 min build): validate, then `index_ping.py websub --feed cedwyn.bucklerfamily.estate --live` and IndexNow for the new URLs.
- Then point the owned Bluesky/Mastodon accounts' RSS bridge at the feed so each new evidence page posts itself (rate ceilings in bluesky-mastodon-fediverse-heritage.md).

## Sources
- pubsubhubbub.appspot.com (Google hub: rel=hub link, publish POST format)
- inoreader.com (publisher flow, declaring and pinging a hub)
- kevincox.ca (Atom recommendation, minimal template)
- developers.google.com (use both sitemap and feed)
- rfc-editor.org (Atom format) · w3.org
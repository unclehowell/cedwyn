# Rolling version labels: keep URLs on permanent edition IDs, add one stable "latest" address

Checked 30 Oct 2026, ~11:00Z. This file is about *addresses* (URLs, share links, feeds, schema). It does not repeat the forward banner and "keep old editions online" advice in free-previous-edition-paid-latest-baen-pattern.md, or hashtag parsing, which is in version-hashtags-platform-parsers-dot-breaks-tag.md.

## Why this matters now
Since 30 Oct the site-wide display scheme is:
- the newest edition is always **v0.0.2** (£4.99);
- the previous one is **v0.0.1** (free);
- older ones are **-v0.0.1, -v0.0.2 …** (free), counting backwards by creation date.

So the labels **roll**. When a new cut or edition ships, today's v0.0.2 becomes v0.0.1 and today's v0.0.1 becomes -v0.0.1. Any address built from a label will point at different content after each release. Old links, search results, social posts and saved bookmarks would quietly show another edition, and the newest would turn paid under a link that used to be free.

## What the primary sources say (read 30 Oct)
- **W3C, "Cool URIs don't change" (Tim Berners-Lee), read.**
  - Status words such as "old", "draft" and "latest" are a reason URIs break: "The latest version of a document needs a persistent identifier whatever its status is. Keep the status out of the name."
  - A creation date is a safe part of a URI. Most other things you might put in the name, such as author, subject or status, are "asking for trouble".
- **Google, "Consolidate duplicate URLs", read.**
  - rel=canonical is "a strong signal", not a directive.
  - Don't use robots.txt or noindex to canonicalise.
  - Use redirects only when you are retiring a duplicate.
  - If the pages differ materially, Google can and does choose its own canonical. Search Console then reports "Google chose different canonical than user" (seotesting.com, snippet).
- **Docs practitioners**, read 30 Oct: Redocly's documentation SEO guide, and Read the Docs' SEO guide on canonical URLs and versions.
  - Point every *version* page's canonical at the "latest/current" page.
  - Keep canonicalised duplicates out of the sitemap.
  - Put a banner on old versions.
  - This is so that "outdated docs" do not outrank current ones.
- **Box test, 30 Oct ~10:56Z** (live HTML read by script): the big docs sites all use one **stable alias address** for "latest", and old pages point their canonical at it.
  - docs.python.org and /3.12/… → canonical `docs.python.org
  - postgresql.org → `/docs/current/…`.
  - Django /en/3.2/… and /en/5.2/… → the newest release's page (/en/6.1/…), with robots ALL. Old versions stay indexable.
  - Free-book sites that keep editions as separate works, such as eloquentjavascript.net and /3rd_edition/ and automatetheboringstuff.com, carry **no** cross-edition canonical. Each edition stands alone, with a banner.
- No traffic numbers were found for label-versus-ID URLs. Treat the rule as practitioner consensus plus Google's documentation, not a measured uplift.

## The how-to
1. **Permanent ID per edition or cut.** Use an internal semver or a creation date, for example `[address kept in the project workspace]` or `scene-03@2026-10-30`. It never changes. Use it in URLs, download keys, `?v=` parameters, feeds, sitemaps, schema `@id`, analytics events and UTM content.
2. **Labels are display only.** v0.0.2, v0.0.1, -v0.0.1 and the #_v hashtags are computed from creation order at render time. They are never stored in a link.
3. **One stable "latest" address per work.** This is the work's main page, for example /ebooks/cedwyn/. It always shows the newest edition. It is the target for buy links, social posts, press and ads.
4. **Canonicals.**
   - A near-duplicate edition page (same text, small changes) → canonical to the latest address. Python/Postgres style.
   - A materially different edition that is free and complete → self-canonical, kept in the sitemap, with a forward banner. Eloquent JS style.
   - Never use noindex or robots.txt to hide old editions.
5. **On every release:** run the address check (tool below), confirm old IDs still resolve to the same content, and confirm the "latest" page now shows the new edition.
6. **Search Console:** inspect the latest address and one old edition. If Google picks its own canonical, accept it when the content differs. Don't fight it with redirects.

## How we apply it to Cedwyn (e-books, documentary, academy, site)
Live facts, from cache-busted curl on 30 Oct ~10:57Z:
- E-books already key free downloads by permanent ID, for example `/ebooks/api/free?book=[address kept in the project workspace]` and `[address kept in the project workspace]`. Each work page is self-canonical (`/ebooks/cedwyn/`). **Keep it so.** Never add `?edition=v0.0.1`-style label links.
- The source comment in documentary.js 1.6.2 reads "Labels are display only: manifest versions (0.0.1-0.0.N), data-v attributes, downloads and saved choices keep their own values". That is the right design.
  - The page reads `?v=` (it strips a leading "v"). **Check:** shared links must carry the *manifest* version, never the display label. `?v=0.0.2` would otherwise mean "newest" today and an old cut later.
  - /documentary/ has **no canonical tag** (og:url only). PROPOSAL: add `<link rel="canonical" href="cedwyn.bucklerfamily.estate` and keep `?v=` variants pointing to it.
- Social posts, auto-blog items, newsletters and quote cards link to the stable work page (latest), not to a labelled edition. Versions go in the caption text only. This also avoids the #_v0 hashtag collision.
- The academy and agent library (/academy/work.json, llms.txt): when they cite an e-book or scene, use the permanent ID plus the work URL, never "v0.0.2".
- All changes are PROPOSALS for the onpage, documentary and e-book owners. No price changes, and no buy.stripe.com requests from scripts.

## Tool
`tools/version_url_check.py` is our own script. It needs only the Python standard library plus curl, and nothing was installed. Run `timeout -k 5 120 python3 tools/version_url_check.py URL ...`. For each URL it reports the HTTP code, canonical (resolved), robots meta, og:url, whether the canonical points to itself, rolling labels in href/src attributes, and `?v=` values found in links. It exits 1 if any page lacks a canonical or links by a rolling label.

## Sources
- w3.org (read 30 Oct 2026)
- developers.google.com (read)
- redocly.com (read)
- docs.readthedocs.com (read)
- seotesting.com (snippet)
- Box test: docs.python.org and /3.12 os.html, postgresql.org, docs.djangoproject.com and /en/5.2 urls, eloquentjavascript.net 2nd/3rd edition, automatetheboringstuff.com (30 Oct)
- Live: cedwyn.bucklerfamily.estate/ebooks/, /ebooks/cedwyn/, /documentary/, documentary.js?v=1.6.2
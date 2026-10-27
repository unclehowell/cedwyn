# blog — the Cedwyn blog section

- public/: the section shell served at /blog/ (layout only; posts come from the cedwyn-blog Worker, which fills #blog-main).
- worker/: source of the Cloudflare Worker `cedwyn-blog` (route cedwyn.bucklerfamily.estate/blog*): blog pages, RSS 2.0 /blog/rss.xml,
  Atom /blog/atom.xml, JSON Feed 1.1 /blog/feed.json, news sitemap /blog/news-sitemap.xml, and the daily auto-post
  (Workers AI binding, grounded in the page's own text, banned-word and privacy scan, failures held as drafts; IndexNow + WebSub pings).
  No keys live here: the Worker reads its AI binding, its KV namespace and a run token from Cloudflare bindings.

— Sion's Tab agent, 27 Oct 2026

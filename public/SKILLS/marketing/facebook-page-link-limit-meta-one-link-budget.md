# Facebook Page link limit (2 link posts or comments a month) and what reach links get

Checked 27 Oct 2026. Facebook organic, Page side. Owner: social.py / quote-pack / sales-fix workers.

## What is true now (sources read)
- **Facebook Help 1929252614431792** (read 27 Oct 2026 via a text mirror; the page itself blocks scripts):
  - "Limits on posts and comments with links may not apply to all Pages." If a Page has the limit: **links in up to 2 organic posts OR comments per month**.
  - Resets on the 1st of each month. Unused allowance does not carry over.
  - **Links in comments count.** These do NOT count: *additional* links in the comments of a post that already has a link; links to Meta's own apps (Facebook, Instagram, WhatsApp, Threads); affiliate links through Facebook's affiliate partnerships; links in ads.
  - Meta One plans lift it: Free and Essential ($14.99/mo) 2, Advanced ($49.99) 8, Expert ($149.99) 20, Max ($499.99) unlimited. **Paid: excluded for us (zero spend).**
  - Link posts can now carry a custom preview image and a call-to-action button.
- **Mari Smith** (Meta-marketing practitioner, own Page post, 24 Sep 2026, read): Meta "is starting to roll out the limitation of organic links in both posts and comments", tied to the Meta One push, "still being rolled out... likely for many months". 229 reactions, 381 comments, mostly Page owners reporting it.
- Reports since Dec 2025 (Social Media Today, Matt Navarra, r/DigitalMarketing; snippets only, **not checked**): began as a test on professional-mode profiles and Pages without Meta Verified.
- **Socialinsider reach study, Sep 2026 (read):** Facebook reach rate by format: images 1.20%, albums 1.15%, status 0.80%, Reels 0.55%, **links 0.20%**. Pages with 1-5K followers reach 4.35% on average; FB average 1.25% (Aug 2026). Instagram carousels 4.50%, Reels 4.10%, images 4.00%.

So a link is both rationed and the lowest-reach format. The **photo post + link in first comment** trick still costs one of the 2 links: the post itself has no link, so the comment's link is the "first" one.

## How to work under it
1. **Photo or album posts with no link are the default.** They get 6x the reach of a link post (1.20% vs 0.20%). The call to action is words: "the e-books are on our website, link in the Page intro."
2. **Put the shop link where it isn't a post.** Use the Page's Intro/website field and a "Shop now" or "Learn more" action button on the Page header. Neither is an organic post or comment. Check what the Page shows.
3. **Spend the 2 links a month on the 2 posts that matter most:** a new e-book or edition, a free chapter, a talk. Put the link IN the post (custom preview image + CTA button). Then any more links in that post's comments are free (shop + blog + chapter in one thread).
4. **Instagram, WhatsApp and Threads links are free.** That is no use for sales directly, but a "full story on our Instagram" pointer costs nothing.
5. **Track the budget.** Keep a per-month count of every Page post or comment that carries a non-Meta link, across every tool that posts (auto-social, quote pack, any person posting by hand). When it reaches 2, stop adding links until the 1st. If a link comment fails or is blocked, log it. Don't retry. Tool: `python3 tools/fb_link_budget.py` (stdlib; exits 1 when the month's 2 are used; first run 27 Oct: 1 of 2 used).
6. **Measure.** Weekly: Page reach per post by format, and UTM sessions with source=facebook in analytics. If no-link photo posts plus the Page-intro link bring more /ebooks/ visits than link-comment posts did, keep it that way.

## How we apply it to Cedwyn
- **Live risk, found this run (read-only):** `the project workspace` posts a no-link photo to Great House Farm II, then a **first comment with two links** (blog post + /ebooks/ shop, added by sales-fix run 14 at 04:06Z). With a daily cadence, if the Page has the limit this uses October's allowance by the second post. From then until 1 Nov the comment will fail or be blocked. The weekly quote pack also plans "shop link as first comment" on Facebook, from the same budget.
  - Only one Facebook post is logged so far (27 Oct 03:48Z, comment ok). Whether this Page has the limit is **not checked**: Meta shows it in the composer, not through the API we use.
- **PROPOSED to the social.py owner (not changed here):**
  - Facebook branch: drop the comment link on routine days. Use a caption CTA pointing to the Page intro link. Allow at most 2 link-bearing items a month, each with both links together in that one post/thread. Log `fb_links_used` per month in state.
  - Leave Instagram as it is: IG captions can't hold clickable links anyway, and the Page limit doesn't apply there.
- **Needs the project lead (one line, only if asked):** check the Page shows /ebooks/ in its Intro website field and has a header button. It's a 30-second Page edit, and doesn't count towards the limit.
- Never buy Meta One or Meta Verified (zero-spend rule). Don't post links from personal profiles as a workaround.

## Sources
- facebook.com (Facebook Help, read 27 Oct 2026)
- facebook.com (Mari Smith, 24 Sep 2026, read)
- socialinsider.io (Socialinsider reach study, Sep 2026, read)
- socialmediatoday.com (snippet only, not checked)
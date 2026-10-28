# Blog-to-shop links: an in-sentence link early in the post, not just a closing banner

**Topic:** where the e-book link sits inside a blog post. Cedwyn's blog posts currently have one link, at the very end.
**Harvested:** 2026-10-28 00:15Z (skills harvest). Sources were read in full; numbers are as the sources state them.

## The evidence

**HubSpot blog, Pamela Vaughan, 12 Feb 2016** (read via the Wayback capture of 14 Jan 2017; the live page was rewritten 8 May 2025 and no longer carries the numbers):
- Method: each CTA type in a set of posts got its own tracking URL, and leads were counted over 4 weeks.
- **End-of-post banner CTAs produced on average only 6% of a post's leads.**
- **The anchor-text CTA (a plain link inside a sentence, early in the post) produced 47–93% of each post's leads.** It was the top source in every post tracked.
- Anchor-text and internal-link CTAs together produced 83–93% of leads.
- Slide-in CTAs, which appear 25–50% of the way down, beat end-of-post banners.
- **Adding an anchor-text CTA to posts that had none raised view-to-lead conversion by an average of 121%.**
- 68% of their blog traffic came from organic search, and 74% of that was new visitors. So older, search-fed posts are where an in-text link earns most. New posts are read mostly by email subscribers, who are already on the list.
- A reader comment on the post (not checked, one company): updating its top 100 posts older than 90 days with anchor-text and slide-in CTAs changed conversion by +117%.

**HubSpot, May 2025 update** (live page read 28 Oct 2026): most HubSpot posts now carry at least three CTAs, one anchor-text and two image. The anchor text uses direct action words ("download", "access"), and the offer is matched to the post's search intent.

**Caveats:** these are HubSpot's own leads (free downloads) on a very large blog, the study is from 2016, and it is one company. The "inline CTAs get 121% more clicks than sidebar" line repeated by 2026 CRO round-ups (e.g. foundrycro.com) is a garbled retelling of the 121% figure above. Don't cite that version.

## Why it works
Most readers never reach the end. A link inside the sentence that raises the question the book answers catches them at the moment of interest. A banner at the end reads as an ad and is only seen by the few who finish.

## How to do it (any blog)
1. **One in-sentence link in the first two paragraphs**, to the single most relevant product, not the whole shop. Example wording: "the 1824 entry is reproduced in full in *[Book title]*". The words themselves are the link, and they say exactly what the reader gets.
2. **Keep the closing link** as well. It still catches finishers.
3. **Long posts (over ~600 words): add one mid-post card** (cover thumbnail, one line, price or "free sample") at about 40% down. A slide-in is optional; on phones it must not cover the text and must be easy to dismiss.
4. **Tag each position with its own UTM** so the positions can be compared: the same `utm_campaign`, with `utm_content=anchor` / `mid` / `end`. Use `tools/utm.py`.
5. **Retrofit old posts first.** Sort posts by organic entrances (Search Console clicks or Cloudflare HTML hits) and add the in-text link to the top ones.
6. **Match the offer to the query.** Each post links to the book that answers the question the post ranks for. Search Console queries per page tell you what that question is (see `search-console-regex-question-longtail.md`).
7. **Read the result after 4 weeks or ~30 clicks per position**, whichever comes later. Below that, treat it as a direction, not a result (`tools/ab_stats.py`, `zero-sales-diagnosis-traffic-vs-conversion-binomial.md`).

## How we apply it to Cedwyn
- **What the blog does now** (checked 28 Oct 00:13Z, `/blog/p/1824-the-first-record-that-names-the-house/`): 151 words. The only shop link is the last line, "E-books from the records · first editions free →", to `/ebooks/?utm_source=blog&utm_medium=post&utm_campaign=cta`. There is no in-text link, and no per-book link.
- **Change in the daily-post template** (cedwyn-blog Worker): add one sentence in paragraph 1 or 2 that links the post's subject to the specific e-book covering it. Map post tags/years to a book slug, and fall back to `/ebooks/` when nothing matches. Use `utm_content=anchor`, and set the existing closing link to `utm_content=end`.
- **Retrofit the existing posts by hand**, starting with the most-visited.
- **Wording:** must pass the editorial scan. No banned words, no outbound links, never name the project lead. Describe what the record shows, not a claim.
- **Measure:** in the Sunday growth report, compare clicks to `/ebooks/` by `utm_content`. With current traffic, expect weeks before the numbers mean anything. Log it as an experiment in `growth-experiment-loop-autoresearch-keep-discard.md` style: one change, one metric.
- **Ownership:** the cedwyn-blog template is owned by the tonight-push / onpage workers. This is a PROPOSED change for whoever owns that template next. Don't edit it while another worker is committing.

## Sources
- web.archive.org (Vaughan, 12 Feb 2016; read)
- blog.hubspot.com (Beltis update 8 May 2025; read)
- foundrycro.com (read; repeats the 121% figure in a different form, don't cite it)
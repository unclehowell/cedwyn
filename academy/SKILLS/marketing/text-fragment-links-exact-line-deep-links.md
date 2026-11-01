# Text-fragment links (#:~:text=): send readers to the exact line of a record

Harvested 31 Oct 2026 (skills harvest). Before this run the index had 0 hits for 'fragment' and '#:~:'.

## What it is
A link that ends `#:~:text=` makes the browser scroll to a phrase and highlight it, with no change to our pages.
Syntax (MDN, read): `site]textStart[,textEnd][,-suffix]`
- Percent-encode every string, and encode a literal hyphen as `%2D`. Matching is case-insensitive.
- `prefix-` and `-suffix` pick the right match when a phrase appears more than once.
- Join several highlights with `&text=`.
- Each piece must sit inside one block element (one paragraph or table cell).
- If the text is not found, the page just opens at the top. A failed fragment costs a scroll and never breaks the link.
- MDN warns that a fragment stops matching once the page text changes. For long-lived links, an element `id` anchor is more reliable.

## Evidence (with numbers)
- **Google uses fragments itself.** Featured-snippet links have carried `#:~:text=` since 2020–21 (owntag, 12 May 2021, read). Google stopped reporting fragment data in Search Console in May 2021 (owntag, read).
- **The fragment never reaches the server or the analytics.** Browsers strip it before page scripts run (MDN, read). UTM query strings are unaffected. Seeing the fragment needs JavaScript reading `performance.getEntriesByType('navigation')[0].name` (owntag's GA4/GTM method, read).
- **AI Overviews stopped carrying fragments in May 2026.** A r/GoogleAnalytics thread reports a "~90% drop in sessions with this fragment" from 1 May, with Google's share of fragment sessions falling "from ~70% to ~35%". That is a search preview only and not checked. Lesson: fragments are no longer a dependable signal of AI-Overview traffic, so don't build reporting on them.
- **Where AI answers quote from.** CXL (read): in 100 AI Overview citations, 55% of cited passages came from the first 30% of the page. Kevin Indig (cited by CXL): 44.2% of 18,012 ChatGPT citations came from the first 30%. Ahrefs 2026 (cited by CXL): only 37.1% of cited URLs also ranked top 10. So write a quotable line high on the page. A fragment link is how *we* point people at that line.
- **Browser support** (from memory, compat table not read this run, not checked): Chrome/Edge since 2020, Safari 16.1+, Firefox 131+ (Oct 2024). In-app browsers (Instagram, Facebook, WhatsApp, Gmail): not checked. Test them before relying on it.

## How to do it (10 minutes per link)
1. Choose one short, distinctive phrase (4–10 words) in the page's visible text, inside a single paragraph or table cell. Never use a phrase that only appears in an image or a PDF.
2. Build it in code, not by hand:
```python
from urllib.parse import quote
def frag(url, start, end=None, prefix=None, suffix=None):
    q=lambda s: quote(s, safe='').replace('-', '%2D')
    t=(q(prefix)+'-,' if prefix else '')+q(start)+(','+q(end) if end else '')+(',-'+q(suffix) if suffix else '')
    return url.split('#')[0]+'#:~:text='+t
```
3. Check it before posting: open the link at 390 px in Chrome and Safari and confirm the highlight lands. Save a fetch of the page and assert that the phrase occurs exactly once in the visible text (or that the prefix makes it unique).
4. Count it: fragments are invisible to analytics, so put the fragment behind our own `/r/<campaign>` short link (see own-short-redirect-links-r-campaign-path-counting.md). The redirect counts the click, then 302s to `page?utm…#:~:text=…`.
5. Re-check monthly: page-history edits can change the wording, and then the fragment silently stops matching. If the line is permanent, add a stable `id` to its element and use `#id` instead. Use the fragment where we don't control the page (archive catalogues, Hansard, Gazette).

## Don'ts
- No fragments in printed QR codes. Print lives for years and page text drifts, so print uses /r/ links to stable `#id` anchors.
- Never highlight a phrase that would read as an accusation out of context. The highlight shows only the words, without the paragraph around them.
- Don't promise readers a highlight. Some in-app browsers may ignore it (not checked).

## How we apply it to Cedwyn
- **Quote cards and quote-pack posts:** the "Source" link under each verbatim period-record line goes through /r/ to the record page with that exact line highlighted. The quote-pack runner can call `frag` for each card and log `fragment_ok` after the 390 px check.
- **E-book sales and sample emails:** link "read the line" to the free sample's dated record (for example the 1841 tithe parcel entry or a census line), so a reader lands on the evidence and not the top of a long page.
- **Answers to reader questions and comments:** link the exact sentence on /research/ or the evidence catalogue instead of saying "see the page".
- **AI visibility:** put each page's one quotable dated fact in the first 30% (CXL). Don't track AI-Overview traffic through fragments any more (May 2026 change).
- **Welsh text:** percent-encode accents and circumflexes (ŵ, ŷ) via `quote`, and test one cy link in Safari first.
- The editorial rules still apply to every highlighted phrase: no banned words, never name the project lead, nothing about family holdings.

## Sources
- MDN Text fragments (read): developer.mozilla.org
- owntag, "How to track Scroll-to-text fragments in GA4" (12 May 2021, read): owntag.eu/blog/scroll-to-text-fragments-in-ga4
- CXL, "Where Google AI Overviews cite from: a 100-page study" (read): cxl.com
- r/GoogleAnalytics "#:~:text= no longer sent from AI Overview links after May 6" (search preview only, not checked): reddit.com
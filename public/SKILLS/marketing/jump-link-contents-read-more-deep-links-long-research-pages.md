# Jump-link contents + "Read more" deep links for long research pages (PROPOSED patch, not committed)

Checked 31 Oct 2026. A free, no-account change on cedwyn.bucklerfamily.estate itself.

## What the sources say
- **Google Search Central, "Best practices for 'Read more' deep links" (snippet doc, updated 2026-04-20, read).** A deep link is "a link within a snippet that leads users to a specific section on that page." To make one more likely:
  1. "Make sure content is immediately visible on the page to a human (and **not hidden behind an expandable section** or tabbed interface)."
  2. Don't use JavaScript to force the scroll position on load.
  3. History API or `location.hash` code must not remove the hash fragment.
- **NN/g, "Table of Contents: The Ultimate Design Guide" (read):**
  - A contents list gives direct access to sections and makes "bottom content" discoverable, because attention drops down long pages.
  - On mobile and one-column layouts, put it in the main body, near the top.
  - Warning: a long intro can push it below the fold.
  - Collapsing the sections into accordions is a valid alternative, but a sticky collapsible contents list is flagged as risky.
  - NN/g's in-page links piece (nngroup.com, snippet only): make link text match the heading text.
- **CXL, "How to make your Google search snippets more clickable" (read):** Google's "Jump to" snippet links come from named anchors. An on-page clickable contents list built from H2/H3 is the way to get them.
- **Numbers (weak, labelled):**
  - auditme.dev (snippet only): "added a table of contents. CTR went from 2.5% to 8.2%. Same position". The meta description was rewritten at the same time, so this is confounded.
  - Galileo Tech Media case PDF (snippet only): jump links to each heading were one change within a +434% traffic case; it isn't isolated.
  - I found no controlled 2026 study. Treat the effect as plausible but unmeasured, and measure it ourselves (below).

## What cedwyn does today (live fetch, 31 Oct 19:12Z)
| page | words | h2/h3 | with id | in-page # links | `<details>` |
|---|---|---|---|---|---|
| /research/ | 7,350 | 4 | 2 (preview, change log) | 0 (one bare `#`) | 66 (3 open) |
| /wiki/ | 7,113 | 6 | 4 (videos, log) | 1 (skip link) | 62 |
| /thousand-cuts/ | 8,732 | 19 | 19 | 176 | (already has contents) |
| /wales/ | 3,000 | 16 | 13 | 3 | |

- On /research/, the main sections are `<summary>` lines with no `id`: "Read the case summary", "Great House Farm · title-chain map", the dated timeline rows ("1916 · Bute tenancy: J. Williams", "4 Jul 1955 · Possession order enforced"...), Registers, and Q&A. Nothing on the page can be linked to directly, and Google has no visible anchored section to deep-link to.
- Good news: no `scrollTo(`, `replaceState`, `location.hash` or `scrollRestoration` code on /research/, so Google's rules 2 and 3 already pass.
- /thousand-cuts/ is the in-house model to copy (19 ids, 176 anchor links).
- Side finding: /research/books/ returned **404** at 19:12Z. The canonical register is /research/book-research-findings.csv; the book flywheel owns this.

## Tension with progressive disclosure, and the rule we pick
`headline-first-read-more-progressive-disclosure.md` collapses sections. Google's doc prefers visible content for deep links. Rule:
- The **case summary** and the **section headings** stay visible, with ids.
- Long supporting detail (the timeline rows' bodies, registers) may stay collapsed, but each `<details>` gets an `id`, and opening a `#hash` opens that panel.

## PROPOSED patch (for the onpage owner to wire into the build, e.g. `tools/site.py`, as a site-wide labelled PR; not committed by this run)
```python
# add_jump_links(html): give h2/h3/details stable ids, add an "On this page" list, open the targeted panel
import re, unicodedata
from bs4 import BeautifulSoup
def _slug(t, seen):
    t = unicodedata.normalize('NFKD', t).encode('ascii','ignore').decode().lower()
    s = re.sub(r'[^a-z0-9]+','-', t).strip('-')[:48] or 's'
    base, n = s, 2
    while s in seen: s, n = f'{base}-{n}', n+1
    seen.add(s); return s
def add_jump_links(html, main_sel='main', top_n=8):
    soup = BeautifulSoup(html, 'lxml'); main = soup.select_one(main_sel) or soup.body
    seen = {e['id'] for e in soup.select('[id]')}
    targets = []
    for el in main.find_all(['h2','h3','details']):
        if el.find_parent('nav') or el.find_parent(id='page-version-log'): continue
        label = (el.find('summary') if el.name=='details' else el)
        text = label.get_text(' ', strip=True) if label else ''
        if not text or len(text) < 4: continue
        if not el.get('id'): el['id'] = _slug(text, seen)
        if el.name != 'details' or el.find_parent('details') is None: targets.append((el['id'], text[:70]))
    if len(targets) >= 3 and not main.select_one('nav.cw-onpage'):
        nav = soup.new_tag('nav', attrs={'class':'cw-onpage','aria-label':'On this page'})
        ol = soup.new_tag('ol')
        for i,(id_,t) in enumerate(targets[:top_n]):
            li = soup.new_tag('li'); a = soup.new_tag('a', href='#'+id_); a.string = t; li.append(a); ol.append(li)
        nav.append(ol); h1 = main.find('h1')
        (h1.insert_after(nav) if h1 else main.insert(0, nav))
        js = soup.new_tag('script'); js.string = ("(function(){function o(){var e=location.hash&&document.getElementById("
          "decodeURIComponent(location.hash.slice(1)));for(;e;e=e.parentElement){if(e.tagName==='DETAILS')e.open=true}}"
          "o();addEventListener('hashchange',o)})();")  # opens panels; never moves scroll, never strips the hash
        soup.body.append(js)
    return str(soup)
```
- Idempotent: it skips existing ids and an existing `nav.cw-onpage`.
- CSS: style `.cw-onpage` in the theme's dark palette (no white background). Keep it to 8 entries and put it directly under the H1 and the 2-3 sentence summary, so at 390 px it sits above the fold.
- Labels come from existing headings, so there's no new public wording to lint. Still run `agent_lint` on the built pages.
- Pages: /research/, /wiki/, /wales/, /argentina/. Leave /thousand-cuts/ as it is.

## Measure (free, no account)
- **Before/after in Search Console** (connected): impressions and CTR for /research/ and /wiki/ over 28 days. Check whether `#` URLs appear in Performance → Pages (not checked for this site yet).
- **Cloudflare:** referrer clicks can't carry the fragment. Instead, count `/r/` shop clicks from /research/ before and after, since the contents list moves the shop strip's neighbours higher on the page.
- **Verify live at 390 px:** contents visible without scrolling past one screen; `/research/#great-house-farm-title-chain-map...` opens and lands on that panel; no horizontal scroll.

## How we apply it to Cedwyn
1. The onpage owner (CEDWYN ONPAGE RUN, Wed) or the sales-fix lane opens one site-wide labelled PR with the function above. The root merges. No dispatch.
2. Give e-book shelf entries anchors too (`/ebooks/#enwau` etc.), so Facebook/YouTube descriptions can deep-link to one book instead of the top of the shelf. Use existing `/r/` redirects; no outbound links.
3. Agents that write research rows can then cite exact panels (`/research/#4-jul-1955-possession-order-enforced`) in HubSpot gap tasks and the academy.
4. No account, no spend, no posting. Nothing here needs the project lead's GO beyond the normal root merge.

## Sources
- developers.google.com ("Read more" deep links section; read; updated 2026-04-20)
- nngroup.com (read)
- cxl.com (read)
- auditme.dev (snippet only; confounded)
- galileotechmedia.com (snippet only)
- cedwyn live fetches 31 Oct 19:12Z (table above)
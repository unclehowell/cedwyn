# Print stylesheet for long research pages (save-as-PDF readers)

Date: 2026-10-31 · Harvest run (skills) · Status: how-to + PROPOSED patch (no commit made)

## Why it matters (sources, read today)
- Smashing Magazine (2013, read): "printer use is not tracked by website analytics software", so print "tends to be broadly ignored"; "a significant portion of people rely on pages printed from websites for reference".
- Smashing Magazine, Rachel Andrew, "State of print stylesheets in 2018" (read): anything a visitor "might want to use when away from their computer is also a good candidate" for print styles; also covers paged media and fragmentation (page breaks).
- A List Apart, Eric Meyer, "Going to Print" (read): one print stylesheet beats "printer-friendly versions"; serif body text, white background, and printing the address of each internal link after it with `a[href^="/"]:after { content: " (site" attr(href) ") " }`.
- Bryce Wray, 21 May 2025 (read): "a relatively small percentage of users actually print web pages anymore"; he loads print CSS only on `matchMedia('print')` / `beforeprint`, keeping it off the screen path.
- HP Developers, "Printing with CSS and media queries" (search snippet only; page 403 to scripts): a news article "should have been about 2 pages but took up 18 printed pages" because navigation printed. Not checked beyond the snippet.
- GOV.UK publishing design guide, "Print link" component (read): single pages get a print link; multi-page guides get "View a printable version of the whole guide". Government practice, not a number.
- Savio.no (Eivind Savio, 2013, read): print events can be counted in analytics. A print-only CSS background request to the site's own path shows in server logs.

Honest read: no 2026 study gives a print share. Family-history readers are the group most likely to print or save as PDF for archive visits and family packs, so this is a low-cost reading improvement, not a traffic lever. Measure before claiming any effect.

## What we measured on cedwyn.bucklerfamily.estate today (headless Chrome print-to-PDF, cache-busted, US Letter default)
- /research/: 4 pages; /research/books/: 2 pages; /ebooks/: 5 pages (2.9 MB PDF from cover images).
- The live CSS already has `@media print` rules that unclamp `.cw-c` excerpts and static-position `.cw-ior .cw-p` popovers. Good start.
- Gaps seen in the rendered pages: the search box prints; video players and a thumbnail print as empty boxes; /research/ has 6 `<details>` blocks and their bodies stay collapsed on paper (Chrome does not open `<details>` for print); there is no page URL or date on paper; there are no page-break rules for headings and figures.
- The wiki palette sets `--wiki-text: #eaecf0` in dark mode. If dark mode is on when someone prints and the browser drops backgrounds (the default), light text lands on white paper. Force black on white in print only.

## The method (any site)
1. Print three long pages to PDF and count pages and blank boxes. That is the baseline.
2. In `@media print`: white paper and black text, serif body around 11pt; hide navigation, search, video/iframe, buttons, cookie or signup strips and the collapsed agent changelog footer.
3. Open `<details>` on `beforeprint` and restore them on `afterprint` (JS, below). Add the CSS `::details-content` rule for browsers that support it.
4. Print internal link targets after the link text (internal paths only; the site has no outbound links).
5. Add break rules: `h2,h3{break-after:avoid}`, `figure,table,blockquote{break-inside:avoid}`, `img{max-width:100%}`.
6. Put the page's own URL and "printed from" under the content so a paper copy can be traced back to the page.
7. Optional count: a print-only background request to the site's own `/favicon.ico?print=<page>` shows in Cloudflare path analytics. Not checked here whether Chrome fetches it when backgrounds are off. Test once, then decide.
8. Re-print the same three pages and record pages before and after.

## PROPOSED patch (for a labelled PR or section branch; root merges; nothing committed)
Append to the shared theme stylesheet (or the wiki `<style>` block):
```css
@media print {
  @page { margin: 15mm; }
  html, body { background: #fff !important; color: #000 !important; }
  body { font: 11pt/1.45 Georgia, "Times New Roman", serif; }
  a { color: #000 !important; text-decoration: underline; }
  a[href^="/"]::after { content: " (cedwyn.bucklerfamily.estate" attr(href) ")"; font-size: 85%; word-break: break-all; }
  nav, header nav, form[role="search"], input[type="search"], .search, iframe, video,
  .yt, .video, button, .share, .signup, .ebook-strip, footer details, .agent-changelog { display: none !important; }
  details::details-content { content-visibility: visible; display: block; }
  h1, h2, h3 { break-after: avoid; }
  figure, table, blockquote, .cw-c { break-inside: avoid; }
  img { max-width: 100% !important; height: auto; }
  main::after { content: "Printed from cedwyn.bucklerfamily.estate" ; display: block; margin-top: 12pt; font-size: 9pt; }
}
```
Plus a small script (before `</body>`):
```html
<script>
(function(){var o=[];addEventListener('beforeprint',function(){o=[].filter.call(document.querySelectorAll('details'),function(d){return !d.open});o.forEach(function(d){d.open=true})});
addEventListener('afterprint',function(){o.forEach(function(d){d.open=false});o=[]})})();
</script>
```
Selectors such as `.yt`, `.ebook-strip` and `.agent-changelog` are placeholders. Match them to the real class names in the theme before the PR. White paper is a print-only exception to the "dark background, no white" screen rule. Before merging, confirm with the root that this is acceptable.

## How we apply it to Cedwyn
- Free, no account, one CSS block plus about 6 lines of JS. Deliver as a labelled PR (site-wide) or a section-branch change. The root merges. Never dispatch builds.
- Test pages: /research/, /research/books/, /ebooks/, one long wiki chronology page. Baseline above: 4 / 2 / 5 pages.
- Done when: no search box or video boxes on paper, all `<details>` text prints, the URL line appears, and page counts are recorded before and after in the onpage audit.
- Kill rule: if the PR breaks any 390 px screen check, revert to the current print rules (screen unaffected is the gate).
- Fits the weekly CEDWYN ONPAGE run (markup only). No body-text change.
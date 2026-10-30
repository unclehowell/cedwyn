# NLW Welsh Journals behind Cloudflare: get article PDFs through the IIIF manifests

Date: 2026-10-30. Tested from this box today.

## The wall
journals.library.wales, cylchgronau.llyfrgell.cymru, HathiTrust and BHL all answer a plain fetch from our box with a 403 Cloudflare "Just a moment…" page. A browser session gets through journals.library.wales. Its search works, but the viewer's "Plain Text" tab said "There is no plain text available for this page" on the 1903 Cardiff Naturalists pages.

## The route that works without a browser
1. The ids are in any viewer URL: `/view/<journal>/<issue>/<image>`. For example, `/view/1373290/1373799/102` is the Cardiff Naturalists collection, vol. XXXVI, image 103.
2. `iiif.llyfrgell.cymru is a plain fetch with no challenge. It is an `sc:Collection` listing every issue manifest (63 for Cardiff Naturalists 1900-1981).
3. Each issue manifest's `structures` are the articles. Each one has a title, its canvases (page labels such as "Vol. XXXVI - p. 52") and a `rendering` PDF at `datasyllwr.llgc.org.uk, also a plain fetch (the 1903 folklore article is 4.5 MB).
4. The PDFs are image scans with no text layer, and tesseract is not installed (disk too tight to add it). To read one: `pdftoppm -r 90 -gray -jpeg`, then look at each page. Around 13 pages takes a few minutes.
5. Finding the article still needs full-text search. That means one browser session on `journals.library.wales (it returns hit links with article titles), or a title grep across a journal's manifests with the helper below. The title grep took about 100 s for 63 issues.

## Helper
`tools/nlw_journal_articles.py` (our own script, stdlib only, read-only, ~3 KB):
- `ID --grep <word>` greps article titles across a journal or an issue.
- `ISSUE --get "<title part>" --out x.pdf` saves one article's PDF.

Tested 30 Oct: `1373290 --grep folk` gives the single hit "Some Folk-lore of south Wales" vol. XXXVI pp. 52-64.

## Why it matters for marketing
Credible heritage content comes from primary sources quoted with page numbers. This route opens 450+ Welsh journals (1.2 million pages, per NLW's home page) to every lane without fighting Cloudflare. That includes Morgannwg (Glamorgan Local History Society), Archaeologia Cambrensis and Cymmrodorion. Each find becomes a sourced post, a sourced page section or a correction to the citation trail, all at zero cost.

## How we apply it to Cedwyn
- Research lanes (online gap finder, intel flywheel, folklore queue) should use the manifest route first, and the browser only for full-text search.
- Cite as journal, volume, year and page, plus the viewer URL in our private notes. Public pages carry no outbound links (house rule), so the printed citation is what goes on the page.
- Quote the words; don't re-host NLW's scans (the digital version carries NLW's licence note). Text by authors who died before 1956 is public domain in the UK.
- Next: grep Cardiff Naturalists and Morgannwg titles for Llandough, Leckwith, Cogan and Penarth, then read the hits page by page.

## Sources
- iiif.llyfrgell.cymru and .../1373799/manifest.json (read 30 Oct 2026)
- datasyllwr.llgc.org.uk (read)
- journals.library.wales (403 to a plain fetch; browser search and viewer read 30 Oct 2026)
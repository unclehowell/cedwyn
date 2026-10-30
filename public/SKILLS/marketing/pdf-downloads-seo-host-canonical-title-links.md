# Free PDF downloads that search can find and credit to us: host, canonical, title, links

Date: 30 Oct 2026 (skills harvest 07:24Z). Topic: SEO/AI visibility for free PDFs (supplements, sample chapters, free first editions). Before this, the index had "x-robots" 0 and "pdf seo" 0. `preview-pdf-sales-tool-paid-titles.md` covers what goes *in* a preview PDF; this file covers how the file is served and indexed.

## The rules (Google Search Central, read 30 Oct 2026)
- **Google indexes PDFs** (it's on the indexable file types list) as long as the text can be copied out. It is not indexed if the PDF is password-protected or encrypted. Images inside PDFs are not indexed, so give key images their own HTML pages. (PDF FAQ, Gary Illyes)
- **PDFs can rank like web pages**, helped by their content and by how they are linked from other pages.
- **The title in results comes from two things:** the PDF's own *Title metadata* and the *anchor text of links* pointing to it. Set both.
- **Links inside a PDF work like HTML links.** They pass signals and may be followed after crawling. A PDF link can't be nofollowed.
- **Duplicates (HTML page plus PDF of the same text):** name the preferred URL in the sitemap, or send `Link: ...; rel="canonical"` as an HTTP header on the PDF. A `<link>` tag can't go inside a PDF; the HTTP header is the only route for files (canonicalisation doc).
- **To keep a PDF out of results:** send `X-Robots-Tag: noindex` as an HTTP header. robots.txt blocking stops crawling but not indexing of the URL.
- **Redirects:** a temporary redirect (302/307) means "show the *source* URL in results". A permanent one (301/308) means "show the target". Server-side redirects are read most reliably.

## Audit recipe (5 minutes per PDF, with curl and poppler)
1. `curl -sIL <pdf>` shows the redirect chain, final host, `content-type` (should be `application/pdf`), and whether `x-robots-tag` and `link` headers are present.
2. `pdfinfo file.pdf` shows the Title (a reader-facing title, not a file name), Author, and Encrypted (must be "no").
3. `pdftotext -l 1 file.pdf -` checks that the first page has real text and states what the document is in its first line.
4. Grep the raw bytes for `/URI` to list the links inside. They should point to our pages (with UTMs), never to a third-party checkout.
5. Check the HTML page that links to the PDF: is the anchor text descriptive (not "download"), and is there a short HTML summary page that can be the canonical?
6. In Search Console, run URL Inspection on the PDF URL to see whether it is indexed, on which host, and which canonical Google chose.

## Measured on Cedwyn, 30 Oct 07:27Z (the one PDF linked from /ebooks/)
- `/ebooks/supplement/cedwyn-supplement-2026-10-25.pdf` **302s to raw.githubusercontent.com**, which serves it as `application/octet-stream` with `x-content-type-options: nosniff` and `content-security-policy: sandbox`, and no `Link` or `X-Robots-Tag` header. raw.githubusercontent.com returns 404, so it is crawlable there.
  - Because the redirect is temporary, Google should show the cedwyn URL. But we can't send a canonical header from GitHub's host, the file isn't typed as a PDF, and the same bytes sit at a second public URL.
  - Whether octet-stream blocks PDF indexing: not checked. Run URL Inspection before acting.
- **Title metadata is good:** "The title chain and the twelve-year pairs (supplement, 25 October 2026)". Author "Cedwyn Estate research library". Not encrypted, 10 pages, text extractable. Page 1 opens with a shop line and then a clear description.
- **It has 3 link annotations:** 2 to `/ebooks/?utm_source=pdf&utm_medium=supplement&utm_campaign=sf20` (good) and 1 straight to `buy.stripe.com That last one is crawlable: buy.stripe.com allows Googlebot, and each open creates a Checkout Session. See `payment-link-sessions-bots-checkers-vs-buyers-no-email-recovery.md`.
- The PDF is not tagged (`Tagged: no`), so screen readers get no structure. This is a minor accessibility gap.

## Playbook
1. **Serve the PDF from our own host** with `Content-Type: application/pdf`, not a redirect to a code host. If the site is built from the repo, publish the file as a site asset at the same path. With Cloudflare in front, set the headers in a `_headers` file or a Transform Rule, whichever the site build supports.
2. **Give every PDF one HTML "home" page** (for example `/ebooks/supplement/`): a 150 to 300 word summary, the cover, and a descriptive download link ("Download the title-chain supplement (PDF, 10 pages)"). Send `Link: <that page>; rel="canonical"` on the PDF if the page and the PDF carry the same text. If the PDF holds content found nowhere else, let it stand as its own URL and skip the canonical.
3. **PDF metadata at build time:** set Title, Author, Subject (one sentence) and Language (`cy`/`en`). With ReportLab use `canvas.setTitle/setAuthor/setSubject`, plus `lang` on the document if supported. Keep the file under about 15 MB (Googlebot fetches only the first 15 MB of a file).
4. **Links inside the PDF** go to our own pages with UTMs (`utm_source=pdf&utm_medium=<doc>`), one shop link on page 1 and one at the end. No raw checkout links.
5. **List each PDF in the sitemap** (its own `<url>`), or list only the HTML home page if you set the canonical.
6. **Measure:** in Search Console, filter Pages by URL containing `.pdf` (impressions, clicks, queries). In Cloudflare, count HTML visits with `utm_source=pdf`. Review after 28 days.

## How we apply it to Cedwyn
- **No live site change during the repair freeze.** Two internal steps first:
  - (a) URL Inspection of the PDF URL through the connected Search Console (read-only), to see whether it is indexed and which canonical and host Google picked.
  - (b) Fix the PDF generator for the next supplement: change the in-PDF Stripe link to the /ebooks/ URL, and add Subject and Language.
- **PROPOSAL (site-wide, after the freeze and when no build is running):** serve `/ebooks/**.pdf` from the Pages build instead of the raw.githubusercontent 302, with a `Link: rel=canonical` header pointing at a `/ebooks/supplement/` summary page. Public text follows the editorial rules (no banned words, the family wording rules, no names).
- **Each future free edition or sample chapter PDF** goes through the 6-step audit before it is linked.

## Sources
- developers.google.com (PDF FAQ: indexing, links, title, canonical, noindex)
- developers.google.com (.pdf supported)
- developers.google.com (rel=canonical HTTP header for PDFs)
- developers.google.com (X-Robots-Tag for non-HTML)
- developers.google.com (temporary = show source URL)
- Cedwyn live audit 30 Oct 07:27Z (curl -IL, pdfinfo, pdftotext, /URI scan)
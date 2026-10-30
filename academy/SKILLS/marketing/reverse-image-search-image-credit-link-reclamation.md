# Reverse image search: find who reuses our images, then ask for a credit link

Topic: image link reclamation (SEO / PR monitoring). Harvested 2026-10-30. Checked first: 0 skill files mention TinEye, "reverse image" or "image reuse"; the existing link-reclamation file covers dead URLs and unlinked *text* mentions, not pictures. `google-images-lens-archive-photos.md` covers getting OUR images found in Google Images. This file covers the opposite job: finding OTHER sites using our images.

## What the sources say (read 30 Oct 2026)
- **TinEye help (read):** free use is **non-commercial only**, capped at **100 searches/day and 300/week**. Commercial use needs the paid API, and a third-party review gives "$200 for 5,000 searches" (snippet, not checked). Cedwyn sells e-books, so treat TinEye as off-limits for routine work. Use Google Lens and Bing Visual Search by hand instead.
- **Neil Patel, "How to Use Reverse Image Search to Build 26% More Backlinks" (read, 2017, updated Jul 2026):** the method is to search your own images, open each page that uses one, and check for a real link, since "they technically credited me, but they didn't give a direct link". Watch for chains too: a site credits the image to a reposter (Infographicdesignteam -> Leadgenius JPG -> ColourGraphics, the real origin), and the origin should ask for the link. **The "26%" appears only in the title.** The body gives no study and no count, so never quote it.
- **Search Engine Journal (read):** "very few" of the many sites using Brian Dean's graphs credited him "properly with a backlink or image source". This is a description only, with no count.
- **editorial.link 2026 guide (read):** Google's and Bing's reverse search "aren't always reliable" because many results only look similar. Check every match by hand.
- **Pixsy press page (snippet, vendor):** "85% of images uploaded to the web are used without permission". This is marketing from a company that sells enforcement, so don't quote it.
- **BuzzStream State of Digital PR 2026 (read):** 55.4% of PRs follow up once and 33.1% twice. BuzzStream's own study found the reply rate "drops sharply" from one follow-up to two, so its advice is a single follow-up. Reboot Online (read): 92% of pitches are 300 words or fewer, and 54% follow up after 3–6 days.

**Honest gap:** I found no published case study with a real count of credit requests sent and links won. Treat our own log as the evidence.

## How to do it
1. **Pick the images worth checking (10–20 a month):** the og/share cards, the hologram tiles, the tithe-map and archive scans we restored or made, the e-book covers, and quote cards. Skip raw public-domain scans that we didn't transform, because we have no claim to credit for those.
2. **Search by hand:** use Google Lens ("Find image source", then the **Exact matches** tab), then Bing Visual Search ("Pages with this image"). Never script Google. Put the candidate URLs in a text file.
3. **Verify with the tool** (no install; requests + Pillow are already on the box):
   `timeout -k 5 120 python3 tools/image_credit_check.py OUR.jpg URL1 URL2 ... --csv a temporary folder/credit.csv`
   It compares a 64-bit dHash, so a resized copy re-saved at q55 scores 1 and a 5% crop scores 7. The default threshold is 10. Verdicts:
   - `CREDITED_LINK`: done.
   - `CREDIT_TEXT_ONLY`: ask them to turn the credit into a link.
   - `NO_CREDIT`: ask for a credit plus a link.
   - `NOT_FOUND`: a false positive from the search engine.

   It also reports whether the image itself is wrapped in a link to us.
4. **Triage before writing anything:**
   - Skip personal blogs, forums and social posts.
   - Prioritise councils, schools, libraries, heritage and history societies, local press and Welsh/Argentine community sites. These are the links that also help AI-answer citations.
   - Never send legal threats or DMCA notices for a credit request. The aim is goodwill and a link.
5. **The request, as a HubSpot draft only:** 4–6 lines and under 120 words.
   - Thank them for using the picture.
   - Give the exact page where the original lives (the evidence or record page, not the homepage).
   - Offer a credit line ready to paste: `Image: Cedwyn archive (cedwyn.bucklerfamily.estate/...)`.
   - Offer a higher-resolution copy.
   - Allow one follow-up after 5–7 days, only if it adds something new (for example the original date or a better scan), then stop.
6. **Log it** in `the project workspace`: image, page, verdict, date drafted, sent-by-the project lead date, outcome. Re-run the tool 30 days after a send to confirm the link.

## How we apply it to Cedwyn
- **Monthly pass:** 15 images through Lens/Bing by hand, then the tool. Create one HubSpot task `[BIZDEV] Image credit requests <month>` with the drafts inside.
- **Public-text rules apply to the credit line:** never name the project lead, avoid the banned words, and point to the catalogued evidence page.
- **Make future copies credit us automatically:**
  - Keep the visible caption credit line on every image page.
  - Keep the ImageObject `creditText`/`copyrightNotice` (see `google-images-licensable-badge-image-metadata-gallery.md`).
  - Put a small corner mark on share cards only, not on evidence scans.
- **Kill rule:** after 3 monthly passes, stop if fewer than 2 `NO_CREDIT`/`CREDIT_TEXT_ONLY` pages are found at institutions, and fold the work into the quarterly link-reclamation run.

## Sources
- help.tineye.com
- neilpatel.com
- searchenginejournal.com
- editorial.link
- buzzstream.com
- rebootonline.com
- Pixsy press page (snippet only, vendor claim, not quoted)
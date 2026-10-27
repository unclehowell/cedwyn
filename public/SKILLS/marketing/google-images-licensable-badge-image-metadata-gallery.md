# Google Images "Licensable" badge and image credit metadata for an art gallery

Date: 2026-10-27 · Harvest run · Status: how-to + Cedwyn PROPOSAL (nothing changed on the site)

## What it is
Google Images can show a **"Licensable"** badge on an image thumbnail. Clicking the image shows the creator, credit and copyright, plus links to the licence and to a "how to get this image" page. Searchers can also filter Google Images by usage rights (Creative Commons vs "Commercial and other licences"). It launched 31 Aug 2020 and is still documented by Google today, in every region and language where Search runs.

## The rules (Google Search Central, "Image metadata", read 27 Oct 2026)
- Two ways in; **either one is enough**:
  1. **Structured data** on the page: a JSON-LD `ImageObject` per image, per page it appears on.
  2. **IPTC photo metadata** embedded in the image file (it goes wherever the file is copied).
  If the two conflict, Google uses the structured data.
- Required: `contentUrl` (the exact image URL) plus at least one of `creator`, `creditText`, `copyrightNotice`, `license`.
- **For the badge, structured data must include `license`** (a URL to the terms page; a Creative Commons URL also works). Google recommends `acquireLicensePage` too: a checkout page for the image, or simply a page explaining how to contact you.
- IPTC equivalents: Web Statement of Rights = `license`; Licensor URL = `acquireLicensePage`; plus Creator, Credit Line, Copyright Notice.
- Pages must be public, crawlable (not blocked by robots.txt or noindex) and in a sitemap. Test with the Rich Results Test and URL Inspection. Expect days before it shows.

## The trap: CDNs strip embedded metadata
- **Cloudflare Image transformations:** for WebP and PNG output, "all metadata will always be discarded". Only JPEG output can keep it, via the `metadata` parameter.
- **Cloudflare Polish:** Lossless and Lossy both "remove metadata". Cloudflare also states it can't guarantee stripping everything.
- So on a Cloudflare-served site, **put the licence in JSON-LD on the page**. It survives any image optimisation. IPTC in the file is a bonus for copies that travel off-site.

## Testimony
- **IPTC (Michael Steidl, Photo Metadata Working Group lead):** when an image carrying IPTC metadata is reused on another popular site, Google Images "will now direct an interested user back to the supplier of the image" (Google blog, Aug 2020).
- **Industry partners quoted at launch:** Getty, Shutterstock (more than 1 million contributors), Alamy, EyeEm, PhotoShelter, DMLA. PhotoShelter's CEO: it will "drive discovery opportunities for all agencies and independent photographers".
- **ASMP (photographers' association, Oct 2020):** the metadata stays with the image when it is republished elsewhere, so the badge shows there too and points people back to the owner. It educates image users rather than preventing theft.
- **Marco Secchi (photographer, Substack, Apr 2024):** "won't stop image theft", but it is a tool for "visibility, education, and monetisation".
- **Missing:** no published click-through or sales uplift from the badge was found. Treat the benefit as visibility and attribution, not a measured revenue lift.

## How to do it (checklist)
1. Write one public **image licence page**, e.g. `/nft-art/licence/`. Say plainly what is allowed: personal viewing and sharing with credit, yes; commercial use, ask. Set the credit line too.
2. Write one **"how to get this image" page** (acquireLicensePage). Before a sale exists, this can be the piece's own page with its "Coming soon" status and a contact or sign-up route.
3. On each piece's page, put one `ImageObject` in JSON-LD:
   - `contentUrl` = the exact URL the `<img>` tag uses (same host, same query string);
   - `license`, `acquireLicensePage`, `creditText`, `copyrightNotice`, and `creator` (an Organization);
   - `name` and `description` optional.
   Also print the same credit and licence links visibly on the page, as Google's own example does.
4. Use stable image URLs. A changed URL is a new image to Google.
5. Make sure the image URLs are in the sitemap (an image sitemap, or `<image:image>` entries), and that `robots.txt` doesn't block the image path.
6. Validate 3 pages in the Rich Results Test ("Image metadata" detected, 0 errors). After a week, run `site:` searches in Google Images and check whether the badge appears.
7. Optionally embed IPTC in master JPEGs (exiftool: `-XMP-xmpRights:WebStatement=`, `-XMP-plus:LicensorURL=`, `-IPTC:CopyrightNotice=`, `-IPTC:Credit=`). Not installed: the disk is under 2 GB free.

## How we apply it to Cedwyn (PROPOSED, for the site and onpage workers)
- **Checked 06:23 GMT, 27 Oct:** the static HTML of `cedwyn.bucklerfamily.estate (cache-busted) contains no `ImageObject` and no licence text, and no image URLs appear in the static HTML (they are probably inserted by script). Google can render script, but the JSON-LD should sit in the static HTML of each piece's page.
- **Target:** the Garden Gallery pieces NFA-0001, NFA-0011 and NFA-0013 to NFA-0158, at their v0.0.2 images once the restored renders land.
- **Credit:** `creditText` "Cedwyn Garden Gallery · Tŷ Mawr series"; `creator` = Organization "Cedwyn". **Never a personal name** (editorial rule: never name the project lead). `copyrightNotice` "© Cedwyn 2026".
- **AI pieces:** the pieces are AI-assisted. Their copyright position was not checked (UK law on computer-generated works is under review), so the licence page should state terms of use, not a strong ownership claim.
  - Pair this with `ai-image-labels-disclosure-engagement-meta-youtube.md`: if IPTC is ever embedded, set Digital Source Type to the AI value the IPTC vocabulary defines (the exact code was not checked in this run), so the files are honest wherever they travel.
- **acquireLicensePage:** point at the piece's own page while NFTs are "Coming soon". No Stripe link, no price, and no outbound links.
- **Implementation:** one build-step template change on the nft-art branch (head only), coordinated with the semver and share-card work. Measure in Search Console under Search type = Image (impressions and clicks for `/nft-art/`), week on week, in the Sunday growth report.

## Sources
- Google Search Central, Image metadata: developers.google.com (read 27 Oct 2026)
- Google Search Central blog, Aug 2020 launch with partner quotes: developers.google.com
- IPTC announcement: iptc.org (title and snippet only)
- ASMP, 21 Oct 2020: asmp.org
- Marco Secchi, Apr 2024 (paywalled; intro read): marcosecchi.substack.com
- Cloudflare, Transform via URL, `metadata` parameter: developers.cloudflare.com
- Cloudflare, Polish compression: developers.cloudflare.com
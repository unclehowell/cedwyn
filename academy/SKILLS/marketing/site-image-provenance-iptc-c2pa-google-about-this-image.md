# Image provenance on our own site: IPTC DigitalSourceType + Content Credentials (C2PA) for Google "About this image"

Written 30 Oct 2026 by the skills harvest. Root suggested it. Already in the index: social-side AI labels (Meta "AI info", YouTube "AI use") in ai-image-labels-disclosure-engagement-meta-youtube.md. This file covers the other half: images served from our own pages and what Google Images / Lens / Circle to Search show about them.

## What the primary sources say (all read today)
- **Google Search Central, Image metadata** (developers.google.com): Google extracts IPTC photo metadata from the image file. "Digital Source Type" is a recommended property. Google supports four AI values: `trainedAlgorithmicMedia` (made by a generative model), `compositeSynthetic`, `algorithmicMedia`, and `compositeWithTrainedAlgorithmicMedia` (inpainting/outpainting). Either structured data or IPTC is enough for Licensable-badge eligibility. Embedded IPTC goes with the file.
- **Google, 17 Sep 2024** (blog.google, Laurie Richardson, VP Trust & Safety): when an image carries C2PA metadata, "About this image" will show whether it was created or edited with AI tools. "About this image" is in Google Images, Lens and Circle to Search. Validation is against the C2PA trust list. Ads are starting to use C2PA signals for policy enforcement.
- **Cloudflare Images docs** (preserve-content-credentials, updated 26 May 2026): Cloudflare's transformations **strip metadata unless "Preserve Content Credentials" is switched on** (Images > Transformations per zone; hosted images: Delivery tab). Cloudflare Polish and resizing pipelines are the usual place where a manifest disappears.
- **Practitioner walk-through** (tech-insider.org "C2PA labels for AI images, 12 steps [2026]", read): "This is where most labeling efforts quietly fail": any non-C2PA-aware editor, format conversion or batch compressor drops the manifest. Test by comparing `c2patool file --info` before and after export. Also from that piece: OpenAI images have carried SynthID alongside C2PA since 19 May 2026, and Google counts 180 bn+ watermarked images and videos. SynthID survives screenshots, metadata does not. Those two figures are the article's and were not checked against Google's or OpenAI's own pages.
- **Open-source signer:** c2patool (CAI open-source SDK, opensource.contentauthenticity.org). It's free, but a self-signed certificate is **not on the C2PA trust list**, so Google may not show it as validated. IPTC DigitalSourceType needs no certificate.

## Live baseline, 30 Oct 2026 (our own tool, read-only)
`skills/tools/img_provenance_audit.py cedwyn.bucklerfamily.estate checked the home share card (share-home-*.jpg, 172 KB), the two tile images and five holo-ghf1 thumbnails: **0 of 8 carry XMP, IPTC DigitalSourceType, C2PA or EXIF.** The build strips everything, so Google sees no provenance at all on our images. The Kissed Frogs frog is an SVG. SVG has no IPTC/C2PA route, so its disclosure goes in the caption/alt or the image-metadata JSON-LD.

## How to do it (smallest steps, cheapest first)
1. **Inventory.** List every raster image in the per-webapp view databases with a field `source`: `archive-scan` | `photo` | `ai-generated` | `ai-edited` | `composite`. Real archive scans and photos must never be tagged AI. AI reconstructions (movie stills, illustrations, share cards made with a model) must be.
2. **Write IPTC DigitalSourceType into the file at build time**, after resizing and as the last step, so nothing strips it afterwards. Values: `ai-generated` -> `cv.iptc.org `ai-edited`/inpainted archive -> `compositeWithTrainedAlgorithmicMedia`; `composite` -> `compositeSynthetic`. Add Creator, Credit Line and Copyright Notice using the estate/project name only, never a person.
   - **Free tools:** exiftool (Perl, ~10 MB) or Pillow, both carrying XMP. **Not installed today** (disk 2.3 GB, root said install nothing). The build runner on GitHub Actions can apt-get exiftool at no cost to this box.
3. **Mirror it in page markup.** ImageObject JSON-LD with `creator`, `creditText`, `copyrightNotice`, plus a visible caption line on AI images ("AI reconstruction"). This fits the EU AI Act Art. 50 "unobtrusive disclosure" already in the social skill.
4. **If images go through Cloudflare Images/Polish,** switch on Preserve Content Credentials. Otherwise make sure the metadata write is the last step after any optimiser. Re-run the audit tool after each build: `digital_source_type` must be non-null on every AI image.
5. **C2PA signing (optional, later).** Generators that already embed C2PA (OpenAI, Adobe Firefly, Google) only need the pipeline to stop stripping it. Self-signing with c2patool proves nothing to Google (not on the trust list), so skip it unless a trusted certificate becomes available free.
6. **Check:** Google Images -> the image -> three dots -> "About this image". It only appears once the image is indexed. Note the date in the check log.

## Why it matters (sales and trust)
- The site is evidence-led. One AI reconstruction mistaken for an archive photo would undermine every real scan. Labelling the reconstructions makes the real scans more believable, not less.
- Google Ads and Merchant Center (support.google.com) ask for AI images' IPTC codes to be preserved. If we ever advertise or list the e-books in Shopping, the files are ready.
- No numbers on traffic effect: no practitioner source measured a ranking or CTR change from IPTC/C2PA. Treat it as trust and compliance, not an SEO lever.

## How we apply it to Cedwyn
- **PROPOSAL for the architecture programme** (it owns main/data/core today; no commits from here): add `source` to the central catalogue's image records, write IPTC DigitalSourceType in the shared renderer's build step (exiftool on the Actions runner), and add ImageObject JSON-LD plus a caption on AI images. Kissed Frogs frog SVG: alt/caption "illustration". Movie stills on /movie/ = trainedAlgorithmicMedia.
- Never tag archive scans (EV- records, plans, deeds) as AI. Inpainted or restored scans = compositeWithTrainedAlgorithmicMedia, with a caption.
- Monday visibility check: run `img_provenance_audit.py` on /, /movie/, /kissed-frogs/ and /ebooks/, and log the count of AI images missing DigitalSourceType (target 0).
- Public wording: neutral ("AI reconstruction", "illustration"), never names a person, no banned words.

## Sources
- developers.google.com
- blog.google
- developers.cloudflare.com
- tech-insider.org
- opensource.contentauthenticity.org
- support.google.com
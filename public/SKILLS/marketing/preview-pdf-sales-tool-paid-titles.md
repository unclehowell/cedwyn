# Preview PDF as a sales tool (paid-title previews on /ebooks/)
Harvested 27 Oct 2026. Companion to ebook-back-matter-one-next-step.md (that file covers the END of free books; this one covers the free PREVIEW of a paid title: how it is offered, captured and closed).

## Practitioner evidence (numbers)
- Nathan Barry (self-published author of Authority / Designing Web Apps; founder of ConvertKit, now Kit), "Driving ongoing book sales with a sample chapter", 25 Sep 2013 (read 27 Oct 2026; old but first-hand):
  - Sample = one chapter (or best sections) + a personal note + the FULL table of contents + a last page "if you enjoyed this, buy the full book" with a link to the sales page. "A sales tool wherever it gets passed around the web."
  - Swapping a text link for an open-book graphic of the sample "can double the number of downloads".
  - Offer "email it to me" beside the direct download: 1,000+ subscribers in 3-4 months from book pages.
  - Opt-in rate 5.2% (Authority, form tied directly to the sample) vs 2.4% (Designing Web Apps, form and sample looked like separate elements).
  - 94% left the "free 30-day course" box ticked; first follow-up email 2 days after download reminds them to read the sample; 5-8 emails over 30 days, soft sell in P.S., one dedicated hard-sell email.
- Written Word Media 2026 Reader Survey (3,500+ readers, published 2 Feb 2026, read): email newsletters are a top discovery channel, ahead of social media and bookstores (self-reported, skews to bargain e-book readers). Supports capturing an email at the preview, not only a download.

## How to do it
1. Each preview PDF: page 1 title + one-line note; page 2 full contents of the PAID edition (so readers see what they are missing); the sample; LAST page = one next step: "The full edition continues with ... £X at <shop URL>?utm_source=preview-pdf&utm_medium=pdf&utm_campaign=<book>" as a clickable link AND printed URL (PDFs get printed/forwarded).
2. Every page footer: short shop URL (survives a forwarded single page).
3. On the shop page: show the preview as a visual (cover/open-book thumbnail with "Read the opening, 20 pages"), not only a text row.
4. Put an "email me the preview" field directly under that visual (same box), with the direct download still available. Consent wording per the existing Mailchimp/PECR files.
5. Follow-up: day 2 "did you get to page 7?" reminder with one highlight; then the existing welcome sequence (welcome-sequence-first-sale-small-ebook-list.md). One dedicated offer email; no fake deadlines (uk-dmcc-act-urgency-reviews-price-copy.md).
6. Measure per book: preview downloads, email opt-ins / preview views, purchases with utm_source=preview-pdf. Change one thing at a time; read after 14 days.

## How we apply it to Cedwyn (checked 27 Oct 2026, read-only)
- /ebooks/ offers 9 free PDFs. I opened each (except the 2,033-page wiki dump) and searched text and link annotations:
  - NO link to /ebooks/ and no buy wording in 5 of them: all four '-preview' files plus the cedwyn PDF (32 pp; whether it previews a paid title not checked): [address kept in the project workspace] (24 pp), [address kept in the project workspace] (20 pp), [address kept in the project workspace] (13 pp), [address kept in the project workspace] (14 pp). Their links point to source sites and old subdomains (fcg.bucklerfamily.estate, dartboard., projects., greathousefarmwiki.wordpress.com) instead. fcg page 20 has no extractable text (blank or image; not checked visually).
  - Present in 3: [address kept in the project workspace], [address kept in the project workspace], [address kept in the project workspace] (these already carry a /ebooks link and buy wording).
- So a reader who finishes a preview, or receives one forwarded, has no route to buy the edition it previews. This is the cheapest fix in the funnel.
- PROPOSED fix (owned by the e-book build / funnel workers; queue in the project workspace, do not commit here): in the preview build, append one last page per language (en/cy/es) naming what the full edition adds (from its real contents), the price as listed on /ebooks/, and the /ebooks/ link with utm_source=preview-pdf&utm_campaign=<book>; add a footer shop URL; add the paid edition's full contents as page 2. Copy rules: never name the project lead; banned words (states, assertions, per, second-hand report, not checked, reported, deception, taken) are not allowed in public copy, so the fcg book's own title stays as it is but the new page must not add them; "our case, prospective, not a finding of any court" line stays.
- The /ebooks/ page already has an email-confirm path that delivers the first chapter ("Read the free first chapter"); check that its form sits directly beside each preview visual (Barry's 5.2% vs 2.4%) when the next CRO pass runs (not checked on mobile today).
- Old-subdomain links inside previews: point them to the Cedwyn equivalents when the build is next touched (keeps readers on the site that sells).
- Measure monthly in the project workspace: downloads per preview (Cloudflare /ebooks/api/free hits), opt-ins, utm_source=preview-pdf purchases (Stripe/Gumroad metadata).

## Sources
- nathanbarry.com (Nathan Barry, 25 Sep 2013; 2x downloads with visual; 5.2% vs 2.4% opt-in; 1,000+ subscribers in 3-4 months; 94% kept course box)
- writtenwordmedia.com (2 Feb 2026, 3,500+ readers; newsletters a top discovery channel)
- Live check of cedwyn.bucklerfamily.estate free PDFs with pypdf, 27 Oct 2026 ~00:30 UTC
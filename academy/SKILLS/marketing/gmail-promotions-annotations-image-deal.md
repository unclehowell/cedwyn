# Gmail Promotions tab annotations: image preview, deal badge, deal card

What it is: JSON-LD (or Microdata) in the email `<head>` that lets Gmail show a promotion before the email is opened: a single image preview, a product carousel (up to 10 images), a deal badge next to the subject line, or a deal card with code and end date. Gmail-only, Promotions tab only, free.

## What the sources show (read 26 Oct 2026)
- **Google Developers, "Annotate emails in the Promotions tab"** (last updated 8 Sep 2026, read). Types: single image preview, product carousel (PromotionCard, max 10, each image unique, same aspect ratio), deal annotation (DiscountOffer: at least one of `description`, `discountCode`, `availabilityEnds`; `availabilityStarts` highly recommended; ISO 8601 dates), deal card. Image: PNG or JPEG; single preview aspect 1.91:1; carousel 4:5, 1:1 or 1.91:1. Google's own caveat: "quality filters and frequency limits" decide display, so not every recipient sees it. Support address on the page: [address kept in the project workspace] A Preview annotations page and Best Practices/FAQ sit beside it.
- **Validity, "Gmail Annotations in 2025"** (read, deliverability vendor). Big brands (Sephora, Domino's, Ubisoft) use them; more ESPs support them in templates; display is inconsistent, so treat as "nice-to-have". Mentions an application step with Gmail and no display guarantee (whether registration is still required in 2026 is not checked against Google's current pages).
- **Stripo, "Outdated relic or untapped opportunity?"** (read, ESP vendor). About 68% of Gmail users use the Promotions tab, about 45% check it daily, about 20% never do (source of the survey not checked). Their table puts annotation CTR lift at about +15-25% (2024) and +20% (2018) - vendor figures, not checked. Since 2024 Gmail also auto-extracts deals/images from email content without markup, and that can override manual markup.
- No small-sender case study with numbers was found. Treat any lift as something we measure, not something we expect.

## How to do it (Mailchimp, zero cost)
1. Only for emails that really are promotional and already land in Promotions (a newsletter with a genuine offer). Don't add it to plain letters or reader replies: those should aim for Primary.
2. Mailchimp: use a custom-code (HTML) template or the code block in the classic builder, and put the `<script type="application/ld+json">` in `<head>`. Send a test to a Gmail address and check view-source in Gmail ("Show original") that the script survived. If Mailchimp strips it, use the Microdata form (meta tags) instead.
3. Single image preview for an e-book: one 1.91:1 JPEG (e.g. 1200x628) of the cover on a plain background, `url` = the /ebooks/ book page with UTM (`utm_source=mailchimp&utm_medium=email&utm_campaign=<name>&utm_content=gmail_annotation`), `headline` = book title.
4. Deal badge only when a real offer exists: `description` = the true offer ("Free first edition", "Bundle £31.99"); `availabilityEnds` = the real end. Never invent a code, a "was" price or a deadline (UK DMCC Act, banned practice 7 - see welcome-sequence and black-friday skills).
5. Preview with Google's preview tool (Preview annotations page) before sending. Keep the brand sender name and from-address constant: Gmail ties trust to the sender.
6. Measure: in Mailchimp, clicks on the UTM-tagged annotation URL vs body links; in GA4/Cloudflare, sessions with `utm_content=gmail_annotation`. Judge after 3 sends, not 1. Gmail auto-extraction may show something anyway, so also look at the email in a Gmail Promotions tab yourself.

## Example (single image preview)
```html
<script type="application/ld+json">
[{"@context":"schema.org
  "image":"cedwyn.bucklerfamily.estate-1200x628.jpg",
  "url":"cedwyn.bucklerfamily.estate&utm_content=gmail_annotation",
  "headline":"<Book title>"}]
</script>
```

## How we apply it to Cedwyn
- Today the list is small and sales are 0, so the value is one more visible, tappable cover for the Gmail share of subscribers - cheap to add, worth testing.
- PROPOSAL (needs the owner's GO, because it changes the email template used for campaigns): add a 1.91:1 cover image preview to the next Mailchimp campaign that already carries a real offer; deal badge only for the genuine free first edition or the listed bundle price. No new email journey, no price change.
- Prep that needs no GO: make 1200x628 cover JPEGs per book in work/ (do not commit to the cedwyn repo while the migration worker owns it), and note the annotation UTM in utm-discipline-ga4-funnel.md's naming list.
- Re-check Google's page for a registration requirement before the first send (not checked today).

## Sources
- developers.google.com (read; updated 2026-09-08)
- developers.google.com (preview tool page)
- validity.com (read)
- stripo.email (read; vendor figures not checked)
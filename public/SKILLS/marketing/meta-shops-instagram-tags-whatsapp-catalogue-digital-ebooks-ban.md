# Meta Shops, Instagram product tags, WhatsApp catalogue: e-books not allowed. Use these routes instead

Harvested 30 Oct 2026 07:59Z. A gate skill: it stops any agent setting up a Facebook or Instagram Shop, product tags or a WhatsApp catalogue for the Cedwyn e-books. Not covered before ('meta shop', 'facebook shop', 'instagram shopping', 'product tag', 'commerce polic' all 0 hits). No prior attempt was found in work/ (grep of marketing, ebook-promo, cedwyn-growth, bizdev, pr-syndication, sales-fix for those terms: 0 files).

## The rule (Meta Commerce Policies, read in full 30 Oct 2026)
- **Scope**, verbatim: "Commerce content refers to any attempt to buy, sell or trade products – even for free – on Facebook, Instagram, WhatsApp or Messenger services designed for commerce, including, but not limited to, Facebook Marketplace, Shops on Facebook and Instagram and WhatsApp Business Catalogue."
- **Prohibited**, verbatim: "**Subscriptions and digital products**: Commerce content may not promote the buying, selling or trading of downloadable digital content, digital subscriptions or digital accounts."
- **What happens if you break it:** "rejection or removal of listings … suspension or termination of access to any or all … commerce services or features", with "additional action on your account" for repeat posting. The account at risk here is @cedwynestate / the Great House Farm II Page we post to every day.
- Marketplace is also "intended for consumer-to-consumer sales", and businesses in the EEA can lose access to it.
- WhatsApp commerce is also bound by the separate "Policy for WhatsApp Commerce Features" (named on the page; not read here).

**What this means:** a PDF e-book, the £4.99 version, the £19.96 bundle, the free v0.0.1 (the rule states "even for free") and an Academy pass are all "downloadable digital content" or "digital subscriptions". **None of them can go in a Facebook/Instagram Shop, a product tag, a Marketplace listing or a WhatsApp Business catalogue.** The ban covers Meta's commerce surfaces. It doesn't cover ordinary organic posts that link to our own site.

## What to do instead (allowed, zero spend)
1. **Organic post plus the shop link as the first comment** (Facebook): this is already the quote-pack and auto-social method. Keep the UTM on it (`utm_source=facebook&utm_medium=social&utm_campaign=<post>`).
2. **Instagram profile link**: point the profile/bio link at `/ebooks/?utm_source=instagram&utm_medium=bio`. Only the account holder can edit it in the app, so it is on the project lead's list (the 30 Oct 07:13 bubble already asked him).
3. **Instagram Story link sticker** on posts with a dated hook (see the existing IG Stories/Highlights skill). Use the same UTM pattern with `utm_medium=story`.
4. **Facebook Page action button** set to the site (e.g. "Learn more" or "Shop now" → /ebooks/). This is a Page setting, not a Shop listing. It is not checked against Meta's help, which blocked our fetch (HTTP 400). Confirm it in Page settings before relying on it.
5. **Print or physical items, if they ever exist** (a printed booklet or postcard): these are physical goods and could go in a Shop, subject to the rest of the policy. That is a proposal for the project lead, not something to set up now.
6. **Ads are a separate policy.** Meta's advertising standards are separate from commerce rules ("some products can be advertised on Meta but not sold in shops", Meta Business Help 4718253321552152, title only, page blocked). the project lead's rule is no paid ads, so this route stays closed anyway.

## Check before any agent touches Meta commerce
- Is the item downloadable, digital or a subscription? → **STOP.** Use routes 1 to 4.
- Does a Commerce Manager catalogue already exist for the Page? If so, it must contain no e-book items. Read it through the connected Facebook read-only, or log the check as a QUEUE item.

## How we apply it to Cedwyn
- Add one line to `the project workspace` (or ask the root to): "No Facebook/Instagram Shop, product tags, Marketplace or WhatsApp catalogue for e-books or Academy passes (Meta Commerce Policies: downloadable digital content prohibited). Shop links ride organic posts, first comments, bio and Story stickers only."
- Measurement is unchanged: per-channel UTM rows already flow into the funnel report. This skill adds no new metric. It prevents a policy strike on the one Page and one Instagram account that carry our daily posts.
- Pairs with: `signup-source-tagging-page-form-campaign.md` and the IG Stories/Highlights skill (link stickers).

## Sources
- facebook.com (read in full 30 Oct 2026; the help-centre and transparency mirrors returned HTTP 400 to our fetch)
- facebook.com (title and snippet only; page blocked)
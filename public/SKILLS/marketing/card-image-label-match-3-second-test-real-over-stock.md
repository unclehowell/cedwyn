# Card images must show what the card states (image-label match for heritage/tour/shop cards)

Skill harvested 2026-10-31 ~21:12Z. Topic: CRO / page design; image choice on cards, tiles and listings.

## The evidence
- NN/g eyetracking ("Photos as Web Content", Jakob Nielsen; read 31 Oct 2026): "a dramatic gap in how users approach website images: Some types of pictures are completely ignored. This is typically the case for big feel-good images that are purely decorative. Other types of pictures are treated as important content and scrutinized. Photos of products and real people (as opposed to stock photos of models) often fall into this category." Information-carrying images get looked at; filler gets skipped.
- NN/g "7 Tips for Memorable and Easy-to-Understand Imagery": tip 2, avoid stock photos - generic, not specific to your content, reused by others (snippet read).
- MarketingExperiments/MECLABS test (2011, debt-counselling homepage banner): real person vs top stock photo -> visitors who saw the real person were 35% more likely to sign up (figure as reported by CXL; ME blog post read, it reports the test; the 35% is CXL's number, not re-derived).
- Wingify/VWO case (Jason Thompson, blog contact section): own photo vs generic icon -> 48% more conversions, reported statistically significant (read).
- ConversionSciences (snippet only, not fetched): switching stock shots to real crew/equipment photos lifted lead sign-ups 45%.
Read across: a card image is a promise of what is behind the click. A mismatch (stables on a B&B card) wastes the only glance a mobile visitor gives and erodes trust in the rest.

## The 3-second card test (run on every card, at 390 px)
Cover the title. Show only the image to someone (or describe it in five words yourself). If those five words don't name the card's offer, the image fails.
| Card states | Image must show at a glance | Fails |
|---|---|---|
| B&B / stay | guest bedroom, breakfast table, house exterior with door/windows | stables, landscape, horse |
| Riding / estancia ride | horse + rider in landscape | empty field, building |
| Museum / archive | object, document, display case, reading room | generic landscape |
| E-book | the cover, ideally on a device/page spread | a random period photo |
| Tour / walk | people walking the place, path, signpost | close-up artefact |
| Event / date | the event happening, or the place set for it | a logo |

## How-to
1. Inventory: list card title -> image file -> five-word description of what the image shows (look at each image; filenames lie).
2. Score each: MATCH / WEAK (related but not the offer) / MISMATCH.
3. Fix order: MISMATCH first, then WEAK on the highest-traffic page.
4. Source order: (a) a real photo of the actual place/thing (best; real beat stock/generic in the 35%/48% tests; real vs AI-generated was not tested in any source read); (b) best-matching image already in the library; (c) generated image that depicts the offer specifically, labelled per the AI-image skill (ai-image-labels-disclosure-engagement-meta-youtube.md), no real-family likeness; (d) never stock models.
5. One image, one idea: no collage on a card; crop so the subject fills the 4:3 or 16:9 frame at 390 px (a bed at thumbnail size must still read as a bed).
6. Alt text = what the image shows AND ties to the card ("Guest bedroom at the estancia B&B"), not the filename or the card title repeated.
7. Don't reuse the same image on two cards with different offers - the second card then promises the wrong thing.
8. Measure: card click-through (clicks / card views) before and after; with low traffic, treat it as a hygiene fix rather than an A/B test (see small-traffic testing skills in INDEX).
9. Re-check each cycle: when a card's title or offer changes, its image is re-checked in the same commit.

## How we apply it to Cedwyn (PROPOSED - no runner, schedule or send route changed)
- Patagonia/Argentina cards (a worker is fixing tonight): add the 3-second test + MATCH/WEAK/MISMATCH table to its report and keep it as a reusable checklist file for later passes; the project lead expects several cycles (HubSpot task asked for at 20:52).
- Ask once (via the root, when convenient) for real photos of the B&B/estancia: real images are the strongest option in every test above; generated images are a stopgap.
- Extend to /shop/, /ebooks/ (cover on the card, never a landscape), /movie/ door cards (a frame from that door's film), /learn/ academy cards.
- Add an "image matches card" line to the daily site flywheel's 390 px check and to the onpage flywheel audit (proposal only).
- Reuse audit: grep the repo for image paths used by more than one card with different titles.

## Sources
- nngroup.com (read 2026-10-31)
- nngroup.com (snippet)
- marketingexperiments.com (read; 2011 test)
- cxl.com (read; reports the 35%)
- wingify.com (read; 48%)
- conversionsciences.com (snippet only; 45% not checked)
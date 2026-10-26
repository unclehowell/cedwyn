# Google Maps and Business Profile for a demolished heritage site and an online archive (what's allowed)
Harvested 2026-10-26 (skills harvest). Topic: local search / Maps visibility for heritage places; Google Business Profile (GBP) eligibility.

## What the rules say (primary)
- **GBP eligibility (Google Business Profile policies).** "To qualify for a Business Profile on Google, a business must make **in-person contact with customers during its stated hours**." Explicitly not eligible: "Brands, organisations, artists and other **online-only businesses**"; an ongoing service at a location you don't own or have authority to represent; rental/for-sale properties. "If we determine that your business doesn't exist in the location that you claim, Google will disable your profile." PO boxes are suspended. Google may reject significant identity edits (name/category).
- **Address rule (GBP guidelines).** Profile must be for the actual real-world location; remote mailboxes not acceptable.
- **UK heritage practice (Digital Culture Network, Arts Council England, "How to use Google Business Profile - 2026 Guide").** To qualify you need to be a bricks-and-mortar venue (gallery, venue) or a service operating in an area (touring company). Verification now often needs a video showing signage, the premises being unlocked and branded materials.
- **Maps contributions (Google Maps Help).** Anyone can "Add a missing place" (landmarks included) and contribute photos/reviews to existing places; places show publicly once added. Adding a place that no longer physically exists is not a landmark - it falls under "doesn't exist" and gets removed.

## What this means (the honest read)
- **Cedwyn is not eligible for a Business Profile**: it is an online archive/e-book shop with no premises open to the public. Creating one (e.g. at a home address or the former farm site) risks suspension and reads as misrepresentation - bad optics for a project whose case rests on accurate records.
- **Tŷ Mawr itself can't be a Maps place**: demolished 1988; the site is now housing. A "Tŷ Mawr" pin would describe something not there.
- If the project ever runs **in-person heritage walks** at set times with a meeting point, a *service-area* profile becomes possible (no home address shown) - only then, and only with the project lead's go-ahead.

## What to do instead (free, allowed)
1. **Own-site place markup**: on the Tŷ Mawr / Llandough-juxta-Penarth hub page add JSON-LD `Place` (or `LandmarksOrHistoricalBuildings`) with `geo` coordinates of the former site, `containedInPlace` Llandough (Vale of Glamorgan, CF64), and a clear "demolished 1988" description. This disambiguates from Llandough near Cowbridge (CF71) - the exact mix-up in the OS FOI reply.
2. **Contribute to places that exist**: photos (with captions) of St Dochdwy's church and the Llandough area from our own archive or own photos on their existing Maps listings; caption each with the historical link ("Tŷ Mawr / Great House Farm stood nearby until 1988 - cedwyn archive"). Only images we own the rights to; no links in captions are clickable, so keep it to a name people can search.
3. **Wikidata/Commons** carry the place identity better than Maps for a lost building (see wikimedia-commons-wikidata-heritage-coi.md; COI rules apply).
4. **Local search without GBP**: rank the hub page for "Ty Mawr Llandough", "Great House Farm Llandough Penarth" via the topic-cluster plan and Search Console striking-distance work.

## How we apply it to Cedwyn
- Do **not** create a GBP. Log this decision in the bizdev plan so later runs don't attempt it.
- Add the `Place` JSON-LD (former-site coordinates from our OS County Series evidence, sheet Glamorgan 47 NW) to the Tŷ Mawr hub page - for the sole cedwyn committer; wording: 1824 David Stewart survey = first record mention found; 1667 = the family's acquisition (1974 newspaper reports of Mary Williams' statement; ITV News 1988); no Bute dates as Tŷ Mawr records; never name the project lead.
- Maps photo contributions use a Google account - that's a public post in someone's name, so it waits for the project lead's go-ahead (one line in the next growth report).

## Sources
- support.google.com (Business Profile policies: ineligible businesses)
- support.google.com (guidelines for representing your business)
- digitalculturenetwork.org.uk
- support.google.com (add a missing place)
- schema.org
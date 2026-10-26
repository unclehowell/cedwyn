# Google knowledge panel for a heritage brand: Organization markup, corroboration, then claim

Date: 2026-10-26 (skills harvest 20:52). Topic: brand SERP / entity SEO for a small publisher site.

## What the primary sources show
- **Organization structured data** (Google Search Central; read): put it on the home page (or one About page); **no required properties**, add all that apply; it helps Google disambiguate the organisation and can influence **which logo shows in results and the knowledge panel**. Logo at least **112x112 px**, crawlable, readable on white. sameAs lists the official profiles. Use the most specific subtype (e.g. OnlineStore for a shop).
- **Claiming a panel** (Knowledge Panel Help, "Get verified on Google"; read): only possible once a panel exists. Search the entity, "Claim this knowledge panel", then sign in to one of the listed official profiles (YouTube, Search Console, X, Facebook). Not all panels are claimable; check periodically. Edits go through Feedback with linked evidence; verified owners can add managers/contributors at google.com A Business Profile is a different product (local premises only).
- **Practitioner process** (Jason Barnard / Kalicube, "3-step process"; read): 1) one **Entity Home** page describing the entity plainly; 2) **corroboration** from multiple independent, authoritative sources in the field repeating the same facts; 3) links from those sources back to the Entity Home (a self-confirming loop). Schema is not required but "helps enormously". Timeline: **3 months to 2 years**; wrong facts fed into the Knowledge Graph can take years to fix. Kalicube's 900,000-panel dataset is cited in a video title only (not checked).

## The playbook
1. **Pick the entity and one name.** One brand name, written the same everywhere (site title, social bios, Wikidata label if any).
2. **Entity Home** = the About/home page: first sentence states what it is, where, since when, in plain words.
3. **Organization JSON-LD** on that page: name, url, logo (112x112+ PNG), description, sameAs (only profiles we control and keep active: YouTube, Instagram, Facebook Page, X, TikTok), email (role address, never a home address). No address property for a home-run shop.
4. **Corroborate**: matching descriptions on our own profiles first; then independent listings that already exist or are earned (library catalogue records, heritage directories, press mentions). Never write about ourselves on Wikipedia (see wikimedia-commons-wikidata-heritage-coi.md).
5. **Check monthly**: Google the exact brand name; note whether a panel shows, which logo/description, and whether "Claim this knowledge panel" appears. Log it.
6. **When it appears**: claim via the Search Console or YouTube account we already own; fix wrong facts through Feedback with links.

## How we apply it to Cedwyn
- Read-only check today: the Cedwyn home page carries JSON-LD for Audience and WebPageElement only; **no Organization / OnlineStore block, no sameAs, no logo property** (curl, 26 Oct 20:55). Whether Google shows any panel for the brand name is not checked.
- **Markup fix (fits the ONPAGE run's "markup only" rule, no visible text change):** add one OnlineStore JSON-LD block to the Cedwyn home page with name, url, logo, description, sameAs (active channels only), role email. Hand to the Wednesday CEDWYN ONPAGE run; this worker does not commit (the migration worker owns the repo).
- **PROPOSAL (owner GO):** a plain About/Entity Home paragraph if body text needs to change; any new directory listing or profile (new public presence).
- Never put the owner's name, home address or family holdings in the markup; no banned words in description; none of the barred Bute dates.
- Expect months, not weeks. Judge at 3 and 6 months by the monthly brand-name check.

## Sources
- developers.google.com (read)
- support.google.com (read)
- jasonbarnard.com (read)
- youtube.com (title only, not checked)
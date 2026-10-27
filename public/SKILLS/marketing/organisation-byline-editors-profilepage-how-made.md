# Organisation bylines, an editors' profile page and "how this was made" notes (Google 2026)

Skill harvested 27 Oct 2026. Topic: SEO and AI visibility, trust signals for a site whose people stay unnamed.

## The evidence (read in full unless marked)
- **Google Search Central, "Creating helpful, reliable, people-first content"** (read): the "Who / How / Why" test.
  - **Who:** "Is it self-evident to your visitors who authored your content? Do pages carry a byline, where one might be expected? Do bylines lead to further information about the author or authors involved?"
  - **Deception warning:** "Fabricating creator profiles (such as by using AI-generated headshots, made-up names, or false credentials ...) is a form of deception", and it marks the page as untrustworthy to users and to Google's automated systems.
  - **How:** where automation or AI substantially generates content, ask whether that use is "self-evident to visitors through disclosures".
- **Google, ProfilePage structured data** (read): `ProfilePage` needs one property, `mainEntity`, which is a **Person or Organization**. Recommended properties are `dateCreated` and `dateModified`; inside `mainEntity`, `name`, `alternateName`, `description`, `image`, `sameAs` and `interactionStatistic`. Article and other markup can point their author at a profile page.
- **Google, Article structured data** (snippet): "If the URL is an internal profile page, we recommend marking up that author using profile page structured data."
- **Google, AI-generated content guidance, Feb 2023** (snippet): use accurate bylines "where someone might think, 'Who wrote this?'".
- **Numbers:** I found no primary case study with measured traffic for organisation bylines alone. The "+340%" type assertions (e.g. jasminedirectory) are agency marketing and are not repeated here. This skill rests on Google's own documented criteria, not on a traffic number.

## Playbook
1. **Byline the people honestly.** If a named person can't be shown, byline the organisation, e.g. "Cedwyn editors". Never invent a persona, a headshot or credentials.
2. **Link the byline to a real profile page** at `/editors/`, a page about the editorial group:
   - what it covers;
   - how records are sourced: catalogue IDs, archives and dates;
   - how corrections are made;
   - when it started.
3. **Mark that page up as `ProfilePage`** with `mainEntity` `{"@type":"Organization","name":"Cedwyn editors","url":".../editors/","description":...,"sameAs":[owned channel URLs]}` and `dateModified`.
4. **Point every Article/BlogPosting `author.url` at that profile page**, not at the homepage. Use the same `@id` everywhere so the entity is one thing.
5. **Make the byline visible** on every post, e.g. "Cedwyn editors · 27 October 2026". Markup that doesn't match visible text is a mismatch Google can ignore.
6. **Add a "how this was made" note where AI or automation did real work,** such as AI-assisted images, generated film scenes or automated summaries. One factual line: what was automated and what was checked against the record. Put it on the page, not in a footnote site.
7. **Keep it short.** The profile page is the "who"; each post shows a byline plus, where relevant, a one-line "how".

## How we apply it to Cedwyn
- **Live check, 27 Oct 2026 03:56Z (cache-busted):**
  - Blog posts already carry `BlogPosting` with `author {"@type":"Organization","name":"Cedwyn editors"}`, and feed.json has `authors: Cedwyn editors`. Good, and honest.
  - **Gaps:**
    1. `author.url` points at the homepage, not a profile page.
    2. The byline isn't visible: the post text has no "Cedwyn editors" line.
    3. `/about/` and any editors page return 404.
    4. No post states how AI-assisted images, film scenes or NFT pieces were made, although the site uses generated media.
- **PROPOSED, for the blog worker plus one site-wide PR:**
  - (a) Create `/editors/`: 150-250 words on what Cedwyn records, how sources are cited (catalogue IDs, dated records), and the corrections route (whichever contact route the site already publishes; none added). Mark it `ProfilePage` + Organization.
  - (b) Point `author.url`/`@id` at it on every BlogPosting and research page.
  - (c) Add a visible "Cedwyn editors · <date>" byline in the post template.
  - (d) Add a one-line "Made with AI-assisted imagery from archive photographs; dates and references checked against the catalogue" on movie, NFT-art and AI-image posts. Its wording stays neutral and states the method only.
- **Editorial rules hold:**
  - never name the owner or family members;
  - no addresses or holdings;
  - the banned words list applies;
  - no outbound links on human pages: `sameAs` lives in JSON-LD only and lists owned channels, which is machine-facing;
  - pages must not explain themselves. So the editors page is a plain description of the publication, not commentary on the site. Put the "how" note in the post footer meta line, not as a banner.
- **Why it matters:** the e-books sell on trust in the records. AI answer engines and Google raters look for who stands behind a page, and an anonymous site with no "who" page is the weakest version of that. This fix costs nothing and changes no case wording.

## Sources
- developers.google.com (read, 27 Oct 2026)
- developers.google.com (read, 27 Oct 2026)
- developers.google.com (snippet)
- developers.google.com (snippet)
# hreflang for a trilingual site (EN / CY / ES): only where a translated page really exists

Date: 2026-10-26 (skills harvest 23:37). Status for Cedwyn: markup-only fix, allowed for the onpage flywheel once a real translated page pair exists. Adding new translated pages is content work and stays PROPOSED.

## What the evidence shows
- **Google Search Central, "Localized versions of your pages" (read 26 Oct 2026):**
  - Three equal methods: HTML `<link rel="alternate" hreflang>` in the head, HTTP headers, or the sitemap. Pick ONE; using all three gives "no benefit".
  - "Each language version must list itself as well as all other language versions." URLs must be fully qualified (`...`, not `/story/`).
  - Missing return links are the top mistake: if page X points to Y, Y must point back to X, or the annotations "may be ignored".
  - Codes: ISO 639-1 language (`en`, `cy`, `es`), optional ISO 3166-1 region (`en-GB`, `es-AR`). **`es-419` (Latin America) is not supported.**
  - Google does not use hreflang or `<html lang>` to detect a page's language; it detects language from the text.
  - Pages count as duplicates if "the main content of the page remains untranslated". Translating only the menu does not make a new language version.
  - `x-default` = the fallback page for unmatched languages, recommended for a language picker or home page.
- **Ahrefs study, Patrick Stox, 10 Aug 2023 (read), 374,756 domains using hreflang:** 67% had at least one issue.
  - 56.3% missing x-default; 18% missing self-reference; 16.9% pointing to redirected or broken URLs; 15.3% missing reciprocal tags; 8% pointing to non-canonical URLs; 4.6% wrong codes (e.g. `uk` for UK; the correct one is `gb`); 3.2% `<html lang>` disagreeing with hreflang.

## What we found on Cedwyn (live fetch, 26 Oct 23:39)
- **No hreflang tags anywhere** (checked `/`, `/story/`, `/argentina/`, `/ebooks/`).
- `/story/` has `<html lang="en-GB">` and canonical `href="/story/"`; `/ebooks/` has `lang="en"` and a relative canonical. Relative canonicals work, but hreflang URLs must be absolute, so build both from one absolute base.
- `/argentina/` is `lang="es"` (a real Spanish hub).
- The EN/CY/ES switcher (`ghf-lang.js`) translates **interface text only**; body text stays English and the choice rides `?lang=`, localStorage and a cookie. So `?lang=cy` pages are **not** Welsh versions in Google's sense.

## How to do it (steps)
1. **Inventory real pairs.** List pages whose main body exists in a second language (e.g. `/argentina/` ES and its English counterpart, the EN/ES Tour Companion pages if published, any Welsh page written in Welsh). Interface-only switches do not count.
2. **Never add hreflang to `?lang=` URLs.** Keep them out of the sitemap. If Search Console ever shows them indexed, canonical them to the clean URL.
3. **For each real cluster**, put the same block in the head of every member:
   ```html
   <link rel="alternate" hreflang="en-GB" href="cedwyn.bucklerfamily.estate />
   <link rel="alternate" hreflang="es" href="cedwyn.bucklerfamily.estate />
   <link rel="alternate" hreflang="x-default" href="cedwyn.bucklerfamily.estate />
   ```
   (Example URLs: check the real English counterpart first. Use `es` alone, or `es-AR` plus `es` if a Spain version ever appears. Never `es-419`. Welsh is `cy`, or `cy-GB`.)
4. **Self-reference and reciprocity:** every page lists itself and every sibling. Generate the block from one data file (e.g. `data/translations.json`: cluster id, lang, URL) so the members can never drift apart.
5. **Canonical = self** on each language page, absolute, matching the hreflang URL exactly (trailing slash included). Never canonical the Spanish page to the English one.
6. `<html lang>` must match the hreflang code on that page.
7. **Translate the head too:** `<title>`, meta description and og:title/og:description in the page's language.
8. **Validate:** a script fetches each cluster member (cache-busted) and checks 200 status (no redirect), self-tag present, all siblings present, absolute URLs, valid codes, and canonical = self. Then check Search Console > Pages a week later for "Alternate page with proper canonical" or duplicate flags.

## How we apply it to Cedwyn
- **Now (markup only, onpage run):** add the cluster block to `/argentina/` and its English counterpart, if a real counterpart exists. Make canonicals absolute site-wide in the same pass. One PR through the site-wide/section route; no wording changes.
- **Do not** hreflang the switcher. Optionally make the switcher's `?lang=` links `rel="nofollow"` and keep them out of the sitemap (check the sitemap first).
- **PROPOSED (content, the project lead's call):** native Welsh landing pages for the Wales tour and Spanish pages for the Patagonia e-books are what make hreflang useful. Each needs a real translation of the main body, with the English record still cited as the source.
- **Measure:** Search Console > Performance filtered by country (Argentina) and by query language. Compare 28 days before and after.
- Not checked: whether Bing reads hreflang (Bing has historically leaned on `<html lang>` and `content-language`, not re-read today).

## Sources
- developers.google.com (read 26 Oct 2026)
- ahrefs.com (read 26 Oct 2026; data Aug 2023)
- Live fetch of cedwyn.bucklerfamily.estate `/`, `/story/`, `/argentina/`, `/ebooks/` and `/_cedwyn/ghf/ghf-lang.js` header (26 Oct 2026 23:39 GMT)
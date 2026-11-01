# Language switcher for a trilingual site and film player (cy / en / es)

Topic: how visitors find and keep their language on Cedwyn pages and the /movie/ player, now that every scene exists as three separately made videos. Written 31 Oct 2026 (skills harvest). Checked first: "language selector"/"language switch" had 0 hits in INDEX.md; hreflang and YouTube multi-audio are covered elsewhere (hreflang-trilingual-..., youtube-multi-language-audio-tracks-...), this file is only the on-page switcher.

## What the sources say (all read 31 Oct 2026)
- **Google Search Central, "Managing multi-regional and multilingual sites"**: "Avoid automatically redirecting users from one language version of a site to a different language version ... These redirections could prevent users (and search engines) from viewing all the versions of your site." Add plain links to the other language versions instead.
- **Google, "How Google crawls locale-adaptive pages"**: Googlebot sends requests *without* an Accept-Language header and mostly from US IPs, so content chosen only by the browser's language may never be seen. Google recommends separate URLs per locale plus hreflang.
- **Smashing Magazine, Vitaly Friedman, "Designing A Perfect Language Selector UX" (May 2022)**: users look for the switcher in the header first, then jump to the footer; flags work for *country*, a globe or translate icon for language; "polite nudging is reasonable, automatic redirects are not"; decouple language from location; let users override and remember the choice (Patagonia: non-modal corner dialog, choice saved as a cookie, changeable from the footer); replace blocking modals with non-modal prompts.
- **Nielsen Norman Group, "6 Tips for Improving Language Switchers on Ecommerce Sites"** (usability study with shoppers in China): put the switcher top-right (or inside the mobile menu, where users found it); write each language name *in that language*; extra cues (flag/currency) made the control bigger and easier to spot; a wrong guess the user cannot undo cost trust; sites that remembered the choice on later visits pleased users.
- **CSA Research "Can't Read, Won't Buy - B2C" (press release 7 Jul 2020; 8,709 consumers, 29 countries, Kantar panel)**: 76% prefer to buy products with information in their own language; 40% will not buy from sites in other languages; 65% prefer their language even if quality is poor; 67% tolerate mixed languages on a site; 73% want reviews in their language.
- **Welsh Government, Welsh Language Use Survey 2019-20, "use with service providers"**: only 25% of Welsh speakers usually choose Welsh at least equally with English on public-service websites (9% always or almost always), against 51% with staff who make it known they speak Welsh. 71% recognise the orange "Cymraeg" logo.
- **Welsh Language Commissioner, Bilingual Design Guide (Sep 2014, PDF read)**: switching "should always be possible and easy ... on every page, going straight to the same page in the other language"; toggle "ideally ... in the top right hand corner". It also suggests a bilingual splash page on the front page; Google and Smashing both argue against gates and forced redirects, so we take the toggle advice and skip the splash.

## The how-to
1. **One URL per language version** of each page/scene (already the plan: `/movie/<scene>/<scene>.<lang>.v<semver>.webm`). Never pick content server-side from Accept-Language or IP alone.
2. **Switcher top-right on every page**, in the mobile menu too, labelled with endonyms: **Cymraeg · English · Español**. No flags for languages (Welsh has no unambiguous flag and Spanish is not Spain-only; the Patagonia audience reads Spanish). A small globe icon beside it helps people find it.
3. **Same-place switching**: choosing a language goes to the *same* page / scene / version in that language, keeping the playback position if the scene is playing (seek to the same timestamp in the new file).
4. **First visit**: show the page in its default language plus a small non-modal nudge if the browser language differs ("Ar gael yn Gymraeg / Also in English / También en español"). Never a blocking modal or auto-redirect.
5. **Remember the choice** (localStorage key such as `cedwyn_lang`) and use it on the next page and visit. The choice beats the browser language.
6. **Missing version**: if (scene, lang, version) is not yet made, keep the selection, show the "video pending" image with an HTML label in all three languages, and offer the nearest existing version. Never silently fall back to another language's video: that is the dubbing problem the owner rejected.
7. **Measure** (first-party, no new tool): log `lang_switch {from,to,scene}` and `play/ended {scene,lang,version}` to the existing first-party beacon. After 100+ plays, read: share of plays per language; switch rate on first play (high = the default is wrong for the audience); completion per language.

## How we apply it to Cedwyn
- The new /movie/ player (a worker, 31 Oct rules) loads each language's own video. Add items 2-6 to its spec: endonym labels, top-right plus mobile menu, same-timestamp switch, remembered choice, pending image without fallback.
- **Default language**: the films' rule is Welsh spoken before ~1970 with subtitles. The survey above (only 25% of Welsh speakers choose Welsh on websites) and CSA's 40% suggest the *page* default should follow the visitor's remembered or browser language, while the cy version stays first in the switcher order and is the version of record. This is a proposal for the owner's call, not a change: record it as a PROPOSED line, don't flip it.
- Check the live /documentary/ header (RUNNER.md: "one language selector") against items 2-5 at 390 px on the next site flywheel run.
- Same rules for /nomenclature/, /ebooks/ and every page that has cy/es versions.

## Sources
- developers.google.com (read)
- developers.google.com (read)
- smashingmagazine.com (read)
- nngroup.com (read)
- csa-research.com (read)
- gov.wales (read)
- welshlanguagecommissioner.wales (read)
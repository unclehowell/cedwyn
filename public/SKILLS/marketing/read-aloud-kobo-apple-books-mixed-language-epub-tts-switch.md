# Read-aloud on Kobo and Apple Books for a mixed English/Welsh/Spanish EPUB: what each actually does, and the publisher switch UK buyers depend on

Topic: whether a reader can *listen* to our e-books in the apps they buy them in, and what the publisher controls. `welsh-cy-language-tags-epub-onix-wel-kdp.md` covers the tags themselves, and `google-play-auto-narrated-audiobooks-en-es.md` covers Google's generated audiobooks. This file covers **store and app read-aloud behaviour**, which no skill had. Written 31 Oct 2026, skills harvest.

## What the sources show (read 31 Oct 2026)
- **Kobo: geography and the publisher decide.**
  - Kobo Help, "Kobo Web Reader Accessibility" (read): "Text-to-Speech is fully available in the European union. In other parts of the world, Text-to-Speech is only available for books **where the publisher has chosen to enable this feature**."
  - The web reader's Read Aloud lets the reader set speed, **preferred language** and voice.
  - Kobo Help, iOS app (read): TTS arrived in Kobo Books for iOS **11.0**. It works for all e-books in the EU and only select titles outside it. Kobo advises not running VoiceOver/TalkBack and Read Aloud at the same time.
  - Kobo's summer 2025 update (snippet): "natural-sounding text-to-speech on select eBooks".
  - **UK, Argentine and US buyers are outside the EU**, so on Kobo they hear our books only if we switch TTS on.
  - Kobo e-ink devices: readers in r/kobo (2024, snippet) and a Facebook group (snippet) report no TTS. Not checked against Kobo's 2026 device line.
- **Kobo Content Operations** has a publisher-facing "Text-to-Speech" article. It returned 403 to us, so the exact switch wasn't read. **Not checked:** whether Kobo Writing Life shows a per-title TTS toggle, or reads it from ONIX/EPUB metadata. In ONIX 3, TTS permission is normally sent as an e-publication usage constraint (type "text to speech", status permitted). That comes from our general knowledge of the code list and wasn't verified this run.
- **Apple Books has no read-aloud button of its own.** It relies on the system:
  - Apple Support (iPhone guide, read): Settings → Accessibility → Read & Speak has **Default Language**, **Detect Languages** ("automatically detect and speak multiple languages") and Pronunciations. Speak Screen and Speak Selection use these.
  - AppleVis users (snippet; page refused us) switch VoiceOver's language through the **rotor** when a book's language reads wrong.
  - So on Apple, the EPUB's `lang` tags plus the reader's device voices decide what is heard. iOS offers no Welsh voice as far as we know (not checked).
- **Thorium (desktop):** follows `lang`/`xml:lang` and, since v3.2 (EDRLab, Aug 2025, read), keeps a **default voice per language**. It is the easiest place to hear what a tagged EPUB will sound like (APLN guide, read).
- **Seller testimony with numbers:** none found. Listening matters to buyers with sight loss, to dyslexic readers, and to people with the walking-tour book in a pocket. Those are usage reasons, not measured sales.

## What a seller does
1. **Tag correctly first:** `dc:language` per main language, `lang`/`xml:lang` on every page's `<html>`, and `lang="cy"` on each Welsh name (per the Welsh-tags skill). Untagged pages are guessed by the device and often read in the wrong voice.
2. **Turn TTS on wherever the store asks.** Kobo: TTS is off outside the EU unless we enable it, so find the switch in Kobo Writing Life when listing. If an aggregator lists the book, set the TTS permission in its metadata form. Apple and Google rely on device features, so there's nothing to switch.
3. **Don't block it by accident:** no DRM that disables TTS on our own files, and no images of text. Our Welsh place-name tables must be real text, not pictures.
4. **Say it on the listing** only after the listen test (step 4 of `epub-accessibility-check-no-install-ace-app-pubcoder-thorium.md`) passes: "Works with read-aloud and screen readers" in `accessibilitySummary` and on the store description.
5. **Write the Welsh honestly into the description:** e.g. "Welsh place names are tagged as Welsh; devices without a Welsh voice may read them in English." This sets expectations and costs one line.

## How we apply it to Cedwyn
- **Today:** our three local EPUBs have the right main language but **no Welsh tags**. La visita has **16 of 17 pages with no page language**, measured today; see the accessibility-check skill. On Apple or Thorium, those pages fall back to the device's guess.
- **PROPOSAL A (build, internal):** set page `lang` everywhere and wrap Welsh terms, as both linked skills propose. Then run one Thorium listen test per book and log the result.
- **PROPOSAL B (store listing, needs the owner's go):** when La visita and the English titles go on Kobo Writing Life, **enable text-to-speech**. Without it, UK and Argentine Kobo app users can't listen. Record in the listing notes where the switch was found, which settles the "not checked" above.
- **PROPOSAL C (copy):** after Proposal A and a passed listen test, add the one-line read-aloud note (EN/ES) to each book's store description and `accessibilitySummary`. Until then, say nothing about read-aloud.
- Our own /ebooks/ files: keep them DRM-free, which they are now, so any device's read-aloud works.
- Nothing was listed or changed.

## Sources
- help.kobo.com (EU vs publisher-enabled TTS; read)
- help.kobo.com (iOS app 11.0 TTS; read)
- kobocontentoperations.zendesk.com (publisher article; 403, snippet only)
- kobo.com (snippet)
- support.apple.com (Detect Languages; read)
- applevis.com (rotor workaround; snippet)
- edrlab.org (read)
- apln.ca (read)
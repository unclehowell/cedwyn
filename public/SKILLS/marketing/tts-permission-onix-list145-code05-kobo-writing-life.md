# Text-to-speech permission for UK and Argentine buyers: ONIX List 145 code 05, and what Kobo Writing Life actually documents

Harvested 31 Oct 2026 (skills harvest). It follows `read-aloud-kobo-apple-books-mixed-language-epub-tts-switch.md`, which left two gaps: where the KWL switch sits, and the exact ONIX code. This file closes both as far as the primary pages allow. Proposals only; nothing was listed or changed.

## What the sources show (read 31 Oct 2026)
- **Kobo's rule (help.kobo.com web reader page, read in the earlier run):** text-to-speech (TTS) is fully on in the EU. Elsewhere it works only "where the publisher has chosen to enable this feature". So a UK or Argentine buyer hears our book read aloud only if we say yes somewhere.
- **The KWL Help Centre (searched through its public article index, 31 Oct):** a search for "text-to-speech" returns 15 articles. Only two talk about TTS: "FAQ" (updated 18 Sep 2026) and "Making Your Book Accessible to Everyone" (23 Jul 2026).
  - The FAQ explains TTS: on-demand audio from the device's own voices (iOS, Android), not saved, word highlighting, works offline, and can read image descriptions and footnotes. Kobo frames it as EAA compliance, and states TTS and audiobooks "serve different needs".
  - **Neither article names a per-title TTS toggle or an opt-in/opt-out step.** The FAQ does name opt-outs for other things (future AI recaps; it states annotation export can't be opted out of), so the silence on TTS is notable.
  - "Setting up a New eBook" lists the Rights and Distribution step: DRM on/off per book. TTS isn't mentioned there either.
  - The accessibility article's practical advice: "If your book contains multiple languages, select the primary language in the metadata", plus clean formatting. TTS quality "depends on the reader's device and voice settings".
  - **Conclusion:** the KWL dashboard toggle location is still **not checked**. The help centre doesn't document one, and the dashboard needs a login we don't have. The only reliable route is to ask KWL Author Support in writing (draft below), or to look in the dashboard when an account exists.
- **ONIX, the trade-feed route (EDItEUR code lists, read):**
  - List 145 "Usage type", code **05 = "Text to speech: 'Read aloud' with text to speech functionality"**. Code 04 = share across devices; 06 = lend.
  - List 146 "Usage status": **01 = Permitted unlimited**, 02 = Permitted subject to limit, 03 = Prohibited.
  - In ONIX 3.0 these sit in `<EpubUsageConstraint>` with `<EpubUsageType>` and `<EpubUsageStatus>`.
  - This applies only if we ever feed retailers ONIX ourselves, or a distributor shows a TTS field that maps to it (StreetLib, PublishDrive, Google Play's feed). Which distributors expose that field was **not checked**.

The snippet to ask for (or to check in a distributor's export):
```xml
<EpubUsageConstraint>
  <EpubUsageType>05</EpubUsageType>   <!-- List 145: Text to speech -->
  <EpubUsageStatus>01</EpubUsageStatus> <!-- List 146: Permitted unlimited -->
</EpubUsageConstraint>
```

## How to run it
1. Fix the text first. TTS reads what is written, so do this before saying yes. Put the language on every page (`lang` on `<html>`), wrap Welsh terms in `lang="cy"`, and give images alt text. See `welsh-cy-language-tags-epub-onix-wel-kdp.md` and `epub-accessibility-check-no-install-ace-app-pubcoder-thorium.md`.
2. **KWL direct:** at upload, look in Rights and Distribution and in "Maximize your Sales" (where the Kobo Plus toggle lives) for any TTS or accessibility switch. If there isn't one, send Author Support one short question (draft below). Record the answer in this file.
3. **Via a distributor:** before uploading, check its metadata form for "text-to-speech" or "read aloud". Set it to permitted. Ask for (or look at) the ONIX export to confirm List 145 code 05 with status 01.
4. **Verify like a buyer.** Once listed, open the book in the Kobo web reader from a UK connection and try Read aloud. Note whether the option shows. That one test is the evidence; the settings alone aren't.
5. Only after step 4 passes, add a "read-aloud ready" line to the shop page.

Draft for KWL Author Support (the owner sends it, Tab never does):
> "Hello, I publish through Kobo Writing Life from the UK. Your web reader help states text-to-speech outside the EU works only where the publisher has enabled it. Where in the KWL dashboard do I enable text-to-speech for my titles, so buyers in the UK and Argentina can use Read aloud? Thank you."

## Numbers and honest limits
- There's no sales evidence that TTS permission lifts sales. The case for it is access: Kobo itself presents TTS as an accessibility feature for readers with visual impairments, dyslexia or ADHD, and for language learners.
- Status: the KWL toggle is not documented (help-centre search, 31 Oct 2026). The ONIX codes are confirmed on EDItEUR's own pages.

## How we apply it to Cedwyn
- **Who it helps:** the trilingual audience. UK readers and Spanish-reading families in Chubut are outside the EU, so without our yes Kobo's Read aloud stays off for them. Language learners reading "La visita" alongside the English edition get read-aloud as a pronunciation aid.
- **Proposal 1 (no spend):** complete step 1 for all three EPUBs at the next rebuild (already proposed in the Welsh-tags file; this adds the TTS reason).
- **Proposal 2 (no spend, owner sends):** when the owner opens a KWL account for La visita or the English books, he sends the support question above. Paste the reply here.
- **Proposal 3:** if StreetLib Basic is used for the Spanish-only stores, check its TTS field during setup and confirm 05/01 in the export.
- **Shop copy:** the line "Works with read-aloud on Kobo and Apple Books" goes on the page only after the UK web-reader test passes. No claim before evidence.
- Nothing was sent to Kobo or anyone else.

## Sources
- ns.editeur.org (List 145; code 05 Text to speech; read)
- ns.editeur.org (List 146; 01/02/03; read)
- kobowritinglife.zendesk.com (TTS section, updated 18 Sep 2026; read via archive copy)
- kobowritinglife.zendesk.com (23 Jul 2026; read via the help centre's public article feed)
- kobowritinglife.zendesk.com (Setting up a New eBook: Rights and Distribution / DRM; read)
- help.kobo.com (TTS outside the EU only where the publisher enabled it; read in the previous run)
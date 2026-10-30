# AI "digital twin" intro of the founder: disclosure on YouTube, Instagram/Facebook and TikTok

Harvested 2026-10-30 ~16:02Z. the project lead's new standard intro (30 Oct 15:49) is an OmniHuman 2.0 video of his own face, from his photo, speaking "Great House Farm Story Time. Today's story ..." in a cloned voice, over AI-animated backgrounds of the restored farm, plus a lip-synced narrator thumbnail. He authorised his own likeness. The existing ai-image-labels-disclosure-engagement-meta-youtube.md covers AI **images**; this covers a realistic AI **video of a real person speaking**, which sits in a stricter bucket on all three platforms.

## Evidence (primary pages, read 30 Oct 2026)
- **YouTube Help 14328491 "Disclosing use of GenAI content":**
  - Disclosure **required** for realistic content that "makes a real person appear to say or do something they didn't do", "alters footage of a real event or place", or "generates a realistic scene that didn't actually occur".
  - **Not required:** "Cloning one's own voice to create voice overs or dubs", beauty/colour filters, AI help with script, thumbnail, title or captions, upscaling.
  - How: YouTube Studio > upload > Attributes > **"AI use" = Yes**. Photorealistic content may get a label **on the player**; otherwise in the expanded description.
  - "Disclosing AI content alone **won't limit a video's audience or impact its eligibility to earn money**."
  - YouTube may auto-label content carrying **C2PA metadata** or detected by its systems; a C2PA label **cannot be removed**. Creators who consistently don't disclose risk labels applied manually, removal, or YPP suspension.
- **Meta (about.fb.com, 6 Feb 2024 + 5 Apr 2024, updated 12 Sep 2024):** people are **required** to use the disclosure tool for organic posts with "a photorealistic video or realistic-sounding audio that was digitally created or altered", with possible penalties for not doing so. Label = **"AI info"**; generated content keeps the visible label, content only edited with AI has it moved to the post menu. High-risk deceptive content may get a more prominent label.
- **TikTok Community Guidelines, Integrity & Authenticity (Edited Media and AIGC):** creators must **label AI-generated or significantly edited content that shows realistic-looking scenes or people**. Unlabelled content "may be removed, restricted, or labeled". Content misleading on matters of public importance is not allowed even with a label.
- **Reading for our case:** the voice clone alone needs no YouTube label. The OmniHuman face video is realistic footage of a real person that was never filmed, and the animated farm backgrounds are realistic scenes that did not occur (animals and people at the restored building). Ticking "Yes" costs nothing on YouTube by its own words; not ticking risks a forced label or penalties on all three. **Disclose on every platform, every time.**
- **Engagement cost:** a label may reduce trust or engagement for some viewers. The image skill holds the numbers we have; no figure for AI-avatar intros was found today (not checked).

## The how-to
1. **YouTube:** Studio > Attributes > AI use = **Yes** on every Short with the twin intro or lip-synced thumbnail. Our runner uploads by API: set `status.containsSyntheticMedia: true` on videos.insert (YouTube Data API reference, read 30 Oct; `the project workspace` does not set it today, checked by grep). After upload, check that Studio shows no "label applied" notice that contradicts our choice.
2. **Instagram/Facebook:** toggle the AI label in the app's post settings on each Reel (menu wording not checked today); whether the Graph API publishing endpoint can set it was not checked. Otherwise post through the app for these or note it in the caption.
3. **TikTok:** switch on **"AI-generated content"** in post settings.
4. **Plain words in the caption/description too:** one neutral line, e.g. "Intro: AI-generated likeness and voice of the narrator, made with his permission." This covers platforms or APIs where the toggle is missing, and it is what a viewer reads.
5. **Keep the source trail:** for each intro keep the reference photo id, prompt, model, voice id and date in the intro log. This is our proof of consent and of what was generated if a label is ever disputed.
6. **Never put the twin in a factual-evidence role:** the twin introduces; it never "reads" a record as if quoting it on camera, never presents a reconstruction as real footage, and never appears with real archive photos as if it were filmed there. That keeps every episode out of the "misleading on matters of public importance" bucket (TikTok) and "alters footage of a real event or place" (YouTube).
7. **Keep C2PA if the tool writes it.** Don't strip metadata to dodge a label. If OmniHuman writes C2PA, the label is automatic anyway (not checked whether it does).

## How we apply it to Cedwyn
- **assemble.py / make_intro.py (PROPOSED for the social-intro worker):** write a sidecar `<clip>.ai.json` with `{"ai_use": true, "likeness": "narrator, own consent 2026-10-30", "voice": "clone of narrator", "background": "AI-animated restored-farm image"}`. Upload runners (YouTube daily, auto-social, Instagram/Facebook post scripts) refuse to post a clip whose sidecar states `ai_use: true` unless they set the platform flag or add the caption line.
- **Caption line, banned-words-checked:** "Intro: AI-generated likeness and voice of the narrator, made with his permission." Public text never names the project lead, so "the narrator", not his name.
- **Backgrounds:** the restored-building images are already reconstructions; the animated animals/people make them "realistic scenes that did not occur". Same disclosure, no separate label needed.
- **Log:** add an `ai_disclosed` (Y/N per platform) column to the project workspace for each post; the Sunday growth report counts any N.
- **Watch reach:** compare viewed-vs-swiped % and reach of labelled twin-intro episodes against the pre-format median (see the story-time skill). If labelled posts underperform by a wide margin, the fix is the hook, not dropping the label.

## Sources
- support.google.com
- about.fb.com
- about.fb.com
- tiktok.com
- developers.google.com (status.containsSyntheticMedia)
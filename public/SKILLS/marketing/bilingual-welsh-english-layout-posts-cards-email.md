# Bilingual Welsh/English layout for posts, cards and emails (Commissioner + Welsh Government rules)
Harvested 2026-10-29 18:30Z (skills harvest). Internal how-to; not public text. Different from mailchimp-conditional-merge-tags-trilingual-email.md (that one shows ONE language per reader; this one is how to lay out BOTH languages in one piece) and helo-blod-free-welsh-translation-trilingual-copy.md (getting the Welsh right).

## Why it matters
- 538,300 people in Wales aged 3+ can speak Welsh (17.8%, Census 2021, gov.wales / Welsh Language Commissioner). A Welsh heritage brand that treats Welsh as an afterthought reads as an outsider to exactly the local-history audience we sell to; the Commissioner's guide notes bad Welsh "can attract negative attention in the press, media and social media".
- No public sales test of bilingual vs English-only for a small shop was found (not checked). Treat this as credibility and reach into Welsh-language media/groups, not a proven conversion lift.

## The rules from the two primary sources (both read 29 Oct 2026)
Welsh Language Commissioner, Bilingual Design Guide (aimed at any organisation, statutory duty or not):
- Plan Welsh in from the brief, not added after. Both languages "equally easy to read" and, where feasible, "in a single eye line". Never mix the languages inconsistently.
- Separate the languages with a colour tint behind one language (both texts black), or colour reversal; NOT a different font per language ("will almost always make one version less legible").
- Common fonts only; no pseudo-Celtic or calligraphic faces. Never hyphenate a Welsh digraph (dd, ch, ff, ll, ng, rh) at a line end.
- Bilingual text needs more space: use the minimum words (also for email footers and out-of-office replies).
- Use a qualified translator (directory: welshtranslators.org.uk); translate the meaning, not word for word.
Welsh Government, Communication and marketing guidelines (updated 13 Jan 2025; written for WG but offered as help to others):
- Email: Welsh first; best practice side by side, Welsh LEFT, English RIGHT. Subject line bilingual, Welsh first, short enough to see both at a glance. In HTML email, place Welsh where it is read first. Say replies in Welsh are welcome.
- Social: best practice is ONE bilingual feed. If separate feeds, promote the Welsh feed on the English one every 2-3 weeks and cross-link the bios. If separate Welsh and English hashtags exist, use BOTH on every post.
- Video: subtitles in both languages when Welsh is spoken, OR post the same video twice with Welsh and with English subtitles. Adding some Welsh to an English video: 75% English / 25% Welsh ratio, captioned in English.
- Ads: one bilingual ad where text limits allow; otherwise 50:50 split of Welsh and English versions (Spotify caps Welsh ads at a 1:10 ratio).

## How-to for our formats
1. Email (Mailchimp, one shared version): two-column block, Cymraeg left / English right; on phones the columns stack, so Welsh lands on top - check the 390 px preview. Subject: "Cymraeg | English" under about 60 characters total, else use the short Welsh + short English pair. Keep the tri-lingual merge-tag version for long newsletters; use this shared layout for short announcements (St David's Day, Calan Gaeaf).
2. Quote cards / covers: Welsh line on top or left in the same font and weight, English below/right on a light tint panel. One eye line; no second typeface.
3. Instagram/Facebook captions: Welsh paragraph first, a line break, English paragraph; same hashtags in both languages at the end (e.g. #PethauBychain #RandomActsOfWelshness together).
4. Reels/Shorts: Welsh speech -> burned-in Welsh AND English subtitles (or two uploads); Spanish as a YouTube track (see youtube-multi-language-audio-tracks-cy-en-es.md).
5. Before posting: Welsh text checked (Helo Blod), digraph line breaks checked, banned public words checked in BOTH languages (`python3 the project workspace --subject ... --cy cy.txt --en en.txt` does the subject, digraph, hashtag-parity and banned-word checks).

## How we apply it to Cedwyn
- Matches the documentary rule already in force (Welsh before ~1970 with en/es subtitles): use the WG "subtitles in both languages" option for clips cut from it.
- First use: the St David's Day 2027 build-up posts and the 1 Mar email (st-davids-day-2027-random-acts-pethau-bychain-calendar.md) in this layout; quote-pack cards from the next weekly run (PROPOSAL to the quote-pack runner: Welsh line + English line on a tint, same font).
- Measure: saves/shares of bilingual vs English-only posts over 8 posts each; drop rule: if bilingual posts reach under 70% of English-only reach after 8 each, keep Welsh for seasonal posts and email only.
- Public text rules unchanged: never name the project lead, no banned words, no outbound links.

## Sources
- welshlanguagecommissioner.wales (read in full via pdftotext)
- gov.wales (read; updated 13 Jan 2025)
- welshlanguagecommissioner.wales (snippet: 17.8%, 538,300)
- tnlcommunityfund.org.uk (snippet: Welsh on the left in columns, first if no columns)
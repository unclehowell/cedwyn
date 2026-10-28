# Spam words are mostly a myth: what filters actually weigh, plus an offline pre-send check

Date: 2026-10-27 · Topic: email deliverability, cold outreach to UK institutions, newsletter QA
Tool: `tools/sa_check.py` (needs SpamAssassin; installed on this box 27 Oct, ~8.5 MB via apt)

## The finding
Long "spam trigger word" lists ("free", "act now", "100%", "click here") are mostly folklore. Gmail and Outlook filter mainly on **who you are** (IP and domain reputation, SPF/DKIM/DMARC alignment) and **how recipients react** (opens, replies, moves out of spam, spam reports). Words only matter at the margin, and mostly when reputation is already poor.
- **Litmus** ("Why spam trigger words are a thing of the past", read 27 Oct). Mailbox providers "look beyond words". They check IPs/domains and blocklisted links, authentication, and engagement. Gmail's anti-spam team, as Litmus quotes it: "make the user love your emails." Words "won't trigger spam filters alone", but they count once reputation is bad. Its survey figure: 70% of marketers spam-test, about a quarter of those often enough. Caveat: the page states it is 2+ years old.
- **Google sender guidelines** (support.google.com, read 27 Oct). All senders to Gmail need SPF or DKIM, valid forward/reverse DNS, TLS, RFC 5322 formatting, and a Postmaster spam rate **below 0.3%**. From 5,000/day you also need DMARC alignment and one-click unsubscribe. There is no word list anywhere in it.
- **Mailchimp content guide** (read 27 Oct). It warns about structure, not vocabulary: no link shorteners, no single big image, no code pasted from Word.

## Our own measurement (SpamAssassin 4.0.1, offline, Bayes off, 27 Oct)
| Test email | Score (spam at 5.0) | What fired |
|---|---|---|
| Plain, polite archive request | 0.0 | nothing |
| ALL-CAPS subject "FREE E-BOOK OFFER - ACT NOW!!!" + "Buy now" | 0.6 | SUBJ_ALL_CAPS 0.5, ACT_NOW_CAPS 0.1 |
| Archive request with "FREE OFFER!!! Click here now, act now, 100% guaranteed" pasted in | 2.7 | only GUARANTEED_100_PERCENT 2.7 |
| Same polite request, link swapped for bit.ly / tinyurl | 1.0 | SHORT_SHORTNER 1.0 |
| HTML-only email: one linked image + shortener, no text | **9.2 = spam** | EMPTY_MESSAGE 2.2, HTML_SHORT_LINK_IMG_1 2.2, HTML_IMAGE_ONLY_04 1.7, shortener rules 2.0, HTML-only 1.1 |

So shouting words cost 0.6. Structure (image-only, no text part, shortener) cost 9.2. SpamAssassin is only one filter, and Gmail/Microsoft use their own machine-learned models. But the direction matches Litmus and Google: **build and reputation beat vocabulary.**

## The routine (before any email leaves: HubSpot hive draft, Mailchimp campaign, cold outreach)
1. **Authentication first.** SPF + DKIM + DMARC aligned on the sending domain. Gmail sends from the project lead's own Google account, so that is Google's job. For Mailchimp, check the authenticated domain is still green. Watch Postmaster Tools (see `gmail-postmaster-tools-v2-compliance-spam-rate.md`).
2. **Structure.** Send plain text, or multipart with a real text/plain part. Never image-only. Keep at least ~400 bytes of real words. Link to full URLs, never shorteners (see `email-links-shorteners-tracking-safe-links-bot-clicks.md`).
3. **Run the offline score:**
   `python3 the project workspace --subject "<subject>" --text body.txt [--html body.html]`
   Aim for **≤ 1.0**. Fix any single rule worth ≥ 1.0 or any structural rule (EMPTY_MESSAGE, HTML_IMAGE_ONLY_*, MIME_HTML_ONLY, *SHORTNER*). Rules worth 0.0–0.5 are noise.
4. **Words: one sanity pass only.** No ALL-CAPS subject, no "100% guaranteed", no "!!!". Don't strip ordinary words like "free" from a genuine free sample, because a word hunt makes copy worse and buys nothing.
5. **Reputation habits matter more than any of this.** Send to people who expect or welcome the mail. Keep bounces under 2%. Keep the Postmaster spam rate well under Google's 0.3% line. Cold mail goes out in small daily volumes (see `cold-email-deliverability-uk-pecr.md`).
6. **Placement check, optional and free.** Send one copy to our own Gmail and Outlook.com test inboxes and look at the folder. Don't buy seed-list tools (never-pay rule).

## How we apply it to Cedwyn
- **Hive/HubSpot drafts to archives, councils, HMLR and universities.** These are plain-text letters the project lead sends from Gmail, so they're already the safest shape. Add `sa_check.py` to the READY gate as one line in the changelog ("SA 0.0, no rules"). It costs seconds, and it catches a pasted shortener or an HTML-only paste from Word.
- **Mailchimp e-book emails.** Keep the letter style (see `plain-text-vs-html-email-letter-style-test.md`). Make sure every campaign has a text part. Never send the e-book cover as the whole email. Run the HTML export through `sa_check.py --html` before the first send of each template.
- **Copy rules stay editorial, not anti-spam.** The banned public words list is about tone and law, not filters. Don't add "spam words" to it.
- **Measure by replies and sales, not opens** (Apple MPP inflates opens).

## Sources
- litmus.com (read 27 Oct 2026; page states 2+ years old)
- support.google.com (Google email sender guidelines, read 27 Oct 2026)
- mailchimp.com (read 27 Oct 2026)
- Own SpamAssassin 4.0.1 runs on this box, 27 Oct 2026, synthetic emails, network tests and Bayes off (scores are one filter's content view only)
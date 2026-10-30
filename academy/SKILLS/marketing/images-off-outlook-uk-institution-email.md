# Images-off email for UK institution inboxes (classic Outlook blocks pictures)

Topic: HTML email design and outreach to UK institutions. Added 2026-10-30 by the skills harvest. Companions: `html-email-design-accessibility.md` (layout, alt text, under 102 KB), `accessible-html-email-emc-2026-lang-dir-lint.md` plus `tools/email_a11y_lint.py` (accessibility lint), `email-client-mix-mailchimp-read-before-template-features.md` (who opens on what), and `email-metrics-mpp-bot-clicks-what-to-trust.md`. This file covers the gap those leave: **what a reader sees when pictures never load, and why the people we write to most often see exactly that.**

## The facts
- **Microsoft (support page, read 30 Oct 2026; applies to Outlook for Microsoft 365, 2024, 2021, 2019 and 2016):** "Microsoft Outlook is configured by default to block automatic picture downloads from the Internet." One reason Microsoft gives: "Helping you avoid tracking pixels." The reader has to click the InfoBar and choose "Download Pictures" for each message, or mark the sender as safe.
- **Litmus image-blocking guide (read; 2021 update):** "the biggest culprits are the Outlook desktop clients."
  - Default images **off**: Outlook 2007-2019, Outlook for Mac, Office 365 desktop, AOL webmail.
  - Default images **on**: Gmail, Apple Mail, iOS, Outlook.com, Office 365 web.
  - Outlook 2007-2019 shows alt text but **not styled alt text**.
  - "Outlook blocks images, and thus the open tracking pixel, by default," so its real share of opens is under-counted.
  - Their own earlier research: **43% of Gmail users** viewed email with images off back when Gmail blocked them (2013). It's the only measured images-off share Litmus gives. It is old, so treat it as an upper-range sign, not a current figure.
- **Admins can lock it.** Councils, universities and health bodies run Microsoft 365. NHSmail runs on Exchange Online (NHSmail support status notices, read). IT teams can keep picture downloads off for everyone through policy. We have no figure for how many UK public bodies do this, so it is not checked.
- **Result:** the clerk, records officer or archivist we write to is the reader most likely to see **only our live text and the alt text**. Their "open" may never register at all.

## What breaks with images off
1. **Image-only header or hero.** The first screen is a grey box or blank. The reader sees nothing above the fold.
2. **Image buttons.** "Buy" or "Read the sample" turns into an invisible link. Use live-text buttons (bulletproof: a table cell with background-color, padding and a text link).
3. **Text baked into images** (quote cards, dates, prices). The message disappears.
4. **Background images without a colour.** White text sits on white space. Always set bgcolor or background-color as the fallback.
5. **Logo signatures.** In Gmail-sent letters they show as a blocked picture or an attachment icon, which reads as clutter or risk to a cautious records officer.

## How to do it (checklist)
1. **Live text first.** The subject, the first sentence and the ask must all make sense with zero pictures. Aim for at least 300 characters of live text, and some live text in the first 400 characters of the body.
2. **Alt text on every image**, written as content, e.g. "Great House Farm, 1950s photograph". Never a filename. An image that is only decoration gets alt="".
3. **Every call to action is a live-text link.** An image is never the only thing inside a link.
4. **Every background image has a background colour** that keeps the text readable.
5. **Preview it with images off before any send:** `python3 tools/images_off_view.py campaign.html`. It prints the images-off view and exits 1 on any of these flags:
   - IMG_NO_ALT: an image has no alt text.
   - IMG_ONLY_LINK: a link contains only an image, so with pictures off it's an invisible button.
   - BG_NO_COLOR: a background image has no fallback colour.
   - LOW_TEXT: under 300 characters of live text.
   - FIRST_SCREEN_EMPTY: no live text in the first 400 characters of the body.
   For a real client render, open a Mailchimp test send in Outlook on the web with external images set to "Never". Office 365 web shows images by default, but you can switch that off.
6. **Measure institutions by replies and clicks, not opens.** Images off means no pixel, so a "0% open" from a council domain means nothing.

## Free tool
`tools/images_off_view.py`: our own script, standard library only, nothing installed. Box-tested 30 Oct 2026:
- A synthetic all-image email raised all 5 flags, exit 1.
- A live-text email with one alt-tagged photo raised none, exit 0.
It complements `email_lint.py` and `email_a11y_lint.py`, which check that alt text exists but don't show the reader's view.

## How we apply it to Cedwyn
- **Letters to UK institutions** (councils, HM Land Registry, archives, Cadw/Heneb, police, MPs):
  - These stay drafts for the project lead to send. They are plain text with no images, no logo signature and no tracking.
  - Any record image goes as a named PDF attachment only when the letter needs it. Never inline.
  - This is consistent with the evidence that "wording beats chrome for strangers" (html-email-design skill).
- **Mailchimp newsletter and e-book emails:**
  - Before each campaign, export the HTML and run `images_off_view.py`. Any flag gets fixed before scheduling.
  - The /ebooks/ link must be a live-text button.
  - Quote cards also carry the quote as live text below the image, or in their alt text.
- **Reporting:** In the Sunday growth report, opens from public-sector domains (gov.uk, gov.wales, nhs.*, ac.uk, council domains) are marked as "pictures likely blocked, not counted". Replies and /ebooks/ clicks are the measure for that group.
- **No public text changes** come from this skill. It is a pre-send check only.

## Sources (read 30 Oct 2026)
- Microsoft Support, "Block or unblock automatic picture downloads in classic Outlook email messages": support.microsoft.com
- Litmus, "The Ultimate Guide to Email Image Blocking": litmus.com
- Litmus, "The Ultimate Guide to Styled ALT Text in Email": litmus.com
- NHSmail support status (Exchange Online service notices): support.nhs.net
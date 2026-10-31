# Gmail's size and CSS limits for Cedwyn emails: 102 KB clip, 16 KB style block, styles stripped for non-Google accounts

Added 31 Oct 2026 (skills harvest 11:45Z). Topic check first: 'gmail clipping', '102kb', 'clipped', 'ganga', '16 kb', 'style block' had 0 hits in INDEX.md and no skill file. One existing line (email client mix skill) states "gmail -> <102 kb" and email_lint.py already tests size; this file gives the full rule set and the measured state of our own emails.

## What the platforms state (primary help pages, read 31 Oct 2026)
- Mailchimp help, "Gmail is clipping my email": Gmail clips messages larger than 102KB and hides the rest behind "View entire message". The clip also cuts the open-tracking code, so opens go uncounted. Message size = the byte size of every character in the code (1-2 bytes each). Fixes listed: smaller code, fewer elements, change the subject of repeat test sends (Gmail threads them and can clip).
- Klaviyo help, "Why is my email being clipped?" (updated 12 Feb 2026): desktop limit generally 102 KB; on mobile "around 20 KB on iOS to around 75 KB on other mobile devices", and the 20 KB Gmail-iOS limit "is applied inconsistently". The limit counts text, styling and links, not image file sizes. Moving the tracking pixel to the top keeps opens counted but does not stop clipping.
- caniemail.com, <style> element (last tested 27 Jul 2023): about 78% support overall. Gmail notes: (1) not supported inside <body>; (2) not supported for non-Google accounts in the Gmail apps (practitioners call this GANGA); (3) Gmail removes the first <head>, so a <style> needs a second <head>; (5) a CSS rule after a CSS comment is ignored; (6) "The size of the <style> tag is limited to 16 KB" (over that, the block is ignored).
- Practitioner testimony (search snippets, not opened): Sendlayer: senders see clipping a little under 100 KB, so treat 102 KB as approximate. A developer thread: stripping line breaks and whitespace was ~40% of their email's weight. Quinset (UK deliverability firm, read): a clipped email often shows healthy opens but low clicks, because the CTA and footer sit below the cut.

## Rules (do these in order)
1. Keep the HTML that is SENT under 60 KB (safe margin under 102 KB and under most mobile limits). Measure the campaign content as stored by the email platform, not the source file: the platform adds a footer, tracking redirects and its own CSS.
2. Put every style that matters inline (style="..."). Treat any <style> block as an optional extra for mobile tweaks only; it vanishes in Gmail for non-Google accounts and in Gmail when misplaced.
3. If a <style> block is used: under 16 KB, inside <head>, no CSS comments.
4. CTA in the first screen, not just at the bottom; plain-text link to the same page in the footer.
5. Repeat test sends: change the subject each time, or Gmail may thread and clip them.
6. Check: email_lint.py (size), then a test to a Gmail address and a Gmail-app-with-Outlook-account address; look for "[Message clipped]".

## Measured on our own emails (31 Oct 2026, read-only)
- Mailchimp saved campaigns via the connected app (6 drafts, none sent): nurture 1 (welcome + free v0.01 book) 3,883 bytes, nurture 2 3,897 bytes, nurture 5 3,669 bytes. Each has one <style> block of 275 bytes (Mailchimp's own footer rule for the mobile "canspam bar"), no <head>, 11-12 inline style attributes, 8 links. All our own styling is inline.
- House weekly template (bizdev/tools/weekly_email.py): weekly-2026-w44/w45/w46.html = 2.6-3.3 KB, inline styles only, no <style> block.
- So: about 4% of the 102 KB limit and under the ~20 KB iOS limit; nothing of ours relies on a <style> block. No clipping or GANGA risk today.

## Where the risk would come from
- Switching to a Mailchimp drag-and-drop/classic template (their wrapper adds a large <style> block and nested tables).
- The RSS weekly digest (mailchimp-rss-weekly-blog-digest.md) if it pulls many full posts: use excerpts, cap at 5 items.
- Long institution letters pasted from Word or Google Docs (inline font spans multiply the size).

## How we apply it to Cedwyn
- Gate: any new email template or digest must pass email_lint.py and show the sent-content size from the Mailchimp API under 60 KB before scheduling. Current drafts pass (3.7-3.9 KB).
- Keep the house rule: inline styles only; do not add a <style> block for design.
- Judge nurture emails on clicks and replies, not opens (opens are already distorted by Apple privacy; clipping would distort them further).
- Re-measure when the RSS digest goes live or a new template is adopted. No tool needed: one Mailchimp GET /campaigns/{id}/content and len(html.encode()).

## Sources
- mailchimp.com (read)
- help.klaviyo.com (read, updated 12 Feb 2026)
- caniemail.com (read; notes 1-6)
- quinset.co.uk (read)
- sendlayer.com (snippet only)
- Own measurement: Mailchimp API campaigns 10b76bac8b, 9f0b8b373d, 004b2419b7 content, 31 Oct 2026 11:44Z
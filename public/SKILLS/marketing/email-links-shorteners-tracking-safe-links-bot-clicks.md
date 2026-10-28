# Links in emails: no shorteners, tracking off for cold mail, and expect bot "clicks" from institutions

Date: 2026-10-27 · Topic: cold outreach to UK institutions, email analytics, UTM hygiene
Tool: `tools/sa_check.py` (offline SpamAssassin score; flags shortener links)

## What the sources say
- **Shorteners hurt.** Mailchimp's deliverability content guide (read 27 Oct) states: "Avoid link shorteners, which can trigger spam filters." Spamhaus's DBL FAQ (snippet, not read in full) notes spammers often hide behind URL shorteners, which is why filters distrust them.
  - **Our measurement (SpamAssassin 4.0.1, offline, 27 Oct):** the same polite archive request scored **0.0** with a full cedwyn.bucklerfamily.estate link. It scored **1.0** with a bit.ly or tinyurl link (SHORT_SHORTNER). Inside an image-heavy HTML email, the shortener rules added 2.0 more to a 9.2 spam score.
- **Click tracking adds risk for cold email.** lemlist's help-centre guide (5 Mar 2026, read; a vendor that sells tracking, arguing against it) recommends for cold campaigns:
  - **turn off open and click tracking.** Tracked links are redirects, a classic phishing pattern. Default tracking domains share reputation with every other customer, and the redirect adds DNS lookups.
  - **keep to one link at most**, ask before sending links, and **measure reply rate**.
  - Its "40% CTR, 0% human" example is illustrative, not a measured study.
- **Institutions' security systems click your links before the recipient does.** Microsoft's Defender for Office 365 Safe Links documentation (read 27 Oct):
  - URLs are scanned during mail flow, and with "wait for URL scanning" (the recommended setting) **messages are held until every link has been checked**.
  - Links are often **rewritten** to a safelinks.protection.outlook.com wrapper and checked again at the time of click.
  - **Effect 1:** links in mail to Microsoft 365 organisations get fetched by scanners, so link "clicks" and UTM visits from those emails are partly machines.
  - **Effect 2:** every extra link, or a link to a file download, is one more thing that can be held or flagged.
  - An earlier harvest found 7 of 9 of our institutional targets run on Microsoft 365 (see `microsoft-365-outlook-uk-institution-inbox-deliverability.md`).

## The routine
1. **Full, plain URLs on our own domain.** Never bit.ly, tinyurl or ow.ly in email, and don't use Mailchimp's shortened share links in a letter. One canonical page per email, written in full (e.g. `cedwyn.bucklerfamily.estate).
2. **Cold or institutional letters: 0–1 links, no tracking.** The letter should work with no click at all. Quote the reference number or catalogue ID in the text, and offer the link as optional ("the list is also online at …"). No tracking pixel, no redirect wrapper, no attachments unless they asked.
3. **Measure institutional mail by replies,** not clicks or opens. Log replies in HubSpot (see `cold-email-reply-triage-first-72-hours.md`).
4. **Opt-in newsletter (Mailchimp): click tracking can stay on,** because those readers asked for the mail and the tracking domain is Mailchimp's authenticated one. But:
   - treat any click within ~60 s of send, or every link clicked at once, as a likely scanner, not a reader;
   - judge campaigns on sales on /ebooks/ (Stripe/Gumroad) and on replies.
5. **UTMs:** use UTMs only on links in our own opt-in emails and social posts (`tools/utm.py`), not in cold letters to institutions. In those, a bare canonical URL looks more trustworthy and the visit data would mostly be scanner traffic anyway.
6. **Before sending, run** `python3 the project workspace --subject "…" --text body.txt`. Any `*SHORTNER*` or `URI_*` rule means rewrite the link.

## How we apply it to Cedwyn
- **Hive/HubSpot drafts** (archives, councils, HMLR, universities, police):
  - add a READY-gate check: no shortener, at most one link, the link on a bucklerfamily.estate domain, and the letter makes sense without it;
  - log "links: 1 full URL, no tracking" in the changelog;
  - the drafts already go out as Gmail sends from the project lead's account, with no tracking pixel. Keep it that way, and never add a mail-merge tracker.
- **Cloudflare traffic reports** (growth report `cf_traffic.py`):
  - **Facts:** Safe Links and similar scanners fetch pages within seconds of delivery, often from Microsoft or other data-centre IPs.
  - **Rule:** don't count a visit spike to a page we've just emailed to institutions as human interest.
  - **Note in the growth report:** "visits within 5 min of a send to M365 domains = likely scanner".
- **Mailchimp e-book emails:** keep tracking for the opt-in list, but keep the copy free of shortener links. Use the Buy-all-four and free-sample links as full /ebooks/ URLs.
- **YouTube/Instagram:** a shortener doesn't fix links that can't be clicked on Shorts (see `youtube-shorts-non-clickable-links-related-video-bridge.md`). We don't need one anywhere.

## Sources
- mailchimp.com (read 27 Oct 2026)
- help.lemlist.com (5 Mar 2026, read; vendor)
- learn.microsoft.com (read 27 Oct 2026)
- spamhaus.org (search snippet only, not read in full)
- Own SpamAssassin 4.0.1 runs on this box, 27 Oct 2026 (synthetic emails, offline, Bayes off)
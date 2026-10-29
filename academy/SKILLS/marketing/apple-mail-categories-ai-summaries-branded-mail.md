# Apple Mail categories, AI summaries and Branded Mail: writing campaigns for the AI inbox

Harvested 28 Oct 2026. Why it matters: on Apple Mail (iPhone, iPad and, since the 26-series, Mac) our Mailchimp campaigns land in a **tab** (Primary / Transactions / Updates / Promotions) and, on Apple Intelligence devices, an **AI summary replaces our preheader**. Apple Intelligence reached most regions in 16 languages with iOS 26.1 (Nov 2025), so this is now the default for most Apple Mail readers (Knak living reference, updated for iOS 26.6, Jul 2026, read).

## What is fixed (tested by others, read 28 Oct)
- **Categories are on by default**: Primary, Transactions, Updates, Promotions. Tapping a non-Primary message opens a **digest view** of all that sender's messages in that category (Apple iPhone User Guide, read).
- Apple: "When a Transactions, Updates, or Promotions message includes **time-sensitive information**, it will also be included in the Primary message list" (Apple User Guide, read). Apple does not define "time-sensitive"; treat a real date (talk tonight, offer ends Friday) in the first lines as the honest way to qualify, never fake urgency.
- **The summary cannot be steered.** Knak tried meta robots, meta descriptions, schema.org, heading hierarchy and hidden "if you are the AI..." text: "nothing we tried made any difference at all". **ALT text is not read** by summaries or search. So the summary is built from the visible body copy, mostly its opening.
- What we still control: **sender name, subject line, the first visible sentence(s), and the logo**.
- **Branded Mail** (sender logo instead of a random placeholder) lives in Apple Business: needs **DKIM** (SPF-only not accepted), domain meeting **DMARC** requirements, a commercial domain (gmail.com not allowed), max 100 domains/addresses; shows in Mail on iPhone set to one of seven languages incl. English, and iCloud web. It is **separate from BIMI** (Knak, read).
- Tabs history: after Gmail added tabs, Return Path data showed users kept reading brands they already engaged with at the same rate; senders with many disengaged subscribers saw sharp drops (Validity blog, read). Engagement, not tricks, decides where we get read.
- Practitioners on r/MarketingAutomation (2026 thread, snippet only) report the same: Apple replaces the preheader entirely on AI devices while Gmail shows its own summary in Promotions.

## The playbook
1. **Write the first two sentences as the summary you want.** Put the one concrete thing first ("New free chapter: the 1840s tithe map of Llandough, with the field names") before any greeting, banner or "view in browser" line. Banner images contribute nothing (ALT is ignored).
2. **Keep a real preheader anyway**: non-AI Apple devices, Outlook and Gmail list views still show it.
3. **Live text, not images, for anything that matters** (title, price, date, link text); image-only emails give the summary nothing to read.
4. **Subject line carries the message alone**, because the summary may say something different. No "Re:"/"Fwd:" tricks (they damage trust and do not beat the categoriser).
5. **Time-sensitive only when true**: a dated talk, a closing date. Put the date in the opening line.
6. **Consistent sender name** ("Cedwyn" style brand, same every send) so the digest view groups us cleanly.
7. **Branded Mail later, after authentication**: only worth applying once the From address is on our own domain with DKIM and DMARC aligned.
8. **Check**: send a test to an iPhone with Apple Intelligence on, screenshot the list view, and read the summary before the real send.

## How we apply it to Cedwyn
- Measured 28 Oct 01:58Z (public DNS over HTTPS): bucklerfamily.estate has **DMARC p=none**, SPF only for Cloudflare email routing, a Cloudflare DKIM key (cf2024-1), and **no Mailchimp DKIM** (k1/k2/k3._domainkey absent) on the apex or cedwyn subdomain. So Mailchimp mail is not DKIM-signed for our domain today, and **Branded Mail is not open to us yet**. The fix belongs to the existing domain-authentication skill (Mailchimp domain auth CNAMEs in Cloudflare); whether p=none satisfies Apple's "DMARC requirements" is **not checked**.
- Every Mailchimp campaign brief (welcome sequence, free-chapter upsell, monthly digest) gets an "opening line = summary" check: first sentence names the record/book and the reader's gain; prices as listed (v0.0.2 £4.99, bundle £19.96), no "was"/saving assertions.
- Trilingual campaigns (see mailchimp-conditional-merge-tags skill): the opening line must be in each language block's own first lines, because the summary reads the body the reader receives.
- Add the iPhone test screenshot to the pre-send checklist in the sales-fix runs; note what the summary said in the project workspace so we learn which openings summarise well.

## Sources
- support.apple.com (Apple, read 28 Oct 2026)
- knak.com (Knak hands-on living reference, updated Jul 2026, read)
- validity.com (Validity, read; Return Path data)
- reddit.com (snippet only)
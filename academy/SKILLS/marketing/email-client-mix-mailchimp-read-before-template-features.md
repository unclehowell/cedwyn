# Read your email client mix before choosing template features

**Use this when:** you are deciding whether an email template can use dark-mode tweaks, CSS tricks (kinetic or :checked), background images, web fonts or bulletproof buttons. The answer depends on which mail apps your readers use. Read that first; don't guess.

## What the sources show
- **Litmus Email Client Market Share, September 2026** (read 30 Oct; 1.5 billion+ opens tracked):
  - Apple 76.56%, Gmail 16.10%, Outlook desktop 3.48%, Yahoo 2.35%, Google Android 0.94%, Outlook.com 0.29%.
  - Apple and Gmail together are close to 90%.
  - Apple's figure includes Mail Privacy Protection (MPP) opens. MPP opens are prefetches with no reliable client or version, so they are "not considered reliable opens" (Litmus's wording).
  - Gmail is counted when the email was *opened in a Gmail app*, not by the address. A gmail.com address read in Apple Mail counts as Apple.
  - Litmus also states MPP affects about 55-60% of opens and dark mode is used by over 25% (their figures, not checked against raw data).
  - A secondary roundup (snippet only) put Apple at 62.26% in July 2026, so **Apple's share swings by about 15-20 points from month to month**. Treat any one month as a prior, not a constant.
- **Mailchimp Marketing API** (docs read 30 Oct):
  - `GET /lists/{list_id}/members` returns `email_client` for each member ("The list member's email client"). It is blank until an open has been seen.
  - `GET /reports/{campaign_id}/domain-performance` returns only the **top 5 address domains** (gmail.com, hotmail.com...), with delivered, opens, clicks and bounces for each. The domain is a proxy for the mailbox provider, not for the app.

## How to do it (15 minutes)
1. Run `python3 tools/client_mix.py` (read-only). It prints the client share and the address-provider share as counts only, never addresses, plus the template rule each implies.
2. **Under 30 members with a seen client:** your own mix is noise. Use Litmus's global mix as the prior: design for Apple Mail and the Gmail app, and spot-check Outlook desktop.
3. **30 or more:** use your own mix.
   - Outlook desktop 5% or more: use bulletproof (table/VML) buttons, put no text inside background images, and keep a plain link under every button.
   - Gmail a large share: keep the HTML under 102 KB, because Gmail clips larger messages (tools/email_lint.py checks this). Kinetic and :checked effects do nothing in Gmail; see interactive-email-amp-kinetic-gate-mailchimp-link-votes.md.
   - Apple large: dark mode matters (color-scheme meta, transparent PNG logos), but MPP inflates Apple. Read it as "people use Apple devices", never as engagement.
4. **Read clicks by domain, not opens.** Use domain-performance `clicks` per delivered for each provider. A provider with normal deliveries but near-zero clicks across 3+ sends points to a rendering or placement problem there. Run inbox-placement-checks-mailtester-seed-headers.md for that provider.
5. Re-read every quarter, or after any growth spurt (a press hit or a new signup source changes the mix).

## Mistakes to avoid
- Picking features from a vendor's "Apple is 60%" headline when your own list leans towards UK webmail. BT Internet addresses are hosted by Yahoo; Hotmail and Live use Outlook.com rendering.
- Treating the address domain as the app. iPhone users with Gmail addresses mostly read in Apple Mail or the Gmail app; you cannot tell from the address.
- Counting MPP opens as readers.

## How we apply it to Cedwyn
- **Measured 30 Oct 06:57Z** (client_mix.py, live read): the Cedwyn Mailchimp audience has **1 subscribed member**, with no client seen yet and an own-domain address. So a client-mix decision is not readable now.
- Rule until 30+ members have a seen client: use the Litmus prior. That means a single-column, mostly-text template (it suits Apple, Gmail and Outlook), real HTML text rather than text in images, a plain link under each button, and HTML under 102 KB. No kinetic or AMP (already gated).
- Re-run client_mix.py in the Sunday growth report once the audience passes 30. Log the shares in the project workspace
- The bigger lever is list size, not template features. The signup, popup and referral skills come before any rendering work.

## Sources
- litmus.com (read 30 Oct 2026, September 2026 report)
- mailchimp.com (.md read: `email_client` field)
- mailchimp.com (.md read: top 5 domains)
- Search snippet only, not relied on: a July 2026 Litmus figure of Apple 62.26% / Gmail 27.03%, quoted by a third-party roundup
# UTM discipline + GA4 funnel exploration for a small e-book site (2026)
Harvested 2026-10-26. Goal: know which email variant, post or page produced a signup, a read or a sale, without corrupting the data.

## Rules that matter (with sources)
1. **Never put UTMs on internal links.** Analytics Mania (Julius Fedorovicius): "Internal links (e.g. on your menu links) should never be tagged with UTMs … it can mess up your attribution." Optimize Smart: they override the original source/medium. A visitor who came from our outreach email and then clicks a UTM-tagged header strip gets re-credited to the strip, which destroys the A/B read.
   - For internal clicks, use a **GA4 event** instead: `gtag('event','upsell_click',{placement:'header_strip',book:'<slug>'})`.
2. **Lowercase everything, with one fixed vocabulary.** GA4 is case-sensitive: `Facebook` and `facebook` become two rows.
3. **Medium decides the channel.** From GA4's default channel group rules (support.google.com):
   - **Email:** source OR medium = email|e-mail|e_mail|e mail. (Our outreach links use utm_source=email, so they land in Email even with medium=outreach. Good.)
   - **Organic Social:** source in GA4's social-site list OR medium in social|social-network|social-media|sm|social network|social media.
   - **Referral:** medium referral|app|link.
   - Anything else becomes **Unassigned**. Example: utm_source=hubspot&utm_medium=newsletter is Unassigned, because neither value matches.
4. **Always send source + medium + campaign.** Content = the variant (A/B), term = rarely.
5. **Keep a master sheet** of every tagged URL (Analytics Mania). Ours is the project workspace plus the sendlog.

## Our vocabulary (use exactly these)
| where | utm_source | utm_medium | utm_campaign | utm_content |
|---|---|---|---|---|
| outreach email | email | outreach | batch-YYYYMMDD | variant id (A1, B2…) |
| weekly subscriber email | email | newsletter | promo-YYYYMMDD | book slug |
| Instagram bio/story | instagram | social | post slug | bio / story |
| Facebook page post | facebook | social | post slug | post / comment |
| YouTube description | youtube | social | video slug | desc / pinned |
| LinkedIn DM/post | linkedin | social | dm-YYYYWW / post slug | page slug |
| Reddit/forum | reddit | social | thread slug | – |
Never: utm_* on cedwyn → cedwyn links (header strip, drawer, related links, e-book cross-sells).

## GA4 funnel exploration (once the property is live)
Explore → Funnel exploration. Up to 10 steps, built from events. Use an **open** funnel (people can enter at any step, since our emails deep-link mid-story). Breakdown: *Session source/medium*, then *Session manual ad content* (the variant).
1. `page_view` on a story or evidence page (big net)
2. `upsell_click` OR `page_view` where path contains /ebooks/
3. `sign_up` (Mailchimp submit) / `generate_lead`
4. `ebook_read` (reader opened, free chapter)
5. `begin_checkout` (buy click → Stripe/Gumroad)
6. `purchase` (from the Stripe/Gumroad thank-you, or logged server-side in the project workspace)
Mark sign_up, ebook_read and purchase as **key events**. Use "elapsed time" to see how long people take from story to signup. With about 17 UK visits a day the funnel will be thin: read it weekly, not daily, and expect GA4 thresholding to hide small rows.

## Tool
- `tools/utm.py` (standard library only, written 2026-10-26):
  - `build <url> source medium campaign [content]` lowercases the values, keeps existing query strings, and refuses internal-to-internal use when given `--from-site cedwyn.bucklerfamily.estate`.
  - `check <url…>` prints the GA4 default channel each URL will land in, and flags uppercase, spaces, missing campaign, and UTMs on internal links (anything in the header/drawer HTML pointing at cedwyn with utm_*).
  - `scan <html files…>` finds internal links carrying UTMs. Run it on **built site pages only**: email templates link in from outside and *should* carry UTMs (a test run over the outreach templates correctly lists their tracked links, which is expected).
  - Note: the outreach engine writes `utm_content` in mixed case (e.g. T3b, as in ab.csv). Consistency is what matters for GA4, so keep the engine's case for that field. `build` lowercases values, so don't use it to rebuild engine links.

## How we apply it to Cedwyn
- **Live issue flagged 2026-10-26:** the header-upsell worker (40c4be63) was briefed to put UTMs on the strip. Steer: strip links plain, plus the `upsell_click` event. Run `python3 tools/utm.py scan` over the built HTML before each commit.
- The outreach engine is already correct (source=email puts it in the Email channel). Keep `utm_content` = variant id so ab.csv joins with GA4.
- Cloudflare Web Analytics (cookieless) shows paths and referrers but not UTMs or events. GA4 is needed for the funnel, and it needs a cookie banner (PECR).

## Sources
- analyticsmania.com (don't tag internal links; lowercase; master sheet; Unassigned)
- support.google.com (default channel group rules, quoted above)
- optimizesmart.com (internal UTMs override source/medium)
- bigdelta.com (funnel exploration: 10 steps, open vs closed, elapsed time)
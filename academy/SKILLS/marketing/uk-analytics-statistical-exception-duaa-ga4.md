# UK analytics without a consent click: the PECR 'statistical purposes' exception (DUAA 2025)

Date: 26 Oct 2026 (skills harvest 21:23). Type: analytics + compliance. Status for Cedwyn: PROPOSAL (changes the public banner and privacy page).

## What changed (primary source read)
- The Data (Use and Access) Act 2025 added new PECR exceptions; the cookie exceptions and the higher PECR fines took effect on **5 Feb 2026** (PolicyPros and Stevens & Bolton guides; commencement date not checked against legislation.gov.uk).
- ICO guidance on storage and access technologies (published 29 Apr 2026, page read 26 Oct 2026): no consent is needed where the **sole purpose** is collecting information for statistical purposes about how your service or website is used, **with a view to improving it**. Conditions:
  - you give clear, comprehensive information about the purpose **and a 'simple and free' means to object** (an opt-out, not an opt-in);
  - a third party (analytics provider) may receive the data **only to improve your site**, not for its own purposes;
  - output must be aggregate; individual-level data kept no longer than aggregation needs; UK GDPR still applies to any personal data.
- ICO table, likely inside the exception: page-by-page visits, scroll depth, device/browser, **referrer / how users reached you (eg an email campaign)**, **A/B testing**, city/region-level location, load speed, bounce and exit pages.
- Still needs consent: **session recordings/logs of individual visitors** (so Clarity stays behind Accept, as in clarity-heatmaps-recordings-uk-consent.md), ad measurement, conversions tied to a visitor ID shared with ad partners, profiling by IP or pages, cross-site tracking.

## Why it matters (practitioner numbers)
- etracker Cookie Consent Benchmark 2025: with a lawful equal-weight banner, **about 60% of visit data is lost** when consent is required, and consent rate swings by **36%+** by site, referrer and medium, so the remaining data is skewed, not just smaller.
- Advance Metrics (2018-2023, cited by phew.org.uk, not checked): 33.6% of visitors ignored banners in 2023; an ignored banner is no consent.

## GA4: only with settings switched off (practitioner read, not an ICO ruling)
Cookie-Script and Duport guides (2026): GA4 can sit inside the exception only if you (1) turn **off** all Google data-sharing settings (Admin > Account settings), (2) turn **off Google signals** and ads personalisation, (3) link **no** Google Ads / Merchant Center, (4) set event data retention to the minimum (2 months), (5) do not send user-ID or any personal data. The ICO names no tool as compliant; this mapping is the guides' reading, not checked with the ICO. Safer default: a cookieless or first-party aggregate counter (Cedwyn already has the cookieless Cloudflare beacon).

## Playbook (small site)
1. List every script that sets or reads storage: analytics, heatmap/recording, embeds (YouTube, Facebook), Stripe, Mailchimp form. Tag each: strictly necessary / statistical / needs consent.
2. Statistical bucket: configure so its only purpose is site improvement (GA4 settings above; IP-level and user-level reports off).
3. Banner: keep Accept/Reject for the consent bucket only; move statistical analytics to a plain notice + one-click **Object** link (footer and privacy page), stored in a strictly-necessary preference cookie.
4. Privacy page: one paragraph per statistical tool: what, why (improve the site), provider, retention, how to object.
5. Measure before/after for 4 weeks: GA4 sessions vs Cloudflare HTML-200 visits; expect the GA4/Cloudflare ratio to rise from ~0.4 towards ~0.8+ if the ~60% loss figure holds (our ratio not checked).
6. Re-check when the ICO updates the guidance; keep a dated note of the settings screen.

## How we apply it to Cedwyn
- Today: en/cy/es banner gates GA4 behind Accept; Cloudflare beacon is cookieless; Clarity not live. GA4 data-sharing and signals settings: **not checked** (read-only check needs no GO).
- PROPOSAL for the owner (GO needed, public page change): (a) GA4 switched to exception-safe settings, (b) banner text in en/cy/es changed so GA4 runs with a notice + Object link, Reject still blocks embeds/recordings, (c) privacy page paragraph. No new tool, zero spend.
- Benefit: funnel and UTM reports (utm-discipline-ga4-funnel.md) stop losing most UK visitors, so the 3-hourly sales fix reads real drop-off, not the consenting minority.
- Risk control: keep Stripe/Mailchimp/YouTube behaviour unchanged; any doubt about a tool = leave it behind consent.

## Sources
- ico.org.uk (read 26 Oct 2026)
- policypros.co.uk (snippet: 5 Feb 2026 commencement)
- stevens-bolton.com (snippet)
- aoshearman.com (snippet: guidance 29 Apr 2026)
- etracker.com (read)
- cookie-script.com (read); duport.co.uk (snippet)
# Interactive email (AMP vs CSS "kinetic") for a Mailchimp newsletter: gate and safe substitute

Skill harvested 30 Oct 2026. Verdict first: **AMP is GATED (not possible on our sender)**; CSS kinetic interactivity is **optional, only with a full static fallback**; the robust substitute is **link-based interaction** (tap-to-vote, tap-to-choose links that land on a page).

## What "interactive email" means (Justin Khoo, Fresh Inbox / Proofjump, Stripo webinar write-up, read)
Three kinds: (1) **kinetic** HTML/CSS (hover, click-to-reveal, tabs, carousels, accordions, built on hidden checkbox/radio inputs + the CSS `:checked` selector); (2) **AMP for Email** (live forms, content that updates inside Gmail/Yahoo); (3) **embedded forms**. Khoo's advice: use it when it makes the product more compelling, build reusable modules (carousels are costly the first time, cheap after), and test in every major client before sending.

## The support numbers (caniemail.com data, read 30 Oct 2026)
- **AMP for Email**: about **16%** estimated support. Yes: Gmail (desktop, iOS, Android apps), Yahoo (webmail; apps since 2022-12). No: Apple Mail, all Outlooks, Gmail mobile webmail.
- **CSS `:checked`** (what kinetic emails need): about **31.7% full + 9.8% partial = 41.5%**. Yes: Apple Mail (macOS 12.4+, iOS 13.3+), Yahoo, Samsung, Thunderbird. **No: Gmail (every platform) and Outlook (Windows/Mac)**. Some French webmails turn `<input>` into `<noinput>`.
- So a kinetic email shows its fallback to every Gmail reader. If most of the list reads in Gmail, the interactive version is seen by few.

## AMP needs things we do not have
- Google requires **registration per sender address**: a real production email with the AMP MIME part sent to Google's review address, SPF/DKIM/DMARC passing, a reply in about 5 business days, revocable at any time (Gmail developer docs, read).
- **Mailchimp cannot send the AMP part**: the Mailchimp Marketing API's campaign-content schema (Swagger, read 30 Oct 2026) takes only `plain_text`, `html`, `url`, `template`, `archive`, `variate_contents`. There is no AMP field. Mailchimp's own "AMP email" article is general reading, not a feature page. AMP would mean a different sender: GATED, and not worth it for one small newsletter.

## The claimed lift
- Roundup posts repeat "interactive emails get 4x higher CTR". **Not checked**: no primary test was found behind it this run. Treat it as marketing copy until our own A/B test states otherwise.

## The safe playbook
1. **Read our client mix first**: Mailchimp campaign report, email client / device breakdown. If Apple Mail is under about 40% of opens (opens are inflated by Apple Privacy Protection anyway), skip kinetic.
2. **Link-based interaction works everywhere**: "Which story next? [Tithe map] [Documentary scene] [Place names]". Each is a normal link with its own tag (see campaign-tags-first-party-beacon-workers-analytics-engine.md and own-short-redirect-links-r-campaign-path-counting.md), landing on a page that confirms the vote. Count the clicks. No client-support risk. Filter bot clicks (tools/bot_click_flag.py).
3. **If trying kinetic once** (e.g. a click-to-reveal "what the 1841 record said"): build it so the **default state is the complete static email**. Show the interactive layer only inside a `@media` + `:checked`-support wrapper. Never hide essential text behind the interaction. Test in Apple Mail, Gmail web + app and Outlook. A/B it against the static version with tools/ab_stats.py, and only call a winner at an adequate sample (see ab-testing-small-lists.md and sample-ratio-mismatch-srm-check-ab-tests.md).
4. **Accessibility**: hidden checkbox tricks can confuse screen readers. Keep real headings and text in the fallback, and add `aria-hidden` to decorative toggles.
5. **Never**: forms that submit inside the email (AMP/embedded) on our stack; GIF "fake buttons"; content that only exists inside the interactive layer.

## How we apply it to Cedwyn
- **Mailchimp newsletter**: no AMP (the platform cannot send it). Next issue: one **tap-to-vote links block** ("Which record should we open next?" with 3 tagged links to Cedwyn pages). This doubles as reader research for the e-book pipeline. Log the counts in the growth report notes.
- Kinetic only after the client-mix check, and then as a single A/B test (static vs click-to-reveal) on one issue. The proposal goes to QUEUE-after-framing.md, not straight to live, because email journeys are proposals.
- Copy rules apply to vote labels and landing pages: never name the project lead; never "tenant farmers"; none of the banned words (states, assertions, per, second-hand report, not checked, reported, deception, taken); Cedwyn internal links only; purchases via /ebooks/.
- Zero spend: no paid interactive-module builders. Plain HTML/CSS by hand if ever needed.

## Sources
- stripo.email (Justin Khoo webinar write-up, read)
- caniemail.com and caniemail.com (plus raw data github.com, read)
- developers.google.com (read)
- api.mailchimp.com (campaign content PUT schema, read)
- mailchimp.com (general article, read)
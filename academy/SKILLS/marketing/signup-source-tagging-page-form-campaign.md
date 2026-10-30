# Signup-source tagging: know which page, form and campaign each subscriber came from

Topic: tag every email signup with where it happened (page + form position + campaign), so list growth can be steered to the forms and pages that work. Written 30 Oct 2026 (skills harvest).

## Why it matters (evidence)
- **Mailchimp Help, "Determine Webpage Signup Location"** (read 30 Oct 2026): add a hidden text field (e.g. merge tag `SIGNUP`) to the form, then append `&SIGNUP=Homepage` to the embedded form's `form action` URL, one edited copy per page. The value lands in the subscriber profile; build auto-updating segments on it. Text-field segments are **case-sensitive**. For *how* people joined (hosted form vs embedded vs integration) Mailchimp states to segment by **signup source** instead; the hidden field is for *which page*.
- **Mailchimp Help, "Add Hidden Fields to a Signup Form"** (read): hidden fields must **not be required**; the email field can never be hidden.
- **Backlinko content upgrades** (already in INDEX, read in an earlier run): once signups were tracked per form, **2 page-specific links produced 30% of all new subscribers while 54 generic forms produced the rest**. Without per-form source data that result is invisible.
- Self-reported attribution skills already in the library (how-did-you-hear, HDYHAU) cover *why*; this skill covers *where*, which needs no question.

## What Cedwyn has today (measured 30 Oct 2026, 07:12Z, code read)
- Cedwyn's own list (Worker `/api/list/subscribe`, D1 table `cl_subscribers`) **already has a `source` column** (120 chars).
- JS signups (runtime.js `mcForm`) send `source: location.pathname` - the **page only**. No form position, no campaign, no referrer.
- No-JS signups send whatever hidden `source` input the form carries; only one value was found in the code (`/subscribe/`), so most no-JS signups record nothing useful.
- CMS invites write `cms` / `cms-invite`. The separate Mailchimp audience had **1 subscribed member** (06:57Z run), with no hidden SIGNUP field.
- So today we can tell "/ebooks/" from "/research/..." but not "footer form vs inline chapter offer" or "came from YouTube vs Facebook".

## How to do it (smallest version)
1. **One vocabulary, one string.** `source = <path>|<form>|<utm_source>/<utm_medium>|<ref-host>`, e.g. `/ebooks/|inline-chapter|youtube/video|-` or `/research/evidence/|footer|-/-|google.com`. Keep under 120 chars (D1 cap). Form ids are fixed words: `footer`, `inline-chapter`, `slide-in`, `subscribe-page`, `shop-strip`, `thank-you`.
2. **Give each form a `data-form` attribute** (or a hidden `<input name="form">`) so JS and no-JS posts both carry it.
3. **First touch, not last.** On landing, store `utm_source`, `utm_medium`, `utm_campaign` and `document.referrer` host in `sessionStorage` once; read them at submit. (Matches utm-discipline-ga4-funnel.md naming: lowercase, `youtube`, `facebook`, `instagram`, `newsletter`.)
4. **No-JS fallback:** every server-rendered form gets `<input type="hidden" name="source" value="<path>|<form>">` written at build time.
5. **Mailchimp forms (if used):** add a hidden, not-required text field `SIGNUP`; edit each embed's action URL with `&SIGNUP=<path-form>`; or, via API, send `tags: ["src-<form>"]` and `merge_fields.SIGNUP` on member add (API detail from the reference, not re-read this run).
6. **Read it weekly:** `SELECT source, COUNT(*) n, SUM(status='confirmed') c FROM cl_subscribers WHERE test=0 GROUP BY source ORDER BY n DESC;` Rank forms by **confirmed signups per 1,000 page views** of the page they sit on (page views from cf_traffic.py), not raw counts.
7. **Decide with small numbers carefully:** below ~20 confirmed signups total, only act on a form that has **zero** after 500+ page views (move or reword it); otherwise keep collecting.

## Pitfalls
- Never put personal data in the source string (no names, no emails, no query strings other than the UTM keys).
- Segments are case-sensitive: lowercase everything at write time.
- Do not overwrite `source` when an existing subscriber signs up again; append the new form to `topics`/notes instead (the Worker already merges topics this way).
- Hidden fields must be optional or the form silently fails.

## How we apply it to Cedwyn
- Patch (leave in the project workspace or a site-wide PR when no build runs and the repair freeze allows): runtime.js `mcForm` builds the 4-part string above; build step adds hidden `source` + `data-form` to every form; bump runtime.js `?v=`.
- Add the GROUP BY readout to the Sunday growth report (one line: top 3 sources, confirmed per 1,000 views).
- YouTube descriptions and pinned comments already carry UTMs (youtube-end-screens skill), so `youtube/video` signups will show up directly.
- Editorial rules unaffected (no public text changes). Do not test-submit from the box before the per-IP limit window allows (6/hour/IP).

## Sources
- mailchimp.com (read 30 Oct 2026)
- mailchimp.com (read 30 Oct 2026)
- Backlinko content upgrades numbers: see content-upgrades-page-specific-lead-magnets.md (read in earlier run)
- Code read: the project workspace (subscribe, `source` column), the project workspace line 118, the project workspace
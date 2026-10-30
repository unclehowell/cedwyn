# Back-button hijacking: Google spam policy (enforced 15 Jun 2026) and a no-trap rule for exit offers

Written 30 Oct 2026, skills harvest. Area: CRO, SEO risk, site hygiene. Before this run "back button" had 0 hits in INDEX.md. Exit-intent and slide-in capture are covered elsewhere (exit-intent and on-site slide-in skills); this file is the line those tactics must never cross.

## What the source states (primary, read in full)
- Google Search Central blog, 13 Apr 2026 (Chris Nelson, Search Quality): "back button hijacking" became an explicit violation of the **malicious practices** spam policy. Enforcement started **15 Jun 2026**, two months after the announcement.
- Definition: the site "interferes with a user's browser navigation and prevents them from using their back button to immediately get back to the page they came from". That includes sending people to pages they never visited, or showing "unsolicited recommendations or ads".
- Penalty: "manual spam actions or automated demotions". A manual action shows in Search Console and needs a reconsideration request. Automated demotions are silent.
- Google states some cases "originate from the site's included libraries or advertising platform". The owner is still expected to find and remove them.
- Inserting deceptive pages into history "has always been against" Search Essentials. The April post makes enforcement explicit.

## Practitioner reading (secondary, read)
- Andres Plashal (blog, read): treat it as an audit problem for SPAs and third-party scripts. The two-month notice suggests detection was ready on day one, and automated demotions give no notice. The case is opinion, not numbers.
- Search Engine Journal and others covered it. A third-party "watch" of 25 publishers exists on gsqi.com, which is on our blocked list, so it was not read. A report that Google emailed warnings with sample URLs to offending sites was a search snippet only (not checked).
- **No outside uplift or loss numbers were found.** Treat this as a rule, not a growth lever.

## The patterns, and what is fine
| Pattern | Verdict |
|---|---|
| `history.pushState` on page load (adds a fake entry so Back lands on an offer page) | VIOLATION |
| A `popstate` listener that redirects, opens a modal or shows "wait, before you go…" when Back is pressed | VIOLATION |
| `beforeunload` "are you sure?" prompts on ordinary content pages | Avoid. Browsers limit it, and it reads as a trap. Only for genuinely unsaved form input. |
| Ad, "recommended" or interstitial scripts that rewrite history | VIOLATION, even if a third party wrote it |
| `history.replaceState` to tidy a URL (drop `?lang=`, `?unlock=`, set `#stop-3`) | Fine. It rewrites the current entry and adds none. |
| Real in-page navigation that pushes one entry per user action (tabs, a tour step the user clicked), where Back undoes that step | Fine, if each entry is a real state the user chose |
| Exit-intent modal on mouse-leave or scroll-up that a click closes | Not this policy (the separate intrusive-interstitial rules still apply) |

## How to do it (checklist)
1. Run `timeout -k 5 120 python3 tools/back_button_check.py URL ...`. It checks the page and every same-origin script. HIGH means a popstate or beforeunload hook, MED a bare pushState or history.go(-n), INFO a replaceState. It exits 1 on any HIGH.
2. Read the context for every MED and HIGH line. A wrapper that re-calls the native function (URL rewriting) is not a push.
3. Test by hand on a phone: arrive from a Google result or a social link, press Back once, and you must land on the referrer. Repeat on the buy-path pages.
4. Before adding any third-party widget (chat, recommendations, popup builder), run the check again.
5. If a manual action ever appears: remove the code, then file a reconsideration request in Search Console.

## How we apply it to Cedwyn
- **Live check, 30 Oct 2026 ~11:28Z** (`/`, `/documentary/`, `/ebooks/cedwyn/`, `/learn/`): **no HIGH or MED patterns.** All history use is `replaceState`:
  - the home page tidies `?lang=` and sets the tour's `#stop-N`;
  - `documentary.js` v1.6.2 strips `?unlock=` and `?unlocked=` after checkout;
  - `runtime.js` v12 rewrites section paths and wraps push/replace only to fix URLs.
  All of that is fine.
- **Rule for every flywheel** (sales fix, onpage, academy, shop): no "before you go" offer on Back. Do not push a history entry to show the £4.99 v0.0.2 scene, the free v0.0.1 e-book or the Academy sign-up. Exit offers stay on mouse-leave or scroll with a visible close, and only if the existing popup skills allow them.
- The documentary unlock return from Stripe must keep using `replaceState`. A `pushState` there would let Back re-run the unlock or skip the buyer past the page they came from.
- Proposal to the onpage owner: add `back_button_check.py` to the weekly ONPAGE audit, next to `version_url_check.py`, and log the result to the audit score. No site change is needed today.

## Sources
- developers.google.com (primary, read)
- developers.google.com (malicious practices section; not re-read this run)
- andres.plashal.com (practitioner, read)
- searchenginejournal.com (news, snippet only)
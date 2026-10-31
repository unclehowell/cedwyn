# Email typo check on the signup form: warn on "gmial.com", don't block, show the address back

Topic: catch mistyped addresses on the Cedwyn signup form before they go to Mailchimp. Today a typo means the double opt-in email never arrives. The signup is lost without anyone knowing, and the bounce counts against the sending domain.
Date: 2026-10-31 (skills harvest). Free to do: about 40 lines of inline JS, no new tool or library installed.

## Evidence (primary sources, read 31 Oct 2026)
- **GOV.UK Design System, "Email addresses" pattern** (read in full). It states to: set `type="email"`, `autocomplete="email"` (needed for WCAG 2.2 SC 1.3.5) and `spellcheck="false"`; make the field show about 30 characters; allow paste. "You can check for common misspellings of popular email providers, for example 'homtail.com' instead of 'hotmail.com'. **Warn users if you detect one, but allow them to proceed** in case it's a genuine email address." Also: "confirming their address back to them so they can check and change it". And only ask people to type the address twice "if your user research shows it to be effective".
- **Mailcheck README** (github.com, MIT, read). It suggests a domain fix (`[address kept in the project workspace]` -> `[address kept in the project workspace]`). It is "a typo suggester, not an email validator": "Show a suggestion; do not silently replace an address or block someone". "Prefer no suggestion over a wrong one." The README lists GOV.UK Pay, Kickstarter, Dropbox, Khan Academy and Lyft among organisations that have used it. No before/after numbers are published there.
- **Luke Wroblewski / Etre inline-validation test** (lukew.com, A List Apart, 2009; 22 participants, so a usability test, not a field A/B test). The best inline-validation form against validate-on-submit gave: +22% success rate, -22% errors, +31% satisfaction, -42% completion time, -47% eye fixations. The A List Apart write-up states to validate *after* the user leaves the field, not on every keystroke.
- Vendor numbers seen only as snippets and **not checked**: "15% of form emails contain typos" and "nearly half of invalid sign-up emails are domain typos". Both come from email-verification sellers, so don't quote them.

## How to do it (any static site)
1. Input attributes: `type="email" autocomplete="email" spellcheck="false" autocapitalize="off" inputmode="email"`. Keep `required`.
2. On `blur` (and again on submit), check the domain against a short list of common providers: gmail.com, googlemail.com, hotmail.com, hotmail.co.uk, outlook.com, live.co.uk, yahoo.com, yahoo.co.uk, icloud.com, me.com, btinternet.com, sky.com, virginmedia.com, talktalk.net, aol.com, protonmail.com. For Patagonia readers add hotmail.com.ar, yahoo.com.ar, gmail.com.ar (a common mistake for gmail.com) and fibertel.com.ar.
3. Suggest a fix only when the domain is within edit distance 1–2 of one on the list, or the TLD is a known slip (.con, .cmo, .co for .com, .co.uk missing the .uk on hotmail/yahoo/btinternet). If there's no close match, say nothing.
4. Show the suggestion as a tappable button under the field: "Did you mean **[address kept in the project workspace]**?" Tapping it fixes the field. Never change the address without asking, and never block submit. If they submit anyway, send exactly what they typed.
5. On success, show the address back: "We've sent the confirmation to **[address kept in the project workspace]**. Wrong address? Change it." The link reopens the form with the address filled in.
6. Measure with what we already have: the Worker logs how many submits it receives. Add one counter, how many times a suggestion was shown and how many were accepted (a field in the existing submit payload, no cookies). From Mailchimp, check how many pending (unconfirmed) members there are per week before and after. Judge after 100 or more signups. Before that, the change is justified by the GOV.UK guidance alone.

Minimal JS (a sketch; test before it ships):
```js
var D=['gmail.com','googlemail.com','hotmail.com','hotmail.co.uk','outlook.com','live.co.uk','yahoo.com','yahoo.co.uk','icloud.com','me.com','btinternet.com','sky.com','virginmedia.com','talktalk.net','aol.com','protonmail.com','mail.com','gmx.com','gmx.co.uk','live.com','ymail.com','hotmail.com.ar','yahoo.com.ar','fibertel.com.ar'];
function lev(a,b){var m=[],i,j;for(i=0;i<=b.length;i++)m[i]=[i];for(j=0;j<=a.length;j++)m[0][j]=j;
 for(i=1;i<=b.length;i++)for(j=1;j<=a.length;j++){m[i][j]=Math.min(m[i-1][j]+1,m[i][j-1]+1,m[i-1][j-1]+(b[i-1]==a[j-1]?0:1));
  if(i>1&&j>1&&b[i-1]==a[j-2]&&b[i-2]==a[j-1])m[i][j]=Math.min(m[i][j],m[i-2][j-2]+1);}return m[b.length][a.length];} // swapped letters count as 1
function suggest(e){var p=e.trim().toLowerCase().split('@');if(p.length!=2||!p[1])return null;var d=p[1].replace(/\.con$|\.cmo$|\.cm$/,'.com');
 if(D.indexOf(d)>-1)return d!=p[1]?p[0]+'@'+d:null;var best=null,s=3;D.forEach(function(x){var k=lev(d,x);if(k<s){s=k;best=x}});
 return best&&s<=(d.length>9?2:1)?p[0]+'@'+best:null;}
```
Tested on this box 31 Oct with node: gmial.com, gmail.con, hotmial.co.uk, yahoo.co, btinternt.com and outlok.com all got the right suggestion. Swapped letters count as one edit, so gmial is caught. cardiff.ac.uk, wales.nhs.uk, gov.wales, bucklerfamily.estate, gmx.com and gmail.com got none. mail.com was wrongly offered gmail.com until mail.com, gmx and live.com went into the list, because a domain that is an exact match is never corrected. Rerun these tests before shipping. Genuine domains must get **no** suggestion. Add any real provider readers use to `D`.

## How we apply it to Cedwyn
Live check on 31 Oct 2026, /ebooks/ (cache-busted):
- **Form:** `/api/list/subscribe`, `novalidate`, one EMAIL field with `type=email autocomplete=email required`.
- **Missing:** `spellcheck="false"` is **missing**. The only check is a regex (`^[^@\s]+@[^@\s]+\.[^@\s]+$`), so `gmial.con` passes.
- **Success panel:** states "tap the confirm link in your email". This is double opt-in. The panel **does not show the address back**, so a typo loses the reader without them knowing.

Proposal, a small markup and JS change only, no copy change to body text:
1. In the shared lead block (data-ghf-lead, used on many pages), add `spellcheck="false" autocapitalize="off"` to `#ghf-e`.
2. Add the `suggest()` check on blur and on submit. Show it in a new `<p class="ghf-sug" aria-live="polite">` with a button that sets the value. It never blocks submit.
3. Change the success panel to start with "Sent to <strong>{address}</strong>. Not right? <button>Change it</button>". Keep the rest of the existing wording. Patagonia pages use the same pattern in Spanish: "Enviado a … ¿No es correcto? Cambiar".
4. Add `sug_shown` / `sug_taken` to the Worker's submit log. Compare the weekly pending-vs-confirmed Mailchimp counts four weeks before and after (read-only). A result only counts once there are 100 or more signups.
5. Commit through the normal Cedwyn flow when no build is running, verify at 390 px, run the tests above. This is site markup, so the editorial rules don't change. No outbound links, nothing names a person.

## Sources
- design-system.service.gov.uk
- github.com
- lukew.com
- alistapart.com
- snippets only, not checked: mailtester.com ; verify-email.app/blog/email-typo-catch-prevent
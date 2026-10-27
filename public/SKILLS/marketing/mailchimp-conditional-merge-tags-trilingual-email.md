# One trilingual email: Mailchimp conditional merge tags for EN / CY / ES readers

Skill harvested 2026-10-26 23:59 GMT (skills harvest). Scope: sending ONE campaign whose body shows English, Welsh or Spanish per reader, using a language audience field and conditional merge tag blocks. hreflang, YouTube audio tracks and the Spanish/Patagonia audience are separate skills already in the index.

## What the primary sources say (Mailchimp Help, both read 26 Oct 2026)

- Conditional merge tags support IF, ELSE, ELSEIF, IFNOT with = != > < >= <=. Example form: `*|IF:MERGE=value|* ... *|ELSEIF:MERGE=value|* ... *|ELSE:|* ... *|END:IF|*`.
- They work with **audience fields and groups, not tags**. They **do not work in subject lines** (Translate page: "It's not possible to translate the subject line of your email").
- Dynamic Content (no merge tags needed) is a Standard-plan-or-higher feature; conditional merge tags are the free route (availability on our Free plan: not checked in-app; the Help page puts no plan gate on them).
- Two ways to know a reader's language: (a) `*|MC_LANGUAGE|*`, Mailchimp's detected browser language at signup/profile update/click; (b) an **audience field** the reader picks at signup.
- Mailchimp's language-code list (Translate page) has English, Irish (ga), Spanish (es = Mexico, es_ES = Spain) and others, but **no Welsh**. So MC_LANGUAGE cannot target Welsh readers; Welsh needs the audience-field route.
- Anyone with no language data (or an unlisted language) sees the ELSE block, so ELSE must be the safe default.
- `*|TRANSLATE:en|*` adds Google Translate links: machine translation, and not a substitute for real Welsh.

## Why bother (numbers)

- CSA Research press release, 7 Jul 2020 (read): 8,709 consumers in 29 countries (Kantar-vetted from 31,933): **76% prefer to buy products with information in their native language; 40% will never buy from websites in other languages.** That is a survey of stated preference, not measured purchases, and covers no Welsh speakers (not checked for our readers).
- No public test of trilingual vs English-only campaigns for a small heritage list was found (not checked). Treat it as service, not a proven lift.

## How to do it

1. Audience > Settings > Audience fields: add a radio field `LANGUAGE` (merge tag LANGUAGE), values `English`, `Cymraeg`, `Español`, default English. Do not make it required (fewer form fields = more signups).
2. Add the choice to the signup form(s) and the preference centre (email-preference-centre-snooze-topics.md); embedded forms post it as `LANGUAGE`.
3. Backfill nobody by guesswork: existing contacts stay blank and see English (ELSE).
4. In each text block:
```
*|IF:LANGUAGE=Cymraeg|*
[Welsh text, written or checked by a Welsh speaker]
*|ELSEIF:LANGUAGE=Español|*
[Spanish text]
*|ELSE:|*
[English text]
*|END:IF|*
```
   Keep the three versions the same length and with the same links (one CTA each, with the same UTM so the funnel reads cleanly).
5. Subject line can't vary: use a short bilingual subject (e.g. English | Cymraeg). Put the language-specific hook in the first body line instead. Whether the preview-text field accepts conditional tags is not checked: test it on a seed send before relying on it.
6. Send test emails to three seed addresses, each with a different LANGUAGE value; check every block on a phone. Stray line breaks around tags are a known editor quirk (r/MailChimp thread): put tags on their own lines in a code/text block and preview.
7. Read the click report split by LANGUAGE (segment by field) after each send.

## How we apply it to Cedwyn

- The live audience (the project workspace, 26 Oct) has merge fields UTMSRC, UTMCMP and CONSENT only: **no language field**. The site already runs a cy/en/es language picker, so the signup form can pass the visitor's current site language as a hidden default and let them change it.
- Welsh text only where a real translation exists (same rule as the hreflang skill); otherwise Welsh readers get the English block plus one Welsh greeting line, never machine Welsh.
- Spanish blocks serve the Patagonia readers (spanish-patagonia-audience.md); use es (Latin American) wording, not es_ES.
- Adding a field changes the signup form and the email journey: a PROPOSAL for the project lead (append to the project workspace: "LANGUAGE field + trilingual blocks in the welcome email"). No send without his yes. Public text never names the project lead; banned public words apply in all three languages.

## Sources

- mailchimp.com (read)
- mailchimp.com (read; language-code list)
- csa-research.com (read; 2020 press release)
- reddit.com (snippet only; line-break quirk, not checked)
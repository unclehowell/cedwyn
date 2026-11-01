# ICO data protection fee + register entry: the check before growing the mailing list

Written 31 Oct 2026 (skills harvest ~20:47Z). Area: email marketing prerequisites, trust, UK data protection. Before this run "data protection fee" and "ico fee" had 0 skill-file hits. Privacy wording, PECR consent, list hygiene and the dark-pattern audit are covered elsewhere (dark-pattern-self-audit-buy-join-path-cma-oca-ico-cookies.md, cold-email-deliverability-uk-pecr.md, list-hygiene-spam-traps-address-sourcing-sunset-rule.md). This file is the one admin step underneath all of them.

## What the ICO states (primary; ico.org.uk timed out from this box, read via Wayback captures)
**Fee tiers** (Guide to the data protection fee, capture 30 Sep 2026):
- Tier 1 (micro): turnover up to £632,000 or no more than 10 staff. **£52**.
- Tier 2: up to £36m or 250 staff. £78.
- Tier 3: everyone else. £3,763.
- "We regard all controllers as eligible to pay a fee in tier 3 unless and until they tell us otherwise."
- **Direct debit takes £5 off**, so tier 1 is £47 a year.

**Exemptions** (Exemptions page, capture 25 Feb 2026): no fee is due if you process personal data **only** for one or more of:
- staff administration;
- advertising, marketing and public relations;
- accounts and records;
- not-for-profit purposes;
- personal, family or household affairs;
- a few others (public register, judicial, non-automated).

The ICO adds: "even if you are exempt from paying a fee, you still need to comply with your other data protection obligations."

**Penalty:** the maximum is **£4,350** (150% of the old tier 3 fee). This figure is from the ICO penalties page snippet and two practitioner blogs; the page itself was not read.

**Register:** GOV.UK (read) states the controller's details are published on the ICO's public register, and you register and pay through the ICO service. Helpline: [number kept in the project workspace].

## Why "marketing only" rarely saves a small publisher
- The marketing exemption covers you only if marketing, accounts and staff admin are **all** you do with personal data.
- Selling to named buyers and keeping their order records falls under accounts and records.
- But keeping a CRM of outside contacts for research outreach is beyond those purposes, and so is processing correspondents' details for a research archive or publishing material about living people.
- Practitioner guides (tinytax, Briffa, accountancy blogs; snippets) agree that most trading micro-businesses with a computer-held customer list pay tier 1.
- **Our reading, not legal advice.** The ICO's own self-assessment gives the binding answer in about 5 minutes.

## The playbook
1. **Look up the controller on the ICO public register** by name and company number before you scale any list.
2. **If it's not there, run the ICO self-assessment** (registration self-assessment, linked from the Exemptions page). Save a screenshot of the answer with the date. That record shows you checked, even if the answer is "exempt".
3. **If a fee is due:** tier 1, pay by direct debit (£47), renew yearly.
   - Put the registration number in the privacy notice under "Who we are".
   - Renewal goes to the contact email given at registration, so use a monitored role address.
4. **Make the details match everywhere:** the same legal name and company number on the privacy notice, terms, Stripe account, Mailchimp account footer and the ICO register. A mismatch is what a cautious buyer or a payment provider notices first.
5. **Re-check when the processing changes:** a new paid membership, a new CRM, contributor uploads, or publishing material about living people.

## How we apply it to Cedwyn (PROPOSALS, need the project lead's GO; nothing changed, nothing paid)
- **Controller named on /privacy/ (v1.0.0, 30 Oct 2026):** DATRO Consortium Limited, company 13775817.
- **Its processing:**
  - Mailchimp double opt-in list;
  - Stripe and Gumroad buyers;
  - Academy members;
  - a HubSpot CRM of institutional contacts for research outreach;
  - Cloudflare logs.
- **On our reading that is beyond "marketing + accounts only", so tier 1 (£52, or £47 by direct debit) is likely due.** Not checked against the register: the ICO site did not answer from this box.
- **P1.** Search the ICO register for "DATRO Consortium" / 13775817 from a normal browser, and log the result (registration number or none) in the project workspace
- **P2.** If none, the project lead (as a director) runs the self-assessment and, if it states so, pays the £47 direct debit. **This is a spend only he can authorise.** It is a statutory fee, not a payment for disclosure, so his never-pay-for-disclosure rule does not cover it. Ask him plainly.
- **P3.** Once a number exists, add "ICO registration: Z…" to /privacy/ under "Who we are" and bump the version to 1.0.1 with a changelog row. It also goes in the planned /terms/ page (terms-refunds-pages-uk-ebook-academy-wording.md).
- **Why it matters for growth:** A registered controller is a basic trust check that cautious buyers, archive partners and grant reviewers can run in seconds (our reasoning; no survey behind it). It costs £47 a year against a penalty of up to £4,350.

## Sources
- web.archive.org (read)
- web.archive.org (read)
- ico.org.uk (search snippet only: "maximum penalty is a £4,350 fine")
- gov.uk (read)
- briffa.com ; tinytax.co.uk (snippets, practitioner)
- cedwyn.bucklerfamily.estate (read, live 31 Oct 2026)
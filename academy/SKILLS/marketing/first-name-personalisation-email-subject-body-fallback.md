# First-name personalisation in email: where it earns its place, and where it doesn't

Harvested 27 Oct 2026 (skills harvest). Every number below is from a source I read that night.

## Evidence
- **Sahni, Wheeler & Chintagunta, Marketing Science 37(2), Feb 2018** (Stanford GSB page and Chicago Booth Review, read): randomised field experiments with **millions of recipients** across three organisations (an online test-prep firm, MercadoLibre, Stanford). Adding the recipient's name to the subject line raised **opens 20% (9.05% -> 10.80%)**, **sales leads 31% (0.39% -> 0.51%)**, and cut **unsubscribes 17% (1.2% -> 1.0%)**. In one campaign: +35 leads, 85 fewer unsubscribes; the firm then adopted names in subject lines. A discount raised leads **only when the email was personalised**. Mechanism: the name makes people process the rest of the message more. Caveat: pre-Apple Mail Privacy Protection, so its open rates are real human opens, and the lift in leads is the part that still matters.
- **Attentive, billions of subject lines incl. Cyber Week 2025** (read): in **triggered** emails (welcome, browse, cart) personalisation helps, most with past purchasers; product name is the strongest token, then first name; full name in the subject is the worst performer because it pushes the message out of the preview. In **campaigns** (newsletters, broadcasts), name in subject showed "no meaningful improvement": keep it for the body. Previous purchasers beat never-purchased segments by 13%+ whether personalised or not. Audience targeting beats any subject trick.
- Opens are unreliable since Apple MPP (see email-subject-lines-preview-text-mpp.md), so **judge on clicks, replies and sales**, never opens.

**Reading the two together:** a name works when the message is one-to-one in feel (welcome, delivery, replies, one person writing to one reader). In a broadcast it's neutral at best. Both sources agree that a wrong or broken name ("Hi ,", "Hi JOHN", "Hi [address kept in the project workspace]") is worse than none (Attentive on full-name length; the rest is common sense, not measured).

## How to do it
1. **Collect it optionally**, one field, `autocomplete="given-name"`. Never make it required on a small list (each extra required field costs signups; see email-signup-forms-popups-timing.md).
2. **Clean before use.** Run `tools/fname_check.py audience.csv` on the Mailchimp export: it flags blanks, emails typed into the name field, single letters, ALL CAPS/all lower, digits, and shows the casing fix. Fix in Mailchimp (or leave blank), never guess.
3. **Never ship a bare tag.** In Mailchimp use the conditional block:
   `*|IF:FNAME|*Hi *|FNAME|*,*|ELSE:|*Hello,*|END:IF|*`
   (IF/ELSE/END:IF syntax from Mailchimp's conditional merge tag help). Also set the audience **Default merge tag value** for FNAME (Audience fields > Edit) as a backstop. `fname_check.py --template email.html` flags any FNAME tag not wrapped in IF.
4. **Where to put it:** subject line only in triggered one-to-one emails (welcome E0/E1, delivery, reply follow-ups). Body greeting everywhere it's clean. Not in broadcast subject lines.
5. **Test it honestly on a small list:** alternate name/no-name subject per welcome cohort for 6–8 cohorts; compare clicks/delivered and UTM-tagged sales (utm_content=name|noname). Below about 200 recipients per arm, treat any difference as noise (tools/ab_stats.py).
6. **Cold or institutional email** (FOI officers, archivists, editors): a named person ("Dear Ms Rees") beats "Dear Sir/Madam" only when the name is from their own published page or a previous reply. A wrong name or wrong title costs more than a role greeting ("Dear Information Governance team").

## How we apply it to Cedwyn
- The signup form in the project workspace already collects **FNAME (optional)** with autocomplete. Keep it optional.
- The unsent welcome/nurture drafts: wrap every greeting in the IF block above; put the name in the **subject** of E0 (delivery) and E1 only, not in later broadcasts. Pair with the letter-style format (plain-text-vs-html-email-letter-style-test.md).
- Before the first send, export the audience and run fname_check.py (0 subscribers as of 27 Oct, so it's a 10-second check now and a habit later).
- Hive/HubSpot drafts to institutions: greeting rule 6. A named officer only from their own page or reply, otherwise the team name.
- No install, no spend. Changing the drafts is the email owner's job; this file is the rule.

## Sources (read 27 Oct 2026)
- gsb.stanford.edu
- chicagobooth.edu
- attentive.com
- mailchimp.com , mailchimp.com
# Auto-replies and institutional acknowledgements: tell machine from human by the headers (RFC 3834)

Written 2026-10-31 ~20:30Z (skills harvest). Complements cold-email-reply-triage-first-72-hours.md, which classifies by BODY words; this one classifies by HEADERS first, then captures what an institution's auto-ack actually gives us (a reference number and a clock).

## Why it matters tonight
About 30 case emails left the project lead's Gmail on 31 Oct (sent-log.md). Public bodies (HMLR, TNA, Vale FOI unit, GLD, Companies House) answer within seconds with automated acknowledgements, and some staff are on leave. An auto-ack is a receipt, not evidence and not a reply. Counting it as a reply inflates reply rate; answering it can start a mail loop; ignoring it loses the case reference we need for every chase.

## The facts (primary sources)
- RFC 3834 (IETF Standards Track, K. Moore, Aug 2004; read): an automatic response SHOULD carry `Auto-Submitted: auto-replied`. Values are `no`, `auto-generated`, `auto-replied` or an extension, optionally followed by `;` parameters. Responders SHOULD NOT reply to any message whose Auto-Submitted is anything other than `no`.
- RFC 3834: "away from my mail" responders SHOULD NOT send the same response to the same sender more than once in several days; 7 days is the RECOMMENDED default. So a second OOO from the same person within a week usually will not come: absence of a second OOO is not proof they are back.
- RFC 3834: `Precedence` is not a standard field and its use varies; do not rely on it alone.
- Nylas cookbook "Detect out-of-office and auto-replies" (updated 14 Jun 2026; read): header check first (Auto-Submitted any value except `no`; `X-Autoreply: yes`; `X-Autorespond` present; Microsoft `X-Auto-Response-Suppress: All/OOF`), then a localized subject check ("Automatic reply", "Out of office") only as a fallback, because older IMAP/vacation setups send without headers and subject-only matching misfires. Its line "auto-reply rates around 8 to 15 percent of all responses during holiday periods" names no study: not checked, do not quote.
- Gmail Help 22839 (read): many bounces from invalid addresses can block sending for up to 24 h, so bounces (mailer-daemon / delivery status notification, RFC 3464) are a separate class with a separate action: fix or remove the address.

## Playbook
1. Fetch each inbound reply WITH full headers (the connected Gmail returns payload headers; ask for format=full/metadata, not just the snippet).
2. Classify in this order: BOUNCE (From mailer-daemon/postmaster or Content-Type multipart/report; report-type=delivery-status) > AUTO (Auto-Submitted != no, X-Autoreply, X-Autorespond, X-Auto-Response-Suppress, or `List-Id`/`Precedence: bulk|list|auto_reply`) > subject fallback (Automatic reply / Out of office / Absence / Ateb awtomatig / Allan o'r swyddfa) > HUMAN.
3. For AUTO, split two kinds:
   - ACK (organisation receipt): capture the reference (patterns like CAS-123456, 00211722, COH1234567X, D260928, IR/xx), the promised clock ("within 20 working days", "5 working days"), and the addresses it states to use. Write them to the HubSpot task as one dated line. The statutory clock runs from receipt (FOI s10: 20 working days; EIR reg 5: 20 working days; UK GDPR SAR: one month), not from the ack.
   - OOO (person away): capture the return date and any named alternative contact. Do not resend the email. Set the follow-up for return date + 2 working days. If an alternative contact is named for urgent matters, that is a decision for the case owner, not an automatic forward.
4. Never reply to an AUTO message (loop rule). Never mark a task "replied" on an AUTO. Reply rate = HUMAN / (sent - BOUNCE).
5. Weekly: count per organisation sent / ack / OOO / human / bounce; an org that only ever acks and never answers by the statutory date is a chase or complaint candidate (cold-email-follow-up-cadence-small-uk-b2b-list.md for cadence).

## Tool
`tools/auto_reply_headers.py` (own, stdlib, written this run, nothing installed): reads a JSON list of messages ({"headers":{...} or [{"name","value"}], "subject", "snippet"/"body", "from"}) on stdin or a file and prints class (BOUNCE/AUTO_ACK/AUTO_OOO/HUMAN), the signal that decided it, references found and a return date if stated. Run before reply_triage.py; only HUMAN goes on to body triage.

## How we apply it to Cedwyn / the case
- EMAIL INGEST (the project workspace) already logs auto-acks as receipts (root rule 19:59Z). PROPOSED (needs the project lead's GO only if it changes what the site shows; internal logging needs none): add the header check so ingest records the ack reference and the statutory due date on the matching HubSpot task automatically, and keeps acks out of MR_CANDIDATES / catalogue candidates.
- The 08:00 morning brief should list human replies only; acks become one count line ("9 acknowledgements, refs logged").
- Reader mail to [address kept in the project workspace]: our own future auto-ack (reader-enquiry-response-time-auto-acknowledgement.md) MUST carry `Auto-Submitted: auto-replied` and follow the 7-day once-per-sender rule, so it never loops with an institution's responder.
- Contact nobody; this changes classification only.

## Sources
- rfc-editor.org (read)
- developer.nylas.com (read, updated 14 Jun 2026)
- support.google.com (read)
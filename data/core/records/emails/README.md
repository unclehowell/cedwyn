# Email records (kind `email`, ids in the EV series: EV-0906 …)

Each email in the case correspondence is a catalogue record of its own: one message, one catalogue id, one page at
`https://bucklerfamily.estate/catalogue/?id=EV-0906`. Added 10 November 2026 under core schema 0.4.0 (additive: new kind `email`,
new `email` block). No existing record is changed.

## Numbering
One numbering format throughout the catalogue (owner's decision, 10 November 2026): emails continue the EV series after the highest
EV in use (EV-0905), so the 1138 messages are EV-0906 to EV-2045, in date order. The two withheld digit strings are skipped as numbers.
Ids are PREFIX-NNNN, padded to at least four digits; past 9999 they simply get longer (EV-10000 … EV-1000000), and existing ids are never
re-padded. Always sort ids by their number, not as text. Ids are never reused.

## Files
- `index.json` — metadata only, one row per record: id, timestamp, direction, correspondent(s), sender as shown, subject line, thread, whether
  the transcript is public, the part that holds the record, attachment count, message id, linked EV request record, redaction count, headers only (1 for subject-access correspondence).
  Read-models (the ERP, the email archive) read this.
- `emails-01.json` … `emails-23.json` — the records (core schema), in date order, about 350 KB each.

## Counts (build of 2026-11-10)
- 1138 records, EV-0906 to EV-2045: 1056 from the email archive (with its text) and 82 from the case-mail index that the archive does not
  hold yet (metadata only, transcript "not yet transcribed").
- Every message is shown. Subject-access correspondence (32 messages) shows its headers only (sender, date, subject line) and no
  transcript; 1025 other transcripts are public. A copy of any original can be requested through the catalogue.
- Redaction: 780 records carry 6470 black-blocked passages, the minimum for public display:
  email addresses, phone numbers, postal addresses, personal data, names of private individuals, the house word list and the two withheld
  digit strings, plus the mail-client image tags, numbers and phrases the editorial lint rejects. The originals are not published anywhere in this repository; a copy can be requested through the catalogue.

## Dedupe (nothing is catalogued twice)
1. Same mailbox message id (`gm-…`) in more than one source: kept once.
2. Otherwise the same timestamp to the minute, sender and subject (normalised; "Re:"/"Fwd:" removed). Index rows carry no sender, so they
   match on the exact timestamp, correspondent and subject. Separate sends of one letter to different bodies stay separate records.
The second key is stored on each record as `email.dedupe_key`.

## Rules
Additive only: a change to an existing email record goes as a pull request labelled `catalogue-change`.

— Cedwyn editors

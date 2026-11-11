# Language Forensics

A dedicated Cedwyn Estate research workbench for close reading of legal and historical language in the Great House Farm / Tŷ Mawr record.

**Live route:** https://bucklerfamily.estate/language-forensics/  
**Estate slot:** 57 of 59  
**Source repository:** unclehowell/coming-soon-57

## Purpose

Trace how a word enters the record, who uses it, what it changes, and whether the original document supports the meaning later attached to it. The app is designed to keep separate:

- exact wording and later paraphrase;
- author, recipient, speaker and institutional authority;
- offer, receipt, acceptance, signature, refusal and legal effect;
- physical occupation, possession, tenancy, licence and ownership;
- the historic parcel description and a modern parcel crosswalk;
- a party's allegation, a witness's testimony, a press report and a judicial finding.

## Included tools

Since v1.1.0 every tool is driven by an accessible dropdown (keyboard: arrows, Home/End, Enter, Escape) of the contested words, passages and propositions held in the app, grouped by theme, with an “Other…” field and Submit inside each list for custom wording. Each word opens a word card: other wording available, connotation, sense at the date, dated uses with catalogue IDs, how the wording shifted, what it stands on and where it may be wrong.


- Phrase audit: flags terms and linguistic features for source review.
- Wording comparison: finds terms present only in one passage and groups possible changes in ownership, permission, occupation and land scope.
- Term register: working definitions, non-inferences and source checks.
- Claim test: structured record of exact source, provenance, what it supports, what it does not establish, contrary material and missing evidence.
- 1974 case file: a sourced chronology of the BP licence letters and associated proceedings.

The browser-side analysis is local to the visitor's browser. The app does not send pasted passages to an external analysis service. Working fields may be stored in local browser storage until cleared.

## Evidence discipline

This tool is an aid to research, not a legal opinion or a finding of misconduct. A wording difference does not by itself prove intention, fraud, concealment, collusion or procedural unfairness. Serious allegations remain hypotheses until the act, actor, knowledge, materiality, causation and independent corroboration are established.

The app preserves the distinction between the Court of Appeal's treatment of the 1974 letters for the adverse-possession issue and the separate question of the underlying title chain and parcel scope. It also records unresolved identity and source gaps rather than resolving them by assumption.

## Build and deployment

The estate's central build reads this repository as a dedicated source for the `language-forensics` theme and publishes it through the existing Cedwyn Pages project. The navigation counter and slot bar are generated from the central estate registry, not hard-coded here.

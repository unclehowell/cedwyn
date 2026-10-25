# Cedwyn editorial and forensic provenance rules

Adopted 25 October 2026. These rules apply to every theme, caption, catalogue record, chronology entry, map, exhibit, interpretation, and build output.

## Purpose

Cedwyn is a central, chronological catalogue of source artifacts and the research built from them. It must allow research to continue when records are still sought, while making it impossible to confuse a missing-record hypothesis, a description of a document, or an analyst's interpretation with the document itself.

The archive is not a verdict. It can preserve competing explanations, including the family's concerns about possible fraud or concealment, alongside ordinary lawful explanations, procedural limits, contrary material and gaps. Allegations may be recorded when attributed and clearly labelled; they must not silently become factual narration.

## Four separate record types

1. **Source record** — a located artifact or a specific public-source page. Describe what the item is, who created/published/holds it, its dates, provenance, completeness, access route and read status. A description is not the artifact and cannot substitute for it.
2. **Interpretation** — an analyst's reading of one or more source records. Cite source IDs and precise page/paragraph/folio/line pinpoints where available. State both what the material supports and what it does not establish; include contrary evidence, alternative explanations, unresolved questions, and what would confirm or refute the reading.
3. **Expected/missing-record lead** — a retrieval target, not a source. It must be prominently labelled **NOT A LOCATED ARTIFACT**. State why it is sought, candidate custodians (not confirmed custodians unless proven), search scope/status, and what it could support or refute. These records are useful interim planning and must not be cited as though the anticipated document exists or says anything.
4. **Monitored public page** — a URL and its observed response history. A URL, a Wayback calendar, a failed fetch, a hash change, or a save request is not by itself a confirmed archival snapshot or proof of motive. Save a timestamped snapshot URL only when its existence has been verified.

## Source and citation rules

- Every material factual proposition should link to the underlying artifact or best available copy, not merely to a summary or to another page repeating the same account.
- Record the public URL, the Wayback snapshot URL if confirmed, and the Wayback calendar/search URL when relevant. If no snapshot is confirmed, say so explicitly and keep the calendar link labelled as a search interface.
- For email disclosures, record message date, sender, recipient, subject, disclosure/reference number, exact attachment filename, byte length and SHA-256 hash, plus whether the email and every attachment have been preserved. Each attachment is its own artifact.
- Mirrors, excerpts, downloads, scans, OCR, transcriptions and quotes derived from one original share an `independent_origin_id`. Multiple copies are not independent corroboration.
- Separate document date, event date, discovery date, access/disclosure date, capture date and amendment-observation date.
- Preserve original spelling and pagination. Mark OCR/transcription corrections; distinguish quote from paraphrase and inference.
- State the search scope behind negative results. Use precise language: “not found in the sources searched”, “not located in the disclosed bundle”, “custodian replied not held”, “not published”, “recorded as disposed under [schedule]”, “withheld under [basis]”, or “unknown”. Do not infer concealment, destruction or non-existence from a failed search.
- A public legal judgment is authoritative for what the court decided and the reasons it gave. Its narrative of earlier events is not a second independent copy of every deed, letter or map it describes. Locate original or best surviving antecedent documents separately.
- Every interpretation must identify legal/procedural scope. Do not infer that title, possession, adverse possession, licence, first registration, a village-green entry, planning permission, listed status, archaeological importance and a human-rights admissibility decision are interchangeable.

## Interim/speculative work is allowed

Use visible statuses, including **Located and read**, **Located; not yet read**, **Public transcription**, **Family testimony**, **Working interpretation**, **Speculative lead**, **Expected record — not located**, **Not found in stated search**, **Custodian confirmed not held**, **Withheld**, and **Disposition record located**. Choose the closest accurate status; do not upgrade status merely because an entry is old or repeatedly copied.

A hypothesis can be valuable before it is proven. It must name its supporting sources, the evidence against or limitations, an ordinary alternative explanation, the discriminating record that would resolve it, and what result would weaken or refute it. Do not invent confidence percentages; use calibrated terms such as Established, Strongly supported, Probable, Plausible, Unsupported, Refuted, or Unresolved, and explain the basis.

## Neutrality, allegations and people

- Attribute allegations: identify who made them, when, in what document or statement, and the scope of what was said. Terms such as “fraud”, “concealment”, “lawfare”, “collusion” or “conspiracy” may appear in quotations, search terms or explicitly labelled hypotheses; they must not appear as established findings without adequate supporting material.
- Do not use a theme's narrative voice to make public bodies or private parties into antagonists. Assess acts, duties, dates and outcomes against records; include evidence against the preferred explanation.
- Distinguish mistake, incomplete record, negligence, maladministration, unlawfulness, dishonesty and coordinated action. They require different evidence.
- Treat family testimony respectfully and preserve its provenance, but label it as testimony where it is not independently corroborated. Conversely, absence of independent corroboration is not proof that testimony is false.
- Keep personal data, private addresses and unrelated family holdings out of public displays unless publication is necessary, lawful and appropriately reviewed.

## Themes, autonomy and safe change

Themes are different ways to explore the same source catalogue—not 37 different versions of the facts. A theme may change presentation or offer a distinct learning activity, but source descriptions, source IDs, source hashes, chronology, status labels and provenance rules are shared. The public sees the same citations and the same uncertainty labels whichever exhibit they enter.

Changes to an individual exhibit should be isolated to its theme and submitted as a reviewable pull request. Catalogue schema, source provenance, editorial standards, navigation/runtime, build/deployment workflows, secrets handling, shared theme registry and public institutional-page monitoring are protected central components. Do not modify those in a theme-only change. Do not delete old content/history or silently replace a source: add a new version, record the change and preserve the previous state. Keep the datro repository untouched by Cedwyn builds.

## Build review checklist

Before publication, check: each source has a stable ID and origin ID; source description and interpretation are separate; material claims have pinpoints; expected records are not represented as located sources; the strongest benign explanation and contrary evidence are present; absence language reflects the actual search; named persons/institutions are described neutrally; public URLs and confirmed snapshot URLs are distinguished; and the change log names the exact files/theme and version.

# BASE and CORE open-access aggregators for a Zenodo copy of the free edition (GATE)

Checked 31 Oct 2026. Read directly: the CORE Data Provider's Guide (sections 3.1.1-3.3.2, 4.1-4.3). The BASE site sits behind a bot check (Anubis) from this machine, so BASE facts come from its own pages as shown in search previews, plus BASE's EOSC 2022 poster on Zenodo (preview). Builds on zenodo-doi-scholar-argentine-repositories.md and the Knowledge Commons vs Zenodo skill; it does not repeat them.

## What the sources say
- **BASE** (Bielefeld University Library): "more than 480 million records from more than 12,200 content providers", about 60% with free full text (BASE About page, preview). It indexes "the metadata of all types of scholarly resources ... that have an OAI interface" (BASE EOSC 2022 poster, preview), and it is itself an OAI service. A content provider is a *repository* with an OAI-PMH interface; individuals do not submit items.
- **CORE** (Open University / Jisc): it aggregates from thousands of data providers "including ZENODO, PubMed Central" (Knoth et al. 2023, *Scientific Data*, preview; PMC blocks this machine). Registering as a provider (read) needs **an OAI-PMH base URL that passes the validator**, Dublin Core metadata at minimum (RIOXX v3 recommended), and an **institutional email**. The full text must sit **on the same domain** as the OAI endpoint; subdomains or other domains need an exception by contact. Indexing goes into a queue, its time "can vary", and the contact is emailed when it finishes, after which the Dashboard can be claimed.

## What that means for us
1. **We do not register anything.** cedwyn.bucklerfamily.estate is a static site with no OAI-PMH endpoint and no institutional email. CORE's rules (validator, institutional contact, same-domain full text) shut out a one-site publisher. Building an OAI-PMH endpoint for a handful of PDFs is not worth it.
2. **The aggregators come free with a Zenodo deposit.** Zenodo exposes OAI-PMH (see the Zenodo skill). CORE lists Zenodo as a source (Knoth 2023), and BASE harvests OAI repositories. **Whether BASE harvests Zenodo is likely but not checked**, because BASE's source list is behind the bot check. One deposit gives a DOI plus listings in Zenodo, OpenAIRE, CORE and probably BASE, where academic searchers and library discovery layers look.
3. **Metadata decides findability there.** Aggregators show what the deposit states: title, creators (the organisation name, per the Zenodo skill), description, keywords, language, licence and related identifiers. Put the place-name variants (Llandough / Llandochau, Leckwith / Lecwydd, Great House / Tŷ Mawr) in keywords and the description, plus an "is supplemented by" or "is identical to" link to the canonical /ebooks/ page. No shop wording, no prices.
4. **Timing:** neither source gives a number. Measure it: search core.ac.uk and base-search.net for the exact title at week 2, 4 and 8 after deposit, and note which listed it and when.

## How to do it (once a Zenodo deposit exists)
1. Deposit the free edition only, never the paid e-book, as a single canonical record (one DOI per work). Use a CC licence chosen by the owner, and fill keywords and related identifiers as in point 3 above.
2. Do nothing at BASE or CORE. Do not submit, register or email them.
3. At weeks 2, 4 and 8, search both by exact title and by DOI and log the result in the project workspace If CORE is missing after 8 weeks, look in CORE for other Zenodo records of the same month to see whether harvesting has lagged in general.
4. Add the aggregator listing URLs to the evidence or research page's "also available at" line, as plain text in line with the no-outbound-links rule.

## How we apply it to Cedwyn
- **Gate:** the Zenodo deposit itself is still the project lead's decision (an account plus a CC licence; see the Zenodo skill). This skill adds **no new action and no account**. It only states that BASE/CORE listing follows from a deposit, how to word the metadata so aggregator searchers find it, and how to measure it.
- Effect on sales is expected to be small and indirect. The audience is academics and librarians who find a free, citable copy, and the deposit's description can name /ebooks/ as the home of later editions.
- **Kill rule:** if neither aggregator shows the record by week 8 and Zenodo views stay under 50, stop checking.

## Sources
- core.ac.uk (OAI-PMH validator, institutional email, same-domain full text, indexing queue; read 31 Oct 2026)
- pmc.ncbi.nlm.nih.gov (Knoth et al. 2023, CORE sources include Zenodo; search preview only, PMC returned 403)
- base-search.net (480M+ records, 12,200+ providers, about 60% full text; preview only, bot check)
- zenodo.org (BASE EOSC Symposium 2022 poster: indexes OAI-interface sources; preview)
- oai.base-search.net (BASE is itself an OAI-PMH service; preview)
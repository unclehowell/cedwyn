# Hugging Face and Kaggle copies of our open tables: a second home for the catalogue data

Written 31 Oct 2026 by the skills harvest. Status: proposal. Neither account exists yet, and Hugging Face is not a connected app. The index had 0 skill files for this before (only the "ideas left" line).

## Why it matters
- The Hugging Face Hub is where machine-learning people, digital humanities researchers and AI tooling look for ready tables. A dataset repo there gets a browsable viewer, an SQL console and a shareable row link without us building anything.
- Zenodo (DOI, scholars) and dataset JSON-LD (Google Dataset Search) are already covered (`zenodo-doi-scholar-argentine-repositories.md`, `dataset-structured-data-google-dataset-search-evidence-catalogue.md`). This skill is the third copy, aimed at the ML and GLAM-data crowd. It links back to the canonical page on Cedwyn.

## What the sources show
- **The documentation gap is the lever.** Yang, Liang and Zou (Stanford/Cornell, arXiv 2401.13822, read) analysed Hugging Face dataset cards. 86.0% of the top 100 downloaded datasets fill out every section the community card suggests, against 7.9% of datasets with no downloads. Description and Structure make up 36.2% and 33.6% of total card length. This is a correlation, not proof that a full card causes downloads, but every popular dataset has one.
- **Realistic numbers for heritage data.** We read the BigLAM org (Libraries, Archives and Museums community on the Hub, 232 followers, 70 members) through the public API on 31 Oct 2026. Its 64 datasets had a median of 98 downloads in the last 30 days, ranging from 4 (bnl-monographs) to 8,344 (AmericanStories-parquet). British Library Book Images had 4,150 downloads and 65 likes, with licence cc0-1.0. A small Welsh-farm table should expect tens of downloads a month, not thousands.
- **How downloads are counted** (HF docs, read): since September 2024 the Hub counts file GET/HEAD requests server-side and collects no user information. Before that it counted `load_dataset` calls only. Downloads are a crude signal, not readers.
- **The viewer** (HF docs, read) auto-converts CSV/JSON to Parquet. It gives full-text search, filtering, an SQL console (DuckDB) and a URL per row (`.../viewer/<config>/<split>?row=N`). Search and sort are limited to the first 5 GB, which is far beyond our size.
- **Card mechanics** (HF docs, read): README.md with a YAML header (`license`, `language`, `pretty_name`, `tags`, `size_categories`, `task_categories`, `configs`). Free public storage is "best-effort". HF asks that large uploads be useful to the community.
- **Kaggle:** a dataset's usability score rises with the information supplied (provenance, expected update frequency, column descriptions, licence, cover image). That comes from the Kaggle forum snippet only; the page body didn't load, so it isn't checked. Kaggle's audience is students and data-science learners. Treat it as optional.

## How to do it (about 45 minutes once an account exists)
1. **Pick tables that are already public on our own site.** Copy, never originate: every row must already be live on Cedwyn with a catalogue ID. CSV with one row per record.
2. **Columns:** `catalogue_id, date_iso, date_text, record_type, title, holder_institution, holder_reference, place, summary_neutral, page_url`. `page_url` is the canonical Cedwyn evidence page, so each viewer row leads back to us.
3. **Write the card using the full community sections,** because the 86% vs 7.9% gap is the whole point:
   - Dataset Description: what it is, the period it covers, who compiled it (the Cedwyn project, never a person's name).
   - Dataset Structure: one line per column.
   - Source Data: the holding institutions and references.
   - Considerations: gaps, Welsh/English spellings, "not checked" rows.
   - Licensing: CC BY 4.0 for our own compilation text. Facts are not ours to license. Never relicense an institution's images; link to them instead.
   - Citation: a BibTeX block citing the Cedwyn page, plus the Zenodo DOI once one exists.
4. **YAML header:** `license: cc-by-4.0`, `language: [en, cy]`, `tags: [glam, digital-humanities-research, local-history, wales]`, `size_categories: n<1K`.
5. **Upload.** The repo name matches the Cedwyn slug (for example `cedwyn-estate/llandough-chronology`). Add the dataset to the BigLAM collection only if they accept it; it is a request, not a right.
6. **Link both ways.** Add a "Also on Hugging Face" line on the Cedwyn dataset page and a `sameAs` in its Dataset JSON-LD. The card links to the Cedwyn page first.
7. **Keep the copies in step.** Each time the canonical CSV changes, re-upload with a version line (`v2026.11.1`) at the top of the card. A stale mirror is worse than none.

## How we apply it to Cedwyn
- **First table:** the public chronology/timeline rows already behind `/research/timeline/` and `/api/catalogue`. They're already neutral, dated and catalogue-ID'd. Second table: the not-held/missing-records register, using the public wording only.
- **Editorial filter before upload:**
  - Run the existing banned-word scan on the CSV and the card (states, assertions, per, second-hand report, not checked, reported, deception, taken; write "not checked").
  - No names of living private people, no family holdings or addresses, no insignia. Never name the project lead.
  - Llandough Farm is not Great House Farm.
  - The case table stays off: only records, not arguments.
- **Account:** the account is free, but someone has to create the "cedwyn-estate" org on Hugging Face (and optionally Kaggle). That needs the project lead's GO, because it opens a new public channel. Log it as a proposal in `the project workspace`, not in HubSpot.
- **Measure:** add a line to the Sunday growth report: HF 30-day downloads (public API `huggingface.co` field `downloads`, no key needed), likes, and referrals from huggingface.co in our analytics.
- **Kill rule:** under 10 downloads a month and 0 referral visits after 3 months means freeze updates and leave the card pointing at Cedwyn.
- **Tools:** nothing to install. `curl` plus Python reads the API. The upload can be done by hand in the web UI (drag a CSV), so we don't need `huggingface_hub` on this full disk.

## Sources
- arxiv.org (Yang, Liang, Zou, dataset cards on Hugging Face), read
- huggingface.co, read
- huggingface.co, read
- huggingface.co, read
- huggingface.co, read
- huggingface.co and huggingface.co (64 datasets, downloads read 31 Oct 2026)
- huggingface.co (4,150 downloads, 65 likes, cc0-1.0, read 31 Oct 2026)
- kaggle.com (usability score; search preview only, not checked)
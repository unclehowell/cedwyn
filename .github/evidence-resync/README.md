# Evidence resync (cedwyn#582)

Two scheduled workflows keep the central catalogue's intake and the webapps moving. No one has to ask for either.

| workflow | when (UTC) | what it does |
|---|---|---|
| `evidence-resync-daily.yml` | 06:20 every day | Gathers NEW evidence/artifact **candidates** from three sources: project mail (a box-side export), spills (`/spill/api/status`) and online search (Internet Archive, TNA Discovery, Wikidata; a fixed query set). Writes them to `resync/candidates/` on the orphan branch `evidence-resync` and comments on #582 when anything is new. |
| `webapps-refresh-twice-weekly.yml` | 06:40 Mon + Thu | Snapshots the central catalogue counts. If no `build-cedwyn` run is queued or running, it dispatches ONE. The build's "Data views" step regenerates every webapp's data from `data/core`. |

**Catalogue lock.** Both workflows only ADD candidates to a review file. They never write, edit, move or delete a record. They never open or merge a pull request and never apply `owner-approved`. A candidate becomes a record only through the spill / catalogue process, as a `catalogue-change` PR. The daily job never starts a site build.

**Optional keys.** Both workflows run without any secret. Repo secrets (Settings → Secrets and variables → Actions → Secrets) add a one-line scope and kind label to candidates:

| secret | tried | endpoint | default model |
|---|---|---|---|
| `NVIDIA_API_KEY` | first | `https://integrate.api.nvidia.com/v1/chat/completions` (OpenAI-compatible) | `google/gemma-3-12b-it` |
| `ANTHROPIC_API_KEY` | second | Anthropic Messages API | `claude-haiku-4-5` |
| `OPENAI_API_KEY` | third | OpenAI Chat Completions | `gpt-4o-mini` |

- The daily job labels up to 40 new online candidates. The twice-weekly job labels up to 40 candidates in `resync/candidates/latest.json` that have no label yet, so the review list reaches the Monday and Thursday build already sorted; its #582 note gives the count.
- Each label carries `by` (the provider that wrote it). Labels sit on the review list only; no record is touched.
- A provider that answers 401, 403 or 404 is switched off for that run. A 429, a 5xx or a timeout counts a strike, and three strikes switch it off. Each failed call falls through to the next provider. With no key, or none working, labelling is skipped and the run still passes.
- NVIDIA calls are spaced 1.6 s apart to stay under the free tier's 40 requests a minute.
- Repo variables (Actions → Variables) can name the model: `NVIDIA_MODEL` for NVIDIA (an `org/model` id from `https://integrate.api.nvidia.com/v1/models`), `RESYNC_LLM_MODEL` for the others. A `RESYNC_LLM_MODEL` with a slash is also used for NVIDIA when `NVIDIA_MODEL` is unset.
- Keys are read from the environment only. They are never printed, logged or written to the data branch; error lines name the provider and the HTTP status only.

**Dedupe.** The daily job checks every candidate against `/api/catalogue` (all records), the online gap finder's ledger and its own `resync/seen.json`.

**Public text.** Candidates carry titles, dates, holders and one-line summaries only. Anything with an email address, phone number, owner name, banned word or withheld date digits is dropped. The mail export already leaves out rows that need hand redaction.

**Manual runs.**
- `evidence-resync-daily`: `dry_run=true` collects and prints only.
- `webapps-refresh-twice-weekly`: `dry_run` defaults to true on a manual run, so a test never starts a build.

— Sion's Tab agent

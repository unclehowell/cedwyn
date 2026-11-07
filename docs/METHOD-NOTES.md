# Method & notes standard (convention v1.0.0, 5 Nov 2026)

Source: the owner's request of 5 Nov 2026, 15:51 GMT, with a screenshot of a well-kept research spreadsheet whose "Method & notes"
tab records how the data was made: file version and date, which procedures ran, definitions, sources, totals and exclusions, stable
IDs, per-check status counts, what is still pending, when it is re-checked, compliance, and a change log. Cedwyn adopts the same idea
for every dataset it publishes.

## Rule
Every dataset that feeds the site (a CSV, register, catalogue, `data/*.json`, a webapp's data file, a spreadsheet) carries a
**Method & notes** sheet. A reader, or an agent new to the project, must be able to see from it what the data is, how it was made,
what is not yet checked, and who changed what.

## Where it lives
- Data file in the repo: `METHOD.md` in the same folder (one per dataset; name it `<dataset>.METHOD.md` if a folder holds several).
- Spreadsheet: a tab named `Method & notes`, first or last.
- Webapp page: an (i) link beside the data's title opens the sheet (same pattern as the version-standard changelog modal).

## Required rows (Item | Detail), in this order
| Item | What goes in it |
|---|---|
| Subject | What the data covers, in one line (place, period, record type). |
| Webapp / section | The owning webapp and its slot ("NN of 59"), scope (Wales / Patagonia / Online, see SCOPES.md). |
| File | File name, semantic version, date, catalogue ID (e.g. `chronology.csv v1.4.2, 5 Nov 2026, EV-…`). |
| Framework run | The conventions applied, each with its version: VERSION-STANDARD, SCOPES, NAV, the catalogue lock, editorial rules. |
| Definitions | Link to the live master definition of each field or status. **The link wins** over any copy pasted here. |
| Sources used | URL of each source page, the date it was read, and its archived copy (/wayback/… or archive.org). |
| Totals | Count on the source, rows included, rows excluded, and why each excluded group was left out (e.g. name traps: Llandough-juxta-Cowbridge, Llandow, Aberthin). |
| Order & IDs | How rows are ordered; IDs are stable, never re-sorted, never reused. Existing records are locked (catalogue lock): changes go by pull request. |
| Previous editions | Earlier versions with links (they stay listed; see VERSION-STANDARD). |
| Progress | Rows done / total for each pass. |
| Check status | Counts per check, e.g. "confirmed 41 · probable 6 · not found 3 · not checked 12", with the reason for any gap (login wall, record closed, page gone). Never build a URL or a record that was not actually seen. |
| Cross-checks pending | What still needs comparing, and against what. |
| Date checked | Date of the last full check. |
| Re-check | The flywheel that re-checks it and its cadence (or "none"). |
| Compliance | No personal data of living private individuals; no family holdings or addresses; neutral wording; the banned-words list applies (write "not checked"). |
| Change log | One row per release: version, date, what changed with counts, changed by (agent or tool and its version), signed. Append only. |

## Wording
State what was done and what was found; never a conclusion. Unknowns are written as "not checked" or "not found", with the reason.

## Adoption
- New datasets: the sheet ships in the same commit as the data.
- Existing datasets: added by the flywheels as they next touch each dataset. A method sheet is additive; it never edits a record.

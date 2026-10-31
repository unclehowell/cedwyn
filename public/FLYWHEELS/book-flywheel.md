# Flywheel: Book search flywheel

**Cadence:** search every 59 minutes; findings table refreshed every 3 hours  
**Goal prefix (duplicate check):** `BOOK FLYWHEEL RUN`  
**Runner:** `work/book-flywheel/RUNNER.md` (on the project workspace)

## Purpose
Search published books for passages that overlap what the site already carries about the farm, its families and its places, under every name variant, and record each passage with its citation.

## Inputs
- full-text book search under every name variant of the farm, its families and places
- the live site, to tell new passages from known ones
- a keyword ledger: the most productive keywords are retired each cycle so the search keeps moving

## Outputs
- rows in the research findings table (book title, the exact sentence, citation)
- a section/research commit carrying the table

## Metric
new cited passages per run; passages that change the chronology

## Report rules
Nothing routine; one line, with the exact quotation and its source, only when a passage is significant after the page itself has been checked.

Built to the [flywheel schema](SCHEMA.md).

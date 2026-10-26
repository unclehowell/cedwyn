# Flywheel: Nightly drafts engine

**Cadence:** daily 05:30 UK  
**Goal prefix (duplicate check):** `NIGHTLY DRAFTS ENGINE RUN`  
**Runner:** `work/drafts-engine/RUNNER.md` (on the project workspace)

## Purpose
Keep every due information-request draft and chaser written, in thread, ready for review.

## Inputs
- the request queue
- new mail since the last run
- the deadline strategy
- each body's dartboard lane

## Outputs
- drafts (never sent)
- queue updates
- a count for the morning brief

## Metric
drafts ready vs due; no chaser before a deadline; no duplicate

## Report rules
Nothing to the project lead directly; the morning brief carries the count.

Built to the [flywheel schema](SCHEMA.md).

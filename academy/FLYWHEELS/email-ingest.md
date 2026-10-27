# Flywheel: Email ingest

**Cadence:** every 2 hours, 07:00-23:00 Europe/London  
**Goal prefix (duplicate check):** `EMAIL INGEST`  
**Runner:** `work/email-ingest/RUNNER.md` (on the project workspace)

## Purpose
Turn inbound project correspondence into site updates: the dartboard lanes, missing-record and catalogue candidates for the research cycles, and dated notes on the matching case tasks.

## Inputs
- project mail (read-only)
- attachments (locked files recorded as locked, never opened by force)

## Outputs
- dartboard updates
- missing-record candidates
- catalogue candidates
- case-task notes

## Metric
messages processed, site areas updated

## Report rules
Per its runner; stops with 'no new mail' when nothing arrived.

Built to the [flywheel schema](SCHEMA.md).

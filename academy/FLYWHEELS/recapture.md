# Flywheel: Farm page recapture

**Cadence:** every 5 days  
**Goal prefix (duplicate check):** `FARM PAGE RECAPTURE`  
**Runner:** `work/internetarchive/box/recapture.py` (on the project workspace)

## Purpose
Capture outside pages about the farm's history before and after each cycle so changes are on record.

## Inputs
- the watch list of outside pages

## Outputs
- captures and a change summary in the watchtower data

## Metric
captured / unchanged / changed / unreachable

## Report rules
No alerts for routine runs; only substantive heritage changes or a broken runner.

Built to the [flywheel schema](SCHEMA.md).

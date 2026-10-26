# Flywheel: First-seen detector

**Cadence:** every 6 hours  
**Goal prefix (duplicate check):** `FIRST-SEEN DETECTOR RUN`  
**Runner:** `work/first-seen/` (on the project workspace)

## Purpose
Detect any record about the farm that quietly appears online and register it with its first-seen date.

## Inputs
- baseline captures
- live pages

## Outputs
- verified first-seen entries in the disclosure register

## Metric
new items verified

## Report rules
At once, on any verified detection.

Built to the [flywheel schema](SCHEMA.md).

# Changelog — Counting House public accounts

## [0.2.0] - 2026-10-25

### Added
- `ledger/farm.beancount`: the farm’s money, 1877–1987 — a memorandum ledger of money recorded between other parties about Great House Farm and its land (rents, the 1974 rent-free licence, estate and site sales, the 1962 legal charge, the 1969 takeover bid, court orders), each line with its catalogue ID. Lines with no figure on file are flagged GAP at £0.00. Kept apart from the cash accounts; never added to them.
- New tab “Farm money 1877–1987” (`#farm-money`), built by `tools/build.py` into `data.json` (`farm`). The courts’ view is stated first.

### Unchanged
- Cash ledger, totals and the held redress memo.

## [0.1.0] - 2026-10-24

### Improved
- Add a consistent, high-contrast `:focus-visible` treatment to keyboard-operable links, search, filters and controls.
- Announce the existing generated-at timestamp politely to assistive technology.

### Validated
- The page's displayed spend and “Built … from the plain-text ledger” metadata are embedded from `public/data.json`.
- Latest data snapshot: 2026-10-23 00:57 UTC, 26 ledger rows. No account values were altered or presented as newly reconciled.

# Changelog

## [2.1.0] - 2026-10-26

### Added
- `public/register/` — **The master register**, labelled “The family’s register — the family’s view” (cy/es). Every square is one catalogued record (EV ID, date, one line, link to its Cedwyn research page): 29 white (the family’s honour, standing, court role, injustice suffered), 42 black (acts of public bodies, companies, courts and the press questioned or criticised on the record). Scoreboard with a who’s-ahead bar; a “to be sourced” panel (8 points) kept off the board until a record is found.
- `public/layer.json` — the register as a catalogue layer (`chess-register`): build_db stores it in the `layers` table; the page reads it from the database first, then this file, then its own inline copy.
- “Register” button on the board header; dictionary strings for it (cy/es).

### Wording
- Bute = lord of the manor; BP = registered proprietor (first registration 1982/83); the 1938 deed is shown as known only from recitals; where a court treated BP as owner it is shown as the court’s view. No private individual is accused. — Sion’s Tab agent

## [2.0.1] - 2026-10-24

### Fixed
- Remove the Open Graph image URL pointing to `/og.png`, which is not present in the deployed `public/` output or source assets. This avoids publishing a known-broken social-preview URL.

### Validated
- All 782 source items have at least one source reference and all referenced URLs use HTTP(S).
- The generated board has 782 squares matching the source dataset. This is a reference-integrity check, not independent validation of every cited document.

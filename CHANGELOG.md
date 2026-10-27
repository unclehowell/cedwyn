# Changelog

## [3.4.1] - 2026-10-27

### Fixed
- Parcel A boundary: Parcel A is the farmhouse, yard, buildings and woodland. On the family's boundary plan the Parcel A line ends before the green begins, so the green is no longer shown as a third of Parcel A. The green (village green VG41, registered by Glamorgan County Council in 1970) is shown as separate ground, outside Parcel A. A1/A2 now read "north part" / "south part"; A3 is relabelled "The green · VG41 (outside Parcel A)". Narration audio unchanged.

## [3.4.0] - 2026-10-25

### Added
- `title-chain/`: an animated, step-by-step title chain (Bute → Mountjoy → Western Ground Rents 1938 → BP 1969 → first registration 1982/83) beside the Williams occupation line, the twelve-year pairs (stacked from a common start) and the parcels taken. It reads the “title-chain” layer from the Cedwyn catalogue database (fallback: /research/layer.json); every step links to its catalogue ID. The courts’ view is shown first.
- A link to it above the circle diagram.

## [3.3.3] - 2026-10-24

### Fixed
- Align the embedded data, animation-path and audio cache version markers at `3.3.3` (they were inconsistent).
- Describe the 1877 Parcel A/B division as a proposed model pending a site-matched instrument, rather than a conclusively established split.
- Keep the known 1877 Clyde Street, Roath lease excluded from the Great House Farm title chain.

### Reviewed
- Preserved the existing case model and its cited records; this is a presentation/provenance clarification, not a legal finding.

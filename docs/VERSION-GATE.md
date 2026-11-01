# Version gate (convention v1.1.0, 1 Nov 2026)

Owner request, 1 Nov 2026: before a video, PDF, academy course, merchandise item or NFT loads, show a random image from the NFT
collection with "Select a version" and a down arrow, and a drop-down of the item's versions; choosing the free version loads the
item, and while it is open the visitor can see that a newer full version is available.

## How it works
- `/_cedwyn/version-gate.js` (loaded deferred by `/_cedwyn/ghf/ghf-boot.js` on every page with the header) reads
  `/_cedwyn/version-gate.json` and styles itself from `/_cedwyn/version-gate.css`.
- **In the media slot only.** The facade takes the place of the PDF reader's body (the reader dialog on /ebooks/, the viewer on
  /ebooks/read/) or the video box. The page title, text and links stay visible. Never a full-page overlay, never a chooser page.
- The facade (1.1.0, Selector UI, standard §2a): ONE plain drop-down whose first option is the placeholder "Select a version"
  (nothing preselected), the (i) beside it, no label above it and no line or button under it. Above it, the media slot shows the
  item's own cover with a play/open button when the page opens straight into the gate (/ebooks/read/). When play/open is tapped
  with no version chosen (on /ebooks/ tapping a cover is that tap; on a clip, pressing play), the slot shows a random image from
  `images` (the restored NFT pieces, `/nft-art/art/nfa-NNNN-v0.0.2-t.webp`, WebP, 12-83 KB) with "Select a version ↓" over it
  (cy "Dewiswch fersiwn", es "Seleccione una versión"). Choosing a version acts at once: free opens the item, paid goes to checkout.
- Each e-book entry carries `cover` (its /ebooks/posters/ WebP) for the poster state.
- Labels, prices, the (i) version table and the audit follow docs/VERSION-STANDARD.md 1.1.0: `v0.0.1 — free (20 pages)`,
  `v0.0.2 — £4.99 (221 pages)`; prices computed from the latest price by the one-step (£4.99) ladder; whole price, never per page.
- An (i) button beside the drop-down opens the version table (standard §3).
- A paid version uses the existing checkout: the book card's own Buy button on /ebooks/ (or the card at `/ebooks/#<book>` from
  any other page). No new payment code.
- While a free item is open: one dismissible line at the bottom, e.g. "Newest v0.0.2: £4.99, 221 pages · What's added", linking to
  `/ebooks/#<book>` (internal only).
- The choice (and a dismissed bar) is kept for the browser session: `sessionStorage` `cvg:<item>`.
- An item with no paid version gets no gate. A page with no matching item is untouched. Without JS every item keeps its plain link.
- Argentina scope (`html[data-cedwyn-scope=argentina]`, /argentina/, /patagonia/): no prices and no bar.
- Counts: `/_cedwyn/ev/vgate-shown|vgate-passed|vgate-paid/<item>/<page>` (zone analytics, like the funnel events) and
  `<html data-cvg-shown / data-cvg-passed>`. Free pass-through under 80% of shown means the gate is costing readers.

## What is wired (1.1.0)
| media | status |
|---|---|
| e-book PDFs: shelf reader (`a[data-edp-pdf]`) and /ebooks/read/ | wired: 8 books with a £4.99 edition; the free-only Cedwyn book has no gate |
| documentary clips | the documentary page (movie.js 1.8.0, branch cedwyn-movie) follows §2a in its own markup: one drop-down per scene, placeholder "Select a version", (i) table, the scene's own still on load, the NFT prompt in the picture when play is tapped with no version; this file's clip path stays as a fallback |
| NFT pieces | no gate: every piece is v0.0.1, free, no paid version yet |
| academy courses (/learn/) | pending: courses open by membership, no per-course free version |
| merchandise (/shop/) | pending: goods with no free version |

## Adding an item
Add an entry to `version-gate.json` (`ebooks.<book id before the @>`: `card`, `price` of the latest version, `unit`, `versions[]` oldest first with `v`, `date`, `pages`, `change`). Then run `python3 tools/version_audit.py`.
Take page counts and prices from data/ebooks.json and the e-book archive; never invent a price.

## CHANGELOG
- 1.1.0 (2026-11-01): Selector UI rule (standard §2a): placeholder "Select a version", no label, no button or line under the drop-down, cover on load, NFT prompt only after play/open with no version chosen, choosing acts at once; e-book `cover` field. — Cedwyn editors
- 1.0.0 (2026-11-01): first version: e-book reader facade + bar, (i) version table with the one-step price ladder, session memory, counts, cy/en/es. — Cedwyn editors

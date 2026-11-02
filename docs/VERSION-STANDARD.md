# Cedwyn version standard 1.2.0 (1 Nov 2026)

One rule for every versioned thing on the site (e-books, documentary cuts, and any course, piece or item that gains versions).
The owner's words (1 Nov 2026 01:31): latest versions are paid; each previous semantic version is £4.99 less, down to v0.0.1,
which is free; an info icon beside the drop-down opens a table of the changelog; the same everywhere, kept that way by a flywheel.

## 1. Versions and prices
- Versions are semantic (`vMAJOR.MINOR.PATCH`), listed oldest first. The first is always `v0.0.1` and it is always free.
- Only the **latest** version's price is stored (`price`, e.g. `£4.99`). Every other price is computed:
  `price(i) = max(0, latest − £4.99 × steps back)`, and `v0.0.1` is £0 whatever the arithmetic gives.
  Two versions today: v0.0.1 free, v0.0.2 £4.99. A third at £9.98 would make the middle one £4.99.
- An item with no paid version (latest price £0 or no price) gets **no gate**: its normal link or player.
- Never a per-page or per-day price; never "was" or "save". Whole price with a size.

## 2. Drop-down labels (exact)
- Free: `v0.0.1 — free (20 pages)` · paid: `v0.0.2 — £4.99 (221 pages)`. Size = pages, or length for video (`12 min`).
- Welsh / Spanish: `am ddim` / `gratis`, `tudalen` / `páginas`. Nothing is preselected: the placeholder "Select a version" shows (§2a).

## 2a. Selector UI (exact; owner's rules 1 Nov 2026 02:19 and 02:30)
The owner called a labelled selector with a "Free to watch" line under it slop. The selector is:
- **One plain drop-down.** Its first option is the placeholder **"Select a version"** (cy "Dewiswch fersiwn", es "Seleccione una
  versión"), selected and shown when the page loads. Nothing else is preselected.
- **No label or heading above it** (an `aria-label` only), and **no helper line, price line, status line or button under it**
  ("Free to watch", "£4.99 · enter an access code", "Now playing", "Open the free version" are all drift).
- The options keep their exact labels (§2). The **(i)** sits beside the drop-down (§3); it shows the letter i only.
- **The selector lives only inside the modal (02:30).** Before the visitor taps an item there is **no version drop-down (and no
  scene or version selector) anywhere on the page**. Tapping play/open on a ready item, or tapping a coming-soon item, opens ONE
  modal: a random image from the NFT collection with **"Select a version"** written over it and an **arrow pointing down**, and,
  under the image, the drop-down (placeholder only, no label, nothing under it) with its **(i)** beside it. The modal always opens on
  the placeholder; × , Esc or a tap outside closes it.
- **Media slot on the page:** the item's **own** cover, poster or a still from its own video, never an NFT image. No two items
  share a picture. Documentary doors not yet ready show the Cedwyn estate silhouette with the place of the scene's event marked
  and "Coming soon" in the picture (one WebP per door; where the parcel is not known the whole estate outline is marked).
- **Choosing a version acts at once:** the modal closes; a free (or already-owned) version opens or plays; a paid one goes to its
  existing access-code / checkout box.
- Coming-soon items get the same modal, listing whatever versions exist; with none, the drop-down's only option is "Coming soon",
  disabled.
- Documentary doors: under "What happens in this scene" exactly three dropdowns, in this order: Script, Subtitles, Evidence.
  Evidence is the last and appears nowhere else on the door.

## 3. The (i) version table
An (i) button sits beside every version drop-down. It opens a dialog (inside the media slot) with one row per version, newest
first: **Version · Date · What changed · Pages or length · Price** (prices computed as in §1). Rows come from the item's
`versions[].change`; an item without them gets them built from its existing changelog (data/ebooks.json, the e-book archive,
the documentary manifest). Esc and × close it and focus returns to (i).

## 4. Where it lives
- Data: `web/_cedwyn/version-gate.json` (schema `web/_cedwyn/version-manifest.schema.json`).
- Behaviour: `web/_cedwyn/version-gate.js` + `.css`, loaded by `ghf-boot.js` on every page (spec of the gate: docs/VERSION-GATE.md).
- A webapp with its own version picker (the /ebooks/ shelf cards, the documentary scene drop-downs, the NFT garden) follows §1–§3 in its
  own markup; the audit reads the live pages and reports drift.

## 5. The audit (the flywheel)
`python3 tools/version_audit.py [--live]` checks, and with `--fix` corrects minor drift in the manifest only:
- schema fields and types; versions ascending and unique; first `0.0.1`; dates ISO; change text present;
- the latest price equals data/ebooks.json's current price for the book; computed ladder; no stored per-version prices;
- banned public words and per-page wording in change text; images are `/nft-art/art/*.webp`;
- Selector UI (§2a) in the gate's code (`web/_cedwyn/version-gate.js`, or the copy served live) and in the documentary page
  (`/documentary/movie.js`): a placeholder option "Select a version"; no visible `<label>` for the drop-down; no preselected version;
  no helper/sub-text line or button under it (`cvg-go`, `cvg-lab`, `cm-vlab`, `cm-vnowline`, "Free to watch" and the like);
  the NFT prompt only after play/open. These are reported, not auto-fixed (they are code, not data);
- `--live`: each book on /ebooks/ shows `v0.0.1 — free` and the latest at its computed price, every manifest image answers 200
  and is under 400 KB, and /_cedwyn/version-gate.json is served.
It prints one line per finding and exits 1 when a finding is not auto-fixable. Run it every 6 h; anything it cannot fix goes to
the problems queue.

## CHANGELOG
- 1.2.0 (2026-11-01): §2a: the selector lives only inside a modal opened by play/open or by tapping a coming-soon item (NFT image,
  "Select a version" and a down arrow, the drop-down and (i) under it); no selector on the page; coming-soon doors show the estate
  silhouette with the event's place marked; the documentary's Script / Subtitles / Evidence dropdowns. — Cedwyn editors
- 1.1.0 (2026-11-01): §2a Selector UI: one plain drop-down with the placeholder "Select a version", no label above, no line under it,
  the item's own cover on load and the NFT prompt only after play/open with no version chosen; the audit flags label and sub-text drift. — Cedwyn editors
- 1.0.0 (2026-11-01): first version. — Cedwyn editors

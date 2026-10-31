# Version selector on e-book, film and image downloads: visible "Select a version" label, newest preselected

Harvested 30 Oct 2026 (~19:30Z). Prompted by a request at 19:21: "Make the dropdown say 'select a version'", on the shop, the documentary page and image/NFT downloads.

## What the evidence states (read 30 Oct 2026)
- **Drop-downs are generally a poor choice for fewer than 5 or more than 10 options** (Baymard, drop-down usability, read). With 1-4 options, users have to open the drop-down just to see them.
- **People open drop-downs just to look.** In Baymard's testing, **55%** of users opened an optional drop-down only to see its contents and closed it without choosing.
- **Better choices than a drop-down:** radio buttons or buttons for a few options, a text field for many, or an option chosen automatically.
- **Unchosen drop-downs cause buy-button errors.** Baymard (size-selection buttons, read): **28%** of desktop sites still use drop-downs for size. In eye-tracking, users were more likely to overlook selectors shown as drop-downs. At Adidas and REI, users pressed "Add to Bag/Cart" before choosing and got an error message.
- **Never let the label disappear.** A label inside the field that vanishes strains short-term memory and makes errors harder to check (NN/g, "Placeholders in Form Fields Are Harmful", read). The text "Select a version" should be a real `<label>` above the control, not only a blank first option.

## The rule we follow
The owner asked for a dropdown labelled "Select a version", so we build one. These details stop it costing sales:
1. **Write the label as a visible `<label for>` above the control: "Select a version".** It stays on screen after a choice is made.
2. **Preselect the newest version.** Never start on an empty "Select…" option. An empty start produces exactly the click-Buy-before-choosing error Baymard recorded.
3. **Show each option's price in the option text:** `v0.0.2 — £4.99`, `v0.0.1 — free`. A native `<select>` is used so that 390 px phones get the system picker.
4. **Changing the version updates the Buy or Download link and the price on the button at the same time.** A gated version swaps to "Enter access code / Buy £4.99", never to a dead button.
5. **One version only:** still show the label and a one-option select, as asked, so the pattern is the same on every page. Tests below decide whether this changes.
6. **Accessibility and style:** dark theme, a focus ring, a touch target of at least 44 px, and `aria-describedby` pointing at the price line.

```html
<label for="v-wiki">Select a version</label>
<select id="v-wiki" data-book="wiki">
  <option value="v0.0.2" data-href="buy.stripe.com data-price="£4.99" selected>v0.0.2 — £4.99</option>
  <option value="v0.0.1" data-href="/ebooks/files/wiki-v0.0.1.pdf" data-price="free">v0.0.1 — free</option>
</select>
<a class="buy" id="buy-wiki" href="buy.stripe.comBuy £4.99</a>
<script>document.querySelectorAll('select[data-book]').forEach(s=>s.onchange==>{const o=s.selectedOptions[0],b=document.getElementById('buy-'+s.dataset.book);b.href=o.dataset.href;b.textContent=o.dataset.price==='free'?'Download free':'Buy '+o.dataset.price;});</script>
```

## Test, then offer the alternative (never change it on our own)
- **Log:** version changes, plus Buy clicks per version, in Cloudflare analytics or a beacon to the cedwyn-api Worker.
- **When to offer buttons:** if over half of select opens end on the preselected version, the drop-down is only being opened to look, Baymard's 55% behaviour. Then propose two side-by-side buttons ("v0.0.2 £4.99" / "v0.0.1 free") as a change for the owner to approve. The owner's wording ("dropdown") stands until then.

## How we apply it to Cedwyn
- **/ebooks/ tiles:** one select per book with the visible "Select a version" label. Newest is preselected. The Stripe link and the free PDF link change with the choice, as does the price on the button.
- **/documentary/:** the same label above the version select. v0.0.2 shows the access-code / £4.99 gate. The audio-language switch reloads the file for the matching version (v0.0.1_english, v0.0.1_welsh...).
- **Image/NFT downloads:** the same component. Options list only the files that actually exist (for example v0.0.1 original, v0.0.2 restored). The Download button carries the `download` attribute plus the chosen file. Nothing is listed that does not exist.
- **One shared snippet** (component above) across all three lanes, so the label text is identical everywhere.

## Sources
- baymard.com (fewer than 5 options; 55% open just to look, read)
- baymard.com (28% of desktop sites; eye-tracking; buy-before-choose errors, read)
- nngroup.com (placeholder as label is harmful, read)


## Older versions in the dropdown (rule of 30 Oct 2026, 21:50)
- Option order, newest first: v0.0.2 (£4.99), v0.0.1 (free, default when v0.0.2 is not open), then older versions **starting at -v0.0.2**: -v0.0.2, -v0.0.3, -v0.0.4 … (all free). There is **no -v0.0.1**.
- Hashtag/chip form of an older version: #_v0.0.2, #_v0.0.3 … (underscore replaces the minus).
- Labels are computed, never stored: the documentary computes them in documentary.js (`VS.older_start`, default 2; `older_start` in /_cedwyn/versions.json overrides). Option values stay the manifest/edition IDs.
- Change log: before 30 Oct 21:50 the older series started at -v0.0.1 (10:40 rule); renumbered by task acdf3f68 (the project workspace).
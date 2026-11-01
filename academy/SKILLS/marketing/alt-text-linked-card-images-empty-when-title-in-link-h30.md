# Alt text for linked card images: empty when the card title is in the same link, descriptive when the image stands alone

Skill harvested 2026-10-31 ~21:27Z. Topic: CRO / accessibility / image SEO on card grids (shop, tours, /argentina/, /wales/, door cards). Neighbour skills: card-image-label-match-3-second-test-real-over-stock.md (which image), google-images-lens-archive-photos.md (image search), html-email-design-accessibility.md (email alt).

## The evidence (read 31 Oct 2026 unless marked)
- WebAIM Million 2026 (webaim.org, read): 1,000,000 home pages, 66.6 images per page (+13.6% in a year). 16.2% of all images (10.8 per page) had no alt text (18.5% in 2025). **45% of images missing alt were linked images**, so the link had no name; 1 in 4 linked images had no alt. 10.8% of images that had alt carried questionable or repetitive alt: "image", a file name, or **text identical to adjacent text**. Missing alt was on 53.1% of home pages, the second most common failure after low contrast.
- W3C WCAG 2.2 Technique H30 (read): Example 2, an image alone in a link takes alt naming the link's purpose; Example 3, when the `<a>` also contains text describing the purpose, the image takes `alt=""`.
- W3C WAI alt decision tree and Decorative Images tutorial (read via search page; tutorial pages are the source): image content conveyed elsewhere, or purely decorative, gets `alt=""`.
- WebAIM, "Alt text and linked images" (read): duplicating the caption in alt makes a screen reader say it twice ("Link. Photo of ... Photo of ..."); the better pattern is image AND caption inside one link with the image `alt=""`. "Any time an image is the only content within a link, the image MUST be given alternative text that presents the function of that link."
- Not tested here: any conversion effect of alt text. The case is accessibility (UK Equality Act duty of reasonable adjustment, not checked for this site's size) plus Google Images, which uses alt as a main signal (see google-images-lens-archive-photos.md).

## The playbook (4 card shapes)
1. **Whole card is one link containing image + visible title** (most Cedwyn cards): `alt=""` on the image. The title names the link. Writing "B&B guest room" as alt next to a "B&B" title is the repetitive-alt failure WebAIM counts.
   - Exception: the photo carries information the title doesn't (a dated document scan, a map). Then alt describes only that extra ("1938 reversion deed, first page"), never repeats the title.
2. **Image is its own link, title is a separate link to the same page**: either merge into one link (preferred, one tab stop) or give the image link `alt=""` plus `aria-hidden="true" tabindex="-1"` on the duplicate link. Never two identically named links side by side.
3. **Image is the only thing in the link** (thumbnail strip, logo, gallery tile with no caption): alt names where it goes or what it opens: "Guesthouse bedroom, Patagonia — open gallery", not "image1.webp".
4. **Image not in a link, not decorative** (hero photo in an article): alt describes what a sighted reader gets, 5–15 words, no "image of", no keywords stuffed, language matching the page (`lang` cy/en/es pages get alt in that language).
- Never: file names, "photo", "image", "banner", "placeholder", AI-prompt text, or the WordPress-style auto alt.
- Ken Burns/background CSS images carry no alt; if one is the only depiction of the card's subject, use a real `<img>` instead (Google Images ignores CSS images too).

## 2-minute audit (stdlib, no install)
```python
import re,requests
h=requests.get(URL+"?cb=1",timeout=20).text
for a in re.findall(r"<a\b[^>]*>.*?</a>",h,flags=re.S|re.I):
    for img in re.findall(r"<img\b[^>]*>",a,flags=re.I):
        alt=re.search(r'alt="([^"]*)"',img); alt=None if not alt else alt.group(1)
        text=re.sub(r"<[^>]+>"," ",a).strip()
        flag=("NO-ALT" if alt is None else "EMPTY-ALONE" if alt=="" and not text else
              "DUPLICATE" if alt and alt.lower() in text.lower() else
              "FILENAME" if re.search(r"\.(webp|jpe?g|png)$",alt or "") else "ok")
        if flag!="ok": print(flag,"|",alt,"|",text[:60])
```
Any NO-ALT, EMPTY-ALONE, DUPLICATE or FILENAME line is a fix.

## How we apply it to Cedwyn
- Tonight's Patagonia card-image fix (the project lead 20:51) also changes alt. Per H30, a card whose `<a>` wraps image + title should get `alt=""`, not a new description repeating "B&B". If the card markup has the image outside the title link, alt must describe the new image ("guest bedroom with wood stove, Patagonian guesthouse") so the image link isn't nameless.
- Spanish/Welsh pages: alt follows the page language; Spanish alt is copy and needs a speaker's check like other Spanish text, so use `alt=""` there where the title covers it (rule 1) rather than writing new Spanish.
- Add the audit snippet to the weekly ONPAGE run (proposal only; this run changed no runner).
- Door/movie cards and shop e-book covers: cover image + title in one link → `alt=""`; cover image alone → "<Book title> e-book cover".

## Sources
- webaim.org (2026 report, read)
- w3.org (read)
- webaim.org (read)
- w3.org ; w3.org (search snippets; not opened this run)
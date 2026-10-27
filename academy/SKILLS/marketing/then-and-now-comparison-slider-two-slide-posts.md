# Then-and-now comparisons: accessible slider on the page, two-slide posts off it

Harvested 2026-10-27 (skills harvest). Ties to today's /wales/ farmhouse wireframe work (a worker) and the gallery redo.

## Evidence (read today; honest about its strength)
- **Demand signal:** r/OldPhotosInRealLife is a community built only on "old photos overlaid with their current location to show change". It has about 882k members. That's a third-party count (postpone.app, read 27 Oct); Reddit's own JSON was blocked from this box.
- **Press-hook precedent:** Historic England's "Wartime Britain then and now" release of new aerial WWII images was syndicated by national news (Yahoo News copy found 27 Oct). Then-and-now is a format editors run.
- **What we did not find:** a controlled study with numbers showing then-and-now posts beat other formats. The Facebook local-history group examples found are small (for example, a "Henfield Then And Now" post with 12 reactions and 3 shares). Treat the format as strong on shares and saves, but **measure our own**. Don't quote an uplift figure.
- **Implementation (primary, read):** Cloud Four's `image-compare` web component.
  - It uses a native `<input type=range>`, so keyboard and screen readers work. The visually hidden label is set with `label-text`.
  - It's 1.5 kB min+gz with zero dependencies.
  - If the JS fails, the two images show stacked, so the content survives.
  - MIT/ISC licence. Installed today at tools/vendor/image-compare/ (41 KB).

## How to do it
1. **Match the viewpoint before you match the pixels.** Same spot, same bearing, same lens height (about 1.6 m for a street photo). Crop both images to the same aspect ratio, 4:5 for social. With a wireframe or reconstruction instead of a modern photo, render it from the camera position recovered from the old photo.
2. **Licence each side separately.** Our own photos and renders are fine. NLS georeferenced OS maps carry a per-sheet licence line, so copy it exactly. OSM is ODbL ("© OpenStreetMap contributors"). Mapillary is CC-BY-SA. Google Street View can only be used to line things up; never publish its pixels.
3. **On the page:**
   ```html
   <image-compare label-text="Slide to compare the farmhouse in 1974 with the same view today">
     <img slot="image-1" src="then.webp" alt="1974 measured-survey reconstruction of the farmhouse, viewed from the lane" width="800" height="1000">
     <img slot="image-2" src="now.webp" alt="The same view today: modern houses where the farmhouse stood" width="800" height="1000">
   </image-compare>
   <script type="module" src="/_cedwyn/vendor/image-compare.min.js"></script>
   ```
   - Self-host the min.js. That avoids unpkg and keeps the zero-outbound-links rule.
   - Set width and height on the images so the layout doesn't shift.
   - Add a caption under the slider that gives the date of each side and the method ("reconstruction from the 1974 measured survey; roof height estimated").
4. **Off the page,** sliders don't exist. Post a **two-slide carousel** (then, then now) or a 6-10 s Reel wipe (ffmpeg `xfade=transition=wipeleft`). Slide 1 is the old view with the year in large type. Slide 2 is the modern view with "same spot, today". First comment links to the page, per the platform link rules in existing skills. For a Reddit post, read the subreddit's rules and post the overlay, not a sales link.
5. **Measure:** shares and saves per post against the account median, and page clicks tagged `utm_content=thennow-<stop>`. Keep it if shares beat the median on 2 of the first 3 posts.

## How we apply it to Cedwyn
- When the /wales/ wireframe composites land, build each tour stop as a then/now pair. "Then" is the reconstruction from the 1974 survey. "Now" is the open-licence street view or OSM massing. Wrap each pair in `image-compare` instead of a single image. Copy dist/index.min.js from tools/vendor/image-compare/ into the site's static folder in the same PR. That's one file of 4.4 KB.
- Captions stay neutral and dated. Name no private people, give no house numbers, use none of the banned words. The modern side shows the street, not identifiable homes or people, so blur where needed.
- The quote-pack and auto-social runs can reuse the same pairs as carousels: one pair per post, never more than one a day.
- A press angle (only on the project lead's GO) is "the 17th-century farmhouse drawn back where it stood, from the 1974 survey". That's a dataset-style hook; see data-led-digital-pr-heritage-dataset-pitch.md.

## Sources
- image-compare-component.netlify.app ; cloudfour.com ; npm @cloudfour/image-compare 1.0.5
- postpone.app (member count, third-party) ; reddit.com (rules, title seen in search; not opened)
- news.yahoo.com (title/snippet only)
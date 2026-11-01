# Sketchfab 3D for the virtual tour and the replica: views we can count

Skill added 2026-10-30 (skills harvest). Scope: Great House Farm / cedwyn only. Serves two projects: the guided virtual/augmented Wales tour, and the Argentina replica (Cedwyn Estate 2.0).

## What it is
Sketchfab is a web 3D viewer and community. Epic Games has owned it since 2021. Each model page shows public view and like counts. Models embed anywhere through an iframe or oEmbed, and visitors can view them in AR on a phone with no app.

## Facts (checked today unless marked)
- **The free Basic plan** (sketchfab.com, read 30 Oct 2026): 10 uploads a month, 100 MB per model, 10 annotations per model.
  - Annotations are clickable notes, useful for "this was the dairy" style labels.
  - App-free AR is listed as a plan feature. Which tiers include it wasn't readable in the page text, so it is **not checked**.
  - Removing the Sketchfab logo and branding needs a paid plan.
- **Still running:** the public Data API answered today (`api.sketchfab.com) and so did oEmbed (`sketchfab.com).
- **The Store closed when Epic's Fab launched (Oct 2024).** The search snippet of Sketchfab's own blog reads "Sketchfab Store is now closed... products remain viewable". It also signalled the end of free licensing / downloads on Sketchfab "next year" (2025). Whether free downloads are now gone is **not checked**.
  - This doesn't affect us: we want viewing and embedding, not selling 3D files.
- **Heritage community:** Sketchfab's blog reports over 100,000 models in the Cultural Heritage & History category, about 20,000 of them downloadable under CC.
  - Only about 30% of models carry a category, so the real number is higher.
  - The Cultural Heritage programme, running since 2015, gives "hundreds of organisations" free subscriptions.
  - CC0 dedication is available to cultural organisations; 27 organisations in 13 countries took part at launch.
  - All of this is from Sketchfab blog posts I read today. Their publication dates (around 2019–2020) were not shown, so treat these as older figures.
- **Local benchmark, pulled from the Sketchfab API on 30 Oct 2026:**
  - "Cardiff Castle, medieval scan": 1,488 views
  - "Penarth Cliffs (South Wales) March 2017": 725 views
  - "Roman dodecahedron from Cardiff Castle": 680 views
  - "Penarth Railway Path bridge": 229 views
  - "Llandough Hospital": 26 views

  Local 3D heritage is a small niche: hundreds of views over years, not thousands a week. The value is the embed on our own pages and on the tour, not discovery on Sketchfab itself.
- No published case study with numbers on embedded 3D lifting time on page or sales for a heritage site turned up. Any lift is **not checked**.

## How to do it
1. **Model.** Choose one of these:
   - A simple massing reconstruction of the house built from dated plans and photos, made in free Blender, kept under 100 MB, exported as glTF/GLB.
   - A photogrammetry scan of a public object or place.

   Label a reconstruction as a reconstruction. Record the date of each source.
2. **Upload** to a Cedwyn Sketchfab account:
   - Title it "<place> — reconstruction (sources: …)" and set the category to Cultural Heritage & History.
   - Write a description that links to the catalogued evidence page. Sketchfab descriptions allow links, but Cedwyn pages carry no outbound links, so the link only goes from Sketchfab to us.
   - Add up to 10 annotations, each pointing to a dated record.
3. **Embed** on Cedwyn pages using the oEmbed iframe, lazy-loaded behind a "View in 3D" button, because the viewer is heavy on a 390 px phone.
4. **Measure** weekly views and likes from `GET api.sketchfab.com` (the `viewCount` and `likeCount` fields; no key needed). Embedded views count as views on Sketchfab. That matches how the platform reports them, but it is **not checked** in Sketchfab docs.

## How we apply it to Cedwyn
- **Tour (project d):** the first models are public places only: St Dochdwy church exterior, the Leckwith bridge and the woods' public paths. There are no private houses, family holdings or addresses. Those are scans or photos someone takes on site, an owner/tour-team task.
- **Replica (project c):** a reconstruction of Great House (Cydfin Farm), clearly labelled "reconstruction; details not checked" wherever a source is missing. It is the shared reference model for the Argentina build brief and a "then" view for the online tour.
- **Rules:**
  - Llandough Farm is not Great House Farm. Any model of it lives only with the Kissed Frogs material and is labelled that way.
  - Banned words apply to titles, descriptions and annotations. Never name the project lead. No insignia.
- **Spend:** zero. Free Basic plan, Blender, and on-site phone photos. Paid AR or branding removal is a PROPOSAL only.
- **Gate before any build:** a worker writes the massing brief from the dated plans already catalogued. If too few dimensions exist, write "not enough dated sources" and stop, rather than inventing.
- **Measure:** total views per model each month in `growth-report/weekly.csv`. Keep the work if the embed page's time on page, from Cloudflare/Clarity, beats the same page without it over 4 weeks. Otherwise keep the model as a reference asset only.
- **Read-only helper:** `skills/tools/sketchfab_views.py <uid|search terms>` prints name, views and likes. It uses requests only and installs nothing.

## Sources
- Sketchfab plans: sketchfab.com (read 30 Oct 2026)
- Sketchfab Data API v3 search (queried 30 Oct 2026): api.sketchfab.com
- Sketchfab blog, "Over 100,000 Cultural Heritage 3D Models": sketchfab.com (read; date not shown)
- Sketchfab blog, "Public Domain Dedication for 3D Cultural Heritage": sketchfab.com (read; date not shown)
- Sketchfab blog, "What you need to know now that Fab's live": sketchfab.com (403 from box; snippet only, not checked)
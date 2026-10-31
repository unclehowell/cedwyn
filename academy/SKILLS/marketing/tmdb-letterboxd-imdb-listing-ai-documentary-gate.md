# TMDB / Letterboxd / IMDb listing for our AI-made documentary: a gate, not a growth channel

Date: 2026-10-30. Researched for the Cedwyn documentary (/movie/, /documentary/), which is self-released on our own site with per-scene access codes.

## The tempting idea
Indie filmmakers often add their film to TMDB so it appears on Letterboxd. Letterboxd draws all its film data from TMDB, imports changes within 30 hours, and can force an import at once via letterboxd.com. A Letterboxd page brings watchlists, reviews and a "where to watch" box, which is free discovery for a film.

## Why it fails for us (TMDB's own rules, read 30 Oct 2026)
TMDB's New Content Bible lists what is NOT allowed in the database. Three lines rule us out:
1. **"AI generated movies (for example deepfake content)."** Our talking shots are generated (OmniHuman) and so are many stills. This alone excludes it.
2. **"YouTube (and other similar sites like DailyMotion, Nebula and Vimeo) videos"** are excluded, apart from YouTube/Nebula Originals and a few properly distributed Vimeo On Demand releases.
3. **Amateur content** is allowed only if it meets one of 5 tests: a selective festival screening, a proper theatre release, national TV, Netflix or an equivalent, or a proper physical distributor. The Bible spells out that "content uploaded to your own YouTube channel, Vimeo or website" and "self-distribution" do not qualify. "All non-qualifying entries found in the database will be deleted."
It also states to add a film only after a qualifying festival acceptance or distribution deal has been made public, not while you hope for one.

Practitioner evidence: TMDB staff on its forum told a short-film maker "your short film is not eligible here on TMDb and you shouldn't add it" because the original was uploaded online. A 2026 r/Letterboxd thread ("Under new TMDb rules, short films uploaded primarily to ...") expects many online shorts to be removed from Letterboxd. A deleted TMDB entry means the Letterboxd page goes too, along with any reviews on it.

## IMDb is different (but check before using)
IMDb's help page takes online videos through the New Title Form as "Made for Video" or as a web series (keyword "web-series"). It must be "available to the public for viewing, either free or for a fee" when submitted, and IMDb asks for a direct link "WebsiteName – Full video" so editors can verify it. Trailers are not eligible. That help page has no AI-content line, but that hasn't been checked against IMDb's wider eligibility pages, so read those first.

## How we apply it to Cedwyn
- **Do not add the documentary to TMDB/Letterboxd.** It would be deleted and wasted effort, and an AI-generated entry would be a breach of their rules. Record this as a closed route so no future run retries it.
- **IMDb is a PROPOSAL only.** It's a public listing that names the work, so it goes to the project workspace for a decision. If approved: list it as "Made for Video", link the free v0.0.1 scene page (public, so it meets "available to the public"), keep AI disclosure in the synopsis (our standing disclosure rule), and never name the project lead as cast or crew without his word.
- **What reopens TMDB:** only a public acceptance at a selective festival (see film-festival-zero-fee-premiere-status-gate.md) or a real distributor, and even then the AI-generated line still applies. So treat TMDB as closed unless the film is re-shot without generative video.
- **Get the same discovery a free way:** put Schema.org Movie/VideoObject markup with the trailer on /movie/ (see the on-page flywheel), and add "where to watch" text on our own pages.

## Sources
- letterboxd.com (TMDB is the sole data source, 30-hour sync, /tmdb/<id> import shortcut)
- themoviedb.org (not-allowed list incl. AI-generated movies and YouTube/Vimeo videos; amateur 5-criteria test; deletion policy). Read through a reader proxy because the site answered 403 to a plain fetch.
- themoviedb.org (staff: an online-uploaded short is not eligible)
- reddit.com (2026 user thread; snippet only, 403 to fetch)
- help.imdb.com (IMDb online-video rules)
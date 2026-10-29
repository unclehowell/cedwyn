# E-book piracy stance for a direct-sold PDF shop: no hard DRM, light "social DRM", 10-minute takedown routine

Written 2026-10-28 (skills harvest). Distinct from: peoples-collection takedown (our own uploads), wayback fair-dealing, press monitoring (mentions, not copies).

## What the evidence states
- **Hard DRM does not stop piracy and annoys buyers.** Tor Books UK/US went DRM-free on 25 Apr 2012. One year on, Julie Crisp (Tor UK editorial director, Reactor/Tor.com 29 Apr 2013, read): "we've seen no discernible increase in piracy on any of our titles, despite them being DRM-free for nearly a year." Reasons given: readers move files between devices, and DRM-protected titles were pirated anyway. Charles Stross, quoted there: "DRM doesn't impede pirates, but it subjects honest customers to a monopoly..." This is one publisher's self-report, not a measured study.
- **Takedown monitoring does lift sales, mostly by stopping casual sharing.** Reimers, "Can Private Copyright Protection Be Effective? Evidence from Book Publishing", Journal of Law & Economics 59(2) 2016 (abstract read): titles placed under an anti-piracy firm's search-and-takedown service showed a **>14% increase in e-book sales** (difference-in-differences). The effect depended on popularity, genre and search frequency, and "most of the increase is due to prevention of casual infringements rather than professional piracy". Read: the cheap part (removing easy-to-find copies from search) does most of the work.
- **Google search removal is the lever that works for a small publisher.** Ian Lamont (In 30 Minutes guides, 2015/2016, read): asking pirate sites or hosts usually fails (dead "DMCA" links, overseas hosts). Removing the pirate URLs from Google Search via Google's copyright removal form takes about 2 minutes with a template and is usually actioned fast. **Catch:** the notice (with the requester's name) can be published on the Lumen database (formerly Chilling Effects).
- **Social DRM (a per-buyer stamp in the file)** is the usual compromise (publica.la, ReadNRate 2026, vendor pages, snippets only, not checked). It deters forwarding because the copy carries a traceable mark. It is no barrier to a determined pirate, but neither is hard DRM.

## The routine (zero spend)
1. **Monthly search check (5 min).** For each title, search: `"<exact title>" pdf`, `"<title>" download`, `"<title>" epub`. Note any result that is not one of our own hosts. Free Google Alerts on each exact title cover the gaps between checks (they already exist for mentions; add the titles).
2. **Triage.** Our own pages, a library, a review or a quote = fine. A full copy, or a page offering it for download = infringing.
3. **Takedown (about 10 minutes for each site):**
   - a. Google Search: use the copyright removal form at support.google.com (product: Web Search). List the pirate URLs and our official /ebooks/ URLs.
   - b. Bing: use the equivalent copyright removal form.
   - c. The host: only if it has a working abuse address. Do not chase registrars.
   - The filer swears to being the copyright owner or an authorised agent. **The filer and their name may be published on Lumen.**
4. **Social DRM at delivery (proposal).** Stamp each paid PDF with an **order reference, never the buyer's email or name in clear**: a 7 pt footer line on each page plus a PDF metadata field. `tools/pdf_stamp.py` does this with pypdf, which is already installed; tested 28 Oct on a 2-page file, and the stamp reads back.
5. **Never:** hard DRM (no Adobe DRM or locked readers), wording that sounds like an accusation in public, or contacting downloaders.

## Numbers to watch
Pirate URLs found per month (baseline 0). Takedowns filed and actioned. Sales the month after any takedown. Don't expect to see Reimers' 14% at our volume; the point is to keep the search results ours.

## How we apply it to Cedwyn
- **Baseline 28 Oct 01:42Z: no pirate copies found.** Searches for "Disclosure Dartboard" pdf download, "Tŷ Mawr Deaths" pdf, and Great House Farm Buckler ebook pdf free download returned only cedwyn.bucklerfamily.estate and ebooks.bucklerfamily.estate pages, plus unrelated PDFs. No action is needed now. Add the check to the monthly growth/onpage audit.
- **Our biggest leak risk is our own setup, not pirate sites.** Free v0.01 editions may be shared unchanged (terms page), which is fine. Paid PDFs go out through ebook-gate v4 ("recorded" mode). Its own README notes that a buyer who copies their return URL could reuse that book's token. Social DRM at the gate would make any such copy traceable. **Proposal only:** the Worker would need to stamp at download time (a JS PDF library in the ebook-gate Worker), and the gate belongs to its own workers. Do not change it from a harvest run.
- **Who files.** A Google notice needs the copyright owner or an authorised agent, and its name can appear publicly on Lumen. Because of the rule against naming the project lead publicly, any filing goes under the publisher name with the project lead's OK. It is his decision, logged as a proposal, and nothing is filed unless a pirate copy actually appears.
- **Public wording:** neutral only, e.g. "unauthorised copy". Banned public words still apply.

## Sources
- reactormag.com (read)
- ideas.repec.org (abstract read; full paper: imkereimers.weebly.com)
- in30minutes.com (read)
- publica.la ; readnrate.com (snippets, not checked)
- Tool: tools/pdf_stamp.py (our own; uses pypdf 6.18.1, already installed)
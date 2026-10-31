# Titles and annotations on evidence graphs (neutral but message-carrying)

Written 30 Oct 2026 (skills harvest). Trigger: the /research/parcels/ fix (19:16 30 Oct ask) puts a graph of "instruments relied on by the corporation" and "registrations in the corporation's name" inside the "See this section as a graph" dropdown. The title and annotations decide what a reader takes away, and our editorial rules require neutral wording.

## The evidence
- **Borkin et al. 2016, "Beyond Memorability"** (IEEE TVCG 22(1); abstract read on Harvard VCG): eye-tracking of **33 participants** on **393 visualizations**, plus thousands of written recall descriptions. Titles drew the most fixations, and titles were the element most often mentioned at recall. Descriptions of charts with titles were of higher quality. When the title carried the main message, people recalled the message; generic titles meant fewer did. The authors' design guideline (1) is "titles and supporting text should convey the message of a visualization". Redundancy, meaning the message repeated in title, label and annotation, helped.
- **Position matters** (Bertini's summary of Borkin, FILWD, read): when the title sat at the bottom of a table, the table headers drew more fixations than the title. Put the title on top.
- **Kong, Liu & Karahalios 2018, CHI, "Frames and Slants in Titles"** (via Bertini's summary, read; the paper's PDF was not readable from here, so the numbers are not checked): the same chart was shown with a supporting or an opposing title. People recalled the message the title slanted towards, whatever their prior attitude. Most still rated the chart **neutral**: readers do not notice slant. Follow-up work found slant often went unnoticed even when the title contradicted the data.

The upshot: the title is the strongest lever on the page and readers trust it blindly. On contested material that cuts both ways. A title that argues is read as fact (which our rules forbid), and a vague title wastes the chart.

## How to write them
1. **Descriptive-quantified title on top:** count + what + span + whose wording. Example: "14 instruments relied on by the corporation, 1974–1987". Write the facts, not the verdict.
2. **Subtitle states the frame:** "Dated documents and Land Registry entries, each with its catalogue reference." For any case point, add "our case, prospective, not a finding."
3. **Annotate 2-4 points, not all.** Label the first, the last and any cluster (e.g. "31 Oct 1974: two letters"). Annotations quote the record's own words with a date and reference, never adjectives.
4. **Repeat the message once** (Borkin's redundancy result) in the dropdown's `<summary>` line: "See this section as a graph: 14 instruments, 6 registrations".
5. **A legend that names the two series exactly as the page text does**, so title, legend and prose match word for word.
6. **Run the slant test:** read the title to someone who holds the opposite view. If they would call it unfair, rewrite it. Readers will not catch slant, so we must.
7. **Accessibility and search:** put the title as real text (`<figcaption>` or `<h3>`) inside the `<details>`, not baked into an image. Give the graph a text table fallback. Content inside a closed `<details>` stays in the HTML for indexing.

## How we apply it to Cedwyn
- /research/parcels/: title = "<n> instruments relied on by the corporation and <m> registrations in its name, <first year>–<last year>". Take n and m from transfers.v2.6.json, never typed by hand. Annotate the 31 Oct 1974 letters and each first registration with a title number and date.
- /research/twelve-year-pattern/ and the Dartboard header graphs: audit titles against rule 1. Generic titles ("Timeline", "Graph") become quantified ones.
- Run every title and annotation through tools/voice_lint.py (banned words) before commit. Titles never contain states, assertions, reported, deception or similar.
- The same rule applies to social quote cards and Shorts thumbnails (quote-pack runner): a top line with a count and a date, never a verdict.

## Sources
- vcg.seas.harvard.edu (abstract read 30 Oct 2026)
- filwd.substack.com (Enrico Bertini, read 30 Oct 2026)
- dl.acm.org (Kong et al. 2018; summary only, numbers not checked)
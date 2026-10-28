# LinkedIn post formats in 2026: documents for reach, images for engagement rate, links last

Date: 2026-10-28 (harvest run). Status: playbook; LinkedIn posting is from the project lead's own profile (saved login "LinkedIn — Cedwyn posting"; no LinkedIn API connection, see the project workspace).

## What the 2026 data states (two datasets that disagree, read side by side)
| Source (read in full) | Accounts | Measure | Top format | Notes |
|---|---|---|---|---|
| Socialinsider LinkedIn benchmarks (H1+Q3 2026 refresh) | company Pages | engagement / impressions | native documents 7.00% (2025, +14% YoY); Q3 2026 documents 6.40%, multi-image 6.40% | video 5.25% (falling), image 4.70%, text 3.50%, poll 3.60%, **link posts 2.50% (lowest every year)**; Page avg 5.20%. Likes/post for 1-5K-follower Pages: document 16, multi-image 30, image 27, video 23, text 9 |
| AuthoredUp (personal profiles, Mar 2025-Feb 2026; 894,168 posts for the profile/page split) | personal profiles | median ER + reach multiplier | image 3.49% ER (1.20x reach); **document/carousel 2.92% ER but 1.39x reach, the only format above median on both** | video 3.38% but 0.86x reach (median impressions fell 1,157 -> 740 in a year); text 2.28%; poll 0.65% ER at 1.78x reach; reshare 0.29x; article/newsletter 0.69x |
| AuthoredUp word count (375,274 posts) | personal | median ER | 51-100 words 2.75%, 101-200 2.73% | 1-50 words 2.33% |
| AuthoredUp follower bands | personal | median ER | 1,001-5,000 followers highest median 2.68% | company Pages median 2.59% vs profiles 2.36%; profiles have the higher ceiling (90th pct 5.77% vs 5.23%) |
| Van der Blom Algorithm InSights 2025 (1.8M posts, via Mercer MacKay summary; report itself not read) | mixed | reach | documents "declining due to penalties for low completion"; best 8-10 slides, strong first slide | external links: +5% reach vs prior year (still underperform); link at end of a short value-first caption loses less |

Why they disagree: Socialinsider divides by impressions on brand Pages; AuthoredUp uses medians on people's profiles. Agreement across all three: documents earn the most reach per post, link posts the least, video lost the most in 2025-26, and short-to-medium captions (51-200 words) beat one-liners.

LinkedIn Help a518909 (read): documents up to 100 MB and 300 pages; PDF/PPT/DOC; flatten layered PDFs, one page size throughout, animations show as stills; **viewers can download the document as a PDF**; you cannot replace the file after posting (only edit the description or delete).

## The routine (one LinkedIn post a week is enough at our size)
1. Pick format by goal: reach to new people -> document (8-10 slides); comments from existing connections -> single image; never a bare link post.
2. Document build: 1080x1350 portrait pages, one idea per slide, slide 1 = image + teaser line that makes slide 2 necessary, last slide = where the full record lives (text, not a promise of a tap: links inside PDFs are not reliable to click on mobile). Flatten; keep under 10 MB. `python3 tools/li_doc_pdf.py out.pdf slide*.png` builds and checks it.
3. Caption 51-200 words: the one surprising fact, then why it matters, then a question people can answer from their own knowledge (local history, land law). Link, if any, goes at the end of the caption, once.
4. First hour: reply to every comment with a real answer (comments with replies are the signal all three sources weigh most).
5. Measure after 7 days in the post analytics: impressions, reactions+comments, profile views, clicks. Log to the project workspace with format as the variable. Change one thing at a time.

## How we apply it to Cedwyn
- Turn each archive find into an 8-10 slide document: e.g. "What a 1824 survey plan shows, field by field" — scans/crops of the record on each slide, a source line on every slide ("Source: <holder>, <reference>, <date>", per the public-provenance rule), and the last slide naming the free sample on /ebooks/ in text.
- **Never upload a paid e-book chapter as a document**: LinkedIn lets every viewer download it as a PDF. Use the free sample's material only, or record crops.
- Land-law audience (BP v Buckler is a reading-list case): a document "the records behind a land-law case" in neutral wording, court's words shown as the court's view, no banned words (states, assertions, per, second-hand report, not checked, reported, deception, taken), never naming the project lead.
- Image posts for the weekly quote cards (already made by the quote-pack flywheel) are the engagement-rate format; reuse them on LinkedIn the same day.
- Posting is the project lead's own action from his profile unless a LinkedIn Page is created (linkedin-company-page-small-heritage-org.md); Tab prepares the PDF + caption in the project workspace for him to paste.

## What is not known
No published LinkedIn click-through figures for document posts; Van der Blom's "completion penalty" is from a summary, not the report. Our own 7-day numbers replace all of this after 4-6 posts.

## Sources
- socialinsider.io (read 28 Oct 2026)
- authoredup.com (read 28 Oct 2026)
- mercermackay.com (read; summary of Van der Blom 2025)
- linkedin.com (read)
# Reviews & social proof for e-books sold direct (2026)
Written 26 Oct 2026 by the project lead's Tab agent (skills harvest).

## What the evidence states (with numbers)
- Northwestern's Spiegel Research Center (with PowerReviews data; first published 2017, restated on their site in 2025-26):
  - A product with 5 reviews has 270% higher purchase likelihood than one with none. The gain flattens quickly after the first 5.
  - Showing reviews lifted conversion 190% on lower-priced items and 380% on higher-priced ones, so the £31.99 bundle needs reviews more than the free book does.
  - Purchase likelihood peaks at an average rating of 4.0-4.7 and falls as ratings near 5.0 ("too good to be true"). A few honest critical reviews help credibility.
  - A "verified buyer" badge raises purchase odds by 15%. Verified buyers rate more positively than anonymous reviewers.
  Source: spiegel.medill.northwestern.edu (full PDF linked there).
- UK law: since 6 April 2025 the DMCC Act bans fake reviews and concealed incentivised reviews; businesses must take reasonable steps to stop them and must not show reviews in a misleading way (e.g. hiding negatives). CMA guidance CMA208: assets.publishing.service.gov.uk; practicallaw summary w-046-5309.
- Indie-author testimony is split on back-matter "please review" pleas (selfpublishingadvice.org; r/selfpublish 147vioa): a short, polite, one-line ask with a direct link works; guilt-heavy pleas annoy readers.

## How-to
1. Collect only real reviews from real readers, through channels the reader chose:
   - Last page of each e-book: one line + one link to a review form ("Tell us what you found useful; we may quote you with your first name and town").
   - Stripe/Gumroad success page and the download page: same one-line ask.
   - Opted-in Mailchimp subscribers only (people who signed up), in the regular newsletter, never a separate individual email.
2. Form fields: rating 1-5, one sentence, first name + town (optional), consent tick to quote. Store with date and order reference so it can be marked verified buyer.
3. Publish all ratings, including critical ones; don't cherry-pick. Show the average and the count. Aim for the first 5 per book, then stop chasing.
4. No incentives in exchange for reviews. If a free copy was given (e.g. to a society librarian), label that review "received a free copy".
5. Other proof that needs no reviews: named institutional uses with permission ("held in the X Society library"), press mentions (once real), counts that are true ("1,067 views of the film"), and the evidence itself (a scan of a dated record is the strongest trust signal this archive has).
6. Placement: rating + count next to each Buy button and on the bundle; 1-2 short quotes under the hero on /ebooks/; Book JSON-LD with aggregateRating only once real reviews exist (never mark up invented ratings; Google penalises it).
7. Measure: conversion from /ebooks/ view to buy-click before and after reviews appear (GA4 events already planned: upsell_click, buy_click).

## How we apply it to Cedwyn
- Today Cedwyn has 0 sales and 0 reviews, so step 1 is building the collection path (in-book link, success-page link, review form on Cedwyn). A patch goes to the project workspace while the cedwyn repo freeze/committer lock is on.
- the project lead's rules: no outreach to private individuals, so no one-to-one review-request emails; asks live inside the book, on the success page, and in newsletters to people who opted in.
- First targets: the free v0.01 book (largest reader pool) to get the first 5 ratings, then the £9.99 v0.02 and the bundle, where reviews lift conversion most.
- Public text rules: quotes must not contain the banned words or accusations about named people; edit nothing but length (with "..."), and drop a quote that breaks the rules rather than rewording it.

## Sources
spiegel.medill.northwestern.edu · CMA208 Fake reviews guidance (gov.uk, Apr 2025) · uk.practicallaw.thomsonreuters.com · selfpublishingadvice.org · reddit.com
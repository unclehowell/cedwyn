# E-book cover A/B tests: what the published wins really show, and the free route

Skill harvested 31 Oct 2026. Topic: e-book launch / creative testing / CRO. Before this the skills folder had 0 hits for "cover test" and no file on *measuring* which cover sells. `ebook-shelf-poster-grid-covers-version-picker.md` covers making covers legible at thumbnail size (with `tools/cover_check.py`). This file covers choosing between covers with data.

## What the sources show (read 31 Oct 2026)
- **Tricia O'Malley, BookBub Insights, 11 Jul 2018 (author's own figures, read in full).** She ran 5 rounds of paid BookBub Ads tests on her *Althea Rose* cozy series. Each round changed only the cover. Budgets were $20-40 per ad, run at the same time, with the same targeting, using CPM so each version got similar impressions.
  - Round 1: 2.94% vs 2.97% CTR on 6,000 impressions each. A tie.
  - Round 2: the original needed about 8,000 impressions for the same clicks the new cover got from about 12,000. The original won by about 1 point.
  - Round 3: a border was added. 3.12% (217/6,964) vs 2.85% (162/5,684). She called it a win. **Re-checked with `tools/ab_stats.py`: Fisher p = 0.40, so it is a tie.**
  - Round 4: a typography-led "wild card" cover reached **5.2% CTR**, a clear win (per-arm counts not given).
  - Round 5: big typography on book 2 got **1.21% vs 0.58%** on 2,200 impressions each. ab_stats gives p = 0.04, P(B better) = 98.7%. A real win.
  - Outcome: new covers across the series and **+40% free downloads** of book 1 in the first weeks. That is a before/after comparison, so seasonality is not controlled.
  - Lesson in her own words: a Facebook poll of existing readers "ended up being the most confusing way to solicit feedback". Existing fans are not the new readers a cover has to win.
- **BookBub Insights, "How to Easily Test a Book Cover Design", Mar 2018 (read in full).**
  - Two ways to test: quantitative (an A/B test on random, equal audiences) and qualitative (polls, where each person sees both covers).
  - **Melissa F. Miller**, *Irreparable Harm*: $10 per variant, $1 CPC bid, narrow comp-author + Thrillers targeting. The new cover had **+17% CTR**. Counts were not published, so significance can't be checked.
  - **Rachel Shane** tested her cover in a **Mailchimp A/B email**. The *original* cover had **+35% CTR**, so she kept it. The test stopped a costly change.
  - Two strategies: test drastically different designs early, or one variable later (font, title size, image, colour).
  - Also cited: R.L. Mathewson went from 5-6 copies a day to 1,000+ a day after a recover (HuffPost 2013, second-hand, not checked).
- **Simon Avery, ALLi, Dec 2013 (designer's own case, read).** J.S. Taylor's romance series was redesigned for thumbnails, with a "bestseller" tag that shows at small size. US sales went from about 400 a day to 800-1,000 a day, and UK sales from nil to 200 a day. About 10,000 extra $3 sales in a month. This is a vendor testimonial and before/after only.
- **Mailchimp free plan (our own `mailchimp-free-plan-2026-limits-gates.md`):** A/B testing is a paid feature. Free has 250 contacts and 1 audience. So Rachel Shane's built-in email split is **not available to us for free**.

## What this means
1. **Most published "cover wins" are under-powered.** At a 3% CTR, detecting a +17% lift needs about **19,000 views per arm**, and +50% needs about 2,500 (`ab_stats.py samplesize 0.03 0.17` / `0.03 0.5`). Small tweaks like borders or font weight can't be read at small-site traffic. Only **drastic** changes (image-led vs typography-led, a different focal image) produced clear wins in these cases.
2. **Measure strangers, not fans.** Polls of followers or members measure taste and loyalty, not the click from a cold browser. Use them for a veto ("which is clearly worse?"), never as the decision.
3. **Change one thing, at the same time, with the same audience.** Run simultaneously and randomly. A sequential "old cover this week, new cover next week" test is weaker. If that's all you can do, read it with `tools/prepost.py` and say so.
4. **Metric = click to the product/buy page**, then purchases if there are enough. Decide the stop size before starting (ab_stats) or use a bandit with stop rules (`tools/bandit.py`: at least 14 days, P(best) >= 95% or PVR < 1%).
5. **A loss is a win.** Rachel Shane's test kept a better original. Always include the current cover as the control.

## The free route (zero spend), step by step
1. **Gate:** each candidate first passes `tools/cover_check.py` (2:3 ratio, size, contrast, squint sheet at 100/160 px). A cover that fails the squint test doesn't enter the test.
2. **Pick two drastically different designs** of the same title: A = current, B = typography-led (big title, 2-5 words, high contrast, one archive image or none). This follows the O'Malley result. Don't test borders or tints.
3. **On-site split (the only free random audience):** randomly give each visitor to /ebooks/ cover A or B for one title, sticky by cookie. Count unique visitors who saw it and unique clicks to that title's product/buy link. Exclude bots (`tools/human_traffic_split.py`, `bot_click_flag.py`). Read it weekly with `bandit.py "A:shown:clicked" "B:shown:clicked" --days N`.
4. **If traffic is too thin** (under about 750 views per arm in 4 weeks, which is the floor for detecting a doubling): don't call a winner. Keep the bandit running, or fall back to a 2-week alternation with prepost.py and a "not checked" label.
5. **Fan poll for veto only:** one Facebook Group / Instagram Story poll, read as "is either clearly disliked?" Never treat it as the decision (O'Malley).
6. **Paid route (proposal only):** BookBub Ads CPM, about $20-40 per arm, comp-author targeting, both ads live at once. This is the cleanest cold-audience test, but it's spend, so it needs the project lead's GO and isn't done by any flywheel.
7. **Log** each test in `the project workspace` with variant, dates, shown/clicked, p or P(best), and the decision. Keep losing covers in the repo so they aren't re-tested.

## How we apply it to Cedwyn
- **Where:** cedwyn.bucklerfamily.estate/ebooks/ poster-card shelf (see the shelf skill). The cover image is the card's main element, so the click on the card is the metric.
- **First test (proposal for the CEDWYN ONPAGE run or a bizdev task; it touches the live site and the main branch triggers a build, so batch it with the next main change):** the best-selling or most-viewed title only. Current cover vs a typography-led variant, 50/50 sticky split via a small inline script or the existing Worker. Log impressions and card clicks to the existing analytics beacon (`tools/wae_beacon`). Read with bandit.py weekly. Stop at 14 days minimum.
- **Before building it,** check the last 4 weeks of non-bot /ebooks/ visitors (growth-report `cf_traffic.py`). If the title's card gets under about 200 views a week, a doubling takes over 4 weeks to read. Say that up front rather than call a winner early.
- **Don't** use the Mailchimp free list for a split (no A/B on free; 250-contact cap). Don't poll Academy members or followers as the decision. Don't add press or "bestseller" style tags: there are no sales assertions to back them, and that would be a misleading claim.
- Editorial rules still apply to cover text: no insignia, no faces of private people, never name the project lead, banned words.
- Report only decisions (winner shipped, or tie and why); routine reads go in the Sunday growth notes.

## Sources
- insights.bookbub.com (Tricia O'Malley, 2018-07-11; read via a reader proxy because the site blocks scripts)
- insights.bookbub.com (BookBub, 2018-03; Miller +17%, Shane +35% original)
- selfpublishingadvice.org (Simon Avery, ALLi, 2013-12-06; designer testimonial)
- huffingtonpost.com 2013-05-30 book-cover-design-indies (Mathewson, cited by BookBub; not checked)
- own: mailchimp-free-plan-2026-limits-gates.md; tools/ab_stats.py, bandit.py, cover_check.py, prepost.py
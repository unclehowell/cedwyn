# Paid archive vs open archive: how newsletter writers paywall the back catalogue (Substack / Ghost)

Skill date: 29 Oct 2026 (skills harvest 23:30Z). Status for Cedwyn: a decision note plus a PROPOSAL. Nothing has been changed on any site.

## What practitioners report (primary sources, read unless marked)
- **Substack's "Auto-paywall after" setting** (Substack support article 9503089884308; the page blocked our reader, so this comes from its title and search snippet, not checked in full): Settings > Payments > Paywalling > "Auto-paywall after", then enter how long a post stays free. Every free post becomes paid-only once it passes that age, so new posts stay free and the archive becomes the paid product.
- **Substack Writer Office Hours, "Launching paid subscriptions"** (on.substack.com, snippet): "offer everything for free at first and then paywall your archive, so that all posts are paywalled after a certain amount of [time]". Substack staff offer this as a valid launch route.
- **Sarah Fay, "The 15 Rules of Paywalling on Substack in 2026"** (11 May 2026, 700 private clients; post is paid, so only the snippet was read): "Don't autopaywall your archive. Paywall chosen posts on purpose and send subscribers to them instead." Practitioners disagree, so treat this as something to test, not a rule.
- **Pubstack Success, "$156,960 per year from Substack"** (case study of The Product Compass, read in full): Substack's declared average free-to-paid conversion is **6%**. The Product Compass converts **2% of ~92K**. Larger lists (50K+) convert lower than mid-sized ones. Substack's advice from its own data is roughly **3 free posts for every 1 paid post**. The Product Compass reverses that (3 locked to 1 free) but puts a large part of every paid post above the paywall. **Where the paywall sits inside a post matters as much as how many posts are paid.**
- **Newsletter Circle, "8 proven paywalling strategies used by top Substack newsletters"** (30 Aug 2025; free part read): "There's no one-size-fits-all answer." The strategies they list include **time-sensitive paywalls with expiry** (paid first, free later, or free first, paid later), a few in-depth paid pieces each year, and generous free previews.
- **Jane Friedman, "Substack is both great and terrible for authors"** (upd. 31 May 2025, read): her paid newsletter has **~2,500 paid subscribers after nine years** and earns six figures. Her free newsletter has ~30,000 readers. If she had to choose one, "I'd keep the free one… my free newsletter is a better marketing and promotion vehicle than the paid one." For a book author, the free list sells the books.
- **Ghost protected content** (ghost.org, read): each post has one of four access levels: Public, Members only (free sign-up), Paid-members only, or Specific tiers. Ghost states public content is the level for "SEO and getting content ranked" and for social sharing. Ghost has **no built-in auto-paywall by age**. Archive paywalling there is manual, per post (or by API). Ghost **gift links** (help/publisher-gift-links, snippet) give a non-member full access to one members-only post, which works as a press or partner preview.
- **Ghost plan note** (Luxe Themes resource, snippet, not checked against Ghost's pricing page): paid subscriptions were removed from Ghost's Starter plan in the July 2025 pricing update.
- **Serial platforms:** Amazon's KDP help (Kindle Vella Update FAQ, snippet) states Vella was wound down **effective 26 Feb 2025**. It stopped accepting new episodes on 4 Dec 2024 (KDP community post). There is no Vella-style shelf to join. Serial chapters belong on our own pages and list (see `serialised-free-edition-web-email-instalments.md`).

## The playbook
1. **Pick the model on purpose.** The three real options are:
   - (a) Open archive with paid extras. Everything stays free, and money comes from books, versions and support. This is Friedman's route.
   - (b) Rolling paywall. New posts are free and older ones lock after N days. This is Substack's auto-paywall.
   - (c) Chosen paid posts. Most posts are free, with a few deep pieces paid, and the paywall sits partway down so the preview sells.
2. **Search and AI visibility** need public pages (Ghost's own guidance). A paywalled archive gives up rankings, citations and shares. Don't take that cost until there is a paying audience to protect.
3. **Ratio:** start at about 3 free to 1 paid (Substack data). Put a real part of each paid piece above the paywall.
4. **Benchmarks to judge against:** a 6% paid share is the Substack average. 2% is normal at large list sizes. At under 1,000 subscribers, count buyers, not percentages (see `zero-sales-diagnosis-traffic-vs-conversion-binomial.md`).
5. **Previews:** use a gift link or free code for one paid piece per journalist or partner, rather than unlocking the archive.
6. **Measure:** paid signups per 100 new free subscribers, and how many people land on a locked post and then buy within 7 days. Run one change per window (see `growth-experiment-loop-autoresearch-keep-discard.md`).

## How we apply it to Cedwyn
- **Decision: the Cedwyn research archive stays open (model a).** The owner has said cedwyn.bucklerfamily.estate is the public LLM wiki, brain and memory (29 Oct 2026). Locking it would hide it from search, AI answers and the evidence chain, which is the opposite of the goal. Practitioner evidence agrees: the free layer is the marketing.
- **Money stays on the existing version ladder.** Under the owner's rule of 29 Oct 23:15, v0.0.1 of everything is free and each later semantic version is £4.99 more. That rule is already a "time-sensitive paywall": the first release is free for good and each re-release is paid. We don't add a second, age-based paywall on top, because readers would face two rules.
- **Newsletter (Mailchimp free plan):** send each new free episode or release in full. In the email, link one paid version as the "deeper cut", with the paywall below the free summary. Track paid clicks per send with `tools/utm.py`.
- **Previews for press and partners:** one free code or gift link per person for the latest paid version (see `ebook-download-cards-gift-shop-events-single-use-codes.md`). Never unlock the whole archive.
- **No Vella:** serial chapters are published on Cedwyn and in the newsletter. Vella closed in Feb 2025.
- **Review trigger:** re-open this decision only if the newsletter passes about 1,000 subscribers and paid conversion is still under 1% after 90 days. Otherwise keep the archive open.

## Sources
- support.substack.com (snippet; page blocked)
- on.substack.com (snippet)
- substackwritersatwork.com (snippet; paid post)
- pubstacksuccess.substack.com (read)
- newslettercircle.substack.com (free part read)
- janefriedman.com (read)
- ghost.org (read); ghost.org (snippet)
- kdp.amazon.com (snippet); kdpcommunity.com (snippet)
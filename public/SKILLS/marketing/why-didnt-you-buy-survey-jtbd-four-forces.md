# "Why didn't you buy?" non-buyer survey + JTBD switch interviews (four forces)

Checked 30 Oct 2026. Mainstream conversion research for a shop with traffic and clicks but few or no sales.

## The evidence (primary practitioners)
- **Jay Clouse, Creator Science (21 Apr 2024, read):** launch of CreatorHQ to his email list: 326 bought; **2,426 clicked to the sales page and did not buy**. He sent the non-buyers a short anonymous Tally survey with 2 questions: (1) "Why did you decide it wasn't for you?" (required) (2) "Anything else you want to add?" (optional). **183 responses (~7.5% of non-buyers), 107 answered the optional question** with long, specific answers ("too much money to risk not knowing if I would actually use it"; "not exactly sure about the workflow"). Anyone answering "Pricing" got 2 follow-ups: what price would feel like a bargain, and what would feel like a stretch but maybe worth it. He used it as a **perception gap** read, not to change the price. Actions taken: show the product working (gifs/video), answer objections up front (FAQ), show the learning curve is easy. The idea came from Jeremy Enns and Justin Jackson's podcast. A free Tally template is linked from the post.
- **Bob Moesta & Chris Spiek, jobstobedone.org (read):** the **switch interview**: one-to-one, 45-90 min, with people who switched (bought) in the last **30-90 days**, including people who *almost* bought and didn't ("the struggle is the data"). Frame it like a documentary, find the *first thought* (often weeks earlier, triggered by an event), walk the timeline event by event (first thought > passive looking > event > active looking > decision > purchase), ask "and then what happened?", write down their exact words. Patterns appear within **5-8 interviews** for one job. Techniques: play dumb, deliberately misstate the order so they correct you, interview in pairs.
- **Four forces:** a switch happens only when **Push + Pull > Anxiety + Habit**. Most sellers work on pull (making the product sound better) and ignore anxiety ("what if it isn't worth it?") and habit ("I'll just read the free pages"). Anxiety falls with guarantees, proof, samples and removing risk; habit falls when the switch feels small and reversible.

## How to run it (small shop version)
1. **Pick who to ask.** Non-buyers with intent: people who clicked a "buy" link in an email but didn't pay (Mailchimp click report on the /ebooks/ link minus Stripe/Gumroad buyers), or opened a checkout that was not completed. Buyers (if any) for the switch interview.
2. **Survey (async, cheap):** 2 questions as above, anonymous, mobile form, one email, no incentive needed (Clouse got 7.5% without one). Add a choice list before the free text so you can count: Price / Not sure what's inside / Didn't trust the checkout / Wanted print / Not now / Already read it free / Other.
3. **Price follow-up only for "Price":** bargain price, stretch price. Read the gap, don't simply cut the price.
4. **Code every free-text answer into the four forces** (push/pull/anxiety/habit) plus their exact phrase. Free helper: `tools/forces_tally.py answers.csv` (stdlib; keyword lexicon you can edit) prints counts per force and the top quoted phrases.
5. **Act on the biggest restraining force first**: anxiety > sample chapter, contents list, "what you get" image, refund/cancellation line, who wrote it; habit > a reason the paid version beats the free pages (new records, offline, references).
6. **Interview 5-8 people** once you have buyers or warm readers (30 min is enough for an e-book; JTBD's 45-90 is for bigger purchases). Use their words in headlines and FAQs.
7. Re-measure the buy-click > paid rate 2-4 weeks after the change. Small numbers: use tools/ab_stats.py, don't declare a win on a handful.

## UK rules
- Anonymous survey: no personal data needed. If you collect emails, say why and how long you keep them (UK GDPR). Sending it to existing subscribers about something they clicked is service/feedback mail; keep an unsubscribe link.
- Never invent or "construct" quotes from survey answers for public copy; use real wording only with permission (see constructed-testimonials-six-questions-uk-cap-rules.md).

## How we apply it to Cedwyn
- **PROPOSAL (owner GO before any email goes out):** one Mailchimp *draft* to subscribers who clicked an /ebooks/ link in the last 60 days and did not buy: "Quick question: what stopped you?" with the 2 questions + choice list on a free form (Tally/Google Forms on the connected Google account). Draft only; never send without GO.
- With zero sales so far, the question is the cheapest way to learn *why* rather than guess (pairs with zero_sales_odds.py and the onsite one-question survey, onsite-one-question-survey-buy-path.md, which asks *on the page*; this one asks *after the fact*, by email).
- Expected answers to check for: "already read it free on the site" (habit), "not sure what's in it" (anxiety), "price" (perception gap). Each maps to a concrete fix on /ebooks/ (contents preview, sample PDF, what's new versus the free pages).
- Public copy rules: never name the owner; none of the banned words (states, assertions, per, second-hand report, not checked, reported, deception, taken); quotes from readers only with permission and only verbatim.
- Log answers (anonymised) to the project workspace; one line per finding into the Sunday growth notes.

## Sources
- creatorscience.com (Jay Clouse, 21 Apr 2024)
- jobstobedone.org ; jobstobedone.org (Moesta & Spiek)
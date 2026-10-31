# Streamlined cognitive walkthrough: can a first-time visitor buy without help?

**Use when:** you want to know whether a **new** visitor can complete one task (find a book, buy it, get the file) on the first try. It tests learnability, step by step, with no users needed.

## What the practitioner evidence shows
- The original method (Wharton, Rieman, Lewis and Polson, *The Cognitive Walkthrough Method: A Practitioner's Guide*, 1994) asks **four questions at every step**: Will the user try to achieve the right effect? Will they notice the correct action is available? Will they associate that action with the effect they want? If they do it, will they see progress?
- Rick Spencer at Microsoft (CHI 2000) cut it to **two questions**, because development teams were too pressed for time and too defensive for the full version:
  1. *Will the user know what to do at this step?*
  2. *If the user does the right thing, will they know they did the right thing and are making progress toward the goal?*
- Spencer's ground rules, which UsabilityBoK repeats: **no design discussions during the walkthrough, designers don't defend their designs**, and a facilitator enforces both. The streamlined version is widely used but has little published validation (UsabilityBoK), so treat its output as a list to check, not as proof.
- NN/g frames it as a check on **learnability for new or infrequent users**. A heuristic evaluation looks at the whole interface against principles; a walkthrough follows one task's exact path, one action at a time.

## How to run one (about 60-90 minutes per task)
1. **Define before you start** (NN/g's four questions): whose perspective (one persona with their prior knowledge), which task, the correct action sequence, and the interface version (live URL, date, phone width).
2. **Write the happy path** as numbered actions. Example: "1 tap Shop in the menu, 2 tap the book cover, 3 tap Buy £4.99, 4 enter e-mail, 5 pay, 6 open the e-mail, 7 download".
3. **At each action, ask the two questions.** Answer yes or no with a short story of *why* a newcomer would or wouldn't know. Any "no" is a failure story. Record the step, the question that failed, the reason and a screenshot.
4. **Don't redesign during the session.** Keep a separate "parking lot" for fix ideas and review it after the walkthrough.
5. **Report** the failure stories in step order, then decide fixes. Re-walk the same path after any change.

## Pitfalls
- Using an expert's knowledge: the persona must not know your site's names, menus or where the shop lives.
- A vague task ("explore the site") makes a walkthrough impossible; it needs one goal and one correct path.
- Skipping the off-site steps: payment pages and the delivery e-mail are part of the task.

## How we apply it to Cedwyn
- **Persona:** someone who arrived from a YouTube Short or a search result about Llandough history, on a phone, who has never heard of the site, its themes or the academy.
- **Tasks, in order:** (a) from a /research/ or /wiki/ article, buy the matching e-book; (b) from the home page, find and buy the £19.96 bundle; (c) join the /learn/ academy. One task per session.
- **Walkers:** one agent narrates as the persona; a second agent independently answers the two questions for the same steps; disagreements are the interesting items. A human confirms any "no" on the live page at 390 px (light and dark) before filing.
- **Watch especially:** step 1 from articles (does a reader even know there is a book?), the moment of leaving for the checkout (is it clear the shop has changed?), and the confirmation/delivery step (Q2: will they know it worked?).
- **Output:** failure stories with screenshots, filed as proposals for copy and journey changes on the after-framing queue. Markup-only fixes follow the repo freeze rules. Prices stay fixed; this method finds friction, not price.

## Sources (read 31 Oct 2026)
- Wharton, Rieman, Lewis, Polson, The Cognitive Walkthrough Method: A Practitioner's Guide (Univ. of Colorado ICS tech report 93-07): colorado.edu
- UsabilityBoK, Cognitive Walkthrough (Spencer 2000 streamlined two questions, ground rules): usabilitybok.org
- Spencer, The streamlined cognitive walkthrough method (CHI 2000), via ResearchGate: researchgate.net
- NN/g, Evaluate Interface Learnability with Cognitive Walkthroughs: nngroup.com
- NN/g, How to Conduct a Cognitive Walkthrough Workshop: nngroup.com
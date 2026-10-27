# AI-made images on social: labels, metadata and the engagement cost
Harvested 2026-10-27. Relevant because every Cedwyn NFT/"Tŷ Mawr" piece, the restored-house set and the hologram scene are AI-rendered, and they auto-post to Facebook/Instagram daily (social.py) and to YouTube.

## What the platforms do (their own words)
- **Meta (Facebook, Instagram, Threads)**: since 2024 adds an "AI info" label when it detects industry-standard AI indicators (C2PA / IPTC metadata) or when the poster self-discloses (about.fb.com, label renamed 1 Jul 2024). From Sep 2024: content only *edited* with AI gets the label moved into the post menu; content detected as *generated* by AI keeps the visible label, which states whether it came from industry signals or self-disclosure. Instagram separately states unlabeled AI-generated *profiles* it detects "may see limits to their profile's reach" (creators.instagram.com).
- **YouTube** (Help 14328491): disclosure REQUIRED for realistic AI content - makes a real person appear to say/do something, alters footage of a real event or place, generates a realistic scene that did not occur, or AI music that is the focus. NOT required for clearly non-realistic content (animation, fantasy) or minor aesthetic edits. Set "AI use" in Studio at upload; YouTube then labels it.
- **EU AI Act Art. 50** (in force 2 Aug 2026): deployers must disclose deepfakes; for "evidently artistic, creative, satirical, fictional" work the duty shrinks to disclosing it "in an appropriate manner that does not hamper the display or enjoyment of the work". Cedwyn is UK-based but reaches EU readers; a small caption line meets this cheaply.

## What a label costs (primary research)
- Copenhagen Business School (Seeger et al., Electronic Markets 2026; two experiments, ~700 participants): labels lowered engagement vs "human-created". Emotional posts: AI-enhanced about -24 points, AI-generated about -46 points of emotional engagement. Rational/informational posts: -13 and -27 points. Labelling *after* viewing softened the AI-enhanced penalty by ~13 points; for fully AI-generated content timing made no difference.
- Read: the penalty is biggest when the post pretends to be an emotional real moment; smaller when the post is plainly informational or plainly art.

## Playbook
1. Never let an AI image pass as a photograph of a real past event. Frame it as what it is: an artist's reconstruction / restoration / concept. This keeps us outside YouTube's mandatory realistic category for clearly illustrative pieces and avoids the misleading-photo trap.
2. Self-disclose consistently and briefly: Instagram/Facebook "AI label" toggle when posting realistic-looking renders; caption line "Artist's reconstruction (AI-assisted)". A self-disclosed label reads better than a detected one and protects reach on Instagram.
3. YouTube: tick "AI use" for any realistic AI scene of the real farm or real events (the film, the hologram estate scene); not needed for title cards, stylised art or Ken Burns of real archive photos.
4. Pair art with evidence: lead with the rational hook (the date, the record, the place) and let the image illustrate it; per the CBS data, informational framing roughly halves the label penalty.
5. Metadata: gpt-image/other generators may embed C2PA; re-saving with PIL (signature overlay, resize) usually strips it, so Meta may NOT auto-label - which makes self-disclosure the honest default rather than relying on detection. Check with `exiftool -a -G1 file` if installed (not installed here; disk tight).
6. Never use "photo of" / "rare footage" wording for renders; never show a likeness of real family members (existing house rule).

## How we apply it to Cedwyn
- social.py posts of NFT/restored-house art: add the caption suffix "Artist's reconstruction (AI-assisted)" and set Meta's AI label flag where the API exposes it; proposal for the auto-social owner, not applied by this run.
- /nft-art/ and Patagonia "(coming soon)" gallery: one small line under the gallery, "Reconstructions made with AI-assisted tools from period records", satisfying Art. 50's artistic-work duty without hampering display. Wording must pass the editorial banned-word list (it does).
- Movie / Mary Williams short / hologram scene on YouTube: tick "AI use" (realistic scenes of a real place and real events). The private short stays private regardless.
- Captions lead with the record ("1955: the possession order...") and use the image as illustration, to stay in the smaller "rational content" penalty band.
- Measure: compare reach/saves of labelled vs unlabelled-era posts in the Sunday growth report (small samples: directional only).

## Sources
- about.fb.com (updates 1 Jul and 12 Sep 2024; read 27 Oct 2026)
- creators.instagram.com
- support.google.com (read 27 Oct 2026)
- ai-act-service-desk.ec.europa.eu (read 27 Oct 2026)
- cbs.dk ; paper link.springer.com
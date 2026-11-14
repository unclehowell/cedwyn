# Chubut H3

The Chubut H3 map webapp of [cedwyn.bucklerfamily.estate](https://cedwyn.bucklerfamily.estate/chubut-h3/), in its own repository.

Split out of `unclehowell/cedwyn` (branch `section/chubut-h3`) as part of REPO SPLIT (issue #188). That repository holds hundreds of branches; a job on one webapp should never need the rest.

## Get the code

```
git clone --depth 1 https://github.com/unclehowell/cedwyn-chubut-h3.git
```

## Where to send changes (read this first)

The authoritative `split-repos.json` in `unclehowell/cedwyn` lists this app as `mode: split-repo` and `deploy: repo`. **This repository's `main` branch is the app source of truth.**

1. Make app changes on a feature branch in this repository.
2. Open the pull request into this repository's `main`.
3. The estate build reads this repository directly for `deploy: repo` apps (see `tools/assemble.py` in `unclehowell/cedwyn`). It records the exact source commit and fails closed if the repository cannot be read.
4. The retained `section/chubut-h3` branch in `unclehowell/cedwyn` is a legacy copy, not the app's development or deployment source. The central `sync-split-repos` workflow excludes `deploy: repo` apps, and the local mirror workflow below must run only when the authoritative manifest explicitly says `mode: mirror`.

`SPLIT.json` records the source commit from the initial split; it is historical provenance, not a live sync indicator.

## History before the split

https://github.com/unclehowell/cedwyn/commits/section/chubut-h3

Never force-push; never delete the old branch.

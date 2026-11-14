# Mr Wolf

The Mr Wolf webapp of [cedwyn.bucklerfamily.estate](https://cedwyn.bucklerfamily.estate/mr-wolf/), in its own repository
(webapp migration 59+1, issue #188 on unclehowell/cedwyn).

Split out of `unclehowell/cedwyn` branch `section/mr-wolf` on 5 Nov 2026. That repository holds about 300 branches; a job on one webapp
should never need the rest.

## Get the code

```
git clone --depth 1 https://github.com/unclehowell/cedwyn-mr-wolf.git
```

## Where to send changes (read this first)

The authoritative `split-repos.json` in `unclehowell/cedwyn` lists this app as `mode: split-repo` and `deploy: repo`. **This repository's `main` branch is the app source of truth.**

1. Make app changes on a feature branch in this repository.
2. Open the pull request into this repository's `main`.
3. The estate build reads this repository directly for `deploy: repo` apps (see `tools/assemble.py` in `unclehowell/cedwyn`). It records the exact source commit and fails closed if the repository cannot be read.
4. The retained `section/mr-wolf` branch in `unclehowell/cedwyn` is a legacy copy, not the app's development or deployment source. The central `sync-split-repos` workflow excludes `deploy: repo` apps, and the local mirror workflow below must run only when the authoritative manifest explicitly says `mode: mirror`.

`SPLIT.json` records the source commit from the initial split; it is historical provenance, not a live sync indicator.

## Preview

Cloudflare Pages project `cedwyn-mr-wolf` builds every branch and pull request: https://cedwyn-mr-wolf.pages.dev/

## History before the split

https://github.com/unclehowell/cedwyn/commits/section/mr-wolf

Never force-push; never delete the old branch.

# AGENTS.md — read this before you touch the code

This repository is about 43 GB in total: some 290 branches, each a separate site section or webapp, with history.
One branch on its own is small (0.2 MB to about 130 MB). **Never clone the whole repository to change one branch.**

## Get only the branch you need

```
git clone --depth 1 --single-branch --branch <branch> --filter=blob:none https://github.com/unclehowell/cedwyn.git
```

- `--single-branch --branch <branch>`: only that branch, no other refs.
- `--depth 1`: only the latest commit, no history.
- `--filter=blob:none`: file contents arrive on demand.

Only one folder? Add a sparse checkout:

```
git clone --depth 1 --single-branch --branch <branch> --filter=blob:none --sparse https://github.com/unclehowell/cedwyn.git
cd cedwyn && git sparse-checkout set <folder>
```

Never run `git clone` without `--single-branch`, `git fetch --all`, `git clone --mirror`, or `git pull` of every branch.
Need a second branch later? Fetch just that one: `git fetch --depth 1 origin <other-branch>:<other-branch>`.

Full guide: [docs/AGENT-CLONE.md](docs/AGENT-CLONE.md). House rules: [CONTRIBUTING.md](CONTRIBUTING.md) and the Cedwyn Academy at /academy/.

## Webapps moving to their own repositories

The largest webapps are being moved out of this repository into their own (see docs/AGENT-CLONE.md, "Split repositories").
Until a webapp's entry in `split-repos.json` reads `"mode": "split-repo"`, its branch here stays the place to send pull requests.

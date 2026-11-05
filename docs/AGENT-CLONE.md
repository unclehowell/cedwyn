# Getting the code without downloading everything

The `unclehowell/cedwyn` repository holds every site section and webapp as its own branch (about 290 branches, ~43 GB
with history, measured 5 Nov 2026). A plain `git clone` downloads all of it. A job almost always needs one branch.

## The one command

```
git clone --depth 1 --single-branch --branch <branch> --filter=blob:none https://github.com/unclehowell/cedwyn.git
cd cedwyn
```

| Flag | What it saves |
| --- | --- |
| `--single-branch --branch <branch>` | every other branch and tag |
| `--depth 1` | the history of that branch |
| `--filter=blob:none` | file contents you never open (fetched on demand) |

Typical cost: a few MB instead of tens of GB.

### One folder only

```
git clone --depth 1 --single-branch --branch <branch> --filter=blob:none --sparse https://github.com/unclehowell/cedwyn.git
cd cedwyn
git sparse-checkout set <folder> [<folder> ...]
```

### Working and sending a pull request

```
git switch -c <your-work-branch>
# edit, then
git add -A && git commit -m "<what changed>"
git push origin <your-work-branch>
```

Open the pull request against the branch the job names. A shallow clone pushes normally.

### Need another branch?

```
git fetch --depth 1 origin <other-branch>:<other-branch>
```

### Already have a full clone?

Keep it, but stop fetching everything: `git config remote.origin.fetch "+refs/heads/<branch>:refs/remotes/origin/<branch>"`.

### Do not

- `git clone https://github.com/unclehowell/cedwyn.git` (no flags)
- `git fetch --all`, `git clone --mirror`, `git pull --all`
- check out every branch to search them: use GitHub code search, or the raw file URL
  `https://raw.githubusercontent.com/unclehowell/cedwyn/<branch>/<path>` to read one file.

### In GitHub Actions

`actions/checkout@v4` with `fetch-depth: 1` and the `ref:` you need (every workflow here already does this).

## Branch sizes (5 Nov 2026, files on the branch tip)

| Branch | Size |
| --- | --- |
| section/wiki | 134 MB |
| section/research | 48 MB |
| main | 28 MB |
| dartboard | 5.4 MB |
| section/wales-3d | 3.1 MB |
| section/fcg | 2.9 MB |
| section/forensic | 1.9 MB |
| section/tithe-h3 | 1.1 MB |
| hive | 0.9 MB |
| section/argentina-3d | 0.2 MB |

## Split repositories

The biggest webapps get their own repositories, so a job on one of them never touches this one:

| Webapp | New repository | Old branch here |
| --- | --- | --- |
| Wales 3D world | unclehowell/cedwyn-wales-3d | section/wales-3d |
| Argentina Tŷ Mawr 3D world | unclehowell/cedwyn-argentina-3d | section/argentina-3d |
| Tithe H3 map | unclehowell/cedwyn-tithe-h3 | section/tithe-h3 |
| Hive | unclehowell/cedwyn-hive | hive |
| Dartboard | unclehowell/cedwyn-dartboard | dartboard |

`split-repos.json` (repository root) records each one's mode:

- `mirror` (now): the old branch here stays the source. The new repository copies it every 30 minutes. Send pull requests to the old branch.
- `split-repo` (after the owner switches it): the new repository is the source. `sync-split-repos.yml` copies it back into the
  old branch every 30 minutes, so the live build and every old path keep working. Send pull requests to the new repository.

No branch is deleted by the move.

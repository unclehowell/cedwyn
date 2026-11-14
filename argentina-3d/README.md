# Argentina Tŷ Mawr 3D world

The Argentina Tŷ Mawr 3D world webapp, served at [bucklerfamily.estate/argentina-3d/](https://bucklerfamily.estate/argentina-3d/) (direct route; the legacy /argentina/ path is retained).

It was split out of `unclehowell/cedwyn` (branch `section/argentina-3d`) on 5 Nov 2026, because that repository holds about 290 branches
(~43 GB with history) and a job on one webapp should never need the rest. This repository is a few MB
(12 files, 0.2 MB at the split).

## Get the code

```
git clone --depth 1 https://github.com/unclehowell/cedwyn-argentina-3d.git
```

## Where to send changes

The current estate split inventory lists this app as `mode: split-repo` and `deploy: repo`. **This repository's `main` branch is the app source of truth.**

1. Make app changes on a feature branch in this repository.
2. Open the pull request into this repository's `main`.
3. The estate build reads this repository directly for `deploy: repo` apps (see `tools/assemble.py` in `unclehowell/cedwyn`). It records the source commit and fails the build if the repository cannot be read; it does not fall back to a legacy branch.
4. Do not submit app changes to the retained `section/argentina-3d` branch in `unclehowell/cedwyn`. The central `sync-split-repos` workflow deliberately skips entries with `deploy: repo`; that branch is not this app's development or deployment source.

The local `mirror.yml` is mode-gated. While this app remains `split-repo`, it must not copy the old branch over this repository's `main`.

Full instructions: [REPO-SPLIT.md](https://github.com/unclehowell/cedwyn/blob/main/docs/REPO-SPLIT.md).


## Previews

Cloudflare Pages builds this repository itself (project `cedwyn-argentina-3d`): `main` at https://cedwyn-argentina-3d.pages.dev/ and every
branch or pull request at `https://<branch>.cedwyn-argentina-3d.pages.dev/`, with the link commented on the pull request.
`preview.yml` is the fallback route (wrangler with the secrets `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`, unset; it stops quietly).

## History before the split

The full history stays on the old branch: https://github.com/unclehowell/cedwyn/commits/section/argentina-3d

Latest commits on `section/argentina-3d` at the split:

| Date | Commit | Change |
| --- | --- | --- |
| 2026-11-05 | `0359f8a` | section/argentina-3d: note the Cloudflare staging preview URL in README |
| 2026-11-04 | `8d97ea5` | Argentina 3D v0.2.0: frame the helicopter view closer on phones |
| 2026-11-04 | `4f148f9` | Argentina 3D v0.2.0: changelog |
| 2026-11-04 | `2e65beb` | Argentina 3D v0.2.0: Tŷ Mawr rebuilt from three reference photographs, helicopter and ground views |
| 2026-11-04 | `b36e8de` | argentina-3d v0.1.0: stone and lime-wash textures cut from album photograph 098 |
| 2026-11-04 | `c8a7f9b` | argentina-3d v0.1.0: sky shader (three r160), README, changelog |
| 2026-11-04 | `3aaa5de` | argentina-3d v0.1.0: separate Patagonia 3D world with Tŷ Mawr reconstructed from the 1974 survey and album pho |

Never force-push; never delete the old branch.

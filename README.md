# Personal Blog

A [Hexo](https://hexo.io/) blog using the [Minos](https://github.com/ppoffice/hexo-theme-minos) theme.

## Setup

The theme lives in a **git submodule** ([themes/minos](themes/minos)), so a plain
`git clone` will leave that directory empty and the site will not build.

```bash
git clone --recurse-submodules <blog-remote>
cd blog
pnpm install
```

Already cloned without `--recurse-submodules`? Fetch the theme after the fact:

```bash
git submodule update --init --recursive
```

## Local development

```bash
pnpm server     # http://localhost:4000
pnpm build      # generate static site into public/
pnpm clean      # clear cache (db.json) and public/
```

## Configuration

| File | Purpose |
| --- | --- |
| [_config.yml](_config.yml) | Site config — title, URL, permalinks, active theme |
| [_config.minos.yml](_config.minos.yml) | Minos theme config |

Theme settings belong in `_config.minos.yml` at the repo root, **not** in
`themes/minos/_config.yml`. Hexo v5+ merges a root-level `_config.[theme].yml`
over the theme's own config, and the theme repo gitignores its internal
`_config.yml` — anything written there is untracked and will be lost.

## Updating the theme

```bash
cd themes/minos
git pull origin master
cd ../..
git add themes/minos && git commit -m "chore: update minos theme"
```

The blog repo records only the theme's commit SHA, so the theme bump must be
committed here as well.

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

## Retiring a post

Two ways to take a published post out of circulation, depending on whether its URL
should survive.

**Gone entirely** — move the file into [source/\_archive](source/_archive):

```bash
git mv source/_posts/<slug>.md source/_archive/
```

Hexo skips any path segment beginning with `_` or `.`, so nothing in
`source/_archive/` is rendered or copied to `public/`. There is nothing magic about
the name — any `_`-prefixed folder behaves the same way. Un-retire by moving the
file back to `source/_posts/`.

**Unlisted** — add `hidden: true` to the post's front-matter:

```yaml
---
title: Some old post
hidden: true
---
```

The permalink keeps working, so existing links and bookmarks survive, but the post
disappears from the home page, `/archives`, categories, tags and search, and gets a
`noindex` meta tag. This is the [hexo-hide-posts](https://github.com/prinsss/hexo-hide-posts)
plugin, configured under `hide_posts` in [_config.yml](_config.yml). List every
hidden post with:

```bash
pnpm exec hexo hidden:list
```

Two built-in alternatives, for completeness:

| Method | Effect |
| --- | --- |
| Move to `source/_drafts/` | Same as `_archive`, but reversible with `pnpm exec hexo publish <slug>`, and rendered by `pnpm server --draft`. Use it for a post you mean to rework and republish, not one you are retiring. |
| `published: false` in front-matter | Same as `_archive`, without moving the file. Works, but is undocumented upstream. |

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

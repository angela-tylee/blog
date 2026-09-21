# Personal Blog

A [Hexo](https://hexo.io/) blog using the [Minos](https://github.com/ppoffice/hexo-theme-minos) theme.

Getting Started with Minos: [Getting Started with Minos](https://ppoffice.github.io/hexo-theme-minos/)

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

## Commands

[Commands | Hexo](https://hexo.io/docs/commands)

`hexo new --path <scaffold/lang/file-name> "Post Title"`

## Variables

[Variables | Hexo](https://hexo.io/docs/variables)

## Writing posts

[Tag Plugins | Hexo](https://hexo.io/docs/tag-plugins)

Beyond plain markdown, the theme styles a handful of blocks that are easy to forget
exist. Everything below works today with no configuration.

### Front-matter

| Key | Effect |
| --- | --- |
| `title`, `date`, `categories`, `tags` | The usual. |
| `<!-- more -->` (in the body) | Truncates the post on the home page and adds a "Read more" link. Without it, the full body is rendered on the index. |
| `excerpt` | Explicit index summary, as an alternative to `<!-- more -->`. |
| `updated` | Shows a second date alongside the original. Requires `article.date_format: full_relative` in [_config.minos.yml](_config.minos.yml). |
| `link` | Link post — the title points at an external URL instead of the permalink. |
| `hidden` | Unlisted. See [Retiring a post](#retiring-a-post). |

LaTeX also renders — MathJax is enabled under `plugins` in
[_config.minos.yml](_config.minos.yml).

Reference: [Hexo - Variables](https://hexo.io/docs/variables)

### Callouts

Reference: [Hexo - Tag Plugin](https://hexo.io/docs/tag-plugins)

Four colored callout types, each with an icon badge on the left border:

```
{% colorquote warning %}
Hooks must not be called conditionally.
{% endcolorquote %}
```

| Type | Color | Icon |
| --- | --- | --- |
| `info` | blue | i |
| `success` | green | check |
| `warning` | yellow | question mark |
| `danger` | red | exclamation mark |

Markdown works inside the block. This is the theme's own `colorquote` tag, registered
in [themes/minos/scripts/99_tags.js](themes/minos/scripts/99_tags.js) and styled in
[themes/minos/source/css/style.scss](themes/minos/source/css/style.scss).

In VSCode, insert one with **Cmd+Shift+P → Insert Snippet**, or type `cq` / `cqinfo` /
`cqwarning` / `cqsuccess` / `cqdanger` followed by Tab. Selecting text first wraps it
rather than replacing it. The snippets live in
[.vscode/blog.code-snippets](.vscode/blog.code-snippets) and are committed, so they
follow the repo. They deliberately carry no `scope` key — scoping them to `markdown`
stopped them appearing in the snippet picker at all.

![screenshot](source/images/callout-preview.png)

### Pullquote

Floats right at half width, with a faded quotation-mark watermark, and collapses to
full width below 768px:

```
{% pullquote %}
The sentence worth pulling out beside the body text.
{% endpullquote %}
```

### Blockquote with attribution

The theme styles a `footer cite` inside a blockquote with an em-dash prefix. Plain
`>` markdown cannot produce that — use Hexo's built-in tag:

```
{% blockquote Dan Abramov, Overreacted %}
Effects are an escape hatch.
{% endblockquote %}
```

### Linking to another post

Reference: [Hexo - Tag Plugins § Include Posts](https://hexo.io/docs/tag-plugins#Include-Posts)

Don't hand-write the URL. Use the built-in tag, which resolves the href through
`url_for` (so the `/blog/` root is applied for you) and **throws at build time** if the
post no longer exists — a rename fails `pnpm build` instead of shipping a dead link:

```
{% post_link var-let-const-difference %}
{% post_link zh-tw/var-let-const-difference %}
```

With no second argument the link text is the target's front-matter `title`, which keeps
the two in sync. Overrides and extras:

| Form | Effect |
| --- | --- |
| `{% post_link <slug> 自訂文字 %}` | Custom link text. Trailing words are joined with spaces — no quoting needed. |
| `{% post_link <slug>#作用域-Scope %}` | Deep-link a heading. The anchor is the slugified heading, as generated in the built HTML. |
| `{% post_link <slug> <text> false %}` | Disable HTML-escaping of the text, for a title containing markup. |
| `{% post_path <slug> %}` | The bare URL, with no `<a>` wrapper. |

**The slug includes the language folder.** The upstream docs say folder information can
be omitted; that is not true here on Hexo v8.1.2 — [post_link.js](node_modules/hexo/dist/plugins/tag/post_link.js)
does an exact `Post.findOne({ slug })`, and because `new_post_name: :title.md` compiles
`:title` to a pattern that matches across `/`, a post at `source/_posts/zh-tw/foo.md`
has the slug `zh-tw/foo`. Writing `{% post_link foo %}` from a Chinese post silently
resolves to the *English* post of the same name, and every post here exists under both.

Nesting inside a callout works — the inner tag is expanded before the block's markdown
is rendered:

```
{% colorquote info %}
**延伸閱讀**

{% post_link zh-tw/scope-hoist-shadowing %}
{% endcolorquote %}
```

Because the two languages are separate sites, cross-linking zh-tw → en is possible but
usually not what you want.

Add snippet to `keybindings.json`
```json
{
  "key": "shift+cmd+m",
  "command": "editor.action.insertSnippet",
  "when": "editorTextFocus && editorLangId == 'markdown'",
  "args": {
      "snippet": "{% colorquote ${1|info,success,warning,danger,glossary,tips,appendix|} %}\n${0:$TM_SELECTED_TEXT}\n{% endcolorquote %}"
  }
},
{
  "key": "cmd+'",
  "command": "editor.action.insertSnippet",
  "when": "editorTextFocus && editorLangId == markdown",
  "args": {
      "snippet": "> ${0:$TM_SELECTED_TEXT}"
  }
}
```

### Images

Put image files in `source/images/` — anything under `source/` not prefixed with `_`
is copied to `public/` as-is. Reference them root-relative:

```markdown
![The effect cleanup order](/images/react-lifecycle.png)
```

Write `/images/…`, never `/blog/images/…`. The site root is `/blog/` (derived from
`url:` in [_config.yml](_config.yml)) and hexo-renderer-marked prepends it
automatically; hardcoding it yields `/blog/blog/`.

Every image in a post is automatically wrapped in a lightbox link, with its **alt text
used as a hover caption** — no extra syntax. The caption is hover-only, so it will not
appear on touch devices; never put essential information there alone. Opt a single
image out with `{.not-gallery-item}`.

For several images as a justified grid, wrap them by hand — the blank lines matter,
as they keep the images parsed as markdown:

```html
<div class="justified-gallery">

![First](/images/a.png)
![Second](/images/b.png)

</div>
```

To use a separate thumbnail and full-size image, supply your own link and keep the
`gallery-item` class:

```html
<a class="gallery-item" href="/images/diagram-full.png">
  <img src="/images/diagram-thumb.png">
</a>
```

### Videos (iframe)

Reference: [Hexo - Tag Plugins § Iframe](https://hexo.io/docs/tag-plugins#Iframe)

Hexo's built-in tag:

```
{% iframe https://www.youtube.com/embed/VIDEO_ID 600 400 %}
```

renders to a plain `<iframe>`. Drafts converted from Notion/Obsidian keep that tag
as a commented-out reference next to a hand-written `<iframe>` with the same
`src`/size, since the hand-written tag is the form actually shipped:

```html
<!-- {% iframe https://www.youtube.com/embed/VIDEO_ID 600 400 %} -->
<iframe src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" width="600" height="400" allowfullscreen></iframe>
```

### Escaping template syntax

Writing about Hexo or Nunjucks means writing literal `{%` in a post, which Hexo will
otherwise try to execute. Wrap it:

```
<escape>{% colorquote info %}</escape>
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

### Translations (the `__()` helper)

UI strings in templates come from
[themes/minos/languages/\*.yml](themes/minos/languages), one file per
language, keyed by dotted paths like `nav.toc`. A page's language is its
front-matter `lang`, else the `:lang` segment of its path (`i18n_dir` in
[_config.yml](_config.yml)), else the first entry of `language`. That
language (plus fallbacks) is what `<%= __('nav.toc') %>` resolves against.

## Changing the theme

[themes/minos](themes/minos) is a fork — [angela-tylee/hexo-theme-minos-clone](https://github.com/angela-tylee/hexo-theme-minos-clone),
tracking the `develop` branch. Upstream ([ppoffice/hexo-theme-minos](https://github.com/ppoffice/hexo-theme-minos))
is **publicly archived**, so there are no upstream updates to pull and no PRs to send.
The fork is simply owned code: edit it when the theme needs changing, and judge the
edit on whether it is right for this blog rather than on whether it would be accepted
upstream.

The blog repo records only the theme's commit SHA, so a theme edit is two commits:

```bash
cd themes/minos
git add <files> && git commit -m "fix: ..."
git push origin develop
cd ../..
git add themes/minos && git commit -m "chore: bump minos theme"
```

Skip the `git push` and the blog will point at a SHA that exists only on your machine —
a fresh clone or a CI build cannot resolve it and the site will not build.

Check the submodule's state before committing the bump, since it is easy to carry along
work you did not mean to ship:

```bash
git -C themes/minos status
git -C themes/minos log --oneline origin/develop..HEAD   # unpushed commits
```

Theme *settings* are not a theme edit — they live in
[_config.minos.yml](_config.minos.yml) at the repo root and need no submodule commit.
See [Configuration](#configuration).

## Continue Improvements

- [ ] Add Table of Contents for each page.
- [ ] Add last updated time.
- [ ] Add 404 page.
- [x] Add multi-language support.
  - [ ] [.scratch/multi-language-plan.md](.scratch/multi-language-plan.md)
    - [利用 Hexo 來建立一個 多語系 部落格](https://medium.com/learn-or-die/%E5%88%A9%E7%94%A8-hexo-%E4%BE%86%E5%BB%BA%E7%AB%8B%E4%B8%80%E5%80%8B-%E5%A4%9A%E8%AA%9E%E7%B3%BB-%E9%83%A8%E8%90%BD%E6%A0%BC-4545cc6cdb6)
  - [ ] Nav menu default to en sites path.
- [ ] Add 'share this' button. [.scratch/sharethis-plan.md](.scratch/sharethis-plan.md)
- [ ] Add 'Comment' section
- [x] Add colorquote and VSCode shortcut (on local keybinding)
- [ ] Change to custom domain
- [ ] Add favicon
- [ ] Github Issue Tracker
- [ ] Vender themes/minos as direct folder or keep it submodule
- [ ] Sass `legacy-js-api` warning -> swap to hexo-renderer-dartsass
- [ ] add `updated` date https://hexo.io/docs/variables
- [ ] image storage

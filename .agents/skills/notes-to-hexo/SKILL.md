---
name: notes-to-hexo
description: Converts a Notion export or an Obsidian note into a Hexo draft for this blog — source callouts become {% colorquote %} blocks, headings are downgraded one level, images move into source/images/, embeds become iframes, and 參考資料 becomes a bullet list. Use when the user pastes Notion or Obsidian content, points at an export file or a vault note, or asks to turn either into a blog post or draft.
---

# Notes → Hexo

## Workflow

```
- [ ] Step 1: Identify the source and read its reference file
- [ ] Step 2: Create the draft with the CLI
- [ ] Step 3: Move images into source/images/
- [ ] Step 4: Convert source-specific syntax
- [ ] Step 5: Apply the house conventions below
- [ ] Step 6: Build and preview
```

## Step 1: Source-specific syntax

Read the one file that matches the source. Each covers the syntax only that tool emits —
callout mapping, links, images and the leftovers to strip.

**Notion export** (`<aside>` callouts, `%20` in paths, a metadata table at the top) →
See [reference/notion.md](reference/notion.md)

**Obsidian note** (`[[wikilinks]]`, `> [!type]` callouts, vault front-matter) →
See [reference/obsidian.md](reference/obsidian.md)

If the source is ambiguous, `[[` decides it: Obsidian. Content pasted with no file and no
distinguishing syntax needs only the house conventions below.

## Step 2: Where the file goes

A converted note lands in `source/_drafts/<lang>/<slug>.md`, never straight in
`source/_posts/`. `<lang>` is `zh-tw` or `en`. Create it with the CLI so the front-matter
scaffold is applied:

```bash
pnpm exec hexo new draft --path zh-tw/my-post "我的標題"
```

Always pass `--path`. A bare title is slugized into a flat `_drafts/zh-tw-my-post.md`.

Publishing is the author's call, not part of a conversion. When asked:

```bash
pnpm exec hexo publish zh-tw/my-post
```

## Step 3: Images

Image files go in `source/images/`, flat, with kebab-case names. Reference them:

```markdown
![Descriptive alt text](./images/block-scope.png)
```

Every image is wrapped in a lightbox whose **hover caption is the alt text**, so write
real alt text rather than leaving it empty. The caption never appears on touch devices —
never put essential information there alone.

Never write `/blog/images/…`. The `/blog/` site root is prepended at render time — but
only for `![]()` syntax.

If an image needs a fixed width, use an `<img>` tag instead, since Markdown has no way to
set one. A raw `<img>` is passed through untouched by the renderer, so it does **not**
get the `/blog/` root prepended — `./images/…` will 404 on it. Use a path that mirrors
the draft's own depth under `source/_drafts/<lang>/` instead:

```html
<img src="../../images/block-scope.png" width="400">
```

The lightbox still applies automatically; there's no `alt` attribute here, so no hover
caption — add `alt="…"` if one is wanted.

## Step 5: House conventions

### Front-matter

The scaffold gives `title`, `date`, `categories`, `tags`. Fill `title` from the note's
own H1 and drop that H1 from the body. Leave `categories: Technology` unless the note is
clearly something else. Leave `tags:` empty rather than inventing tags.

Insert `<!-- more -->` after the first two or three paragraphs — without it the whole
post renders on the home page.

### Heading levels

Downgrade every heading by one: `#` → `##`, `##` → `###`, and so on. The post title is
already rendered as the page's H1 from front-matter, so the body starts at `##`.

### Callouts

Source callouts become the theme's `colorquote` tag:

```
{% colorquote info %}
Markdown works inside the block.
{% endcolorquote %}
```

Seven types, defined in
[themes/minos/source/css/style.scss](../../../themes/minos/source/css/style.scss):

| Type | Use for |
| --- | --- |
| `info` | Neutral aside, references, further reading |
| `success` | Confirmation, a working approach |
| `warning` | A caveat or common mistake |
| `danger` | A genuine error or anti-pattern |
| `glossary` | 詞彙解釋 — defining a term |
| `tips` | A practical tip |
| `appendix` | Supplementary material, 學習重點 |

The per-source reference file maps that tool's callout types onto this table. When the
source gives no signal, use `info`.

### Opening 學習重點 block

Posts open with an `appendix` callout listing what the reader will learn, before the
first `##` heading:

```
{% colorquote appendix %}
學習重點：

- 表達式 (expression) 和陳述式 (statement) 是什麼，如何區分？
- 函式表達式和函式陳述式的用途有什麼差異？
{% endcolorquote %}
```

If the note has no equivalent section, draft one from its headings and tell the author it
was written rather than carried over.

### Videos (iframe)

Keep Hexo's built-in tag commented out beside a hand-written `<iframe>` with the same
`src` and size. The hand-written tag is the form actually shipped:

```html
<!-- {% iframe https://www.youtube.com/embed/VIDEO_ID 600 400 %} -->
<iframe src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" width="600" height="400" allowfullscreen></iframe>
```

A plain YouTube watch URL (`youtube.com/watch?v=ID` or `youtu.be/ID`) must be rewritten to
the `/embed/ID` form.

### 參考資料 / 延伸閱讀

Two distinct things, handled differently.

**參考資料** — the sources behind the post. A `##` section at the end of the post, as a
bullet list, one entry per line. Bare URLs get a title where the source supplies one:

```markdown
## 參考資料

- [Statement (computer science) - Wikipedia](https://en.wikipedia.org/wiki/Statement_(computer_science))
- [Expressions and operators - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators)
- 《帶你無痛提升 JavaScript 面試力》Ch2
```

**延伸閱讀** — pointers to other posts on this blog, placed inline where the topic comes
up, inside an `info` callout:

```
{% colorquote info %}
**延伸閱讀**

{% post_link zh-tw/scope-hoist-shadowing %}
{% endcolorquote %}
```

### Linking to another post

Use `{% post_link <lang>/<slug> %}` — never a hand-written URL. It resolves the href
through `url_for` and fails the build if the target is gone.

**The slug must include the language folder.** `{% post_link foo %}` from a zh-tw post
silently resolves to the English post of the same name, since every post exists in both
languages.

If the referenced post does not exist yet, leave the prose and mark it
`*(work in progress)*` rather than writing a `post_link` that breaks `pnpm build`.

### Tables

Markdown table cells can't contain literal newlines — a bare line break collapses the
row. For a line break inside a cell, use `<br>`:

```markdown
| **String** | `String(value)` | `value.toString()` | - `String(123)` → `"123"`<br><br>- `toString()` 常用於物件與數值，不適用於 `null/undefined` |
```

### Escaping template syntax

A post that discusses Hexo tags needs literal `{%` that Hexo must not execute:

```
<escape>{% colorquote info %}</escape>
```

## Step 6: Verification

Run the build and fix what it reports:

```bash
pnpm build
```

A broken `post_link` throws here. Then preview:

```bash
pnpm server:draft   # http://localhost:4000, renders drafts
```

Check in the rendered page that callouts show their colored badge, images load, and the
iframe plays. If the build fails, fix and re-run before handing the draft back.

Full theme reference, beyond what conversion needs: [README.md](../../../README.md).

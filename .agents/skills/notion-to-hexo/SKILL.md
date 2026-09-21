---
name: notion-to-hexo
description: Converts a Notion export into a Hexo draft for this blog — <aside> callouts become {% colorquote %} blocks, Notion image and file attachments move into source/images/, embeds become iframes, and headings are downgraded one level. Use when the user pastes Notion content, points at a Notion Markdown or HTML export, or asks to turn Notion notes into a blog post or draft.
---

# Notion → Hexo

## Workflow

```
- [ ] Step 1: Locate the export and its asset folder
- [ ] Step 2: Create the draft with the CLI
- [ ] Step 3: Move images into source/images/
- [ ] Step 4: Convert Notion-specific syntax (below)
- [ ] Step 5: Apply the shared house conventions
- [ ] Step 6: Build and preview
```

**Step 1.** A Notion Markdown export is a `.md` file beside a folder of the same name
holding its images. Ask for both if only the text was pasted — image references are
worthless without the files.

**Step 2.** `pnpm exec hexo new draft --path <lang>/<slug> "標題"`. See
[hexo-conventions.md](../_shared/hexo-conventions.md).

**Step 3.** Copy each referenced image into `source/images/`, renaming it to kebab-case.
Notion's exported names carry a UUID (`Untitled%201%20a1b2c3.png`) — drop it and name
the file for what it shows.

**Steps 4–6.** Below, then
[hexo-conventions.md](../_shared/hexo-conventions.md) for headings, callout types,
front-matter, 參考資料, `post_link` and verification.

## Notion-specific conversions

### Callouts

Notion callouts export as `<aside>`, usually opening with an emoji. Convert to
`{% colorquote %}` and drop the emoji — the theme supplies its own badge icon.

Input:

```html
<aside>
💡 `useEffect` 不是生命週期，而是同步機制。
</aside>
```

Output:

```
{% colorquote tips %}
`useEffect` 不是生命週期，而是同步機制。
{% endcolorquote %}
```

Choose the type from the emoji and the content: 💡 → `tips`, ⚠️ → `warning`,
❗/🚫 → `danger`, ✅ → `success`, 📖/📝 → `info`, a term being defined → `glossary`.

### Images

Notion writes image references two ways depending on the export:

| Notion form | Convert to |
| --- | --- |
| `!file-name` | `![Alt text](./images/file-name.png)` |
| `![](Page%20Name%20a1b2c3/Untitled.png)` | `![Alt text](./images/descriptive-name.png)` |

URL-escaped `%20` in a path is always a sign the reference still points at the export
folder and has not been converted.

### Embeds

Notion embeds and bookmarks export as a bare URL on its own line. A YouTube URL becomes
an iframe pair; any other bookmark becomes an ordinary inline link in the surrounding
prose, or a 參考資料 entry if it is a source.

### Leftovers

Strip these — they carry no meaning outside Notion:

- The exported H1 title (it belongs in front-matter `title`)
- The metadata table Notion prepends (`Created`, `Tags`, `Status`, …)
- Toggle-list wrappers (`<details>`/`<summary>`) — flatten to a heading plus body, or a
  `colorquote appendix` if the content is genuinely supplementary
- Notion internal page links (`https://www.notion.so/…`) — replace with
  `{% post_link %}` if the target is a post here, otherwise remove
- Trailing empty table columns and `| --- |` rows from database exports

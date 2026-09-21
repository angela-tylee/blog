# Notion → Hexo

Syntax only a Notion export produces. The house conventions — headings, front-matter,
參考資料, `post_link`, verification — are in [SKILL.md](../SKILL.md).

## Before starting

A Notion Markdown export is a `.md` file beside a folder of the same name holding its
images. Ask for both if only the text was pasted — image references are worthless
without the files.

## Callouts

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

Choose the type from the emoji and the content:

| Emoji | Type |
| --- | --- |
| 💡 | `tips` |
| ⚠️ | `warning` |
| ❗ 🚫 | `danger` |
| ✅ | `success` |
| 📖 📝 | `info` |
| a term being defined | `glossary` |

## Images

Notion writes image references two ways depending on the export:

| Notion form | Convert to |
| --- | --- |
| `!file-name` | `![Alt text](./images/file-name.png)` |
| `![](Page%20Name%20a1b2c3/Untitled.png)` | `![Alt text](./images/descriptive-name.png)` |

URL-escaped `%20` in a path is always a sign the reference still points at the export
folder and has not been converted.

Notion's exported filenames carry a UUID (`Untitled%201%20a1b2c3.png`). Drop it and name
the file for what it shows.

## Embeds

Notion embeds and bookmarks export as a bare URL on its own line. A YouTube URL becomes
an iframe pair; any other bookmark becomes an ordinary inline link in the surrounding
prose, or a 參考資料 entry if it is a source.

## Leftovers

Strip these — they carry no meaning outside Notion:

- The exported H1 title (it belongs in front-matter `title`)
- The metadata table Notion prepends (`Created`, `Tags`, `Status`, …)
- Toggle-list wrappers (`<details>`/`<summary>`) — flatten to a heading plus body, or a
  `colorquote appendix` if the content is genuinely supplementary
- Notion internal page links (`https://www.notion.so/…`) — replace with `{% post_link %}`
  if the target is a post here, otherwise remove
- Trailing empty table columns and `| --- |` rows from database exports

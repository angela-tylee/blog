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

## Notion links

No Notion URL ever survives into a draft. `https://www.notion.so/…`,
`https://app.notion.com/…` and `notion://…` all point into a private workspace: outside
Notion they are dead links, and they leak the workspace's page IDs. This covers every
hyperlink, not just the obvious page mentions — inline links in prose, table cells,
headings, list items, 參考資料 entries, image and embed hrefs, and the anchors Notion
wraps around footnote markers.

Each one resolves one of three ways:

| Target | Do |
| --- | --- |
| A post on this blog | `{% post_link <lang>/<slug> %}` |
| A page outside Notion the link was pointing at | Keep the real URL, drop the Notion wrapper |
| Anything else — another Notion page, an anchor back into the source note | Strip the link, keep the link text |

Stripping means the link markup goes and the text stays, because the text is doing work
in the sentence:

```markdown
指的便是將物件作為程式的基本單元 [[^6]](https://app.notion.com/p/Type-Conversion-1388d159…?pvs=21)
```

becomes

```markdown
指的便是將物件作為程式的基本單元 [^6]
```

Notion link text sometimes swallows neighboring punctuation
(`[[^6].](https://app.notion.com/…)`, `[[^3], a](https://app.notion.com/…)`). Unwrap it
and leave the punctuation and prose where they belong in the sentence.

Where the text is a footnote marker, check afterwards that every marker has an entry in
參考資料 at the end of the post, numbered to match. A marker with no entry is a reference
lost in the export — ask the author for the source rather than deleting the marker.

Before handing the draft back, `grep -n 'notion' <draft>` and expect no hits.

## Leftovers

Strip these — they carry no meaning outside Notion:

- The exported H1 title (it belongs in front-matter `title`)
- The metadata table Notion prepends (`Created`, `Tags`, `Status`, …)
- Toggle-list wrappers (`<details>`/`<summary>`) — flatten to a heading plus body, or a
  `colorquote appendix` if the content is genuinely supplementary
- Every link pointing back into Notion — see [Notion links](#notion-links) above
- Trailing empty table columns and `| --- |` rows from database exports

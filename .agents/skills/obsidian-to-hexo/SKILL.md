---
name: obsidian-to-hexo
description: Converts an Obsidian note into a Hexo draft for this blog — wikilinks and embeds are resolved or removed, callouts become colorquote blocks, vault-relative images move into source/images/, and headings are downgraded one level. Use when the user pastes Obsidian content, points at a note in a vault, or asks to turn Obsidian notes into a blog post or draft.
---

# Obsidian → Hexo

## Workflow

```
- [ ] Step 1: Read the note and list its wikilinks and embeds
- [ ] Step 2: Create the draft with the CLI
- [ ] Step 3: Move images into source/images/
- [ ] Step 4: Convert Obsidian-specific syntax (below)
- [ ] Step 5: Apply the shared house conventions
- [ ] Step 6: Build and preview
```

**Step 1.** Every `[[…]]` and `![[…]]` has to be resolved or removed before the note can
ship — the blog has no vault to link into. List them first so none is missed.

**Step 2.** `pnpm exec hexo new draft --path <lang>/<slug> "標題"`. See
[hexo-conventions.md](../_shared/hexo-conventions.md).

**Step 3.** Copy each embedded image out of the vault's attachment folder into
`source/images/`, renaming it to kebab-case.

**Steps 4–6.** Below, then
[hexo-conventions.md](../_shared/hexo-conventions.md) for headings, callout types,
front-matter, 參考資料, `post_link` and verification.

### Links and embeds

This is the rule that matters most. Nothing in `[[…]]` syntax survives.

| Obsidian | Convert to |
| --- | --- |
| `[[Some Note]]` | Plain text `Some Note` — the link is dropped |
| `[[Some Note\|顯示文字]]` | Plain text `顯示文字` |
| `[[Some Note]]` where a post exists here | `{% post_link <lang>/<slug> %}` |
| `![[image.png]]` | `![Alt text](./images/image.png)` |
| `![[Some Note]]` (transclusion) | Paste the referenced content inline, or drop it |
| `[Title](https://example.com)` | Keep as-is |

Only links to a public website URL survive as links. A wikilink whose target is a
private vault note becomes plain text — never invent a URL for it.

Also strip Obsidian-only markup: `^block-ids` at the end of a line, `%%comments%%`,
`#tags` written inline in prose, and the Dataview blocks (` ```dataview `).

### Callouts

Obsidian callouts use the `> [!type]` blockquote form. Convert to `{% colorquote %}` and
drop the `> ` prefix from every line:

Input:

```markdown
> [!warning] 注意
> Hooks 不能寫在條件式裡面。
```

Output:

```
{% colorquote warning %}
**注意**

Hooks 不能寫在條件式裡面。
{% endcolorquote %}
```

Map the type: `note`/`info`/`abstract` → `info`, `tip`/`hint` → `tips`,
`warning`/`caution` → `warning`, `danger`/`error`/`bug` → `danger`,
`success`/`check`/`done` → `success`, `question`/`faq` → `glossary`,
`example`/`quote` → `appendix`. The callout's title line, if any, becomes a bold first
line inside the block. Foldable callouts (`> [!note]-`) lose the fold.

### Front-matter

An Obsidian note carries its own YAML front-matter — vault properties such as `aliases`,
`cssclasses`, `publish` and inline `tags`. Discard it and use the scaffold Hexo
generates. Carry over only the title, and `date` if the note records a real creation
date worth keeping.

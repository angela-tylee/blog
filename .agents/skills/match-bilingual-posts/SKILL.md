---
name: match-bilingual-posts
description: Checks and fixes structural and content parity between the en and zh-tw versions of the same blog post — heading depth, colorquote block types, code fences, images, tables, <!-- more --> placement, and list completeness. Use when the user is drafting or editing one language version of a post and wants the other language version brought in sync, mentions matching/syncing zh-tw and en posts, or asks to check bilingual post consistency.
---

# Matching bilingual posts

Every post exists in both `en` and `zh-tw`, under matching slugs in
`source/_posts/<lang>/<slug>.md` or `source/_drafts/<lang>/<slug>.md` — the two
language versions don't have to be at the same stage (one may be published while
the other is still a draft). This skill is for keeping their **structure**
identical and their **content** equivalent once one side changes, not for the
initial conversion (that's [notes-to-hexo](../notes-to-hexo/SKILL.md)) or for
house formatting conventions (colorquote types, `post_link` syntax, image
conventions — also in that skill; read it if a rule below assumes it).

Prose is expected to differ — it's a translation, not a copy. What must not
differ is the skeleton the prose sits in.

## Workflow

```
- [ ] Step 1: Find the counterpart file
- [ ] Step 2: Walk both files side by side and log every structural mismatch
- [ ] Step 3: Decide which side is right per mismatch, then fix the other
- [ ] Step 4: Re-walk both files to confirm the skeleton now matches
- [ ] Step 5: Content-completeness pass (lists, tables, glossary boxes)
- [ ] Step 6: Build and preview
```

## Step 1: Find the counterpart file

Same slug, other language folder. Check `_drafts` and `_posts` both — don't
assume they're in the same one:

```bash
find source/_drafts source/_posts -name "<slug>.md"
```

If no counterpart exists yet, this isn't a sync task — write the translation
fresh (see notes-to-hexo), then there's nothing to diff.

## Step 2: Walk both files side by side and log every structural mismatch

Read both files in full — don't sample. Go section by section (split on `##`
headings) and compare, in this order, the elements below. For each mismatch
found, note: the section it's in, what each side has, and which type of
mismatch (from the list) it is. Build this list before fixing anything — fixing
as you go makes it easy to lose track of what's left.

| Element | What must match | What's allowed to differ |
| --- | --- | --- |
| Front matter | `title`, `date`, `categories`, `tags` keys present in both | The key *values* (title is translated; tags may be identical or may not — judgment call) |
| Headings | Level and count, in the same order (`##` → `##`, `###` → `###`) | The heading text |
| Lists vs headings | If one side uses a heading (`#### var`) for a subsection, the other must too — not a bullet (`- var`) | — |
| `{% colorquote TYPE %}` | Same count, same `TYPE` in the same position (`info`/`warning`/`danger`/`glossary`/`tips`/`appendix`/`success`) | The content inside |
| Code fences | Same count, same language tag, and — since code isn't translated — the **same code**, aside from comments | Comments inside the code |
| Images | Same filename (images live in one shared `source/images/`, so both language versions reference the *same* file) and same `width` if one is set | Alt text, if present |
| Tables | Same row and column count | Cell text (translated) |
| `<!-- more -->` | Appears at an equivalent point in the content flow (roughly the same amount of preview text before it) | Its exact line number |
| `{% post_link %}` | Same set of related posts referenced, each with the *current file's own* language prefix (`en/foo` in the en file, `zh-tw/foo` in the zh-tw file — never copy the prefix across) | — |
| `## References` / `## 參考資料` | Same external sources, unless a source is only useful in one language (e.g. a Chinese-only article) | Order, translated titles |

A broken image reference is easy to miss this way: `!image.png` (missing the
`[alt](path)` parens) renders as literal text, not an image, and grep for
`<img` or `![` won't catch it either since it matches neither pattern — read
the line, don't just pattern-match it.

## Step 3: Decide which side is right, then fix the other

When the two sides disagree, the newer or more complete one usually wins —
check `git log --follow` on both files if it's not obvious which was edited
more recently. If it's genuinely ambiguous, ask the user rather than guessing;
don't silently pick a side on a judgment call.

Fix by editing structure only — don't translate by re-writing the correct
side's prose into the broken side wholesale. Match the *shape*, write the
content in the target language.

## Step 4: Re-walk both files to confirm the skeleton now matches

Repeat step 2's comparison. Don't call the sync done from memory of what you
fixed — re-check, since a structural fix (e.g. converting a bullet to a
heading) can shift surrounding spacing or accidentally duplicate a line.

## Step 5: Content-completeness pass

Some mismatches hide inside a structural element that otherwise matches and
won't surface from step 2 alone:

- **List item counts.** A bullet list inside a matching section or
  `colorquote` block can have more items on one side (a glossary box with 4
  sub-points in one language and 2 in the other) — count items, don't just
  confirm the block exists.
- **Table cell content.** Row/column counts matching doesn't mean the cells
  are right — check header row wording especially; a typo there (a column
  header naming the wrong variable, a stale label) is invisible to a
  structural check and only shows up by reading the rendered content.
- **Error messages / code output in comments.** These are copy-pasted from a
  real console, not translated — verify both sides quote the identical string
  (e.g. `ReferenceError: Cannot access 'x' before initialization`) rather than
  a paraphrase.

## Step 6: Build and preview

```bash
pnpm build
```

A broken `post_link` throws here. Then preview both language versions and
confirm colorquote badges, images, and tables render correctly on each:

```bash
pnpm server:draft   # http://localhost:4000, renders drafts too
```

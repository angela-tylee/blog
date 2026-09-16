# Multi-language support (English + 繁體中文)

## Context

[README.md](README.md) lists "Add multi-language support" as an open TODO, and the site is already inconsistent about it: [_config.yml](_config.yml) declares `language: en`, but the only published post — [source/_posts/useEffect.md](source/_posts/useEffect.md) — is written in Traditional Chinese. English UI chrome currently wraps Chinese content, with no way to signal or switch language.

The good news is that **Minos ships a complete i18n system that is simply switched off**. Because [_config.yml](_config.yml) sets `language` to a scalar rather than a list, `getDisplayLanguages()` returns a one-element array, the footer switcher in [languages.ejs](themes/minos/layout/common/languages.ejs) renders nothing, and each per-language generator in [10_i18n.js](themes/minos/scripts/10_i18n.js) emits exactly one set of routes. Turning `language` into a list activates per-language index/archive/category/tag pages, a per-language search index, `hreflang` tags, locale-aware dates, and the switcher — all at once.

**Chosen model:** one language per post, separate sites. `/` lists English posts, `/zh-tw/` lists Chinese posts; posts are not translated into pairs. English lives at the root with no URL prefix. This is what Minos does natively, so most of the work is configuration — plus two genuine theme bugs that only surface once i18n is on.

**Outcome:** a reader lands on an English homepage, uses the footer globe to reach `/zh-tw/`, and gets Chinese nav, UI strings, dates, search, and only Chinese posts.

---

## Two details that will silently break things

### 1. The language tag must be lowercase `zh-tw`

It has to match the catalog filename [zh-tw.yml](themes/minos/languages/zh-tw.yml) byte for byte, because three separate lookups are exact-match string comparisons:

1. `hexo-i18n`'s `get()` does a bare `data[lang]` index; catalog keys come from filenames verbatim via [Hexo's i18n processor](node_modules/hexo/dist/theme/processors/i18n.js).
2. [Hexo's `template_locals` i18n filter](node_modules/hexo/dist/plugins/filter/template_locals/i18n.js#L14) resolves a page's language from its output path, then gates it on `i18nLanguages.includes(data.lang)`.
3. `getUsedLanguages()` in [i18n.js](themes/minos/lib/i18n.js) gates the directory convention on the same list.

Write `zh-TW` and there is no error — the `/zh-tw/` pages quietly fall back to English strings. Lowercase still passes every validator: `isLanguageValid('zh-tw')` succeeds because [01_check.js](themes/minos/scripts/01_check.js) tries `formatRfc5646()` first (→ `zh-TW`, present in [rfc5646.js](themes/minos/lib/rfc5646.js#L236)), and `getMomentLocale('zh-tw')` normalizes to `zh-TW`, already present in [99_content.js:14](themes/minos/scripts/99_content.js#L14).

> Both articles you shared mention fixes that this fork **already carries** — the ithelp article's `MOMENTJS_SUPPORTED_LANGUAGES` patch (`zh-tw` → `zh-TW`) is applied, and the Medium article's hand-written `zh-tw.yml` catalog ships with the theme. Neither needs redoing.

### 2. A post's slug includes its subdirectory

This is the non-obvious one, and it's why the Medium article quietly switches to `permalink: :title/`. Hexo strips only `_posts/` from the path ([post.js:263-266](node_modules/hexo/dist/plugins/processor/post.js#L263-L266)), then `parseFilename` matches the remainder against `new_post_name` (`:title.md`). `:title` compiles to `(.+?)` in [permalink.js](node_modules/hexo-util/dist/permalink.js), which matches across `/`. So `_posts/zh-tw/useEffect.md` gets `slug = "zh-tw/useEffect"`, and [post_permalink.js:24](node_modules/hexo/dist/plugins/filter/post_permalink.js#L24) maps permalink `:title` straight onto that full slug.

Leaving the permalink alone would therefore produce `/2026/09/15/zh-tw/useEffect/` — the language buried mid-path. Step 1 changes it instead.

---

## Step 1 — Config: languages and permalinks

In [_config.yml](_config.yml):

```yaml
language:
  - en
  - zh-tw

permalink: :title/
```

First entry in the list is the default and lives at the root. `i18n_dir: :lang` is already correct; leave it.

`permalink: :title/` makes the subdirectory work *for* you: Chinese posts land at `/zh-tw/<slug>/`, in the same URL space as the rest of the Chinese site. (Hexo also offers `:name`, which is `basename(slug)` and strips the directory — not what we want here.)

Two consequences to accept:

- **The existing post's URL changes** from `/2026/09/15/useEffect/` to `/zh-tw/useEffect/`. It was published in the most recent commit and has no inbound links, so this is cheap now and only gets more expensive later.
- **Post slugs now share the root namespace** with `/archives`, `/categories`, `/tags`, `/about` and `/zh-tw`. Avoid slugging an English post `archives` or `about`.

While here, fix `title: Hexo` — still the Hexo default, and it feeds `page_title()` in [99_content.js](themes/minos/scripts/99_content.js), so it appears in every `<title>`.

## Step 2 — Move the existing Chinese post

```bash
git mv source/_posts/useEffect.md source/_posts/zh-tw/useEffect.md
```

`getPageLanguage()` in [i18n.js](themes/minos/lib/i18n.js) strips `_posts/` and matches the remainder against `:lang/*path`, so the directory alone tags the post `zh-tw` — no front-matter change needed. (`lang: zh-tw` in front matter is the override for a file outside that directory.)

Note that `new_post_name: :title.md` means `hexo new` always writes to `_posts/` directly. For Chinese posts use `pnpm exec hexo new post --path zh-tw/<slug> "<標題>"`.

## Step 3 — A Chinese About page

Create `source/zh-tw/about/index.md` alongside [source/about/index.md](source/about/index.md). Hexo maps source directories straight to output paths, so it renders at `/zh-tw/about/`, and the `template_locals` filter reads `zh-tw` off the path automatically.

This matters more than it looks — without it, the Chinese nav's About link dead-ends on the English page.

## Step 4 — Fix the language switcher 404 on post pages *(theme bug)*

**Root cause.** The `i18n_path` helper in [10_i18n.js](themes/minos/scripts/10_i18n.js) assumes every page has a counterpart at the same path under a different language prefix:

```js
hexo.extend.helper.register('i18n_path', function (language) {
    const path = this.page.path;
    const lang = getPageLanguage(this.page);
    const base = path.startsWith(lang) ? path.slice(lang.length + 1) : path;
    return (language ? '/' + language : '') + '/' + base;
});
```

That holds for index/archive/category/tag pages, which [10_i18n.js](themes/minos/scripts/10_i18n.js) generates once per language. It does not hold for posts: under the separate-sites model a post exists in exactly one language. From `/zh-tw/useEffect/` the switcher offers `/useEffect/`; from an English post `/react-hooks/` it offers `/zh-tw/react-hooks/`. Neither is generated. The footer switcher and the `hreflang` tags in [head.ejs:12](themes/minos/layout/common/head.ejs#L12) both point at a 404.

**Fix.** With no counterpart post to jump to, send the reader to the target language's homepage:

```js
hexo.extend.helper.register('i18n_path', function (language) {
    const prefix = language ? '/' + language : '';
    // A post exists in exactly one language, so there is no counterpart URL to
    // link to — fall back to that language's home page.
    if (this.is_post()) return prefix + '/';
    const path = this.page.path;
    const lang = getPageLanguage(this.page);
    const base = lang && path.startsWith(lang + '/') ? path.slice(lang.length + 1) : path;
    return prefix + '/' + base;
});
```

`this.is_post()` is available inside a helper — [99_content.js](themes/minos/scripts/99_content.js) already calls `this.is_archive()` and `this.is_category()` the same way. Two latent bugs get fixed alongside: the original tests `startsWith(lang)` without the trailing slash, and calls `startsWith(undefined)` on any page with no language.

## Step 5 — Translate the nav menu *(theme bug + config)*

**Root cause.** [99_config.js](themes/minos/scripts/99_config.js) supports per-language theme config but resolves it against `themeRoot` — `themes/minos/_config.zh-tw.yml`, *inside the submodule*. That is what both articles instruct, and it contradicts this repo's documented rule ([README.md](README.md)) that theme settings live at the repo root because the theme repo gitignores its own `_config.yml`. Your personal menu labels do not belong inside a theme fork.

This step is not cosmetic. In [navbar.ejs](themes/minos/layout/common/navbar.ejs) the menu **key is the visible label and the value is the href**, and the values in [_config.minos.yml](_config.minos.yml) are absolute English paths. Without an override the Chinese homepage shows English labels that navigate straight back out to the English site.

**Fix.** Teach `getThemeConfig()` to check the site root first, mirroring Hexo v5+'s own `_config.[theme].yml` convention:

```js
const siteConfigPath = path.join(hexo.base_dir, '_config.' + hexo.config.theme + '.' + lang + '.yml');
const themeConfigPath = path.join(themeRoot, '_config.' + lang + '.yml');
const configPath = fs.existsSync(siteConfigPath) ? siteConfigPath : themeConfigPath;
```

Then create `_config.minos.zh-tw.yml` at the repo root. It is merged **over** the base theme config, so include only what differs — and note every menu value needs `/zh-tw` written out by hand:

```yaml
logo:
  text: 部落格

menu:
  封存: /zh-tw/archives
  技術: /zh-tw/categories/Technology
  生活: /zh-tw/categories/LifeStyle
  關於: /zh-tw/about
```

Leave `navbar_links` and `footer_links` out — the LinkedIn and GitHub icons are language-neutral and inherit fine.

## Step 6 — Add `lang` to `<html>`

[layout.ejs](themes/minos/layout/layout.ejs) emits `<html class="has-navbar-fixed-top">` with no `lang` attribute, so screen readers and search engines get no language signal on any page:

```ejs
<html class="has-navbar-fixed-top" lang="<%= rfc5646(page_language()) || 'en' %>">
```

`rfc5646` is registered in [10_i18n.js](themes/minos/scripts/10_i18n.js) and normalizes `zh-tw` → `zh-TW`.

---

## Files touched

**Blog repo**
- [_config.yml](_config.yml) — `language` list, `permalink`, `title`
- `_config.minos.zh-tw.yml` — new, Chinese nav and logo
- `source/_posts/zh-tw/useEffect.md` — moved
- `source/zh-tw/about/index.md` — new
- [README.md](README.md) — document the conventions (lowercase tag, `--path zh-tw/…` for new posts, where per-language theme config lives), tick off the TODO

**Theme submodule** (`themes/minos`, your own fork on `develop`)
- [scripts/10_i18n.js](themes/minos/scripts/10_i18n.js) — `i18n_path` fix
- [scripts/99_config.js](themes/minos/scripts/99_config.js) — root-level per-language config lookup
- [layout/layout.ejs](themes/minos/layout/layout.ejs) — `<html lang>`

All three theme changes are genuine upstream bugs and belong in the fork. Per [README.md](README.md), the submodule needs its own commit plus a pointer bump here:

```bash
cd themes/minos && git add -A && git commit -m "fix: correct i18n_path fallback and per-language config resolution" && git push
cd ../.. && git add themes/minos && git commit -m "chore: bump minos theme"
```

> Alternative if you'd rather not touch the submodule: both JS fixes can be re-registered from a site-root `scripts/` directory, which Hexo loads after theme scripts ([load_plugins.js:53-57](node_modules/hexo/dist/hexo/load_plugins.js#L53-L57)). Wrap the `helper.register` calls in `hexo.on('generateBefore', …)`, since load order between the two directories is concurrent and not strictly guaranteed. Keeps everything in one repo, at the cost of duplicating theme logic. The `<html lang>` change has no such escape hatch.

## Verification

```bash
pnpm clean && pnpm server
```

Startup must print no `not a valid RFC5646 language` warning from [01_check.js](themes/minos/scripts/01_check.js) — if it does, the tag casing is wrong.

| URL | Expect |
| --- | --- |
| `/` | English UI; **no** posts listed yet (see caveat below) |
| `/zh-tw/` | Chinese nav 封存/技術/生活/關於, Chinese UI, useEffect listed |
| `/zh-tw/useEffect/` | post renders, chrome in Chinese |
| `/2026/09/15/useEffect/` | now 404 — expected, permalink scheme changed |
| `/zh-tw/about/` | Chinese About page |
| `/zh-tw/archives/`, `/zh-tw/categories/Technology/` | exist, list only Chinese posts |
| `/content.json`, `/content.zh-tw.json` | both exist, each scoped to its language |

Then check by hand:

- Footer globe appears on every page (hidden whenever `display_languages().length <= 1`).
- **From a post page**, click the switcher — must land on `/` or `/zh-tw/`, not a 404. This is the Step 4 regression test.
- Every nav link on `/zh-tw/` stays inside `/zh-tw/`.
- `view-source:` a Chinese page → `<html lang="zh-TW">` plus `<link rel="alternate" hreflang="en">`.
- Search from `/zh-tw/` returns only Chinese results — confirms `CONTENT_URL` resolved to `content.zh-tw.json` in [insight.ejs](themes/minos/layout/search/insight.ejs).
- Post date reads `x 個月前` in Traditional, not Simplified, characters.

Finally `pnpm build` and confirm `public/zh-tw/` contains `index.html`, `useEffect/`, `about/`, `archives/`, `categories/`, `tags/`.

## Caveat: the English homepage will be empty

After Step 2 the English site has zero posts, and [10_i18n.js](themes/minos/scripts/10_i18n.js) returns `null` from each generator for a language with no posts — so `/` is never generated and the site root 404s. Before shipping, either publish an English post (even a short placeholder), or flip the list order in Step 1 to make `zh-tw` the default and English the prefixed language.

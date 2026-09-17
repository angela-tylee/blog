# Enable share buttons (ShareThis)

## Context

Every post page currently renders a red banner:

> You need to set `install_url` to use ShareThis. Please set it in `_config.yml`.

[_config.minos.yml:41-44](_config.minos.yml#L41-L44) sets `share.type: sharethis` but leaves `install_url` empty. [common/article.ejs:74-76](themes/minos/layout/common/article.ejs#L74-L76) renders the sharebox on any non-index page whenever `share.type` is set, and [share/sharethis.ejs:1-4](themes/minos/layout/share/sharethis.ejs#L1-L4) prints the warning instead of the buttons when the URL is missing. So the banner is not a bug — it is the theme telling us the feature is half-configured.

[README.md](README.md) tracks this as **"Add 'share this' button"** under *Continue Improvements*.

**This is a configuration-only change.** No edit to the [minos submodule](themes/minos) is needed — see below.

---

## Why the theme needs no changes

[share/sharethis.ejs:6-7](themes/minos/layout/share/sharethis.ejs#L6-L7) already emits exactly what ShareThis expects:

```html
<div class="sharethis-inline-share-buttons"></div>
<script type='text/javascript' src='<%= get_config('share.install_url') %>' async='async'></script>
```

`sharethis-inline-share-buttons` is the container class ShareThis documents for account-based inline buttons ([Getting Started: HTML Websites](https://sharethis.com/support/installation/share-buttons-html-website/)), and the script tag matches the snippet the dashboard hands out — a real-world example being `//platform-api.sharethis.com/js/sharethis.js#property=5b595ccbf5aa6d001130cf95&product=sticky-share-buttons` ([Jekyll + ShareThis walkthrough](https://jojozhuang.github.io/tutorial/jekyll-social-share-buttons-with-sharethis/)).

The only thing missing is the `src` value.

---

## Step 1 — Create the ShareThis property

Following [ShareThis's HTML install guide](https://sharethis.com/support/installation/share-buttons-html-website/):

1. Sign up or log in at [platform.sharethis.com](https://platform.sharethis.com/login/).
2. **Add the domain.** This is a GitHub Pages *project* site — [_config.yml:16](_config.yml#L16) is `https://angela-tylee.github.io/blog` — so the property domain is the host `angela-tylee.github.io`. The `/blog` path is not part of it. Add `localhost` as a second domain if you want the buttons to render under `hexo server`.
3. Open the **Share Buttons** app, choose the **Inline** product, pick networks and styling, then click **Enable App**.
4. Copy the install script from the app's Step 1 (or Settings → Setup) and pull the `src` URL out of it.

## Step 2 — Set `install_url`

In [_config.minos.yml](_config.minos.yml):

```yaml
# Share plugin settings.
share:
  type: sharethis
  install_url: "https://platform-api.sharethis.com/js/sharethis.js#property=<PROPERTY_ID>&product=inline-share-buttons"
```

Three things that will silently break this — no error, just no buttons:

- **`product` must be `inline-share-buttons`.** The partial only renders `<div class="sharethis-inline-share-buttons">`. A property set up for `sticky-share-buttons` loads fine and renders nothing into that div.
- **Use `https://`, not the protocol-relative `//`** the dashboard sometimes gives you. Harmless in a browser today, but it breaks the moment anything renders the page off-protocol.
- **Quote the value.** The `#` is not preceded by whitespace, so YAML would not treat it as a comment — but quoting removes the question entirely and survives someone reformatting the line later.

## Step 3 — Languages

No change to [_config.minos.zh-tw.yml](_config.minos.zh-tw.yml). [99_config.js:39-41](themes/minos/scripts/99_config.js#L39-L41) merges the per-language file *over* the base theme config with `Object.assign`, and the zh-tw file only overrides `menu` — so both languages inherit the share settings automatically.

Worth recording: that merge is **shallow**. Adding a `share:` key to the zh-tw file would replace the whole block rather than merge into it, so a language-specific rollout means restating both `type` *and* `install_url` there.

## Step 4 — README

Flip the **"Add 'share this' button"** item in [README.md](README.md) once it ships.

---

## Verification

1. `pnpm clean && pnpm server` — the clean is required, since `public/` is untracked and stale.
2. Open a post at http://localhost:4000 and confirm real buttons replaced the red banner. If the property has no `localhost` domain registered, expect an empty `.sharebox` here instead and verify after deploy.
3. View source: exactly one `<div class="sharethis-inline-share-buttons">` and one `platform-api.sharethis.com` script per post page — and none on the index, which is guarded by `!index` at [article.ejs:74](themes/minos/layout/common/article.ejs#L74).
4. DevTools network tab: the script returns 200, not 403. A 403 means the domain isn't registered on the property.
5. Open a `/zh-tw/` post to confirm the config merge carried it over.
6. `pnpm build && pnpm deploy`, then confirm on the live GitHub Pages post.

## Trade-offs and rollback

- A third-party script and its cookies on every post page — a tracking/GDPR consideration if a privacy policy ever lands here.
- Ad blockers block `platform-api.sharethis.com`, and the failure is silent. [style.scss:294-296](themes/minos/source/css/style.scss#L294-L296) gives `.sharebox` a `margin-top: 3rem`, so blocked readers see an unexplained gap above the comments area rather than an error.
- Rollback ladder:
  - Blank `install_url` → the red banner comes back.
  - Blank or remove `share.type` → [article.ejs:74](themes/minos/layout/common/article.ejs#L74) drops the sharebox entirely. That works because [`has_config`](themes/minos/scripts/99_config.js#L46-L51) is a `!== null` test and empty YAML values parse to `null`.

## If you'd rather not use a third party

The alternative considered and set aside: add a `share/custom.ejs` partial to the [minos fork](themes/minos) with plain intent-URL links (X, LinkedIn, Facebook, copy link) styled with the theme's existing Bulma classes, and set `share.type: custom`. No external JS, no tracking, no ad-blocker hole — but it becomes a commit in the theme submodule, which per [README.md](README.md) also has to be committed back here as a SHA bump.

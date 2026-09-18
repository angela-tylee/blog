/**
 * Subfolder-aware `hexo publish`.
 *
 * Overrides the built-in command, which cannot see drafts under a language
 * folder: it matches `listDir('_drafts')` entries against `^<slug>[^/\\]+`
 * after slugizing the argument, so `zh-tw/mydraft` becomes the slug
 * `zh-tw-mydraft` and `zh-tw/mydraft.md` never matches. It would also write the
 * post flat to `source/_posts/`, dropping the `i18n_dir: :lang` folder.
 *
 * This version takes the draft's path verbatim and passes `data.path` through
 * to the `new_post_path` filter, which keeps the language folder. Everything
 * else -- the scaffolds/post.md merge, asset folders -- is delegated to hexo's
 * own `post.create()`.
 *
 * Unlike the built-in, `date` is stamped with the publish moment; the draft's
 * original date is kept as `created`.
 */

const { join } = require('path');
const { createRequire } = require('module');
const fs = require('fs');
const fm = createRequire(require.resolve('hexo'))('hexo-front-matter');

/**
 * Drops `excerpt` from a published post when it is blank.
 *
 * This has to run on the file hexo just wrote, not on the data we hand to
 * `post.create()`: scaffolds/post.md carries its own `excerpt: ''`, and
 * `_renderScaffold` deep-merges our data onto the parsed scaffold -- a merge
 * can add or override a key, never remove one. Re-stringifying is safe because
 * hexo wrote that front matter with hexo-front-matter's own stringify, so the
 * remaining keys round-trip unchanged.
 */
function stripEmptyExcerpt(path) {
  const raw = fs.readFileSync(path, 'utf8');
  const post = fm.parse(raw);
  if (typeof post.excerpt !== 'string' || post.excerpt.trim()) return;

  delete post.excerpt;

  // stringify() drops the opening separator unless asked for it, so carry over
  // what the file actually opened with, the way hexo's _renderScaffold does.
  const { separator, prefixSeparator } = fm.split(raw);
  fs.writeFileSync(path, fm.stringify(post, {
    separator,
    prefixSeparator,
    mode: separator.startsWith(';') ? 'json' : ''
  }));
}

hexo.extend.console.register('publish', 'Moves a draft to posts, preserving its language subfolder', {
  usage: '<path>',
  arguments: [
    { name: 'path', desc: 'Draft path under source/_drafts, without .md (e.g. zh-tw/my-post)' }
  ],
  options: [
    { name: '-r, --replace', desc: 'Overwrite an existing post' }
  ]
}, function (args) {
  const rel = args._[0];
  if (!rel) return this.call('help', { _: ['publish'] });

  const src = join(this.source_dir, '_drafts', `${rel}.md`);
  if (!fs.existsSync(src)) throw new Error(`Draft "${rel}" does not exist.`);

  const data = fm.parse(fs.readFileSync(src, 'utf8'));
  data.content = data._content;
  data._content = undefined;
  data.layout = 'post';
  data.path = `${rel}.md`;

  // A Date (not a preformatted string) so hexo-front-matter emits it unquoted
  // in local time, matching the `date` line. hexo's post.create() runs both
  // through moment() itself, so plain Dates are all it needs.
  if (data.date) data.created = new Date(data.date);
  data.date = new Date();

  return this.post.create(data, args.r || args.replace).then(post => {
    fs.unlinkSync(src);
    stripEmptyExcerpt(post.path);
    this.log.info('Published: %s', post.path);
  });
});

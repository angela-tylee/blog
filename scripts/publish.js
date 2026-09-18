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
    this.log.info('Published: %s', post.path);
  });
});

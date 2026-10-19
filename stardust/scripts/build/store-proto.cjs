// Builds a store-template prototype from the captured settled DOM:
// verbatim text nodes, clean semantic markup, shared canon CSS.
// usage: node store-proto.cjs <slug> <archetype-css> [<title>]
const fs = require('fs');
const cheerio = require('cheerio');
const [slug, css] = process.argv.slice(2);
const src = fs.readFileSync(`stardust/current/pages/${slug}.html`, 'utf8');
const rec = JSON.parse(fs.readFileSync(`stardust/current/pages/${slug}.json`, 'utf8'));
const $ = cheerio.load(src);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ALLOWED = new Set(['p', 'strong', 'b', 'br', 'a', 'ul', 'ol', 'li', 'em', 'span', 'h3', 'h4']);
function clean(node) {
  let out = '';
  $(node).contents().each((_, n) => {
    if (n.type === 'text') { out += esc(n.data); return; }
    if (n.type !== 'tag') return;
    const tag = n.tagName.toLowerCase();
    if (!ALLOWED.has(tag)) { out += clean(n); return; }
    if (tag === 'br') { out += '<br>'; return; }
    if (tag === 'span') { out += $(n).hasClass('text') ? `<span class="text">${clean(n)}</span>` : clean(n); return; }
    if (tag === 'a') {
      const href = $(n).attr('href') || '#';
      const tgt = $(n).attr('target') ? ` target="${$(n).attr('target')}"` : '';
      const ext = $(n).hasClass('a-link-external') ? ' class="ext"' : '';
      out += `<a href="${esc(href)}"${ext}${tgt}>${clean(n)}</a>`; return;
    }
    out += `<${tag}>${clean(n)}</${tag}>`;
  });
  return out;
}
const modules = [];
const mediaName = (src) => (src || '').split('/').pop().replace(/\.(jpg|webp|png)$/, '');
function picture(img) {
  const n = mediaName($(img).attr('src'));
  const alt = esc($(img).attr('alt') || '');
  return `<picture>
          <source media="(min-width: 900px)" type="image/webp" srcset="assets/media/${n}-600x.webp, assets/media/${n}-1200x.webp 2x">
          <source media="(min-width: 600px)" type="image/webp" srcset="assets/media/${n}-450x.webp, assets/media/${n}-900x.webp 2x">
          <source type="image/webp" srcset="assets/media/${n}-600x.webp, assets/media/${n}-1200x.webp 2x">
          <img src="assets/media/${n}-600x.jpg" alt="${alt}">
        </picture>`;
}
$('.g-container > .js-content').first().children().each((_, m) => {
  const $m = $(m);
  if ($m.hasClass('m-contenttextmedia')) {
    const img = $m.find('.media img').first();
    const h2 = $m.find('h2').first().text().trim();
    const text = $m.find('.text.js-content').first();
    const media = img.length ? `\n      <div class="media">${picture(img)}</div>` : '';
    const heading = h2 ? `<div class="heading"><h2 class="a-heading">${esc(h2)}</h2></div>` : '';
    const more = $m.find('.js-morelesslink').length ? `<a href="javascript:void(0)" class="morelesslink"><i class="icon icon-arrow-down"></i><span class="text">${esc($m.find('.js-morelesslink .text').text().trim())}</span></a>` : '';
    const body = text.length ? `<div class="text">${clean(text)}</div>${more}` : '';
    const outer = $m.children('.heading').length > 0;
    modules.push(outer
      ? `    <section class="m-contenttextmedia split">${media}
      ${heading}
      <div class="content">${body}</div>
    </section>`
      : `    <section class="m-contenttextmedia${img.length ? ' has-media' : ''}">${media}
      <div class="content">${heading}${body}</div>
    </section>`);
  } else if ($m.hasClass('m-contentteaser')) {
    const h3 = $m.find('h3').first().text().trim();
    modules.push(`    <section class="m-contentteaser"><div class="content"><h3 class="a-heading">${esc(h3)}</h3><p></p></div></section>`);
  } else if ($m.find('.m-countryselectorlist').length) {
    const items = $m.find('.m-togglebox > .item').map((i, it) => {
      const t = $(it).find('.togglebox-title .text').first().text().trim();
      const id = $(it).find('.togglebox-content').attr('id') || `region-${i}`;
      const countries = $(it).find('.country a').map((_, a) => `<div class="country"><a href="${esc($(a).attr('href'))}">${esc($(a).text().trim())}</a></div>`).get().join('\n');
      return `        <div class="item">
          <a href="#/Togglebox=${id}/" class="togglebox-title" aria-expanded="false" aria-controls="${id}"><span class="text">${esc(t)}</span></a>
          <section class="togglebox-content" id="${id}"><div class="region">
${countries}
          </div></section>
        </div>`;
    }).get().join('\n');
    modules.push(`    <div class="g-col"><section class="m-countryselectorlist">
      <div class="m-togglebox">
${items}
      </div>
    </section></div>`);
  }
});
const social = $('.m-footerpagefunctionsfollow li a').map((_, a) => {
  const icon = ($(a).find('i').attr('class') || '').split(/\s+/).find((c) => c.startsWith('icon-'));
  return `<li><a href="${$(a).attr('href')}" aria-label="${$(a).attr('aria-label')}" target="_blank" rel="noopener"><i class="icon ${icon}"></i></a></li>`;
}).get().join('\n');
const legal = $('.m-footerlinkscopyright li a').map((_, a) => `<li><a href="${$(a).attr("href")}"><span class="text">${esc($(a).text().trim())}</span></a></li>`).get().join('\n');
const navHref = $('.m-navfooter .group-header a').attr('href') || '/general/imprint';
const html = `<!doctype html>
<html lang="${$('html').attr('lang') || 'en'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(rec.title)}</title>
  ${rec.description ? `<meta name="description" content="${esc(rec.description)}">` : ''}
  <link rel="icon" href="assets/favicon.ico">
  <link rel="stylesheet" href="css/store-canon.css">
  <link rel="stylesheet" href="css/${css}">
  ${fs.existsSync(`stardust/prototypes/js/${css.replace('.css', '.js')}`) ? `<script src="js/${css.replace('.css', '.js')}" defer></script>` : ''}
</head>
<body data-stardust-slug="${slug}">
  <a href="#content" class="sr-only skip-to-content">Skip to content</a>
  <div class="g-container">
  <header class="o-header">
    <div class="header-elements">
      <button class="close-mobile" type="button"><i class="icon icon-close"></i><span class="text">Close</span></button>
      <div class="identifier-logo"><a href="/" aria-label="GAGGENAU"><img src="assets/GG-logo-black-RGB.png" alt="GAGGENAU" width="148" height="22"></a></div>
    </div>
  </header>
  <main class="js-content" id="content">
${modules.join('\n')}
  </main>
  <footer class="o-footer">
    <div class="footer-functions"><div class="follow"><ul>${social}</ul></div></div>
    <div class="footer-navwrap"><nav class="navfooter"><ul><li class="group-header"><a href="${navHref}"><i class="icon icon-arrow-down"></i></a></li><li class="overview"><a href="#"><span class="text">Overview</span></a></li></ul></nav><div class="navfooter-spacer"></div></div>
    <div class="footer-links"><div class="copyright-links"><ul>${legal}</ul></div></div>
  </footer>
  </div>
</body>
</html>
`;
fs.writeFileSync(`stardust/prototypes/${slug}-proposed.html`, html);
console.log(`wrote stardust/prototypes/${slug}-proposed.html (${modules.length} modules)`);

// Builds the landing (de-de) prototype from the captured settled DOM:
// verbatim strings + hrefs + alts pulled per module, clean semantic markup,
// and css/landing.css lifted from the source's own emotion rules by mapping
// each source class to the semantic class it styles here.
// usage: node stardust/scripts/build/landing-proto.mjs
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { parseCss, splitDeclarations } from '../replica/css-rules.mjs';

const require = createRequire(import.meta.url);
const cheerio = require('cheerio');
const SLUG = 'de-de';
const $ = cheerio.load(fs.readFileSync(`stardust/current/pages/${SLUG}.html`, 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const txt = (el) => $(el).text().replace(/\s+/g, ' ').trim();
const raw = (el) => $(el).text().replace(/\s+/g, ' ');

// ---------- semantic class ← source class ----------
const MAP = {
  skip: 'q9wfka', 'skip-label': '1u3b2uy',
  'site-header': 'w0rbtr', hdr: '1j7hu8u', 'hdr-brand': '19jn0x3', 'hdr-cell': 'uiheni', 'hdr-logo': '1r225kg',
  'hdr-bar': 'aa1wws', 'hdr-left': '8ulh6c', 'hdr-burger': 'ui9qvr', 'icon-btn': 'mhkzl8', icon: '16pw2jy',
  'hdr-nav': '1hyghxd', 'hdr-navlink': '1x543w5', 'hdr-right': 'fq4dc8', 'hdr-search': '112vrwo', 'hdr-search-in': '1k5bgzr',
  'hdr-actions': '1h2b4lz', 'user-btn': '1ord7e4', 'user-icon': '1ut1bek', cart: '17iwx12', 'cart-badge': '58gv9h', 'hdr-burger-r': 'sc61z8',
  stage: 'pfm077', 'stage-media': '16wa331', 'stage-pic': '13o7eu2', 'stage-img': '8bb872', 'stage-wrap': 'sf4wfc', 'stage-inner': '136h06m',
  'stage-top': 'hc2rck', 'stage-top-in': 'npqg07', 'stage-text': '1t6ag4j', 'stage-title': 'wh3zei', 'stage-desc': 'lzgjhp', 'stage-p': 'kza2bo',
  'stage-action': '1tlb628', 'btn-primary': 'f4s9il', 'btn-label': '1ksb7to',
  content: '4g0pwr', lane: 'lpqxjv', 'lane-inner': 'zd1jgi', container: '1pqlyz8', 'lane-head': '1ohw4uv', 'lane-title': '1po596s',
  'lane-nav': '63ajf8', 'lane-arrow': '1eusy99', 'arrow-icon': '1f3nf51', slider: '9ks0tk',
  teaser: '1sgs6pf', 'teaser-media': '17ezjga', 'media-box': 'jnrn1y', 'media-ratio': '104wpqf', 'teaser-pic': 'd930wr', 'teaser-body': '1o5vcq8',
  'teaser-link': 'thwkrl', 'teaser-text': '19hgra2', 'teaser-title': '6rs21o', 'teaser-desc': 'aqwtzg', 'btn-tertiary': '1s98jqn', 'btn-tertiary-label': 'itcfte',
  cats: '11y91da', cat: 'yhijrb', 'cat-img': '18j5ibd', 'cat-label': 'rhb4vv',
  ed: '10f69or', 'ed-media': 'f1l971', 'ed-play': 'sqdy2c', 'play-icon': 't9jg6z', 'ed-body': 's314c7', 'ed-link': 'rzho8m', 'ed-text': '1qgjcws',
  'ed-title': '16k7w8z', 'ed-desc': '1c1c11e',
  'site-footer': '1kt23q5', ft: '1npwqqf', 'ft-social': 'mge5uy', 'ft-rule': 'dq1iod', 'ft-rule-a': '1jzprsx', 'ft-rule-b': '46bdna', 'ft-icons': '7l7n64',
  'ft-icon': '1jv0v4t', 'ft-cols': '1hhkzxr', 'ft-cols-in': '52kx2w', 'ft-col': 'rqxgsr', 'ft-head': '1qa0n9u', link: 'dikvnm', 'link-label': '1nbhbkt',
  'ft-acc': 'uw7tgr', 'ft-acc-rule': '1nkrp4x', 'ft-acc-item': '16l6a68', 'ft-acc-btn': '1cq46n7', 'ft-acc-label': 'jvl4fo', 'ft-acc-text': 'tt0k53', chev: '1kjai8t',
  legal: '1lsufhd', copyright: '17dky19', 'legal-links': '1f37n9t', 'totop-wrap': '1qyz709', totop: 'bhlcxq', 'totop-icon': '1uoxg5p',
};
const RENAME = [['bsh-button-action', 'btn-icon'], ['bsh-button', 'btn'], ['bsh-editorial-teaser-content', 'teaser-cta'], ['bsh-category-teaser', 'cat'], ['bsh-accordion-button', 'ft-acc-btn'], ['bsh-link', 'link'], ['bsh-scroll-to-top', 'totop'], ['swiper-scrollbar-drag', 'slider-thumb'], ['swiper-scrollbar', 'slider-bar'], ['swiper-wrapper', 'slider-track'], ['swiper-slide', 'slide']];

// ---------- CSS lift ----------
function liftCss() {
  const rules = parseCss(fs.readFileSync(`stardust/current/assets/css/${SLUG}-inline.css`, 'utf8'));
  const back = Object.fromEntries(Object.entries(MAP).map(([k, v]) => [`css-${v}`, k]));
  const out = [];
  for (const r of rules) {
    if (r.selector.startsWith('@')) continue;
    const hashes = r.selector.match(/css-[a-z0-9]+/g);
    if (!hashes || !hashes.every((h) => back[h])) continue;
    if (r.media.some((m) => /-moz-document/.test(m))) continue;
    let sel = r.selector.replace(/\.css-[a-z0-9]+/g, (m) => `.${back[m.slice(1)]}`);
    for (const [a, b] of RENAME) sel = sel.replace(new RegExp(`\\.${a}(?![\\w-])`, 'g'), `.${b}`);
    sel = sel.replace(/animation-zz3sc3/g, 'stage-rise');
    const decls = splitDeclarations(r.body)
      .map((d) => d.split(/: (.*)/s))
      .filter(([p, v]) => !/^-(webkit|moz|ms)-/.test(p) && !/^-(webkit|moz|ms)-/.test(v || ''))
      .map(([p, v]) => `${p}: ${v.replace(/animation-zz3sc3/g, 'stage-rise')};`);
    if (!decls.length) continue;
    const media = r.media.filter((m) => !/^@media \(min-width: 0px\)$/.test(m));
    let block = `${sel} { ${decls.join(' ')} }`;
    for (const m of [...media].reverse()) block = `${m} { ${block} }`;
    out.push(block);
  }
  return out.join('\n');
}

// ---------- markup helpers ----------
const ICONS = {};
for (let i = 0; i < 9; i += 1) ICONS[i] = fs.readFileSync(`stardust/.work/dede/icon${i}.svg`, 'utf8');
function icon(i, cls) {
  return ICONS[i].replace(/ xmlns="http:\/\/www.w3.org\/2000\/svg"/g, '').replace(/<svg /, '<svg xmlns="http://www.w3.org/2000/svg" ')
    .replace(/class="css-[a-z0-9]+"/, `class="${cls}"`);
}
const WIDTHS = [400, 500, 800, 1600];
const nameOf = (srcset) => (srcset || '').match(/Images\/\d+x\/([^ ,]+\.webp)/)?.[1];
const set = (n) => WIDTHS.map((w) => `assets/media/dede/${w}-${n} ${w}w`).join(', ');
function picture($pic, cls, imgCls) {
  const sources = $pic.find('source').map((_, s) => `<source media="${esc($(s).attr('media'))}" sizes="${esc($pic.find('img').attr('sizes') || '100vw')}" srcset="${set(nameOf($(s).attr('srcset')))}">`).get();
  const img = $pic.find('img');
  const n = nameOf(img.attr('srcset'));
  return `<picture class="${cls}">${sources.join('')}<img class="${imgCls}" src="assets/media/dede/1600-${n}" srcset="${set(n)}" sizes="${esc(img.attr('sizes') || '100vw')}" alt="${esc(img.attr('alt') || '')}"></picture>`;
}
const linkAttrs = (a) => {
  const t = $(a).attr('target') ? ` target="${$(a).attr('target')}"` : '';
  const l = $(a).attr('aria-label') ? ` aria-label="${esc($(a).attr('aria-label'))}"` : '';
  return `href="${esc($(a).attr('href'))}"${t}${l}`;
};

// ---------- header ----------
const navItems = $('nav[data-testid="main-navigation"] .css-1x543w5').map((_, n) => (n.tagName === 'a'
  ? `<a class="hdr-navlink" href="${esc($(n).attr('href'))}">${esc(txt(n))}</a>`
  : `<button type="button" class="hdr-navlink" aria-expanded="false">${esc(txt(n))}</button>`)).get();
const logo = '<a class="hdr-home" href="https://www.gaggenau.com/de/" aria-label="Homepage"><img class="hdr-logo" src="assets/media/dede/gaggenau.cb6ae389.svg" alt="GAGGENAU Logo"></a>';
const cartLabel = $('[data-testid="cart-icon"]').attr('aria-label');
const header = `<a class="btn skip" href="#main"><span class="skip-label">${esc(txt($('.css-q9wfka')))}</span></a>
<header class="site-header">
  <div class="hdr">
    <div class="hdr-brand"><div class="hdr-cell"></div>${logo}</div>
    <div class="hdr-bar">
      <div class="hdr-cell">
        <div class="hdr-left">
          <div class="hdr-burger"><button type="button" class="btn-icon icon-btn" aria-label="${esc($('[data-testid="menu-icon"]').attr('aria-label'))}">${icon(0, 'icon')}</button></div>
          <div class="hdr-mini">${logo}</div>
          <div class="hdr-cell"><nav class="hdr-nav">${navItems.map((n) => `<span>${n}</span>`).join('')}</nav></div>
        </div>
      </div>
      <div class="hdr-right">
        <div class="hdr-search"><div class="hdr-search-in"></div></div>
        <div class="hdr-actions">
          <button type="button" class="btn-icon user-btn" aria-label="${esc($('[data-testid="user-icon"]').attr('aria-label'))}">${icon(1, 'user-icon')}</button>
          <button type="button" class="btn-icon icon-btn" aria-label="${esc($('[data-testid="search-icon"]').attr('aria-label'))}">${icon(2, 'icon')}</button>
          <div class="cart"><div class="cart-badge"></div><a class="btn-icon icon-btn" href="${esc($('[data-testid="cart-icon"]').attr('href'))}" aria-label="${esc(cartLabel)}">${icon(3, 'icon')}</a></div>
          <div class="hdr-burger-r"><button type="button" class="btn-icon icon-btn" aria-label="${esc($('[data-testid="menu-icon-right"]').attr('aria-label'))}">${icon(0, 'icon')}</button></div>
        </div>
      </div>
    </div>
  </div>
</header>`;

// ---------- main ----------
function stage(el, isH1) {
  const $s = $(el);
  const title = txt($s.find('.css-wh3zei'));
  const tag = isH1 ? 'h1' : 'p';
  const a = $s.find('[data-testid="media-stage-content-action"] a');
  return `<section class="stage">
    <div class="stage-media">${picture($s.find('picture').first(), 'stage-pic', 'stage-img')}</div>
    <div class="stage-wrap"><div class="stage-inner">
      <div class="stage-top"><div class="stage-top-in"></div></div>
      <div class="stage-text"><${tag} class="stage-title">${esc(title)}</${tag}><div class="stage-desc"><p class="stage-p">${esc(txt($s.find('.css-kza2bo')))}</p></div></div>
      <div class="stage-action"><a class="btn btn-primary" ${linkAttrs(a)}><span class="btn-label">${esc(txt(a))}</span></a></div>
    </div></div>
  </section>`;
}
const stages = $('[data-testid="media-stage"]');
const slides = $('[data-testid="editorial-teaser-slider"] [data-testid="editorial-teaser"]').map((i, t) => {
  const $t = $(t); const a = $t.find('a[data-testid="editorial-teaser-link"]');
  return `<div class="slide" role="group" aria-label="${i + 1} / ${$('[data-testid="editorial-teaser-slider"] [data-testid="editorial-teaser"]').length}">
          <div class="teaser">
            <span class="teaser-media"><div class="media-box"><div class="media-ratio">${picture($t.find('picture'), 'teaser-pic', 'fill-img')}</div></div></span>
            <span class="teaser-body"><a class="teaser-cta teaser-link" href="${esc(a.attr('href'))}"><span class="teaser-text"><span class="teaser-title">${esc(raw($t.find('[data-testid="editorial-teaser-headline"]')))}</span><span class="teaser-desc">${esc(raw($t.find('[data-testid="editorial-teaser-description"]')))}</span></span><span class="btn btn-tertiary"><span class="btn-tertiary-label">${esc(txt($t.find('.css-itcfte')))}</span></span></a></span>
          </div>
        </div>`;
}).get();
const lane = `<div class="lane">
    <div class="lane-inner">
      <div class="container"><div class="lane-head"><div class="lane-title"></div><div class="lane-nav">
        <button type="button" class="btn-icon lane-arrow" data-dir="-1" aria-label="${esc($('.css-1eusy99').eq(0).attr('aria-label'))}">${icon(4, 'arrow-icon')}</button>
        <button type="button" class="btn-icon lane-arrow" data-dir="1" aria-label="${esc($('.css-1eusy99').eq(1).attr('aria-label'))}">${icon(5, 'arrow-icon')}</button>
      </div></div></div>
      <div><div class="slider">
        <div class="slider-track">
        ${slides.join('\n        ')}
        </div>
        <div class="slider-bar"><div class="slider-thumb"></div></div>
      </div></div>
    </div>
  </div>`;
const cats = $('[data-testid="quick-category-navigation-container"] a').map((_, a) => {
  const img = $(a).find('img'); const n = nameOf(img.attr('srcset'));
  return `<a class="cat" ${linkAttrs(a)}><img class="cat-img" src="assets/media/dede/400-${n}" srcset="${set(n)}" sizes="${esc(img.attr('sizes'))}" alt="${esc(img.attr('alt'))}"><div class="cat-label">${esc(txt($(a).find('.css-rhb4vv')))}</div></a>`;
}).get();
function editorial(el) {
  const $e = $(el); const a = $e.find('a[data-testid="editorial-teaser-link"]');
  const iframe = $e.find('iframe');
  const video = iframe.length ? `<div class="ed-video"><iframe class="fill-frame" src="${esc(iframe.attr('src'))}" allow="autoplay; fullscreen; picture-in-picture" loading="lazy"></iframe></div>` : '';
  const play = $e.find('.css-sqdy2c').length ? `<button type="button" class="btn-icon ed-play" aria-label="${esc($e.find('.css-sqdy2c').attr('aria-label'))}" hidden>${icon(6, 'play-icon')}</button>` : '';
  return `<div class="container"><div class="lane">
      <div class="ed">
        <span class="ed-media"><div class="media-box"><div class="media-ratio">${video}${picture($e.find('picture'), iframe.length ? 'ed-poster' : 'teaser-pic', 'fill-img')}</div>${play}</div></span>
        <span class="ed-body"><a class="teaser-cta ed-link" href="${esc(a.attr('href'))}"><span class="ed-text"><span class="ed-title">${esc(raw($e.find('[data-testid="editorial-teaser-headline"]')))}</span><span class="ed-desc">${esc(raw($e.find('[data-testid="editorial-teaser-description"]')))}</span></span><span class="btn btn-tertiary"><span class="btn-tertiary-label">${esc(txt($e.find('.css-itcfte')))}</span></span></a></span>
      </div>
    </div></div>`;
}
const main = `<main>
  ${stage(stages.get(0), true)}
  <div class="content" id="main">
  ${lane}
  <div class="container"><div class="lane-inner"><div class="cats">
    ${cats.join('\n    ')}
  </div></div></div>
  ${stage(stages.get(1), false)}
  ${$('[data-testid="editorial-teaser-multiple"] [data-testid="editorial-teaser"]').map((_, e) => editorial(e)).get().join('\n  ')}
  </div>
</main>`;

// ---------- footer ----------
const cols = $('[data-testid="content-link-list"]').map((i, c) => {
  const head = $(c).find('[data-testid="content-link-headline"]');
  const items = $(c).find('[data-testid="content-link-item"]').map((_, a) => `<a class="link" ${linkAttrs(a)}><span class="link-label">${esc(txt(a))}</span></a>`).get();
  return { head: `<a class="ft-head" href="${esc(head.attr('href'))}">${esc(txt(head))}</a>`, label: txt(head), items };
}).get();
const social = $('[data-testid="social-media-icons"] a').map((_, a) => `<a ${linkAttrs(a)}><img class="ft-icon" src="assets/media/dede/${$(a).find('img').attr('src').split('/').pop()}" alt="${esc($(a).find('img').attr('alt'))}"></a>`).get();
const legal = $('[data-testid="legal-links"] a').map((_, a) => `<a class="link" ${linkAttrs(a)}><span class="link-label">${esc(txt(a))}</span></a>`).get();
const footer = `<footer class="site-footer">
  <div class="ft">
    <div class="ft-social"><div class="ft-rule"><div class="ft-rule-a"></div><div class="ft-rule-b"></div></div><div class="ft-icons">${social.join('')}</div></div>
    <div class="ft-cols"><div class="ft-cols-in">
      ${cols.map((c) => `<div class="ft-col">${c.head}${c.items.join('')}</div>`).join('\n      ')}
    </div></div>
    <div class="ft-acc"><div>
      ${cols.map((c, i) => `<div class="ft-acc-rule"></div>
      <div><div class="ft-acc-item"><button type="button" class="ft-acc-btn" aria-expanded="false" aria-controls="ft-panel-${i}"><span class="ft-acc-label"><span class="ft-acc-text">${esc(c.label)}</span></span>${icon(7, 'chev')}</button></div>
        <div class="ft-acc-panel" id="ft-panel-${i}" data-col="${i}" hidden></div></div>`).join('\n      ')}
      <div class="ft-acc-rule"></div>
    </div></div>
  </div>
  <div class="legal"><div class="copyright"></div><div class="legal-links">${legal.join('')}</div></div>
  <div class="totop-wrap"><button type="button" class="totop" aria-label="${esc($('[data-testid="scroll-to-top-button"]').attr('aria-label'))}">${icon(8, 'totop-icon')}</button></div>
</footer>`;

const title = $('title').text().trim();
const desc = $('meta[name="description"]').attr('content') || '';
const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="stylesheet" href="css/landing.css">
<script src="js/landing.js" defer></script>
</head>
<body class="landing">
<div class="page">
${header}
${main}
${footer}
</div>
</body>
</html>
`;
fs.writeFileSync(`stardust/prototypes/${SLUG}-proposed.html`, html);
const base = fs.readFileSync('stardust/scripts/build/landing-base.css', 'utf8');
fs.writeFileSync('stardust/prototypes/css/landing.css', `${base}\n/* ---- lifted from the source's emotion rules (semantic class ← source class) ---- */\n${liftCss()}\n`);
console.log(`wrote stardust/prototypes/${SLUG}-proposed.html + css/landing.css`);

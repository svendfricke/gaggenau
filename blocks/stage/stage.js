/**
 * stage — full-bleed image stage with a scrimmed title, lede and one CTA
 * (landing template; prototype section `section.stage`, schema stardust/eds-schema/de-de.json).
 * Decode tier: template-slotted (fixed composition).
 *
 * Authoring (one cell or several rows — decoded by querying, never by index):
 *   - 1–3 images: desktop (>= 1200px), then tablet (720–1199px), then mobile (< 720px);
 *     with two images the second serves every width below 1200px
 *   - title: a heading (the page's lead stage carries the single <h1>) or, without a heading,
 *     the first text paragraph
 *   - lede: the next text paragraph(s)
 *   - CTA: a paragraph holding one plain link (the block paints it as the primary button)
 *
 * A stage that is not the page's first section sits inside the landing content band
 * (`in-content`: ground colour + band gap above).
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

function firstFilledSibling(el, dir) {
  let n = dir < 0 ? el.previousElementSibling : el.nextElementSibling;
  while (n && !n.children.length) n = dir < 0 ? n.previousElementSibling : n.nextElementSibling;
  return n;
}

const TEMPLATE = `
  <div class="stage-box">
    <div class="stage-media"></div>
    <div class="stage-wrap">
      <div class="stage-inner">
        <div class="stage-top"><div class="stage-top-in"></div></div>
        <div class="stage-text">
          <div class="stage-title"></div>
          <div class="stage-desc"></div>
        </div>
        <div class="stage-action"></div>
      </div>
    </div>
  </div>`;

/** scripts.js pins <html lang="en">; German copy needs lang="de" for `hyphens: auto`
 * (source hyphenates). Scoped override until the foundation derives lang per page. */
function contentLang(block) {
  const [, code] = window.location.pathname.match(/^\/([a-z]{2})(?:\/|$)/) || [];
  if (code && document.documentElement.lang !== code) block.lang = code;
}

export default async function decorate(block) {
  if (block.querySelector(':scope > .stage-box')) return;

  // 1. query the authored nodes (and capture them before anything moves)
  const pictures = [...block.querySelectorAll('picture')];
  block.querySelectorAll('img').forEach((img) => {
    if (!img.closest('picture')) pictures.push(img);
  });
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const paras = [...block.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture, img') && p.textContent.trim());
  const ctas = paras.filter((p) => p.querySelector('a[href]'));
  const texts = paras.filter((p) => !p.querySelector('a[href]'));
  const title = heading || texts.shift();
  const leftovers = [...block.querySelectorAll(':scope > div > div > :is(ul, ol, table, blockquote)')];

  // 2. the prototype composition with empty slots
  const tpl = document.createElement('template');
  tpl.innerHTML = TEMPLATE.trim();
  const box = tpl.content.firstElementChild;
  const media = box.querySelector('.stage-media');
  const titleSlot = box.querySelector('.stage-title');
  const desc = box.querySelector('.stage-desc');
  const action = box.querySelector('.stage-action');

  // 3. move the authored nodes into the slots
  const variants = ['stage-pic-desktop', 'stage-pic-tablet', 'stage-pic-mobile'];
  media.classList.add(`stage-art-${Math.min(pictures.length, 3)}`);
  pictures.slice(0, 3).forEach((pic, i) => {
    const holder = wrapNode(pic, 'stage-pic');
    holder.classList.add(variants[i]);
    media.append(holder);
  });
  if (title) titleSlot.append(title);
  texts.forEach((p) => desc.append(p));
  leftovers.forEach((el) => desc.append(el));
  ctas.forEach((p) => {
    const a = p.querySelector('a[href]');
    a.classList.add('btn', 'btn-primary');
    if (!a.querySelector('.btn-label')) {
      const label = document.createElement('span');
      label.className = 'btn-label';
      label.append(...a.childNodes);
      a.append(label);
    }
    action.append(p);
  });
  if (!ctas.length) action.remove();

  block.replaceChildren(box);

  const section = block.closest('.section');
  if (section && firstFilledSibling(section, -1)) block.classList.add('in-content');
  if (section && !firstFilledSibling(section, 1)) block.classList.add('content-end');
  contentLang(block);
}

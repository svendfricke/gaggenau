/**
 * teaser-slider — the landing's editorial teaser lane: image teasers in a slider
 * (1 / 2 / 3 per view at < 720 / 720–1199 / >= 1200px), prev/next arrows and a
 * scrollbar thumb below 1200px. Prototype `.lane` (stardust/prototypes/de-de-proposed.html).
 * Decode tier: reconstructive (repeat group — one slide per authored row).
 *
 * Authoring: one row per teaser —
 *   cell 1: the teaser image
 *   cell 2: title paragraph, description paragraph, a paragraph with the CTA link
 *           (the link's href is the whole card's target; its text is the card's button label)
 * A flattened single-cell shape is segmented on the image (one teaser per image).
 *
 * Behaviour (source swiper, measured): arrows step one slide (track translate, 300ms);
 * the thumb tracks the scroll position; arrows disable at the ends; locked when all fit.
 */

const SVG_PREV = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="arrow-icon" viewBox="0 0 24 24" fill="none"><path d="m16.99 21.98-9.99-9.99 9.99-9.99.73.73-9.27 9.26 9.27 9.26z" fill="currentColor"></path></svg>';
const SVG_NEXT = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="arrow-icon" viewBox="0 0 24 24" fill="none"><path d="m7.72 21.98-.72-.73 9.26-9.26-9.26-9.26.72-.73 9.99 9.99z" fill="currentColor"></path></svg>';

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

function wrapNode(node, className, tag = 'div') {
  const w = el(tag, className);
  w.append(node);
  return w;
}

function filledSibling(node, dir) {
  let n = dir < 0 ? node.previousElementSibling : node.nextElementSibling;
  while (n && !n.children.length) n = dir < 0 ? n.previousElementSibling : n.nextElementSibling;
  return n;
}

/** content band edges (the source's `.content` wrapper: ground, padding, gaps) */
function markBand(block) {
  const section = block.closest('.section');
  if (!section) return;
  const prev = filledSibling(section, -1);
  if (!prev || (!filledSibling(prev, -1) && prev.querySelector('.stage'))) block.classList.add('content-start');
  if (!filledSibling(section, 1)) block.classList.add('content-end');
}

/** expand the runtime's media-led <p> wrapper back into its children */
function cellNodes(cell) {
  let kids = [...cell.children];
  if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].querySelector('picture, img')
    && kids[0].children.length > 1) {
    kids = [...kids[0].children];
  }
  return kids;
}

function segment(block) {
  const rows = [...block.children];
  const groups = [];
  rows.forEach((row) => {
    const nodes = [...row.children].flatMap(cellNodes);
    const imgCount = nodes.filter((n) => n.matches('picture, img') || n.querySelector('picture, img')).length;
    if (imgCount > 1) {
      // flattened: one teaser per image
      nodes.forEach((n) => {
        const isMedia = n.matches('picture, img') || n.querySelector('picture, img');
        if (isMedia || !groups.length) groups.push([]);
        groups[groups.length - 1].push(n);
      });
    } else if (nodes.length) {
      groups.push(nodes);
    }
  });
  return groups;
}

function buildTeaser(nodes) {
  const media = nodes.find((n) => n.matches('picture, img') || n.querySelector('picture, img'));
  const pic = media && (media.matches('picture, img') ? media : media.querySelector('picture, img'));
  const ctaP = nodes.find((n) => n !== media && (n.matches('a[href]') || n.querySelector('a[href]')));
  const texts = nodes.filter((n) => n !== media && n !== ctaP && n.textContent.trim());
  const link = ctaP && (ctaP.matches('a[href]') ? ctaP : ctaP.querySelector('a[href]'));

  const teaser = el('div', 'teaser');
  const mediaWrap = el('span', 'teaser-media');
  const box = el('div', 'media-box');
  const ratio = el('div', 'media-ratio');
  if (pic) ratio.append(wrapNode(pic, 'teaser-pic'));
  box.append(ratio);
  mediaWrap.append(box);

  const body = el('span', 'teaser-body');
  const card = el('a', 'teaser-cta teaser-link');
  if (link) card.href = link.href;
  const text = el('span', 'teaser-text');
  const [title, ...descs] = texts;
  if (title) text.append(wrapNode(title, 'teaser-title', 'span'));
  if (descs.length) {
    const d = el('span', 'teaser-desc');
    d.append(...descs);
    text.append(d);
  }
  card.append(text);
  if (ctaP) {
    const btn = el('span', 'btn btn-tertiary');
    const label = el('span', 'btn-tertiary-label');
    label.append(ctaP);
    // card-as-link (EW6): the authored paragraph stays, its inner anchor unwraps
    if (link) link.replaceWith(...link.childNodes);
    btn.append(label);
    card.append(btn);
  }
  body.append(card);
  teaser.append(mediaWrap, ' ', body);
  return teaser;
}

function wireSlider(lane) {
  const slider = lane.querySelector('.slider');
  const track = slider.querySelector('.slider-track');
  const slides = [...track.children];
  const thumb = slider.querySelector('.slider-thumb');
  const arrows = lane.querySelectorAll('.lane-arrow');
  let index = 0;
  const layout = () => {
    if (!slides.length) return;
    const view = track.getBoundingClientRect().width;
    const step = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : view;
    const lastSlide = slides[slides.length - 1];
    const full = lastSlide.offsetLeft + lastSlide.offsetWidth;
    const maxShift = Math.max(0, full - view);
    const perView = Math.max(1, Math.round(view / (step || view || 1)));
    const last = Math.max(0, slides.length - perView);
    index = Math.min(index, last);
    const shift = Math.min(index * step, maxShift);
    track.style.transform = `translate3d(${-shift}px, 0px, 0px)`;
    slider.classList.toggle('is-locked', maxShift <= 1);
    arrows.forEach((b) => {
      const dir = Number(b.dataset.dir);
      b.disabled = maxShift <= 1 || (dir < 0 ? index === 0 : index >= last);
    });
    if (thumb) {
      const bar = thumb.parentElement.getBoundingClientRect().width;
      const w = maxShift > 1 ? bar * (view / full) : 0;
      thumb.style.width = `${w}px`;
      thumb.style.transform = `translate3d(${maxShift > 1 ? (bar - w) * (shift / maxShift) : 0}px, 0px, 0px)`;
    }
  };
  arrows.forEach((b) => b.addEventListener('click', () => {
    index = Math.max(0, index + Number(b.dataset.dir));
    layout();
  }));
  window.addEventListener('resize', layout);
  if (window.ResizeObserver) new ResizeObserver(layout).observe(track);
  layout();
}

/** scripts.js pins <html lang="en">; German copy needs lang="de" for `hyphens: auto`
 * (source hyphenates). Scoped override until the foundation derives lang per page. */
function contentLang(block) {
  const [, code] = window.location.pathname.match(/^\/([a-z]{2})(?:\/|$)/) || [];
  if (code && document.documentElement.lang !== code) block.lang = code;
}

export default async function decorate(block) {
  if (block.querySelector(':scope > .lane')) return;
  const groups = segment(block);

  const lane = el('div', 'lane');
  const inner = el('div', 'lane-inner');
  const head = el('div', 'container');
  head.innerHTML = `<div class="lane-head"><div class="lane-title"></div><div class="lane-nav">
    <button type="button" class="btn-icon lane-arrow" data-dir="-1" aria-label="vorige">${SVG_PREV}</button>
    <button type="button" class="btn-icon lane-arrow" data-dir="1" aria-label="nächsten">${SVG_NEXT}</button>
  </div></div>`;
  const holder = el('div');
  const slider = el('div', 'slider');
  const track = el('div', 'slider-track');
  groups.forEach((nodes, i) => {
    const slide = el('div', 'slide');
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-label', `${i + 1} / ${groups.length}`);
    slide.append(buildTeaser(nodes));
    track.append(slide);
  });
  const bar = el('div', 'slider-bar');
  bar.append(el('div', 'slider-thumb'));
  slider.append(track, bar);
  holder.append(slider);
  inner.append(head, holder);
  lane.append(inner);
  block.replaceChildren(lane);

  markBand(block);
  wireSlider(lane);
  contentLang(block);
}

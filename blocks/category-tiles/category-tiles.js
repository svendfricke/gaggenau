/**
 * category-tiles — the landing's appliance category grid: image tiles with a centred
 * label, 2 / 3 / 4 columns at < 720 / 720–1199 / >= 1200px. Prototype `.cats`
 * (stardust/prototypes/de-de-proposed.html). Decode tier: reconstructive (repeat group).
 *
 * Authoring: one row per tile —
 *   cell 1: the tile image
 *   cell 2: a paragraph holding the category link (its text is the tile label)
 * A flattened single-cell shape is segmented on the links (one tile per link, the
 * nearest preceding image is its picture).
 */

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

function filledSibling(node, dir) {
  let n = dir < 0 ? node.previousElementSibling : node.nextElementSibling;
  while (n && !n.children.length) n = dir < 0 ? n.previousElementSibling : n.nextElementSibling;
  return n;
}

function markBand(block) {
  const section = block.closest('.section');
  if (!section) return;
  const prev = filledSibling(section, -1);
  if (!prev || (!filledSibling(prev, -1) && prev.querySelector('.stage'))) block.classList.add('content-start');
  if (!filledSibling(section, 1)) block.classList.add('content-end');
}

function collect(block) {
  const nodes = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    [...cell.children].forEach((kid) => {
      if (kid.tagName === 'P' && kid.querySelector('picture, img') && kid.querySelector('a[href]')) {
        nodes.push(...kid.children);
      } else nodes.push(kid);
    });
  });
  return nodes;
}

/** scripts.js pins <html lang="en">; German copy needs lang="de" for `hyphens: auto`
 * (source hyphenates). Scoped override until the foundation derives lang per page. */
function contentLang(block) {
  const [, code] = window.location.pathname.match(/^\/([a-z]{2})(?:\/|$)/) || [];
  if (code && document.documentElement.lang !== code) block.lang = code;
}

export default async function decorate(block) {
  if (block.querySelector(':scope > .container')) return;
  const nodes = collect(block);

  const tiles = [];
  let pendingPic = null;
  nodes.forEach((n) => {
    const pic = n.matches('picture, img') ? n : n.querySelector('picture, img');
    const link = n.matches('a[href]') ? n : n.querySelector('a[href]');
    if (pic && !link) {
      pendingPic = pic;
      return;
    }
    if (link) {
      tiles.push({ pic: pendingPic, para: n.matches('p') ? n : null, link });
      pendingPic = null;
    }
  });

  const container = el('div', 'container');
  const inner = el('div', 'lane-inner');
  const grid = el('div', 'cats');
  tiles.forEach(({ pic, para, link }) => {
    const tile = el('a', 'cat');
    tile.href = link.href;
    const name = link.textContent.trim();
    if (name) tile.setAttribute('aria-label', name);
    if (pic) {
      const media = el('div', 'cat-media');
      media.append(pic);
      tile.append(media);
    }
    const label = el('div', 'cat-label');
    if (para) {
      label.append(para);
      // card-as-link (EW6): the authored paragraph stays, its inner anchor unwraps
      link.replaceWith(...link.childNodes);
    } else {
      label.append(...link.childNodes);
      link.remove();
    }
    tile.append(label);
    grid.append(tile);
  });
  inner.append(grid);
  container.append(inner);
  block.replaceChildren(container);
  markBand(block);
  contentLang(block);
}

/**
 * region-accordion — the store build's country selector (m-countryselectorlist
 * inside m-togglebox): one collapsible item per region, its countries as a
 * 1 / 2 / 3-column link grid. Behaviour (source .js-togglebox-toggle, prototype
 * js/region.js): a click on a title toggles .is-open on the title, the item and the
 * panel; the panel animates max-height over 400 ms (.is-in-transition) and then
 * rests at max-height: none (open) or 0 (closed). All items start closed.
 * Schema: stardust/eds-schema/index.json (m-countryselectorlist repeat group).
 * Decode tier: reconstructive (repeat group, classified by content).
 *
 * Authoring — one row per region (two cells; a DA-flattened single cell works too):
 *   | <p>Region name</p> | <ul><li><a href="…">Country</a></li>…</ul> |
 * A link-free <p> or a heading opens a region; every following list / link
 * paragraph belongs to it (order-agnostic segmentation, no rows[N]).
 *
 * EW7: the authored title <p> is MOVED into an in-page anchor a.togglebox-title (as
 * on the source; never a <button>, which cannot host the editor); the whole title
 * row takes the click handler (Enter on the focused anchor clicks it).
 */

const DURATION = 400;

function wrapNode(node, className, tag = 'div') {
  const w = document.createElement(tag);
  w.className = className;
  w.append(node);
  return w;
}

/* every authored element of every cell, in order */
function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      // HARNESS-ONLY fallback (EW5): text-only cell → its nodes moved into a <p>
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

const isTitle = (el) => /^H[1-6]$/.test(el.tagName)
  || (el.tagName === 'P' && !el.querySelector('a') && el.textContent.trim() !== '');

function segment(nodes) {
  const groups = [];
  let current = null;
  nodes.forEach((n) => {
    if (isTitle(n)) {
      current = { title: n, body: [] };
      groups.push(current);
    } else {
      if (!current) {
        current = { title: null, body: [] };
        groups.push(current);
      }
      current.body.push(n);
    }
  });
  return groups;
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setOpen(title, item, panel, open) {
  title.classList.toggle('is-open', open);
  item.classList.toggle('is-open', open);
  title.setAttribute('aria-expanded', String(open));
  if (panel.pendingEnd) panel.pendingEnd();

  if (reducedMotion()) {
    panel.classList.toggle('is-open', open);
    panel.style.maxHeight = '';
    return;
  }

  panel.style.maxHeight = open ? '0px' : `${panel.scrollHeight}px`;
  panel.classList.add('is-in-transition');
  if (open) panel.classList.add('is-open');
  // force the start value before animating to the end value
  panel.getBoundingClientRect();
  requestAnimationFrame(() => {
    panel.style.maxHeight = open ? `${panel.scrollHeight}px` : '0px';
  });

  let timer;
  let onEnd;
  const end = () => {
    clearTimeout(timer);
    panel.removeEventListener('transitionend', onEnd);
    panel.pendingEnd = null;
    panel.classList.remove('is-in-transition');
    if (!open) panel.classList.remove('is-open');
    panel.style.maxHeight = '';
  };
  onEnd = (e) => {
    if (e.target === panel && e.propertyName === 'max-height') end();
  };
  panel.addEventListener('transitionend', onEnd);
  timer = setTimeout(end, DURATION + 100);
  panel.pendingEnd = end;
}

export default function decorate(block) {
  const groups = segment(collectNodes(block));
  if (!groups.length) return;

  const blockIndex = [...document.querySelectorAll('.region-accordion')].indexOf(block);
  const box = document.createElement('div');
  box.className = 'togglebox';

  groups.forEach((g, i) => {
    const item = document.createElement('div');
    item.className = 'item';

    const panel = document.createElement('section');
    panel.className = 'togglebox-content';
    panel.id = `region-toggle-${blockIndex + 1}-${i + 1}`;
    const region = document.createElement('div');
    region.className = 'region';
    region.append(...g.body);
    panel.append(region);

    if (g.title) {
      // the source title is an in-page anchor (a.togglebox-title[href="#/Togglebox=…"])
      const title = wrapNode(g.title, 'togglebox-title', 'a');
      title.href = `#${panel.id}`;
      title.setAttribute('aria-expanded', 'false');
      title.setAttribute('aria-controls', panel.id);
      title.addEventListener('click', (e) => {
        e.preventDefault();
        setOpen(title, item, panel, !title.classList.contains('is-open'));
      });
      item.append(title);
    } else {
      // untitled leading content: nothing to toggle it with — render it open
      panel.classList.add('is-open');
    }
    item.append(panel);
    box.append(item);
  });

  block.replaceChildren(box);
}

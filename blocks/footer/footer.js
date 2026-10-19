import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * One footer block, two families, chosen from the authored footer document's structure:
 *   landing — the document holds a nested link list (column heads with their links)
 *   store   — flat lists only (social / navfooter / copyright links)
 * Authored nodes (links, images) are MOVED into the template, never rebuilt.
 */

const CHEV = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="chev" '
  + 'viewBox="0 0 24 24" fill="none"><path d="m11.99 17.72-9.99-9.99.73-.73 9.26 9.27 '
  + '9.26-9.27.73.73z" fill="currentColor"></path></svg>';

const TOTOP = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="totop-icon" '
  + 'fill="none" height="24" viewBox="0 0 24 24" width="24"><path d="m11.5919 6.692-4.73991 '
  + '4.752-.85199-.852 5.6039-5.592 5.6039 5.604-.852.852zm5.6039 10.536-5.6039-5.604-5.5919 '
  + '5.604.85199.852 4.75191-4.752 4.7519 4.752.852-.852z" fill="currentColor"></path></svg>';

const STORE_GLYPHS = [
  [/pinterest\./, 'icon-pinit2'],
  [/instagram\./, 'icon-instagram'],
  [/vimeo\./, 'icon-vimeo'],
];

function el(tag, className, ...children) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  children.filter(Boolean).forEach((c) => node.append(c));
  return node;
}

/** wraps a link's own text nodes in a span (the nodes move; nothing is re-created) */
function wrapLabel(a, className) {
  const span = el('span', className);
  [...a.childNodes].forEach((n) => span.append(n));
  a.append(span);
  return span;
}

/** icon-only link: its authored text becomes the accessible name */
function iconOnly(a) {
  a.setAttribute('aria-label', a.textContent.trim());
  a.textContent = '';
}

/** the direct link of a list item (the pipeline may wrap it in a <p>) */
function itemLink(li) {
  return li.querySelector(':scope > a, :scope > p > a');
}

function openInNewWindow(a) {
  a.target = '_blank';
  a.rel = 'noopener';
}

/* ---------------- store family ---------------- */

function buildStore(sections) {
  const [social, nav, links] = sections;
  const footer = el('div', 'o-footer');

  const follow = el('div', 'follow');
  const followList = el('ul');
  [...(social?.querySelectorAll('a') || [])].forEach((a) => {
    const glyph = STORE_GLYPHS.find(([re]) => re.test(a.hostname));
    iconOnly(a);
    const i = el('i', `icon ${glyph ? glyph[1] : ''}`.trim());
    i.setAttribute('aria-hidden', 'true');
    a.prepend(i);
    openInNewWindow(a);
    followList.append(el('li', '', a), ' ');
  });
  follow.append(followList);
  footer.append(el('div', 'footer-functions', follow));

  const navfooter = el('nav', 'navfooter');
  const navList = el('ul');
  [...(nav?.querySelectorAll('li') || [])].forEach((li, idx) => {
    const a = itemLink(li) || li.querySelector('a');
    if (!a) return;
    const item = el('li', idx === 0 ? 'group-header' : 'overview');
    if (idx === 0) {
      iconOnly(a);
      const i = el('i', 'icon icon-arrow-down');
      i.setAttribute('aria-hidden', 'true');
      a.prepend(i);
    } else {
      wrapLabel(a, 'text');
    }
    item.append(a);
    navList.append(item);
  });
  navfooter.append(navList);
  footer.append(el('div', 'footer-navwrap', navfooter, el('div', 'navfooter-spacer')));

  const copyright = el('div', 'copyright-links');
  const copyList = el('ul');
  [...(links?.querySelectorAll('a') || [])].forEach((a) => {
    wrapLabel(a, 'text');
    copyList.append(el('li', '', a), ' ');
  });
  copyright.append(copyList);
  footer.append(el('div', 'footer-links', copyright));
  return footer;
}

/* ---------------- landing family ---------------- */

function buildAccordion(columns) {
  const acc = el('div', 'ft-acc');
  const inner = el('div');
  columns.forEach((col, idx) => {
    inner.append(el('div', 'ft-acc-rule'));
    const head = col.querySelector('.ft-head');
    const btn = el('button', 'ft-acc-btn');
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', `ft-panel-${idx}`);
    const text = el('span', 'ft-acc-text');
    text.textContent = head ? head.textContent : '';
    btn.append(el('span', 'ft-acc-label', text));
    btn.insertAdjacentHTML('beforeend', CHEV);
    const panel = el('div', 'ft-acc-panel');
    panel.id = `ft-panel-${idx}`;
    panel.hidden = true;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      if (open && !panel.childElementCount) {
        // presentational copies of the column links (the columns stay the authored originals)
        const list = el('div', 'ft-col');
        col.querySelectorAll('.link').forEach((a) => {
          const copy = a.cloneNode(true);
          copy.querySelectorAll('[data-prose-index]').forEach((n) => n.removeAttribute('data-prose-index'));
          list.append(copy);
        });
        panel.append(list);
      }
      btn.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      panel.classList.toggle('is-open', open);
      if (open) panel.style.setProperty('--panel-h', `${panel.scrollHeight}px`);
    });
    inner.append(el('div', '', el('div', 'ft-acc-item', btn), panel));
  });
  inner.append(el('div', 'ft-acc-rule'));
  acc.append(inner);
  return acc;
}

function buildLanding(sections) {
  const [social, cols, legal, top] = sections;
  const footer = el('div', 'site-footer');
  const ft = el('div', 'ft');

  const icons = el('div', 'ft-icons');
  [...(social?.querySelectorAll('a') || [])].forEach((a) => {
    a.querySelectorAll('img').forEach((img) => img.classList.add('ft-icon'));
    if (a.title) a.setAttribute('aria-label', a.title);
    a.removeAttribute('title');
    openInNewWindow(a);
    icons.append(a);
  });
  const rule = el('div', 'ft-rule', el('div', 'ft-rule-a'), el('div', 'ft-rule-b'));
  ft.append(el('div', 'ft-social', rule, icons));

  const colsIn = el('div', 'ft-cols-in');
  const columns = [];
  const topList = cols?.querySelector('ul');
  [...(topList?.children || [])].forEach((li) => {
    const col = el('div', 'ft-col');
    const head = itemLink(li);
    if (head) {
      head.className = 'ft-head';
      col.append(head);
    }
    [...li.querySelectorAll(':scope > ul > li')].forEach((sub) => {
      const a = itemLink(sub) || sub.querySelector('a');
      if (!a) return;
      a.className = 'link';
      wrapLabel(a, 'link-label');
      col.append(a);
    });
    columns.push(col);
    colsIn.append(col);
  });
  ft.append(el('div', 'ft-cols', colsIn));
  ft.append(buildAccordion(columns));
  footer.append(ft);

  const legalLinks = el('div', 'legal-links');
  [...(legal?.querySelectorAll('a') || [])].forEach((a) => {
    a.className = 'link';
    wrapLabel(a, 'link-label');
    legalLinks.append(a);
  });
  footer.append(el('div', 'legal', el('div', 'copyright'), legalLinks));

  const totop = el('button', 'totop');
  totop.type = 'button';
  const label = top?.textContent.trim();
  if (label) totop.setAttribute('aria-label', label);
  totop.insertAdjacentHTML('beforeend', TOTOP);
  totop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  footer.append(el('div', 'totop-wrap', totop));
  return footer;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 * @ew-exempt all — chrome fragment; authored in /footer documents, not in page canvases
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  block.textContent = '';
  if (!fragment) return;

  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const landing = !!fragment.querySelector('li ul');
  block.classList.add(landing ? 'landing' : 'store');
  block.append(landing ? buildLanding(sections) : buildStore(sections));
}

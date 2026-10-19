import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * One header block, two families, chosen from the authored nav document's structure:
 *   landing — the document carries a nav list (section 2): marketing header, drawer menus
 *   store   — logo only (header.o-header)
 *
 * Landing nav document (sections, in order):
 *   1 brand   skip link (href="#…") + logo link (<a title="Homepage"><img alt></a>)
 *   2 nav     <ul>: trigger items (label + nested <ul> panel) and plain links; a panel's first
 *             link is its overview (heading) link, nested items may carry their own <ul>
 *   3 tools   <ul>: :menu: / :user: (+ nested <ul> account panel) / :search: / cart link (:cart:)
 *   4 drawer  <ul> of links shown above the nav items in the drawer (Home)
 *   5 drawer  <ul> of utility links (:location: / :arrow-right: icons) + country link paragraph
 *
 * Behaviour (stardust/chrome/header-contract-*.json + live probe): bar triggers and the burger
 * open ONE drawer on click / Enter (no hover menus on the source); desktop (>= 720px) grows a
 * 26rem column per level from the left, mobile drills down inside a 21.5rem drawer from the
 * right with a back button. Escape closes (focus returns), backdrop click closes, scroll locks.
 * The bar compacts once the page scrolls past 124px.
 */

const LABELS = {
  close: 'Navigationsmenü schließen',
  back: 'Zurück zur vorherigen Navigationsstufe',
  userClose: 'Benutzermenü schließen',
  searchClose: 'Schließen',
  searchClear: 'Leeren',
  searchAction: 'https://www.gaggenau.com/de/de/search',
};

const SVG = {
  menu: '<path d="m23.5 13.075h-23v-1.15h23zm0 3.45h-23v1.15h23zm0-9.19999h-23v1.15h23z" '
    + 'fill="currentColor"></path>',
  user: '<g fill="currentColor"><path d="m22 20.8h-.84v-.88c0-1.46-1-2.82-2.87-3.85-1.9518-.9747'
    + '-4.1085-1.4684-6.29-1.44-2.17442-.0093-4.31997.4979-6.26 1.48-.78679.3018-1.47251.8194'
    + '-1.97841 1.4933-.5059.674-.81146 1.4769-.88159 2.3167v.88h-.88v-.88c.05859-1.0033.40335'
    + '-1.9687.9935-2.7822.59014-.8134 1.40096-1.4408 2.3365-1.8078 2.06856-1.0383 4.35562'
    + '-1.5664 6.67-1.54 2.3078-.0247 4.588.5033 6.65 1.54 2.14 1.19 3.35 2.78 3.35 4.59z">'
    + '</path><path d="m12 12.28c-1.2306 0-2.41081-.4889-3.28098-1.359-.87016-.8702-1.35902'
    + '-2.0504-1.35902-3.281s.48886-2.41081 1.35902-3.28098c.87017-.87016 2.05038-1.35902 '
    + '3.28098-1.35902s2.4108.48886 3.281 1.35902c.8701.87017 1.359 2.05038 1.359 3.28098s'
    + '-.4889 2.4108-1.359 3.281c-.8702.8701-2.0504 1.359-3.281 1.359zm0-8.44c-.5148-.02643'
    + '-1.0295.05213-1.5129.23092-.4835.17878-.92548.45404-1.29917.80904-.3737.355-.67127'
    + '.78231-.8746 1.25593-.20334.47363-.3082.98368-.3082 1.49911s.10486 1.02548.3082 '
    + '1.49911c.20333.47362.5009.90089.8746 1.25589.37369.355.81567.6303 1.29917.8091.4834'
    + '.1788.9981.2573 1.5129.2309.5148.0264 1.0295-.0521 1.5129-.2309.4835-.1788.9255-.4541 '
    + '1.2992-.8091s.6712-.78227.8746-1.25589c.2033-.47363.3082-.98368.3082-1.49911s-.1049'
    + '-1.02548-.3082-1.49911c-.2034-.47362-.5009-.90093-.8746-1.25593s-.8157-.63026-1.2992'
    + '-.80904c-.4834-.17879-.9981-.25735-1.5129-.23092z"></path></g>',
  search: '<path d="m22.6346 21.8723-5.8916-5.8915c1.4049-1.59 2.2761-3.67 2.2761-5.9569 '
    + '0-4.9658-4.0403-9.00599-9.0062-9.00599-4.96595 0-8.99532 4.04019-8.99532 8.99519 0 '
    + '4.9549 4.04026 8.9951 8.99532 8.9951 2.2869 0 4.3669-.8603 5.9569-2.276l5.8916 '
    + '5.8915.7732-.7732zm-12.6217-3.9422c-4.3561 0-7.9063-3.5502-7.9063-7.9062 0-4.35596 '
    + '3.5502-7.91699 7.9063-7.91699s7.9063 3.55014 7.9063 7.90619c0 4.356-3.5502 7.9061'
    + '-7.9063 7.9061z" fill="currentColor"></path>',
  cart: '<path d="m7.99 21.74c-1.17 0-2.11-.95-2.11-2.11s.95-2.11 2.11-2.11 2.11.95 2.11 '
    + '2.11-.95 2.11-2.11 2.11zm0-3.42c-.72 0-1.31.59-1.31 1.31s.59 1.31 1.31 1.31 1.31-.59 '
    + '1.31-1.31-.59-1.31-1.31-1.31zm10.28 3.42c-1.16 0-2.11-.95-2.11-2.11s.95-2.11 2.11-2.11 '
    + '2.11.95 2.11 2.11-.95 2.11-2.11 2.11zm0-3.42c-.72 0-1.31.59-1.31 1.31s.59 1.31 1.31 '
    + '1.31 1.31-.59 1.31-1.31-.59-1.31-1.31-1.31zm-.55-2.47s-.03 0-.04 0h-9.06c-1.1 0-2.05'
    + '-.82-2.19-1.92l-1.3-9.87c-.08-.6-.59-1.05-1.2-1.06h-1.93v-1h1.93c1.11 0 2.05.83 2.19 '
    + '1.92l.31 2.36h15.02l-1.56 7.78c-.21 1.04-1.12 1.78-2.17 1.78zm-.03-1c.61 0 1.11-.4 '
    + '1.22-.98l1.32-6.59h-13.67l.86 6.51c.08.6.59 1.06 1.2 1.06z" fill="currentColor"></path>',
  close: '<path d="m21.98 2.95-.95-.95-9.04 9.05-9.04-9.05-.95.95 9.04 9.05-9.03 9.03.95.95 '
    + '9.03-9.04 9.03 9.04.95-.95-9.03-9.03z" fill="currentColor"></path>',
  chevron: '<path d="m7.72 21.98-.72-.73 9.26-9.26-9.26-9.26.72-.73 9.99 9.99z" '
    + 'fill="currentColor"></path>',
  'arrow-right': '<path d="m15.7666 5.89999-.9372.9372 4.488 4.48801h-16.1172v1.3332h16.1172'
    + 'l-4.488 4.488.9372.924 6.0852-6.0852z" fill="currentColor"></path>',
  'arrow-left': '<path d="m8.23343 5.89999.9372.9372-4.48799 4.48801h16.11716v1.3332h-16.11716'
    + 'l4.48799 4.488-.9372.924-6.08519-6.0852z" fill="currentColor"></path>',
  location: '<g fill="currentColor"><path d="m11.814 22-.24-.17c-.31-.22-7.57002-5.38-7.57002-11.58'
    + '-.03329-1.05562.14277-2.10738.51802-3.09461s.94227-1.89038 1.66834-2.65736c.72608-.766'
    + '98 1.59683-1.3826 2.56203-1.81134.9652-.42875 2.00573-.66213 3.06163-.68669 1.0506.024'
    + '66 2.0862.25609 3.0473.68108.9612.42499 1.8293 1.0352 2.5546 1.79577.7252.76057 1.2936'
    + ' 1.6566 1.6724 2.63688.3789.98029.5609 2.02562.5357 3.07627 0 6.2-7.26 11.36-7.57 11.5'
    + '8zm0-19.13c-1.9027.04717-3.70881.84785-5.0214 2.22607s-2.02427 3.22122-1.97862 5.12393'
    + 'c0 5.15 5.71002 9.75 7.00002 10.7 1.26-1 7-5.55 7-10.7.0456-1.90271-.6661-3.74571-1.97'
    + '86-5.12393-1.3126-1.37822-3.1187-2.1789-5.0214-2.22607z"></path><path d="m11.814 13.24'
    + 'c-.7765-.0285-1.5116-.3571-2.05059-.9166-.53903-.5596-.83996-1.3064-.83943-2.0834-.000'
    + '53-.77695.3004-1.52381.83943-2.08336.53899-.55955 1.27409-.88815 2.05059-.91664.7764.0'
    + '2849 1.5115.35709 2.0505.91664.5391.55955.84 1.30641.8395 2.08336.0005.777-.3004 1.523'
    + '8-.8395 2.0834-.539.5595-1.2741.8881-2.0505.9166zm0-5.19c-.55.031-1.0663.27484-1.4396.'
    + '67988s-.57429.93947-.56042 1.49012c-.01643.5513.18371 1.0872.55752 1.4928.3738.4056.89'
    + '16.6487 1.4425.6772.5508-.0285 1.0686-.2716 1.4424-.6772.3739-.4056.574-.9415.5576-1.4'
    + '928.0138-.55065-.1872-1.08508-.5605-1.49012s-.8896-.64888-1.4395-.67988z"></path></g>',
  clear: '<path d="m11.2 15.85 2.8-2.8 2.8 2.8 1.075-1.075-2.825-2.775 2.775-2.775-1.075-1.075'
    + '-2.75 2.8-2.8-2.8-1.075 1.075 2.825 2.775-2.825 2.775zm-8.2-3.85 4.225-5.975c.21667-.3'
    + '.475-.54583.775-.7375s.63333-.2875 1-.2875h10.5c.4167 0 .7708.14583 1.0625.4375s.4375'
    + '.64583.4375 1.0625v11c0 .4167-.1458.7708-.4375 1.0625s-.6458.4375-1.0625.4375h-10.5c'
    + '-.36667 0-.7-.0958-1-.2875s-.55833-.4375-.775-.7375zm1.85 0 3.9 5.5h10.75v-11h-10.75z" '
    + 'fill="currentColor"></path>',
};

function svg(name, className = 'icon') {
  const wrap = document.createElement('span');
  wrap.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="${className}" `
    + `viewBox="0 0 24 24" fill="none">${SVG[name] || ''}</svg>`;
  return wrap.firstElementChild;
}

function el(tag, className, ...children) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  children.filter(Boolean).forEach((c) => node.append(c));
  return node;
}

function button(className, label) {
  const b = el('button', className);
  b.type = 'button';
  if (label) b.setAttribute('aria-label', label);
  return b;
}

/** the authored icon name of a node (span.icon.icon-<name>), removing the span */
function takeIcon(node) {
  const span = node.querySelector('span.icon');
  if (!span) return null;
  const name = [...span.classList].find((c) => c.startsWith('icon-'))?.slice(5);
  span.remove();
  return name || null;
}

/** text of a list item without its nested lists */
function ownText(li) {
  return [...li.childNodes]
    .filter((n) => !(n.nodeType === 1 && /^(UL|OL)$/.test(n.tagName)))
    .map((n) => n.textContent)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function itemLink(li) {
  return li.querySelector(':scope > a, :scope > p > a, :scope > strong > a, :scope > p > strong > a');
}

const isWide = window.matchMedia('(min-width: 720px)');

/** the skip link sits before the banner (outside <header>), as on the source */
function placeSkip(block, link) {
  const host = block.closest('header');
  if (host) host.before(link);
  else block.append(link);
}

/* ---------------- store family ---------------- */

function buildStore(block, sections) {
  const brand = sections[0];
  const skip = brand?.querySelector('a[href^="#"]');
  const logoLink = [...(brand?.querySelectorAll('a') || [])].find((a) => a !== skip);
  const pic = brand?.querySelector('picture, img');
  const container = el('div', 'g-container');
  const head = el('div', 'o-header');
  const elements = el('div', 'header-elements');
  const logo = el('div', 'identifier-logo');
  if (logoLink) {
    if (pic && !logoLink.contains(pic)) {
      logoLink.textContent = '';
      logoLink.append(pic);
    }
    const img = logoLink.querySelector('img');
    if (img) {
      img.width = 148;
      img.height = 22;
      img.loading = 'eager';
      logoLink.setAttribute('aria-label', logoLink.title || img.alt);
    }
    logoLink.removeAttribute('title');
    logo.append(logoLink);
  }
  elements.append(logo);
  head.append(elements);
  container.append(head);
  if (skip) {
    skip.className = 'sr-only skip-to-content';
    placeSkip(block, skip);
  }
  block.append(container);
}

/* ---------------- landing family ---------------- */

function lockScroll(on) {
  document.body.style.overflow = on ? 'hidden' : '';
}

/** a drawer list item (link or level trigger) */
function drawerItem(source, level, onOpen) {
  const sub = source.querySelector(':scope > ul');
  const label = el('span', 'nd-label');
  if (sub) {
    const b = button(`nd-item nd-l${level}`);
    label.textContent = ownText(source);
    b.append(el('span', 'nd-text', label), svg('chevron', 'nd-chev'));
    b.setAttribute('aria-expanded', 'false');
    b.addEventListener('click', () => onOpen(b));
    return { node: b, sub };
  }
  const a = itemLink(source) || source.querySelector('a');
  if (!a) return null;
  const icon = takeIcon(a);
  const link = a.cloneNode(true);
  link.className = `nd-item nd-l${level}`;
  label.append(...link.childNodes);
  if (icon) link.append(svg(icon, 'nd-icon'));
  link.append(el('span', 'nd-text', label));
  return { node: link };
}

function buildLanding(block, sections) {
  const [brand, navSec, toolsSec, drawerTop, drawerFoot] = sections;
  const skip = brand?.querySelector('a[href^="#"]');
  const logoLink = [...(brand?.querySelectorAll('a') || [])].find((a) => a !== skip);

  const makeLogo = (eager) => {
    if (!logoLink) return null;
    const a = logoLink.cloneNode(true);
    a.className = 'hdr-home';
    a.setAttribute('aria-label', logoLink.title || 'Homepage');
    a.removeAttribute('title');
    const img = a.querySelector('img');
    if (img) {
      img.className = 'hdr-logo';
      img.loading = eager ? 'eager' : 'lazy';
      a.replaceChildren(img);
    }
    return a;
  };

  const header = el('div', 'site-header');
  const hdr = el('div', 'hdr');
  const brandRow = el('div', 'hdr-brand', el('div', 'hdr-cell'), makeLogo(true));
  const bar = el('div', 'hdr-bar');
  const left = el('div', 'hdr-left');
  const burgerL = button('btn-icon icon-btn');
  const burgerR = button('btn-icon icon-btn');
  const mini = el('div', 'hdr-mini', makeLogo(false));
  const nav = el('nav', 'hdr-nav');
  left.append(el('div', 'hdr-burger', burgerL), mini, el('div', 'hdr-cell', nav));
  bar.append(el('div', 'hdr-cell', left));
  const right = el('div', 'hdr-right');
  const actions = el('div', 'hdr-actions');
  right.append(el('div', 'hdr-search', el('div', 'hdr-search-in')), actions);
  bar.append(right);
  hdr.append(brandRow, bar);
  header.append(hdr);

  /* ----- drawer ----- */
  const drawer = el('div', 'nav-drawer');
  drawer.hidden = true;
  const backdrop = el('div', 'nd-backdrop');
  const ndNav = el('nav', 'nd');
  ndNav.setAttribute('aria-label', 'Navigation Menu');
  const track = el('div', 'nd-track');
  ndNav.append(track);
  drawer.append(backdrop, ndNav);

  const cols = [0, 1, 2].map((level) => {
    const col = el('div', 'nd-col');
    col.dataset.level = level;
    const top = el('div', 'nd-top');
    const body = el('div', 'nd-body');
    col.append(top, body);
    track.append(col);
    return { col, top, body };
  });
  const closeBtn = button('nd-close', LABELS.close);
  closeBtn.append(svg('close', 'nd-x'));
  cols[0].top.append(closeBtn);

  const state = { path: [], trigger: null };
  const panels = new Map(); // trigger button -> { level, list }

  const render = () => {
    const depth = state.path.length;
    drawer.dataset.depth = depth;
    cols.forEach(({ col, top, body }, i) => {
      if (i === 0) return;
      const owner = state.path[i - 1];
      const panel = owner && panels.get(owner).panel;
      col.hidden = !owner;
      top.replaceChildren(...(panel ? [panel.ndBack] : []));
      body.replaceChildren(...(panel ? [panel] : []));
    });
    track.style.setProperty('--nd-depth', depth);
    document.querySelectorAll('.nd-item[aria-expanded], .hdr-navlink[aria-expanded]')
      .forEach((b) => b.setAttribute('aria-expanded', String(state.path.includes(b)
        || state.path.includes(b.ndTwin))));
  };

  const close = () => {
    if (drawer.hidden) return;
    drawer.hidden = true;
    drawer.classList.remove('is-open');
    state.path = [];
    render();
    lockScroll(false);
    const back = state.trigger;
    state.trigger = null;
    if (back) back.focus();
  };

  const open = (trigger, path = []) => {
    state.trigger = trigger;
    state.path = path;
    drawer.hidden = false;
    drawer.classList.remove('is-open');
    requestAnimationFrame(() => requestAnimationFrame(() => drawer.classList.add('is-open')));
    lockScroll(true);
    render();
    const focusCol = cols[Math.min(path.length, 2)];
    const first = focusCol.body.querySelector('a, button') || closeBtn;
    first.focus({ preventScroll: true });
  };

  const openLevel = (btn) => {
    const { level } = panels.get(btn);
    state.path = [...state.path.slice(0, level), btn];
    render();
    const first = cols[level + 1].body.querySelector('a, button');
    if (first) first.focus({ preventScroll: true });
  };

  /** builds the panel for a trigger's nested list (level 1 or 2) */
  const buildPanel = (btn, list, level) => {
    const panel = el('div', 'nd-panel');
    const backRow = button('nd-back', LABELS.back);
    backRow.append(svg('arrow-left', 'nd-icon'), el('span', 'nd-back-text'));
    backRow.addEventListener('click', () => {
      state.path = state.path.slice(0, level - 1);
      render();
      btn.focus({ preventScroll: true });
    });
    panel.ndBack = backRow;
    const inner = el('div', 'nd-inner');
    const items = [...list.children];
    const head = items[0] && !items[0].querySelector('ul') ? items.shift() : null;
    if (head) {
      const h = drawerItem(head, 1, openLevel);
      if (h) {
        h.node.classList.add('nd-head');
        inner.append(h.node);
      }
    }
    const group = el('div', 'nd-list');
    items.forEach((li) => {
      const item = drawerItem(li, 2, openLevel);
      if (!item) return;
      group.append(item.node);
      if (item.sub) {
        panels.set(item.node, { level, panel: buildPanel(item.node, item.sub, level + 1) });
      }
    });
    inner.append(group);
    panel.append(inner);
    return panel;
  };

  // level 0 column: drawer-top links, the nav items, utility links, country
  const l0 = el('div', 'nd-list');
  const l0Items = [
    ...(drawerTop?.querySelectorAll(':scope ul > li') || []),
    ...(navSec?.querySelector('ul')?.children || []),
  ];
  const barItems = [...(navSec?.querySelector('ul')?.children || [])];
  l0Items.forEach((li) => {
    const item = drawerItem(li, 1, openLevel);
    if (!item) return;
    l0.append(item.node);
    if (item.sub) {
      panels.set(item.node, { level: 0, panel: buildPanel(item.node, item.sub, 1) });
    }
    item.node.ndSource = li;
  });
  cols[0].body.append(l0);
  const util = el('div', 'nd-list nd-util');
  [...(drawerFoot?.querySelectorAll('li') || [])].forEach((li) => {
    const item = drawerItem(li, 2, openLevel);
    if (item) util.append(item.node);
  });
  if (util.childElementCount) cols[0].body.append(util);
  const country = [...(drawerFoot?.querySelectorAll('p a') || [])].pop();
  if (country) {
    const c = country.cloneNode(true);
    c.className = 'nd-country-link';
    if (c.title) c.setAttribute('aria-label', c.title);
    c.removeAttribute('title');
    c.replaceChildren(el('span', 'nd-country-text', ...country.childNodes));
    cols[0].body.append(el('div', 'nd-country', c));
  }

  // the bar: triggers open the drawer at their level-1 panel
  const l0Buttons = [...l0.children];
  barItems.forEach((li) => {
    const twin = l0Buttons.find((b) => b.ndSource === li);
    const span = el('span');
    if (li.querySelector(':scope > ul')) {
      const b = button('hdr-navlink');
      b.textContent = ownText(li);
      b.setAttribute('aria-expanded', 'false');
      b.ndTwin = twin;
      b.addEventListener('click', () => open(b, twin ? [twin] : []));
      span.append(b);
    } else {
      const a = itemLink(li) || li.querySelector('a');
      if (!a) return;
      a.className = 'hdr-navlink';
      span.append(a);
    }
    nav.append(span);
  });

  // burgers
  [burgerL, burgerR].forEach((b) => {
    b.append(svg('menu'));
    b.addEventListener('click', () => open(b, []));
  });
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);

  /* ----- tools: user, search, cart ----- */
  let userBtn;
  let userPanel;
  let searchBtn;
  let search;
  [...(toolsSec?.querySelector('ul')?.children || [])].forEach((li) => {
    const a = itemLink(li);
    const icon = takeIcon(a || li);
    const label = (a ? a.textContent : ownText(li)).trim();
    if (icon === 'menu') {
      burgerL.setAttribute('aria-label', label);
      burgerR.setAttribute('aria-label', label);
    } else if (icon === 'user') {
      userBtn = button('btn-icon user-btn', label);
      userBtn.append(svg('user', 'user-icon'));
      userBtn.setAttribute('aria-expanded', 'false');
      userPanel = el('div', 'user-panel');
      userPanel.hidden = true;
      const userClose = button('up-close', LABELS.userClose);
      userClose.append(svg('close', 'nd-x'));
      const box = el('div', 'up-box');
      [...(li.querySelectorAll(':scope > ul > li') || [])].forEach((sub) => {
        const link = itemLink(sub) || sub.querySelector('a');
        if (!link) {
          const t = el('p', 'up-title');
          t.textContent = ownText(sub);
          box.append(t);
          return;
        }
        const strong = !!sub.querySelector('strong');
        link.className = strong ? 'up-button' : 'up-link';
        link.replaceChildren(el('span', 'up-text', ...link.childNodes));
        box.append(el('div', strong ? 'up-row up-cta' : 'up-row', link));
      });
      userPanel.append(el('div', 'up-top', userClose), box);
      const closeUser = (refocus) => {
        userPanel.hidden = true;
        userBtn.setAttribute('aria-expanded', 'false');
        lockScroll(false);
        if (refocus) userBtn.focus();
      };
      userBtn.addEventListener('click', () => {
        const opening = userPanel.hidden;
        if (!opening) {
          closeUser(false);
          return;
        }
        const r = userBtn.getBoundingClientRect();
        userPanel.style.setProperty('--up-right', `${window.innerWidth - r.right}px`);
        userPanel.style.setProperty('--up-top', `${r.bottom}px`);
        userPanel.hidden = false;
        userBtn.setAttribute('aria-expanded', 'true');
        lockScroll(!isWide.matches);
        const first = userPanel.querySelector('.up-box a');
        if (first) first.focus({ preventScroll: true });
      });
      userClose.addEventListener('click', () => closeUser(true));
      userPanel.closeUser = closeUser;
      actions.append(userBtn);
    } else if (icon === 'search') {
      searchBtn = button('btn-icon icon-btn', label);
      searchBtn.append(svg('search'));
      search = el('div', 'search-layer');
      search.hidden = true;
      const form = el('form', 'sl-form');
      form.action = LABELS.searchAction;
      form.method = 'get';
      form.setAttribute('role', 'search');
      const input = el('input', 'sl-input');
      input.type = 'search';
      input.name = 'term';
      input.placeholder = label;
      input.setAttribute('aria-label', label);
      input.autocomplete = 'off';
      const clear = button('sl-clear', LABELS.searchClear);
      clear.append(svg('clear', 'sl-icon'));
      clear.addEventListener('click', () => {
        input.value = '';
        input.focus();
      });
      const lead = el('span', 'sl-lead', svg('search', 'sl-icon'));
      form.append(el('span', 'sl-field', lead, input, clear));
      const closeSearch = button('sl-close', LABELS.searchClose);
      closeSearch.append(svg('close', 'nd-x sl-x'), svg('arrow-left', 'sl-back'));
      const logo = makeLogo(false);
      const row = el('div', 'sl-row', el('div', 'sl-logo', logo), el('div', 'sl-form-wrap', form));
      row.append(el('div', 'sl-close-wrap', closeSearch));
      const panel = el('div', 'sl-panel', row);
      const slBackdrop = el('div', 'sl-backdrop');
      search.append(slBackdrop, panel);
      const hideSearch = (refocus) => {
        search.hidden = true;
        lockScroll(false);
        if (refocus) searchBtn.focus();
      };
      searchBtn.addEventListener('click', () => {
        search.hidden = false;
        lockScroll(true);
        input.focus({ preventScroll: true });
      });
      closeSearch.addEventListener('click', () => hideSearch(true));
      slBackdrop.addEventListener('click', () => hideSearch(true));
      search.hideSearch = hideSearch;
      actions.append(searchBtn);
    } else if (a) {
      a.className = 'btn-icon icon-btn';
      a.setAttribute('aria-label', label);
      a.replaceChildren(svg(icon || 'cart'));
      actions.append(el('div', 'cart', el('div', 'cart-badge'), a));
    }
  });
  actions.append(el('div', 'hdr-burger-r', burgerR));

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!drawer.hidden) close();
    if (userPanel && !userPanel.hidden) userPanel.closeUser(true);
    if (search && !search.hidden) search.hideSearch(true);
  });

  /* ----- compact-on-scroll morph (landing.js) ----- */
  const compactAt = 124;
  const sync = () => {
    const compact = window.scrollY > compactAt;
    if (compact === header.classList.contains('is-compact')) return;
    header.classList.toggle('is-compact', compact);
    hdr.style.height = compact ? (isWide.matches && '4.5rem') || '3rem' : '';
  };
  window.addEventListener('scroll', sync, { passive: true });
  sync();

  if (skip) {
    const s = el('a', 'btn skip');
    s.href = skip.getAttribute('href');
    s.append(el('span', 'skip-label', ...skip.childNodes));
    placeSkip(block, s);
  }
  block.append(header, drawer);
  if (userPanel) block.append(userPanel);
  if (search) block.append(search);
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 * @ew-exempt all — chrome fragment; authored in /nav documents, not in page canvases
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  block.textContent = '';
  if (!fragment) return;

  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const landing = sections.length > 1 && !!sections[1].querySelector('ul');
  block.classList.add(landing ? 'landing' : 'store');

  // the skip link targets <main>
  const skipTarget = sections[0]?.querySelector('a[href^="#"]')?.getAttribute('href').slice(1);
  const main = document.querySelector('main');
  if (skipTarget && main && !main.id) main.id = skipTarget;

  if (landing) buildLanding(block, sections);
  else buildStore(block, sections);
}

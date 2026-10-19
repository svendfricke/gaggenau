/**
 * editorial-teaser — the landing's wide editorial teaser: media half (image, or a Vimeo
 * loop over a poster image) beside a text half that is one card link. Prototype `.ed`
 * (stardust/prototypes/de-de-proposed.html). Decode tier: template-slotted.
 *
 * Authoring (rows or one cell — decoded by querying):
 *   - the teaser image (the video poster when a video is present)
 *   - optional video: a Vimeo link (vimeo.com/<id> or player.vimeo.com/video/<id>) authored as
 *     DEFAULT CONTENT in the same section, before the block (David's Model D1 — a video URL is
 *     never a block cell; a link inside the block is still honoured as a fallback). The block
 *     reabsorbs it and renders the autoplay, muted, looping player over the poster (source
 *     behaviour, delivered as on the source).
 *   - title paragraph, description paragraph
 *   - a paragraph with the CTA link (its href is the card's target, its text the button label)
 *
 * @ew-exempt <p> Vimeo link — video source link (a)
 */

const PLAY_SVG = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="play-icon" viewBox="0 0 24 24" fill="none"><path d="M8.14999 5.978L18.0974 11.659L8.14999 17.3515V5.978ZM7 4V19.341L20.4204 11.6705L7 4Z" fill="currentColor"></path></svg>';

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

function markBand(block) {
  const section = block.closest('.section');
  if (!section) return;
  const prev = filledSibling(section, -1);
  if (!prev || (!filledSibling(prev, -1) && prev.querySelector('.stage'))) block.classList.add('content-start');
  if (!filledSibling(section, 1)) block.classList.add('content-end');
}

function vimeoId(href) {
  try {
    const u = new URL(href);
    if (!/(^|\.)vimeo\.com$/.test(u.hostname)) return null;
    const m = u.pathname.match(/(?:^|\/)(\d{5,})(?:\/|$)/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

/** scripts.js pins <html lang="en">; German copy needs lang="de" for `hyphens: auto`
 * (source hyphenates). Scoped override until the foundation derives lang per page. */
function contentLang(block) {
  const [, code] = window.location.pathname.match(/^\/([a-z]{2})(?:\/|$)/) || [];
  if (code && document.documentElement.lang !== code) block.lang = code;
}

export default async function decorate(block) {
  if (block.querySelector(':scope > .container')) return;

  const pictures = [...block.querySelectorAll('picture')];
  block.querySelectorAll('img').forEach((img) => {
    if (!img.closest('picture')) pictures.push(img);
  });
  const paras = [...block.querySelectorAll(':scope > div > div > :is(p, h1, h2, h3, h4, h5, h6, ul, ol)')]
    .filter((p) => !p.querySelector('picture, img') || p.textContent.trim());
  let video = null;
  let ctaP = null;
  const ratio0 = document.createDocumentFragment();
  // the section's leading default content carries the video link (reabsorbed, EW8)
  const lead = block.parentElement && block.parentElement.previousElementSibling;
  if (lead && lead.classList.contains('default-content-wrapper')) {
    const a = [...lead.querySelectorAll('a[href]')].find((x) => vimeoId(x.href));
    if (a) {
      video = { id: vimeoId(a.href), para: a.closest('p') || a };
      ratio0.append(video.para); // parked; moved into the player holder below
      if (!lead.children.length) lead.remove();
    }
  }
  const texts = [];
  paras.forEach((p) => {
    const a = p.querySelector('a[href]');
    if (a && vimeoId(a.href) && !video) {
      video = { id: vimeoId(a.href), para: p };
    } else if (a && !ctaP) {
      ctaP = p;
    } else if (p.textContent.trim()) {
      texts.push(p);
    }
  });
  const link = ctaP && ctaP.querySelector('a[href]');

  const container = el('div', 'container');
  const lane = el('div', 'lane');
  const ed = el('div', 'ed');

  const mediaWrap = el('span', 'ed-media');
  const box = el('div', 'media-box');
  const ratio = el('div', 'media-ratio');
  if (video) {
    const holder = el('div', 'ed-video');
    const frame = el('iframe', 'fill-frame');
    frame.src = `https://player.vimeo.com/video/${video.id}?dnt=1&preload=metadata&autoplay=1&muted=1&loop=1&controls=1`;
    frame.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
    frame.setAttribute('loading', 'lazy');
    holder.append(frame);
    // the authored link stays in the DOM (EW1 — moved, never dropped), hidden behind the
    // player it configures (CSS: .ed-video p { display: none })
    holder.append(video.para);
    ratio.append(holder);
  }
  if (pictures[0]) {
    const pic = wrapNode(pictures[0], 'teaser-pic');
    if (video) pic.classList.add('ed-poster');
    ratio.append(pic);
  }
  box.append(ratio);
  if (video) {
    const play = el('button', 'btn-icon ed-play');
    play.type = 'button';
    play.hidden = true;
    play.setAttribute('aria-label', 'Video abspielen');
    play.innerHTML = PLAY_SVG;
    box.append(play);
  }
  mediaWrap.append(box);

  const body = el('span', 'ed-body');
  const card = el('a', 'teaser-cta ed-link');
  if (link) card.href = link.href;
  const text = el('span', 'ed-text');
  const [title, ...descs] = texts;
  if (title) text.append(wrapNode(title, 'ed-title', 'span'));
  if (descs.length) {
    const d = el('span', 'ed-desc');
    d.append(...descs);
    text.append(d);
  }
  card.append(text);
  if (ctaP) {
    const btn = el('span', 'btn btn-tertiary');
    const label = el('span', 'btn-tertiary-label');
    label.append(ctaP);
    // card-as-link (EW6): the authored paragraph stays, its inner anchor unwraps
    link.replaceWith(...link.childNodes);
    btn.append(label);
    card.append(btn);
  }
  body.append(card);

  ed.append(mediaWrap, ' ', body);
  lane.append(ed);
  container.append(lane);
  block.replaceChildren(container);
  markBand(block);
  contentLang(block);
}

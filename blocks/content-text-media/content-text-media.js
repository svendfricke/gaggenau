/**
 * content-text-media — the store build's m-contenttextmedia module: a section title,
 * a rich-text body and (variant) a media slot.
 * Schema: stardust/eds-schema/general-legal.json (3 × m-contenttextmedia split:
 * heading + text). Decode tier: template-slotted (fixed composition, node-slotting).
 *
 * Authoring (one row, one cell — DA-flattened shape; multi-row tolerated):
 *   [<picture>]   optional media (first) → .media; the block gains `has-media`
 *   [<h1>]        optional document title the SOURCE does not render (store pages
 *                 have no visible h1): moved into a visually hidden wrapper so the
 *                 page keeps exactly one <h1>
 *   <h2>          section title → .heading
 *   <p>/<ul>/<ol> body (editorial <br>, <strong>, links) → .content .text
 *
 * Variants (block-name options → classes):
 *   split      heading row above a half-width text column (≥ 600px) — /general/legal
 *   has-media  set automatically when a picture is authored (index page '/'): media
 *              first, the heading moves INSIDE .content above .text (prototype
 *              index-proposed.html); `split` and `has-media` are independent hooks
 *
 * Links: the anchor's child nodes are moved into a span.link-text (presentation
 * refinement inside the authored element — the accent underline sits on the text,
 * the external glyph after it).
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const isMedia = (el) => el.matches('picture, img')
  || (el.tagName === 'P' && el.querySelector('picture, img') && !el.textContent.trim());

/* every authored element of every cell, in order (DA flattens rows to one cell) */
function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    let kids = [...cell.children];
    // wrapTextNodes folds a picture-led cell into one <p>: expand it back
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
        && kids[0].querySelector('picture, img') && kids[0].textContent.trim()) {
      kids = [...kids[0].childNodes].map((n) => {
        if (n.nodeType === 1) return n;
        // HARNESS-ONLY fallback (EW5): bare text node → moved into a fresh <p>
        if (n.textContent.trim()) {
          const p = document.createElement('p');
          p.append(n);
          return p;
        }
        return null;
      }).filter(Boolean);
    }
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

function decorateLinks(scope) {
  scope.querySelectorAll('a[href]').forEach((a) => {
    if (a.querySelector(':scope > .link-text') || a.querySelector('picture, img')) return;
    const span = document.createElement('span');
    span.className = 'link-text';
    span.append(...a.childNodes);
    a.append(span);
  });
}

export default function decorate(block) {
  const nodes = collectNodes(block);
  if (!nodes.length) return;

  const media = nodes.find(isMedia);
  const title = nodes.find((n) => n.tagName === 'H1');
  const heading = nodes.find((n) => /^H[2-6]$/.test(n.tagName));
  const body = nodes.filter((n) => n !== media && n !== title && n !== heading);

  const parts = [];
  if (title) parts.push(wrapNode(title, 'sr-only'));

  const hasMedia = Boolean(media);
  block.classList.toggle('has-media', hasMedia);
  if (media) parts.push(wrapNode(media, 'media'));

  const content = document.createElement('div');
  content.className = 'content';
  const headingWrap = heading ? wrapNode(heading, 'heading') : null;
  if (headingWrap) {
    if (hasMedia) content.append(headingWrap);
    else parts.push(headingWrap);
  }
  if (body.length) {
    const text = document.createElement('div');
    text.className = 'text';
    text.append(...body);
    decorateLinks(text);
    content.append(text);
  }
  parts.push(content);

  block.replaceChildren(...parts);
}

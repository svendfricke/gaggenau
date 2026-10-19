/**
 * content-teaser — the store build's m-contentteaser module: a short teaser
 * heading (and optional copy / CTA) in a half-width column (≥ 600px).
 * Schema: stardust/eds-schema/index.json (m-contentteaser: heading).
 * Decode tier: template-slotted (fixed composition, node-slotting).
 *
 * Authoring (one row, one cell — DA-flattened shape; multi-row tolerated):
 *   <h2>/<h3>      teaser heading → .content .heading (index page: <h3>, as on source)
 *   <p>/<ul>/<ol>  optional copy → .content .text (CTA paragraphs move with it)
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

/* every authored element of every cell, in order (DA flattens rows to one cell) */
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

export default function decorate(block) {
  const nodes = collectNodes(block);
  if (!nodes.length) return;

  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const body = nodes.filter((n) => n !== heading);

  const content = document.createElement('div');
  content.className = 'content';
  if (heading) content.append(wrapNode(heading, 'heading'));
  if (body.length) {
    const text = document.createElement('div');
    text.className = 'text';
    text.append(...body);
    content.append(text);
  }
  block.replaceChildren(content);
}

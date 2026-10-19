/**
 * page-title — the store build's m-pagetitle (m-hero > m-pagetitle > h1.a-heading):
 * a visible page title above the page's modules (e.g. /confirmation "Success").
 *
 * Authoring (one row, one cell): <h1> (the page's single h1). Any other authored
 * heading level is kept as is. DA-flattened shape tolerated.
 */
export default function decorate(block) {
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  if (!heading) return;
  heading.classList.add('page-title-heading');
  block.replaceChildren(heading);
}

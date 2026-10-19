// Country accordion (source: .js-togglebox-toggle): a click toggles .is-open
// on the title, the item and the panel; the panel animates max-height over
// 400 ms (.is-in-transition) and then rests at max-height: none.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.m-togglebox .togglebox-title').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      const open = !btn.classList.contains('is-open');
      btn.classList.toggle('is-open', open);
      btn.closest('.item')?.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      if (!panel) return;
      panel.style.maxHeight = open ? '0px' : `${panel.scrollHeight}px`;
      panel.classList.add('is-in-transition');
      if (open) panel.classList.add('is-open');
      requestAnimationFrame(() => {
        panel.style.maxHeight = open ? `${panel.scrollHeight}px` : '0px';
      });
      panel.addEventListener('transitionend', () => {
        panel.classList.remove('is-in-transition');
        if (!open) panel.classList.remove('is-open');
        panel.style.maxHeight = '';
      }, { once: true });
    });
  });
});

// Landing archetype behaviours observed on the source: compact header on
// scroll, the editorial slider lane, footer link accordions, scroll-to-top.
(() => {
  const header = document.querySelector('.site-header');
  const hdr = header && header.querySelector('.hdr');
  const compactAt = 124;
  const sync = () => {
    if (!header) return;
    const compact = window.scrollY > compactAt;
    if (compact === header.classList.contains('is-compact')) return;
    header.classList.toggle('is-compact', compact);
    const wide = window.matchMedia('(min-width: 720px)').matches;
    const desk = window.matchMedia('(min-width: 1200px)').matches;
    hdr.style.height = compact ? (desk || wide ? '4.5rem' : '3rem') : '';
  };
  window.addEventListener('scroll', sync, { passive: true });
  sync();

  document.querySelectorAll('.lane').forEach((lane) => {
    const slider = lane.querySelector('.slider');
    if (!slider) return;
    const track = slider.querySelector('.slider-track');
    const slides = [...track.children];
    const thumb = slider.querySelector('.slider-thumb');
    const arrows = lane.querySelectorAll('.lane-arrow');
    let index = 0;
    const layout = () => {
      const view = track.getBoundingClientRect().width;
      const step = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : view;
      const full = slides[slides.length - 1].offsetLeft + slides[slides.length - 1].offsetWidth;
      const maxShift = Math.max(0, full - view);
      const perView = Math.max(1, Math.round(view / step));
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
    arrows.forEach((b) => b.addEventListener('click', () => { index += Number(b.dataset.dir); index = Math.max(0, index); layout(); }));
    window.addEventListener('resize', layout);
    layout();
  });

  document.querySelectorAll('.ft-acc-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (open && !panel.childElementCount) {
        const col = document.querySelectorAll('.ft-cols .ft-col')[Number(panel.dataset.col)];
        const list = document.createElement('div');
        list.className = 'ft-col';
        col.querySelectorAll('.link').forEach((a) => list.append(a.cloneNode(true)));
        panel.append(list);
      }
      btn.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      panel.classList.toggle('is-open', open);
      if (open) panel.style.setProperty('--panel-h', `${panel.scrollHeight}px`);
    });
  });

  const top = document.querySelector('.totop');
  if (top) top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

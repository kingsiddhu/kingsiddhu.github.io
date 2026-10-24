(() => {
  const section = document.querySelector('#skills');
  if (!section) return;

  // Equal halves include the trailing gap, keeping the wrap seamless.
  section.querySelectorAll('.skill-track').forEach(track => {
    const set = track.querySelector('.skill-set');
    const originals = [...set.children];
    const fit = () => {
      track.querySelectorAll('.skill-set[aria-hidden]').forEach(copy => copy.remove());
      set.replaceChildren(...originals);
      // Fill wide screens before duplicating the full loop.
      while (set.getBoundingClientRect().width > 0 && set.getBoundingClientRect().width < track.parentElement.clientWidth) {
        originals.forEach(item => {
          const filler = item.cloneNode(true);
          filler.setAttribute('aria-hidden', 'true');
          set.append(filler);
        });
      }
      const copy = set.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      track.append(copy);
      track.style.setProperty('--duration', `${set.getBoundingClientRect().width / 26}s`);
    };
    fit();
    new ResizeObserver(fit).observe(track.parentElement);
  });

  section.classList.add('skills-ready');
})();

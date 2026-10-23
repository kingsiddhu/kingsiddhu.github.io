// Keep server selection independent of the canvas simulation.
(() => {
  const buttons = Array.from(document.querySelectorAll('#homelab [data-lab-target]'));
  if (!buttons.length) return;
  function selectServer(selected) {
    buttons.forEach(button => {
      const active = button === selected;
      button.setAttribute('aria-pressed', String(active));
      document.getElementById(button.dataset.labTarget).hidden = !active;
    });
  }
  buttons.forEach(button => button.addEventListener('click', () => selectServer(button)));
  selectServer(buttons[0]);
})();

(() => {
  'use strict';
  const canvas = document.getElementById('flock');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const slider = document.getElementById('cohesion');
  const toggle = document.getElementById('flock-toggle');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const modeToggle = document.getElementById('flock-mode');
  const twoD = document.getElementById('flock-2d');
  const threeD = document.getElementById('flock-3d');
  let is3D = false;
  let instructionsShown = false;
  let switching = false;
  async function fadePanel(panel, entering) {
    if (motion.matches) return;
    const animation = panel.animate(
      [{ opacity: entering ? 0 : 1 }, { opacity: entering ? 1 : 0 }],
      { duration: 180, easing: 'ease-in-out' }
    );
    await animation.finished;
  }
  let paused = motion.matches, visible = false, frame = null, last = 0, width = 1, height = 1;
  let birds = [], pointer = null;
  function seed() {
    birds = Array.from({length: 65}, () => {
      const angle = Math.random() * Math.PI * 2;
      return {x: Math.random() * width, y: Math.random() * height, vx: Math.cos(angle) * 1.6, vy: Math.sin(angle) * 1.6};
    });
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    birds.forEach((bird, i) => {
      ctx.save(); ctx.translate(bird.x, bird.y); ctx.rotate(Math.atan2(bird.vy, bird.vx));
      ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(-4, -3); ctx.lineTo(-2, 0); ctx.lineTo(-4, 3); ctx.closePath();
      ctx.fillStyle = i % 5 === 0 ? '#c9a96e' : '#99bbaa'; ctx.fill(); ctx.restore();
    });
  }
  function resize() {
    const box = canvas.getBoundingClientRect();
    const oldWidth = width, oldHeight = height;
    width = Math.max(1, box.width); height = Math.max(1, box.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    birds.forEach(b => { b.x *= width / oldWidth; b.y *= height / oldHeight; });
    if (!birds.length) seed();
    draw();
  }
  function step(dt) {
    const next = birds.map(b => {
      let cx = 0, cy = 0, ax = 0, ay = 0, sx = 0, sy = 0, count = 0;
      birds.forEach(other => {
        if (other === b) return;
        const dx = other.x - b.x, dy = other.y - b.y, distance = dx * dx + dy * dy;
        if (distance < 6400) { cx += dx; cy += dy; ax += other.vx; ay += other.vy; count++; }
        if (distance > 0 && distance < 625) { sx -= dx / distance; sy -= dy / distance; }
      });
      let vx = b.vx + sx * 1.3 * dt, vy = b.vy + sy * 1.3 * dt;
      if (count) {
        const pull = Number(slider.value) / 100 * .002;
        vx += (cx / count * pull + (ax / count - b.vx) * .025) * dt;
        vy += (cy / count * pull + (ay / count - b.vy) * .025) * dt;
      }
      if (pointer) {
        const dx = b.x - pointer.x, dy = b.y - pointer.y, d = Math.hypot(dx, dy);
        if (d > 0 && d < 100) { vx += dx / d * .2 * dt; vy += dy / d * .2 * dt; }
      }
      const speed = Math.hypot(vx, vy) || 1;
      const limit = Math.max(1.2, Math.min(2.8, speed));
      vx = vx / speed * limit; vy = vy / speed * limit;
      return {x: (b.x + vx * dt + width) % width, y: (b.y + vy * dt + height) % height, vx, vy};
    });
    birds = next;
  }
  function tick(time) {
    frame = null;
    if (is3D || paused || !visible || document.hidden) return;
    step(Math.min((time - (last || time)) / 16.667, 2)); last = time; draw();
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    toggle.textContent = paused ? 'Play simulation' : 'Pause simulation';
    toggle.setAttribute('aria-pressed', String(paused));
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null; last = 0;
    if (!is3D && !paused && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }
  modeToggle.hidden = false;
  modeToggle.addEventListener('click', async () => {
    if (switching) return;
    switching = true;
    modeToggle.setAttribute('aria-disabled', 'true');
    await fadePanel(is3D ? threeD : twoD, false);
    is3D = !is3D;
    twoD.hidden = is3D;
    threeD.hidden = !is3D;
    modeToggle.textContent = is3D ? 'Switch to 2D' : 'Switch to 3D';
    modeToggle.setAttribute('aria-pressed', String(is3D));
    pointer = null;
    sync();
    if (is3D) {
      // Do not create the browsing context or fetch the Godot export until requested.
      const iframe = document.createElement('iframe');
      iframe.title = '3D Boids flocking simulation';
      iframe.src = 'Boids/Boids.html';
      iframe.allow = 'autoplay; fullscreen';
      threeD.appendChild(iframe);
      const helpButton = document.createElement('button');
      helpButton.type = 'button';
      helpButton.className = 'flock-help';
      helpButton.textContent = 'Controls';
      helpButton.setAttribute('aria-expanded', 'false');
      helpButton.setAttribute('aria-controls', 'flock-instructions');
      threeD.appendChild(helpButton);
      function showInstructions() {
        if (threeD.querySelector('.flock-instructions')) return;
        const overlay = document.createElement('div');
        overlay.id = 'flock-instructions';
        overlay.className = 'flock-instructions';
        overlay.setAttribute('role', 'region');
        overlay.setAttribute('aria-labelledby', 'flock-instructions-title');
        overlay.innerHTML = `
          <div class="flock-instructions-card">
            <h3 id="flock-instructions-title">Explore the 3D flock</h3>
            <ul>
              <li><b>WASD</b> — movement in view</li>
              <li><b>R</b> — Reset</li>
              <li>Hold <b>Left click</b> and move to rotate</li>
              <li><b>Scroll</b> to scroll</li>
            </ul>
            <button type="button">Got it — enter simulation</button>
          </div>`;
        iframe.inert = true;
        helpButton.setAttribute('aria-expanded', 'true');
        const dismiss = () => {
          overlay.remove();
          iframe.inert = false;
          helpButton.setAttribute('aria-expanded', 'false');
          helpButton.focus();
        };
        const dismissButton = overlay.querySelector('button');
        dismissButton.addEventListener('click', dismiss);
        overlay.addEventListener('keydown', event => {
          if (event.key === 'Escape') dismiss();
        });
        threeD.appendChild(overlay);
        dismissButton.focus();
      }
      helpButton.addEventListener('click', showInstructions);
      if (!instructionsShown) {
        instructionsShown = true;
        showInstructions();
      }
    } else {
      // Removing the frame tears down its engine and stops its animation/audio.
      threeD.replaceChildren();
      resize();
    }
    await fadePanel(is3D ? threeD : twoD, true);
    switching = false;
    modeToggle.removeAttribute('aria-disabled');
  });
  toggle.addEventListener('click', () => { paused = !paused; sync(); });
  document.getElementById('flock-reset').addEventListener('click', () => { seed(); draw(); });
  slider.addEventListener('input', () => { document.getElementById('cohesion-value').textContent = `${slider.value}%`; });
  canvas.addEventListener('pointermove', event => { const r = canvas.getBoundingClientRect(); pointer = {x: event.clientX - r.left, y: event.clientY - r.top}; });
  canvas.addEventListener('pointerleave', () => { pointer = null; });
  canvas.addEventListener('pointerup', event => { if (event.pointerType !== 'mouse') pointer = null; });
  motion.addEventListener('change', event => { if (event.matches) { paused = true; sync(); } });
  document.addEventListener('visibilitychange', sync);
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(canvas);
  resize(); sync();
})();

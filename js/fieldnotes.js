(() => {
  'use strict';
  const canvas = document.getElementById('flock');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const slider = document.getElementById('cohesion');
  const toggle = document.getElementById('flock-toggle');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
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
    if (paused || !visible || document.hidden) return;
    step(Math.min((time - (last || time)) / 16.667, 2)); last = time; draw();
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    toggle.textContent = paused ? 'Play simulation' : 'Pause simulation';
    toggle.setAttribute('aria-pressed', String(paused));
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null; last = 0;
    if (!paused && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }
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

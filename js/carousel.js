const TOTAL = document.getElementById('titleTrack').children.length;

// Per-track state
const state = { title: 0, body: 0, image: 0 };

// Elements
const clips  = {
  title: document.getElementById('titleClip'),
  body:  document.getElementById('bodyClip'),
  image: document.getElementById('imageClip'),
};
const strips = {
  title: document.getElementById('titleTrack'),
  body:  document.getElementById('bodyTrack'),
  image: document.getElementById('imageTrack'),
};

const counter  = document.getElementById('counter');
const dotsWrap = document.getElementById('indicators');

// Build dots
for (let i = 0; i < TOTAL; i++) {
  const d = document.createElement('button');
  d.type = 'button';
  d.className = 'dot' + (i === 0 ? ' active' : '');
  d.setAttribute('aria-label', `Slide ${i + 1}`);
  d.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(d);
}

// Move a single track to index i using px (avoids % resolving on wrong element)
function moveTo(name, i) {
  const idx = ((i % TOTAL) + TOTAL) % TOTAL;

  state[name] = idx;
  const w = clips[name].getBoundingClientRect().width;   // width of the clipping box
  strips[name].style.transform = `translateX(${-idx * w}px)`;
}

let activeTracks = ['title', 'body', 'image'];

function goTo(idx) {
  activeTracks.forEach(t => moveTo(t, idx));
  updateUI();
}

function step(dir=1) {
  const ref = activeTracks[0];
  const next = ((state[ref] + dir) + TOTAL) % TOTAL;
  activeTracks.forEach(t => moveTo(t, next));
  updateUI();
}

function updateUI() {
  const ref = state[activeTracks[0]];
  dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === ref);
    d.setAttribute('aria-current', String(i === ref));
  });
  Object.entries(strips).forEach(([name, strip]) => {
    Array.from(strip.children).forEach((slide, i) => {
      slide.setAttribute('aria-hidden', String(i !== state[name]));
      slide.inert = i !== state[name];
    });
  });
  counter.textContent = String(ref + 1).padStart(2, '0') + ' / ' + String(TOTAL).padStart(2, '0');
}

document.getElementById('prevBtn').addEventListener('click', () => step(-1));
document.getElementById('nextBtn').addEventListener('click', () => step(1));

// Chips
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => {
      c.classList.remove('locked');
      c.setAttribute('aria-pressed', String(c === chip));
    });
    chip.classList.add('locked');
    const t = chip.dataset.track;
    const current = state[activeTracks[0]];
    activeTracks = t === 'all' ? ['title','body','image'] : [t];
    if (t === 'all') goTo(current);
    else updateUI();
  });
});

// Keyboard
document.querySelector('.carousel-wrapper').addEventListener('keydown', e => {
  if (e.target.matches('input, textarea, select')) return;
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.preventDefault();
  if (e.key === 'ArrowLeft')  step(-1);
  if (e.key === 'ArrowRight') step(1);
});

// Re-snap on resize (px translation needs recalculating)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // disable transition briefly so re-snap is instant
    Object.values(strips).forEach(s => s.style.transition = 'none');
    ['title','body','image'].forEach(t => moveTo(t, state[t]));
    requestAnimationFrame(() => {
      Object.values(strips).forEach(s => s.style.transition = '');
    });
  }, 50);
});

document.querySelectorAll('.chip').forEach(chip => {
  chip.setAttribute('aria-pressed', String(chip.dataset.track === 'all'));
});
updateUI();

// Keep projects stationary so visitors can read and inspect source links.

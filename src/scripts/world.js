const root = document.documentElement;
const body = document.body;
const frontPanel = document.querySelector('[data-world-panel="front"]');
const archivePanel = document.querySelector('[data-world-panel="archive"]');

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

function setPanelAccessibility(world) {
  const isArchive = world === 'archive';
  frontPanel.setAttribute('aria-hidden', String(isArchive));
  archivePanel.setAttribute('aria-hidden', String(!isArchive));
}

export async function switchWorld(world, options = {}) {
  if (root.dataset.world === world) return;

  body.classList.add('is-crossing', 'is-locked');
  if (!reducedMotion) await wait(620);

  root.dataset.world = world;
  setPanelAccessibility(world);
  document.querySelector('meta[name="theme-color"]').content = world === 'archive' ? '#0b0808' : '#eee9df';
  document.title = world === 'archive' ? '档案 091｜不要回头' : '猩红剧团｜Crimson Troupe';
  const cleanUrl = window.location.href.split('#')[0];
  history.replaceState(null, '', world === 'archive' ? `${cleanUrl}#archive-091` : cleanUrl);
  window.scrollTo({ top: 0, behavior: 'auto' });

  await wait(reducedMotion ? 10 : 440);
  body.classList.remove('is-crossing', 'is-locked');

  const focusTarget = world === 'archive'
    ? document.querySelector('.archive-exit')
    : document.querySelector('.brand');
  if (!options.skipFocus) focusTarget?.focus({ preventScroll: true });
}

export function initWorld() {
  document.querySelectorAll('[data-enter-archive]').forEach((button) => {
    button.addEventListener('click', () => switchWorld('archive'));
  });

  document.querySelectorAll('[data-exit-archive]').forEach((button) => {
    button.addEventListener('click', () => switchWorld('front'));
  });

  if (window.location.hash === '#archive-091') {
    root.dataset.world = 'archive';
    setPanelAccessibility('archive');
    document.title = '档案 091｜不要回头';
    document.querySelector('meta[name="theme-color"]').content = '#0b0808';
  } else {
    setPanelAccessibility('front');
  }

  document.addEventListener('keydown', (event) => {
    const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
    if (!typing && event.shiftKey && event.key.toLowerCase() === 'd') {
      switchWorld(root.dataset.world === 'archive' ? 'front' : 'archive');
    }
  });
}

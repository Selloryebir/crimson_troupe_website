import { query, queryAll } from './dom';

export type World = 'front' | 'archive';

interface SwitchWorldOptions {
  skipFocus?: boolean;
}

const root = document.documentElement;
const body = document.body;
const frontPanel = query<HTMLElement>('[data-world-panel="front"]');
const archivePanel = query<HTMLElement>('[data-world-panel="archive"]');
const themeMeta = query<HTMLMetaElement>('meta[name="theme-color"]');

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

function setPanelAccessibility(world: World) {
  const isArchive = world === 'archive';
  frontPanel.setAttribute('aria-hidden', String(isArchive));
  archivePanel.setAttribute('aria-hidden', String(!isArchive));
}

function currentWorld(): World {
  return root.dataset.world === 'archive' ? 'archive' : 'front';
}

export async function switchWorld(world: World, options: SwitchWorldOptions = {}) {
  if (currentWorld() === world) {
    return;
  }

  body.classList.add('is-crossing', 'is-locked');
  if (!reducedMotion) {
    await wait(620);
  }

  root.dataset.world = world;
  setPanelAccessibility(world);
  themeMeta.content = world === 'archive' ? '#0b0808' : '#eee9df';
  document.title = world === 'archive' ? '档案 091｜不要回头' : '猩红剧团｜Crimson Troupe';
  const cleanUrl = window.location.href.split('#')[0];
  window.history.replaceState(null, '', world === 'archive' ? `${cleanUrl}#archive-091` : cleanUrl);
  window.scrollTo({ top: 0, behavior: 'auto' });

  await wait(reducedMotion ? 10 : 440);
  body.classList.remove('is-crossing', 'is-locked');

  const focusTarget = query<HTMLElement>(world === 'archive' ? '.archive-exit' : '.brand');
  if (!options.skipFocus) {
    focusTarget.focus({ preventScroll: true });
  }
}

export function initWorld() {
  queryAll<HTMLButtonElement>('[data-enter-archive]').forEach((button) => {
    button.addEventListener('click', () => void switchWorld('archive'));
  });

  queryAll<HTMLButtonElement>('[data-exit-archive]').forEach((button) => {
    button.addEventListener('click', () => void switchWorld('front'));
  });

  if (window.location.hash === '#archive-091') {
    root.dataset.world = 'archive';
    setPanelAccessibility('archive');
    document.title = '档案 091｜不要回头';
    themeMeta.content = '#0b0808';
  } else {
    setPanelAccessibility('front');
  }

  document.addEventListener('keydown', (event) => {
    const activeTag = document.activeElement?.tagName;
    const typing = activeTag !== undefined && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag);
    if (!typing && event.shiftKey && event.key.toLowerCase() === 'd') {
      void switchWorld(currentWorld() === 'archive' ? 'front' : 'archive');
    }
  });
}

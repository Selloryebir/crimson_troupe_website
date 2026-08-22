import {
  advancePollution,
  createPollutionState,
  MAX_POLLUTION_LEVEL,
  parsePollutionState,
  type PollutionState,
  type PollutionTrigger,
  type PollutionVariant,
} from './pollution-state.ts';

const STATE_KEY = 'crimson-troupe:archive-pollution:v2';
const PENDING_KEY = 'crimson-troupe:archive-navigation:v2';
const PENDING_LIFETIME_MS = 30_000;

interface PendingNavigation {
  targetPath: string;
  expiresAt: number;
}

function randomVariant(): PollutionVariant {
  try {
    const value = new Uint8Array(1);
    crypto.getRandomValues(value);
    return (value[0] % 3) as PollutionVariant;
  } catch {
    return Math.floor(Math.random() * 3) as PollutionVariant;
  }
}

function getSessionStorage(): Storage | null {
  try {
    const probe = `${STATE_KEY}:probe`;
    sessionStorage.setItem(probe, '1');
    sessionStorage.removeItem(probe);
    return sessionStorage;
  } catch {
    return null;
  }
}

function readState(storage: Storage | null): PollutionState {
  if (!storage) {
    return createPollutionState();
  }
  return parsePollutionState(storage.getItem(STATE_KEY), randomVariant());
}

function hasStoredState(storage: Storage | null): boolean {
  if (!storage) {
    return false;
  }
  try {
    return storage.getItem(STATE_KEY) !== null;
  } catch {
    return false;
  }
}

function writeState(storage: Storage | null, state: PollutionState): void {
  if (!storage) {
    return;
  }
  try {
    storage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    // The archive remains usable at level 0 when tab storage is unavailable.
  }
}

function clearState(storage: Storage | null): void {
  document.documentElement.removeAttribute('data-pollution-level');
  document.documentElement.removeAttribute('data-pollution-variant');
  if (!storage) {
    return;
  }
  try {
    storage.removeItem(STATE_KEY);
    storage.removeItem(PENDING_KEY);
  } catch {
    // Clearing is best-effort; front-site rendering never reads the archive state.
  }
}

function applyState(state: PollutionState): void {
  const previousLevel = document.documentElement.dataset.pollutionLevel;
  document.documentElement.dataset.pollutionLevel = String(state.level);
  document.documentElement.dataset.pollutionVariant = String(state.variant);
  document.querySelectorAll<HTMLElement>('[data-archive-projection]').forEach((projection) => {
    projection.hidden = state.level !== MAX_POLLUTION_LEVEL;
  });
  const status = document.querySelector<HTMLElement>('[data-archive-projection-status]');
  const projection = document.querySelector<HTMLElement>('[data-archive-projection]');
  if (status) {
    status.textContent =
      state.level === MAX_POLLUTION_LEVEL && previousLevel !== String(MAX_POLLUTION_LEVEL)
        ? (projection?.dataset.projectionAnnouncement ?? '')
        : '';
  }
}

function requestTransition(storage: Storage | null, trigger: PollutionTrigger): PollutionState {
  if (!storage) {
    return createPollutionState();
  }
  const current = readState(storage);
  const transition = advancePollution(current, trigger, Math.random);
  writeState(storage, transition.state);
  return transition.state;
}

function markPending(storage: Storage | null, targetPath: string): void {
  if (!storage) {
    return;
  }
  const pending: PendingNavigation = {
    targetPath,
    expiresAt: Date.now() + PENDING_LIFETIME_MS,
  };
  try {
    storage.setItem(PENDING_KEY, JSON.stringify(pending));
  } catch {
    // A missing marker may reduce deduplication, but must never block navigation.
  }
}

function consumePending(storage: Storage | null, currentPath: string): boolean {
  if (!storage) {
    return false;
  }
  try {
    const rawValue = storage.getItem(PENDING_KEY);
    storage.removeItem(PENDING_KEY);
    if (!rawValue) {
      return false;
    }
    const pending = JSON.parse(rawValue) as Partial<PendingNavigation>;
    return (
      pending.targetPath === currentPath &&
      typeof pending.expiresAt === 'number' &&
      pending.expiresAt >= Date.now()
    );
  } catch {
    return false;
  }
}

function isPlainCurrentTabClick(event: MouseEvent, anchor: HTMLAnchorElement): boolean {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    (!anchor.target || anchor.target === '_self') &&
    !anchor.hasAttribute('download')
  );
}

function getNavigationType(): PerformanceNavigationTiming['type'] | 'navigate' {
  try {
    const entry = performance.getEntriesByType('navigation')[0] as
      PerformanceNavigationTiming | undefined;
    return entry?.type ?? 'navigate';
  } catch {
    return 'navigate';
  }
}

export function shouldRequestArchiveEntry(
  pendingNavigation: boolean,
  navigationType: PerformanceNavigationTiming['type'] | 'navigate',
  storedStateExists: boolean,
): boolean {
  if (pendingNavigation || navigationType === 'reload') {
    return false;
  }
  return navigationType === 'navigate' || (navigationType === 'back_forward' && !storedStateExists);
}

export function initPollutionController(): void {
  const root = document.documentElement;
  const world = root.dataset.world;
  const storage = getSessionStorage();

  if (world === 'front') {
    clearState(storage);
    document.addEventListener(
      'click',
      (event) => {
        if (!(event instanceof MouseEvent)) {
          return;
        }
        const anchor =
          event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a') : null;
        if (
          !anchor ||
          anchor.dataset.worldSwitch !== 'archive' ||
          !isPlainCurrentTabClick(event, anchor)
        ) {
          return;
        }
        const target = new URL(anchor.href, window.location.href);
        requestTransition(storage, 'front-entry');
        markPending(storage, target.pathname);
      },
      { capture: true },
    );
    return;
  }

  if (world !== 'archive') {
    return;
  }

  const pendingNavigation = consumePending(storage, window.location.pathname);
  const navigationType = getNavigationType();
  const initialState = shouldRequestArchiveEntry(
    pendingNavigation,
    navigationType,
    hasStoredState(storage),
  )
    ? requestTransition(storage, 'direct-entry')
    : readState(storage);
  applyState(initialState);

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      const restoredState = shouldRequestArchiveEntry(
        false,
        'back_forward',
        hasStoredState(storage),
      )
        ? requestTransition(storage, 'direct-entry')
        : readState(storage);
      applyState(restoredState);
    }
  });

  document.addEventListener(
    'click',
    (event) => {
      if (!(event instanceof MouseEvent)) {
        return;
      }
      const anchor =
        event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a') : null;
      if (!anchor || !isPlainCurrentTabClick(event, anchor)) {
        return;
      }

      if (anchor.dataset.worldSwitch === 'front') {
        clearState(storage);
        return;
      }

      const target = new URL(anchor.href, window.location.href);
      const isSameOriginArchive =
        target.origin === window.location.origin &&
        /^\/[^/]+\/archive\/site\/1091\//.test(target.pathname);
      const isSameDocument =
        target.pathname === window.location.pathname && target.search === window.location.search;
      if (!isSameOriginArchive || isSameDocument) {
        return;
      }

      const trigger: PollutionTrigger = anchor.hasAttribute('data-locale-switch')
        ? 'archive-locale'
        : 'archive-navigation';
      requestTransition(storage, trigger);
      markPending(storage, target.pathname);
    },
    { capture: true },
  );

  document.addEventListener('crimson:archive-search-submit', () => {
    applyState(requestTransition(storage, 'archive-search'));
  });
}

import { currentArchiveSnapshot } from '../data/archive-snapshots.ts';
import {
  advancePollution,
  createPollutionState,
  derivePollutionComposition,
  MAX_POLLUTION_LEVEL,
  parsePollutionState,
  POLLUTION_STATE_STORAGE_KEY,
  type PollutionLevel,
  type PollutionState,
  type PollutionTransition,
  type PollutionTrigger,
  type PollutionVariant,
} from './pollution-state.ts';

const PENDING_KEY = 'crimson-troupe:archive-navigation:v2';
const PENDING_LIFETIME_MS = 30_000;
const PROJECTION_PRELOAD_DELAY_MS = 1_200;

interface PendingNavigation {
  targetPath: string;
  expiresAt: number;
  announcementLevel?: PollutionLevel;
}

interface ConsumedNavigation {
  matched: boolean;
  announcementLevel?: PollutionLevel;
}

interface ProjectionPreloader {
  apply(state: PollutionState): void;
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
    const probe = `${POLLUTION_STATE_STORAGE_KEY}:probe`;
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
  return parsePollutionState(storage.getItem(POLLUTION_STATE_STORAGE_KEY), randomVariant());
}

function hasStoredState(storage: Storage | null): boolean {
  if (!storage) {
    return false;
  }
  try {
    return storage.getItem(POLLUTION_STATE_STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

function writeState(storage: Storage | null, state: PollutionState): void {
  if (!storage) {
    return;
  }
  try {
    storage.setItem(POLLUTION_STATE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The archive remains usable at level 0 when tab storage is unavailable.
  }
}

function clearState(storage: Storage | null): void {
  document.documentElement.removeAttribute('data-pollution-level');
  document.documentElement.removeAttribute('data-pollution-variant');
  document.documentElement.removeAttribute('data-pollution-composition');
  const status = document.querySelector<HTMLElement>('[data-pollution-status]');
  if (status) {
    status.textContent = '';
  }
  if (!storage) {
    return;
  }
  try {
    storage.removeItem(POLLUTION_STATE_STORAGE_KEY);
    storage.removeItem(PENDING_KEY);
  } catch {
    // Clearing is best-effort; front-site rendering never reads the archive state.
  }
}

function applyState(state: PollutionState): void {
  const root = document.documentElement;
  const level = String(state.level);
  const variant = String(state.variant);
  const composition = String(
    derivePollutionComposition(state, root.dataset.pageType ?? 'archive', window.location.pathname),
  );
  if (root.dataset.pollutionLevel !== level) {
    root.dataset.pollutionLevel = level;
  }
  if (root.dataset.pollutionVariant !== variant) {
    root.dataset.pollutionVariant = variant;
  }
  if (root.dataset.pollutionComposition !== composition) {
    root.dataset.pollutionComposition = composition;
  }
}

function createProjectionPreloader(root: HTMLElement): ProjectionPreloader {
  const posters = [...document.querySelectorAll<HTMLElement>('[data-archive-projection-poster]')];
  let started = false;
  let scheduled = false;
  let observer: IntersectionObserver | undefined;

  const updateProgressiveState = () => {
    if (posters.every((poster) => poster.hasAttribute('data-archive-projection-ready'))) {
      root.removeAttribute('data-pollution-projection-progressive');
      observer?.disconnect();
    }
  };

  const prepare = async (poster: HTMLElement) => {
    if (poster.hasAttribute('data-archive-projection-ready')) {
      return;
    }
    const image = poster.querySelector<HTMLImageElement>(
      '.archive-projection-level3.archive-poster__image',
    );
    if (!image) {
      poster.setAttribute('data-archive-projection-ready', '');
      updateProgressiveState();
      return;
    }

    image.loading = 'eager';
    try {
      await image.decode();
      poster.setAttribute('data-archive-projection-ready', '');
      updateProgressiveState();
    } catch {
      // Keep the readable source poster if the optional projection cannot be decoded.
    }
  };

  const start = () => {
    if (started || posters.length === 0) {
      return;
    }
    started = true;
    if (!('IntersectionObserver' in window)) {
      for (const poster of posters) {
        poster.setAttribute('data-archive-projection-ready', '');
      }
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }
          observer?.unobserve(entry.target);
          void prepare(entry.target as HTMLElement);
        }
      },
      { rootMargin: '100% 0px' },
    );
    for (const poster of posters) {
      observer.observe(poster);
    }
  };

  const schedule = () => {
    if (scheduled || started || posters.length === 0) {
      return;
    }
    scheduled = true;
    const defer = () => {
      window.setTimeout(start, PROJECTION_PRELOAD_DELAY_MS);
    };
    if (document.readyState === 'complete') {
      defer();
    } else {
      window.addEventListener('load', defer, { once: true });
    }
  };

  return {
    apply(state) {
      const enteringLevel3 = root.dataset.pollutionLevel !== '3' && state.level === 3;
      if (enteringLevel3) {
        start();
      } else if (state.level === 2) {
        schedule();
      }
      if (enteringLevel3 && observer) {
        root.setAttribute('data-pollution-projection-progressive', '');
      }
      applyState(state);
      updateProgressiveState();
    },
  };
}

function announcePollutionLevel(level: PollutionLevel): void {
  if (level === 0) {
    return;
  }
  const status = document.querySelector<HTMLElement>('[data-pollution-status]');
  const announcement = status?.dataset[`pollutionAnnouncementLevel${level}`];
  if (status && announcement) {
    status.textContent = announcement;
  }
}

function requestTransition(
  storage: Storage | null,
  trigger: PollutionTrigger,
): PollutionTransition {
  if (!storage) {
    return { state: createPollutionState(), trigger, advanced: false };
  }
  const current = readState(storage);
  const transition = advancePollution(current, trigger, Math.random);
  writeState(storage, transition.state);
  return transition;
}

function markPending(
  storage: Storage | null,
  targetPath: string,
  announcementLevel?: PollutionLevel,
): void {
  if (!storage) {
    return;
  }
  const pending: PendingNavigation = {
    targetPath,
    expiresAt: Date.now() + PENDING_LIFETIME_MS,
    announcementLevel,
  };
  try {
    storage.setItem(PENDING_KEY, JSON.stringify(pending));
  } catch {
    // A missing marker may reduce deduplication, but must never block navigation.
  }
}

function consumePending(storage: Storage | null, currentPath: string): ConsumedNavigation {
  if (!storage) {
    return { matched: false };
  }
  try {
    const rawValue = storage.getItem(PENDING_KEY);
    storage.removeItem(PENDING_KEY);
    if (!rawValue) {
      return { matched: false };
    }
    const pending = JSON.parse(rawValue) as Partial<PendingNavigation>;
    const matched =
      pending.targetPath === currentPath &&
      typeof pending.expiresAt === 'number' &&
      pending.expiresAt >= Date.now();
    const announcementLevel = pending.announcementLevel;
    return {
      matched,
      announcementLevel:
        matched && (announcementLevel === 1 || announcementLevel === 2 || announcementLevel === 3)
          ? announcementLevel
          : undefined,
    };
  } catch {
    return { matched: false };
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

function isCurrentArchivePath(pathname: string): boolean {
  const [, routePrefix, archiveSegment, siteSegment, snapshotSegment] = pathname.split('/');
  return (
    Boolean(routePrefix) &&
    archiveSegment === 'archive' &&
    siteSegment === 'site' &&
    snapshotSegment === currentArchiveSnapshot.routeSegment
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
        const transition = requestTransition(storage, 'front-entry');
        markPending(
          storage,
          target.pathname,
          transition.advanced ? transition.state.level : undefined,
        );
      },
      { capture: true },
    );
    return;
  }

  if (world !== 'archive') {
    return;
  }

  const projectionPreloader = createProjectionPreloader(root);
  const pendingNavigation = consumePending(storage, window.location.pathname);
  const navigationType = getNavigationType();
  const entryTransition = shouldRequestArchiveEntry(
    pendingNavigation.matched,
    navigationType,
    hasStoredState(storage),
  )
    ? requestTransition(storage, 'direct-entry')
    : undefined;
  const initialState = entryTransition?.state ?? readState(storage);
  projectionPreloader.apply(initialState);
  const initialAnnouncementLevel = entryTransition?.advanced
    ? entryTransition.state.level
    : pendingNavigation.announcementLevel;
  if (initialAnnouncementLevel === initialState.level) {
    announcePollutionLevel(initialAnnouncementLevel);
  }

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      const restoredTransition = shouldRequestArchiveEntry(
        false,
        'back_forward',
        hasStoredState(storage),
      )
        ? requestTransition(storage, 'direct-entry')
        : undefined;
      const restoredState = restoredTransition?.state ?? readState(storage);
      projectionPreloader.apply(restoredState);
      if (restoredTransition?.advanced) {
        announcePollutionLevel(restoredTransition.state.level);
      }
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

      if (
        root.dataset.pollutionLevel === String(MAX_POLLUTION_LEVEL) &&
        anchor.hasAttribute('data-archive-invitation-trigger')
      ) {
        return;
      }

      if (anchor.dataset.worldSwitch === 'front') {
        clearState(storage);
        return;
      }

      const target = new URL(anchor.href, window.location.href);
      const isSameOriginArchive =
        target.origin === window.location.origin && isCurrentArchivePath(target.pathname);
      const isSameDocument =
        target.pathname === window.location.pathname && target.search === window.location.search;
      if (!isSameOriginArchive || isSameDocument) {
        return;
      }

      const trigger: PollutionTrigger = anchor.hasAttribute('data-locale-switch')
        ? 'archive-locale'
        : 'archive-navigation';
      const transition = requestTransition(storage, trigger);
      markPending(
        storage,
        target.pathname,
        transition.advanced ? transition.state.level : undefined,
      );
    },
    { capture: true },
  );

  document.addEventListener('crimson:archive-search-submit', () => {
    const transition = requestTransition(storage, 'archive-search');
    projectionPreloader.apply(transition.state);
    if (transition.advanced) {
      announcePollutionLevel(transition.state.level);
    }
  });
}

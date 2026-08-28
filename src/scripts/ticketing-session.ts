import {
  restoreTicketingState,
  type TicketCatalogEntry,
  type TicketingState,
} from './ticketing-state.ts';

export const TICKETING_STORAGE_KEY = 'crimson-troupe:ticketing:v7';

export function getTicketingSessionStorage(): Storage | null {
  try {
    const probe = `${TICKETING_STORAGE_KEY}:probe`;
    sessionStorage.setItem(probe, '1');
    sessionStorage.removeItem(probe);
    return sessionStorage;
  } catch {
    return null;
  }
}

export function restoreTicketingSession(
  storage: Storage | null,
  catalog: readonly TicketCatalogEntry[],
): TicketingState {
  return restoreTicketingState(storage?.getItem(TICKETING_STORAGE_KEY) ?? null, catalog);
}

export function saveTicketingSession(storage: Storage | null, state: TicketingState): void {
  if (!storage) {
    return;
  }
  try {
    storage.setItem(TICKETING_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The active page keeps working in memory when tab storage is unavailable.
  }
}

export function clearTicketingSession(storage: Storage | null): void {
  if (!storage) {
    return;
  }
  try {
    storage.removeItem(TICKETING_STORAGE_KEY);
  } catch {
    // The in-memory reset remains valid when tab storage is unavailable.
  }
}

export function createTicketNumber(): string {
  try {
    const bytes = new Uint8Array(6);
    crypto.getRandomValues(bytes);
    let value = 0n;
    for (const byte of bytes) {
      value = (value << 8n) + BigInt(byte);
    }
    return String(value % 1_000_000_000_000n).padStart(12, '0');
  } catch {
    return String(Math.floor(Math.random() * 1_000_000_000_000)).padStart(12, '0');
  }
}

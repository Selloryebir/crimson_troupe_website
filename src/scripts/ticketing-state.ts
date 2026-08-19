import type { TicketOffer, TicketZone } from '../data/performances.ts';
import type { TicketAdjustmentId, TicketStampId } from '../data/localized/schema.ts';

export const STANDARD_SUCCESS_THRESHOLD = 0.32;
export const STANDARD_FAILURE_THRESHOLD = 0.68;
export const PREMIUM_SUCCESS_THRESHOLD = 0.58;
export const PREMIUM_RATE = 0.35;

export type TicketingPhase = 'selection' | 'attempt' | 'failure' | 'network' | 'success';
export type TicketingRoute = 'standard' | 'premium';

export interface TicketBasketItem {
  performanceId: string;
  zone: TicketZone;
  basePrice: number;
}

export interface TicketAdjustment {
  id: TicketAdjustmentId;
  amount: number;
}

export interface IssuedTicket {
  performanceId: string;
  number: string;
}

export interface TicketingResult {
  route: TicketingRoute;
  basket: readonly TicketBasketItem[];
  baseTotal: number;
  adjustments: readonly TicketAdjustment[];
  settledTotal: number;
  stampIds: readonly TicketStampId[];
  tickets: readonly IssuedTicket[];
}

export interface TicketingState {
  version: 2;
  phase: TicketingPhase;
  route: TicketingRoute;
  basket: readonly TicketBasketItem[];
  result: TicketingResult | null;
}

export interface TicketCatalogEntry {
  performanceId: string;
  offers: readonly TicketOffer[];
}

export function createTicketingState(): TicketingState {
  return { version: 2, phase: 'selection', route: 'standard', basket: [], result: null };
}

export function calculateBaseTotal(basket: readonly TicketBasketItem[]): number {
  return basket.reduce((total, item) => total + item.basePrice, 0);
}

export function updateBasket(
  state: TicketingState,
  item: TicketBasketItem | null,
  performanceId: string,
): TicketingState {
  if (state.phase !== 'selection') {
    return state;
  }
  const remaining = state.basket.filter((entry) => entry.performanceId !== performanceId);
  const basket = item ? [...remaining, item] : remaining;
  return { ...state, basket, result: null };
}

export function startTicketingAttempt(state: TicketingState): TicketingState {
  if (state.phase !== 'selection' || state.basket.length === 0) {
    return state;
  }
  return { ...state, phase: 'attempt', route: 'standard', result: null };
}

function createResult(state: TicketingState, ticketNumberFactory: () => string): TicketingResult {
  const basket = state.basket.map((item) => ({ ...item }));
  const baseTotal = calculateBaseTotal(basket);
  const adjustments: readonly TicketAdjustment[] =
    state.route === 'premium'
      ? [
          {
            id: 'premium-service',
            amount: Math.ceil(baseTotal * PREMIUM_RATE),
          },
        ]
      : [];
  const settledTotal = baseTotal + adjustments.reduce((total, item) => total + item.amount, 0);
  const stampIds: readonly TicketStampId[] =
    state.route === 'premium'
      ? ['admission-confirmed', 'priority-route']
      : ['admission-confirmed', 'standard-route'];
  const tickets = basket.map((item) => ({
    performanceId: item.performanceId,
    number: ticketNumberFactory(),
  }));
  return { route: state.route, basket, baseTotal, adjustments, settledTotal, stampIds, tickets };
}

export function resolveTicketingAttempt(
  state: TicketingState,
  random: () => number,
  ticketNumberFactory: () => string,
): TicketingState {
  if (state.phase !== 'attempt') {
    return state;
  }

  const value = random();
  if (state.route === 'premium') {
    if (Number.isFinite(value) && value >= 0 && value < PREMIUM_SUCCESS_THRESHOLD) {
      return { ...state, phase: 'success', result: createResult(state, ticketNumberFactory) };
    }
    return { ...state, phase: 'failure', result: null };
  }

  if (Number.isFinite(value) && value >= 0 && value < STANDARD_SUCCESS_THRESHOLD) {
    return { ...state, phase: 'success', result: createResult(state, ticketNumberFactory) };
  }
  if (Number.isFinite(value) && value >= 0 && value < STANDARD_FAILURE_THRESHOLD) {
    return { ...state, phase: 'failure', result: null };
  }
  return { ...state, phase: 'network', result: null };
}

export function retryTicketingAttempt(state: TicketingState): TicketingState {
  if (state.phase !== 'failure' && state.phase !== 'network') {
    return state;
  }
  return { ...state, phase: 'attempt', result: null };
}

export function enterPremiumRoute(state: TicketingState): TicketingState {
  if (state.phase !== 'failure' || state.route !== 'standard') {
    return state;
  }
  return { ...state, phase: 'attempt', route: 'premium', result: null };
}

export function returnToStandardRoute(state: TicketingState): TicketingState {
  if (state.phase !== 'failure' || state.route !== 'premium') {
    return state;
  }
  return { ...state, phase: 'attempt', route: 'standard', result: null };
}

export function returnToSelection(state: TicketingState): TicketingState {
  if (state.phase === 'success') {
    return state;
  }
  return { ...state, phase: 'selection', route: 'standard', result: null };
}

function restoreBasket(
  rawBasket: unknown,
  catalog: readonly TicketCatalogEntry[],
): readonly TicketBasketItem[] | null {
  if (!Array.isArray(rawBasket) || rawBasket.length > catalog.length) {
    return null;
  }
  const seen = new Set<string>();
  const basket: TicketBasketItem[] = [];
  for (const rawItem of rawBasket) {
    if (!rawItem || typeof rawItem !== 'object') {
      return null;
    }
    const item = rawItem as Partial<TicketBasketItem>;
    const catalogEntry = catalog.find((entry) => entry.performanceId === item.performanceId);
    const offer = catalogEntry?.offers.find(
      (entry) => entry.zone === item.zone && entry.basePrice === item.basePrice,
    );
    if (!catalogEntry || !offer || seen.has(catalogEntry.performanceId)) {
      return null;
    }
    seen.add(catalogEntry.performanceId);
    basket.push({
      performanceId: catalogEntry.performanceId,
      zone: offer.zone,
      basePrice: offer.basePrice,
    });
  }
  return basket;
}

export function restoreTicketingState(
  rawValue: string | null,
  catalog: readonly TicketCatalogEntry[],
): TicketingState {
  if (!rawValue) {
    return createTicketingState();
  }
  try {
    const value = JSON.parse(rawValue) as Partial<TicketingState>;
    const phases: readonly TicketingPhase[] = [
      'selection',
      'attempt',
      'failure',
      'network',
      'success',
    ];
    if (
      value.version !== 2 ||
      !phases.includes(value.phase as TicketingPhase) ||
      (value.route !== 'standard' && value.route !== 'premium')
    ) {
      return createTicketingState();
    }
    const phase = value.phase as TicketingPhase;
    const basket = restoreBasket(value.basket, catalog);
    if (!basket || (phase !== 'selection' && basket.length === 0)) {
      return createTicketingState();
    }
    if (phase === 'network' && value.route === 'premium') {
      return createTicketingState();
    }
    if (phase !== 'success') {
      return { version: 2, phase, route: value.route, basket, result: null };
    }

    const rawResult = value.result as Partial<TicketingResult> | null;
    if (
      !rawResult ||
      !Array.isArray(rawResult.tickets) ||
      rawResult.tickets.length !== basket.length
    ) {
      return createTicketingState();
    }
    const numbers = new Map<string, string>();
    for (const rawTicket of rawResult.tickets) {
      if (!rawTicket || typeof rawTicket !== 'object') {
        return createTicketingState();
      }
      const ticket = rawTicket as Partial<IssuedTicket>;
      if (
        typeof ticket.performanceId !== 'string' ||
        typeof ticket.number !== 'string' ||
        !/^\d{12}$/.test(ticket.number) ||
        numbers.has(ticket.performanceId)
      ) {
        return createTicketingState();
      }
      numbers.set(ticket.performanceId, ticket.number);
    }
    if (basket.some((item) => !numbers.has(item.performanceId))) {
      return createTicketingState();
    }
    const orderedNumbers = basket.map((item) => numbers.get(item.performanceId) ?? '000000000000');
    const result = createResult(
      { version: 2, phase: 'attempt', route: value.route, basket, result: null },
      () => orderedNumbers.shift() ?? '000000000000',
    );
    return { version: 2, phase: 'success', route: value.route, basket, result };
  } catch {
    return createTicketingState();
  }
}

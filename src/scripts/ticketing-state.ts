import type { TerraDateTime, TicketOffer, TicketZone } from '../data/performances.ts';
import type { TicketAdjustmentId } from '../data/localized/schema.ts';

export const TICKETING_STATE_VERSION = 6 as const;
export const STANDARD_INITIAL_SUCCESS_THRESHOLD = 0.12;
export const STANDARD_SUCCESS_THRESHOLD = 0.32;
export const STANDARD_FAILURE_THRESHOLD = 0.68;
export const PREMIUM_SUCCESS_THRESHOLD = 0.58;
export const PRIORITY_ADJUSTMENT_RATE = 0.5;
export const RETENTION_ADJUSTMENT_RATE = 0.48;
export const FAILURE_SERVICE_RATE = 0.25;
export const MAX_REQUIRING_RESUBMIT_RESULTS = 3;

export type TicketingPhase =
  'selection' | 'attempt' | 'failure' | 'network' | 'premium-offer' | 'retention-offer' | 'success';
export type TicketingRoute = 'standard' | 'premium';
export type TicketOfferVariant = 'full' | 'retention';
export type AttemptOutcome = 'success' | 'unavailable' | 'network';
export type TicketingEndingId =
  | 'ENDING_NETWORK_ERROR'
  | 'ENDING_NORMAL_SUCCESS'
  | 'ENDING_REJECT_RESCALPER'
  | 'ENDING_SCALPER_SUCCESS'
  | 'ENDING_SCALPER_FAILED'
  | 'ENDING_DISCOUNT_SUCCESS'
  | 'ENDING_DISCOUNT_FAILED';
export type JourneyTag =
  'network-retry' | 'priority-refused' | 'retention-accepted' | 'returned-seat' | 'manual-review';

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
  endingId: Extract<
    TicketingEndingId,
    'ENDING_NORMAL_SUCCESS' | 'ENDING_SCALPER_SUCCESS' | 'ENDING_DISCOUNT_SUCCESS'
  >;
  endingHistory: readonly TicketingEndingId[];
  route: TicketingRoute;
  offerVariant: TicketOfferVariant | null;
  basket: readonly TicketBasketItem[];
  baseTotal: number;
  adjustments: readonly TicketAdjustment[];
  settledTotal: number;
  journeyTags: readonly JourneyTag[];
  tickets: readonly IssuedTicket[];
  acceptedAt: TerraDateTime;
}

interface TicketingStateBase {
  version: typeof TICKETING_STATE_VERSION;
  phase: TicketingPhase;
  basket: readonly TicketBasketItem[];
  attemptCount: number;
  lastOutcome: AttemptOutcome | null;
  retentionOffered: boolean;
  journeyTags: readonly JourneyTag[];
  currentEndingId: TicketingEndingId | null;
  endingHistory: readonly TicketingEndingId[];
  result: TicketingResult | null;
}

interface StandardRouteState {
  route: 'standard';
  offerVariant: null;
}

interface PremiumRouteState {
  route: 'premium';
  offerVariant: TicketOfferVariant;
}

export type TicketingState = TicketingStateBase & (StandardRouteState | PremiumRouteState);

export interface TicketCatalogEntry {
  performanceId: string;
  offers: readonly TicketOffer[];
}

const phases: readonly TicketingPhase[] = [
  'selection',
  'attempt',
  'failure',
  'network',
  'premium-offer',
  'retention-offer',
  'success',
];
const outcomes: readonly AttemptOutcome[] = ['success', 'unavailable', 'network'];
const journeyTags: readonly JourneyTag[] = [
  'network-retry',
  'priority-refused',
  'retention-accepted',
  'returned-seat',
  'manual-review',
];
const endingIds: readonly TicketingEndingId[] = [
  'ENDING_NETWORK_ERROR',
  'ENDING_NORMAL_SUCCESS',
  'ENDING_REJECT_RESCALPER',
  'ENDING_SCALPER_SUCCESS',
  'ENDING_SCALPER_FAILED',
  'ENDING_DISCOUNT_SUCCESS',
  'ENDING_DISCOUNT_FAILED',
];

function withStandardRoute(
  state: TicketingState,
  changes: Partial<TicketingStateBase> = {},
): TicketingState {
  return { ...state, ...changes, route: 'standard', offerVariant: null };
}

function withPremiumRoute(
  state: TicketingState,
  offerVariant: TicketOfferVariant,
  changes: Partial<TicketingStateBase> = {},
): TicketingState {
  return { ...state, ...changes, route: 'premium', offerVariant };
}

function appendJourneyTag(tags: readonly JourneyTag[], tag: JourneyTag): readonly JourneyTag[] {
  return tags.includes(tag) ? tags : [...tags, tag];
}

export function createTicketingState(): TicketingState {
  return {
    version: TICKETING_STATE_VERSION,
    phase: 'selection',
    route: 'standard',
    offerVariant: null,
    basket: [],
    attemptCount: 0,
    lastOutcome: null,
    retentionOffered: false,
    journeyTags: [],
    currentEndingId: null,
    endingHistory: [],
    result: null,
  };
}

export function calculateBaseTotal(basket: readonly TicketBasketItem[]): number {
  return basket.reduce((total, item) => total + item.basePrice, 0);
}

export function calculateAdjustmentAmount(
  baseTotal: number,
  offerVariant: TicketOfferVariant,
): number {
  const rate = offerVariant === 'retention' ? RETENTION_ADJUSTMENT_RATE : PRIORITY_ADJUSTMENT_RATE;
  return Math.ceil(baseTotal * rate);
}

export function calculateFailureServiceFee(baseTotal: number): number {
  return Math.ceil(baseTotal * FAILURE_SERVICE_RATE);
}

export function isValidTicketingTerraDateTime(value: unknown): value is TerraDateTime {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const candidate = value as Partial<TerraDateTime>;
  return (
    candidate.calendar === 'terra' &&
    Number.isInteger(candidate.year) &&
    Number.isInteger(candidate.month) &&
    (candidate.month as number) >= 1 &&
    (candidate.month as number) <= 12 &&
    Number.isInteger(candidate.day) &&
    (candidate.day as number) >= 1 &&
    (candidate.day as number) <= 31 &&
    typeof candidate.time === 'string' &&
    /^(?:[01]\d|2[0-3]):[0-5]\d$/u.test(candidate.time)
  );
}

function copyTerraDateTime(value: TerraDateTime): TerraDateTime {
  if (!isValidTicketingTerraDateTime(value)) {
    throw new Error('Ticketing acceptance time is invalid');
  }
  return Object.freeze({ ...value });
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
  return withStandardRoute(state, { phase: 'attempt', currentEndingId: null, result: null });
}

function recordEnding(state: TicketingState, endingId: TicketingEndingId): TicketingState {
  return {
    ...state,
    currentEndingId: endingId,
    endingHistory: [...state.endingHistory, endingId],
  };
}

function createResult(
  state: TicketingState,
  ticketNumberFactory: () => string,
  acceptedAt: TerraDateTime,
): TicketingResult {
  const basket = state.basket.map((item) => ({ ...item }));
  const baseTotal = calculateBaseTotal(basket);
  const adjustments: readonly TicketAdjustment[] =
    state.route === 'premium'
      ? state.offerVariant === 'retention'
        ? [
            {
              id: 'priority-service',
              amount: calculateAdjustmentAmount(baseTotal, 'full'),
            },
            {
              id: 'retention-service',
              amount:
                calculateAdjustmentAmount(baseTotal, 'retention') -
                calculateAdjustmentAmount(baseTotal, 'full'),
            },
          ]
        : [
            {
              id: 'priority-service',
              amount: calculateAdjustmentAmount(baseTotal, 'full'),
            },
          ]
      : [];
  const settledTotal = baseTotal + adjustments.reduce((total, item) => total + item.amount, 0);
  const tickets = basket.map((item) => ({
    performanceId: item.performanceId,
    number: ticketNumberFactory(),
  }));
  return {
    endingId: state.currentEndingId as TicketingResult['endingId'],
    endingHistory: [...state.endingHistory],
    route: state.route,
    offerVariant: state.offerVariant,
    basket,
    baseTotal,
    adjustments,
    settledTotal,
    journeyTags: [...state.journeyTags],
    tickets,
    acceptedAt: copyTerraDateTime(acceptedAt),
  };
}

function completeAttempt(
  state: TicketingState,
  ticketNumberFactory: () => string,
  acceptedAt: TerraDateTime,
  forcedTag?: 'returned-seat' | 'manual-review',
): TicketingState {
  const journeyTags = forcedTag
    ? appendJourneyTag(state.journeyTags, forcedTag)
    : state.journeyTags;
  const routedState = forcedTag
    ? withStandardRoute(state, { journeyTags })
    : ({ ...state, journeyTags } as TicketingState);
  const completedState = recordEnding(
    {
      ...routedState,
      phase: 'success' as const,
      lastOutcome: 'success' as const,
      result: null,
    },
    routedState.route === 'premium'
      ? routedState.offerVariant === 'retention'
        ? 'ENDING_DISCOUNT_SUCCESS'
        : 'ENDING_SCALPER_SUCCESS'
      : 'ENDING_NORMAL_SUCCESS',
  );
  return {
    ...completedState,
    result: createResult(completedState, ticketNumberFactory, acceptedAt),
  };
}

export function resolveTicketingAttempt(
  state: TicketingState,
  random: () => number,
  ticketNumberFactory: () => string,
  acceptedAt: TerraDateTime,
): TicketingState {
  if (state.phase !== 'attempt') {
    return state;
  }

  if (state.attemptCount >= MAX_REQUIRING_RESUBMIT_RESULTS) {
    const forcedTag = state.journeyTags.includes('priority-refused')
      ? 'returned-seat'
      : 'manual-review';
    return completeAttempt(state, ticketNumberFactory, acceptedAt, forcedTag);
  }

  const value = random();
  let outcome: AttemptOutcome;
  if (state.route === 'premium') {
    outcome =
      Number.isFinite(value) && value >= 0 && value < PREMIUM_SUCCESS_THRESHOLD
        ? 'success'
        : 'unavailable';
  } else if (
    Number.isFinite(value) &&
    value >= 0 &&
    value <
      (state.attemptCount === 0 ? STANDARD_INITIAL_SUCCESS_THRESHOLD : STANDARD_SUCCESS_THRESHOLD)
  ) {
    outcome = 'success';
  } else if (Number.isFinite(value) && value >= 0 && value < STANDARD_FAILURE_THRESHOLD) {
    outcome = 'unavailable';
  } else {
    outcome = 'network';
  }

  if (outcome === 'network' && state.lastOutcome === 'network') {
    outcome = 'unavailable';
  }
  if (outcome === 'success') {
    return completeAttempt(state, ticketNumberFactory, acceptedAt);
  }
  const failedState = {
    ...state,
    phase: outcome === 'network' ? 'network' : 'failure',
    attemptCount: state.attemptCount + 1,
    lastOutcome: outcome,
    result: null,
  } as TicketingState;
  if (outcome === 'network') {
    return recordEnding(failedState, 'ENDING_NETWORK_ERROR');
  }
  if (state.route === 'premium') {
    return recordEnding(
      failedState,
      state.offerVariant === 'retention' ? 'ENDING_DISCOUNT_FAILED' : 'ENDING_SCALPER_FAILED',
    );
  }
  return { ...failedState, currentEndingId: null };
}

export function retryTicketingAttempt(state: TicketingState): TicketingState {
  if (state.phase !== 'failure' && state.phase !== 'network') {
    return state;
  }
  const journeyTags =
    state.phase === 'network'
      ? appendJourneyTag(state.journeyTags, 'network-retry')
      : state.journeyTags;
  return { ...state, phase: 'attempt', journeyTags, currentEndingId: null, result: null };
}

export function openPremiumOffer(state: TicketingState): TicketingState {
  if (state.phase !== 'failure' || state.route !== 'standard') {
    return state;
  }
  return withStandardRoute(state, { phase: 'premium-offer', result: null });
}

export function enterPremiumRoute(state: TicketingState): TicketingState {
  if (
    state.route !== 'standard' ||
    (state.phase !== 'failure' && state.phase !== 'premium-offer')
  ) {
    return state;
  }
  return withPremiumRoute(state, 'full', {
    phase: 'attempt',
    currentEndingId: null,
    result: null,
  });
}

export function declinePremiumOffer(state: TicketingState): TicketingState {
  if (state.phase !== 'premium-offer' || state.route !== 'standard') {
    return state;
  }
  const nextTags = appendJourneyTag(state.journeyTags, 'priority-refused');
  if (!state.retentionOffered) {
    return withStandardRoute(state, {
      phase: 'retention-offer',
      retentionOffered: true,
      journeyTags: nextTags,
      result: null,
    });
  }
  return recordEnding(
    withStandardRoute(state, { phase: 'selection', journeyTags: nextTags, result: null }),
    'ENDING_REJECT_RESCALPER',
  );
}

export function acceptRetentionOffer(state: TicketingState): TicketingState {
  if (state.phase !== 'retention-offer' || state.route !== 'standard') {
    return state;
  }
  return withPremiumRoute(state, 'retention', {
    phase: 'attempt',
    journeyTags: appendJourneyTag(state.journeyTags, 'retention-accepted'),
    currentEndingId: null,
    result: null,
  });
}

export function declineRetentionOffer(state: TicketingState): TicketingState {
  if (state.phase !== 'retention-offer' || state.route !== 'standard') {
    return state;
  }
  return recordEnding(
    withStandardRoute(state, { phase: 'selection', result: null }),
    'ENDING_REJECT_RESCALPER',
  );
}

export function returnToStandardRoute(state: TicketingState): TicketingState {
  if (state.phase !== 'failure' || state.route !== 'premium') {
    return state;
  }
  return withStandardRoute(state, { phase: 'attempt', currentEndingId: null, result: null });
}

export function returnToSelection(state: TicketingState): TicketingState {
  if (state.phase === 'success') {
    return state;
  }
  return withStandardRoute(state, { phase: 'selection', result: null });
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

function restoreJourneyTags(rawTags: unknown): readonly JourneyTag[] | null {
  if (!Array.isArray(rawTags) || rawTags.some((tag) => !journeyTags.includes(tag as JourneyTag))) {
    return null;
  }
  const restored = rawTags as JourneyTag[];
  return new Set(restored).size === restored.length ? restored : null;
}

function restoreEndingHistory(rawHistory: unknown): readonly TicketingEndingId[] | null {
  if (
    !Array.isArray(rawHistory) ||
    rawHistory.some((endingId) => !endingIds.includes(endingId as TicketingEndingId))
  ) {
    return null;
  }
  return rawHistory as TicketingEndingId[];
}

function restoreIssuedNumbers(
  rawResult: unknown,
  basket: readonly TicketBasketItem[],
): readonly string[] | null {
  if (!rawResult || typeof rawResult !== 'object') {
    return null;
  }
  const tickets = (rawResult as Partial<TicketingResult>).tickets;
  if (!Array.isArray(tickets) || tickets.length !== basket.length) {
    return null;
  }
  const numbers = new Map<string, string>();
  for (const rawTicket of tickets) {
    if (!rawTicket || typeof rawTicket !== 'object') {
      return null;
    }
    const ticket = rawTicket as Partial<IssuedTicket>;
    if (
      typeof ticket.performanceId !== 'string' ||
      typeof ticket.number !== 'string' ||
      !/^\d{12}$/.test(ticket.number) ||
      numbers.has(ticket.performanceId)
    ) {
      return null;
    }
    numbers.set(ticket.performanceId, ticket.number);
  }
  return basket.every((item) => numbers.has(item.performanceId))
    ? basket.map((item) => numbers.get(item.performanceId) ?? '000000000000')
    : null;
}

function isValidStateCombination(state: TicketingState): boolean {
  const returnedSeat = state.journeyTags.includes('returned-seat');
  const manualReview = state.journeyTags.includes('manual-review');
  if (
    (returnedSeat && manualReview) ||
    (returnedSeat && !state.journeyTags.includes('priority-refused')) ||
    (manualReview && state.journeyTags.includes('priority-refused')) ||
    ((returnedSeat || manualReview) && state.phase !== 'success') ||
    (state.journeyTags.includes('retention-accepted') && !state.retentionOffered)
  ) {
    return false;
  }
  if (state.phase === 'network' && state.route !== 'standard') {
    return false;
  }
  if (
    (state.phase === 'premium-offer' || state.phase === 'retention-offer') &&
    state.route !== 'standard'
  ) {
    return false;
  }
  if (
    state.phase === 'retention-offer' &&
    (!state.retentionOffered || !state.journeyTags.includes('priority-refused'))
  ) {
    return false;
  }
  if (
    state.route === 'premium' &&
    state.offerVariant === 'retention' &&
    (!state.retentionOffered || !state.journeyTags.includes('retention-accepted'))
  ) {
    return false;
  }
  if (state.phase === 'network' && state.lastOutcome !== 'network') {
    return false;
  }
  if (state.phase === 'failure' && state.lastOutcome !== 'unavailable') {
    return false;
  }
  if (state.phase === 'success' && state.lastOutcome !== 'success') {
    return false;
  }
  const currentEndingMatchesHistory =
    state.currentEndingId === null || state.endingHistory.at(-1) === state.currentEndingId;
  if (!currentEndingMatchesHistory) {
    return false;
  }
  if (
    state.phase === 'success' &&
    state.currentEndingId !== 'ENDING_NORMAL_SUCCESS' &&
    state.currentEndingId !== 'ENDING_SCALPER_SUCCESS' &&
    state.currentEndingId !== 'ENDING_DISCOUNT_SUCCESS'
  ) {
    return false;
  }
  if (state.phase === 'network' && state.currentEndingId !== 'ENDING_NETWORK_ERROR') {
    return false;
  }
  if (
    state.phase === 'failure' &&
    state.route === 'premium' &&
    state.currentEndingId !== 'ENDING_SCALPER_FAILED' &&
    state.currentEndingId !== 'ENDING_DISCOUNT_FAILED'
  ) {
    return false;
  }
  return true;
}

export function restoreTicketingState(
  rawValue: string | null,
  catalog: readonly TicketCatalogEntry[],
): TicketingState {
  if (!rawValue) {
    return createTicketingState();
  }
  try {
    const value = JSON.parse(rawValue) as Record<string, unknown>;
    if (
      value.version !== TICKETING_STATE_VERSION ||
      !phases.includes(value.phase as TicketingPhase) ||
      (value.route !== 'standard' && value.route !== 'premium') ||
      (value.route === 'standard' && value.offerVariant !== null) ||
      (value.route === 'premium' &&
        value.offerVariant !== 'full' &&
        value.offerVariant !== 'retention') ||
      !Number.isInteger(value.attemptCount) ||
      (value.attemptCount as number) < 0 ||
      (value.attemptCount as number) > MAX_REQUIRING_RESUBMIT_RESULTS ||
      (value.lastOutcome !== null && !outcomes.includes(value.lastOutcome as AttemptOutcome)) ||
      typeof value.retentionOffered !== 'boolean'
    ) {
      return createTicketingState();
    }
    const phase = value.phase as TicketingPhase;
    const basket = restoreBasket(value.basket, catalog);
    const restoredTags = restoreJourneyTags(value.journeyTags);
    const endingHistory = restoreEndingHistory(value.endingHistory);
    const currentEndingId =
      value.currentEndingId === null ||
      endingIds.includes(value.currentEndingId as TicketingEndingId)
        ? (value.currentEndingId as TicketingEndingId | null)
        : undefined;
    if (
      !basket ||
      !restoredTags ||
      !endingHistory ||
      currentEndingId === undefined ||
      (phase !== 'selection' && basket.length === 0)
    ) {
      return createTicketingState();
    }
    const state = {
      version: TICKETING_STATE_VERSION,
      phase,
      route: value.route,
      offerVariant: value.offerVariant,
      basket,
      attemptCount: value.attemptCount,
      lastOutcome: value.lastOutcome,
      retentionOffered: value.retentionOffered,
      journeyTags: restoredTags,
      currentEndingId,
      endingHistory,
      result: null,
    } as TicketingState;
    if (!isValidStateCombination(state)) {
      return createTicketingState();
    }
    if (phase !== 'success') {
      return state;
    }

    const issuedNumbers = restoreIssuedNumbers(value.result, basket);
    const acceptedAt =
      value.result && typeof value.result === 'object'
        ? (value.result as Partial<TicketingResult>).acceptedAt
        : undefined;
    if (!issuedNumbers || !isValidTicketingTerraDateTime(acceptedAt)) {
      return createTicketingState();
    }
    const pendingNumbers = [...issuedNumbers];
    const result = createResult(state, () => pendingNumbers.shift() ?? '000000000000', acceptedAt);
    return { ...state, result };
  } catch {
    return createTicketingState();
  }
}

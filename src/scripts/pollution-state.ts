export const POLLUTION_PROBABILITY = 0.42;
export const MAX_POLLUTION_LEVEL = 3;

export type PollutionLevel = 0 | 1 | 2 | 3;
export type PollutionVariant = 0 | 1 | 2;
export type PollutionTrigger =
  'front-entry' | 'direct-entry' | 'archive-navigation' | 'archive-locale' | 'archive-search';

export interface PollutionState {
  version: 2;
  level: PollutionLevel;
  eventCount: number;
  variant: PollutionVariant;
}

export interface PollutionTransition {
  state: PollutionState;
  trigger: PollutionTrigger;
  advanced: boolean;
}

const isPollutionLevel = (value: unknown): value is PollutionLevel =>
  Number.isInteger(value) && Number(value) >= 0 && Number(value) <= MAX_POLLUTION_LEVEL;

const isPollutionVariant = (value: unknown): value is PollutionVariant =>
  Number.isInteger(value) && Number(value) >= 0 && Number(value) <= 2;

const isEventCount = (value: unknown): value is number =>
  Number.isSafeInteger(value) && Number(value) >= 0;

export function createPollutionState(variant: PollutionVariant = 0): PollutionState {
  return { version: 2, level: 0, eventCount: 0, variant };
}

export function parsePollutionState(
  rawValue: string | null,
  fallbackVariant: PollutionVariant = 0,
): PollutionState {
  if (!rawValue) {
    return createPollutionState(fallbackVariant);
  }

  try {
    const value = JSON.parse(rawValue) as Partial<PollutionState>;
    if (
      value.version !== 2 ||
      !isPollutionLevel(value.level) ||
      !isEventCount(value.eventCount) ||
      !isPollutionVariant(value.variant)
    ) {
      return createPollutionState(fallbackVariant);
    }
    return { version: 2, level: value.level, eventCount: value.eventCount, variant: value.variant };
  } catch {
    return createPollutionState(fallbackVariant);
  }
}

export function advancePollution(
  state: PollutionState,
  trigger: PollutionTrigger,
  random: () => number,
): PollutionTransition {
  const eventCount = Math.min(state.eventCount + 1, Number.MAX_SAFE_INTEGER);
  if (eventCount <= 2) {
    return { state: { ...state, eventCount }, trigger, advanced: false };
  }

  if (state.level >= MAX_POLLUTION_LEVEL) {
    return { state: { ...state, eventCount }, trigger, advanced: false };
  }

  const randomValue = random();
  const advanced =
    Number.isFinite(randomValue) && randomValue >= 0 && randomValue < POLLUTION_PROBABILITY;
  const level = advanced ? ((state.level + 1) as PollutionLevel) : state.level;
  return { state: { ...state, level, eventCount }, trigger, advanced };
}

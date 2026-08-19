#!/usr/bin/env node

import assert from 'node:assert/strict';

import {
  MAX_POLLUTION_LEVEL,
  POLLUTION_PROBABILITY,
  advancePollution,
  createPollutionState,
  parsePollutionState,
} from '../src/scripts/pollution-state.ts';
import { createTicketMatrix, createTicketSvg } from '../src/scripts/ticket-artifact.ts';
import {
  calculateBaseTotal,
  createTicketingState,
  enterPremiumRoute,
  resolveTicketingAttempt,
  restoreTicketingState,
  retryTicketingAttempt,
  returnToSelection,
  returnToStandardRoute,
  startTicketingAttempt,
  updateBasket,
} from '../src/scripts/ticketing-state.ts';

const pollutionTriggers = [
  'front-entry',
  'direct-entry',
  'archive-navigation',
  'archive-locale',
  'archive-search',
];

for (const trigger of pollutionTriggers) {
  const transition = advancePollution(createPollutionState(), trigger, () => 0.99);
  assert.equal(transition.trigger, trigger);
  assert.equal(transition.advanced, false);
}

let pollution = createPollutionState(2);
for (const trigger of pollutionTriggers.slice(0, 3)) {
  const transition = advancePollution(pollution, trigger, () => 0.1);
  assert.equal(transition.trigger, trigger);
  assert.equal(transition.advanced, true);
  pollution = transition.state;
}
assert.equal(pollution.level, MAX_POLLUTION_LEVEL);
let cappedRandomCalls = 0;
const capped = advancePollution(pollution, 'archive-search', () => {
  cappedRandomCalls += 1;
  return 0;
});
assert.equal(capped.state, pollution);
assert.equal(cappedRandomCalls, 0);
assert.deepEqual(parsePollutionState('{"version":2}'), createPollutionState());

const probabilityAtLeastThreeInTen =
  1 -
  [0, 1, 2].reduce((total, successes) => {
    const combinations = successes === 0 ? 1 : successes === 1 ? 10 : 45;
    return (
      total +
      combinations *
        POLLUTION_PROBABILITY ** successes *
        (1 - POLLUTION_PROBABILITY) ** (10 - successes)
    );
  }, 0);
assert.ok(probabilityAtLeastThreeInTen > 0.85);

const catalog = [
  {
    performanceId: 'performance-a',
    offers: [
      { zone: 'C', label: 'C 区', basePrice: 180 },
      { zone: 'A', label: 'A 区', basePrice: 420 },
    ],
  },
  {
    performanceId: 'performance-b',
    offers: [{ zone: 'S', label: 'S 区', basePrice: 680 }],
  },
];
const basketA = { performanceId: 'performance-a', zone: 'A', zoneLabel: 'A 区', basePrice: 420 };
const basketB = { performanceId: 'performance-b', zone: 'S', zoneLabel: 'S 区', basePrice: 680 };

let selection = createTicketingState();
selection = updateBasket(selection, basketA, basketA.performanceId);
selection = updateBasket(selection, basketB, basketB.performanceId);
assert.equal(selection.basket.length, 2);
assert.equal(calculateBaseTotal(selection.basket), 1100);

const started = startTicketingAttempt(selection);
const standardSuccess = resolveTicketingAttempt(
  started,
  () => 0.1,
  () => '123456789012',
);
const standardFailure = resolveTicketingAttempt(
  started,
  () => 0.5,
  () => '000000000000',
);
const networkFailure = resolveTicketingAttempt(
  started,
  () => 0.9,
  () => '000000000000',
);
assert.equal(standardSuccess.phase, 'success');
assert.equal(standardFailure.phase, 'failure');
assert.equal(networkFailure.phase, 'network');
assert.deepEqual(retryTicketingAttempt(networkFailure).basket, selection.basket);
assert.deepEqual(returnToSelection(standardFailure).basket, selection.basket);

const premiumAttempt = enterPremiumRoute(standardFailure);
const premiumSuccess = resolveTicketingAttempt(
  premiumAttempt,
  () => 0.1,
  () => '987654321098',
);
const premiumFailure = resolveTicketingAttempt(
  premiumAttempt,
  () => 0.9,
  () => '000000000000',
);
assert.equal(premiumSuccess.phase, 'success');
assert.equal(premiumFailure.phase, 'failure');
assert.equal(premiumSuccess.result?.baseTotal, 1100);
assert.equal(premiumSuccess.result?.adjustments[0]?.amount, 385);
assert.equal(premiumSuccess.result?.settledTotal, 1485);
assert.equal(returnToStandardRoute(premiumFailure).route, 'standard');

let frozenRandomCalls = 0;
let frozenNumberCalls = 0;
const frozen = resolveTicketingAttempt(
  premiumSuccess,
  () => {
    frozenRandomCalls += 1;
    return 0;
  },
  () => {
    frozenNumberCalls += 1;
    return '000000000000';
  },
);
assert.equal(frozen, premiumSuccess);
assert.equal(frozenRandomCalls, 0);
assert.equal(frozenNumberCalls, 0);

const restored = restoreTicketingState(JSON.stringify(premiumSuccess), catalog);
assert.equal(restored.phase, 'success');
assert.deepEqual(restored.result?.tickets, premiumSuccess.result?.tickets);
assert.deepEqual(restoreTicketingState('{"version":999}', catalog), createTicketingState());

const artifactPerformance = {
  performanceId: 'performance-a',
  title: '《候选验收》',
  kind: '测试剧目',
  dateTime: '1098.09.17 / 19:30',
  place: '特里蒙大剧院',
  visual: 'moon',
  offers: catalog[0].offers,
};
const matrix = createTicketMatrix('123456789012');
const svg = createTicketSvg({
  performance: artifactPerformance,
  basketItem: basketA,
  number: '123456789012',
  stamps: ['确认入场', '优先线路'],
});
assert.equal(matrix.length, 21 * 21);
for (const requiredText of [
  artifactPerformance.title,
  artifactPerformance.dateTime,
  artifactPerformance.place,
  basketA.zoneLabel,
  `${basketA.basePrice} LMD`,
  '123456789012',
  '确认入场',
  '优先线路',
]) {
  assert.ok(svg.includes(requiredText), `票面缺少必要字段：${requiredText}`);
}

console.log(
  `state validation passed: pollution=${pollutionTriggers.length} triggers, p10=${(
    probabilityAtLeastThreeInTen * 100
  ).toFixed(4)}%, ticket outcomes=5, matrix=${matrix.length}`,
);

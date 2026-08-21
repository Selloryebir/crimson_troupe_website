#!/usr/bin/env node

import assert from 'node:assert/strict';

import { editions, previewEditionIds } from '../src/data/editions.ts';
import { getLocalization } from '../src/data/localized/resolve.ts';
import { getTicketingOptions } from '../src/data/ticketing.ts';
import {
  MAX_POLLUTION_LEVEL,
  POLLUTION_PROBABILITY,
  advancePollution,
  createPollutionState,
  parsePollutionState,
} from '../src/scripts/pollution-state.ts';
import { createTicketMatrix, createTicketSvg } from '../src/scripts/ticket-artifact.ts';
import {
  MAX_REQUIRING_RESUBMIT_RESULTS,
  acceptRetentionOffer,
  calculateAdjustmentAmount,
  calculateBaseTotal,
  calculateFailureServiceFee,
  createTicketingState,
  declinePremiumOffer,
  declineRetentionOffer,
  enterPremiumRoute,
  openPremiumOffer,
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
      { zone: 'C', basePrice: 180 },
      { zone: 'A', basePrice: 420 },
    ],
  },
  {
    performanceId: 'performance-b',
    offers: [{ zone: 'S', basePrice: 680 }],
  },
];
const basketA = { performanceId: 'performance-a', zone: 'A', basePrice: 420 };
const basketB = { performanceId: 'performance-b', zone: 'S', basePrice: 680 };

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
assert.equal(standardFailure.attemptCount, 1);
assert.equal(standardFailure.lastOutcome, 'unavailable');
assert.equal(networkFailure.phase, 'network');
assert.equal(networkFailure.attemptCount, 1);
const networkRetry = retryTicketingAttempt(networkFailure);
assert.deepEqual(networkRetry.basket, selection.basket);
assert.deepEqual(networkRetry.journeyTags, ['network-retry']);
const noConsecutiveNetwork = resolveTicketingAttempt(
  networkRetry,
  () => 0.9,
  () => '000000000000',
);
assert.equal(noConsecutiveNetwork.phase, 'failure');
assert.equal(noConsecutiveNetwork.lastOutcome, 'unavailable');
assert.deepEqual(returnToSelection(standardFailure).basket, selection.basket);

const premiumOffer = openPremiumOffer(standardFailure);
assert.equal(premiumOffer.phase, 'premium-offer');
const premiumAttempt = enterPremiumRoute(premiumOffer);
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
assert.deepEqual(premiumSuccess.result?.adjustments, [{ id: 'priority-service', amount: 550 }]);
assert.equal(premiumSuccess.result?.settledTotal, 1650);
assert.equal(returnToStandardRoute(premiumFailure).route, 'standard');
assert.equal(calculateAdjustmentAmount(1100, 'full'), 550);
assert.equal(calculateAdjustmentAmount(1100, 'retention'), 528);
assert.equal(calculateFailureServiceFee(1100), 275);

const firstRetentionOffer = declinePremiumOffer(premiumOffer);
assert.equal(firstRetentionOffer.phase, 'retention-offer');
assert.equal(firstRetentionOffer.retentionOffered, true);
assert.deepEqual(firstRetentionOffer.journeyTags, ['priority-refused']);
const retainedAttempt = acceptRetentionOffer(firstRetentionOffer);
assert.equal(retainedAttempt.route, 'premium');
assert.equal(retainedAttempt.offerVariant, 'retention');
assert.ok(retainedAttempt.journeyTags.includes('retention-accepted'));
const retainedSuccess = resolveTicketingAttempt(
  retainedAttempt,
  () => 0.1,
  () => '555555555555',
);
assert.deepEqual(retainedSuccess.result?.adjustments, [{ id: 'retention-service', amount: 528 }]);
assert.equal(retainedSuccess.result?.settledTotal, 1628);

const retentionDeclined = declineRetentionOffer(firstRetentionOffer);
assert.equal(retentionDeclined.phase, 'selection');
const failureAfterRetention = resolveTicketingAttempt(
  startTicketingAttempt(retentionDeclined),
  () => 0.5,
  () => '000000000000',
);
const secondPremiumOffer = openPremiumOffer(failureAfterRetention);
const noSecondRetention = declinePremiumOffer(secondPremiumOffer);
assert.equal(noSecondRetention.phase, 'selection');
assert.equal(noSecondRetention.retentionOffered, true);

let bounded = startTicketingAttempt(selection);
let boundedRandomCalls = 0;
for (let index = 0; index < MAX_REQUIRING_RESUBMIT_RESULTS; index += 1) {
  bounded = resolveTicketingAttempt(
    bounded,
    () => {
      boundedRandomCalls += 1;
      return 0.5;
    },
    () => '000000000000',
  );
  assert.equal(bounded.phase, 'failure');
  bounded = retryTicketingAttempt(bounded);
}
const forcedManualReview = resolveTicketingAttempt(
  bounded,
  () => {
    boundedRandomCalls += 1;
    return 0.5;
  },
  () => '111111111111',
);
assert.equal(boundedRandomCalls, MAX_REQUIRING_RESUBMIT_RESULTS);
assert.equal(forcedManualReview.phase, 'success');
assert.equal(forcedManualReview.route, 'standard');
assert.ok(forcedManualReview.journeyTags.includes('manual-review'));

let returnedSeatJourney = declineRetentionOffer(firstRetentionOffer);
returnedSeatJourney = startTicketingAttempt(returnedSeatJourney);
for (let index = returnedSeatJourney.attemptCount; index < 3; index += 1) {
  returnedSeatJourney = resolveTicketingAttempt(
    returnedSeatJourney,
    () => 0.5,
    () => '000000000000',
  );
  returnedSeatJourney = retryTicketingAttempt(returnedSeatJourney);
}
const forcedReturnedSeat = resolveTicketingAttempt(
  returnedSeatJourney,
  () => {
    throw new Error('达到上限后不应再次读取随机数');
  },
  () => '222222222222',
);
assert.equal(forcedReturnedSeat.phase, 'success');
assert.equal(forcedReturnedSeat.route, 'standard');
assert.ok(forcedReturnedSeat.journeyTags.includes('returned-seat'));
assert.ok(forcedReturnedSeat.journeyTags.includes('priority-refused'));

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
assert.deepEqual(restored.result?.journeyTags, premiumSuccess.result?.journeyTags);
assert.deepEqual(restoreTicketingState('{"version":2}', catalog), createTicketingState());
assert.deepEqual(restoreTicketingState('{"version":999}', catalog), createTicketingState());

const previewLocalizations = previewEditionIds.map((editionId) =>
  getLocalization(editions[editionId]),
);
const yanLocalization = previewLocalizations[0];
const yanOptions = getTicketingOptions(yanLocalization);
const crossLocaleItem = {
  performanceId: yanOptions[0].performanceId,
  zone: yanOptions[0].offers[0].zone,
  basePrice: yanOptions[0].offers[0].basePrice,
};
const crossLocaleState = updateBasket(
  createTicketingState(),
  crossLocaleItem,
  crossLocaleItem.performanceId,
);
for (const localization of previewLocalizations.slice(1)) {
  const targetOptions = getTicketingOptions(localization);
  const crossLocaleRestored = restoreTicketingState(
    JSON.stringify(crossLocaleState),
    targetOptions.map((option) => ({ performanceId: option.performanceId, offers: option.offers })),
  );
  assert.deepEqual(crossLocaleRestored, crossLocaleState);
  assert.notEqual(yanOptions[0].offers[0].label, targetOptions[0].offers[0].label);
}

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
  zoneLabel: 'A 区',
  number: '123456789012',
  stamps: ['确认入场', '优先线路'],
  messages: yanLocalization.messages.ticketing.artifact,
  locale: 'zh-CN',
});
assert.equal(matrix.length, 21 * 21);
for (const requiredText of [
  artifactPerformance.title,
  artifactPerformance.dateTime,
  artifactPerformance.place,
  'A 区',
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

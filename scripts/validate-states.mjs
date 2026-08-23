#!/usr/bin/env node

import assert from 'node:assert/strict';

import { archiveSnapshots, currentArchiveSnapshot } from '../src/data/archive-snapshots.ts';
import {
  buildContext,
  buildContexts,
  buildProfile,
  editions,
  previewEditionIds,
} from '../src/data/editions.ts';
import { getBuildContext } from '../src/data/content/build-context.ts';
import {
  getWorldPerformanceEntries,
  getWorldProductionIds,
  resolveContent,
} from '../src/data/content/resolve.ts';
import { currentRootSet, validateContentRootSet } from '../src/data/content/root-sets.ts';
import {
  assertPerformanceContentFresh,
  getLocalization,
  getLocalizedPerformanceEntries,
} from '../src/data/localized/resolve.ts';
import { assertPerformanceOfferMatrix } from '../src/data/performance-offers.ts';
import { performances } from '../src/data/performances.ts';
import { getFrontSearchIndex, getSiteSearchScope } from '../src/data/site-search-index.ts';
import {
  assertTerraDateTime,
  compareTerraDateTime,
  derivePerformanceCollection,
  getSiteTerraNow,
} from '../src/data/site-time.ts';
import { getTicketingOptions } from '../src/data/ticketing.ts';
import { shouldRequestArchiveEntry } from '../src/scripts/pollution-controller.ts';
import {
  MAX_POLLUTION_LEVEL,
  POLLUTION_PROBABILITY,
  advancePollution,
  createPollutionState,
  derivePollutionComposition,
  normalizePollutionPath,
  parsePollutionState,
} from '../src/scripts/pollution-state.ts';
import {
  createTicketMatrix,
  createTicketSvg,
  createTicketTexture,
  layoutTicketText,
  segmentTicketGraphemes,
} from '../src/scripts/ticket-artifact.ts';
import {
  MAX_REQUIRING_RESUBMIT_RESULTS,
  acceptRetentionOffer,
  calculateAdjustmentAmount,
  calculateBaseTotal,
  calculateFailureServiceFee,
  createTicketingState,
  declinePremiumOffer,
  declineRetentionOffer,
  deriveTicketStampIds,
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

assert.equal(buildProfile, 'showcase');
assert.equal(buildContext, buildContexts.showcase);
assert.deepEqual(buildContexts.showcase.editionIds, ['yan']);
assert.deepEqual(buildContexts.preview.editionIds, previewEditionIds);
assert.deepEqual(buildContexts.release.editionIds, ['yan']);
assert.throws(() => getBuildContext(buildContexts, 'custom'), /未知构建预设/u);

assert.doesNotThrow(() => validateContentRootSet(currentRootSet, performances));
assert.throws(
  () =>
    validateContentRootSet(
      {
        ...currentRootSet,
        worlds: {
          ...currentRootSet.worlds,
          front: {
            performanceIds: [
              currentRootSet.worlds.front.performanceIds[0],
              currentRootSet.worlds.front.performanceIds[0],
            ],
            featuredPerformanceId: currentRootSet.worlds.front.featuredPerformanceId,
          },
        },
      },
      performances,
    ),
  /含重复场次/u,
);
assert.throws(
  () =>
    validateContentRootSet(
      {
        ...currentRootSet,
        worlds: {
          ...currentRootSet.worlds,
          front: {
            performanceIds: [currentRootSet.worlds.front.performanceIds[0]],
            featuredPerformanceId: currentRootSet.worlds.front.performanceIds[1],
          },
        },
      },
      performances,
    ),
  /焦点不属于该时间层/u,
);
for (const [world, misplacedPerformanceId] of [
  ['front', currentRootSet.worlds.archive.performanceIds[0]],
  ['archive', currentRootSet.worlds.front.performanceIds[0]],
]) {
  const sourceWorld = performances[misplacedPerformanceId].world;
  const sourcePerformanceIds = currentRootSet.worlds[sourceWorld].performanceIds.filter(
    (performanceId) => performanceId !== misplacedPerformanceId,
  );
  assert.throws(
    () =>
      validateContentRootSet(
        {
          ...currentRootSet,
          worlds: {
            ...currentRootSet.worlds,
            [sourceWorld]: {
              performanceIds: sourcePerformanceIds,
              featuredPerformanceId:
                currentRootSet.worlds[sourceWorld].featuredPerformanceId === misplacedPerformanceId
                  ? sourcePerformanceIds[0]
                  : currentRootSet.worlds[sourceWorld].featuredPerformanceId,
            },
            [world]: {
              performanceIds: [misplacedPerformanceId],
              featuredPerformanceId: misplacedPerformanceId,
            },
          },
        },
        performances,
      ),
    /跨时间层场次/u,
  );
}

const showcaseSnapshot = resolveContent(buildContexts.showcase);
const previewSnapshot = resolveContent(buildContexts.preview);
assert.doesNotThrow(() => assertPerformanceOfferMatrix());
assert.equal(showcaseSnapshot.maturity, 'preview');
assert.equal(showcaseSnapshot.performanceEntries.length, 12);
assert.equal(showcaseSnapshot.productionEntries.length, 7);
assert.equal(showcaseSnapshot.locationEntries.length, 7);
assert.equal(showcaseSnapshot.artworkEntries.length, 7);
assert.equal(showcaseSnapshot.seatingPlanEntries.length, 3);
assert.deepEqual(Object.keys(showcaseSnapshot.localizationPackages), ['yan']);
assert.deepEqual(showcaseSnapshot.featuredPerformanceIds, {
  front: 'uncrowned-trimount-1098',
  archive: 'der-ring-zwillingsturme-1091-0817',
});
assert.ok(Object.isFrozen(showcaseSnapshot));
assert.ok(Object.isFrozen(showcaseSnapshot.performanceEntries));
assert.throws(() => resolveContent(buildContexts.release), /不合格内容.*无批准摘要/u);
assert.equal(
  showcaseSnapshot.performanceEntries.filter(
    ([, performance]) => performance.world === 'front' && performance.collection === 'current',
  ).length,
  3,
);
assert.equal(
  showcaseSnapshot.performanceEntries.filter(
    ([, performance]) => performance.world === 'front' && performance.collection === 'history',
  ).length,
  0,
);
assert.equal(
  showcaseSnapshot.performanceEntries.filter(
    ([, performance]) => performance.world === 'archive' && performance.collection === 'current',
  ).length,
  5,
);
assert.equal(
  showcaseSnapshot.performanceEntries.filter(
    ([, performance]) => performance.world === 'archive' && performance.collection === 'history',
  ).length,
  4,
);

const archiveOfferEntries = showcaseSnapshot.performanceEntries.filter(
  ([, performance]) =>
    performance.world === 'archive' && performance.ticketAvailability.state === 'on-sale',
);
const offerSignature = (performance) =>
  performance.ticketAvailability.state === 'on-sale'
    ? performance.ticketAvailability.offers
        .map(({ zone, basePrice }) => `${zone}:${basePrice}`)
        .join('|')
    : '';
assert.equal(archiveOfferEntries.length, 5);
assert.equal(
  new Set(archiveOfferEntries.map(([, performance]) => offerSignature(performance))).size,
  5,
);
assert.deepEqual(
  performances['the-carnival-montelupe-1091-0921'].ticketAvailability.state === 'on-sale'
    ? performances['the-carnival-montelupe-1091-0921'].ticketAvailability.offers.map(
        ({ zone }) => zone,
      )
    : [],
  ['C', 'B', 'A'],
);
assert.notEqual(
  offerSignature(performances['the-carnival-montelupe-1091-0921']),
  offerSignature(performances['the-carnival-londinium-1091-1009']),
  '同剧目异地报价应不同',
);
assert.notEqual(
  offerSignature(performances['der-ring-zwillingsturme-1091-0817']),
  offerSignature(performances['ode-au-triomphe-zwillingsturme-1091-1028']),
  '同地点异剧目报价应不同',
);

const reducedRootSet = {
  ...currentRootSet,
  worlds: {
    ...currentRootSet.worlds,
    front: {
      performanceIds: currentRootSet.worlds.front.performanceIds.slice(1),
      featuredPerformanceId: currentRootSet.worlds.front.performanceIds[1],
    },
  },
};
const reducedSnapshot = resolveContent(buildContexts.showcase, {
  [reducedRootSet.rootSetId]: reducedRootSet,
});
assert.deepEqual(
  getWorldPerformanceEntries(reducedSnapshot, 'front').map(([performanceId]) => performanceId),
  currentRootSet.worlds.front.performanceIds.slice(1),
);
assert.deepEqual(getWorldProductionIds(reducedSnapshot, 'front'), ['caged-fire', 'second-snow']);
assert.equal(reducedSnapshot.performances['uncrowned-trimount-1098'], undefined);
assert.equal(reducedSnapshot.productions.uncrowned, undefined);
assert.equal(reducedSnapshot.locations.trimount, undefined);
assert.equal(reducedSnapshot.artworks.uncrowned, undefined);
assert.equal(reducedSnapshot.seatingPlans['trimount-grand-fan'], undefined);
assert.throws(
  () => getLocalization(editions.higashi, reducedSnapshot),
  /国家版本 higashi 不属于当前内容快照/u,
);
const reducedLocalization = getLocalization(editions.yan, reducedSnapshot);
assert.ok(
  getLocalizedPerformanceEntries(reducedLocalization, reducedSnapshot).every(
    ([performanceId]) => performanceId !== 'uncrowned-trimount-1098',
  ),
);
const reducedSearch = getFrontSearchIndex(editions.yan, reducedSnapshot);
assert.ok(
  reducedSearch.every((entry) => !entry.href.includes('uncrowned-trimount-1098')),
  '集合外场次不得进入搜索索引',
);
assert.deepEqual(
  getTicketingOptions(reducedLocalization, reducedSnapshot).map(
    ({ performanceId }) => performanceId,
  ),
  reducedSnapshot.performanceEntries
    .filter(
      ([, performance]) =>
        performance.world === 'front' && performance.ticketAvailability.state === 'on-sale',
    )
    .map(([performanceId]) => performanceId),
);

const frontNow = getSiteTerraNow('front', buildContexts.showcase);
const archiveNow = getSiteTerraNow('archive', buildContexts.showcase);
assert.deepEqual(
  archiveSnapshots.map(({ snapshotId, state, routeSegment }) => ({
    snapshotId,
    state,
    routeSegment,
  })),
  [
    {
      snapshotId: '1091-07-01T00:00:00',
      state: 'available',
      routeSegment: '1091-07-01',
    },
    { snapshotId: '1093-damaged', state: 'damaged', routeSegment: null },
    { snapshotId: '1096-damaged', state: 'damaged', routeSegment: null },
  ],
);
assert.deepEqual(archiveNow, currentArchiveSnapshot.capturedAt);
assert.equal(getSiteSearchScope(editions.yan, 'front'), 'yan:front');
assert.equal(
  getSiteSearchScope(editions.yan, 'archive'),
  `yan:archive:${currentArchiveSnapshot.snapshotId}`,
);
assert.deepEqual(frontNow, {
  calendar: 'terra',
  year: 1098,
  month: 9,
  day: 1,
  time: '00:00',
});
assert.deepEqual(archiveNow, {
  calendar: 'terra',
  year: 1091,
  month: 7,
  day: 1,
  time: '00:00',
});
assert.deepEqual(
  getSiteTerraNow('front', buildContexts.showcase, new Date('2099-01-01T00:00:00Z')),
  frontNow,
);
assert.throws(
  () =>
    getSiteTerraNow('archive', {
      ...buildContexts.showcase,
      siteClockStrategies: { front: 'fixed', archive: 'anchored' },
    }),
  /只允许 fixed/u,
);
assert.throws(
  () => resolveContent({ ...buildContexts.showcase, rootSetId: 'missing-root-set' }),
  /未知或不匹配的内容根集合/u,
);
for (const invalidDateTime of [
  { ...frontNow, year: 1098.5 },
  { ...frontNow, month: 0 },
  { ...frontNow, month: 13 },
  { ...frontNow, day: 0 },
  { ...frontNow, day: 32 },
  { ...frontNow, time: '24:00' },
  { ...frontNow, time: 'banana' },
]) {
  assert.throws(() => assertTerraDateTime(invalidDateTime), /不是有效的泰拉时间结构/u);
  assert.throws(() => compareTerraDateTime(invalidDateTime, frontNow), /不是有效的泰拉时间结构/u);
}
assert.equal(derivePerformanceCollection(frontNow, frontNow), 'current');
assert.equal(derivePerformanceCollection({ ...frontNow, month: 8, day: 31 }, frontNow), 'history');

const collectionFixtures = [
  {
    label: '未来取消场次仍属于本季演出',
    status: 'cancelled',
    effectiveDateTime: { ...frontNow, day: frontNow.day + 1 },
    expected: 'current',
  },
  {
    label: '历史取消场次仍属于历史演出',
    status: 'cancelled',
    effectiveDateTime: { ...frontNow, month: 8, day: 31 },
    expected: 'history',
  },
  {
    label: '未来待定场次仍属于本季演出',
    status: 'pending',
    effectiveDateTime: { ...frontNow, day: frontNow.day + 2 },
    expected: 'current',
  },
  {
    label: '改期场次按生效日期而非原日期归类',
    status: 'scheduled',
    previousDateTime: { ...frontNow, month: 8, day: 30 },
    effectiveDateTime: { ...frontNow, day: frontNow.day + 3 },
    expected: 'current',
  },
];
for (const fixture of collectionFixtures) {
  assert.equal(
    derivePerformanceCollection(fixture.effectiveDateTime, frontNow),
    fixture.expected,
    fixture.label,
  );
}

const noticeFixturePerformance = {
  ...performances['second-snow-norport-1098'],
  status: 'pending',
  previousDateTime: {
    calendar: 'terra',
    year: 1098,
    month: 10,
    day: 20,
    time: '18:45',
  },
  notice: { reason: 'catastrophe-route', sourceRevision: 'notice-v2' },
};
const noticeFixtureContent = {
  ...getLocalization(editions.yan).programs.performances['second-snow-norport-1098'],
  previousDateTimeDisplay: '1098.10.20 / 18:45',
  operationalNotice: { sourceRevision: 'notice-v2', text: '线路调整，排期等待确认。' },
};
assert.doesNotThrow(() =>
  assertPerformanceContentFresh('notice-fixture', noticeFixturePerformance, noticeFixtureContent),
);
assert.throws(
  () =>
    assertPerformanceContentFresh('notice-fixture', noticeFixturePerformance, {
      ...noticeFixtureContent,
      operationalNotice: undefined,
    }),
  /缺少运营公告译文/u,
);
assert.throws(
  () =>
    assertPerformanceContentFresh('notice-fixture', noticeFixturePerformance, {
      ...noticeFixtureContent,
      operationalNotice: { ...noticeFixtureContent.operationalNotice, sourceRevision: 'notice-v1' },
    }),
  /运营公告译文已过期/u,
);

const pendingPerformanceEntries = showcaseSnapshot.performanceEntries.map(
  ([performanceId, performance]) =>
    performanceId === 'caged-fire-wiesheim-1098'
      ? [performanceId, { ...performance, status: 'pending' }]
      : [performanceId, performance],
);
const pendingSnapshot = {
  ...showcaseSnapshot,
  performanceEntries: pendingPerformanceEntries,
  performances: Object.fromEntries(pendingPerformanceEntries),
};
assert.ok(
  getTicketingOptions(getLocalization(editions.yan), pendingSnapshot).every(
    ({ performanceId }) => performanceId !== 'caged-fire-wiesheim-1098',
  ),
  '待定场次不得进入票务候选',
);

const pollutionTriggers = [
  'front-entry',
  'direct-entry',
  'archive-navigation',
  'archive-locale',
  'archive-search',
];

for (const trigger of pollutionTriggers) {
  let randomCalls = 0;
  const transition = advancePollution(createPollutionState(), trigger, () => {
    randomCalls += 1;
    return 0;
  });
  assert.equal(transition.trigger, trigger);
  assert.equal(transition.advanced, false);
  assert.equal(transition.state.eventCount, 1);
  assert.equal(transition.state.level, 0);
  assert.equal(randomCalls, 0);
}

let protectedPollution = advancePollution(createPollutionState(2), 'front-entry', () => 0).state;
protectedPollution = advancePollution(protectedPollution, 'archive-navigation', () => 0).state;
assert.deepEqual(protectedPollution, {
  version: 2,
  level: 0,
  eventCount: 2,
  variant: 2,
});

let failedRandomCalls = 0;
const failedThirdEvent = advancePollution(protectedPollution, 'archive-search', () => {
  failedRandomCalls += 1;
  return 0.99;
});
assert.equal(failedThirdEvent.state.eventCount, 3);
assert.equal(failedThirdEvent.state.level, 0);
assert.equal(failedThirdEvent.advanced, false);
assert.equal(failedRandomCalls, 1);

for (const trigger of pollutionTriggers) {
  let randomCalls = 0;
  const transition = advancePollution(protectedPollution, trigger, () => {
    randomCalls += 1;
    return 0.1;
  });
  assert.equal(transition.advanced, true);
  assert.equal(transition.state.level, 1);
  assert.equal(transition.state.eventCount, 3);
  assert.equal(randomCalls, 1);
}

let pollution = protectedPollution;
for (const trigger of pollutionTriggers.slice(0, 3)) {
  const transition = advancePollution(pollution, trigger, () => 0.1);
  assert.equal(transition.trigger, trigger);
  assert.equal(transition.advanced, true);
  pollution = transition.state;
}
assert.equal(pollution.level, MAX_POLLUTION_LEVEL);
assert.equal(pollution.eventCount, 5);
let cappedRandomCalls = 0;
const capped = advancePollution(pollution, 'archive-search', () => {
  cappedRandomCalls += 1;
  return 0;
});
assert.equal(capped.state.level, pollution.level);
assert.equal(capped.state.eventCount, pollution.eventCount + 1);
assert.equal(cappedRandomCalls, 0);
assert.deepEqual(parsePollutionState('{"version":2,"level":2,"eventCount":8,"variant":1}'), {
  version: 2,
  level: 2,
  eventCount: 8,
  variant: 1,
});
assert.equal(
  normalizePollutionPath('//yan///archive/site/1091-07-01/'),
  '/yan/archive/site/1091-07-01',
);
const compositionState = { version: 2, level: 3, eventCount: 8, variant: 1 };
const compositionPath = '/yan/archive/site/1091-07-01';
const stableComposition = derivePollutionComposition(compositionState, 'home', compositionPath);
assert.equal(
  derivePollutionComposition(compositionState, 'home', `${compositionPath}/`),
  stableComposition,
  '同一规范路径刷新后应得到相同构图',
);
assert.ok(
  new Set(
    ['home', 'performances', 'performances/history', 'search', 'tickets'].map((segment) =>
      derivePollutionComposition(
        compositionState,
        segment === 'home' ? 'home' : segment.replace('/', '-'),
        `${compositionPath}/${segment === 'home' ? '' : segment}`,
      ),
    ),
  ).size > 1,
  '不同页面职责与规范路径应能派生同强度的其他构图',
);
assert.deepEqual(
  parsePollutionState('{"version":1,"level":2,"variant":1}'),
  createPollutionState(),
);
assert.deepEqual(parsePollutionState('{"version":2}'), createPollutionState());

const firstTabState = advancePollution(createPollutionState(1), 'direct-entry', () => 0).state;
const secondTabState = createPollutionState(2);
assert.equal(firstTabState.eventCount, 1);
assert.equal(secondTabState.eventCount, 0);
assert.equal(secondTabState.variant, 2);

assert.equal(shouldRequestArchiveEntry(false, 'navigate', false), true);
assert.equal(shouldRequestArchiveEntry(true, 'navigate', true), false);
assert.equal(shouldRequestArchiveEntry(false, 'reload', true), false);
assert.equal(shouldRequestArchiveEntry(false, 'back_forward', true), false);
assert.equal(shouldRequestArchiveEntry(false, 'back_forward', false), true);

function probabilityAtLeastThree(trials) {
  return (
    1 -
    [0, 1, 2].reduce((total, successes) => {
      const combinations =
        successes === 0 ? 1 : successes === 1 ? trials : (trials * (trials - 1)) / 2;
      return (
        total +
        combinations *
          POLLUTION_PROBABILITY ** successes *
          (1 - POLLUTION_PROBABILITY) ** (trials - successes)
      );
    }, 0)
  );
}

const probabilityAtLeastThreeInTen = probabilityAtLeastThree(10);
const probabilityAtLeastThreeInFirstTenEvents = probabilityAtLeastThree(8);
assert.ok(probabilityAtLeastThreeInTen > 0.85);
assert.ok(
  probabilityAtLeastThreeInFirstTenEvents > 0.72 && probabilityAtLeastThreeInFirstTenEvents < 0.73,
);

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
assert.deepEqual(premiumSuccess.result?.stampIds, ['admission-confirmed', 'priority-route']);
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
assert.deepEqual(retainedSuccess.result?.stampIds, [
  'admission-confirmed',
  'priority-route',
  'retention-offer',
]);

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
assert.ok(forcedManualReview.result?.stampIds.includes('manual-review'));

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
assert.ok(forcedReturnedSeat.result?.stampIds.includes('returned-seat'));

assert.deepEqual(
  deriveTicketStampIds('standard', [
    'network-retry',
    'priority-refused',
    'retention-accepted',
    'returned-seat',
  ]),
  [
    'admission-confirmed',
    'standard-route',
    'network-recovered',
    'returned-seat',
    'retention-offer',
  ],
);

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
const invalidForcedCombination = {
  ...forcedReturnedSeat,
  journeyTags: [...forcedReturnedSeat.journeyTags, 'manual-review'],
};
assert.deepEqual(
  restoreTicketingState(JSON.stringify(invalidForcedCombination), catalog),
  createTicketingState(),
);
assert.deepEqual(restoreTicketingState('{"version":2}', catalog), createTicketingState());
assert.deepEqual(restoreTicketingState('{"version":999}', catalog), createTicketingState());

const previewLocalizations = previewEditionIds.map((editionId) =>
  getLocalization(editions[editionId], previewSnapshot),
);
const yanLocalization = previewLocalizations[0];
const yanOptions = getTicketingOptions(yanLocalization, previewSnapshot);
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
  const targetOptions = getTicketingOptions(localization, previewSnapshot);
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
const texture = createTicketTexture('123456789012');
assert.deepEqual(texture, createTicketTexture('123456789012'));
assert.notDeepEqual(texture, createTicketTexture('123456789013'));
const artifactStamps = [
  { id: 'admission-confirmed', label: '确认入场' },
  { id: 'priority-route', label: '优先线路' },
  { id: 'network-recovered', label: '网络恢复' },
  { id: 'retention-offer', label: '挽留报价' },
  { id: 'manual-review', label: '人工复核' },
];
const svg = createTicketSvg({
  performance: artifactPerformance,
  basketItem: basketA,
  zoneLabel: 'A 区',
  number: '123456789012',
  stamps: artifactStamps,
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
  '网络恢复',
  '挽留报价',
  '人工复核',
]) {
  assert.ok(svg.includes(requiredText), `票面缺少必要字段：${requiredText}`);
}
for (const stamp of artifactStamps) {
  assert.ok(svg.includes(`data-stamp-id="${stamp.id}"`));
}
assert.ok(svg.includes(`data-ticket-pattern="${texture.signature}"`));
assert.equal(
  svg,
  createTicketSvg({
    performance: artifactPerformance,
    basketItem: basketA,
    zoneLabel: 'A 区',
    number: '123456789012',
    stamps: artifactStamps,
    messages: yanLocalization.messages.ticketing.artifact,
    locale: 'zh-CN',
  }),
);

const unicodeTicketSamples = [
  {
    locale: 'ja-JP',
    value: '星降る夜に名を失った劇場のための長い長い無言劇',
  },
  {
    locale: 'ru',
    value: 'Сверхнепредставительнейшееархивнотеатральноепредставление',
  },
  {
    locale: 'el',
    value: 'Η\u0301 τελευταία παράσταση του περιπλανώμενου θεάτρου στο παλιό λιμάνι',
  },
];
for (const sample of unicodeTicketSamples) {
  const graphemes = segmentTicketGraphemes(sample.value, sample.locale);
  assert.equal(graphemes.join(''), sample.value);
  assert.ok(graphemes.every((grapheme) => !/^\p{Mark}/u.test(grapheme)));
  const layout = layoutTicketText(sample.value, sample.locale, {
    maxWidth: 770,
    preferredFontSize: 54,
    minimumFontSize: 30,
    maxLines: 3,
  });
  assert.ok(layout.fontSize >= 30);
  assert.ok(layout.lines.length <= 3);
  assert.equal(layout.lines.join('').replaceAll(/\s/gu, ''), sample.value.replaceAll(/\s/gu, ''));
}

const unicodeArtifactSvg = createTicketSvg({
  performance: {
    ...artifactPerformance,
    title: unicodeTicketSamples[0].value,
    kind: 'Особое архивное представление',
    dateTime: '1098.09.17 / 19:30 — επόμενη είσοδος',
    place: unicodeTicketSamples[2].value,
  },
  basketItem: basketA,
  zoneLabel: 'Α 区',
  number: '123456789012',
  stamps: artifactStamps,
  messages: yanLocalization.messages.ticketing.artifact,
  locale: 'el',
});
assert.ok(unicodeArtifactSvg.includes('data-ticket-field="title"'));
assert.ok(unicodeArtifactSvg.includes('data-ticket-field="place"'));
assert.ok(unicodeArtifactSvg.includes('data-ticket-line="2"'));
assert.ok(!unicodeArtifactSvg.includes('…'));
assert.ok(unicodeArtifactSvg.includes('<rect x="920"'));

console.log(
  `state validation passed: pollution=${pollutionTriggers.length} triggers, p12-events=${(
    probabilityAtLeastThreeInTen * 100
  ).toFixed(
    4,
  )}%, p10-events=${(probabilityAtLeastThreeInFirstTenEvents * 100).toFixed(4)}%, ticket outcomes=5, matrix=${matrix.length}`,
);

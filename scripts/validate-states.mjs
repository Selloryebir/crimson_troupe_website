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
import { productions } from '../src/data/productions/index.ts';
import { getMinimumSearchGraphemes } from '../src/data/search-policy.ts';
import { getFrontSearchIndex, getSiteSearchScope } from '../src/data/site-search-index.ts';
import {
  assertTerraDateTime,
  compareTerraDateTime,
  derivePerformanceCollection,
  getPerformanceVisibilityWindow,
  getSiteTerraNow,
  isWithinPerformanceVisibilityWindow,
} from '../src/data/site-time.ts';
import { getTicketingOptions, getTicketingPlatformPresentation } from '../src/data/ticketing.ts';
import { shouldRequestArchiveEntry } from '../src/scripts/pollution-controller.ts';
import { countSearchGraphemes, searchSiteEntries } from '../src/scripts/site-search.ts';
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
  STANDARD_FAILURE_THRESHOLD,
  STANDARD_INITIAL_SUCCESS_THRESHOLD,
  STANDARD_SUCCESS_THRESHOLD,
  acceptRetentionOffer,
  calculateAdjustmentAmount,
  calculateBaseTotal,
  calculateFailureServiceFee,
  createTicketingState,
  declinePremiumOffer,
  declineRetentionOffer,
  enterPremiumRoute,
  openPremiumOffer,
  resolveTicketingAttempt as resolveTicketingAttemptAt,
  restoreTicketingState,
  retryTicketingAttempt,
  returnToSelection,
  returnToStandardRoute,
  selectTicketArtifactFinish,
  startTicketingAttempt,
  updateBasket,
} from '../src/scripts/ticketing-state.ts';

assert.equal(buildProfile, 'showcase');
assert.equal(buildContext, buildContexts.showcase);
assert.deepEqual(buildContexts.showcase.editionIds, ['yan']);
assert.deepEqual(buildContexts.preview.editionIds, previewEditionIds);
assert.deepEqual(buildContexts.release.editionIds, ['yan']);
assert.throws(() => getBuildContext(buildContexts, 'custom'), /未知构建预设/u);

assert.doesNotThrow(() =>
  validateContentRootSet(currentRootSet, performances, productions, buildContexts.showcase),
);
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
            homepagePerformanceIds: [currentRootSet.worlds.front.performanceIds[0]],
          },
        },
      },
      performances,
      productions,
      buildContexts.showcase,
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
            homepagePerformanceIds: [currentRootSet.worlds.front.performanceIds[0]],
          },
        },
      },
      performances,
      productions,
      buildContexts.showcase,
    ),
  /焦点不属于该时间层/u,
);
const frontHomepagePerformanceId = currentRootSet.worlds.front.homepagePerformanceIds[0];
assert.throws(
  () =>
    validateContentRootSet(
      {
        ...currentRootSet,
        worlds: {
          ...currentRootSet.worlds,
          front: {
            ...currentRootSet.worlds.front,
            homepagePerformanceIds: [frontHomepagePerformanceId, frontHomepagePerformanceId],
          },
        },
      },
      performances,
      productions,
      buildContexts.showcase,
    ),
  /首页策展含重复场次/u,
);
assert.throws(
  () =>
    validateContentRootSet(
      {
        ...currentRootSet,
        worlds: {
          ...currentRootSet.worlds,
          front: {
            ...currentRootSet.worlds.front,
            homepagePerformanceIds: [currentRootSet.worlds.archive.performanceIds[0]],
          },
        },
      },
      performances,
      productions,
      buildContexts.showcase,
    ),
  /首页策展不属于该时间层根集合/u,
);
assert.throws(
  () =>
    validateContentRootSet(
      {
        ...currentRootSet,
        worlds: {
          ...currentRootSet.worlds,
          front: {
            ...currentRootSet.worlds.front,
            homepagePerformanceIds: [currentRootSet.worlds.front.performanceIds[0]],
          },
        },
      },
      performances,
      productions,
      buildContexts.showcase,
    ),
  /首页策展含非本季场次/u,
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
              homepagePerformanceIds: currentRootSet.worlds[
                sourceWorld
              ].homepagePerformanceIds.filter(
                (performanceId) => performanceId !== misplacedPerformanceId,
              ),
            },
            [world]: {
              performanceIds: [misplacedPerformanceId],
              featuredPerformanceId: misplacedPerformanceId,
              homepagePerformanceIds: [misplacedPerformanceId],
            },
          },
        },
        performances,
        productions,
        buildContexts.showcase,
      ),
    /跨时间层场次/u,
  );
}

const frontNow = getSiteTerraNow('front', buildContexts.showcase);
const archiveNow = getSiteTerraNow('archive', buildContexts.showcase);
assert.deepEqual(getPerformanceVisibilityWindow(frontNow), {
  start: { ...frontNow, year: 1101 },
  end: { ...frontNow, year: 1103 },
});
assert.equal(
  isWithinPerformanceVisibilityWindow(getPerformanceVisibilityWindow(frontNow).start, frontNow),
  true,
  '前一年窗口端点应计入根集合',
);
assert.equal(
  isWithinPerformanceVisibilityWindow(getPerformanceVisibilityWindow(frontNow).end, frontNow),
  true,
  '后一年窗口端点应计入根集合',
);
const oldestFrontPerformanceId = 'caged-fire-jiangdu-1101-0521';
assert.throws(
  () =>
    validateContentRootSet(
      currentRootSet,
      {
        ...performances,
        [oldestFrontPerformanceId]: {
          ...performances[oldestFrontPerformanceId],
          effectiveDateTime: { ...frontNow, year: 1101, month: 4, day: 14 },
        },
      },
      productions,
      buildContexts.showcase,
    ),
  /超出 front 前后一年窗口/u,
);
const overusedFrontPerformanceIds = currentRootSet.worlds.front.performanceIds.slice(0, 4);
const overusedRootSet = {
  ...currentRootSet,
  worlds: {
    ...currentRootSet.worlds,
    front: {
      performanceIds: overusedFrontPerformanceIds,
      featuredPerformanceId: overusedFrontPerformanceIds[0],
      homepagePerformanceIds: [],
    },
  },
};
assert.throws(
  () =>
    validateContentRootSet(
      overusedRootSet,
      Object.fromEntries(
        Object.entries(performances).map(([performanceId, performance]) => [
          performanceId,
          overusedFrontPerformanceIds.includes(performanceId)
            ? { ...performance, productionIds: ['uncrowned'] }
            : performance,
        ]),
      ),
      productions,
      buildContexts.showcase,
    ),
  /剧目编排超过三次：uncrowned\(4\)/u,
);

const showcaseSnapshot = resolveContent(buildContexts.showcase);
const previewSnapshot = resolveContent(buildContexts.preview);
assert.doesNotThrow(() => assertPerformanceOfferMatrix());
assert.equal(showcaseSnapshot.maturity, 'preview');
assert.equal(showcaseSnapshot.performanceEntries.length, 28);
assert.equal(showcaseSnapshot.productionEntries.length, 14);
assert.equal(showcaseSnapshot.locationEntries.length, 10);
assert.equal(showcaseSnapshot.artworkEntries.length, 14);
assert.equal(showcaseSnapshot.seatingPlanEntries.length, 7);
assert.deepEqual(showcaseSnapshot.editionIds, ['yan']);
assert.deepEqual(
  new Set(showcaseSnapshot.localizationPackageEditionIds),
  new Set(['yan', 'columbia', 'leithanien', 'victoria', 'siracusa']),
  'showcase 只生成炎国页面，但票面闭包必须包含全部实际举办地语言依赖',
);
assert.deepEqual(showcaseSnapshot.featuredPerformanceIds, {
  front: 'uncrowned-trimount-1102',
  archive: 'der-ring-zwillingsturme-1084-0817',
});
assert.deepEqual(showcaseSnapshot.homepagePerformanceIds, {
  front: currentRootSet.worlds.front.homepagePerformanceIds,
  archive: currentRootSet.worlds.archive.homepagePerformanceIds,
});
assert.ok(Object.isFrozen(showcaseSnapshot));
assert.ok(Object.isFrozen(showcaseSnapshot.performanceEntries));
assert.ok(Object.isFrozen(showcaseSnapshot.ticketingPlatformEntries));
assert.deepEqual(
  showcaseSnapshot.ticketingPlatformEntries.map(([platformId]) => platformId),
  ['rice-network', 'drop-tower'],
);
assert.equal(
  getTicketingPlatformPresentation(
    getLocalization(editions.yan, showcaseSnapshot),
    'rice-network',
    showcaseSnapshot,
  ).displayName,
  '水稻网',
);
assert.equal(
  getTicketingPlatformPresentation(
    getLocalization(editions.columbia, previewSnapshot),
    'drop-tower',
    previewSnapshot,
  ).displayName,
  'Drop Tower',
);
assert.ok(Object.isFrozen(showcaseSnapshot.homepagePerformanceIds));
assert.ok(Object.isFrozen(showcaseSnapshot.homepagePerformanceIds.front));
assert.ok(Object.isFrozen(showcaseSnapshot.homepagePerformanceIds.archive));
assert.throws(() => resolveContent(buildContexts.release), /不合格内容.*无批准摘要/u);
assert.equal(
  showcaseSnapshot.performanceEntries.filter(
    ([, performance]) => performance.world === 'front' && performance.collection === 'current',
  ).length,
  7,
);
assert.equal(
  showcaseSnapshot.performanceEntries.filter(
    ([, performance]) => performance.world === 'front' && performance.collection === 'history',
  ).length,
  4,
);
assert.equal(
  showcaseSnapshot.performanceEntries.filter(
    ([, performance]) => performance.world === 'archive' && performance.collection === 'current',
  ).length,
  9,
);
assert.equal(
  showcaseSnapshot.performanceEntries.filter(
    ([, performance]) => performance.world === 'archive' && performance.collection === 'history',
  ).length,
  8,
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
  performances['the-carnival-montelupe-1084-0921'].ticketAvailability.state === 'on-sale'
    ? performances['the-carnival-montelupe-1084-0921'].ticketAvailability.offers.map(
        ({ zone }) => zone,
      )
    : [],
  ['C', 'B', 'A'],
);
assert.notEqual(
  offerSignature(performances['the-carnival-montelupe-1084-0921']),
  offerSignature(performances['the-carnival-londinium-1084-1009']),
  '同剧目异地报价应不同',
);
assert.notEqual(
  offerSignature(performances['der-ring-zwillingsturme-1084-0817']),
  offerSignature(performances['ode-au-triomphe-zwillingsturme-1084-1028']),
  '同地点异剧目报价应不同',
);

const searchEntry = (id, type, title, summary = '', keywords = '') => ({
  id,
  type,
  typeLabel: type,
  title,
  summary,
  keywords,
  href: `/${id}/`,
});
const searchOrganizationEntries = [
  searchEntry(
    'performance-title-first',
    'performance',
    'Needle Matinee',
    'First performance title match',
  ),
  searchEntry('page-detail', 'page', 'Archive guide', 'Needle appears only in this summary'),
  searchEntry('performance-title-second', 'performance', 'Second Needle Matinee'),
  searchEntry('page-title', 'page', 'Needle register'),
  searchEntry('production-title', 'production', 'Needle libretto'),
  searchEntry('performance-detail', 'performance', 'Evening register', '', 'Needle'),
  searchEntry(
    'production-detail',
    'production',
    'Evening libretto',
    'Needle appears only in this summary',
  ),
];
const organizedSearchMatches = searchSiteEntries(
  searchOrganizationEntries,
  'ＮＥＥＤＬＥ',
  'en-US',
);
assert.deepEqual(
  organizedSearchMatches.map(({ entry }) => entry.id),
  [
    'page-title',
    'performance-title-first',
    'performance-title-second',
    'production-title',
    'page-detail',
    'performance-detail',
    'production-detail',
  ],
  '搜索应先按标题命中、再按页面类型组织，并保持同组索引顺序',
);
assert.deepEqual(
  organizedSearchMatches.map(({ matchKind }) => matchKind),
  ['title', 'title', 'title', 'title', 'detail', 'detail', 'detail'],
);
assert.deepEqual(
  organizedSearchMatches
    .filter(({ startsTypeGroup }) => startsTypeGroup)
    .map(({ entry, matchKind }) => `${matchKind}:${entry.type}`),
  [
    'title:page',
    'title:performance',
    'title:production',
    'detail:page',
    'detail:performance',
    'detail:production',
  ],
);
assert.deepEqual(searchSiteEntries(searchOrganizationEntries, '', 'en-US'), []);
assert.deepEqual(searchSiteEntries(searchOrganizationEntries, 'needel', 'en-US'), []);
assert.equal(getMinimumSearchGraphemes('yan'), 2);
assert.equal(getMinimumSearchGraphemes('higashi'), 2);
for (const editionId of previewEditionIds.filter(
  (editionId) => editionId !== 'yan' && editionId !== 'higashi',
)) {
  assert.equal(getMinimumSearchGraphemes(editionId), 3);
}
assert.equal(countSearchGraphemes('e\u0301', 'el'), 1, '组合字符应按一个字素计数');
assert.equal(countSearchGraphemes('👨‍👩‍👧‍👦', 'en-US'), 1, 'ZWJ 字符序列应按一个字素计数');

const fullFrontSearch = getFrontSearchIndex(editions.yan, showcaseSnapshot);
const uncrownedSearchEntry = fullFrontSearch.find(({ id }) => id === 'front-production-uncrowned');
const uncrownedContent = getLocalization(editions.yan, showcaseSnapshot).programs.productions
  .uncrowned;
assert.ok(uncrownedSearchEntry && uncrownedContent);
assert.match(uncrownedSearchEntry.keywords, new RegExp(uncrownedContent.synopsis, 'u'));
assert.match(uncrownedSearchEntry.keywords, new RegExp(uncrownedContent.guidance, 'u'));
assert.ok(
  uncrownedContent.creatives.every(([role, name]) =>
    uncrownedSearchEntry.keywords.includes(`${role} ${name}`),
  ),
  '剧目主创职责与姓名应进入公开匹配文字',
);

const homepageExcludedPerformanceId = 'procession-of-masks-londinium-1103-0214';
const curatedRootSet = {
  ...currentRootSet,
  worlds: {
    ...currentRootSet.worlds,
    front: {
      ...currentRootSet.worlds.front,
      homepagePerformanceIds: currentRootSet.worlds.front.homepagePerformanceIds.filter(
        (performanceId) => performanceId !== homepageExcludedPerformanceId,
      ),
    },
  },
};
const curatedSnapshot = resolveContent(buildContexts.showcase, {
  [curatedRootSet.rootSetId]: curatedRootSet,
});
assert.ok(curatedSnapshot.performances[homepageExcludedPerformanceId]);
assert.ok(
  getWorldPerformanceEntries(curatedSnapshot, 'front').some(
    ([performanceId]) => performanceId === homepageExcludedPerformanceId,
  ),
  '首页策展不得裁剪完整本季集合',
);
assert.ok(
  !curatedSnapshot.homepagePerformanceIds.front.includes(homepageExcludedPerformanceId),
  '首页策展应能独立排除仍属于完整本季集合的场次',
);

const excludedPerformanceId = 'procession-of-masks-londinium-1103-0214';
const reducedFrontPerformanceIds = currentRootSet.worlds.front.performanceIds.filter(
  (performanceId) => performanceId !== excludedPerformanceId,
);
const reducedRootSet = {
  ...currentRootSet,
  worlds: {
    ...currentRootSet.worlds,
    front: {
      performanceIds: reducedFrontPerformanceIds,
      featuredPerformanceId: currentRootSet.worlds.front.featuredPerformanceId,
      homepagePerformanceIds: currentRootSet.worlds.front.homepagePerformanceIds.filter(
        (performanceId) => performanceId !== excludedPerformanceId,
      ),
    },
  },
};
const reducedSnapshot = resolveContent(buildContexts.showcase, {
  [reducedRootSet.rootSetId]: reducedRootSet,
});
assert.deepEqual(
  getWorldPerformanceEntries(reducedSnapshot, 'front').map(([performanceId]) => performanceId),
  reducedFrontPerformanceIds,
);
assert.ok(!getWorldProductionIds(reducedSnapshot, 'front').includes('procession-of-masks'));
assert.equal(reducedSnapshot.performances[excludedPerformanceId], undefined);
assert.equal(reducedSnapshot.productions['procession-of-masks'], undefined);
assert.equal(reducedSnapshot.artworks['procession-of-masks'], undefined);
assert.throws(
  () => getLocalization(editions.higashi, reducedSnapshot),
  /国家版本 higashi 不属于当前内容快照/u,
);
const reducedLocalization = getLocalization(editions.yan, reducedSnapshot);
assert.ok(
  getLocalizedPerformanceEntries(reducedLocalization, reducedSnapshot).every(
    ([performanceId]) => performanceId !== excludedPerformanceId,
  ),
);
const reducedSearch = getFrontSearchIndex(editions.yan, reducedSnapshot);
assert.ok(
  reducedSearch.every((entry) => !entry.href.includes(excludedPerformanceId)),
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

assert.deepEqual(
  archiveSnapshots.map(({ snapshotId, state, routeSegment }) => ({
    snapshotId,
    state,
    routeSegment,
  })),
  [
    {
      snapshotId: '1084-07-01T00:00:00',
      state: 'available',
      routeSegment: '1084-07-01',
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
  year: 1102,
  month: 4,
  day: 15,
  time: '00:00',
});
assert.deepEqual(archiveNow, {
  calendar: 'terra',
  year: 1084,
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
  { ...frontNow, year: 1102.5 },
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
assert.equal(derivePerformanceCollection({ ...frontNow, day: 14 }, frontNow), 'history');

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
    effectiveDateTime: { ...frontNow, day: 14 },
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
  ...performances['second-snow-norport-1102'],
  status: 'pending',
  previousDateTime: {
    calendar: 'terra',
    year: 1102,
    month: 10,
    day: 20,
    time: '18:45',
  },
  notice: { reason: 'catastrophe-route', sourceRevision: 'notice-v2' },
};
const noticeFixtureContent = {
  ...getLocalization(editions.yan).programs.performances['second-snow-norport-1102'],
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
    performanceId === 'caged-fire-wiesheim-1102'
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
    ({ performanceId }) => performanceId !== 'caged-fire-wiesheim-1102',
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
  normalizePollutionPath('//yan///archive/site/1084-07-01/'),
  '/yan/archive/site/1084-07-01',
);
const compositionState = { version: 2, level: 3, eventCount: 8, variant: 1 };
const compositionPath = '/yan/archive/site/1084-07-01';
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
const ticketAcceptedAt = {
  calendar: 'terra',
  year: 1102,
  month: 4,
  day: 15,
  time: '00:00',
};
const resolveTicketingAttempt = (state, random, ticketNumberFactory) =>
  resolveTicketingAttemptAt(state, random, ticketNumberFactory, ticketAcceptedAt);

let selection = createTicketingState();
selection = updateBasket(selection, basketA, basketA.performanceId);
selection = updateBasket(selection, basketB, basketB.performanceId);
assert.equal(selection.basket.length, 2);
assert.equal(calculateBaseTotal(selection.basket), 1100);

const started = startTicketingAttempt(selection);
assert.equal(STANDARD_INITIAL_SUCCESS_THRESHOLD, 0.12);
assert.equal(STANDARD_SUCCESS_THRESHOLD, 0.32);
assert.equal(STANDARD_FAILURE_THRESHOLD, 0.68);
assert.equal(
  resolveTicketingAttempt(
    started,
    () => 0.119,
    () => '000000000000',
  ).phase,
  'success',
);
assert.equal(
  resolveTicketingAttempt(
    started,
    () => 0.12,
    () => '000000000000',
  ).phase,
  'failure',
);
assert.equal(
  resolveTicketingAttempt(
    started,
    () => 0.679,
    () => '000000000000',
  ).phase,
  'failure',
);
assert.equal(
  resolveTicketingAttempt(
    started,
    () => 0.68,
    () => '000000000000',
  ).phase,
  'network',
);
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
assert.equal(standardSuccess.currentEndingId, 'ENDING_NORMAL_SUCCESS');
assert.deepEqual(standardSuccess.endingHistory, ['ENDING_NORMAL_SUCCESS']);
assert.deepEqual(standardSuccess.result?.acceptedAt, ticketAcceptedAt);
assert.equal(standardSuccess.result?.artifactFinishId, null);
assert.equal(standardFailure.phase, 'failure');
assert.equal(standardFailure.currentEndingId, null);
assert.equal(standardFailure.attemptCount, 1);
assert.equal(standardFailure.lastOutcome, 'unavailable');
assert.equal(networkFailure.phase, 'network');
assert.equal(networkFailure.currentEndingId, 'ENDING_NETWORK_ERROR');
assert.deepEqual(networkFailure.endingHistory, ['ENDING_NETWORK_ERROR']);
assert.equal(networkFailure.attemptCount, 1);
const networkRetry = retryTicketingAttempt(networkFailure);
assert.deepEqual(networkRetry.basket, selection.basket);
assert.deepEqual(networkRetry.journeyTags, ['network-retry']);
assert.equal(
  resolveTicketingAttempt(
    networkRetry,
    () => 0.319,
    () => '000000000000',
  ).phase,
  'success',
  '普通线路重试仍应保留原有成功阈值',
);
assert.equal(
  resolveTicketingAttempt(
    networkRetry,
    () => 0.32,
    () => '000000000000',
  ).phase,
  'failure',
);
const networkThenSuccess = resolveTicketingAttempt(
  networkRetry,
  () => 0.1,
  () => '333333333333',
);
assert.deepEqual(networkThenSuccess.result?.endingHistory, [
  'ENDING_NETWORK_ERROR',
  'ENDING_NORMAL_SUCCESS',
]);
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
assert.equal(premiumOffer.currentEndingId, null);
assert.deepEqual(premiumOffer.endingHistory, []);
assert.equal(premiumOffer.route, 'standard');
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
assert.equal(premiumSuccess.currentEndingId, 'ENDING_SCALPER_SUCCESS');
assert.equal(premiumFailure.currentEndingId, 'ENDING_SCALPER_FAILED');
assert.equal(premiumSuccess.result?.baseTotal, 1100);
assert.deepEqual(premiumSuccess.result?.adjustments, [{ id: 'priority-service', amount: 550 }]);
assert.equal(premiumSuccess.result?.settledTotal, 1650);
assert.deepEqual(premiumSuccess.result?.endingHistory, ['ENDING_SCALPER_SUCCESS']);
const premiumFailureThenSuccess = resolveTicketingAttempt(
  retryTicketingAttempt(premiumFailure),
  () => 0.1,
  () => '444444444444',
);
assert.deepEqual(premiumFailureThenSuccess.result?.endingHistory, [
  'ENDING_SCALPER_FAILED',
  'ENDING_SCALPER_SUCCESS',
]);
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
const retainedFailure = resolveTicketingAttempt(
  retainedAttempt,
  () => 0.9,
  () => '000000000000',
);
assert.equal(retainedSuccess.currentEndingId, 'ENDING_DISCOUNT_SUCCESS');
assert.equal(retainedFailure.currentEndingId, 'ENDING_DISCOUNT_FAILED');
assert.deepEqual(retainedSuccess.result?.adjustments, [
  { id: 'priority-service', amount: 550 },
  { id: 'retention-service', amount: -22 },
]);
assert.equal(retainedSuccess.result?.settledTotal, 1628);
assert.equal(
  retainedSuccess.result?.baseTotal +
    retainedSuccess.result?.adjustments.reduce((total, item) => total + item.amount, 0),
  retainedSuccess.result?.settledTotal,
);
assert.deepEqual(retainedSuccess.result?.endingHistory, ['ENDING_DISCOUNT_SUCCESS']);
const retainedFailureThenSuccess = resolveTicketingAttempt(
  retryTicketingAttempt(retainedFailure),
  () => 0.1,
  () => '666666666666',
);
assert.deepEqual(retainedFailureThenSuccess.result?.endingHistory, [
  'ENDING_DISCOUNT_FAILED',
  'ENDING_DISCOUNT_SUCCESS',
]);

const retentionDeclined = declineRetentionOffer(firstRetentionOffer);
assert.equal(retentionDeclined.phase, 'selection');
assert.equal(retentionDeclined.currentEndingId, 'ENDING_REJECT_RESCALPER');
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
assert.equal(forcedManualReview.currentEndingId, 'ENDING_NORMAL_SUCCESS');
assert.equal(forcedManualReview.route, 'standard');
assert.ok(forcedManualReview.journeyTags.includes('manual-review'));
assert.deepEqual(forcedManualReview.result?.endingHistory, ['ENDING_NORMAL_SUCCESS']);

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
assert.deepEqual(forcedReturnedSeat.result?.endingHistory, [
  'ENDING_REJECT_RESCALPER',
  'ENDING_NORMAL_SUCCESS',
]);

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
assert.deepEqual(restored.result?.endingHistory, premiumSuccess.result?.endingHistory);
assert.deepEqual(restored.result?.acceptedAt, ticketAcceptedAt);
assert.equal(restored.result?.artifactFinishId, null);
const finishedPremiumSuccess = selectTicketArtifactFinish(premiumSuccess, 'registration-shift');
assert.equal(finishedPremiumSuccess.result?.artifactFinishId, 'registration-shift');
assert.equal(premiumSuccess.result?.artifactFinishId, null, '票面整理不得修改原冻结结果对象');
assert.equal(
  selectTicketArtifactFinish(standardFailure, 'deckle-edge'),
  standardFailure,
  '非成功阶段不得选择票面整理',
);
const restoredFinished = restoreTicketingState(JSON.stringify(finishedPremiumSuccess), catalog);
assert.equal(restoredFinished.result?.artifactFinishId, 'registration-shift');
const invalidFinish = structuredClone(finishedPremiumSuccess);
invalidFinish.result.artifactFinishId = 'rare-random-finish';
assert.deepEqual(
  restoreTicketingState(JSON.stringify(invalidFinish), catalog),
  createTicketingState(),
  '未知票面整理必须安全重置会话',
);
const missingAcceptanceTime = structuredClone(premiumSuccess);
delete missingAcceptanceTime.result.acceptedAt;
assert.deepEqual(
  restoreTicketingState(JSON.stringify(missingAcceptanceTime), catalog),
  createTicketingState(),
);
const invalidForcedCombination = {
  ...forcedReturnedSeat,
  journeyTags: [...forcedReturnedSeat.journeyTags, 'manual-review'],
};
assert.deepEqual(
  restoreTicketingState(JSON.stringify(invalidForcedCombination), catalog),
  createTicketingState(),
);
assert.deepEqual(restoreTicketingState('{"version":2}', catalog), createTicketingState());
assert.deepEqual(restoreTicketingState('{"version":3}', catalog), createTicketingState());
assert.deepEqual(restoreTicketingState('{"version":4}', catalog), createTicketingState());
assert.deepEqual(restoreTicketingState('{"version":5}', catalog), createTicketingState());
assert.deepEqual(restoreTicketingState('{"version":6}', catalog), createTicketingState());
assert.deepEqual(restoreTicketingState('{"version":999}', catalog), createTicketingState());

const previewLocalizations = previewEditionIds.map((editionId) =>
  getLocalization(editions[editionId], previewSnapshot),
);
const yanLocalization = previewLocalizations[0];
const yanOptions = getTicketingOptions(yanLocalization, previewSnapshot);
assert.deepEqual(
  yanOptions.map(({ performanceId }) => performanceId),
  previewSnapshot.homepagePerformanceIds.front,
  '当前表站首页策展场次与票务候选必须保持相同顺序',
);
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
const crossLocaleSuccess = resolveTicketingAttempt(
  startTicketingAttempt(crossLocaleState),
  () => 0.1,
  () => '777777777777',
);
for (const localization of previewLocalizations.slice(1)) {
  const targetOptions = getTicketingOptions(localization, previewSnapshot);
  const crossLocaleRestored = restoreTicketingState(
    JSON.stringify(crossLocaleState),
    targetOptions.map((option) => ({ performanceId: option.performanceId, offers: option.offers })),
  );
  assert.deepEqual(crossLocaleRestored, crossLocaleState);
  const crossLocaleSuccessRestored = restoreTicketingState(
    JSON.stringify(crossLocaleSuccess),
    targetOptions.map((option) => ({ performanceId: option.performanceId, offers: option.offers })),
  );
  assert.deepEqual(crossLocaleSuccessRestored.result?.acceptedAt, ticketAcceptedAt);
  assert.deepEqual(crossLocaleSuccessRestored.result?.tickets, crossLocaleSuccess.result?.tickets);
  assert.equal(
    crossLocaleSuccessRestored.result?.settledTotal,
    crossLocaleSuccess.result?.settledTotal,
  );
  assert.notEqual(yanOptions[0].offers[0].label, targetOptions[0].offers[0].label);
  assert.deepEqual(
    targetOptions[0].artifact.primary,
    yanOptions[0].artifact.primary,
    '网站国家版本切换不得改变由举办地决定的票面主语言投影',
  );
  const sharesPrimaryLanguage =
    targetOptions[0].artifact.primary.locale.split('-')[0] ===
    localization.edition.locale.split('-')[0];
  assert.equal(
    targetOptions[0].artifact.secondary?.editionId,
    sharesPrimaryLanguage ? undefined : localization.edition.editionId,
  );
}

const trimountArtifact = yanOptions.find(
  ({ performanceId }) => performanceId === 'uncrowned-trimount-1102',
)?.artifact;
const wiesheimArtifact = yanOptions.find(
  ({ performanceId }) => performanceId === 'caged-fire-wiesheim-1102',
)?.artifact;
const norportArtifact = yanOptions.find(
  ({ performanceId }) => performanceId === 'second-snow-norport-1102',
)?.artifact;
const leithanienOptions = getTicketingOptions(
  getLocalization(editions.leithanien, previewSnapshot),
  previewSnapshot,
);
const columbiaOptions = getTicketingOptions(
  getLocalization(editions.columbia, previewSnapshot),
  previewSnapshot,
);
const leithanienWiesheimArtifact = leithanienOptions.find(
  ({ performanceId }) => performanceId === 'caged-fire-wiesheim-1102',
)?.artifact;
const columbiaNorportArtifact = columbiaOptions.find(
  ({ performanceId }) => performanceId === 'second-snow-norport-1102',
)?.artifact;
assert.equal(trimountArtifact?.primary.editionId, 'columbia');
assert.equal(trimountArtifact?.secondary?.editionId, 'yan');
assert.equal(trimountArtifact?.primary.dateTime, 'September 17, 1102 at 7:30 PM');
assert.equal(trimountArtifact?.secondary?.dateTime, '1102年9月17日 19:30');
assert.equal(wiesheimArtifact?.primary.editionId, 'leithanien');
assert.equal(wiesheimArtifact?.secondary?.editionId, 'yan');
assert.equal(norportArtifact?.primary.editionId, 'victoria');
assert.equal(norportArtifact?.secondary?.editionId, 'yan');
assert.equal(leithanienWiesheimArtifact?.primary.editionId, 'leithanien');
assert.equal(leithanienWiesheimArtifact?.secondary, undefined);
assert.equal(columbiaNorportArtifact?.primary.editionId, 'victoria');
assert.equal(columbiaNorportArtifact?.secondary, undefined);

const artifactPerformance = {
  performanceId: 'performance-a',
  title: '《候选验收》',
  kind: '测试剧目',
  dateTime: '1102.09.17 / 19:30',
  place: '特里蒙大剧院',
  visual: 'moon',
  offers: catalog[0].offers,
};
const matrix = createTicketMatrix('123456789012');
const texture = createTicketTexture('123456789012');
assert.deepEqual(texture, createTicketTexture('123456789012'));
assert.notDeepEqual(texture, createTicketTexture('123456789013'));
const artifactEndingHistory = [
  'ENDING_NETWORK_ERROR',
  'ENDING_REJECT_RESCALPER',
  'ENDING_DISCOUNT_FAILED',
  'ENDING_DISCOUNT_SUCCESS',
];
const artifactJourneyTags = ['network-retry', 'priority-refused', 'retention-accepted'];
for (const [performanceId, expectedPrimaryLocale, expectedSecondaryLocale] of [
  ['uncrowned-trimount-1102', 'en-US', 'zh-CN'],
  ['caged-fire-wiesheim-1102', 'de', 'zh-CN'],
  ['second-snow-norport-1102', 'en-GB', 'zh-CN'],
]) {
  const option = yanOptions.find((candidate) => candidate.performanceId === performanceId);
  assert.ok(option, `${performanceId} 应属于当前票务候选`);
  const offer = option.offers[0];
  const actualProjectionSvg = createTicketSvg({
    performance: option,
    basketItem: {
      performanceId: option.performanceId,
      zone: offer.zone,
      basePrice: offer.basePrice,
    },
    number: '321098765432',
    endingHistory: artifactEndingHistory,
    journeyTags: artifactJourneyTags,
    projection: option.artifact,
    artifactFinishId: 'deckle-edge',
  });
  assert.ok(
    actualProjectionSvg.includes(`data-ticket-language="primary" lang="${expectedPrimaryLocale}"`),
  );
  if (expectedSecondaryLocale) {
    assert.ok(
      actualProjectionSvg.includes(
        `data-ticket-language="secondary" lang="${expectedSecondaryLocale}"`,
      ),
    );
  } else {
    assert.ok(!actualProjectionSvg.includes('data-ticket-language="secondary"'));
  }
}
assert.deepEqual(
  Object.keys(yanOptions[0].artifact.primary).sort(),
  ['dateTime', 'editionId', 'kind', 'locale', 'messages', 'place', 'title', 'zoneLabels'],
  '客户端票面投影不得携带完整辅助语言包',
);
const artifactProjection = {
  primary: {
    editionId: 'yan',
    locale: 'zh-CN',
    title: artifactPerformance.title,
    kind: artifactPerformance.kind,
    dateTime: artifactPerformance.dateTime,
    place: artifactPerformance.place,
    zoneLabels: { A: 'A 区' },
    messages: yanLocalization.messages.ticketing.artifact,
  },
  secondary: {
    editionId: 'victoria',
    locale: 'en-GB',
    title: 'Candidate Review',
    kind: 'Test production',
    dateTime: '1102 · 09/17 · 19:30',
    place: 'Trimount Grand Theatre',
    zoneLabels: { A: 'Zone A' },
    messages: getLocalization(editions.victoria, previewSnapshot).messages.ticketing.artifact,
  },
};
const svg = createTicketSvg({
  performance: artifactPerformance,
  basketItem: basketA,
  number: '123456789012',
  endingHistory: artifactEndingHistory,
  journeyTags: artifactJourneyTags,
  projection: artifactProjection,
  artifactFinishId: 'registration-shift',
});
assert.equal(matrix.length, 21 * 21);
for (const requiredText of [
  artifactPerformance.title,
  artifactPerformance.dateTime,
  artifactPerformance.place,
  'A 区',
  `${basketA.basePrice} LMD`,
  '123456789012',
]) {
  assert.ok(svg.includes(requiredText), `票面缺少必要字段：${requiredText}`);
}
for (const fieldGroup of ['production', 'date-time', 'venue', 'zone']) {
  assert.ok(svg.includes(`data-ticket-field-group="${fieldGroup}"`));
}
const ticketFieldOrder = [
  'data-ticket-field="title"',
  'data-ticket-field="secondary-title"',
  'data-ticket-field="kind"',
  'data-ticket-field="date-time"',
  'data-ticket-field="secondary-date-time"',
  'data-ticket-field="place"',
  'data-ticket-field="secondary-place"',
].map((field) => svg.indexOf(field));
assert.ok(
  ticketFieldOrder.every((index) => index >= 0),
  '双语票面字段组必须完整',
);
assert.deepEqual(
  [...ticketFieldOrder].sort((left, right) => left - right),
  ticketFieldOrder,
  '主辅标题、日期和场馆必须按字段成组排列',
);
for (const endingId of [
  'ENDING_NETWORK_ERROR',
  'ENDING_NORMAL_SUCCESS',
  'ENDING_REJECT_RESCALPER',
  'ENDING_SCALPER_SUCCESS',
  'ENDING_SCALPER_FAILED',
  'ENDING_DISCOUNT_SUCCESS',
  'ENDING_DISCOUNT_FAILED',
]) {
  assert.ok(svg.includes(`data-ending-component="${endingId}"`));
  assert.ok(
    svg.includes(
      `data-ending-component="${endingId}" data-active="${artifactEndingHistory.includes(endingId)}"`,
    ),
  );
}
assert.ok(svg.includes('data-ticket-composite-stamp=""'));
assert.ok(svg.includes('data-ticket-finish="registration-shift"'));
assert.doesNotMatch(svg, /<[^>]+\sdata-[\w-]+(?:\s|>)/u, 'SVG 数据属性必须具有 XML 合法值');
assert.ok(!svg.includes('data-stamp-id='));
assert.ok(svg.includes(`data-ticket-pattern="${texture.signature}"`));
assert.equal(
  svg,
  createTicketSvg({
    performance: artifactPerformance,
    basketItem: basketA,
    number: '123456789012',
    endingHistory: artifactEndingHistory,
    journeyTags: artifactJourneyTags,
    projection: artifactProjection,
    artifactFinishId: 'registration-shift',
  }),
);

for (const finishId of ['deckle-edge', 'registration-shift', 'ticket-punch']) {
  const finishedSvg = createTicketSvg({
    performance: artifactPerformance,
    basketItem: basketA,
    number: '123456789012',
    endingHistory: artifactEndingHistory,
    journeyTags: artifactJourneyTags,
    projection: artifactProjection,
    artifactFinishId: finishId,
  });
  assert.ok(finishedSvg.includes(`data-ticket-finish="${finishId}"`));
  if (finishId === 'deckle-edge') {
    assert.ok(finishedSvg.includes('<clipPath id="ticket-finish-shape"'));
    assert.ok(finishedSvg.includes('clip-path="url(#ticket-finish-shape)"'));
  }
  if (finishId === 'registration-shift') {
    assert.ok(finishedSvg.includes('stroke="#2f6b76"'));
    assert.ok(!finishedSvg.includes('transform="rotate('));
  }
  if (finishId === 'ticket-punch') {
    assert.ok(finishedSvg.includes('<mask id="ticket-finish-shape"'));
    assert.ok(finishedSvg.includes('mask="url(#ticket-finish-shape)"'));
    assert.ok(
      finishedSvg.indexOf('<rect width="28" height="540"') <
        finishedSvg.indexOf('<g data-ticket-finish="ticket-punch"'),
      '票钳孔轮廓必须绘制在左侧色带之后',
    );
  }
}

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
    maxHeight: 102,
    preferredFontSize: 54,
    minimumFontSize: 30,
    maxLines: 3,
  });
  assert.ok(layout.fontSize >= 30);
  assert.ok(layout.lines.length <= 3);
  assert.equal(layout.lines.join('').replaceAll(/\s/gu, ''), sample.value.replaceAll(/\s/gu, ''));
  assert.ok(128 + layout.lines.length * layout.lineHeight <= 230, '票面标题不得侵入下一字段区域');
}
assert.throws(
  () =>
    layoutTicketText('W'.repeat(400), 'en-US', {
      maxWidth: 770,
      maxHeight: 102,
      preferredFontSize: 54,
      minimumFontSize: 30,
      maxLines: 3,
    }),
  /最小字号 30 下仍超过 3 行或 102 像素高度/u,
);

const unicodeArtifactSvg = createTicketSvg({
  performance: {
    ...artifactPerformance,
    title: unicodeTicketSamples[0].value,
    kind: 'Особое архивное представление',
    dateTime: '1102.09.17 / 19:30 — επόμενη είσοδος',
    place: unicodeTicketSamples[2].value,
  },
  basketItem: basketA,
  number: '123456789012',
  endingHistory: artifactEndingHistory,
  journeyTags: artifactJourneyTags,
  artifactFinishId: 'ticket-punch',
  projection: {
    primary: {
      ...artifactProjection.primary,
      editionId: 'higashi',
      locale: 'ja-JP',
      title: unicodeTicketSamples[0].value,
      kind: '特別上演',
      dateTime: '1102.09.17 / 19:30',
      place: '極東巡回劇場',
      zoneLabels: { A: 'A区' },
    },
    secondary: {
      ...artifactProjection.secondary,
      title: 'The Theatre That Lost Its Name Beneath Falling Stars',
      place: 'Higashi Touring Theatre',
    },
  },
});
assert.ok(unicodeArtifactSvg.includes('data-ticket-field="title"'));
assert.ok(unicodeArtifactSvg.includes('data-ticket-field="place"'));
assert.ok(unicodeArtifactSvg.includes('data-ticket-language="secondary"'));
assert.ok(unicodeArtifactSvg.includes('lang="ja-JP"'));
assert.ok(unicodeArtifactSvg.includes('lang="en-GB"'));
assert.ok(unicodeArtifactSvg.includes('data-ticket-line="2"'));
assert.ok(!unicodeArtifactSvg.includes('…'));
assert.ok(unicodeArtifactSvg.includes('<rect x="920"'));

const coveredTicketingEndings = new Set([
  networkFailure.currentEndingId,
  standardSuccess.currentEndingId,
  retentionDeclined.currentEndingId,
  premiumSuccess.currentEndingId,
  premiumFailure.currentEndingId,
  retainedSuccess.currentEndingId,
  retainedFailure.currentEndingId,
]);
assert.equal(coveredTicketingEndings.size, 7, '七种票务 Ending 必须全部可确定性复现');

console.log(
  `state validation passed: pollution=${pollutionTriggers.length} triggers, p12-events=${(
    probabilityAtLeastThreeInTen * 100
  ).toFixed(
    4,
  )}%, p10-events=${(probabilityAtLeastThreeInFirstTenEvents * 100).toFixed(4)}%, ticket outcomes=${coveredTicketingEndings.size}, matrix=${matrix.length}`,
);

const frontNow = Object.freeze({
  calendar: 'terra',
  year: 1102,
  month: 4,
  day: 15,
  time: '00:00',
});

const archiveNow = Object.freeze({
  calendar: 'terra',
  year: 1084,
  month: 7,
  day: 1,
  time: '00:00',
});

const performance = (performanceId, world, effectiveDateTime, productionIds) => ({
  performanceId,
  world,
  status: 'scheduled',
  locationId: `${world}-fixture-location`,
  effectiveDateTime,
  productionIds,
  ticketAvailability: { state: 'not-on-sale' },
});

export const rootValidationFixture = Object.freeze({
  context: Object.freeze({
    profile: 'showcase',
    editionIds: Object.freeze(['yan']),
    rootSetId: 'content-state-fixture',
    contentPolicy: 'preview-ok',
    fallbackPolicy: 'strict',
    siteClockStrategies: Object.freeze({ front: 'fixed', archive: 'fixed' }),
  }),
  productions: Object.freeze({
    'fixture-original-a': Object.freeze({ sourceKind: 'original' }),
    'fixture-original-b': Object.freeze({ sourceKind: 'original' }),
    'fixture-original-c': Object.freeze({ sourceKind: 'original' }),
    'fixture-original-d': Object.freeze({ sourceKind: 'original' }),
    'fixture-folio-a': Object.freeze({ sourceKind: 'folio' }),
    'fixture-folio-b': Object.freeze({ sourceKind: 'folio' }),
  }),
  performances: Object.freeze({
    'fixture-front-a': Object.freeze(
      performance('fixture-front-a', 'front', { ...frontNow, month: 5, day: 1 }, [
        'fixture-original-a',
      ]),
    ),
    'fixture-front-b': Object.freeze(
      performance('fixture-front-b', 'front', { ...frontNow, month: 6, day: 1 }, [
        'fixture-original-b',
      ]),
    ),
    'fixture-front-c': Object.freeze(
      performance('fixture-front-c', 'front', { ...frontNow, month: 7, day: 1 }, [
        'fixture-original-c',
      ]),
    ),
    'fixture-front-d': Object.freeze(
      performance('fixture-front-d', 'front', { ...frontNow, month: 8, day: 1 }, [
        'fixture-original-d',
      ]),
    ),
    'fixture-front-history': Object.freeze(
      performance('fixture-front-history', 'front', { ...frontNow, day: 14 }, [
        'fixture-original-a',
      ]),
    ),
    'fixture-archive-current': Object.freeze(
      performance('fixture-archive-current', 'archive', { ...archiveNow, day: 2 }, [
        'fixture-folio-a',
      ]),
    ),
    'fixture-archive-history': Object.freeze(
      performance('fixture-archive-history', 'archive', { ...archiveNow, month: 6, day: 30 }, [
        'fixture-folio-b',
      ]),
    ),
  }),
  rootSet: Object.freeze({
    rootSetId: 'content-state-fixture',
    version: 1,
    worlds: Object.freeze({
      front: Object.freeze({
        performanceIds: Object.freeze([
          'fixture-front-a',
          'fixture-front-b',
          'fixture-front-c',
          'fixture-front-d',
          'fixture-front-history',
        ]),
        featuredPerformanceId: 'fixture-front-a',
        homepagePerformanceIds: Object.freeze(['fixture-front-a']),
      }),
      archive: Object.freeze({
        performanceIds: Object.freeze(['fixture-archive-current', 'fixture-archive-history']),
        featuredPerformanceId: 'fixture-archive-current',
        homepagePerformanceIds: Object.freeze(['fixture-archive-current']),
      }),
    }),
  }),
});

export const noticeFreshnessFixture = Object.freeze({
  performance: Object.freeze({
    performanceId: 'fixture-notice',
    world: 'front',
    status: 'pending',
    locationId: 'fixture-location',
    effectiveDateTime: Object.freeze({ ...frontNow, month: 10, day: 21, time: '18:45' }),
    previousDateTime: Object.freeze({ ...frontNow, month: 10, day: 20, time: '18:45' }),
    productionIds: Object.freeze(['fixture-original-a']),
    ticketAvailability: Object.freeze({ state: 'not-on-sale' }),
    notice: Object.freeze({ reason: 'catastrophe-route', sourceRevision: 'notice-v2' }),
  }),
  content: Object.freeze({
    index: 'FIXTURE-NOTICE',
    venue: '测试剧场',
    searchKeywords: 'fixture notice',
    operationalNotice: Object.freeze({
      sourceRevision: 'notice-v2',
      text: '线路调整，排期等待确认。',
    }),
  }),
});

export function expectedSnapshotClosure(rootSet, performanceRegistry) {
  const performanceIds = [
    ...rootSet.worlds.front.performanceIds,
    ...rootSet.worlds.archive.performanceIds,
  ];
  const selected = performanceIds.map((performanceId) => performanceRegistry[performanceId]);
  return {
    performanceIds,
    productionIds: [...new Set(selected.flatMap(({ productionIds }) => productionIds))],
    locationIds: [...new Set(selected.map(({ locationId }) => locationId))],
    artworkKeys: [
      ...new Set(
        selected.flatMap(({ productionIds, world }) =>
          productionIds.map((productionId) => `${productionId}:${world}`),
        ),
      ),
    ],
    seatingPlanIds: [
      ...new Set(
        selected.flatMap(({ ticketAvailability }) =>
          ticketAvailability.state === 'on-sale' && ticketAvailability.seatingPlanId
            ? [ticketAvailability.seatingPlanId]
            : [],
        ),
      ),
    ],
  };
}

export function createLocalizedOrderingFixture(snapshot, localization, world, collection) {
  const [seedId, seed] = snapshot.performanceEntries[0];
  const seedContent = localization.programs.performances[seedId];
  const date = world === 'front' ? frontNow : archiveNow;
  const ids = ['fixture-order-a', 'fixture-order-b', 'fixture-order-c'];
  const times = ['20:00', '19:00', '20:00'];
  const entries = ids.map((performanceId, index) => [
    performanceId,
    {
      ...seed,
      performanceId,
      world,
      collection,
      effectiveDateTime: { ...date, time: times[index] },
    },
  ]);
  return {
    ids,
    snapshot: {
      ...snapshot,
      performanceEntries: entries,
      performances: Object.fromEntries(entries),
    },
    localization: {
      ...localization,
      programs: {
        ...localization.programs,
        performances: Object.fromEntries(ids.map((performanceId) => [performanceId, seedContent])),
      },
    },
  };
}

export function createCancelledPerformanceFixture(snapshot, localization) {
  const [seedId, seed] = snapshot.performanceEntries[0];
  const seedContent = localization.programs.performances[seedId];
  const performanceId = 'fixture-cancelled-performance';
  const cancelled = {
    ...seed,
    performanceId,
    world: 'front',
    status: 'cancelled',
    collection: 'history',
    effectiveDateTime: { ...frontNow, month: 1, day: 4, time: '19:30' },
    previousDateTime: undefined,
    ticketAvailability: { state: 'not-on-sale' },
    notice: { reason: 'venue-condition', sourceRevision: 'fixture-cancelled-v1' },
  };
  const content = {
    ...seedContent,
    operationalNotice: {
      sourceRevision: 'fixture-cancelled-v1',
      text: '测试取消公告：{originalDate}',
    },
  };
  return {
    performanceId,
    snapshot: {
      ...snapshot,
      performanceEntries: [[performanceId, cancelled]],
      performances: { [performanceId]: cancelled },
      homepagePerformanceIds: { front: [], archive: [] },
    },
    localization: {
      ...localization,
      programs: {
        ...localization.programs,
        performances: { [performanceId]: content },
      },
    },
  };
}

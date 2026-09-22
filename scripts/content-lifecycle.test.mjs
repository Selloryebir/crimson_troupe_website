import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { archiveProjectionIdentity } from '../src/data/archive-pollution.ts';
import { createContentApprovalDigests } from '../src/data/content/approval-digests.ts';
import { assertContentContextEligible } from '../src/data/content/eligibility.ts';
import { createContentFingerprint } from '../src/data/content/fingerprint.ts';
import { buildSnapshot } from '../src/data/content/resolve.ts';
import { buildContext, buildContexts, buildEditionIds, editions } from '../src/data/editions.ts';
import { locations } from '../src/data/locations.ts';
import { folioSourceTexts } from '../src/data/localized/folio-source-texts.ts';
import { localizationPackages } from '../src/data/localized/packages.ts';
import { diagnoseLocalization, getLocalization } from '../src/data/localized/resolve.ts';
import { performanceOfferMatrix } from '../src/data/performance-offers.ts';
import { performances } from '../src/data/performances.ts';
import {
  archiveFolioCrimsonManifest,
  productionArtworkManifest,
} from '../src/data/production-artwork-manifest.ts';
import { folioSourceRecords } from '../src/data/productions/folio-source-records.ts';
import { productions } from '../src/data/productions/index.ts';
import { ticketSeatingPlans } from '../src/data/ticket-seating-plans.ts';
import { ticketingPlatforms } from '../src/data/ticketing-platforms.ts';
import { currentRootSet } from '../src/data/content/root-sets.ts';
import {
  assertContentBundle,
  assertPerformanceVariantComplete,
} from '../src/data/content/validate.ts';
import {
  createBaselinePerformanceVariantRegistry,
  performanceVariantRegistry,
  selectCompleteVariant,
} from '../src/data/content/variants.ts';
import { productionArtworkRegistry } from '../src/data/production-artworks.ts';
import {
  assertSeatingPlanRegistry,
  assertTicketingCapabilities,
  assertYaneseServiceLanguage,
} from './fixtures/content-lifecycle-assertions.mjs';

const candidateId = 'lifecycle-candidate-1102';
const requiredId = currentRootSet.worlds.front.performanceIds[0];
const selectedIds = [
  ...currentRootSet.worlds.front.performanceIds,
  ...currentRootSet.worlds.archive.performanceIds,
];
const productionUseCounts = selectedIds
  .flatMap((performanceId) => performances[performanceId].productionIds)
  .reduce((counts, productionId) => {
    counts[productionId] = (counts[productionId] ?? 0) + 1;
    return counts;
  }, {});
const candidateTemplateId = currentRootSet.worlds.front.performanceIds[0];
const candidateTemplate = performances[candidateTemplateId];
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const previewEditionIds = Object.keys(editions);
const candidateIndex = String(
  Math.max(
    ...Object.values(localizationPackages.yan.programs.performances)
      .map(({ index }) => Number(index))
      .filter(Number.isFinite),
  ) + 1,
).padStart(2, '0');

const candidatePerformance = {
  ...candidateTemplate,
  performanceId: candidateId,
  world: 'front',
  status: 'pending',
  effectiveDateTime: {
    calendar: 'terra',
    year: 1102,
    month: 11,
    day: 1,
    time: '19:30',
  },
  ticketAvailability: { state: 'not-on-sale' },
};
delete candidatePerformance.previousDateTime;
delete candidatePerformance.notice;

function createValidationSources(overrides = {}) {
  return {
    performanceVariants: performanceVariantRegistry,
    productions,
    folioSources: folioSourceRecords,
    folioSourceTexts,
    locations,
    localizations: localizationPackages,
    artwork: productionArtworkManifest,
    folioCrimson: archiveFolioCrimsonManifest,
    seatingPlans: ticketSeatingPlans,
    ticketingPlatforms,
    offerMatrix: performanceOfferMatrix,
    archiveProjection: archiveProjectionIdentity,
    ...overrides,
  };
}

function createApprovalSources(overrides = {}) {
  return {
    performanceVariants: performanceVariantRegistry,
    productions,
    locations,
    localizations: localizationPackages,
    artwork: productionArtworkRegistry,
    folioCrimson: archiveFolioCrimsonManifest,
    folioSources: folioSourceRecords,
    seatingPlans: ticketSeatingPlans,
    ticketingPlatforms,
    archiveProjection: archiveProjectionIdentity,
    ...overrides,
  };
}

function withPreviewVariant(performanceId, value, variantId = 'lifecycle-preview') {
  const baseline = performanceVariantRegistry[performanceId];
  assert.ok(baseline);
  return {
    ...performanceVariantRegistry,
    [performanceId]: {
      ...baseline,
      preview: { variantId, maturity: 'preview', value },
    },
  };
}

function cloneArtworkManifest() {
  return structuredClone(productionArtworkManifest);
}

function cloneArtworkRegistry() {
  return structuredClone(productionArtworkRegistry);
}

function createOnSaleFixture() {
  const performanceId = requiredId;
  const seatingPlanId = 'lifecycle-ticket-plan';
  const performance = {
    ...performances[performanceId],
    ticketAvailability: {
      state: 'on-sale',
      seatingPlanId,
      offers: [
        { zone: 'C', basePrice: 100 },
        { zone: 'A', basePrice: 200 },
      ],
    },
  };
  const seatingPlans = {
    ...ticketSeatingPlans,
    [seatingPlanId]: {
      seatingPlanId,
      levels: [
        {
          levelId: 'main',
          stage: { x: 0, y: 0, width: 10, height: 5 },
          regions: [
            {
              regionId: 'main-c',
              zone: 'C',
              path: 'M0 0 H5 V10 H0 Z',
              labelX: 2,
              labelY: 5,
            },
            {
              regionId: 'main-a',
              zone: 'A',
              path: 'M5 0 H10 V10 H5 Z',
              labelX: 7,
              labelY: 5,
            },
          ],
        },
      ],
    },
  };
  return {
    performanceId,
    performance,
    seatingPlanId,
    seatingPlans,
    performanceVariants: withPreviewVariant(performanceId, performance),
  };
}

function withoutPerformance(rootSet, world, performanceId) {
  const result = structuredClone(rootSet);
  const roots = result.worlds[world];
  roots.performanceIds = roots.performanceIds.filter((id) => id !== performanceId);
  roots.homepagePerformanceIds = roots.homepagePerformanceIds.filter((id) => id !== performanceId);
  return result;
}

test('an unselected complete N+1 candidate does not expand the selected closure', () => {
  const variants = createBaselinePerformanceVariantRegistry({
    ...performances,
    [candidateId]: candidatePerformance,
  });
  assert.doesNotThrow(() =>
    assertContentBundle(
      buildEditionIds,
      currentRootSet,
      buildContext,
      createValidationSources({ performanceVariants: variants }),
    ),
  );
});

test('a complete new performance can enter a root when its selected dependencies exist', () => {
  const variants = createBaselinePerformanceVariantRegistry({
    ...performances,
    [candidateId]: candidatePerformance,
  });
  const rootSet = structuredClone(currentRootSet);
  rootSet.worlds.front.performanceIds = [candidateId];
  rootSet.worlds.front.featuredPerformanceId = candidateId;
  rootSet.worlds.front.homepagePerformanceIds = [candidateId];
  const archiveId = currentRootSet.worlds.archive.performanceIds[0];
  rootSet.worlds.archive.performanceIds = [archiveId];
  rootSet.worlds.archive.featuredPerformanceId = archiveId;
  rootSet.worlds.archive.homepagePerformanceIds = [];
  const localizations = structuredClone(localizationPackages);
  localizations.yan.programs.performances[candidateId] = {
    index: candidateIndex,
    venue: '特里蒙大剧院 · 实验舞台',
    searchKeywords: '生命周期 新场次 特里蒙',
  };

  assert.doesNotThrow(() =>
    assertContentBundle(
      ['yan'],
      rootSet,
      buildContext,
      createValidationSources({ performanceVariants: variants, localizations }),
    ),
  );
});

test('a performance can be withdrawn from its root and homepage without deleting its library record', () => {
  const rootWithCandidate = structuredClone(currentRootSet);
  rootWithCandidate.worlds.front.performanceIds.push(candidateId);
  rootWithCandidate.worlds.front.homepagePerformanceIds.push(candidateId);
  const rootSet = withoutPerformance(rootWithCandidate, 'front', candidateId);
  const variants = createBaselinePerformanceVariantRegistry({
    ...performances,
    [candidateId]: candidatePerformance,
  });
  assert.doesNotThrow(() =>
    assertContentBundle(
      buildEditionIds,
      rootSet,
      buildContext,
      createValidationSources({ performanceVariants: variants }),
    ),
  );
});

test('an unreferenced performance variant can be removed from the authoring library', () => {
  const rootSet = structuredClone(currentRootSet);
  const variants = { ...performanceVariantRegistry };
  variants[candidateId] = {
    stableId: candidateId,
    baseline: { variantId: 'baseline', maturity: 'preview', value: candidatePerformance },
  };
  delete variants[candidateId];
  assert.doesNotThrow(() =>
    assertContentBundle(
      buildEditionIds,
      rootSet,
      buildContext,
      createValidationSources({ performanceVariants: variants }),
    ),
  );
});

test('deleting a variant that remains referenced by a root fails', () => {
  const variants = { ...performanceVariantRegistry };
  delete variants[requiredId];
  assert.throws(
    () =>
      assertContentBundle(
        buildEditionIds,
        currentRootSet,
        buildContext,
        createValidationSources({ performanceVariants: variants }),
      ),
    new RegExp(`场次 ${requiredId} 缺少持久化内容变体`, 'u'),
  );
});

test('deleting a selected target-language record fails the localization closure', () => {
  const localizations = structuredClone(localizationPackages);
  delete localizations.columbia.programs.performances[requiredId];
  assert.throws(
    () =>
      assertContentBundle(
        ['yan', 'columbia'],
        currentRootSet,
        buildContext,
        createValidationSources({ localizations }),
      ),
    new RegExp(`columbia[.]performances[.]${requiredId} 缺失`, 'u'),
  );
});

test('changing selected Yan content without revising translations fails as stale', () => {
  const localizations = structuredClone(localizationPackages);
  localizations.yan.programs.performances[requiredId].searchKeywords += ' 生命周期变更';
  assert.throws(
    () =>
      assertContentBundle(
        ['yan', 'columbia'],
        currentRootSet,
        buildContext,
        createValidationSources({ localizations }),
      ),
    new RegExp(`columbia[.]performances[.]${requiredId} 译文源修订已过期`, 'u'),
  );
});

test('an incomplete preview variant cannot replace a complete baseline', () => {
  const baseline = performanceVariantRegistry[requiredId];
  assert.ok(baseline);
  assert.throws(
    () =>
      selectCompleteVariant(
        {
          ...baseline,
          preview: {
            variantId: 'lifecycle-incomplete',
            maturity: 'preview',
            value: { ...baseline.baseline.value, locationId: undefined },
          },
        },
        assertPerformanceVariantComplete,
      ),
    /locationId 缺失/u,
  );
});

test('a selected performance change invalidates only its approval digest', () => {
  const currentDigests = createContentApprovalDigests(
    buildContexts.release.editionIds,
    currentRootSet,
  );
  const baseline = performanceVariantRegistry[requiredId];
  assert.ok(baseline);
  const variants = {
    ...performanceVariantRegistry,
    [requiredId]: {
      ...baseline,
      preview: {
        variantId: 'lifecycle-changed',
        maturity: 'preview',
        value: {
          ...baseline.baseline.value,
          effectiveDateTime: {
            ...baseline.baseline.value.effectiveDateTime,
            time: baseline.baseline.value.effectiveDateTime.time === '19:31' ? '19:32' : '19:31',
          },
        },
      },
    },
  };
  const changedDigests = createContentApprovalDigests(
    buildContexts.release.editionIds,
    currentRootSet,
    createApprovalSources({ performanceVariants: variants }),
  );
  assert.equal(changedDigests.site, currentDigests.site);
  assert.equal(changedDigests.rootSet, currentDigests.rootSet);
  assert.notEqual(changedDigests.performances[requiredId], currentDigests.performances[requiredId]);
  const unrelatedId = selectedIds.find((performanceId) => performanceId !== requiredId);
  assert.equal(changedDigests.performances[unrelatedId], currentDigests.performances[unrelatedId]);

  const approvals = {
    site: currentDigests.site,
    rootSets: { [currentRootSet.rootSetId]: currentDigests.rootSet },
    performances: currentDigests.performances,
  };
  assert.doesNotThrow(() =>
    assertContentContextEligible(buildContexts.release, currentRootSet, approvals),
  );
  assert.throws(
    () => assertContentContextEligible(buildContexts.release, currentRootSet),
    /无批准摘要/u,
  );
});

test('an unreferenced valid seating plan does not require a mirrored expectation entry', () => {
  const seatingPlans = {
    ...ticketSeatingPlans,
    'lifecycle-unreferenced': {
      seatingPlanId: 'lifecycle-unreferenced',
      levels: [
        {
          levelId: 'main',
          regions: [
            {
              regionId: 'main-a',
              zone: 'A',
              path: 'M0 0 H10 V10 H0 Z',
              labelX: 5,
              labelY: 5,
            },
          ],
        },
      ],
    },
  };
  assert.doesNotThrow(() =>
    assertSeatingPlanRegistry(seatingPlans, localizationPackages.yan.programs.ticketZones),
  );
  assert.doesNotThrow(() =>
    assertContentBundle(
      buildEditionIds,
      currentRootSet,
      buildContext,
      createValidationSources({ seatingPlans }),
    ),
  );
});

test('ticketing capability samples use isolated records instead of production IDs', () => {
  const seatingPlans = {
    'fixture-front': {
      seatingPlanId: 'fixture-front',
      levels: [
        {
          levelId: 'main',
          regions: [
            { regionId: 'main-c', zone: 'C' },
            { regionId: 'main-a', zone: 'A' },
          ],
        },
      ],
    },
  };
  const fixturePerformances = {
    'archive-completed': {
      performanceId: 'archive-completed',
      world: 'archive',
      status: 'completed',
      ticketAvailability: { state: 'not-on-sale' },
    },
    'archive-open': {
      performanceId: 'archive-open',
      world: 'archive',
      status: 'scheduled',
      ticketAvailability: {
        state: 'on-sale',
        offers: [
          { zone: 'C', basePrice: 100 },
          { zone: 'A', basePrice: 200 },
        ],
      },
    },
    'archive-static': {
      performanceId: 'archive-static',
      world: 'archive',
      status: 'scheduled',
      ticketAvailability: { state: 'not-on-sale' },
    },
    'front-open': {
      performanceId: 'front-open',
      world: 'front',
      status: 'scheduled',
      ticketAvailability: {
        state: 'on-sale',
        seatingPlanId: 'fixture-front',
        offers: [
          { zone: 'C', basePrice: 120 },
          { zone: 'A', basePrice: 260 },
        ],
      },
    },
  };

  assert.doesNotThrow(() => assertTicketingCapabilities(fixturePerformances, seatingPlans));
  const mismatched = structuredClone(fixturePerformances);
  mismatched['front-open'].ticketAvailability.offers = [{ zone: 'C', basePrice: 120 }];
  assert.throws(
    () => assertTicketingCapabilities(mismatched, seatingPlans),
    /front-open 的示意分区与报价不一致/u,
  );
});

test('service language samples preserve Yanese independently of production inventory', () => {
  const samples = {
    yan: '炎语演出',
    victoria: 'Performed in Yanese',
    columbia: 'Performed in Yanese',
    higashi: '炎語上演',
    ursus: 'Исполняется на янском языке',
    siracusa: 'Spettacolo in yanese',
    minos: 'Performed in Yanese',
    leithanien: 'Aufführung auf Yanesisch',
    kazimierz: 'Występ w języku yanese',
  };
  assert.doesNotThrow(() => assertYaneseServiceLanguage(samples));
  assert.throws(
    () => assertYaneseServiceLanguage({ ...samples, columbia: 'Performed in Columbian' }),
    /columbia 不得改变/u,
  );
});

test('locale diagnostics distinguish missing, stale, and out-of-scope records', () => {
  const packagesWithoutPerformance = structuredClone(localizationPackages);
  delete packagesWithoutPerformance.columbia.programs.performances[requiredId];
  const missingSnapshot = { ...buildSnapshot, localizationPackages: packagesWithoutPerformance };
  assert.equal(
    diagnoseLocalization(
      editions.columbia,
      missingSnapshot,
      packagesWithoutPerformance,
    ).entries.find((entry) => entry.path === `performances.${requiredId}`)?.reason,
    'missing',
  );
  assert.throws(
    () => getLocalization(editions.columbia, missingSnapshot),
    new RegExp(`performances[.]${requiredId}（缺失）`, 'u'),
  );

  const stalePackages = structuredClone(localizationPackages);
  const selectedLocationId = performances[requiredId].locationId;
  stalePackages.yan.programs.locations[selectedLocationId].cityLabel += '测试';
  const staleSnapshot = { ...buildSnapshot, localizationPackages: stalePackages };
  assert.equal(
    diagnoseLocalization(editions.columbia, staleSnapshot, stalePackages).entries.find(
      (entry) => entry.path === `locations.${selectedLocationId}`,
    )?.reason,
    'stale',
  );
  assert.throws(
    () => getLocalization(editions.columbia, staleSnapshot),
    new RegExp(`locations[.]${selectedLocationId}（旧译）`, 'u'),
  );

  const outOfScopeLocationId = 'lifecycle-out-of-scope-location';
  const outOfScopePackages = structuredClone(localizationPackages);
  outOfScopePackages.yan.programs.locations[outOfScopeLocationId] = { cityLabel: '未选地点' };
  assert.doesNotThrow(() =>
    assertContentBundle(
      ['yan', 'columbia'],
      currentRootSet,
      buildContext,
      createValidationSources({
        locations: {
          ...locations,
          [outOfScopeLocationId]: {
            locationId: outOfScopeLocationId,
            countryEditionId: 'yan',
          },
        },
        localizations: outOfScopePackages,
      }),
    ),
  );
});

test('folio fields, archive provenance, and projection dependencies remain guarded', () => {
  const archiveId = currentRootSet.worlds.archive.performanceIds[0];
  const archivePerformance = performances[archiveId];
  const folioProductionId = archivePerformance.productionIds[0];
  const originalProductionId = Object.keys(productions).find(
    (productionId) => productions[productionId].sourceKind === 'original',
  );
  assert.ok(originalProductionId);

  for (const field of ['tagline', 'synopsis']) {
    const localizations = structuredClone(localizationPackages);
    localizations.yan.programs.productions[folioProductionId][field] += '测试改写';
    assert.throws(
      () =>
        assertContentBundle(
          ['yan'],
          currentRootSet,
          buildContext,
          createValidationSources({ localizations }),
        ),
      new RegExp(`yan[.]productions[.]${folioProductionId}[.]${field} 未采用集中活页来源`, 'u'),
    );
  }
  assert.throws(
    () =>
      assertContentBundle(
        ['yan'],
        currentRootSet,
        buildContext,
        createValidationSources({
          performanceVariants: withPreviewVariant(archiveId, {
            ...archivePerformance,
            productionIds: [originalProductionId],
          }),
        }),
      ),
    /只能引用 folio 剧目/u,
  );
  assert.throws(
    () =>
      assertContentBundle(
        ['yan'],
        currentRootSet,
        buildContext,
        createValidationSources({ archiveProjection: { sourceId: originalProductionId } }),
      ),
    /archiveProjection[.]folioSource/u,
  );
  const withoutProjectionCrimson = { ...archiveFolioCrimsonManifest };
  delete withoutProjectionCrimson[archiveProjectionIdentity.sourceId];
  assert.throws(
    () =>
      assertContentBundle(
        ['yan'],
        currentRootSet,
        buildContext,
        createValidationSources({ folioCrimson: withoutProjectionCrimson }),
      ),
    /archiveProjection[.]crimson/u,
  );
  const selectedCrimsonId = currentRootSet.worlds.archive.performanceIds.find((performanceId) =>
    performances[performanceId].productionIds.some(
      (productionId) => archiveFolioCrimsonManifest[productionId],
    ),
  );
  assert.ok(selectedCrimsonId);
  const selectedCrimsonProductionId = performances[selectedCrimsonId].productionIds.find(
    (productionId) => archiveFolioCrimsonManifest[productionId],
  );
  const withoutSelectedCrimson = { ...archiveFolioCrimsonManifest };
  delete withoutSelectedCrimson[selectedCrimsonProductionId];
  assert.throws(
    () =>
      assertContentBundle(
        ['yan'],
        currentRootSet,
        buildContext,
        createValidationSources({ folioCrimson: withoutSelectedCrimson }),
      ),
    new RegExp(`folioCrimson[.]${selectedCrimsonProductionId} 缺失`, 'u'),
  );
});

test('selected artwork, offers, seating, and auxiliary ticket locale remain guarded', () => {
  const {
    performanceId: onSaleId,
    performance: onSale,
    seatingPlanId,
    seatingPlans,
    performanceVariants,
  } = createOnSaleFixture();
  const productionId = onSale.productionIds[0];
  const withoutArtwork = cloneArtworkManifest();
  delete withoutArtwork[productionId].front;
  assert.throws(
    () =>
      assertContentBundle(
        ['yan'],
        currentRootSet,
        buildContext,
        createValidationSources({
          artwork: withoutArtwork,
          seatingPlans,
          performanceVariants,
        }),
      ),
    new RegExp(`artwork[.]${productionId}[.]front 缺失`, 'u'),
  );
  const withoutPlan = { ...seatingPlans };
  delete withoutPlan[seatingPlanId];
  assert.throws(
    () =>
      assertContentBundle(
        ['yan'],
        currentRootSet,
        buildContext,
        createValidationSources({
          seatingPlans: withoutPlan,
          performanceVariants,
        }),
      ),
    /seatingPlan[.].*缺失/u,
  );
  for (const [variantId, offers, expectation] of [
    [
      'duplicate',
      [onSale.ticketAvailability.offers[0], onSale.ticketAvailability.offers[0]],
      /含重复分区/u,
    ],
    ['negative', [{ ...onSale.ticketAvailability.offers[0], basePrice: -1 }], /必须是正安全整数/u],
    ['topology', onSale.ticketAvailability.offers.slice(0, -1), /报价分区与座席拓扑不一致/u],
  ]) {
    assert.throws(
      () =>
        assertContentBundle(
          ['yan'],
          currentRootSet,
          buildContext,
          createValidationSources({
            seatingPlans,
            performanceVariants: withPreviewVariant(
              onSaleId,
              {
                ...onSale,
                ticketAvailability: { ...onSale.ticketAvailability, offers },
              },
              variantId,
            ),
          }),
        ),
      expectation,
    );
  }

  const artifactEditionId = locations[onSale.locationId].countryEditionId;
  const localizations = structuredClone(localizationPackages);
  delete localizations[artifactEditionId].programs.performances[onSaleId];
  assert.throws(
    () =>
      assertContentBundle(
        ['yan'],
        currentRootSet,
        buildContexts.showcase,
        createValidationSources({ localizations, seatingPlans, performanceVariants }),
      ),
    new RegExp(`ticketArtifact[.]${artifactEditionId}[.]performances[.]${onSaleId} 缺失`, 'u'),
  );
  assert.throws(
    () =>
      assertContentBundle(
        ['yan'],
        currentRootSet,
        buildContext,
        createValidationSources({
          offerMatrix: {
            'fixture-production': { 'fixture-venue': [-1, 200, 300, 400, 500] },
          },
        }),
      ),
    /performanceOffers[.]fixture-production[.]fixture-venue[.]C 必须是正整数/u,
  );
});

test('approval digests react to semantic inputs and ignore asset relocation', () => {
  const {
    performanceId: selectedId,
    performance: selected,
    seatingPlanId,
    seatingPlans,
    performanceVariants,
  } = createOnSaleFixture();
  const productionId = selected.productionIds[0];
  const fixtureSources = { seatingPlans, performanceVariants };
  const current = createContentApprovalDigests(
    buildContexts.release.editionIds,
    currentRootSet,
    createApprovalSources(fixtureSources),
  );

  const changedArtwork = cloneArtworkRegistry();
  changedArtwork[productionId].front.sourceRevision = `sha256:${'0'.repeat(64)}`;
  const changedArtworkDigests = createContentApprovalDigests(
    buildContexts.release.editionIds,
    currentRootSet,
    createApprovalSources({ ...fixtureSources, artwork: changedArtwork }),
  );
  assert.notEqual(changedArtworkDigests.performances[selectedId], current.performances[selectedId]);

  const movedArtwork = cloneArtworkRegistry();
  movedArtwork[productionId].front.assetPath = 'src/assets/images/productions/relocated.webp';
  const movedArtworkDigests = createContentApprovalDigests(
    buildContexts.release.editionIds,
    currentRootSet,
    createApprovalSources({ ...fixtureSources, artwork: movedArtwork }),
  );
  assert.equal(movedArtworkDigests.performances[selectedId], current.performances[selectedId]);

  const changedSeating = structuredClone(seatingPlans);
  const changedLevel = changedSeating[seatingPlanId].levels[0];
  if (changedLevel.stage) changedLevel.stage.width += 1;
  else changedLevel.regions[0].labelX += 1;
  const changedSeatingDigests = createContentApprovalDigests(
    buildContexts.release.editionIds,
    currentRootSet,
    createApprovalSources({ performanceVariants, seatingPlans: changedSeating }),
  );
  assert.notEqual(changedSeatingDigests.performances[selectedId], current.performances[selectedId]);

  const artifactEditionId = locations[selected.locationId].countryEditionId;
  const changedArtifact = structuredClone(localizationPackages);
  changedArtifact[artifactEditionId].messages.ticketing.artifact.header += ' changed';
  const changedArtifactDigests = createContentApprovalDigests(
    buildContexts.release.editionIds,
    currentRootSet,
    createApprovalSources({ ...fixtureSources, localizations: changedArtifact }),
  );
  assert.notEqual(
    changedArtifactDigests.performances[selectedId],
    current.performances[selectedId],
  );

  const crimsonPerformanceId = currentRootSet.worlds.archive.performanceIds.find(
    (performanceId) => {
      const production = performances[performanceId].productionIds[0];
      return archiveFolioCrimsonManifest[production];
    },
  );
  assert.ok(crimsonPerformanceId);
  const crimsonProductionId = performances[crimsonPerformanceId].productionIds[0];
  const changedCrimson = structuredClone(archiveFolioCrimsonManifest);
  changedCrimson[crimsonProductionId].sourceRevision = `sha256:${'0'.repeat(64)}`;
  const changedCrimsonDigests = createContentApprovalDigests(
    buildContexts.release.editionIds,
    currentRootSet,
    createApprovalSources({ ...fixtureSources, folioCrimson: changedCrimson }),
  );
  assert.notEqual(
    changedCrimsonDigests.performances[crimsonPerformanceId],
    current.performances[crimsonPerformanceId],
  );
  const movedCrimson = structuredClone(archiveFolioCrimsonManifest);
  movedCrimson[crimsonProductionId].assetPath = 'src/assets/images/archive/folio/relocated.webp';
  const movedCrimsonDigests = createContentApprovalDigests(
    buildContexts.release.editionIds,
    currentRootSet,
    createApprovalSources({ ...fixtureSources, folioCrimson: movedCrimson }),
  );
  assert.equal(
    movedCrimsonDigests.performances[crimsonPerformanceId],
    current.performances[crimsonPerformanceId],
  );

  const changedProjection = structuredClone(archiveFolioCrimsonManifest);
  changedProjection[archiveProjectionIdentity.sourceId].sourceRevision = `sha256:${'1'.repeat(64)}`;
  const changedProjectionDigests = createContentApprovalDigests(
    buildContexts.release.editionIds,
    currentRootSet,
    createApprovalSources({ ...fixtureSources, folioCrimson: changedProjection }),
  );
  assert.notEqual(changedProjectionDigests.site, current.site);

  const changedSite = structuredClone(localizationPackages);
  changedSite.yan.site.shared.fanNotice += '。';
  const changedSiteDigests = createContentApprovalDigests(
    buildContexts.release.editionIds,
    currentRootSet,
    createApprovalSources({ ...fixtureSources, localizations: changedSite }),
  );
  assert.notEqual(changedSiteDigests.site, current.site);
  assert.deepEqual(changedSiteDigests.performances, current.performances);

  const reorderedRoot = structuredClone(currentRootSet);
  reorderedRoot.worlds.front.performanceIds.reverse();
  const reorderedDigests = createContentApprovalDigests(
    buildContexts.release.editionIds,
    reorderedRoot,
    createApprovalSources(fixtureSources),
  );
  assert.equal(reorderedDigests.site, current.site);
  assert.notEqual(reorderedDigests.rootSet, current.rootSet);
  assert.deepEqual(reorderedDigests.performances, current.performances);
});

function replaceOnce(source, search, replacement, label) {
  assert.ok(source.includes(search), `${label} 缺少预期插入点`);
  return source.replace(search, replacement);
}

function removeRecord(source, recordId) {
  const markers = [`    '${recordId}': {`, `  '${recordId}': {`];
  const start = markers.map((marker) => source.indexOf(marker)).find((index) => index !== -1) ?? -1;
  assert.notEqual(start, -1, `未找到记录 ${recordId}`);
  const objectStart = source.indexOf('{', start);
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let index = objectStart; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === quote) quote = '';
      continue;
    }
    if (character === "'" || character === '"' || character === '`') {
      quote = character;
      continue;
    }
    if (character === '{') depth += 1;
    if (character === '}') depth -= 1;
    if (depth === 0) {
      let end = index + 1;
      if (source[end] === ',') end += 1;
      if (source[end] === '\n') end += 1;
      return source.slice(0, start) + source.slice(end);
    }
  }
  assert.fail(`记录 ${recordId} 没有闭合`);
}

function runValidator(workspace, script) {
  return spawnSync(process.execPath, [script], {
    cwd: workspace,
    encoding: 'utf8',
    env: { ...process.env, SITE_BUILD_PROFILE: 'preview' },
  });
}

function assertCliPassed(result, label) {
  assert.equal(result.status, 0, `${label}\n${result.stdout}\n${result.stderr}`);
}

test('the real CLIs accept lifecycle additions and cleanup while rejecting broken closure', async (t) => {
  const workspace = await mkdtemp(path.join(tmpdir(), 'crimson-content-lifecycle-'));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  await mkdir(path.join(workspace, 'src'), { recursive: true });
  await mkdir(path.join(workspace, 'docs'), { recursive: true });
  await cp(path.join(repositoryRoot, 'src/data'), path.join(workspace, 'src/data'), {
    recursive: true,
  });
  await cp(path.join(repositoryRoot, 'src/assets'), path.join(workspace, 'src/assets'), {
    recursive: true,
  });
  await cp(path.join(repositoryRoot, 'scripts'), path.join(workspace, 'scripts'), {
    recursive: true,
  });
  await cp(path.join(repositoryRoot, 'docs/sources'), path.join(workspace, 'docs/sources'), {
    recursive: true,
  });

  const relativeFiles = [
    'src/data/performances.ts',
    'src/data/content/root-sets.ts',
    'src/data/content/localization-revisions.ts',
    ...previewEditionIds.map((editionId) => `src/data/localized/${editionId}/programs.ts`),
  ];
  const originals = new Map(
    await Promise.all(
      relativeFiles.map(async (relativePath) => [
        relativePath,
        await readFile(path.join(workspace, relativePath), 'utf8'),
      ]),
    ),
  );
  const restore = async () =>
    Promise.all(
      [...originals].map(([relativePath, source]) =>
        writeFile(path.join(workspace, relativePath), source),
      ),
    );

  const performanceSource = originals.get('src/data/performances.ts');
  assert.ok(performanceSource);
  const serializedCandidate = JSON.stringify(candidatePerformance, undefined, 2)
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n');
  const candidateSource = `  '${candidateId}': ${serializedCandidate.trimStart()},\n`;
  const performanceWithCandidate = replaceOnce(
    performanceSource,
    'export const performances = {\n',
    `export const performances = {\n${candidateSource}`,
    'performances',
  );
  await writeFile(path.join(workspace, 'src/data/performances.ts'), performanceWithCandidate);
  assertCliPassed(
    runValidator(workspace, 'scripts/validate-content.mjs'),
    '未选入根的 N+1 候选应通过内容 CLI',
  );

  const localizedCandidate = {
    yan: { index: candidateIndex, venue: '生命周期测试舞台', searchKeywords: '生命周期 新场次' },
    higashi: { index: candidateIndex, venue: 'Lifecycle test stage', searchKeywords: 'lifecycle' },
    victoria: { index: candidateIndex, venue: 'Lifecycle test stage', searchKeywords: 'lifecycle' },
    columbia: { index: candidateIndex, venue: 'Lifecycle test stage', searchKeywords: 'lifecycle' },
    ursus: { index: candidateIndex, venue: 'Тестовая сцена', searchKeywords: 'жизненный цикл' },
    siracusa: { index: candidateIndex, venue: 'Palco di prova', searchKeywords: 'ciclo' },
    minos: { index: candidateIndex, venue: 'Δοκιμαστική σκηνή', searchKeywords: 'κύκλος' },
    leithanien: { index: candidateIndex, venue: 'Testbühne', searchKeywords: 'Lebenszyklus' },
    kazimierz: { index: candidateIndex, venue: 'Scena testowa', searchKeywords: 'cykl' },
  };
  const localizedSources = new Map();
  for (const editionId of previewEditionIds) {
    const relativePath = `src/data/localized/${editionId}/programs.ts`;
    const source = originals.get(relativePath);
    assert.ok(source);
    const record = `    '${candidateId}': ${JSON.stringify(localizedCandidate[editionId])},\n`;
    const localizedSource = replaceOnce(
      source,
      '  performances: {\n',
      `  performances: {\n${record}`,
      relativePath,
    );
    localizedSources.set(relativePath, localizedSource);
    await writeFile(path.join(workspace, relativePath), localizedSource);
  }
  const rootPath = 'src/data/content/root-sets.ts';
  const rootSource = originals.get(rootPath);
  assert.ok(rootSource);
  const mustReplaceTemplate = candidatePerformance.productionIds.some(
    (productionId) => productionUseCounts[productionId] >= 3,
  );
  const rootForCandidate = mustReplaceTemplate
    ? rootSource
        .split('\n')
        .filter((line) => line.trim() !== `'${candidateTemplateId}',`)
        .join('\n')
        .replace(
          `featuredPerformanceId: '${candidateTemplateId}'`,
          `featuredPerformanceId: '${candidateId}'`,
        )
    : rootSource;
  const rootWithCandidate = replaceOnce(
    replaceOnce(
      rootForCandidate,
      '      performanceIds: Object.freeze([\n',
      `      performanceIds: Object.freeze([\n        '${candidateId}',\n`,
      rootPath,
    ),
    '      homepagePerformanceIds: Object.freeze([\n',
    `      homepagePerformanceIds: Object.freeze([\n        '${candidateId}',\n`,
    rootPath,
  );
  await writeFile(path.join(workspace, rootPath), rootWithCandidate);
  const revisionsPath = 'src/data/content/localization-revisions.ts';
  const revisionsSource = originals.get(revisionsPath);
  assert.ok(revisionsSource);
  const candidateRevision = createContentFingerprint(localizedCandidate.yan);
  const revisionsWithCandidate = replaceOnce(
    revisionsSource,
    'const acceptedYanSourceRevision: LocalizationSourceRevision = Object.freeze({\n',
    `const acceptedYanSourceRevision: LocalizationSourceRevision = Object.freeze({\n  'performances.${candidateId}': '${candidateRevision}',\n`,
    revisionsPath,
  );
  await writeFile(path.join(workspace, revisionsPath), revisionsWithCandidate);
  assertCliPassed(
    runValidator(workspace, 'scripts/validate-content.mjs'),
    '九语言完整候选选入根后应通过内容 CLI',
  );
  assertCliPassed(
    runValidator(workspace, 'scripts/validate-locales.mjs'),
    '九语言完整候选选入根后应通过 locale CLI',
  );

  const missingEditionPath = 'src/data/localized/columbia/programs.ts';
  const completeTarget = await readFile(path.join(workspace, missingEditionPath), 'utf8');
  await writeFile(
    path.join(workspace, missingEditionPath),
    removeRecord(completeTarget, candidateId),
  );
  const missingResult = runValidator(workspace, 'scripts/validate-content.mjs');
  assert.notEqual(missingResult.status, 0);
  assert.match(
    `${missingResult.stdout}\n${missingResult.stderr}`,
    /columbia[.]performances.*缺失/u,
  );
  await writeFile(path.join(workspace, missingEditionPath), completeTarget);

  const yanPath = 'src/data/localized/yan/programs.ts';
  const completeYan = await readFile(path.join(workspace, yanPath), 'utf8');
  await writeFile(
    path.join(workspace, yanPath),
    completeYan.replace('生命周期测试舞台', '生命周期测试舞台变更'),
  );
  const staleResult = runValidator(workspace, 'scripts/validate-content.mjs');
  assert.notEqual(staleResult.status, 0);
  assert.match(`${staleResult.stdout}\n${staleResult.stderr}`, /译文源修订已过期/u);

  await writeFile(path.join(workspace, yanPath), completeYan);
  const withdrawnRoot = rootSource;
  await writeFile(path.join(workspace, rootPath), withdrawnRoot);
  assertCliPassed(
    runValidator(workspace, 'scripts/validate-content.mjs'),
    '根与首页同步撤选应通过内容 CLI',
  );
  assertCliPassed(
    runValidator(workspace, 'scripts/validate-locales.mjs'),
    '根与首页同步撤选应通过 locale CLI',
  );
  await writeFile(
    path.join(workspace, 'src/data/performances.ts'),
    removeRecord(performanceWithCandidate, candidateId),
  );
  for (const editionId of previewEditionIds) {
    const relativePath = `src/data/localized/${editionId}/programs.ts`;
    await writeFile(
      path.join(workspace, relativePath),
      removeRecord(localizedSources.get(relativePath), candidateId),
    );
  }
  await writeFile(
    path.join(workspace, revisionsPath),
    revisionsWithCandidate
      .split('\n')
      .filter((line) => !line.includes(`'performances.${candidateId}'`))
      .join('\n'),
  );
  assertCliPassed(
    runValidator(workspace, 'scripts/validate-content.mjs'),
    '撤选后的非引用记录清理应通过内容 CLI',
  );
  assertCliPassed(
    runValidator(workspace, 'scripts/validate-locales.mjs'),
    '撤选后的非引用记录清理应通过 locale CLI',
  );

  await restore();
  await writeFile(
    path.join(workspace, 'src/data/performances.ts'),
    removeRecord(originals.get('src/data/performances.ts'), requiredId),
  );
  const referencedDeletion = runValidator(workspace, 'scripts/validate-content.mjs');
  assert.notEqual(referencedDeletion.status, 0);
  assert.match(`${referencedDeletion.stdout}\n${referencedDeletion.stderr}`, /缺少持久化内容变体/u);
});

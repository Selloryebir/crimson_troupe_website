#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createContentApprovalDigests } from '../src/data/content/approval-digests.ts';
import { archiveProjectionIdentity } from '../src/data/archive-pollution.ts';
import { assertContentContextEligible } from '../src/data/content/eligibility.ts';
import {
  assertLocalizationSourceFresh,
  createLocalizationSourceRevision,
  localizationSourceRevisions,
} from '../src/data/content/localization-revisions.ts';
import { buildSnapshot } from '../src/data/content/resolve.ts';
import { currentRootSet } from '../src/data/content/root-sets.ts';
import {
  assertContentBundle,
  assertPerformanceVariantComplete,
} from '../src/data/content/validate.ts';
import {
  createBaselinePerformanceVariantRegistry,
  getPerformanceVariantUnit,
  performanceVariantRegistry,
  selectCompleteVariant,
} from '../src/data/content/variants.ts';
import { buildContext, buildContexts, buildEditionIds, editions } from '../src/data/editions.ts';
import { locations } from '../src/data/locations.ts';
import { folioSourceTexts } from '../src/data/localized/folio-source-texts.ts';
import { localizationPackages } from '../src/data/localized/packages.ts';
import { diagnoseLocalization, getLocalization } from '../src/data/localized/resolve.ts';
import { performances } from '../src/data/performances.ts';
import { performanceOfferMatrix } from '../src/data/performance-offers.ts';
import { productionArtworkManifest } from '../src/data/production-artwork-manifest.ts';
import { productionArtworkRegistry } from '../src/data/production-artworks.ts';
import { folioSourceRecords } from '../src/data/productions/folio-source-records.ts';
import { productions } from '../src/data/productions/index.ts';
import { ticketSeatingPlans } from '../src/data/ticket-seating-plans.ts';
import { ticketingPlatforms } from '../src/data/ticketing-platforms.ts';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const productionTitleReference = readFileSync(
  path.join(repositoryRoot, 'docs/references/production-title-reference.md'),
  'utf8',
);

function assertFolioAuthoringStructure() {
  const expectedProductionIds = Object.keys(folioSourceTexts).sort();
  for (const editionId of buildEditionIds) {
    const authoringPath = path.join(
      repositoryRoot,
      'src/data/localized',
      editionId,
      'productions/folio.ts',
    );
    const source = readFileSync(authoringPath, 'utf8');
    assert.doesNotMatch(
      source,
      /^\s{4}(?:title|tagline|synopsis):/mu,
      `${editionId} 活页版本文件不得恢复来源标题或描述副本`,
    );
    assert.doesNotMatch(
      source,
      /folioSourceRecords/u,
      `${editionId} 活页版本文件不得绕过集中来源文本目录`,
    );
    const assembledProductionIds = [
      ...source.matchAll(/createFolioProductionContent\(\s*'[^']+',\s*'([^']+)'/gu),
    ]
      .map((match) => match[1])
      .sort();
    assert.deepEqual(
      assembledProductionIds,
      expectedProductionIds,
      `${editionId} 活页版本文件必须通过统一装配 API 覆盖全部当前剧目`,
    );
  }
}

function cloneArtworkManifest() {
  return Object.fromEntries(
    Object.entries(productionArtworkManifest).map(([productionId, worlds]) => [
      productionId,
      Object.fromEntries(
        Object.entries(worlds).map(([world, entry]) => [world, entry && { ...entry }]),
      ),
    ]),
  );
}

function createValidationSources(overrides = {}) {
  return {
    performanceVariants: performanceVariantRegistry,
    productions,
    folioSources: folioSourceRecords,
    folioSourceTexts,
    locations,
    localizations: localizationPackages,
    artwork: productionArtworkManifest,
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
    seatingPlans: ticketSeatingPlans,
    ticketingPlatforms,
    archiveProjection: archiveProjectionIdentity,
    ...overrides,
  };
}

function cloneProductionArtworkRegistry() {
  return Object.fromEntries(
    Object.entries(productionArtworkRegistry).map(([productionId, worlds]) => [
      productionId,
      Object.fromEntries(
        Object.entries(worlds).map(([world, entry]) => [world, entry && structuredClone(entry)]),
      ),
    ]),
  );
}

function withPreviewVariant(performanceId, value, variantId = 'test-preview') {
  const baseline = performanceVariantRegistry[performanceId];
  assert.ok(baseline, `测试场次 ${performanceId} 应存在基线变体`);
  return {
    ...performanceVariantRegistry,
    [performanceId]: {
      ...baseline,
      preview: { variantId, maturity: 'preview', value },
    },
  };
}

function assertArtworkFiles() {
  for (const worlds of Object.values(productionArtworkManifest)) {
    for (const entry of Object.values(worlds)) {
      if (!entry) {
        continue;
      }
      const digest = `sha256:${createHash('sha256')
        .update(readFileSync(path.join(repositoryRoot, entry.assetPath)))
        .digest('hex')}`;
      assert.equal(digest, entry.sourceRevision, `${entry.assetPath} 与素材修订摘要不一致`);
    }
  }
}

function assertTicketingPlatformLogoFiles() {
  for (const platform of Object.values(ticketingPlatforms)) {
    const digest = `sha256:${createHash('sha256')
      .update(readFileSync(path.join(repositoryRoot, platform.logo.assetPath)))
      .digest('hex')}`;
    assert.equal(
      digest,
      platform.logo.sourceRevision,
      `${platform.logo.assetPath} 与素材修订摘要不一致`,
    );
  }
}

assert.doesNotThrow(() => assertContentBundle(buildEditionIds, currentRootSet, buildContext));
assertFolioAuthoringStructure();
assertArtworkFiles();
assertTicketingPlatformLogoFiles();
assert.equal(Object.keys(performances).length, 28, '预备场次目录应包含 28 条记录');
assert.equal(Object.keys(productions).length, 14, '预备剧目目录应包含 14 条记录');
assert.equal(Object.keys(folioSourceRecords).length, 13, '活页来源目录应完整保存 13 条记录');
assert.equal(
  productionTitleReference.match(/^### `PROD-SRC-\d+`/gmu)?.length,
  13,
  '活页来源参考应完整保存 13 条官方描述',
);
for (const [productionId, source] of Object.entries(folioSourceRecords)) {
  const titleRow = productionTitleReference
    .split('\n')
    .find((line) => line.includes(`| \`${source.sourceId}\` | \`${productionId}\``));
  assert.ok(titleRow, `${productionId} 的人员参考缺少标题来源行`);
  assert.deepEqual(
    titleRow
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim()),
    [
      `\`${source.sourceId}\``,
      `\`${productionId}\``,
      source.titleForms['zh-CN'],
      source.titleForms.en,
      source.titleForms['ja-JP'],
    ],
    `${productionId} 的运行时标题来源与人员参考不一致`,
  );
  const quotedSynopsis = source.synopsis.text
    .split('\n\n')
    .map((paragraph) => `> ${paragraph}`)
    .join('\n>\n');
  assert.ok(
    productionTitleReference.includes(
      `### \`${source.sourceId}\`｜\`${productionId}\`｜${source.titleForms['zh-CN']}\n\n${quotedSynopsis}`,
    ),
    `${productionId} 的运行时活页来源与人员参考不一致`,
  );
}
assert.equal(buildSnapshot.performanceEntries.length, 28, '当前根集合应发布 28 个场次');
assert.equal(buildSnapshot.productionEntries.length, 14, '当前根集合应发布 14 个剧目');

const cachedYanLocalization = getLocalization(editions.yan, buildSnapshot);
assert.equal(
  getLocalization(editions.yan, buildSnapshot),
  cachedYanLocalization,
  '同一快照与国家版本应复用严格本地化解析结果',
);
const parallelSnapshot = { ...buildSnapshot };
assert.notEqual(
  getLocalization(editions.yan, parallelSnapshot),
  cachedYanLocalization,
  '本地化缓存不得跨内容快照复用',
);
const snapshotArtwork = buildSnapshot.artworkEntries[0][2];
const snapshotSeatingPlan = buildSnapshot.seatingPlanEntries[0][1];
assert.ok(Object.isFrozen(buildSnapshot.localizationPackages.yan.site.brand));
assert.ok(Object.isFrozen(snapshotArtwork.pollution.darkenZones));
assert.ok(Object.isFrozen(snapshotSeatingPlan.levels));
assert.ok(Object.isFrozen(snapshotSeatingPlan.levels[0].regions));
assert.throws(() => {
  buildSnapshot.localizationPackages.yan.site.brand.name = '测试';
}, TypeError);
assert.throws(() => snapshotArtwork.pollution.darkenZones.push('top'), TypeError);
assert.throws(() => snapshotSeatingPlan.levels.push(snapshotSeatingPlan.levels[0]), TypeError);
assert.throws(() => {
  snapshotSeatingPlan.levels[0].regions[0].path = 'M0 0';
}, TypeError);

const fixtureId = 'uncrowned-trimount-1102';
const fixturePerformance = performances[fixtureId];
const selectedPreview = selectCompleteVariant(
  {
    stableId: fixtureId,
    baseline: { variantId: 'baseline', maturity: 'preview', value: fixturePerformance },
    preview: {
      variantId: 'preview-v2',
      maturity: 'preview',
      value: { ...fixturePerformance, status: 'pending' },
    },
  },
  assertPerformanceVariantComplete,
);
assert.equal(selectedPreview.variantId, 'preview-v2');
assert.equal(selectedPreview.value.status, 'pending');
const persistentFixture = getPerformanceVariantUnit(fixtureId);
assert.ok(persistentFixture);
assert.equal(persistentFixture.preview?.variantId, 'current-preview');
assert.equal(persistentFixture.preview?.value, persistentFixture.baseline.value);
assert.equal(
  localizationPackages.columbia.programs.locations['calais-blason'],
  undefined,
  '集合外作者候选不要求哥伦比亚语记录',
);
assert.throws(
  () =>
    assertContentBundle(
      ['yan', 'columbia'],
      currentRootSet,
      buildContext,
      createValidationSources({
        performanceVariants: withPreviewVariant(fixtureId, {
          ...fixturePerformance,
          locationId: 'calais-blason',
        }),
      }),
    ),
  /columbia\.locations\.calais-blason 缺失/u,
);
assert.throws(
  () =>
    selectCompleteVariant(
      {
        stableId: fixtureId,
        baseline: { variantId: 'baseline', maturity: 'preview', value: fixturePerformance },
        preview: {
          variantId: 'incomplete-preview',
          maturity: 'preview',
          value: { ...fixturePerformance, locationId: undefined },
        },
      },
      assertPerformanceVariantComplete,
    ),
  /locationId 缺失/u,
);

const alternateDependencyId = 'procession-of-masks-londinium-1103-0214';
const alternateDependencyPerformance = performances[alternateDependencyId];
const alternateDependencyVariants = withPreviewVariant(alternateDependencyId, {
  ...alternateDependencyPerformance,
  productionIds: ['caged-fire'],
});
const manifestWithoutUnselectedBaseline = cloneArtworkManifest();
delete manifestWithoutUnselectedBaseline['procession-of-masks'].front;
assert.doesNotThrow(() =>
  assertContentBundle(
    ['yan'],
    currentRootSet,
    buildContext,
    createValidationSources({
      performanceVariants: alternateDependencyVariants,
      artwork: manifestWithoutUnselectedBaseline,
    }),
  ),
);
const alternateDependencyLocalizations = structuredClone(localizationPackages);
alternateDependencyLocalizations.yan.programs.productions[
  alternateDependencyPerformance.productionIds[0]
].heading += '测试';
assert.doesNotThrow(() =>
  assertContentBundle(
    ['yan', 'columbia'],
    currentRootSet,
    buildContext,
    createValidationSources({
      performanceVariants: alternateDependencyVariants,
      localizations: alternateDependencyLocalizations,
    }),
  ),
);
const manifestWithoutSelectedPreview = cloneArtworkManifest();
delete manifestWithoutSelectedPreview['caged-fire'].front;
assert.throws(
  () =>
    assertContentBundle(
      ['yan'],
      currentRootSet,
      buildContext,
      createValidationSources({
        performanceVariants: alternateDependencyVariants,
        artwork: manifestWithoutSelectedPreview,
      }),
    ),
  /artwork\.caged-fire\.front 缺失/u,
);

const archiveOriginalId = currentRootSet.worlds.archive.performanceIds[0];
assert.throws(
  () =>
    assertContentBundle(
      ['yan'],
      currentRootSet,
      buildContext,
      createValidationSources({
        performanceVariants: withPreviewVariant(archiveOriginalId, {
          ...performances[archiveOriginalId],
          productionIds: ['uncrowned'],
        }),
      }),
    ),
  /只能引用 folio 剧目：uncrowned/u,
);

const staleRevisions = {
  ...localizationSourceRevisions,
  higashi: {
    ...localizationSourceRevisions.higashi,
    'site.brand': 'fnv1a64:0000000000000000',
  },
};
assert.throws(
  () =>
    assertLocalizationSourceFresh(
      ['yan', 'higashi'],
      localizationPackages,
      staleRevisions,
      buildSnapshot,
    ),
  /higashi\.site\.brand 译文源修订已过期/u,
);
assert.deepEqual(
  localizationSourceRevisions.higashi,
  createLocalizationSourceRevision(localizationPackages.yan),
);

const packagesWithoutPerformance = structuredClone(localizationPackages);
delete packagesWithoutPerformance.columbia.programs.performances[fixtureId];
const missingLocalizationSnapshot = {
  ...buildSnapshot,
  localizationPackages: packagesWithoutPerformance,
};
const missingDiagnostic = diagnoseLocalization(
  editions.columbia,
  missingLocalizationSnapshot,
  packagesWithoutPerformance,
);
assert.deepEqual(
  missingDiagnostic.entries.find((entry) => entry.path === `performances.${fixtureId}`),
  {
    path: `performances.${fixtureId}`,
    value: localizationPackages.yan.programs.performances[fixtureId],
    sourceLocale: 'zh-CN',
    usedFallback: true,
    reason: 'missing',
  },
);
assert.throws(
  () => getLocalization(editions.columbia, missingLocalizationSnapshot),
  new RegExp(`performances[.]${fixtureId}（缺失）`, 'u'),
);

const packagesWithStaleSource = structuredClone(localizationPackages);
packagesWithStaleSource.yan.programs.locations.trimount.cityLabel += '测试';
const staleLocalizationSnapshot = {
  ...buildSnapshot,
  localizationPackages: packagesWithStaleSource,
};
assert.equal(
  diagnoseLocalization(
    editions.columbia,
    staleLocalizationSnapshot,
    packagesWithStaleSource,
  ).entries.find((entry) => entry.path === 'locations.trimount')?.reason,
  'stale',
);
assert.throws(
  () => getLocalization(editions.columbia, staleLocalizationSnapshot),
  /locations\.trimount（旧译）/u,
);

const packagesWithOutOfScopeChange = structuredClone(localizationPackages);
packagesWithOutOfScopeChange.yan.programs.locations['calais-blason'].cityLabel += '测试';
const outOfScopeSnapshot = {
  ...buildSnapshot,
  localizationPackages: packagesWithOutOfScopeChange,
};
assert.doesNotThrow(() => getLocalization(editions.columbia, outOfScopeSnapshot));
assert.doesNotThrow(() =>
  assertContentBundle(
    ['yan', 'columbia'],
    currentRootSet,
    buildContext,
    createValidationSources({ localizations: packagesWithOutOfScopeChange }),
  ),
);

const packagesWithRewrittenFolioSynopsis = structuredClone(localizationPackages);
packagesWithRewrittenFolioSynopsis.yan.programs.productions['der-ring'].synopsis += '测试改写';
assert.throws(
  () =>
    assertContentBundle(
      ['yan'],
      currentRootSet,
      buildContext,
      createValidationSources({ localizations: packagesWithRewrittenFolioSynopsis }),
    ),
  /yan\.productions\.der-ring\.synopsis 未采用集中活页来源简介/u,
);

const packagesWithRewrittenFolioTagline = structuredClone(localizationPackages);
packagesWithRewrittenFolioTagline.yan.programs.productions['lone-wander'].tagline += '测试改写';
assert.throws(
  () =>
    assertContentBundle(
      ['yan'],
      currentRootSet,
      buildContext,
      createValidationSources({ localizations: packagesWithRewrittenFolioTagline }),
    ),
  /yan\.productions\.lone-wander\.tagline 未采用集中活页来源简介/u,
);

assert.throws(
  () =>
    assertContentBundle(
      ['yan'],
      currentRootSet,
      buildContext,
      createValidationSources({ archiveProjection: { productionId: 'uncrowned' } }),
    ),
  /archiveProjection\.artwork\.uncrowned\.archive 缺失/u,
);

const offersFixtureId = 'uncrowned-trimount-1102';
const offersFixture = performances[offersFixtureId];
assert.equal(offersFixture.ticketAvailability.state, 'on-sale');
for (const [label, offers, expectation] of [
  [
    'duplicate',
    [offersFixture.ticketAvailability.offers[0], offersFixture.ticketAvailability.offers[0]],
    /含重复分区：C/u,
  ],
  [
    'negative',
    [{ ...offersFixture.ticketAvailability.offers[0], basePrice: -1 }],
    /必须是正安全整数/u,
  ],
  [
    'topology-missing',
    offersFixture.ticketAvailability.offers.slice(0, -1),
    /报价分区与座席拓扑不一致：缺少 BOX/u,
  ],
]) {
  assert.throws(
    () =>
      assertContentBundle(
        ['yan'],
        currentRootSet,
        buildContext,
        createValidationSources({
          performanceVariants: withPreviewVariant(
            offersFixtureId,
            {
              ...offersFixture,
              ticketAvailability: {
                ...offersFixture.ticketAvailability,
                offers,
              },
            },
            `offers-${label}`,
          ),
        }),
      ),
    expectation,
  );
}

assert.throws(
  () =>
    assertContentBundle(
      ['yan'],
      currentRootSet,
      buildContext,
      createValidationSources({
        offerMatrix: {
          'der-ring': {
            'zwillingsturme-mirror-lake-hall': [-1, 280, 450, 720, 1180],
          },
        },
      }),
    ),
  /performanceOffers\.der-ring\.zwillingsturme-mirror-lake-hall\.C 必须是正整数/u,
);

const manifestWithoutRequiredArtwork = cloneArtworkManifest();
delete manifestWithoutRequiredArtwork.uncrowned.front;
assert.throws(
  () =>
    assertContentBundle(
      ['yan'],
      currentRootSet,
      buildContext,
      createValidationSources({ artwork: manifestWithoutRequiredArtwork }),
    ),
  /artwork\.uncrowned\.front 缺失/u,
);

const seatingPlansWithoutRequiredPlan = { ...ticketSeatingPlans };
delete seatingPlansWithoutRequiredPlan['trimount-grand-fan'];
assert.throws(
  () =>
    assertContentBundle(
      ['yan'],
      currentRootSet,
      buildContext,
      createValidationSources({ seatingPlans: seatingPlansWithoutRequiredPlan }),
    ),
  /seatingPlan\.trimount-grand-fan 缺失/u,
);

const localizationWithoutPerformance = {
  ...localizationPackages,
  yan: {
    ...localizationPackages.yan,
    programs: {
      ...localizationPackages.yan.programs,
      performances: { ...localizationPackages.yan.programs.performances },
    },
  },
};
delete localizationWithoutPerformance.yan.programs.performances[fixtureId];
assert.throws(
  () =>
    assertContentBundle(
      ['yan'],
      currentRootSet,
      buildContext,
      createValidationSources({ localizations: localizationWithoutPerformance }),
    ),
  new RegExp(`yan\\.performances\\.${fixtureId} 缺失`, 'u'),
);

const localizationWithoutAuxiliaryTicketContent = structuredClone(localizationPackages);
delete localizationWithoutAuxiliaryTicketContent.leithanien.programs.performances[
  'caged-fire-wiesheim-1102'
];
assert.throws(
  () =>
    assertContentBundle(
      ['yan'],
      currentRootSet,
      buildContexts.showcase,
      createValidationSources({ localizations: localizationWithoutAuxiliaryTicketContent }),
    ),
  /ticketArtifact\.leithanien\.performances\.caged-fire-wiesheim-1102 缺失/u,
);

const currentDigests = createContentApprovalDigests(
  buildContexts.release.editionIds,
  currentRootSet,
);
const alternateDependencyDigests = createContentApprovalDigests(
  buildContexts.release.editionIds,
  currentRootSet,
  createApprovalSources({ performanceVariants: alternateDependencyVariants }),
);
assert.notEqual(
  alternateDependencyDigests.performances[alternateDependencyId],
  currentDigests.performances[alternateDependencyId],
);
const changedAuxiliaryTicketLocalizations = structuredClone(localizationPackages);
changedAuxiliaryTicketLocalizations.leithanien.messages.ticketing.artifact.header =
  'CHANGED TICKET HEADER';
const changedAuxiliaryTicketDigests = createContentApprovalDigests(
  buildContexts.release.editionIds,
  currentRootSet,
  createApprovalSources({ localizations: changedAuxiliaryTicketLocalizations }),
);
assert.equal(changedAuxiliaryTicketDigests.site, currentDigests.site);
assert.notEqual(
  changedAuxiliaryTicketDigests.performances['caged-fire-wiesheim-1102'],
  currentDigests.performances['caged-fire-wiesheim-1102'],
  '辅助票面语言变化必须使消费它的场次批准摘要失效',
);
const currentApprovals = {
  site: currentDigests.site,
  rootSets: { [currentRootSet.rootSetId]: currentDigests.rootSet },
  performances: currentDigests.performances,
};
assert.throws(
  () => assertContentContextEligible(buildContexts.release, currentRootSet, currentApprovals),
  /ticketing-platform\.rice-network\.logo（正式 Logo 缺失）.*ticketing-platform\.drop-tower\.logo（正式 Logo 缺失）/u,
);
const approvedTicketingPlatforms = Object.fromEntries(
  Object.entries(ticketingPlatforms).map(([platformId, platform]) => [
    platformId,
    {
      ...platform,
      logo: { ...platform.logo, maturity: 'formal', approvalStatus: 'approved' },
    },
  ]),
);
assert.doesNotThrow(() =>
  assertContentContextEligible(
    buildContexts.release,
    currentRootSet,
    currentApprovals,
    approvedTicketingPlatforms,
  ),
);
assert.throws(
  () => assertContentContextEligible(buildContexts.release, currentRootSet),
  (error) =>
    error instanceof Error &&
    error.message.includes('site（无批准摘要）') &&
    error.message.includes(`${currentRootSet.rootSetId}（无批准摘要）`) &&
    Object.keys(performances).every(
      (performanceId) =>
        !currentRootSet.worlds.front.performanceIds.includes(performanceId) ||
        error.message.includes(performanceId),
    ) &&
    currentRootSet.worlds.archive.performanceIds.every((performanceId) =>
      error.message.includes(performanceId),
    ),
);

const changedPerformanceSources = createApprovalSources({
  performanceVariants: createBaselinePerformanceVariantRegistry({
    ...performances,
    [fixtureId]: { ...fixturePerformance, status: 'pending' },
  }),
});
const changedBodyDigests = createContentApprovalDigests(
  buildContexts.release.editionIds,
  currentRootSet,
  changedPerformanceSources,
);
assert.equal(changedBodyDigests.site, currentDigests.site);
assert.equal(changedBodyDigests.rootSet, currentDigests.rootSet);
assert.notEqual(changedBodyDigests.performances[fixtureId], currentDigests.performances[fixtureId]);
assert.equal(
  changedBodyDigests.performances['caged-fire-wiesheim-1102'],
  currentDigests.performances['caged-fire-wiesheim-1102'],
);

const changedArtworkRegistry = cloneProductionArtworkRegistry();
changedArtworkRegistry.uncrowned.front.sourceRevision =
  'sha256:0000000000000000000000000000000000000000000000000000000000000000';
const changedAssetDigests = createContentApprovalDigests(
  buildContexts.release.editionIds,
  currentRootSet,
  createApprovalSources({ artwork: changedArtworkRegistry }),
);
assert.notEqual(
  changedAssetDigests.performances[fixtureId],
  currentDigests.performances[fixtureId],
);

const movedArtworkRegistry = cloneProductionArtworkRegistry();
movedArtworkRegistry.uncrowned.front.assetPath =
  'src/assets/images/productions/relocated-uncrowned-front.webp';
const movedAssetDigests = createContentApprovalDigests(
  buildContexts.release.editionIds,
  currentRootSet,
  createApprovalSources({ artwork: movedArtworkRegistry }),
);
assert.equal(movedAssetDigests.performances[fixtureId], currentDigests.performances[fixtureId]);

const changedSeatingPlans = structuredClone(ticketSeatingPlans);
changedSeatingPlans['trimount-grand-fan'].levels[0].stage.width += 1;
const changedSeatingDigests = createContentApprovalDigests(
  buildContexts.release.editionIds,
  currentRootSet,
  createApprovalSources({ seatingPlans: changedSeatingPlans }),
);
assert.notEqual(
  changedSeatingDigests.performances[fixtureId],
  currentDigests.performances[fixtureId],
);

const changedSiteLocalizations = structuredClone(localizationPackages);
changedSiteLocalizations.yan.site.shared.fanNotice += '。';
const changedSiteDigests = createContentApprovalDigests(
  buildContexts.release.editionIds,
  currentRootSet,
  createApprovalSources({ localizations: changedSiteLocalizations }),
);
assert.notEqual(changedSiteDigests.site, currentDigests.site);
assert.equal(changedSiteDigests.rootSet, currentDigests.rootSet);
assert.deepEqual(changedSiteDigests.performances, currentDigests.performances);

const reorderedRootSet = {
  ...currentRootSet,
  worlds: {
    ...currentRootSet.worlds,
    front: {
      ...currentRootSet.worlds.front,
      performanceIds: [...currentRootSet.worlds.front.performanceIds].reverse(),
    },
  },
};
const reorderedDigests = createContentApprovalDigests(
  buildContexts.release.editionIds,
  reorderedRootSet,
);
assert.equal(reorderedDigests.site, currentDigests.site);
assert.notEqual(reorderedDigests.rootSet, currentDigests.rootSet);
assert.deepEqual(reorderedDigests.performances, currentDigests.performances);

console.log(
  `content validation passed: profile=${buildContext.profile}, editions=${buildEditionIds.join(',')}, performances=${currentRootSet.worlds.front.performanceIds.length + currentRootSet.worlds.archive.performanceIds.length}, approvals=0`,
);

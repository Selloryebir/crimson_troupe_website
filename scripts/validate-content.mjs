#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createContentApprovalDigests } from '../src/data/content/approval-digests.ts';
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
import { getPerformanceVariantUnit, selectCompleteVariant } from '../src/data/content/variants.ts';
import { buildContext, buildContexts, buildEditionIds, editions } from '../src/data/editions.ts';
import { locations } from '../src/data/locations.ts';
import { localizationPackages } from '../src/data/localized/packages.ts';
import { diagnoseLocalization, getLocalization } from '../src/data/localized/resolve.ts';
import { performances } from '../src/data/performances.ts';
import { productionArtworkManifest } from '../src/data/production-artwork-manifest.ts';
import { productionArtworkRegistry } from '../src/data/production-artworks.ts';
import { productions } from '../src/data/productions/index.ts';
import { ticketSeatingPlans } from '../src/data/ticket-seating-plans.ts';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

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
    performances,
    productions,
    locations,
    localizations: localizationPackages,
    artwork: productionArtworkManifest,
    seatingPlans: ticketSeatingPlans,
    ...overrides,
  };
}

function createApprovalSources(overrides = {}) {
  return {
    performances,
    productions,
    locations,
    localizations: localizationPackages,
    artwork: productionArtworkRegistry,
    seatingPlans: ticketSeatingPlans,
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

assert.doesNotThrow(() =>
  assertContentBundle(buildEditionIds, currentRootSet, undefined, buildContext),
);
assertArtworkFiles();
assert.equal(Object.keys(performances).length, 28, '预备场次目录应包含 28 条记录');
assert.equal(Object.keys(productions).length, 14, '预备剧目目录应包含 14 条记录');
assert.equal(buildSnapshot.performanceEntries.length, 28, '当前根集合应发布 28 个场次');
assert.equal(buildSnapshot.productionEntries.length, 14, '当前根集合应发布 14 个剧目');

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

const manifestWithoutRequiredArtwork = cloneArtworkManifest();
delete manifestWithoutRequiredArtwork.uncrowned.front;
assert.throws(
  () =>
    assertContentBundle(
      ['yan'],
      currentRootSet,
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
      createValidationSources({ localizations: localizationWithoutPerformance }),
    ),
  new RegExp(`yan\\.performances\\.${fixtureId} 缺失`, 'u'),
);

const currentDigests = createContentApprovalDigests(
  buildContexts.release.editionIds,
  currentRootSet,
);
const currentApprovals = {
  site: currentDigests.site,
  rootSets: { [currentRootSet.rootSetId]: currentDigests.rootSet },
  performances: currentDigests.performances,
};
assert.doesNotThrow(() =>
  assertContentContextEligible(buildContexts.release, currentRootSet, currentApprovals),
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
  performances: {
    ...performances,
    [fixtureId]: { ...fixturePerformance, status: 'pending' },
  },
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

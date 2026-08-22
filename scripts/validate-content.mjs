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
import { currentRootSet } from '../src/data/content/root-sets.ts';
import {
  assertContentBundle,
  assertPerformanceVariantComplete,
} from '../src/data/content/validate.ts';
import { getPerformanceVariantUnit, selectCompleteVariant } from '../src/data/content/variants.ts';
import { buildContext, buildContexts, buildEditionIds } from '../src/data/editions.ts';
import { locations } from '../src/data/locations.ts';
import { localizationPackages } from '../src/data/localized/packages.ts';
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

assert.doesNotThrow(() => assertContentBundle(buildEditionIds, currentRootSet));
assertArtworkFiles();

const fixtureId = 'uncrowned-trimount-1098';
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
    site: 'fnv1a64:0000000000000000',
  },
};
assert.throws(
  () => assertLocalizationSourceFresh(['yan', 'higashi'], localizationPackages, staleRevisions),
  /higashi\.site 译文源修订已过期/u,
);
assert.deepEqual(
  localizationSourceRevisions.higashi,
  createLocalizationSourceRevision(localizationPackages.yan),
);

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
  changedBodyDigests.performances['caged-fire-wiesheim-1098'],
  currentDigests.performances['caged-fire-wiesheim-1098'],
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
changedSeatingPlans['trimount-grand-fan'].stage.width += 1;
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

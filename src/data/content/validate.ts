import type { BuildEditionId } from '../editions.ts';
import { locations } from '../locations.ts';
import { localizationPackages, type PartialLocalizationPackage } from '../localized/packages.ts';
import { assertPerformanceOfferMatrix } from '../performance-offers.ts';
import { performances, type Performance, type PerformanceId } from '../performances.ts';
import {
  productionArtworkManifest,
  type ProductionArtworkManifest,
} from '../production-artwork-manifest.ts';
import { productions } from '../productions/index.ts';
import { ticketSeatingPlans, type SeatingPlanDefinition } from '../ticket-seating-plans.ts';
import { assertLocalizationSourceFresh } from './localization-revisions.ts';
import { getRootPerformanceIds, type ContentRootSet, validateContentRootSet } from './root-sets.ts';
import { selectCompleteVariant, type ContentVariantUnit } from './variants.ts';
import { assertTerraDateTime } from '../site-time.ts';

export interface ContentValidationSources {
  performances: Readonly<Record<string, Performance>>;
  productions: Readonly<Record<string, unknown>>;
  locations: Readonly<Record<string, unknown>>;
  localizations: Readonly<Record<BuildEditionId, PartialLocalizationPackage>>;
  artwork: ProductionArtworkManifest;
  seatingPlans: Readonly<Record<string, SeatingPlanDefinition>>;
}

const defaultSources: ContentValidationSources = {
  performances,
  productions,
  locations,
  localizations: localizationPackages,
  artwork: productionArtworkManifest,
  seatingPlans: ticketSeatingPlans,
};

function assertPresent(value: unknown, path: string): void {
  if (value === undefined || value === null) {
    throw new Error(`${path} 缺失。`);
  }
  if (typeof value === 'string' && value.trim() === '') {
    throw new Error(`${path} 为空。`);
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      throw new Error(`${path} 为空数组。`);
    }
    value.forEach((item, index) => assertPresent(item, `${path}[${index}]`));
    return;
  }
  if (typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => assertPresent(item, `${path}.${key}`));
  }
}

export function assertPerformanceVariantComplete(stableId: string, value: Performance): void {
  assertPresent(
    {
      performanceId: value.performanceId,
      world: value.world,
      status: value.status,
      locationId: value.locationId,
      effectiveDateTime: value.effectiveDateTime,
      productionIds: value.productionIds,
      ticketAvailability: value.ticketAvailability,
    },
    `performance.${stableId}`,
  );
  if (value.performanceId !== stableId) {
    throw new Error(`场次稳定 ID 与记录不一致：${stableId} != ${value.performanceId}`);
  }
  assertTerraDateTime(value.effectiveDateTime, `performance.${stableId}.effectiveDateTime`);
  if (value.previousDateTime) {
    assertTerraDateTime(value.previousDateTime, `performance.${stableId}.previousDateTime`);
  }
}

export function assertContentBundle(
  editionIds: readonly BuildEditionId[],
  rootSet: ContentRootSet,
  sources: ContentValidationSources = defaultSources,
): void {
  assertPerformanceOfferMatrix();
  validateContentRootSet(rootSet, sources.performances);
  const selectedPerformances = getRootPerformanceIds(rootSet).map((performanceId) => {
    const value = sources.performances[performanceId];
    const unit: ContentVariantUnit<Performance> = {
      stableId: performanceId,
      baseline: { variantId: 'baseline', maturity: 'preview', value },
    };
    return selectCompleteVariant(unit, assertPerformanceVariantComplete).value;
  });

  for (const performance of selectedPerformances) {
    assertPresent(sources.locations[performance.locationId], `location.${performance.locationId}`);
    for (const productionId of performance.productionIds) {
      assertPresent(sources.productions[productionId], `production.${productionId}`);
      assertPresent(
        sources.artwork[productionId]?.[performance.world],
        `artwork.${productionId}.${performance.world}`,
      );
    }
    if (performance.ticketAvailability.state === 'on-sale') {
      if (performance.world === 'front' && !performance.ticketAvailability.seatingPlanId) {
        throw new Error(`表站可售场次 ${performance.performanceId} 缺少分区示意。`);
      }
      if (performance.ticketAvailability.seatingPlanId) {
        assertPresent(
          sources.seatingPlans[performance.ticketAvailability.seatingPlanId],
          `seatingPlan.${performance.ticketAvailability.seatingPlanId}`,
        );
      }
    }
    for (const editionId of editionIds) {
      const package_ = sources.localizations[editionId];
      assertPresent(package_?.site, `${editionId}.site`);
      assertPresent(package_?.messages, `${editionId}.messages`);
      assertPresent(package_?.archiveProjection, `${editionId}.archiveProjection`);
      assertPresent(
        package_?.programs?.locations?.[performance.locationId],
        `${editionId}.locations.${performance.locationId}`,
      );
      assertPresent(
        package_?.programs?.performances?.[performance.performanceId as PerformanceId],
        `${editionId}.performances.${performance.performanceId}`,
      );
      for (const productionId of performance.productionIds) {
        assertPresent(
          package_?.programs?.productions?.[productionId],
          `${editionId}.productions.${productionId}`,
        );
      }
    }
  }

  assertLocalizationSourceFresh(editionIds, sources.localizations);
}

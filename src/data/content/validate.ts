import { archiveProjectionIdentity, type ArchiveProjectionIdentity } from '../archive-pollution.ts';
import type { BuildEditionId } from '../editions.ts';
import { locations, type Location } from '../locations.ts';
import { folioSourceTexts, type FolioSourceText } from '../localized/folio-source-texts.ts';
import { localizationPackages, type PartialLocalizationPackage } from '../localized/packages.ts';
import { getTicketArtifactEditionIds } from '../localized/ticket-artifact.ts';
import {
  assertPerformanceOfferMatrix,
  performanceOfferMatrix,
  ticketZoneOrder,
  type PerformanceOfferMatrix,
} from '../performance-offers.ts';
import type { Performance, PerformanceId, TicketZone } from '../performances.ts';
import {
  productionArtworkManifest,
  type ProductionArtworkManifest,
} from '../production-artwork-manifest.ts';
import { folioSourceRecords, type FolioSourceRecord } from '../productions/folio-source-records.ts';
import { productions, type Production, type ProductionId } from '../productions/index.ts';
import { ticketSeatingPlans, type SeatingPlanDefinition } from '../ticket-seating-plans.ts';
import {
  ticketingPlatformIds,
  ticketingPlatforms,
  type TicketingPlatformDefinition,
  type TicketingPlatformId,
} from '../ticketing-platforms.ts';
import { assertLocalizationSourceFresh } from './localization-revisions.ts';
import { getRootPerformanceIds, type ContentRootSet, validateContentRootSet } from './root-sets.ts';
import {
  getPerformanceVariantUnit,
  performanceVariantRegistry,
  selectCompleteVariant,
  type PerformanceVariantRegistry,
} from './variants.ts';
import { assertTerraDateTime } from '../site-time.ts';
import type { BuildContext } from './build-context.ts';

export interface ContentValidationSources {
  performanceVariants: PerformanceVariantRegistry;
  productions: Readonly<Record<string, Production>>;
  folioSources: Readonly<Record<string, FolioSourceRecord>>;
  folioSourceTexts: Readonly<Record<string, Readonly<Record<BuildEditionId, FolioSourceText>>>>;
  locations: Readonly<Record<string, Location>>;
  localizations: Readonly<Record<BuildEditionId, PartialLocalizationPackage>>;
  artwork: ProductionArtworkManifest;
  seatingPlans: Readonly<Record<string, SeatingPlanDefinition>>;
  ticketingPlatforms: Readonly<Record<TicketingPlatformId, TicketingPlatformDefinition>>;
  offerMatrix: PerformanceOfferMatrix;
  archiveProjection: ArchiveProjectionIdentity;
}

const defaultSources: ContentValidationSources = {
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
};

function assertPresent<Value>(value: Value, path: string): asserts value is NonNullable<Value> {
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

function assertFinalTicketOffers(
  performance: Performance,
  seatingPlan: SeatingPlanDefinition | undefined,
): void {
  if (performance.ticketAvailability.state !== 'on-sale') {
    return;
  }
  const path = `performance.${performance.performanceId}.ticketAvailability.offers`;
  const offers = performance.ticketAvailability.offers;
  if (offers.length === 0) {
    throw new Error(`${path} 不能为空。`);
  }

  const seenZones = new Set<TicketZone>();
  let previousZoneIndex = -1;
  let previousPrice = 0;
  for (const offer of offers) {
    const zoneIndex = ticketZoneOrder.indexOf(offer.zone);
    if (zoneIndex === -1) {
      throw new Error(`${path} 含非法分区：${String(offer.zone)}`);
    }
    if (seenZones.has(offer.zone)) {
      throw new Error(`${path} 含重复分区：${offer.zone}`);
    }
    if (zoneIndex <= previousZoneIndex) {
      throw new Error(`${path} 必须按 C、B、A、S、BOX 顺序排列。`);
    }
    if (!Number.isSafeInteger(offer.basePrice) || offer.basePrice <= 0) {
      throw new Error(`${path}.${offer.zone} 必须是正安全整数。`);
    }
    if (offer.basePrice <= previousPrice) {
      throw new Error(`${path} 的有效价格必须严格递增。`);
    }
    seenZones.add(offer.zone);
    previousZoneIndex = zoneIndex;
    previousPrice = offer.basePrice;
  }

  if (!seatingPlan) {
    return;
  }
  const topologyZones = new Set(
    seatingPlan.levels.flatMap((level) => level.regions.map((region) => region.zone)),
  );
  const missingOffers = [...topologyZones].filter((zone) => !seenZones.has(zone));
  const unknownOffers = [...seenZones].filter((zone) => !topologyZones.has(zone));
  if (missingOffers.length > 0 || unknownOffers.length > 0) {
    throw new Error(
      `performance.${performance.performanceId} 的报价分区与座席拓扑不一致：缺少 ${missingOffers.join('、') || '无'}；多出 ${unknownOffers.join('、') || '无'}`,
    );
  }
}

export function assertContentBundle(
  editionIds: readonly BuildEditionId[],
  rootSet: ContentRootSet,
  context: BuildContext,
  sources: ContentValidationSources = defaultSources,
): void {
  assertPerformanceOfferMatrix(sources.offerMatrix);
  const folioSourceIds = new Set<string>();
  for (const [sourceProductionId, source] of Object.entries(sources.folioSources)) {
    assertPresent(source, `folioSource.${sourceProductionId}`);
    if (source.productionId !== sourceProductionId) {
      throw new Error(
        `活页来源稳定 ID 与记录不一致：${sourceProductionId} != ${source.productionId}`,
      );
    }
    if (source.synopsis.sourceLocale !== 'zh-CN') {
      throw new Error(`folioSource.${sourceProductionId}.synopsis.sourceLocale 必须为 zh-CN。`);
    }
    if (folioSourceIds.has(source.sourceId)) {
      throw new Error(`活页来源 ID 重复：${source.sourceId}`);
    }
    folioSourceIds.add(source.sourceId);
  }
  for (const [productionId, production] of Object.entries(sources.productions)) {
    if (production.sourceKind !== 'folio') {
      continue;
    }
    const source = sources.folioSources[productionId];
    assertPresent(source, `folioSource.${productionId}`);
    const sourceTexts = sources.folioSourceTexts[productionId];
    assertPresent(sourceTexts, `folioSourceTexts.${productionId}`);
    if (sourceTexts.yan.title !== source.titleForms['zh-CN']) {
      throw new Error(`folioSourceTexts.${productionId}.yan.title 未逐字采用中文来源标题。`);
    }
    if (sourceTexts.yan.description !== source.synopsis.text) {
      throw new Error(`folioSourceTexts.${productionId}.yan.description 未逐字采用官方简介。`);
    }
    for (const editionId of ['victoria', 'columbia'] as const) {
      if (sourceTexts[editionId].title !== source.titleForms.en) {
        throw new Error(
          `folioSourceTexts.${productionId}.${editionId}.title 未逐字采用英文来源标题。`,
        );
      }
    }
    if (sourceTexts.higashi.title !== source.titleForms['ja-JP']) {
      throw new Error(`folioSourceTexts.${productionId}.higashi.title 未逐字采用日文来源标题。`);
    }
    for (const [editionId, package_] of Object.entries(sources.localizations)) {
      const localizedContent = package_.programs?.productions?.[productionId as ProductionId];
      const sourceText = sourceTexts[editionId as BuildEditionId];
      assertPresent(sourceText, `folioSourceTexts.${productionId}.${editionId}`);
      if (!localizedContent) {
        continue;
      }
      if (localizedContent.title !== sourceText.title) {
        throw new Error(`${editionId}.productions.${productionId}.title 未采用集中活页来源标题。`);
      }
      if (localizedContent.tagline !== sourceText.description) {
        throw new Error(
          `${editionId}.productions.${productionId}.tagline 未采用集中活页来源简介。`,
        );
      }
      if (localizedContent.synopsis !== sourceText.description) {
        throw new Error(
          `${editionId}.productions.${productionId}.synopsis 未采用集中活页来源简介。`,
        );
      }
    }
  }
  for (const platformId of ticketingPlatformIds) {
    const platform = sources.ticketingPlatforms[platformId];
    assertPresent(platform, `ticketingPlatform.${platformId}`);
    if (platform.platformId !== platformId) {
      throw new Error(`票务平台稳定 ID 与记录不一致：${platformId} != ${platform.platformId}`);
    }
    if (platform.logo.rights !== 'project-original') {
      throw new Error(`票务平台 ${platformId} 的 Logo 缺少项目原创权利声明。`);
    }
  }
  const selectedPerformances = getRootPerformanceIds(rootSet).map((performanceId) => {
    const unit = getPerformanceVariantUnit(performanceId, sources.performanceVariants);
    if (!unit) {
      throw new Error(`场次 ${performanceId} 缺少持久化内容变体。`);
    }
    return selectCompleteVariant(unit, assertPerformanceVariantComplete).value;
  });
  const selectedPerformanceRegistry = Object.fromEntries(
    selectedPerformances.map((performance) => [performance.performanceId, performance]),
  );
  validateContentRootSet(rootSet, selectedPerformanceRegistry, sources.productions, context);

  const productionIds = new Set(
    selectedPerformances.flatMap((performance) => performance.productionIds),
  );
  productionIds.add(sources.archiveProjection.productionId);
  const locationIds = new Set(selectedPerformances.map((performance) => performance.locationId));
  const ticketArtifactEditionIds = new Set<BuildEditionId>();

  for (const performance of selectedPerformances) {
    assertPresent(sources.locations[performance.locationId], `location.${performance.locationId}`);
    for (const productionId of performance.productionIds) {
      assertPresent(sources.productions[productionId], `production.${productionId}`);
      assertPresent(
        sources.artwork[productionId]?.[performance.world],
        `artwork.${productionId}.${performance.world}`,
      );
    }
    if (performance.world === 'front' && performance.ticketAvailability.state === 'on-sale') {
      const countryEditionId = sources.locations[performance.locationId].countryEditionId;
      const performanceArtifactEditionIds = getTicketArtifactEditionIds(
        editionIds,
        countryEditionId,
      );
      performanceArtifactEditionIds.forEach((editionId) => ticketArtifactEditionIds.add(editionId));
      for (const artifactEditionId of performanceArtifactEditionIds) {
        const artifactPackage = sources.localizations[artifactEditionId];
        assertPresent(
          artifactPackage?.programs?.locations?.[performance.locationId],
          `ticketArtifact.${artifactEditionId}.locations.${performance.locationId}`,
        );
        assertPresent(
          artifactPackage?.programs?.performances?.[performance.performanceId as PerformanceId],
          `ticketArtifact.${artifactEditionId}.performances.${performance.performanceId}`,
        );
        for (const productionId of performance.productionIds) {
          assertPresent(
            artifactPackage?.programs?.productions?.[productionId],
            `ticketArtifact.${artifactEditionId}.productions.${productionId}`,
          );
        }
        assertPresent(
          artifactPackage?.programs?.ticketZones,
          `ticketArtifact.${artifactEditionId}.ticketZones`,
        );
        assertPresent(
          artifactPackage?.messages?.ticketing?.artifact,
          `ticketArtifact.${artifactEditionId}.messages.ticketing.artifact`,
        );
      }
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
      assertFinalTicketOffers(
        performance,
        performance.ticketAvailability.seatingPlanId
          ? sources.seatingPlans[performance.ticketAvailability.seatingPlanId]
          : undefined,
      );
    }
    for (const editionId of editionIds) {
      const package_ = sources.localizations[editionId];
      assertPresent(package_?.site, `${editionId}.site`);
      assertPresent(package_?.messages, `${editionId}.messages`);
      for (const platformId of ticketingPlatformIds) {
        assertPresent(package_?.platforms?.[platformId], `${editionId}.platforms.${platformId}`);
      }
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

  assertPresent(
    sources.productions[sources.archiveProjection.productionId],
    `archiveProjection.production.${sources.archiveProjection.productionId}`,
  );
  assertPresent(
    sources.artwork[sources.archiveProjection.productionId]?.archive,
    `archiveProjection.artwork.${sources.archiveProjection.productionId}.archive`,
  );
  for (const editionId of editionIds) {
    const package_ = sources.localizations[editionId];
    assertPresent(package_?.site, `${editionId}.site`);
    assertPresent(package_?.messages, `${editionId}.messages`);
    for (const platformId of ticketingPlatformIds) {
      assertPresent(package_?.platforms?.[platformId], `${editionId}.platforms.${platformId}`);
    }
    assertPresent(package_?.archiveProjection, `${editionId}.archiveProjection`);
    assertPresent(
      package_?.programs?.productions?.[sources.archiveProjection.productionId],
      `${editionId}.archiveProjection.production.${sources.archiveProjection.productionId}`,
    );
  }

  assertLocalizationSourceFresh(
    [...new Set([...editionIds, ...ticketArtifactEditionIds])],
    sources.localizations,
    undefined,
    {
      locationEntries: [...locationIds].map((locationId) => [
        locationId,
        sources.locations[locationId],
      ]),
      performanceEntries: selectedPerformances.map((performance) => [
        performance.performanceId,
        performance,
      ]),
      productionEntries: [...productionIds].map((productionId) => [
        productionId,
        sources.productions[productionId],
      ]),
    },
  );
}

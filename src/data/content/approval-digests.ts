import { archiveProjectionIdentity, type ArchiveProjectionIdentity } from '../archive-pollution.ts';
import type { EditionId } from '../editions.ts';
import { locations, type Location } from '../locations.ts';
import { localizationPackages, type PartialLocalizationPackage } from '../localized/packages.ts';
import { getTicketArtifactEditionIds } from '../localized/ticket-artifact.ts';
import type { PerformanceId } from '../performances.ts';
import {
  productionArtworkRegistry,
  type ProductionArtwork,
  type ProductionArtworkRegistry,
} from '../production-artworks.ts';
import { productions, type Production } from '../productions/index.ts';
import {
  ticketSeatingPlans,
  type SeatingPlanDefinition,
  type SeatingPlanId,
} from '../ticket-seating-plans.ts';
import {
  ticketingPlatforms,
  type TicketingPlatformDefinition,
  type TicketingPlatformId,
} from '../ticketing-platforms.ts';
import { createContentFingerprint } from './fingerprint.ts';
import { getRootPerformanceIds, type ContentRootSet, type ContentRootSetId } from './root-sets.ts';
import { assertPerformanceVariantComplete } from './validate.ts';
import {
  getPerformanceVariantUnit,
  performanceVariantRegistry,
  selectCompleteVariant,
  type PerformanceVariantRegistry,
} from './variants.ts';

export interface ContentApprovalDigests {
  site: string;
  rootSet: string;
  performances: Readonly<Record<PerformanceId, string>>;
}

export interface ApprovedContentDigests {
  site?: string;
  rootSets: Readonly<Partial<Record<ContentRootSetId, string>>>;
  performances: Readonly<Partial<Record<PerformanceId, string>>>;
}

export interface ApprovalDigestSources {
  performanceVariants: PerformanceVariantRegistry;
  productions: Readonly<Record<string, Production>>;
  locations: Readonly<Record<string, Location>>;
  localizations: Readonly<Record<string, PartialLocalizationPackage>>;
  artwork: ProductionArtworkRegistry;
  seatingPlans: Readonly<Record<SeatingPlanId, SeatingPlanDefinition>>;
  ticketingPlatforms: Readonly<Record<TicketingPlatformId, TicketingPlatformDefinition>>;
  archiveProjection: ArchiveProjectionIdentity;
}

const defaultSources: ApprovalDigestSources = {
  performanceVariants: performanceVariantRegistry,
  productions,
  locations,
  localizations: localizationPackages,
  artwork: productionArtworkRegistry,
  seatingPlans: ticketSeatingPlans,
  ticketingPlatforms,
  archiveProjection: archiveProjectionIdentity,
};

function createSiteApprovalDigest(
  editionIds: readonly EditionId[],
  sources: ApprovalDigestSources,
): string {
  return createContentFingerprint({
    editions: Object.fromEntries(
      editionIds.map((editionId) => {
        const package_ = sources.localizations[editionId];
        return [
          editionId,
          {
            site: package_?.site,
            messages: package_?.messages,
            archiveProjection: package_?.archiveProjection,
            ticketZones: package_?.programs?.ticketZones,
            ticketingPlatforms: package_?.platforms,
          },
        ];
      }),
    ),
    archiveProjection: {
      identity: sources.archiveProjection,
      production: sources.productions[sources.archiveProjection.productionId],
      localization: Object.fromEntries(
        editionIds.map((editionId) => [
          editionId,
          sources.localizations[editionId]?.programs?.productions?.[
            sources.archiveProjection.productionId
          ],
        ]),
      ),
      artwork: artworkApprovalValue(
        sources.artwork[sources.archiveProjection.productionId]?.archive,
      ),
    },
    ticketingPlatforms: sources.ticketingPlatforms,
  });
}

function createRootSetApprovalDigest(rootSet: ContentRootSet): string {
  return createContentFingerprint({
    rootSetId: rootSet.rootSetId,
    worlds: rootSet.worlds,
  });
}

function artworkApprovalValue(artwork: ProductionArtwork | undefined): unknown {
  if (!artwork) {
    return undefined;
  }
  return {
    sourceRevision: artwork.sourceRevision,
    rights: artwork.rights,
    focalPoint: artwork.focalPoint,
    safeCrop: artwork.safeCrop,
    memoryColor: artwork.memoryColor,
    titleTone: artwork.titleTone,
    altIntent: artwork.altIntent,
    pollution: artwork.pollution,
  };
}

function createPerformanceApprovalDigest(
  performanceId: PerformanceId,
  editionIds: readonly EditionId[],
  sources: ApprovalDigestSources,
): string {
  const variantUnit = getPerformanceVariantUnit(performanceId, sources.performanceVariants);
  if (!variantUnit) {
    throw new Error(`批准摘要无法解析缺少变体的场次：${performanceId}`);
  }
  const performance = selectCompleteVariant(variantUnit, assertPerformanceVariantComplete).value;
  const productionIds = [...performance.productionIds];
  const localization = Object.fromEntries(
    editionIds.map((editionId) => {
      const package_ = sources.localizations[editionId];
      return [
        editionId,
        {
          location: package_?.programs?.locations?.[performance.locationId],
          performance: package_?.programs?.performances?.[performanceId],
          productions: Object.fromEntries(
            productionIds.map((productionId) => [
              productionId,
              package_?.programs?.productions?.[productionId],
            ]),
          ),
        },
      ];
    }),
  );
  const artwork = Object.fromEntries(
    productionIds.map((productionId) => [
      productionId,
      artworkApprovalValue(sources.artwork[productionId]?.[performance.world]),
    ]),
  );
  const seatingPlan =
    performance.ticketAvailability.state === 'on-sale' &&
    performance.ticketAvailability.seatingPlanId
      ? sources.seatingPlans[performance.ticketAvailability.seatingPlanId]
      : undefined;
  const ticketArtifactLocalization =
    performance.world === 'front' && performance.ticketAvailability.state === 'on-sale'
      ? Object.fromEntries(
          getTicketArtifactEditionIds(
            editionIds,
            sources.locations[performance.locationId].countryEditionId,
          ).map((editionId) => {
            const package_ = sources.localizations[editionId];
            return [
              editionId,
              {
                location: package_?.programs?.locations?.[performance.locationId],
                performance: package_?.programs?.performances?.[performanceId],
                productions: Object.fromEntries(
                  productionIds.map((productionId) => [
                    productionId,
                    package_?.programs?.productions?.[productionId],
                  ]),
                ),
                ticketZones: package_?.programs?.ticketZones,
                artifact: package_?.messages?.ticketing?.artifact,
              },
            ];
          }),
        )
      : undefined;

  return createContentFingerprint({
    stableId: performanceId,
    performance,
    location: sources.locations[performance.locationId],
    productions: Object.fromEntries(
      productionIds.map((productionId) => [productionId, sources.productions[productionId]]),
    ),
    localization,
    artwork,
    seatingPlan,
    ticketArtifactLocalization,
  });
}

export function createContentApprovalDigests(
  editionIds: readonly EditionId[],
  rootSet: ContentRootSet,
  sources: ApprovalDigestSources = defaultSources,
): ContentApprovalDigests {
  return {
    site: createSiteApprovalDigest(editionIds, sources),
    rootSet: createRootSetApprovalDigest(rootSet),
    performances: Object.fromEntries(
      getRootPerformanceIds(rootSet).map((performanceId) => [
        performanceId,
        createPerformanceApprovalDigest(performanceId, editionIds, sources),
      ]),
    ) as Record<PerformanceId, string>,
  };
}

// 当前没有任何获人工批准的运行时内容；批准只写入仍匹配当前摘要的稳定单元。
export const approvedContentDigests: ApprovedContentDigests = Object.freeze({
  rootSets: Object.freeze({}),
  performances: Object.freeze({}),
});

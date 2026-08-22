import type { EditionId } from '../editions.ts';
import { locations, type Location } from '../locations.ts';
import { localizationPackages, type PartialLocalizationPackage } from '../localized/packages.ts';
import { performances, type Performance, type PerformanceId } from '../performances.ts';
import {
  productionArtworkManifest,
  type ProductionArtworkManifest,
} from '../production-artwork-manifest.ts';
import { productions, type Production } from '../productions/index.ts';
import { createContentFingerprint } from './fingerprint.ts';
import { getRootPerformanceIds, type ContentRootSet } from './root-sets.ts';

export type ApprovedContentDigests = Readonly<Partial<Record<PerformanceId, string>>>;

export interface ApprovalDigestSources {
  performances: Readonly<Record<string, Performance>>;
  productions: Readonly<Record<string, Production>>;
  locations: Readonly<Record<string, Location>>;
  localizations: Readonly<Record<string, PartialLocalizationPackage>>;
  artwork: ProductionArtworkManifest;
}

const defaultSources: ApprovalDigestSources = {
  performances,
  productions,
  locations,
  localizations: localizationPackages,
  artwork: productionArtworkManifest,
};

export function createPerformanceApprovalDigests(
  editionIds: readonly EditionId[],
  rootSet: ContentRootSet,
  sources: ApprovalDigestSources = defaultSources,
): Record<PerformanceId, string> {
  return Object.fromEntries(
    getRootPerformanceIds(rootSet).map((performanceId) => {
      const performance = sources.performances[performanceId];
      if (!performance) {
        throw new Error(`批准摘要无法解析未知场次：${performanceId}`);
      }
      const productionIds = [...performance.productionIds];
      const localization = Object.fromEntries(
        editionIds.map((editionId) => {
          const package_ = sources.localizations[editionId];
          return [
            editionId,
            {
              site: package_?.site,
              messages: package_?.messages,
              archiveProjection: package_?.archiveProjection,
              location: package_?.programs?.locations[performance.locationId],
              performance: package_?.programs?.performances[performanceId],
              productions: Object.fromEntries(
                productionIds.map((productionId) => [
                  productionId,
                  package_?.programs?.productions[productionId],
                ]),
              ),
              ticketZones: package_?.programs?.ticketZones,
            },
          ];
        }),
      );
      const artwork = Object.fromEntries(
        productionIds.map((productionId) => [
          productionId,
          sources.artwork[productionId]?.[performance.world],
        ]),
      );

      return [
        performanceId,
        createContentFingerprint({
          stableId: performanceId,
          rootSet,
          performance,
          location: sources.locations[performance.locationId],
          productions: Object.fromEntries(
            productionIds.map((productionId) => [productionId, sources.productions[productionId]]),
          ),
          localization,
          artwork,
        }),
      ];
    }),
  ) as Record<PerformanceId, string>;
}

// 当前没有任何获人工批准的运行时内容；批准只写入仍匹配当前摘要的稳定 ID。
export const approvedContentDigests: ApprovedContentDigests = Object.freeze({});

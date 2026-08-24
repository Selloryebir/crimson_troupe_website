import {
  buildSnapshot,
  getSnapshotTicketingPlatform,
  type ContentSnapshot,
} from './content/resolve.ts';
import {
  getLocalization,
  getLocalizedPerformance,
  getLocalizedPerformanceEntries,
  getLocalizedProduction,
  type ResolvedLocalization,
} from './localized/resolve.ts';
import type { TicketArtifactMessages } from './localized/schema.ts';
import { formatTicketTerraDateTime } from './localized/format.ts';
import { ticketArtifactLocalesShareLanguage } from './localized/ticket-artifact.ts';
import type { LocationId } from './locations.ts';
import type { PerformanceId, TicketOffer, TicketZone } from './performances.ts';
import type { ProductionId, ProductionVisual } from './productions/index.ts';
import type { SeatingPlanId } from './ticket-seating-plans.ts';
import type { TicketingPlatformDefinition, TicketingPlatformId } from './ticketing-platforms.ts';
import { editions, type BuildEditionId } from './editions.ts';

export interface TicketArtifactLocalizedLayer {
  editionId: BuildEditionId;
  locale: string;
  title: string;
  kind: string;
  dateTime: string;
  place: string;
  zoneLabels: Readonly<Partial<Record<TicketZone, string>>>;
  messages: TicketArtifactMessages;
}

export interface TicketArtifactProjection {
  primary: TicketArtifactLocalizedLayer;
  secondary?: TicketArtifactLocalizedLayer;
}

export interface LocalizedTicketOffer extends TicketOffer {
  label: string;
}

export interface TicketingPerformanceOption {
  performanceId: string;
  productionId: ProductionId;
  title: string;
  kind: string;
  dateTime: string;
  place: string;
  visual: ProductionVisual;
  seatingPlanId: SeatingPlanId;
  offers: readonly LocalizedTicketOffer[];
  artifact: TicketArtifactProjection;
}

function getArtifactLocalizedLayer(
  editionId: BuildEditionId,
  performanceId: PerformanceId,
  productionId: ProductionId,
  snapshot: ContentSnapshot,
): TicketArtifactLocalizedLayer {
  const edition = editions[editionId];
  const localization = getLocalization(edition, snapshot);
  const performance = getLocalizedPerformance(localization, performanceId, snapshot);
  const production = getLocalizedProduction(localization, productionId, snapshot);
  return Object.freeze({
    editionId,
    locale: edition.locale,
    title: production.title,
    kind: production.kind,
    dateTime: formatTicketTerraDateTime(performance.dateTime, edition.locale),
    place: performance.place,
    zoneLabels: Object.freeze({ ...localization.programs.ticketZones }),
    messages: Object.freeze({ ...localization.messages.ticketing.artifact }),
  });
}

function getTicketArtifactProjection(
  performanceId: PerformanceId,
  productionId: ProductionId,
  locationId: LocationId,
  websiteEditionId: BuildEditionId,
  snapshot: ContentSnapshot,
): TicketArtifactProjection {
  const countryEditionId = snapshot.locations[locationId]?.countryEditionId;
  if (!countryEditionId) {
    throw new Error(`票面投影无法解析场次 ${performanceId} 的举办地语言。`);
  }
  const primary = getArtifactLocalizedLayer(
    countryEditionId,
    performanceId,
    productionId,
    snapshot,
  );
  const websiteEdition = editions[websiteEditionId];
  const secondary = ticketArtifactLocalesShareLanguage(primary.locale, websiteEdition.locale)
    ? undefined
    : getArtifactLocalizedLayer(websiteEditionId, performanceId, productionId, snapshot);
  return Object.freeze({ primary, secondary });
}

export interface TicketingPlatformPresentation extends Pick<
  TicketingPlatformDefinition,
  'platformId' | 'role' | 'logo'
> {
  displayName: string;
  logoAlt: string;
}

export function getTicketingPlatformPresentation(
  localization: ResolvedLocalization,
  platformId: TicketingPlatformId,
  snapshot: ContentSnapshot = buildSnapshot,
): TicketingPlatformPresentation {
  const platform = getSnapshotTicketingPlatform(snapshot, platformId);
  const content = localization.platforms[platformId];
  if (!platform || !content) {
    throw new Error(`票务平台 ${platformId} 不属于当前内容快照或缺少严格本地化内容。`);
  }
  return Object.freeze({ ...platform, ...content });
}

export function getTicketingOptions(
  localization: ResolvedLocalization,
  snapshot: ContentSnapshot = buildSnapshot,
): readonly TicketingPerformanceOption[] {
  return getLocalizedPerformanceEntries(localization, snapshot).flatMap(
    ([performanceId, performance]) => {
      if (
        performance.world !== 'front' ||
        performance.collection !== 'current' ||
        performance.status !== 'scheduled' ||
        performance.ticketAvailability.state !== 'on-sale'
      ) {
        return [];
      }
      const leadProduction = getLocalizedProduction(
        localization,
        performance.productionIds[0],
        snapshot,
      );
      const { seatingPlanId } = performance.ticketAvailability;
      if (!seatingPlanId) {
        throw new Error(`表站可售场次 ${performance.performanceId} 缺少分区示意。`);
      }
      return [
        {
          performanceId: performance.performanceId,
          productionId: leadProduction.productionId,
          title: leadProduction.title,
          kind: leadProduction.kind,
          dateTime: performance.dateTime.display,
          place: performance.place,
          visual: leadProduction.visual,
          seatingPlanId,
          offers: performance.ticketAvailability.offers.map((offer) => ({
            ...offer,
            label: localization.programs.ticketZones[offer.zone],
          })),
          artifact: getTicketArtifactProjection(
            performanceId,
            leadProduction.productionId,
            performance.locationId,
            localization.edition.editionId,
            snapshot,
          ),
        },
      ];
    },
  );
}

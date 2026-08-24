import {
  buildSnapshot,
  getSnapshotTicketingPlatform,
  type ContentSnapshot,
} from './content/resolve.ts';
import {
  getLocalizedPerformanceEntries,
  getLocalizedProduction,
  type ResolvedLocalization,
} from './localized/resolve.ts';
import type { TicketOffer } from './performances.ts';
import type { ProductionId, ProductionVisual } from './productions/index.ts';
import type { SeatingPlanId } from './ticket-seating-plans.ts';
import type { TicketingPlatformDefinition, TicketingPlatformId } from './ticketing-platforms.ts';

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
  return getLocalizedPerformanceEntries(localization, snapshot).flatMap(([, performance]) => {
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
      },
    ];
  });
}

import {
  getLocalizedPerformanceEntries,
  getLocalizedProduction,
  type ResolvedLocalization,
} from './localized/resolve.ts';
import type { TicketOffer } from './performances.ts';
import type { ProductionId, ProductionVisual } from './productions/index.ts';

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
  offers: readonly LocalizedTicketOffer[];
}

export function getTicketingOptions(
  localization: ResolvedLocalization,
): readonly TicketingPerformanceOption[] {
  return getLocalizedPerformanceEntries(localization).flatMap(([, performance]) => {
    if (performance.world !== 'front' || performance.ticketAvailability.state !== 'on-sale') {
      return [];
    }
    const leadProduction = getLocalizedProduction(localization, performance.productionIds[0]);
    return [
      {
        performanceId: performance.performanceId,
        productionId: leadProduction.productionId,
        title: leadProduction.title,
        kind: leadProduction.kind,
        dateTime: performance.dateTime.display,
        place: performance.place,
        visual: leadProduction.visual,
        offers: performance.ticketAvailability.offers.map((offer) => ({
          ...offer,
          label: localization.programs.ticketZones[offer.zone],
        })),
      },
    ];
  });
}

import { buildSnapshot, type ContentSnapshot } from './content/resolve.ts';
import {
  getLocalizedPerformanceEntries,
  getLocalizedProduction,
  type ResolvedLocalization,
} from './localized/resolve.ts';
import type { LocalizedTicketOffer } from './ticketing.ts';

export interface ArchiveSeatRegisterEntry {
  performanceId: string;
  title: string;
  dateTime: string;
  place: string;
  offers: readonly LocalizedTicketOffer[];
}

export function getArchiveSeatRegisterEntries(
  localization: ResolvedLocalization,
  snapshot: ContentSnapshot = buildSnapshot,
): readonly ArchiveSeatRegisterEntry[] {
  return getLocalizedPerformanceEntries(localization, snapshot).flatMap(([, performance]) => {
    if (
      performance.world !== 'archive' ||
      performance.collection !== 'current' ||
      performance.status !== 'scheduled' ||
      performance.ticketAvailability.state !== 'on-sale'
    ) {
      return [];
    }
    const production = getLocalizedProduction(localization, performance.productionIds[0], snapshot);
    return [
      {
        performanceId: performance.performanceId,
        title: production.title,
        dateTime: performance.dateTime.display,
        place: performance.place,
        offers: performance.ticketAvailability.offers.map((offer) => ({
          ...offer,
          label: localization.programs.ticketZones[offer.zone],
        })),
      },
    ];
  });
}

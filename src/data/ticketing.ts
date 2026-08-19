import { performanceEntries, type TicketOffer } from './performances';
import { productions, type ProductionVisual } from './productions';

export interface TicketingPerformanceOption {
  performanceId: string;
  title: string;
  kind: string;
  dateTime: string;
  place: string;
  visual: ProductionVisual;
  offers: readonly TicketOffer[];
}

export function getTicketingOptions(): readonly TicketingPerformanceOption[] {
  return performanceEntries.flatMap(([, performance]) => {
    if (performance.world !== 'front' || performance.ticketAvailability.state !== 'on-sale') {
      return [];
    }
    const leadProduction = productions[performance.productionIds[0]];
    return [
      {
        performanceId: performance.performanceId,
        title: leadProduction.title,
        kind: leadProduction.kind,
        dateTime: performance.dateTime.display,
        place: performance.place,
        visual: leadProduction.visual,
        offers: performance.ticketAvailability.offers,
      },
    ];
  });
}

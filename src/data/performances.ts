import type { LocationId } from './locations';
import type { ProductionId } from './productions/index.ts';
import type { SiteWorld } from './site-routes';
import type { SeatingPlanId } from './ticket-seating-plans.ts';

export interface TerraDateTime {
  calendar: 'terra';
  year: number;
  month: number;
  day: number;
  time: string;
}

export type PerformanceCollection = 'current' | 'history';
export type PerformanceStatus = 'scheduled' | 'pending' | 'completed' | 'cancelled';
export type PerformanceNoticeReason =
  'catastrophe-route' | 'venue-condition' | 'schedule-adjustment' | 'administrative';
export type TicketZone = 'C' | 'B' | 'A' | 'S' | 'BOX';

export interface TicketOffer {
  zone: TicketZone;
  basePrice: number;
}

export type TicketAvailability =
  | { state: 'not-on-sale' }
  | { state: 'on-sale'; seatingPlanId?: SeatingPlanId; offers: readonly TicketOffer[] };

const trimountGrandTheaterOffers = [
  { zone: 'C', basePrice: 260 },
  { zone: 'B', basePrice: 420 },
  { zone: 'A', basePrice: 680 },
  { zone: 'S', basePrice: 980 },
  { zone: 'BOX', basePrice: 1680 },
] as const satisfies readonly TicketOffer[];

const wiesheimCourtTheaterOffers = [
  { zone: 'C', basePrice: 220 },
  { zone: 'B', basePrice: 360 },
  { zone: 'A', basePrice: 560 },
  { zone: 'S', basePrice: 840 },
  { zone: 'BOX', basePrice: 1480 },
] as const satisfies readonly TicketOffer[];

const norportTemporaryStageOffers = [
  { zone: 'C', basePrice: 90 },
  { zone: 'B', basePrice: 150 },
  { zone: 'A', basePrice: 240 },
] as const satisfies readonly TicketOffer[];

const archiveRegisterOffers = [
  { zone: 'C', basePrice: 120 },
  { zone: 'B', basePrice: 220 },
  { zone: 'A', basePrice: 360 },
  { zone: 'S', basePrice: 560 },
  { zone: 'BOX', basePrice: 980 },
] as const satisfies readonly TicketOffer[];

export interface Performance {
  performanceId: string;
  world: SiteWorld;
  status: PerformanceStatus;
  locationId: LocationId;
  effectiveDateTime: TerraDateTime;
  previousDateTime?: TerraDateTime;
  notice?: {
    reason: PerformanceNoticeReason;
    sourceRevision: string;
  };
  productionIds: readonly [ProductionId, ...ProductionId[]];
  ticketAvailability: TicketAvailability;
}

export const performances = {
  'uncrowned-trimount-1098': {
    performanceId: 'uncrowned-trimount-1098',
    world: 'front',
    status: 'scheduled',
    locationId: 'trimount',
    effectiveDateTime: { calendar: 'terra', year: 1098, month: 9, day: 17, time: '19:30' },
    productionIds: ['uncrowned'],
    ticketAvailability: {
      state: 'on-sale',
      seatingPlanId: 'trimount-grand-fan',
      offers: trimountGrandTheaterOffers,
    },
  },
  'caged-fire-wiesheim-1098': {
    performanceId: 'caged-fire-wiesheim-1098',
    world: 'front',
    status: 'scheduled',
    locationId: 'wiesheim',
    effectiveDateTime: { calendar: 'terra', year: 1098, month: 10, day: 3, time: '20:00' },
    productionIds: ['caged-fire'],
    ticketAvailability: {
      state: 'on-sale',
      seatingPlanId: 'wiesheim-mirror-horseshoe',
      offers: wiesheimCourtTheaterOffers,
    },
  },
  'second-snow-norport-1098': {
    performanceId: 'second-snow-norport-1098',
    world: 'front',
    status: 'scheduled',
    locationId: 'norport',
    effectiveDateTime: { calendar: 'terra', year: 1098, month: 10, day: 29, time: '18:45' },
    productionIds: ['second-snow'],
    ticketAvailability: {
      state: 'on-sale',
      seatingPlanId: 'norport-temporary-stand',
      offers: norportTemporaryStageOffers,
    },
  },
  'der-ring-londinium-1091-0308': {
    performanceId: 'der-ring-londinium-1091-0308',
    world: 'archive',
    status: 'completed',
    locationId: 'londinium',
    effectiveDateTime: { calendar: 'terra', year: 1091, month: 3, day: 8, time: '19:00' },
    productionIds: ['der-ring'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'one-hundred-and-one-days-norport-1091-0419': {
    performanceId: 'one-hundred-and-one-days-norport-1091-0419',
    world: 'archive',
    status: 'completed',
    locationId: 'norport',
    effectiveDateTime: { calendar: 'terra', year: 1091, month: 4, day: 19, time: '18:30' },
    productionIds: ['one-hundred-and-one-days'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'the-carnival-wiesheim-1091-0511': {
    performanceId: 'the-carnival-wiesheim-1091-0511',
    world: 'archive',
    status: 'completed',
    locationId: 'wiesheim',
    effectiveDateTime: { calendar: 'terra', year: 1091, month: 5, day: 11, time: '20:00' },
    productionIds: ['the-carnival'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'ode-au-triomphe-nuova-volsinii-1091-0623': {
    performanceId: 'ode-au-triomphe-nuova-volsinii-1091-0623',
    world: 'archive',
    status: 'completed',
    locationId: 'nuova-volsinii',
    effectiveDateTime: { calendar: 'terra', year: 1091, month: 6, day: 23, time: '19:30' },
    productionIds: ['ode-au-triomphe'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'der-ring-zwillingsturme-1091-0817': {
    performanceId: 'der-ring-zwillingsturme-1091-0817',
    world: 'archive',
    status: 'scheduled',
    locationId: 'zwillingsturme',
    effectiveDateTime: { calendar: 'terra', year: 1091, month: 8, day: 17, time: '20:00' },
    productionIds: ['der-ring'],
    ticketAvailability: { state: 'on-sale', offers: archiveRegisterOffers },
  },
  'one-hundred-and-one-days-londinium-1091-0903': {
    performanceId: 'one-hundred-and-one-days-londinium-1091-0903',
    world: 'archive',
    status: 'scheduled',
    locationId: 'londinium',
    effectiveDateTime: { calendar: 'terra', year: 1091, month: 9, day: 3, time: '19:30' },
    productionIds: ['one-hundred-and-one-days'],
    ticketAvailability: { state: 'on-sale', offers: archiveRegisterOffers },
  },
  'the-carnival-montelupe-1091-0921': {
    performanceId: 'the-carnival-montelupe-1091-0921',
    world: 'archive',
    status: 'scheduled',
    locationId: 'montelupe',
    effectiveDateTime: { calendar: 'terra', year: 1091, month: 9, day: 21, time: '20:00' },
    productionIds: ['the-carnival'],
    ticketAvailability: { state: 'on-sale', offers: archiveRegisterOffers },
  },
  'the-carnival-londinium-1091-1009': {
    performanceId: 'the-carnival-londinium-1091-1009',
    world: 'archive',
    status: 'scheduled',
    locationId: 'londinium',
    effectiveDateTime: { calendar: 'terra', year: 1091, month: 10, day: 9, time: '19:00' },
    productionIds: ['the-carnival'],
    ticketAvailability: { state: 'on-sale', offers: archiveRegisterOffers },
  },
  'ode-au-triomphe-zwillingsturme-1091-1028': {
    performanceId: 'ode-au-triomphe-zwillingsturme-1091-1028',
    world: 'archive',
    status: 'scheduled',
    locationId: 'zwillingsturme',
    effectiveDateTime: { calendar: 'terra', year: 1091, month: 10, day: 28, time: '18:45' },
    productionIds: ['ode-au-triomphe'],
    ticketAvailability: { state: 'on-sale', offers: archiveRegisterOffers },
  },
} as const satisfies Record<string, Performance>;

export type PerformanceId = keyof typeof performances;
export const performanceEntries = Object.entries(performances) as Array<
  [PerformanceId, Performance]
>;

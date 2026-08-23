import type { LocationId } from './locations';
import { getArchivePerformanceOffers } from './performance-offers.ts';
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
  'caged-fire-jiangdu-1101-0521': {
    performanceId: 'caged-fire-jiangdu-1101-0521',
    world: 'front',
    status: 'completed',
    locationId: 'jiangdu',
    effectiveDateTime: { calendar: 'terra', year: 1101, month: 5, day: 21, time: '19:30' },
    productionIds: ['caged-fire'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'second-snow-zwillingsturme-1101-0808': {
    performanceId: 'second-snow-zwillingsturme-1101-0808',
    world: 'front',
    status: 'completed',
    locationId: 'zwillingsturme',
    effectiveDateTime: { calendar: 'terra', year: 1101, month: 8, day: 8, time: '20:00' },
    productionIds: ['second-snow'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'red-banquet-nuova-volsinii-1101-1119': {
    performanceId: 'red-banquet-nuova-volsinii-1101-1119',
    world: 'front',
    status: 'completed',
    locationId: 'nuova-volsinii',
    effectiveDateTime: { calendar: 'terra', year: 1101, month: 11, day: 19, time: '19:00' },
    productionIds: ['red-banquet'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'seventh-lantern-norport-1102-0202': {
    performanceId: 'seventh-lantern-norport-1102-0202',
    world: 'front',
    status: 'completed',
    locationId: 'norport',
    effectiveDateTime: { calendar: 'terra', year: 1102, month: 2, day: 2, time: '18:45' },
    productionIds: ['seventh-lantern'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'red-banquet-montelupe-1102-0606': {
    performanceId: 'red-banquet-montelupe-1102-0606',
    world: 'front',
    status: 'scheduled',
    locationId: 'montelupe',
    effectiveDateTime: { calendar: 'terra', year: 1102, month: 6, day: 6, time: '20:00' },
    productionIds: ['red-banquet'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'uncrowned-trimount-1102': {
    performanceId: 'uncrowned-trimount-1102',
    world: 'front',
    status: 'scheduled',
    locationId: 'trimount',
    effectiveDateTime: { calendar: 'terra', year: 1102, month: 9, day: 17, time: '19:30' },
    productionIds: ['uncrowned'],
    ticketAvailability: {
      state: 'on-sale',
      seatingPlanId: 'trimount-grand-fan',
      offers: trimountGrandTheaterOffers,
    },
  },
  'caged-fire-wiesheim-1102': {
    performanceId: 'caged-fire-wiesheim-1102',
    world: 'front',
    status: 'scheduled',
    locationId: 'wiesheim',
    effectiveDateTime: { calendar: 'terra', year: 1102, month: 10, day: 3, time: '20:00' },
    productionIds: ['caged-fire'],
    ticketAvailability: {
      state: 'on-sale',
      seatingPlanId: 'wiesheim-mirror-horseshoe',
      offers: wiesheimCourtTheaterOffers,
    },
  },
  'second-snow-norport-1102': {
    performanceId: 'second-snow-norport-1102',
    world: 'front',
    status: 'scheduled',
    locationId: 'norport',
    effectiveDateTime: { calendar: 'terra', year: 1102, month: 10, day: 29, time: '18:45' },
    productionIds: ['second-snow'],
    ticketAvailability: {
      state: 'on-sale',
      seatingPlanId: 'norport-temporary-stand',
      offers: norportTemporaryStageOffers,
    },
  },
  'seventh-lantern-linqu-1102-1212': {
    performanceId: 'seventh-lantern-linqu-1102-1212',
    world: 'front',
    status: 'scheduled',
    locationId: 'linqu',
    effectiveDateTime: { calendar: 'terra', year: 1102, month: 12, day: 12, time: '19:30' },
    productionIds: ['seventh-lantern'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'procession-of-masks-londinium-1103-0214': {
    performanceId: 'procession-of-masks-londinium-1103-0214',
    world: 'front',
    status: 'scheduled',
    locationId: 'londinium',
    effectiveDateTime: { calendar: 'terra', year: 1103, month: 2, day: 14, time: '20:00' },
    productionIds: ['procession-of-masks'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'uncrowned-qingsui-1103-0404': {
    performanceId: 'uncrowned-qingsui-1103-0404',
    world: 'front',
    status: 'scheduled',
    locationId: 'qingsui',
    effectiveDateTime: { calendar: 'terra', year: 1103, month: 4, day: 4, time: '19:00' },
    productionIds: ['uncrowned'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'lone-wander-wiesheim-1083-0814': {
    performanceId: 'lone-wander-wiesheim-1083-0814',
    world: 'archive',
    status: 'completed',
    locationId: 'wiesheim',
    effectiveDateTime: { calendar: 'terra', year: 1083, month: 8, day: 14, time: '19:30' },
    productionIds: ['lone-wander'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'wonderland-in-dream-londinium-1083-1109': {
    performanceId: 'wonderland-in-dream-londinium-1083-1109',
    world: 'archive',
    status: 'completed',
    locationId: 'londinium',
    effectiveDateTime: { calendar: 'terra', year: 1083, month: 11, day: 9, time: '20:00' },
    productionIds: ['wonderland-in-dream'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'frost-deer-and-snow-doe-nuova-volsinii-1084-0125': {
    performanceId: 'frost-deer-and-snow-doe-nuova-volsinii-1084-0125',
    world: 'archive',
    status: 'completed',
    locationId: 'nuova-volsinii',
    effectiveDateTime: { calendar: 'terra', year: 1084, month: 1, day: 25, time: '18:45' },
    productionIds: ['frost-deer-and-snow-doe'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'der-ring-londinium-1084-0308': {
    performanceId: 'der-ring-londinium-1084-0308',
    world: 'archive',
    status: 'completed',
    locationId: 'londinium',
    effectiveDateTime: { calendar: 'terra', year: 1084, month: 3, day: 8, time: '19:00' },
    productionIds: ['der-ring'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'one-hundred-and-one-days-norport-1084-0419': {
    performanceId: 'one-hundred-and-one-days-norport-1084-0419',
    world: 'archive',
    status: 'completed',
    locationId: 'norport',
    effectiveDateTime: { calendar: 'terra', year: 1084, month: 4, day: 19, time: '18:30' },
    productionIds: ['one-hundred-and-one-days'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'the-carnival-wiesheim-1084-0511': {
    performanceId: 'the-carnival-wiesheim-1084-0511',
    world: 'archive',
    status: 'completed',
    locationId: 'wiesheim',
    effectiveDateTime: { calendar: 'terra', year: 1084, month: 5, day: 11, time: '20:00' },
    productionIds: ['the-carnival'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'light-of-heria-zwillingsturme-1084-0608': {
    performanceId: 'light-of-heria-zwillingsturme-1084-0608',
    world: 'archive',
    status: 'completed',
    locationId: 'zwillingsturme',
    effectiveDateTime: { calendar: 'terra', year: 1084, month: 6, day: 8, time: '19:00' },
    productionIds: ['light-of-heria'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'ode-au-triomphe-nuova-volsinii-1084-0623': {
    performanceId: 'ode-au-triomphe-nuova-volsinii-1084-0623',
    world: 'archive',
    status: 'completed',
    locationId: 'nuova-volsinii',
    effectiveDateTime: { calendar: 'terra', year: 1084, month: 6, day: 23, time: '19:30' },
    productionIds: ['ode-au-triomphe'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'lone-wander-linqu-1084-0719': {
    performanceId: 'lone-wander-linqu-1084-0719',
    world: 'archive',
    status: 'scheduled',
    locationId: 'linqu',
    effectiveDateTime: { calendar: 'terra', year: 1084, month: 7, day: 19, time: '19:30' },
    productionIds: ['lone-wander'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'der-ring-zwillingsturme-1084-0817': {
    performanceId: 'der-ring-zwillingsturme-1084-0817',
    world: 'archive',
    status: 'scheduled',
    locationId: 'zwillingsturme',
    effectiveDateTime: { calendar: 'terra', year: 1084, month: 8, day: 17, time: '20:00' },
    productionIds: ['der-ring'],
    ticketAvailability: {
      state: 'on-sale',
      offers: getArchivePerformanceOffers('der-ring', 'zwillingsturme-mirror-lake-hall'),
    },
  },
  'one-hundred-and-one-days-londinium-1084-0903': {
    performanceId: 'one-hundred-and-one-days-londinium-1084-0903',
    world: 'archive',
    status: 'scheduled',
    locationId: 'londinium',
    effectiveDateTime: { calendar: 'terra', year: 1084, month: 9, day: 3, time: '19:30' },
    productionIds: ['one-hundred-and-one-days'],
    ticketAvailability: {
      state: 'on-sale',
      offers: getArchivePerformanceOffers('one-hundred-and-one-days', 'londinium-bell-hall'),
    },
  },
  'the-carnival-montelupe-1084-0921': {
    performanceId: 'the-carnival-montelupe-1084-0921',
    world: 'archive',
    status: 'scheduled',
    locationId: 'montelupe',
    effectiveDateTime: { calendar: 'terra', year: 1084, month: 9, day: 21, time: '20:00' },
    productionIds: ['the-carnival'],
    ticketAvailability: {
      state: 'on-sale',
      offers: getArchivePerformanceOffers('the-carnival', 'montelupe-banquet-hall'),
    },
  },
  'the-carnival-londinium-1084-1009': {
    performanceId: 'the-carnival-londinium-1084-1009',
    world: 'archive',
    status: 'scheduled',
    locationId: 'londinium',
    effectiveDateTime: { calendar: 'terra', year: 1084, month: 10, day: 9, time: '19:00' },
    productionIds: ['the-carnival'],
    ticketAvailability: {
      state: 'on-sale',
      offers: getArchivePerformanceOffers('the-carnival', 'londinium-main-stage'),
    },
  },
  'ode-au-triomphe-zwillingsturme-1084-1028': {
    performanceId: 'ode-au-triomphe-zwillingsturme-1084-1028',
    world: 'archive',
    status: 'scheduled',
    locationId: 'zwillingsturme',
    effectiveDateTime: { calendar: 'terra', year: 1084, month: 10, day: 28, time: '18:45' },
    productionIds: ['ode-au-triomphe'],
    ticketAvailability: {
      state: 'on-sale',
      offers: getArchivePerformanceOffers('ode-au-triomphe', 'zwillingsturme-golden-hall'),
    },
  },
  'wonderland-in-dream-qingsui-1084-1116': {
    performanceId: 'wonderland-in-dream-qingsui-1084-1116',
    world: 'archive',
    status: 'scheduled',
    locationId: 'qingsui',
    effectiveDateTime: { calendar: 'terra', year: 1084, month: 11, day: 16, time: '20:00' },
    productionIds: ['wonderland-in-dream'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'frost-deer-and-snow-doe-jiangdu-1085-0122': {
    performanceId: 'frost-deer-and-snow-doe-jiangdu-1085-0122',
    world: 'archive',
    status: 'scheduled',
    locationId: 'jiangdu',
    effectiveDateTime: { calendar: 'terra', year: 1085, month: 1, day: 22, time: '18:45' },
    productionIds: ['frost-deer-and-snow-doe'],
    ticketAvailability: { state: 'not-on-sale' },
  },
  'light-of-heria-trimount-1085-0530': {
    performanceId: 'light-of-heria-trimount-1085-0530',
    world: 'archive',
    status: 'scheduled',
    locationId: 'trimount',
    effectiveDateTime: { calendar: 'terra', year: 1085, month: 5, day: 30, time: '19:00' },
    productionIds: ['light-of-heria'],
    ticketAvailability: { state: 'not-on-sale' },
  },
} as const satisfies Record<string, Performance>;

export type PerformanceId = keyof typeof performances;
export const performanceEntries = Object.entries(performances) as Array<
  [PerformanceId, Performance]
>;

import type { LocationId } from './locations';
import type { ProductionId } from './productions/index.ts';
import type { SiteWorld } from './site-routes';

export interface TerraDateTime {
  calendar: 'terra';
  year: number;
  month: number;
  day: number;
  time: string;
}

export type PerformanceCollection = 'current' | 'history';
export type PerformanceStatus = 'scheduled' | 'completed';
export type TicketZone = 'C' | 'B' | 'A' | 'S' | 'BOX';

export interface TicketOffer {
  zone: TicketZone;
  basePrice: number;
}

export type TicketAvailability =
  | { state: 'not-on-sale' }
  | { state: 'on-sale'; offers: readonly TicketOffer[] }
  | { state: 'unavailable'; reason: 'historic-snapshot' };

const createFrontTicketOffers = (): readonly TicketOffer[] => [
  { zone: 'C', basePrice: 180 },
  { zone: 'B', basePrice: 280 },
  { zone: 'A', basePrice: 420 },
  { zone: 'S', basePrice: 680 },
  { zone: 'BOX', basePrice: 1280 },
];

export interface Performance {
  performanceId: string;
  world: SiteWorld;
  collection: PerformanceCollection;
  status: PerformanceStatus;
  locationId: LocationId;
  dateTime: TerraDateTime;
  productionIds: readonly [ProductionId, ...ProductionId[]];
  ticketAvailability: TicketAvailability;
}

export const performances = {
  'uncrowned-trimount-1098': {
    performanceId: 'uncrowned-trimount-1098',
    world: 'front',
    collection: 'current',
    status: 'scheduled',
    locationId: 'trimount',
    dateTime: { calendar: 'terra', year: 1098, month: 9, day: 17, time: '19:30' },
    productionIds: ['uncrowned'],
    ticketAvailability: { state: 'on-sale', offers: createFrontTicketOffers() },
  },
  'caged-fire-wiesheim-1098': {
    performanceId: 'caged-fire-wiesheim-1098',
    world: 'front',
    collection: 'current',
    status: 'scheduled',
    locationId: 'wiesheim',
    dateTime: { calendar: 'terra', year: 1098, month: 10, day: 3, time: '20:00' },
    productionIds: ['caged-fire'],
    ticketAvailability: { state: 'on-sale', offers: createFrontTicketOffers() },
  },
  'second-snow-norport-1098': {
    performanceId: 'second-snow-norport-1098',
    world: 'front',
    collection: 'current',
    status: 'scheduled',
    locationId: 'norport',
    dateTime: { calendar: 'terra', year: 1098, month: 10, day: 29, time: '18:45' },
    productionIds: ['second-snow'],
    ticketAvailability: { state: 'on-sale', offers: createFrontTicketOffers() },
  },
  'der-ring-calais-blason-1091-0308': {
    performanceId: 'der-ring-calais-blason-1091-0308',
    world: 'archive',
    collection: 'history',
    status: 'completed',
    locationId: 'calais-blason',
    dateTime: { calendar: 'terra', year: 1091, month: 3, day: 8, time: '19:00' },
    productionIds: ['der-ring'],
    ticketAvailability: { state: 'unavailable', reason: 'historic-snapshot' },
  },
  'one-hundred-and-one-days-calais-blason-1091-0419': {
    performanceId: 'one-hundred-and-one-days-calais-blason-1091-0419',
    world: 'archive',
    collection: 'history',
    status: 'completed',
    locationId: 'calais-blason',
    dateTime: { calendar: 'terra', year: 1091, month: 4, day: 19, time: '18:30' },
    productionIds: ['one-hundred-and-one-days'],
    ticketAvailability: { state: 'unavailable', reason: 'historic-snapshot' },
  },
  'the-carnival-wiesheim-1091-0511': {
    performanceId: 'the-carnival-wiesheim-1091-0511',
    world: 'archive',
    collection: 'history',
    status: 'completed',
    locationId: 'wiesheim',
    dateTime: { calendar: 'terra', year: 1091, month: 5, day: 11, time: '20:00' },
    productionIds: ['the-carnival'],
    ticketAvailability: { state: 'unavailable', reason: 'historic-snapshot' },
  },
  'ode-au-triomphe-nuova-volsinii-1091-0623': {
    performanceId: 'ode-au-triomphe-nuova-volsinii-1091-0623',
    world: 'archive',
    collection: 'history',
    status: 'completed',
    locationId: 'nuova-volsinii',
    dateTime: { calendar: 'terra', year: 1091, month: 6, day: 23, time: '19:30' },
    productionIds: ['ode-au-triomphe'],
    ticketAvailability: { state: 'unavailable', reason: 'historic-snapshot' },
  },
  'der-ring-zwillingsturme-1091-0817': {
    performanceId: 'der-ring-zwillingsturme-1091-0817',
    world: 'archive',
    collection: 'current',
    status: 'scheduled',
    locationId: 'zwillingsturme',
    dateTime: { calendar: 'terra', year: 1091, month: 8, day: 17, time: '20:00' },
    productionIds: ['der-ring'],
    ticketAvailability: { state: 'unavailable', reason: 'historic-snapshot' },
  },
  'one-hundred-and-one-days-londinium-1091-0903': {
    performanceId: 'one-hundred-and-one-days-londinium-1091-0903',
    world: 'archive',
    collection: 'current',
    status: 'scheduled',
    locationId: 'londinium',
    dateTime: { calendar: 'terra', year: 1091, month: 9, day: 3, time: '19:30' },
    productionIds: ['one-hundred-and-one-days'],
    ticketAvailability: { state: 'unavailable', reason: 'historic-snapshot' },
  },
  'the-carnival-montelupe-1091-0921': {
    performanceId: 'the-carnival-montelupe-1091-0921',
    world: 'archive',
    collection: 'current',
    status: 'scheduled',
    locationId: 'montelupe',
    dateTime: { calendar: 'terra', year: 1091, month: 9, day: 21, time: '20:00' },
    productionIds: ['the-carnival'],
    ticketAvailability: { state: 'unavailable', reason: 'historic-snapshot' },
  },
  'the-carnival-londinium-1091-1009': {
    performanceId: 'the-carnival-londinium-1091-1009',
    world: 'archive',
    collection: 'current',
    status: 'scheduled',
    locationId: 'londinium',
    dateTime: { calendar: 'terra', year: 1091, month: 10, day: 9, time: '19:00' },
    productionIds: ['the-carnival'],
    ticketAvailability: { state: 'unavailable', reason: 'historic-snapshot' },
  },
  'ode-au-triomphe-zwillingsturme-1091-1028': {
    performanceId: 'ode-au-triomphe-zwillingsturme-1091-1028',
    world: 'archive',
    collection: 'current',
    status: 'scheduled',
    locationId: 'zwillingsturme',
    dateTime: { calendar: 'terra', year: 1091, month: 10, day: 28, time: '18:45' },
    productionIds: ['ode-au-triomphe'],
    ticketAvailability: { state: 'unavailable', reason: 'historic-snapshot' },
  },
} as const satisfies Record<string, Performance>;

export type PerformanceId = keyof typeof performances;
export const performanceEntries = Object.entries(performances) as Array<
  [PerformanceId, Performance]
>;

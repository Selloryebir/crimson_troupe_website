import type { LocationId } from './locations';
import type { ProductionId } from './productions';
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
  'red-banquet-linqu-1091': {
    performanceId: 'red-banquet-linqu-1091',
    world: 'archive',
    collection: 'current',
    status: 'scheduled',
    locationId: 'linqu',
    dateTime: { calendar: 'terra', year: 1091, month: 8, day: 24, time: '19:00' },
    productionIds: ['red-banquet', 'procession-of-masks'],
    ticketAvailability: { state: 'unavailable', reason: 'historic-snapshot' },
  },
  'seventh-lantern-qingsui-1091': {
    performanceId: 'seventh-lantern-qingsui-1091',
    world: 'archive',
    collection: 'current',
    status: 'scheduled',
    locationId: 'qingsui',
    dateTime: { calendar: 'terra', year: 1091, month: 9, day: 11, time: '18:30' },
    productionIds: ['seventh-lantern'],
    ticketAvailability: { state: 'unavailable', reason: 'historic-snapshot' },
  },
  'mask-procession-jiangdu-1091': {
    performanceId: 'mask-procession-jiangdu-1091',
    world: 'archive',
    collection: 'history',
    status: 'completed',
    locationId: 'jiangdu',
    dateTime: { calendar: 'terra', year: 1091, month: 4, day: 6, time: '20:00' },
    productionIds: ['procession-of-masks'],
    ticketAvailability: { state: 'unavailable', reason: 'historic-snapshot' },
  },
  'red-banquet-qingsui-1091': {
    performanceId: 'red-banquet-qingsui-1091',
    world: 'archive',
    collection: 'history',
    status: 'completed',
    locationId: 'qingsui',
    dateTime: { calendar: 'terra', year: 1091, month: 5, day: 19, time: '19:00' },
    productionIds: ['red-banquet'],
    ticketAvailability: { state: 'unavailable', reason: 'historic-snapshot' },
  },
} as const satisfies Record<string, Performance>;

export type PerformanceId = keyof typeof performances;
export const performanceEntries = Object.entries(performances) as Array<
  [PerformanceId, Performance]
>;

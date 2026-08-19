import type { ProductionId } from './productions';
import type { SiteWorld } from './site-routes';

export interface TerraDateTime {
  calendar: 'terra';
  year: number;
  month: number;
  day: number;
  time: string;
  display: string;
}

export type PerformanceCollection = 'current' | 'history';
export type PerformanceStatus = 'scheduled' | 'completed';

export type TicketAvailability =
  { state: 'not-on-sale' } | { state: 'unavailable'; reason: 'historic-snapshot' };

export interface Performance {
  performanceId: string;
  world: SiteWorld;
  collection: PerformanceCollection;
  status: PerformanceStatus;
  index: string;
  cityId: 'trimount' | 'wiesheim' | 'norport';
  cityLabel: string;
  dateTime: TerraDateTime;
  place: string;
  productionIds: readonly [ProductionId, ...ProductionId[]];
  ticketAvailability: TicketAvailability;
  searchDetail: string;
  searchKeywords: string;
}

export const performances = {
  'uncrowned-trimount-1098': {
    performanceId: 'uncrowned-trimount-1098',
    world: 'front',
    collection: 'current',
    status: 'scheduled',
    index: '01',
    cityId: 'trimount',
    cityLabel: '特里蒙',
    dateTime: {
      calendar: 'terra',
      year: 1098,
      month: 9,
      day: 17,
      time: '19:30',
      display: '1098.09.17 / 19:30',
    },
    place: '特里蒙大剧院 · 主舞台',
    productionIds: ['uncrowned'],
    ticketAvailability: { state: 'not-on-sale' },
    searchDetail: '9月17日 · 特里蒙 · 现代悲剧',
    searchKeywords: '九月 9月 特里蒙 悲剧 王冠',
  },
  'caged-fire-wiesheim-1098': {
    performanceId: 'caged-fire-wiesheim-1098',
    world: 'front',
    collection: 'current',
    status: 'scheduled',
    index: '02',
    cityId: 'wiesheim',
    cityLabel: '维谢海姆',
    dateTime: {
      calendar: 'terra',
      year: 1098,
      month: 10,
      day: 3,
      time: '20:00',
      display: '1098.10.03 / 20:00',
    },
    place: '维谢海姆宫廷剧院 · 镜厅',
    productionIds: ['caged-fire'],
    ticketAvailability: { state: 'not-on-sale' },
    searchDetail: '10月3日 · 维谢海姆 · 室内歌剧',
    searchKeywords: '十月 10月 维谢海姆 歌剧 火',
  },
  'second-snow-norport-1098': {
    performanceId: 'second-snow-norport-1098',
    world: 'front',
    collection: 'current',
    status: 'scheduled',
    index: '03',
    cityId: 'norport',
    cityLabel: '诺伯特郡',
    dateTime: {
      calendar: 'terra',
      year: 1098,
      month: 10,
      day: 29,
      time: '18:45',
      display: '1098.10.29 / 18:45',
    },
    place: '诺伯特郡旧车站 · 临时舞台',
    productionIds: ['second-snow'],
    ticketAvailability: { state: 'not-on-sale' },
    searchDetail: '10月29日 · 诺伯特郡 · 实验舞剧',
    searchKeywords: '十月 10月 诺伯特 舞剧 雪',
  },
} as const satisfies Record<string, Performance>;

export type PerformanceId = keyof typeof performances;
export const performanceEntries = Object.entries(performances) as Array<
  [PerformanceId, Performance]
>;

export function getPerformances(
  world: SiteWorld,
  collection: PerformanceCollection,
): Performance[] {
  return performanceEntries
    .map(([, performance]) => performance)
    .filter((performance) => performance.world === world && performance.collection === collection);
}

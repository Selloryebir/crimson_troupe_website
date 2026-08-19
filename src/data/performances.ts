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
  cityId: 'trimount' | 'wiesheim' | 'norport' | 'linqu' | 'qingsui' | 'jiangdu';
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
  'red-banquet-linqu-1091': {
    performanceId: 'red-banquet-linqu-1091',
    world: 'archive',
    collection: 'current',
    status: 'scheduled',
    index: '壹',
    cityId: 'linqu',
    cityLabel: '临渠',
    dateTime: {
      calendar: 'terra',
      year: 1091,
      month: 8,
      day: 24,
      time: '19:00',
      display: '泰拉历 1091 年八月廿四 · 入夜七时',
    },
    place: '临渠旧宫剧场 · 宴会厅',
    productionIds: ['red-banquet', 'procession-of-masks'],
    ticketAvailability: { state: 'unavailable', reason: 'historic-snapshot' },
    searchDetail: '八月廿四 · 临渠 · 典礼剧与假面默剧',
    searchKeywords: '临渠 宴会 猩红宴 无声巡游 八月',
  },
  'seventh-lantern-qingsui-1091': {
    performanceId: 'seventh-lantern-qingsui-1091',
    world: 'archive',
    collection: 'current',
    status: 'scheduled',
    index: '贰',
    cityId: 'qingsui',
    cityLabel: '青隧',
    dateTime: {
      calendar: 'terra',
      year: 1091,
      month: 9,
      day: 11,
      time: '18:30',
      display: '泰拉历 1091 年九月十一 · 日落后',
    },
    place: '青隧驿馆 · 内庭',
    productionIds: ['seventh-lantern'],
    ticketAvailability: { state: 'unavailable', reason: 'historic-snapshot' },
    searchDetail: '九月十一 · 青隧 · 灯影剧',
    searchKeywords: '青隧 灯影 第七盏灯 九月 驿馆',
  },
  'mask-procession-jiangdu-1091': {
    performanceId: 'mask-procession-jiangdu-1091',
    world: 'archive',
    collection: 'history',
    status: 'completed',
    index: '拾柒',
    cityId: 'jiangdu',
    cityLabel: '江渡',
    dateTime: {
      calendar: 'terra',
      year: 1091,
      month: 4,
      day: 6,
      time: '20:00',
      display: '泰拉历 1091 年四月初六 · 晚钟后',
    },
    place: '江渡公会礼堂 · 西厅',
    productionIds: ['procession-of-masks'],
    ticketAvailability: { state: 'unavailable', reason: 'historic-snapshot' },
    searchDetail: '四月初六 · 江渡 · 假面默剧',
    searchKeywords: '江渡 无声巡游 假面 四月 礼堂',
  },
  'red-banquet-qingsui-1091': {
    performanceId: 'red-banquet-qingsui-1091',
    world: 'archive',
    collection: 'history',
    status: 'completed',
    index: '拾捌',
    cityId: 'qingsui',
    cityLabel: '青隧',
    dateTime: {
      calendar: 'terra',
      year: 1091,
      month: 5,
      day: 19,
      time: '19:00',
      display: '泰拉历 1091 年五月十九 · 入夜七时',
    },
    place: '青隧驿馆 · 大礼厅',
    productionIds: ['red-banquet'],
    ticketAvailability: { state: 'unavailable', reason: 'historic-snapshot' },
    searchDetail: '五月十九 · 青隧 · 典礼剧',
    searchKeywords: '青隧 猩红宴 五月 宴席 驿馆',
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

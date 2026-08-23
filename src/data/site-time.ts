import { currentArchiveSnapshot } from './archive-snapshots.ts';
import type { BuildContext, SiteClockStrategy } from './content/build-context.ts';
import type { PerformanceCollection, TerraDateTime } from './performances.ts';
import type { SiteWorld } from './site-routes.ts';

const fixedSiteTimes = Object.freeze({
  front: Object.freeze({
    calendar: 'terra',
    year: 1102,
    month: 4,
    day: 15,
    time: '00:00',
  }),
} as const satisfies Record<'front', TerraDateTime>);

function resolveFixedSiteTime(world: SiteWorld): TerraDateTime {
  const source = world === 'archive' ? currentArchiveSnapshot.capturedAt : fixedSiteTimes.front;
  const value = Object.freeze({ ...source });
  assertTerraDateTime(value, `${world} fixed site time`);
  return value;
}

export function assertTerraDateTime(value: TerraDateTime, label = 'TerraDateTime'): void {
  const validTime = /^(?:[01]\d|2[0-3]):[0-5]\d$/u.test(value.time);
  if (
    value.calendar !== 'terra' ||
    !Number.isInteger(value.year) ||
    !Number.isInteger(value.month) ||
    value.month < 1 ||
    value.month > 12 ||
    !Number.isInteger(value.day) ||
    value.day < 1 ||
    value.day > 31 ||
    !validTime
  ) {
    throw new Error(`${label} 不是有效的泰拉时间结构。`);
  }
}

function assertSupportedStrategy(world: SiteWorld, strategy: SiteClockStrategy): void {
  if (world === 'archive' && strategy !== 'fixed') {
    throw new Error('里站历史快照只允许 fixed 网站时钟。');
  }
  if (strategy !== 'fixed') {
    throw new Error(`网站时钟策略 ${strategy} 尚未配置。`);
  }
}

export function getSiteTerraNow(
  world: SiteWorld,
  context: BuildContext,
  realTimeInput?: Date,
): TerraDateTime {
  void realTimeInput;
  const strategy = context.siteClockStrategies[world];
  assertSupportedStrategy(world, strategy);
  return resolveFixedSiteTime(world);
}

function terraDateTimeKey(value: TerraDateTime): string {
  return [
    String(value.year).padStart(6, '0'),
    String(value.month).padStart(2, '0'),
    String(value.day).padStart(2, '0'),
    value.time,
  ].join('-');
}

export function compareTerraDateTime(left: TerraDateTime, right: TerraDateTime): number {
  assertTerraDateTime(left, 'left TerraDateTime');
  assertTerraDateTime(right, 'right TerraDateTime');
  return terraDateTimeKey(left).localeCompare(terraDateTimeKey(right), 'en');
}

export function derivePerformanceCollection(
  effectiveDateTime: TerraDateTime,
  siteTerraNow: TerraDateTime,
): PerformanceCollection {
  return compareTerraDateTime(effectiveDateTime, siteTerraNow) >= 0 ? 'current' : 'history';
}

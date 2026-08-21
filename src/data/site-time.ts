import type { BuildContext, SiteClockStrategy } from './content/build-context.ts';
import type { TerraDateTime } from './performances.ts';
import type { SiteWorld } from './site-routes.ts';

const fixedSiteTimes = Object.freeze({
  front: Object.freeze({
    calendar: 'terra',
    year: 1098,
    month: 9,
    day: 1,
    time: '00:00',
  }),
  archive: Object.freeze({
    calendar: 'terra',
    year: 1091,
    month: 7,
    day: 1,
    time: '00:00',
  }),
} as const satisfies Record<SiteWorld, TerraDateTime>);

function resolveFixedSiteTime(world: SiteWorld): TerraDateTime {
  return Object.freeze({ ...fixedSiteTimes[world] });
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

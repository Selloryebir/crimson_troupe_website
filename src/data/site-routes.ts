import type { Edition } from './editions';

export const ARCHIVE_YEAR = '1091' as const;
export type SiteWorld = 'front' | 'archive';

const withTrailingSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`);

export function siteRoot(edition: Edition, world: SiteWorld): string {
  const editionRoot = `/${edition.routePrefix}/`;
  return world === 'front' ? editionRoot : `${editionRoot}archive/site/${ARCHIVE_YEAR}/`;
}

export function sitePath(edition: Edition, world: SiteWorld, segment = ''): string {
  return withTrailingSlash(`${siteRoot(edition, world)}${segment.replace(/^\/+/, '')}`);
}

export function performancePath(edition: Edition, world: SiteWorld, performanceId: string): string {
  return sitePath(edition, world, `performances/${performanceId}`);
}

export function productionPath(edition: Edition, world: SiteWorld, productionId: string): string {
  return sitePath(edition, world, `productions/${productionId}`);
}

import type { ArchiveFolioCrimsonId } from './production-artwork-manifest.ts';

export type ArchivePageType =
  | 'home'
  | 'performance-list'
  | 'performance-history'
  | 'performance-detail'
  | 'production-detail'
  | 'troupe'
  | 'search'
  | 'tickets';

export type ArchivePollutionProfile =
  | 'invitation'
  | 'register'
  | 'performance-record'
  | 'production-record'
  | 'company'
  | 'inquiry'
  | 'office';

const archivePollutionProfiles = {
  home: 'invitation',
  'performance-list': 'register',
  'performance-history': 'register',
  'performance-detail': 'performance-record',
  'production-detail': 'production-record',
  troupe: 'company',
  search: 'inquiry',
  tickets: 'office',
} as const satisfies Record<ArchivePageType, ArchivePollutionProfile>;

export interface ArchiveProjectionIdentity {
  sourceId: ArchiveFolioCrimsonId;
}

// 等级 3 只借用活页来源身份；它不成为正常剧目、场次或路由。
export const archiveProjectionIdentity: ArchiveProjectionIdentity = Object.freeze({
  sourceId: 'the-lullaby',
});

export function getArchivePollutionProfile(pageType: ArchivePageType): ArchivePollutionProfile {
  return archivePollutionProfiles[pageType];
}

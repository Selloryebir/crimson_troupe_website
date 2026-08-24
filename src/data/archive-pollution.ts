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
  productionId: ProductionId;
}

// 等级 3 的统一剧目身份属于构建闭包，不由页面或本地化文案各自猜测。
export const archiveProjectionIdentity: ArchiveProjectionIdentity = Object.freeze({
  productionId: 'the-carnival',
});

export function getArchivePollutionProfile(pageType: ArchivePageType): ArchivePollutionProfile {
  return archivePollutionProfiles[pageType];
}
import type { ProductionId } from './productions/index.ts';

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

export function getArchivePollutionProfile(pageType: ArchivePageType): ArchivePollutionProfile {
  return archivePollutionProfiles[pageType];
}

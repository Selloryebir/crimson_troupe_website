import type { BuildEditionId } from '../editions.ts';
import type { PartialLocalizationPackage } from '../localized/packages.ts';
import type { ContentSnapshot } from './resolve.ts';
import { createContentFingerprint } from './fingerprint.ts';

export type LocalizationSourceRevision = Readonly<Record<string, string>>;
export type LocalizationSourceRevisionRegistry = Readonly<
  Partial<Record<BuildEditionId, LocalizationSourceRevision>>
>;

function recordEntries(prefix: string, records: object | undefined): Array<[string, unknown]> {
  return Object.entries(records ?? {}).map(([recordId, value]) => [`${prefix}.${recordId}`, value]);
}

export function createLocalizationSourceRevision(
  source: PartialLocalizationPackage,
  snapshot?: Pick<ContentSnapshot, 'locationEntries' | 'performanceEntries' | 'productionEntries'>,
): LocalizationSourceRevision {
  const locationIds = snapshot?.locationEntries.map(([locationId]) => locationId);
  const performanceIds = snapshot?.performanceEntries.map(([performanceId]) => performanceId);
  const productionIds = snapshot?.productionEntries.map(([productionId]) => productionId);
  const scopedEntries = <T extends string>(
    prefix: string,
    records: Partial<Record<T, unknown>> | undefined,
    ids: readonly T[] | undefined,
  ): Array<[string, unknown]> =>
    ids
      ? ids.map((recordId) => [`${prefix}.${recordId}`, records?.[recordId]])
      : recordEntries(prefix, records);
  const entries: Array<[string, unknown]> = [
    ...recordEntries('site', source.site),
    ...recordEntries('messages', source.messages),
    ['archiveProjection', source.archiveProjection],
    ...scopedEntries('locations', source.programs?.locations, locationIds),
    ...scopedEntries('performances', source.programs?.performances, performanceIds),
    ...scopedEntries('productions', source.programs?.productions, productionIds),
    ['ticketZones', source.programs?.ticketZones],
  ];
  return Object.freeze(
    Object.fromEntries(entries.map(([path, value]) => [path, createContentFingerprint(value)])),
  );
}

// 目标语言记录所依据的炎语修订。新增或修改炎语记录时只更新已完成复核的对应路径。
const acceptedYanSourceRevision: LocalizationSourceRevision = Object.freeze({
  'site.brand': 'fnv1a64:03d196aa49398779',
  'site.shared': 'fnv1a64:271988094d028281',
  'site.front': 'fnv1a64:91964d4831c5ea03',
  'site.archive': 'fnv1a64:5c106a3c54a6ec9e',
  'messages.filters': 'fnv1a64:d98c683356dc4246',
  'messages.search': 'fnv1a64:8db8feaa1a5ea44c',
  'messages.ticketing': 'fnv1a64:992dfae2179cae98',
  'messages.programs': 'fnv1a64:ffc6bbc6b04c00bd',
  archiveProjection: 'fnv1a64:09c70bcf1901f335',
  'locations.trimount': 'fnv1a64:1a2db00bc2ab72c2',
  'locations.wiesheim': 'fnv1a64:c703aa685502941e',
  'locations.norport': 'fnv1a64:e1a39a61d6921382',
  'locations.linqu': 'fnv1a64:78a38aeb437d13bc',
  'locations.qingsui': 'fnv1a64:03a9bb7a862d2d1e',
  'locations.jiangdu': 'fnv1a64:88692879a6745375',
  'locations.zwillingsturme': 'fnv1a64:690fda9948174955',
  'locations.londinium': 'fnv1a64:1d49fddeed1fcd37',
  'locations.calais-blason': 'fnv1a64:5ccaf32b0ccc476d',
  'locations.montelupe': 'fnv1a64:be922e3922d38f74',
  'locations.nuova-volsinii': 'fnv1a64:7274d2889c512dbb',
  'performances.uncrowned-trimount-1098': 'fnv1a64:13c9e5b253bd723b',
  'performances.caged-fire-wiesheim-1098': 'fnv1a64:8ab195041909265a',
  'performances.second-snow-norport-1098': 'fnv1a64:e3f637fa193a603d',
  'performances.der-ring-londinium-1091-0308': 'fnv1a64:7aaa383f2d34f280',
  'performances.one-hundred-and-one-days-norport-1091-0419': 'fnv1a64:7819a5e11412450c',
  'performances.the-carnival-wiesheim-1091-0511': 'fnv1a64:f697e9d4b1fbf972',
  'performances.ode-au-triomphe-nuova-volsinii-1091-0623': 'fnv1a64:a63badb44a439ca6',
  'performances.der-ring-zwillingsturme-1091-0817': 'fnv1a64:9ce341eba2f619c0',
  'performances.one-hundred-and-one-days-londinium-1091-0903': 'fnv1a64:0525b768987c57d6',
  'performances.the-carnival-montelupe-1091-0921': 'fnv1a64:7329b4210dc3de88',
  'performances.the-carnival-londinium-1091-1009': 'fnv1a64:7eda97fb88540ec5',
  'performances.ode-au-triomphe-zwillingsturme-1091-1028': 'fnv1a64:306855947f5819d3',
  'productions.der-ring': 'fnv1a64:30be01592e309b7e',
  'productions.one-hundred-and-one-days': 'fnv1a64:1a2a73c86d3a02d8',
  'productions.the-carnival': 'fnv1a64:26c80fea53aa0e44',
  'productions.ode-au-triomphe': 'fnv1a64:23383434e8f6b904',
  'productions.uncrowned': 'fnv1a64:7647841db9d0bbb9',
  'productions.caged-fire': 'fnv1a64:d5c97f9cf98410b0',
  'productions.second-snow': 'fnv1a64:9c6e1ebbdf22aa4c',
  'productions.red-banquet': 'fnv1a64:d16cccf3b6f56c4b',
  'productions.seventh-lantern': 'fnv1a64:6e5e24cfecef9729',
  'productions.procession-of-masks': 'fnv1a64:867450c38e4f3a34',
  ticketZones: 'fnv1a64:fb408b238ba703f3',
});

export const localizationSourceRevisions: LocalizationSourceRevisionRegistry = Object.freeze({
  higashi: acceptedYanSourceRevision,
  columbia: acceptedYanSourceRevision,
});

export function assertLocalizationSourceFresh(
  editionIds: readonly BuildEditionId[],
  packages: Readonly<Record<BuildEditionId, PartialLocalizationPackage>>,
  expectedRevisions: LocalizationSourceRevisionRegistry = localizationSourceRevisions,
  snapshot?: Pick<ContentSnapshot, 'locationEntries' | 'performanceEntries' | 'productionEntries'>,
): void {
  const current = createLocalizationSourceRevision(packages.yan, snapshot);
  for (const editionId of editionIds) {
    if (editionId === 'yan') {
      continue;
    }
    const expected = expectedRevisions[editionId];
    if (!expected) {
      throw new Error(`${editionId} 缺少炎语源修订摘要。`);
    }
    for (const [path, revision] of Object.entries(current)) {
      if (expected[path] !== revision) {
        throw new Error(`${editionId}.${path} 译文源修订已过期。`);
      }
    }
  }
}

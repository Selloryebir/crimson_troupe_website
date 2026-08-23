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
  'site.shared': 'fnv1a64:ef3bddf368e82d21',
  'site.front': 'fnv1a64:032849e4a53971de',
  'site.archive': 'fnv1a64:96b69f28a909aa0d',
  'messages.filters': 'fnv1a64:d98c683356dc4246',
  'messages.search': 'fnv1a64:8db8feaa1a5ea44c',
  'messages.ticketing': 'fnv1a64:58f0dd00a74e3b4d',
  'messages.programs': 'fnv1a64:ffc6bbc6b04c00bd',
  archiveProjection: 'fnv1a64:9721f1ffe158ea46',
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
  'performances.uncrowned-trimount-1102': 'fnv1a64:10b17e2fa6268493',
  'performances.caged-fire-wiesheim-1102': 'fnv1a64:2fecb2cc83fcd472',
  'performances.second-snow-norport-1102': 'fnv1a64:1a5d4d2e9b49cc85',
  'performances.der-ring-londinium-1084-0308': 'fnv1a64:4c013ca46a0c69da',
  'performances.one-hundred-and-one-days-norport-1084-0419': 'fnv1a64:761166d97bb62ede',
  'performances.the-carnival-wiesheim-1084-0511': 'fnv1a64:fd729627f48a6344',
  'performances.ode-au-triomphe-nuova-volsinii-1084-0623': 'fnv1a64:d0d46c617a213824',
  'performances.der-ring-zwillingsturme-1084-0817': 'fnv1a64:51113593d350e572',
  'performances.one-hundred-and-one-days-londinium-1084-0903': 'fnv1a64:677450e1a8c176b0',
  'performances.the-carnival-montelupe-1084-0921': 'fnv1a64:a7220d6e7d9cee12',
  'performances.the-carnival-londinium-1084-1009': 'fnv1a64:095afc279dfdf91b',
  'performances.ode-au-triomphe-zwillingsturme-1084-1028': 'fnv1a64:9ca7d0a1b3c46341',
  'performances.caged-fire-jiangdu-1101-0521': 'fnv1a64:7313eefae8719c03',
  'performances.second-snow-zwillingsturme-1101-0808': 'fnv1a64:0af1979fc463989f',
  'performances.red-banquet-nuova-volsinii-1101-1119': 'fnv1a64:7df019f369c40ff4',
  'performances.seventh-lantern-norport-1102-0202': 'fnv1a64:5307f714ef1f9c46',
  'performances.red-banquet-montelupe-1102-0606': 'fnv1a64:fc19aaa265d1b223',
  'performances.seventh-lantern-linqu-1102-1212': 'fnv1a64:6f00e93d2a1a0389',
  'performances.procession-of-masks-londinium-1103-0214': 'fnv1a64:08c5482bcb7a62f6',
  'performances.uncrowned-qingsui-1103-0404': 'fnv1a64:d7d107225db89839',
  'performances.lone-wander-wiesheim-1083-0814': 'fnv1a64:599a09e9909ec218',
  'performances.wonderland-in-dream-londinium-1083-1109': 'fnv1a64:0cf81a5423d42bf5',
  'performances.frost-deer-and-snow-doe-nuova-volsinii-1084-0125': 'fnv1a64:68bc00e4d7e76cfb',
  'performances.light-of-heria-zwillingsturme-1084-0608': 'fnv1a64:dd611279c58e556a',
  'performances.lone-wander-linqu-1084-0719': 'fnv1a64:d47fd106e46c460a',
  'performances.wonderland-in-dream-qingsui-1084-1116': 'fnv1a64:29e4896a7bdca090',
  'performances.frost-deer-and-snow-doe-jiangdu-1085-0122': 'fnv1a64:3f713d72c20f2dae',
  'performances.light-of-heria-trimount-1085-0530': 'fnv1a64:d5301b6cc4b3f32d',
  'productions.der-ring': 'fnv1a64:30be01592e309b7e',
  'productions.one-hundred-and-one-days': 'fnv1a64:1a2a73c86d3a02d8',
  'productions.the-carnival': 'fnv1a64:26c80fea53aa0e44',
  'productions.ode-au-triomphe': 'fnv1a64:23383434e8f6b904',
  'productions.lone-wander': 'fnv1a64:2e1e91e889f0413b',
  'productions.wonderland-in-dream': 'fnv1a64:0f08175779b5a248',
  'productions.frost-deer-and-snow-doe': 'fnv1a64:4ae456bb60b5229e',
  'productions.light-of-heria': 'fnv1a64:8a8bfa9867c42bea',
  'productions.uncrowned': 'fnv1a64:7647841db9d0bbb9',
  'productions.caged-fire': 'fnv1a64:d5c97f9cf98410b0',
  'productions.second-snow': 'fnv1a64:9c6e1ebbdf22aa4c',
  'productions.red-banquet': 'fnv1a64:d16cccf3b6f56c4b',
  'productions.seventh-lantern': 'fnv1a64:6e5e24cfecef9729',
  'productions.procession-of-masks': 'fnv1a64:867450c38e4f3a34',
  ticketZones: 'fnv1a64:fb408b238ba703f3',
});

export const localizationSourceRevisions: LocalizationSourceRevisionRegistry = Object.freeze({
  victoria: acceptedYanSourceRevision,
  ursus: acceptedYanSourceRevision,
  siracusa: acceptedYanSourceRevision,
  minos: acceptedYanSourceRevision,
  leithanien: acceptedYanSourceRevision,
  kazimierz: acceptedYanSourceRevision,
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

import type { BuildEditionId } from '../editions.ts';
import type { PartialLocalizationPackage } from '../localized/packages.ts';
import { createContentFingerprint } from './fingerprint.ts';

export type LocalizationSourceRevision = Readonly<Record<string, string>>;
export type LocalizationSourceRevisionRegistry = Readonly<
  Partial<Record<BuildEditionId, LocalizationSourceRevision>>
>;

export interface LocalizationRevisionScope {
  locationEntries: readonly (readonly [string, unknown])[];
  performanceEntries: readonly (readonly [string, unknown])[];
  productionEntries: readonly (readonly [string, unknown])[];
}

function recordEntries(prefix: string, records: object | undefined): Array<[string, unknown]> {
  return Object.entries(records ?? {}).map(([recordId, value]) => [`${prefix}.${recordId}`, value]);
}

export function createLocalizationSourceRevision(
  source: PartialLocalizationPackage,
  scope?: LocalizationRevisionScope,
): LocalizationSourceRevision {
  const locationIds = scope?.locationEntries.map(([locationId]) => locationId);
  const performanceIds = scope?.performanceEntries.map(([performanceId]) => performanceId);
  const productionIds = scope?.productionEntries.map(([productionId]) => productionId);
  const scopedEntries = (
    prefix: string,
    records: object | undefined,
    ids: readonly string[] | undefined,
  ): Array<[string, unknown]> =>
    ids
      ? ids.map((recordId) => [
          `${prefix}.${recordId}`,
          (records as Readonly<Record<string, unknown>> | undefined)?.[recordId],
        ])
      : recordEntries(prefix, records);
  const entries: Array<[string, unknown]> = [
    ...recordEntries('site', source.site),
    ...recordEntries('messages', source.messages),
    ...recordEntries('platforms', source.platforms),
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
  'site.shared': 'fnv1a64:3a5ad1ce78629e46',
  'site.front': 'fnv1a64:cfe2fbfc3c6353ec',
  'site.archive': 'fnv1a64:96b69f28a909aa0d',
  'messages.filters': 'fnv1a64:d98c683356dc4246',
  'messages.search': 'fnv1a64:c3b686630f9f3028',
  'messages.ticketing': 'fnv1a64:ebfc32f871a7aace',
  'messages.programs': 'fnv1a64:ffc6bbc6b04c00bd',
  'platforms.rice-network': 'fnv1a64:3a8ef46ba8476461',
  'platforms.drop-tower': 'fnv1a64:6f31cd7d9bbcf84d',
  archiveProjection: 'fnv1a64:b3541f8e08feb345',
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
  'performances.uncrowned-trimount-1102': 'fnv1a64:cda43477760977cf',
  'performances.caged-fire-wiesheim-1102': 'fnv1a64:d449bd3bf5b48de4',
  'performances.second-snow-norport-1102': 'fnv1a64:d8403684c67dd83f',
  'performances.der-ring-londinium-1084-0308': 'fnv1a64:7aba32c06843e507',
  'performances.one-hundred-and-one-days-norport-1084-0419': 'fnv1a64:b94e517bdae6df68',
  'performances.the-carnival-wiesheim-1084-0511': 'fnv1a64:9bae63a8636353fd',
  'performances.ode-au-triomphe-nuova-volsinii-1084-0623': 'fnv1a64:9930dce938384d79',
  'performances.der-ring-zwillingsturme-1084-0817': 'fnv1a64:76fb99a157094673',
  'performances.one-hundred-and-one-days-londinium-1084-0903': 'fnv1a64:94246576015e6b93',
  'performances.the-carnival-montelupe-1084-0921': 'fnv1a64:27721037061aead3',
  'performances.the-carnival-londinium-1084-1009': 'fnv1a64:e001ace68c9d7e0b',
  'performances.ode-au-triomphe-zwillingsturme-1084-1028': 'fnv1a64:ffbf602b8ae9f15b',
  'performances.caged-fire-jiangdu-1101-0521': 'fnv1a64:928e64fe04fa68c9',
  'performances.second-snow-zwillingsturme-1101-0808': 'fnv1a64:023565dd76ef3a4f',
  'performances.red-banquet-nuova-volsinii-1101-1119': 'fnv1a64:796d31b380ea22cc',
  'performances.seventh-lantern-norport-1102-0202': 'fnv1a64:cd7f5652280bbeaa',
  'performances.red-banquet-montelupe-1102-0606': 'fnv1a64:f84f0de1d9dc42ad',
  'performances.seventh-lantern-linqu-1102-1212': 'fnv1a64:5a67b3b8ef1134a6',
  'performances.procession-of-masks-londinium-1103-0214': 'fnv1a64:7753210ab97bbbe6',
  'performances.uncrowned-qingsui-1103-0404': 'fnv1a64:94bbcd1ef6b59ae2',
  'performances.lone-wander-wiesheim-1083-0814': 'fnv1a64:1442bcffe892ae2e',
  'performances.wonderland-in-dream-londinium-1083-1109': 'fnv1a64:86e330b7c46be6b4',
  'performances.frost-deer-and-snow-doe-nuova-volsinii-1084-0125': 'fnv1a64:23c08df5f12ce29f',
  'performances.light-of-heria-zwillingsturme-1084-0608': 'fnv1a64:0af1a03c4c53cb86',
  'performances.lone-wander-linqu-1084-0719': 'fnv1a64:3d431febeb0ad529',
  'performances.wonderland-in-dream-qingsui-1084-1116': 'fnv1a64:75ac74300c178331',
  'performances.frost-deer-and-snow-doe-jiangdu-1085-0122': 'fnv1a64:5b26ed4a28ac40cd',
  'performances.light-of-heria-trimount-1085-0530': 'fnv1a64:3693dc4ec8a41ca3',
  'productions.der-ring': 'fnv1a64:9d0d76baf3ee9db8',
  'productions.one-hundred-and-one-days': 'fnv1a64:b0dfe96c0d102f8e',
  'productions.the-carnival': 'fnv1a64:dc9f8ede5e40b5da',
  'productions.ode-au-triomphe': 'fnv1a64:74512954ed7aeb01',
  'productions.lone-wander': 'fnv1a64:bbde36b779f891c4',
  'productions.wonderland-in-dream': 'fnv1a64:9fee2070c9d8a626',
  'productions.frost-deer-and-snow-doe': 'fnv1a64:0c3cbcae23487e90',
  'productions.light-of-heria': 'fnv1a64:084f7d4fc21e8ce5',
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
  scope?: LocalizationRevisionScope,
): void {
  const current = createLocalizationSourceRevision(packages.yan, scope);
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

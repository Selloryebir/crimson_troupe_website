export const editions = {
  yan: {
    editionId: 'yan',
    routePrefix: 'yan',
    locale: 'zh-CN',
    badgeCode: 'YAN',
    countryName: { zh: '炎', en: 'Yan', ja: '炎国' },
    languageName: { zh: '炎语', en: 'Yanese', native: '炎语' },
    realWorldLanguage: '简体中文',
  },
  victoria: {
    editionId: 'victoria',
    routePrefix: 'vic',
    locale: 'en-GB',
    badgeCode: 'VIC',
    countryName: { zh: '维多利亚', en: 'Victoria', ja: 'ヴィクトリア' },
    languageName: { zh: '维多利亚语', en: 'Victorian', native: 'Victorian' },
    realWorldLanguage: '英式英语',
  },
  ursus: {
    editionId: 'ursus',
    routePrefix: 'urs',
    locale: 'ru',
    badgeCode: 'URS',
    countryName: { zh: '乌萨斯', en: 'Ursus', ja: 'ウルサス' },
    languageName: { zh: '乌萨斯语', en: 'Ursine', native: 'Урсусский' },
    realWorldLanguage: '俄语',
  },
  siracusa: {
    editionId: 'siracusa',
    routePrefix: 'sir',
    locale: 'it',
    badgeCode: 'SIR',
    countryName: { zh: '叙拉古', en: 'Siracusa', ja: 'シラクーザ' },
    languageName: { zh: '叙拉古语', en: 'Siracusan', native: 'Siracusano' },
    realWorldLanguage: '意大利语',
  },
  minos: {
    editionId: 'minos',
    routePrefix: 'min',
    locale: 'el',
    badgeCode: 'MIN',
    countryName: { zh: '米诺斯', en: 'Minos', ja: 'ミノス' },
    languageName: { zh: '米诺斯语', en: 'Minoan', native: 'Μινωικά' },
    realWorldLanguage: '现代希腊语',
  },
  leithanien: {
    editionId: 'leithanien',
    routePrefix: 'lei',
    locale: 'de',
    badgeCode: 'LEI',
    countryName: { zh: '莱塔尼亚', en: 'Leithanien', ja: 'リターニア' },
    languageName: { zh: '莱塔尼亚语', en: 'Leithanian', native: 'Leithanisch' },
    realWorldLanguage: '德语',
  },
  kazimierz: {
    editionId: 'kazimierz',
    routePrefix: 'kaz',
    locale: 'pl',
    badgeCode: 'KAZ',
    countryName: { zh: '卡西米尔', en: 'Kazimierz', ja: 'カジミエーシュ' },
    languageName: { zh: '卡西米尔语', en: 'Kazimierzian', native: 'Kazimierski' },
    realWorldLanguage: '波兰语',
  },
  higashi: {
    editionId: 'higashi',
    routePrefix: 'hig',
    locale: 'ja-JP',
    badgeCode: 'HIG',
    countryName: { zh: '东', en: 'Higashi', ja: '極東' },
    languageName: { zh: '东国语', en: 'Higashinese', native: '極東語' },
    realWorldLanguage: '日语',
  },
  columbia: {
    editionId: 'columbia',
    routePrefix: 'col',
    locale: 'en-US',
    badgeCode: 'COL',
    countryName: { zh: '哥伦比亚', en: 'Columbia', ja: 'クルビア' },
    languageName: { zh: '哥伦比亚语', en: 'Columbian', native: 'Columbian' },
    realWorldLanguage: '美式英语',
  },
} as const;

export type EditionId = keyof typeof editions;
export type Edition = (typeof editions)[EditionId];

export const releaseEditionIds = ['yan'] as const satisfies readonly EditionId[];
export const previewEditionIds = ['yan', 'columbia'] as const satisfies readonly EditionId[];

export type BuildProfile = 'release' | 'preview';
export type BuildEditionId = (typeof previewEditionIds)[number];
export type BuiltEdition = (typeof editions)[BuildEditionId];

function readBuildProfile(): BuildProfile {
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  };
  const value = runtime.process?.env?.SITE_BUILD_PROFILE ?? 'release';
  if (value !== 'release' && value !== 'preview') {
    throw new Error(`未知 SITE_BUILD_PROFILE：${value}。只允许 release 或 preview。`);
  }
  return value;
}

export const buildProfile = readBuildProfile();
export const buildEditionIds: readonly BuildEditionId[] =
  buildProfile === 'preview' ? previewEditionIds : releaseEditionIds;
export const builtEditions: readonly BuiltEdition[] = buildEditionIds.map(
  (editionId) => editions[editionId],
);

export function isBuiltEditionId(editionId: EditionId): editionId is BuildEditionId {
  return previewEditionIds.includes(editionId as BuildEditionId);
}

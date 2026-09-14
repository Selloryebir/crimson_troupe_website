#!/usr/bin/env node

import assert from 'node:assert/strict';

import { buildSnapshot } from '../src/data/content/resolve.ts';
import { buildEditionIds, buildProfile, editions } from '../src/data/editions.ts';
import { formatTerraDateTime, formatTicketTerraDateTime } from '../src/data/localized/format.ts';
import { getLocalization, getLocalizedPerformanceEntries } from '../src/data/localized/resolve.ts';
import { ticketSeatingPlans } from '../src/data/ticket-seating-plans.ts';

const { editions: builtEditions, locations, performances, productions } = buildSnapshot;

const ticketArtifactExpectations = {
  yan: {
    dateTime: '1102年9月17日 19:30',
    dateTimeLabel: '日期与时间',
    screenTicketNumber: '票号 {number}',
    ticketNumberLabel: '票号',
  },
  victoria: {
    dateTime: '17 September 1102 at 19:30',
    dateTimeLabel: 'DATE AND TIME',
    screenTicketNumber: 'Ticket number {number}',
    ticketNumberLabel: 'TICKET NUMBER',
  },
  ursus: {
    dateTime: '17 сентября 1102 г. в 19:30',
    dateTimeLabel: 'ДАТА И ВРЕМЯ',
    screenTicketNumber: 'Билет № {number}',
    ticketNumberLabel: 'НОМЕР БИЛЕТА',
  },
  siracusa: {
    dateTime: '17 settembre 1102 alle ore 19:30',
    dateTimeLabel: 'DATA E ORA',
    screenTicketNumber: 'Numero biglietto {number}',
    ticketNumberLabel: 'NUMERO BIGLIETTO',
  },
  minos: {
    dateTime: '17 Σεπτεμβρίου 1102 στις 7:30 μ.μ.',
    dateTimeLabel: 'ΗΜΕΡΟΜΗΝΙΑ ΚΑΙ ΩΡΑ',
    screenTicketNumber: 'Αριθμός εισιτηρίου {number}',
    ticketNumberLabel: 'ΑΡΙΘΜΟΣ ΕΙΣΙΤΗΡΙΟΥ',
  },
  leithanien: {
    dateTime: '17. September 1102 um 19:30',
    dateTimeLabel: 'DATUM UND UHRZEIT',
    screenTicketNumber: 'Ticketnummer {number}',
    ticketNumberLabel: 'TICKETNUMMER',
  },
  kazimierz: {
    dateTime: '17 września 1102 19:30',
    dateTimeLabel: 'DATA I CZAS',
    screenTicketNumber: 'Numer biletu {number}',
    ticketNumberLabel: 'NUMER BILETU',
  },
  higashi: {
    dateTime: '1102年9月17日 19:30',
    dateTimeLabel: '日付と時刻',
    screenTicketNumber: '券番号 {number}',
    ticketNumberLabel: '券番号',
  },
  columbia: {
    dateTime: 'September 17, 1102 at 7:30 PM',
    dateTimeLabel: 'DATE AND TIME',
    screenTicketNumber: 'Ticket number {number}',
    ticketNumberLabel: 'TICKET NUMBER',
  },
};

const localeValidationRules = {
  higashi: {
    forbiddenPattern: /[剧团场张购页网观现这应开关选时东语历档还无为与从仅个后]/u,
    forbiddenMessage: '東国語プレビューに簡体字中国語の残留が含まれています',
  },
  columbia: {
    forbiddenPattern: /\p{Script=Han}/u,
    forbiddenMessage: '哥伦比亚预览内容包含意外汉字',
  },
  siracusa: {
    forbiddenPattern: /\p{Script=Han}/u,
    forbiddenMessage: '叙拉古预览内容包含意外汉字',
  },
  leithanien: {
    forbiddenPattern: /\p{Script=Han}/u,
    forbiddenMessage: '莱塔尼亚预览内容包含意外汉字',
  },
  kazimierz: {
    forbiddenPattern: /\p{Script=Han}/u,
    forbiddenMessage: '卡西米尔预览内容包含意外汉字',
  },
  minos: {
    forbiddenPattern: /\p{Script=Han}/u,
    forbiddenMessage: '米诺斯预览内容包含意外汉字',
    requiredPattern: /\p{Script=Greek}/u,
    requiredMessage: '米诺斯预览的主要内容类别必须包含希腊字母',
  },
  ursus: {
    forbiddenPattern: /\p{Script=Han}/u,
    forbiddenMessage: '乌萨斯预览内容包含意外汉字',
    requiredPattern: /\p{Script=Cyrillic}/u,
    requiredMessage: '乌萨斯预览的主要内容类别必须包含西里尔字母',
  },
};

const forbiddenSearchNarrativePatterns = {
  yan: /表站|里站|不包含|不会连接|网站存档/u,
  higashi: /表サイト|保存版|現在のサイトには接続|スナップショット/u,
  columbia: /front site|snapshot|archive|does not connect/iu,
  minos: /στιγμιότυπο|αρχείο|δεν συνδέεται/iu,
  ursus: /снимок|архив|не связан с текущим сайтом/iu,
};

const forbiddenArchiveNarrativePatterns = {
  yan: /网站存档|历史快照|旧剧团|1084[年 ]?存档|泰拉历\s*1084/u,
  higashi: /保存版|歴史スナップショット|旧劇団|テラ歴1084年|1084年.*保存/u,
  columbia: /\b(?:website archive|historic(?:al)? snapshot|old troupe|Terra year 1084)\b/iu,
  minos: /αρχείο ιστοτόπου|ιστορικό στιγμιότυπο|παλιού .*θιάσ|έτος Terra 1084|έτους Terra 1084/iu,
  ursus: /архив(?:ный|ная)?|историческ(?:ий|ая)|стар(?:ой|ый).*трупп|год Terra 1084|1084 года/iu,
};

function assertComplete(value, path = 'content') {
  if (typeof value === 'string') {
    assert.notEqual(value.trim(), '', `${path} 不能为空`);
    return;
  }
  if (Array.isArray(value)) {
    assert.ok(value.length > 0, `${path} 不能是空数组`);
    value.forEach((item, index) => assertComplete(item, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    assert.ok(entries.length > 0, `${path} 不能是空对象`);
    entries.forEach(([key, item]) => assertComplete(item, `${path}.${key}`));
  }
}

function assertSnapshotKeysPresent(actual, expected, label) {
  for (const key of Object.keys(expected)) {
    assert.ok(Object.hasOwn(actual, key), `${label} 缺少当前快照稳定 ID：${key}`);
  }
}

// 语法可以随语言变化，参数身份和条目结构不能变化；这不是翻译准确率评分。
function assertTranslationStructure(source, target, path) {
  if (typeof source === 'string') {
    assert.equal(typeof target, 'string', `${path} 应为文本`);
    const parameters = (text) =>
      [...new Set(text.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/gu) ?? [])].sort();
    assert.deepEqual(parameters(target), parameters(source), `${path} 插值参数与炎语不一致`);
    return;
  }
  if (Array.isArray(source)) {
    assert.ok(Array.isArray(target), `${path} 应保留列表结构`);
    assert.equal(target.length, source.length, `${path} 条目数量不一致`);
  }
  if (source && typeof source === 'object') {
    assert.ok(target && typeof target === 'object', `${path} 缺少记录`);
    assert.deepEqual(Object.keys(target).sort(), Object.keys(source).sort(), `${path} 字段不一致`);
    for (const [key, value] of Object.entries(source)) {
      assertTranslationStructure(value, target[key], `${path}.${key}`);
    }
  }
}

const sourceLocalization = getLocalization(editions.yan);

// 演出服务的语种是稳定事实，不得随网站显示语言改为当地语言。
const yaneseLanguagePatterns = {
  yan: /炎语|中文|中维/u,
  victoria: /Yanese/u,
  columbia: /Yanese/u,
  higashi: /炎語/u,
  ursus: /янском/u,
  siracusa: /yanese/u,
  minos: /Yanese/u,
  leithanien: /yanesisch/iu,
  kazimierz: /yanese/u,
};
const yaneseServiceProductions = [
  'uncrowned',
  'caged-fire',
  'der-ring',
  'one-hundred-and-one-days',
  'ode-au-triomphe',
  'lone-wander',
  'wonderland-in-dream',
  'frost-deer-and-snow-doe',
  'light-of-heria',
];

assert.equal(Object.keys(editions).length, 9, '国家版本注册应包含当前九个实体');
assert.equal(new Set(Object.values(editions).map((edition) => edition.routePrefix)).size, 9);
assert.equal(new Set(Object.values(editions).map((edition) => edition.badgeCode)).size, 9);

const productionSourceCounts = Object.values(productions).reduce(
  (counts, production) => ({
    ...counts,
    [production.sourceKind]: counts[production.sourceKind] + 1,
  }),
  { folio: 0, original: 0 },
);
assert.ok(productionSourceCounts.folio > 0 && productionSourceCounts.original > 0);

const archivePerformances = Object.values(performances).filter(
  (performance) => performance.world === 'archive',
);
assert.ok(archivePerformances.length > 0, '1084 里站根集合不能为空');
assert.ok(
  archivePerformances.every((performance) =>
    performance.productionIds.every(
      (productionId) => productions[productionId].sourceKind === 'folio',
    ),
  ),
  '1084 里站只能引用活页剧目',
);
const archiveCompletedPerformances = archivePerformances.filter(
  (performance) => performance.status === 'completed',
);
const archiveScheduledPerformances = archivePerformances.filter(
  (performance) => performance.status === 'scheduled',
);
assert.ok(archiveCompletedPerformances.length > 0, '1084 里站应保留同期历史场次');
assert.ok(archiveScheduledPerformances.length > 0, '1084 里站应保留同期本季场次');
assert.ok(
  archiveCompletedPerformances.every(
    (performance) => performance.ticketAvailability.state === 'not-on-sale',
  ),
  '1084 已闭幕场次不得保持开放登记',
);
const archiveOpenRegistrationPerformances = archiveScheduledPerformances.filter(
  (performance) => performance.ticketAvailability.state === 'on-sale',
);
const archiveStaticScheduledPerformances = archiveScheduledPerformances.filter(
  (performance) => performance.ticketAvailability.state === 'not-on-sale',
);
assert.ok(archiveOpenRegistrationPerformances.length > 0, '1084 里站应保留开放登记样本');
assert.ok(archiveStaticScheduledPerformances.length > 0, '1084 里站应保留静态待演样本');
for (const performanceId of ['light-of-heria-trimount-1085-0530']) {
  assert.equal(
    performances[performanceId].ticketAvailability.state,
    'not-on-sale',
    `${performanceId} 是静态待演样本，不应进入登记流程`,
  );
}
for (const performance of archiveOpenRegistrationPerformances) {
  assert.equal(
    performance.ticketAvailability.seatingPlanId,
    undefined,
    `${performance.performanceId} 不应为静态登记虚构表站场馆图`,
  );
  assert.ok(performance.ticketAvailability.offers.length > 0);
  assert.equal(
    new Set(performance.ticketAvailability.offers.map(({ zone }) => zone)).size,
    performance.ticketAvailability.offers.length,
    `${performance.performanceId} 的登记分区重复`,
  );
}
const frontTicketingPerformances = Object.values(performances).filter(
  (performance) =>
    performance.world === 'front' && performance.ticketAvailability.state === 'on-sale',
);
assert.ok(frontTicketingPerformances.length > 0, '表站当前快照没有可售场次');
assert.deepEqual(
  new Set(frontTicketingPerformances.map(({ performanceId }) => performanceId)),
  new Set(
    buildSnapshot.performanceEntries
      .filter(
        ([, performance]) =>
          performance.world === 'front' &&
          performance.collection === 'current' &&
          performance.ticketAvailability.state === 'on-sale',
      )
      .map(([performanceId]) => performanceId),
  ),
  '票务候选从场次资格派生，不以首页策展作为第二份开票清单',
);
for (const performance of frontTicketingPerformances) {
  const { seatingPlanId, offers } = performance.ticketAvailability;
  assert.ok(seatingPlanId, `${performance.performanceId} 缺少表站分区示意`);
  const plan = ticketSeatingPlans[seatingPlanId];
  const levelIds = plan.levels.map(({ levelId }) => levelId);
  const regions = plan.levels.flatMap(({ regions: levelRegions }) => levelRegions);
  const regionIds = regions.map(({ regionId }) => regionId);
  const planZones = [...new Set(regions.map(({ zone }) => zone))].sort();
  const offerZones = offers.map(({ zone }) => zone).sort();
  assert.equal(new Set(levelIds).size, levelIds.length, `${seatingPlanId} 的楼层身份重复`);
  assert.equal(new Set(regionIds).size, regionIds.length, `${seatingPlanId} 的空间区域身份重复`);
  assert.deepEqual(planZones, offerZones, `${performance.performanceId} 的示意分区与报价不一致`);
  assert.equal(
    new Set(offers.map(({ basePrice }) => basePrice)).size,
    offers.length,
    `${performance.performanceId} 的候选分区价格应逐级区分`,
  );
}

const frontOfferByPerformance = Object.fromEntries(
  frontTicketingPerformances.map((performance) => [
    performance.performanceId,
    performance.ticketAvailability.offers,
  ]),
);
const trimountOffers = frontOfferByPerformance['uncrowned-trimount-1102'];
const wiesheimOffers = frontOfferByPerformance['caged-fire-wiesheim-1102'];
const norportOffers = frontOfferByPerformance['second-snow-norport-1102'];
assert.deepEqual(
  norportOffers.map(({ zone }) => zone),
  ['C', 'B', 'A'],
  '诺伯特郡临时舞台只能提供 C / B / A',
);
assert.notDeepEqual(trimountOffers, wiesheimOffers, '两座正式剧院不得复用同一候选报价');
for (const zone of ['C', 'B', 'A']) {
  const norportPrice = norportOffers.find((offer) => offer.zone === zone)?.basePrice;
  const formalPrices = [trimountOffers, wiesheimOffers].map(
    (offers) => offers.find((offer) => offer.zone === zone)?.basePrice,
  );
  assert.ok(
    formalPrices.every((price) => price !== undefined && norportPrice < price),
    `诺伯特郡 ${zone} 区应低于两座正式剧院`,
  );
}
const seatingPlanExpectations = {
  'volsinii-courtyard': { levels: 1, zones: ['C', 'B', 'A'] },
  'nuova-volsinii-civic': { levels: 2, zones: ['C', 'B', 'A', 'S', 'BOX'] },
  'trimount-grand-fan': { levels: 3, zones: ['C', 'B', 'A', 'S', 'BOX'] },
  'wiesheim-mirror-horseshoe': { levels: 3, zones: ['C', 'B', 'A', 'S', 'BOX'] },
  'norport-temporary-stand': { levels: 1, zones: ['C', 'B', 'A'] },
  'montelupe-banquet-horseshoe': { levels: 2, zones: ['C', 'B', 'A', 'S', 'BOX'] },
  'linqu-courtyard-fan': { levels: 1, zones: ['C', 'B', 'A', 'S'] },
  'londinium-grand-tiers': { levels: 3, zones: ['C', 'B', 'A', 'S', 'BOX'] },
  'qingsui-opera-courtyard': { levels: 3, zones: ['C', 'B', 'A', 'S'] },
};
assert.equal(
  Object.keys(ticketSeatingPlans).length,
  Object.keys(seatingPlanExpectations).length,
  '每张已注册分区示意都必须拥有结构预期',
);
for (const [seatingPlanId, expectation] of Object.entries(seatingPlanExpectations)) {
  const plan = ticketSeatingPlans[seatingPlanId];
  assert.ok(plan, `${seatingPlanId} 缺少分区示意`);
  assert.equal(plan.levels.length, expectation.levels, `${seatingPlanId} 的楼层数量不符`);
  const actualZones = [
    ...new Set(plan.levels.flatMap(({ regions }) => regions.map(({ zone }) => zone))),
  ].sort();
  assert.deepEqual(
    actualZones,
    [...expectation.zones].sort(),
    `${seatingPlanId} 的可见分区集合不符`,
  );
}

for (const edition of builtEditions) {
  const localization = getLocalization(edition);
  const localizedEntries = getLocalizedPerformanceEntries(localization);
  const oldCity = localization.programs.locations.volsinii;
  assert.ok(oldCity.archiveCityLabel, `${edition.editionId} 缺少沃尔西尼时代名`);
  for (const [, performance] of localizedEntries.filter(
    ([, entry]) => entry.locationId === 'volsinii',
  )) {
    assert.equal(
      performance.cityLabel,
      performance.world === 'archive' ? oldCity.archiveCityLabel : oldCity.cityLabel,
    );
  }
  assert.ok(
    !localizedEntries.some(
      ([, entry]) => entry.world === 'archive' && entry.locationId === 'nuova-volsinii',
    ),
    '1084不得采用新沃尔西尼',
  );
  const oldVenue = localization.programs.performances['volsinii-courtyard-1102'].venue;
  const newVenue = localization.programs.performances['nuova-volsinii-civic-1102'].venue;
  assert.notEqual(oldVenue, newVenue, `${edition.editionId} 新旧城剧场不得混用`);
  for (const id of yaneseServiceProductions) {
    assert.match(
      localization.programs.productions[id].language,
      yaneseLanguagePatterns[edition.editionId],
      `${edition.editionId}.${id} 不得改变字幕或场序单的炎语语种`,
    );
  }
  for (const group of ['site', 'programs', 'messages', 'archiveProjection', 'platforms']) {
    assertTranslationStructure(
      sourceLocalization[group],
      localization[group],
      `${edition.editionId}.${group}`,
    );
  }
  for (const world of ['front', 'archive']) {
    const indices = buildSnapshot.performanceEntries
      .filter(([, performance]) => performance.world === world)
      .map(([id]) => localization.programs.performances[id].index);
    assert.equal(new Set(indices).size, indices.length, `${edition.editionId}.${world} 簿号重复`);
  }
  for (const [id, content] of Object.entries(localization.programs.productions)) {
    if (productions[id].sourceKind !== 'folio') continue;
    const expected = sourceLocalization.programs.productions[id].synopsis;
    assert.equal(content.tagline, content.synopsis, `${edition.editionId}.${id} 摘要与简介不同`);
    assert.deepEqual(
      content.synopsis.split('\n\n').map((paragraph) => paragraph.split('\n').length),
      expected.split('\n\n').map((paragraph) => paragraph.split('\n').length),
      `${edition.editionId}.${id} 丢失来源段落或换行`,
    );
  }
  const expectedTicketArtifact = ticketArtifactExpectations[edition.editionId];
  const exampleTerraDateTime = {
    calendar: 'terra',
    year: 1102,
    month: 9,
    day: 17,
    time: '19:30',
  };
  assert.equal(
    formatTicketTerraDateTime(exampleTerraDateTime, edition.locale),
    expectedTicketArtifact.dateTime,
    `${edition.editionId} 票面日期时间格式不符合 locale 预期`,
  );
  assert.equal(
    localization.messages.ticketing.artifact.dateTime,
    expectedTicketArtifact.dateTimeLabel,
    `${edition.editionId} 票面日期字段名不准确`,
  );
  assert.equal(
    localization.messages.ticketing.ticketNumber,
    expectedTicketArtifact.screenTicketNumber,
    `${edition.editionId} 屏幕票号字段名不准确`,
  );
  assert.equal(
    localization.messages.ticketing.artifact.ticketNumber,
    expectedTicketArtifact.ticketNumberLabel,
    `${edition.editionId} SVG 票号字段名不准确`,
  );
  for (const [performanceId, performance] of getLocalizedPerformanceEntries(
    localization,
    buildSnapshot,
  )) {
    assert.match(
      performance.index,
      /^(?:0[1-9]|[1-9]\d+)$/u,
      `${edition.editionId}.${performanceId} 簿号应使用至少两位阿拉伯数字`,
    );
    assert.equal(
      performance.index,
      sourceLocalization.programs.performances[performanceId].index,
      `${edition.editionId}.${performanceId} 簿号身份与炎语不一致`,
    );
    assert.equal(
      performance.dateTime.display,
      formatTerraDateTime(performances[performanceId].effectiveDateTime, edition.locale),
      `${edition.editionId}.${performanceId} 的显示日期必须由结构时间生成`,
    );
  }
  assert.equal(
    getLocalizedPerformanceEntries(localization, buildSnapshot).length,
    buildSnapshot.performanceEntries.length,
  );
  assert.equal(localization.sources.site.usedFallback, false, `${edition.editionId}.site 发生回退`);
  assert.equal(
    localization.sources.programs.usedFallback,
    false,
    `${edition.editionId}.programs 发生回退`,
  );
  assert.equal(
    localization.sources.messages.usedFallback,
    false,
    `${edition.editionId}.messages 发生回退`,
  );
  const ticketingMessages = localization.messages.ticketing;
  assert.ok(
    ticketingMessages.retryStandard.includes(localization.platforms['rice-network'].displayName),
    `${edition.editionId}.ticketing.retryStandard 必须明确水稻网原价线路`,
  );
  assert.ok(
    ticketingMessages.tryPremium.includes(localization.platforms['drop-tower'].displayName),
    `${edition.editionId}.ticketing.tryPremium 必须明确跳楼机加价方案`,
  );
  assert.doesNotMatch(
    JSON.stringify(ticketingMessages),
    /SIMULATED|simulated|模拟体验|模拟流程|模拟服务|模拟结算|模擬体験|模擬購入|模擬サービス|προσομοιω|имитац|имитируем|условн|symul|simulier|simulato/iu,
    `${edition.editionId}.ticketing 不得反复使用开发视角的模拟提示`,
  );
  assert.equal(
    localization.sources.platforms.usedFallback,
    false,
    `${edition.editionId}.platforms 发生回退`,
  );
  assert.equal(
    localization.sources.archiveProjection.usedFallback,
    false,
    `${edition.editionId}.archiveProjection 发生回退`,
  );
  assertComplete(localization.site, `${edition.editionId}.site`);
  assertComplete(localization.programs, `${edition.editionId}.programs`);
  assertComplete(localization.messages, `${edition.editionId}.messages`);
  assertComplete(localization.platforms, `${edition.editionId}.platforms`);
  assertComplete(localization.archiveProjection, `${edition.editionId}.archiveProjection`);
  assertSnapshotKeysPresent(
    localization.programs.locations,
    locations,
    `${edition.editionId}.locations`,
  );
  assertSnapshotKeysPresent(
    localization.programs.performances,
    performances,
    `${edition.editionId}.performances`,
  );
  assertSnapshotKeysPresent(
    localization.programs.productions,
    productions,
    `${edition.editionId}.productions`,
  );
  const forbiddenSearchPattern = forbiddenSearchNarrativePatterns[edition.editionId];
  if (forbiddenSearchPattern) {
    assert.doesNotMatch(
      JSON.stringify([
        localization.site.front.search,
        localization.site.archive.search,
        localization.site.archive.searchIndex,
      ]),
      forbiddenSearchPattern,
      `${edition.editionId} 搜索访客文案泄露内部时间层或存档关系`,
    );
  }
  const forbiddenArchivePattern = forbiddenArchiveNarrativePatterns[edition.editionId];
  if (forbiddenArchivePattern) {
    const archiveHomeCopy = Object.fromEntries(
      Object.entries(localization.site.archive.home).filter(([key]) => key !== 'featuredNumber'),
    );
    assert.doesNotMatch(
      JSON.stringify({
        register: localization.site.archive.register,
        banner: localization.site.archive.banner,
        home: archiveHomeCopy,
        currentPerformances: localization.site.archive.currentPerformances,
        historyPerformances: localization.site.archive.historyPerformances,
        performanceDetail: localization.site.archive.performanceDetail,
        productionDetail: localization.site.archive.productionDetail,
        search: localization.site.archive.search,
        tickets: localization.site.archive.tickets,
        troupe: localization.site.archive.troupe,
      }),
      forbiddenArchivePattern,
      `${edition.editionId} 里站等级 0 主体泄露现代馆藏或旧站视角`,
    );
  }
  const localeRule = localeValidationRules[edition.editionId];
  if (localeRule) {
    const visitorContent = {
      site: localization.site,
      programs: localization.programs,
      messages: localization.messages,
      archiveProjection: localization.archiveProjection,
    };
    assert.doesNotMatch(
      JSON.stringify(visitorContent),
      localeRule.forbiddenPattern,
      localeRule.forbiddenMessage,
    );
    if (localeRule.requiredPattern) {
      for (const [category, content] of Object.entries(visitorContent)) {
        assert.match(
          JSON.stringify(content),
          localeRule.requiredPattern,
          `${localeRule.requiredMessage}：${category}`,
        );
      }
    }
  }
}

console.log(
  `locale validation passed: profile=${buildProfile}, editions=${buildEditionIds.join(',')}, locations=${Object.keys(locations).length}, performances=${Object.keys(performances).length}, productions=${Object.keys(productions).length}`,
);

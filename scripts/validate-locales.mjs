#!/usr/bin/env node

import assert from 'node:assert/strict';

import { buildSnapshot } from '../src/data/content/resolve.ts';
import { buildEditionIds, buildProfile, editions } from '../src/data/editions.ts';
import { getLocalization, getLocalizedPerformanceEntries } from '../src/data/localized/resolve.ts';
import { ticketSeatingPlans } from '../src/data/ticket-seating-plans.ts';

const { editions: builtEditions, locations, performances, productions } = buildSnapshot;

const localeValidationRules = {
  higashi: {
    forbiddenPattern: /[剧团场张购页网观现这应开关选时东语历档还无为与从仅个后]/u,
    forbiddenMessage: '東国語プレビューに簡体字中国語の残留が含まれています',
  },
  columbia: {
    forbiddenPattern: /\p{Script=Han}/u,
    forbiddenMessage: '哥伦比亚预览内容包含意外汉字',
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
assert.ok(archivePerformances.length > 0, '1091 里站根集合不能为空');
assert.ok(
  archivePerformances.every(
    (performance) =>
      performance.productionIds.every(
        (productionId) => productions[productionId].sourceKind === 'folio',
      ) &&
      performance.ticketAvailability.state === 'unavailable' &&
      performance.ticketAvailability.reason === 'historic-snapshot',
  ),
  '1091 里站只能引用活页剧目且必须保持历史快照不可购票',
);
const frontTicketingPerformances = Object.values(performances).filter(
  (performance) =>
    performance.world === 'front' && performance.ticketAvailability.state === 'on-sale',
);
assert.ok(frontTicketingPerformances.length > 0, '表站当前快照没有可售场次');
for (const performance of frontTicketingPerformances) {
  const { seatingPlanId, offers } = performance.ticketAvailability;
  const planZones = ticketSeatingPlans[seatingPlanId].zones.map(({ zone }) => zone).sort();
  const offerZones = offers.map(({ zone }) => zone).sort();
  assert.deepEqual(planZones, offerZones, `${performance.performanceId} 的示意分区与报价不一致`);
}

for (const edition of builtEditions) {
  const localization = getLocalization(edition);
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
  assert.equal(
    localization.sources.archiveProjection.usedFallback,
    false,
    `${edition.editionId}.archiveProjection 发生回退`,
  );
  assertComplete(localization.site, `${edition.editionId}.site`);
  assertComplete(localization.programs, `${edition.editionId}.programs`);
  assertComplete(localization.messages, `${edition.editionId}.messages`);
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

#!/usr/bin/env node

import assert from 'node:assert/strict';

import { buildEditionIds, buildProfile, builtEditions, editions } from '../src/data/editions.ts';
import { locations } from '../src/data/locations.ts';
import { getLocalization } from '../src/data/localized/resolve.ts';
import { performances } from '../src/data/performances.ts';
import { productions } from '../src/data/productions/index.ts';

const localeValidationRules = {
  higashi: {
    forbiddenPattern: /[剧团场张购页网观现这应开关选时东语历档还无为与从仅个后]/u,
    forbiddenMessage: '東国語プレビューに簡体字中国語の残留が含まれています',
  },
  columbia: {
    forbiddenPattern: /\p{Script=Han}/u,
    forbiddenMessage: '哥伦比亚预览内容包含意外汉字',
  },
};

const expectedArchiveMatrix = {
  'der-ring-calais-blason-1091-0308': ['der-ring', 'calais-blason', 'history'],
  'one-hundred-and-one-days-calais-blason-1091-0419': [
    'one-hundred-and-one-days',
    'calais-blason',
    'history',
  ],
  'the-carnival-wiesheim-1091-0511': ['the-carnival', 'wiesheim', 'history'],
  'ode-au-triomphe-nuova-volsinii-1091-0623': ['ode-au-triomphe', 'nuova-volsinii', 'history'],
  'der-ring-zwillingsturme-1091-0817': ['der-ring', 'zwillingsturme', 'current'],
  'one-hundred-and-one-days-londinium-1091-0903': [
    'one-hundred-and-one-days',
    'londinium',
    'current',
  ],
  'the-carnival-montelupe-1091-0921': ['the-carnival', 'montelupe', 'current'],
  'the-carnival-londinium-1091-1009': ['the-carnival', 'londinium', 'current'],
  'ode-au-triomphe-zwillingsturme-1091-1028': ['ode-au-triomphe', 'zwillingsturme', 'current'],
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

function assertExactKeys(actual, expected, label) {
  assert.deepEqual(
    Object.keys(actual).sort(),
    Object.keys(expected).sort(),
    `${label} 的稳定 ID 不完整`,
  );
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
assert.deepEqual(productionSourceCounts, { folio: 4, original: 6 });

const archivePerformances = Object.values(performances).filter(
  (performance) => performance.world === 'archive',
);
assert.equal(archivePerformances.length, 9, '1091 里站应包含九个场次');
assert.deepEqual(
  Object.fromEntries(
    archivePerformances.map((performance) => [
      performance.performanceId,
      [performance.productionIds[0], performance.locationId, performance.collection],
    ]),
  ),
  expectedArchiveMatrix,
  '1091 里站剧目、地点或集合矩阵发生偏移',
);
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
assert.deepEqual(
  archivePerformances.reduce((counts, performance) => {
    const countryEditionId = locations[performance.locationId].countryEditionId;
    counts[countryEditionId] = (counts[countryEditionId] ?? 0) + 1;
    return counts;
  }, {}),
  { victoria: 4, leithanien: 3, siracusa: 2 },
  '1091 里站国家分布发生偏移',
);

for (const edition of builtEditions) {
  const localization = getLocalization(edition);
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
  assertComplete(localization.site, `${edition.editionId}.site`);
  assertComplete(localization.programs, `${edition.editionId}.programs`);
  assertComplete(localization.messages, `${edition.editionId}.messages`);
  assertExactKeys(localization.programs.locations, locations, `${edition.editionId}.locations`);
  assertExactKeys(
    localization.programs.performances,
    performances,
    `${edition.editionId}.performances`,
  );
  assertExactKeys(
    localization.programs.productions,
    productions,
    `${edition.editionId}.productions`,
  );
  const localeRule = localeValidationRules[edition.editionId];
  if (localeRule) {
    assert.doesNotMatch(
      JSON.stringify({
        site: localization.site,
        programs: localization.programs,
        messages: localization.messages,
      }),
      localeRule.forbiddenPattern,
      localeRule.forbiddenMessage,
    );
  }
}

console.log(
  `locale validation passed: profile=${buildProfile}, editions=${buildEditionIds.join(',')}, locations=${Object.keys(locations).length}, performances=${Object.keys(performances).length}, productions=${Object.keys(productions).length}`,
);

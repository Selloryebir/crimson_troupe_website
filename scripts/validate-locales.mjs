#!/usr/bin/env node

import assert from 'node:assert/strict';

import { buildEditionIds, buildProfile, builtEditions, editions } from '../src/data/editions.ts';
import { locations } from '../src/data/locations.ts';
import { getLocalization } from '../src/data/localized/resolve.ts';
import { performances } from '../src/data/performances.ts';
import { productions } from '../src/data/productions/index.ts';

const localeValidationRules = {
  columbia: {
    forbiddenPattern: /\p{Script=Han}/u,
    forbiddenMessage: '哥伦比亚预览内容包含意外汉字',
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

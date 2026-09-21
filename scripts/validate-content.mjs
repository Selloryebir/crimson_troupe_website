#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildSnapshot } from '../src/data/content/resolve.ts';
import { assertContentBundle } from '../src/data/content/validate.ts';
import { buildContext, buildEditionIds, editions } from '../src/data/editions.ts';
import { folioSourceTexts } from '../src/data/localized/folio-source-texts.ts';
import { getLocalization } from '../src/data/localized/resolve.ts';
import {
  archiveFolioCrimsonManifest,
  productionArtworkManifest,
} from '../src/data/production-artwork-manifest.ts';
import { folioSourceRecords } from '../src/data/productions/folio-source-records.ts';
import { ticketingPlatforms } from '../src/data/ticketing-platforms.ts';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const productionTitleReference = readFileSync(
  path.join(repositoryRoot, 'docs/sources/official-folio-productions.md'),
  'utf8',
);

function assertFolioAuthoringStructure() {
  const expectedProductionIds = Object.keys(folioSourceTexts).sort();
  for (const editionId of buildEditionIds) {
    const authoringPath = path.join(
      repositoryRoot,
      'src/data/localized',
      editionId,
      'productions/folio.ts',
    );
    const source = readFileSync(authoringPath, 'utf8');
    assert.doesNotMatch(
      source,
      /^\s{4}(?:title|tagline|synopsis):/mu,
      `${editionId} 活页版本文件不得恢复来源标题或描述副本`,
    );
    assert.doesNotMatch(
      source,
      /folioSourceRecords/u,
      `${editionId} 活页版本文件不得绕过集中来源文本目录`,
    );
    const assembledProductionIds = [
      ...source.matchAll(/createFolioProductionContent\(\s*'[^']+',\s*'([^']+)'/gu),
    ]
      .map((match) => match[1])
      .sort();
    assert.deepEqual(
      assembledProductionIds,
      expectedProductionIds,
      `${editionId} 活页版本文件必须通过统一装配 API 覆盖全部当前剧目`,
    );
  }
}

function assertArtworkFiles() {
  const entries = [
    ...Object.values(productionArtworkManifest).flatMap((worlds) => Object.values(worlds)),
    ...Object.values(archiveFolioCrimsonManifest),
  ];
  for (const entry of entries) {
    if (!entry) continue;
    const digest = `sha256:${createHash('sha256')
      .update(readFileSync(path.join(repositoryRoot, entry.assetPath)))
      .digest('hex')}`;
    assert.equal(digest, entry.sourceRevision, `${entry.assetPath} 与素材修订摘要不一致`);
  }
}

function assertTicketingPlatformLogoFiles() {
  for (const platform of Object.values(ticketingPlatforms)) {
    const digest = `sha256:${createHash('sha256')
      .update(readFileSync(path.join(repositoryRoot, platform.logo.assetPath)))
      .digest('hex')}`;
    assert.equal(
      digest,
      platform.logo.sourceRevision,
      `${platform.logo.assetPath} 与素材修订摘要不一致`,
    );
  }
}

assert.doesNotThrow(() =>
  assertContentBundle(buildEditionIds, buildSnapshot.rootSet, buildContext),
);
assertFolioAuthoringStructure();
assertArtworkFiles();
assert.equal(buildSnapshot.archiveProjectionSourceId, 'the-lullaby');
assert.equal(buildSnapshot.productions['the-lullaby'], undefined);
assert.deepEqual(
  Object.keys(buildSnapshot.archiveFolioCrimson).sort(),
  [...buildSnapshot.archiveFolioProductionIds, 'the-lullaby'].sort(),
);
assertTicketingPlatformLogoFiles();
assert.equal(Object.keys(folioSourceRecords).length, 13, '活页来源目录应完整保存 13 条记录');
assert.equal(
  productionTitleReference.match(/^### `PROD-SRC-\d+`/gmu)?.length,
  13,
  '活页来源参考应完整保存 13 条官方描述',
);
for (const [productionId, source] of Object.entries(folioSourceRecords)) {
  const titleRow = productionTitleReference
    .split('\n')
    .find((line) => line.includes(`| \`${source.sourceId}\` | \`${productionId}\``));
  assert.ok(titleRow, `${productionId} 的人员参考缺少标题来源行`);
  assert.deepEqual(
    titleRow
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim()),
    [
      `\`${source.sourceId}\``,
      `\`${productionId}\``,
      source.titleForms['zh-CN'],
      source.titleForms.en,
      source.titleForms['ja-JP'],
    ],
    `${productionId} 的运行时标题来源与人员参考不一致`,
  );
  const quotedSynopsis = source.synopsis.text
    .split('\n\n')
    .map((paragraph) => `> ${paragraph}`)
    .join('\n>\n');
  assert.ok(
    productionTitleReference.includes(
      `### \`${source.sourceId}\`｜\`${productionId}\`｜${source.titleForms['zh-CN']}\n\n${quotedSynopsis}`,
    ),
    `${productionId} 的运行时活页来源与人员参考不一致`,
  );
}
assert.deepEqual(
  buildSnapshot.performanceEntries.map(([performanceId]) => performanceId),
  [
    ...buildSnapshot.rootSet.worlds.front.performanceIds,
    ...buildSnapshot.rootSet.worlds.archive.performanceIds,
  ],
  '当前快照场次应逐项来自所选根集合并保持顺序',
);
assert.deepEqual(
  buildSnapshot.productionEntries.map(([productionId]) => productionId),
  [
    ...new Set(
      buildSnapshot.performanceEntries.flatMap(([, performance]) => performance.productionIds),
    ),
  ],
  '当前快照剧目应等于所选场次的真实依赖闭包',
);

const cachedYanLocalization = getLocalization(editions.yan, buildSnapshot);
assert.equal(
  getLocalization(editions.yan, buildSnapshot),
  cachedYanLocalization,
  '同一快照与国家版本应复用严格本地化解析结果',
);
const parallelSnapshot = { ...buildSnapshot };
assert.notEqual(
  getLocalization(editions.yan, parallelSnapshot),
  cachedYanLocalization,
  '本地化缓存不得跨内容快照复用',
);
assert.ok(Object.isFrozen(buildSnapshot.localizationPackages.yan.site.brand));
assert.throws(() => {
  buildSnapshot.localizationPackages.yan.site.brand.name = '测试';
}, TypeError);
for (const [, , artwork] of buildSnapshot.artworkEntries) {
  assert.ok(Object.isFrozen(artwork.pollution.darkenZones));
}
for (const [, seatingPlan] of buildSnapshot.seatingPlanEntries) {
  assert.ok(Object.isFrozen(seatingPlan.levels));
  for (const level of seatingPlan.levels) assert.ok(Object.isFrozen(level.regions));
}

console.log(
  `content validation passed: profile=${buildContext.profile}, editions=${buildEditionIds.join(',')}, performances=${buildSnapshot.performanceEntries.length}, approvals=0`,
);

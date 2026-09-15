// 研究资料的只读一致性检查；不参与站点构建或运行时。
// --matrix 仅输出派生 CSV，默认检查磁盘视图与源数据一致。
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = (relative) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const json = (relative, key) => JSON.parse(read(relative))[key];
const sources = json('../../sources/terra-terminology/sources.json', 'sources');
const forms = json('../../sources/terra-terminology/attestations.json', 'attestations');
const concepts = json('./concepts.json', 'concepts');
const candidates = json('./translation-candidates.json', 'candidates');
const unique = (rows, key) => {
  const ids = new Set(rows.map((row) => row[key]));
  assert.equal(ids.size, rows.length, `重复 ${key}`);
  assert(!ids.has(undefined) && !ids.has(''), `缺失 ${key}`);
  return ids;
};
const sourceIds = unique(sources, 'source_id');
const conceptIds = unique(concepts, 'concept_id');
const formIds = unique(forms, 'form_id');
unique(candidates, 'candidate_id');
const candidateKeys = new Set();
for (const source of sources) {
  assert(
    ['official_site', 'community_wiki', 'game_text_mirror', 'local_approved'].includes(
      source.source_type,
    ),
    source.source_id,
  );
  assert(['full', 'search_excerpt', 'blocked', 'local'].includes(source.access), source.source_id);
  assert(source.title && source.publisher && source.notes && source.accessed_at, source.source_id);
  if (source.source_type === 'local_approved') {
    assert(
      source.access === 'local' && existsSync(new URL(`../../../${source.url}`, import.meta.url)),
      source.source_id,
    );
  } else {
    assert(/^https?:\/\//u.test(source.url), `非公开链接 ${source.source_id}`);
  }
}
const knownRefs = (refs, ids, owner) => {
  assert(Array.isArray(refs) && refs.length > 0, `无来源 ${owner}`);
  for (const id of refs) assert(ids.has(id), `${owner} 悬空引用 ${id}`);
};
for (const concept of concepts) {
  assert(concept.description_kind === 'research_paraphrase', concept.concept_id);
  assert(concept.research_status === 'source_reviewed_not_adopted', concept.concept_id);
  assert(
    concept.zh && concept.description_zh && concept.scope_notes && concept.temporal_scope,
    concept.concept_id,
  );
  knownRefs(concept.source_ids, sourceIds, concept.concept_id);
  knownRefs(concept.form_ids, formIds, concept.concept_id);
  for (const formId of concept.form_ids) {
    assert.equal(forms.find((form) => form.form_id === formId).concept_id, concept.concept_id);
  }
  for (const relation of concept.relations) {
    assert(
      conceptIds.has(relation.target),
      `${concept.concept_id} 未收录关系目标 ${relation.target}`,
    );
    assert(
      [
        'successor_of',
        'located_in',
        'distinct_from',
        'alias_of',
        'member_of',
        'related_to',
        'causes',
      ].includes(relation.type),
      relation.type,
    );
    assert.notEqual(relation.target, concept.concept_id, '自指关系');
  }
}
for (const form of forms) {
  assert(
    conceptIds.has(form.concept_id) && form.text && form.locator && typeof form.notes === 'string',
    form.form_id,
  );
  assert(['zh-CN', 'en', 'ja-JP'].includes(form.locale), form.form_id);
  assert(
    ['official_direct', 'official_reproduced', 'community_reference', 'project_approved'].includes(
      form.origin,
    ),
    form.form_id,
  );
  knownRefs(form.source_ids, sourceIds, form.form_id);
  const evidence = sources.filter((source) => form.source_ids.includes(source.source_id));
  assert(
    evidence.some((source) => source.access !== 'blocked'),
    `全无可见证据 ${form.form_id}`,
  );
  if (form.origin === 'official_direct')
    assert(
      evidence.some((source) => source.source_type === 'official_site'),
      form.form_id,
    );
  if (form.origin === 'official_reproduced')
    assert(
      evidence.some((source) => source.source_type === 'game_text_mirror'),
      form.form_id,
    );
}
for (const candidate of candidates) {
  assert(
    conceptIds.has(candidate.concept_id) && candidate.text && candidate.notes,
    candidate.candidate_id,
  );
  assert.equal(candidate.origin, 'candidate');
  assert.equal(candidate.review_status, 'unreviewed');
  assert(['ru-RU', 'it-IT', 'el-GR', 'de-DE', 'pl-PL'].includes(candidate.locale));
  assert(
    ['semantic_translation', 'protected_name', 'hybrid_name', 'transliteration'].includes(
      candidate.method,
    ),
  );
  for (const locale of candidate.basis_locales) {
    assert(
      forms.some((form) => form.concept_id === candidate.concept_id && form.locale === locale),
      candidate.candidate_id,
    );
  }
  const key = `${candidate.concept_id}:${candidate.locale}`;
  assert(!candidateKeys.has(key), `重复候选语言 ${key}`);
  candidateKeys.add(key);
}

const locales = ['en-GB', 'zh-CN', 'en-US', 'de-DE', 'el-GR', 'it-IT', 'ja-JP', 'pl-PL', 'ru-RU'];
const cell = (value) => `"${String(value).replaceAll('"', '""')}"`;
const rows = [['concept_id', 'category', 'zh_reference', ...locales, 'scope_notes']];
for (const concept of concepts) {
  rows.push([
    concept.concept_id,
    concept.category,
    concept.zh,
    ...locales.map((locale) => {
      const sourceLocale = locale.startsWith('en-') ? 'en' : locale;
      const attested = forms.filter(
        (form) => form.concept_id === concept.concept_id && form.locale === sourceLocale,
      );
      if (attested.length)
        return attested
          .map(
            (form) =>
              `${form.text} [${form.origin};${form.form_id}${sourceLocale !== locale ? ';source=en;not-edition-approved' : ''}]`,
          )
          .join(' || ');
      const candidate = candidates.find(
        (entry) => entry.concept_id === concept.concept_id && entry.locale === locale,
      );
      return candidate
        ? `${candidate.text} [candidate;${candidate.method};${candidate.candidate_id}]`
        : '[not_verified]';
    }),
    concept.scope_notes,
  ]);
}
// 13项活页标题继续从原人员来源派生，禁止建立第二份可编辑权威表。
const folioRows = read('../../sources/official-folio-productions.md')
  .split('\n')
  .filter((line) => /^\|\s*`PROD-SRC-\d+`/u.test(line));
assert.equal(folioRows.length, 13, '活页来源映射需要复核');
for (const line of folioRows) {
  const [sourceId, productionId, zh, en, ja] = line
    .split('|')
    .slice(1, -1)
    .map((part) => part.trim().replaceAll('`', ''));
  rows.push([
    `production:${productionId}`,
    'folio-reference',
    zh,
    ...locales.map((locale) => {
      const title = locale.startsWith('en-')
        ? en
        : locale === 'zh-CN'
          ? zh
          : locale === 'ja-JP'
            ? ja
            : null;
      return title
        ? `${title} [project_approved;official-folio-productions.md#${sourceId};not-edition-approved]`
        : '[not_verified]';
    }),
    '只读来源视图；标题存在不代表剧目已排演、批准发布或允许改写官方描述。',
  ]);
}
const matrix = `${rows.map((row) => row.map(cell).join(',')).join('\n')}\n`;
if (process.argv.includes('--matrix')) {
  process.stdout.write(matrix);
} else {
  assert.equal(read('./matrix.csv'), matrix, 'matrix.csv不是当前JSON与活页唯一来源的派生视图');
  const summary = {
    concepts: concepts.length,
    folioReferences: folioRows.length,
    attestations: forms.length,
    sources: sources.length,
    uniqueSourceUrls: new Set(sources.map((source) => source.url)).size,
    candidates: candidates.length,
    semanticOrHybridCandidates: candidates.filter((entry) => entry.method !== 'protected_name')
      .length,
    officialDirect: forms.filter((form) => form.origin === 'official_direct').length,
    officialReproduced: forms.filter((form) => form.origin === 'official_reproduced').length,
    communityReference: forms.filter((form) => form.origin === 'community_reference').length,
    missingJapanese: concepts
      .filter(
        (concept) =>
          !forms.some((form) => form.concept_id === concept.concept_id && form.locale === 'ja-JP'),
      )
      .map((concept) => concept.concept_id),
  };
  console.log(JSON.stringify(summary, null, 2));
}

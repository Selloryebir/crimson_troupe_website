import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, unlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  createPlan,
  getFindingKey,
  isReviewInput,
  recordReview,
  runCli,
  validateReport,
} from './creative-review.mjs';

delete process.env.CREATIVE_REVIEW_BASE_REF;

function git(cwd, ...args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

function commitAll(cwd, message) {
  git(cwd, 'add', '-A');
  git(
    cwd,
    '-c',
    'user.name=Creative Review Test',
    '-c',
    'user.email=creative-review@example.invalid',
    'commit',
    '--quiet',
    '-m',
    message,
  );
  return git(cwd, 'rev-parse', 'HEAD');
}

async function write(root, filePath, contents) {
  const absolutePath = path.join(root, filePath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, contents, 'utf8');
}

async function createRepository(t) {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'creative-review-'));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  git(cwd, 'init', '--quiet');
  await write(cwd, 'src/data/content.ts', "export const title = 'Crimson Troupe';\n");
  await write(cwd, 'docs/research/terra-chronology/evidence.csv', 'id,claim\nE1,known\n');
  await write(cwd, 'src/styles/main.css', 'body { color: black; }\n');
  await write(cwd, 'docs/drafts/creative/idea.md', '# Draft\n');
  git(cwd, 'add', '.');
  git(
    cwd,
    '-c',
    'user.name=Creative Review Test',
    '-c',
    'user.email=creative-review@example.invalid',
    'commit',
    '--quiet',
    '-m',
    'initial',
  );
  return cwd;
}

function changedPaths(plan) {
  return [...plan.changes.added, ...plan.changes.modified, ...plan.changes.deleted];
}

function makeReport(plan, overrides = {}) {
  const evidencePath =
    plan.files.find((file) => file.path === 'src/data/content.ts')?.path ??
    plan.files[0]?.path ??
    plan.changes.deleted[0];
  const axis = {
    conclusion: 'pass',
    evidence: [{ path: evidencePath, line: 1, note: 'Reviewed the relevant source.' }],
  };
  return {
    schemaVersion: 1,
    fingerprint: plan.fingerprint,
    classification: 'semantic-review',
    summary: 'Reviewed all covered changes against the content boundaries.',
    scope: {
      paths: changedPaths(plan),
      reason: 'The listed paths are the complete changed set reported by the plan.',
    },
    axes: {
      chronology: structuredClone(axis),
      worldview: structuredClone(axis),
      consistency: structuredClone(axis),
      snapshots: structuredClone(axis),
      localization: structuredClone(axis),
    },
    findings: [],
    resolutions: [],
    ...overrides,
  };
}

async function saveReport(cwd, report, fileName = 'review.json') {
  await write(cwd, fileName, `${JSON.stringify(report, null, 2)}\n`);
  return fileName;
}

async function recordReport(cwd, report, fileName = 'review.json', options = {}) {
  const reportPath = await saveReport(cwd, report, fileName);
  return recordReview(reportPath, { cwd, ...options });
}

async function recordBaseline(cwd) {
  const plan = await createPlan({ cwd });
  const reportPath = await saveReport(cwd, makeReport(plan));
  await recordReview(reportPath, { cwd });
  return plan;
}

test('isReviewInput includes semantic inputs and excludes CSS, binaries, drafts, and its test', () => {
  assert.equal(isReviewInput('src/data/content.ts'), true);
  assert.equal(isReviewInput('src/pages/yan/index.astro'), true);
  assert.equal(isReviewInput('src/components/Hero.astro'), true);
  assert.equal(isReviewInput('src/scripts/search.ts'), true);
  assert.equal(isReviewInput('docs/research/terra-terminology/concepts.json'), true);
  assert.equal(isReviewInput('docs/research/terra-terminology/matrix.csv'), true);
  assert.equal(isReviewInput('docs/research/terra-terminology/README.md'), false);
  assert.equal(isReviewInput('docs/guides/creative-content-review.md'), true);
  assert.equal(isReviewInput('docs/sources/official-folio-productions.md'), true);
  assert.equal(isReviewInput('docs/sources/new-official/source.yaml'), true);
  assert.equal(isReviewInput('docs/sources/new-official/source.txt'), true);
  assert.equal(isReviewInput('docs/sources/new-official/reference.png'), false);
  assert.equal(isReviewInput('docs/research/terra-terminology/language-policy.md'), true);
  assert.equal(isReviewInput('docs/blueprint/content/content-contract.md'), true);
  assert.equal(isReviewInput('docs/blueprint/foundation/domain-language.md'), true);
  assert.equal(isReviewInput('docs/blueprint/i18n/localization-contract.md'), true);
  assert.equal(isReviewInput('docs/blueprint/i18n/terminology-contract.md'), true);
  assert.equal(isReviewInput('docs/blueprint/modules/terra-time.md'), true);
  assert.equal(isReviewInput('docs/blueprint/content/production-visual.md'), true);
  assert.equal(isReviewInput('docs/blueprint/i18n/extra-contract.md'), true);
  assert.equal(isReviewInput('docs/blueprint/modules/programs.md'), true);
  assert.equal(isReviewInput('docs/blueprint/modules/ticketing.md'), true);
  assert.equal(isReviewInput('docs/blueprint/modules/archive.md'), true);
  assert.equal(isReviewInput('scripts/creative-review.mjs'), true);
  assert.equal(isReviewInput('scripts/creative-review.test.mjs'), false);
  assert.equal(isReviewInput('src/styles/main.css'), false);
  assert.equal(isReviewInput('src/assets/poster.webp'), false);
  assert.equal(isReviewInput('docs/drafts/creative/idea.md'), false);
  assert.equal(isReviewInput('AGENTS.md'), false);
  assert.equal(isReviewInput('package.json'), false);
});

test('detects additions, modifications, and deletions in new text source directories', async (t) => {
  const cwd = await createRepository(t);
  await recordBaseline(cwd);

  const sourcePath = 'docs/sources/new-official/source.yaml';
  await write(cwd, sourcePath, 'id: S1\nclaim: added\n');
  const additionPlan = await createPlan({ cwd });
  assert.deepEqual(additionPlan.changes.added, [sourcePath]);
  const additionReport = makeReport(additionPlan, {
    scope: { paths: ['docs/sources/**'], reason: 'Reviewed the newly registered text source.' },
  });
  for (const axis of Object.values(additionReport.axes)) {
    axis.evidence = [{ path: sourcePath, line: 1, note: 'Reviewed the new source.' }];
  }
  await recordReport(cwd, additionReport, 'source-addition.json');

  await write(cwd, sourcePath, 'id: S1\nclaim: modified\n');
  const modificationPlan = await createPlan({ cwd });
  assert.deepEqual(modificationPlan.changes.modified, [sourcePath]);
  const modificationReport = makeReport(modificationPlan, {
    scope: { paths: [sourcePath], reason: 'Reviewed the modified source claim.' },
  });
  for (const axis of Object.values(modificationReport.axes)) {
    axis.evidence = [{ path: sourcePath, line: 2, note: 'Reviewed the revised claim.' }];
  }
  await recordReport(cwd, modificationReport, 'source-modification.json');

  await unlink(path.join(cwd, sourcePath));
  const deletionPlan = await createPlan({ cwd });
  assert.deepEqual(deletionPlan.changes.deleted, [sourcePath]);
  const deletionReport = makeReport(deletionPlan, {
    scope: { paths: ['docs/sources/**'], reason: 'Reviewed removal of the registered source.' },
  });
  for (const axis of Object.values(deletionReport.axes)) {
    axis.evidence = [{ path: sourcePath, line: 1, note: 'Reviewed the deleted source.' }];
  }
  await recordReport(cwd, deletionReport, 'source-deletion.json');
  assert.equal((await createPlan({ cwd })).status, 'unchanged');
});

test('records a complete report, then treats unchanged content and CSS-only edits as current', async (t) => {
  const cwd = await createRepository(t);
  const initial = await createPlan({ cwd });
  assert.equal(initial.status, 'review-required');
  assert.deepEqual(initial.changes.added, [
    'docs/research/terra-chronology/evidence.csv',
    'src/data/content.ts',
  ]);

  await recordBaseline(cwd);
  const unchanged = await createPlan({ cwd });
  assert.equal(unchanged.status, 'unchanged');
  assert.deepEqual(unchanged.changes, { added: [], modified: [], deleted: [] });

  await write(cwd, 'src/styles/main.css', 'body { color: rebeccapurple; }\n');
  await write(cwd, 'src/assets/new-image.bin', 'not an image, still outside scope\n');
  const cssOnly = await createPlan({ cwd });
  assert.equal(cssOnly.status, 'unchanged');
});

test('detects staged modifications, untracked additions, and tracked deletions without a HEAD diff', async (t) => {
  const cwd = await createRepository(t);
  await recordBaseline(cwd);

  await write(cwd, 'src/data/content.ts', "export const title = 'Changed';\n");
  git(cwd, 'add', 'src/data/content.ts');
  await write(cwd, 'src/components/NewClue.astro', '<p>New clue</p>\n');
  await unlink(path.join(cwd, 'docs/research/terra-chronology/evidence.csv'));

  const plan = await createPlan({ cwd });
  assert.equal(plan.status, 'review-required');
  assert.deepEqual(plan.changes.modified, ['src/data/content.ts']);
  assert.deepEqual(plan.changes.added, ['src/components/NewClue.astro']);
  assert.deepEqual(plan.changes.deleted, ['docs/research/terra-chronology/evidence.csv']);
});

test('ignores branch identity and detects committed changes relative to the review record', async (t) => {
  const cwd = await createRepository(t);
  await recordBaseline(cwd);
  git(cwd, 'checkout', '--quiet', '-b', 'content-change');
  assert.equal((await createPlan({ cwd })).status, 'unchanged');
  await write(cwd, 'src/data/content.ts', "export const title = 'Committed change';\n");
  git(cwd, 'add', 'src/data/content.ts');
  git(
    cwd,
    '-c',
    'user.name=Creative Review Test',
    '-c',
    'user.email=creative-review@example.invalid',
    'commit',
    '--quiet',
    '-m',
    'change content',
  );
  assert.doesNotMatch(git(cwd, 'status', '--short'), /src\/data\/content\.ts/);

  const plan = await createPlan({ cwd });
  assert.deepEqual(plan.changes.modified, ['src/data/content.ts']);
  assert.equal(plan.status, 'review-required');
});

test('detects evidence-only changes', async (t) => {
  const cwd = await createRepository(t);
  await recordBaseline(cwd);
  await write(cwd, 'docs/research/terra-chronology/evidence.csv', 'id,claim\nE1,revised\n');
  const plan = await createPlan({ cwd });
  assert.deepEqual(plan.changes.modified, ['docs/research/terra-chronology/evidence.csv']);
});

test('rejects a stale report after reviewed content changes', async (t) => {
  const cwd = await createRepository(t);
  const plan = await createPlan({ cwd });
  const reportPath = await saveReport(cwd, makeReport(plan));
  await write(cwd, 'src/data/content.ts', "export const title = 'Changed during review';\n");
  await assert.rejects(recordReview(reportPath, { cwd }), /stale review report/);
});

test('rejects empty or incomplete reports and accepts a documented no-creative-change classification', async (t) => {
  const cwd = await createRepository(t);
  const plan = await createPlan({ cwd });
  await assert.rejects(validateReport({}, plan, { cwd }), /schemaVersion/);

  const emptyAxes = makeReport(plan, { axes: {}, findings: [] });
  await assert.rejects(validateReport(emptyAxes, plan, { cwd }), /axes\.chronology/);

  const noReason = makeReport(plan, {
    classification: 'no-creative-change',
    scope: { paths: changedPaths(plan), reason: '' },
  });
  await assert.rejects(validateReport(noReason, plan, { cwd }), /scope\.reason/);

  const noCreativeChange = makeReport(plan, {
    classification: 'no-creative-change',
    summary: 'Only formatting changed; source meaning and generated snapshots are unchanged.',
    scope: {
      paths: changedPaths(plan),
      reason:
        'Compared the formatted files with the prior text and found no semantic token changes.',
    },
  });
  await assert.doesNotReject(validateReport(noCreativeChange, plan, { cwd }));
});

test('records blocking findings but keeps the default check blocked', async (t) => {
  const cwd = await createRepository(t);
  const plan = await createPlan({ cwd });
  const blockingReport = makeReport(plan, {
    summary: 'Review completed with one unresolved chronology conflict.',
    axes: {
      ...makeReport(plan).axes,
      chronology: {
        conclusion: 'pass-with-findings',
        evidence: [
          {
            path: 'docs/research/terra-chronology/evidence.csv',
            line: 2,
            note: 'The date claim conflicts with the proposed runtime wording.',
          },
        ],
      },
    },
    findings: [
      {
        path: 'src/data/content.ts',
        line: 1,
        level: 'blocking',
        judgment: 'The visible date is incompatible with the cited chronology evidence.',
        suggestion:
          'Revise the date or obtain a stronger source before treating this review as clear.',
      },
    ],
  });
  const reportPath = await saveReport(cwd, blockingReport);
  await recordReview(reportPath, { cwd });

  const recorded = JSON.parse(
    await readFile(path.join(cwd, 'docs/research/creative-content-review/current.json'), 'utf8'),
  );
  assert.equal(recorded.report.findings[0].level, 'blocking');
  const blockedPlan = await createPlan({ cwd });
  assert.equal(blockedPlan.status, 'blocked');
  assert.equal(blockedPlan.blockingFindings.length, 1);
  assert.equal(await runCli([], { cwd, stdout() {}, stderr() {} }), 1);

  const sameFingerprintClearance = makeReport(blockedPlan, {
    scope: {
      paths: ['src/data/content.ts'],
      reason: 'No covered content changed, so the blocking finding cannot be closed.',
    },
    findings: [],
  });
  const sameFingerprintPath = await saveReport(
    cwd,
    sameFingerprintClearance,
    'same-fingerprint-clearance.json',
  );
  await assert.rejects(
    recordReview(sameFingerprintPath, { cwd }),
    /omitted findings require resolutions/,
  );

  await write(cwd, 'docs/research/terra-chronology/evidence.csv', 'id,claim\nE1,unrelated\n');
  const unrelatedPlan = await createPlan({ cwd });
  const unrelatedClearance = makeReport(unrelatedPlan, {
    scope: {
      paths: ['docs/research/terra-chronology/**'],
      reason: 'Only an unrelated evidence file changed; the source finding remains untouched.',
    },
    findings: [],
  });
  const unrelatedPath = await saveReport(cwd, unrelatedClearance, 'unrelated-clearance.json');
  await assert.rejects(
    recordReview(unrelatedPath, { cwd }),
    /omitted findings require resolutions/,
  );
});

test('cross-file evidence resolves an old finding only through a valid explicit resolution', async (t) => {
  const cwd = await createRepository(t);
  const initialPlan = await createPlan({ cwd });
  const finding = {
    path: 'src/data/content.ts',
    line: 1,
    level: 'needs-research',
    judgment: 'The wording needs corroborating chronology evidence.',
    suggestion: 'Keep the finding until a registered source resolves it.',
  };
  await recordReport(cwd, makeReport(initialPlan, { findings: [finding] }), 'initial-finding.json');

  const evidencePath = 'docs/research/terra-chronology/evidence.csv';
  await write(cwd, evidencePath, 'id,claim\nE1,corroborated by a new source\n');
  const plan = await createPlan({ cwd });
  const resolution = {
    findingKey: getFindingKey(finding),
    reason: 'The newly registered chronology evidence directly corroborates the wording.',
    evidence: [
      {
        path: evidencePath,
        line: 2,
        note: 'This claim supplies the evidence that the old finding requested.',
      },
    ],
  };
  assert.equal(
    getFindingKey({ ...finding, suggestion: 'A revised suggestion does not change identity.' }),
    resolution.findingKey,
  );
  const resolvedReport = makeReport(plan, {
    findings: [],
    resolutions: [resolution],
    scope: {
      paths: ['docs/research/terra-chronology/**'],
      reason: 'Reviewed the new chronology evidence and its effect on the old finding.',
    },
  });

  const noCreativeChangeResolution = structuredClone(resolvedReport);
  noCreativeChangeResolution.classification = 'no-creative-change';
  await assert.rejects(
    recordReport(cwd, noCreativeChangeResolution, 'no-creative-change-resolution.json'),
    /resolutions require classification semantic-review/,
  );

  const emptyReason = structuredClone(resolvedReport);
  emptyReason.resolutions[0].reason = '';
  await assert.rejects(
    recordReport(cwd, emptyReason, 'empty-resolution-reason.json'),
    /reason must be non-empty/,
  );

  const badLocator = structuredClone(resolvedReport);
  badLocator.resolutions[0].evidence[0].path = 'docs/sources/missing/source.md';
  await assert.rejects(
    recordReport(cwd, badLocator, 'bad-resolution-locator.json'),
    /path does not exist/,
  );

  const unknownKey = structuredClone(resolvedReport);
  unknownKey.resolutions[0].findingKey = `sha256:${'0'.repeat(64)}`;
  await assert.rejects(
    recordReport(cwd, unknownKey, 'unknown-resolution-key.json'),
    /resolutions reference unknown finding keys/,
  );

  const recorded = await recordReport(cwd, resolvedReport, 'valid-resolution.json');
  assert.equal(recorded.report.resolutions[0].findingKey, getFindingKey(finding));
  const current = await createPlan({ cwd });
  assert.equal(current.status, 'unchanged');
  assert.equal(current.findingCounts.total, 0);
});

test('keeps prefix-scoped deleted evidence and findings locatable across later reviews', async (t) => {
  const cwd = await createRepository(t);
  const initialPlan = await createPlan({ cwd });
  const inheritedFinding = {
    path: 'src/data/content.ts',
    line: 1,
    level: 'needs-research',
    judgment: 'The wording depends on evidence that remains under review.',
    suggestion: 'Keep this finding attached while related evidence is unresolved.',
  };
  const initialReport = makeReport(initialPlan, {
    scope: {
      paths: ['src/data/**', 'docs/research/terra-chronology/**'],
      reason: 'The two directory scopes cover the complete initial review inputs.',
    },
    findings: [inheritedFinding],
  });
  const initialReportPath = await saveReport(cwd, initialReport);
  await recordReview(initialReportPath, { cwd });

  await unlink(path.join(cwd, 'src/data/content.ts'));
  const deletionPlan = await createPlan({ cwd });
  assert.deepEqual(deletionPlan.changes.deleted, ['src/data/content.ts']);
  const deletionReport = makeReport(deletionPlan, {
    scope: {
      paths: ['src/data/**'],
      reason: 'Reviewed removal of the runtime content file and its unresolved finding.',
    },
    findings: [inheritedFinding],
  });
  for (const axis of Object.values(deletionReport.axes)) {
    axis.evidence = [
      {
        path: 'src/data/content.ts',
        line: 1,
        note: 'Reviewed the deleted source through the prior manifest and current diff.',
      },
    ];
  }
  const deletionReportPath = await saveReport(cwd, deletionReport, 'deletion-review.json');
  const deletionRecord = await recordReview(deletionReportPath, { cwd });
  assert.deepEqual(deletionRecord.deletedPaths, ['src/data/content.ts']);
  const afterDeletion = await createPlan({ cwd });
  assert.equal(afterDeletion.status, 'unchanged');
  assert.deepEqual(afterDeletion.findingCounts, {
    blocking: 0,
    needsResearch: 1,
    advisory: 0,
    total: 1,
  });

  await write(cwd, 'docs/research/terra-chronology/evidence.csv', 'id,claim\nE1,revised\n');
  const unrelatedPlan = await createPlan({ cwd });
  const unrelatedReport = makeReport(unrelatedPlan, {
    classification: 'no-creative-change',
    summary: 'The evidence formatting change does not resolve the inherited source finding.',
    scope: {
      paths: ['docs/research/terra-chronology/**'],
      reason: 'Only the chronology evidence formatting changed; the old finding remains open.',
    },
    findings: [inheritedFinding],
  });
  for (const axis of Object.values(unrelatedReport.axes)) {
    axis.evidence = [
      {
        path: 'src/data/content.ts',
        line: 1,
        note: 'The inherited finding still points to the deleted, manifest-recorded source.',
      },
    ];
  }
  const unrelatedReportPath = await saveReport(cwd, unrelatedReport, 'unrelated-review.json');
  const unrelatedRecord = await recordReview(unrelatedReportPath, { cwd });
  assert.deepEqual(unrelatedRecord.deletedPaths, ['src/data/content.ts']);
  assert.equal((await createPlan({ cwd })).status, 'unchanged');
  const humanOutput = [];
  assert.equal(
    await runCli([], {
      cwd,
      stdout(value) {
        humanOutput.push(value);
      },
    }),
    0,
  );
  assert.match(
    humanOutput.join('\n'),
    /Record: docs\/research\/creative-content-review\/current\.json \(present\)/,
  );
  assert.match(
    humanOutput.join('\n'),
    /Current findings: 1; blocking 0, needs-research 1, advisory 0/,
  );
});

test('rejects direct edits that remove the stored report or desynchronize its manifest fingerprint', async (t) => {
  const cwd = await createRepository(t);
  await recordBaseline(cwd);
  const currentPath = path.join(cwd, 'docs/research/creative-content-review/current.json');
  const original = JSON.parse(await readFile(currentPath, 'utf8'));

  const withoutReport = { ...original };
  delete withoutReport.report;
  await writeFile(currentPath, `${JSON.stringify(withoutReport)}\n`, 'utf8');
  await assert.rejects(createPlan({ cwd }), /structured report/);

  const invalidManifest = structuredClone(original);
  invalidManifest.files[0].sha256 = `sha256:${'0'.repeat(64)}`;
  await writeFile(currentPath, `${JSON.stringify(invalidManifest)}\n`, 'utf8');
  await assert.rejects(createPlan({ cwd }), /fingerprint does not match its files manifest/);
});

test('whitespace and unrelated same-file changes cannot clear findings without resolutions', async (t) => {
  const cwd = await createRepository(t);
  const initialPlan = await createPlan({ cwd });
  const finding = {
    path: 'src/data/content.ts',
    line: 1,
    level: 'needs-research',
    judgment: 'The wording depends on a source that remains unresolved.',
    suggestion: 'Keep the wording in preview and revisit it when the source question is resolved.',
  };
  const initialReportPath = await saveReport(cwd, makeReport(initialPlan, { findings: [finding] }));
  await recordReview(initialReportPath, { cwd });

  await write(cwd, 'src/data/content.ts', "export const title = 'Crimson Troupe';\n\n");
  const changedPlan = await createPlan({ cwd });
  const omittedPath = await saveReport(
    cwd,
    makeReport(changedPlan, {
      classification: 'no-creative-change',
      summary: 'The edit is classified as mechanically equivalent.',
      scope: {
        paths: changedPaths(changedPlan),
        reason: 'The changed token does not alter the reviewed unresolved source question.',
      },
    }),
    'omitted.json',
  );
  await assert.rejects(recordReview(omittedPath, { cwd }), /omitted findings require resolutions/);

  await write(
    cwd,
    'src/data/content.ts',
    "export const title = 'Crimson Troupe';\nexport const unrelatedFlag = true;\n",
  );
  const unrelatedFieldPlan = await createPlan({ cwd });
  const unrelatedFieldPath = await saveReport(
    cwd,
    makeReport(unrelatedFieldPlan, {
      summary: 'An unrelated field changed without resolving the existing finding.',
      scope: {
        paths: changedPaths(unrelatedFieldPlan),
        reason: 'The extra field does not address the unresolved source question.',
      },
      findings: [],
    }),
    'unrelated-field.json',
  );
  await assert.rejects(
    recordReview(unrelatedFieldPath, { cwd }),
    /omitted findings require resolutions/,
  );

  const preservedPath = await saveReport(
    cwd,
    makeReport(unrelatedFieldPlan, {
      classification: 'semantic-review',
      summary: 'The unrelated field was reviewed and the existing finding remains open.',
      scope: {
        paths: changedPaths(unrelatedFieldPlan),
        reason: 'The new field does not alter the reviewed unresolved source question.',
      },
      findings: [finding],
    }),
    'preserved.json',
  );
  await assert.doesNotReject(recordReview(preservedPath, { cwd }));
  assert.equal((await createPlan({ cwd })).status, 'unchanged');
});

test('--plan --json emits machine JSON and exits zero while the default check exits one', async (t) => {
  const cwd = await createRepository(t);
  const output = [];
  const planExit = await runCli(['--plan', '--json'], {
    cwd,
    stdout(value) {
      output.push(value);
    },
    stderr() {},
  });
  assert.equal(planExit, 0);
  const plan = JSON.parse(output.join('\n'));
  assert.equal(plan.status, 'review-required');
  assert.ok(plan.changes.added.includes('src/data/content.ts'));
  assert.equal(await runCli([], { cwd, stdout() {}, stderr() {} }), 1);
  await assert.rejects(
    runCli(['unexpected'], { cwd, stdout() {}, stderr() {} }),
    /unknown argument: unexpected/,
  );
});

test('allows an explicit base with no record and rejects an unresolvable base ref', async (t) => {
  const cwd = await createRepository(t);
  const baseRef = git(cwd, 'rev-parse', 'HEAD');
  const plan = await createPlan({ cwd, baseRef });
  assert.equal(plan.status, 'review-required');
  assert.deepEqual(plan.base, { ref: baseRef, recordExists: false, fingerprint: null });

  await recordReport(cwd, makeReport(plan), 'first-baseline.json', { baseRef });
  assert.equal((await createPlan({ cwd, baseRef })).status, 'unchanged');

  process.env.CREATIVE_REVIEW_BASE_REF = baseRef;
  try {
    assert.equal((await createPlan({ cwd })).base.ref, baseRef);
  } finally {
    delete process.env.CREATIVE_REVIEW_BASE_REF;
  }

  const output = [];
  assert.equal(
    await runCli(['--plan', '--json', '--base-ref', baseRef], {
      cwd,
      stdout(value) {
        output.push(value);
      },
    }),
    0,
  );
  assert.equal(JSON.parse(output.join('\n')).base.ref, baseRef);
  await assert.rejects(
    createPlan({ cwd, baseRef: 'definitely-missing-ref' }),
    /cannot resolve creative review base ref/,
  );
});

test('blocks direct base finding deletion or downgrade and accepts an explicit resolution', async (t) => {
  const cwd = await createRepository(t);
  const initialPlan = await createPlan({ cwd });
  const finding = {
    path: 'docs/research/terra-chronology/evidence.csv',
    line: 2,
    level: 'needs-research',
    judgment: 'The date wording still needs a registered source.',
    suggestion: 'Keep the finding until the source question is resolved.',
  };
  await recordReport(cwd, makeReport(initialPlan, { findings: [finding] }), 'base-review.json');
  const baseRef = commitAll(cwd, 'record reviewed finding');
  const currentPath = path.join(cwd, 'docs/research/creative-content-review/current.json');
  const original = JSON.parse(await readFile(currentPath, 'utf8'));

  await unlink(currentPath);
  const removedRecordPlan = await createPlan({ cwd, baseRef });
  assert.equal(removedRecordPlan.status, 'blocked');
  assert.equal(removedRecordPlan.recordTransitionIssues[0].kind, 'missing-resolution');
  await writeFile(currentPath, `${JSON.stringify(original, null, 2)}\n`, 'utf8');

  const deleted = structuredClone(original);
  deleted.report.findings = [];
  await writeFile(currentPath, `${JSON.stringify(deleted, null, 2)}\n`, 'utf8');
  const deletedPlan = await createPlan({ cwd, baseRef });
  assert.equal(deletedPlan.status, 'blocked');
  assert.equal(deletedPlan.recordTransitionIssues[0].kind, 'missing-resolution');

  const downgraded = structuredClone(original);
  downgraded.report.findings[0].level = 'advisory';
  await writeFile(currentPath, `${JSON.stringify(downgraded, null, 2)}\n`, 'utf8');
  const downgradedPlan = await createPlan({ cwd, baseRef });
  assert.equal(downgradedPlan.status, 'blocked');
  assert.equal(downgradedPlan.recordTransitionIssues[0].kind, 'missing-resolution');

  const resolution = {
    findingKey: getFindingKey(finding),
    reason: 'A semantic reviewer explicitly accepted the lower-severity replacement.',
    evidence: [
      {
        path: 'src/data/content.ts',
        line: 1,
        note: 'The current wording was compared with the registered review context.',
      },
    ],
  };
  const repairReport = makeReport(downgradedPlan, {
    scope: {
      paths: ['src/data/content.ts'],
      reason: 'Reviewed the base finding and its explicit severity replacement.',
    },
    findings: downgraded.report.findings,
    resolutions: [resolution],
  });
  await recordReport(cwd, repairReport, 'repair-review.json', { baseRef });
  const repairedPlan = await createPlan({ cwd, baseRef });
  assert.equal(repairedPlan.status, 'unchanged');
  assert.deepEqual(repairedPlan.recordTransitionIssues, []);
});

test('keeps base finding closure explicit across multiple local incremental reviews', async (t) => {
  const cwd = await createRepository(t);
  const initialPlan = await createPlan({ cwd });
  const finding = {
    path: 'src/data/content.ts',
    line: 1,
    level: 'needs-research',
    judgment: 'The title wording needs source confirmation.',
    suggestion: 'Resolve the source question before closing this finding.',
  };
  await recordReport(cwd, makeReport(initialPlan, { findings: [finding] }), 'base-review.json');
  const baseRef = commitAll(cwd, 'record unresolved base finding');
  const resolution = {
    findingKey: getFindingKey(finding),
    reason: 'The revised runtime wording removes the unsupported claim.',
    evidence: [
      {
        path: 'src/data/content.ts',
        line: 1,
        note: 'The revised title no longer makes the disputed claim.',
      },
    ],
  };

  await write(cwd, 'src/data/content.ts', "export const title = 'Revised title';\n");
  const firstPlan = await createPlan({ cwd, baseRef });
  await recordReport(
    cwd,
    makeReport(firstPlan, { findings: [], resolutions: [resolution] }),
    'first-increment.json',
    { baseRef },
  );

  await write(cwd, 'docs/research/terra-chronology/evidence.csv', 'id,claim\nE1,revised\n');
  const secondPlan = await createPlan({ cwd, baseRef });
  const omittedResolution = makeReport(secondPlan, {
    scope: {
      paths: ['docs/research/terra-chronology/**'],
      reason: 'Reviewed the second incremental evidence change.',
    },
  });
  await assert.rejects(
    recordReport(cwd, omittedResolution, 'missing-restated-resolution.json', { baseRef }),
    /omitted findings require resolutions/,
  );

  const restatedResolution = makeReport(secondPlan, {
    scope: {
      paths: ['docs/research/terra-chronology/**'],
      reason: 'Reviewed the second increment while retaining the base finding closure.',
    },
    resolutions: [resolution],
  });
  await recordReport(cwd, restatedResolution, 'second-increment.json', { baseRef });
  assert.equal((await createPlan({ cwd, baseRef })).status, 'unchanged');
});

test('old external locators survive deletion while new locators still validate current line bounds', async (t) => {
  const cwd = await createRepository(t);
  const helperPath = 'scripts/review-context.mjs';
  await write(
    cwd,
    helperPath,
    'export const one = 1;\nexport const two = 2;\nexport const three = 3;\n',
  );
  const initialPlan = await createPlan({ cwd });
  const finding = {
    path: helperPath,
    line: 3,
    level: 'needs-research',
    judgment: 'This supporting tool documents an unresolved content assumption.',
    suggestion: 'Resolve the assumption before removing the supporting locator.',
  };
  const initialRecord = await recordReport(
    cwd,
    makeReport(initialPlan, { findings: [finding] }),
    'external-locator-review.json',
  );
  assert.ok(initialRecord.locatorPaths.includes(helperPath));
  const baseRef = commitAll(cwd, 'record external review locator');

  await write(cwd, helperPath, 'export const one = 1;\n');
  const shortenedPlan = await createPlan({ cwd, baseRef });
  assert.equal(shortenedPlan.status, 'unchanged');
  const invalidCurrentLocator = makeReport(shortenedPlan, {
    scope: {
      paths: ['src/data/content.ts'],
      reason: 'Attempt to preserve the finding after its file was shortened.',
    },
    findings: [finding],
  });
  await assert.rejects(
    recordReport(cwd, invalidCurrentLocator, 'invalid-current-locator.json', { baseRef }),
    /line exceeds/,
  );

  await unlink(path.join(cwd, helperPath));
  const deletionPlan = await createPlan({ cwd, baseRef });
  assert.equal(deletionPlan.status, 'unchanged');
  const resolved = makeReport(deletionPlan, {
    scope: {
      paths: ['src/data/content.ts'],
      reason: 'Reviewed and closed the finding whose external locator was removed.',
    },
    resolutions: [
      {
        findingKey: getFindingKey(finding),
        reason: 'The supporting assumption was retired with the external helper.',
        evidence: [
          {
            path: 'src/data/content.ts',
            line: 1,
            note: 'The retained runtime content no longer depends on that assumption.',
          },
        ],
      },
    ],
  });
  await recordReport(cwd, resolved, 'external-locator-resolution.json', { baseRef });
  assert.equal((await createPlan({ cwd, baseRef })).status, 'unchanged');
});

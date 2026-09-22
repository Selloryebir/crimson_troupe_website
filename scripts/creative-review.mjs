#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SCHEMA_VERSION = 1;
const DEFAULT_RECORD_PATH = 'docs/research/creative-content-review/current.json';
const REQUIRED_AXES = ['chronology', 'worldview', 'consistency', 'snapshots', 'localization'];
const CONCLUSIONS = new Set(['pass', 'pass-with-findings', 'not-applicable']);
const FINDING_LEVELS = new Set(['blocking', 'needs-research', 'advisory']);
const CLASSIFICATIONS = new Set(['semantic-review', 'no-creative-change']);
const SOURCE_TEXT_EXTENSIONS = new Set([
  '.csv',
  '.json',
  '.json5',
  '.md',
  '.mdx',
  '.toml',
  '.tsv',
  '.txt',
  '.xml',
  '.yaml',
  '.yml',
]);
const SCOPE_PREFIXES = [
  'src/data',
  'src/pages',
  'src/layouts',
  'src/components',
  'src/scripts',
  'docs/research/terra-chronology',
  'docs/sources/terra-chronology',
  'docs/research/terra-terminology',
  'docs/sources',
  'docs/sources/terra-terminology',
  'docs/blueprint/content',
  'docs/blueprint/i18n',
];
const EXACT_PATHS = new Set([
  'scripts/creative-review.mjs',
  'docs/blueprint/foundation/domain-language.md',
  'docs/blueprint/modules/archive.md',
  'docs/blueprint/modules/programs.md',
  'docs/blueprint/modules/terra-time.md',
  'docs/blueprint/modules/ticketing.md',
  'docs/project/temporal-context.md',
  'docs/project/performance-location-catalog.md',
  'docs/guides/temporal-content-review.md',
  'docs/guides/creative-content-review.md',
  'docs/research/terra-terminology/language-policy.md',
  'docs/sources/official-folio-productions.md',
]);

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeRepositoryPath(value, label = 'path') {
  if (!isNonEmptyString(value)) throw new Error(`${label} must be a non-empty string`);
  let normalized = value.replaceAll('\\', '/');
  while (normalized.startsWith('./')) normalized = normalized.slice(2);
  const segments = normalized.split('/');
  if (
    normalized.startsWith('/') ||
    /^[a-zA-Z]:\//.test(normalized) ||
    segments.some((segment) => segment === '' || segment === '.' || segment === '..') ||
    normalized.includes('\0')
  ) {
    throw new Error(`${label} must be a repository-relative path: ${value}`);
  }
  return normalized;
}

function resolveBaseRef(value) {
  const candidate = value === undefined ? process.env.CREATIVE_REVIEW_BASE_REF : value;
  if (candidate === undefined || candidate === null || candidate === '') return null;
  if (!isNonEmptyString(candidate)) throw new Error('baseRef must be a non-empty git revision');
  const normalized = candidate.trim();
  if (normalized.startsWith('-') || /[:\0\r\n]/u.test(normalized)) {
    throw new Error(`baseRef must be a safe git revision: ${candidate}`);
  }
  return normalized;
}

export function isReviewInput(inputPath) {
  const filePath = inputPath.replaceAll('\\', '/');
  if (EXACT_PATHS.has(filePath)) return true;
  if (/^src\/data\/.+\.ts$/.test(filePath)) return true;
  if (/^src\/(pages|layouts|components)\/.+\.astro$/.test(filePath)) return true;
  if (/^src\/scripts\/.+\.ts$/.test(filePath)) return true;
  if (/^docs\/research\/terra-chronology\/.+/.test(filePath)) return true;
  if (/^docs\/research\/terra-terminology\/.+\.(json|csv)$/.test(filePath)) return true;
  if (filePath.startsWith('docs/sources/')) {
    return SOURCE_TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase());
  }
  if (/^docs\/blueprint\/(content|i18n)\/.+\.md$/.test(filePath)) return true;
  return false;
}

export const isReviewablePath = isReviewInput;

function listCandidatePaths(cwd) {
  let output;
  try {
    output = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    const detail = error.stderr?.trim() || error.message;
    throw new Error(`cannot enumerate repository files: ${detail}`, { cause: error });
  }
  return [
    ...new Set(
      output
        .split('\0')
        .filter(Boolean)
        .map((entry) => entry.replaceAll('\\', '/')),
    ),
  ]
    .filter(isReviewInput)
    .sort((left, right) => left.localeCompare(right, 'en'));
}

async function buildManifest(cwd) {
  const files = [];
  for (const filePath of listCandidatePaths(cwd)) {
    let contents;
    try {
      contents = await readFile(path.join(cwd, filePath));
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }
    files.push({
      path: filePath,
      sha256: `sha256:${createHash('sha256').update(contents).digest('hex')}`,
      bytes: contents.length,
    });
  }
  return { files, fingerprint: fingerprintForFiles(files) };
}

function fingerprintForFiles(files) {
  const fingerprintHash = createHash('sha256');
  for (const file of [...files].sort((left, right) => left.path.localeCompare(right.path, 'en'))) {
    fingerprintHash.update(file.path);
    fingerprintHash.update('\0');
    fingerprintHash.update(file.sha256);
    fingerprintHash.update('\0');
  }
  return `sha256:${fingerprintHash.digest('hex')}`;
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

export function getFindingKey(finding) {
  const identity = canonicalJson({
    path: normalizeRepositoryPath(finding.path, 'finding.path'),
    line: finding.line ?? null,
    level: finding.level,
    judgment: finding.judgment,
  });
  return `sha256:${createHash('sha256').update(identity).digest('hex')}`;
}

function findingMap(records) {
  const findings = new Map();
  for (const record of records.filter(Boolean)) {
    for (const finding of record.report.findings) findings.set(getFindingKey(finding), finding);
  }
  return findings;
}

function findingTransitionIssues(priorRecords, candidateReport, { rejectUnknown = false } = {}) {
  const priorFindings = findingMap(priorRecords);
  const candidateFindingKeys = new Set(candidateReport.findings.map(getFindingKey));
  const resolutionKeys = new Set(
    candidateReport.resolutions.map((resolution) => resolution.findingKey),
  );
  const issues = [];
  for (const [findingKey, finding] of priorFindings) {
    const retained = candidateFindingKeys.has(findingKey);
    const resolved = resolutionKeys.has(findingKey);
    if (retained && resolved) {
      issues.push({
        kind: 'retained-resolution',
        findingKey,
        finding,
        message: `resolutions must reference omitted findings: ${findingKey}`,
      });
    } else if (!retained && !resolved) {
      issues.push({
        kind: 'missing-resolution',
        findingKey,
        finding,
        message: `omitted findings require resolutions: ${findingKey}`,
      });
    }
  }
  if (rejectUnknown) {
    const unknown = [...resolutionKeys].filter((findingKey) => !priorFindings.has(findingKey));
    if (unknown.length > 0) {
      issues.push({
        kind: 'unknown-resolution',
        findingKey: unknown[0],
        finding: null,
        message: `resolutions reference unknown finding keys: ${unknown.join(', ')}`,
      });
    }
  }
  return issues;
}

function reportLocatorPaths(report) {
  const paths = [];
  for (const axisName of REQUIRED_AXES) {
    for (const evidence of report.axes?.[axisName]?.evidence ?? []) {
      if (isNonEmptyString(evidence?.path)) paths.push(evidence.path);
    }
  }
  for (const finding of report.findings ?? []) {
    if (isNonEmptyString(finding?.path)) paths.push(finding.path);
  }
  for (const resolution of report.resolutions ?? []) {
    for (const evidence of resolution?.evidence ?? []) {
      if (isNonEmptyString(evidence?.path)) paths.push(evidence.path);
    }
  }
  return new Set(paths.map((entry) => normalizeRepositoryPath(entry, 'report locator path')));
}

function countFindings(findings = []) {
  const counts = { blocking: 0, needsResearch: 0, advisory: 0, total: findings.length };
  for (const finding of findings) {
    if (finding?.level === 'blocking') counts.blocking += 1;
    else if (finding?.level === 'needs-research') counts.needsResearch += 1;
    else if (finding?.level === 'advisory') counts.advisory += 1;
  }
  return counts;
}

async function validateStoredRecord(record, recordPath, cwd) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    throw new Error(`${recordPath} must contain a JSON object`);
  }
  if (record.schemaVersion !== SCHEMA_VERSION) {
    throw new Error(`${recordPath} has unsupported schemaVersion`);
  }
  if (!/^sha256:[a-f0-9]{64}$/.test(record.fingerprint ?? '')) {
    throw new Error(`${recordPath} has an invalid fingerprint`);
  }
  if (!Array.isArray(record.files)) throw new Error(`${recordPath} must contain files[]`);
  const seen = new Set();
  const normalizedFiles = [];
  for (const [index, file] of record.files.entries()) {
    const filePath = normalizeRepositoryPath(file?.path, `files[${index}].path`);
    if (!isReviewInput(filePath)) {
      throw new Error(`${recordPath} contains an out-of-scope file: ${filePath}`);
    }
    if (!/^sha256:[a-f0-9]{64}$/.test(file?.sha256 ?? '')) {
      throw new Error(`${recordPath} has an invalid hash for ${filePath}`);
    }
    if (seen.has(filePath)) throw new Error(`${recordPath} contains duplicate file ${filePath}`);
    seen.add(filePath);
    normalizedFiles.push({ path: filePath, sha256: file.sha256 });
  }
  if (record.deletedPaths !== undefined && !Array.isArray(record.deletedPaths)) {
    throw new Error(`${recordPath} deletedPaths must be an array when present`);
  }
  const deletedPaths = (record.deletedPaths ?? []).map((entry, index) => {
    const deletedPath = normalizeRepositoryPath(entry, `deletedPaths[${index}]`);
    if (!isReviewInput(deletedPath)) {
      throw new Error(`${recordPath} contains an out-of-scope deleted path: ${deletedPath}`);
    }
    if (seen.has(deletedPath)) {
      throw new Error(`${recordPath} lists a current manifest file as deleted: ${deletedPath}`);
    }
    return deletedPath;
  });
  if (new Set(deletedPaths).size !== deletedPaths.length) {
    throw new Error(`${recordPath} contains duplicate deletedPaths`);
  }
  const manifestFingerprint = fingerprintForFiles(normalizedFiles);
  if (manifestFingerprint !== record.fingerprint) {
    throw new Error(`${recordPath} fingerprint does not match its files manifest`);
  }
  if (!record.report || typeof record.report !== 'object' || Array.isArray(record.report)) {
    throw new Error(`${recordPath} must contain a structured report`);
  }
  if (record.report.fingerprint !== record.fingerprint) {
    throw new Error(`${recordPath} report fingerprint does not match the record fingerprint`);
  }
  const reportPaths = reportLocatorPaths(record.report);
  if (record.locatorPaths !== undefined && !Array.isArray(record.locatorPaths)) {
    throw new Error(`${recordPath} locatorPaths must be an array when present`);
  }
  const locatorPaths = (record.locatorPaths ?? [...reportPaths]).map((entry, index) =>
    normalizeRepositoryPath(entry, `locatorPaths[${index}]`),
  );
  if (new Set(locatorPaths).size !== locatorPaths.length) {
    throw new Error(`${recordPath} contains duplicate locatorPaths`);
  }
  const missingLocatorPaths = [...reportPaths].filter((entry) => !locatorPaths.includes(entry));
  if (missingLocatorPaths.length > 0) {
    throw new Error(`${recordPath} locatorPaths do not cover the current report`);
  }
  const unreferencedDeletedPaths = deletedPaths.filter((entry) => !reportPaths.has(entry));
  if (unreferencedDeletedPaths.length > 0) {
    throw new Error(
      `${recordPath} retains deletedPaths not referenced by the current report: ${unreferencedDeletedPaths.join(', ')}`,
    );
  }
  const historicalPaths = new Set([
    ...normalizedFiles.map((file) => file.path),
    ...deletedPaths,
    ...locatorPaths,
    ...(Array.isArray(record.report.scope?.paths)
      ? record.report.scope.paths
          .filter((entry) => typeof entry === 'string' && !entry.endsWith('/**'))
          .map((entry) => normalizeRepositoryPath(entry, 'report.scope.paths'))
      : []),
  ]);
  await validateReport(
    record.report,
    {
      fingerprint: record.fingerprint,
      changes: { added: [], modified: [], deleted: [] },
    },
    { cwd, historicalPaths, skipHistoricalLineValidation: true },
  );
  return { ...record, deletedPaths, locatorPaths };
}

async function readStoredRecord(cwd, recordPath) {
  try {
    const contents = await readFile(path.join(cwd, recordPath), 'utf8');
    return await validateStoredRecord(JSON.parse(contents), recordPath, cwd);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    if (error instanceof SyntaxError) {
      throw new Error(`${recordPath} is not valid JSON`, { cause: error });
    }
    throw error;
  }
}

async function readStoredRecordAtRef(cwd, baseRef, recordPath) {
  if (!baseRef) return null;
  try {
    execFileSync('git', ['rev-parse', '--verify', `${baseRef}^{commit}`], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    const detail = error.stderr?.trim() || error.message;
    throw new Error(`cannot resolve creative review base ref ${baseRef}: ${detail}`, {
      cause: error,
    });
  }
  let contents;
  try {
    contents = execFileSync('git', ['show', `${baseRef}:${recordPath}`], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    if (error.status === 128) return null;
    const detail = error.stderr?.trim() || error.message;
    throw new Error(`cannot read creative review record at ${baseRef}: ${detail}`, {
      cause: error,
    });
  }
  try {
    return await validateStoredRecord(JSON.parse(contents), `${baseRef}:${recordPath}`, cwd);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`${baseRef}:${recordPath} is not valid JSON`, { cause: error });
    }
    throw error;
  }
}

function compareManifests(currentFiles, recordedFiles = []) {
  const current = new Map(currentFiles.map((file) => [file.path, file.sha256]));
  const recorded = new Map(recordedFiles.map((file) => [file.path, file.sha256]));
  const added = [];
  const modified = [];
  const deleted = [];
  for (const [filePath, digest] of current) {
    if (!recorded.has(filePath)) added.push(filePath);
    else if (recorded.get(filePath) !== digest) modified.push(filePath);
  }
  for (const filePath of recorded.keys()) {
    if (!current.has(filePath)) deleted.push(filePath);
  }
  return { added, modified, deleted };
}

export async function createPlan({
  cwd = process.cwd(),
  recordPath = DEFAULT_RECORD_PATH,
  baseRef,
} = {}) {
  const normalizedRecordPath = normalizeRepositoryPath(recordPath, 'recordPath');
  const normalizedBaseRef = resolveBaseRef(baseRef);
  const [manifest, record, baseRecord] = await Promise.all([
    buildManifest(cwd),
    readStoredRecord(cwd, normalizedRecordPath),
    readStoredRecordAtRef(cwd, normalizedBaseRef, normalizedRecordPath),
  ]);
  const changes = compareManifests(manifest.files, record?.files);
  const hasChanges = Object.values(changes).some((entries) => entries.length > 0);
  const fingerprintMatches = record?.fingerprint === manifest.fingerprint;
  const blockingFindings =
    record?.report?.findings?.filter((finding) => finding?.level === 'blocking') ?? [];
  const findingCounts = countFindings(record?.report?.findings);
  const recordTransitionIssues = baseRecord
    ? findingTransitionIssues([baseRecord], record?.report ?? { findings: [], resolutions: [] })
    : [];
  const status =
    recordTransitionIssues.length > 0
      ? 'blocked'
      : !record || !fingerprintMatches || hasChanges
        ? 'review-required'
        : blockingFindings.length > 0
          ? 'blocked'
          : 'unchanged';
  return {
    schemaVersion: SCHEMA_VERSION,
    status,
    fingerprint: manifest.fingerprint,
    record: {
      path: normalizedRecordPath,
      exists: Boolean(record),
      fingerprint: record?.fingerprint ?? null,
    },
    base: {
      ref: normalizedBaseRef,
      recordExists: Boolean(baseRecord),
      fingerprint: baseRecord?.fingerprint ?? null,
    },
    fileCount: manifest.files.length,
    files: manifest.files,
    changes,
    blockingFindings,
    findingCounts,
    recordTransitionIssues,
  };
}

function scopeCoversPath(scopeEntry, changedPath) {
  if (scopeEntry.endsWith('/**')) {
    const prefix = scopeEntry.slice(0, -3).replace(/\/$/, '');
    return changedPath.startsWith(`${prefix}/`);
  }
  return scopeEntry === changedPath;
}

function validateScopeEntry(entry, index) {
  const normalized = normalizeRepositoryPath(entry, `scope.paths[${index}]`);
  if (normalized.endsWith('/**')) {
    const prefix = normalized.slice(0, -3).replace(/\/$/, '');
    if (!SCOPE_PREFIXES.includes(prefix)) {
      throw new Error(`scope.paths[${index}] uses an unsupported directory scope: ${normalized}`);
    }
    return `${prefix}/**`;
  }
  if (!isReviewInput(normalized)) {
    throw new Error(`scope.paths[${index}] is outside the creative review scope: ${normalized}`);
  }
  return normalized;
}

async function validateLocator(locator, label, context, { requireNote = true } = {}) {
  if (!locator || typeof locator !== 'object' || Array.isArray(locator)) {
    throw new Error(`${label} must be an object`);
  }
  const locatorPath = normalizeRepositoryPath(locator.path, `${label}.path`);
  if (requireNote && !isNonEmptyString(locator.note)) {
    throw new Error(`${label}.note must be non-empty`);
  }
  if (locator.line !== undefined && (!Number.isSafeInteger(locator.line) || locator.line < 1)) {
    throw new Error(`${label}.line must be a positive integer`);
  }
  const historicalPaths = new Set([
    ...context.plan.changes.deleted,
    ...(context.historicalPaths ?? []),
  ]);
  let fileStat;
  try {
    fileStat = await stat(path.join(context.cwd, locatorPath));
  } catch (error) {
    if (error.code === 'ENOENT') {
      if (!historicalPaths.has(locatorPath)) {
        throw new Error(`${label}.path does not exist: ${locatorPath}`, { cause: error });
      }
    } else {
      throw error;
    }
  }
  if (fileStat) {
    if (!fileStat.isFile()) throw new Error(`${label}.path is not a file: ${locatorPath}`);
    if (
      locator.line !== undefined &&
      !(context.skipHistoricalLineValidation && historicalPaths.has(locatorPath))
    ) {
      const contents = await readFile(path.join(context.cwd, locatorPath), 'utf8');
      const lineCount = contents.split(/\r?\n/).length;
      if (locator.line > lineCount) {
        throw new Error(`${label}.line exceeds ${locatorPath}'s ${lineCount} lines`);
      }
    }
  }
  return { ...locator, path: locatorPath };
}

export async function validateReport(
  report,
  plan,
  { cwd = process.cwd(), historicalPaths = new Set(), skipHistoricalLineValidation = false } = {},
) {
  if (!report || typeof report !== 'object' || Array.isArray(report)) {
    throw new Error('review report must be a JSON object');
  }
  if (report.schemaVersion !== SCHEMA_VERSION)
    throw new Error('review report schemaVersion must be 1');
  if (report.fingerprint !== plan.fingerprint) {
    throw new Error(
      `stale review report: expected ${plan.fingerprint}, received ${report.fingerprint}`,
    );
  }
  if (!CLASSIFICATIONS.has(report.classification)) {
    throw new Error('classification must be semantic-review or no-creative-change');
  }
  if (!isNonEmptyString(report.summary)) throw new Error('summary must be non-empty');
  if (!report.scope || typeof report.scope !== 'object' || Array.isArray(report.scope)) {
    throw new Error('scope must be an object');
  }
  if (!isNonEmptyString(report.scope.reason)) throw new Error('scope.reason must be non-empty');
  if (!Array.isArray(report.scope.paths) || report.scope.paths.length === 0) {
    throw new Error('scope.paths must be a non-empty array');
  }
  const scopePaths = report.scope.paths.map(validateScopeEntry);
  const changedPaths = [...plan.changes.added, ...plan.changes.modified, ...plan.changes.deleted];
  const uncovered = changedPaths.filter(
    (changedPath) => !scopePaths.some((scopePath) => scopeCoversPath(scopePath, changedPath)),
  );
  if (uncovered.length > 0) {
    throw new Error(`scope.paths does not cover changed paths: ${uncovered.join(', ')}`);
  }
  if (!report.axes || typeof report.axes !== 'object' || Array.isArray(report.axes)) {
    throw new Error('axes must be an object');
  }
  const axes = {};
  for (const axisName of REQUIRED_AXES) {
    const axis = report.axes[axisName];
    if (!axis || typeof axis !== 'object' || Array.isArray(axis)) {
      throw new Error(`axes.${axisName} must be an object`);
    }
    if (!CONCLUSIONS.has(axis.conclusion)) {
      throw new Error(`axes.${axisName}.conclusion is invalid`);
    }
    if (!Array.isArray(axis.evidence) || axis.evidence.length === 0) {
      throw new Error(`axes.${axisName}.evidence must be a non-empty array`);
    }
    axes[axisName] = {
      ...axis,
      evidence: await Promise.all(
        axis.evidence.map((entry, index) =>
          validateLocator(entry, `axes.${axisName}.evidence[${index}]`, {
            cwd,
            plan,
            historicalPaths,
            skipHistoricalLineValidation,
          }),
        ),
      ),
    };
  }
  if (!Array.isArray(report.findings)) throw new Error('findings must be an array');
  const findings = await Promise.all(
    report.findings.map(async (finding, index) => {
      if (!finding || typeof finding !== 'object' || Array.isArray(finding)) {
        throw new Error(`findings[${index}] must be an object`);
      }
      if (!FINDING_LEVELS.has(finding.level))
        throw new Error(`findings[${index}].level is invalid`);
      if (!isNonEmptyString(finding.judgment)) {
        throw new Error(`findings[${index}].judgment must be non-empty`);
      }
      if (!isNonEmptyString(finding.suggestion)) {
        throw new Error(`findings[${index}].suggestion must be non-empty`);
      }
      if (finding.note !== undefined && !isNonEmptyString(finding.note)) {
        throw new Error(`findings[${index}].note must be non-empty when present`);
      }
      const locator = await validateLocator(
        finding,
        `findings[${index}]`,
        { cwd, plan, historicalPaths, skipHistoricalLineValidation },
        { requireNote: false },
      );
      return { ...finding, path: locator.path };
    }),
  );
  const findingKeys = findings.map(getFindingKey);
  if (new Set(findingKeys).size !== findingKeys.length) {
    throw new Error('findings must not contain duplicate stable keys');
  }
  const resolutionsInput = report.resolutions ?? [];
  if (!Array.isArray(resolutionsInput))
    throw new Error('resolutions must be an array when present');
  if (resolutionsInput.length > 0 && report.classification !== 'semantic-review') {
    throw new Error('resolutions require classification semantic-review');
  }
  const resolutions = await Promise.all(
    resolutionsInput.map(async (resolution, index) => {
      if (!resolution || typeof resolution !== 'object' || Array.isArray(resolution)) {
        throw new Error(`resolutions[${index}] must be an object`);
      }
      if (!/^sha256:[a-f0-9]{64}$/.test(resolution.findingKey ?? '')) {
        throw new Error(`resolutions[${index}].findingKey is invalid`);
      }
      if (!isNonEmptyString(resolution.reason)) {
        throw new Error(`resolutions[${index}].reason must be non-empty`);
      }
      if (!Array.isArray(resolution.evidence) || resolution.evidence.length === 0) {
        throw new Error(`resolutions[${index}].evidence must be a non-empty array`);
      }
      return {
        findingKey: resolution.findingKey,
        reason: resolution.reason.trim(),
        evidence: await Promise.all(
          resolution.evidence.map((entry, evidenceIndex) =>
            validateLocator(entry, `resolutions[${index}].evidence[${evidenceIndex}]`, {
              cwd,
              plan,
              historicalPaths,
              skipHistoricalLineValidation,
            }),
          ),
        ),
      };
    }),
  );
  const resolutionKeys = resolutions.map((resolution) => resolution.findingKey);
  if (new Set(resolutionKeys).size !== resolutionKeys.length) {
    throw new Error('resolutions must not contain duplicate findingKey values');
  }
  return {
    schemaVersion: SCHEMA_VERSION,
    fingerprint: report.fingerprint,
    classification: report.classification,
    summary: report.summary.trim(),
    scope: { reason: report.scope.reason.trim(), paths: scopePaths },
    axes,
    findings,
    resolutions,
  };
}

export async function recordReview(
  reportPath,
  { cwd = process.cwd(), recordPath = DEFAULT_RECORD_PATH, baseRef } = {},
) {
  const normalizedBaseRef = resolveBaseRef(baseRef);
  const plan = await createPlan({ cwd, recordPath, baseRef: normalizedBaseRef });
  const normalizedRecordPath = normalizeRepositoryPath(recordPath, 'recordPath');
  const [previousRecord, baseRecord] = await Promise.all([
    readStoredRecord(cwd, normalizedRecordPath),
    readStoredRecordAtRef(cwd, normalizedBaseRef, normalizedRecordPath),
  ]);
  let report;
  try {
    report = JSON.parse(await readFile(path.resolve(cwd, reportPath), 'utf8'));
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`${reportPath} is not valid JSON`, { cause: error });
    }
    throw error;
  }
  const historicalPaths = new Set([
    ...(previousRecord?.deletedPaths ?? []),
    ...(previousRecord?.locatorPaths ?? []),
    ...(baseRecord?.deletedPaths ?? []),
    ...(baseRecord?.locatorPaths ?? []),
  ]);
  const validatedReport = await validateReport(report, plan, {
    cwd,
    historicalPaths,
  });
  const priorRecords = [previousRecord, baseRecord].filter(Boolean);
  if (priorRecords.length === 0 && validatedReport.resolutions.length > 0) {
    throw new Error('resolutions require an existing current review record');
  }
  const transitionIssues = findingTransitionIssues(priorRecords, validatedReport, {
    rejectUnknown: true,
  });
  for (const kind of ['unknown-resolution', 'retained-resolution', 'missing-resolution']) {
    const messages = transitionIssues
      .filter((issue) => issue.kind === kind)
      .map((issue) => issue.findingKey);
    if (messages.length > 0) {
      const prefix =
        kind === 'unknown-resolution'
          ? 'resolutions reference unknown finding keys'
          : kind === 'retained-resolution'
            ? 'resolutions must reference omitted findings'
            : 'omitted findings require resolutions';
      throw new Error(`${prefix}: ${messages.join(', ')}`);
    }
  }
  const freshPlan = await createPlan({ cwd, recordPath, baseRef: normalizedBaseRef });
  if (freshPlan.fingerprint !== validatedReport.fingerprint) {
    throw new Error(
      'reviewed content changed while recording; generate a new plan and review again',
    );
  }
  const currentPaths = new Set(freshPlan.files.map((file) => file.path));
  const locatorPaths = reportLocatorPaths(validatedReport);
  const previousDeletedPaths = new Set(previousRecord?.deletedPaths ?? []);
  const baseDeletedPaths = new Set(baseRecord?.deletedPaths ?? []);
  const deletedPaths = [...locatorPaths]
    .filter(
      (filePath) =>
        !currentPaths.has(filePath) &&
        isReviewInput(filePath) &&
        (previousDeletedPaths.has(filePath) ||
          baseDeletedPaths.has(filePath) ||
          freshPlan.changes.deleted.includes(filePath)),
    )
    .sort((left, right) => left.localeCompare(right, 'en'));
  const output = {
    schemaVersion: SCHEMA_VERSION,
    fingerprint: freshPlan.fingerprint,
    recordedAt: new Date().toISOString(),
    files: freshPlan.files.map(({ path: filePath, sha256 }) => ({ path: filePath, sha256 })),
    ...(deletedPaths.length > 0 ? { deletedPaths } : {}),
    locatorPaths: [...locatorPaths].sort((left, right) => left.localeCompare(right, 'en')),
    report: validatedReport,
  };
  const absoluteRecordPath = path.join(cwd, normalizedRecordPath);
  await mkdir(path.dirname(absoluteRecordPath), { recursive: true });
  const temporaryPath = `${absoluteRecordPath}.tmp-${process.pid}-${Date.now()}`;
  await writeFile(temporaryPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  await rename(temporaryPath, absoluteRecordPath);
  return output;
}

function formatHumanPlan(plan) {
  const counts = Object.fromEntries(
    Object.entries(plan.changes).map(([key, entries]) => [key, entries.length]),
  );
  const lines = [
    `Creative review: ${plan.status}`,
    `Fingerprint: ${plan.fingerprint}`,
    `Record: ${plan.record.path} (${plan.record.exists ? 'present' : 'missing'})`,
    ...(plan.base.ref
      ? [`Base record: ${plan.base.ref} (${plan.base.recordExists ? 'present' : 'missing'})`]
      : []),
    `Files: ${plan.fileCount}; added ${counts.added}, modified ${counts.modified}, deleted ${counts.deleted}`,
    `Current findings: ${plan.findingCounts.total}; blocking ${plan.findingCounts.blocking}, needs-research ${plan.findingCounts.needsResearch}, advisory ${plan.findingCounts.advisory}`,
  ];
  for (const [kind, entries] of Object.entries(plan.changes)) {
    for (const filePath of entries) lines.push(`  ${kind}: ${filePath}`);
  }
  if (plan.status === 'review-required') {
    lines.push(
      'A structured semantic review report is required before recording this fingerprint.',
    );
  } else if (plan.status === 'blocked') {
    if (plan.recordTransitionIssues.length > 0) {
      lines.push('The current review record drops or changes base findings without resolutions:');
      for (const issue of plan.recordTransitionIssues) lines.push(`  ${issue.message}`);
    }
    if (plan.blockingFindings.length > 0) {
      lines.push('The current review contains blocking findings:');
      for (const finding of plan.blockingFindings) {
        const location = finding.line ? `${finding.path}:${finding.line}` : finding.path;
        lines.push(`  blocking: ${location} — ${finding.judgment}`);
      }
    }
  } else {
    lines.push('No covered content changed since the recorded review.');
  }
  return lines.join('\n');
}

function helpText() {
  return `Usage:
  node scripts/creative-review.mjs
  node scripts/creative-review.mjs --plan [--json] [--base-ref <git-revision>]
  node scripts/creative-review.mjs --record <review-report.json> [--base-ref <git-revision>]
  node scripts/creative-review.mjs --help

The default command compares covered repository content with
${DEFAULT_RECORD_PATH}. It exits 1 when semantic review is required.
--plan always exits 0; --json emits only machine-readable JSON.
--record validates all five review axes and the plan fingerprint, then replaces
the single current review cache. A recorded review is not content approval.
--base-ref compares finding transitions with the stored record at a Git revision.
CREATIVE_REVIEW_BASE_REF supplies the same optional revision when the flag is absent.

Report JSON:
  schemaVersion: 1
  fingerprint: the exact fingerprint from --plan --json
  classification: semantic-review | no-creative-change
  summary: non-empty review summary
  scope: { paths: [changed paths or supported /** scopes], reason: non-empty }
  axes: chronology, worldview, consistency, snapshots, localization; each has
        { conclusion: pass | pass-with-findings | not-applicable,
          evidence: [{ path, optional line, note }] }
  findings: [{ path, optional line,
               level: blocking | needs-research | advisory,
               judgment, suggestion }]
  resolutions: [{ findingKey: getFindingKey(previousFinding), reason,
                  evidence: [{ path, optional line, note }] }]

Existing findings are inherited by default. Omitting one requires exactly one
resolution for its exported getFindingKey() value, with a reason and locatable
evidence. Reports containing resolutions must use semantic-review classification.
Recording a review proves review completion, not content approval.`;
}

export async function runCli(args, { cwd = process.cwd(), stdout = console.log } = {}) {
  const hasHelp = args.includes('--help') || args.includes('-h');
  if (hasHelp) {
    stdout(helpText());
    return 0;
  }
  const json = args.includes('--json');
  const planOnly = args.includes('--plan');
  const recordIndex = args.indexOf('--record');
  const recordValueIndex = recordIndex >= 0 ? recordIndex + 1 : -1;
  const baseRefIndexes = args.flatMap((arg, index) => (arg === '--base-ref' ? [index] : []));
  if (baseRefIndexes.length > 1) throw new Error('--base-ref may only be specified once');
  const baseRefIndex = baseRefIndexes[0] ?? -1;
  const baseRefValueIndex = baseRefIndex >= 0 ? baseRefIndex + 1 : -1;
  const baseRef = baseRefIndex >= 0 ? args[baseRefValueIndex] : undefined;
  if (baseRefIndex >= 0 && (!baseRef || baseRef.startsWith('--'))) {
    throw new Error('--base-ref requires a git revision');
  }
  const known = new Set(['--json', '--plan', '--record', '--base-ref']);
  const positional = args.filter(
    (arg, index) => !known.has(arg) && index !== recordValueIndex && index !== baseRefValueIndex,
  );
  if (positional.length > 0) throw new Error(`unknown argument: ${positional[0]}`);
  if (recordIndex >= 0) {
    const reportPath = args[recordIndex + 1];
    if (!reportPath || reportPath.startsWith('--'))
      throw new Error('--record requires a JSON report path');
    if (planOnly || json) throw new Error('--record cannot be combined with --plan or --json');
    const recorded = await recordReview(reportPath, { cwd, baseRef });
    stdout(
      `Recorded creative review for ${recorded.fingerprint}. This records review completion, not content approval.`,
    );
    return 0;
  }
  const plan = await createPlan({ cwd, baseRef });
  stdout(json ? JSON.stringify(plan, null, 2) : formatHumanPlan(plan));
  if (planOnly) return 0;
  return plan.status === 'unchanged' ? 0 : 1;
}

const isEntrypoint =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isEntrypoint) {
  try {
    process.exitCode = await runCli(process.argv.slice(2));
  } catch (error) {
    console.error(`creative-review: ${error.message}`);
    process.exitCode = 2;
  }
}

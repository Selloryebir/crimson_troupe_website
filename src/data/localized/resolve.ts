import type { BuiltEdition } from '../editions';
import {
  createLocalizationSourceRevision,
  localizationSourceRevisions,
  type LocalizationSourceRevisionRegistry,
} from '../content/localization-revisions.ts';
import {
  buildSnapshot,
  type ContentSnapshot,
  type SnapshotPerformance,
} from '../content/resolve.ts';
import type { LocationId } from '../locations.ts';
import type {
  Performance,
  PerformanceCollection,
  PerformanceId,
  TicketZone,
} from '../performances.ts';
import type { Production, ProductionId } from '../productions/index.ts';
import type { SiteWorld } from '../site-routes';
import type {
  ArchiveProjectionContent,
  LocalizedRecord,
  LocationContent,
  PerformanceContent,
  ProductionContent,
} from './schema';
import { formatTerraDateTime } from './format.ts';
import { sourceLocalizationPackage, type PartialLocalizationPackage } from './packages.ts';
import type { WebsiteLocalizationPackage } from './yan/index.ts';

export interface ResolvedProgramContent {
  locations: Readonly<Partial<Record<LocationId, LocationContent>>>;
  performances: Readonly<Partial<Record<PerformanceId, PerformanceContent>>>;
  productions: Readonly<Partial<Record<ProductionId, ProductionContent>>>;
  ticketZones: Readonly<Record<TicketZone, string>>;
}

export interface ResolvedLocalization {
  edition: BuiltEdition;
  site: WebsiteLocalizationPackage['site'];
  programs: ResolvedProgramContent;
  messages: WebsiteLocalizationPackage['messages'];
  archiveProjection: ArchiveProjectionContent;
  sources: {
    site: LocalizedRecord<WebsiteLocalizationPackage['site']>;
    programs: LocalizedRecord<ResolvedProgramContent>;
    messages: LocalizedRecord<WebsiteLocalizationPackage['messages']>;
    archiveProjection: LocalizedRecord<ArchiveProjectionContent>;
  };
}

export interface LocalizationDiagnosticEntry {
  path: string;
  value: unknown;
  sourceLocale: string;
  usedFallback: boolean;
  reason?: 'missing' | 'stale';
}

export interface LocalizationDiagnostic {
  editionId: BuiltEdition['editionId'];
  deployable: false;
  entries: readonly LocalizationDiagnosticEntry[];
}

export interface ResolvedProduction extends Omit<Production, 'productionId'>, ProductionContent {
  productionId: ProductionId;
}

export interface ResolvedPerformance
  extends Omit<SnapshotPerformance, 'effectiveDateTime'>, PerformanceContent {
  cityLabel: string;
  dateTime: Performance['effectiveDateTime'] & { display: string };
  previousDateTimeDisplay?: string;
  place: string;
}

interface LocalizationRequirement {
  path: string;
  sourceValue: unknown;
  targetValue: unknown;
}

const resolvedLocalizationCache = new WeakMap<
  ContentSnapshot,
  Map<BuiltEdition['editionId'], ResolvedLocalization>
>();

function objectRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function isCompleteRecord(value: unknown): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0 && value.every(isCompleteRecord);
  }
  if (value && typeof value === 'object') {
    const entries = Object.values(value);
    return entries.length > 0 && entries.every(isCompleteRecord);
  }
  return value !== undefined && value !== null;
}

function localizationRequirements(
  source: PartialLocalizationPackage,
  target: PartialLocalizationPackage | undefined,
  snapshot: ContentSnapshot,
): LocalizationRequirement[] {
  const sourceSite = objectRecord(source.site);
  const targetSite = objectRecord(target?.site);
  const sourceMessages = objectRecord(source.messages);
  const targetMessages = objectRecord(target?.messages);
  const requirements: LocalizationRequirement[] = [
    ...Object.keys(sourceSite).map((recordId) => ({
      path: `site.${recordId}`,
      sourceValue: sourceSite[recordId],
      targetValue: targetSite[recordId],
    })),
    ...Object.keys(sourceMessages).map((recordId) => ({
      path: `messages.${recordId}`,
      sourceValue: sourceMessages[recordId],
      targetValue: targetMessages[recordId],
    })),
    {
      path: 'archiveProjection',
      sourceValue: source.archiveProjection,
      targetValue: target?.archiveProjection,
    },
  ];
  for (const [locationId] of snapshot.locationEntries) {
    requirements.push({
      path: `locations.${locationId}`,
      sourceValue: source.programs?.locations?.[locationId],
      targetValue: target?.programs?.locations?.[locationId],
    });
  }
  for (const [performanceId] of snapshot.performanceEntries) {
    requirements.push({
      path: `performances.${performanceId}`,
      sourceValue: source.programs?.performances?.[performanceId],
      targetValue: target?.programs?.performances?.[performanceId],
    });
  }
  for (const [productionId] of snapshot.productionEntries) {
    requirements.push({
      path: `productions.${productionId}`,
      sourceValue: source.programs?.productions?.[productionId],
      targetValue: target?.programs?.productions?.[productionId],
    });
  }
  requirements.push({
    path: 'ticketZones',
    sourceValue: source.programs?.ticketZones,
    targetValue: target?.programs?.ticketZones,
  });
  return requirements;
}

export function diagnoseLocalization(
  edition: BuiltEdition,
  snapshot: ContentSnapshot = buildSnapshot,
  packages: ContentSnapshot['localizationPackages'] = snapshot.localizationPackages,
  expectedRevisions: LocalizationSourceRevisionRegistry = localizationSourceRevisions,
): LocalizationDiagnostic {
  const source = packages.yan ?? sourceLocalizationPackage;
  const target = packages[edition.editionId];
  const currentRevisions = createLocalizationSourceRevision(source, snapshot);
  const expected = expectedRevisions[edition.editionId];
  const entries = localizationRequirements(source, target, snapshot).map((requirement) => {
    const missing = !isCompleteRecord(requirement.targetValue);
    const stale =
      edition.editionId !== 'yan' &&
      !missing &&
      expected?.[requirement.path] !== currentRevisions[requirement.path];
    const usedFallback = missing || stale;
    return {
      path: requirement.path,
      value: usedFallback ? requirement.sourceValue : requirement.targetValue,
      sourceLocale: usedFallback ? 'zh-CN' : edition.locale,
      usedFallback,
      reason: missing ? ('missing' as const) : stale ? ('stale' as const) : undefined,
    };
  });
  return Object.freeze({
    editionId: edition.editionId,
    deployable: false,
    entries: Object.freeze(entries),
  });
}

function scopedRecord<K extends string, V>(
  entries: readonly (readonly [K, unknown])[],
  records: Partial<Record<K, V>> | undefined,
): Readonly<Partial<Record<K, V>>> {
  return Object.freeze(
    Object.fromEntries(entries.map(([recordId]) => [recordId, records?.[recordId]])),
  ) as Readonly<Partial<Record<K, V>>>;
}

export function getLocalization(
  edition: BuiltEdition,
  snapshot: ContentSnapshot = buildSnapshot,
): ResolvedLocalization {
  const cached = resolvedLocalizationCache.get(snapshot)?.get(edition.editionId);
  if (cached) {
    return cached;
  }
  const target = snapshot.localizationPackages[edition.editionId];
  if (!target) {
    throw new Error(`国家版本 ${edition.editionId} 不属于当前内容快照。`);
  }
  const diagnostic = diagnoseLocalization(edition, snapshot);
  const invalid = diagnostic.entries.filter((entry) => entry.usedFallback);
  if (invalid.length > 0) {
    throw new Error(
      `国家版本 ${edition.editionId} 严格本地化失败：${invalid
        .map((entry) => `${entry.path}（${entry.reason === 'stale' ? '旧译' : '缺失'}）`)
        .join('、')}`,
    );
  }

  const site = target.site as WebsiteLocalizationPackage['site'];
  const messages = target.messages as WebsiteLocalizationPackage['messages'];
  const archiveProjection = target.archiveProjection as ArchiveProjectionContent;
  const programs: ResolvedProgramContent = Object.freeze({
    locations: scopedRecord(snapshot.locationEntries, target.programs?.locations),
    performances: scopedRecord(snapshot.performanceEntries, target.programs?.performances),
    productions: scopedRecord(snapshot.productionEntries, target.programs?.productions),
    ticketZones: Object.freeze(target.programs?.ticketZones) as Readonly<
      Record<TicketZone, string>
    >,
  });
  const strictRecord = <T>(value: T): LocalizedRecord<T> =>
    Object.freeze({
      value,
      sourceLocale: edition.locale,
      usedFallback: false,
    });
  const resolved = Object.freeze({
    edition,
    site,
    programs,
    messages,
    archiveProjection,
    sources: Object.freeze({
      site: strictRecord(site),
      programs: strictRecord(programs),
      messages: strictRecord(messages),
      archiveProjection: strictRecord(archiveProjection),
    }),
  });
  const snapshotCache =
    resolvedLocalizationCache.get(snapshot) ??
    new Map<BuiltEdition['editionId'], ResolvedLocalization>();
  snapshotCache.set(edition.editionId, resolved);
  resolvedLocalizationCache.set(snapshot, snapshotCache);
  return resolved;
}

export function getLocalizedProduction(
  localization: ResolvedLocalization,
  productionId: ProductionId,
  snapshot: ContentSnapshot = buildSnapshot,
): ResolvedProduction {
  const production = snapshot.productions[productionId];
  if (!production) {
    throw new Error(`剧目 ${productionId} 不属于当前内容快照。`);
  }
  const content = localization.programs.productions[productionId];
  if (!content) {
    throw new Error(`剧目 ${productionId} 缺少严格本地化内容。`);
  }
  return { ...production, productionId, ...content };
}

export function getLocalizedProductionEntries(
  localization: ResolvedLocalization,
  snapshot: ContentSnapshot = buildSnapshot,
): Array<[ProductionId, ResolvedProduction]> {
  return snapshot.productionEntries.map(([productionId]) => [
    productionId,
    getLocalizedProduction(localization, productionId, snapshot),
  ]);
}

export function getLocalizedPerformance(
  localization: ResolvedLocalization,
  performanceId: PerformanceId,
  snapshot: ContentSnapshot = buildSnapshot,
): ResolvedPerformance {
  const performance = snapshot.performances[performanceId];
  if (!performance) {
    throw new Error(`场次 ${performanceId} 不属于当前内容快照。`);
  }
  const content = localization.programs.performances[performanceId];
  assertPerformanceContentFresh(performanceId, performance, content);
  const location = localization.programs.locations[performance.locationId];
  if (!location) {
    throw new Error(`地点 ${performance.locationId} 缺少严格本地化内容。`);
  }
  return {
    ...performance,
    ...content,
    cityLabel: location.cityLabel,
    dateTime: {
      ...performance.effectiveDateTime,
      display: formatTerraDateTime(performance.effectiveDateTime, localization.edition.locale),
    },
    previousDateTimeDisplay: performance.previousDateTime
      ? formatTerraDateTime(performance.previousDateTime, localization.edition.locale)
      : undefined,
    place: content.venue,
  };
}

export function assertPerformanceContentFresh(
  performanceId: string,
  performance: Performance,
  content: PerformanceContent | undefined,
): asserts content is PerformanceContent {
  if (!content) {
    throw new Error(`场次 ${performanceId} 缺少本地化内容。`);
  }
  if (!performance.notice) {
    return;
  }
  if (!content.operationalNotice?.text.trim()) {
    throw new Error(`场次 ${performanceId} 缺少运营公告译文。`);
  }
  if (content.operationalNotice.sourceRevision !== performance.notice.sourceRevision) {
    throw new Error(`场次 ${performanceId} 的运营公告译文已过期。`);
  }
}

export function getLocalizedPerformanceEntries(
  localization: ResolvedLocalization,
  snapshot: ContentSnapshot = buildSnapshot,
): Array<[PerformanceId, ResolvedPerformance]> {
  return snapshot.performanceEntries.map(([performanceId]) => [
    performanceId,
    getLocalizedPerformance(localization, performanceId, snapshot),
  ]);
}

export function getLocalizedPerformances(
  localization: ResolvedLocalization,
  world: SiteWorld,
  collection: PerformanceCollection,
  snapshot: ContentSnapshot = buildSnapshot,
): ResolvedPerformance[] {
  return getLocalizedPerformanceEntries(localization, snapshot)
    .map(([, performance]) => performance)
    .filter((performance) => performance.world === world && performance.collection === collection);
}

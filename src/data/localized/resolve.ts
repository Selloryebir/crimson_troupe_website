import type { BuildEditionId, BuiltEdition } from '../editions';
import {
  buildSnapshot,
  type ContentSnapshot,
  type SnapshotPerformance,
} from '../content/resolve.ts';
import type { Performance, PerformanceCollection, PerformanceId } from '../performances.ts';
import type { Production, ProductionId } from '../productions/index.ts';
import type { SiteWorld } from '../site-routes';
import type { LocalizedRecord, PerformanceContent, ProductionContent } from './schema';
import { columbiaLocalizationPackage } from './columbia/index.ts';
import { higashiLocalizationPackage } from './higashi/index.ts';
import { yanLocalizationPackage, type WebsiteLocalizationPackage } from './yan/index.ts';

export interface ResolvedLocalization extends WebsiteLocalizationPackage {
  edition: BuiltEdition;
  sources: {
    site: LocalizedRecord<WebsiteLocalizationPackage['site']>;
    programs: LocalizedRecord<WebsiteLocalizationPackage['programs']>;
    messages: LocalizedRecord<WebsiteLocalizationPackage['messages']>;
    archiveProjection: LocalizedRecord<WebsiteLocalizationPackage['archiveProjection']>;
  };
}

export interface ResolvedProduction extends Omit<Production, 'productionId'>, ProductionContent {
  productionId: ProductionId;
}

export interface ResolvedPerformance
  extends Omit<SnapshotPerformance, 'effectiveDateTime'>, PerformanceContent {
  cityLabel: string;
  dateTime: Performance['effectiveDateTime'] & { display: string };
  place: string;
}

type PartialLocalizationPackage = Partial<WebsiteLocalizationPackage>;

const sourcePackage = yanLocalizationPackage;

const localePackages: Record<BuildEditionId, PartialLocalizationPackage> = {
  yan: yanLocalizationPackage,
  higashi: higashiLocalizationPackage,
  columbia: columbiaLocalizationPackage,
};

export function resolveLocalizedRecord<T>(
  target: T | undefined,
  source: T,
  targetLocale: string,
): LocalizedRecord<T> {
  return target === undefined
    ? { value: source, sourceLocale: 'zh-CN', usedFallback: true }
    : { value: target, sourceLocale: targetLocale, usedFallback: false };
}

export function getLocalization(edition: BuiltEdition): ResolvedLocalization {
  const target = localePackages[edition.editionId];
  const site = resolveLocalizedRecord(target?.site, sourcePackage.site, edition.locale);
  const programs = resolveLocalizedRecord(target?.programs, sourcePackage.programs, edition.locale);
  const messages = resolveLocalizedRecord(target?.messages, sourcePackage.messages, edition.locale);
  const archiveProjection = resolveLocalizedRecord(
    target?.archiveProjection,
    sourcePackage.archiveProjection,
    edition.locale,
  );
  return {
    edition,
    site: site.value,
    programs: programs.value,
    messages: messages.value,
    archiveProjection: archiveProjection.value,
    sources: { site, programs, messages, archiveProjection },
  };
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
  return {
    ...production,
    productionId,
    ...localization.programs.productions[productionId],
  };
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
  return {
    ...performance,
    ...content,
    cityLabel: localization.programs.locations[performance.locationId].cityLabel,
    dateTime: { ...performance.effectiveDateTime, display: content.dateTimeDisplay },
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
  if (performance.previousDateTime && !content.previousDateTimeDisplay?.trim()) {
    throw new Error(`场次 ${performanceId} 缺少原定排期译文。`);
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

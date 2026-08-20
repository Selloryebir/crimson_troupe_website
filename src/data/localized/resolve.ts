import type { BuildEditionId, BuiltEdition } from '../editions';
import {
  performanceEntries,
  performances,
  type Performance,
  type PerformanceCollection,
  type PerformanceId,
} from '../performances.ts';
import {
  productionEntries,
  productions,
  type Production,
  type ProductionId,
} from '../productions/index.ts';
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
  };
}

export interface ResolvedProduction extends Production, ProductionContent {}

export interface ResolvedPerformance extends Omit<Performance, 'dateTime'>, PerformanceContent {
  cityLabel: string;
  dateTime: Performance['dateTime'] & { display: string };
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
  return {
    edition,
    site: site.value,
    programs: programs.value,
    messages: messages.value,
    sources: { site, programs, messages },
  };
}

export function getLocalizedProduction(
  localization: ResolvedLocalization,
  productionId: ProductionId,
): ResolvedProduction {
  return { ...productions[productionId], ...localization.programs.productions[productionId] };
}

export function getLocalizedProductionEntries(
  localization: ResolvedLocalization,
): Array<[ProductionId, ResolvedProduction]> {
  return productionEntries.map(([productionId]) => [
    productionId,
    getLocalizedProduction(localization, productionId),
  ]);
}

export function getLocalizedPerformance(
  localization: ResolvedLocalization,
  performanceId: PerformanceId,
): ResolvedPerformance {
  const performance = performances[performanceId];
  const content = localization.programs.performances[performanceId];
  return {
    ...performance,
    ...content,
    cityLabel: localization.programs.locations[performance.locationId].cityLabel,
    dateTime: { ...performance.dateTime, display: content.dateTimeDisplay },
    place: content.venue,
  };
}

export function getLocalizedPerformanceEntries(
  localization: ResolvedLocalization,
): Array<[PerformanceId, ResolvedPerformance]> {
  return performanceEntries.map(([performanceId]) => [
    performanceId,
    getLocalizedPerformance(localization, performanceId),
  ]);
}

export function getLocalizedPerformances(
  localization: ResolvedLocalization,
  world: SiteWorld,
  collection: PerformanceCollection,
): ResolvedPerformance[] {
  return getLocalizedPerformanceEntries(localization)
    .map(([, performance]) => performance)
    .filter((performance) => performance.world === world && performance.collection === collection);
}

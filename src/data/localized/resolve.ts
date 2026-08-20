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
} from '../productions.ts';
import type { SiteWorld } from '../site-routes';
import type {
  LocalizedRecord,
  LocalizedShape,
  PerformanceContent,
  ProductionContent,
  ProgramContent,
} from './schema';
import { columbiaMessages } from './columbia/messages.ts';
import { columbiaPrograms } from './columbia/programs.ts';
import { columbiaSite } from './columbia/site.ts';
import { yanMessages } from './yan/messages.ts';
import { yanPrograms } from './yan/programs.ts';
import { yanSite } from './yan/site.ts';

export interface LocalizationPackage {
  site: LocalizedShape<typeof yanSite>;
  programs: ProgramContent;
  messages: LocalizedShape<typeof yanMessages>;
}

export interface ResolvedLocalization extends LocalizationPackage {
  edition: BuiltEdition;
  sources: {
    site: LocalizedRecord<LocalizationPackage['site']>;
    programs: LocalizedRecord<LocalizationPackage['programs']>;
    messages: LocalizedRecord<LocalizationPackage['messages']>;
  };
}

export interface ResolvedProduction extends Production, ProductionContent {}

export interface ResolvedPerformance extends Omit<Performance, 'dateTime'>, PerformanceContent {
  cityLabel: string;
  dateTime: Performance['dateTime'] & { display: string };
  place: string;
}

const sourcePackage: LocalizationPackage = {
  site: yanSite,
  programs: yanPrograms,
  messages: yanMessages,
};

const localePackages: Partial<Record<BuildEditionId, Partial<LocalizationPackage>>> = {
  yan: sourcePackage,
  columbia: {
    site: columbiaSite,
    programs: columbiaPrograms,
    messages: columbiaMessages,
  },
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

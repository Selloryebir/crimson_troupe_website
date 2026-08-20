import type { BuiltEdition } from './editions';
import {
  getLocalization,
  getLocalizedPerformanceEntries,
  getLocalizedProduction,
  getLocalizedProductionEntries,
  type ResolvedLocalization,
} from './localized/resolve';
import type { ProductionId } from './productions/index.ts';
import { performancePath, productionPath, sitePath, siteRoot, type SiteWorld } from './site-routes';

export type SiteSearchEntryType = 'page' | 'performance' | 'production';

export interface SiteSearchEntry {
  id: string;
  type: SiteSearchEntryType;
  typeLabel: string;
  title: string;
  summary: string;
  keywords: string;
  href: string;
}

function productionIdsForWorld(
  localization: ResolvedLocalization,
  world: SiteWorld,
): Set<ProductionId> {
  return new Set(
    getLocalizedPerformanceEntries(localization)
      .filter(([, performance]) => performance.world === world)
      .flatMap(([, performance]) => performance.productionIds),
  );
}

function getPerformanceEntries(
  edition: BuiltEdition,
  localization: ResolvedLocalization,
  world: SiteWorld,
  typeLabel: string,
): SiteSearchEntry[] {
  return getLocalizedPerformanceEntries(localization)
    .filter(([, performance]) => performance.world === world)
    .map(([, performance]) => {
      const leadProduction = getLocalizedProduction(localization, performance.productionIds[0]);
      return {
        id: `${world}-performance-${performance.performanceId}`,
        type: 'performance',
        typeLabel,
        title: `${leadProduction.title}｜${performance.cityLabel}`,
        summary: `${performance.dateTime.display} · ${performance.place}`,
        keywords: `${leadProduction.title} ${leadProduction.kind} ${leadProduction.tagline} ${performance.searchKeywords}`,
        href: performancePath(edition, world, performance.performanceId),
      };
    });
}

function getProductionEntries(
  edition: BuiltEdition,
  localization: ResolvedLocalization,
  world: SiteWorld,
  typeLabel: string,
): SiteSearchEntry[] {
  const worldProductionIds = productionIdsForWorld(localization, world);
  return getLocalizedProductionEntries(localization)
    .filter(([productionId]) => worldProductionIds.has(productionId))
    .map(([productionId, production]) => ({
      id: `${world}-production-${productionId}`,
      type: 'production',
      typeLabel,
      title: production.title,
      summary: production.heading,
      keywords: `${production.kind} ${production.tagline}`,
      href: productionPath(edition, world, productionId),
    }));
}

export function getFrontSearchIndex(edition: BuiltEdition): SiteSearchEntry[] {
  const localization = getLocalization(edition);
  const copy = localization.site.front.searchIndex;
  const pages: SiteSearchEntry[] = [
    {
      id: 'front-page-home',
      type: 'page',
      typeLabel: copy.pageType,
      title: copy.homeTitle,
      summary: localization.site.front.home.introduction,
      keywords: copy.homeKeywords,
      href: siteRoot(edition, 'front'),
    },
    {
      id: 'front-page-current-performances',
      type: 'page',
      typeLabel: copy.pageType,
      title: copy.currentTitle,
      summary: copy.currentSummary,
      keywords: copy.currentKeywords,
      href: sitePath(edition, 'front', 'performances'),
    },
    {
      id: 'front-page-history',
      type: 'page',
      typeLabel: copy.pageType,
      title: copy.historyTitle,
      summary: copy.historySummary,
      keywords: copy.historyKeywords,
      href: sitePath(edition, 'front', 'performances/history'),
    },
    {
      id: 'front-page-troupe',
      type: 'page',
      typeLabel: copy.pageType,
      title: copy.troupeTitle,
      summary: localization.site.front.troupe.introduction,
      keywords: copy.troupeKeywords,
      href: sitePath(edition, 'front', 'troupe'),
    },
    {
      id: 'front-page-tickets',
      type: 'page',
      typeLabel: copy.pageType,
      title: copy.ticketsTitle,
      summary: copy.ticketsSummary,
      keywords: copy.ticketsKeywords,
      href: sitePath(edition, 'front', 'tickets'),
    },
  ];
  return [
    ...pages,
    ...getPerformanceEntries(edition, localization, 'front', copy.performanceType),
    ...getProductionEntries(edition, localization, 'front', copy.productionType),
  ];
}

export function getArchiveSearchIndex(edition: BuiltEdition): SiteSearchEntry[] {
  const localization = getLocalization(edition);
  const copy = localization.site.archive.searchIndex;
  const pages: SiteSearchEntry[] = [
    {
      id: 'archive-page-home',
      type: 'page',
      typeLabel: copy.pageType,
      title: copy.homeTitle,
      summary: localization.site.archive.home.introduction,
      keywords: copy.homeKeywords,
      href: siteRoot(edition, 'archive'),
    },
    {
      id: 'archive-page-current-performances',
      type: 'page',
      typeLabel: copy.pageType,
      title: copy.currentTitle,
      summary: copy.currentSummary,
      keywords: copy.currentKeywords,
      href: sitePath(edition, 'archive', 'performances'),
    },
    {
      id: 'archive-page-history',
      type: 'page',
      typeLabel: copy.pageType,
      title: copy.historyTitle,
      summary: copy.historySummary,
      keywords: copy.historyKeywords,
      href: sitePath(edition, 'archive', 'performances/history'),
    },
    {
      id: 'archive-page-troupe',
      type: 'page',
      typeLabel: copy.pageType,
      title: copy.troupeTitle,
      summary: localization.site.archive.troupe.introduction,
      keywords: copy.troupeKeywords,
      href: sitePath(edition, 'archive', 'troupe'),
    },
    {
      id: 'archive-page-tickets',
      type: 'page',
      typeLabel: copy.pageType,
      title: copy.ticketsTitle,
      summary: copy.ticketsSummary,
      keywords: copy.ticketsKeywords,
      href: sitePath(edition, 'archive', 'tickets'),
    },
  ];
  return [
    ...pages,
    ...getPerformanceEntries(edition, localization, 'archive', copy.performanceType),
    ...getProductionEntries(edition, localization, 'archive', copy.productionType),
  ];
}

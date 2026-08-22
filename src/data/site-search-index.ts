import { buildSnapshot, getWorldProductionIds, type ContentSnapshot } from './content/resolve.ts';
import type { BuiltEdition } from './editions.ts';
import {
  getLocalization,
  getLocalizedPerformanceEntries,
  getLocalizedProduction,
  getLocalizedProductionEntries,
  type ResolvedLocalization,
} from './localized/resolve.ts';
import {
  performancePath,
  productionPath,
  sitePath,
  siteRoot,
  type SiteWorld,
} from './site-routes.ts';

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

function getPerformanceEntries(
  edition: BuiltEdition,
  localization: ResolvedLocalization,
  world: SiteWorld,
  typeLabel: string,
  snapshot: ContentSnapshot,
): SiteSearchEntry[] {
  return getLocalizedPerformanceEntries(localization, snapshot)
    .filter(([, performance]) => performance.world === world)
    .map(([, performance]) => {
      const leadProduction = getLocalizedProduction(
        localization,
        performance.productionIds[0],
        snapshot,
      );
      const statusCopy =
        world === 'front'
          ? localization.site.front.performanceDetail
          : localization.site.archive.performanceDetail;
      const statusLabel = statusCopy[performance.status];
      return {
        id: `${world}-performance-${performance.performanceId}`,
        type: 'performance',
        typeLabel,
        title: `${leadProduction.title}｜${performance.cityLabel}`,
        summary: [
          `${performance.dateTime.display} · ${performance.place}`,
          statusLabel,
          performance.operationalNotice?.text,
        ]
          .filter(Boolean)
          .join(' · '),
        keywords: `${leadProduction.title} ${leadProduction.kind} ${leadProduction.tagline} ${performance.searchKeywords} ${statusLabel} ${performance.operationalNotice?.text ?? ''}`,
        href: performancePath(edition, world, performance.performanceId),
      };
    });
}

function getProductionEntries(
  edition: BuiltEdition,
  localization: ResolvedLocalization,
  world: SiteWorld,
  typeLabel: string,
  snapshot: ContentSnapshot,
): SiteSearchEntry[] {
  const worldProductionIds = new Set(getWorldProductionIds(snapshot, world));
  return getLocalizedProductionEntries(localization, snapshot)
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

export function getFrontSearchIndex(
  edition: BuiltEdition,
  snapshot: ContentSnapshot = buildSnapshot,
): SiteSearchEntry[] {
  const localization = getLocalization(edition, snapshot);
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
    ...getPerformanceEntries(edition, localization, 'front', copy.performanceType, snapshot),
    ...getProductionEntries(edition, localization, 'front', copy.productionType, snapshot),
  ];
}

export function getArchiveSearchIndex(
  edition: BuiltEdition,
  snapshot: ContentSnapshot = buildSnapshot,
): SiteSearchEntry[] {
  const localization = getLocalization(edition, snapshot);
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
    ...getPerformanceEntries(edition, localization, 'archive', copy.performanceType, snapshot),
    ...getProductionEntries(edition, localization, 'archive', copy.productionType, snapshot),
  ];
}

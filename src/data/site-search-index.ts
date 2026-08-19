import type { ReleasedEdition } from './editions';
import { archiveContent } from './archive-content';
import { frontContent } from './front-content';
import { performanceEntries } from './performances';
import { productionEntries, productions, type ProductionId } from './productions';
import { performancePath, productionPath, sitePath, siteRoot } from './site-routes';

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

function productionIdsForWorld(world: 'front' | 'archive'): Set<ProductionId> {
  return new Set(
    performanceEntries
      .filter(([, performance]) => performance.world === world)
      .flatMap(([, performance]) => performance.productionIds),
  );
}

export function getFrontSearchIndex(edition: ReleasedEdition): SiteSearchEntry[] {
  const pages: SiteSearchEntry[] = [
    {
      id: 'front-page-home',
      type: 'page',
      typeLabel: '页面',
      title: '猩红剧团首页',
      summary: frontContent.home.introduction,
      keywords: '首页 当前巡演季 剧团',
      href: siteRoot(edition, 'front'),
    },
    {
      id: 'front-page-current-performances',
      type: 'page',
      typeLabel: '页面',
      title: '本季演出',
      summary: '浏览猩红剧团当前巡演季已经公布的场次。',
      keywords: '演出 场次 本季 未来 日程',
      href: sitePath(edition, 'front', 'performances'),
    },
    {
      id: 'front-page-history',
      type: 'page',
      typeLabel: '页面',
      title: '历史演出',
      summary: '查阅已经完成并通过校录的演出场次。',
      keywords: '历史 过往 场次 档案',
      href: sitePath(edition, 'front', 'performances/history'),
    },
    {
      id: 'front-page-troupe',
      type: 'page',
      typeLabel: '页面',
      title: '剧团',
      summary: frontContent.troupe.introduction,
      keywords: '剧团 公司 创作 方法 巡演',
      href: sitePath(edition, 'front', 'troupe'),
    },
    {
      id: 'front-page-tickets',
      type: 'page',
      typeLabel: '页面',
      title: '票务',
      summary: '选择当前巡演季场次与分区，进入模拟购票体验。',
      keywords: '票务 席位 购票 分区 纪念票',
      href: sitePath(edition, 'front', 'tickets'),
    },
  ];

  const performances = performanceEntries
    .filter(([, performance]) => performance.world === 'front')
    .map(([, performance]): SiteSearchEntry => {
      const leadProduction = productions[performance.productionIds[0]];
      return {
        id: `front-performance-${performance.performanceId}`,
        type: 'performance',
        typeLabel: '场次',
        title: `${leadProduction.title}｜${performance.cityLabel}`,
        summary: `${performance.dateTime.display} · ${performance.place}`,
        keywords: `${leadProduction.title} ${leadProduction.kind} ${leadProduction.tagline} ${performance.searchKeywords}`,
        href: performancePath(edition, 'front', performance.performanceId),
      };
    });

  const frontProductionIds = productionIdsForWorld('front');
  const productionResults = productionEntries
    .filter(([productionId]) => frontProductionIds.has(productionId))
    .map(([productionId, production]): SiteSearchEntry => ({
      id: `front-production-${productionId}`,
      type: 'production',
      typeLabel: '剧目',
      title: production.title,
      summary: production.heading,
      keywords: `${production.kind} ${production.tagline}`,
      href: productionPath(edition, 'front', productionId),
    }));

  return [...pages, ...performances, ...productionResults];
}

export function getArchiveSearchIndex(edition: ReleasedEdition): SiteSearchEntry[] {
  const pages: SiteSearchEntry[] = [
    {
      id: 'archive-page-home',
      type: 'page',
      typeLabel: '栏目',
      title: '猩红剧团 1091 年首页',
      summary: archiveContent.home.introduction,
      keywords: '首页 1091 旧剧团 巡演',
      href: siteRoot(edition, 'archive'),
    },
    {
      id: 'archive-page-current-performances',
      type: 'page',
      typeLabel: '栏目',
      title: '本季演出',
      summary: '查阅泰拉历 1091 年当季尚待举行的场次。',
      keywords: '本季 场次 名录 当季',
      href: sitePath(edition, 'archive', 'performances'),
    },
    {
      id: 'archive-page-history',
      type: 'page',
      typeLabel: '栏目',
      title: '历史演出',
      summary: '查阅泰拉历 1091 年当时已经完成的场次。',
      keywords: '历史 场次 名录 过往',
      href: sitePath(edition, 'archive', 'performances/history'),
    },
    {
      id: 'archive-page-troupe',
      type: 'page',
      typeLabel: '栏目',
      title: '剧团名册',
      summary: archiveContent.troupe.introduction,
      keywords: '剧团 名册 编演室 工房 巡演事务',
      href: sitePath(edition, 'archive', 'troupe'),
    },
    {
      id: 'archive-page-tickets',
      type: 'page',
      typeLabel: '栏目',
      title: '席位登记',
      summary: '1091 年原网站席位服务的历史页面；当前不可购买。',
      keywords: '席位 票务 登记 终止 不可购买',
      href: sitePath(edition, 'archive', 'tickets'),
    },
  ];

  const performances = performanceEntries
    .filter(([, performance]) => performance.world === 'archive')
    .map(([, performance]): SiteSearchEntry => {
      const leadProduction = productions[performance.productionIds[0]];
      return {
        id: `archive-performance-${performance.performanceId}`,
        type: 'performance',
        typeLabel: '场次',
        title: `${leadProduction.title}｜${performance.cityLabel}`,
        summary: `${performance.dateTime.display} · ${performance.place}`,
        keywords: `${leadProduction.title} ${leadProduction.kind} ${leadProduction.tagline} ${performance.searchKeywords}`,
        href: performancePath(edition, 'archive', performance.performanceId),
      };
    });

  const archiveProductionIds = productionIdsForWorld('archive');
  const productionResults = productionEntries
    .filter(([productionId]) => archiveProductionIds.has(productionId))
    .map(([productionId, production]): SiteSearchEntry => ({
      id: `archive-production-${productionId}`,
      type: 'production',
      typeLabel: '剧目',
      title: production.title,
      summary: production.heading,
      keywords: `${production.kind} ${production.tagline}`,
      href: productionPath(edition, 'archive', productionId),
    }));

  return [...pages, ...performances, ...productionResults];
}

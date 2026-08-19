import type { ReleasedEdition } from './editions';
import { frontContent } from './front-content';
import { performanceEntries } from './performances';
import { productionEntries, productions } from './productions';
import { performancePath, productionPath, sitePath, siteRoot } from './site-routes';

export type FrontSearchEntryType = 'page' | 'performance' | 'production';

export interface FrontSearchEntry {
  id: string;
  type: FrontSearchEntryType;
  typeLabel: string;
  title: string;
  summary: string;
  keywords: string;
  href: string;
}

export function getFrontSearchIndex(edition: ReleasedEdition): FrontSearchEntry[] {
  const pages: FrontSearchEntry[] = [
    {
      id: 'page-home',
      type: 'page',
      typeLabel: '页面',
      title: '猩红剧团首页',
      summary: frontContent.home.introduction,
      keywords: '首页 当前巡演季 剧团',
      href: siteRoot(edition, 'front'),
    },
    {
      id: 'page-current-performances',
      type: 'page',
      typeLabel: '页面',
      title: '本季演出',
      summary: '浏览猩红剧团当前巡演季已经公布的场次。',
      keywords: '演出 场次 本季 未来 日程',
      href: sitePath(edition, 'front', 'performances'),
    },
    {
      id: 'page-history',
      type: 'page',
      typeLabel: '页面',
      title: '历史演出',
      summary: '查阅已经完成并通过校录的演出场次。',
      keywords: '历史 过往 场次 档案',
      href: sitePath(edition, 'front', 'performances/history'),
    },
    {
      id: 'page-troupe',
      type: 'page',
      typeLabel: '页面',
      title: '剧团',
      summary: frontContent.troupe.introduction,
      keywords: '剧团 公司 创作 方法 巡演',
      href: sitePath(edition, 'front', 'troupe'),
    },
    {
      id: 'page-tickets',
      type: 'page',
      typeLabel: '页面',
      title: '票务',
      summary: '查看当前巡演季的票务开放状态。',
      keywords: '票务 席位 购票 暂未开票',
      href: sitePath(edition, 'front', 'tickets'),
    },
  ];

  const performanceEntriesForSearch = performanceEntries
    .filter(([, performance]) => performance.world === 'front')
    .map(([, performance]): FrontSearchEntry => {
      const leadProduction = productions[performance.productionIds[0]];
      return {
        id: `performance-${performance.performanceId}`,
        type: 'performance',
        typeLabel: '场次',
        title: `${leadProduction.title}｜${performance.cityLabel}`,
        summary: `${performance.dateTime.display} · ${performance.place}`,
        keywords: `${leadProduction.title} ${leadProduction.kind} ${leadProduction.tagline} ${performance.searchKeywords}`,
        href: performancePath(edition, 'front', performance.performanceId),
      };
    });

  const productionEntriesForSearch = productionEntries.map(
    ([productionId, production]): FrontSearchEntry => ({
      id: `production-${productionId}`,
      type: 'production',
      typeLabel: '剧目',
      title: production.title,
      summary: production.heading,
      keywords: `${production.kind} ${production.tagline}`,
      href: productionPath(edition, 'front', productionId),
    }),
  );

  return [...pages, ...performanceEntriesForSearch, ...productionEntriesForSearch];
}

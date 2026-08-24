import type { PerformanceId, TerraDateTime } from '../performances.ts';
import type { SiteWorld } from '../site-routes.ts';
import type { BuildContext } from './build-context.ts';
import {
  derivePerformanceCollection,
  getSiteTerraNow,
  isWithinPerformanceVisibilityWindow,
} from '../site-time.ts';

export interface WorldPerformanceRoots {
  performanceIds: readonly PerformanceId[];
  featuredPerformanceId: PerformanceId;
  homepagePerformanceIds: readonly PerformanceId[];
}

export type ContentRootSetId = 'current-showcase';

export interface ContentRootSet {
  rootSetId: ContentRootSetId;
  worlds: Readonly<Record<SiteWorld, WorldPerformanceRoots>>;
}

export type ContentRootSetRegistry = Readonly<Record<ContentRootSetId, ContentRootSet>>;

export const currentRootSet = Object.freeze({
  rootSetId: 'current-showcase',
  worlds: Object.freeze({
    front: Object.freeze({
      performanceIds: Object.freeze([
        'caged-fire-jiangdu-1101-0521',
        'second-snow-zwillingsturme-1101-0808',
        'red-banquet-nuova-volsinii-1101-1119',
        'seventh-lantern-norport-1102-0202',
        'red-banquet-montelupe-1102-0606',
        'uncrowned-trimount-1102',
        'caged-fire-wiesheim-1102',
        'second-snow-norport-1102',
        'seventh-lantern-linqu-1102-1212',
        'procession-of-masks-londinium-1103-0214',
        'uncrowned-qingsui-1103-0404',
      ] satisfies PerformanceId[]),
      featuredPerformanceId: 'uncrowned-trimount-1102',
      homepagePerformanceIds: Object.freeze([
        'red-banquet-montelupe-1102-0606',
        'uncrowned-trimount-1102',
        'caged-fire-wiesheim-1102',
        'second-snow-norport-1102',
        'seventh-lantern-linqu-1102-1212',
        'procession-of-masks-londinium-1103-0214',
        'uncrowned-qingsui-1103-0404',
      ] satisfies PerformanceId[]),
    }),
    archive: Object.freeze({
      performanceIds: Object.freeze([
        'lone-wander-wiesheim-1083-0814',
        'wonderland-in-dream-londinium-1083-1109',
        'frost-deer-and-snow-doe-nuova-volsinii-1084-0125',
        'der-ring-londinium-1084-0308',
        'one-hundred-and-one-days-norport-1084-0419',
        'the-carnival-wiesheim-1084-0511',
        'light-of-heria-zwillingsturme-1084-0608',
        'ode-au-triomphe-nuova-volsinii-1084-0623',
        'lone-wander-linqu-1084-0719',
        'der-ring-zwillingsturme-1084-0817',
        'one-hundred-and-one-days-londinium-1084-0903',
        'the-carnival-montelupe-1084-0921',
        'the-carnival-londinium-1084-1009',
        'ode-au-triomphe-zwillingsturme-1084-1028',
        'wonderland-in-dream-qingsui-1084-1116',
        'frost-deer-and-snow-doe-jiangdu-1085-0122',
        'light-of-heria-trimount-1085-0530',
      ] satisfies PerformanceId[]),
      featuredPerformanceId: 'der-ring-zwillingsturme-1084-0817',
      homepagePerformanceIds: Object.freeze([
        'lone-wander-linqu-1084-0719',
        'der-ring-zwillingsturme-1084-0817',
        'one-hundred-and-one-days-londinium-1084-0903',
        'the-carnival-montelupe-1084-0921',
        'the-carnival-londinium-1084-1009',
        'ode-au-triomphe-zwillingsturme-1084-1028',
        'wonderland-in-dream-qingsui-1084-1116',
        'frost-deer-and-snow-doe-jiangdu-1085-0122',
        'light-of-heria-trimount-1085-0530',
      ] satisfies PerformanceId[]),
    }),
  }),
} as const satisfies ContentRootSet);

export const contentRootSets = Object.freeze({
  [currentRootSet.rootSetId]: currentRootSet,
}) satisfies ContentRootSetRegistry;

export function getContentRootSet(
  rootSetId: ContentRootSetId,
  registry: ContentRootSetRegistry = contentRootSets,
): ContentRootSet {
  const rootSet = registry[rootSetId];
  if (!rootSet || rootSet.rootSetId !== rootSetId) {
    throw new Error(`未知或不匹配的内容根集合：${rootSetId}`);
  }
  return rootSet;
}

export function getRootPerformanceIds(rootSet: ContentRootSet): readonly PerformanceId[] {
  return [...rootSet.worlds.front.performanceIds, ...rootSet.worlds.archive.performanceIds];
}

export function validateContentRootSet(
  rootSet: ContentRootSet,
  knownPerformances: Readonly<
    Record<
      string,
      {
        world: SiteWorld;
        productionIds: readonly string[];
        effectiveDateTime: TerraDateTime;
      }
    >
  >,
  knownProductions: Readonly<Record<string, { sourceKind: 'folio' | 'original' }>>,
  context: BuildContext,
): void {
  const allIds = getRootPerformanceIds(rootSet);
  const duplicates = allIds.filter((id, index) => allIds.indexOf(id) !== index);
  const unknown = allIds.filter((id) => !Object.hasOwn(knownPerformances, id));

  if (duplicates.length > 0) {
    throw new Error(
      `根集合 ${rootSet.rootSetId} 含重复场次：${[...new Set(duplicates)].join('、')}`,
    );
  }
  if (unknown.length > 0) {
    throw new Error(`根集合 ${rootSet.rootSetId} 含未知场次：${unknown.join('、')}`);
  }

  for (const world of ['front', 'archive'] as const) {
    const roots = rootSet.worlds[world];
    const misplaced = roots.performanceIds.filter(
      (performanceId) => knownPerformances[performanceId]?.world !== world,
    );
    if (misplaced.length > 0) {
      throw new Error(
        `根集合 ${rootSet.rootSetId} 的 ${world} 含跨时间层场次：${misplaced.join('、')}`,
      );
    }
    if (!roots.performanceIds.includes(roots.featuredPerformanceId)) {
      throw new Error(
        `根集合 ${rootSet.rootSetId} 的 ${world} 焦点不属于该时间层：${roots.featuredPerformanceId}`,
      );
    }

    const homepageDuplicates = roots.homepagePerformanceIds.filter(
      (performanceId, index) => roots.homepagePerformanceIds.indexOf(performanceId) !== index,
    );
    if (homepageDuplicates.length > 0) {
      throw new Error(
        `根集合 ${rootSet.rootSetId} 的 ${world} 首页策展含重复场次：${[...new Set(homepageDuplicates)].join('、')}`,
      );
    }
    const homepageNonMembers = roots.homepagePerformanceIds.filter(
      (performanceId) => !roots.performanceIds.includes(performanceId),
    );
    if (homepageNonMembers.length > 0) {
      throw new Error(
        `根集合 ${rootSet.rootSetId} 的 ${world} 首页策展不属于该时间层根集合：${homepageNonMembers.join('、')}`,
      );
    }

    const productionAppearances = new Map<string, number>();
    const siteTerraNow = getSiteTerraNow(world, context);
    const homepageNonCurrent = roots.homepagePerformanceIds.filter((performanceId) => {
      const performance = knownPerformances[performanceId];
      return (
        performance &&
        derivePerformanceCollection(performance.effectiveDateTime, siteTerraNow) !== 'current'
      );
    });
    if (homepageNonCurrent.length > 0) {
      throw new Error(
        `根集合 ${rootSet.rootSetId} 的 ${world} 首页策展含非本季场次：${homepageNonCurrent.join('、')}`,
      );
    }
    for (const performanceId of roots.performanceIds) {
      const performance = knownPerformances[performanceId];
      if (!performance) {
        continue;
      }
      if (!isWithinPerformanceVisibilityWindow(performance.effectiveDateTime, siteTerraNow)) {
        throw new Error(
          `根集合 ${rootSet.rootSetId} 的 ${performanceId} 超出 ${world} 前后一年窗口。`,
        );
      }
      for (const productionId of performance.productionIds) {
        const production = knownProductions[productionId];
        if (!production) {
          throw new Error(
            `根集合 ${rootSet.rootSetId} 的 ${performanceId} 引用未知剧目：${productionId}`,
          );
        }
        if (world === 'archive' && production.sourceKind !== 'folio') {
          throw new Error(
            `根集合 ${rootSet.rootSetId} 的里站场次 ${performanceId} 只能引用 folio 剧目：${productionId}`,
          );
        }
        productionAppearances.set(productionId, (productionAppearances.get(productionId) ?? 0) + 1);
      }
    }
    const overusedProductions = [...productionAppearances.entries()]
      .filter(([, count]) => count > 3)
      .map(([productionId, count]) => `${productionId}(${count})`);
    if (overusedProductions.length > 0) {
      throw new Error(
        `根集合 ${rootSet.rootSetId} 的 ${world} 剧目编排超过三次：${overusedProductions.join('、')}`,
      );
    }
  }
}

import type { PerformanceId } from '../performances.ts';
import type { SiteWorld } from '../site-routes.ts';

export interface WorldPerformanceRoots {
  performanceIds: readonly PerformanceId[];
  featuredPerformanceId: PerformanceId;
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
        'uncrowned-trimount-1098',
        'caged-fire-wiesheim-1098',
        'second-snow-norport-1098',
      ] satisfies PerformanceId[]),
      featuredPerformanceId: 'uncrowned-trimount-1098',
    }),
    archive: Object.freeze({
      performanceIds: Object.freeze([
        'der-ring-londinium-1091-0308',
        'one-hundred-and-one-days-norport-1091-0419',
        'the-carnival-wiesheim-1091-0511',
        'ode-au-triomphe-nuova-volsinii-1091-0623',
        'der-ring-zwillingsturme-1091-0817',
        'one-hundred-and-one-days-londinium-1091-0903',
        'the-carnival-montelupe-1091-0921',
        'the-carnival-londinium-1091-1009',
        'ode-au-triomphe-zwillingsturme-1091-1028',
      ] satisfies PerformanceId[]),
      featuredPerformanceId: 'der-ring-zwillingsturme-1091-0817',
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
  knownPerformances: Readonly<Record<string, { world: SiteWorld }>>,
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
  }
}

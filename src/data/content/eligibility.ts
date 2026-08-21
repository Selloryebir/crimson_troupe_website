import type { BuildContext } from './build-context.ts';
import type { ContentRootSet } from './root-sets.ts';
import { getRootPerformanceIds } from './root-sets.ts';

// 当前没有任何获人工批准的运行时内容；GATE-05 会把资格扩展为规范化摘要门禁。
const approvedContentIds = new Set<string>();

export function assertContentContextEligible(context: BuildContext, rootSet: ContentRootSet): void {
  if (context.contentPolicy === 'preview-ok') {
    return;
  }

  const ineligibleIds = getRootPerformanceIds(rootSet).filter(
    (performanceId) => !approvedContentIds.has(performanceId),
  );
  if (ineligibleIds.length > 0) {
    throw new Error(
      `构建预设 ${context.profile} 要求 approved-only，但根集合 ${rootSet.rootSetId} 含未批准内容：${ineligibleIds.join('、')}`,
    );
  }
}

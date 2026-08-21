import type { BuildContext } from './build-context.ts';
import {
  approvedContentDigests,
  createPerformanceApprovalDigests,
  type ApprovedContentDigests,
} from './approval-digests.ts';
import type { ContentRootSet } from './root-sets.ts';
import { getRootPerformanceIds } from './root-sets.ts';

export function assertContentContextEligible(
  context: BuildContext,
  rootSet: ContentRootSet,
  approvals: ApprovedContentDigests = approvedContentDigests,
): void {
  if (context.contentPolicy === 'preview-ok') {
    return;
  }

  const currentDigests = createPerformanceApprovalDigests(context.editionIds, rootSet);
  const ineligible = getRootPerformanceIds(rootSet).flatMap((performanceId) => {
    const approvedDigest = approvals[performanceId];
    if (!approvedDigest) {
      return [`${performanceId}（无批准摘要）`];
    }
    return approvedDigest === currentDigests[performanceId]
      ? []
      : [`${performanceId}（批准摘要已失效）`];
  });
  if (ineligible.length > 0) {
    throw new Error(
      `构建预设 ${context.profile} 要求 approved-only，但根集合 ${rootSet.rootSetId} 含不合格内容：${ineligible.join('、')}`,
    );
  }
}

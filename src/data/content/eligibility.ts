import type { BuildContext } from './build-context.ts';
import {
  approvedContentDigests,
  createContentApprovalDigests,
  type ApprovedContentDigests,
} from './approval-digests.ts';
import type { ContentRootSet } from './root-sets.ts';
import { getRootPerformanceIds } from './root-sets.ts';
import {
  ticketingPlatforms,
  type TicketingPlatformDefinition,
  type TicketingPlatformId,
} from '../ticketing-platforms.ts';

export function assertContentContextEligible(
  context: BuildContext,
  rootSet: ContentRootSet,
  approvals: ApprovedContentDigests = approvedContentDigests,
  platforms: Readonly<
    Record<TicketingPlatformId, TicketingPlatformDefinition>
  > = ticketingPlatforms,
): void {
  if (context.contentPolicy === 'preview-ok') {
    return;
  }

  const currentDigests = createContentApprovalDigests(context.editionIds, rootSet);
  const ineligible: string[] = [];
  for (const platform of Object.values(platforms)) {
    if (platform.logo.approvalStatus !== 'approved') {
      ineligible.push(`ticketing-platform.${platform.platformId}.logo（正式 Logo 缺失）`);
    }
  }
  if (!approvals.site) {
    ineligible.push('site（无批准摘要）');
  } else if (approvals.site !== currentDigests.site) {
    ineligible.push('site（批准摘要已失效）');
  }
  const approvedRootSetDigest = approvals.rootSets[rootSet.rootSetId];
  if (!approvedRootSetDigest) {
    ineligible.push(`${rootSet.rootSetId}（无批准摘要）`);
  } else if (approvedRootSetDigest !== currentDigests.rootSet) {
    ineligible.push(`${rootSet.rootSetId}（批准摘要已失效）`);
  }
  ineligible.push(
    ...getRootPerformanceIds(rootSet).flatMap((performanceId) => {
      const approvedDigest = approvals.performances[performanceId];
      if (!approvedDigest) {
        return [`${performanceId}（无批准摘要）`];
      }
      return approvedDigest === currentDigests.performances[performanceId]
        ? []
        : [`${performanceId}（批准摘要已失效）`];
    }),
  );
  if (ineligible.length > 0) {
    throw new Error(
      `构建预设 ${context.profile} 要求 approved-only，但根集合 ${rootSet.rootSetId} 含不合格内容：${ineligible.join('、')}`,
    );
  }
}

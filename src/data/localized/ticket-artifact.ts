import type { BuildEditionId } from '../editions.ts';

function getLanguageSubtag(locale: string): string {
  return locale.toLowerCase().split('-')[0] ?? locale.toLowerCase();
}

export function ticketArtifactLocalesShareLanguage(left: string, right: string): boolean {
  return getLanguageSubtag(left) === getLanguageSubtag(right);
}

export function getTicketArtifactEditionIds(
  websiteEditionIds: readonly BuildEditionId[],
  venueEditionId: BuildEditionId,
): readonly BuildEditionId[] {
  return Object.freeze([...new Set([...websiteEditionIds, venueEditionId])]);
}

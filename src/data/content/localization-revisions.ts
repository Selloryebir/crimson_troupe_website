import type { BuildEditionId } from '../editions.ts';
import {
  localizationPackages,
  sourceLocalizationPackage,
  type PartialLocalizationPackage,
} from '../localized/packages.ts';
import { createContentFingerprint } from './fingerprint.ts';

export type LocalizationSourceRevision = Readonly<
  Record<'site' | 'programs' | 'messages' | 'archiveProjection', string>
>;

export function createLocalizationSourceRevision(
  source: PartialLocalizationPackage = sourceLocalizationPackage,
): LocalizationSourceRevision {
  return Object.freeze({
    site: createContentFingerprint(source.site),
    programs: createContentFingerprint(source.programs),
    messages: createContentFingerprint(source.messages),
    archiveProjection: createContentFingerprint(source.archiveProjection),
  });
}

export const localizationSourceRevisions: Readonly<
  Partial<Record<BuildEditionId, LocalizationSourceRevision>>
> = Object.freeze({
  higashi: Object.freeze({
    site: 'fnv1a64:39ab08775750c133',
    programs: 'fnv1a64:595a383bb7658796',
    messages: 'fnv1a64:3ecd5998c3cc3edc',
    archiveProjection: 'fnv1a64:09c70bcf1901f335',
  }),
  columbia: Object.freeze({
    site: 'fnv1a64:39ab08775750c133',
    programs: 'fnv1a64:595a383bb7658796',
    messages: 'fnv1a64:3ecd5998c3cc3edc',
    archiveProjection: 'fnv1a64:09c70bcf1901f335',
  }),
});

export function assertLocalizationSourceFresh(
  editionIds: readonly BuildEditionId[],
  packages: Readonly<Record<BuildEditionId, PartialLocalizationPackage>> = localizationPackages,
  expectedRevisions: Readonly<
    Partial<Record<BuildEditionId, LocalizationSourceRevision>>
  > = localizationSourceRevisions,
): void {
  const current = createLocalizationSourceRevision(packages.yan);
  for (const editionId of editionIds) {
    if (editionId === 'yan') {
      continue;
    }
    const expected = expectedRevisions[editionId];
    if (!expected) {
      throw new Error(`${editionId} 缺少炎语源修订摘要。`);
    }
    for (const category of ['site', 'programs', 'messages', 'archiveProjection'] as const) {
      if (expected[category] !== current[category]) {
        throw new Error(`${editionId}.${category} 译文源修订已过期。`);
      }
    }
  }
}

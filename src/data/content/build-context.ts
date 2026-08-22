import type { EditionId } from '../editions.ts';
import type { ContentRootSetId } from './root-sets.ts';

export type BuildProfile = 'showcase' | 'preview' | 'release';
export type ContentPolicy = 'preview-ok' | 'approved-only';
export type ContentFallbackPolicy = 'strict';
export type SiteClockStrategy = 'fixed' | 'anchored';

export interface BuildContext {
  profile: BuildProfile;
  editionIds: readonly EditionId[];
  rootSetId: ContentRootSetId;
  contentPolicy: ContentPolicy;
  fallbackPolicy: ContentFallbackPolicy;
  siteClockStrategies: Readonly<Record<'front' | 'archive', SiteClockStrategy>>;
}

export type BuildContextRegistry = Readonly<Record<BuildProfile, BuildContext>>;

const fixedClockStrategies = Object.freeze({
  front: 'fixed',
  archive: 'fixed',
} as const);

export function createBuildContexts(
  releaseEditionIds: readonly EditionId[],
  previewEditionIds: readonly EditionId[],
): BuildContextRegistry {
  return Object.freeze({
    showcase: Object.freeze({
      profile: 'showcase',
      editionIds: Object.freeze(['yan'] satisfies EditionId[]),
      rootSetId: 'current-showcase',
      contentPolicy: 'preview-ok',
      fallbackPolicy: 'strict',
      siteClockStrategies: fixedClockStrategies,
    }),
    preview: Object.freeze({
      profile: 'preview',
      editionIds: Object.freeze([...previewEditionIds]),
      rootSetId: 'current-showcase',
      contentPolicy: 'preview-ok',
      fallbackPolicy: 'strict',
      siteClockStrategies: fixedClockStrategies,
    }),
    release: Object.freeze({
      profile: 'release',
      editionIds: Object.freeze([...releaseEditionIds]),
      rootSetId: 'current-showcase',
      contentPolicy: 'approved-only',
      fallbackPolicy: 'strict',
      siteClockStrategies: fixedClockStrategies,
    }),
  });
}

export function readBuildProfile(): BuildProfile {
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  };
  const value = runtime.process?.env?.SITE_BUILD_PROFILE ?? 'showcase';
  if (value !== 'showcase' && value !== 'preview' && value !== 'release') {
    throw new Error(`未知 SITE_BUILD_PROFILE：${value}。只允许 showcase、preview 或 release。`);
  }
  return value;
}

export function getBuildContext(
  contexts: BuildContextRegistry,
  profile: string = readBuildProfile(),
): BuildContext {
  if (!Object.hasOwn(contexts, profile)) {
    throw new Error(`未知构建预设：${profile}。只允许 showcase、preview 或 release。`);
  }
  return contexts[profile as BuildProfile];
}

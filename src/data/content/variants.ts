import { performances, type Performance, type PerformanceId } from '../performances.ts';

export interface CompleteContentVariant<T> {
  variantId: string;
  maturity: 'preview' | 'approved';
  value: T;
}

export interface ContentVariantUnit<T> {
  stableId: string;
  baseline: CompleteContentVariant<T>;
  preview?: CompleteContentVariant<T>;
}

export type PerformanceVariantRegistry = Readonly<
  Partial<Record<PerformanceId, ContentVariantUnit<Performance>>>
>;

export function selectCompleteVariant<T>(
  unit: ContentVariantUnit<T>,
  validate: (stableId: string, value: T) => void,
): CompleteContentVariant<T> {
  validate(unit.stableId, unit.baseline.value);
  if (unit.preview) {
    validate(unit.stableId, unit.preview.value);
    return unit.preview;
  }
  return unit.baseline;
}

export function createBaselinePerformanceVariantRegistry(
  source: Readonly<Record<string, Performance>>,
): PerformanceVariantRegistry {
  return Object.freeze(
    Object.fromEntries(
      Object.entries(source).map(([performanceId, performance]) => [
        performanceId,
        Object.freeze({
          stableId: performanceId,
          baseline: Object.freeze({
            variantId: 'baseline',
            maturity: 'preview',
            value: performance,
          }),
        }),
      ]),
    ) as Record<PerformanceId, ContentVariantUnit<Performance>>,
  );
}

const baselinePerformanceVariants = createBaselinePerformanceVariantRegistry(performances);

// 当前候选与基线共享同一完整值，不复制内容树；后续改稿替换 preview.value 即可并行验收。
export const performanceVariantRegistry: PerformanceVariantRegistry = Object.freeze({
  ...baselinePerformanceVariants,
  'uncrowned-trimount-1102': Object.freeze({
    ...baselinePerformanceVariants['uncrowned-trimount-1102'],
    stableId: 'uncrowned-trimount-1102',
    baseline: Object.freeze({
      variantId: 'baseline',
      maturity: 'preview',
      value: performances['uncrowned-trimount-1102'],
    }),
    preview: Object.freeze({
      variantId: 'current-preview',
      maturity: 'preview',
      value: performances['uncrowned-trimount-1102'],
    }),
  }),
});

export function getPerformanceVariantUnit(
  performanceId: PerformanceId,
  registry: PerformanceVariantRegistry = performanceVariantRegistry,
): ContentVariantUnit<Performance> | undefined {
  return registry[performanceId];
}

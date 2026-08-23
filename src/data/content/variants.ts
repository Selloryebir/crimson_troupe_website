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

const baselinePerformanceVariants = new Map<PerformanceId, ContentVariantUnit<Performance>>(
  Object.entries(performances).map(([performanceId, performance]) => [
    performanceId as PerformanceId,
    Object.freeze({
      stableId: performanceId,
      baseline: Object.freeze({
        variantId: 'baseline',
        maturity: 'preview',
        value: performance,
      }),
    }),
  ]),
);

// 当前候选与基线共享同一完整值，不复制内容树；后续改稿替换 preview.value 即可并行验收。
baselinePerformanceVariants.set(
  'uncrowned-trimount-1102',
  Object.freeze({
    ...baselinePerformanceVariants.get('uncrowned-trimount-1102'),
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
);

export function getPerformanceVariantUnit(
  performanceId: PerformanceId,
): ContentVariantUnit<Performance> | undefined {
  return baselinePerformanceVariants.get(performanceId);
}

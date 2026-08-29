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

export const performanceVariantRegistry: PerformanceVariantRegistry = baselinePerformanceVariants;

export function getPerformanceVariantUnit(
  performanceId: PerformanceId,
  registry: PerformanceVariantRegistry = performanceVariantRegistry,
): ContentVariantUnit<Performance> | undefined {
  return registry[performanceId];
}

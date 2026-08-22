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

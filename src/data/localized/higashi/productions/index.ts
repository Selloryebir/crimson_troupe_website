import type { ProductionId } from '../../../productions/index.ts';
import type { ProductionContent } from '../../schema.ts';
import { higashiFolioProductions } from './folio.ts';
import { higashiOriginalProductions } from './original.ts';

export const higashiProductions = {
  ...higashiFolioProductions,
  ...higashiOriginalProductions,
} satisfies Partial<Record<ProductionId, ProductionContent>>;

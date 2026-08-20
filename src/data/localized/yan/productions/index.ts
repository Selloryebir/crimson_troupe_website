import type { ProductionId } from '../../../productions/index.ts';
import type { ProductionContent } from '../../schema.ts';
import { yanFolioProductions } from './folio.ts';
import { yanOriginalProductions } from './original.ts';

export const yanProductions = {
  ...yanFolioProductions,
  ...yanOriginalProductions,
} satisfies Record<ProductionId, ProductionContent>;

import type { ProductionId } from '../../../productions/index.ts';
import type { ProductionContent } from '../../schema.ts';
import { minosFolioProductions } from './folio.ts';
import { minosOriginalProductions } from './original.ts';

export const minosProductions = {
  ...minosFolioProductions,
  ...minosOriginalProductions,
} satisfies Partial<Record<ProductionId, ProductionContent>>;

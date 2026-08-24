import type { ProductionId } from '../../../productions/index.ts';
import type { ProductionContent } from '../../schema.ts';
import { leithanienFolioProductions } from './folio.ts';
import { leithanienOriginalProductions } from './original.ts';

export const leithanienProductions = {
  ...leithanienFolioProductions,
  ...leithanienOriginalProductions,
} satisfies Partial<Record<ProductionId, ProductionContent>>;

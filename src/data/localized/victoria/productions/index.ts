import type { ProductionId } from '../../../productions/index.ts';
import type { ProductionContent } from '../../schema.ts';
import { victoriaFolioProductions } from './folio.ts';
import { victoriaOriginalProductions } from './original.ts';

export const victoriaProductions = {
  ...victoriaFolioProductions,
  ...victoriaOriginalProductions,
} satisfies Partial<Record<ProductionId, ProductionContent>>;

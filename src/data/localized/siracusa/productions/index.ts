import type { ProductionId } from '../../../productions/index.ts';
import type { ProductionContent } from '../../schema.ts';
import { siracusaFolioProductions } from './folio.ts';
import { siracusaOriginalProductions } from './original.ts';

export const siracusaProductions = {
  ...siracusaFolioProductions,
  ...siracusaOriginalProductions,
} satisfies Record<ProductionId, ProductionContent>;

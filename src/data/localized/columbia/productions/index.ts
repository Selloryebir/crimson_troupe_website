import type { ProductionId } from '../../../productions/index.ts';
import type { ProductionContent } from '../../schema.ts';
import { columbiaFolioProductions } from './folio.ts';
import { columbiaOriginalProductions } from './original.ts';

export const columbiaProductions = {
  ...columbiaFolioProductions,
  ...columbiaOriginalProductions,
} satisfies Record<ProductionId, ProductionContent>;

import type { ProductionId } from '../../../productions/index.ts';
import type { ProductionContent } from '../../schema.ts';
import { ursusFolioProductions } from './folio.ts';
import { ursusOriginalProductions } from './original.ts';

export const ursusProductions = {
  ...ursusFolioProductions,
  ...ursusOriginalProductions,
} satisfies Record<ProductionId, ProductionContent>;

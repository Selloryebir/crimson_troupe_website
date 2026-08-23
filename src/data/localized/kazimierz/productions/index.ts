import type { ProductionId } from '../../../productions/index.ts';
import type { ProductionContent } from '../../schema.ts';
import { kazimierzFolioProductions } from './folio.ts';
import { kazimierzOriginalProductions } from './original.ts';

export const kazimierzProductions = {
  ...kazimierzFolioProductions,
  ...kazimierzOriginalProductions,
} satisfies Record<ProductionId, ProductionContent>;

import type { Production } from './index.ts';

export const folioProductions = {
  'der-ring': { productionId: 'der-ring', sourceKind: 'folio', visual: 'moon' },
  'one-hundred-and-one-days': {
    productionId: 'one-hundred-and-one-days',
    sourceKind: 'folio',
    visual: 'snow',
  },
  'the-carnival': { productionId: 'the-carnival', sourceKind: 'folio', visual: 'masks' },
  'ode-au-triomphe': {
    productionId: 'ode-au-triomphe',
    sourceKind: 'folio',
    visual: 'flame',
  },
} as const satisfies Record<string, Production>;

export type FolioProductionId = keyof typeof folioProductions;

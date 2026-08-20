import type { Production } from './index.ts';

export const originalProductions = {
  uncrowned: { productionId: 'uncrowned', sourceKind: 'original', visual: 'moon' },
  'caged-fire': { productionId: 'caged-fire', sourceKind: 'original', visual: 'flame' },
  'second-snow': { productionId: 'second-snow', sourceKind: 'original', visual: 'snow' },
  'red-banquet': { productionId: 'red-banquet', sourceKind: 'original', visual: 'banquet' },
  'seventh-lantern': {
    productionId: 'seventh-lantern',
    sourceKind: 'original',
    visual: 'lantern',
  },
  'procession-of-masks': {
    productionId: 'procession-of-masks',
    sourceKind: 'original',
    visual: 'masks',
  },
} as const satisfies Record<string, Production>;

export type OriginalProductionId = keyof typeof originalProductions;

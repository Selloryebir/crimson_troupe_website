import type { Production } from './index.ts';

export const originalProductions = {
  uncrowned: { productionId: 'uncrowned', visual: 'moon' },
  'caged-fire': { productionId: 'caged-fire', visual: 'flame' },
  'second-snow': { productionId: 'second-snow', visual: 'snow' },
  'red-banquet': { productionId: 'red-banquet', visual: 'banquet' },
  'seventh-lantern': { productionId: 'seventh-lantern', visual: 'lantern' },
  'procession-of-masks': { productionId: 'procession-of-masks', visual: 'masks' },
} as const satisfies Record<string, Production>;

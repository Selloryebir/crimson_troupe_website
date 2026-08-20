export type ProductionVisual = 'moon' | 'flame' | 'snow' | 'banquet' | 'lantern' | 'masks';

export interface Production {
  productionId: string;
  visual: ProductionVisual;
}

export const productions = {
  uncrowned: { productionId: 'uncrowned', visual: 'moon' },
  'caged-fire': { productionId: 'caged-fire', visual: 'flame' },
  'second-snow': { productionId: 'second-snow', visual: 'snow' },
  'red-banquet': { productionId: 'red-banquet', visual: 'banquet' },
  'seventh-lantern': { productionId: 'seventh-lantern', visual: 'lantern' },
  'procession-of-masks': { productionId: 'procession-of-masks', visual: 'masks' },
} as const satisfies Record<string, Production>;

export type ProductionId = keyof typeof productions;
export const productionEntries = Object.entries(productions) as Array<[ProductionId, Production]>;

export function isProductionId(value: string | undefined): value is ProductionId {
  return value !== undefined && Object.hasOwn(productions, value);
}

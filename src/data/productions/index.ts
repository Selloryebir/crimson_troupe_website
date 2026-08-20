import { originalProductions } from './original.ts';

export type ProductionVisual = 'moon' | 'flame' | 'snow' | 'banquet' | 'lantern' | 'masks';

export interface Production {
  productionId: string;
  visual: ProductionVisual;
}

// Consumers read one registry; source-specific modules remain independently maintainable.
export const productions = {
  ...originalProductions,
} as const satisfies Record<string, Production>;

export type ProductionId = keyof typeof productions;
export const productionEntries = Object.entries(productions) as Array<[ProductionId, Production]>;

export function isProductionId(value: string | undefined): value is ProductionId {
  return value !== undefined && Object.hasOwn(productions, value);
}

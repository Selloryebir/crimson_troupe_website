import { originalProductions } from './original.ts';
import { folioProductions } from './folio.ts';

export type ProductionVisual = 'moon' | 'flame' | 'snow' | 'banquet' | 'lantern' | 'masks';
export type ProductionSourceKind = 'folio' | 'original';

export interface Production {
  productionId: string;
  sourceKind: ProductionSourceKind;
  visual: ProductionVisual;
}

// 消费端只读取统一注册表，各来源模块仍可独立维护。
export const productions = {
  ...folioProductions,
  ...originalProductions,
} as const satisfies Record<string, Production>;

export type ProductionId = keyof typeof productions;
export const productionEntries = Object.entries(productions) as Array<[ProductionId, Production]>;

export function isProductionId(value: string | undefined): value is ProductionId {
  return value !== undefined && Object.hasOwn(productions, value);
}

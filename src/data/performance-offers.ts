import type { TicketOffer, TicketZone } from './performances.ts';
import type { ProductionId } from './productions/index.ts';

export type PriceBand = number | '-';
export type PriceTuple = readonly [PriceBand, PriceBand, PriceBand, PriceBand, PriceBand];

export type ArchiveVenuePricingKey =
  | 'zwillingsturme-mirror-lake-hall'
  | 'londinium-bell-hall'
  | 'montelupe-banquet-hall'
  | 'londinium-main-stage'
  | 'zwillingsturme-golden-hall';

export type PerformanceOfferMatrix = Readonly<
  Partial<Record<ProductionId, Readonly<Partial<Record<ArchiveVenuePricingKey, PriceTuple>>>>>
>;

export const ticketZoneOrder = ['C', 'B', 'A', 'S', 'BOX'] as const satisfies readonly TicketZone[];

export const performanceOfferMatrix = {
  'der-ring': {
    'zwillingsturme-mirror-lake-hall': [160, 280, 450, 720, 1180],
  },
  'one-hundred-and-one-days': {
    'londinium-bell-hall': [150, 260, 430, 690, 1120],
  },
  'the-carnival': {
    'montelupe-banquet-hall': [100, 170, 280, '-', '-'],
    'londinium-main-stage': [130, 220, 360, 560, 920],
  },
  'ode-au-triomphe': {
    'zwillingsturme-golden-hall': [180, 310, 500, 790, 1280],
  },
} as const satisfies PerformanceOfferMatrix;

function assertPriceTuple(tuple: PriceTuple, path: string): void {
  if (tuple.length !== ticketZoneOrder.length) {
    throw new Error(`${path} 必须包含 C、B、A、S、BOX 五个槽位。`);
  }

  let previousPrice = 0;
  let offerCount = 0;
  tuple.forEach((price, index) => {
    if (price === '-') {
      return;
    }
    if (!Number.isSafeInteger(price) || price <= 0) {
      throw new Error(`${path}.${ticketZoneOrder[index]} 必须是正整数或 '-'。`);
    }
    if (price <= previousPrice) {
      throw new Error(`${path} 的有效价格必须按 C、B、A、S、BOX 严格递增。`);
    }
    previousPrice = price;
    offerCount += 1;
  });

  if (offerCount === 0) {
    throw new Error(`${path} 至少需要一个有效分区。`);
  }
}

export function assertPerformanceOfferMatrix(
  matrix: PerformanceOfferMatrix = performanceOfferMatrix,
): void {
  const matrixEntries = Object.entries(matrix) as ReadonlyArray<
    readonly [string, Readonly<Record<string, PriceTuple>>]
  >;
  for (const [productionId, venueOffers] of matrixEntries) {
    for (const [venuePricingKey, tuple] of Object.entries(venueOffers)) {
      assertPriceTuple(tuple, `performanceOffers.${productionId}.${venuePricingKey}`);
    }
  }
}

export function getArchivePerformanceOffers<
  ProductionKey extends keyof typeof performanceOfferMatrix,
  VenueKey extends keyof (typeof performanceOfferMatrix)[ProductionKey],
>(productionId: ProductionKey, venuePricingKey: VenueKey): readonly TicketOffer[] {
  const venueOffers = performanceOfferMatrix[productionId];
  const tuple = venueOffers[venuePricingKey] as PriceTuple | undefined;
  if (!tuple) {
    throw new Error(`缺少里站报价组合：${productionId}.${String(venuePricingKey)}`);
  }
  assertPriceTuple(tuple, `performanceOffers.${productionId}.${String(venuePricingKey)}`);
  return tuple.flatMap((basePrice, index) =>
    basePrice === '-' ? [] : [{ zone: ticketZoneOrder[index], basePrice }],
  );
}

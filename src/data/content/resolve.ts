import { builtEditions, buildContext, editions, type BuiltEdition } from '../editions.ts';
import { locations, type Location, type LocationId } from '../locations.ts';
import {
  performances,
  type Performance,
  type PerformanceId,
  type TicketAvailability,
} from '../performances.ts';
import { productions, type Production, type ProductionId } from '../productions/index.ts';
import type { SiteWorld } from '../site-routes.ts';
import type { BuildContext } from './build-context.ts';
import { assertContentContextEligible } from './eligibility.ts';
import {
  currentRootSet,
  getRootPerformanceIds,
  type ContentRootSet,
  validateContentRootSet,
} from './root-sets.ts';

export interface ContentSnapshot {
  context: BuildContext;
  maturity: 'preview';
  rootSet: ContentRootSet;
  editionIds: readonly BuiltEdition['editionId'][];
  editions: readonly BuiltEdition[];
  performanceEntries: readonly (readonly [PerformanceId, Readonly<Performance>])[];
  performances: Readonly<Partial<Record<PerformanceId, Readonly<Performance>>>>;
  productionEntries: readonly (readonly [ProductionId, Readonly<Production>])[];
  productions: Readonly<Partial<Record<ProductionId, Readonly<Production>>>>;
  locationEntries: readonly (readonly [LocationId, Readonly<Location>])[];
  locations: Readonly<Partial<Record<LocationId, Readonly<Location>>>>;
  featuredPerformanceIds: Readonly<Record<SiteWorld, PerformanceId>>;
}

function cloneTicketAvailability(value: TicketAvailability): TicketAvailability {
  if (value.state !== 'on-sale') {
    return Object.freeze({ ...value });
  }
  return Object.freeze({
    ...value,
    offers: Object.freeze(value.offers.map((offer) => Object.freeze({ ...offer }))),
  });
}

function clonePerformance(value: Performance): Readonly<Performance> {
  const productionIds = Object.freeze([
    value.productionIds[0],
    ...value.productionIds.slice(1),
  ] as const);
  return Object.freeze({
    ...value,
    dateTime: Object.freeze({ ...value.dateTime }),
    productionIds,
    ticketAvailability: cloneTicketAvailability(value.ticketAvailability),
  });
}

function toReadonlyRecord<K extends string, V>(
  entries: readonly (readonly [K, V])[],
): Readonly<Partial<Record<K, V>>> {
  return Object.freeze(Object.fromEntries(entries)) as Readonly<Partial<Record<K, V>>>;
}

export function resolveContent(
  context: BuildContext,
  rootSet: ContentRootSet = currentRootSet,
): ContentSnapshot {
  const knownPerformanceIds = new Set(Object.keys(performances));
  validateContentRootSet(rootSet, knownPerformanceIds);
  assertContentContextEligible(context, rootSet);

  const performanceEntries = getRootPerformanceIds(rootSet).map((performanceId) => {
    const performance = performances[performanceId];
    return Object.freeze([performanceId, clonePerformance(performance)] as const);
  });
  const productionIds = [
    ...new Set(performanceEntries.flatMap(([, performance]) => performance.productionIds)),
  ];
  const locationIds = [
    ...new Set(performanceEntries.map(([, performance]) => performance.locationId)),
  ];
  const productionEntries = productionIds.map((productionId) =>
    Object.freeze([productionId, Object.freeze({ ...productions[productionId] })] as const),
  );
  const locationEntries = locationIds.map((locationId) =>
    Object.freeze([locationId, Object.freeze({ ...locations[locationId] })] as const),
  );
  const snapshotEditions = context.editionIds.map(
    (editionId) => editions[editionId],
  ) as BuiltEdition[];

  return Object.freeze({
    context,
    maturity: 'preview',
    rootSet,
    editionIds: Object.freeze(context.editionIds) as readonly BuiltEdition['editionId'][],
    editions: Object.freeze(snapshotEditions),
    performanceEntries: Object.freeze(performanceEntries),
    performances: toReadonlyRecord(performanceEntries),
    productionEntries: Object.freeze(productionEntries),
    productions: toReadonlyRecord(productionEntries),
    locationEntries: Object.freeze(locationEntries),
    locations: toReadonlyRecord(locationEntries),
    featuredPerformanceIds: Object.freeze({
      front: rootSet.worlds.front.featuredPerformanceId,
      archive: rootSet.worlds.archive.featuredPerformanceId,
    }),
  });
}

export const buildSnapshot = resolveContent(buildContext);

if (buildSnapshot.editions.length !== builtEditions.length) {
  throw new Error('构建国家版本与内容快照不一致。');
}

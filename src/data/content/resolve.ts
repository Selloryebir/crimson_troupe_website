import { builtEditions, buildContext, editions, type BuiltEdition } from '../editions.ts';
import { locations, type Location, type LocationId } from '../locations.ts';
import {
  performances,
  type Performance,
  type PerformanceCollection,
  type PerformanceId,
  type TicketAvailability,
} from '../performances.ts';
import { productions, type Production, type ProductionId } from '../productions/index.ts';
import type { SiteWorld } from '../site-routes.ts';
import { derivePerformanceCollection, getSiteTerraNow } from '../site-time.ts';
import type { BuildContext } from './build-context.ts';
import { assertContentContextEligible } from './eligibility.ts';
import {
  currentRootSet,
  getRootPerformanceIds,
  type ContentRootSet,
  validateContentRootSet,
} from './root-sets.ts';

export interface SnapshotPerformance extends Performance {
  collection: PerformanceCollection;
}

export interface ContentSnapshot {
  context: BuildContext;
  maturity: 'preview';
  rootSet: ContentRootSet;
  editionIds: readonly BuiltEdition['editionId'][];
  editions: readonly BuiltEdition[];
  performanceEntries: readonly (readonly [PerformanceId, Readonly<SnapshotPerformance>])[];
  performances: Readonly<Partial<Record<PerformanceId, Readonly<SnapshotPerformance>>>>;
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
    effectiveDateTime: Object.freeze({ ...value.effectiveDateTime }),
    previousDateTime: value.previousDateTime
      ? Object.freeze({ ...value.previousDateTime })
      : undefined,
    notice: value.notice ? Object.freeze({ ...value.notice }) : undefined,
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
    const clonedPerformance = clonePerformance(performance);
    const collection = derivePerformanceCollection(
      clonedPerformance.effectiveDateTime,
      getSiteTerraNow(clonedPerformance.world, context),
    );
    return Object.freeze([
      performanceId,
      Object.freeze({ ...clonedPerformance, collection }),
    ] as const);
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

export function getWorldPerformanceEntries(
  snapshot: ContentSnapshot,
  world: SiteWorld,
): ContentSnapshot['performanceEntries'] {
  return snapshot.performanceEntries.filter(([, performance]) => performance.world === world);
}

export function getWorldProductionIds(
  snapshot: ContentSnapshot,
  world: SiteWorld,
): readonly ProductionId[] {
  return Object.freeze([
    ...new Set(
      getWorldPerformanceEntries(snapshot, world).flatMap(
        ([, performance]) => performance.productionIds,
      ),
    ),
  ]);
}

export const buildSnapshot = resolveContent(buildContext);

if (buildSnapshot.editions.length !== builtEditions.length) {
  throw new Error('构建国家版本与内容快照不一致。');
}

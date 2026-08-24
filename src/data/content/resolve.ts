import {
  builtEditions,
  buildContext,
  editions,
  type BuildEditionId,
  type BuiltEdition,
  type EditionId,
} from '../editions.ts';
import { archiveProjectionIdentity } from '../archive-pollution.ts';
import { locations, type Location, type LocationId } from '../locations.ts';
import { localizationPackages, type PartialLocalizationPackage } from '../localized/packages.ts';
import type {
  Performance,
  PerformanceCollection,
  PerformanceId,
  TicketAvailability,
} from '../performances.ts';
import { productions, type Production, type ProductionId } from '../productions/index.ts';
import { getRegisteredProductionArtwork, type ProductionArtwork } from '../production-artworks.ts';
import type { SiteWorld } from '../site-routes.ts';
import { derivePerformanceCollection, getSiteTerraNow } from '../site-time.ts';
import {
  getRegisteredTicketSeatingPlan,
  type SeatingPlanDefinition,
  type SeatingPlanId,
} from '../ticket-seating-plans.ts';
import type { BuildContext } from './build-context.ts';
import { assertContentContextEligible } from './eligibility.ts';
import {
  contentRootSets,
  getContentRootSet,
  getRootPerformanceIds,
  type ContentRootSet,
  type ContentRootSetRegistry,
  validateContentRootSet,
} from './root-sets.ts';
import { assertPerformanceVariantComplete } from './validate.ts';
import { getPerformanceVariantUnit, selectCompleteVariant } from './variants.ts';

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
  localizationPackages: Readonly<
    Partial<Record<BuiltEdition['editionId'], PartialLocalizationPackage>>
  >;
  artworkEntries: readonly (readonly [ProductionId, SiteWorld, Readonly<ProductionArtwork>])[];
  artworks: Readonly<
    Partial<Record<ProductionId, Readonly<Partial<Record<SiteWorld, Readonly<ProductionArtwork>>>>>>
  >;
  seatingPlanEntries: readonly (readonly [SeatingPlanId, Readonly<SeatingPlanDefinition>])[];
  seatingPlans: Readonly<Partial<Record<SeatingPlanId, Readonly<SeatingPlanDefinition>>>>;
  featuredPerformanceIds: Readonly<Record<SiteWorld, PerformanceId>>;
  archiveProjectionProductionId: ProductionId;
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

function isRegisteredLocalizationEdition(editionId: EditionId): editionId is BuildEditionId {
  return Object.hasOwn(localizationPackages, editionId);
}

function toArtworkRecord(entries: ContentSnapshot['artworkEntries']): ContentSnapshot['artworks'] {
  const grouped: Partial<
    Record<ProductionId, Partial<Record<SiteWorld, Readonly<ProductionArtwork>>>>
  > = {};
  for (const [productionId, world, artwork] of entries) {
    grouped[productionId] = { ...grouped[productionId], [world]: artwork };
  }
  return Object.freeze(
    Object.fromEntries(
      Object.entries(grouped).map(([productionId, worlds]) => [
        productionId,
        Object.freeze(worlds),
      ]),
    ),
  );
}

export function resolveContent(
  context: BuildContext,
  rootSetRegistry: ContentRootSetRegistry = contentRootSets,
): ContentSnapshot {
  const rootSet = getContentRootSet(context.rootSetId, rootSetRegistry);
  const performanceEntries = getRootPerformanceIds(rootSet).map((performanceId) => {
    const variantUnit = getPerformanceVariantUnit(performanceId);
    if (!variantUnit) {
      throw new Error(`场次 ${performanceId} 缺少持久化内容变体。`);
    }
    const performance = selectCompleteVariant(variantUnit, assertPerformanceVariantComplete).value;
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
  const selectedPerformanceRegistry = Object.fromEntries(performanceEntries);
  validateContentRootSet(rootSet, selectedPerformanceRegistry, productions, context);
  assertContentContextEligible(context, rootSet);

  const productionIds = [
    ...new Set([
      ...performanceEntries.flatMap(([, performance]) => performance.productionIds),
      archiveProjectionIdentity.productionId,
    ]),
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
  const snapshotEditions = context.editionIds.map((editionId) => {
    if (!isRegisteredLocalizationEdition(editionId)) {
      throw new Error(`国家版本 ${String(editionId)} 缺少已注册本地化包。`);
    }
    return editions[editionId];
  });
  const snapshotLocalizationPackages = Object.freeze(
    Object.fromEntries(
      snapshotEditions.map((edition) => [
        edition.editionId,
        localizationPackages[edition.editionId],
      ]),
    ),
  ) as ContentSnapshot['localizationPackages'];
  const artworkKeys = [
    ...new Set([
      ...performanceEntries.flatMap(([, performance]) =>
        performance.productionIds.map((productionId) => `${productionId}:${performance.world}`),
      ),
      `${archiveProjectionIdentity.productionId}:archive`,
    ]),
  ];
  const artworkEntries = artworkKeys.map((key) => {
    const [productionId, world] = key.split(':') as [ProductionId, SiteWorld];
    const artwork = getRegisteredProductionArtwork(productionId, world);
    if (!artwork) {
      throw new Error(`剧目 ${productionId} 缺少 ${world} 规范化封面。`);
    }
    return Object.freeze([productionId, world, Object.freeze(artwork)] as const);
  });
  const seatingPlanIds = [
    ...new Set(
      performanceEntries.flatMap(([, performance]) =>
        performance.ticketAvailability.state === 'on-sale'
          ? [performance.ticketAvailability.seatingPlanId].filter(
              (seatingPlanId): seatingPlanId is SeatingPlanId => Boolean(seatingPlanId),
            )
          : [],
      ),
    ),
  ];
  const seatingPlanEntries = seatingPlanIds.map((seatingPlanId) =>
    Object.freeze([
      seatingPlanId,
      Object.freeze(getRegisteredTicketSeatingPlan(seatingPlanId)),
    ] as const),
  );

  return Object.freeze({
    context,
    maturity: 'preview',
    rootSet,
    editionIds: Object.freeze(context.editionIds),
    editions: Object.freeze(snapshotEditions),
    performanceEntries: Object.freeze(performanceEntries),
    performances: toReadonlyRecord(performanceEntries),
    productionEntries: Object.freeze(productionEntries),
    productions: toReadonlyRecord(productionEntries),
    locationEntries: Object.freeze(locationEntries),
    locations: toReadonlyRecord(locationEntries),
    localizationPackages: snapshotLocalizationPackages,
    artworkEntries: Object.freeze(artworkEntries),
    artworks: toArtworkRecord(artworkEntries),
    seatingPlanEntries: Object.freeze(seatingPlanEntries),
    seatingPlans: toReadonlyRecord(seatingPlanEntries),
    featuredPerformanceIds: Object.freeze({
      front: rootSet.worlds.front.featuredPerformanceId,
      archive: rootSet.worlds.archive.featuredPerformanceId,
    }),
    archiveProjectionProductionId: archiveProjectionIdentity.productionId,
  });
}

export function getSnapshotProductionArtwork(
  snapshot: ContentSnapshot,
  productionId: ProductionId,
  world: SiteWorld,
): Readonly<ProductionArtwork> | undefined {
  return snapshot.artworks[productionId]?.[world];
}

export function getSnapshotSeatingPlan(
  snapshot: ContentSnapshot,
  seatingPlanId: SeatingPlanId,
): Readonly<SeatingPlanDefinition> | undefined {
  return snapshot.seatingPlans[seatingPlanId];
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

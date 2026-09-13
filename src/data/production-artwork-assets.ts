import type { ImageMetadata } from 'astro';
import cagedFireFront from '../assets/images/productions/caged-fire-front.webp';
import derRingArchive from '../assets/images/archive/folio/normal/der-ring.webp';
import frostDeerAndSnowDoeArchive from '../assets/images/archive/folio/normal/frost-deer-and-snow-doe.webp';
import lightOfHeriaArchive from '../assets/images/archive/folio/normal/light-of-heria.webp';
import loneWanderArchive from '../assets/images/archive/folio/normal/lone-wander.webp';
import odeAuTriompheArchive from '../assets/images/archive/folio/normal/ode-au-triomphe.webp';
import oneHundredAndOneDaysArchive from '../assets/images/archive/folio/normal/one-hundred-and-one-days.webp';
import processionOfMasksFront from '../assets/images/productions/procession-of-masks-front.webp';
import redBanquetFront from '../assets/images/productions/red-banquet-front.webp';
import secondSnowFront from '../assets/images/productions/second-snow-front.webp';
import seventhLanternFront from '../assets/images/productions/seventh-lantern-front.webp';
import theCarnivalArchive from '../assets/images/archive/folio/normal/the-carnival.webp';
import uncrownedFront from '../assets/images/productions/uncrowned-front.webp';
import wonderlandInDreamArchive from '../assets/images/archive/folio/normal/wonderland-in-dream.webp';
import type { ContentSnapshot } from './content/resolve.ts';
import type { ProductionId } from './productions/index.ts';
import type { SiteWorld } from './site-routes.ts';

type ProductionArtworkAssetRegistry = Partial<
  Record<ProductionId, Partial<Record<SiteWorld, ImageMetadata>>>
>;

const productionArtworkAssets: ProductionArtworkAssetRegistry = {
  uncrowned: { front: uncrownedFront },
  'caged-fire': { front: cagedFireFront },
  'second-snow': { front: secondSnowFront },
  'red-banquet': { front: redBanquetFront },
  'seventh-lantern': { front: seventhLanternFront },
  'procession-of-masks': { front: processionOfMasksFront },
  'der-ring': { archive: derRingArchive },
  'one-hundred-and-one-days': { archive: oneHundredAndOneDaysArchive },
  'the-carnival': { archive: theCarnivalArchive },
  'ode-au-triomphe': { archive: odeAuTriompheArchive },
  'lone-wander': { archive: loneWanderArchive },
  'wonderland-in-dream': { archive: wonderlandInDreamArchive },
  'frost-deer-and-snow-doe': { archive: frostDeerAndSnowDoeArchive },
  'light-of-heria': { archive: lightOfHeriaArchive },
};

export function getSnapshotProductionArtworkAsset(
  snapshot: ContentSnapshot,
  productionId: ProductionId,
  world: SiteWorld,
): ImageMetadata | undefined {
  if (!snapshot.artworks[productionId]?.[world]) {
    return undefined;
  }
  const source = productionArtworkAssets[productionId]?.[world];
  if (!source) {
    throw new Error(`剧目 ${productionId} 缺少 ${world} 可构建图像。`);
  }
  return source;
}

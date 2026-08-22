import type { ImageMetadata } from 'astro';
import cagedFireFront from '../assets/images/productions/caged-fire-front.webp';
import derRingArchive from '../assets/images/productions/der-ring-archive.webp';
import odeAuTriompheArchive from '../assets/images/productions/ode-au-triomphe-archive.webp';
import oneHundredAndOneDaysArchive from '../assets/images/productions/one-hundred-and-one-days-archive.webp';
import secondSnowFront from '../assets/images/productions/second-snow-front.webp';
import theCarnivalArchive from '../assets/images/productions/the-carnival-archive.webp';
import uncrownedFront from '../assets/images/productions/uncrowned-front.webp';
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
  'der-ring': { archive: derRingArchive },
  'one-hundred-and-one-days': { archive: oneHundredAndOneDaysArchive },
  'the-carnival': { archive: theCarnivalArchive },
  'ode-au-triomphe': { archive: odeAuTriompheArchive },
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

import type { ImageMetadata } from 'astro';
import derRingArchive from '../assets/images/productions/der-ring-archive.webp';
import type { ProductionId } from './productions/index.ts';
import type { SiteWorld } from './site-routes.ts';

export interface ProductionArtwork {
  source: ImageMetadata;
  focalPoint: `${number}% ${number}%`;
  safeCrop: 'portrait-center';
  memoryColor: `#${string}`;
  altIntent: 'decorative-production-art';
  pollution: {
    misregisterLayer: 'lake-gold';
    darkenZones: readonly ['top', 'sides'];
    breachEdge: 'lower-right';
  };
  rights: 'project-generated-art-00';
}

type ProductionArtworkRegistry = Partial<
  Record<ProductionId, Partial<Record<SiteWorld, ProductionArtwork>>>
>;

const productionArtworkRegistry: ProductionArtworkRegistry = {
  'der-ring': {
    archive: {
      source: derRingArchive,
      focalPoint: '50% 64%',
      safeCrop: 'portrait-center',
      memoryColor: '#1f666c',
      altIntent: 'decorative-production-art',
      pollution: {
        misregisterLayer: 'lake-gold',
        darkenZones: ['top', 'sides'],
        breachEdge: 'lower-right',
      },
      rights: 'project-generated-art-00',
    },
  },
};

export function getProductionArtwork(
  productionId: ProductionId,
  world: SiteWorld,
): ProductionArtwork | undefined {
  return productionArtworkRegistry[productionId]?.[world];
}

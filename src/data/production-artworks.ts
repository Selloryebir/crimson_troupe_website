import type { ImageMetadata } from 'astro';
import cagedFireFront from '../assets/images/productions/caged-fire-front.webp';
import derRingArchive from '../assets/images/productions/der-ring-archive.webp';
import secondSnowFront from '../assets/images/productions/second-snow-front.webp';
import uncrownedFront from '../assets/images/productions/uncrowned-front.webp';
import type { ProductionId } from './productions/index.ts';
import type { SiteWorld } from './site-routes.ts';

export interface ProductionArtwork {
  source: ImageMetadata;
  focalPoint: `${number}% ${number}%`;
  safeCrop: 'portrait-center';
  memoryColor: `#${string}`;
  altIntent: 'decorative-production-art';
  pollution: {
    misregisterLayer: string;
    darkenZones: ReadonlyArray<'top' | 'sides' | 'lower' | 'corners'>;
    breachEdge: 'lower-right' | 'upper-center' | 'side-seam';
  };
  rights: 'project-generated-art-00' | 'project-generated-code-03';
}

type ProductionArtworkRegistry = Partial<
  Record<ProductionId, Partial<Record<SiteWorld, ProductionArtwork>>>
>;

const productionArtworkRegistry: ProductionArtworkRegistry = {
  uncrowned: {
    front: {
      source: uncrownedFront,
      focalPoint: '50% 59%',
      safeCrop: 'portrait-center',
      memoryColor: '#b7c2c8',
      altIntent: 'decorative-production-art',
      pollution: {
        misregisterLayer: 'cold-silver-beam',
        darkenZones: ['top', 'sides'],
        breachEdge: 'upper-center',
      },
      rights: 'project-generated-code-03',
    },
  },
  'caged-fire': {
    front: {
      source: cagedFireFront,
      focalPoint: '50% 62%',
      safeCrop: 'portrait-center',
      memoryColor: '#d8994d',
      altIntent: 'decorative-production-art',
      pollution: {
        misregisterLayer: 'amber-voice',
        darkenZones: ['sides', 'lower'],
        breachEdge: 'upper-center',
      },
      rights: 'project-generated-code-03',
    },
  },
  'second-snow': {
    front: {
      source: secondSnowFront,
      focalPoint: '50% 52%',
      safeCrop: 'portrait-center',
      memoryColor: '#d3a7b4',
      altIntent: 'decorative-production-art',
      pollution: {
        misregisterLayer: 'mauve-horizon',
        darkenZones: ['top', 'corners'],
        breachEdge: 'side-seam',
      },
      rights: 'project-generated-code-03',
    },
  },
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

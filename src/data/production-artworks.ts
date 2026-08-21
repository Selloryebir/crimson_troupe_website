import type { ImageMetadata } from 'astro';
import cagedFireFront from '../assets/images/productions/caged-fire-front.webp';
import derRingArchive from '../assets/images/productions/der-ring-archive.webp';
import odeAuTriompheArchive from '../assets/images/productions/ode-au-triomphe-archive.webp';
import oneHundredAndOneDaysArchive from '../assets/images/productions/one-hundred-and-one-days-archive.webp';
import secondSnowFront from '../assets/images/productions/second-snow-front.webp';
import theCarnivalArchive from '../assets/images/productions/the-carnival-archive.webp';
import uncrownedFront from '../assets/images/productions/uncrowned-front.webp';
import { buildSnapshot, type ContentSnapshot } from './content/resolve.ts';
import type { ProductionId } from './productions/index.ts';
import type { SiteWorld } from './site-routes.ts';

export interface ProductionArtwork {
  source: ImageMetadata;
  focalPoint: `${number}% ${number}%`;
  safeCrop: 'portrait-center';
  memoryColor: `#${string}`;
  titleTone: 'light' | 'dark';
  altIntent: 'decorative-production-art';
  pollution: {
    misregisterLayer: string;
    darkenZones: ReadonlyArray<'top' | 'sides' | 'lower' | 'corners'>;
    breachEdge: 'lower-right' | 'upper-center' | 'side-seam';
  };
  rights: 'project-generated-art-00' | 'project-generated-code-03' | 'project-generated-code-04';
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
      titleTone: 'light',
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
      titleTone: 'light',
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
      titleTone: 'light',
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
      titleTone: 'dark',
      altIntent: 'decorative-production-art',
      pollution: {
        misregisterLayer: 'lake-gold',
        darkenZones: ['top', 'sides'],
        breachEdge: 'lower-right',
      },
      rights: 'project-generated-code-04',
    },
  },
  'one-hundred-and-one-days': {
    archive: {
      source: oneHundredAndOneDaysArchive,
      focalPoint: '50% 48%',
      safeCrop: 'portrait-center',
      memoryColor: '#d28747',
      titleTone: 'light',
      altIntent: 'decorative-production-art',
      pollution: {
        misregisterLayer: 'dusk-orange-fracture',
        darkenZones: ['sides', 'lower'],
        breachEdge: 'side-seam',
      },
      rights: 'project-generated-code-04',
    },
  },
  'the-carnival': {
    archive: {
      source: theCarnivalArchive,
      focalPoint: '50% 51%',
      safeCrop: 'portrait-center',
      memoryColor: '#df9d42',
      titleTone: 'light',
      altIntent: 'decorative-production-art',
      pollution: {
        misregisterLayer: 'ember-procession',
        darkenZones: ['top', 'sides'],
        breachEdge: 'upper-center',
      },
      rights: 'project-generated-code-04',
    },
  },
  'ode-au-triomphe': {
    archive: {
      source: odeAuTriompheArchive,
      focalPoint: '50% 47%',
      safeCrop: 'portrait-center',
      memoryColor: '#214b8d',
      titleTone: 'light',
      altIntent: 'decorative-production-art',
      pollution: {
        misregisterLayer: 'cobalt-gold-axis',
        darkenZones: ['corners', 'lower'],
        breachEdge: 'upper-center',
      },
      rights: 'project-generated-code-04',
    },
  },
};

export function getProductionArtwork(
  productionId: ProductionId,
  world: SiteWorld,
  snapshot: ContentSnapshot = buildSnapshot,
): ProductionArtwork | undefined {
  if (!snapshot.productions[productionId]) {
    return undefined;
  }
  return productionArtworkRegistry[productionId]?.[world];
}

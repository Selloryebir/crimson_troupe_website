import {
  productionArtworkManifest,
  type ProductionArtworkManifestEntry,
} from './production-artwork-manifest.ts';
import type { ProductionId } from './productions/index.ts';
import type { SiteWorld } from './site-routes.ts';

export interface ProductionArtwork extends ProductionArtworkManifestEntry {
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
}

export type ProductionArtworkRegistry = Partial<
  Record<ProductionId, Partial<Record<SiteWorld, ProductionArtwork>>>
>;

function requireArtworkManifest(
  productionId: ProductionId,
  world: SiteWorld,
): ProductionArtworkManifestEntry {
  const entry = productionArtworkManifest[productionId]?.[world];
  if (!entry) {
    throw new Error(`剧目 ${productionId} 缺少 ${world} 素材清单。`);
  }
  return entry;
}

export const productionArtworkRegistry: ProductionArtworkRegistry = {
  uncrowned: {
    front: {
      ...requireArtworkManifest('uncrowned', 'front'),
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
    },
  },
  'caged-fire': {
    front: {
      ...requireArtworkManifest('caged-fire', 'front'),
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
    },
  },
  'second-snow': {
    front: {
      ...requireArtworkManifest('second-snow', 'front'),
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
    },
  },
  'der-ring': {
    archive: {
      ...requireArtworkManifest('der-ring', 'archive'),
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
    },
  },
  'one-hundred-and-one-days': {
    archive: {
      ...requireArtworkManifest('one-hundred-and-one-days', 'archive'),
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
    },
  },
  'the-carnival': {
    archive: {
      ...requireArtworkManifest('the-carnival', 'archive'),
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
    },
  },
  'ode-au-triomphe': {
    archive: {
      ...requireArtworkManifest('ode-au-triomphe', 'archive'),
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
    },
  },
};

export function getRegisteredProductionArtwork(
  productionId: ProductionId,
  world: SiteWorld,
): ProductionArtwork | undefined {
  return productionArtworkRegistry[productionId]?.[world];
}

import type { ProductionId } from './productions/index.ts';
import type { SiteWorld } from './site-routes.ts';

export interface ProductionArtworkManifestEntry {
  assetPath: `src/assets/${string}`;
  sourceRevision: `sha256:${string}`;
  rights: 'project-generated-art-00' | 'project-generated-code-03' | 'project-generated-code-04';
}

export type ProductionArtworkManifest = Partial<
  Record<ProductionId, Partial<Record<SiteWorld, ProductionArtworkManifestEntry>>>
>;

export const productionArtworkManifest: ProductionArtworkManifest = {
  uncrowned: {
    front: {
      assetPath: 'src/assets/images/productions/uncrowned-front.webp',
      sourceRevision: 'sha256:9883197201b0be80538fa814001fc5a8ac59f0c4997b9a21660902fcbacfe4f6',
      rights: 'project-generated-code-03',
    },
  },
  'caged-fire': {
    front: {
      assetPath: 'src/assets/images/productions/caged-fire-front.webp',
      sourceRevision: 'sha256:db036bf7c0be50ef6f3d73bfe9cbef17740ecd0b2186e154091ca8843b4d4047',
      rights: 'project-generated-code-03',
    },
  },
  'second-snow': {
    front: {
      assetPath: 'src/assets/images/productions/second-snow-front.webp',
      sourceRevision: 'sha256:0c74e2eefbaed1e97563cfe101cbeb3372aeae654e11a7254bd1fc805f3932b7',
      rights: 'project-generated-code-03',
    },
  },
  'der-ring': {
    archive: {
      assetPath: 'src/assets/images/productions/der-ring-archive.webp',
      sourceRevision: 'sha256:c5185db9ba4fc46cef6b9ad5b510805788a09583a113fc15d6812bf244f2cef2',
      rights: 'project-generated-code-04',
    },
  },
  'one-hundred-and-one-days': {
    archive: {
      assetPath: 'src/assets/images/productions/one-hundred-and-one-days-archive.webp',
      sourceRevision: 'sha256:cc91c15cab40099907b53becbf00a6be428b9d93f44ee0f3b2f64dd32541e1a2',
      rights: 'project-generated-code-04',
    },
  },
  'the-carnival': {
    archive: {
      assetPath: 'src/assets/images/productions/the-carnival-archive.webp',
      sourceRevision: 'sha256:074e7e68207d78e80661a8296d954c142ea6726569390967472d5d80fe21072f',
      rights: 'project-generated-code-04',
    },
  },
  'ode-au-triomphe': {
    archive: {
      assetPath: 'src/assets/images/productions/ode-au-triomphe-archive.webp',
      sourceRevision: 'sha256:3445bf769727d4aedbf38248b77ab5c224a31e0fac4e197be64f33d551105276',
      rights: 'project-generated-code-04',
    },
  },
};

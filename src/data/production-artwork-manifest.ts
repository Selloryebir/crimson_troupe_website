import type { ProductionId } from './productions/index.ts';
import type { SiteWorld } from './site-routes.ts';

export interface ProductionArtworkManifestEntry {
  assetPath: `src/assets/${string}`;
  sourceRevision: `sha256:${string}`;
  rights:
    | 'project-generated-art-00'
    | 'project-generated-art-01'
    | 'project-generated-code-03'
    | 'project-generated-code-04';
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
  'red-banquet': {
    front: {
      assetPath: 'src/assets/images/productions/red-banquet-front.webp',
      sourceRevision: 'sha256:63f274a71699f141f5ea8e03aa53511c1b2e6071c051b5d25ff00d4630ccf23f',
      rights: 'project-generated-art-01',
    },
  },
  'seventh-lantern': {
    front: {
      assetPath: 'src/assets/images/productions/seventh-lantern-front.webp',
      sourceRevision: 'sha256:1b053f3910729537c11eb0a322baec4e7122e37bdb0c600ad23a92383c57d71e',
      rights: 'project-generated-art-01',
    },
  },
  'procession-of-masks': {
    front: {
      assetPath: 'src/assets/images/productions/procession-of-masks-front.webp',
      sourceRevision: 'sha256:3ac7a8fa6c46ff1ace39bfeab980355d899d03cd0a7537b3f74b8d64e8f1f619',
      rights: 'project-generated-art-01',
    },
  },
  'lone-wander': {
    archive: {
      assetPath: 'src/assets/images/productions/lone-wander-archive.webp',
      sourceRevision: 'sha256:842575d06b1219a5c7f7638ae0bebedeb6924dee8a992cb9b37b913b2715ace3',
      rights: 'project-generated-art-01',
    },
  },
  'wonderland-in-dream': {
    archive: {
      assetPath: 'src/assets/images/productions/wonderland-in-dream-archive.webp',
      sourceRevision: 'sha256:bf3bd0024c019c3ed2feccef7ee79da1bf16754cc05bd7ac353c97d1884097c2',
      rights: 'project-generated-art-01',
    },
  },
  'frost-deer-and-snow-doe': {
    archive: {
      assetPath: 'src/assets/images/productions/frost-deer-and-snow-doe-archive.webp',
      sourceRevision: 'sha256:623f067c767bc2ec67182a680c7e13a3f3c9431e6d5ebb5426820bc816feee7c',
      rights: 'project-generated-art-01',
    },
  },
  'light-of-heria': {
    archive: {
      assetPath: 'src/assets/images/productions/light-of-heria-archive.webp',
      sourceRevision: 'sha256:e90aa6e3ac771b6c20272b9068ff9f21e6b4675279b595c18c68bb9873f42e0c',
      rights: 'project-generated-art-01',
    },
  },
};

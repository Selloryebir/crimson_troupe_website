import type { ProductionId } from './productions/index.ts';
import type { SiteWorld } from './site-routes.ts';

export interface ProductionArtworkManifestEntry {
  assetPath: `src/assets/${string}`;
  sourceRevision: `sha256:${string}`;
  rights:
    | 'project-generated-art-00'
    | 'project-generated-art-01'
    | 'project-generated-code-03'
    | 'project-generated-code-04'
    | 'local-folio-restoration-preview';
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
      assetPath: 'src/assets/images/folio/normal/der-ring.webp',
      sourceRevision: 'sha256:99a76a607f2350e0f420af2944c46196d0e694a0cd1d2324e2eacd1224de2de1',
      rights: 'local-folio-restoration-preview',
    },
  },
  'one-hundred-and-one-days': {
    archive: {
      assetPath: 'src/assets/images/folio/normal/one-hundred-and-one-days.webp',
      sourceRevision: 'sha256:a2a11b87aac282f9beb66b3fea54552a2cf0ecb8921fc406d0f96df860261f73',
      rights: 'local-folio-restoration-preview',
    },
  },
  'the-carnival': {
    archive: {
      assetPath: 'src/assets/images/folio/normal/the-carnival.webp',
      sourceRevision: 'sha256:3c50ab6a1dd782bcc95bdcaff8939268960964dca767331c98c9292e2d64ae6d',
      rights: 'local-folio-restoration-preview',
    },
  },
  'ode-au-triomphe': {
    archive: {
      assetPath: 'src/assets/images/folio/normal/ode-au-triomphe.webp',
      sourceRevision: 'sha256:b29f12742735a873e0adb4ce53e682ea6b80066a56a153181caae3caefb7921e',
      rights: 'local-folio-restoration-preview',
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
      assetPath: 'src/assets/images/folio/normal/lone-wander.webp',
      sourceRevision: 'sha256:5c18e4063bd2d1b066e0806d2d66ba4ec3a6ed765b17c9ba0b6035ece2ae5730',
      rights: 'local-folio-restoration-preview',
    },
  },
  'wonderland-in-dream': {
    archive: {
      assetPath: 'src/assets/images/folio/normal/wonderland-in-dream.webp',
      sourceRevision: 'sha256:b6b4075c806e07fa09c1be8c31445e6664403df387d910291bd57081f97a2c88',
      rights: 'local-folio-restoration-preview',
    },
  },
  'frost-deer-and-snow-doe': {
    archive: {
      assetPath: 'src/assets/images/folio/normal/frost-deer-and-snow-doe.webp',
      sourceRevision: 'sha256:6ae2e6f769a453b72388676cf0a6c92db2ef4ba5147fa5c663f46b7d443deefe',
      rights: 'local-folio-restoration-preview',
    },
  },
  'light-of-heria': {
    archive: {
      assetPath: 'src/assets/images/folio/normal/light-of-heria.webp',
      sourceRevision: 'sha256:d8a408ef2fc76af692a7f2e0feccbf870f4c7ac3cb9028253c80a9cd8e32efb8',
      rights: 'local-folio-restoration-preview',
    },
  },
};

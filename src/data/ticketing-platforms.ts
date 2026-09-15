export type TicketingPlatformId = 'rice-network' | 'drop-tower';
export type TicketingPlatformLogoAssetId = 'rice-network-logo' | 'drop-tower-logo';

export interface TicketingPlatformDefinition {
  platformId: TicketingPlatformId;
  role: 'official-partner' | 'resale-channel';
  logo: {
    assetId: TicketingPlatformLogoAssetId;
    assetPath: `src/assets/${string}`;
    sourceRevision: `sha256:${string}`;
    maturity: 'preview' | 'formal';
    approvalStatus: 'preview-only' | 'approved';
    rights: 'project-original';
  };
}

export const ticketingPlatformIds = ['rice-network', 'drop-tower'] as const;

export const ticketingPlatforms = Object.freeze({
  'rice-network': Object.freeze({
    platformId: 'rice-network',
    role: 'official-partner',
    logo: Object.freeze({
      assetId: 'rice-network-logo',
      assetPath: 'src/assets/ticketing/rice-network.svg',
      sourceRevision: 'sha256:e18b12d8e1d31ed36d517c0569b52742defc0133aedeb31288e39cb440e5541a',
      maturity: 'formal',
      approvalStatus: 'approved',
      rights: 'project-original',
    }),
  }),
  'drop-tower': Object.freeze({
    platformId: 'drop-tower',
    role: 'resale-channel',
    logo: Object.freeze({
      assetId: 'drop-tower-logo',
      assetPath: 'src/assets/ticketing/drop-tower.svg',
      sourceRevision: 'sha256:497df703d070a024e44e43a95cb4838bea8d34a6328825b2e6684a5aec642dae',
      maturity: 'formal',
      approvalStatus: 'approved',
      rights: 'project-original',
    }),
  }),
}) satisfies Readonly<Record<TicketingPlatformId, TicketingPlatformDefinition>>;

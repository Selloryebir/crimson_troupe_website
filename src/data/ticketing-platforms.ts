export type TicketingPlatformId = 'rice-network' | 'drop-tower';
export type TicketingPlatformLogoAssetId = 'rice-network-preview-logo' | 'drop-tower-preview-logo';

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
      assetId: 'rice-network-preview-logo',
      assetPath: 'src/assets/ticketing/rice-network-preview.svg',
      sourceRevision: 'sha256:397203ac973b7f341471c536c78f906495f2789a87d8f4f592fe210baffd0c5b',
      maturity: 'preview',
      approvalStatus: 'preview-only',
      rights: 'project-original',
    }),
  }),
  'drop-tower': Object.freeze({
    platformId: 'drop-tower',
    role: 'resale-channel',
    logo: Object.freeze({
      assetId: 'drop-tower-preview-logo',
      assetPath: 'src/assets/ticketing/drop-tower-preview.svg',
      sourceRevision: 'sha256:7caa700377b1554b94374eb2831dbc7783398f758b77389a1aab47a10618e710',
      maturity: 'preview',
      approvalStatus: 'preview-only',
      rights: 'project-original',
    }),
  }),
}) satisfies Readonly<Record<TicketingPlatformId, TicketingPlatformDefinition>>;

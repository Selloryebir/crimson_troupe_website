import dropTowerPreviewLogo from '../assets/ticketing/drop-tower-preview.svg';
import riceNetworkPreviewLogo from '../assets/ticketing/rice-network-preview.svg';
import type { TicketingPlatformLogoAssetId } from './ticketing-platforms.ts';

const ticketingPlatformLogoAssets = Object.freeze({
  'rice-network-preview-logo': riceNetworkPreviewLogo,
  'drop-tower-preview-logo': dropTowerPreviewLogo,
}) satisfies Readonly<Record<TicketingPlatformLogoAssetId, ImageMetadata>>;

export function getTicketingPlatformLogoAsset(
  assetId: TicketingPlatformLogoAssetId,
): ImageMetadata {
  return ticketingPlatformLogoAssets[assetId];
}

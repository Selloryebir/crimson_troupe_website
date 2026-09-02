import dropTowerLogo from '../assets/ticketing/drop-tower.svg';
import riceNetworkLogo from '../assets/ticketing/rice-network.svg';
import type { TicketingPlatformLogoAssetId } from './ticketing-platforms.ts';

const ticketingPlatformLogoAssets = Object.freeze({
  'rice-network-logo': riceNetworkLogo,
  'drop-tower-logo': dropTowerLogo,
}) satisfies Readonly<Record<TicketingPlatformLogoAssetId, ImageMetadata>>;

export function getTicketingPlatformLogoAsset(
  assetId: TicketingPlatformLogoAssetId,
): ImageMetadata {
  return ticketingPlatformLogoAssets[assetId];
}

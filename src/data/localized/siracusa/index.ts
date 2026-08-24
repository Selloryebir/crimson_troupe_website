import type { WebsiteLocalizationAuthoringPackage } from '../yan/index.ts';
import { siracusaArchiveProjection } from './archive-projection.ts';
import { siracusaMessages, siracusaTicketingPlatforms } from './messages.ts';
import { siracusaPrograms } from './programs.ts';
import { siracusaProductions } from './productions/index.ts';
import { siracusaSite } from './site.ts';

export const siracusaLocalizationPackage = {
  site: siracusaSite,
  programs: { ...siracusaPrograms, productions: siracusaProductions },
  messages: siracusaMessages,
  platforms: siracusaTicketingPlatforms,
  archiveProjection: siracusaArchiveProjection,
} satisfies WebsiteLocalizationAuthoringPackage;

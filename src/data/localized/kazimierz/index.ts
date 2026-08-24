import type { WebsiteLocalizationAuthoringPackage } from '../yan/index.ts';
import { kazimierzArchiveProjection } from './archive-projection.ts';
import { kazimierzMessages, kazimierzTicketingPlatforms } from './messages.ts';
import { kazimierzPrograms } from './programs.ts';
import { kazimierzProductions } from './productions/index.ts';
import { kazimierzSite } from './site.ts';

export const kazimierzLocalizationPackage = {
  site: kazimierzSite,
  programs: { ...kazimierzPrograms, productions: kazimierzProductions },
  messages: kazimierzMessages,
  platforms: kazimierzTicketingPlatforms,
  archiveProjection: kazimierzArchiveProjection,
} satisfies WebsiteLocalizationAuthoringPackage;

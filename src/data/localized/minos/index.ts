import type { WebsiteLocalizationAuthoringPackage } from '../yan/index.ts';
import { minosArchiveProjection } from './archive-projection.ts';
import { minosMessages, minosTicketingPlatforms } from './messages.ts';
import { minosPrograms } from './programs.ts';
import { minosProductions } from './productions/index.ts';
import { minosSite } from './site.ts';

export const minosLocalizationPackage = {
  site: minosSite,
  programs: { ...minosPrograms, productions: minosProductions },
  messages: minosMessages,
  platforms: minosTicketingPlatforms,
  archiveProjection: minosArchiveProjection,
} satisfies WebsiteLocalizationAuthoringPackage;

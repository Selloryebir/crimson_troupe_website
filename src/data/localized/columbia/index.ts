import type { WebsiteLocalizationAuthoringPackage } from '../yan/index.ts';
import { columbiaArchiveProjection } from './archive-projection.ts';
import { columbiaMessages, columbiaTicketingPlatforms } from './messages.ts';
import { columbiaPrograms } from './programs.ts';
import { columbiaProductions } from './productions/index.ts';
import { columbiaSite } from './site.ts';

export const columbiaLocalizationPackage = {
  site: columbiaSite,
  programs: { ...columbiaPrograms, productions: columbiaProductions },
  messages: columbiaMessages,
  platforms: columbiaTicketingPlatforms,
  archiveProjection: columbiaArchiveProjection,
} satisfies WebsiteLocalizationAuthoringPackage;

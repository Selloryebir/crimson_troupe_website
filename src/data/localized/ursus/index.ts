import type { WebsiteLocalizationAuthoringPackage } from '../yan/index.ts';
import { ursusArchiveProjection } from './archive-projection.ts';
import { ursusMessages, ursusTicketingPlatforms } from './messages.ts';
import { ursusPrograms } from './programs.ts';
import { ursusProductions } from './productions/index.ts';
import { ursusSite } from './site.ts';

export const ursusLocalizationPackage = {
  site: ursusSite,
  programs: { ...ursusPrograms, productions: ursusProductions },
  messages: ursusMessages,
  platforms: ursusTicketingPlatforms,
  archiveProjection: ursusArchiveProjection,
} satisfies WebsiteLocalizationAuthoringPackage;
